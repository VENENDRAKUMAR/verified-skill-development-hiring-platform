import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components/layout/PublicLayout";

export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <Navbar />
      <div className="flex-1 flex" style={{ marginTop: "4rem" }}>
        {/* Left panel */}
        <div className="hidden md:flex flex-col w-[45vw] shrink-0 relative overflow-hidden"
          style={{ borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
        
          {/* Dynamic background blending for Light / Dark mode */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: "radial-gradient(ellipse at bottom left, var(--amber-dim) 0%, transparent 80%)", opacity: 0.85
          }} />
          <div style={{
            position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--bg-2) 0%, var(--surface) 100%)", zIndex: -1 
          }} />

          <div className="relative z-10 flex flex-col h-full justify-center p-12 lg:p-20">
            <Link href="/" className="hidden lg:flex items-center gap-2.5 mb-16">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm" style={{ background: "var(--amber)", color: "#fcfcfc", fontStyle: "italic" }}>S1</div>
              <span className="font-display font-bold text-2xl" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
            </Link>
            <div className="mb-12">
              <h2 className="font-display font-black text-5xl lg:text-6xl leading-[1.05] mb-6" style={{ color: "var(--text)", fontStyle: "italic" }}>
                Where Proof<br />Meets<br /><span className="text-gradient">Opportunity.</span>
              </h2>
              <p className="text-[16px] leading-relaxed mb-10" style={{ color: "var(--text-2)" }}>
                Every candidate is assessed and verified before they can apply to a single job. Welcome to the top 1%.
              </p>
              <div className="space-y-5">
                {["Skill assessments auto-scored", "Capstone project verification", "Blue tick badge on profile", "Curated job feed for verified talent"].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text)" }}>
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 rounded-full" style={{ background: "var(--amber-dim)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
          <div className="absolute inset-0 grid-bg opacity-30 z-0" />
          <div className="w-full max-w-[440px] relative z-10 glass-card p-8 shadow-xl">
            <Link href="/" className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
              <span className="font-display font-bold" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
            </Link>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
