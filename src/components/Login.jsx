import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'P@ssw0rd2026') {
        onLogin({ username: 'Administrator', role: 'Auditor' });
      } else {
        setError('Invalid clinical ID or password.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel fade-in">
        <div className="login-header">
          <img src="/logo.jpeg" alt="Hospital Logo" className="login-logo" onError={(e) => e.target.style.display = 'none'} />
          <h1 className="login-title">Health Survey Hub</h1>
          <p className="login-subtitle">Hospital & Health Center Assessment Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">Clinical ID / Username</label>
            <div className="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Access Assessment Portal'
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
