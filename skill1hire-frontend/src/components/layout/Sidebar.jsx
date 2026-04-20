"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, User, Briefcase, BookOpen, Award, LogOut,
  ChevronRight, Users, Layers, Calendar, Star, Building2,
  PlusCircle, FileText, ShieldCheck, BarChart3, GraduationCap, X,
  Settings, Crown, Sun, Moon, MessageSquare
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useSocket } from "@/context/SocketContext";

const NAV = {
  candidate: [
    { href: "/candidate/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/candidate/profile", icon: User, label: "My Profile" },
    { href: "/candidate/assessments", icon: BookOpen, label: "Assessments" },
    { href: "/candidate/jobs", icon: Briefcase, label: "Job Feed" },
    { href: "/candidate/chat", icon: MessageSquare, label: "Mentors & Chat" },
    { href: "/candidate/applications", icon: FileText, label: "Applications" },
    { href: "/candidate/settings", icon: Settings, label: "Settings" },
  ],
  hr: [
    { href: "/hr/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/hr/post-job", icon: PlusCircle, label: "Post a Job" },
    { href: "/hr/jobs", icon: Briefcase, label: "My Jobs" },
    { href: "/hr/premium", icon: Crown, label: "Premium Plans" },
    { href: "/hr/settings", icon: Settings, label: "Settings" },
  ],
  mentor: [
    { href: "/mentor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/mentor/profile", icon: User, label: "Profile" },
    { href: "/mentor/chat", icon: MessageSquare, label: "Chat" },
    { href: "/mentor/sessions", icon: Calendar, label: "Sessions" },
    { href: "/mentor/settings", icon: Settings, label: "Settings" },
  ],
  admin: [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/jobs", icon: Briefcase, label: "Jobs" },
    { href: "/admin/capstones", icon: Award, label: "Capstones" },
    { href: "/admin/sessions", icon: Calendar, label: "Sessions" },
    { href: "/admin/verify", icon: ShieldCheck, label: "Verify" },
    { href: "/admin/domains", icon: Layers, label: "Domains" },
    { href: "/admin/assessments", icon: GraduationCap, label: "Assessments" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ],
};

const ROLE_COLOR = { candidate: "#f59e0b", hr: "#6366f1", mentor: "#a855f7", admin: "#ef4444" };

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  // Safe extraction matching Provider context logic
  const socketCtx = useSocket();
  const unreadCount = socketCtx?.unreadCount || 0;
  
  const links = NAV[user?.role] || [];
  const rc = ROLE_COLOR[user?.role] || "#f59e0b";
  const initials = (user?.name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          onClick={() => onClose()}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="fixed left-0 top-0 h-screen flex flex-col z-50"
        style={{
          width: 270,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "var(--bg)",
          borderRight: "1px solid var(--border)",
          boxShadow: isOpen ? "4px 0 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-full h-32 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${rc}22 0%, transparent 70%)`, filter: "blur(20px)" }} />
        </div>

        {/* ── Header: Logo + Close ── */}
        <div className="relative z-10 px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => onClose()}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm"
              style={{ background: "var(--amber)", color: "#050507", boxShadow: "0 0 20px rgba(245,158,11,0.2)" }}>
              S1
            </div>
            <span className="font-display font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
              Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
            </span>
          </Link>

          {/* Close button — plain, no preventDefault, just calls onClose */}
          <button
            type="button"
            onClick={() => onClose()}
            className="md:hidden flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── User Card ── */}
        <div className="relative z-10 mx-3 mt-3 mb-2 p-3.5 rounded-2xl" style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
        }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black font-display text-sm shrink-0 overflow-hidden"
              style={{ background: `${rc}18`, color: rc }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{user?.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5"
                style={{ background: `${rc}14`, color: rc }}>
                {user?.role}
              </span>
            </div>
          </div>
          {user?.isVerified && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl"
              style={{ background: "rgba(245,158,11,0.06)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.1)" }}>
              <ShieldCheck size={11} /><span className="font-semibold">Verified Profile</span>
            </div>
          )}
        </div>

        {/* ── Nav Links ── */}
        <nav className="relative z-10 flex-1 px-3 py-3 space-y-0.5 overflow-y-hidden">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (pathname.startsWith(href) && href !== `/${user?.role}/dashboard`);
            return (
              <Link key={href} href={href}
                className="sidebar-link group"
                onClick={() => onClose()}
                style={active ? {
                  background: `${rc}12`,
                  color: rc,
                  boxShadow: `inset 0 0 0 1px ${rc}18`,
                } : {}}>
                <Icon size={15} style={{ color: active ? rc : "var(--text-3)" }} className="shrink-0" />
                <span>{label}</span>
                
                {/* 🔴 Instagram-Style Unread Badge Check */}
                {(href === "/candidate/chat" || href === "/mentor/chat") && unreadCount > 0 && (
                   <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black pointer-events-none transition-transform animate-bounce">
                     {unreadCount}
                   </span>
                )}
                
                {active && !((href === "/candidate/chat" || href === "/mentor/chat") && unreadCount > 0) && (
                   <ChevronRight size={11} className="ml-auto" style={{ color: rc }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute bottom-0 left-1/2 w-32 h-16 rounded-full" style={{ transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)", filter: "blur(12px)" }} />
        </div>

        {/* ── Bottom Actions ── */}
        <div className="relative z-10 px-3 py-4 flex flex-col gap-1" style={{ borderTop: "1px solid var(--border)" }}>
          <button 
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "var(--text-3)" }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium"
            style={{ color: "var(--red)" }}>
            <LogOut size={15} /><span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ── Desktop: always visible ── */}
      <style jsx global>{`
        @media (min-width: 768px) {
          aside[class] {
            transform: translateX(0) !important;
            width: 240px !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </>
  );
}