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
import { socket } from "../socket"; // 👈 import socket
import axios from "axios";
import CONFIG from "../constants/config";
import LogsModal from "../components/LogsModal";
function FacebookAccounts() {
  const { accounts, loading, error } = useSelector((state) => state.fbAccounts);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState({});
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);


  // Track scrape status for each account
  const [scrapeStatus, setScrapeStatus] = useState({});
  // Handle login
  // Handle login
  const handleLogin = async (accountId) => {
     setLogsModalOpen(true)
    // console.log(`${CONFIG.BASE_URL}api/facebook/login/${accountId}`);
    try {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "⏳ Logging in...",
      }));

      await axios.post(`${CONFIG.BASE_URL}/api/facebook/login/${accountId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "📡 Login job enqueued...",
      }));
    } catch (err) {
      console.error(err);
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "❌ Error starting login",
      }));
    }
  };

  useEffect(() => {
    dispatch(fetchFBAccounts());
  }, [dispatch]);
  // 🔌 Listen for socket events
  // useEffect(() => {
  //   socket.on("scrape-started", ({ accountId }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: "Scraping started...",
  //     }));
  //   });

  //   socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: `📡 Scraping ${partner || "chat"} (${current}/${total})`,
  //     }));
  //   });

  //   socket.on("scrape-completed", ({ accountId }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: "✅ Scraping completed",
  //     }));
  //   });

  //   socket.on("scrape-failed", ({ accountId, error }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: `❌ Failed: ${error}`,
  //     }));
  //   });
  //   socket.on("login-started", ({ accountId }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: "🔑 Login started...",
  //     }));
  //   });

  //   socket.on("login-completed", ({ accountId }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: "✅ Login successful",
  //     }));
  //   });

  //   socket.on("login-failed", ({ accountId, error }) => {
  //     setScrapeStatus((prev) => ({
  //       ...prev,
  //       [accountId]: `❌ Login failed: ${error}`,
  //     }));
  //   });


  //   return () => {
  //     socket.off("scrape-started");
  //     socket.off("scrape-progress");
  //     socket.off("scrape-completed");
  //     socket.off("scrape-failed");
  //   };
  // }, []);

useEffect(() => {
  const addLog = (msg) =>
    setLogs((prev) => [
      ...prev,
      { message: msg, timestamp: new Date().toLocaleTimeString() },
    ]);

  socket.on("scrape-started", ({ accountId }) => {
    addLog(`Scraping started for account ${accountId}`);
  });

  socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
    addLog(`Scraping ${partner || "chat"} ( ${current}/${total}) for ${accountId}`);
  });

  socket.on("scrape-completed", ({ accountId }) => {
    addLog(`Scraping completed for account ${accountId}`);
  });

  socket.on("scrape-failed", ({ accountId, error }) => {
    // alert('failed')
    addLog(`Scraping failed for ${accountId}: ${error}` );
  });

  socket.on("login-started", ({ accountId }) => {
    addLog(`Login started for account ${accountId}`);
  });

  socket.on("login-completed", ({ accountId }) => {
    addLog(`Login successful for account ${accountId}`);
  });

  socket.on("login-failed", ({ accountId, error }) => {
    addLog(`Login failed for ${accountId}: ${error}`);
  });

  return () => {
    socket.off("scrape-started");
    socket.off("scrape-progress");
    socket.off("scrape-completed");
    socket.off("scrape-failed");
    socket.off("login-started");
    socket.off("login-completed");
    socket.off("login-failed");
  };
}, []);

  // Start scraping handler
  const handleScrape = async (accountId) => {
     setLogsModalOpen(true)
    try {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "⏳ Requesting scrape...",
      }));

      await axios.post(`http://localhost:3000/api/scrape/chats/${accountId}`);
      //  setLogsModalOpen(false)
    } catch (err) {
      setScrapeStatus((prev) => ({
        ...prev,
        [accountId]: "❌ Error starting scrape",
      }));
    }
  };
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

            {acc.login_status == 'active' ? (
              <>
                <Link to={`/fb/${acc.id}`} >
                  <button
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                  >
                    View Chats
                  </button>
                </Link>
                <button
                  onClick={() => handleScrape(acc.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                >
                  Scrape Chats
                </button>
                <button
                  onClick={() => dispatch(removeFBAccount(acc.id))}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                >

                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleLogin(acc.id)}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500 active:scale-95 transition-all"
              >
                Connect
              </button>
            )}


          </li>
        ))}
      </ul>

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
