// src/api.js
import axios from "axios";

const BASE_URL = "https://user-leaderboard.onrender.com";

export const fetchUsers = () => axios.get(`${BASE_URL}/users`);
export const addUser = (name) => axios.post(`${BASE_URL}/users`, { name });
export const claimPoints = (userId) => axios.post(`${BASE_URL}/claim/${userId}`);
// export const fetchLeaderboard = () => axios.get(`${BASE_URL}/leaderboard`);
export const fetchLeaderboard = async () => {
    const res = await fetch("http://localhost:5000/leaderboard"); // or your Render URL
    const data = await res.json();
    return data;
};