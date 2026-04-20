"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Field, Badge, PageHdr, Skel, Sel, Tabs } from "@/components/ui";
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp, UserCheck, X, Search } from "lucide-react";

const emptyQ = () => ({ type: "mcq", questionText: "", options: ["","","",""], correctAnswer: 0, marks: 1 });

export default function AdminAssessments() {
  const [assessments, setAssessments]   = useState([]);
  const [domains, setDomains]           = useState([]);
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [creating, setCreating]         = useState(false);
  const [expanded, setExpanded]         = useState(null);
  const [tab, setTab]                   = useState("list");
  const [assignModal, setAssignModal]   = useState(null); // assessment to assign
  const [assignTarget, setAssignTarget] = useState("");   // candidateId
  const [assigning, setAssigning]       = useState(false);
  const [form, setForm] = useState({
    title: "", domain: "", level: "beginner",
    durationMinutes: 30, passingScore: 60,
    questions: [emptyQ()],
  });

  useEffect(() => {
    Promise.all([
      adminAPI.getAssessments(),
      adminAPI.getDomains(),
      adminAPI.getAllUsers({ role: "candidate", limit: 100 }),
    ]).then(([a, d, u]) => {
      setAssessments(a.data?.data?.assessments || []);
      setDomains(d.data?.data?.domains || []);
      setUsers(u.data?.data?.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateQ   = (i, k, v) => setForm(f => { const qs = [...f.questions]; qs[i] = { ...qs[i], [k]: v }; return { ...f, questions: qs }; });
  const updateOpt = (qi, oi, v) => setForm(f => { const qs = [...f.questions]; const opts = [...qs[qi].options]; opts[oi] = v; qs[qi] = { ...qs[qi], options: opts }; return { ...f, questions: qs }; });

  const createAssessment = async () => {
    if (!form.title || !form.domain) return toast.error("Title and domain required");
    if (form.questions.some(q => !q.questionText)) return toast.error("Fill all question texts");
    setCreating(true);
    try {
      const { data } = await adminAPI.createAssessment(form);
      setAssessments(a => [...a, data?.data?.assessment || data?.data]);
      setForm({ title: "", domain: "", level: "beginner", durationMinutes: 30, passingScore: 60, questions: [emptyQ()] });
      toast.success("Assessment created! 🎉");
      setTab("list");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setCreating(false); }
  };

  const assignToCandidate = async () => {
    if (!assignTarget) return toast.error("Select a candidate");
    setAssigning(true);
    try {
      // Get candidate's current assigned assessments and add this one
      await adminAPI.verifyUser(assignTarget, {}); // just to get user — actually call assign endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const token  = document.cookie.split(";").find(c => c.trim().startsWith("accessToken="))?.split("=")[1];

      const res = await window.fetch(`${apiUrl}/admin/assign-assessment/${assignTarget}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assessmentIds: [assignModal] }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      toast.success("Assessment assigned to candidate ✅");
      setAssignModal(null);
      setAssignTarget("");
    } catch (err) { toast.error(err.message || "Failed"); }
    finally { setAssigning(false); }
  };

  const LV = { beginner: "green", intermediate: "amber", advanced: "red" };
  const TABS = [{ id: "list", label: "All Assessments" }, { id: "create", label: "+ Create New" }];

  if (loading) return <div><PageHdr title="Assessments" /><Skel className="h-64" /></div>;

  return (
    <div>
      <PageHdr title="Assessments" sub="Create and assign tests to candidates" />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* ── Create Form ── */}
      {tab === "create" && (
        <Card className="p-6 mb-6">
          <p className="eyebrow mb-5">Assessment Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <Field label="Title" placeholder="React.js Fundamentals"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Sel label="Domain" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}>
              <option value="">Select domain</option>
              {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Sel>
            <Sel label="Level" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Sel>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Duration (min)" type="number" value={form.durationMinutes}
                onChange={e => setForm(f => ({ ...f, durationMinutes: +e.target.value }))} />
              <Field label="Pass %" type="number" value={form.passingScore}
                onChange={e => setForm(f => ({ ...f, passingScore: +e.target.value }))} />
            </div>
          </div>

          <p className="eyebrow mb-3">Questions</p>
          <div className="space-y-4 mb-5">
            {form.questions.map((q, qi) => (
              <div key={qi} className="p-4 rounded-2xl space-y-3"
                style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Q{qi + 1}</span>
                  {form.questions.length > 1 && (
                    <button onClick={() => setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }))}
                      style={{ color: "#fca5a5" }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Field placeholder="Question text..." value={q.questionText}
                      onChange={e => updateQ(qi, "questionText", e.target.value)} />
                  </div>
                  <div className="w-40 flex-shrink-0">
                    <Sel label="Type" value={q.type || "mcq"} onChange={e => updateQ(qi, "type", e.target.value)}>
                      <option value="mcq">MCQ</option>
                      <option value="descriptive">Descriptive</option>
                    </Sel>
                  </div>
                </div>
                
                {(!q.type || q.type === "mcq") && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${qi}`}
                            checked={q.correctAnswer === oi}
                            onChange={() => updateQ(qi, "correctAnswer", oi)}
                            style={{ accentColor: "var(--amber)", flexShrink: 0 }} />
                          <Field placeholder={`Option ${String.fromCharCode(65+oi)}`}
                            value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>🔘 Select correct answer</p>
                  </>
                )}
                {q.type === "descriptive" && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 text-sm mt-2">
                    Candidate will be shown a Text Area and File Upload prompt.
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" onClick={() => setForm(f => ({ ...f, questions: [...f.questions, emptyQ()] }))}>
              <Plus size={13} />Add Question
            </Btn>
            <Btn onClick={createAssessment} loading={creating}>
              Create Assessment
            </Btn>
          </div>
        </Card>
      )}

      {/* ── Assessment List ── */}
      {tab === "list" && (
        <div className="space-y-3">
          {assessments.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen size={28} className="mx-auto mb-3" style={{ color: "var(--text-3)" }} />
              <p className="font-bold mb-1" style={{ color: "var(--text)" }}>No assessments yet</p>
              <Btn size="sm" className="mt-3" onClick={() => setTab("create")}>Create First Assessment</Btn>
            </Card>
          )}
          {assessments.map(a => (
            <Card key={a._id} className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--amber-dim)" }}>
                    <BookOpen size={15} style={{ color: "var(--amber)" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{a.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      {a.domain?.name} · {a.questions?.length} Qs · {a.durationMinutes}min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={LV[a.level] || "dim"}>{a.level}</Badge>
                  {/* Assign button */}
                  <button
                    onClick={e => { e.stopPropagation(); setAssignModal(a._id); }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: "var(--amber-dim)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <UserCheck size={11} />Assign
                  </button>
                  {expanded === a._id
                    ? <ChevronUp size={13} style={{ color: "var(--text-3)" }} />
                    : <ChevronDown size={13} style={{ color: "var(--text-3)" }} />
                  }
                </div>
              </div>
              {expanded === a._id && a.questions?.length > 0 && (
                <div className="px-5 pb-4 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="space-y-2">
                    {a.questions.map((q, i) => (
                      <div key={i} className="text-sm px-3 py-2 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-2)" }}>
                        <span className="font-bold mr-2" style={{ color: "var(--amber)" }}>Q{i+1}.</span>
                        {q.questionText}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── Assign Modal ── */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={e => e.target === e.currentTarget && setAssignModal(null)}>
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>
                Assign Assessment
              </h3>
              <button onClick={() => setAssignModal(null)} style={{ color: "var(--text-3)" }}>
                <X size={16} />
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
              Select a candidate — they will see this assessment in their dashboard.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-2)" }}>
                Select Candidate
              </label>
              <select value={assignTarget} onChange={e => setAssignTarget(e.target.value)}
                className="input w-full">
                <option value="">Choose candidate...</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Btn className="flex-1" onClick={assignToCandidate} loading={assigning}>
                <UserCheck size={13} />Assign Assessment
              </Btn>
              <Btn variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}