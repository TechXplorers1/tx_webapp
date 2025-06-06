import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomNavbar from './Navbar';
import '../styles/LandingPage.css';

// Import images
import Image1 from '../assets/MobileDev.png';
import Image2 from '../assets/WebDev.png';
import Image3 from '../assets/DigiMark.png';
import Image4 from '../assets/JobApply.png';
import Image5 from '../assets/ItTalentSupply.png';

// Service images
import WebAnalyticsImg from '../assets/WebAnalytics&Reporting.png';
import ProjectPlanningImg from '../assets/project_planning.png';
import techSupportImg from '../assets/tech_support.png';

// Scroll animation hook
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  const offices = [
    { name: 'USA', position: [40.7128, -74.006] },
    { name: 'Canada', position: [43.6532, -79.3832] },
    { name: 'UK', position: [51.505, -0.09] },
    { name: 'Nigeria', position: [6.5244, 3.3792] },
    { name: 'Australia', position: [-33.8688, 151.2093] },
    { name: 'India', position: [28.6139, 77.209] },
  ];

  const carouselItems = [
    { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile Application Development", path: "/services/mobile-app-development" },
    { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development", path: "/services/web-app-development" },
    { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing", path: "/services/digital-marketing" },
    { id: 4, image: Image4, alt: "TechXplorers Service 4", text: "Job Support", path: "/services/job-support" },
    { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply", path: "/services/it-talent-supply" }
  ];

  // UseInView with triggerOnce: false for re-animation on re-entry
  const [carouselRef, carouselInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [worldRef, worldInView] = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <div className="landing-page">
      <CustomNavbar />

      {/* Hero Carousel */}
      <div ref={carouselRef} className={`animated-section ${carouselInView ? 'zoom-in-content' : ''}`}>
        <Container fluid className="carousel-container my-5 px-0">
          <Carousel indicators={true} interval={3000} className="carousel-shadow">
            {carouselItems.map((item) => (
              <Carousel.Item key={item.id} className="carousel-item-custom position-relative">
                <div className="carousel-overlay-content position-absolute top-50 start-50 translate-middle text-center text-white">
                  <h3>{item.text}</h3>
                  <button className="btn btn-primary mt-3">Book a Service</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Link to={item.path} className="btn btn-primary mt-3">Learn More</Link>
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
        className={`services-section ${servicesInView ? 'fade-up-section' : ''}`}
        id="services"
      >
        <Container fluid className="px-0">
          <Row className="gx-3">
            <Col md={4} className="service-card">
              <div className="service-overlay-container position-relative">
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
              <div className="service-overlay-container position-relative">
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
              <div className="service-overlay-container position-relative">
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
    </div>
  );
};

export default LandingPage;