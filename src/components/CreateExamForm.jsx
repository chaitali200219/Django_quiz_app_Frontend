import React, { useState, useEffect } from 'react';
import styles from './createExamForm.module.css'; 
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

const fetchQuestions = async (authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/teachers/allquestions/`, {
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

const CreateExamForm = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [status, setStatus] = useState(true); // Use boolean for status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();  // Use navigate for redirect

  useEffect(() => {
    const getQuestions = async () => {
      if (!authToken) {
        setError('No authentication token found');
        return;
      }

      try {
        const data = await fetchQuestions(authToken);
        setQuestions(data);
        setError('');
      } catch (error) {
        setError('Error loading questions');
      }
    };

    getQuestions();
  }, [authToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authToken) {
      setError('No authentication token found');
      return;
    }

    const examData = {
      title,
      duration: parseInt(duration, 10),
      questions: assignedQuestions, // Directly use the array of IDs
      status, // Boolean value
    };

    try {
      const response = await fetch(`${API_URL}/quiz/quizzes/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (response.ok) {
        setSuccess('Exam created successfully!');
        setTitle('');
        setDuration('');
        setAssignedQuestions([]);
        setStatus(true); // Reset to default boolean value
        setTimeout(() => {
          navigate('/exam-section');  // Redirect to the exam section
        }, 2000);
      } else {
        throw new Error('Failed to create exam');
      }
    } catch (error) {
      setError('Error creating exam');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2>Create Exam</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Exam Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="assignedQuestions">Assigned Questions</label>
          <select
            id="assignedQuestions"
            multiple
            value={assignedQuestions}
            onChange={(e) => setAssignedQuestions([...e.target.options].filter(option => option.selected).map(option => parseInt(option.value)))}
          >
            {questions.map(question => (
              <option key={question.id} value={question.id}>
                {question.content}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value === 'true')}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>

        <button type="submit">Create Exam</button>
      </form>
    </div>
  );
};

export default CreateExamForm;
