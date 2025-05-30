import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomNavbar from './Navbar';

// Import your images
import Image1 from '../assets/MobileDev.png';
import Image2 from '../assets/WebDev.png';
import Image3 from '../assets/DigiMark.png';
import Image4 from '../assets/JobApply.png';
import Image5 from '../assets/ItTalentSupply.png';

// Service images
import WebAnalyticsImg from '../assets/WebAnalytics&Reporting.png';
import ProjectPlanningImg from '../assets/project_planning.png';
import techSupportImg from '../assets/tech_support.png';

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
    { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile Application Development" },
    { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development" },
    { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing" },
    { id: 4, image: Image4, alt: "TechXplorers Service 4", text: "Job Support" },
    { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply" }
  ];

  return (
    <div className="landing-page">
      <CustomNavbar />

      {/* Hero Carousel with overlay and centered text */}
      <Container fluid className="carousel-container my-5 px-0">
        <Carousel indicators={true} interval={3000} className="carousel-shadow">
          {carouselItems.map((item) => (
            <Carousel.Item key={item.id} className="carousel-item-custom">
              <div className="carousel-text-above">
                <h3>{item.text}</h3>
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

      {/* Services Section */}
    <section className="services-section" id="services">
  <Container className="my-5">
    <Row className="justify-content-center">
      <Col md={4} xs={12} className="service-card mb-4">
        <div className="service-overlay-container">
          <img src={WebAnalyticsImg} alt="WebAnalytics Service" className="service-image w-100 h-100 object-fit-cover rounded" />
          <div className="service-overlay-text">
            <h3>Web Analytics & Reporting</h3>
          </div>
        </div>
      </Col>
      <Col md={4} xs={12} className="service-card mb-4">
        <div className="service-overlay-container">
          <img src={ProjectPlanningImg} alt="Project Planning" className="service-image w-100 h-100 object-fit-cover rounded" />
          <div className="service-overlay-text">
            <h3>Project Planning</h3>
          </div>
        </div>
      </Col>
      <Col md={4} xs={12} className="service-card mb-4">
        <div className="service-overlay-container">
          <img src={techSupportImg} alt="Tech Support" className="service-image w-100 h-100 object-fit-cover rounded" />
          <div className="service-overlay-text">
            <h3>Tech Support</h3>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
</section>

 {/* World Services Section */}
      <section className="world-services" id="world">
        <Container className="my-5">
          <h2 className="text-center mb-4">Delivering Services Across the Globe</h2>
          <div className="map-operate-container">
            <Row className="no-gutters">
              <Col md={8} className="map-col">
                <MapContainer
                  center={[20.0, 0.0]}
                  zoom={2}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {offices.map((office, index) => (
                    <Marker key={index} position={office.position}>
                      <Popup>{office.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Col>
              <Col md={4} className="operate-col">
                <div className="operate-card">
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
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;