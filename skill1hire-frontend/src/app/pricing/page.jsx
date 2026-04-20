"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout/PublicLayout";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₹1,599",
    period: "billed annually",
    features: ["Job posting access", "Basic candidate screening", "Limited profile views"],
    cta: "Start basic",
    popular: false,
  },
  {
    name: "Business",
    price: "₹2,499",
    period: "billed annually",
    features: ["Advanced job matching", "Comprehensive candidate insights", "Unlimited profile access", "Interview scheduling tools"],
    cta: "Go pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹4,199",
    period: "billed annually",
    features: ["Full platform access", "Custom integration support", "Dedicated account manager", "Advanced analytics", "Priority support"],
    cta: "Contact sales",
    popular: false,
  },
];

export default function PricingPage() {
  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    })();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "160px clamp(16px, 5vw, 64px) 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "30%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Pricing for Recruiters</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, marginBottom: 20 }}>
            Plans that scale<br /><span className="text-gradient">with your hiring.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-2)" }}>
            Affordable plans for recruiters. Free platform for candidates.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: "clamp(48px, 8vw, 96px) clamp(16px, 5vw, 64px)" }}>
        <div className="reveal" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              borderRadius: 24, padding: "clamp(28px, 4vw, 40px)",
              background: plan.popular ? "var(--surface-2)" : "var(--surface)",
              border: plan.popular ? "1px solid rgba(245,158,11,0.3)" : "1px solid var(--border)",
              boxShadow: plan.popular ? "0 0 60px rgba(245,158,11,0.08)" : "none",
              position: "relative", display: "flex", flexDirection: "column",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  display: "flex", alignItems: "center", gap: 4, padding: "5px 14px", borderRadius: 99,
                  background: "var(--amber)", color: "#06060a", fontSize: 11, fontWeight: 700,
                }}>
                  <Sparkles size={11} /> Most Popular
                </div>
              )}
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", marginBottom: 12 }}>{plan.name}</p>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.4rem, 5vw, 3.2rem)", marginBottom: 4, color: "var(--text)" }}>
                {plan.price}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 32 }}>{plan.period}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} style={{ color: "#34d399" }} />
                    </div>
                    <span style={{ fontSize: 14, color: "var(--text-2)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/register?role=hr" className={plan.popular ? "btn-primary" : "btn-secondary"} style={{ width: "100%", textAlign: "center", fontSize: 14 }}>
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
