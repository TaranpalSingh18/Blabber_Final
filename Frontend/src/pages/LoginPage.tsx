import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before new attempt
  
    try {
      // Send login request to backend
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
  
      console.log("Login Response:", res.data); // Debugging log
  
      // ✅ Fix: Check if the response message is "Login successful"
      if (res.data.message === "Login successful") {
        // Store userId in local storage
        localStorage.setItem("userId", res.data.userId);
        
        console.log("✅ Login Successful, Redirecting...");
        navigate("/dashboard"); // Redirect on success
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("❌ Login Error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Login failed, try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">blabber</h1>
          <h2 className="text-2xl font-bold mb-2">Log In to Your Account</h2>
          <p className="text-emerald-400">Catch up with your online buddies!</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black rounded-lg py-3 mb-4 flex items-center justify-center space-x-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or Sign In with Email</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-emerald-400 text-black rounded-lg py-3 font-semibold hover:bg-emerald-500 transition-colors"
              >
                Log In
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;