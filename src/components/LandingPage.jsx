import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Carousel from 'react-bootstrap/Carousel';

import CustomNavbar from './Navbar'; // Make sure this path is correct

// Import your images
import SMOImg from '../assets/SMO.png';
import webDevImg from '../assets/WebDevelopment.png';
import techSupportImg from '../assets/TechSupport.png';

// Create a custom component for highlighted countries using Polygon
const HighlightedCountries = () => {
  const countries = [
    { name: 'India', coordinates: [[20.5937, 78.9629], [8.4, 68.1], [35.6, 97.4], [6.8, 93.3]] },
    { name: 'USA', coordinates: [[49.3845, -124.8489], [24.3963, -124.8489], [49.3845, -66.9346], [24.3963, -66.9346]] },
    { name: 'UK', coordinates: [[59.3602, -8.6236], [49.8629, -8.6236], [59.3602, 1.7629], [49.8629, 1.7629]] },
    { name: 'Nigeria', coordinates: [[13.892, 2.6769], [3.9339, 2.6769], [13.892, 14.6781], [3.9339, 14.6781]] },
    { name: 'Canada', coordinates: [[83.1106, -141.0], [41.6751, -141.0], [83.1106, -52.6363], [41.6751, -52.6363]] },
    { name: 'Australia', coordinates: [[-10.0628, 112.9214], [-43.6346, 112.9214], [-10.0628, 153.6387], [-43.6346, 153.6387]] }
  ];

  return (
    <>
      {countries.map((country, index) => (
        <Polygon
          key={index}
          positions={country.coordinates}
          pathOptions={{
            color: '#ff7800',
            fillColor: '#ff7800',
            fillOpacity: 0.1,
            weight: 1
          }}
        />
      ))}
    </>
  );
};

const LandingPage = () => {
  const offices = [
    { name: 'Head Office - London', position: [51.505, -0.09] },
    { name: 'India Branch - New Delhi', position: [28.6139, 77.209] },
    { name: 'USA Branch - New York', position: [40.7128, -74.006] },
    { name: 'Nigeria Branch - Lagos', position: [6.5244, 3.3792] },
    { name: 'Canada Branch - Toronto', position: [43.6532, -79.3832] },
    { name: 'Australia Branch - Sydney', position: [-33.8688, 151.2093] }
  ];

  return (
    <div className="landing-page">
      {/* Reusable Navbar */}
      <CustomNavbar />

      {/* Hero Carousel */}
      <Container fluid className="carousel-container my-5">
        <Carousel indicators={false} className="carousel-shadow">
          {[1, 2, 3, 4, 5].map((item) => (
            <Carousel.Item key={item}>
              <img
                className="d-block w-100 carousel-img"
                src={`https://picsum.photos/1600/400?random= ${item}`}
                alt={`Slide ${item}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Services Section */}
      <section className="services-section" id="services">
        <Container className="my-5">
          <h2 className="text-center mb-4">OUR SERVICES</h2>
          <Row className="justify-content-center">
            <Col md={4} xs={12} className="service-card mb-4">
              <img src={SMOImg} alt="SMO Service" className="service-image w-100 h-100 object-fit-cover" />
              <h3 className="service-title text-center">SMO</h3>
            </Col>
            <Col md={4} xs={12} className="service-card mb-4">
              <img src={webDevImg} alt="Web App Development" className="service-image w-100 h-100 object-fit-cover" />
              <h3 className="service-title text-center">WEB APP DEVELOPMENT</h3>
            </Col>
            <Col md={4} xs={12} className="service-card mb-4">
              <img src={techSupportImg} alt="Tech Support" className="service-image w-100 h-100 object-fit-cover" />
              <h3 className="service-title text-center">TECH SUPPORT</h3>
            </Col>
          </Row>
        </Container>
      </section>

      {/* World Services Section */}
      <section className="world-services" id="world">
        <Container className="my-5">
          <h2 className="text-center mb-4">OUR SERVICES IN THE WORLD</h2>
          <Row>
            <Col md={8} className="map-container">
              <MapContainer 
                center={[20.0, 0.0]} 
                zoom={2} 
                scrollWheelZoom={false}
                style={{ height: '500px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/ ">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HighlightedCountries />
                {offices.map((office, index) => (
                  <Marker key={index} position={office.position}>
                    <Popup>{office.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Col>
            <Col md={4} className="countries-list">
              <h3>We operate in:</h3>
              <ul>
                <li>United Kingdom</li>
                <li>United States</li>
                <li>India</li>
                <li>Nigeria</li>
                <li>Canada</li>
                <li>Australia</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;