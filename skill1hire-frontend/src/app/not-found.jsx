"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{
      fontFamily: "var(--font-body)", background: "var(--bg)", color: "var(--text)",
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "30%", left: "40%", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 24px", maxWidth: 520 }}>
        {/* Giant 404 */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(8rem, 20vw, 14rem)", lineHeight: 0.9, letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.05) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginBottom: 8, userSelect: "none",
        }}>
          404
        </h1>

        <h2 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: 12, color: "var(--text)",
        }}>
          Page not found
        </h2>

        <p style={{
          fontSize: 15, lineHeight: 1.7, color: "var(--text-2)", marginBottom: 36, maxWidth: 380, margin: "0 auto 36px",
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 14, fontSize: 14, fontWeight: 600,
            background: "var(--amber)", color: "#06060a", textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 20px rgba(245,158,11,0.25)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(245,158,11,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.25)"; }}
          >
            <Home size={15} /> Go Home
          </Link>

          <button onClick={() => window.history.back()} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 14, fontSize: 14, fontWeight: 600,
            background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)",
            cursor: "pointer", fontFamily: "var(--font-body)",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>

        <div style={{
          marginTop: 48, padding: "16px 20px", borderRadius: 14,
          background: "var(--surface)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
        }}>
          <Search size={14} style={{ color: "var(--text-3)" }} />
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
            Try <Link href="/jobs" style={{ color: "var(--amber)", textDecoration: "none" }}>browsing jobs</Link>
            {" "}or{" "}
            <Link href="/register" style={{ color: "var(--amber)", textDecoration: "none" }}>creating an account</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
