"use client";
import ChatApp from "@/components/chat/ChatApp";

export default function CandidateChatPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)]">Mentors & Chat 💬</h1>
        <p className="text-[var(--text-2)] mt-1">Chat directly with your assigned mentors and securely share encrypted files.</p>
      </div>
      <ChatApp title="Your Mentors" />
    </div>
  );
}
