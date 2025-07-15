// import React, { useEffect, useState } from "react";
// import { fetchLeaderboard } from "../api";

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState([]);

//   const loadLeaderboard = async () => {
//     const res = await fetchLeaderboard();
//     setLeaderboard(res.data);
//   };

//   useEffect(() => {
//     loadLeaderboard();
//   }, []);

//   return (
//     <div>
//       <h2>Leaderboard</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>Name</th>
//             <th>Total Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.map((user) => (
//             <tr key={user.rank}>
//               <td>{user.rank}</td>
//               <td>{user.name}</td>
//               <td>{user.totalPoints}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Leaderboard;

// src/components/Leaderboard.js
import React, { useEffect, useState } from "react";
import LeaderboardLayout from "./LeaderboardLayout";
import { fetchLeaderboard } from "../api"; // your API call

const Leaderboard = () => {
  const [topThreeUsers, setTopThreeUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [bottomUser, setBottomUser] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
const data = [
  { id: 1, name: "User 1", img: "https://via.placeholder.com/64", points: "9****9" },
  { id: 2, name: "User 2", img: "https://via.placeholder.com/64", points: "8****8" },
  { id: 3, name: "User 3", img: "https://via.placeholder.com/64", points: "7****7" },
  { id: 4, name: "User 4", img: "https://via.placeholder.com/64", points: "6****6" },
  { id: 5, name: "User 5", img: "https://via.placeholder.com/64", points: "5****5" },
  { id: 6, name: "User 6", img: "https://via.placeholder.com/64", points: "4****4" },
  { id: 7, name: "User 7", img: "https://via.placeholder.com/64", points: "3****3" },
];
        // Dynamically split your fetched data
        setTopThreeUsers(data.slice(0, 3));
        setOtherUsers(data.slice(3, data.length - 1));
        setBottomUser(data[data.length - 1]);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <LeaderboardLayout
      topThreeUsers={topThreeUsers}
      otherUsers={otherUsers}
      bottomUser={bottomUser}
    />
  );
};

export default Leaderboard;