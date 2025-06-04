// src/App.jsx
import React from 'react';
import { Navbar, Nav, Container, Carousel, Card, Button, Form } from 'react-bootstrap';
import '../styles/AboutUs.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar'; // Make sure this path is correct



const videoUrls = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ ',
    'https://www.youtube.com/embed/Z1RJmh_OqeA ',
    'https://www.youtube.com/embed/ysz5S6PUM-U ',
    'https://www.youtube.com/embed/Tn6-PIqc4UM ',
    'https://www.youtube.com/embed/OKJnZ8w7l3I ',
];

import industry1 from '../assets/mobile1.png';
import industry2 from '../assets/mobile2.png';
import industry3 from '../assets/mobile3.png';
import industry4 from '../assets/mobile4.png';
import industry5 from '../assets/mobile5.png';

function AboutUs() {

    const navigate = useNavigate();

    return (
        <div className="about-us-page">

            {/* Navigation Bar */}
            <CustomNavbar />

            {/* About Us Text Section */}
            <Container className="my-5">
                <h1 className="display-5 fw-bold mb-4">ABOUT US</h1>
                <h2 className="fs-4 fw-semibold mb-4">COMPANY VISION AND MISSION :</h2>
                <p className="text mx-auto">
                    TechXplorers Is A Technology-Driven And Innovation-Focused Consulting Firm Committed To Delivering Top-Tier Solutions In IT Services, Staffing, Software Engineering, And Enterprise Application Development. Our Mission Is To Explore, Innovate, And Implement Cutting-Edge Technologies That Empower Our Clients To Streamline Operations, Accelerate Growth, And Stay Ahead In An Ever-Evolving Digital Landscape.

                    At TechXplorers, We Bring Together A Passionate Team Of Experts, Modern Methodologies, And Industry Best Practices To Address The Unique Challenges Of Every Project. By Aligning The Right Talent With The Right Technology, We Ensure Flawless Execution And Impactful Outcomes. Our Client-First Approach And Dedication To Excellence Help Businesses Achieve Their Goals With Clarity, Confidence, And A Future-Ready Mindset.

                    With a strong foundation in innovation and a relentless pursuit of excellence, TechXplorers is not just a service provider — we are a strategic partner in your digital transformation journey. Whether it's crafting scalable enterprise solutions or delivering agile staffing models, our focus remains on driving measurable results and building long-term value for our clients.
                </p>
                {/* <p className="text-muted mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p> */}
            </Container>

            {/* Industries We Serve Carousel */}
            <Container className="my-1">
                <h2 className="mb-3">INDUSTRIES WE SERVE :</h2>
                <Carousel indicators={false} className="carousel-shadow">
                    {/* Map through the images */}
                    {[industry1, industry2, industry3, industry4, industry5].map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100 carousel-img"
                                src={image}
                                alt={`Slide ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                <div className="text-center mt-4">
                    <Button variant="primary" className="px-4 py-2">
                        EXPLORE TO KNOW MORE
                    </Button>
                </div>
            </Container>

            {/* Video Cards Section */}
            <Container className="my-4 no-padding">
                <h2 className="mb-4 text-center">OUR VIDEOS :</h2>
                <div className="video-card-wrapper">
                    <div className="row  gap-5">
                        {videoUrls.map((url, index) => (
                            <div className="col-md-4 col-lg-2" key={index}>
                                <Card className="h-100 shadow-sm video-card">
                                    <iframe
                                        title={`Video ${index + 1}`}
                                        width="100%"
                                        height="150"
                                        src={url}
                                        allowFullScreen
                                        style={{ border: 'none' }}
                                    ></iframe>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>


            {/* Footer */}
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
                        <p className="mb-0 text-dark">Techxplorers ©2025</p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

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
}

export default AboutUs;