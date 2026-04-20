"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { hrAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Empty, Tabs } from "@/components/ui";
import {
  ArrowLeft, ShieldCheck, Github, Linkedin,
  X, Crown, Lock, Zap, FileText, ExternalLink, Star
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SC = {
  applied: "dim", shortlisted: "indigo",
  interview_scheduled: "amber", offered: "green",
  hired: "green", rejected: "red",
};
const ACTIONS = ["shortlisted", "interview_scheduled", "offered", "hired", "rejected"];

// Plan config
const PLANS = {
  free:       { label: "Free",       color: "#a09eb8", limit: 10,       next: "pro" },
  pro:        { label: "Pro",        color: "#f59e0b", limit: 25,       next: "enterprise" },
  enterprise: { label: "Enterprise", color: "#34d399", limit: Infinity, next: null },
};

function PlanBadge({ plan }) {
  const p = PLANS[plan] || PLANS.free;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      style={{ background: `${p.color}14`, border: `1px solid ${p.color}30` }}>
      <Crown size={12} style={{ color: p.color }} />
      <span className="text-xs font-bold" style={{ color: p.color }}>{p.label}</span>
    </div>
  );
}

export default function HRApplications() {
  const { jobId } = useParams();
  const router    = useRouter();
  const [apps, setApps]       = useState([]);
  const [meta, setMeta]       = useState({ total: 0, lockedCount: 0, plan: "free", freeLimit: 10, proLimit: 25 });
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [tab, setTab]         = useState("all");

  useEffect(() => {
    hrAPI.getJobApplications(jobId).then(({ data }) => {
      const d = data?.data;
      setApps(d?.applications || []);
      setJob(d?.job);
      setMeta({
        total:       d?.total       || 0,
        lockedCount: d?.lockedCount || 0,
        plan:        d?.plan        || "free",
        freeLimit:   d?.freeLimit   || 10,
        proLimit:    d?.proLimit    || 25,
        isPremium:   d?.isPremium   || false,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [jobId]);

  const update = async (id, status) => {
    setUpdating(id);
    try {
      await hrAPI.updateApplication(id, { status });
      setApps(a => a.map(x => x._id === id ? { ...x, status } : x));
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      toast.success(`Marked as ${status.replace("_", " ")}`);
    } catch { toast.error("Failed"); }
    finally { setUpdating(null); }
  };

  const currentPlan = PLANS[meta.plan] || PLANS.free;
  const TABS = [
    { id: "all",         label: "All",         count: apps.length },
    { id: "applied",     label: "New",          count: apps.filter(a => a.status === "applied").length },
    { id: "shortlisted", label: "Shortlisted",  count: apps.filter(a => a.status === "shortlisted").length },
    { id: "offered",     label: "Offered",      count: apps.filter(a => ["offered","hired"].includes(a.status)).length },
  ];
  const filtered = tab === "all" ? apps
    : tab === "offered" ? apps.filter(a => ["offered","hired"].includes(a.status))
    : apps.filter(a => a.status === tab);

  if (loading) return (
    <div>
      <Skel className="h-12 mb-6" />
      <div className="space-y-3">{[...Array(5)].map((_, i) => <Skel key={i} className="h-20" />)}</div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-2)" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--text)" }}>
            {job?.title || "Job"} — Applications
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            {meta.total} total
            {meta.lockedCount > 0 && (
              <span style={{ color: "var(--amber)" }}> · {meta.lockedCount} locked</span>
            )}
          </p>
        </div>
        <PlanBadge plan={meta.plan} />
      </div>

      {/* Smart match banner */}
      {apps.length > 0 && (
        <div className="mb-5 p-3 rounded-2xl flex items-center gap-2"
          style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}>
          <Zap size={13} style={{ color: "#34d399" }} />
          <p className="text-xs font-medium" style={{ color: "#34d399" }}>
            Ranked by skill match score · best fit at top
          </p>
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className={`grid gap-5 ${selected ? "lg:grid-cols-5" : ""}`}>

        {/* ── List ── */}
        <div className={`space-y-2.5 ${selected ? "lg:col-span-2" : ""}`}>
          {filtered.length === 0 ? (
            <Empty icon={null} title="No applications yet" desc="Candidates appear here when they apply." />
          ) : filtered.map(app => (
            <Card key={app._id} hover onClick={() => setSelected(app)}
              className={`p-4 cursor-pointer ${selected?._id === app._id ? "!border-amber-500/30" : ""}`}>
              <div className="flex items-center gap-3">
                <Avatar name={app.candidate?.name || "?"} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                      {app.candidate?.name}
                    </p>
                    {app.candidate?.isVerified && (
                      <ShieldCheck size={12} style={{ color: "var(--amber)" }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      {formatDistanceToNow(new Date(app.appliedAt || Date.now()), { addSuffix: true })}
                    </p>
                    {app.matchScore !== undefined && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                        style={{
                          background: app.matchScore >= 70 ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.1)",
                          color: app.matchScore >= 70 ? "#34d399" : "var(--amber)",
                        }}>
                        {app.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={SC[app.status] || "dim"}>
                  {app.status?.replace("_", " ")}
                </Badge>
              </div>
            </Card>
          ))}

          {/* ── Plan upgrade wall ── */}
          {meta.lockedCount > 0 && (
            <div className="rounded-2xl overflow-hidden">
              {/* Blurred preview */}
              <div className="p-4 relative" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderBottom: "none" }}>
                <div className="space-y-2.5 select-none" style={{ filter: "blur(5px)", opacity: 0.35, pointerEvents: "none" }}>
                  {[...Array(Math.min(meta.lockedCount, 3))].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="w-8 h-8 rounded-xl shrink-0" style={{ background: "rgba(245,158,11,0.15)" }} />
                      <div className="flex-1">
                        <div className="h-2.5 rounded-full w-24 mb-1.5" style={{ background: "rgba(255,255,255,0.12)" }} />
                        <div className="h-2 rounded-full w-16" style={{ background: "rgba(255,255,255,0.07)" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={22} style={{ color: "var(--amber)" }} />
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="p-5 text-center"
                style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Crown size={22} className="mx-auto mb-2" style={{ color: "var(--amber)" }} />
                <p className="font-display font-bold text-sm mb-1" style={{ color: "var(--text)" }}>
                  {meta.lockedCount} more candidates locked
                </p>
                <p className="text-xs mb-1.5" style={{ color: "var(--text-2)" }}>
                  You're on <strong style={{ color: currentPlan.color }}>{currentPlan.label}</strong> plan
                  ({meta.plan === "free" ? meta.freeLimit : meta.proLimit} candidates shown)
                </p>

                {/* Plan comparison */}
                <div className="grid grid-cols-3 gap-2 my-4 text-xs">
                  {[
                    { plan: "free",       limit: "10",       price: "₹0" },
                    { plan: "pro",        limit: "25",       price: "₹999/mo" },
                    { plan: "enterprise", limit: "Unlimited", price: "₹2499/mo" },
                  ].map(p => (
                    <div key={p.plan} className="p-2.5 rounded-xl text-center"
                      style={{
                        background: meta.plan === p.plan ? `${PLANS[p.plan].color}14` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${meta.plan === p.plan ? PLANS[p.plan].color + "40" : "var(--border)"}`,
                      }}>
                      <p className="font-bold capitalize" style={{ color: PLANS[p.plan].color }}>{p.plan}</p>
                      <p style={{ color: "var(--text-2)" }}>{p.limit} candidates</p>
                      <p className="font-semibold mt-0.5" style={{ color: "var(--text)" }}>{p.price}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] mb-3" style={{ color: "var(--text-3)" }}>
                  Contact admin to upgrade your plan
                </p>
                <Link href="/pricing">
                  <Btn size="sm" className="mx-auto">
                    <Crown size={12} /> View Premium Plans
                  </Btn>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Detail Panel ── */}
        {selected && (
          <div className="lg:col-span-3">
            <Card className="p-6 sticky top-6">
              {/* Candidate header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  {selected.candidateProfile?.avatarUrl
                    ? <img src={selected.candidateProfile.avatarUrl} alt=""
                        className="w-12 h-12 rounded-2xl object-cover" />
                    : <Avatar name={selected.candidate?.name || "?"} size="lg" />
                  }
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-display font-bold" style={{ color: "var(--text)" }}>
                        {selected.candidate?.name}
                      </h3>
                      {selected.candidate?.isVerified && (
                        <Badge variant="green"><ShieldCheck size={10} />Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-2)" }}>
                      {selected.candidateProfile?.headline || "Candidate"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                      {selected.candidate?.email}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: "var(--text-3)" }}>
                  <X size={17} />
                </button>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {selected.candidateProfile?.overallScore !== undefined && (
                  <div className="p-3.5 rounded-2xl text-center"
                    style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <p className="font-black text-2xl font-display" style={{ color: "var(--amber)" }}>
                      {selected.candidateProfile.overallScore}%
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>HireScore™</p>
                  </div>
                )}
                {selected.matchScore !== undefined && (
                  <div className="p-3.5 rounded-2xl text-center"
                    style={{
                      background: selected.matchScore >= 70 ? "rgba(52,211,153,0.08)" : "rgba(245,158,11,0.08)",
                      border: `1px solid ${selected.matchScore >= 70 ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.15)"}`,
                    }}>
                    <p className="font-black text-2xl font-display"
                      style={{ color: selected.matchScore >= 70 ? "#34d399" : "var(--amber)" }}>
                      {selected.matchScore}%
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Skill Match</p>
                  </div>
                )}
              </div>

              {/* Resume */}
              {selected.candidateProfile?.resumeUrl && (
                <div className="mb-4">
                  <a href={selected.candidateProfile.resumeUrl} target="_blank" rel="noreferrer">
                    <Btn variant="secondary" size="sm" className="w-full justify-center">
                      <FileText size={13} />Download Resume / CV
                      <ExternalLink size={11} />
                    </Btn>
                  </a>
                </div>
              )}

              {/* Public profile link */}
              {selected.candidateProfile?.publicSlug && (
                <div className="mb-4">
                  <a href={`/candidate/public/${selected.candidateProfile.publicSlug}`} target="_blank" rel="noreferrer">
                    <Btn variant="secondary" size="sm" className="w-full justify-center">
                      <ExternalLink size={13} />View Public Profile
                    </Btn>
                  </a>
                </div>
              )}

              {/* Social links */}
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.candidateProfile?.socialLinks?.github && (
                  <a href={selected.candidateProfile.socialLinks.github} target="_blank" rel="noreferrer">
                    <Btn variant="secondary" size="sm"><Github size={12} />GitHub</Btn>
                  </a>
                )}
                {selected.candidateProfile?.socialLinks?.linkedin && (
                  <a href={selected.candidateProfile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                    <Btn variant="secondary" size="sm"><Linkedin size={12} />LinkedIn</Btn>
                  </a>
                )}
              </div>

              {/* Skills */}
              {selected.candidateProfile?.skills?.length > 0 && (
                <div className="mb-5">
                  <p className="eyebrow mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.candidateProfile.skills.map(s => (
                      <Badge key={s._id || s} variant="indigo">{s.name || s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover letter */}
              {selected.coverLetter && (
                <div className="mb-5">
                  <p className="eyebrow mb-2">Cover Letter</p>
                  <p className="text-sm leading-relaxed p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-2)" }}>
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              {/* Capstone */}
              {selected.candidateProfile?.capstoneProject?.repoUrl && (
                <div className="mb-5">
                  <p className="eyebrow mb-2">Capstone Project</p>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                    {selected.candidateProfile.capstoneProject.title}
                  </p>
                  <div className="flex gap-2">
                    <a href={selected.candidateProfile.capstoneProject.repoUrl} target="_blank" rel="noreferrer">
                      <Btn variant="secondary" size="sm"><Github size={12} />Repo</Btn>
                    </a>
                    {selected.candidateProfile.capstoneProject.liveUrl && (
                      <a href={selected.candidateProfile.capstoneProject.liveUrl} target="_blank" rel="noreferrer">
                        <Btn variant="secondary" size="sm"><ExternalLink size={12} />Live</Btn>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Update status */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                <p className="eyebrow mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ACTIONS.map(s => (
                    <Btn key={s} size="sm"
                      variant={selected.status === s ? "primary" : "secondary"}
                      loading={updating === selected._id}
                      onClick={() => update(selected._id, s)}>
                      {s.replace("_", " ")}
                    </Btn>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}