import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="fixed-top shadow-sm">
      <Container fluid> {/* Changed to Container fluid for full width */}
        {/* Brand Logo */}
        <Navbar.Brand href="#home" className="fw-bold fs-2">
          TECH<span className="text-primary">X</span>PLORERS
        </Navbar.Brand>

        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links (Centered) */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-lg-5 gap-3"> {/* Improved gap classes */}
            <Nav.Link href="#services" className="nav-link-custom">SERVICES</Nav.Link>
            <Nav.Link href="#career" className="nav-link-custom">CAREER</Nav.Link>
            <Nav.Link href="#about-us" className="nav-link-custom active">ABOUT US</Nav.Link>
            <Nav.Link href="#contact" className="nav-link-custom">CONTACT</Nav.Link>
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