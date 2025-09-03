import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../constants/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${CONFIG.BASE_URL}/api/auth/login`, {
        email,
        password,
      });
    //   console.log(res.data.data);
      if (res.data.data?.token) {
        // Save to Redux
        dispatch(loginSuccess({ token: res.data.data.token, user: res.data.data.user }));
        // Persist token in localStorage
        localStorage.setItem(CONFIG.TOKEN_KEY, res.data.data.token);

        navigate("/dashboard");
      } else {
        setError("Invalid server response. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with status outside 2xx
        setError(err.response.data.error || "Login failed. Please try again.");
      } else if (err.request) {
        // No response from server
        setError("No response from server. Please check your connection.");
      } else {
        // Other errors
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between text-sm mt-3">
          <a href="/signup" className="text-blue-600">
            Sign Up
          </a>
          <a href="/forgot-password" className="text-blue-600">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
