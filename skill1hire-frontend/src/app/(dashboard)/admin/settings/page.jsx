"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminAPI } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Card, Badge, PageHdr, Avatar, Progress, Tabs } from "@/components/ui";
import { toast } from "sonner";
import { Mail, User, ShieldCheck, Calendar, Lock, BarChart3, Users, Layers, Sun, Moon, Upload, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/components/ThemeProvider";

export default function AdminSettings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState("account");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const TABS = [
    { id: "account", label: "Account" },
    { id: "upload", label: "Files" },
  ];

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToCloudinary(file, (p) => setUploadProgress(p));
      toast.success("Photo uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHdr title="Settings" sub="Admin account and platform settings" />

      <Card className="p-5 mb-8 bg-zinc-900/40 border-white/5 flex flex-col md:flex-row items-center gap-5">
        <Avatar src={user?.profilePic} name={user?.name} className="w-20 h-20 border-4 border-white/5 ring-2 ring-red-500/20" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-bold text-white text-lg">{user?.name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <Badge variant="red">Admin</Badge>
            <Badge variant="green" className="gap-1"><ShieldCheck size={11} /> Super Admin</Badge>
          </div>
        </div>
      </Card>

      <div className="mb-6 border-b border-white/5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-[-1px]" />
      </div>

      {tab === "account" && (
      <Card className="p-8 bg-zinc-900/20 border-white/5">
        <h3 className="text-base font-bold text-white mb-6">Account Information</h3>
        <div className="space-y-4">
          <InfoRow icon={Mail} label="Email Address" value={user?.email} locked />
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={ShieldCheck} label="Role" badge={<Badge variant="red">Admin</Badge>} />
          <InfoRow icon={Calendar} label="Member Since"
            value={user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "N/A"} />
        </div>
      </Card>
      )}

      {tab === "upload" && (
        <Card className="p-8 bg-zinc-900/20 border-white/5">
          <div className="space-y-6">
            <p className="text-sm text-zinc-500 mb-4">Upload admin photo.</p>
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
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
                    <p className="text-sm font-medium text-white">Click to upload photo</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              )}
            </div>
            {user?.profilePic && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Current Photo</p>
                <Avatar src={user.profilePic} name={user?.name || "Admin"} size="xl" className="w-24 h-24" />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-8 bg-zinc-900/20 border-white/5 mt-8">
        <h3 className="text-base font-bold text-white mb-6">Appearance</h3>
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
          <button onClick={toggle} className="btn-secondary btn-sm shrink-0 whitespace-nowrap hidden sm:inline-flex">
            Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {/* Mobile layout helper */}
          <button onClick={toggle} className="btn-secondary btn-sm block sm:hidden w-full mt-2">
            Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, locked, badge }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5">
        <Icon size={18} className={locked ? "text-zinc-400" : "text-amber"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
        {badge ? badge : <p className="text-sm text-zinc-300 truncate">{value}</p>}
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
