import React, { useEffect, useState } from 'react';
import { fetchQuizResults } from '../api/results';
import { QuizResult } from '../types';

const QuizResults: React.FC = () => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQuizResults = async () => {
      try {
        const results = await fetchQuizResults();
        setQuizResults(results);
      } catch (err) {
        setError('Failed to fetch quiz results.');
      }
    };
    getQuizResults();
  }, []);

  return (
    <div>
      <h2>Quiz Results</h2>
      {error && <p>{error}</p>}
      <ul>
        {quizResults.map(result => (
          <li key={result.id}>
            {result.student} - {result.quiz} - Score: {result.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;