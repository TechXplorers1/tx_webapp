import React from 'react';
import img1 from '../../assets/WebDev.png';
import '../../styles/Services/WebAppDev.css'; // Reuse the same CSS as MobileAppDev
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';

const WebAppDev = () => {
  const navigate = useNavigate();

  const cardsData = [
    {
      title: 'Our Web Application Development Services',
      description: (
        <p>
          We offer end-to-end web application development solutions, ensuring your web platform is responsive, secure, and aligned with your business objectives.
        </p>
      ),
    },
    {
      title: 'Custom Web App Development',
      description: (
        <ul className="flip-card-list">
          <li>We create web applications that align with your business needs, industry standards, and customer expectations.</li>
          <li>Modern Tech Stack – We utilize React.js, Angular, Vue.js, Node.js, Python, Laravel, and PHP for scalable and efficient development.</li>
          <li>Full-Stack Development – From front-end design to back-end architecture, we deliver complete web solutions.</li>
          <li>Fast & Responsive – Optimized performance for quick loading times.</li>
        </ul>
      ),
    },
    {
      title: 'Web Application Development Process',
      description: (
        <ul className="flip-card-list">
          <li>Requirement Analysis & Planning – Understanding your business goals and project requirements.</li>
          <li>UI/UX Design & Prototyping – Crafting intuitive and engaging interfaces for a seamless user experience.</li>
          <li>Development & Testing – Coding, integration, and rigorous testing to ensure flawless functionality.</li>
          <li>Deployment & Launch – Ensuring a smooth launch with cloud hosting, domain setup, and database configurations.</li>
          <li>Ongoing Maintenance & Upgrades – Continuous monitoring, bug fixes, security updates, and feature enhancements.</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers Pvt Ltd',
      description: (
        <ul className="flip-card-list">
          <li>Expert Developers: Talented professionals skilled in full-stack web development.</li>
          <li>User-Centric Design: Focus on seamless user experience and beautiful, functional designs.</li>
          <li>Quality Assurance: Rigorous testing to ensure flawless app performance.</li>
          <li>Confidentiality: Full protection of your business idea with NDAs.</li>
        </ul>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <ul className="flip-card-list">
          <li>E-Commerce & Retail</li>
          <li>Healthcare & Pharmaceuticals</li>
          <li>Finance & Banking</li>
          <li>Real Estate & Construction</li>
          <li>Education & Training</li>
          <li>Technology & SaaS</li>
        </ul>
      ),
    }
  ];

  return (
    <div className="web-app-dev-container">
      <CustomNavbar />

      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Web Application Development" className="header-image" />
          <div className="overlay-text">Web App Development</div>
        </div>
      </header>

      {/* Flip Cards Section */}
      <section className="cards-section">
        <h2 className="section-title">Explore Our Web Services</h2>
        <div className="cards-wrapper">
          {cardsData.map((card, index) => (
            <div key={index} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{card.title}</h3>
                </div>
                <div className="flip-card-back">
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button className="contact-button btn-lg btn-primary">Apply Now</button>
                  </div>
      </section>
    </div>
  );
};

export default WebAppDev;