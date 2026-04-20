"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, Badge, PageHdr, Skel } from "@/components/ui";
import { adminAPI } from "@/lib/api";
import { Calendar, Clock, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getSessions()
      .then(({ data }) => setSessions(data?.data?.sessions || []))
      .catch(() => toast.error("Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <PageHdr title="Mentor Sessions" />
      {[...Array(4)].map((_, i) => <Skel key={i} className="h-20 rounded-2xl" />)}
    </div>
  );

  const statusColor = { scheduled: "amber", confirmed: "amber", completed: "green", cancelled: "red", pending: "purple", no_show: "red" };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHdr title="All Mentor Sessions" sub={`${sessions.length} sessions on the platform`} />

      {sessions.length === 0
        ? <Card className="p-16 text-center text-zinc-500 text-sm italic">No mentor sessions found.</Card>
        : (
        <div className="grid gap-3">
          {sessions.map(s => (
            <Card key={s._id} className="p-5 bg-zinc-900/30 border-white/5 hover:border-purple-500/20 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <Video size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white">
                      {s.mentor?.name || "Mentor"} → {s.candidate?.name || "Candidate"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
                      {s.scheduledAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {new Date(s.scheduledAt).toLocaleDateString()}
                        </span>
                      )}
                      {s.createdAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={statusColor[s.status] || "amber"}>{s.status || "pending"}</Badge>
              </div>
              {s.meetLink && (
                <a href={s.meetLink} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg mt-3 hover:bg-indigo-500/20 transition-colors">
                  <Video size={11} /> Join Meet
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
