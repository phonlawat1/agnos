import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Initialize Socket.io connection
 * Connects to the Socket.io server for real-time patient data synchronization
 *
 * Environment variable: NEXT_PUBLIC_SOCKET_URL (default: http://localhost:3001)
 */
export const initSocket = () => {
  if (socket) return socket;

  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

  console.log(`🔌 Connecting to Socket.io server at ${socketUrl}`);

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✓ Socket.io connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("✗ Socket.io disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting Socket.io...");
    socket.disconnect();
    socket = null;
  }
};
