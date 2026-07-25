import React from "react";
import { ArrowRight, Crown, Flame, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { label: "Weekly solves", value: "84" },
    { label: "Current streak", value: "12" },
    { label: "Rating", value: "1842" },
  ];

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(135deg,_rgba(248,210,80,0.12),_rgba(155,92,255,0.08))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(248,210,80,0.2),_transparent_30%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#171a22]/70 px-3 py-1 text-sm text-[#f8d250]">
            <Crown className="h-4 w-4" />
            Elite Competitive Programming Hub
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Welcome back, Harsh <span className="text-[#f8d250]">👑</span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#a8a8b3] sm:text-base">
              Your training cockpit for contests, drills, and rankings. Prepare like a top-tier competitor with a premium workspace built for focus.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/practice">
              <Button className="rounded-2xl bg-[#f8d250] px-5 py-2.5 text-sm font-semibold text-[#0f0f14] hover:bg-[#ffe38b]">
                Open Practice
              </Button>
            </Link>
            <Link to="/contests">
              <Button className="rounded-2xl border border-[#f8d250]/20 bg-[#171a22]/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#23242e]">
                View Contests
              </Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#f8d250]/12 bg-[#171a22]/70 p-4">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-[#a8a8b3]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-6">
          <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle,_rgba(248,210,80,0.15),_transparent_60%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#a8a8b3]">Today’s status</p>
                <p className="mt-1 text-xl font-semibold text-white">Ready to compete</p>
              </div>
              <div className="rounded-2xl border border-[#22c55e]/20 bg-[#22c55e]/10 p-2 text-[#22c55e]">
                <Flame className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-[20px] border border-[#f8d250]/15 bg-[#111218]/80 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f8d250]/15 p-3 text-[#f8d250]">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">Gold tier</p>
                  <p className="text-sm text-[#a8a8b3]">Competitive coding momentum is rising</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#f8d250]/12 bg-[#111218]/70 p-4 text-sm text-[#a8a8b3]">
              <span>Next target</span>
              <span className="font-semibold text-white">Master 1800+</span>
            </div>

            <Button className="w-full rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 text-[#f8d250] hover:bg-[#f8d250]/20">
              Review roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
