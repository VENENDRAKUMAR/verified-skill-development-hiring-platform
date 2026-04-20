"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, Github, Linkedin, Globe, MapPin,
  ExternalLink, Download, Mail, Phone,
  Award, Briefcase, GraduationCap, Code, FileText,
  CheckCircle2, Star, Sparkles, UserCheck
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function LinkedInStyleProfile() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef();

  useEffect(() => {
    if (!slug) return;
    window.fetch(`${API}/candidate/public/${slug}`)
      .then(async r => {
        const json = await r.json();
        setData(json?.data?.profile || json?.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [slug]);

  const handleDownload = () => {
    window.print(); // Optimized via @media print in CSS
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]"><div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-white text-center py-20">Profile not found.</div>;

  const user = data?.user;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 font-sans selection:bg-amber-500/30">
      <style>{`
        @media print {
          nav, .no-print, .btn-action { display: none !important; }
          .print-container { background: white !important; color: black !important; padding: 0 !important; }
          .card { border: 1px solid #eee !important; box-shadow: none !important; }
          body { background: white !important; }
        }
        .glass-header { background: linear-gradient(to bottom, rgba(245,158,11,0.05), transparent); }
        .hero-banner { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); }
      `}</style>

      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black font-black">S1</div>
             <span className="font-bold text-white hidden sm:block tracking-tight">Skill1 <span className="text-amber-500">Hire</span></span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">
              <Download size={16} /> PDF
            </button>
            <Link href="/register?role=hr" className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-amber-500/20">
              Hire Me
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print-container" ref={profileRef}>
        
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card */}
          <section className="card bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden relative">
            <div className="h-32 sm:h-48 hero-banner relative">
               <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>
            <div className="px-6 pb-8">
              <div className="relative -mt-16 sm:-mt-24 mb-4 flex justify-between items-end">
                <div className="p-1 bg-[#050507] rounded-3xl">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-zinc-900" alt={user.name} />
                  ) : (
                    <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl bg-zinc-800 flex items-center justify-center text-4xl font-black text-zinc-600 border-4 border-zinc-900">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 no-print pb-4">
                   {data?.socialLinks?.linkedin && <a href={data.socialLinks.linkedin} className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={20}/></a>}
                   {data?.socialLinks?.github && <a href={data.socialLinks.github} className="p-2.5 rounded-xl bg-white/5 text-white hover:bg-white/20 transition-all"><Github size={20}/></a>}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name}</h1>
                {user?.isVerified && <ShieldCheck size={22} className="text-emerald-500 fill-emerald-500/10" />}
              </div>
              <p className="text-lg text-zinc-400 font-medium mb-3">{data?.headline || "Software Developer"}</p>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5"><MapPin size={16}/> {data?.location || "India"}</span>
                <span className="flex items-center gap-1.5 text-amber-500 font-bold"><Sparkles size={16}/> {data?.totalAssessmentsPassed || 0} Skills Verified</span>
                <span className="text-zinc-600">•</span>
                <Link href="#" className="text-amber-500 font-bold hover:underline">500+ Connections</Link>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="card bg-zinc-900/40 border border-white/5 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-amber-500" /> About
            </h2>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
              {data?.bio || "No bio provided."}
            </p>
          </section>

          {/* Skills Section */}
          <section className="card bg-zinc-900/40 border border-white/5 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Code size={20} className="text-amber-500" /> Top Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data?.skills?.map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs">
                      {i + 1}
                    </div>
                    <span className="font-bold text-zinc-200">{skill.name}</span>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Stats */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* HireScore Card */}
          <section className="card bg-amber-500 rounded-3xl p-8 text-black relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-black/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Award size={160} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Skill1 HireScore™</p>
            <h2 className="text-6xl font-black mb-4">{data?.overallScore || 0}%</h2>
            <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-black" style={{ width: `${data?.overallScore}%` }} />
            </div>
            <p className="text-sm font-bold leading-snug">
              Top 5% of candidates in this domain based on verified assessments.
            </p>
          </section>

          {/* Contact Quick Info */}
          <section className="card bg-zinc-900/40 border border-white/5 rounded-3xl p-6">
             <h3 className="font-bold text-white mb-4">Contact Info</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500"><Mail size={18}/></div>
                  <span>{user?.email}</span>
                </div>
                {data?.socialLinks?.portfolio && (
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500"><Globe size={18}/></div>
                    <a href={data.socialLinks.portfolio} className="truncate hover:text-amber-500">Portfolio Website</a>
                  </div>
                )}
             </div>
          </section>

          {/* Ad/CTA */}
          <section className="card bg-indigo-600 rounded-3xl p-6 text-center text-white">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 italic font-black text-2xl">S1</div>
             <h4 className="font-bold text-lg mb-2">Hire with Confidence</h4>
             <p className="text-sm text-indigo-100 mb-6">Skill1 Hire verifies every skill so you don't have to.</p>
             <Link href="/register?role=hr" className="block w-full py-3 bg-white text-indigo-600 rounded-xl font-black hover:bg-zinc-100 transition-all">
               Get Started
             </Link>
          </section>

        </aside>
      </main>
    </div>
  );
}