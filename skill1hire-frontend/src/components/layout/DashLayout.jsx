"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashLayout({ children }) {
  const { loading } = useAuth();
  const mainRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // useLayoutEffect prevents flickering and removeChild issues
  useLayoutEffect(() => {
    if (!loading && mainRef.current) {
      let ctx;
      const initGSAP = async () => {
        const { gsap } = await import("gsap");
        ctx = gsap.context(() => {
          gsap.fromTo(mainRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" }
          );
        }, mainRef);
      };

      initGSAP();
      return () => ctx && ctx.revert();
    }
  }, [loading, pathname]); // Re-animate on route change too

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-base animate-pulse" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border-2)", borderTopColor: "var(--amber)" }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--bg)" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 md:hidden border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-gray-400">
          <Menu size={20} />
        </button>
        <div className="font-bold text-sm">Dashboard</div>
      </div>

      {/* KEY is important here to force clean re-renders */}
      <main
        key={pathname}
        ref={mainRef}
        className="flex-1 min-h-screen min-w-0 md:pl-60"
      >
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}