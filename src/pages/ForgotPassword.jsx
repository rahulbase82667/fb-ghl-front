// import React, { useState } from "react";
// import CONFIG from "../constants/config";
// import axios from "axios";
// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false);  

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleSubmit =async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     if (!email) {
//       setError("Email is required.");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     // Simulate API call
//         try {
//       const res = await axios.post(`${CONFIG.BASE_URL}/api/auth/forgot-password`, {
//         email,
//       }
//     );
    
//       console.log(res);
//     } catch (err) {
//       console.log(err);
//       if (err.response) {
//         // Server responded with status outside 2xx
//         setError(err.response.data.error || "Login failed. Please try again.");
//       } else if (err.request) {
//         // No response from server
//         setError("No response from server. Please check your connection.");
//       } else {
//         // Other errors
//         setError("An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//     console.log("Password reset link sent to:", email);
//     setSuccessMessage("Password reset link sent to your email.");
//     setEmail("");
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}

//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <button
//           type="submit"
//           className={`w-full py-2 rounded text-white ${
//             !email || !validateEmail(email)
//               ? "bg-purple-300 cursor-not-allowed"
//               : "bg-purple-500 hover:bg-purple-600"
//           }`}
//           disabled={!email || !validateEmail(email)}
//         >
//           {loading ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ForgotPassword;

import React, { useState } from "react";
import CONFIG from "../constants/config";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true)

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(`${CONFIG.BASE_URL}/api/auth/forgot-password`, {
        email,
      });
      console.log(res);

      setSuccessMessage("Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      console.log(err);
      if (err.response) {
        setError(err.response.data.error || "Request failed. Please try again.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-gray-700 text-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 tracking-tight">
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center animate-pulse">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-400 text-sm mb-3 text-center">
            {successMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-gray-800 border border-gray-600 px-4 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-gray-400 text-gray-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold text-black transition-all duration-300 ${
            !email || !validateEmail(email)
              ? "bg-green-900 cursor-not-allowed opacity-50"
              : "bg-green-500 hover:bg-green-400 active:scale-95"
          }`}
          disabled={!email || !validateEmail(email) || loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;

