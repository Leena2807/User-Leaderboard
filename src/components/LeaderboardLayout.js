// src/components/LeaderboardLayout.js
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCoins, FaQuestion } from "react-icons/fa";
import axios from "axios";

const LeaderboardLayout = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("https://user-leaderboard.onrender.com/leaderboard");
        setLeaderboardData(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  // Top 3
  const topThreeUsers = leaderboardData.slice(0, 3).map((user, idx) => ({
    id: idx,
    img: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
    name: user.name,
    points: user.totalPoints,
  }));

  // Other users
  const otherUsers = leaderboardData.slice(3).map((user, idx) => ({
    id: idx + 3,
    img: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
    name: user.name,
    points: user.totalPoints,
  }));

  // Bottom user (last in the list)
  const bottomUserRaw = leaderboardData[leaderboardData.length - 1];
  const bottomUser = bottomUserRaw
    ? {
        rank: bottomUserRaw.rank,
        img: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(bottomUserRaw.name)}`,
        name: bottomUserRaw.name,
        points: bottomUserRaw.totalPoints,
      }
    : null;

  return (
    <div className="bg-[#fff6d9] min-h-screen flex flex-col">
      {/* your existing header and layout code */}
      {/* replace topThreeUsers, otherUsers, bottomUser references with the above computed values */}
      {/* retain your Tailwind styling as before */}
    </div>
  );
};

export default LeaderboardLayout;