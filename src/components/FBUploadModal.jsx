import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFBAccounts, fetchFBAccounts } from "../redux/slices/fbAccountsSlice";

function FBUploadModal({ onClose }) {
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {x
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV or Excel file.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      await dispatch(uploadFBAccounts(formData)).unwrap();
      // ✅ Refresh accounts after successful upload
      dispatch(fetchFBAccounts());
      onClose();
    } catch (err) {
      setError(err || "Failed to upload accounts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-96 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-green-400">Upload Accounts File</h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="w-full text-gray-200 file:mr-3 file:py-2 file:px-4 
              file:rounded file:border-0 
              file:bg-green-500 file:text-white 
              hover:file:bg-green-600"
          />

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
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FBUploadModal;
