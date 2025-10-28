import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFBAccounts,
  removeFBAccount,
} from "../redux/slices/fbAccountsSlice";
import FBAccountModal from "../components/FBAccountModal";
import FBUploadModal from "../components/FBUploadModal";
import { Link } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import { connectSocket, disconnectSocket, getSocket } from "../socket";
import axiosInstance from "../api/axiosInstance";
import CONFIG from "../constants/config";
import LogsModal from "../components/LogsModal";
import FBAccountEditModal from "../components/FBAccountEditModal";

function FacebookAccounts() {
  const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
  // console.log(accounts)
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [accountStatus, setAccountStatus] = useState({});
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Track scrape status for each account
  const [scrapeStatus, setScrapeStatus] = useState({});
  const [socketInstance, setSocketInstance] = useState(null);
  const majorErrors = ['Cookies Expired', 'Proxy Expired']
  // Handle login
  // Handle login
  const handleLogin = async (accountId) => {
    setLogsModalOpen(true)
    if (!socketInstance || !socketInstance.connected) {
      const socket = connectSocket();
      setSocketInstance(socket);
    }
    // console.log(`${CONFIG.BASE_URL}api/facebook/login/${accountId}`);
    try {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "⏳ Logging in...",
      }));

      await axiosInstance.post(`${CONFIG.BASE_URL}/api/facebook/login/${accountId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "📡 Login job enqueued...",
      }));


      console.log(scrapeStatus);
    } catch (err) {
      console.error(err);
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "❌ Error starting login",
      }));
    }
  };


  // Start scraping handler
  const handleScrape = async (accountId) => {
    setLogsModalOpen(true)
    if (!socketInstance || !socketInstance.connected) {
      const socket = connectSocket();
      setSocketInstance(socket);
    }
    try {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "⏳ Requesting scrape...",
      }));

      await axiosInstance.post(`${CONFIG.BASE_URL}/api/scrape/chats/${accountId}`);
      //  setLogsModalOpen(false)

      console.log(scrapeStatus);

    } catch (err) {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "❌ Error starting scrape",
      }));
    }
  };

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setEditModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchFBAccounts());
  }, [dispatch]);


  // useEffect(() => {
  //   const addLog = (msg) =>
  //     setLogs((prev) => [
  //       ...prev,
  //       { message: msg, timestamp: new Date().toLocaleTimeString() },
  //     ]);

  //   socket.on("scrape-started", ({ accountId }) => {
  //     addLog(`Scraping started for account ${accountId}`);
  //   });

  //   socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
  //     addLog(`Scraping ${partner || "chat"} ( ${current}/${total}) for ${accountId}`);
  //   });

  //   socket.on("scrape-completed", ({ accountId }) => {
  //     addLog(`Scraping completed for account ${accountId}`);
  //     setLogsModalOpen(false)
  //   });

  //   socket.on("scrape-failed", ({ accountId, error }) => {
  //     // alert('failed')
  //     addLog(`Scraping failed for ${accountId}: ${error}`);
  //   });

  //   socket.on("login-started", ({ accountId }) => {
  //     addLog(`Login started for account ${accountId}`);
  //   });

  //   // socket.on("login-completed", ({ accountId }) => {
  //   //   dispatch(fetchFBAccounts());
  //   //   addLog(`Login successful for account ${accountId}`);
  //   //   setLogsModalOpen(false)
  //   // });
  //   socket.on("login-completed", ({ accountId }) => {
  //     addLog(`Login successful for account ${accountId}`);
  //     setScrapeStatus(prev => ({
  //       ...prev,
  //       [accountId]: "✅ Login successful",
  //     }));
  //     dispatch(fetchFBAccounts());
  //     setLogsModalOpen(false);
  //   });

  //   socket.on("login-failed", ({ accountId, error }) => {
  //     addLog(`❌ Failed to start login for ${accountId}: ${err.message}`);

  //     // addLog(`Login failed for ${accountId}: ${error}`);
  //   });

  //   return () => {
  //     socket.off("scrape-started");
  //     socket.off("scrape-progress");
  //     socket.off("scrape-completed");
  //     socket.off("scrape-failed");
  //     socket.off("login-started");
  //     socket.off("login-completed");
  //     socket.off("login-failed");
  //   };
  // }, [dispatch]);
  useEffect(() => {
    const socket = connectSocket();
    setSocketInstance(socket);

    const addLog = (msg) =>
      setLogs((prev) => [
        ...prev,
        { message: msg, timestamp: new Date().toLocaleTimeString() },
      ]);

    // socket.on("scrape-started", ({ accountId }) => {
    //   setLogs([]);
    //   addLog(`Scraping started for account ${accountId}`);
    // });
    // socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
    //   addLog(`Scraping ${partner || "chat"} (${current}/${total}) for ${accountId}`);
    // });
    // socket.on("scrape-completed", ({ accountId }) => {
    //   addLog(`Scraping completed for account ${accountId}`);
    //   setLogsModalOpen(false);

    //   disconnectSocket();
    // });
    // socket.on("scrape-failed", ({ accountId, error }) => {
    //   addLog(`Scraping failed for ${accountId}: ${error}`);

    //   disconnectSocket();
    // });

    // socket.on("login-started", ({ accountId }) => {
    //   setLogs([]);
    //   addLog(`Login started for account ${accountId}`);
    // });
    // socket.on("login-completed", ({ accountId }) => {
    //   addLog(`Login successful for account ${accountId}`);
    //   setScrapeStatus((prev) => ({
    //     ...prev,
    //     [accountId]: "✅ Login successful",
    //   }));
    //   dispatch(fetchFBAccounts());
    //   setLogsModalOpen(false);

    //   disconnectSocket();
    // });
    // socket.on("login-failed", ({ accountId, error }) => {
    //   addLog(`❌ Failed to start login for ${accountId}: ${error}`);

    //   disconnectSocket();
    // });

    return () => {
      // socket.off("scrape-started");
      // socket.off("scrape-progress");
      // socket.off("scrape-completed");
      // socket.off("scrape-failed");
      // socket.off("login-started");
      // socket.off("login-completed");
      // socket.off("login-failed");

      disconnectSocket();
    };
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
              <p className="font-semibold t ext-green-600">{acc.account_name || acc.email || acc.phone_number}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy:</span> {acc.proxy_url || 'No Proxy'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy User:</span> {acc.proxy_user || 'No Proxy User'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Proxy Port:</span> {acc.proxy_port || 'N/A'}</p>
              <p className="font-semibold text-white"><span className="text-green-700">Login Status:</span>
                <>
                  {acc.login_status}
                  {acc.login_status !== 'active' && (
                    <span className="text-red-500"> {acc.last_error} </span>
                  )}
                </>
              </p>
            </div>
            <button
              onClick={() => handleEditClick(acc)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 active:scale-95 transition-all"
            >
              Edit  {acc?.last_error && majorErrors.includes(acc?.last_error) ? `(${acc?.last_error})` : ''}
            </button>

            {acc.login_status == 'active' && (
              <>
                <Link to={`/fb/${acc.id}`} >
                  <button
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                  >
                    View Chats
                  </button>
                </Link>
              </>)
            }
            {/* <button
                  onClick={() => handleScrape(acc.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                >
                  Scrape Chats
                </button> */}

            {/* </>
            ) : (
              <> */}
            {/* <button
                onClick={() => handleLogin(acc.id)}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500 active:scale-95 transition-all"
              >
                Connect
              </button> */}
            <button
              onClick={async () => {
                setDeletingId(acc.id);
                dispatch(removeFBAccount(acc.id));
                setDeletingId(null);
              }}
              disabled={deletingId === acc.id}
              className={`flex items-center gap-2 px-3 py-2 rounded text-white active:scale-95 transition-all 
    ${deletingId === acc.id
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500"
                }`}
            >

              <Trash2 size={16} />
              <span className="hidden sm:inline">
                {deletingId === acc.id ? "Removing..." : "Remove"}
              </span>
            </button>
            {/* </>
            )} */}


          </li>
        ))}
      </ul>
      <FBAccountEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        account={selectedAccount}
        token={token}
        // data={data}
        onSuccess={() => dispatch(fetchFBAccounts())}
      />

      {/* Modal */}
      {modalOpen && <FBAccountModal onClose={() => setModalOpen(false)} />}
      {showUploadModal && <FBUploadModal onClose={() => setShowUploadModal(false)} />}
      <LogsModal
        isOpen={logsModalOpen}
        onClose={() => setLogsModalOpen(false)}
        logs={logs}
      />

    </div>

  );
}

export default FacebookAccounts;
