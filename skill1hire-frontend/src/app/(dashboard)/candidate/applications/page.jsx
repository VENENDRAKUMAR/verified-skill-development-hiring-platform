"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Badge, Btn, PageHdr, Empty, Skel, Tabs } from "@/components/ui";
import { 
  FileText, MapPin, Trash2, Clock, CheckCircle, 
  XCircle, Calendar, ChevronLeft, ChevronRight, Briefcase, 
  ArrowUpRight, AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";

const S = { 
  applied: { v: "dim", icon: Clock, label: "Applied", color: "text-zinc-400" }, 
  shortlisted: { v: "indigo", icon: CheckCircle, label: "Shortlisted", color: "text-indigo-400" }, 
  interview_scheduled: { v: "amber", icon: Calendar, label: "Interview", color: "text-amber-400" }, 
  offered: { v: "green", icon: CheckCircle, label: "Offered", color: "text-green-400" }, 
  hired: { v: "green", icon: CheckCircle, label: "Hired", color: "text-green-500" }, 
  rejected: { v: "red", icon: XCircle, label: "Rejected", color: "text-red-400" }, 
  withdrawn: { v: "dim", icon: XCircle, label: "Withdrawn", color: "text-zinc-500" } 
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [withdrawing, setWithdrawing] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    candidateAPI.getMyApplications().then(({ data }) => { 
      setApps(data?.data?.applications || []); 
      setLoading(false); 
    });
  }, []);

  const withdraw = async (id) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    setWithdrawing(id);
    try {
      await candidateAPI.withdrawApplication(id);
      setApps(a => a.map(x => x._id === id ? { ...x, status: "withdrawn" } : x));
      toast.success("Application withdrawn successfully");
    } catch (err) { toast.error(err.response?.data?.message || "Action failed"); }
    finally { setWithdrawing(null); }
  };

  // Filtering Logic
  const filtered = useMemo(() => {
    let list = apps;
    if (tab === "active") list = apps.filter(a => ["applied","shortlisted","interview_scheduled"].includes(a.status));
    if (tab === "offers") list = apps.filter(a => ["offered","hired"].includes(a.status));
    if (tab === "closed") list = apps.filter(a => ["rejected","withdrawn"].includes(a.status));
    return list;
  }, [apps, tab]);

  // Internal Pagination
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * limit, page * limit);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / limit);

  const TABS = [
    { id: "all", label: "All History", count: apps.length },
    { id: "active", label: "In Progress", count: apps.filter(a => ["applied","shortlisted","interview_scheduled"].includes(a.status)).length },
    { id: "offers", label: "Offers", count: apps.filter(a => ["offered","hired"].includes(a.status)).length },
  ];

  if (loading) return (
    <div className="space-y-6">
      <PageHdr title="Applications" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skel key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <Skel key={i} className="h-20 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <PageHdr title="My Applications" sub="Track your journey with top companies" />

      {/* 1. Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active" count={TABS[1].count} icon={Clock} color="amber" />
        <StatCard title="Offers" count={TABS[2].count} icon={Trophy} color="green" />
        <StatCard title="Success Rate" count={`${apps.length ? Math.round((TABS[2].count / apps.length) * 100) : 0}%`} icon={ArrowUpRight} color="indigo" />
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5">
        <Tabs tabs={TABS} active={tab} onChange={(t) => { setTab(t); setPage(1); }} />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Showing {paginated.length} of {filtered.length} Applications
        </p>
      </div>

      {/* 3. Applications List */}
      {filtered.length === 0 ? (
        <Empty 
          icon={Briefcase} 
          title="No applications found" 
          desc="You haven't applied to any jobs in this category yet." 
          cta={<Btn onClick={() => window.location.href = "/candidate/jobs"}>Explore Jobs</Btn>} 
        />
      ) : (
        <div className="space-y-3 min-h-[400px]">
          {paginated.map(app => {
            const st = S[app.status] || S.applied;
            const StatusIcon = st.icon;
            
            return (
              <Card key={app._id} className="p-4 bg-zinc-900/20 border-white/5 hover:border-white/10 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileText size={20} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-amber transition-colors">
                        {app.job?.title || "Position"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                           <MapPin size={12} /> {app.job?.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                           <Calendar size={12} /> Applied {formatDistanceToNow(new Date(app.appliedAt || Date.now()), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <div className="flex flex-col items-end">
                       <Badge variant={st.v} className="capitalize py-1 px-3">
                         <StatusIcon size={12} className="mr-1.5" /> {st.label}
                       </Badge>
                    </div>
                    
                    {["applied","shortlisted"].includes(app.status) ? (
                      <button 
                        disabled={withdrawing === app._id}
                        onClick={() => withdraw(app._id)}
                        className="p-2.5 rounded-xl bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Withdraw"
                      >
                        {withdrawing === app._id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full" /> : <Trash2 size={18} />}
                      </button>
                    ) : (
                      <div className="w-10 h-10" /> // Spacer
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={clsx(
                  "w-10 h-10 rounded-xl font-bold text-xs transition-all border",
                  page === i + 1 ? "bg-amber border-amber text-black" : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Stat Card Component
function StatCard({ title, count, icon: Icon, color }) {
  const colors = {
    amber: "bg-amber/10 text-amber border-amber/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <Card className="p-5 bg-zinc-900/40 border-white/5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-white">{count}</p>
        </div>
      </div>
    </Card>
  );
}

function Trophy(props) {
  return <Briefcase {...props} />; // Placeholder for trophy icon
}