import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [experience_years, setExperience_years] = useState('');
  const [grades, setGrades] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Username and Password are required.');
      return;
    }
    if (userType === 'teacher' && !experience_years) {
      setError('Experience Years is required for teachers.');
      return;
    }
    if (userType === 'student' && !grades) {
      setError('Grades are required for students.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/user/api/register/${userType}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          ...(userType === 'teacher' ? { experience_years } : { grade: grades }),
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Redirect to login page
      navigate(`/${userType}-login`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => setUserType('teacher')}>
            Teacher
          </button>
          <button type="button" onClick={() => setUserType('student')}>
            Student
          </button>
        </div>

        {userType && (
          <>
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
            {userType === 'teacher' && (
              <div className={styles.inputGroup}>
                <label>Experience Years:</label>
                <input
                  type="number"
                  value={experience_years}
                  onChange={(e) => setExperience_years(e.target.value)}
                  required
                />
              </div>
            )}
            {userType === 'student' && (
              <div className={styles.inputGroup}>
                <label>Grades:</label>
                <input
                  type="text"
                  value={grades}
                  onChange={(e) => setGrades(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
