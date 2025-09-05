// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import CONFIG from "../constants/config";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/slices/authSlice";

// function Signup() {
//   const [form, setForm] = useState({ name:"",email: "", password: "", confirmPassword: "" });
//   const [errors, setErrors] = useState({});
//   const [globalError, setGlobalError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" }); // Clear field error on change
//     setGlobalError(""); // Clear global errors on input
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.name) {
//       newErrors.name = "Name is required";
//     }
//     if (!form.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!form.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     setLoading(true);
//     setGlobalError("");

//     try {
//       const res = await axios.post(`${CONFIG.BASE_URL}/api/auth/register`, {
//         name:form.name,
//         email: form.email,
//         password: form.password,
//       },{
//           withCredentials: true // This triggers the need for proper CORS setup
//       }
//     );

//       const { token, user } = res.data.data || {};

//       if (token) {
//         dispatch(loginSuccess({ token, user }));
//         localStorage.setItem(CONFIG.TOKEN_KEY, token);
//         navigate("/dashboard");
//       } else {
//         setGlobalError("Invalid server response. Please try again.");
//       }
//     } catch (err) {
//       if (err.response) {
//         console.log(err.response)
//         if (err.response.data?.error.includes("Validation failed")) {
//           setGlobalError("Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
//         } else {
//           setGlobalError(err.response.data?.error || "Registration failed. Please try again.");
//         }
//       } else if (err.request) {
//         setGlobalError("No response from server. Please check your connection.");
//       } else {
//         setGlobalError("An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

//         {globalError && (
//           <p className="text-red-500 text-sm mb-3 text-center">{globalError}</p>
//         )}

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           className={`w-full border px-3 py-2 mb-1 rounded ${errors.name ? "border-red-500" : ""}`}
//           value={form.name}
//           onChange={handleChange}
//         />
//         {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className={`w-full border px-3 py-2 mb-1 rounded ${errors.email ? "border-red-500" : ""}`}
//           value={form.email}
//           onChange={handleChange}
//         />
//         {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className={`w-full border px-3 py-2 mb-1 rounded ${errors.password ? "border-red-500" : ""}`}
//           value={form.password}
//           onChange={handleChange}
//         />
//         {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           className={`w-full border px-3 py-2 mb-1 rounded ${errors.confirmPassword ? "border-red-500" : ""}`}
//           value={form.confirmPassword}
//           onChange={handleChange}
//         />
//         {errors.confirmPassword && (
//           <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Signing up..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Signup;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../constants/config";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

function Signup() {
  const [form, setForm] = useState({ name:"",email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setGlobalError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");

    try {
      const res = await axios.post(`${CONFIG.BASE_URL}/api/auth/register`, {
        name:form.name,
        email: form.email,
        password: form.password,
      },{ withCredentials: true });

      const { token, user } = res.data.data || {};
      if (token) {
        dispatch(loginSuccess({ token, user }));
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        navigate("/dashboard");
      } else {
        setGlobalError("Invalid server response. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data?.error.includes("Validation failed")) {
          setGlobalError("Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        } else {
          setGlobalError(err.response.data?.error || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setGlobalError("No response from server. Please check your connection.");
      } else {
        setGlobalError("An unexpected error occurred.");
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
          Sign Up
        </h2>

        {globalError && (
          <p className="text-red-400 text-sm mb-4 text-center animate-pulse">
            {globalError}
          </p>
        )}

        {["name", "email", "password", "confirmPassword"].map((field, i) => (
          <div key={i} className="mb-4">
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={
                field === "confirmPassword"
                  ? "Confirm Password"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className={`w-full bg-gray-800 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-gray-400 text-gray-100 ${
                errors[field] ? "border-red-500" : "border-gray-600"
              }`}
              value={form[field]}
              onChange={handleChange}
            />
            {errors[field] && (
              <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400 active:scale-95 transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
