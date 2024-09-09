import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css'; // Import CSS module for styling

const Navbar = ({ username }) => {
  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('authToken');
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
        <Link to="/create-exam" className={styles.navbarLink}>Create Exam</Link>
        <Link to="/create-question" className={styles.navbarLink}>Create Questions</Link>
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

export default Navbar;
