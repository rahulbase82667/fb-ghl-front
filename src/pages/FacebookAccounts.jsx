import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFBAccounts,
  removeFBAccount,
} from "../redux/slices/fbAccountsSlice";
import FBAccountModal from "../components/FBAccountModal";
import FBUploadModal from "../components/FBUploadModal";
import {Link} from "react-router-dom";
import { Trash2, Plus } from "lucide-react";

function FacebookAccounts() {
  const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);


  useEffect(() => {
    dispatch(fetchFBAccounts());
  }, [dispatch]);

  return (
    <div className="p-6 text-gray-200 bg-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">
          Facebook Accounts
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-black"
          >
            Upload CSV/Excel
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-black"
          >
            + Add Account
          </button>
        </div>
      </div>

      {/* States */}
      {loading && <p className="text-gray-400">Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && accounts.length === 0 && (
        <p className="text-gray-400">No accounts connected yet.</p>
      )}

      {/* Accounts List */}
      <ul className="space-y-4">
        {accounts.map((acc) => (
          <li
            key={acc.id}
            className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div>
              <p className="font-semibold text-green-600">{acc.account_name || acc.email || acc.phone_number}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy:</span> {acc.proxy_url || 'No Proxy'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy User:</span> {acc.proxy_user || 'No Proxy User'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy Port:</span> {acc.proxy_port || 'N/A'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Login Status:</span> {acc.login_status}</p>
            </div>
            
              <Link to={`/fb/${acc.id}`} >
              <button className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
              >
                View Chats
              </button>
              </Link>
           
            <button
              onClick={() => dispatch(removeFBAccount(acc.id))}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalOpen && <FBAccountModal onClose={() => setModalOpen(false)} />}
      {showUploadModal && <FBUploadModal onClose={() => setShowUploadModal(false)} />}

    </div>
  );
}

export default FacebookAccounts;
