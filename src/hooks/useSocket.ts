"use client";

import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { initSocket, disconnectSocket } from "@/lib/socket";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const sock = initSocket();
    setSocket(sock);

    // Track connection state
    const handleConnect = () => {
      console.log("✓ Client: Socket connected, ready for events");
      setIsConnected(true);
    };
    const handleDisconnect = () => {
      console.log("✗ Client: Socket disconnected");
      setIsConnected(false);
    };

    if (sock) {
      sock.on("connect", handleConnect);
      sock.on("disconnect", handleDisconnect);

      if (sock.connected) {
        console.log("✓ Socket already connected");
        setIsConnected(true);
      }
    }

    return () => {
      if (sock) {
        sock.off("connect", handleConnect);
        sock.off("disconnect", handleDisconnect);
      }
    };
  }, []);

  return socket;
}

/**
 * Hook to listen to a specific socket event and call a callback
 * Handles automatic cleanup of listeners
 */
export function useSocketListener<T = any>(
  eventName: string,
  callback: (data: T) => void
): void {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);
}
