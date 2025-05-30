import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const CustomNavbar = () => {
          const navigate = useNavigate();
  
  return (
    <Navbar bg="light" expand="lg" className="fixed-top shadow-sm">
      <Container fluid> {/* Changed to Container fluid for full width */}
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
          <Nav className="mx-auto gap-lg-5 gap-3"> {/* Improved gap classes */}
            <Nav.Link href="#services" className="nav-link-custom" onClick={() => navigate('/')}>SERVICES</Nav.Link>
            <Nav.Link href="#career" className="nav-link-custom" >CAREER</Nav.Link>
            <Nav.Link href="#about-us" className="nav-link-custom" onClick={() => navigate('/aboutus')}>ABOUT US</Nav.Link>
            <Nav.Link href="#contact" className="nav-link-custom" onClick={() => navigate('/contactus')}>CONTACT</Nav.Link>
          </Nav>
        
          {/* Login Button (Right-Aligned) */}
          <Button variant="primary" size="lg" className="ms-lg-3">
            LOGIN
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;