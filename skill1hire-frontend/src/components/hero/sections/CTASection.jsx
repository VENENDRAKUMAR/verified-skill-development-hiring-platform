import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section id="cta" style={{
      padding: "clamp(100px, 12vw, 160px) clamp(20px, 5vw, 80px)",
      position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {/* Abstract Video CTA Background */}
      <video 
        autoPlay loop muted playsInline
        poster="https://images.unsplash.com/photo-1620025350992-0bba47f63ca5?w=1600&q=80"
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          minWidth: "100%", minHeight: "100%", objectFit: "cover", zIndex: 0,
          filter: "brightness(0.3) contrast(1.2) saturate(1.2)",
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-golden-sand-flowing-down-in-a-slow-motion-40915-large.mp4" type="video/mp4" />
      </video>

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, var(--bg) 0%, transparent 40%, transparent 60%, var(--bg) 100%)",
      }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }} 
        style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24, textShadow: "0 0 20px rgba(212,175,55,0.5)" }}>
          The Standard For Hiring
        </p>
        
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)", textTransform: "uppercase", lineHeight: 0.85, marginBottom: 40, letterSpacing: "-0.03em", color: "var(--text)" }}>
          <span className="text-gradient">Platform For</span><br />
          Recruiters
        </h2>
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/register?role=hr" className="btn-primary" style={{ padding: "20px 48px", textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: "16px" }}>
            Post Job Free <ArrowRight size={18} />
          </Link>
          <Link href="/register?role=candidate" className="btn-secondary" style={{ padding: "20px 48px", textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: "16px", background: "var(--surface)" }}>
            I&apos;m a Candidate
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
