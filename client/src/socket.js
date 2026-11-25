import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  throw new Error("VITE_BACKEND_URL is missing");
}

console.log("Connecting to backend:", URL);

const socket = io(URL, {
  transports: ["polling", "websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 60000,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

export default socket;