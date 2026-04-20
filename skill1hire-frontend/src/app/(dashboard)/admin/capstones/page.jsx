"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Badge, Btn, PageHdr, Skel, Avatar } from "@/components/ui";
import { Award, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";

export default function AdminCapstonesPage() {
  const [capstones, setCapstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    adminAPI.getCapstones()
      .then(({ data }) => setCapstones(data?.data?.capstones || []))
      .catch(() => toast.error("Failed to load capstones"))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (userId, approve) => {
    setUpdating(userId);
    const status = approve ? "approved" : "rejected";
    const feedback = approve ? "Capstone approved. Excellent work!" : "Please review and improve your capstone submission.";
    try {
      await adminAPI.updateCapstoneStatus(userId, { status, feedback });
      toast.success(`Capstone ${status}`);
      setCapstones(c => c.filter(x => x.user?._id !== userId));
    } catch { toast.error("Update failed"); }
    finally { setUpdating(null); }
  };

  if (loading) return (
    <div className="space-y-4">
      <PageHdr title="Capstone Projects" />
      {[...Array(3)].map((_, i) => <Skel key={i} className="h-28 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHdr title="Capstone Projects" sub={`${capstones.length} capstones pending review`} />

      {capstones.length === 0
        ? <Card className="p-16 text-center text-zinc-500 text-sm italic">All capstones have been reviewed!</Card>
        : (
        <div className="grid gap-4">
          {capstones.map(c => {
            const u = c.user || {};
            const cp = c.capstoneProject || {};
            return (
              <Card key={u._id} className="p-6 bg-zinc-900/30 border-white/5 hover:border-amber/20 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar src={u.avatar} name={u.name} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white truncate">{u.name}</h3>
                      <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                      {cp.title && <p className="text-sm text-amber mt-1 font-medium">{cp.title}</p>}
                    </div>
                  </div>
                  <Badge variant={cp.status === "approved" ? "green" : cp.status === "rejected" ? "red" : "amber"}>
                    {cp.status || "pending"}
                  </Badge>
                </div>

                {cp.description && (
                  <p className="text-xs text-zinc-400 mt-4 leading-relaxed line-clamp-2">{cp.description}</p>
                )}

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  {cp.liveUrl && (
                    <a href={cp.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors">
                      <ExternalLink size={12} /> Live Demo
                    </a>
                  )}
                  {cp.repoUrl && (
                    <a href={cp.repoUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <ExternalLink size={12} /> Repository
                    </a>
                  )}

                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => handleAction(u._id, true)}
                      disabled={updating === u._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber/10 text-amber rounded-xl text-xs font-bold hover:bg-amber hover:text-black transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(u._id, false)}
                      disabled={updating === u._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
