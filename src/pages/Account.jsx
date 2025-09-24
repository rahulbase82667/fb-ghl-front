// export default Account;
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CONFIG from "../constants/config";
import axios from "axios";
import { updateUser } from "../redux/slices/authSlice";

function Account() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const PasswordToggleIcon = ({ show, onClick }) => (
    <div className="absolute right-4 top-8 cursor-pointer" onClick={onClick}>
      {show ? (
           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M2 2L22 22" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
          <svg fill="#22c55e" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 519.578 519.578" width="24" height="24">
          <g>
            <path d="M513.095,245.101c0,0-140.683-139.842-253.291-139.842c-112.608,0-253.292,139.842-253.292,139.842 
            c-8.645,8.109-8.721,21.42,0,29.375c0,0,140.684,139.843,253.292,139.843
            c112.608,0,253.291-139.843,253.291-139.843 
            C521.663,266.368,521.816,253.134,513.095,245.101z M260.875,372.397
            c-61.889,0-112.149-50.185-112.149-112.149 
            s50.184-112.149,112.149-112.149
            c61.965,0,112.148,50.26,112.148,112.149
            S322.763,372.397,260.875,372.397z" />
            <path d="M259.574,187.726c-39.321,0-71.222,32.053-71.222,71.451c0,39.397,31.901,71.451,71.222,71.451 
            c39.321,0,71.222-32.054,71.222-71.451
            C330.796,219.78,298.896,187.726,259.574,187.726z 
            M286.426,259.407
            c-12.163,0-22.108-9.946-22.108-22.262
            s9.945-22.261,22.108-22.261
            s22.108,9.945,22.108,22.261
            S298.742,259.407,286.426,259.407z" />
          </g>
        </svg>
      )}
    </div>
  );

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error on change
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setPasswordErrors({ ...passwordErrors, [e.target.name]: "" });
    setApiError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    return errors;
  };

  const validatePasswords = () => {
    const errors = {};
    if (!passwords.currentPassword) errors.currentPassword = "Current password is required.";
    if (!passwords.newPassword) errors.newPassword = "New password is required.";
    if (passwords.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters.";
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    } 
    return errors;
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if(!window.confirm("Are you sure you wan to update your profile?")){
      return 
    }
    if (Object.keys(errors).length === 0) {
      try {
      const res = await axios.post(
        `${CONFIG.BASE_URL}/api/auth/change-name`,
        {
          email: user.email,
          name: form.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Name changed successfully.");
              dispatch(updateUser({ name: form.name }));

    } catch (err) {
      if (err.response) {
        console.log(err.response);
        setApiError(err.response.data.error=="Validation failed"?err.response.data.details[0].message:err.response.data.error || "Something went wrong. Please try again.");
      } else if (err.request) {
        setApiError("No response from server. Check your connection.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    } 
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswords();
    setPasswordErrors(errors);
    setApiError("");

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${CONFIG.BASE_URL}/api/auth/change-password`,
        {
          email: user.email,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (err.response) {
        console.log(err.response);
        setApiError(err.response.data.error=="Validation failed"?err.response.data.details[0].message:err.response.data.error || "Something went wrong. Please try again.");
      } else if (err.request) {
        setApiError("No response from server. Check your connection.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-[#141B2D] text-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Account</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full bg-[#1E253C] border ${
              formErrors.name ? "border-red-500" : "border-gray-600"
            } text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
            required
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        {/* Email (read-only) */}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full bg-[#2D3748] border border-gray-600 text-gray-400 px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password Section */}
      <hr className="my-6 border-gray-600" />
      <h3 className="text-xl font-semibold mb-4">Change Password</h3>

      <form onSubmit={handlePasswordSubmit}>
        {/* Current Password */}
        <div className="mb-3 relative">
          <label className="block text-sm font-semibold mb-1">Current Password</label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            className={`w-full bg-[#1E253C] border ${
              passwordErrors.currentPassword ? "border-red-500" : "border-gray-600"
            } text-white px-3 py-2 pr-10 rounded focus:outline-none`}
            required
          />
          <PasswordToggleIcon
            show={showCurrentPassword}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          />
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-3 relative">
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className={`w-full bg-[#1E253C] border ${
              passwordErrors.newPassword ? "border-red-500" : "border-gray-600"
            } text-white px-3 py-2 pr-10 rounded focus:outline-none`}
            required
          />
          <PasswordToggleIcon
            show={showNewPassword}
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            className={`w-full bg-[#1E253C] border ${
              passwordErrors.confirmPassword ? "border-red-500" : "border-gray-600"
            } text-white px-3 py-2 pr-10 rounded focus:outline-none`}
            required
          />
          <PasswordToggleIcon
            show={showConfirmPassword}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
          )}
        </div>

        {/* General API Error */}
        {apiError && <p className="text-red-500 text-sm mb-3">{apiError}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default Account;
