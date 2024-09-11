import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import CreateQuestionForm from './components/CreateQuestionForm';
import CreateExamForm from './components/CreateExamForm';
import styles from './app.module.css'; 

const App = () => {
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  const PrivateRoute = ({ element, allowedRoles }) => {
    return allowedRoles.includes(userType) ? element : <Navigate to="/" />;
  };

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        <Navbar /> 

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

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
