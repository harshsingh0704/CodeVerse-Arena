import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UpcomingContests from "./UpcomingContests";
import RecentSubmissions from "./RecentSubmissions";
import ContestHistoryLeaderboard from "./ContestHistoryLeaderboard";
import StatsDashboard from "./StatsDashboard";
import GoogleSheetSummary from "./GoogleSheetSummary";
import MainHero from "./MainHero";
import AIIntegrationShowcase from "./AIIntegrationShowcase";

const Dashboard = () => {
  const [output, setOutput] = useState("");
  const textLines = [
    "AI is fetching your coding data...",
    "AI is analyzing your coding patterns...",
    "AI-powered recommendations are being generated...",
    "AI is evaluating your coding progress...",
    "AI is preparing your leaderboard data...",
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < textLines[lineIndex].length) {
        setOutput((prev) => prev + textLines[lineIndex].charAt(charIndex));
        charIndex++;
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex >= textLines.length) {
          clearInterval(typeInterval);
        }
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <motion.div
      className="space-y-6 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <MainHero />

      <motion.div
        className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/80 p-4 text-sm text-[#a8a8b3] shadow-[0_20px_45px_rgba(0,0,0,0.25)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="font-medium text-white">Track your progress, join contests, and sharpen your edge.</p>
      </motion.div>

      <GoogleSheetSummary />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div className="h-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <StatsDashboard className="h-full" />
        </motion.div>
        <motion.div className="h-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <UpcomingContests className="h-full" />
        </motion.div>
        <motion.div className="h-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <RecentSubmissions className="h-full" />
        </motion.div>
      </div>

      <AIIntegrationShowcase />

      <motion.div
        className="rounded-[24px] border border-[#f8d250]/15 bg-[#171a22]/70 p-5 text-sm text-[#d6d6df] shadow-[0_20px_45px_rgba(0,0,0,0.25)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p>{output}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <ContestHistoryLeaderboard />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
