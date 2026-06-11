import React from 'react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="nav-label">Surveys</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'capture' ? 'active' : ''}`}
        onClick={() => setActiveTab('capture')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="nav-label">New Audit</span>
      </button>
    </nav>
  );
}
