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
    // Ensure all fields are filled and a user type is selected
    if (username && password && userType) {
      try {
        // Make a POST request to the login API
        const response = await fetch(`http://localhost:8000/user/api/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }), // Send username and password
        });

        // Check if the response is successful
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('authToken', data.access); // Store JWT token
          localStorage.setItem('username', username);
          localStorage.setItem('userType', userType); // Store the user type

          // Navigate to the respective dashboard based on the user type
          if (userType === 'teacher') {
            navigate('/teacher-dashboard');
          } else if (userType === 'student') {
            navigate('/student-dashboard');
          }
        } else {
          setError('Invalid username or password.');
        }
      } catch (error) {
        setError('Login failed.');
      }
    } else {
      setError('Please fill in all fields and select a user type.');
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
