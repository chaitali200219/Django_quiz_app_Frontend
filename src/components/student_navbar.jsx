import React from 'react';
import { Link } from 'react-router-dom';
import styles from './student_navbar.module.css'; // Ensure this file exists

const StudentNavbar = ({ username }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.clear()
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link to="/" className={styles.navbarLogo}>
          <img src="https://app.prep.study/en/assets/images/Prep-Logo.png" alt="PrepStudy Logo" />
        </Link>
      </div>
      <div className={styles.navbarRight}>
        <Link to="/student-exams" className={styles.navbarLink}>Exams</Link>
        <Link to="/leaderboard" className={styles.navbarLink}>Leaderboard</Link>
        <Link to="/profile" className={styles.navbarLink}>Profile</Link>
        <div className={styles.navbarProfile}>
          <span>{username}</span>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Profile</button>
            <div className={styles.dropdownContent}>
              <Link to="/profile">My Profile</Link>
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
