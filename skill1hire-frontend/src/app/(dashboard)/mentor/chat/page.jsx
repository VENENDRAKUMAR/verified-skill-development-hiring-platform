"use client";
import ChatApp from "@/components/chat/ChatApp";

export default function MentorChatPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)]">Candidate Conversations 💬</h1>
        <p className="text-[var(--text-2)] mt-1">Communicate directly with registered talents, review files, and manage your private interactions.</p>
      </div>
      <ChatApp title="Active Candidates" />
    </div>
  );
}
