import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './QuizResults.module.css';

const API_URL = 'http://127.0.0.1:8000/results'; // Updated backend URL
const AUTH_TOKEN = localStorage.getItem('authToken'); // Provided auth token
const USERNAME = localStorage.getItem('username'); // Assuming username is stored in localStorage
const USER_ROLE = localStorage.getItem('userRole'); // Assuming user role is stored in localStorage

const fetchQuizResults = async () => {
  const response = await axios.get(`${API_URL}/quiz-results/`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`, // Include the token in the request headers
    },
  });
  return response.data;
};

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuizResults = async () => {
      try {
        const results = await fetchQuizResults();
        if (USER_ROLE === 'student') {
          const filteredResults = results.filter(result => result.student === USERNAME);
          setQuizResults(filteredResults);
        } else {
          setQuizResults(results);
        }
      } catch (err) {
        console.log(err);
        setError('Failed to fetch quiz results.');
      }
    };
    getQuizResults();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h2>Quiz Results</h2>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.resultsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quiz Type</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map(result => (
            <tr key={result.id}>
              <td>{result.student}</td>
              <td>{result.quiz}</td>
              <td>{result.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResults;