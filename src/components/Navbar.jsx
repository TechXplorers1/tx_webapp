import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        TECH<span className="logo-x">X</span>PLORERS
      </div>
      <div className="nav-links">
        <a href="#services">SERVICES</a>
        <a href="#career">CAREERS</a>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
        <button className="login-btn">LOGIN</button>
      </div>
    </nav>
  );
};

export default Navbar;
