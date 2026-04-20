"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { candidateAPI } from "@/lib/api";
import { Card, Badge, Btn, Skel, PageHdr, Avatar } from "@/components/ui";
import { Calendar, User, Clock, Link as LinkIcon, Zap, FileText, CheckCircle, Video, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CandidateSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    candidateAPI.getMySessions({ limit: 50 })
      .then(res => setSessions(res.data?.data?.sessions || []))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <PageHdr title="Mentorship Discussions" />
      {[...Array(3)].map((_, i) => <Skel key={i} className="h-48 rounded-3xl" />)}
    </div>
  );

  const upcoming = sessions.filter(s => ["pending", "confirmed"].includes(s.status));
  const past = sessions.filter(s => !["pending", "confirmed"].includes(s.status));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <PageHdr title="Mentor Discussions" sub="Manage your 1:1 sessions, tracking links, and discussion notes." />

      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-amber" />
          <h2 className="text-lg font-bold text-white">Upcoming & Active</h2>
          <Badge variant="amber" className="ml-2">{upcoming.length}</Badge>
        </div>

        {upcoming.length === 0 ? (
          <Card className="p-12 border-dashed bg-transparent border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber/5 flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-amber" />
            </div>
            <h3 className="text-white font-bold mb-1">No Active Disucssions</h3>
            <p className="text-sm text-zinc-500">You don't have any upcoming sessions booked with a mentor.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcoming.map(s => <SessionCard key={s._id} session={s} />)}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      {past.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Past Sessions</h2>
          <div className="space-y-4">
            {past.map(s => <SessionCard key={s._id} session={s} isPast />)}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, isPast }) {
  const mentorName = session.mentor?.user?.name || "Unassigned Mentor";
  const statusColor = session.status === "confirmed" ? "green" : session.status === "pending" ? "amber" : "dim";

  return (
    <Card className={`p-0 overflow-hidden ${isPast ? 'opacity-70 bg-zinc-900/20' : 'bg-zinc-900/40 border-white/10 shadow-xl'}`}>
      {/* Header Area */}
      <div className="p-5 md:p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
             <Avatar name={mentorName} size="md" className="ring-2 ring-white/10" />
             <div>
                 <h3 className="font-bold text-white text-lg">{mentorName}</h3>
                 <p className="text-sm text-zinc-400 capitalize">{session.sessionType.replace("_", " ")} Session</p>
             </div>
         </div>
         <div className="flex items-center gap-3">
             <Badge variant={statusColor} className="px-3 py-1 font-bold">
                 {session.status.toUpperCase()}
             </Badge>
         </div>
      </div>

      {/* Body Area */}
      <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Column */}
          <div className="space-y-5">
              <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">Schedule</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                      <Clock size={16} className="text-amber" />
                      <div>
                          <p className="text-xs font-bold text-zinc-200">
                              {session.scheduledAt ? format(new Date(session.scheduledAt), "EEEE, MMM do yyyy") : "TBD"}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                              {session.scheduledAt ? format(new Date(session.scheduledAt), "h:mm a") : ""} • {session.durationMinutes} mins
                          </p>
                      </div>
                  </div>
              </div>
              
              <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">Discussion Topic</p>
                  <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-white/10 pl-3">
                      "{session.topic}"
                  </p>
              </div>
          </div>

          {/* Action / Links Column */}
          <div className="space-y-5">
              <div>
                 <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">Meeting Link</p>
                 {session.meetLink ? (
                    <a href={session.meetLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors group">
                        <div className="flex items-center gap-2">
                            <Video size={16} className="text-purple-400 group-hover:animate-pulse" />
                            <span className="text-xs font-bold text-purple-300">Join Video Room</span>
                        </div>
                        <LinkIcon size={14} className="text-purple-500" />
                    </a>
                 ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 border-dashed">
                        <LinkIcon size={14} className="text-zinc-600" />
                        <span className="text-xs text-zinc-500">Meeting link will appear here once confirmed.</span>
                    </div>
                 )}
              </div>

              <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-1">
                      <FileText size={10} /> Mentor Notes
                  </p>
                  <div className="p-4 rounded-xl bg-[#111] border border-white/5 relative min-h-[80px]">
                      {session.notes ? (
                          <p className="text-sm text-amber/90 leading-relaxed font-medium">
                              {session.notes}
                          </p>
                      ) : (
                          <p className="text-xs text-zinc-600 italic text-center mt-3">No notes provided by mentor yet.</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </Card>
  );
}
