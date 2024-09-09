import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './app.module.css'; 

const App = () => {
  const username = localStorage.getItem('username') || '';

  return (
    <ErrorBoundary>
      
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-login" element={<Login userType="teacher" />} />
        <Route path="/student-login" element={<Login userType="student" />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
      
    </ErrorBoundary>
  );
};

export default App;
