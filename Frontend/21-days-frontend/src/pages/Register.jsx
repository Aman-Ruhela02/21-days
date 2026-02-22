import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import axios from "axios"

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post(
      "https://two1-days-rlrw.onrender.com/api/auth/register",
      form
    );

    // ✅ IMPORTANT: verify token exists
    if (!res.data.token) {
      throw new Error("Token not received");
    }

    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message || "Registration failed");
  }
};




  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">21 Days</h1>
        <p className="text-center text-gray-500 mb-8">Build discipline and transform your life in 21 days</p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
