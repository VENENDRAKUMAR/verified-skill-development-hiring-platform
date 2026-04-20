"use client";
import { Card, PageHdr } from "@/components/ui";
import { Lock } from "lucide-react";

export default function Scorecard() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHdr title="Performance Analytics" sub="Internal evaluation in progress" />
      <Card className="p-16 border-white/5 bg-zinc-900/40 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-16 h-16 bg-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber">
          <Lock size={28} />
        </div>
        
        <h2 className="text-2xl font-black text-white mb-3">Scorecard is Internal</h2>
        <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your performance metrics, assignment scores, and interview ratings are kept confidential. 
          They are shared directly with verified companies and HRs evaluating your profile.
        </p>
      </Card>
    </div>
  );
}