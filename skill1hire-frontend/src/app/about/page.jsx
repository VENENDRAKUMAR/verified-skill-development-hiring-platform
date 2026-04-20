"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout/PublicLayout";
import { ArrowRight, Target, ShieldCheck, Users, Sparkles, Heart, Globe } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Proof Over Promises", desc: "We believe in verified skills, not polished resumes. Every candidate on our platform has earned their place." },
  { icon: Target, title: "Meritocracy First", desc: "Your background doesn't matter. Your ability does. We level the playing field for everyone." },
  { icon: Users, title: "Community Driven", desc: "Mentors, candidates, and HRs working together to create a better hiring ecosystem for India." },
  { icon: Heart, title: "Candidate-Centric", desc: "We build for candidates first. When candidates succeed, companies succeed. That's our north star." },
  { icon: Globe, title: "Access for All", desc: "Tier 1, 2, or 3 — it doesn't matter. If you can code, you can get verified and get hired." },
  { icon: Sparkles, title: "Radical Transparency", desc: "Open scorecards, honest feedback, and real reviews. No black boxes in our process." },
];

const stats = [
  { value: "2,400+", label: "Verified Candidates" },
  { value: "98%", label: "Hire Success Rate" },
  { value: "150+", label: "Partner Companies" },
  { value: "4.9★", label: "Platform Rating" },
];

export default function AboutPage() {
  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray(".reveal-stagger").forEach(el => {
        gsap.fromTo(el.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" } });
      });
    })();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{
        minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "140px clamp(16px, 5vw, 64px) 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20%", left: "30%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>About Us</p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, marginBottom: 20,
          }}>
            We&apos;re building the<br /><span className="text-gradient">future of hiring.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-2)", maxWidth: 520, margin: "0 auto" }}>
            Skill1 Hire started with a simple idea: what if employers could trust every candidate before the first interview?
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="reveal" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px, 4vw, 48px)",
            padding: "clamp(32px, 4vw, 60px)", borderRadius: 28,
            background: "var(--surface)", border: "1px solid var(--border)",
          }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Our Mission</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1.15 }}>
                Make hiring <span className="text-gradient">fair, fast, and fraud-free.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-2)" }}>
                Traditional hiring is broken. Resumes are inflated, interviews are gameable, and great candidates get filtered out by keyword matching algorithms. We&apos;re changing that by making every candidate prove their skills before they enter the pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "clamp(32px, 6vw, 64px) clamp(16px, 5vw, 64px)" }}>
        <div className="reveal" style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center",
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding: 16 }}>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.2rem, 4vw, 3rem)", color: "var(--amber)", marginBottom: 6 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "var(--text-2)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "clamp(48px, 8vw, 96px) clamp(16px, 5vw, 64px)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(36px, 6vw, 64px)" }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Our Values</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1 }}>
              What drives <span className="text-gradient">everything we build.</span>
            </h2>
          </div>
          <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: "clamp(20px, 3vw, 28px)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--amber-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={19} style={{ color: "var(--amber)" }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-2)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 64px)", textAlign: "center" }}>
        <div className="reveal">
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 20 }}>
            Ready to join <span className="text-gradient">the movement?</span>
          </h2>
          <Link href="/register" className="btn-primary btn-lg">Get Started Free <ArrowRight size={16} /></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
