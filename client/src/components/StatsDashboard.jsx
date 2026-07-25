import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Award, Calendar, TrendingUp, BarChart2, Sparkles } from "lucide-react";

const StatsDashboard = () => {
  const handle = localStorage.getItem("cfHandle");

  const [stats, setStats] = useState({
    solved: 0,
    total: 800,
    rating: "Unrated",
    maxRating: "Unrated",
    rank: "Unrated",
    bestRank: "Unrated",
    contests: 0,
    lastContestDate: "N/A",
    streak: "N/A",
    solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, submissionsRes, contestsRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
        ]);

        const user = userRes.data.result[0];
        const submissions = submissionsRes.data.result;
        const contests = contestsRes.data.result;

        const solvedSet = new Set();
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        const streakDays = new Set();

        submissions.forEach((sub) => {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedSet.add(key);

            const rating = sub.problem.rating;
            if (rating) {
              if (rating < 1400) difficultyCount.easy += 1;
              else if (rating < 2000) difficultyCount.medium += 1;
              else difficultyCount.hard += 1;
            }

            const date = new Date(sub.creationTimeSeconds * 1000).toDateString();
            streakDays.add(date);
          }
        });

        const streak = `${Math.min(streakDays.size, 7)} days`;

        let bestRank = "N/A";
        let lastContestDate = "N/A";

        if (contests.length > 0) {
          const ranks = contests.map((c) => c.rank).filter((r) => r !== undefined);
          bestRank = ranks.length > 0 ? Math.min(...ranks) : "N/A";

          const lastContest = contests.reduce((latest, c) =>
            c.ratingUpdateTimeSeconds > (latest?.ratingUpdateTimeSeconds || 0) ? c : latest,
            null
          );

          if (lastContest) {
            lastContestDate = new Date(lastContest.ratingUpdateTimeSeconds * 1000).toLocaleDateString();
          }
        }

        setStats({
          solved: solvedSet.size,
          total: 800,
          rating: user.rating || "Unrated",
          maxRating: user.maxRating || "Unrated",
          rank: user.rank || "Unrated",
          bestRank,
          contests: contests.length,
          lastContestDate,
          streak,
          solvedByDifficulty: difficultyCount,
        });
      } catch (err) {
        console.error("Error fetching Codeforces stats:", err);
      }
    };

    if (handle) fetchStats();
  }, [handle]);

  const progress = Math.min((stats.solved / stats.total) * 100, 100);

  return (
    <Card className="w-full rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Performance Pulse</CardTitle>
            <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Your coding journey so far</CardDescription>
          </div>
          <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-4 sm:px-6">
        <div className="space-y-2 rounded-[20px] border border-[#f8d250]/12 bg-[#111218]/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#a8a8b3]">Problems Solved</span>
            <span className="text-sm font-semibold text-[#f8d250]">{stats.solved}/{stats.total}</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#23242e]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
          <StatItem icon={<TrendingUp size={18} />} label="Current Rating" value={stats.rating} />
          <StatItem icon={<Star size={18} />} label="Max Rating" value={stats.maxRating} />
          <StatItem icon={<Award size={18} />} label="Rank" value={capitalize(stats.rank)} />
          <StatItem icon={<Award size={18} />} label="Best Rank" value={stats.bestRank} />
          <StatItem icon={<Calendar size={18} />} label="Contests" value={stats.contests} />
          <StatItem icon={<Calendar size={18} />} label="Last Contest" value={stats.lastContestDate} />
        </div>

        <div className="rounded-[20px] border border-[#f8d250]/12 bg-[#111218]/70 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#f8d250]">
            <BarChart2 size={18} /> Solved Problems by Difficulty
          </h3>
          <div className="flex flex-col gap-2 text-sm text-[#a8a8b3] sm:flex-row sm:gap-3">
            <DifficultyBadge label="Easy" value={stats.solvedByDifficulty.easy} color="green" />
            <DifficultyBadge label="Medium" value={stats.solvedByDifficulty.medium} color="yellow" />
            <DifficultyBadge label="Hard" value={stats.solvedByDifficulty.hard} color="red" />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full rounded-2xl bg-[#f8d250] text-[#0f0f14] hover:bg-[#ffe38b] sm:w-auto" onClick={() => (window.location.href = "/profile")}>
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[16px] border border-[#f8d250]/12 bg-[#171a22]/70 p-3">
    <div className="text-[#f8d250]">{icon}</div>
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#a8a8b3]">{label}</p>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  </div>
);

const DifficultyBadge = ({ label, value, color }) => {
  const colors = {
    green: "bg-[#22c55e]/10 text-[#22c55e]",
    yellow: "bg-[#f59e0b]/10 text-[#f59e0b]",
    red: "bg-[#ef4444]/10 text-[#ef4444]",
  };
  return <div className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[color]}`}>{label}: {value}</div>;
};

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default StatsDashboard;
