"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout/PublicLayout";
import {
  ArrowRight, BookOpen, Code, ShieldCheck, Users, Briefcase,
  Award, TrendingUp, Zap, Calendar, Star, CheckCircle,
} from "lucide-react";

const services = [
  {
    eyebrow: "For Candidates",
    title: "Prove your skills.\nGet hired faster.",
    desc: "Take assessments, build capstone projects, earn your verified badge, and unlock jobs from top companies — all for free.",
    features: [
      { icon: BookOpen, text: "Domain-specific MCQ assessments" },
      { icon: Code, text: "Real capstone project submissions" },
      { icon: ShieldCheck, text: "Verified badge on your profile" },
      { icon: TrendingUp, text: "Live scorecard with percentile ranks" },
      { icon: Briefcase, text: "Curated job feed (verified-only)" },
      { icon: Calendar, text: "1:1 mentoring sessions" },
    ],
    cta: { label: "Start as Candidate", href: "/register?role=candidate" },
    accent: "#f59e0b",
  },
  {
    eyebrow: "For HRs & Companies",
    title: "Hire pre-verified\ntalent instantly.",
    desc: "Every candidate has passed skill assessments and built real projects. No more resume screening — just proven talent ready to hire.",
    features: [
      { icon: Users, text: "Access verified-only candidate pool" },
      { icon: Award, text: "View real scores and capstone projects" },
      { icon: Zap, text: "3× faster shortlisting" },
      { icon: Briefcase, text: "Free job posting, forever" },
      { icon: Star, text: "Quality pipeline, zero spam" },
      { icon: TrendingUp, text: "Analytics on applicant quality" },
    ],
    cta: { label: "Start Hiring Free", href: "/register?role=hr" },
    accent: "#6366f1",
  },
  {
    eyebrow: "For Mentors",
    title: "Share expertise.\nGet paid.",
    desc: "Mentor verified candidates in your area of expertise. Set your own rates, schedule sessions, and get rated for accountability.",
    features: [
      { icon: Calendar, text: "Flexible 30/60/90 min sessions" },
      { icon: Star, text: "Rating system after every session" },
      { icon: Users, text: "Connect with serious learners" },
      { icon: TrendingUp, text: "Build your public mentor profile" },
      { icon: Zap, text: "Set your own hourly rate" },
      { icon: Award, text: "Join a curated mentor network" },
    ],
    cta: { label: "Become a Mentor", href: "/register?role=mentor" },
    accent: "#a855f7",
  },
];

export default function ServicesPage() {
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
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{
        minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "140px clamp(16px, 5vw, 64px) 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-15%", right: "20%", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Our Services</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, marginBottom: 20 }}>
            One platform,<br /><span className="text-gradient">three powerful roles.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-2)" }}>
            Whether you&apos;re proving your skills, hiring proven talent, or mentoring the next generation.
          </p>
        </div>
      </section>

      {/* Service Blocks */}
      {services.map((s, idx) => (
        <section key={s.eyebrow} style={{
          padding: "clamp(48px, 8vw, 96px) clamp(16px, 5vw, 64px)",
          background: idx % 2 === 0 ? "var(--bg)" : "var(--surface)",
        }}>
          <div className="reveal" style={{
            maxWidth: 1000, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 45%, 440px), 1fr))",
            gap: "clamp(32px, 6vw, 64px)", alignItems: "center",
          }}>
            {/* Copy */}
            <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
              <p className="eyebrow" style={{ marginBottom: 14, color: s.accent }}>{s.eyebrow}</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: 16, whiteSpace: "pre-line" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-2)", marginBottom: 28 }}>{s.desc}</p>
              <Link href={s.cta.href} className="btn-primary" style={{ background: s.accent }}>
                {s.cta.label} <ArrowRight size={15} />
              </Link>
            </div>

            {/* Features */}
            <div style={{ order: idx % 2 === 1 ? 1 : 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {s.features.map(({ icon: Icon, text }) => (
                <div key={text} className="glass-card" style={{ padding: "16px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${s.accent}12`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} style={{ color: s.accent }} />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 64px)", textAlign: "center" }}>
        <div className="reveal">
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 20 }}>
            Pick your role. <span className="text-gradient">Start today.</span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            <Link href="/register?role=candidate" className="btn-primary btn-lg">I&apos;m a Candidate <ArrowRight size={16} /></Link>
            <Link href="/register?role=hr" className="btn-secondary btn-lg">Start Hiring</Link>
            <Link href="/register?role=mentor" className="btn-secondary btn-lg">Become a Mentor</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
