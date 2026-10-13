
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Interview() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [experience, setExperience] = useState("Fresher");
  const [role, setRole] = useState("Software Engineer");
  const [interviewType, setInterviewType] = useState("Technical");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [questions, setQuestions] = useState([]);

  const sampleQuestions = [
    "Tell me about yourself and your technical background.",
    "Explain the difference between let, const, and var in JavaScript.",
    "What is the difference between an array and an object?",
    "Explain how React components and props work.",
    "What is the time complexity of binary search?"
  ];

  const startInterview = () => {
    const selectedQuestions = sampleQuestions.slice(
      0,
      Math.min(Number(numberOfQuestions), sampleQuestions.length)
    );

    setQuestions(selectedQuestions);
    setAnswers(Array(selectedQuestions.length).fill(""));
    setCurrentQuestion(0);
    setAnswer("");
    setStarted(true);
  };

  const saveAnswer = () => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = answer;
      return updated;
    });
  };

  const goToQuestion = (index) => {
    saveAnswer();
    setAnswer(answers[index] || "");
    setCurrentQuestion(index);
  };

  const finishInterview = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;

    const interviewQuestions = questions.map((question, index) => ({
      question,
      answer: updatedAnswers[index] || "",
      feedback: "",
      score: null
    }));

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !userData?.id) {
        alert("Please sign in with Google before saving your interview.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userData.id,
          experience,
          role,
          interviewType,
          numberOfQuestions: questions.length,
          questions: interviewQuestions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save interview.");
      }

      alert("Interview completed and saved successfully!");
      setStarted(false);
    } catch (error) {
      console.error("Save interview error:", error);
      alert(error.message || "Could not connect to the backend.");
    }
  };

  const progress = questions.length
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <button
          onClick={() => navigate("/login")}
          className="text-xl font-bold tracking-tight text-cyan-400"
        >
          AI Interview
        </button>

        <button
          onClick={() => navigate("/login")}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
        >
          Exit
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">
        {!started ? (
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Interview preparation
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Build your interview confidence.
            </h1>

            <p className="mt-3 leading-7 text-slate-400">
              Customize your practice session and answer interview questions
              at your own pace.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Experience level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option>Fresher</option>
                  <option>0–2 years</option>
                  <option>3–5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Target role
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Interview type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Behavioral</option>
                  <option>Mixed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Number of questions
                </label>
                <select
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option value={3}>3 questions</option>
                  <option value={5}>5 questions</option>
                </select>
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={!role.trim()}
              className="mt-8 w-full rounded-xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start Interview →
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Practice questions are sample questions for now.
            </p>
          </section>
        ) : (
          <section>
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-400">{role}</p>
                <h1 className="mt-1 text-2xl font-bold">
                  Interview in progress
                </h1>
              </div>

              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Question {String(currentQuestion + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-5 text-2xl font-semibold leading-relaxed md:text-3xl">
                {questions[currentQuestion]}
              </h2>

              <label className="mb-3 mt-8 block text-sm text-slate-300">
                Your answer
              </label>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Structure your thoughts and write your answer here..."
                rows={8}
                className="w-full resize-y rounded-2xl border border-white/10 bg-slate-950 p-5 leading-7 outline-none focus:border-cyan-400"
              />

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => goToQuestion(currentQuestion - 1)}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => goToQuestion(currentQuestion + 1)}
                    className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Next question →
                  </button>
                ) : (
                  <button
                    onClick={finishInterview}
                    className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
                  >
                    Finish interview ✓
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`h-10 w-10 rounded-xl text-sm font-semibold ${
                    currentQuestion === index
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Interview;
