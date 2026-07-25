import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import MyCalendar from "../components/MyCalendar";
import "react-day-picker/dist/style.css";
import { motion } from "framer-motion";
import { Code2, Trophy, Clock3, CalendarPlus, CalendarDays, Sparkles, CircleCheckBig, TimerReset } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const fetchContests = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch contests");
  return response.json();
};

const handleAddToCalendar = (contest) => {
  const startISO = contest.start.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endISO = contest.end.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.name)}&dates=${startISO}/${endISO}`;
  window.open(url, "_blank");
};

const Contests = () => {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipColor, setTooltipColor] = useState("#333");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAllPast, setShowAllPast] = useState(false);
  const [showAllRegistered, setShowAllRegistered] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: codeforces, isLoading: cfLoading, isError: cfError } = useQuery({
    queryKey: ["codeforces"],
    queryFn: () => fetchContests("https://codeforces.com/api/contest.list"),
  });

  if (cfLoading) {
    return (
      <div className="mt-40 flex min-h-screen items-center justify-center text-center text-[#a8a8b3]">
        <div className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/80 p-6">
          <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-dashed border-[#f8d250]" />
          <p className="text-lg">Loading Contests...</p>
        </div>
      </div>
    );
  }

  if (cfError) return <div className="p-4 text-[#ef4444]">Error loading contests.</div>;

  let allContests = [
    ...(codeforces?.result || []).map((c) => ({
      ...c,
      site: "codeforces",
      start: new Date(c.startTimeSeconds * 1000),
      end: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
    })),
  ];

  if (platformFilter !== "all") {
    allContests = allContests.filter((c) => c.site === platformFilter);
  }

  const now = new Date();
  const upcomingContests = allContests.filter((c) => c.start > now);
  const pastContests = allContests.filter((c) => c.end < now);
  const registeredContests = [];

  const getIcon = (site) => (site === "codeforces" ? <Code2 className="h-4 w-4 text-[#f8d250]" /> : <Trophy className="h-4 w-4 text-[#9b5cff]" />);

  const ContestCard = ({ contest }) => (
    <motion.div className="w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="w-full rounded-[24px] border border-[#f8d250]/15 bg-[linear-gradient(145deg,_rgba(26,26,34,0.96),_rgba(23,26,34,0.9))] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <CardContent className="space-y-3 px-3 py-4 sm:px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <div className="rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 p-2 text-[#f8d250]">{getIcon(contest.site)}</div>
              <div>
                <h3 className="text-base font-semibold text-white">{contest.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#a8a8b3]">{contest.site}</p>
              </div>
            </div>
            <div className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#22c55e]">Live</div>
          </div>

          <div className="grid gap-2 text-sm text-[#a8a8b3] sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-2xl border border-[#f8d250]/12 bg-[#111218]/70 px-3 py-2">
              <CalendarDays className="h-4 w-4 text-[#f8d250]" />
              <span>Start: {contest.start.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#f8d250]/12 bg-[#111218]/70 px-3 py-2">
              <Clock3 className="h-4 w-4 text-[#f8d250]" />
              <span>End: {contest.end.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[#a8a8b3]">
            <span className="rounded-full border border-[#f8d250]/15 bg-[#171a22] px-2.5 py-1">{contest.durationSeconds ? `${(contest.durationSeconds / 3600).toFixed(2)} hrs` : "Scheduled"}</span>
            <span className="rounded-full border border-[#9b5cff]/15 bg-[#9b5cff]/10 px-2.5 py-1 text-[#c8b3ff]">Participants: 1k+</span>
            <span className="rounded-full border border-[#f8d250]/15 bg-[#171a22] px-2.5 py-1">Difficulty: Rated</span>
          </div>

          {contest.url && (
            <a href={contest.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-[#f8d250] hover:text-[#ffe38b]">
              <IoLogoGithub /> View Contest
            </a>
          )}

          <button onClick={() => handleAddToCalendar(contest)} className="flex items-center gap-2 rounded-2xl bg-[#f8d250] px-3 py-2 text-sm font-semibold text-[#0f0f14] transition hover:bg-[#ffe38b]">
            <CalendarPlus className="h-4 w-4" /> Add to Calendar
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const contestsByDate = {};
  allContests.forEach((contest) => {
    let currentDate = new Date(contest.start);
    currentDate.setHours(0, 0, 0, 0);
    const endDate = new Date(contest.end);
    endDate.setHours(0, 0, 0, 0);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (!contestsByDate[dateKey]) contestsByDate[dateKey] = [];
      contestsByDate[dateKey].push(contest);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  const modifiers = {
    contestDays: Object.keys(contestsByDate).map((d) => new Date(d)),
  };

  const dayStyle = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    const contests = contestsByDate[dateKey];

    if (!contests) {
      return {
        backgroundColor: "transparent",
        color: "#d9d9e3",
      };
    }

    const hasCF = contests.some((c) => c.site === "codeforces");

    if (hasCF) {
      return {
        backgroundColor: "#f8d250",
        color: "#0f0f14",
      };
    }

    return {};
  };

  const onDayMouseEnter = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    if (contestsByDate[dateKey]) {
      setHoveredDate(date);
      setTooltipContent(contestsByDate[dateKey].map((c) => `${c.name} (${c.site.toUpperCase()})`).join("\n"));
      const firstSite = contestsByDate[dateKey][0].site;
      setTooltipColor(firstSite === "codeforces" ? "#f8d250" : "#9b5cff");
    } else {
      setHoveredDate(null);
      setTooltipContent(null);
    }
  };

  const onDayMouseLeave = () => {
    setHoveredDate(null);
    setTooltipContent(null);
  };

  return (
    <motion.div className="min-h-screen rounded-[24px] border border-[#f8d250]/15 bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.10),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.10),_transparent_30%),linear-gradient(180deg,_#1d2137_0%,_#181b2d_40%,_#111218_100%)] p-4 font-sans text-[#f5f5f7] sm:p-6">
      <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/80 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#f8d250]/10 px-3 py-1 text-sm text-[#f8d250]">
            <Sparkles className="h-4 w-4" /> Elite Contest Calendar
          </div>
          <h2 className="text-3xl font-semibold text-white">Contests Dashboard</h2>
          <p className="mt-1 text-sm text-[#a8a8b3]">A premium view of the next battles and your recent history.</p>
        </div>
        <div className="rounded-2xl border border-[#f8d250]/12 bg-[#111218]/70 px-3 py-2 text-sm text-[#a8a8b3]">Live schedule • Focused prep</div>
      </div>

      <div className="mb-6">
  {/* Platform Filter */}
  <div className="mb-4 flex justify-start">
    <select
      className="rounded-2xl border border-[#f8d250]/15 bg-[#171a22] px-3 py-2 text-sm text-[#f5f5f7]"
      onChange={(e) => setPlatformFilter(e.target.value)}
      value={platformFilter}
    >
      <option value="all">All Platforms</option>
      <option value="codeforces">Codeforces</option>
    </select>
  </div>

  {/* Calendar */}
  <div className="flex justify-center">
    {isSmallScreen ? (
      <Tooltip open={!!tooltipContent}>
        <TooltipTrigger asChild>
          <div>
            <DayPicker
              mode="single"
              modifiers={modifiers}
              onDayMouseEnter={onDayMouseEnter}
              onDayMouseLeave={onDayMouseLeave}
              selected={hoveredDate}
              showOutsideDays
              styles={{ day: { borderRadius: "999px" } }}
              components={{
                DayContent: ({ date }) => {
                  const dateKey = date.toISOString().split("T")[0];
                  const contests = contestsByDate[dateKey];
                  const tooltip =
                    contests && contests.length > 0
                      ? contests.map((c) => `${c.site}: ${c.name}`).join("\n")
                      : "";

                  return (
                    <div
                      title={tooltip}
                      style={dayStyle(date)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f8d250]/15 transition-all duration-150 hover:scale-105"
                    >
                      {date.getDate()}
                    </div>
                  );
                },
              }}
            />
          </div>
        </TooltipTrigger>

        <TooltipContent
          className="whitespace-pre-wrap"
          style={{
            backgroundColor: tooltipColor,
            color: tooltipColor === "#f8d250" ? "#0f0f14" : "#fff",
          }}
        >
          {tooltipContent || "No contests"}
        </TooltipContent>
      </Tooltip>
    ) : (
      <MyCalendar />
    )}
  </div>
</div>
    <div className="mt-20 mb-6 flex flex-wrap justify-center gap-3">
        {["upcoming", "past", "registered"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-[#f8d250] text-[#0f0f14]" : "bg-[#171a22] text-[#a8a8b3] hover:text-white"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Contests
          </motion.button>
        ))}
      </div>

      {activeTab === "upcoming" && (
        <section className="mb-10">
          <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
            <TimerReset className="h-5 w-5 text-[#f8d250]" /> Upcoming Contests
          </h3>
          <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {upcomingContests.length ? upcomingContests.map((c, i) => <ContestCard key={i} contest={c} />) : <p className="text-[#a8a8b3]">No upcoming contests.</p>}
          </motion.div>
        </section>
      )}

      {activeTab === "past" && (
        <section className="mb-10">
          <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
            <CircleCheckBig className="h-5 w-5 text-[#22c55e]" /> Past Contests
          </h3>
          <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {(showAllPast ? pastContests : pastContests.slice(0, 5)).map((c, i) => <ContestCard key={i} contest={c} />)}
          </motion.div>
          {pastContests.length > 5 && (
            <button onClick={() => setShowAllPast((prev) => !prev)} className="mt-4 rounded-2xl border border-[#f8d250]/20 bg-[#171a22] px-4 py-2 text-white hover:bg-[#23242e]">
              {showAllPast ? "Show Less" : "Show More"}
            </button>
          )}
        </section>
      )}

      {activeTab === "registered" && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
            <CircleCheckBig className="h-5 w-5 text-[#9b5cff]" /> Registered Contests
          </h3>
          <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {(showAllRegistered ? registeredContests : registeredContests.slice(0, 5)).map((c, i) => <ContestCard key={i} contest={c} />)}
          </motion.div>
          {registeredContests.length > 5 && (
            <button onClick={() => setShowAllRegistered((prev) => !prev)} className="mt-4 rounded-2xl border border-[#f8d250]/20 bg-[#171a22] px-4 py-2 text-white hover:bg-[#23242e]">
              {showAllRegistered ? "Show Less" : "Show More"}
            </button>
          )}
        </section>
      )}
    </motion.div>
  );
};

export default Contests;
