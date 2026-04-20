"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Empty, Tabs } from "@/components/ui";
import { 
  ShieldCheck, ShieldX, Github, ExternalLink, 
  Search, Users, Briefcase, GraduationCap, 
  Info, AlertCircle, CheckCircle2 
} from "lucide-react";
import { clsx } from "clsx";

export default function AdminVerify() {
  const [data, setData] = useState({ candidates: [], hrs: [], mentors: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("candidates");
  const [verifying, setVerifying] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, h, m] = await Promise.all([
        adminAPI.getPendingVerifications("candidate"),
        adminAPI.getPendingVerifications("hr"),
        adminAPI.getPendingVerifications("mentor")
      ]);
      setData({
        candidates: c.data?.data?.pending || [],
        hrs: h.data?.data?.pending || [],
        mentors: m.data?.data?.pending || []
      });
    } catch (err) {
      toast.error("Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (userId, approve) => {
    setVerifying(userId);
    try {
      await adminAPI.verifyUser(userId, { isVerified: approve });
      toast.success(approve ? "User Approved ✅" : "Verification Rejected");
      
      const remove = list => list.filter(u => {
        const currentId = u.user?._id || u._id;
        return currentId?.toString() !== userId?.toString();
      });

      setData(d => ({
        candidates: remove(d.candidates),
        hrs: remove(d.hrs),
        mentors: remove(d.mentors)
      }));
    } catch {
      toast.error("Action failed");
    } finally {
      setVerifying(null);
    }
  };

  // Filter list based on search
  const filteredList = useMemo(() => {
    const list = data[tab] || [];
    if (!searchTerm) return list;
    return list.filter(u => 
      u.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, tab, searchTerm]);

  const TABS = [
    { id: "candidates", label: "Candidates", count: data.candidates.length, icon: GraduationCap },
    { id: "hrs", label: "HR / Recruiters", count: data.hrs.length, icon: Briefcase },
    { id: "mentors", label: "Mentors", count: data.mentors.length, icon: Users },
  ];

  if (loading) return (
    <div className="space-y-6">
      <PageHdr title="Verifications" sub="Securing the platform..." />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <Skel key={i} className="h-24 rounded-3xl" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHdr 
          title="Trust & Safety" 
          sub={`${TABS.reduce((acc, curr) => acc + curr.count, 0)} pending review requests`} 
        />
        
        {/* Quick Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm w-full md:w-72 focus:outline-none focus:border-amber/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={(id) => { setTab(id); setExpanded(null); }} />

      {filteredList.length === 0 ? (
        <Empty 
          icon={CheckCircle2} 
          title="Queue is Clear" 
          desc={searchTerm ? "No users match your search." : "No pending verification requests at the moment."} 
        />
      ) : (
        <div className="space-y-3">
          {filteredList.map(u => {
            const id = u.user?._id || u._id;
            const isOpen = expanded === id;
            
            return (
              <Card key={id} className={clsx(
                "overflow-hidden transition-all duration-300 border-white/5",
                isOpen ? "ring-1 ring-amber/20 bg-zinc-900/40" : "bg-zinc-900/20 hover:border-white/10"
              )}>
                {/* Collapsed Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-4">
                  <div 
                    className="flex items-center gap-4 cursor-pointer group flex-1" 
                    onClick={() => setExpanded(isOpen ? null : id)}
                  >
                    <Avatar name={u.user?.name} src={u.user?.avatar} size="md" className="rounded-2xl" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white group-hover:text-amber transition-colors">{u.user?.name || "Anonymous User"}</p>
                        {u.overallScore > 80 && <Badge variant="amber" className="text-[9px] py-0">High Potential</Badge>}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{u.user?.email} {u.companyName ? ` • ${u.companyName}` : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-white/5">
                    <Btn 
                      variant="danger" 
                      size="sm" 
                      className="rounded-xl px-4"
                      onClick={(e) => { e.stopPropagation(); verify(id, false); }}
                    >
                      <ShieldX size={14} className="mr-1.5" /> Reject
                    </Btn>
                    <Btn 
                      size="sm" 
                      className="rounded-xl px-4 bg-amber text-black hover:bg-amber-400"
                      loading={verifying === id}
                      onClick={(e) => { e.stopPropagation(); verify(id, true); }}
                    >
                      <ShieldCheck size={14} className="mr-1.5" /> Approve
                    </Btn>
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-white/5 mb-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Stats & Info */}
                      <div className="md:col-span-4 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <Info size={12} /> Performance Matrix
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <StatBox label="HireScore" value={`${u.overallScore || 0}%`} sub="Verified" />
                          <StatBox label="Assessments" value={u.totalAssessmentsPassed || 0} sub="Passed" />
                        </div>
                        {u.location && (
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-zinc-500 uppercase">Location</p>
                            <p className="text-sm font-medium text-zinc-300">{u.location}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Bio & Capstone */}
                      <div className="md:col-span-8 space-y-4">
                         <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Professional Bio</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed italic bg-zinc-800/30 p-4 rounded-2xl border border-white/5">
                              "{u.bio || "No professional bio provided by the user."}"
                            </p>
                         </div>

                         {u.capstoneProject?.title && (
                           <div className="p-4 rounded-2xl border border-amber/10 bg-amber/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber">Capstone Project</h4>
                                <Badge variant="dim" className="text-[9px]">{u.capstoneProject.status}</Badge>
                              </div>
                              <p className="font-bold text-white text-sm">{u.capstoneProject.title}</p>
                              <div className="flex gap-2">
                                {u.capstoneProject.repoUrl && (
                                  <a href={u.capstoneProject.repoUrl} target="_blank">
                                    <Btn variant="secondary" size="xs" className="text-[10px] py-1 px-3 bg-zinc-800"><Github size={12} className="mr-1" /> Source</Btn>
                                  </a>
                                )}
                                {u.capstoneProject.liveUrl && (
                                  <a href={u.capstoneProject.liveUrl} target="_blank">
                                    <Btn variant="secondary" size="xs" className="text-[10px] py-1 px-3 bg-zinc-800"><ExternalLink size={12} className="mr-1" /> Demo</Btn>
                                  </a>
                                )}
                              </div>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Small Component for Stats
function StatBox({ label, value, sub }) {
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
      <p className="text-[10px] text-zinc-500 uppercase">{label}</p>
      <p className="text-lg font-black text-amber">{value}</p>
      <p className="text-[8px] text-zinc-600 uppercase font-bold">{sub}</p>
    </div>
  );
}