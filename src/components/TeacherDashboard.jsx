import React, { useState } from 'react';
import Navbar from './Navbar'; // Adjust the import path as needed
import Footer from './Footer'; // Adjust the import path as needed
import CreateQuestionForm from './CreateQuestionForm'; // Import the new form component
import styles from './TeacherDashboard.module.css';

const TeacherDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const authToken = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  
  // Check if the token exists and if it indicates a teacher
  const isTeacher = authToken === 'teacher-token';

  return (
    <div className={styles.container}>
      {isTeacher && <Navbar username={username} />}
      <main className={styles.mainContent}>
        {isTeacher ? (
          <>
            <h1>Teacher Dashboard</h1>
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Hide Create Question Form' : 'Show Create Question Form'}
            </button>
            {showCreateForm && <CreateQuestionForm />}
            {/* Add other content for the teacher dashboard */}
          </>
        ) : (
          <p>Please log in as a teacher to access this page.</p>
        )}
      </main>
      
      {isTeacher && <Footer />}
    </div>
  );
};

export default TeacherDashboard;
