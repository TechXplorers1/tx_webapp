import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const JsNavbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Inline SVGs for the clean look (Copied from Navbar.jsx)
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  return (
    <>
      <style>{`
        /* Brand Styling */
        .brand-full {
          font-size: 1.7rem;
          font-weight: 700;
          background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        /* Theme Button Styling - Minimal Style from Navbar.jsx */
        .theme-btn-minimal {
          background-color: ${isDarkMode ? '#2d2d2d' : '#f3f4f6'};
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
          color: ${isDarkMode ? '#fbbf24' : '#4b5563'};
        }
        
        .theme-btn-minimal:hover {
           background-color: ${isDarkMode ? '#3d3d3d' : '#e5e7eb'};
        }

        /* Dark Navbar Specifics */
        .dark-navbar {
          background-color: #111 !important;
          border-bottom: 1px solid #333 !important;
        }
      `}</style>

      <Navbar 
        bg={isDarkMode ? 'dark' : 'white'} 
        expand="lg" 
        className={`fixed-top shadow-sm ${isDarkMode ? 'dark-navbar' : 'bg-white'}`}
      >
        <Container fluid>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold navbar-brand">
            <span className="brand-full">TechXplorers</span>
          </Navbar.Brand>

          {/* Toggle Button for Mobile View */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-lg-5 gap-3">
              {/* Empty Nav links - kept structure same as before */}
            </Nav>

            {/* Right-aligned items */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              
              {/* New Minimal Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="theme-btn-minimal"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <MoonIcon /> : <SunIcon />}
              </button>

              {/* Go to Home Text Link */}
              <span
                className="fs-5"
                style={{ 
                  cursor: 'pointer',
                  color: isDarkMode ? '#e0e0e0' : '#0d6efd', // Adjusted color for dark mode visibility
                  fontWeight: 500
                }}
                onClick={() => navigate('/')}
              >
                Home
              </span>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default JsNavbar;