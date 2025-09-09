// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchFBAccounts, removeFBAccount } from "../redux/slices/fbAccountsSlice";
// import FBAccountModal from "../components/FBAccountModal";

// function FacebookAccounts() {
//   const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
//   const dispatch = useDispatch();
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchFBAccounts());
//   }, [dispatch]);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Facebook Accounts</h2>
//         <button
//           onClick={() => setModalOpen(true)}
//           className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
//         >
//           + Connect Account
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">Loading accounts...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && accounts.length === 0 && (
//         <p className="text-gray-600">No accounts connected yet.</p>
//       )}

//       <ul className="space-y-3">
//         {accounts.map((acc) => (
//           <li
//             key={acc.id}
//             className="flex justify-between items-center bg-white shadow p-3 rounded"
//           >
//             <div>
//               <p className="font-semibold">{acc.account_name}</p>
//               {acc.proxy && (
//                 <p className="text-sm text-gray-500">Proxy: {acc.proxy_url}</p>
//               )}
//             </div>
//             <button
//               onClick={() => dispatch(removeFBAccount(acc.id))}
//               className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>

//       {modalOpen && <FBAccountModal onClose={() => setModalOpen(false)} />}
//     </div>
//   );
// }

// export default FacebookAccounts;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFBAccounts,
  removeFBAccount,
} from "../redux/slices/fbAccountsSlice";
import FBAccountModal from "../components/FBAccountModal";
import { Trash2, Plus } from "lucide-react";

function FacebookAccounts() {
  const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

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
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Connect Account</span>
        </button>
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
              <p className="font-semibold text-white">{acc.account_name}</p>
              {acc.proxy && (
                <p className="text-sm text-gray-400">
                  Proxy: {acc.proxy_url}
                </p>
              )}
            </div>
            <button
              onClick={() => dispatch(removeFBAccount(acc.id))}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-500 active:scale-95 transition-all"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalOpen && <FBAccountModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export default FacebookAccounts;
