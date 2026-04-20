"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { hrAPI, authAPI } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import { compressImage, uploadToCloudinary } from "@/lib/cloudinary";
import { Card, Btn, Field, TextArea, Badge, PageHdr, Tabs, Skel, Avatar, Progress } from "@/components/ui";
import {
  Building2, Globe, User, Mail, Lock, Calendar, ShieldCheck, Phone, MapPin, Briefcase, Sun, Moon, Trash2, Upload, X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HRSettings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tab, setTab] = useState("company");
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    hrAPI.getProfile().then(({ data }) => {
      const p = data?.data?.profile;
      setProfile(p);
      reset({
        companyName: p?.companyName, companyWebsite: p?.companyWebsite,
        companyLogo: p?.companyLogo, designation: p?.designation,
        bio: p?.bio, phone: p?.phone, location: p?.location,
        industry: p?.industry, companySize: p?.companySize,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSave = async (data) => {
    setSaving(true);
    try {
      await hrAPI.updateProfile(data);
      toast.success("Profile updated ✅");
      setProfile(prev => ({ ...prev, ...data }));
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id: "company", label: "Company Info" },
    { id: "upload", label: "Files" },
    { id: "account", label: "Account" },
  ];

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToCloudinary(file, (p) => setUploadProgress(p));
      await hrAPI.updateProfile({ companyLogo: result.url });
      reset({ companyLogo: result.url });
      setProfile(prev => ({ ...prev, companyLogo: result.url }));
      toast.success("Logo uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  if (loading) return <div className="p-6"><PageHdr title="Settings" /><Skel className="h-10 mb-6" /><Skel className="h-72" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHdr title="Settings" sub="Manage your company profile and account" />

      <Card className="p-5 mb-8 bg-zinc-900/40 border-white/5 flex flex-col md:flex-row items-center gap-5">
        <Avatar src={profile?.companyLogo || user?.profilePic} name={profile?.companyName || user?.name} className="w-20 h-20 border-4 border-white/5 ring-2 ring-indigo-500/20" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-bold text-white text-lg">{profile?.companyName || user?.name}</h2>
          {profile?.designation && <p className="text-sm text-zinc-400 mt-0.5">{profile.designation}</p>}
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <Badge variant="indigo">HR</Badge>
            {user?.isVerified && <Badge variant="green" className="gap-1"><ShieldCheck size={11} /> Verified</Badge>}
            {profile?.plan && <Badge variant={profile.plan === "enterprise" ? "purple" : profile.plan === "pro" ? "indigo" : "dim"}>{profile.plan} plan</Badge>}
          </div>
        </div>
      </Card>

      <div className="mb-6 border-b border-white/5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-[-1px]" />
      </div>

      {tab === "company" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5 shadow-xl">
          <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Company Name" placeholder="Acme Corp" {...register("companyName")} />
              <Field label="Company Website" placeholder="https://acme.com" {...register("companyWebsite")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Company Logo URL" placeholder="https://logo-url.com/logo.png" {...register("companyLogo")} />
              <Field label="Designation" placeholder="HR Manager" {...register("designation")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Industry" placeholder="Technology" {...register("industry")} />
              <Field label="Company Size" placeholder="50-200" {...register("companySize")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Phone" placeholder="+91 XXXXX XXXXX" {...register("phone")} />
              <Field label="Location" placeholder="Mumbai, India" {...register("location")} />
            </div>
            <TextArea label="About Company" placeholder="Tell candidates about your company..." rows={4} {...register("bio")} />
            <div className="flex justify-end pt-4">
              <Btn type="submit" loading={saving} className="px-8 bg-amber text-black hover:bg-amber-400">Save Changes</Btn>
            </div>
          </form>
        </Card>
      )}

      {tab === "upload" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <div className="space-y-6">
            <p className="text-sm text-zinc-500 mb-4">Upload company logo and documents to Cloudinary.</p>
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              {uploading ? (
                <div className="text-center w-full max-w-xs">
                  <Upload size={40} className="mx-auto mb-4 text-amber animate-bounce" />
                  <p className="text-sm font-medium text-white mb-2">Uploading...</p>
                  <Progress value={uploadProgress} color="amber" label="Upload progress" />
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-amber/10 border border-amber/30 hover:bg-amber/20 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-amber/20 flex items-center justify-center">
                    <Upload size={28} className="text-amber" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Click to upload logo</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              )}
            </div>
            {profile?.companyLogo && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Current Logo</p>
                <Avatar src={profile.companyLogo} name={profile?.companyName || "Company"} size="xl" className="w-24 h-24" />
              </div>
            )}
          </div>
        </Card>
      )}

      {tab === "account" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white mb-4">Account Information</h3>
            <AccountRow icon={Mail} label="Email Address" value={user?.email} locked />
            <AccountRow icon={User} label="Full Name" value={user?.name} />
            <AccountRow icon={ShieldCheck} label="Account Role" badge={<Badge variant="indigo">HR</Badge>} verified={user?.isVerified} />
            <AccountRow icon={Calendar} label="Member Since" value={user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "N/A"} />
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
                  if (confirm("Are you absolutely sure you want to delete your HR account? This will lock your session immediately.")) {
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

function AccountRow({ icon: Icon, label, value, locked, badge, verified }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
        <Icon size={18} className={locked ? "text-zinc-400" : "text-amber"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
        {badge ? <div className="flex items-center gap-2">{badge}{verified && <Badge variant="green" className="gap-1"><ShieldCheck size={10} /> Verified</Badge>}</div>
          : <p className="text-sm text-zinc-300 truncate">{value}</p>}
      </div>
      {locked && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-white/5">
          <Lock size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Locked</span>
        </div>
      )}
    </div>
  );
}
