import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchConversations,
    setActiveConversation,
    fetchMessages,
    addMessage,
} from "../redux/slices/chatsSlice";
import { connectSocket, disconnectSocket, getSocket } from "../socket";
import axios from "axios";
import CONFIG from "../constants/config";
import LogsModal from "../components/LogsModal";
function FBChat() {
    const { id } = useParams(); // FB account id
    const dispatch = useDispatch();
    const { conversations, activeConversation, messages, loading, error } = useSelector((state) => state.chats);
    const { user, token } = useSelector((state) => state.auth);
    const [logsModalOpen, setLogsModalOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const messagesEndRef = useRef(null);
    const [scrapeStatus, setScrapeStatus] = useState({});
      const [socketInstance, setSocketInstance] = useState(null);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    const [messageInput, setMessageInput] = useState("");

    // Fetch conversations when entering page
    useEffect(() => {
        dispatch(fetchConversations(id));
    }, [id, dispatch]);

    // When clicking on a conversation
    const handleConversationClick = (conv) => {
        dispatch(setActiveConversation(conv));
        dispatch(fetchMessages(conv.id)); // fetch messages
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // For now: local add only
        dispatch(
            addMessage({
                id: Date.now(),
                text: messageInput,
                sender: "You",
                timestamp: new Date().toISOString(),
            })
        );
        setMessageInput("");
    };
    const handleScrape = async (accountId, chatUrl) => {
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

        await axios.post(`http://localhost:3000/api/scrape/chats/single/${accountId}`, { chatUrl }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        //  setLogsModalOpen(false)
    } catch (err) {
        setScrapeStatus((prev) => ({
            ...prev,
            [accountId]: "❌ Error starting scrape",
        }));
    }
};

  // Connect socket when component mounts or when you start scraping/logging in
  useEffect(() => {
    const socket = connectSocket();
    setSocketInstance(socket);

    const addLog = (msg) =>
      setLogs((prev) => [
        ...prev,
        { message: msg, timestamp: new Date().toLocaleTimeString() },
      ]);

    socket.on("scrape-started", ({ accountId }) => {
        setLogs([]);
      addLog(`Scraping started for account ${accountId}`);
    });
    socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
      addLog(`Scraping ${partner || "chat"} (${current}/${total}) for ${accountId}`);
    });
    socket.on("scrape-completed", ({ accountId }) => {
      addLog(`Scraping completed for account ${accountId}`);
      setLogsModalOpen(false);
      dispatch(fetchMessages(activeConversation.id)); // fetch messages

      disconnectSocket(); // disconnect on completed
    });
    socket.on("scrape-failed", ({ accountId, error }) => {
      addLog(`Scraping failed for ${accountId}: ${error}`);

      disconnectSocket(); // disconnect on failed
    });

    return () => {
      socket.off("scrape-started");
      socket.off("scrape-progress");
      socket.off("scrape-completed");
      socket.off("scrape-failed");
      disconnectSocket(); // cleanup on unmount
    };
  }, [dispatch, activeConversation]);

// useEffect(() => {
//     const addLog = (msg) =>
//         setLogs((prev) => [
//             ...prev,
//             { message: msg, timestamp: new Date().toLocaleTimeString() },
//         ]);

//     socket.on("scrape-started", ({ accountId }) => {
//         addLog(`Scraping started for account ${accountId}`);
//     });

//     socket.on("scrape-progress", ({ accountId, current, total, partner }) => {
//         addLog(`Scraping ${partner || "chat"} ( ${current}/${total}) for ${accountId}`);
//     });

//     socket.on("scrape-completed", ({ accountId }) => {
//         addLog(`Scraping completed for account ${accountId}`);
//         setLogsModalOpen(false);
//         dispatch(fetchMessages(activeConversation.id)); // fetch messages

//     });

//     socket.on("scrape-failed", ({ accountId, error }) => {
//         // alert('failed')
//         addLog(`Scraping failed for ${accountId}: ${error}`);
//     });


//     return () => {
//         socket.off("scrape-started");
//         socket.off("scrape-progress");
//         socket.off("scrape-completed");
//         socket.off("scrape-failed");
  
//     };
// }, [dispatch,activeConversation]);
useEffect(() => {
    scrollToBottom();
}, [messages]);
return (
    <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className="w-64 bg-gray-900 text-white border-r border-gray-700 overflow-y-auto">
            <h3 className="p-3 font-bold border-b border-gray-700">
                Conversations
            </h3>

            {loading && <p className="p-3 text-gray-400">Loading...</p>}
            {error && <p className="p-3 text-red-400">{error}</p>}

            {conversations.length > 0 ? (
                conversations
                    .filter(
                        (conv) =>
                            conv && conv.id !== null && conv.id !== undefined && conv.chat_partner
                    )
                    .map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => handleConversationClick(conv)}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${activeConversation?.id === conv.id ? "bg-gray-700" : ""
                                }`}
                        >
                            <p className="font-semibold">{conv.chat_partner}</p>
                        </div>
                    ))
            ) : (
                <p className="p-3 text-gray-400">No conversations yet.</p>
            )}

        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-800">
            {/* Header */}
            <div className="p-3 border-b border-gray-700 text-white font-bold">
                {activeConversation
                    ? <> <span>{activeConversation.chat_partner}</span>
                        <button
                            onClick={() => handleScrape(id, activeConversation.chat_url)}
                            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
                        >
                            Scrape Chats
                        </button></>
                    : "Select a conversation"}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-white"  >
                {!activeConversation ? (
                    <p className="text-gray-400">Choose a conversation to view messages.</p>
                ) : loading ? (
                    <p className="text-gray-400">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-400">No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div

                            key={msg.id}
                            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`px-3 py-2  break-words whitespace-pre-wrap rounded-lg max-w-xs ${msg.sender === "You"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-600 text-white"
                                    }`}
                            >
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />

            </div>

            {/* Input */}
            {activeConversation && (
                <form
                    onSubmit={handleSend}
                    className="p-3 border-t border-gray-700 flex gap-2"
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </form>
            )}
        </div>
        <LogsModal
            isOpen={logsModalOpen}
            onClose={() => setLogsModalOpen(false)}
            logs={logs}
        />
    </div>
);
}

export default FBChat;
