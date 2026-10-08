import { Link } from "react-router-dom";

function Login() {
  const handleLogin = (e) => {
    e.preventDefault();

    // Backend connection will be added later
    console.log("Login submitted");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2">
            Login to your AI Interview Platform
          </p>
        </div>


        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white 
                         placeholder-gray-400 outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white 
                         placeholder-gray-400 outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 
                       text-white font-semibold py-3 rounded-lg 
                       transition"
          >
            Login
          </button>

        </form>


        {/* Signup Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;