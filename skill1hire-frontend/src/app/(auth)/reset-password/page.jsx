"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { Btn, Field } from "@/components/ui";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    if (!token) return toast.error("Invalid reset link");

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed — link may have expired");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(52,211,153,0.1)" }}>
        <CheckCircle size={26} style={{ color: "#34d399" }} />
      </div>
      <h2 className="font-display font-black text-2xl mb-2" style={{ color: "var(--text)" }}>
        Password Reset!
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
        Your password has been updated successfully.
      </p>
      <Link href="/login">
        <Btn className="w-full">Back to Login</Btn>
      </Link>
    </div>
  );

  return (
    <div>
      <Link href="/login"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-2)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--amber)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
        <ArrowLeft size={14} />Back to login
      </Link>

      <h1 className="font-display font-black text-3xl mb-1" style={{ color: "var(--text)" }}>
        Reset password
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
        Enter your new password below.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Field
          label="New Password" type="password"
          placeholder="Min 8 characters"
          icon={Lock} value={password}
          onChange={e => setPassword(e.target.value)} required
        />
        <Field
          label="Confirm Password" type="password"
          placeholder="Repeat password"
          icon={Lock} value={confirm}
          onChange={e => setConfirm(e.target.value)} required
        />
        <Btn type="submit" loading={loading} className="w-full" size="lg">
          Reset Password
        </Btn>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}