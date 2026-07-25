import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock3, Sparkles } from "lucide-react";
import axios from "axios";

const UpcomingContests = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const codeforcesResponse = await axios.get("https://codeforces.com/api/contest.list");
        const codeforcesContests = codeforcesResponse.data.result.filter((contest) => contest.phase === "BEFORE");

        const contests = codeforcesContests.map((contest) => ({
          id: contest.id,
          title: contest.name,
          date: new Date(contest.startTimeSeconds * 1000).toLocaleDateString(),
          time: new Date(contest.startTimeSeconds * 1000).toLocaleTimeString(),
          difficulty: "N/A",
          participants: "N/A",
        }));

        contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

        setUpcomingContests(contests);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contest data");
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (loading) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-[#a8a8b3]">Loading...</p>;
  if (error) return <p className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-4 text-[#ef4444]">{error}</p>;

  return (
    <Card className="w-full rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Upcoming Contests</CardTitle>
          <CardDescription className="mt-1 text-sm text-[#a8a8b3]">Stay sharp for the next arena</CardDescription>
        </div>
        <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">
          <Calendar className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {upcomingContests.slice(0, visibleCount).map((contest) => (
          <div key={contest.id} className="rounded-[18px] border border-[#f8d250]/12 bg-[#111218]/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">{contest.title}</span>
              <Badge className="rounded-full border border-[#f8d250]/20 bg-[#f8d250]/10 text-[#f8d250]">{contest.difficulty}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[#a8a8b3]">
              <Clock3 className="h-4 w-4 text-[#f8d250]" />
              <span>{contest.date}</span>
              <span>•</span>
              <span>{contest.time}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#a8a8b3]">
              <Sparkles className="h-4 w-4 text-[#9b5cff]" />
              <span>{contest.participants} participants registered</span>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button className="w-full rounded-2xl border border-[#f8d250]/20 bg-[#171a22] text-[#f8d250] hover:bg-[#23242e]" onClick={handleShowMore} disabled={visibleCount >= upcomingContests.length}>
          {visibleCount >= upcomingContests.length ? "No More Contests" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingContests;
