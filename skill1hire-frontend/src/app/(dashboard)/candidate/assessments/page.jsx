"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Btn, Badge, PageHdr, Skel, Empty, Progress } from "@/components/ui";
import { 
  BookOpen, ChevronRight, ChevronLeft, Trophy, Target, 
  X, Zap, Timer, CheckCircle2, AlertCircle, Upload 
} from "lucide-react";
import clsx from "clsx";

export default function Assessments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz Engine State
  const [active, setActive] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    candidateAPI.getAssessments()
      .then(({ data }) => setList(data?.data?.assessments || []))
      .finally(() => setLoading(false));
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!active || submitting || result) return;

    if (timeLeft <= 0) {
      autoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, active, submitting, result]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const start = async (id) => {
    try {
      const { data } = await candidateAPI.getAssessmentById(id);
      const assessment = data?.data?.assessment || data?.data;
      setActive(assessment);
      setCurrentIdx(0);
      setAnswers({});
      setResult(null);
      setTimeLeft(assessment.durationMinutes * 60);
    } catch { toast.error("Failed to load assessment"); }
  };

  const autoSubmit = () => {
    toast.info("Time is up! Submitting your answers...");
    submit();
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const ans = Object.entries(answers).map(([qi, sel]) => {
        if (typeof sel === 'object') {
          return { questionIndex: +qi, answerText: sel.answerText, answerFileUrl: sel.answerFileUrl };
        }
        return { questionIndex: +qi, selectedOption: +sel };
      });
      const { data } = await candidateAPI.submitAssessment(active._id, {
        answers: ans,
        timeTakenMinutes: Math.ceil((active.durationMinutes * 60 - timeLeft) / 60),
      });
      setResult(data?.data?.result || data?.data);
      const updated = await candidateAPI.getAssessments();
      setList(updated.data?.data?.assessments || []);
    } catch { toast.error("Submit failed — please try again"); }
    finally { setSubmitting(false); }
  };

  // UI Components
  if (result) {
    return (
      <div className="max-w-md mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
        <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center border-2 ${result.isPassed ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {result.isPassed ? <Trophy size={48} /> : <Target size={48} />}
        </div>
        <h2 className="text-3xl font-black mb-2">{result.isPassed ? "Level Up! 🎉" : "Hard Luck!"}</h2>
        <p className="text-zinc-500 mb-8">You scored {result.percentageScore}% in {active.title}</p>
        
        <Card className="p-6 mb-8 bg-white/5 border-white/5 text-left">
           <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
              <span className="text-zinc-400">Correct Answers</span>
              <span className="font-bold">{result.totalMarksObtained} / {result.totalMarks}</span>
           </div>
           <div className="flex justify-between">
              <span className="text-zinc-400">Status</span>
              <Badge variant={result.isPassed ? "green" : "red"}>{result.isPassed ? "PASSED" : "FAILED"}</Badge>
           </div>
        </Card>

        <Btn onClick={() => { setActive(null); setResult(null); }} className="w-full h-12">Return to Dashboard</Btn>
      </div>
    );
  }

  if (active) {
    const q = active.questions[currentIdx];
    const progress = ((currentIdx + 1) / active.questions.length) * 100;

    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col overflow-hidden">
        {/* Exam Header */}
        <div className="h-20 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
              <BookOpen size={20} className="text-amber" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm md:text-base leading-none mb-1">{active.title}</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Question {currentIdx + 1} of {active.questions.length}</p>
            </div>
          </div>

          <div className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold",
            timeLeft < 60 ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-white/5 border-white/10 text-amber"
          )}>
            <Timer size={16} />
            {formatTime(timeLeft)}
          </div>

          <button onClick={() => setActive(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5 shrink-0">
           <div className="h-full bg-amber transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Main Exam Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            {/* Question Card */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <span className="text-amber font-black text-xl mb-4 block">0{currentIdx + 1}.</span>
               <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                 {q.questionText}
               </h2>
            </div>

            {/* Mixed Inputs */}
            {q.type === "descriptive" ? (
              <div className="space-y-6">
                <textarea
                  placeholder="Write your detailed answer or code logic here..."
                  className="w-full min-h-[160px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all resize-y"
                  value={answers[currentIdx]?.answerText || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentIdx]: { ...prev[currentIdx], answerText: e.target.value } }))}
                />
                
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const toastId = toast.loading("Uploading solution to secure vault...");
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        const tk = document.cookie.split(";").find(c => c.trim().startsWith("accessToken="))?.split("=")[1];
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                        const res = await fetch(`${apiUrl}/api/v1/upload`, {
                          method: "POST", headers: { Authorization: `Bearer ${tk}` },
                          body: formData
                        });
                        const j = await res.json();
                        setAnswers(prev => ({ ...prev, [currentIdx]: { ...prev[currentIdx], answerFileUrl: j.data?.url || j.data?.secure_url || j.data?.result?.secure_url } }));
                        toast.success("Solution Attached! ⚡", { id: toastId });
                      } catch (err) { toast.error("Attachment failed", { id: toastId }); }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className={clsx("w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 transition-colors", answers[currentIdx]?.answerFileUrl ? "border-amber/50 bg-amber/5" : "border-white/10 group-hover:border-white/30 group-hover:bg-white/5")}>
                    {answers[currentIdx]?.answerFileUrl ? (
                      <>
                         <div className="w-12 h-12 bg-amber/20 text-amber flex items-center justify-center rounded-full mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">⚡</div>
                         <span className="text-amber font-semibold">Attachment Secured</span>
                      </>
                    ) : (
                      <>
                         <div className="w-12 h-12 bg-white/5 text-zinc-400 flex items-center justify-center rounded-full mb-3">📁</div>
                         <span>Drag & Drop solution package (PDF, DOC, IMG)</span>
                         <span className="text-xs text-zinc-600 mt-2">Max 10MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[currentIdx] === oi;
                  return (
                    <button 
                      key={oi} 
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: oi }))}
                      className={clsx(
                        "w-full p-5 rounded-2xl border text-left transition-all duration-200 group flex items-center gap-4",
                        isSelected 
                          ? "bg-amber/10 border-amber/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                        isSelected ? "bg-amber text-black" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"
                      )}>
                        {String.fromCharCode(65 + oi)}
                      </div>
                      <span className={clsx(
                        "text-base",
                        isSelected ? "text-amber font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                      )}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Exam Footer Navigation */}
        <div className="h-24 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl px-6 flex items-center justify-center shrink-0">
           <div className="max-w-3xl w-full flex items-center justify-between">
              <Btn 
                variant="secondary" 
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="gap-2"
              >
                <ChevronLeft size={18} /> Previous
              </Btn>

              <div className="hidden md:flex gap-2">
                {active.questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={clsx(
                      "w-2 h-2 rounded-full transition-all",
                      i === currentIdx ? "bg-amber w-6" : answers[i] !== undefined ? "bg-green-500" : "bg-white/10"
                    )} 
                  />
                ))}
              </div>

              {currentIdx === active.questions.length - 1 ? (
                <Btn 
                  onClick={submit} 
                  loading={submitting} 
                  className="bg-green-600 hover:bg-green-500 text-white gap-2 px-8"
                >
                  Finish Exam <CheckCircle2 size={18} />
                </Btn>
              ) : (
                <Btn 
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="gap-2 px-8"
                >
                  Next Question <ChevronRight size={18} />
                </Btn>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHdr title="Skill Assessments" sub="Validate your expertise and earn verified badges for your profile." />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skel key={i} className="h-48 rounded-3xl" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty icon={BookOpen} title="No assessments available" desc="Complete your profile skills to unlock matching tests." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map(a => (
            <Card key={a._id} className="p-6 bg-zinc-900/20 border-white/5 hover:border-amber/20 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
                  <BookOpen size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="dim" className="capitalize">{a.level}</Badge>
                  {a.isCompleted && (
                    <Badge variant={a.myResult?.isPassed ? "green" : "red"}>
                      {a.myResult?.isPassed ? "Passed" : "Failed"}
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
              <div className="flex items-center gap-4 text-zinc-500 text-xs mb-6">
                <span className="flex items-center gap-1"><Timer size={14}/> {a.durationMinutes} Mins</span>
                <span className="flex items-center gap-1"><Zap size={14}/> {a.questions.length} Questions</span>
              </div>

              <Btn 
                onClick={() => start(a._id)}
                variant={a.isCompleted && a.myResult?.isPassed ? "secondary" : "primary"}
                className="w-full mt-auto"
              >
                {a.isCompleted ? "Retake Assessment" : "Start Now"}
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}