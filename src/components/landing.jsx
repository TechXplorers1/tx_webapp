import React, { useState, useEffect } from 'react';
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

  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const offices = [
    { name: 'USA', position: [40.7128, -74.006] },
    { name: 'Canada', position: [43.6532, -79.3832] },
    { name: 'UK', position: [51.505, -0.09] },
    { name: 'Nigeria', position: [6.5244, 3.3792] },
    { name: 'Australia', position: [-33.8688, 151.2093] },
    { name: 'India', position: [14.666386222572966, 77.59006709376247] },
  ];

  const carouselItems = [
    { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile App Development", path: "/services/mobile-app-development", service: "Mobile Development",rating: "4.9⭐", projects: "300+", timeline: "6-12 weeks", description: "Create powerful, user-friendly applications for iOS and Android platforms with cutting-edge technology."  },
    { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development", path: "/services/web-app-development", service: "Web Development" , rating: "4.8⭐", projects: "450+", timeline: "4-10 weeks", description: "Build responsive, scalable web applications with modern frameworks and best practices for optimal performance." },
    { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing", path: "/services/digital-marketing", service: "Digital Marketing", rating: "4.7⭐", projects: "600+", timeline: "2-6 weeks", description: "Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement." },
    { id: 4, image: Image4, alt: "Job Support Profile", text: "Job Support", path: "/services/job-support", isJobSupport: true , rating: "4.8⭐", projects: "800+", timeline: "Ongoing", description: "Expert consulting and job support services to help you navigate complex IT challenges and career growth." },
    { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply", path: "/services/it-talent-supply", service: "IT Talent Supply", rating: "4.9⭐", projects: "200+", timeline: "1-3 weeks", description: "Connect with top-tier IT professionals and build exceptional teams to drive your technology initiatives forward." },
    { id: 6, image: Image6, alt: "TechXplorers Service 6", text: "Cyber Security", path: "/services/cyber-security", service: "Cyber Security", rating: "4.9⭐", projects: "150+", timeline: "3-8 weeks", description: "Comprehensive security solutions to protect your digital assets and ensure data integrity across all platforms." }
  ];

  const [carouselRef, carouselInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [worldRef, worldInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { isDarkMode } = useTheme();


  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToPrev = () => {
    setActiveSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNext = () => {
    setActiveSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const currentItem = carouselItems[activeSlide];


  return (
    
    <div className={`landing-page mt-4 ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-slideInFromLeft {
          animation: slideInFromLeft 1s ease-out;
        }
        .carousel-item-image {
          transition: opacity 0.5s ease-in-out;
        }
      `}</style>
      <CustomNavbar />
      {/* Hero Carousel */}
      <div ref={carouselRef} className={`animated-section ${carouselInView ? 'zoom-in-content' : ''}`}>
        <Container fluid className="carousel-container my-5 px-0">
          <Carousel indicators={true} interval={3000} className="carousel-shadow">
         {carouselItems.map((item) => (
              <Carousel.Item key={item.id}>
                <div className="flex flex-col lg:flex-row justify-center items-center py-5 lg:h-[60vh] h-auto overflow-hidden">
                  {/* Text Content */}
                  <div className="text-center lg:text-left p-8 w-full lg:w-1/2">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text transition-all duration-700">
                        {item.text}
                      </span>
                    </h1>
                    {/* Placeholder for description */}
                    <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 mb-6">
                      Create powerful, user-friendly applications for iOS and Android platforms with cutting-edge technology.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                      {/* Placeholder for sub-links/services */}
                      <Link to="#" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                        iOS & Android Apps
                      </Link>
                      <Link to="#" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                        Cross-Platform Solutions
                      </Link>
                      <Link to="#" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                        UI/UX Design
                      </Link>
                    </div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <button
                        onClick={() => handleBookServiceClick(item)}
                        className="flex items-center space-x-2 px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg font-semibold"
                      >
                        <span>Book a Service</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <Link
                        to={item.path}
                        className="flex items-center space-x-2 px-6 py-3 rounded-full text-blue-600 border border-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800 transition-transform transform hover:scale-105 font-semibold"
                      >
                        <span>Learn More</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                    {/* Animated Stats Section */}
                    <div className="flex justify-center lg:justify-start items-center gap-8 mt-12">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">{item.rating}</span>
                        <span className="text-sm text-gray-500">Client Rating</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">{item.projects}</span>
                        <span className="text-sm text-gray-500">Projects Done</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">{item.timeline}</span>
                        <span className="text-sm text-gray-500">Avg. Timeline</span>
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full h-full relative overflow-hidden rounded-3xl shadow-xl">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>

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
       {/* Contact Section */}
      <section className="contact-section py-5 bg-light" id="contact">
        <Container>
          <div className="text-center mb-5">
            <span className="badge bg-primary text-white mb-3">Get In Touch</span>
            <h2>Ready to Start Your Project?</h2>
            <p className="lead text-muted">Let's discuss how we can help you achieve your goals. Our team is ready to provide the support and expertise you need.</p>
          </div>
          <Row className="g-5">
            <Col md={6} lg={4}>
              <div className="contact-card card shadow-sm border-0 h-100 p-4">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <h5 className="card-title">Email Us</h5>
                  <p className="card-text">
                    <a href="mailto:contact@techxplorers.com" className="d-block text-decoration-none text-muted">contact@techxplorers.com</a>
                    <a href="mailto:support@techxplorers.com" className="d-block text-decoration-none text-muted">support@techxplorers.com</a>
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="contact-card card shadow-sm border-0 h-100 p-4">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <h5 className="card-title">Call Us</h5>
                  <p className="card-text">
                    <a href="tel:+1(555)123-4567" className="d-block text-decoration-none text-muted">+1 (555) 123-4567</a>
                    <a href="tel:+1(555)987-6543" className="d-block text-decoration-none text-muted">+1 (555) 987-6543</a>
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="contact-card card shadow-sm border-0 h-100 p-4">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <h5 className="card-title">Visit Us</h5>
                  <p className="card-text text-muted">
                    123 Tech Street<br />
                    Innovation District<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </Col>
            <Col md={12} lg={12}>
              <div className="card shadow-sm border-0 p-4">
                <div className="card-body">
                  <h5 className="card-title text-center">Or reach out directly:</h5>
                  <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                    <button className="btn btn-outline-primary d-flex align-items-center"><i className="bi bi-envelope-fill me-2"></i> Email Us</button>
                    <button className="btn btn-outline-secondary d-flex align-items-center"><i className="bi bi-calendar-check me-2"></i> Schedule Call</button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className={`py-5 ${isDarkMode ? 'bg-dark text-white' : 'bg-secondary text-white'}`}>
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <h5 className="text-white">TechXplorers</h5>
              <p className="text-muted small">Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.</p>
              <div className="d-flex social-icons mt-3">
                <a href="#" className="text-muted me-3"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-muted me-3"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="text-muted me-3"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-envelope"></i></a>
              </div>
            </Col>
            <Col md={2}>
              <h5 className="text-white">Services</h5>
              <ul className="list-unstyled text-muted small">
                <li><a href="#" className="text-decoration-none text-muted">Web Analytics</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Project Planning</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Tech Support</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Job Services</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Consulting</a></li>
              </ul>
            </Col>
            <Col md={2}>
              <h5 className="text-white">Company</h5>
              <ul className="list-unstyled text-muted small">
                <li><a href="#" className="text-decoration-none text-muted">About Us</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Careers</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Blog</a></li>
                <li><a href="#" className="text-decoration-none text-muted">News</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Partners</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="text-white">Contact</h5>
              <p className="text-muted small">123 Tech Street, Innovation District<br />San Francisco, CA 94105</p>
              <p className="text-muted small">Email: contact@techxplorers.com<br />Phone: +1 (555) 123-4567</p>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p className="text-muted small mb-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            <div className="text-muted small">
              <a href="#" className="text-decoration-none text-muted me-3">Privacy Policy</a>
              <a href="#" className="text-decoration-none text-muted me-3">Terms of Service</a>
              <a href="#" className="text-decoration-none text-muted">Cookie Policy</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
