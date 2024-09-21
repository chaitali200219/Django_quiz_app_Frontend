// src/components/leaderboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './leaderboard.module.css';

const API_URL = 'http://127.0.0.1:8000/results'; // Updated backend URL
const AUTH_TOKEN = localStorage.getItem('authToken'); // Provided auth token

const fetchLeaderboardEntries = async () => {
  const response = await axios.get(`${API_URL}/leaderboard/`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`, // Include the token in the request headers
    },
  });
  return response.data;
};

const Leaderboard = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLeaderboardEntries = async () => {
      try {
        const entries = await fetchLeaderboardEntries();
        setLeaderboardEntries(entries);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch leaderboard entries.');
      }
    };
    getLeaderboardEntries();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h2>Leaderboard</h2>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardEntries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.student}</td>
              <td>{entry.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;