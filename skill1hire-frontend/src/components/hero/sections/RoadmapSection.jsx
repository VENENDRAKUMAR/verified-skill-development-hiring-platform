import { BookOpen, Target, Code, Monitor, Upload, Briefcase, ClipboardList, Users, Award, BarChart3, Search, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const roadmapSteps = [
  { n: "01", title: "DSA Learn", icon: BookOpen },
  { n: "02", title: "Aptitude Prep & Test", icon: Target },
  { n: "03", title: "Technical Concepts", icon: Code },
  { n: "04", title: "Add Assignment", icon: Monitor },
  { n: "05", title: "Assessment Submission", icon: Upload },
  { n: "06", title: "Project Work", icon: Briefcase },
  { n: "07", title: "System Design", icon: ClipboardList },
  { n: "08", title: "Mentorship", icon: Users },
  { n: "09", title: "Internship Work", icon: Award },
  { n: "10", title: "Online Tests & Score Card", icon: BarChart3 },
  { n: "11", title: "Meet Recruiters", icon: Search },
  { n: "12", title: "HR & Managerial", icon: Calendar },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" style={{ padding: "120px 0", overflow: "hidden", position: "relative", background: "#050505" }}>
      {/* Ambient background glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "80vw", height: "80vw", background: "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />
      
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} style={{ textAlign: "center", marginBottom: 60, padding: "0 clamp(16px, 5vw, 64px)", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>Talent Roadmap</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff" }}>
          The Path To <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}>Mastery</span>
        </h2>
      </motion.div>

      <div style={{ overflow: "hidden", padding: "20px 0", cursor: "grab", position: "relative", zIndex: 1 }}>
        <div className="roadmap-track" style={{ display: "flex", gap: 20, width: "max-content", paddingLeft: "5vw" }}>
          {[...roadmapSteps, ...roadmapSteps].map(({ n, title, icon: Icon }, i) => (
            <motion.div key={i} 
              whileHover={{ y: -10, scale: 1.05, borderColor: "rgba(212,175,55,0.6)", boxShadow: "0 20px 40px rgba(212,175,55,0.15)" }}
              style={{
                flexShrink: 0, width: 220, padding: "32px 24px",
                borderRadius: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16,
                backdropFilter: "blur(10px)", transition: "border-color 0.4s, box-shadow 0.4s"
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--amber)", textTransform: "uppercase", background: "rgba(212,175,55,0.1)", padding: "4px 12px", borderRadius: 99 }}>STEP {n}</span>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={24} style={{ color: "var(--amber)" }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
