import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://dream11-f25v.onrender.com"; // Your API URL

export default function Dream11Dashboard() {
  const [userId, setUserId] = useState(1);
  const [matchId, setMatchId] = useState(1);
  const [playerIds, setPlayerIds] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const playerIdsArray = playerIds.split(",").map((id) => parseInt(id.trim()));
      await axios.post(`${API_BASE_URL}/select_team`, {
        user_id: userId,
        match_id: matchId,
        player_ids: playerIdsArray,
      });
      alert("Team selection saved!");
      fetchLeaderboard();
    } catch (error) {
      alert("Error submitting team selection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Dream11 Automation</h1>
      
      <div style={{ marginBottom: "10px" }}>
        <label>User ID: </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(parseInt(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Match ID: </label>
        <input
          type="number"
          value={matchId}
          onChange={(e) => setMatchId(parseInt(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Player IDs (comma-separated): </label>
        <input
          type="text"
          value={playerIds}
          onChange={(e) => setPlayerIds(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "100%" }}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}>
        {loading ? "Submitting..." : "Submit Team"}
      </button>

      <h2>Leaderboard</h2>
      <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.user_id}</td>
              <td>{entry.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
