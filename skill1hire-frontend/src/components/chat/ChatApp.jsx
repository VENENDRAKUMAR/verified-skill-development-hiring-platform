"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import {
  Send, Paperclip, X, Loader2, Search, UserPlus,
  ChevronRight, Sparkles, ArrowLeft, Check, CheckCheck,
} from "lucide-react";
import { chatAPI, messageAPI, uploadAPI, mentorAPI, candidateAPI } from "@/lib/api";
import { toast } from "sonner";
import { Btn, Spinner, Avatar } from "@/components/ui";

/* ── Time / Date helpers ─────────────────────────── */
const fmtTime = (d) => {
  const dt = new Date(d);
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const fmtDateSep = (d) => {
  const dt = new Date(d);
  const now = new Date();
  const diff = (new Date(now.toDateString()) - new Date(dt.toDateString())) / 86400000;
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return dt.toLocaleDateString([], { month: "short", day: "numeric", year: dt.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
};

const isSameDay = (a, b) => {
  const d1 = new Date(a), d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
};

/* ── Small helper ────────────────────────────────── */
const getRemote = (chat, userId) =>
  chat.participants?.find((p) => p._id !== userId);

/* ── Mentor Search Modal ─────────────────────────── */
function SearchModal({ onClose, onStartChat, userRole }) {
  const isMentor = userRole === "mentor";
  const searchLabel = isMentor ? "Find a Candidate" : "Find a Mentor";
  const searchSublabel = isMentor ? "Search by name" : "Search by name or skill";
  const [query, setQuery] = useState("");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => { loadResults(""); }, []);

  const loadResults = async (q) => {
    setLoading(true);
    try {
      let res;
      if (isMentor) {
        res = await candidateAPI.getAllCandidates({ search: q, limit: 20 });
        const data = res.data?.data;
        setMentors(Array.isArray(data) ? data : data?.candidates || []);
      } else {
        res = await mentorAPI.getAllMentors({ search: q, limit: 20 });
        const data = res.data?.data;
        setMentors(Array.isArray(data) ? data : data?.mentors || []);
      }
    } catch { toast.error(`Could not load ${isMentor ? "candidates" : "mentors"}`); }
    finally { setLoading(false); setInitialLoad(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
      >
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
                <Sparkles size={16} style={{ color: "var(--amber)" }} />
              </div>
              <div>
                <h3 className="font-black font-display text-base" style={{ color: "var(--text)" }}>{searchLabel}</h3>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{searchSublabel}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:bg-[rgba(255,255,255,0.05)]" style={{ color: "var(--text-3)" }}>
              <X size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); loadResults(e.target.value); }}
              placeholder={isMentor ? "Search candidates by name..." : "Search by name, skill, expertise..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
              style={{ background: "var(--bg-2)", color: "var(--text)", borderColor: "var(--border)" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && initialLoad ? (
            <div className="flex justify-center py-12"><Spinner size={28} /></div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12" style={{ color: "var(--text-3)" }}>
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No {isMentor ? "candidates" : "mentors"} found for "{query}"</p>
            </div>
          ) : (
            mentors.map((m) => {
              const userData = m.user || m;
              const name = userData.name || m.name || (isMentor ? "Candidate" : "Mentor");
              const avatar = userData.avatar || m.avatar;
              const skills = m.skills || m.expertise || [];
              const bio = m.bio || m.headline || m.tagline || "";
              const userId = userData._id || m._id;
              return (
                <button
                  key={userId}
                  onClick={() => onStartChat(userId, name)}
                  className="w-full text-left p-4 rounded-2xl transition-all group"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={name} src={avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{name}</p>
                        <ChevronRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--amber)" }} />
                      </div>
                      {bio && <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-3)" }}>{bio}</p>}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {skills.slice(0, 4).map((s, i) => (
                            <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--amber-dim)", color: "var(--amber)" }}>
                              {typeof s === "string" ? s : s.name || s}
                            </span>
                          ))}
                          {skills.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>
                              +{skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── WhatsApp-Style Message Bubble ───────────────── */
function MessageBubble({ msg, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} px-2 sm:px-4`}>
      <div
        className="relative max-w-[85%] sm:max-w-[65%] px-3 py-2 rounded-2xl text-sm group"
        style={isMine
          ? {
              background: "linear-gradient(135deg, #D4AF37, #b8962e)",
              color: "#000",
              borderBottomRightRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }
          : {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderBottomLeftRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }
        }
      >
        {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
        {msg.fileUrl && (
          <a href={msg.fileUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 mt-1 text-xs font-bold underline"
          >
            <Paperclip size={11} /> View Attachment
          </a>
        )}
        {/* Timestamp + Read ticks */}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] opacity-60">{fmtTime(msg.createdAt)}</span>
          {isMine && (
            msg.isRead
              ? <CheckCheck size={13} style={{ color: "#60a5fa" }} />
              : <Check size={13} className="opacity-50" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Date Separator ──────────────────────────────── */
function DateSeparator({ date }) {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="px-4 py-1 rounded-full text-[11px] font-semibold"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}
      >
        {fmtDateSep(date)}
      </span>
    </div>
  );
}

/* ── Main Chat App ───────────────────────────────── */
export default function ChatApp({ title = "Mentors & Chat" }) {
  const { user } = useAuth();
  const { socket, clearUnread } = useSocket();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [showMentorSearch, setShowMentorSearch] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const bottomRef = useRef(null);

  const isCandidate = user?.role === "candidate";
  const isMentor = user?.role === "mentor";
  const remoteBadge = isCandidate ? "Mentor" : isMentor ? "Candidate" : "User";

  useEffect(() => { fetchChats(); }, []);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await chatAPI.getChats();
      setChats(res.data.data.chats || []);
    } catch { /* silent */ }
    finally { setLoadingChats(false); }
  };

  const selectChat = async (chat) => {
    setActiveChat(chat);
    setMobileShowChat(true);
    clearUnread?.();
    try {
      const res = await messageAPI.getMessages(chat._id);
      setMessages(res.data.data.messages || []);
      socket?.emit("join_chat", chat._id);
      // Mark messages as read
      messageAPI.markAsRead(chat._id).catch(() => {});
    } catch { toast.error("Failed to load messages"); }
  };

  const startChatWithMentor = async (mentorUserId, mentorName) => {
    setShowMentorSearch(false);
    try {
      const res = await chatAPI.accessChat(mentorUserId);
      const chat = res.data.data.chat;
      setChats((prev) => {
        const exists = prev.find((c) => c._id === chat._id);
        return exists ? prev : [chat, ...prev];
      });
      selectChat(chat);
      toast.success(`Chat with ${mentorName} started!`);
    } catch { toast.error("Could not start chat"); }
  };

  // Incoming socket messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (activeChat && (msg.chat === activeChat._id || msg.chat?._id === activeChat._id)) {
        setMessages((prev) => [...prev, msg]);
        // Auto-mark as read since chat is open
        messageAPI.markAsRead(activeChat._id).catch(() => {});
      } else {
        fetchChats();
      }
    };
    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }, [socket, activeChat]);

  // Listen for read receipts
  useEffect(() => {
    if (!socket) return;
    const handler = ({ chatId, readBy }) => {
      if (activeChat && activeChat._id === chatId && readBy !== user?._id) {
        // Mark all my sent messages as read
        setMessages((prev) =>
          prev.map((m) => {
            const senderId = m.sender?._id || m.sender;
            return senderId === user?._id ? { ...m, isRead: true } : m;
          })
        );
      }
    };
    socket.on("messages_read", handler);
    return () => socket.off("messages_read", handler);
  }, [socket, activeChat, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !file) return;
    setSendingMsg(true);

    let fileUrl = "";
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const uRes = await uploadAPI.uploadFile(fd);
        fileUrl = uRes.data.data.url;
      } catch {
        toast.error("Upload failed");
        setSendingMsg(false);
        return;
      }
    }

    try {
      const res = await messageAPI.sendMessage(activeChat._id, input, fileUrl);
      setMessages((prev) => [...prev, res.data.data.message]);
      setInput("");
      setFile(null);
      fetchChats();
    } catch { toast.error("Failed to send"); }
    finally { setSendingMsg(false); }
  };

  const goBackToList = () => {
    setMobileShowChat(false);
    setActiveChat(null);
  };

  const remote = activeChat ? getRemote(activeChat, user?._id) : null;

  /* ── Sidebar (Chat List) ─────────────────────────── */
  const renderSidebar = () => (
    <div
      className={`
        ${mobileShowChat ? "hidden md:flex" : "flex"}
        w-full md:w-80 shrink-0 flex-col border-r
      `}
      style={{ borderColor: "var(--border)", background: "var(--bg-2)" }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-black font-display text-base" style={{ color: "var(--text)" }}>{title}</h2>
          <button
            onClick={() => setShowMentorSearch(true)}
            title="Find a mentor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
          >
            <UserPlus size={13} />
            <span className="hidden sm:inline">Find {isCandidate ? "Mentor" : "User"}</span>
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          Chat with {isCandidate ? "mentors" : "candidates"} • Share files securely
        </p>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loadingChats ? (
          <div className="flex justify-center py-12"><Spinner size={24} /></div>
        ) : chats.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
              <Sparkles size={24} style={{ color: "var(--amber)" }} />
            </div>
            <p className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>No conversations yet</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>Find a {isCandidate ? "mentor" : "user"} to get started</p>
            <button
              onClick={() => setShowMentorSearch(true)}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105"
              style={{ background: "var(--amber)", color: "#000" }}
            >
              Browse {isCandidate ? "Mentors" : "Users"}
            </button>
          </div>
        ) : (
          chats.map((c) => {
            const r = getRemote(c, user?._id);
            const isActive = activeChat?._id === c._id;
            return (
              <button
                key={c._id}
                onClick={() => selectChat(c)}
                className="w-full text-left p-3 sm:p-4 flex items-center gap-3 transition-all border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.03)",
                  background: isActive ? "rgba(245,158,11,0.08)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--amber)" : "3px solid transparent",
                }}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <Avatar name={r?.name || "?"} src={r?.avatar} size="sm" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: "#34d399", borderColor: "var(--bg-2)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{r?.name || "Unknown"}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
                    >
                      {remoteBadge}
                    </span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-3)" }}>
                    {c.latestMessage?.text || (c.latestMessage?.fileUrl ? "📎 Attachment" : "Start the conversation...")}
                  </p>
                </div>
                {/* Time */}
                {c.latestMessage?.createdAt && (
                  <span className="text-[10px] shrink-0 self-start mt-1" style={{ color: "var(--text-3)" }}>
                    {fmtTime(c.latestMessage.createdAt)}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  /* ── Chat Pane (Messages) ────────────────────────── */
  const renderChatPane = () => {
    if (!activeChat) {
      return (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: "var(--bg)" }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
            <Send size={32} style={{ color: "var(--amber)" }} />
          </div>
          <div>
            <h2 className="font-black font-display text-xl mb-1" style={{ color: "var(--text)" }}>Select a Conversation</h2>
            <p className="text-sm max-w-xs" style={{ color: "var(--text-3)" }}>
              Click on a chat from the left, or find a new {isCandidate ? "mentor" : "user"} to connect with.
            </p>
          </div>
          <button
            onClick={() => setShowMentorSearch(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: "var(--amber)", color: "#000" }}
          >
            <Search size={16} />
            Find a {isCandidate ? "Mentor" : "User"}
          </button>
        </div>
      );
    }

    return (
      <div className={`${mobileShowChat ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}>
        {/* Chat Header */}
        <div
          className="px-3 py-3 sm:px-5 sm:py-4 border-b flex items-center gap-3"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {/* Back button on mobile */}
          <button
            onClick={goBackToList}
            className="md:hidden p-1.5 rounded-xl transition-colors"
            style={{ color: "var(--text-2)" }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative shrink-0">
            <Avatar name={remote?.name || "?"} src={remote?.avatar} size="sm" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: "#34d399", borderColor: "var(--surface)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>{remote?.name || "User"}</p>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
              >
                {remoteBadge}
              </span>
            </div>
            <p className="text-xs" style={{ color: "#34d399" }}>Online</p>
          </div>
        </div>

        {/* Messages area with WhatsApp-style wallpaper */}
        <div
          className="flex-1 overflow-y-auto py-3 space-y-1"
          style={{
            background: "var(--bg)",
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.02) 0%, transparent 50%)",
          }}
        >
          {messages.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--text-3)" }}>
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
                <Send size={24} style={{ color: "var(--amber)" }} />
              </div>
              <p className="text-sm font-semibold">No messages yet</p>
              <p className="text-xs mt-1">Say hello! 👋</p>
            </div>
          )}
          {messages.map((m, i) => {
            const isMine = (m.sender?._id || m.sender) === user?._id;
            const showDateSep = i === 0 || !isSameDay(messages[i - 1]?.createdAt, m.createdAt);
            return (
              <div key={m._id || i}>
                {showDateSep && <DateSeparator date={m.createdAt} />}
                <MessageBubble msg={m} isMine={isMine} />
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="px-2 py-2 sm:px-4 sm:py-3 border-t" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          {file && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
              <Paperclip size={12} style={{ color: "var(--text-3)" }} />
              <span className="flex-1 truncate" style={{ color: "var(--text-2)" }}>{file.name}</span>
              <button onClick={() => setFile(null)} style={{ color: "#fca5a5" }}><X size={13} /></button>
            </div>
          )}
          <form onSubmit={sendMsg} className="flex items-center gap-2">
            <label className="p-2 sm:p-2.5 rounded-xl cursor-pointer transition-colors shrink-0 hover:bg-[rgba(255,255,255,0.05)]" style={{ color: "var(--text-3)" }}>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              <Paperclip size={18} />
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={sendingMsg}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm outline-none min-w-0"
              style={{ background: "var(--bg-2)", color: "var(--text)", border: "1px solid var(--border)" }}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg(e)}
            />
            <button
              type="submit"
              disabled={(!input.trim() && !file) || sendingMsg}
              className="p-2 sm:p-2.5 rounded-xl transition-all disabled:opacity-40 shrink-0 hover:scale-105"
              style={{ background: "var(--amber)", color: "#000" }}
            >
              {sendingMsg ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          height: "calc(100vh - 7rem)",
          minHeight: "500px",
        }}
      >
        {renderSidebar()}
        {renderChatPane()}
      </div>

      {showMentorSearch && (
        <SearchModal
          onClose={() => setShowMentorSearch(false)}
          onStartChat={startChatWithMentor}
          userRole={user?.role}
        />
      )}
    </>
  );
}
