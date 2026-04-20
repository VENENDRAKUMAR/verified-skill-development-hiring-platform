import Link from "next/link";
import { BookOpen, Code, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { title: "Domain Assessments", desc: "Curated MCQ tests auto-scored per skill domain", icon: BookOpen },
  { title: "Capstone Projects", desc: "Build & deploy real projects reviewed by our team", icon: Code },
  { title: "Verified Hiring", desc: "Only proven candidates enter the job pipeline", icon: ShieldCheck },
  { title: "Mentor Network", desc: "1:1 sessions with senior engineers rated every time", icon: Users },
];

export function ServicesSection() {
  return (
    <section id="features" style={{ padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-stagger">
          {services.map(({ title, desc }) => (
            <motion.div key={title} whileHover={{ x: 8 }} transition={{ duration: 0.3 }}>
              <Link href="/services" className="svc-row" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "clamp(24px, 3vw, 36px) 0", borderBottom: "1px solid var(--border)",
                textDecoration: "none", color: "inherit", gap: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 32px)", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "var(--text)", minWidth: "clamp(180px, 30%, 300px)" }}>{title}</h3>
                  <p className="hide-mobile" style={{ fontSize: 14, color: "var(--text-2)", maxWidth: 320 }}>{desc}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 99, background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ArrowUpRight size={18} style={{ color: "var(--amber)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
