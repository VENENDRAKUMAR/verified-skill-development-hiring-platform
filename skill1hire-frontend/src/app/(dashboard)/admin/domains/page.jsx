"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Field, Badge, PageHdr, Skel, Tabs, Sel } from "@/components/ui";
import { Plus, Layers, ChevronDown, ChevronUp, Search, Hash } from "lucide-react";
import { clsx } from "clsx";

export default function AdminDomains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("domains");
  const [expanded, setExpanded] = useState(null);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState(""); // Search query
  
  // Forms
  const [dForm, setDForm] = useState({ name: "", description: "" });
  const [sForm, setSForm] = useState({ name: "", domain: "" });

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const { data } = await adminAPI.getDomains();
      setDomains(data?.data?.domains || []);
    } catch (err) {
      toast.error("Failed to load domains");
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async () => {
    if (!dForm.name) return toast.error("Name required");
    setAdding(true);
    try {
      const payload = { ...dForm, slug: dForm.name.toLowerCase().trim().replace(/\s+/g, "-") };
      const { data } = await adminAPI.createDomain(payload);
      
      // Smart Update: Poori list fetch mat karo, sirf naya wala add karo
      const newDomain = data?.data?.domain || data?.data;
      setDomains(prev => [newDomain, ...prev]);
      
      setDForm({ name: "", description: "" });
      toast.success("Domain created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  const addSkill = async () => {
    if (!sForm.name || !sForm.domain) return toast.error("Name and domain required");
    setAdding(true);
    try {
      const payload = { ...sForm, slug: sForm.name.toLowerCase().trim().replace(/\s+/g, "-") };
      const { data } = await adminAPI.createSkill(payload);
      
      // Smart Logic: Find the domain and update its skills array locally
      const updatedSkill = data?.data?.skill || data?.data;
      setDomains(prev => prev.map(d => 
        d._id === sForm.domain ? { ...d, skills: [...(d.skills || []), updatedSkill] } : d
      ));

      toast.success("Skill added to domain");
      setSForm({ name: "", domain: "" });
      setTab("domains"); // Auto switch to list to see changes
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  // Filter & Paginate Logic
  const filtered = useMemo(() => {
    return domains.filter(d => d.name.toLowerCase().includes(q.toLowerCase()));
  }, [domains, q]);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * limit, page * limit);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / limit);

  const TABS = [
    { id: "domains", label: `Domains (${domains.length})` }, 
    { id: "skills", label: "Add New Skill" }
  ];

  if (loading) return (
    <div className="space-y-6">
      <PageHdr title="Taxonomy" />
      <Skel className="h-20 rounded-2xl" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <Skel key={i} className="h-16" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <PageHdr title="Domains & Skills" sub="Platform taxonomy management" />
      <Tabs tabs={TABS} active={tab} onChange={(t) => { setTab(t); setPage(1); }} />

      {tab === "domains" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Create Domain Card */}
          <Card className="p-6 bg-zinc-900/40 border-amber/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Quick Create Domain</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Field placeholder="Domain Name (e.g. AI/ML)" value={dForm.name} onChange={e => setDForm(d => ({ ...d, name: e.target.value }))} className="flex-1" />
              <Field placeholder="Quick Description" value={dForm.description} onChange={e => setDForm(d => ({ ...d, description: e.target.value }))} className="flex-1" />
              <Btn onClick={addDomain} loading={adding} className="bg-amber text-black hover:bg-amber-400 shrink-0 px-6 font-bold">
                <Plus size={16} /> Create
              </Btn>
            </div>
          </Card>

          {/* Search & List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input 
                  placeholder="Filter domains..." 
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber/30 transition-all"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Page {page} of {totalPages || 1}</p>
            </div>

            {paginated.length === 0 ? (
              <Empty title="No domains found" desc="Try a different search term or add a new domain." />
            ) : (
              paginated.map(d => (
                <Card key={d._id} className={clsx(
                  "overflow-hidden transition-all duration-200 border-white/5",
                  expanded === d._id ? "ring-1 ring-amber/20 bg-zinc-900/40" : "bg-zinc-900/20 hover:border-white/10"
                )}>
                  <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(expanded === d._id ? null : d._id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                        <Layers size={18} className={expanded === d._id ? "text-amber" : "text-zinc-500"} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{d.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase">{d.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="dim" className="text-[10px] px-2 py-0.5">{d.skills?.length || 0} Skills</Badge>
                      {expanded === d._id ? <ChevronUp size={16} className="text-zinc-600" /> : <ChevronDown size={16} className="text-zinc-600" />}
                    </div>
                  </div>
                  
                  {expanded === d._id && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/20 animate-in slide-in-from-top-1 duration-200">
                      <p className="text-xs text-zinc-500 mb-4 leading-relaxed italic">
                        {d.description || "No description provided for this domain."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {d.skills?.length > 0 ? (
                          d.skills.map(s => (
                            <Badge key={s._id} variant="indigo" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 flex items-center gap-1">
                              <Hash size={10} /> {s.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-[10px] text-zinc-600">No skills mapped yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Btn variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Btn>
              <div className="flex items-center px-4 text-xs font-bold text-zinc-400">{page} / {totalPages}</div>
              <Btn variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Btn>
            </div>
          )}
        </div>
      )}

      {tab === "skills" && (
        <div className="max-w-md mx-auto pt-6 animate-in slide-in-from-bottom-2 duration-300">
          <Card className="p-8 border-white/5 bg-zinc-900/40 shadow-2xl">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-amber/10 text-amber rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber/20">
                  <Plus size={32} />
               </div>
               <h3 className="text-xl font-bold text-white">Add New Skill</h3>
               <p className="text-xs text-zinc-500 mt-1">Map a technical skill to a specific domain.</p>
            </div>

            <div className="space-y-5">
              <Field 
                label="Technical Skill Name" 
                placeholder="e.g. Docker, Redux, Figma" 
                value={sForm.name} 
                onChange={e => setSForm(s => ({ ...s, name: e.target.value }))} 
              />
              <Sel label="Select Parent Domain" value={sForm.domain} onChange={e => setSForm(s => ({ ...s, domain: e.target.value }))}>
                <option value="">Choose a domain...</option>
                {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </Sel>
              <Btn 
                onClick={addSkill} 
                loading={adding} 
                className="w-full bg-white text-black hover:bg-zinc-200 py-6 rounded-2xl font-black text-sm"
              >
                Confirm & Add Skill
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}