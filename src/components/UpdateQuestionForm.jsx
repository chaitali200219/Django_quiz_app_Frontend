import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdateQuestionForm.module.css';

const API_URL = 'http://localhost:8000';

const fetchQuestion = async (questionId, authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/questions/${questionId}/`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch question');
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

const updateQuestion = async (questionId, questionData, authToken) => {
  try {
    const response = await fetch(`${API_URL}/questions/questions/${questionId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(questionData),
    });

    if (response.ok) {
      return response.json();
    } else {
      const errorData = await response.json();
      console.error('Update failed:', errorData);
      throw new Error(errorData.detail || 'Failed to update question');
    }
  } catch (error) {
    console.error('Error during question update:', error);
    throw error;
  }
};

const UpdateQuestionForm = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState('');
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const data = await fetchQuestion(questionId, authToken);
        setQuestion(data.content || '');
        setQuestionType(data.question_type || 'MCQ');
        setMarks(data.marks || '');
        setOptions(data.options || []);
      } catch (error) {
        setError('Error loading question details');
      }
    };

    getQuestion();
  }, [questionId, authToken]);

  const handleQuestionTypeChange = (e) => {
    const type = e.target.value;
    setQuestionType(type);
    if (type === 'MCQ' && options.length === 0) {
      setOptions([
        { content: '', is_correct: false },
        { content: '', is_correct: false },
        { content: '', is_correct: false },
        { content: '', is_correct: false }
      ]);
    } else if (type === 'True/False') {
      setOptions([
        { content: 'True', is_correct: false },
        { content: 'False', is_correct: false }
      ]);
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
      await updateQuestion(questionId, {
        content: question,
        question_type: questionType,
        marks: parseInt(marks, 10),
        options
      }, authToken);

      navigate('/teacher-dashboard');
    } catch (error) {
      setError('An error occurred while updating the question.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <h2>Update Question</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="question">Question</label>
            <input
              type="text"
              id="question"
              name="content"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="question_type">Question Type</label>
            <select
              id="question_type"
              name="question_type"
              value={questionType}
              onChange={handleQuestionTypeChange}
              className={styles.select}
            >
              <option value="MCQ">MCQ</option>
              <option value="True/False">True/False</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="marks">Marks</label>
            <input
              type="number"
              id="marks"
              name="marks"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index} className={styles.option}>
                <input
                  type="text"
                  name="content"
                  value={option.content}
                  onChange={(e) => handleOptionChange(index, e)}
                  className={styles.input}
                />
                {questionType === 'MCQ' && (
                  <label>
                    <input
                      type="checkbox"
                      name="is_correct"
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(index, e)}
                      className={styles.checkbox}
                    />
                    Correct
                  </label>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className={styles.button}>Update Question</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestionForm;
