// // src/socket.js
// import { io } from "socket.io-client";
// import CONFIG from "./constants/config";
// export const socket = io(CONFIG.BASE_URL, {
//   transports: ["websocket"], // force websocket
// });

// src/socket.js
import { io } from "socket.io-client";
import CONFIG from "./constants/config";

let socket;

export function connectSocket() {
  if (!socket || !socket.connected) {
    socket = io(CONFIG.BASE_URL, {
      transports: ["websocket"],
      autoConnect: false, // don't connect immediately
    });
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

export function getSocket() {
  return socket;
}
