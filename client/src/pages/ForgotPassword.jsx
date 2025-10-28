import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Loader } from 'lucide-react'; // Added icons for aesthetics

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Utility to handle exponential backoff for retries
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const maxRetries = 3;
    let success = false;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setIsLoading(true);
        // The endpoint is crucial: /api/user/forgot-password
        const { data } = await axios.post("/api/user/forgot-password", { email });

        if (data.success) {
          toast.success("Reset link sent to your email! Redirecting to login...");
          success = true;
          break; // Exit loop on success
        } else {
          toast.error(data.message || "Failed to send reset link.");
        }
      } catch (error) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          // console.log(`Attempt ${attempt} failed. Retrying in ${delay / 1000}s...`);
          await sleep(delay);
        } else {
          toast.error("Error sending reset link. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (success) {
      // Navigate after a short delay so the user can read the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl border border-gray-100 p-8 rounded-2xl w-full max-w-sm transform transition duration-500 hover:scale-[1.01]"
      >
        <div className="flex justify-center mb-6">
            <Mail className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center">
          Enter your email to receive a secure link to reset your password.
        </p>
        <div className="mb-6">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="border border-gray-300 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-primary/50 transition duration-150"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin w-5 h-5" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
            Remember your password? 
            <span 
                onClick={() => navigate('/login')}
                className="text-primary cursor-pointer hover:underline font-medium ml-1"
            >
                Back to Login
            </span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
