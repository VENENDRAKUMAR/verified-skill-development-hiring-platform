import Link from "next/link";
import { ArrowRight, ChevronDown, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection({ scrollTo }) {
  return (
    <section id="hero" style={{
      minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", textAlign: "center", background: "#050505"
    }}>
      {/* ── Background Video with Poster Fallback ── */}
      <video
        autoPlay loop muted playsInline
        poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&fit=crop"
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          minWidth: "100%", minHeight: "100%", objectFit: "cover", zIndex: 0,
          filter: "brightness(0.35) contrast(1.1) saturate(1.2)",
        }}
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-golden-sand-flowing-down-in-a-slow-motion-40915-large.mp4" type="video/mp4" />
      </video>

      {/* ── Desktop Gradient Vignette ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse at center, transparent 0%, #030008 100%)", opacity: 0.9 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30vh", zIndex: 1, background: "linear-gradient(to top, #030008 20%, transparent 100%)" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", padding: "140px clamp(20px, 5vw, 60px) 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 24px", borderRadius: 99, marginBottom: 40,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--amber)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text)" }}>
            The Industry Standard for Hiring
          </span>
        </motion.div>

        {/* Elegant Pro Typography */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 8vw, 9rem)",
          lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase",
          margin: 0, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            HIRING THAT DOESN'T
          </motion.div>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 1, ease: [0.16, 1, 0.3, 1] }} 
            style={{ 
              color: "transparent",
              backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80')",
              backgroundSize: "cover", backgroundPosition: "center",
              WebkitBackgroundClip: "text", WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              filter: "drop-shadow(0 0 30px rgba(212,175,55,0.3))"
            }}
          >
            FEEL LIKE A SECOND JOB.
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 500, color: "var(--text-2)",
            maxWidth: 650, lineHeight: 1.6, marginTop: 40, marginBottom: 40
          }}
        >
          Hire better candidates, faster. Skill1 Hire is a best in class hiring platform designed to streamline your interview process, saving significant time & money.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
           style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}
        >
          <Link href="/register?role=candidate" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "18px 40px",
            background: "#fff", color: "#000", fontFamily: "var(--font-body)",
            fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
            borderRadius: 0, textDecoration: "none", transition: "transform 0.3s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Get Started <Play size={16} fill="#000" />
          </Link>
          <Link href="/register?role=hr" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "18px 40px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontFamily: "var(--font-body)", backdropFilter: "blur(10px)",
            fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
            borderRadius: 0, textDecoration: "none", transition: "background 0.3s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            Hire Talent <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <button onClick={() => scrollTo("roadmap")} style={{
        position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
        background: "none", border: "none", cursor: "pointer", zIndex: 3,
      }}>
        <ChevronDown size={24} style={{ color: "rgba(255,255,255,0.4)", animation: "floatY 2s ease-in-out infinite" }} />
      </button>
    </section>
  );
}
