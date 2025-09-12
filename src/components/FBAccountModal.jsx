import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFBAccount,fetchFBAccounts } from "../redux/slices/fbAccountsSlice";

function FBAccountModal({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    userId: user.id,
    accountName: "",
    email: "",
    phoneNumber: "",
    password: "",
    proxyUrl: "",
    proxyPort: "",
    proxyUser: "",
    proxyPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showProxyPassword, setShowProxyPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(addFBAccount(form)).unwrap();
      dispatch(fetchFBAccounts());

      onClose();
    } catch (err) {
      setError(err || "Failed to add account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-green-400">
          Connect Facebook Account
        </h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="accountName"
            placeholder="Account Name"
            value={form.accountName}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
   <div
            className="absolute right-4 top-2.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              // Hide icon (eye with a slash)
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
                ></path>
                <path
                  d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ) : (
              // Show icon (eye)
              <svg
                fill="#009537ff"
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
          </div>
          <input
            type="text"
            name="proxyUrl"
            placeholder="Proxy URL"
            value={form.proxyUrl}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="proxyPort"
            placeholder="Proxy Port"
            value={form.proxyPort}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="proxyUser"
            placeholder="Proxy Username"
            value={form.proxyUser}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
                  <div className="relative w-full">

          <input
            type={showProxyPassword ? "text" : "password"}
            name="proxyPassword"
            placeholder="Proxy Password"
            value={form.proxyPassword}
            onChange={handleChange}
            className="w-full bg-slate-900 text-gray-200 border border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
   <div
            className="absolute right-4 top-2.5 cursor-pointer"
            onClick={() => setShowProxyPassword(!showProxyPassword)}
          >
            {showProxyPassword ? (
              // Hide icon (eye with a slash)
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
                ></path>
                <path
                  d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ) : (
              // Show icon (eye)
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
</div>
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
              {loading ? "Saving..." : "Connect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FBAccountModal;
