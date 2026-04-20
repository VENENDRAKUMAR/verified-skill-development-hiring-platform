"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { label: "Talent", href: "/register?role=candidate" },
  { label: "Company/HR", href: "/register?role=hr" },
  { label: "Mentors", href: "/register?role=mentor" },
  { label: "Interviewers", href: "/register?role=interviewer" },
];

export function Navbar({ scrollTo }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const handleNav = (id) => {
    if (scrollTo) scrollTo(id);
    setOpen(false);
  };

  return (
    <nav
      className="main-nav fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        padding: "0 clamp(16px, 4vw, 48px)",
        background: theme === "dark" ? "rgba(6,6,10,0.6)" : "rgba(250,249,246,0.7)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        borderBottom: "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--amber)", color: "#06060a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, fontStyle: "italic",
          }}>S1</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", letterSpacing: "-0.01em" }}>
            Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="awwwards-link" style={{ fontSize: 13, textDecoration: "none", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              <span className="awwwards-text" data-text={label}>{label}</span>
            </Link>
          ))}
          {scrollTo && (
            <>
              <button onClick={() => handleNav("features")} className="awwwards-link" style={{ fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                <span className="awwwards-text" data-text="Features">Features</span>
              </button>
              <button onClick={() => handleNav("testimonials")} className="awwwards-link" style={{ fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                <span className="awwwards-text" data-text="Testimonials">Testimonials</span>
              </button>
            </>
          )}
        </div>

        <style>{`
          .awwwards-link { position: relative; overflow: hidden; display: inline-flex; }
          .awwwards-text {
            display: inline-block; transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
            position: relative;
          }
          .awwwards-text::after {
            content: attr(data-text); position: absolute; left: 0; top: 100%;
            color: var(--amber); /* Hover slide color */
          }
          .awwwards-link:hover .awwwards-text {
            transform: translateY(-100%);
          }
        `}</style>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/login" className="btn-ghost hide-mobile" style={{ fontSize: 13 }}>Sign in</Link>
          <Link href="/register" className="btn-primary btn-sm">
            Get Started <ArrowRight size={12} />
          </Link>
          <button className="hide-desktop btn-ghost" onClick={() => setOpen(p => !p)} style={{ padding: "8px 10px" }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ padding: "12px 0 20px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ textAlign: "left", padding: "12px 4px", color: "var(--text-2)", fontSize: 15, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
          {scrollTo && ["Features", "Testimonials"].map(label => (
            <button key={label} onClick={() => handleNav(label.toLowerCase())}
              style={{ textAlign: "left", padding: "12px 4px", background: "none", border: "none", color: "var(--text-2)", fontSize: 15, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              {label}
            </button>
          ))}
          <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", marginTop: 6 }}>
            <Link href="/login" style={{ display: "block", color: "var(--text-2)", fontSize: 15, padding: "8px 0", textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  const cols = [
    { title: "Platform", links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "For Candidates", href: "/register?role=candidate" },
      { label: "For HRs", href: "/register?role=hr" },
      { label: "Become a Mentor", href: "/register?role=mentor" },
      { label: "Refer & Earn", href: "/refer" },
    ]},
    { title: "Company", links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ]},
    { title: "Legal", links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ]},
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 64px) clamp(24px, 3vw, 40px)" }}>
        {/* Top */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "clamp(24px, 4vw, 48px)", marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: "var(--amber)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 11, color: "#06060a", fontWeight: 700,
              }}>S1</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
                Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-2)", maxWidth: 240 }}>
              India's first verified talent platform. Proof over promises.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--amber)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>© {new Date().getFullYear()} Skill1 Hire. All rights reserved.</p>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/privacy" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
