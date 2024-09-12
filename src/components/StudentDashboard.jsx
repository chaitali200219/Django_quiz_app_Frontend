import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as necessary
import styles from './StudentDashboard.module.css'; 

const StudentDashboard = () => {
  const username = localStorage.getItem('username'); // Assuming you store the username in localStorage

  return (
    <div className={styles.pageContainer}>
      <Navbar username={username} />

      <footer className={styles.footer}>
        <p>© 2024 Your School Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentDashboard;
