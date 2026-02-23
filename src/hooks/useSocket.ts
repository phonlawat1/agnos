"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initSocket, disconnectSocket } from "@/lib/socket";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const sock = initSocket();
    setSocket(sock);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return socket;
}
