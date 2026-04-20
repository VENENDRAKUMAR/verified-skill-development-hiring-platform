import Image from "next/image";
import { BookOpen, CheckCircle2, Zap, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const IMG = {
  bento1: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
  bento2: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop",
  bento3: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop",
};

export function BentoSection() {
  return (
    <section style={{ padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)", background: "var(--bg)", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <p className="eyebrow" style={{ marginBottom: 12, color: "var(--amber-2)" }}>Features</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", textTransform: "uppercase", lineHeight: 0.95, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Unfair <br/> <span className="text-gradient">Advantage</span>
          </h2>
        </motion.div>

        <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "320px 320px", gap: 16 }}>
          {/* Main Assessment Bento */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ gridColumn: "span 2", gridRow: "span 2", borderRadius: 0, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "var(--surface)" }} className="bento-cell"
          >
            <Image src={IMG.bento1} alt="Assessments" fill style={{ objectFit: "cover", opacity: 0.6 }} className="mix-blend-overlay" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(20deg, var(--bg) 10%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, zIndex: 2 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 0, background: "var(--amber-dim)", border: "1px solid var(--border)", marginBottom: 20 }}>
                <BookOpen size={14} style={{ color: "var(--amber)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Assessments</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", textTransform: "uppercase", lineHeight: 0.9, color: "var(--text)", marginBottom: 12 }}>
                Domain Tests & Capstones
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 360 }}>Rigorous MCQ evaluations paired with real project deployments. Filter the noise.</p>
            </div>
          </motion.div>

          {/* Verified Blue Tick Box */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ borderRadius: 0, position: "relative", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }} className="bento-cell"
          >
            <Image src={IMG.bento2} alt="Verified" fill style={{ objectFit: "cover", opacity: 0.6 }} className="mix-blend-overlay" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, var(--bg) 100%)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 2 }}>
              <CheckCircle2 size={24} style={{ color: "var(--amber)", marginBottom: 12 }} />
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, textTransform: "uppercase", color: "var(--text)" }}>Proof Badge</p>
            </div>
          </motion.div>

          {/* Smart Jobs Box */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ borderRadius: 0, position: "relative", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }} className="bento-cell"
          >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at bottom right, rgba(212,175,55,0.2), transparent 70%)" }} />
            <Image src={IMG.bento3} alt="Smart Jobs" fill style={{ objectFit: "cover", opacity: 0.6 }} className="mix-blend-overlay" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(20deg, var(--bg) 10%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
              <Zap size={24} style={{ color: "var(--amber)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, textTransform: "uppercase", color: "var(--text)" }}>Smart Feed</span>
            </div>
          </motion.div>

          {/* Live Scorecard Box */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ borderRadius: 0, padding: 32, background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="bento-cell"
          >
            <TrendingUp size={28} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, textTransform: "uppercase", color: "var(--text)", marginBottom: 8 }}>Live Scorecard</p>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>Percentile rankings update dynamically in real-time.</p>
            </div>
          </motion.div>

          {/* Mentors Box */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ borderRadius: 0, padding: 32, background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="bento-cell"
          >
            <Calendar size={28} style={{ color: "var(--amber)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, textTransform: "uppercase", color: "var(--text)", marginBottom: 8 }}>Mentors 1:1</p>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>Book brutal but fair sessions with FAANG engineers.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
