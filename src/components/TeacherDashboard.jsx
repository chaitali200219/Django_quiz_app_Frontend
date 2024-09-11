import React, { useState, useEffect } from 'react';
import styles from './TeacherDashboard.module.css'; 

const API_URL = 'http://localhost:8000';

const fetchQuestions = async (teacherId, authToken) => {
  

  try {
    const response = await fetch(`${API_URL}/questions/teachers/${teacherId}/questions/`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('AuthToken:', authToken);
console.log('TeacherId:', teacherId);

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch questions');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

const TeacherDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // State to trigger refresh

  const authToken = localStorage.getItem('authToken');
  console.log(authToken)
  const teacherId = localStorage.getItem('teacherId'); // Retrieve the dynamic teacher ID
  console.log(teacherId)

  useEffect(() => {
    const getQuestions = async () => {
      if (!authToken || !teacherId) {
        setError('No authentication token or teacher ID found');
        return;
      }

      try {
        const data = await fetchQuestions(teacherId, authToken);
        setQuestions(data);
        setError(''); // Clear any previous errors
      } catch (error) {
        setError('Error loading questions');
        console.error('Error loading questions:', error);
      }
    };

    getQuestions();
  }, [teacherId, authToken, refresh]); // Add refresh to dependency array

  // Function to refresh questions list after creating a question
  const handleCreateQuestion = async (newQuestion) => {
    if (!authToken || !teacherId) {
      setError('No authentication token or teacher ID found');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/questions/teachers/allquestions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        setRefresh(prev => !prev); // Toggle refresh state
      } else {
        throw new Error('Failed to create question');
      }
    } catch (error) {
      setError('Error creating question');
      console.error('Error creating question:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <h2>Teacher Dashboard</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        {questions.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Type</th>
                <th>Marks</th>
                {/* Add more columns if needed */}
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.content}</td>
                  <td>{question.question_type}</td>
                  <td>{question.marks}</td>
                  {/* Add more columns if needed */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
