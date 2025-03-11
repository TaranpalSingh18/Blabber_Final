import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before new attempt

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      console.log("Signup Response:", res.data); // Debugging

      if (res.status === 201) {
        navigate("/dashboard"); // ✅ Redirect only on success
      } else {
        setError(res.data.message || "Signup failed, try again.");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      setError(error.response?.data?.message || "Signup failed, try again.");
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">blabber</h1>
          <h2 className="text-2xl font-bold mb-2">Never used Blabber before?</h2>
          <p className="text-emerald-400">Sign Up ASAP</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Choose a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-emerald-400 text-black rounded-lg py-3 font-semibold hover:bg-emerald-500 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
