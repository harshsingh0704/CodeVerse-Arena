import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Crown,
  Flame,
  Trophy,
  Code2,
  Target,
  Zap,
  Swords,
  CalendarDays,
  BarChart3,
  Terminal,
  Sparkles,
} from "lucide-react";

const HeroSection = ({ user }) => {
  const firstName = (
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Coder"
  ).trim().split(/\s+/)[0];

  const solved = user?.problemsSolved ?? 0;
  const streak = user?.streak ?? 0;
  const rating = user?.rating ?? 0;
  const rank = user?.rank ?? "—";

  const milestone = 5;
  const progress = Math.min((solved / milestone) * 100, 100);

  const stats = [
    {
      label: "Problems solved",
      value: solved,
      icon: Code2,
      color: "#f8d250",
    },
    {
      label: "Current streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      icon: Flame,
      color: "#fb923c",
    },
    {
      label: "Rating",
      value: rating > 0 ? rating : "Unrated",
      icon: BarChart3,
      color: "#a78bfa",
    },
    {
      label: "Global rank",
      value: rank,
      icon: Trophy,
      color: "#4ade80",
    },
  ];

  const features = [
    {
      title: "Practice Problems",
      description: "Master DSA, one problem at a time.",
      icon: Terminal,
      color: "#f8d250",
      path: "/practice",
    },
    {
      title: "Coding Contests",
      description: "Challenge yourself against others.",
      icon: Swords,
      color: "#a78bfa",
      path: "/contests",
    },
    {
      title: "Leaderboard",
      description: "Discover the top competitors.",
      icon: Trophy,
      color: "#4ade80",
      path: "/leaderboard",
    },
    {
      title: "Daily Challenge",
      description: "Build consistency every day.",
      icon: CalendarDays,
      color: "#fb923c",
      path: "/practice",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#f8d250]/10 bg-[#111218] p-5 sm:p-7 lg:p-9">

      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f8d250]/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#9b5cff]/10 blur-[120px]" />

      <div className="relative space-y-7">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#f8d250]/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#f8d250]">
            <Zap className="h-3.5 w-3.5" />
            THE CODING ARENA
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a8a8b3]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Your workspace
          </div>

        </div>

        {/* Welcome section */}
        <div className="space-y-3">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-[#f8d250] to-[#ffe7a1] bg-clip-text text-transparent">
                {firstName}.
              </span>
            </h1>

            <Crown className="h-8 w-8 text-[#f8d250] lg:h-10 lg:w-10" />

          </div>

          <p className="text-base font-medium text-[#d4d4dc] sm:text-lg">
            Think. Code. Compete. Repeat.
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-[#a8a8b3]">
            {solved === 0
              ? "Your next breakthrough begins with a single line of code. Start your journey and unlock your potential."
              : "Every solution brings you closer to mastery. Keep challenging yourself and climb the leaderboard."}
          </p>

        </div>

        {/* Primary actions */}
        <div className="flex flex-wrap gap-3">

          <Link
            to="/practice"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#f8d250] px-5 py-3 text-sm font-semibold text-[#111218] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffe38b] hover:shadow-[0_0_25px_rgba(248,210,80,0.2)]"
          >
            <Code2 className="h-4 w-4" />

            {solved === 0
              ? "Start Practicing"
              : "Continue Practicing"}

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/contests"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition-all hover:border-[#f8d250]/30 hover:bg-white/[0.06]"
          >
            <Trophy className="h-4 w-4 text-[#f8d250]" />
            Explore Contests
          </Link>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          {stats.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-white/[0.05] bg-[#191b24] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 sm:p-5"
            >

              <div
                className="mb-4 inline-flex rounded-xl p-2.5"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                }}
              >
                <item.icon className="h-5 w-5" />
              </div>

              <p
                className="text-xl font-bold sm:text-2xl"
                style={{ color: item.color }}
              >
                {item.value}
              </p>

              <p className="mt-2 text-xs text-[#a8a8b3] sm:text-sm">
                {item.label}
              </p>

            </div>
          ))}

        </div>

        {/* Milestone */}
        <div className="rounded-2xl border border-[#f8d250]/10 bg-[#191b24]/80 p-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-[#f8d250]/10 p-3 text-[#f8d250]">
              <Target className="h-6 w-6" />
            </div>

            <div className="flex-1">

              <h3 className="text-sm font-semibold text-white sm:text-base">
                {solved >= milestone
                  ? "First milestone completed!"
                  : "Your first milestone"}
              </h3>

              <p className="mt-1 text-xs text-[#a8a8b3] sm:text-sm">
                Complete your first 5 coding problems.
              </p>

            </div>

            <span className="text-sm font-semibold text-[#f8d250]">
              {Math.min(solved, milestone)} / {milestone}
            </span>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">

            <div
              className="h-full rounded-full bg-gradient-to-r from-[#eab308] to-[#ffe38b] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />

          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-[#a8a8b3]">
            <Sparkles className="h-3.5 w-3.5 text-[#f8d250]" />

            {solved >= milestone
              ? "Great work! Keep building your skills."
              : "Every expert was once a beginner."}
          </p>

        </div>

        {/* Quick access features */}
        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold text-white">
              Explore your workspace
            </h3>

            <span className="text-xs text-[#777781]">
              Quick access
            </span>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.path}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#191b24] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#f8d250]/25 hover:bg-[#20222c]"
              >

                <div className="mb-5 flex items-center justify-between">

                  <div
                    className="rounded-xl p-3"
                    style={{
                      color: feature.color,
                      backgroundColor: `${feature.color}12`,
                    }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-[#777781] transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f8d250]" />

                </div>

                <h4 className="text-sm font-semibold text-white">
                  {feature.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-[#a8a8b3]">
                  {feature.description}
                </p>

              </Link>
            ))}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] pt-5 text-center">

          <p className="text-[10px] font-medium tracking-[0.2em] text-[#777781]">
            BUILD SKILLS · BREAK LIMITS · BECOME BETTER
          </p>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;