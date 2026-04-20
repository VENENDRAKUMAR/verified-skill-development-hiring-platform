"use client";
import { useState, Suspense } from "react"; // Added Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Btn, Field } from "@/components/ui";

const ROLES = [
  { id: "candidate", emoji: "👨‍💻", label: "Candidate", sub: "I'm looking for a job" },
  { id: "hr", emoji: "🏢", label: "Recruiter", sub: "I'm hiring talent" },
  { id: "mentor", emoji: "🎓", label: "Mentor", sub: "I want to teach" },
];

// 1. Move the form logic into a sub-component
function RegisterForm() {
  const { register: reg } = useAuth();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  // Now useSearchParams is safe because it's inside Suspense
  const [role, setRole] = useState(params.get("role") || "candidate");
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await reg({ ...data, role });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Premium Role selector */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {ROLES.map(r => (
          <button key={r.id} type="button" onClick={() => setRole(r.id)}
            className="group relative flex flex-col items-center gap-1.5 p-4 rounded-2xl transition-all duration-300 overflow-hidden"
            style={{
              border: role === r.id ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: role === r.id ? "linear-gradient(180deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)" : "rgba(255,255,255,0.02)",
              backdropFilter: "blur(10px)",
              transform: role === r.id ? "translateY(-2px)" : "translateY(0)"
            }}>
            {role === r.id && (
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at top, rgba(245,158,11,0.2) 0%, transparent 70%)" }} />
            )}
            <span className={`text-2xl transition-transform duration-300 ${role === r.id ? "scale-110" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}>{r.emoji}</span>
            <span className="text-[13px] font-bold tracking-wide mt-1" style={{ color: role === r.id ? "var(--amber)" : "var(--text-2)" }}>{r.label}</span>
            <span className="text-[10px] leading-tight text-center" style={{ color: role === r.id ? "rgba(245,158,11,0.7)" : "var(--text-3)" }}>{r.sub}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Full Name" type="text" placeholder="Rahul Mehta" icon={User}
          inputClass="!bg-white/5 !border-white/10 !backdrop-blur-xl focus:!border-amber-500 focus:!bg-white/10 text-[var(--text)] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          error={errors.name?.message}
          {...register("name", { required: "Name required", minLength: { value: 2, message: "Too short" } })}
        />
        <Field label="Email" type="email" placeholder="you@example.com" icon={Mail}
          inputClass="!bg-white/5 !border-white/10 !backdrop-blur-xl focus:!border-amber-500 focus:!bg-white/10 text-[var(--text)] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          error={errors.email?.message}
          {...register("email", { required: "Email required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
        />
        <div className="relative">
          <Field label="Password" type={show ? "text" : "password"} placeholder="Min 8 characters" icon={Lock}
            inputClass="!bg-white/5 !border-white/10 !backdrop-blur-xl focus:!border-amber-500 focus:!bg-white/10 text-[var(--text)] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            error={errors.password?.message}
            {...register("password", { required: "Password required", minLength: { value: 8, message: "Minimum 8 chars" } })}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-10 hover:text-white transition-colors" style={{ color: "var(--text-3)" }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-4" style={{ height: 54, fontSize: "15px", letterSpacing: "0.5px" }}>
          {loading ? "Creating account..." : <span className="flex items-center justify-center gap-2">Create Account <ArrowRight size={16} /></span>}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: "var(--border)" }} /></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ background: "var(--bg)", color: "var(--text-3)" }}>or continue with</span></div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/google`}
        className="btn-secondary w-full justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </a>
    </>
  );
}

// 2. The main export just provides the layout and the Suspense boundary
export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display italic text-4xl mb-2" style={{ color: "var(--text)" }}>Create account</h1>
      <p className="text-[15px] mb-8" style={{ color: "var(--text-2)" }}>Join Skill1 Hire — free, forever.</p>

      <Suspense fallback={<div className="p-10 text-center text-sm opacity-50">Loading form...</div>}>
        <RegisterForm />
      </Suspense>

      <p className="mt-6 text-[12px] text-center" style={{ color: "var(--text-3)" }}>
        By registering you agree to our Terms & Privacy Policy.
      </p>
      <p className="mt-4 text-center text-[14.5px]" style={{ color: "var(--text-2)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--amber)" }}>Sign in</Link>
      </p>
    </div>
  );
}