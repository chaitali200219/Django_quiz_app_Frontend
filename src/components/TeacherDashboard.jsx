import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Adjust the import path as needed
import Footer from './Footer'; 
import styles from './TeacherDashboard.module.css'; // Make sure this file exists

const API_URL = 'http://localhost:8000';

const fetchQuestions = async (teacherId, authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/teachers/${teacherId}/questions/`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

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

  // Replace with actual teacher ID retrieval logic
  const teacherId = 1; // Change this to dynamic ID if needed
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const getQuestions = async () => {
      if (!authToken) {
        setError('No authentication token found');
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
  }, [teacherId, authToken]); // Run this effect when teacherId or authToken changes

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      
      <div className={styles.mainContent}>
        <h2>Teacher Dashboard</h2>
        {error && <p className={styles.error}>{error}</p>}
        <ul>
          {questions.length ? (
            questions.map(question => (
              <li key={question.id}>{question.content}</li>
            ))
          ) : (
            <p>No questions found.</p>
          )}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
