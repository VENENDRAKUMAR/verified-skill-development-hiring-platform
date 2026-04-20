"use client";
import { useAuth } from "@/context/AuthContext";
import { PageHdr, Card, Btn, Badge } from "@/components/ui";
import { Layers, FileCheck, Notebook } from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Domain Manager Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage assessments and candidate assignments for your domain.</p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-900/50 border border-white/5">
          <Badge variant="amber">Manager Access</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-zinc-900/50 border-white/5 flex flex-col gap-3">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <Layers size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Manage Domains</h2>
          <p className="text-sm text-zinc-400">View and adjust domain criteria, topics, and thresholds.</p>
          <Btn className="mt-4" variant="secondary">View Domains</Btn>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-white/5 flex flex-col gap-3">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <FileCheck size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Assessments</h2>
          <p className="text-sm text-zinc-400">Create new multiple-choice and descriptive questions.</p>
          <Btn className="mt-4" variant="secondary">Create Assessment</Btn>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-white/5 flex flex-col gap-3">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <Notebook size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Assignments</h2>
          <p className="text-sm text-zinc-400">Assign hands-on coding tasks to verify candidate skills.</p>
          <Btn className="mt-4" variant="secondary">Manage Assignments</Btn>
        </Card>
      </div>

      <Card className="p-6 bg-zinc-900/40 border-white/5 mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Pending Candidates for Review</h3>
        <div className="p-10 border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
          <p className="text-sm text-zinc-500 animate-pulse">Waiting for candidate submissions...</p>
        </div>
      </Card>
    </div>
  );
}
