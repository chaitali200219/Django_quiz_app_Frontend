import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './examSection.module.css';

const API_URL = 'http://localhost:8000';

const fetchExams = async (authToken, status = null) => {
  let url = `${API_URL}/answer/quizzes/`;

  if (status) {
    url += `?status=${status}`; // Append the status as a query parameter
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch quizzes');
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

const StudentExamSection = () => {
  const [exams, setExams] = useState([]);
  const [tab, setTab] = useState('all'); // Default to 'all' exams
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const status = tab === 'completed' ? 'Completed' : null; // Set status based on tab selection
        const data = await fetchExams(authToken, status);

        if (tab === 'completed') {
          // Set exams as completed only
          const completedExams = data.filter((exam) => exam.status === 'Completed');
          setExams(completedExams);
        } else {
          // Filter out completed exams from 'all' tab
          const nonCompletedExams = data.filter((exam) => exam.status !== 'Completed');
          setExams(nonCompletedExams);
        }

        setError('');
      } catch (error) {
        setError(`Failed to load exams: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      loadExams();
    } else {
      setError('Authentication token is missing');
    }
  }, [authToken, tab]); // Re-fetch exams when the tab changes

  const handleAttemptQuiz = (quizId) => {
    // Simulate the completion of the quiz and update its status
    navigate(`/attempt-quiz/${quizId}`);
  };

  return (
    <div className={styles.examSection}>
      <h2>My Exams</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading exams...</p>}

      <div className={styles.tabs}>
        <button
          onClick={() => setTab('all')}
          className={tab === 'all' ? styles.activeTab : ''}
        >
          All
        </button>
        <button
          onClick={() => setTab('completed')}
          className={tab === 'completed' ? styles.activeTab : ''}
        >
          Completed
        </button>
      </div>

      {!loading && exams.length > 0 && (
        <table className={styles.examTable}>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Duration</th>
              <th>Marks</th>
              <th>Status</th>
              {tab === 'all' ? <th>Attempt Quiz</th> : <th>View Result</th>}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.duration} minutes</td>
                <td>{exam.marks}</td>
                <td>{exam.status}</td>
                <td>
                  {tab === 'all' && exam.status === 'Not Started' ? (
                    <button
                      className={styles.attemptBtn}
                      onClick={() => handleAttemptQuiz(exam.id)}
                    >
                      Attempt Quiz
                    </button>
                  ) : tab === 'all' && exam.status === 'In Progress' ? (
                    <button className={styles.continueBtn}>Continue Quiz</button>
                  ) : exam.status === 'Completed' ? (
                    <button className={styles.viewResultBtn}>View Result</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && exams.length === 0 && <p>No exams found.</p>}
    </div>
  );
};

export default StudentExamSection;
