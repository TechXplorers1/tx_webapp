import React, { useState } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomNavbar from './Navbar';
import '../styles/LandingPage.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthContext'; // Import useAuth

// Import images
import Image1 from '../assets/MobileDev.png';
import Image2 from '../assets/WebDev.png';
import Image3 from '../assets/DigiMark.png';
import Image4 from '../assets/JobApply.png';
import Image5 from '../assets/ItTalentSupply.png';
import Image6 from '../assets/CyberSecurity.png';

// Service images
import WebAnalyticsImg from '../assets/WebAnalytics&Reporting.png';
import ProjectPlanningImg from '../assets/project_planning.png';
import techSupportImg from '../assets/tech_support.png';

// Scroll animation hook
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  const { isLoggedIn } = useAuth(); // Get authentication status
  const navigate = useNavigate();

  const offices = [
    { name: 'USA', position: [40.7128, -74.006] },
    { name: 'Canada', position: [43.6532, -79.3832] },
    { name: 'UK', position: [51.505, -0.09] },
    { name: 'Nigeria', position: [6.5244, 3.3792] },
    { name: 'Australia', position: [-33.8688, 151.2093] },
    { name: 'India', position: [14.666386222572966, 77.59006709376247] },
  ];

  const carouselItems = [
    { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile App Development", path: "/services/mobile-app-development", service: "Mobile Development" },
    { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development", path: "/services/web-app-development", service: "Web Development" },
    { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing", path: "/services/digital-marketing", service: "Digital Marketing" },
    { id: 4, image: Image4, alt: "Job Support Profile", text: "Job Support", path: "/services/job-support", isJobSupport: true },
    { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply", path: "/services/it-talent-supply", service: "IT Talent Supply" },
    { id: 6, image: Image6, alt: "TechXplorers Service 6", text: "Cyber Security", path: "/services/cyber-security", service: "Cyber Security" }
  ];

  const [carouselRef, carouselInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [worldRef, worldInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { isDarkMode } = useTheme();

  /**
   * Handles the click on the "Book a Service" button.
   * If the user is logged in, it navigates to the appropriate service form.
   * If not logged in, it redirects to the login page.
   * @param {object} item - The carousel item object.
   */
  const handleBookServiceClick = (item) => {
    if (isLoggedIn) {
      // User is logged in, proceed to the form
      if (item.isJobSupport) {
        navigate("/services/job-contact-form");
      } else {
        navigate('/services/servicesForm', { state: { service: item.service } });
      }
    } else {
      // User is not logged in, redirect to the login page
      // You can also pass the intended destination to redirect back after login
      navigate('/login', { state: { from: window.location.pathname } });
    }
  };

  return (
    <div className={`landing-page mt-4 ${isDarkMode ? 'dark-mode' : ''}`}>
      <CustomNavbar />
      {/* Hero Carousel */}
      <div ref={carouselRef} className={`animated-section ${carouselInView ? 'zoom-in-content' : ''}`}>
        <Container fluid className="carousel-container my-5 px-0">
          <Carousel indicators={true} interval={3000} className="carousel-shadow">
            {carouselItems.map((item) => (
              <Carousel.Item key={item.id} className="carousel-item-custom position-relative">
                <div className="carousel-overlay-content position-absolute top-50 start-50 translate-middle text-center text-white">
                  <h3>{item.text}</h3>
                  
                    <div className="header-button-container">
                    
                    <Link to={item.path} className="header-action-btn"> {/* Secondary button style */}
                      Learn More
                    </Link>
                    <div
                      onClick={() => handleBookServiceClick(item)}
                      className="header-action-btn btn-book" // Primary button style
                    >
                      Book a Service
                    </div>
                  </div>
                </div>
                <img
                  className="d-block w-100 carousel-img"
                  src={item.image}
                  alt={item.alt}
                />
                <div className="carousel-mask" />
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>

      {/* Services Section */}
      <section
        ref={servicesRef}
        className={`services-section ${servicesInView ? '' : ''}`}
        id="services"
      >
        <Container fluid className="px-0">
          <Row className="gx-3 mx-auto">
            <Col md={4} className="service-card">
              <div
                className="service-overlay-container position-relative"
                onClick={() => navigate("/services/web-app-development")}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={WebAnalyticsImg}
                  alt="WebAnalytics Service"
                  className="service-image w-100 h-100 object-fit-cover rounded-0"
                />
                <div className="service-overlay-text position-absolute top-50 start-50 translate-middle text-white text-center">
                  <h3>Web Analytics & Reporting</h3>
                </div>
              </div>
            </Col>
            <Col md={4} className="service-card">
              <div
                className="service-overlay-container position-relative"
                onClick={() => navigate("/services/digital-marketing")}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={ProjectPlanningImg}
                  alt="Project Planning"
                  className="service-image w-100 h-100 object-fit-cover rounded-0"
                />
                <div className="service-overlay-text position-absolute top-50 start-50 translate-middle text-white text-center">
                  <h3>Project Planning</h3>
                </div>
              </div>
            </Col>
            <Col md={4} className="service-card">
              <div
                className="service-overlay-container position-relative"
                onClick={() => navigate("/services/job-support")}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={techSupportImg}
                  alt="Tech Support"
                  className="service-image w-100 h-100 object-fit-cover rounded-0"
                />
                <div className="service-overlay-text position-absolute top-50 start-50 translate-middle text-white text-center">
                  <h3>Tech Support</h3>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* World Services Section */}
      <section
        ref={worldRef}
        className={`world-services ${worldInView ? 'slide-up-section' : ''}`}
        id="world"
      >
        <Container fluid className="px-0">
          <h2 className="text-center mb-4">Delivering Services Across the Globe</h2>
          <div className="map-wrapper">
            <div className="map-container-custom">
              <MapContainer
                center={[20.0, 0.0]}
                zoom={2}
                scrollWheelZoom={false}
                className="leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>  contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {offices.map((office, index) => (
                  <Marker key={index} position={office.position}>
                    <Popup>{office.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>

              <div className={`map-overlay ${isDarkMode ? 'light' : 'light'}`}></div>

              <div className="operate-overlay">
                <h3 className="operate-title">We operate in:</h3>
                <div className="country-grid">
                  <div className="country-item">United States</div>
                  <div className="country-item">Canada</div>
                  <div className="country-item">United Kingdom</div>
                  <div className="country-item">Nigeria</div>
                  <div className="country-item">Australia</div>
                  <div className="country-item">India</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <footer className="py-4">
        <Container>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <p className="mb-2 mb-md-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <div>
              <a href="#"  className="me-2 text-decoration-none">Privacy & Legal</a>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <a href="/contactus"  className="text-decoration-none">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
