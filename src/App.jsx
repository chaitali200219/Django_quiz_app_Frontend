import React from 'react';
import { useLocation, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import StudentNavbar from './components/student_navbar'; // Ensure this file exists
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CreateQuestionForm from './components/CreateQuestionForm';
import UpdateQuestionForm from './components/UpdateQuestionForm';
import CreateExamForm from './components/CreateExamForm';
import styles from './app.module.css';
import NavbarProfile from './components/NavbarProfile';
import ExamSection from './components/ExamSection'; // For teacher
import StudentExamSection from './components/studentexamsection'; // For student
import AttemptQuizPage from './components/quizattempt'; // New component for attempting quizzes

const App = () => {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  // PrivateRoute to restrict access based on user roles
  const PrivateRoute = ({ element, allowedRoles }) => {
    return allowedRoles.includes(userType) ? element : <Navigate to="/" />;
  };

  // Paths where navbar and footer should be hidden
  const hideNavbarAndFooter = ['/', '/register', '/teacher-login', '/student-login'];

  // Render Navbar based on userType and hide for specific routes
  const renderNavbar = () => {
    if (hideNavbarAndFooter.includes(location.pathname)) {
      return null;
    }
    return userType === 'student' ? <StudentNavbar username={localStorage.getItem('username')} /> : <Navbar />;
  };

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        {renderNavbar()}

        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teacher-login" element={<Login />} />
            <Route path="/student-login" element={<Login />} />
            {/* Teacher routes */}
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
              path="/exam-section" 
              element={
                <PrivateRoute 
                  element={<ExamSection />} 
                  allowedRoles={['teacher']}
                />
              }
            />
            {/* Student routes */}
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
              path="/student-exams" 
              element={
                <PrivateRoute 
                  element={<StudentExamSection />} 
                  allowedRoles={['student']}
                />
              }
            />
            <Route 
              path="/attempt-quiz/:quizId" 
              element={
                <PrivateRoute 
                  element={<AttemptQuizPage />} 
                  allowedRoles={['teacher', 'student']}
                />
              }
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute 
                  element={<NavbarProfile />} 
                  allowedRoles={['teacher', 'student']}
                />
              }
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Render Footer only if not in the specified routes */}
        {!hideNavbarAndFooter.includes(location.pathname) && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;