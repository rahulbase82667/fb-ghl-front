import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFBAccounts, removeFBAccount } from "../redux/slices/fbAccountsSlice";
import FBAccountModal from "../components/FBAccountModal";

function FacebookAccounts() {
  const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFBAccounts());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Facebook Accounts</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          + Connect Account
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && accounts.length === 0 && (
        <p className="text-gray-600">No accounts connected yet.</p>
      )}

      <ul className="space-y-3">
        {accounts.map((acc) => (
          <li
            key={acc.id}
            className="flex justify-between items-center bg-white shadow p-3 rounded"
          >
            <div>
              <p className="font-semibold">{acc.account_name}</p>
              {acc.proxy && (
                <p className="text-sm text-gray-500">Proxy: {acc.proxy_url}</p>
              )}
            </div>
            <button
              onClick={() => dispatch(removeFBAccount(acc.id))}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {modalOpen && <FBAccountModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export default FacebookAccounts;
