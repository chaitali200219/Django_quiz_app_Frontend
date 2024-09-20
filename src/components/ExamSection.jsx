  import React, { useState, useEffect } from 'react';
  import styles from './examSection.module.css';

  const API_URL = 'http://localhost:8000';

  const fetchExams = async (authToken, teacherId, status = null) => {
    let url = `${API_URL}/quiz/quizzes/${teacherId}/`;
    if (status) {
      url += `?status=${status}`;
    }

    console.log('Fetching from URL:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        return response.json();
      } else {
        const errorText = await response.text();
        console.error('Failed response text:', errorText);
        throw new Error('Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  };

  const ExamSection = () => {
    const [exams, setExams] = useState([]);
    const [tab, setTab] = useState('all'); // Default to 'all'
    const authToken = localStorage.getItem('authToken');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const teacherId = 4; // Set to the teacher ID you want to filter by

    useEffect(() => {
      const loadExams = async () => {
        setLoading(true); // Set loading state
        try {
          const status = tab === 'completed' ? 'completed' : null;
          const data = await fetchExams(authToken, teacherId, status);
          setExams(data);
          setError('');
        } catch (error) {
          setError(`Failed to load exams: ${error.message}`);
        } finally {
          setLoading(false); // End loading state
        }
      };

      if (authToken) { // Ensure authToken is available
        loadExams();
      } else {
        setError('Authentication token is missing');
      }
    }, [tab, authToken, teacherId]);

    return (
      <div className={styles.examSection}>
        <h2>My Exams</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p>Loading exams...</p>}
        
        <div className={styles.tabs}>
          <button onClick={() => setTab('all')} className={tab === 'all' ? styles.activeTab : ''}>All</button>
          <button onClick={() => setTab('completed')} className={tab === 'completed' ? styles.activeTab : ''}>Completed</button>
        </div>

        {!loading && (
          <table className={styles.examTable}>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Duration</th>
                <th>Marks</th>
                <th>Status</th>
                {tab === 'all' ? <th>Attempt Quiz</th> : <th>View Result</th>}
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.duration} minutes</td>
                  <td>{exam.marks}</td>
                  <td>{exam.status}</td>
                  <td>
                    {tab === 'all' ? (
                      <button className={styles.attemptBtn}>Attempt Quiz</button>
                    ) : (
                      <button className={styles.viewResultBtn}>View Result</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  export default ExamSection;
