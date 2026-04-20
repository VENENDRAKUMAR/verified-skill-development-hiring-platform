"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar, Footer } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/hero/sections";

/* Lazy-load everything below the fold */
const MarqueeSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.MarqueeSection })), { ssr: false });
const RoadmapSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.RoadmapSection })), { ssr: false });
const SDLCSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.SDLCSection })), { ssr: false });
const ProcessSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.ProcessSection })), { ssr: false });
const ManifestoSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.ManifestoSection })), { ssr: false });
const BentoSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.BentoSection })), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.ServicesSection })), { ssr: false });
const StatsSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.StatsSection })), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.TestimonialsSection })), { ssr: false });
const FAQSection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.FAQSection })), { ssr: false });
const CTASection = dynamic(() => import("@/components/hero/sections").then(m => ({ default: m.CTASection })), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });

export default function Home() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    let lenis;
    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.create({
        start: "top -60",
        onUpdate: (self) => {
          const nav = document.querySelector(".main-nav");
          if (!nav) return;
          const isDark = document.documentElement.getAttribute("data-theme") !== "light";
          nav.style.background = self.progress > 0
            ? (isDark ? "rgba(6,6,10,0.92)" : "rgba(250,249,246,0.92)")
            : (isDark ? "rgba(6,6,10,0.6)" : "rgba(250,249,246,0.7)");
          nav.style.borderBottomColor = self.progress > 0 ? "var(--border)" : "transparent";
        }
      });

      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray(".reveal-stagger").forEach(el => {
        gsap.fromTo(el.children, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      gsap.to(".marquee-track", { x: "-50%", duration: 22, ease: "none", repeat: -1 });
      const rmTrack = document.querySelector(".roadmap-track");
      if (rmTrack) gsap.to(rmTrack, { x: "-50%", duration: 30, ease: "none", repeat: -1 });

    })();
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text)", background: "var(--bg)" }}>
      <CustomCursor />
      <Navbar scrollTo={scrollTo} />

      <HeroSection scrollTo={scrollTo} />
      <MarqueeSection />
      <RoadmapSection />
      <SDLCSection />
      <ProcessSection />
      <ManifestoSection />
      <BentoSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      <Footer />

      <style>{`
        @keyframes sunriseShift {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% 30%; }
        }
        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .bento-grid > *:first-child { grid-column: span 2 !important; min-height: 280px !important; }
          .bento-cell { min-height: 180px; }
        }
        @media (max-width: 480px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > *:first-child { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
}