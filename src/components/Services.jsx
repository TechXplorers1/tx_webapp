// --- ServicesDropdown.jsx ---
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ServicesDropdown = () => {
  // Define the services data
  const services = [
    {
      id: 1,
      title: "Mobile Application Development",
      description: "Create powerful, mobile applications for iOS and Android.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <path d="M12 18h.01"></path>
        </svg>
      ),
      path: "/services/mobile-app-development"
    },
    {
      id: 2,
      title: "Web Application Development",
      description: "Build responsive, scalable web applications.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      path: "/services/web-app-development"
    },
    {
      id: 3,
      title: "Digital Marketing",
      description: "Boost your online presence and engagement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18 16v-6"></path>
          <path d="M12 16v-2"></path>
          <path d="M6 16v-4"></path>
        </svg>
      ),
      path: "/services/digital-marketing"
    },
    {
      id: 4,
      title: "IT Talent Supply",
      description: "Connect with top-tier IT professionals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      path: "/services/it-talent-supply"
    },
    {
      id: 5,
      title: "Job Support & IT Consulting",
      description: "Expert consulting and career support.",
      icon: (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6l4 4V7a2 2 0 0 0-2-2z"></path>
      <path d="M14 4l1.5 1.5m-1.5-1.5L12.5 5.5"></path>
    </svg>
      ),
      path: "/services/job-support"
    },
    {
      id: 6,
      title: "Cyber Security",
      description: "Protect your digital assets and data.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-2-8 2v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      path: "/services/cyber-security"
    }
  ];

  return (
    <div className="services-dropdown-menu">
      <div className="services-dropdown-header">
        Our Services
      </div>
      <div className="services-dropdown-subtitle">
        Comprehensive tech solutions for your business
      </div>
      <div className="services-dropdown-body">
        {services.map((service) => (
          <Link key={service.id} to={service.path} className="services-dropdown-item">
            <div className="services-dropdown-item-icon">
              {service.icon}
            </div>
            <div className="services-dropdown-item-content">
              <div className="services-dropdown-item-title">
                {service.title}
              </div>
              <div className="services-dropdown-item-description">
                {service.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="services-dropdown-footer">
        <Link to="/services" className="view-all-services-btn">
          View All Services
        </Link>
      </div>
    </div>
  );
};

export default ServicesDropdown;