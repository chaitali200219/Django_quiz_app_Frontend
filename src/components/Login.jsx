import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTeacherLogin = () => {
    if (username && password) {
      localStorage.setItem('authToken', 'teacher-token');
      localStorage.setItem('username', username);
      navigate('/teacher-dashboard');
    } else {
      setError('Please fill in all fields.');
    }
  };

  const handleStudentLogin = () => {
    if (username && password) {
      localStorage.setItem('authToken', 'student-token');
      localStorage.setItem('username', username);
      navigate('/student-dashboard');
    } else {
      setError('Please fill in all fields.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleTeacherLogin}>Teacher Login</button>
          <button type="button" onClick={handleStudentLogin}>Student Login</button>
        </div>
        <div className={styles.registerLink}>
          <p>Don't have an account? <a href="#" onClick={() => navigate('/register')}>Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
