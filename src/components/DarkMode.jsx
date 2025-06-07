// src/components/DarkMode.jsx
import React, { useState, useEffect } from 'react';
import '../styles/DarkMode.css';

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference or system default
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialMode = savedMode || prefersDark;
    setDarkMode(initialMode);

    if (initialMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('darkMode');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <div className="dark-mode-toggle">
      <span className="mode-label">{darkMode ? '🌙' : '☀️'}</span>
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default DarkMode;