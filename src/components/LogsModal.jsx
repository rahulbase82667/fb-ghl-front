// src/components/LogsModal.jsx
import React from "react";

function LogsModal({ isOpen, onClose, logs = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-3/4 max-w-2xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-lg font-semibold text-green-400">Logs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Logs List */}
        <div className="h-80 overflow-y-auto space-y-2 text-sm font-mono bg-gray-800 p-3 rounded">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <p key={idx} className="text-gray-200">
                <span className="text-green-500">[{log.timestamp}]</span>{" "}
                {log.message}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No logs yet...</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogsModal;
