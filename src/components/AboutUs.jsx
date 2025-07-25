// src/components/AboutUs.jsx
import React from 'react';
import { Navbar, Nav, Container, Carousel, Card, Button, Form } from 'react-bootstrap';
import '../styles/AboutUs.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';

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
  const navigate = useNavigate();

  return (
    <div className="about-us-page">
      <CustomNavbar />

      {/* About Us Text Section */}
      <Container className="my-5">
        <h1 className="display-5 fw-bold mb-4">ABOUT US</h1>
        <h2 className="fs-4 fw-semibold mb-4">COMPANY VISION AND MISSION :</h2>
        <p className="text mx-auto">
          TechXplorers Is A Technology-Driven And Innovation-Focused Consulting Firm Committed To
          Delivering Top-Tier Solutions In IT Services, Staffing, Software Engineering, And
          Enterprise Application Development. Our Mission Is To Explore, Innovate, And Implement
          Cutting-Edge Technologies That Empower Our Clients To Streamline Operations, Accelerate
          Growth, And Stay Ahead In An Ever-Evolving Digital Landscape.

          At TechXplorers, We Bring Together A Passionate Team Of Experts, Modern Methodologies,
          And Industry Best Practices To Address The Unique Challenges Of Every Project. By
          Aligning The Right Talent With The Right Technology, We Ensure Flawless Execution And
          Impactful Outcomes. Our Client-First Approach And Dedication To Excellence Help
          Businesses Achieve Their Goals With Clarity, Confidence, And A Future-Ready Mindset.

          With a strong foundation in innovation and a relentless pursuit of excellence,
          TechXplorers is not just a service provider — we are a strategic partner in your digital
          transformation journey. Whether it's crafting scalable enterprise solutions or delivering
          agile staffing models, our focus remains on driving measurable results and building
          long-term value for our clients.
        </p>
      </Container>

      {/* Industries Carousel */}
<Container className="my-5">
  <h2 className="mb-4 text-center">INDUSTRIES WE SERVE</h2>
  <Carousel indicators={true} interval={3000} className="carousel-shadow">
    {industries.map((industry) => (
      <Carousel.Item key={industry.id} className="carousel-item-custom position-relative">
        {/* Text Overlay */}
        <div className="carousel-overlay-content position-absolute top-50 start-50 translate-middle text-center text-white">
          <h3>{industry.text}</h3>
        </div>
        
        {/* Carousel Image */}
        <img
          className="d-block w-100 carousel-img"
          src={industry.image}
          alt={industry.text}
        />

        {/* Dark Mask */}
        <div className="carousel-mask" />
      </Carousel.Item>
    ))}
  </Carousel>
</Container>

      {/* Scrolling Video Section */}
      <Container className="my-5 no-padding">
        <h2 className="mb-4 text-center">OUR VIDEOS :</h2>
        <div className="video-marquee-wrapper">
          <div className="video-marquee-track">
            {[...videoUrls, ...videoUrls].map((url, index) => (
              <div className="video-item" key={index}>
                <Card className="shadow-sm video-card">
                  <iframe
                    title={`Video ${index + 1}`}
                    width="250"
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
      <footer className="py-5">
        <Container>
          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-2 mb-md-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div>
              <a href="#" style={{ color: 'black' }} className="me-2 text-decoration-none">Privacy & Legal</a>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <a href="/contactus" style={{ color: 'black' }} className="text-decoration-none">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default AboutUs;
