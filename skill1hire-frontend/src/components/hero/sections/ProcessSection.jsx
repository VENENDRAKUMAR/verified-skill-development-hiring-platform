import { BookOpen, Upload, FileText, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

const processSteps = [
  { n: "01", title: "Learn", desc: "Premium content and referral-backed elite modules.", icon: BookOpen },
  { n: "02", title: "Validate", desc: "Submit advanced projects to prove execution.", icon: Upload },
  { n: "03", title: "Assess", desc: "Deep structured testing benchmarking your logic.", icon: FileText },
  { n: "04", title: "Get Hired", desc: "Feedback from industry-veteran engineers.", icon: ShieldCheck },
  { n: "05", title: "Deploy", desc: "Earn verified talent badges for immediate hiring.", icon: Star },
];

export function ProcessSection() {
  return (
    <section style={{ padding: "120px clamp(16px, 5vw, 64px)", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Ambient background glow */}
      <div style={{ position: "absolute", top: "60%", left: "50%", width: "70vw", height: "70vw", background: "radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 60%)", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />
      
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>The Method</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 16 }}>
            Modular Process For <span className="text-gradient">Validation</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--text-2)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>Our multi-stage verification ensures that only top-tier talent enters the recruiter pool.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {processSteps.map(({ n, title, desc, icon: Icon }, i) => (
            <motion.div 
              key={n}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -12, scale: 1.03, borderColor: "rgba(212,175,55,0.5)", boxShadow: "0 20px 40px rgba(212,175,55,0.15)" }}
              style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 24, padding: "36px 28px", textAlign: "center", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", backdropFilter: "blur(20px)",
                transition: "border-color 0.4s, box-shadow 0.4s"
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--amber)", textTransform: "uppercase", background: "rgba(212,175,55,0.1)", padding: "4px 12px", borderRadius: 99, marginBottom: 16 }}>PHASE {n}</span>
              <div style={{ width: 64, height: 64, borderRadius: 20, marginBottom: 20, background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, transparent 100%)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                <Icon size={28} style={{ color: "var(--amber)" }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
