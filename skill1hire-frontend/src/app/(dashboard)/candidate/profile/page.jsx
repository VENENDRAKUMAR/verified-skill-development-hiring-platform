"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Btn, Field, TextArea, Badge, PageHdr, Tabs, Skel, Progress, Avatar } from "@/components/ui";
import { Github, Linkedin, Globe, Plus, X, ShieldCheck, ExternalLink, Camera } from "lucide-react";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("basic");
  
  const { register, handleSubmit, reset, control } = useForm();
  
  // Isse Avatar URL live track hoga preview ke liye
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  useEffect(() => {
    candidateAPI.getProfile().then(({ data }) => {
      const p = data?.data?.profile || data?.data;
      setProfile(p);
      reset({
        headline: p?.headline, bio: p?.bio, location: p?.location, phone: p?.phone,
        linkedin: p?.socialLinks?.linkedin, github: p?.socialLinks?.github, portfolio: p?.socialLinks?.portfolio,
        avatarUrl: p?.avatarUrl, resumeUrl: p?.resumeUrl,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSave = async (data) => {
    setSaving(true);
    try {
      const { linkedin, github, portfolio, ...basic } = data;
      await Promise.all([
        candidateAPI.updateProfile(basic),
        candidateAPI.updateSocialLinks({ linkedin, github, portfolio }),
      ]);
      toast.success("Profile saved ✅");
      // UI update karne ke liye profile state refresh
      setProfile(prev => ({ ...prev, ...basic, avatarUrl: basic.avatarUrl }));
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const onCapstone = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setSaving(true);
    try {
      await candidateAPI.submitCapstone({ 
        title: fd.get("title"), 
        description: fd.get("description"), 
        repoUrl: fd.get("repoUrl"), 
        liveUrl: fd.get("liveUrl") 
      });
      toast.success("Capstone submitted! 🚀");
      const { data } = await candidateAPI.getProfile();
      setProfile(data?.data?.profile || data?.data);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id: "basic", label: "Basic Info" }, 
    { id: "social", label: "Social Links" }, 
    { id: "capstone", label: "Capstone Project" },
    { id: "career", label: "Experience & Education" }
  ];

  if (loading) return <div className="p-6"><PageHdr title="My Profile" /><Skel className="h-10 mb-6" /><Skel className="h-72" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <PageHdr title="Edit Profile" sub="Manage your presence on Skill1 Hire"
        action={profile?.publicSlug && <a href={`/candidate/public/${profile.publicSlug}`} target="_blank"><Btn variant="secondary" size="sm" className="gap-2"><ExternalLink size={14} /> View Public</Btn></a>}
      />

      {/* Profile Score & Verification Banner */}
      <Card className="p-5 mb-8 bg-zinc-900/40 border-white/5 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <Avatar 
            src={avatarUrl || profile?.avatarUrl} 
            name={profile?.name || "User"} 
            className="w-24 h-24 border-4 border-white/5 ring-2 ring-amber/20"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-white text-lg">Profile Score</h2>
            <div className="flex items-center gap-2">
               <span className="text-amber font-bold">{profile?.profileCompleteness || 0}%</span>
               {profile?.isVerified && <Badge variant="green" className="gap-1"><ShieldCheck size={12} /> Verified</Badge>}
            </div>
          </div>
          <Progress value={profile?.profileCompleteness || 0} color="amber" className="h-2" />
          <p className="text-[11px] text-zinc-500 mt-2">Complete your bio and capstone project to reach 100%.</p>
        </div>
      </Card>

      <div className="mb-6 border-b border-white/5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-[-1px]" />
      </div>

      {tab === "basic" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5 shadow-xl">
          <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field 
                label="Avatar URL" 
                placeholder="https://image-link.com/photo.jpg" 
                {...register("avatarUrl")} 
                helper="Use a direct image link (Imgur, Cloudinary, etc.)"
              />
              <Field 
                label="Resume URL" 
                placeholder="Google Drive or Dropbox link" 
                {...register("resumeUrl")} 
              />
            </div>

            <Field 
              label="Professional Headline" 
              placeholder="e.g. MERN Stack Developer | Web3 Enthusiast" 
              {...register("headline")} 
            />
            
            <TextArea 
              label="About Me (Bio)" 
              placeholder="Write a brief intro about your skills and goals..." 
              rows={5} 
              {...register("bio")} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Location" placeholder="Indore, India" {...register("location")} />
              <Field label="Phone Number" placeholder="+91 XXXXX XXXXX" {...register("phone")} />
            </div>

            <div className="flex justify-end pt-4">
              <Btn type="submit" loading={saving} className="px-8 bg-amber text-black hover:bg-amber-400">
                Save Profile Changes
              </Btn>
            </div>
          </form>
        </Card>
      )}

      {tab === "social" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <form onSubmit={handleSubmit(onSave)} className="space-y-5">
            <p className="text-sm text-zinc-500 mb-4">Connect your professional networks to increase visibility.</p>
            {[
              { icon: Linkedin, label: "LinkedIn Profile", name: "linkedin", placeholder: "linkedin.com/in/username", color: "#0077b5" },
              { icon: Github, label: "GitHub Profile", name: "github", placeholder: "github.com/username", color: "#fff" },
              { icon: Globe, label: "Personal Portfolio", name: "portfolio", placeholder: "yourname.dev", color: "var(--amber)" },
            ].map(({ icon: Icon, label, name, placeholder, color }) => (
              <div key={name} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="flex-1">
                   <Field label={label} placeholder={placeholder} inputClass="!mt-0 border-none bg-transparent focus:ring-0" {...register(name)} />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Btn type="submit" loading={saving} variant="secondary">Update Social Links</Btn>
            </div>
          </form>
        </Card>
      )}

      {tab === "capstone" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          {profile?.capstoneProject?.status && profile.capstoneProject.status !== "not_submitted" ? (
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{profile.capstoneProject.title}</h3>
                  <p className="text-zinc-500 text-xs mt-1">Project ID: {profile.capstoneProject._id?.slice(-8)}</p>
                </div>
                <Badge variant={profile.capstoneProject.status === "approved" ? "green" : "amber"} className="py-1 px-3">
                  {profile.capstoneProject.status.toUpperCase().replace("_", " ")}
                </Badge>
              </div>
              <p className="text-zinc-300 leading-relaxed mb-8">{profile.capstoneProject.description}</p>
              <div className="flex flex-wrap gap-4">
                {profile.capstoneProject.repoUrl && (
                  <a href={profile.capstoneProject.repoUrl} target="_blank">
                    <Btn variant="secondary" size="sm" className="gap-2"><Github size={14} /> Repository</Btn>
                  </a>
                )}
                {profile.capstoneProject.liveUrl && (
                  <a href={profile.capstoneProject.liveUrl} target="_blank">
                    <Btn variant="secondary" size="sm" className="gap-2"><ExternalLink size={14} /> Live Preview</Btn>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={onCapstone} className="space-y-5">
              <div className="p-5 rounded-2xl bg-amber/5 border border-amber/10 flex gap-4">
                <Zap className="text-amber shrink-0" size={20} />
                <p className="text-sm text-amber/90">
                  <strong>Submit your best project:</strong> This is the final step to get verified. Once approved, you will get access to the premium job feed.
                </p>
              </div>
              <Field label="Project Title" name="title" placeholder="e.g. Decentralized Escrow Engine" required />
              <TextArea label="Project Description" name="description" placeholder="Describe the problem you solved, features, and tech stack used..." rows={6} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Source Code (GitHub)" name="repoUrl" placeholder="https://github.com/your-username/repo" required />
                <Field label="Deployment Link (Optional)" name="liveUrl" placeholder="https://your-project.vercel.app" />
              </div>
              <div className="flex justify-end pt-4">
                <Btn type="submit" loading={saving} className="bg-amber text-black hover:bg-amber-400">Submit Project for Review 🚀</Btn>
              </div>
            </form>
          )}
        </Card>
      )}

      {tab === "career" && (
        <div className="space-y-6">
          <Card className="p-8 bg-zinc-900/20 border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase size={20} className="text-amber" /> Experience</h3>
              <Btn variant="secondary" size="sm" className="gap-2"><Plus size={14} /> Add Experience</Btn>
            </div>
            {profile?.experience?.length > 0 ? (
              <div className="space-y-4">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="font-semibold text-white">{exp.role} at {exp.company}</p>
                    <p className="text-sm text-zinc-400">{new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? "Present" : new Date(exp.endDate).getFullYear()}</p>
                    <p className="text-sm text-zinc-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-zinc-500">No experience added yet.</p>}
          </Card>

          <Card className="p-8 bg-zinc-900/20 border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><GraduationCap size={20} className="text-amber" /> Education</h3>
              <Btn variant="secondary" size="sm" className="gap-2"><Plus size={14} /> Add Education</Btn>
            </div>
            {profile?.education?.length > 0 ? (
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="font-semibold text-white">{edu.degree} - {edu.fieldOfStudy}</p>
                    <p className="text-sm text-zinc-400">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-zinc-500">No education added yet.</p>}
          </Card>

          <Card className="p-8 bg-zinc-900/20 border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award size={20} className="text-amber" /> Certifications</h3>
              <Btn variant="secondary" size="sm" className="gap-2"><Plus size={14} /> Add Certification</Btn>
            </div>
            {profile?.certifications?.length > 0 ? (
              <div className="space-y-4">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="font-semibold text-white">{cert.name}</p>
                    <p className="text-sm text-zinc-400">Issued by {cert.issuer}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-zinc-500">No certifications added yet.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}