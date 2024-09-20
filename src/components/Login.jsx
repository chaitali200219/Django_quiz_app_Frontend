import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(null); // State for user type
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password || !userType) {
      setError('Please fill in all fields and select a user type.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/user/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, userType }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access); // JWT token
        localStorage.setItem('username', username);     // Store username
        localStorage.setItem('userType', userType);     // Store userType

        if (userType === 'teacher') {
          localStorage.setItem('teacher_id', data.teacher_id); // Store teacher_id
          navigate('/teacher-dashboard');
        } else if (userType === 'student') {
          localStorage.setItem('student_id', data.student_id); 
          navigate('/student-dashboard');
        }
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
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
        <div className={styles.userTypeGroup}>
          <label>Select User Type:</label>
          <button
            type="button"
            className={`${styles.userTypeButton} ${userType === 'teacher' ? styles.selected : ''}`}
            onClick={() => setUserType('teacher')}
          >
            Teacher
          </button>
          <button
            type="button"
            className={`${styles.userTypeButton} ${userType === 'student' ? styles.selected : ''}`}
            onClick={() => setUserType('student')}
          >
            Student
          </button>
        </div>
        <button type="button" className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
        <div className={styles.registerLink}>
          <p>
            Don't have an account?{' '}
            <a href="#" onClick={() => navigate('/register')}>
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
