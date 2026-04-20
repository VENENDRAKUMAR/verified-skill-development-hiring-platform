import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const IMG = {
  t1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face",
  t2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face",
  t3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
  t4: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face",
};

const testimonials = [
  { img: IMG.t1, name: "Rahul Mehta", role: "SDE-2 @ Razorpay", quote: "The capstone forced me to build something actually deployable. That single project is what got me hired." },
  { img: IMG.t2, name: "Priya Nair", role: "HR Lead @ Groww", quote: "We cut screening time by 80%. Every candidate arrives pre-validated. Completely different quality." },
  { img: IMG.t3, name: "Arjun Singh", role: "Full Stack @ CRED", quote: "The scorecard is addictive. I went from 62% to 91% in three weeks just chasing that number." },
  { img: IMG.t4, name: "Sneha Patel", role: "SRE Mentor @ Stripe", quote: "I mentor here because candidates already did the work. They ask better questions than anyone." },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 80px)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "clamp(32px, 6vw, 56px)" }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Testimonials</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1 }}>
            Real people. <span className="text-gradient">Real outcomes.</span>
          </h2>
        </div>
        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {testimonials.map(({ img, name, role, quote }) => (
            <div key={name} className="glass-card" style={{ padding: "clamp(20px, 3vw, 28px)" }}>
              <Quote size={20} style={{ color: "var(--amber)", opacity: 0.3, marginBottom: 16 }} />
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--text-2)", fontStyle: "italic", marginBottom: 24 }}>&ldquo;{quote}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={img} alt={name} style={{ width: 40, height: 40, borderRadius: 12, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-2)" }}>{role}</p>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
