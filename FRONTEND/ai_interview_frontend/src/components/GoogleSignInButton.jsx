import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function GoogleSignInButton({ buttonText = "signin_with" }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setMessage("Google did not return a credential.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            credential: credentialResponse.credential
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }

      // Prototype only: store the app token for now.
      // For production, prefer a secure, HttpOnly cookie.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`Welcome, ${data.user.name || data.user.email}!`);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setMessage(error.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setMessage("Google sign-in was unsuccessful.")}
        text={buttonText}
        shape="rectangular"
        theme="outline"
        size="large"
      />

      {loading && (
        <p className="text-sm text-gray-400">
          Verifying your Google account...
        </p>
      )}

      {message && (
        <p role="status" className="text-sm text-center text-blue-400">
          {message}
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
