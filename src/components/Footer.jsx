import React from 'react';
import styles from './footer.module.css'; // Import CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} PrepStudy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
