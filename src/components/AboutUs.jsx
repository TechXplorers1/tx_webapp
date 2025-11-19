import React from 'react';
import { Container, Carousel, Card, Row, Col } from 'react-bootstrap';
import CustomNavbar from './Navbar';

// --- Data for Component ---

const videoUrls = [
  'https://www.youtube.com/embed/O_9u1P5YjVc',
  'https://www.youtube.com/embed/Z1RJmh_OqeA',
  'https://www.youtube.com/embed/5rtujDjt50I',
  'https://www.youtube.com/embed/Tn6-PIqc4UM',
  'https://www.youtube.com/embed/CzRQ9mnmh44',
];

import industry1 from '../assets/mobile1.png';
import industry2 from '../assets/mobile2.png';
import industry3 from '../assets/mobile3.png';
import industry4 from '../assets/mobile4.png';
import industry5 from '../assets/mobile5.png';


// About Us Page - Data for Carousel
const industries = [
  { id: 1, image: industry1, text: "Healthcare & Life Sciences" },
  { id: 2, image: industry2, text: "Banking & Finance" },
  { id: 3, image: industry3, text: "Retail & E-commerce" },
  { id: 4, image: industry4, text: "Manufacturing & Logistics" },
  { id: 5, image: industry5, text: "Education & E-learning" },
];

function AboutUs() {

  // --- Inline CSS for Modern Look & Dark Mode ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

    :root {
      --light-bg: #f8f9fa;
      --light-surface: #ffffff;
      --light-text-primary: #212529;
      --light-text-secondary: #6c757d;
      --light-border: #e9ecef;
      --shadow-light: 0 10px 30px rgba(0, 0, 0, 0.07);
      --shadow-hover-light: 0 15px 40px rgba(0, 0, 0, 0.1);

      --dark-bg: #121212;
      --dark-surface: #1e1e1e;
      --dark-text-primary: #e0e0e0;
      --dark-text-secondary: #a0a0a0;
      --dark-border: #333333;
      --shadow-dark: 0 10px 30px rgba(0, 0, 0, 0.2);
      --shadow-hover-dark: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    body {
      background-color: var(--light-bg);
      font-family: 'Inter', sans-serif;
      transition: background-color 0.3s ease;
    }
    
    .dark-mode body {
      background-color: var(--dark-bg);
    }

    .about-us-container {
      padding-top: 80px;
    }

    .hero-about {
      background-color: var(--light-surface);
      padding: 2rem 1rem;
      text-align: center;
      border-bottom: 1px solid var(--light-border);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .dark-mode .hero-about {
      background-color: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    .hero-about-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--light-text-primary);
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }
    .dark-mode .hero-about-title {
      color: var(--dark-text-primary);
    }

    .hero-about-subtitle {
      font-size: 1.2rem;
      color: var(--light-text-secondary);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.7;
      transition: color 0.3s ease;
    }
    .dark-mode .hero-about-subtitle {
      color: var(--dark-text-secondary);
    }
    
    .section-padding {
      padding: 1.5rem 1rem;
    }

    .section-title {
      text-align: center;
      font-size: 25px;
      font-weight: 600;
      margin-bottom: 3rem;
      color: var(--light-text-primary);
      transition: color 0.3s ease;
    }
    .dark-mode .section-title {
      color: var(--dark-text-primary);
    }

    .industries-carousel .carousel-item {
      height: 500px;
    }

    .industries-carousel .carousel-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
    }

    .industries-carousel .carousel-caption {
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
      border-radius: 0 0 1rem 1rem;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
    }
    
    .industries-carousel .carousel-caption h3 {
      font-weight: 600;
    }

    .videos-section {
      background-color: var(--light-surface);
      transition: background-color 0.3s ease;
    }
    .dark-mode .videos-section {
      background-color: var(--dark-surface);
    }

    .video-card {
      background-color: var(--light-surface);
      border: 1px solid var(--light-border);
      border-radius: 1rem;
      box-shadow: var(--shadow-light);
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
      overflow: hidden;
    }
    .dark-mode .video-card {
      background-color: var(--dark-surface);
      border-color: var(--dark-border);
      box-shadow: var(--shadow-dark);
    }

    .video-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-hover-light);
    }
    .dark-mode .video-card:hover {
      box-shadow: var(--shadow-hover-dark);
    }

    .video-iframe-wrapper {
      position: relative;
      padding-top: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
    }

    .video-iframe-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .about-footer {
      text-align: center;
      padding: 2rem 1rem;
      background-color: var(--light-surface);
      border-top: 1px solid var(--light-border);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .dark-mode .about-footer {
      background-color: var(--dark-surface);
      border-top-color: var(--dark-border);
    }
    .dark-mode .about-footer p, .dark-mode .about-footer a {
      color: var(--dark-text-secondary);
    }

    /* --- SCROLLABLE VIDEO STYLES --- */
    .video-marquee-wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
    }
    .video-marquee-wrapper:before, .video-marquee-wrapper:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        z-index: 2;
    }
    .video-marquee-wrapper:before {
        left: 0;
        background: linear-gradient(to right, var(--light-surface) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .dark-mode .video-marquee-wrapper:before {
        background: linear-gradient(to right, var(--dark-surface) 0%, rgba(30, 30, 30, 0) 100%);
    }
    .video-marquee-wrapper:after {
        right: 0;
        background: linear-gradient(to left, var(--light-surface) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .dark-mode .video-marquee-wrapper:after {
        background: linear-gradient(to left, var(--dark-surface) 0%, rgba(30, 30, 30, 0) 100%);
    }

    .video-marquee-track {
        display: flex;
        width: max-content;
        animation: marquee-scroll 40s linear infinite;
    }

    .video-marquee-wrapper:hover .video-marquee-track {
        animation-play-state: paused;
    }
    
    .video-item {
        flex-shrink: 0;
        width: 380px; /* Width of each card container */
        padding: 0 1rem; /* Space between cards */
    }

    @keyframes marquee-scroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="about-us-container">
        <CustomNavbar />

        <section className="hero-about">
          <Container>
            <h3 className="hero-about-title">Our Mission</h3>
            <p className="hero-about-subtitle">
              TechXplorers is a technology-driven and innovation-focused consulting firm committed to
              delivering top-tier solutions in IT services, staffing, and software engineering. 
              Our mission is to explore, innovate, and implement cutting-edge technologies that empower our clients to streamline operations, accelerate
              growth, and stay ahead in an ever-evolving digital landscape.
            </p>
          </Container>
        </section>

        <section className="industries-section section-padding">
          <Container>
            <h2 className="section-title">Industries We Serve</h2>
            <Carousel indicators={true} interval={3000} className="industries-carousel">
              {industries.map((industry) => (
                <Carousel.Item key={industry.id}>
                  <img
                    className="d-block w-100 carousel-img"
                    src={industry.image}
                    alt={industry.text}
                  />
                  <Carousel.Caption>
                    <h3>{industry.text}</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </section>

        {/* <section className="videos-section section-padding">
          <Container>
            <h2 className="section-title">Our Videos</h2>
            <div className="video-marquee-wrapper">
              <div className="video-marquee-track">
                {[...videoUrls, ...videoUrls].map((url, index) => (
                  <div className="video-item" key={index}>
                    <Card className="video-card">
                      <div className="video-iframe-wrapper">
                        <iframe
                          title={`Video ${index + 1}`}
                          src={url}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section> */}

        <footer className="about-footer">
          <Container>
            <p className="mb-2">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            <div>
              <a href="#" className="text-secondary text-decoration-none mx-2">Privacy & Legal</a>
              <a href="/contactus" className="text-secondary text-decoration-none mx-2">Contact</a>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

export default AboutUs;
