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
      {/* Services Section */}
            <section
              ref={servicesRef}
              className={`services-section ${servicesInView ? 'slide-up-section' : ''} text-center py-5`}
              id="services"
            >
              <Container>
                <div className="text-center mb-5">
                  <span className="badge bg-primary text-white mb-3">Our Services</span>
                  <h2>Comprehensive Tech Solutions</h2>
                  <p className="lead text-muted">From analytics to support, we provide end-to-end technology services that help your business thrive in the digital landscape.</p>
                </div>
                <Row className="g-4">
                  {/* Service Card 1 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image1} className="card-img-top" alt="Mobile Application Development" />
                      <div className="card-body">
                        <h5 className="card-title">Mobile Application Development</h5>
                        <p className="card-text text-muted">Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> iOS & Android Apps</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Cross-Platform Solutions</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> UI/UX Design</li>
                        </ul>
                        <Link to="/services/mobile-app-development" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
                      </div>
                    </div>
                  </Col>
                  {/* Service Card 2 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image2} className="card-img-top" alt="Web Application Development" />
                      <div className="card-body">
                        <h5 className="card-title">Web Application Development</h5>
                        <p className="card-text text-muted">Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Full-Stack Development</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Modern Frameworks</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Cloud Integration</li>
                        </ul>
                        <Link to="/services/web-app-development" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
                      </div>
                    </div>
                  </Col>
                  {/* Service Card 3 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image3} className="card-img-top" alt="Digital Marketing" />
                      <div className="card-body">
                        <h5 className="card-title">Digital Marketing</h5>
                        <p className="card-text text-muted">Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> SEO Optimization</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Social Media Marketing</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Analytics & Reporting</li>
                        </ul>
                        <Link to="/services/digital-marketing" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
                      </div>
                    </div>
                  </Col>
                  {/* Service Card 4 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image5} className="card-img-top" alt="IT Talent Supply" />
                      <div className="card-body">
                        <h5 className="card-title">IT Talent Supply</h5>
                        <p className="card-text text-muted">Connect with top-tier IT professionals and build exceptional teams to drive your technology initiatives forward.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Skilled Professionals</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Flexible Staffing</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Team Augmentation</li>
                        </ul>
                        <Link to="/services/it-talent-supply" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
                      </div>
                    </div>
                  </Col>
                  {/* Service Card 5 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image4} className="card-img-top" alt="Job Support & IT Consulting" />
                      <div className="card-body">
                        <h5 className="card-title">Job Support & IT Consulting</h5>
                        <p className="card-text text-muted">Expert consulting and job support services to help you navigate complex IT challenges and career growth.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Technical Guidance</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Career Support</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Strategic Consulting</li>
                        </ul>
                        <Link to="/services/job-support" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
                      </div>
                    </div>
                  </Col>
                  {/* Service Card 6 */}
                  <Col md={4}>
                    <div className="card h-100 shadow-sm border-0 animated-card">
                      <img src={Image6} className="card-img-top" alt="Cyber Security" />
                      <div className="card-body">
                        <h5 className="card-title">Cyber Security</h5>
                        <p className="card-text text-muted">Comprehensive security solutions to protect your digital assets and ensure data integrity across all platforms.</p>
                        <ul className="list-unstyled text-start text-muted small mt-3">
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Threat Assessment</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Security Audits</li>
                          <li><i className="bi bi-check-circle-fill text-success me-2"></i> Compliance Management</li>
                        </ul>
                        <Link to="/services/cyber-security" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
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
     {/* Footer */}
        <footer className={`py-5 ${isDarkMode ? 'bg-dark text-white' : 'bg-dark text-white'}`}>
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <h5 className="text-white">TechXplorers</h5>
                <p className="text-secondary small">Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.</p>
                <div className="d-flex social-icons mt-3">
                  <a href="#" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-secondary"><i className="bi bi-envelope"></i></a>
                </div>
              </Col>
              <Col md={2}>
                <h5 className="text-white">Services</h5>
                <ul className="list-unstyled text-secondary small">
                  <li><a href="#" className="text-decoration-none text-secondary">Web Analytics</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Project Planning</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Tech Support</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Job Services</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Consulting</a></li>
                </ul>
              </Col>
              <Col md={2}>
                <h5 className="text-white">Company</h5>
                <ul className="list-unstyled text-secondary small">
                  <li><a href="#" className="text-decoration-none text-secondary">About Us</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Careers</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Blog</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">News</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Partners</a></li>
                </ul>
              </Col>
              <Col md={4}>
                <h5 className="text-white">Contact</h5>
                <p className="text-secondary small">123 Tech Street, Innovation District<br />San Francisco, CA 94105</p>
                <p className="text-secondary small">Email: contact@techxplorers.com<br />Phone: +1 (555) 123-4567</p>
              </Col>
            </Row>
            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="text-secondary small mb-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
              <div className="text-secondary small">
                <a href="#" className="text-decoration-none text-secondary me-3">Privacy Policy</a>
                <a href="#" className="text-decoration-none text-secondary me-3">Terms of Service</a>
                <a href="#" className="text-decoration-none text-secondary">Cookie Policy</a>
              </div>
            </div>
          </Container>
        </footer>
    </div>
  );
};

export default LandingPage;
