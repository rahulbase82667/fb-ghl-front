  import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFBAccount } from "../redux/slices/fbAccountsSlice";

function FBAccountModal({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", proxy: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(addFBAccount(form)).unwrap();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Connect Facebook Account</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Account Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-3 rounded"
            required
          />
          <input
            type="text"
            name="proxy"
            placeholder="Proxy (optional)"
            value={form.proxy}
            onChange={handleChange}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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
