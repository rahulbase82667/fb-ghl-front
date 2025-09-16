// src/socket.js
import { io } from "socket.io-client";
import CONFIG from "./constants/config";
export const socket = io(CONFIG.BASE_URL, {
  transports: ["websocket"], // force websocket
});
