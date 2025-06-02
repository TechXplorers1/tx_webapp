import React from 'react';
import { Navbar, Nav, Container, Carousel, Card, Button, Form } from 'react-bootstrap';
import '../styles/Careers.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar'; // Make sure this path is correct

const jobs = [
    {
      title: 'Data Analyst',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564', // Replace with your image URLs
      description:
        'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
    },
    {
      title: 'Data Analyst',
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      description:
        'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
    },
    {
      title: 'Data Analyst',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      description:
        'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
    },
  ];
  
  function Careers() {
  
        const navigate = useNavigate();
  
    return (
      <div className="careers-container">
        <CustomNavbar />
        <Container>
        <input className="search-bar" placeholder="search by role" />
  
        <h2 className="careers-title">FEATURED JOBS</h2>
        <p className="careers-subtext">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur.
        </p>
        </Container>
  
        <div className="job-cards">
          {jobs.map((job, index) => (
            <div className="job-card" key={index}>
              <img src={job.image} alt="job" />
              <div className="job-info">
                <strong>Role :</strong> {job.title}
                <p>{job.description}</p>
              </div>
            </div>
          ))}
        </div>
  
        <footer className="bg-white py-5">
              <Container>
                {/* Form Section */}
                <Form className="d-flex justify-content-center align-items-center mb-5">
                  <Form.Control
                    type="text"
                    placeholder="Ask"
                    className="me-2 rounded-0 py-2"
                    style={{ width: '25%' }}
                  />
                  <button variant="primary" className="btn btn-primary rounded-0 px-4 py-2">Submit</button>
                </Form>
        
                {/* Copyright and Links */}
                <div className="d-flex justify-content-center align-items-center">
                  {/* Centered Copyright */}
                  <p className="mb-0 text-dark">Techxplorers ©️2025</p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        
                  {/* Right-aligned Links */}
                  <div>
                    <a href="#" className="text-dark me-2 text-decoration-none">Privacy & Legal</a>
                    <a href="#" className="text-dark text-decoration-none">Contact</a>
                  </div>
                </div>
              </Container>
            </footer>
      </div>
    );
  };

export default Careers;