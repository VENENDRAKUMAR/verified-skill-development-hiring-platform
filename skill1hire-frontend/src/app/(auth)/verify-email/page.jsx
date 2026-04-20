"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { Btn } from "@/components/ui";
import { CheckCircle, XCircle, Loader2, Sparkles, ShieldCheck, MailWarning, ArrowRight, Home } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Oops! Verification token is missing or malformed.");
        return;
      }

      try {
        // Backend: GET /api/v1/auth/verify-email/:token
        await authAPI.verifyEmail(token); 
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        toast.success("Identity Verified! ✅");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "The link has expired or is invalid.");
        toast.error("Verification failed");
      }
    };

    performVerification();
  }, [token]);

  // 1. LOADING STATE
  if (status === "verifying") return (
    <div className="text-center py-10 animate-in fade-in duration-500">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
        <div className="relative w-20 h-20 bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <Loader2 size={32} className="animate-spin text-amber-500" />
        </div>
      </div>
      <h2 className="font-display font-black text-2xl mb-3 text-white tracking-tight">
        Securing Account
      </h2>
      <p className="text-sm text-zinc-400 max-w-[250px] mx-auto leading-relaxed">
        Please wait a moment while we validate your credentials...
      </p>
    </div>
  );

  // 2. SUCCESS STATE
  if (status === "success") return (
    <div className="text-center animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 relative"
        style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, transparent 100%)", border: "1px solid rgba(52,211,153,0.3)" }}>
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg">
           <Sparkles size={14} />
        </div>
        <ShieldCheck size={40} className="text-emerald-400" />
      </div>
      
      <h2 className="font-display font-black text-3xl mb-3 text-white">
        Email Verified!
      </h2>
      <p className="text-sm mb-10 text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
        Great news! Your account is now fully active. You're ready to explore the <span className="text-amber-500 font-bold">Skill1Hire</span> ecosystem.
      </p>

      <div className="space-y-3">
        <Link href="/login">
          <Btn className="w-full bg-white text-black hover:bg-zinc-200 py-6 rounded-2xl font-black transition-all shadow-xl shadow-white/5" size="lg">
            Go to Dashboard <ArrowRight size={18} className="ml-2" />
          </Btn>
        </Link>
        <Link href="/" className="block text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
           Back to Home
        </Link>
      </div>
    </div>
  );

  // 3. ERROR STATE
  return (
    <div className="text-center animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-red-500/10 border border-red-500/20">
        <MailWarning size={40} className="text-red-500" />
      </div>
      
      <h2 className="font-display font-black text-2xl mb-3 text-white">
        Invalid Link
      </h2>
      <p className="text-sm mb-10 text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
        {message} It might be expired or already used. Try logging in to request a new one.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/login">
          <Btn className="w-full rounded-xl border-white/5 bg-white/5 hover:bg-white/10" variant="outline">
            Login
          </Btn>
        </Link>
        <Link href="/support">
          <Btn className="w-full rounded-xl" variant="secondary">
            Support
          </Btn>
        </Link>
      </div>
      <p className="mt-8 text-[10px] text-zinc-600 uppercase font-black tracking-widest">
        Skill1Hire Safety Systems
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050507] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] -m-1 pointer-events-none" />
        <div className="bg-zinc-900/80 p-10 rounded-[2rem] border border-white/5 backdrop-blur-2xl shadow-2xl relative">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-zinc-700" size={40} />
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}