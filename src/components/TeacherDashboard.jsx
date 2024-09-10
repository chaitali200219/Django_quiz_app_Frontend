import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './TeacherDashboard.module.css';

const API_URL = 'http://localhost:8000';

// Function to refresh the auth token (you need to implement this function)
const refreshToken = async () => {
  // Implement token refresh logic
  console.log("Token refresh function needs implementation.");
};

// Function to fetch questions specific to a teacher
const fetchQuestions = async (teacherId) => {
  let authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token is missing');
  }
  
  try {
    let response = await fetch(`${API_URL}/questions/teachers/${teacherId}/questions/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (response.status === 401) { // Unauthorized, possibly expired token
      await refreshToken(); // Try to refresh the token
      // Retry the request with the new token
      authToken = localStorage.getItem('authToken');
      response = await fetch(`${API_URL}/questions/teachers/${teacherId}/questions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
    }

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      console.error('Error fetching questions:', errorData);
      throw new Error(errorData.detail || 'Failed to fetch questions');
    }
  } catch (error) {
    console.error('Error during fetching questions:', error);
    throw error;
  }
};

// TeacherDashboard component
const TeacherDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [teacherId, setTeacherId] = useState(null); // State to hold teacher's ID

  useEffect(() => {
    const fetchTeacherId = async () => {
      // Assuming you get the teacher's ID from local storage or another method
      const storedTeacherId = localStorage.getItem('teacherId');
      setTeacherId(storedTeacherId);
    };

    fetchTeacherId();
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!teacherId) return; // Wait until the teacherId is set

      try {
        const fetchedQuestions = await fetchQuestions(teacherId);
        setQuestions(fetchedQuestions);
      } catch (error) {
        setError('Failed to load questions.');
      }
    };

    loadQuestions();
  }, [teacherId]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <h2>Teacher Dashboard</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.questionsList}>
          <h3>Questions</h3>
          {questions.length === 0 ? (
            <p>No questions available.</p>
          ) : (
            <ul>
              {questions.map((question, index) => (
                <li key={index} className={styles.questionItem}>
                  <div>
                    <strong>Question:</strong> {question.content}
                  </div>
                  <div>
                    <strong>Type:</strong> {question.question_type}
                  </div>
                  <div>
                    <strong>Marks:</strong> {question.marks}
                  </div>
                  <div>
                    <strong>Options:</strong>
                    <ul>
                      {question.options.map((opt, i) => (
                        <li key={i}>
                          {opt.content} {opt.is_correct && <strong>(Correct)</strong>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
