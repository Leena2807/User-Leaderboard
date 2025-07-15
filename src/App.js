import React, { useEffect, useState } from "react";
import axios from "axios";

// Avatar color and gradient generator for user avatars
const avatarColors = [
  { bg: "bg-gradient-to-br from-pink-200 via-yellow-100 to-amber-200", text: "text-pink-700", ring: "ring-pink-200" },
  { bg: "bg-gradient-to-br from-green-200 via-blue-100 to-cyan-200", text: "text-green-700", ring: "ring-green-200" },
  { bg: "bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100", text: "text-indigo-700", ring: "ring-indigo-200" },
  { bg: "bg-gradient-to-br from-yellow-200 via-orange-100 to-amber-100", text: "text-yellow-700", ring: "ring-yellow-200" },
  { bg: "bg-gradient-to-br from-teal-200 via-emerald-100 to-green-100", text: "text-teal-700", ring: "ring-teal-200" },
  { bg: "bg-gradient-to-br from-red-200 via-pink-100 to-fuchsia-100", text: "text-red-700", ring: "ring-red-200" },
  { bg: "bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100", text: "text-sky-700", ring: "ring-sky-200" },
  { bg: "bg-gradient-to-br from-amber-200 via-rose-100 to-orange-100", text: "text-amber-700", ring: "ring-amber-200" },
];
function getAvatarStyle(name) {
  if (typeof name !== "string" || name.length === 0) {
    return avatarColors[0];
  }
  // Hash the name to pick a color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatarColors.length;
  return avatarColors[idx];
}

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("https://user-leaderboard.onrender.com/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("https://user-leaderboard.onrender.com/history");
      setHistory(response.data);
    } catch {
      // silently fail or optionally set error for history fetch
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserName.trim()) {
      setError("Please enter a valid name.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await axios.post("https://user-leaderboard.onrender.com/users", { name: newUserName });
      setNewUserName("");
      await fetchUsers();
      setMessage("User created successfully.");
    } catch {
      setError("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      console.log(selectedUserId);
      await axios.post(`https://user-leaderboard.onrender.com/claim/${selectedUserId}`);
      await fetchUsers();
      await fetchHistory();
      setMessage("Points claimed successfully.");
    } catch {
      setError("Failed to claim points.");
    } finally {
      setLoading(false);
    }
  };

  // Sort users descending by points for the leaderboard and top 3 cards
  const sortedUsers = users.slice().sort((a, b) => b.totalPoints - a.totalPoints);
  const topThree = sortedUsers.slice(0, 3);

  // Lighter pastel/gradient backgrounds for top 3 ranks in leaderboard
  const leaderboardRankStyles = [
    "bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100 text-yellow-800 shadow-lg rounded-xl border border-yellow-200",
    "bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 text-gray-700 shadow-md rounded-xl border border-gray-200",
    "bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100 text-amber-800 shadow-md rounded-xl border border-amber-200",
  ];


  // Format date nicely
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-md md:max-w-3xl mx-auto p-6 space-y-10 font-sans relative min-h-screen" style={{fontFamily: "'Inter', 'Poppins', sans-serif"}}>
      {/* Subtle animated background with crown SVG watermark */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Animated pastel blobs */}
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-gradient-to-br from-amber-100 via-yellow-100 to-pink-100 opacity-50 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-[55vw] h-[55vw] bg-gradient-to-br from-indigo-100 via-blue-100 to-teal-100 opacity-40 rounded-full blur-3xl animate-blob2" />
        {/* Animated faint crown SVG watermark */}
        <svg
          className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] opacity-10 select-none pointer-events-none crown-watermark"
          viewBox="0 0 300 100"
          fill="none"
        >
          <defs>
            <linearGradient id="crown-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#facc15" />
              <stop offset="0.5" stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <path
            d="M25 80 L60 30 L110 80 L150 20 L190 80 L240 30 L275 80 Q260 90 40 90 Q25 80 25 80 Z"
            fill="url(#crown-grad)"
            stroke="#f59e42"
            strokeWidth="3"
            style={{ filter: "blur(0.5px)" }}
          />
        </svg>
      </div>
      <h1
        className="text-center text-6xl font-extrabold select-none bg-gradient-to-r from-emerald-400 via-indigo-500 to-indigo-700 bg-clip-text text-transparent relative overflow-hidden"
        style={{textShadow: "0 0 5px rgba(99, 102, 241, 0.5)"}}
      >
        <span className="animate-gradient-shimmer bg-gradient-to-r from-emerald-400 via-indigo-500 to-indigo-700 bg-clip-text text-transparent absolute inset-0 opacity-40"></span>
        User Leaderboard
      </h1>

      {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
      {message && <p className="text-green-600 text-center font-semibold">{message}</p>}

      <style>{`
        /* Animated pastel background blobs */
        @keyframes blob1 {
          0% { transform: scale(1) translateY(0px) translateX(0px);}
          35% { transform: scale(1.08) translateY(15px) translateX(-30px);}
          70% { transform: scale(0.98) translateY(-10px) translateX(20px);}
          100% { transform: scale(1) translateY(0px) translateX(0px);}
        }
        .animate-blob1 { animation: blob1 14s ease-in-out infinite alternate; }
        @keyframes blob2 {
          0% { transform: scale(1) translateY(0px) translateX(0px);}
          30% { transform: scale(1.1) translateY(-10px) translateX(30px);}
          80% { transform: scale(0.97) translateY(20px) translateX(-25px);}
          100% { transform: scale(1) translateY(0px) translateX(0px);}
        }
        .animate-blob2 { animation: blob2 16s ease-in-out infinite alternate; }
        @keyframes gradient-shimmer {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-gradient-shimmer {
          background-size: 200% 200%;
          animation: gradient-shimmer 3s ease infinite;
          z-index: 1;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: pulseGlow 3s ease-in-out infinite alternate;
          pointer-events: none;
        }
        @keyframes pulseGlow {
          0% {opacity: 0.1; transform: scale(1);}
          100% {opacity: 0.25; transform: scale(1.1);}
        }
        .rotate-coin:hover {
          animation: spinCoin 1s linear infinite;
        }
        @keyframes spinCoin {
          0% {transform: rotate(0deg);}
          100% {transform: rotate(360deg);}
        }
        .fade-slide-up {
          animation: fadeSlideUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Subtle hover effect for leaderboard list items */
        .leaderboard-item {
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), filter 0.3s cubic-bezier(0.4,0,0.2,1);
          will-change: transform, box-shadow, filter;
        }
        .leaderboard-item:hover {
          transform: scale(1.03);
          filter: brightness(1.05);
          box-shadow: 0 0 12px rgba(234,179,8,0.25);
          z-index: 5;
        }

        /* Glassmorphism card style for claim history */
        .history-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #1f2937; /* text-gray-800 */
          transition: box-shadow 0.3s ease;
        }
        .history-card:hover {
          box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.3);
        }
        .history-avatar {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          user-select: none;
          border: 2px solid transparent;
          transition: border-color 0.3s ease;
        }
        .history-avatar:hover {
          border-color: rgba(99, 102, 241, 0.7);
        }
        .history-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .history-name {
          font-weight: 700;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .history-points {
          font-weight: 600;
          font-size: 0.9rem;
          color: #d97706; /* amber-600 */
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.15rem;
        }
        .history-date {
          font-size: 0.85rem;
          color: #6b7280; /* gray-500 */
          margin-top: 0.15rem;
        }
      `}</style>

      <div className="space-y-4">
        <label className="block font-semibold text-gray-800">Create New User</label>
        <input
          type="text"
          placeholder="Enter user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="w-full rounded-3xl bg-white bg-opacity-10 backdrop-blur-md border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 px-5 py-3 text-gray-900 placeholder-gray-400 transition duration-300 outline-none"
          disabled={loading}
        />
        <button
          onClick={handleCreateUser}
          className="w-full rounded-3xl relative overflow-hidden bg-white bg-opacity-10 backdrop-blur-md border border-gradient-to-r border-transparent from-purple-500 via-pink-500 to-red-500 bg-gradient-to-r text-white py-3 font-semibold shadow-md transition duration-300 transform hover:scale-105 hover:shadow-[0_0_10px_rgba(219,39,119,0.5)] hover:bg-opacity-20"
          disabled={loading}
          style={{boxShadow: '0 0 8px rgba(219,39,119,0.4)'}}
          onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 14px rgba(219,39,119,0.7)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow='0 0 8px rgba(219,39,119,0.4)'}
        >
          Create User
        </button>
      </div>

      <div className="space-y-4">
        <label className="block font-semibold text-gray-800">Select User to Claim Points</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full rounded-3xl bg-white bg-opacity-10 backdrop-blur-md border border-transparent focus:border-teal-400 focus:ring-2 focus:ring-teal-400 px-5 py-3 text-gray-900 transition duration-300 outline-none"
          disabled={loading}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} (Points: {user.totalPoints})
            </option>
          ))}
        </select>
        <button
          onClick={handleClaimPoints}
          className="w-full rounded-3xl relative overflow-hidden bg-white bg-opacity-10 backdrop-blur-md border border-gradient-to-r border-transparent from-teal-400 via-cyan-400 to-blue-500 bg-gradient-to-r text-white py-3 font-semibold shadow-md transition duration-300 transform hover:scale-105 hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:bg-opacity-20"
          disabled={loading}
          style={{boxShadow: '0 0 8px rgba(16,185,129,0.4)'}}
          onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 14px rgba(16,185,129,0.7)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow='0 0 8px rgba(16,185,129,0.4)'}
        >
          Claim Points
        </button>
      </div>

      {/* Top 3 Users Cards */}
      {topThree.length > 0 && (
        <div className="flex justify-center items-end space-x-8 mb-10 px-2 md:px-0">
          {[1, 0, 2].map((pos, i) => {
            if (!topThree[pos]) return <div key={pos} className="w-36" />;
            // Lighter pastel background for each card
            const cardColors = [
              {
                bg: "bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100",
                border: "border-yellow-200",
                text: "text-yellow-900",
                particleColor: "rgba(202, 138, 4, 0.10)",
              },
              {
                bg: "bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50",
                border: "border-blue-100",
                text: "text-blue-900",
                particleColor: "rgba(59, 130, 246, 0.10)",
              },
              {
                bg: "bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100",
                border: "border-amber-100",
                text: "text-amber-900",
                particleColor: "rgba(245, 158, 11, 0.10)",
              },
            ][i];
            const rankEmoji = ["🥈", "🥇", "🥉"][i];
            // Wider cards for top 3, and more proportional aspect
            const widthClass =
              pos === 0
                ? "w-56 md:w-72 px-10 py-14 rounded-3xl"
                : "w-40 md:w-52 px-7 py-9 rounded-2xl";
            return (
              <div
                key={topThree[pos]._id}
                className={`relative flex flex-col items-center ${widthClass} ${cardColors.bg} border-4 ${cardColors.border} select-none cursor-default transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl fade-slide-up`}
                style={{
                  zIndex: 10 - i,
                  boxShadow: pos === 0
                    ? "0 6px 36px 0 rgba(250,204,21,0.13)"
                    : "0 3px 18px 0 rgba(59,130,246,0.08)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Soft glow layers */}
                <span className={`absolute inset-0 rounded-3xl blur-2xl opacity-25 ${cardColors.bg}`}></span>
                {/* Animated pastel particles */}
                {[...Array(5)].map((_, idx) => {
                  const size = Math.random() * 8 + 6;
                  const top = Math.random() * 100;
                  const left = Math.random() * 100;
                  const delay = Math.random() * 3;
                  return (
                    <span
                      key={idx}
                      className="particle"
                      style={{
                        width: size,
                        height: size,
                        top: `${top}%`,
                        left: `${left}%`,
                        backgroundColor: cardColors.particleColor,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
                <span className={`text-4xl mb-4 relative z-10`}>{rankEmoji}</span>
                {/* Avatar for top user */}
                <div className={`flex items-center justify-center mb-2`}>
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold uppercase border-2 ring-2 ${getAvatarStyle(topThree[pos].name).bg} ${getAvatarStyle(topThree[pos].name).text} ${getAvatarStyle(topThree[pos].name).ring} shadow-md text-2xl`}
                    title={topThree[pos].name}
                  >
                    {topThree[pos].name.charAt(0)}
                  </div>
                </div>
                <span className={`font-extrabold text-xl truncate max-w-full text-center relative z-10 ${cardColors.text}`}>{topThree[pos].name}</span>
                <span className={`font-semibold text-xl relative z-10 ${cardColors.text}`}>{topThree[pos].totalPoints} pts</span>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Leaderboard</h2>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {!loading && users.length === 0 && <p className="text-center text-gray-600">No users found.</p>}
        {!loading && users.length > 0 && (
          <ul className="border border-gray-300 rounded-3xl divide-y divide-gray-200 shadow-md overflow-hidden bg-white bg-opacity-10 backdrop-blur-md">
            {sortedUsers.map((user, index) => {
              const isTopThree = index < 3;
              const bgColorClass = isTopThree
                ? leaderboardRankStyles[index]
                : index % 2 === 0
                ? "bg-white bg-opacity-15"
                : "bg-white bg-opacity-10";
              const textColorClass = isTopThree ? "font-bold" : "font-semibold text-gray-800";
              const avatar = getAvatarStyle(user.name);
              return (
                <li
                  key={user._id}
                  className={`${bgColorClass} flex items-center px-6 py-4 cursor-default mx-4 my-2 rounded-2xl transform fade-slide-up transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-lg`}
                  style={{
                    borderImageSlice: 1,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderImageSource: 'linear-gradient(to right, #fbbf24, #f59e0b)'
                  }}
                >
                  {/* Rank */}
                  <div className={`w-12 text-center font-bold select-none ${isTopThree ? "text-gray-900" : "text-gray-700"}`}>
                    #{index + 1}
                  </div>
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold uppercase mr-5 select-none relative border-2 ring-2 ${avatar.bg} ${avatar.text} ${avatar.ring} transition-transform duration-300 hover:animate-pulse`}
                    title={user.name}
                  >
                    {user.name.charAt(0)}
                  </div>
                  {/* Name */}
                  <div className={`flex-1 truncate ${textColorClass}`} title={user.name}>
                    {user.name}
                  </div>
                  {/* Points */}
                  <div className={`w-24 text-right font-bold select-none ${isTopThree ? "text-yellow-900" : "text-indigo-600"} text-lg flex items-center justify-end space-x-1`}>
                    <span className="inline-block transform transition-transform duration-500 hover:scale-110 rotate-coin select-none">💰</span>
                    <span>{user.totalPoints}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Claim History Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Claim History</h2>
        {history.length === 0 && !loading && (
          <p className="text-center text-gray-600">No claim history found.</p>
        )}
        <div>
          {history.map((entry) => {
            // Find user name robustly: prefer populated, else lookup by ObjectId, else fallback
            const userFromList = users.find(u => u._id === (entry.userId?._id || entry.userId));
            const displayName =
              entry.userId?.name ||
              userFromList?.name ||
              entry.displayName ||
              entry.userName ||
              entry.name ||
              "Unknown";
            const avatar = getAvatarStyle(displayName);
            return (
              <div key={entry._id || `${entry.userId?._id || entry.userId || ""}-${entry.claimedAt}`} className="history-card fade-slide-up">
                <div className={`history-avatar ${avatar.bg} ${avatar.text} ${avatar.ring} border-2`} title={displayName}>
                  {displayName.charAt(0)}
                </div>
                <div className="history-info">
                  <div className="history-name" title={displayName}>{displayName}</div>
                  <div className="history-points">
                    <span>💰</span> <span>{entry.pointsAwarded}</span>
                  </div>
                  <div className="history-date">{formatDate(entry.claimedAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;