import React from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container, Carousel, Card, Button, Form } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    
         <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand href="#home" className="fw-bold fs-2">TECH<span>X</span>PLORERS</Navbar.Brand>

        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links (Centered) */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto me-auto justify-content-center  gap-5">
            <Nav.Link href="#services">SERVICES</Nav.Link>
            <Nav.Link href="#career">CAREER</Nav.Link>
            <Nav.Link href="#about-us" active>ABOUT US</Nav.Link>
            <Nav.Link href="#contact">CONTACT</Nav.Link>
          </Nav>
        

        {/* Login Button (Right-Aligned) */}
        <Button variant="primary" size="lg" className="ms-auto">LOGIN</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
