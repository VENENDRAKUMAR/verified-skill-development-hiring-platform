"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now(), dur = 1800;
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - t, 3)) * to));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 5vw, 80px)", position: "relative", overflow: "hidden" }}>
      {/* Sunset glow behind stats */}
      <div style={{
        position: "absolute", top: "30%", left: "40%", width: 500, height: 400, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(60px)",
      }} />
      <div className="reveal" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, textAlign: "center", position: "relative", zIndex: 2 }}>
        {[
          { val: 2400, suf: "+", label: "Verified Candidates" },
          { val: 98, suf: "%", label: "Hire Success Rate" },
          { val: 3, suf: "×", label: "Faster Than Industry" },
          { val: 0, suf: "", label: "Resume Spam", special: "Zero" },
        ].map(({ val, suf, label, special }) => (
          <div key={label}>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2.8rem, 5vw, 4rem)", lineHeight: 1, color: "var(--amber)", marginBottom: 8, textShadow: "0 0 50px rgba(245,158,11,0.2)" }}>
              {special || <Counter to={val} suffix={suf} />}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-2)" }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
