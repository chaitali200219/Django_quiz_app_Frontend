import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './quizattempt.module.css';

const API_URL = 'http://localhost:8000';

// Fetch quiz details
const fetchQuiz = async (quizId, authToken) => {
  try {
    const response = await fetch(`${API_URL}/answer/quiz/${quizId}/`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch quiz');
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

// Submit answer function
const submitAnswer = async (answerData, authToken, studentId) => {
  try {
    const payload = {
      ...answerData,
      student_id: studentId,
    };

    const response = await fetch(`${API_URL}/answer/answer-submissions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to submit answer: ${errorData}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const authToken = localStorage.getItem('authToken');
  const studentId = localStorage.getItem('student_id');
  const [studentIdValid, setStudentIdValid] = useState(false);
  const navigate = useNavigate();

  // Fetch quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const data = await fetchQuiz(quizId, authToken);
        if (!data || !data.questions) {
          throw new Error('Invalid quiz data');
        }
        setQuiz(data);
        setError('');
        setTimer(data.duration * 60);  // Set timer based on quiz duration
      } catch (error) {
        setError(`Failed to load quiz: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (authToken && studentId) {
      setStudentIdValid(true);
      loadQuiz();
    } else {
      setError('Authentication token or Student ID is missing');
    }
  }, [quizId, authToken, studentId]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      // Optionally submit quiz when timer runs out
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const submitCurrentAnswer = async () => {
    if (!studentIdValid) {
      setError('Student ID is missing or invalid');
      return;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const optionId = selectedOptions[currentQuestion.id];

    if (!optionId) {
      setError('Please select an option before proceeding');
      return;
    }

    const answer = {
      quiz: quizId,
      question: currentQuestion.id,
      option: optionId,
      is_correct: false,
      status: 'submitted',
    };

    try {
      await submitAnswer(answer, authToken, studentId);
      setError('');
    } catch (error) {
      setError(`Failed to submit answer: ${error.message}`);
    }
  };

  const handleNext = async () => {
    await submitCurrentAnswer();

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      const confirmSubmit = window.confirm("Do you want to submit the quiz?");
      if (confirmSubmit) {
        await handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    // Final submission logic
    navigate("/student-dashboard");  // Navigate to student dashboard after submitting
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>{error}</p>;
  if (!quiz || quiz.questions.length === 0) return <p>No quiz available.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className={styles.quizContainer}>
      <h2>{quiz.title}</h2>
      <div className={styles.timer}>
        Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <form>
        <div className={styles.questionContainer}>
          <h3>{currentQuestionIndex + 1}. {currentQuestion.content}</h3>  {/* Display question number */}
          <div className={styles.options}>
            {currentQuestion.options.map(option => (
              <label key={option.id} className={styles.option}>
                <input
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  value={option.id}
                  checked={selectedOptions[currentQuestion.id] === option.id}
                  onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                />
                {option.content}
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navigation}>
          <button type="button" className={styles.continueBtn} onClick={handleNext}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizAttempt;
