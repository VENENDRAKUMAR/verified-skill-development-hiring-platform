"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { hrAPI } from "@/lib/api";
import { Card, Badge, Btn, PageHdr, Skel, Empty, Avatar } from "@/components/ui";
import {
  Briefcase, Users, PlusCircle, ShieldAlert, Eye, Clock,
  TrendingUp, ArrowRight, Zap, Activity, BarChart3, MapPin,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HRDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hrAPI.getMyJobs({ limit: 5 }).then(({ data }) => setJobs(data?.data?.jobs || [])),
      hrAPI.getProfile().then(({ data }) => setProfile(data?.data?.profile || data?.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalApps = jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0);
  const active = jobs.filter(j => j.status === "active").length;

  if (!user?.isVerified) return (
    <div><PageHdr title="HR Dashboard" />
      <Card className="p-16 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-amber/5 blur-[60px] pointer-events-none" />
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(245,158,11,0.1)" }}>
          <ShieldAlert size={28} style={{ color: "var(--amber)" }} />
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>Pending Verification</h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-2)" }}>Your HR account is under review. You can post jobs once verified by admin.</p>
      </Card>
    </div>
  );

  if (loading) return <div><PageHdr title="Dashboard" /><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <Skel key={i} className="h-28" />)}</div><Skel className="h-64" /></div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Hey {user?.name?.split(" ")[0]} 🏢</h1>
          <p className="text-zinc-500 text-sm mt-1">Your hiring pipeline at a glance</p>
        </div>
        <Link href="/hr/post-job">
          <Btn className="gap-2"><PlusCircle size={15} /> Post a Job</Btn>
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowStat label="Jobs Posted" value={jobs.length} icon={Briefcase} gradient="from-amber-500/20 to-orange-500/20" iconColor="text-amber" />
        <GlowStat label="Active Listings" value={active} icon={Eye} gradient="from-green-500/20 to-emerald-500/20" iconColor="text-green-500" />
        <GlowStat label="Total Applicants" value={totalApps} icon={Users} gradient="from-indigo-500/20 to-blue-500/20" iconColor="text-indigo-400" />
      </div>

      {/* ── Plan Usage Meter ── */}
      {profile && (
        <Card className="p-5 bg-zinc-900/40 border-white/5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber" />
                <h3 className="text-sm font-bold text-white">Plan Usage</h3>
                <Badge variant={profile.plan === "free" ? "amber" : "green"} className="uppercase text-[9px]">{profile.plan || "free"}</Badge>
              </div>
              {profile.plan === "free" && (
                <Link href="/hr/premium">
                  <button className="text-[10px] px-3 py-1.5 rounded-lg bg-amber/10 text-amber font-bold hover:bg-amber hover:text-black transition-all">
                    Upgrade Plan →
                  </button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <UsageMeter label="Jobs Posted" used={profile.totalJobsPosted || 0} limit={profile.plan === "enterprise" ? "∞" : profile.plan === "pro" ? 25 : 3} />
              <UsageMeter label="Candidate Views" used="—" limit={profile.plan === "enterprise" ? "∞" : profile.plan === "pro" ? 25 : 10} />
            </div>
          </div>
        </Card>
      )}

      {/* ── Pipeline Overview ── */}
      {jobs.length > 0 && (
        <Card className="p-5 bg-zinc-900/40 border-white/5 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <Activity size={16} className="text-indigo-400" /> Hiring Pipeline
          </h3>
          <div className="grid grid-cols-3 gap-3 relative z-10">
            <PipelineStat label="Active" count={active} color="bg-green-500" />
            <PipelineStat label="Closed" count={jobs.filter(j => j.status === "closed").length} color="bg-zinc-500" />
            <PipelineStat label="Draft" count={jobs.filter(j => j.status === "draft").length} color="bg-amber" />
          </div>
        </Card>
      )}

      {/* ── Jobs List ── */}
      <Card className="bg-zinc-900/20 border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Briefcase size={16} className="text-amber" /> Your Jobs
          </h2>
          <Link href="/hr/jobs"><Btn variant="ghost" size="sm">View all →</Btn></Link>
        </div>
        {jobs.length === 0 ? (
          <Empty icon={Briefcase} title="No jobs yet" cta={<Link href="/hr/post-job"><Btn>Post First Job</Btn></Link>} />
        ) : (
          <div className="divide-y divide-white/5">
            {jobs.map(job => (
              <div key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3 hover:bg-white/[0.02] transition-colors group">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white truncate group-hover:text-amber transition-colors">{job.title}</p>
                  <p className="text-xs mt-1 flex items-center gap-2 text-zinc-500">
                    <Clock size={10} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <Users size={10} />{job.applicationsCount || 0} applicants
                    {job.location && <><span className="w-1 h-1 rounded-full bg-zinc-700" /><MapPin size={10} />{job.location}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={job.status === "active" ? "green" : "dim"}>{job.status}</Badge>
                  <Link href={`/hr/jobs/${job._id}/applications`}>
                    <Btn variant="secondary" size="sm" className="gap-1.5"><Users size={12} /> View</Btn>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/hr/post-job" className="group">
          <Card className="p-5 bg-gradient-to-br from-amber/10 to-transparent border-white/5 group-hover:border-amber/30 transition-all">
            <Zap size={22} className="text-amber mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Post New Job</h3>
            <p className="text-[10px] text-zinc-500">Reach verified talent instantly</p>
          </Card>
        </Link>
        <Link href="/hr/settings" className="group">
          <Card className="p-5 bg-gradient-to-br from-indigo-500/10 to-transparent border-white/5 group-hover:border-indigo-500/30 transition-all">
            <BarChart3 size={22} className="text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Company Settings</h3>
            <p className="text-[10px] text-zinc-500">Update your company profile</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

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

function PipelineStat({ label, count, color }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
      <p className="text-lg font-bold text-white">{count}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function UsageMeter({ label, used, limit }) {
  const numUsed = typeof used === "number" ? used : 0;
  const numLimit = typeof limit === "number" ? limit : 100;
  const pct = limit === "∞" ? 10 : Math.min((numUsed / numLimit) * 100, 100);
  const isNear = pct >= 80;

  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-xs font-bold text-white">{used} / {limit}</p>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isNear ? "bg-red-500" : "bg-amber"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
