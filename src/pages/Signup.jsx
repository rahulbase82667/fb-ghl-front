import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", form);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
