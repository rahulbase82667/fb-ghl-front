// export default Signup;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../constants/config";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        name: form.name,
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

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

  // return (
  //   <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
  //     <form
  //       onSubmit={handleSubmit}
  //       className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-gray-700 text-gray-100"
  //     >
  //       <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 tracking-tight">
  //         Sign Up
  //       </h2>

  //       {globalError && (
  //         <p className="text-red-400 text-sm mb-4 text-center animate-pulse">
  //           {globalError}
  //         </p>
  //       )}

  //       {["name", "email", "password", "confirmPassword"].map((field, i) => (
  //         <div key={i} className="mb-4">
  //           <input
  //             type={field.includes("password") ? "password" : "text"}
  //             name={field}
  //             placeholder={
  //               field === "confirmPassword"
  //                 ? "Confirm Password"
  //                 : field.charAt(0).toUpperCase() + field.slice(1)
  //             }
  //             className={`w-full bg-gray-800 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-gray-400 text-gray-100 ${errors[field] ? "border-red-500" : "border-gray-600"
  //               }`}
  //             value={form[field]}
  //             onChange={handleChange}
  //           />
  //           {errors[field] && (
  //             <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
  //           )}
  //         </div>
  //       ))}

  //       <button
  //         type="submit"
  //         className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400 active:scale-95 transition-all duration-300 disabled:opacity-50"
  //         disabled={loading}
  //       >
  //         {loading ? "Signing up..." : "Sign Up"}
  //       </button>
  //     </form>
  //   </div>
  // );

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

        {["name", "email", "password", "confirmPassword"].map((field, i) => {
          const isPassword = field.includes("password");
          const isConfirm = field === "confirmPassword";
          const show = isConfirm ? showConfirmPassword : showPassword;
          const toggleShow = isConfirm
            ? () => setShowConfirmPassword((prev) => !prev)
            : () => setShowPassword((prev) => !prev);

          return (
            <div key={i} className="mb-4 relative">
              <input
                type={isPassword ? (show ? "text" : "password") : "text"}
                name={field}
                placeholder={
                  isConfirm
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                className={`w-full bg-gray-800 border px-4 py-2 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-gray-400 text-gray-100 ${errors[field] ? "border-red-500" : "border-gray-600"
                  }`}
                value={form[field]}
                onChange={handleChange}
              />

              {/* Password visibility toggle icon */}
              {isPassword && (
                <div
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={toggleShow}
                >
                  {show ? (
                    // Eye Off (Hide)
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M2 2L22 22"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye (Show)
                    <svg
                      fill="#22c55e"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 519.578 519.578"
                      width="24"
                      height="24"
                    >
                      <g>
                        <path d="M513.095,245.101c0,0-140.683-139.842-253.291-139.842c-112.608,0-253.292,139.842-253.292,139.842 
                        c-8.645,8.109-8.721,21.42,0,29.375c0,0,140.684,139.843,253.292,139.843
                        c112.608,0,253.291-139.843,253.291-139.843 
                        C521.663,266.368,521.816,253.134,513.095,245.101z M260.875,372.397
                        c-61.889,0-112.149-50.185-112.149-112.149 
                        s50.184-112.149,112.149-112.149
                        c61.965,0,112.148,50.26,112.148,112.149
                        S322.763,372.397,260.875,372.397z"
                        ></path>
                        <path d="M259.574,187.726c-39.321,0-71.222,32.053-71.222,71.451c0,39.397,31.901,71.451,71.222,71.451 
                        c39.321,0,71.222-32.054,71.222-71.451
                        C330.796,219.78,298.896,187.726,259.574,187.726z 
                        M286.426,259.407
                        c-12.163,0-22.108-9.946-22.108-22.262
                        s9.945-22.261,22.108-22.261
                        s22.108,9.945,22.108,22.261
                        S298.742,259.407,286.426,259.407z"
                        ></path>
                      </g>
                    </svg>
                  )}
                </div>
              )}

              {errors[field] && (
                <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400 active:scale-95 transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>


        <div className=" text-sm mt-4">
          Already regestered? Login here &nbsp;
          <Link
            to="/login"
            className="text-green-400 hover:underline transition-all duration-200"
          >
            Login
          </Link>


        </div>
      </form>

    </div>
  );
}

export default Signup;
