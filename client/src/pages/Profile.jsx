import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CalendarDays, Clock3, Code2, Lock, Medal, Sparkles, Trophy, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    country: "",
    badge: "",
    rating: null,
    ranking: "",
    leetcodeUsername: "",
    leetcodeRating: "",
    leetcodeRanking: "",
    leetcodeTopPercentage: "",
    recentSubmissions: [],
    contestHistory: [],
    leetcodeContests: [],
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cfUsername: userData.username || "",
    lcUsername: "",
  });
  const [loading, setLoading] = useState(true);
  const [visibleSubmissions, setVisibleSubmissions] = useState(3);
  const [visibleContests, setVisibleContests] = useState(3);
  const handle = localStorage.getItem("cfHandle") || "tourist";
  const leetcodeHandle = localStorage.getItem("lcHandle") || null;
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, ratingRes, submissionsRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
        ]);

        const userInfo = userRes.data.result[0];
        const contests = ratingRes.data.result
          .slice()
          .reverse()
          .map((c, idx) => ({
            id: idx,
            name: c.contestName,
            rank: c.rank,
            rating: `${c.newRating - c.oldRating >= 0 ? "+" : ""}${
              c.newRating - c.oldRating
            }`,
            date: new Date(
              c.ratingUpdateTimeSeconds * 1000
            ).toLocaleDateString(),
            contestLink: `https://codeforces.com/contest/${c.contestId}`,
            standingsLink: `https://codeforces.com/contest/${c.contestId}/standings`,
          }));

        const submissions = submissionsRes.data.result.map((sub, idx) => ({
          id: sub.id || idx,
          problem: `${sub.problem.index}. ${sub.problem.name}`,
          difficulty: sub.problem.rating || "N/A",
          status: sub.verdict === "OK" ? "Accepted" : sub.verdict,
          date: new Date(sub.creationTimeSeconds * 1000).toLocaleDateString(),
          timestamp: sub.creationTimeSeconds * 1000,
          runtime: `${sub.timeConsumedMillis} ms`,
          contestId: sub.contestId,
          submissionId: sub.id,
          problemLink: `https://codeforces.com/contest/${sub.contestId}/problem/${sub.problem.index}`,
          submissionLink: `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`,
          platform: "Codeforces",
        }));

        let leetcodeContests = [];
        let leetcodeSubmissions = [];
        let leetcodeData = [];

        try {
          const [lcContRes, lcSubRes, lcProfileRes] = await Promise.all([
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}/contest/history`
            ),
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}/submission`
            ),
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}`
            ),
          ]);

          leetcodeData = {
            name: lcProfileRes.data.name,
            username: lcProfileRes.data.username,
            rating: lcProfileRes.data.ranking || "N/A",
            globalRanking: lcProfileRes.data.ranking || "N/A",
            attendedContests: lcContRes?.data?.contestHistory.filter || 0,
            topPercentage:
              lcProfileRes.data.userContestRanking?.topPercentage || "N/A",
            profileLink: `https://leetcode.com/${leetcodeHandle}`,
          };
          if (lcContRes.data && lcContRes.data.contestHistory) {
            leetcodeContests = lcContRes.data.contestHistory
              .filter((contest) => contest.attended)
              .map((contest, idx) => ({
                id: idx,
                name: contest.contest?.title || "Unknown Contest",
                rank: contest.ranking || "N/A",
                solved: contest.problemsSolved || 0,
                totalProblems: contest.totalProblems || 0,
                date: new Date(
                  (contest.contest?.startTime || Date.now()) * 1000
                ).toLocaleDateString(),
                platform: "LeetCode",
              }));
          }

          if (lcSubRes.data && lcSubRes.data.submission) {
            leetcodeSubmissions = lcSubRes.data?.submission?.map(
              (sub, idx) => ({
                id: `lc${idx}`,
                problem: sub.title,
                language: sub.lang,
                status: sub.statusDisplay,
                date: new Date(
                  parseInt(sub.timestamp) * 1000
                ).toLocaleDateString(),
                timestamp: parseInt(sub.timestamp) * 1000,
                problemLink: `https://leetcode.com/problems/${sub.titleSlug}/`,
                submissionLink: `https://leetcode.com/submissions/detail/${
                  sub.id || idx
                }/`,
                platform: "LeetCode",
              })
            );
          }
        } catch (error) {
          console.warn(
            "LeetCode API fetch failed, skipping LeetCode data",
            error
          );
        }

        const newUserData = {
          username: handle,
          name: leetcodeData.name,
          country: userInfo.country || "India",
          leetcodeUsername: leetcodeData.username,
          leetcodeRanking: leetcodeData.globalRanking,
          badge: userInfo.rank,
          rating: userInfo.rating,
          ranking: userInfo.maxRank,
          recentSubmissions: [...submissions, ...leetcodeSubmissions].sort(
            (a, b) => b.timestamp - a.timestamp
          ),
          contestHistory: contests,
          leetcodeContests: leetcodeContests,
        };

        setUserData(newUserData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Codeforces profile:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [handle, leetcodeHandle]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/update-handles", {
        codeforces: formData.cfUsername,
        leetcode: formData.lcUsername,
      });

      setUserData((prev) => ({
        ...prev,
        username: formData.cfUsername,
      }));
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating usernames:", err);
    }
  };
  const handleViewMoreSubmissions = () =>
    setVisibleSubmissions((prev) => prev + 3);
  const handleViewMoreContests = () => setVisibleContests((prev) => prev + 3);

  if (loading || !userData)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F14] px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-[24px] border border-yellow-500/10 bg-[#1A1A22] p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-yellow-500/10 border-t-[#F8D250]" />
          <p className="text-lg font-semibold text-white">Loading your profile...</p>
          <p className="mt-2 text-sm text-[#A8A8B3]">Gathering your latest performance data.</p>
        </motion.div>
      </div>
    );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F14] px-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg rounded-[24px] border border-yellow-500/10 bg-[#1A1A22] p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/15 bg-[#23242E] text-[#F8D250] shadow-xl">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-wide text-white">
            Please login to continue
          </h1>
          <p className="mb-5 text-sm text-[#A8A8B3]">
            Access your elite profile, contest history, and submission feed.
          </p>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full border border-[#F8D250]/30 bg-[#F8D250] px-6 py-3 text-sm font-semibold text-[#0F0F14] transition-all duration-300 hover:-translate-y-1 hover:bg-[#ffe38b]"
          >
            Go to Login Page <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-4 text-sm text-[#A8A8B3]">
            Don't have an account? <a href="/auth" className="text-[#F8D250] underline">Sign up now</a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.06),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.08),_transparent_30%),linear-gradient(180deg,_#191D2E_0%,_#151823_45%,_#101117_100%)] px-4 py-6 text-[#FFFFFF] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
         <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[28px] border border-[#F8D250]/15 bg-[linear-gradient(180deg,#24283D_0%,#1C2031_45%,#171922_100%)] shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="relative h-32 overflow-hidden rounded-t-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.20),_transparent_35%),linear-gradient(135deg,_#1D2137_0%,_#262B43_60%,_#2F3552_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,210,80,0.07),transparent,rgba(155,92,255,0.1))]" />
              <div className="relative h-32 overflow-hidden rounded-t-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.20),_transparent_35%),linear-gradient(135deg,_#1D2137_0%,_#262B43_60%,_#2F3552_100%)]">
                <User className="h-25 w-20 text-[#F8D250]" />
              </div>
            </div>

            <div className="px-6 pb-6 pt-16 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-[#F8D250]" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#A8A8B3]">
                  Elite Profile
                </span>
              </div>
              <CardTitle className="truncate text-2xl font-semibold text-white">
                {userData.name || "Your Handle"}
              </CardTitle>
              <CardDescription className="mt-2 truncate text-[#A8A8B3]">
                {userData.username} • {userData.leetcodeUsername}
              </CardDescription>
              <button
                onClick={() => setEditModalOpen(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#F8D250]/20 bg-[#23242E] px-3 py-1.5 text-xs font-medium text-[#F8D250] transition-all duration-300 hover:border-[#F8D250]/40 hover:bg-[#2b2b36]"
              >
                <Code2 className="h-3.5 w-3.5" /> Edit Username
              </button>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {userData.country && (
                  <Badge className="rounded-full border border-[#F8D250]/15 bg-[#23242E] px-3 py-1 text-sm text-[#F8D250]">
                    {userData.country}
                  </Badge>
                )}
                {userData.badge && (
                  <Badge className="rounded-full border border-[#9B5CFF]/20 bg-[#9B5CFF]/10 px-3 py-1 text-sm text-[#C8B3FF]">
                    {userData.badge}
                  </Badge>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-yellow-500/10 bg-[#23242E] p-3 text-center">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#A8A8B3]">CF Rating</div>
                  <div className="mt-1 text-lg font-semibold text-white">{userData.rating ?? "N/A"}</div>
                </div>
                <div className="rounded-2xl border border-yellow-500/10 bg-[#23242E] p-3 text-center">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#A8A8B3]">Ranking</div>
                  <div className="mt-1 text-lg font-semibold text-white">{userData.ranking || "N/A"}</div>
                </div>
                <div className="rounded-2xl border border-yellow-500/10 bg-[#23242E] p-3 text-center">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#A8A8B3]">LC Rating</div>
                  <div className="mt-1 text-lg font-semibold text-white">{userData.leetcodeRanking ?? "N/A"}</div>
                </div>
              </div>

           <div className="mt-6 rounded-[22px] border border-[#F8D250]/10 bg-[linear-gradient(180deg,#1C1F2D,#171A22)] p-5 text-left shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F8D250]">
                  <Medal className="h-4 w-4" /> Recent submissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.recentSubmissions.slice(0, 4).map((sub, idx) => (
                    <Badge
                      key={idx}
                      className="rounded-full border border-yellow-500/10 bg-[#23242E] px-3 py-1.5 text-xs text-[#F8D250] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D250]/30"
                    >
                      {sub.platform}: {sub.problem}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="w-full overflow-x-auto">
            <Tabs defaultValue="submissions" className="space-y-4">
              <TabsList className="inline-flex rounded-full border border-yellow-500/10 bg-[#171A22] p-1 shadow-lg">
                <TabsTrigger
                  value="submissions"
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#A8A8B3] transition-all duration-300 data-[state=active]:bg-[#F8D250] data-[state=active]:text-[#0F0F14] hover:text-white"
                >
                  Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="contests"
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#A8A8B3] transition-all duration-300 data-[state=active]:bg-[#F8D250] data-[state=active]:text-[#0F0F14] hover:text-white"
                >
                  Codeforces Contests
                </TabsTrigger>
                <TabsTrigger
                  value="lcContests"
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#A8A8B3] transition-all duration-300 data-[state=active]:bg-[#F8D250] data-[state=active]:text-[#0F0F14] hover:text-white"
                >
                  LeetCode Contests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="submissions" className="space-y-3">
                {userData.recentSubmissions.slice(0, visibleSubmissions).map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Card className="rounded-[20px] border border-yellow-500/10 bg-[#1A1A22] text-[#A8A8B3] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/30">
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <a
                            href={sub.problemLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-white transition hover:text-[#F8D250]"
                          >
                            {sub.problem}
                          </a>
                          <Badge className="rounded-full border border-[#F8D250]/15 bg-[#23242E] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#F8D250]">
                            {sub.platform}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-[#A8A8B3]">
                          <CalendarDays className="h-4 w-4 text-[#F8D250]" />
                          <span>{sub.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge
                          className={`rounded-full border px-3 py-1 text-sm font-medium ${
                            sub.status === "Accepted"
                              ? "border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]"
                              : sub.status === "Wrong Answer"
                                ? "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]"
                                : sub.status === "Time Limit Exceeded"
                                  ? "border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b]"
                                  : "border-[#F8D250]/20 bg-[#F8D250]/10 text-[#F8D250]"
                          }`}
                        >
                          {sub.status}
                        </Badge>

                        <div className="flex flex-wrap gap-2">
                          {sub.platform === "Codeforces" && (
                            <>
                              <Badge className="rounded-full border border-yellow-500/10 bg-[#171A22] px-2.5 py-1 text-xs text-[#A8A8B3]">Difficulty: {sub.difficulty}</Badge>
                              <Badge className="rounded-full border border-yellow-500/10 bg-[#171A22] px-2.5 py-1 text-xs text-[#A8A8B3]">Runtime: {sub.runtime}</Badge>
                            </>
                          )}
                          {sub.platform === "LeetCode" && (
                            <Badge className="rounded-full border border-yellow-500/10 bg-[#171A22] px-2.5 py-1 text-xs text-[#A8A8B3]">Language: {sub.language}</Badge>
                          )}
                        </div>

                        <a
                          href={sub.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[#F8D250]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#F8D250] transition-all duration-300 hover:bg-[#F8D250] hover:text-[#0F0F14]"
                        >
                          View Submission <ArrowRight className="h-4 w-4" />
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {visibleSubmissions < userData.recentSubmissions.length && (
                  <button
                    onClick={handleViewMoreSubmissions}
                    className="text-sm font-medium text-[#F8D250] transition hover:text-[#ffe38b]"
                  >
                    View More
                  </button>
                )}
              </TabsContent>

              <TabsContent value="contests" className="space-y-3">
                {userData.contestHistory.slice(0, visibleContests).map((contest, index) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Card className="rounded-[20px] border border-yellow-500/10 bg-[#1A1A22] text-[#A8A8B3] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/30">
                      <CardHeader className="pb-3">
                        <a
                          href={contest.contestLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-white transition hover:text-[#F8D250]"
                        >
                          {contest.name}
                        </a>
                        <div className="mt-2 flex items-center gap-2 text-sm text-[#A8A8B3]">
                          <CalendarDays className="h-4 w-4 text-[#F8D250]" />
                          <span>{contest.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="rounded-full border border-yellow-500/10 bg-[#171A22] px-2.5 py-1 text-xs text-[#A8A8B3]">Rank: {contest.rank}</Badge>
                          <Badge className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-1 text-xs text-[#22C55E]">Rating change: {contest.rating}</Badge>
                        </div>
                        <a
                          href={contest.standingsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[#F8D250]/30 bg-transparent px-3 py-2 text-sm font-medium text-[#F8D250] transition-all duration-300 hover:bg-[#F8D250] hover:text-[#0F0F14]"
                        >
                          View Standings <ArrowRight className="h-4 w-4" />
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {visibleContests < userData.contestHistory.length && (
                  <button
                    onClick={handleViewMoreContests}
                    className="text-sm font-medium text-[#F8D250] transition hover:text-[#ffe38b]"
                  >
                    View More
                  </button>
                )}
              </TabsContent>

              <TabsContent value="lcContests" className="space-y-3">
                {userData.leetcodeContests && userData.leetcodeContests.length > 0 ? (
                  userData.leetcodeContests.map((contest, index) => (
                    <motion.div
                      key={contest.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Card className="rounded-[20px] border border-yellow-500/10 bg-[#1A1A22] text-[#A8A8B3] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold text-white">{contest.name}</CardTitle>
                          <div className="mt-2 flex items-center gap-2 text-sm text-[#A8A8B3]">
                            <CalendarDays className="h-4 w-4 text-[#F8D250]" />
                            <span>{contest.date}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full border border-yellow-500/10 bg-[#171A22] px-2.5 py-1 text-xs text-[#A8A8B3]">Rank: {contest.rank}</Badge>
                            <Badge className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-1 text-xs text-[#22C55E]">Solved: {contest.solved}/{contest.totalProblems}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-yellow-500/10 bg-[#1A1A22] p-10 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F8D250]/20 bg-[#23242E] text-[#F8D250]">
                      <Trophy className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">No contest history available</h2>
                    <p className="mt-2 text-sm text-[#A8A8B3]">Your LeetCode contest history will appear here once it is available.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {editModalOpen && (
          <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="border border-yellow-500/10 bg-[#1A1A22] text-white shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">Update Platform Handles</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateUsername} className="mt-2 space-y-4">
                <div>
                  <Label htmlFor="cf" className="mb-2 block text-sm text-[#A8A8B3]">Codeforces Handle</Label>
                  <Input
                    id="cf"
                    value={formData.cfUsername}
                    className="rounded-2xl border border-yellow-500/10 bg-[#171A22] text-white placeholder:text-[#A8A8B3]"
                    onChange={(e) =>
                      setFormData({ ...formData, cfUsername: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="lc" className="mb-2 block text-sm text-[#A8A8B3]">LeetCode Username</Label>
                  <Input
                    id="lc"
                    value={formData.lcUsername}
                    className="rounded-2xl border border-yellow-500/10 bg-[#171A22] text-white placeholder:text-[#A8A8B3]"
                    onChange={(e) =>
                      setFormData({ ...formData, lcUsername: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="mt-2 w-full rounded-full border border-[#F8D250]/30 bg-[#F8D250] text-[#0F0F14] transition hover:bg-[#ffe38b]">
                  Save & Update
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Profile;
