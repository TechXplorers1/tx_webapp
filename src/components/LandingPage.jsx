import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">TECHXPLORERS</div>
        <div className="nav-links">
          <a href="#services">SERVICES</a>
          <a href="#career">CAREER</a>
          <a href="#about">ABOUT US</a>
          <a href="#contact">CONTACT</a>
          <button className="login-btn">LOGIN</button>
        </div>
      </nav>

      {/* Hero Carousel */}
      <div className="carousel">
        <div className="carousel-content">
          <h1>BEST SERVICES</h1>
          <div className="carousel-item active">
            {/* Carousel content will go here */}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        {/* <h2>OUR SERVICES</h2> */}
        <div className="services-grid">
          {/* Service Card 1 */}
          <div className="service-card">
            <div className="service-image"></div>
            <h3>JOB APPLYING SERVICE</h3>
            {/* <div className="discount-badge">20% OFF</div> */}
            <button className="service-btn">BOOK A SERVICE</button>
            <button className="know-more-btn">KNOW MORE</button>
          </div>

          {/* Service Card 2 */}
          <div className="service-card">
            <div className="service-image"></div>
            <h3>WEB APP DEVELOPMENT</h3>
            {/* <div className="discount-badge">18% OFF</div> */}
            <button className="service-btn">BOOK A SERVICE</button>
            <button className="know-more-btn">KNOW MORE</button>
          </div>

          {/* Service Card 3 */}
          <div className="service-card">
            <div className="service-image"></div>
            <h3>TECH SUPPORT</h3>
            {/* <div className="discount-badge">18% OFF</div> */}
            <button className="service-btn">BOOK A SERVICE</button>
            <button className="know-more-btn">KNOW MORE</button>
          </div>
        </div>
      </section>

      {/* World Services Section */}
      <section className="world-services">
        <h2>OUR SERVICES IN THE WORLD</h2>
        {/* Map or visualization would go here */}
      </section>
    </div>
  );
};

export default LandingPage;