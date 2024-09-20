import React, { useEffect, useState } from 'react';
import { fetchLeaderboardEntries } from '../api/results';
import { LeaderboardEntry } from '../types';

const Leaderboard: React.FC = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLeaderboardEntries = async () => {
      try {
        const entries = await fetchLeaderboardEntries();
        setLeaderboardEntries(entries);
      } catch (err) {
        setError('Failed to fetch leaderboard entries.');
      }
    };
    getLeaderboardEntries();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {error && <p>{error}</p>}
      <ul>
        {leaderboardEntries.map(entry => (
          <li key={entry.id}>
            {entry.student} - Total Score: {entry.total_score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;