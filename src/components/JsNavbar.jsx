import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const JsNavbar = () => {
  const navigate = useNavigate();
  
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