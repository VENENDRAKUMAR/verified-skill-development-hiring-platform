"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Badge, PageHdr, Skel, Avatar } from "@/components/ui";
import { Briefcase, MapPin, Building2, Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(({ data }) => {
        /* We need a dedicated jobs list — fallback to dashboard data for now */
      })
      .catch(() => toast.error("Failed to load jobs"));

    /* Fetch jobs from the public endpoint */
    const fetchJobs = async () => {
      try {
        const { data } = await adminAPI.getDashboard();
        const stats = data?.data?.stats;
        /* Use the jobs API to get all jobs */
        const api = (await import("@/lib/api")).default;
        const res = await api.get("/jobs", { params: { limit: 100 } });
        setJobs(res.data?.data?.jobs || []);
      } catch (err) { toast.error("Failed to load jobs"); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <PageHdr title="All Jobs" />
      {[...Array(5)].map((_, i) => <Skel key={i} className="h-20 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHdr title="All Jobs" sub={`${jobs.length} jobs posted on the platform`} />

      <div className="grid gap-3">
        {jobs.length === 0
          ? <Card className="p-12 text-center text-zinc-500 text-sm">No jobs posted yet.</Card>
          : jobs.map(job => (
          <Card key={job._id} className="p-5 bg-zinc-900/30 border-white/5 hover:border-amber/20 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center shrink-0 text-amber">
                  <Briefcase size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{job.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {job.company && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Building2 size={11} /> {job.company}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin size={11} /> {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock size={11} /> {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={job.status === "active" ? "green" : "amber"}>{job.status || "draft"}</Badge>
                {job.isExternalJob && <Badge variant="purple">External</Badge>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
