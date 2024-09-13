import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './CreateQuestionForm.module.css'; // Make sure this file exists

const API_URL = 'http://localhost:8000';

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }
  
  try {
    const response = await fetch(`${API_URL}/user/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

const createQuestion = async (questionData) => {
  let authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token is missing');
  }
  
  try {
    let response = await fetch(`${API_URL}/questions/questions/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(questionData),
    });

    if (response.status === 401) { // Unauthorized, possibly expired token
      await refreshToken(); // Try to refresh the token
      // Retry the request with the new token
      authToken = localStorage.getItem('authToken');
      response = await fetch(`${API_URL}/questions/questions/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(questionData),
      });
    }

    if (response.ok) {
      const result = await response.json();
      console.log('Question created:', result);
      return result;
    } else {
      const errorData = await response.json();
      console.error('Error creating question:', errorData);
      throw new Error(errorData.detail || 'Failed to create question');
    }
  } catch (error) {
    console.error('Error during question creation:', error);
    throw error;
  }
};

const CreateQuestionForm = () => {
  const [isTeacher, setIsTeacher] = useState(true); // Replace with actual logic
  const username = localStorage.getItem('username') || '';
  const navigate = useNavigate(); // Hook for navigation

  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState('');
  const [options, setOptions] = useState([{ content: '', is_correct: false }]);
  const [error, setError] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const handleQuestionTypeChange = (e) => {
    const type = e.target.value;
    setQuestionType(type);
    if (type === 'MCQ') {
      setOptions([{ content: '', is_correct: false }, { content: '', is_correct: false }, { content: '', is_correct: false }, { content: '', is_correct: false }]);
    } else {
      setOptions([{ content: 'True', is_correct: false }, { content: 'False', is_correct: false }]);
    }
  };

  const handleOptionChange = (index, e) => {
    const { name, value, checked } = e.target;
    const newOptions = [...options];
    if (name === 'is_correct') {
      newOptions[index] = { ...newOptions[index], [name]: checked };
    } else {
      newOptions[index] = { ...newOptions[index], [name]: value };
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !marks || options.some(opt => !opt.content)) {
      setError('All fields are required.');
      return;
    }

    if (questionType === 'MCQ' && !options.some(opt => opt.is_correct)) {
      setError('Please select the correct answer.');
      return;
    }

    if (marks <= 0) {
      setError('Marks must be a positive number.');
      return;
    }

    try {
      const result = await createQuestion({
        content: question,
        question_type: questionType,
        marks,
        options
      });

      setQuestionsList([...questionsList, result]);

      // Reset form fields
      setQuestion('');
      setMarks('');
      setOptions(questionType === 'MCQ'
        ? [{ content: '', is_correct: false }, { content: '', is_correct: false }, { content: '', is_correct: false }, { content: '', is_correct: false }]
        : [{ content: 'True', is_correct: false }, { content: 'False', is_correct: false }]
      );
      setError('');

      // Navigate to teacher dashboard
      navigate('/teacher-dashboard');
    } catch (error) {
      setError('An error occurred while submitting the form.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      
      <div className={styles.mainContent}>
        <h2>Create Question</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Question:</label>
            <input
              type="text"
              className={styles.input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Question Type:</label>
            <select 
              value={questionType} 
              onChange={handleQuestionTypeChange} 
              className={styles.select}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="True">True/False</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Marks:</label>
            <input
              type="number"
              className={styles.input}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
            />
          </div>
          {questionType === 'MCQ' && options.map((option, index) => (
            <div key={index} className={styles.optionGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Option {index + 1}:</label>
                <input
                  type="text"
                  name="content"
                  className={styles.input}
                  value={option.content}
                  onChange={(e) => handleOptionChange(index, e)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_correct"
                    checked={option.is_correct}
                    onChange={(e) => handleOptionChange(index, e)}
                  />
                  Correct Answer
                </label>
              </div>
            </div>
          ))}
          {questionType === 'True' && options.map((option, index) => (
            <div key={index} className={styles.optionGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Option {index + 1}:</label>
                <select
                  name="content"
                  className={styles.select}
                  value={option.content}
                  onChange={(e) => handleOptionChange(index, e)}
                  required
                >
                  <option value="">Select</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
            </div>
          ))}
          <button type="submit" className={styles.submitButton}>Create Question</button>
        </form>
      </div>

      
    </div>
  );
};

export default CreateQuestionForm;