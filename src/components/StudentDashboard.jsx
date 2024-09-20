import React, { useState } from 'react';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [error, setError] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return ("Hello");
};

export default StudentDashboard;
