import { Search, ClipboardList, Zap, Upload, BarChart3, TrendingUp, Monitor } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const sdlcSteps = [
  { title: "Sourcing", icon: Search, color: "#d4af37" },
  { title: "Screening", icon: ClipboardList, color: "#34d399" },
  { title: "Assessment", icon: Zap, color: "#f59e0b" },
  { title: "Project\nSubmission", icon: Upload, color: "#fb7185" },
  { title: "Online Test", icon: BarChart3, color: "#a78bfa" },
  { title: "Scorecard\nReview", icon: TrendingUp, color: "#38bdf8" },
  { title: "Interview &\nOffer", icon: Monitor, color: "#4ade80" },
];

function TiltNode({ icon: Icon, color, title, delayIndex }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [0, 1], [30, -30]);
  const rotateY = useTransform(springX, [0, 1], [-30, 30]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 100, zIndex: 2 }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: delayIndex * 0.2, type: "spring", stiffness: 200, damping: 20 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            rotateX, rotateY, width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg, rgba(20,20,20,0.8), rgba(10,10,10,0.9))`,
            border: `1px solid ${color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 10px 30px ${color}15, inset 0 2px 10px rgba(255,255,255,0.1)`,
            cursor: "pointer", backdropFilter: "blur(10px)"
          }}
          whileHover={{ scale: 1.15, boxShadow: `0 20px 50px ${color}40, inset 0 2px 20px rgba(255,255,255,0.2)` }}
        >
          <Icon size={28} style={{ color, filter: `drop-shadow(0 0 10px ${color})` }} />
        </motion.div>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: delayIndex * 0.2 + 0.2 }}
        style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line", letterSpacing: "0.05em", textTransform: "uppercase" }}
      >
        {title}
      </motion.p>
    </div>
  );
}

export function SDLCSection() {
  return (
    <section style={{ padding: "120px clamp(16px, 5vw, 64px)", background: "#020202", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "80vw", height: "80vw", background: "radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 60%)", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />
      
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>The Pipeline</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff" }}>
            The <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}>SDLC-Ready</span> Path
          </h2>
        </motion.div>

        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: "20px 10px" }}>
          {sdlcSteps.map((step, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center" }}>
              <TiltNode {...step} delayIndex={idx} />
              
              {idx < sdlcSteps.length - 1 && (
                <div style={{ width: "clamp(30px, 4vw, 60px)", height: 72, display: "flex", alignItems: "center", marginTop: -20 }} className="hide-mobile">
                  <div style={{ position: "relative", width: "100%", height: 2, background: "rgba(255,255,255,0.05)" }}>
                    <motion.div 
                      style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "100%", background: `linear-gradient(90deg, ${step.color}, ${sdlcSteps[idx+1].color})`, transformOrigin: "left" }}
                      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: idx * 0.2 + 0.3, duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
