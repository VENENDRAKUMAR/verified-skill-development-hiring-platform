import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const IMG = {
  t1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face",
  t2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face",
  t3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
};

export function ManifestoSection() {
  return (
    <section style={{
      padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle sunset glow behind manifesto */}
      <div style={{
        position: "absolute", bottom: "-20%", left: "30%", width: "min(600px, 80vw)", height: "min(400px, 50vw)",
        borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)",
        filter: "blur(80px)",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={{ maxWidth: 700 }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.15, marginBottom: 40,
          }}>
            At Skill1 Hire — we believe that hiring is not just about{" "}
            <span style={{ color: "var(--text-2)" }}>resumes but</span>{" "}
            <strong>also</strong> about creating —{" "}
            <span style={{ display: "inline-flex", gap: 4, verticalAlign: "middle" }}>
              {[IMG.t1, IMG.t2, IMG.t3].map((s, i) => (
                <img key={i} src={s} alt="" style={{ width: 28, height: 28, borderRadius: 99, objectFit: "cover" }} />
              ))}
            </span>{" "}
            verified and <span className="text-gradient">meaningful</span> — careers.
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: 0.2 }} style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          borderTop: "1px solid var(--border)", paddingTop: 28, flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12 }}>ABOUT US</p>
            <p style={{ fontSize: 14, color: "var(--text-2)", maxWidth: 320, lineHeight: 1.7 }}>
              We combine technology and assessment design to deliver results that exceed expectations.
            </p>
          </div>
          <Link href="/about" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text)", textDecoration: "none" }}>
            LEARN MORE <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
