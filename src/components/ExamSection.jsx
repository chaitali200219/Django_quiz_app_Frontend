import React, { useState, useEffect } from 'react';
import styles from './examSection.module.css';
import CreateExamForm from './CreateExamForm';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

// Fetch exams based on authentication token and exam status
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

const ExamSection = () => {
  const [exams, setExams] = useState([]); // List of exams
  const [tab, setTab] = useState('all'); // Default to 'all' exams
  const [showCreateExamForm, setShowCreateExamForm] = useState(false); // Toggle for showing the create exam form
  const authToken = localStorage.getItem('authToken'); // Get auth token from local storage
  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const teacherId = 4; // Teacher ID (replace with dynamic value if needed)
  const navigate = useNavigate(); // React router navigation

  // Fetch exams when component loads or tab changes
  useEffect(() => {
    const loadExams = async () => {
      setLoading(true); // Start loading

      try {
        const status = tab === 'completed' ? 'Completed' : null; // Set status based on tab selection
        const data = await fetchExams(authToken, status); // Fetch exams with status filter

        if (tab === 'completed') {
          // If tab is 'completed', filter completed exams
          const completedExams = data.filter((exam) => exam.status === 'Completed');
          setExams(completedExams);
        } else {
          // Otherwise, set all exams
          setExams(data);
        }

        setError(''); // Reset error message
      } catch (error) {
        setError(`Failed to load exams: ${error.message}`); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (authToken) {
      loadExams(); // Load exams if auth token exists
    } else {
      setError('Authentication token is missing'); // Show error if no auth token
    }
  }, [tab, authToken, teacherId]); // Re-fetch exams when tab or authToken changes

  // Handle exam creation
  const handleExamCreated = () => {
    setShowCreateExamForm(false); // Hide create exam form
    setTab('all'); // Switch to 'all' tab after exam creation
    navigate('/exam-section'); // Navigate to exam section
  };

  // Handle tab change
  const handleTabChange = (selectedTab) => {
    setTab(selectedTab); // Set selected tab
    setShowCreateExamForm(false); // Hide create exam form when switching tabs
  };

  // Handle quiz attempt navigation
  const handleQuizAttempt = (quizId) => {
    navigate(`/attempt-quiz/${quizId}`); // Redirect to QuizAttempt page with quiz ID
  };

  return (
    <div className={styles.examSection}>
      <h2>My Exams</h2>
      {error && <p className={styles.error}>{error}</p>} {/* Display error if any */}
      {loading && <p>Loading exams...</p>} {/* Show loading message */}

      {/* Tabs for filtering exams */}
      <div className={styles.tabs}>
        <button
          onClick={() => handleTabChange('all')}
          className={tab === 'all' ? styles.activeTab : ''}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange('completed')}
          className={tab === 'completed' ? styles.activeTab : ''}
        >
          Completed
        </button>
        <button
          onClick={() => setShowCreateExamForm(true)}
          className={styles.createExamBtn}
        >
          Create Exam
        </button>
      </div>

      {/* Show create exam form if the button is clicked */}
      {showCreateExamForm ? (
        <div className={styles.formContainer}>
          <CreateExamForm onExamCreated={handleExamCreated} />
        </div>
      ) : (
        !loading && (
          // Display exam table
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
                    {tab === 'all' ? (
                      <button
                        className={styles.attemptBtn}
                        onClick={() => handleQuizAttempt(exam.id)} // Handle quiz attempt
                      >
                        Attempt Quiz
                      </button>
                    ) : (
                      <button className={styles.viewResultBtn}>View Result</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {!loading && exams.length === 0 && <p>No exams found.</p>} {/* Display message if no exams */}
    </div>
  );
};

export default ExamSection;
