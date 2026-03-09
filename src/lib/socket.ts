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

  // Try to read the deployment URL first. When deploying the
  // frontend separately from the realtime server we require the
  // variable to be set on Vercel (or whichever host) so the client
  // knows where to connect. In local development we fall back to
  // localhost, and we can also derive a URL from the current origin
  // if the user forgot to configure the env var.
  let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";

  if (!socketUrl) {
    if (typeof window !== "undefined") {
      // derive from current location assuming the socket server is
      // running on port 3001; this allows `npm run dev` to work
      // without an env file and gives a helpful warning in prod.
      const { protocol, host } = window.location;
      // keep hostname, replace port if one is present
      const hostname = host.replace(/:\d+$/, "");
      socketUrl = `${protocol}//${hostname}:3001`;
    } else {
      socketUrl = "http://localhost:3001"; // server-side fallback
    }
    console.warn(
      "⚠️ NEXT_PUBLIC_SOCKET_URL not set, using",
      socketUrl,
      "– make sure to configure this in production"
    );
  }

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
