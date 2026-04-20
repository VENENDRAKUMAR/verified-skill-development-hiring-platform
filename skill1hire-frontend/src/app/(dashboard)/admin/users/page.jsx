"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Progress } from "@/components/ui";
import {
  Search, ShieldCheck, Eye, Mail, Calendar, Hash, ChevronLeft, ChevronRight,
  X, Briefcase, Github, Linkedin, Globe, Award, BarChart3, MapPin, Phone,
  ExternalLink, Clock, TrendingUp, Zap, User, FileText, Star, Lock, Unlock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toggling, setToggling] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Drawer state
  const [drawer, setDrawer] = useState(null);
  const [drawerProfile, setDrawerProfile] = useState(null);
  const [drawerResults, setDrawerResults] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllUsers({ limit: 100, ...(roleFilter !== "all" && { role: roleFilter }) })
      .then(({ data }) => { setUsers(data?.data?.users || []); setLoading(false); setPage(1); });
  }, [roleFilter]);

  const toggle = async (u) => {
    setToggling(u._id);
    try {
      await adminAPI.toggleUserActive(u._id);
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isActive: !x.isActive } : x));
      toast.success(`${u.name} status updated!`);
    } catch { toast.error("Action failed"); }
    finally { setToggling(null); }
  };

  const openDrawer = async (u) => {
    setDrawer(u);
    setDrawerProfile(null);
    setDrawerResults([]);
    setDrawerLoading(true);
    try {
      const [profRes, resultsRes] = await Promise.all([
        adminAPI.getUserProfile(u._id),
        adminAPI.getUserAssessmentResults(u._id),
      ]);
      setDrawerProfile(profRes.data?.data?.profile);
      setDrawerResults(resultsRes.data?.data?.results || []);
    } catch (err) { console.error(err); }
    finally { setDrawerLoading(false); }
  };

  const filtered = useMemo(() => users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filtered.length / limit);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-4">
        <PageHdr title="Users Directory" sub={`${users.length} total accounts detected`} />
      </div>

      {/* SEARCH BAR */}
      <Card className="p-3 mb-4 shrink-0 bg-black/40 border-white/5 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber" />
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber/50 transition-all"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl overflow-x-auto">
            {["all", "candidate", "hr", "mentor"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${roleFilter === r ? "bg-amber text-black" : "text-zinc-500 hover:text-white"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* USER LIST */}
      <Card className="flex-1 overflow-hidden flex flex-col bg-zinc-900/20 border-white/5">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-4 space-y-3">{[...Array(6)].map((_, i) => <Skel key={i} className="h-16 rounded-2xl" />)}</div>
          ) : (
            <div className="divide-y divide-white/5">
              {paginated.map(u => (
                <div key={u._id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => openDrawer(u)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar src={u.profilePic} name={u.name} size="md" className="border border-white/10 group-hover:border-amber/50" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-white">{u.name}</p>
                        {u.isVerified && <ShieldCheck size={14} className="text-amber" />}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={u.role === 'hr' ? 'indigo' : u.role === 'admin' ? 'red' : u.role === 'mentor' ? 'purple' : 'amber'} className="hidden sm:block">{u.role}</Badge>
                    <Btn variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDrawer(u); }}><Eye size={16} /></Btn>
                    <Btn variant={u.isActive ? "secondary" : "amber"} size="sm" loading={toggling === u._id}
                      onClick={(e) => { e.stopPropagation(); toggle(u); }} className="min-w-[100px]">
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Btn>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="py-20 text-center text-zinc-600">No users found</div>}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between shrink-0">
          <p className="text-xs text-zinc-500">Page {page} of {totalPages || 1}</p>
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></Btn>
            <Btn variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></Btn>
          </div>
        </div>
      </Card>

      {/* ═══ FULL PROFILE DRAWER ═══ */}
      {drawer && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setDrawer(null)} />
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-screen z-50 w-full max-w-lg overflow-y-auto custom-scrollbar"
            style={{
              background: "rgba(13,13,19,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)",
              animation: "slideInRight 0.3s ease",
            }}>

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5"
              style={{ background: "rgba(13,13,19,0.95)", backdropFilter: "blur(16px)" }}>
              <h3 className="text-lg font-bold text-white font-display">User Profile</h3>
              <button onClick={() => setDrawer(null)}
                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            {drawerLoading ? (
              <div className="p-6 space-y-4">
                <Skel className="h-24 rounded-2xl" />
                <Skel className="h-40 rounded-2xl" />
                <Skel className="h-32 rounded-2xl" />
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* ── Profile Card ── */}
                <div className="text-center p-6 rounded-2xl relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)" }} />
                  <Avatar src={drawer.profilePic || drawerProfile?.avatarUrl} name={drawer.name}
                    className="w-20 h-20 mx-auto mb-4 ring-4 ring-amber/20" />
                  <h3 className="text-xl font-bold text-white mb-1">{drawer.name}</h3>
                  {drawerProfile?.headline && <p className="text-sm text-zinc-400 mb-3">{drawerProfile.headline}</p>}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant={drawer.role === 'hr' ? 'indigo' : drawer.role === 'admin' ? 'red' : drawer.role === 'mentor' ? 'purple' : 'amber'}>
                      {drawer.role}
                    </Badge>
                    {drawer.isVerified && <Badge variant="green" className="gap-1"><ShieldCheck size={11} /> Verified</Badge>}
                    <Badge variant={drawer.isActive ? "green" : "red"}>
                      {drawer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* ── Contact & Account Info ── */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Account Details</h4>
                  <InfoRow icon={Mail} label="Email" value={drawer.email} />
                  <InfoRow icon={Hash} label="User ID" value={drawer._id} mono />
                  <InfoRow icon={Calendar} label="Joined" value={drawer.createdAt ? formatDistanceToNow(new Date(drawer.createdAt), { addSuffix: true }) : "N/A"} />
                  {drawer.lastLogin && <InfoRow icon={Clock} label="Last Login" value={formatDistanceToNow(new Date(drawer.lastLogin), { addSuffix: true })} />}
                  {drawerProfile?.location && <InfoRow icon={MapPin} label="Location" value={drawerProfile.location} />}
                  {drawerProfile?.phone && <InfoRow icon={Phone} label="Phone" value={drawerProfile.phone} />}
                </div>

                {/* ── Bio ── */}
                {drawerProfile?.bio && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Bio</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{drawerProfile.bio}</p>
                  </div>
                )}

                {/* ── Candidate-specific: Scores ── */}
                {drawer.role === "candidate" && drawerProfile && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Performance</h4>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <MiniStat label="HireScore" value={`${drawerProfile.overallScore || 0}%`} icon={TrendingUp} color="amber" />
                      <MiniStat label="Tests Passed" value={drawerProfile.totalAssessmentsPassed || 0} icon={Zap} color="green" />
                      <MiniStat label="Completeness" value={`${drawerProfile.profileCompleteness || 0}%`} icon={Star} color="indigo" />
                    </div>
                    <Progress value={drawerProfile.profileCompleteness || 0} color="amber" label="Profile Completeness" />
                  </div>
                )}

                {/* ── Skills & Domains ── */}
                {drawerProfile?.skills?.length > 0 && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Skills & Domains</h4>
                    {drawerProfile.domains?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1.5">Domains</p>
                        <div className="flex flex-wrap gap-1.5">
                          {drawerProfile.domains.map(d => <Badge key={d._id} variant="indigo">{d.name}</Badge>)}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {drawerProfile.skills.map(s => <Badge key={s._id} variant="amber">{s.name}</Badge>)}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Social Links ── */}
                {drawerProfile?.socialLinks && Object.values(drawerProfile.socialLinks).some(v => v) && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Social Links</h4>
                    <div className="space-y-2">
                      {drawerProfile.socialLinks.linkedin && <SocialLink icon={Linkedin} label="LinkedIn" url={drawerProfile.socialLinks.linkedin} color="#0077b5" />}
                      {drawerProfile.socialLinks.github && <SocialLink icon={Github} label="GitHub" url={drawerProfile.socialLinks.github} color="#fff" />}
                      {drawerProfile.socialLinks.portfolio && <SocialLink icon={Globe} label="Portfolio" url={drawerProfile.socialLinks.portfolio} color="#f59e0b" />}
                    </div>
                  </div>
                )}

                {/* ── Resume ── */}
                {drawerProfile?.resumeUrl && (
                  <a href={drawerProfile.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all"
                    style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
                    <FileText size={18} className="text-amber" />
                    <span className="text-sm font-semibold text-amber flex-1">View Resume</span>
                    <ExternalLink size={14} className="text-amber/60" />
                  </a>
                )}

                {/* ── Assessment Results ── */}
                {drawerResults.length > 0 && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                      Assessment Results ({drawerResults.length})
                    </h4>
                    <div className="space-y-2">
                      {drawerResults.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{r.assessment?.title || "Unknown"}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {r.totalMarksObtained}/{r.totalMarks} marks • {r.percentageScore}%
                            </p>
                          </div>
                          <Badge variant={r.isPassed ? "green" : "red"} className="shrink-0 ml-2">
                            {r.isPassed ? "PASSED" : "FAILED"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Capstone Project ── */}
                {drawerProfile?.capstoneProject?.title && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Capstone Project</h4>
                      <Badge variant={drawerProfile.capstoneProject.status === "approved" ? "green" : drawerProfile.capstoneProject.status === "rejected" ? "red" : "amber"}>
                        {drawerProfile.capstoneProject.status?.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-1">{drawerProfile.capstoneProject.title}</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{drawerProfile.capstoneProject.description}</p>
                    
                    {/* Action Links */}
                    <div className="flex gap-2 mb-4">
                      {drawerProfile.capstoneProject.repoUrl && (
                        <a href={drawerProfile.capstoneProject.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Btn variant="secondary" size="sm" className="gap-1.5 px-3"><Github size={13} /> Code Repo</Btn>
                        </a>
                      )}
                      {drawerProfile.capstoneProject.liveUrl && (
                        <a href={drawerProfile.capstoneProject.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Btn variant="secondary" size="sm" className="gap-1.5 px-3"><ExternalLink size={13} /> Live Preview</Btn>
                        </a>
                      )}
                    </div>
                    
                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <Btn size="sm" variant={drawerProfile.capstoneProject.status === 'approved' ? "secondary" : "green"} 
                            className="flex-1"
                            onClick={async () => {
                                try {
                                    setDrawerLoading(true);
                                    await adminAPI.updateCapstoneStatus(drawer._id, { status: "approved" });
                                    setDrawerProfile(p => ({...p, capstoneProject: {...p.capstoneProject, status: "approved"}}));
                                    toast.success("Capstone Project Approved!");
                                } catch (e) { toast.error("Failed to approve"); }
                                finally { setDrawerLoading(false); }
                            }}>
                            <ShieldCheck size={14} className="mr-1"/> Approve
                        </Btn>
                        <Btn size="sm" variant={drawerProfile.capstoneProject.status === 'rejected' ? "secondary" : "danger"} 
                            className="flex-1"
                            onClick={async () => {
                                try {
                                    setDrawerLoading(true);
                                    await adminAPI.updateCapstoneStatus(drawer._id, { status: "rejected" });
                                    setDrawerProfile(p => ({...p, capstoneProject: {...p.capstoneProject, status: "rejected"}}));
                                    toast.success("Capstone Project Rejected");
                                } catch (e) { toast.error("Failed to reject"); }
                                finally { setDrawerLoading(false); }
                            }}>
                            <X size={14} className="mr-1"/> Reject
                        </Btn>
                    </div>
                  </div>
                )}

                {/* ── HR-specific ── */}
                {drawer.role === "hr" && drawerProfile && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Company Info</h4>
                    {drawerProfile.companyName && <InfoRow icon={Briefcase} label="Company" value={drawerProfile.companyName} />}
                    {drawerProfile.designation && <InfoRow icon={User} label="Designation" value={drawerProfile.designation} />}
                    {drawerProfile.companyWebsite && <InfoRow icon={Globe} label="Website" value={drawerProfile.companyWebsite} />}
                    {drawerProfile.plan && (
                      <div className="mt-3">
                        <Badge variant={drawerProfile.plan === "enterprise" ? "purple" : drawerProfile.plan === "pro" ? "indigo" : "dim"}>
                          {drawerProfile.plan.toUpperCase()} Plan
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Mentor-specific ── */}
                {drawer.role === "mentor" && drawerProfile && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Mentor Details</h4>
                    {drawerProfile.currentRole && <InfoRow icon={User} label="Role" value={drawerProfile.currentRole} />}
                    {drawerProfile.currentCompany && <InfoRow icon={Briefcase} label="Company" value={drawerProfile.currentCompany} />}
                    {drawerProfile.yearsOfExperience && <InfoRow icon={Clock} label="Experience" value={`${drawerProfile.yearsOfExperience} years`} />}
                    {drawerProfile.avgRating > 0 && <InfoRow icon={Star} label="Avg Rating" value={`${drawerProfile.avgRating} ⭐`} />}
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-2">
                  <Btn variant={drawer.isActive ? "danger" : "amber"} className="flex-1"
                    loading={toggling === drawer._id}
                    onClick={() => { toggle(drawer); setDrawer(prev => prev ? { ...prev, isActive: !prev.isActive } : null); }}>
                    {drawer.isActive ? <><Lock size={14} /> Deactivate</> : <><Unlock size={14} /> Activate</>}
                  </Btn>
                  <Btn variant="secondary" className="flex-1" onClick={() => setDrawer(null)}>
                    Close
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── Mini Components ── */
function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02]">
      <Icon size={14} className="text-amber shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p>
        <p className={`text-sm text-zinc-300 truncate ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, label, url, color }) {
  return (
    <a href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
        <Icon size={14} style={{ color }} />
      </div>
      <span className="text-sm text-zinc-400 flex-1 truncate group-hover:text-white transition-colors">{url}</span>
      <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
    </a>
  );
}

function MiniStat({ label, value, icon: Icon, color }) {
  const colors = {
    amber: "bg-amber/10 text-amber",
    green: "bg-green-500/10 text-green-500",
    indigo: "bg-indigo-500/10 text-indigo-400",
  };
  return (
    <div className={`p-3 rounded-xl text-center ${colors[color]}`} style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
      <Icon size={16} className="mx-auto mb-1" />
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  );
}