import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CreateQuestionForm from './components/CreateQuestionForm';
import UpdateQuestionForm from './components/UpdateQuestionForm';
import CreateExamForm from './components/CreateExamForm';
import QuizResults from './components/QuizResults';
import Leaderboard from './components/leaderboard';
import styles from './app.module.css';

const API_URL = 'http://127.0.0.1:8000'; // Updated backend URL

const fetchLeaderboardEntries = async () => {
  const response = await axios.get(`${API_URL}/leaderboard-entries/`);
  return response.data;
};

const App = () => {
  const location = useLocation();  // Get the current route
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLeaderboardEntries = async () => {
      try {
        const entries = await fetchLeaderboardEntries();
        setLeaderboardEntries(entries);
      } catch (err) {
        setError('Failed to fetch leaderboard entries.');
      }
    };
    getLeaderboardEntries();
  }, []);

  const PrivateRoute = ({ element, allowedRoles }) => {
    return allowedRoles.includes(userType) ? element : <Navigate to="/" />;
  };

  // Define routes where Navbar and Footer should be hidden
  const hideNavbarAndFooter = ['/', '/register', '/teacher-login', '/student-login'];

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        {/* Conditionally render Navbar */}
        {!hideNavbarAndFooter.includes(location.pathname) && <Navbar />}

        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teacher-login" element={<Login />} />
            <Route path="/student-login" element={<Login />} />
            <Route 
              path="/teacher-dashboard" 
              element={
                <PrivateRoute 
                  element={<TeacherDashboard />} 
                  allowedRoles={['teacher']}
                />
              }
            />
            <Route 
              path="/student-dashboard" 
              element={
                <PrivateRoute 
                  element={<StudentDashboard />} 
                  allowedRoles={['student']}
                />
              }
            />
            <Route 
              path="/create-question" 
              element={
                <PrivateRoute 
                  element={<CreateQuestionForm />} 
                  allowedRoles={['teacher']}
                />
              }
            />
            <Route 
              path="/update-question/:questionId" 
              element={
                <PrivateRoute 
                  element={<UpdateQuestionForm />} 
                  allowedRoles={['teacher']}
                />
              }
            />
            <Route 
              path="/create-exam" 
              element={
                <PrivateRoute 
                  element={<CreateExamForm />} 
                  allowedRoles={['teacher']}
                />
              }
            />
            <Route 
              path="/quiz-results" 
              element={
                <PrivateRoute 
                  element={<QuizResults />} 
                  allowedRoles={['teacher', 'student']}
                />
              }
            />
            <Route 
              path="/leaderboard" 
              element={
                <PrivateRoute 
                  element={<Leaderboard />} 
                  allowedRoles={['teacher', 'student']}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Conditionally render Footer */}
        {!hideNavbarAndFooter.includes(location.pathname) && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;