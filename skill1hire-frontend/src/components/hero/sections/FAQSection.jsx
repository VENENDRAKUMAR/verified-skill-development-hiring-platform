"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(p => !p)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 0", background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "var(--text)", textAlign: "left", gap: 16,
      }}>
        <span>{q}</span>
        <span style={{
          width: 32, height: 32, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center",
          background: open ? "var(--amber)" : "var(--amber-dim)", color: open ? "#06060a" : "var(--amber)",
          flexShrink: 0, transition: "all 0.3s", transform: open ? "rotate(45deg)" : "",
        }}>
          <Plus size={15} />
        </span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-2)", paddingBottom: 24, maxWidth: 600 }}>{a}</p>
      </div>
    </div>
  );
}

const faqs = [
  { q: "Is Skill1 Hire free for candidates?", a: "Yes. Candidates can sign up, take assessments, build capstones, and get verified entirely for free." },
  { q: "How does verification work?", a: "Pass domain assessments, then build and deploy a capstone project. Our team reviews it. Pass both — verified badge." },
  { q: "Can HRs post jobs for free?", a: "Absolutely. Posting jobs is free forever. You only see candidates who've already been skill-verified." },
  { q: "How is this different from LinkedIn?", a: "We don't let anyone apply without proving their skills first. Every candidate has passed assessments and shipped real code." },
  { q: "What kind of mentors are available?", a: "Senior engineers from Stripe, Google, Razorpay, and CRED. Every mentor is rated after each session." },
];

export function FAQSection() {
  return (
    <section id="faq" style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 80px)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.05 }}>
            Frequently asked<br /><span className="text-gradient">questions.</span>
          </h2>
        </div>
        <div className="reveal">
          {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}
