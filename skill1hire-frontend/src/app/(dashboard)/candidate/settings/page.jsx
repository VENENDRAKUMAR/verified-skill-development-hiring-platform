"use client";
import { useEffect, useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { candidateAPI, authAPI } from "@/lib/api";
import { compressImage, uploadToCloudinary } from "@/lib/cloudinary";
import { Card, Btn, Field, TextArea, Badge, PageHdr, Tabs, Skel, Avatar, Progress } from "@/components/ui";
import {
  Github, Linkedin, Globe, ShieldCheck, Camera, Lock, Mail, Calendar,
  User, MapPin, Phone, FileText, ExternalLink, Twitter, Code2, Sun, Moon, Trash2, Upload, X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CandidateSettings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tab, setTab] = useState("profile");
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const { register, handleSubmit, reset, control } = useForm();
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  useEffect(() => {
    candidateAPI.getProfile().then(({ data }) => {
      const p = data?.data?.profile || data?.data;
      setProfile(p);
      reset({
        headline: p?.headline, bio: p?.bio, location: p?.location, phone: p?.phone,
        linkedin: p?.socialLinks?.linkedin, github: p?.socialLinks?.github,
        portfolio: p?.socialLinks?.portfolio, twitter: p?.socialLinks?.twitter,
        leetcode: p?.socialLinks?.leetcode,
        avatarUrl: p?.avatarUrl, resumeUrl: p?.resumeUrl,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const { linkedin, github, portfolio, twitter, leetcode, ...basic } = data;
      await candidateAPI.updateProfile(basic);
      toast.success("Profile updated ✅");
      setProfile(prev => ({ ...prev, ...basic }));
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const onSaveSocial = async (data) => {
    setSaving(true);
    try {
      const { linkedin, github, portfolio, twitter, leetcode } = data;
      await candidateAPI.updateSocialLinks({ linkedin, github, portfolio, twitter, leetcode });
      toast.success("Social links updated ✅");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });
      
      await candidateAPI.updateProfile({ avatarUrl: result.url });
      reset({ avatarUrl: result.url });
      setProfile(prev => ({ ...prev, avatarUrl: result.url }));
      toast.success("Avatar uploaded successfully ✅");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, (percent) => setUploadProgress(percent));
      await candidateAPI.updateProfile({ resumeUrl: result.url });
      reset({ resumeUrl: result.url });
      setProfile(prev => ({ ...prev, resumeUrl: result.url }));
      toast.success("Resume uploaded!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "upload", label: "Files" },
    { id: "social", label: "Social Links" },
    { id: "account", label: "Account" },
  ];

  if (loading) return (
    <div className="p-6">
      <PageHdr title="Settings" />
      <Skel className="h-10 mb-6" /><Skel className="h-72" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHdr title="Settings" sub="Manage your profile, social links, and account preferences" />

      {/* Profile Summary Banner */}
      <Card className="p-5 mb-8 bg-zinc-900/40 border-white/5 flex flex-col md:flex-row items-center gap-5">
        <div className="relative group">
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="relative cursor-pointer hover:opacity-90 transition-opacity rounded-2xl block">
            <Avatar
              src={avatarUrl || profile?.avatarUrl}
              name={profile?.name || user?.name || "User"}
              className="w-20 h-20 border-4 border-white/5 ring-2 ring-amber/20"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-bold text-white text-lg">{user?.name}</h2>
          {profile?.headline && <p className="text-sm text-zinc-400 mt-0.5">{profile.headline}</p>}
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <Badge variant="amber">candidate</Badge>
            {user?.isVerified && <Badge variant="green" className="gap-1"><ShieldCheck size={11} /> Verified</Badge>}
          </div>
        </div>
      </Card>

      <div className="mb-6 border-b border-white/5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-[-1px]" />
      </div>

      {/* ── Profile Tab ── */}
      {tab === "profile" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5 shadow-xl">
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Avatar URL"
                placeholder="https://image-link.com/photo.jpg"
                {...register("avatarUrl")}
                hint="Use a direct image link (Imgur, Cloudinary, etc.)"
              />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field
                    label="Resume URL"
                    placeholder="Google Drive or Dropbox link"
                    {...register("resumeUrl")}
                  />
                </div>
                <input type="file" ref={resumeInputRef} accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                <button type="button" onClick={() => resumeInputRef.current?.click()} className="btn-secondary btn-sm mb-0.5 whitespace-nowrap">
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
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
                Save Changes
              </Btn>
            </div>
          </form>
        </Card>
      )}

      {/* ── Upload Tab ── */}
      {tab === "upload" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <div className="space-y-6">
            <p className="text-sm text-zinc-500 mb-4">Upload your profile photo and documents directly to Cloudinary.</p>
            
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              {uploading ? (
                <div className="text-center w-full max-w-xs">
                  <Upload size={40} className="mx-auto mb-4 text-amber animate-bounce" />
                  <p className="text-sm font-medium text-white mb-2">Uploading...</p>
                  <Progress value={uploadProgress} color="amber" label="Upload progress" />
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-amber/10 border border-amber/30 hover:bg-amber/20 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber/20 flex items-center justify-center">
                    <Upload size={28} className="text-amber" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Click to upload avatar</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              )}
            </div>

            {profile?.avatarUrl && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Current Avatar</p>
                <div className="relative inline-block group">
                  <Avatar
                    src={profile.avatarUrl}
                    name={profile?.name || user?.name || "User"}
                    size="xl"
                    className="w-24 h-24"
                  />
                  <button
                    onClick={async () => {
                      if (confirm("Remove avatar?")) {
                        await candidateAPI.updateProfile({ avatarUrl: "" });
                        reset({ avatarUrl: "" });
                        setProfile(prev => ({ ...prev, avatarUrl: "" }));
                      }
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── Social Links Tab ── */}
      {tab === "social" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <form onSubmit={handleSubmit(onSaveSocial)} className="space-y-5">
            <p className="text-sm text-zinc-500 mb-4">Connect your professional networks to increase visibility.</p>
            {[
              { icon: Linkedin, label: "LinkedIn Profile", name: "linkedin", placeholder: "linkedin.com/in/username", color: "#0077b5" },
              { icon: Github, label: "GitHub Profile", name: "github", placeholder: "github.com/username", color: "#fff" },
              { icon: Globe, label: "Personal Portfolio", name: "portfolio", placeholder: "yourname.dev", color: "var(--amber)" },
              { icon: Twitter, label: "Twitter / X", name: "twitter", placeholder: "x.com/username", color: "#1DA1F2" },
              { icon: Code2, label: "LeetCode", name: "leetcode", placeholder: "leetcode.com/u/username", color: "#FFA116" },
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
              <Btn type="submit" loading={saving} className="px-8 bg-amber text-black hover:bg-amber-400">
                Update Social Links
              </Btn>
            </div>
          </form>
        </Card>
      )}

      {/* ── Account Tab ── */}
      {tab === "account" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white mb-4">Account Information</h3>

            {/* Email — Locked */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                <Mail size={18} className="text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Email Address</p>
                <p className="text-sm text-zinc-300 truncate">{user?.email}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-white/5">
                <Lock size={12} className="text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Locked</span>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                <User size={18} className="text-amber" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Full Name</p>
                <p className="text-sm text-zinc-300">{user?.name}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                <ShieldCheck size={18} className="text-amber" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Account Role</p>
                <div className="flex items-center gap-2">
                  <Badge variant="amber">{user?.role}</Badge>
                  {user?.isVerified && <Badge variant="green" className="gap-1"><ShieldCheck size={10} /> Verified</Badge>}
                </div>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                <Calendar size={18} className="text-amber" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Member Since</p>
                <p className="text-sm text-zinc-300">
                  {user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "N/A"}
                </p>
              </div>
            </div>

            {/* Email Verification */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                <Mail size={18} className={user?.isEmailVerified ? "text-green-500" : "text-amber"} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Email Verification</p>
                <Badge variant={user?.isEmailVerified ? "green" : "amber"}>
                  {user?.isEmailVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Theme Settings inline in account tab */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <h3 className="text-base font-bold text-white mb-4">Appearance</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
                  {theme === "dark" ? <Moon size={18} className="text-amber" /> : <Sun size={18} className="text-amber" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Theme Preference</p>
                  <p className="text-xs text-zinc-400">Toggle between immersive dark and elegant light mode.</p>
                </div>
              </div>
              <button onClick={toggle} className="btn-secondary btn-sm shrink-0 whitespace-nowrap">
                Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <h3 className="text-base font-bold text-red-500 mb-4 flex items-center gap-2">
              <Trash2 size={18} /> Danger Zone
            </h3>
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-sm font-bold text-white mb-1">Delete Account</h4>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                Once you delete your account, you will be immediately locked out. Your data will enter a 24-hour purge limbo before being permanently removed from our servers.
              </p>
              <Btn 
                onClick={async () => {
                  if (confirm("Are you absolutely sure you want to delete your account? This cannot be undone and will lock your session immediately.")) {
                    try {
                      await authAPI.deleteAccount();
                      window.location.href = "/login";
                    } catch (err) {
                      toast.error("Failed to delete account");
                    }
                  }
                }} 
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-xs px-4"
              >
                Permanently Delete Account
              </Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
