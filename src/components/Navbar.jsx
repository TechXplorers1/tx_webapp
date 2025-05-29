import React, { useState } from 'react';
import '../styles/Navbar.css';
import ServiceLayout from './ServiceLayout';

const Navbar = () => {
  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        TECH<span className="logo-x">X</span>PLORERS
      </div>

      {/* Mobile menu button - hidden on desktop */}
      <button 
        className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="menu-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <div 
          className="nav-item"
          onMouseEnter={() => !mobileMenuOpen && setShowServices(true)}
          onMouseLeave={() => !mobileMenuOpen && setShowServices(false)}
          onClick={() => mobileMenuOpen && setShowServices(!showServices)}
        >
          <a href="#services" className="nav-link">SERVICES</a>
          {showServices && <div className="service-dropdown"><ServiceLayout /></div>}
        </div>
        
        <a href="#career" className="nav-link">CAREERS</a>
        <a href="#about" className="nav-link">ABOUT</a>
        <a href="#contact" className="nav-link">CONTACT</a>
        <button className="login-btn">LOGIN</button>
      </div>
    </nav>
  );
};

export default Navbar;