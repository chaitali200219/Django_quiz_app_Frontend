import React from 'react';
import styles from './navbarProfile.module.css';

const ProfilePage = () => {
  const username = localStorage.getItem('username');
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <h1 className={styles.welcomeMessage}>Welcome, {username}!</h1>
        <div className={styles.profileContent}>
          <p>Here is your profile information:</p>
          {/* Add additional user details and profile information here */}
          <div className={styles.profileDetails}>
            <p><strong>Email:</strong> {localStorage.getItem('email')}</p>
            <p><strong>Member Since:</strong> {localStorage.getItem('memberSince')}</p>
            {/* You can add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
