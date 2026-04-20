"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, StatCard, Btn, Badge, Avatar, PageHdr, Skel } from "@/components/ui";
import {
  Users, Briefcase, ShieldCheck, Layers, CheckCircle, XCircle,
  BarChart3, Clock, ArrowRight, TrendingUp, Zap, Activity,
  UserPlus, Eye, Award, Star, FileCheck, Notebook, FileText
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pending, setPending] = useState({ candidates: [], hrs: [] });
  const [capstones, setCapstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(), 
      adminAPI.getPendingVerifications("candidate"), 
      adminAPI.getPendingVerifications("hr"),
      adminAPI.getAnalytics(),
      adminAPI.getCapstones()
    ])
      .then(([d, c, h, a, cap]) => {
        setStats(d.data?.data?.stats);
        setAnalytics(a.data?.data);
        setPending({
          candidates: (c.data?.data?.pending || []).slice(0, 5),
          hrs: (h.data?.data?.pending || []).slice(0, 5),
        });
        setCapstones((cap.data?.data?.capstones || []).slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const verify = async (id, approve) => {
    setVerifying(id);
    try {
      await adminAPI.verifyUser(id, { isVerified: approve });
      toast.success(approve ? "Approved!" : "Rejected");
      setPending(p => ({
        candidates: p.candidates.filter(u => (u.user?._id || u._id) !== id),
        hrs: p.hrs.filter(u => (u.user?._id || u._id) !== id),
      }));
    } catch { toast.error("Action failed"); }
    finally { setVerifying(null); }
  };

  const updateCapstone = async (userId, approve) => {
    setVerifying(userId);
    const status = approve ? "approved" : "rejected";
    try {
      await adminAPI.updateCapstoneStatus(userId, status, approve ? "Capstone looks excellent." : "Missing requirement criteria. Please review.");
      toast.success(`Capstone ${status}`);
      setCapstones(c => c.filter(x => x.user?._id !== userId));
    } catch { toast.error("Capstone update failed"); }
    finally { setVerifying(null); }
  };

  if (loading) return (
    <div className="space-y-6">
      <PageHdr title="Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skel key={i} className="h-32 rounded-3xl" />)}</div>
    </div>
  );

  const totalUsers = (stats?.totalCandidates || 0) + (stats?.totalHRs || 0) + (stats?.totalMentors || 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">System overview and pending actions</p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-zinc-400 font-medium">Platform Online</span>
        </div>
      </div>

      {/* ── Stat Cards with Gradient Glows ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <GlowStat label="Total Users" value={totalUsers} icon={Users} gradient="from-amber-500/20 to-orange-500/20" iconColor="text-amber" />
        <GlowStat label="Total Hires" value={analytics?.totalHires || 0} icon={Award} gradient="from-purple-500/20 to-pink-500/20" iconColor="text-purple-400" />
        <GlowStat label="Active Jobs" value={stats?.activeJobs || 0} icon={Briefcase} gradient="from-indigo-500/20 to-blue-500/20" iconColor="text-indigo-400" />
        <GlowStat label="Applications" value={analytics?.totalApplications || 0} icon={Layers} gradient="from-emerald-500/20 to-green-500/20" iconColor="text-emerald-400" />
        <GlowStat label="Shortlisted" value={analytics?.shortlisted || 0} icon={TrendingUp} gradient="from-rose-500/20 to-pink-500/20" iconColor="text-rose-400" />
        <GlowStat label="Interviewed" value={analytics?.interviewed || 0} icon={CheckCircle} gradient="from-cyan-500/20 to-teal-500/20" iconColor="text-cyan-400" />
        <GlowStat label="Assessments Done" value={analytics?.assessmentsCompleted || 0} icon={FileCheck} gradient="from-blue-500/20 to-indigo-500/20" iconColor="text-blue-400" />
        <GlowStat label="Assignments Given" value={analytics?.assignmentsGiven || 0} icon={Notebook} gradient="from-orange-500/20 to-amber-500/20" iconColor="text-orange-400" />
      </div>

      {/* ── Role Breakdown ── */}
      <Card className="p-5 bg-zinc-900/40 border-white/5 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber/5 blur-[100px] rounded-full pointer-events-none" />
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-amber" /> User Breakdown by Role
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <RoleBar label="Candidates" count={stats?.totalCandidates || 0} total={totalUsers} color="bg-amber" />
          <RoleBar label="HRs" count={stats?.totalHRs || 0} total={totalUsers} color="bg-indigo-500" />
          <RoleBar label="Mentors" count={stats?.totalMentors || 0} total={totalUsers} color="bg-purple-500" />
        </div>
      </Card>

      {/* ── Pending Verifications & Capstones ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <PendingCard items={pending.candidates} title="Candidate Verifications" verify={verify} verifying={verifying} />
        <PendingCard items={pending.hrs} title="HR Account Requests" verify={verify} verifying={verifying} />
        
        {/* Capstone Review Card */}
        <Card className="bg-zinc-900/20 border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2"><Star size={16} className="text-amber" /><h2 className="text-sm font-bold text-white">Capstone Reviews</h2></div>
            <Badge variant="purple">{capstones.length}</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {capstones.length === 0 ? <div className="p-10 text-center text-zinc-600 text-xs font-medium italic">All capstones reviewed!</div> : capstones.map(c => {
              const u = c.user;
              return (
                <div key={u._id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={u.profilePic} name={u.name} size="sm" />
                    <div className="truncate">
                      <p className="text-sm font-bold text-zinc-200 truncate">{u.name}</p>
                      <a href={c.capstoneProject?.liveUrl} target="_blank" className="text-[10px] text-indigo-400 hover:underline truncate bg-indigo-500/10 px-2 py-0.5 rounded">View Live</a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateCapstone(u._id, true)} className="p-2 bg-amber/10 text-amber rounded-lg hover:bg-amber hover:text-black transition-all"><CheckCircle size={16} /></button>
                    <button onClick={() => updateCapstone(u._id, false)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><XCircle size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="block p-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-t border-white/5">
            Pending Manual Approvals
          </div>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/users", icon: Users, label: "Manage Users", desc: "Audit and control accounts", gradient: "from-amber/10 to-transparent" },
          { href: "/admin/domains", icon: Layers, label: "Taxonomy", desc: "Manage skills and categories", gradient: "from-indigo-500/10 to-transparent" },
          { href: "/admin/assessments", icon: BarChart3, label: "Assessments", desc: "Manage test questions", gradient: "from-purple-500/10 to-transparent" },
        ].map(i => (
          <Link key={i.href} href={i.href} className="group">
            <Card className={`p-5 border-white/5 bg-gradient-to-br ${i.gradient} group-hover:border-amber/30 transition-all relative overflow-hidden`}>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/[0.02] group-hover:scale-150 transition-transform duration-500" />
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-3 text-amber group-hover:scale-110 transition-transform">
                <i.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{i.label}</h3>
              <p className="text-[10px] text-zinc-500">{i.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Components ── */
function GlowStat({ label, value, icon: Icon, gradient, iconColor }) {
  return (
    <Card className="relative overflow-hidden p-5 bg-zinc-900/40 border-white/5 hover:scale-[1.02] transition-transform">
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-2xl pointer-events-none`} />
      <div className="relative z-10">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-white/5 mb-3 ${iconColor}`}>
          <Icon size={20} />
        </div>
        <p className="text-2xl font-black text-white font-display">{value}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
      </div>
    </Card>
  );
}

function RoleBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        <span className="text-xs font-bold text-white">{count}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5">
        <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[9px] text-zinc-600 mt-1">{pct}% of total</p>
    </div>
  );
}

function PendingCard({ items, title, verify, verifying }) {
  return (
    <Card className="bg-zinc-900/20 border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2"><Clock size={16} className="text-amber" /><h2 className="text-sm font-bold text-white">{title}</h2></div>
        <Badge variant="amber">{items.length}</Badge>
      </div>
      <div className="divide-y divide-white/5">
        {items.length === 0 ? <div className="p-10 text-center text-zinc-600 text-xs font-medium italic">Everything clear!</div> : items.map(u => {
          const id = u.user?._id || u._id;
          return (
            <div key={id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={u.user?.profilePic} name={u.user?.name} size="sm" />
                <div className="truncate">
                  <p className="text-sm font-bold text-zinc-200 truncate">{u.user?.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{u.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => verify(id, true)} className="p-2 bg-amber/10 text-amber rounded-lg hover:bg-amber hover:text-black transition-all"><CheckCircle size={16} /></button>
                <button onClick={() => verify(id, false)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><XCircle size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/admin/verify" className="block p-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-amber border-t border-white/5 transition-colors">
        View All Verifications
      </Link>
    </Card>
  );
}