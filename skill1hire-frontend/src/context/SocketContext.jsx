"use client";
import { useEffect, useState, createContext, useContext } from "react";
import io from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const newSocket = io(apiUrl.replace("/api/v1", ""), {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      newSocket.emit("join_user", user._id);
    });

    newSocket.on("notification", (msg) => {
      // Instagram-style badge mapping (increment count)
      setUnreadCount((prev) => prev + 1);
      
      // Dispatch toast
      toast.success(`New message from ${msg.sender?.name || "someone"}`, {
        icon: "💬",
      });
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const clearUnread = () => setUnreadCount(0);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, clearUnread }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
