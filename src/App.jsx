import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import SurveyList from './components/SurveyList';
import SurveyCapture from './components/SurveyCapture';
import { mockSurveys } from './data/mockSurveys';
import './index.css';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('survey_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'capture'
  
  const [surveys, setSurveys] = useState(() => {
    const savedSurveys = localStorage.getItem('completed_surveys');
    return savedSurveys ? JSON.parse(savedSurveys) : mockSurveys;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('completed_surveys', JSON.stringify(surveys));
  }, [surveys]);

  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem('survey_auth_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setUser(null);
      localStorage.removeItem('survey_auth_user');
    }
  };

  const handleNewSurvey = (newSurveyData) => {
    const newSurvey = {
      id: `survey-${Date.now()}`,
      ...newSurveyData
    };
    setSurveys(prev => [newSurvey, ...prev]);
    setActiveTab('list'); // Move to list view after submitting
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'list' ? (
          <SurveyList surveys={surveys} onLogout={handleLogout} />
        ) : (
          <SurveyCapture onSubmit={handleNewSurvey} />
        )}
      </main>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
