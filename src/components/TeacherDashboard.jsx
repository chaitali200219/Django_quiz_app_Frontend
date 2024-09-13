import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherDashboard.module.css';

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

const deleteQuestion = async (questionId, authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/questions/${questionId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to delete question');
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

const TeacherDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const authToken = localStorage.getItem('authToken');
  const teacher_id = localStorage.getItem('teacher_id');
  const navigate = useNavigate();

  useEffect(() => {
    const getQuestions = async () => {
      if (!authToken || !teacher_id) {
        setError('No authentication token or teacher ID found');
        return;
      }

      try {
        const data = await fetchQuestions(teacher_id, authToken);
        setQuestions(data);
        setError('');
      } catch (error) {
        setError('Error loading questions');
      }
    };

    getQuestions();
  }, [authToken, teacher_id]); // Dependencies to ensure fetch is only called when authToken or teacher_id changes

  const handleEdit = (questionId) => {
    navigate(`/update-question/${questionId}`);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId, authToken);
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
      } catch (error) {
        setError('Error deleting question');
      }
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
                <th>Options</th>
                <th>Actions</th>
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
                  <td>
                    <button onClick={() => handleEdit(question.id)} className={styles.button}>Edit</button>
                    <button onClick={() => handleDelete(question.id)} className={styles.button}>Delete</button>
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
