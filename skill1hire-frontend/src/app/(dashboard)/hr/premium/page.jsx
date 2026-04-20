"use client";
import { useAuth } from "@/context/AuthContext";
import { Card, Btn, PageHdr, Badge } from "@/components/ui";
import { CheckCircle2, Zap, ShieldCheck, Crown, Briefcase, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function PremiumPlans() {
  const { user } = useAuth();
  const [billing, setBilling] = useState("yearly"); // monthly | yearly
  const [loadingId, setLoadingId] = useState(null);

  const switchPlan = (planId) => {
    setLoadingId(planId);
    // Simulate API call for upgrading plan
    setTimeout(() => {
      setLoadingId(null);
      toast.success(`Successfully upgraded to the ${planId.toUpperCase()} plan! Welcome to the big leagues.`);
    }, 1500);
  };

  const PLANS = [
    {
      id: "pro",
      name: "Pro",
      icon: Zap,
      price: billing === "monthly" ? "₹2,999" : "₹24,999",
      desc: "For growing startups hiring efficiently.",
      features: [
        "Up to 10 Active Jobs",
        "Full Candidate Profiles",
        "Direct Messaging Access",
        "Standard Analytics",
        "Email Support",
      ],
      color: "indigo",
      btnText: "Upgrade to Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Crown,
      price: billing === "monthly" ? "₹9,999" : "₹99,999",
      desc: "Maximum power and unlimited scalability.",
      features: [
        "Unlimited Active Jobs",
        "Priority Search Placement",
        "AI Candidate Ranking",
        "Dedicated Account Manager",
        "White-glove Onboarding",
        "24/7 Phone + Email Support",
      ],
      color: "amber",
      popular: true,
      btnText: "Go Enterprise",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="text-center mb-12">
        <PageHdr 
          title="Skill1 Hire Premium" 
          sub="Unlock hyper-efficient hiring tools and reach top 1% verified talent instantly." 
        />
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-zinc-900/50 border border-white/5 rounded-full mt-6">
          <button 
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${billing === "monthly" ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBilling("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${billing === "yearly" ? 'bg-amber text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Yearly <Badge variant="green" className="text-[9px] py-0 px-1.5">SAVE 20%</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        
        {/* Free Tier */}
        <Card className="p-8 bg-zinc-900/20 border-white/5 opacity-80 hover:opacity-100 transition-opacity">
          <h3 className="font-bold text-white text-xl mb-2">Basic</h3>
          <p className="text-zinc-500 text-sm mb-6">Standard hiring tools for emerging platforms.</p>
          <div className="mb-6">
            <span className="text-4xl font-black text-white">Free</span>
            <span className="text-zinc-500 text-sm"> / forever</span>
          </div>
          <div className="space-y-4 mb-8">
            <FeatureItem text="1 Active Job Post" />
            <FeatureItem text="Basic Candidate View" />
            <FeatureItem text="Community Support" />
            <FeatureItem text="Limited Analytics" missing />
            <FeatureItem text="AI Ranking" missing />
          </div>
          <Btn variant="secondary" className="w-full opacity-50 cursor-not-allowed" disabled>Current Plan</Btn>
        </Card>

        {/* Paid Tiers */}
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isAmber = plan.color === "amber";

          return (
            <Card 
              key={plan.id} 
              className={`relative p-8 border ${plan.popular ? 'border-amber/50 shadow-[0_0_40px_rgba(245,158,11,0.1)] scale-105 z-10 bg-gradient-to-b from-black to-zinc-900/40' : 'border-indigo-500/20 bg-zinc-900/40 hover:border-indigo-500/50'} transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-amber-400 text-black text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${isAmber ? 'bg-amber/10 text-amber' : 'bg-indigo-500/10 text-indigo-400'}`}>
                <Icon size={28} />
              </div>

              <h3 className={`font-bold text-2xl mb-2 ${isAmber ? 'text-amber' : 'text-indigo-400'}`}>{plan.name}</h3>
              <p className="text-zinc-400 text-sm mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white leading-none">{plan.price}</span>
                <span className="text-zinc-500 text-sm mb-1">/ {billing === "monthly" ? "mo" : "yr"}</span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                   <FeatureItem key={i} text={feat} activeColor={isAmber ? 'text-amber' : 'text-indigo-400'} />
                ))}
              </div>

              <Btn 
                onClick={() => switchPlan(plan.id)}
                loading={loadingId === plan.id}
                className={`w-full text-base py-6 font-bold ${isAmber ? 'bg-amber text-black hover:bg-amber-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {plan.btnText}
              </Btn>

            </Card>
          );
        })}
      </div>

    </div>
  );
}

function FeatureItem({ text, missing, activeColor = "text-white" }) {
  return (
    <div className={`flex items-start gap-3 ${missing ? 'opacity-40' : ''}`}>
      <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${missing ? 'text-zinc-600' : activeColor}`} />
      <span className="text-sm font-medium text-zinc-300 leading-tight">{text}</span>
    </div>
  );
}
