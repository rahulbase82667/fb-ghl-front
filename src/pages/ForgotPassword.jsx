import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
} 

export default ForgotPassword;
