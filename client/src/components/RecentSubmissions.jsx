import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const RecentSubmissions = () => {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cfHandle, setCfHandle] = useState(localStorage.getItem("cfHandle") || "");
  const [inputHandle, setInputHandle] = useState("");

  useEffect(() => {
    if (!cfHandle) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=3`);
        const submissions = response.data.result.map((sub) => ({
          id: sub.id,
          problem: `${sub.problem.index}. ${sub.problem.name}`,
          status: sub.verdict === "OK" ? "Accepted" : sub.verdict,
          runtime: `${sub.timeConsumedMillis} ms`,
          language: sub.programmingLanguage,
        }));
        setRecentSubmissions(submissions);
        setError("");
      } catch (err) {
        setError("Failed to fetch recent submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
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
      <Card className="mx-auto w-full rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <CardHeader>
          <CardTitle className="text-xl">Access your feed</CardTitle>
          <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Enter your Codeforces handle to view recent submissions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Codeforces handle" className="rounded-2xl border-[#f8d250]/15 bg-[#171a22] text-white placeholder:text-[#a8a8b3]" value={inputHandle} onChange={(e) => setInputHandle(e.target.value)} />
          {error && <p className="text-sm text-[#ef4444]">{error}</p>}
          <Button onClick={handleLogin} className="rounded-2xl bg-[#f8d250] text-[#0f0f14] hover:bg-[#ffe38b]">Login</Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-[#a8a8b3]">Loading...</p>;
  if (error) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-[#ef4444]">{error}</p>;

  return (
    <Card className="w-full rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Recent Submissions</CardTitle>
          <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Your latest code submissions</CardDescription>
        </div>
        <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">
          <Code2 className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentSubmissions.map((sub) => (
          <div key={sub.id} className="rounded-[18px] border border-[#f8d250]/12 bg-[#111218]/70 p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-white">{sub.problem}</span>
              <Badge className={`rounded-full ${sub.status === "Accepted" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                {sub.status}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#a8a8b3]">
              <span>Runtime: {sub.runtime}</span>
              <span>•</span>
              <span>Language: {sub.language}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-2xl border border-[#f8d250]/20 bg-[#171a22] text-[#f8d250] hover:bg-[#23242e]">View Submission History</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentSubmissions;
