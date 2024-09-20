import axios from 'axios';
import { QuizResult, LeaderboardEntry } from '../types';

const API_URL = 'http://localhost:8000'; // Replace with your backend URL

export const fetchQuizResults = async (): Promise<QuizResult[]> => {
  const response = await axios.get(`${API_URL}/quiz-results/`);
  return response.data;
};

export const fetchLeaderboardEntries = async (): Promise<LeaderboardEntry[]> => {
  const response = await axios.get(`${API_URL}/leaderboard-entries/`);
  return response.data;
};