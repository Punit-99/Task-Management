import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    try {
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-4 text-center">Sign Up</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={!form.name || !form.email || !form.password}
          onClick={submit}
          className={`w-full py-2 rounded text-white
    ${
      !form.name || !form.email || !form.password
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-gray-800"
    }`}
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/login"
            className="text-black underline hover:text-gray-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
