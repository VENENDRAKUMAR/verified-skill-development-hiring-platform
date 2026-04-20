"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function SSEListener() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Only connect to SSE if authenticated

    const token = localStorage.getItem("s1h-atk");
    if (!token) return;

    let eventSource;
    try {
      eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream?token=${token}`);

      eventSource.onopen = () => {
        console.log("🟢 SSE Connection established");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') return;
          
          // Telegram-feel pop-up via sonner
          toast(
            <div className="flex gap-4 p-2 bg-zinc-900 border-l-4 border-amber border-transparent rounded-r-lg w-full items-start">
              <div className="w-10 h-10 bg-amber/20 rounded-full flex items-center justify-center border border-amber/30 text-amber shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                ⚡
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white uppercase tracking-wider">{data.title}</p>
                <p className="mt-1 text-sm text-zinc-400 leading-snug">{data.message}</p>
              </div>
            </div>,
            { duration: 6000, unstyled: true } // unstyled leaves customization totally up to us
          );

          // Audio
          try {
            const audio = new Audio("https://cdn.freesound.org/previews/415/415083_6032230-lq.mp3");
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio play blocked by browser interaction policies"));
          } catch(e) {}

        } catch (err) {
          console.error("Error parsing SSE data", err);
        }
      };

      eventSource.onerror = (error) => {
        console.log("🟠 SSE error/disconnect", error);
      };

    } catch (err) {
      console.log("SSE Init Error", err);
    }

    return () => {
      console.log("🔴 Closing SSE Connection");
      if (eventSource) eventSource.close();
    };
  }, [user]);

  return null;
}
