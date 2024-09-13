import React from 'react';
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
import styles from './app.module.css'; 

const App = () => {
  const location = useLocation();  // Get the current route
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

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
