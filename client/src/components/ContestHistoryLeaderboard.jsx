import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Trophy, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const ContestHistoryLeaderboard = () => {
  const [contestHistory, setContestHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cfHandle, setCfHandle] = useState(localStorage.getItem("cfHandle") || "");
  const [inputHandle, setInputHandle] = useState("");

  useEffect(() => {
    if (!cfHandle) return;

    const fetchRatingHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${cfHandle}`);
        const data = response.data.result.map((entry, index) => ({
          id: index + 1,
          contestName: entry.contestName,
          rank: entry.rank,
          oldRating: entry.oldRating,
          newRating: entry.newRating,
          delta: entry.newRating - entry.oldRating,
        }));
        setContestHistory(data.reverse().slice(0, 10));
      } catch (err) {
        setError("Failed to fetch contest history. Please check your handle.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingHistory();
  }, [cfHandle]);

  const handleLogin = () => {
    if (inputHandle.trim()) {
      localStorage.setItem("cfHandle", inputHandle.trim());
      setCfHandle(inputHandle.trim());
      setError("");
    } else {
      setError("Please enter a valid handle.");
    }
  };

  if (!cfHandle) {
    return (
      <Card className="mx-auto mt-8 max-w-lg rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Missing handle? Login now</CardTitle>
          <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Enter your Codeforces handle to unlock contest history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Codeforces handle" className="rounded-2xl border-[#f8d250]/15 bg-[#171a22] text-white placeholder:text-[#a8a8b3]" value={inputHandle} onChange={(e) => setInputHandle(e.target.value)} />
          {error && <p className="text-sm text-[#ef4444]">{error}</p>}
          <Button onClick={handleLogin} className="rounded-2xl bg-[#f8d250] text-[#0f0f14] hover:bg-[#ffe38b]">Login</Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-center text-[#a8a8b3]">Loading...</p>;
  if (error) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-center text-[#ef4444]">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Competitive Timeline</h2>
        <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">
          <Trophy className="h-5 w-5" />
        </div>
      </div>

      <Card className="rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Contest History</CardTitle>
            <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Your performance in past Codeforces contests</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#f8d250]/10 px-3 py-1 text-sm text-[#f8d250]">
            <Award className="h-4 w-4" /> Ranked
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="hidden overflow-x-auto sm:block">
            <table className="min-w-[700px] w-full text-left">
              <thead className="bg-[#111218]/80">
                <tr>
                  {["Contest", "Rank", "Old", "New", "Δ Rating"].map((header) => (
                    <th key={header} className="px-4 py-3 text-xs uppercase tracking-[0.25em] text-[#f8d250]">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contestHistory.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#f8d250]/10">
                    <td className="px-4 py-3 font-medium text-white">{entry.contestName}</td>
                    <td className="px-4 py-3 text-[#a8a8b3]">{entry.rank}</td>
                    <td className="px-4 py-3 text-[#a8a8b3]">{entry.oldRating}</td>
                    <td className="px-4 py-3 text-[#a8a8b3]">{entry.newRating}</td>
                    <td className={`px-4 py-3 font-semibold ${entry.delta >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{entry.delta >= 0 ? `+${entry.delta}` : entry.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:hidden">
            {contestHistory.map((entry) => (
              <div key={entry.id} className="rounded-[18px] border border-[#f8d250]/12 bg-[#111218]/70 p-4">
                <p className="mb-2 font-semibold text-white">{entry.contestName}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#a8a8b3]">
                  <div><p className="text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">Rank</p><p>{entry.rank}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">Old Rating</p><p>{entry.oldRating}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">New Rating</p><p>{entry.newRating}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">Δ Rating</p><p className={entry.delta >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>{entry.delta >= 0 ? `+${entry.delta}` : entry.delta}</p></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full rounded-2xl border border-[#f8d250]/20 bg-[#171a22] text-[#f8d250] hover:bg-[#23242e] sm:w-auto" onClick={() => (window.location.href = "/rating-graph")}>
            View Full Rating Graph
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContestHistoryLeaderboard;
