// // components/FBAccountEditModal.jsx

// import React, { useState, useEffect } from "react";
// import axiosInstance from "axiosInstance";
// import CONFIG from "../constants/config";

// const FBAccountEditModal = ({ isOpen, onClose, account, token, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     account_name: "",
//     email: "",
//     phone_number: "",
//     session_cookies:"",
//     proxy_url: "",
//     proxy_user: "",
//     proxy_port: "",
//     login_status: "",
//     last_error: ""
//   });

//   useEffect(() => {
//     if (account) {
//       setFormData({
//         account_name: account.account_name || "",
//         email: account.email || "",
//         phone_number: account.phone_number || "",
//         session_cookies: account.session_cookies || "",
//         proxy_url: account.proxy_url || "",
//         proxy_user: account.proxy_user || "",
//         proxy_port: account.proxy_port || "",
//         login_status: account.login_status || "",
//         last_error: account.last_error || "",
//       });
//     }
//   }, [account]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.patch(
//         `${CONFIG.BASE_URL}/api/facebook/${account.id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       onSuccess(); // e.g., refresh account list
//       onClose();   // close modal
//     } catch (err) {
//       console.error("Error updating account:", err);
//       alert("Failed to update account.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Facebook Account</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {[
//             { name: "account_name", label: "Account Name" },
//             { name: "email", label: "Email" },
//             { name: "phone_number", label: "Phone Number" },
//             { name: "proxy_url", label: "Proxy URL" },
//             { name: "session_cookies", label: "Session Cookies" },
//             { name: "proxy_user", label: "Proxy User" },
//             { name: "proxy_port", label: "Proxy Port" },
//             { name: "login_status", label: "Login Status" },
//             { name: "last_error", label: "Last Error" },
//           ].map(({ name, label }) => (
//             <div key={name}>
//               <label className="block text-sm font-semibold text-gray-700">
//                 {label}
//               </label>
//               <input
//                 type="text"
//                 name={name}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 px-3 py-2 rounded"
//               />
//             </div>
//           ))}

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FBAccountEditModal;

import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CONFIG from "../constants/config";

const FBAccountEditModal = ({ isOpen, onClose, account, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    account_name: "",
    email: "",
    phone_number: "",
    session_cookies: "",
    proxy_url: "",
    proxy_user: "",
    proxy_port: "",
    login_status: "",
    last_error: null,
    error_details: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log('acccoutn is:', account);
  useEffect(() => {
    if (account) {
      setFormData({
        account_name: account.account_name || "",
        email: account.email || "",
        phone_number: account.phone_number || "",
        session_cookies: account.session_cookies || "",
        proxy_url: account.proxy_url || "",
        proxy_user: account.proxy_user || "",
        proxy_port: account.proxy_port || "",
        login_status: "active",
        last_error: null,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // console.log(formData);
      // return 
      await axiosInstance.patch(
        `${CONFIG.BASE_URL}/api/facebook/${account.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!account.initial_setup_status || account.initial_setup_status === 0) {
        await axiosInstance.post(`${CONFIG.BASE_URL}/api/facebook/setup/${account.id}`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => console.log(res));
      }
      onSuccess(); // e.g., refresh account list
      onClose();   // close modal
    } catch (err) {
      console.error("Error updating account:", err);
      setError("Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-green-400">Edit Facebook Account</h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[{
            name: "account_name", label: "Account Name"
          }, {
            name: "email", label: "Email"
          }, {
            name: "phone_number", label: "Phone Number"
          }, {
            name: "proxy_url", label: "Proxy URL"
          }, {
            name: "session_cookies", label: "Session Cookies"
          }, {
            name: "proxy_user", label: "Proxy User"
          }, {
            name: "proxy_port", label: "Proxy Port"
          },
          {
            name: "proxy_password", label: "Proxy Password"
          }
            //   name: "login_status", label: "Login Status"
            // }, {
            //   name: "last_error", label: "Last Error"
            // }
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-200">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a8 8 0 0116 0m-4-4v4h4m-4 0H4"
                  />
                </svg>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FBAccountEditModal;
