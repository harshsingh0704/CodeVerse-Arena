import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ExternalLink, Sparkles, Trophy, BookmarkPlus } from "lucide-react";

const TAGS = [
  "implementation",
  "greedy",
  "dp",
  "math",
  "brute force",
  "data structures",
  "constructive algorithms",
  "graphs",
  "sortings",
  "binary search",
  "dfs and similar",
  "trees",
  "two pointers",
  "Array",
  "Hash Table",
  "String",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Tree",
  "Depth-First Search",
  "Breadth-First Search",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const RATINGS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];

const PLATFORMS = ["All", "Codeforces", "LeetCode"];

const fetchCodeforcesProblems = async (tag, rating) => {
  const url = "https://codeforces.com/api/problemset.problems";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Codeforces problems");
  const data = await response.json();
  let problems = data.result.problems;
  if (tag) problems = problems.filter((p) => p.tags.includes(tag));
  if (rating && typeof rating === "number") problems = problems.filter((p) => p.rating === parseInt(rating));
  return problems;
};

const fetchLeetCodeProblems = async (difficulty) => {
  const response = await fetch("https://alfa-leetcode-api.onrender.com/problems");
  if (!response.ok) throw new Error("Failed to fetch LeetCode problems");
  const data = await response.json();
  let problems = data.problemsetQuestionList;
  if (difficulty) problems = problems.filter((p) => p.difficulty === difficulty);
  return problems;
};

const Practice = () => {
  const [platform, setPlatform] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["practiceProblems", platform, selectedTag, selectedRating, selectedDifficulty],
    queryFn: async () => {
      if (platform === "Codeforces") {
        return await fetchCodeforcesProblems(selectedTag, selectedRating);
      } else if (platform === "LeetCode") {
        return await fetchLeetCodeProblems(selectedDifficulty);
      } else {
        const [cf, lc] = await Promise.all([
          fetchCodeforcesProblems(selectedTag, selectedRating),
          fetchLeetCodeProblems(selectedDifficulty),
        ]);
        if (platform === "Codeforces") return cf;
        if (platform === "LeetCode") return lc;
        return [...cf, ...lc];
      }
    },
  });

  const isCF = (problem) => "contestId" in problem;

  return (
    <div className="min-h-screen rounded-[24px] border border-[#f8d250]/15 bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.09),_transparent_35%),_#111218] p-4 text-[#f5f5f7] sm:p-6">
      <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/80 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#f8d250]/10 px-3 py-1 text-sm text-[#f8d250]">
            <Sparkles className="h-4 w-4" /> Elite Practice Circuit
          </div>
          <h2 className="text-3xl font-semibold text-white">Practice Problems</h2>
          <p className="mt-1 text-sm text-[#a8a8b3]">Curated problem cards tailored for serious training blocks.</p>
        </div>
        <div className="rounded-2xl border border-[#f8d250]/12 bg-[#111218]/70 px-3 py-2 text-sm text-[#a8a8b3]">Focused drills • Premium prep</div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-2xl border border-[#f8d250]/15 bg-[#171a22] p-3 text-sm text-white">
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="w-full rounded-2xl border border-[#f8d250]/15 bg-[#171a22] p-3 text-sm text-white">
          <option value="">All Tags</option>
          {TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)} className="w-full rounded-2xl border border-[#f8d250]/15 bg-[#171a22] p-3 text-sm text-white" disabled={platform === "LeetCode"}>
          <option value="">All Ratings</option>
          {RATINGS.map((rating) => <option key={rating} value={rating}>{rating}</option>)}
        </select>
        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full rounded-2xl border border-[#f8d250]/15 bg-[#171a22] p-3 text-sm text-white">
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((diff) => <option key={diff} value={diff}>{diff}</option>)}
        </select>
      </div>

      {isLoading && (
        <div className="mt-20 flex flex-col items-center justify-center text-center text-[#a8a8b3]">
          <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-dashed border-[#f8d250]" />
          <p className="text-lg">Loading Problems...</p>
        </div>
      )}
      {isError && <div className="text-center text-[#ef4444]">Failed to load problems.</div>}

      {!isLoading && !isError && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.slice(0, 50).map((problem, index) => (
            <Card key={index} className="premium-card group overflow-hidden">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">{isCF(problem) ? "Codeforces" : "LeetCode"}</p>
                      <h3 className="mt-1 text-base font-semibold text-white">{isCF(problem) ? `${problem.contestId}${problem.index}: ${problem.name}` : problem.title}</h3>
                    </div>
                  </div>
                  <div className="rounded-full border border-[#9b5cff]/20 bg-[#9b5cff]/10 px-2.5 py-1 text-xs text-[#c8b3ff]">{isCF(problem) ? "Contest" : "Practice"}</div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-[#a8a8b3]">
                  <span className="rounded-full border border-[#f8d250]/15 bg-[#171a22] px-2.5 py-1 text-xs">{isCF(problem) ? problem.rating || "Rated" : "Premium"}</span>
                  {isCF(problem)
                    ? problem.tags?.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-[#f8d250]/10 bg-[#171a22] px-2.5 py-1 text-xs">{tag}</span>)
                    : problem.topicTags?.slice(0, 3).map((tag) => <span key={tag.name} className="rounded-full border border-[#f8d250]/10 bg-[#171a22] px-2.5 py-1 text-xs">{tag.name}</span>)}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#a8a8b3]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#22c55e]/15 bg-[#22c55e]/10 px-2.5 py-1 text-[#22c55e]">
                    <Trophy className="h-3.5 w-3.5" /> {isCF(problem) ? "Competitive" : "Structured"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#f8d250]/15 bg-[#171a22] px-2.5 py-1 text-[#f8d250]">
                    <BookmarkPlus className="h-3.5 w-3.5" /> Save for later
                  </span>
                </div>

                <a href={isCF(problem) ? `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}` : `https://leetcode.com/problems/${problem.titleSlug}/`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 px-3 py-2 text-sm font-medium text-[#f8d250] hover:bg-[#f8d250]/20">
                  <ExternalLink size={15} /> {isCF(problem) ? "View on Codeforces" : "View on LeetCode"}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Practice;
