// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import CONFIG from '../constants/config';
// const ResetPassword = () => {
    
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const tokenFromUrl = searchParams.get('token');
//     if (!tokenFromUrl) {
//       setError('Invalid or missing token');
//       navigate('/forgot-password');
//     } else {
//       setToken(tokenFromUrl);
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (newPassword !== confirmPassword) {
//       return setError('Passwords do not match');
//     }

//     if (newPassword.length < 6) {
//       return setError('Password must be at least 6 characters');
//     }

//     try {
//       setSubmitting(true);
//       const response = await axios.post(`${CONFIG.BASE_URL}/api/auth/reset-password`, {
//         token,
//         newPassword
//       });

//       setMessage(response.data.message);
//       setTimeout(() => navigate('/login'), 3000); // Redirect after success
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Password reset failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
//       <h2>Reset Password</h2>

//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '1rem' }}>
//           <label>New Password</label><br />
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '0.5rem' }}
//           />
//         </div>

//         <div style={{ marginBottom: '1rem' }}>
//           <label>Confirm Password</label><br />
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '0.5rem' }}
//           />
//         </div>

//         <button type="submit" disabled={submitting}>
//           {submitting ? 'Resetting...' : 'Reset Password'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../constants/config";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setError("Invalid or missing token");
      navigate("/forgot-password");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/auth/reset-password`,
        {
          token,
          newPassword,
        }
      );

      setMessage(response.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-gray-700 text-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 tracking-tight">
          Reset Password
        </h2>

        {message && (
          <p className="text-green-400 text-sm mb-3 text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center animate-pulse">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 text-gray-100 placeholder-gray-400"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 text-gray-100 placeholder-gray-400"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-lg font-semibold text-black transition-all duration-300 ${
            submitting
              ? "bg-green-900 cursor-not-allowed opacity-50"
              : "bg-green-500 hover:bg-green-400 active:scale-95"
          }`}
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
