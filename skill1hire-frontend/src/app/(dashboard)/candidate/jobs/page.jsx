"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, Btn, Badge, PageHdr, Skel, Avatar } from "@/components/ui";
import { 
  Briefcase, MapPin, Search, ShieldCheck, Building2, 
  Send, X, ChevronLeft, ChevronRight, IndianRupee, Clock
} from "lucide-react";
import { clsx } from "clsx";

const MODES = ["all", "remote", "onsite", "hybrid"];
const MODE_COLOR = { remote: "green", onsite: "indigo", hybrid: "purple" };

export default function JobFeed() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("all");
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState(false);
  const [cover, setCover] = useState("");
  const [showApply, setShowApply] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 8;

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching all for internal pagination or you can pass page to API
      const p = { limit: 100, ...(search && { search }), ...(mode !== "all" && { workMode: mode }) };
      const { data } = await candidateAPI.getJobFeed(p);
      const fetchedJobs = data?.data?.jobs || [];
      setJobs(fetchedJobs);
      
      // Auto-select first job on desktop
      if (fetchedJobs.length > 0 && !selected) {
        setSelected(fetchedJobs[0]);
      }
    } catch (err) {
      if (err.response?.status === 403) toast.error("Complete verification to unlock jobs");
    } finally { setLoading(false); }
  }, [search, mode]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // Internal Pagination Logic
  const paginatedJobs = useMemo(() => {
    return jobs.slice((page - 1) * limit, page * limit);
  }, [jobs, page]);

  const totalPages = Math.ceil(jobs.length / limit);

  const apply = async () => {
    setApplying(true);
    try {
      const token = document.cookie.split(";").find(c => c.trim().startsWith("accessToken="))?.split("=")[1];
      const res = await window.fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${selected._id}/apply`, {
        method: "POST", 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coverLetter: cover }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      toast.success("Application submitted! 🎉");
      setShowApply(false); setCover(""); loadJobs();
    } catch (err) { toast.error(err.message || "Failed to apply"); }
    finally { setApplying(false); }
  };

  if (!user?.isVerified) return (
    <div className="max-w-4xl mx-auto pt-10">
      <Card className="p-12 text-center bg-zinc-900/40 border-white/5 backdrop-blur-md">
        <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-amber/5">
          <ShieldCheck size={40} className="text-amber" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Verification Required</h3>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
          You need to be a verified developer to access the premium job feed. 
          Complete your profile and assessments now.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Btn onClick={() => window.location.href = "/candidate/assessments"} className="px-8">Take Assessments</Btn>
          <Btn variant="secondary" onClick={() => window.location.href = "/candidate/profile"}>Submit Capstone</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* 1. Header & Filters (Fixed) */}
      <div className="shrink-0 space-y-4 mb-4">
        <PageHdr title="Job Opportunities" sub={`Discover ${jobs.length} jobs matching your profile`} />
        
        <Card className="p-3 bg-black/40 border-white/5 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} 
              placeholder="Search roles, companies or skills..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber/50 transition-all"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl self-stretch overflow-x-auto">
            {MODES.map(m => (
              <button key={m} onClick={() => {setMode(m); setPage(1);}}
                className={clsx(
                  "px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap",
                  mode === m ? "bg-amber text-black" : "text-zinc-500 hover:text-white"
                )}>
                {m}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. Split View (Scrollable List | Sticky Detail) */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Side: Job List */}
        <div className="w-full lg:w-[400px] flex flex-col h-full">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => <Skel key={i} className="h-32 rounded-2xl" />)
            ) : paginatedJobs.length === 0 ? (
              <div className="text-center py-20 opacity-20"><Briefcase size={48} className="mx-auto mb-2" /><p>No jobs found</p></div>
            ) : (
              paginatedJobs.map(job => (
                <div key={job._id} 
                  onClick={() => {setSelected(job); setShowApply(false);}}
                  className={clsx(
                    "p-4 rounded-2xl border cursor-pointer transition-all duration-300",
                    selected?._id === job._id 
                    ? "bg-amber/10 border-amber/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                    : "bg-zinc-900/20 border-white/5 hover:border-white/20"
                  )}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <Building2 size={18} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate">{job.title}</h4>
                      <p className="text-xs text-zinc-500 truncate mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={MODE_COLOR[job.workMode] || "dim"} className="!text-[9px] !py-0">{job.workMode}</Badge>
                        {job.salaryRange?.min && (
                          <span className="text-[10px] font-bold text-amber flex items-center gap-0.5">
                            <IndianRupee size={10} />{(job.salaryRange.min / 100000).toFixed(1)}L+
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* INTERNAL PAGINATION FOOTER */}
          <div className="shrink-0 mt-4 flex items-center justify-between p-3 bg-zinc-900/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Page {page}/{totalPages || 1}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"><ChevronLeft size={16} /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Side: Job Details */}
        <div className="hidden lg:block flex-1 h-full">
          {selected ? (
            <Card className="h-full flex flex-col bg-zinc-900/20 border-white/5 overflow-hidden animate-in fade-in slide-in-from-right-4">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-5">
                    <Avatar name={selected.company} size="lg" className="rounded-2xl w-16 h-16 border border-white/10" />
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selected.title}</h2>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <span className="flex items-center gap-1"><Building2 size={14}/> {selected.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> {selected.location || "Remote"}</span>
                      </div>
                    </div>
                  </div>
                  {selected.requiresVerification && <Badge variant="amber" className="gap-1"><ShieldCheck size={12}/> Verified</Badge>}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                   <DetailBox label="Work Mode" value={selected.workMode} icon={Clock} />
                   <DetailBox label="Job Type" value={selected.jobType} icon={Briefcase} />
                   <DetailBox 
                    label="Salary (LPA)" 
                    value={selected.salaryRange?.min ? `₹${(selected.salaryRange.min/100000)}L - ₹${(selected.salaryRange.max/100000)}L` : "Best in Industry"} 
                    icon={IndianRupee} 
                   />
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-amber mb-3">Role Description</h5>
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{selected.description}</p>
                  </div>
                  
                  {selected.skillsRequired?.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-widest text-amber mb-3">Skills Required</h5>
                      <div className="flex flex-wrap gap-2">
                        {selected.skillsRequired.map(s => <Badge key={s} variant="secondary" className="bg-white/5 border-white/5">{s}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="shrink-0 p-6 border-t border-white/5 bg-black/20">
                {!showApply ? (
                  <Btn className="w-full h-12 text-base bg-amber text-black hover:bg-amber-400" onClick={() => setShowApply(true)}>
                    Apply for this Position <Send size={18} className="ml-2" />
                  </Btn>
                ) : (
                  <div className="space-y-4 animate-in zoom-in-95">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-bold text-zinc-400 uppercase">Cover Letter</label>
                       <button onClick={() => setShowApply(false)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                    </div>
                    <textarea 
                      value={cover} onChange={e => setCover(e.target.value)} 
                      placeholder="Explain why you're a good fit for this role..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-zinc-200 outline-none focus:border-amber/50 min-h-[120px] resize-none"
                    />
                    <div className="flex gap-3">
                      <Btn className="flex-1 h-12" onClick={apply} loading={applying}>Submit Application</Btn>
                      <Btn variant="secondary" className="px-6" onClick={() => setShowApply(false)}>Cancel</Btn>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl text-zinc-600">
               <Briefcase size={40} className="mb-3 opacity-20" />
               <p className="text-sm">Select a job to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component
function DetailBox({ label, value, icon: Icon }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 mb-1 text-zinc-500">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <p className="text-sm font-bold text-white capitalize">{value}</p>
    </div>
  );
}