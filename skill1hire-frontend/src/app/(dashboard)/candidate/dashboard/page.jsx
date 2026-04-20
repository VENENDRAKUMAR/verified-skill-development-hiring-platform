"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { candidateAPI } from "@/lib/api";
import { Card, Badge, Btn, Skel, PageHdr, Avatar } from "@/components/ui";
import { Briefcase, CheckCircle, BookOpen, Clock, Flame, Code, Target } from "lucide-react";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [sc, setSc] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      candidateAPI.getScorecard(),
      candidateAPI.getMyApplications({ limit: 5 }),
    ])
      .then(([s, a]) => {
        setSc(s.data?.data?.scorecard);
        setApps(a.data?.data?.applications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <Skel className="h-20" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skel key={i} className="h-32" />)}
      </div>
    </div>
  );

  const statusColors = {
    applied: "bg-zinc-500",
    under_review: "bg-blue-500",
    offered: "bg-green-500",
    hired: "bg-green-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={user?.isVerified ? "green" : "amber"}>
            {user?.isVerified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </div>

      {/* Stats Row - GitHub style */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-amber" />
            <p className="text-xs text-zinc-400">Profile Score</p>
          </div>
          <p className="text-2xl font-bold text-white">{sc?.profileCompleteness || 0}%</p>
        </Card>
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={16} className="text-blue-500" />
            <p className="text-xs text-zinc-400">Applications</p>
          </div>
          <p className="text-2xl font-bold text-white">{apps.length}</p>
        </Card>
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-500" />
            <p className="text-xs text-zinc-400">Tests Passed</p>
          </div>
          <p className="text-2xl font-bold text-white">{sc?.totalAssessmentsPassed || 0}</p>
        </Card>
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-orange-500" />
            <p className="text-xs text-zinc-400">Streak Days</p>
          </div>
          <p className="text-2xl font-bold text-white">{sc?.streakDays || 0}</p>
        </Card>
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Code size={16} className="text-indigo-500" />
            <p className="text-xs text-zinc-400">Assignments Done</p>
          </div>
          <p className="text-2xl font-bold text-white">{sc?.totalAssignmentsCompleted || 0}</p>
        </Card>
      </div>

      {/* Applications Table - GitHub style */}
      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="font-semibold text-white">Recent Applications</h2>
          <Link href="/candidate/applications" className="text-sm text-amber hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {apps.length > 0 ? apps.map(app => (
            <div key={app._id} className="flex items-center justify-between p-4 hover:bg-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Briefcase size={16} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{app.job?.title || "Job"}</p>
                  <p className="text-xs text-zinc-500">{app.job?.company || "Company"} • {app.job?.location || "Remote"}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[app.status] || "bg-zinc-500"}`}>
                {app.status?.replace("_", " ")}
              </span>
            </div>
          )) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No applications yet. <Link href="/candidate/jobs" className="text-amber hover:underline">Browse jobs</Link>
            </div>
          )}
        </div>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/candidate/jobs" className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-sm text-zinc-300">
              <Briefcase size={14} /> Find Jobs
            </Link>
            <Link href="/candidate/profile" className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-sm text-zinc-300">
              <CheckCircle size={14} /> Complete Profile
            </Link>
            <Link href="/candidate/assessments" className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-sm text-zinc-300">
              <BookOpen size={14} /> Take Assessment
            </Link>
          </div>
        </Card>

        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
          <h3 className="font-semibold text-white mb-3">Profile Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Completeness</span>
              <span className="text-white">{sc?.profileCompleteness || 0}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber" style={{ width: `${sc?.profileCompleteness || 0}%` }} />
            </div>
            <div className="flex justify-between text-sm mt-3">
              <span className="text-zinc-500">Verification</span>
<span className={user?.isVerified ? "text-green-500" : "text-amber"}>
                {user?.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}