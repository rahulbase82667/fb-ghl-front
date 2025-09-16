import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchConversations,
    setActiveConversation,
    fetchMessages,
    addMessage,
} from "../redux/slices/chatsSlice";

function FBChat() {
    const { id } = useParams(); // FB account id
    const dispatch = useDispatch();
    const { conversations, activeConversation, messages, loading, error } =
        useSelector((state) => state.chats);
    const messagesEndRef = useRef(null);
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
                        ? `Chat with ${activeConversation.chat_partner}`
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
        </div>
    );
}

export default FBChat;
