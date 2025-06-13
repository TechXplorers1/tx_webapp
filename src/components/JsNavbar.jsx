import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import theme hook

const JsNavbar = () => {
  const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme(); // Get theme state
  
  return (
    <Navbar bg="light" expand="lg" className="fixed-top shadow-sm">
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand href="#home" className="fw-bold navbar-brand">
          <span className="brand-small">TECH</span>
          <span className="brand-x">X</span>
          <span className="brand-small">PLORERS</span>
        </Navbar.Brand>

        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />



        {/* Navbar Links (Centered) */}
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="mx-auto gap-lg-5 gap-3">
            {/* Empty Nav links - can be added later if needed */}
          </Nav>
                  {/* Right-aligned items: Login only */}
<div className="d-flex align-items-center gap-3">
  {/* Dark Mode Toggle */}
  <label className="dark-mode-toggle">
    <input
      type="checkbox"
      id="darkModeToggle"
      checked={isDarkMode}
      onChange={toggleTheme}
    />
    <span className="slider round"></span>
  </label>
  <label htmlFor="darkModeToggle" className="dark-mode-label">
    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
  </label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>
        
          {/* Go to Home Text Link (Right-Aligned) */}
          <span 
            className="text-primary ms-lg-3" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Go to Home
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
};

export default JsNavbar;