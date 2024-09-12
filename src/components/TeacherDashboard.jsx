import React, { useState, useEffect } from 'react';
import styles from './TeacherDashboard.module.css'; // Ensure this file exists

const API_URL = 'http://localhost:8000';

const fetchQuestions = async (teacher_id, authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/teachers/${teacher_id}/questions/`, {
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
  const authToken = localStorage.getItem('authToken');
  const teacher_id = localStorage.getItem('teacher_id'); // Retrieve the teacher ID

  useEffect(() => {
    // Debugging logs to check if authToken and teacherId exist
    console.log('authToken:', authToken);
    console.log('teacher_id:', teacher_id);

    const getQuestions = async () => {
      if (!authToken || !teacher_id) {
        setError('No authentication token or teacher ID found');
        return;
      }

      try {
        const data = await fetchQuestions(teacher_id, authToken);
        setQuestions(data);
        setError(''); // Clear any previous errors
      } catch (error) {
        setError('Error loading questions');
        console.error('Error loading questions:', error);
      }
    };

    getQuestions();
  }, [teacher_id, authToken]);

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
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.content}</td>
                  <td>{question.question_type}</td>
                  <td>{question.marks}</td>
                  <td>
                    {question.options.map((option, index) => (
                      <div key={index}>
                        {option.content} {option.is_correct && '(Correct)'}
                      </div>
                    ))}
                  </td>
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
