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
      description: "Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.",
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
      description: "Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.",
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
      description: "Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z"></path>
          <path d="M12 8l4 4-4 4V8z"></path>
          <path d="M12 8l-4 4 4 4-4-4z"></path>
        </svg>
      ),
      path: "/services/digital-marketing"
    },
    {
      id: 4,
      title: "IT Talent Supply",
      description: "Connect with top-tier IT professionals and build exceptional teams to drive your technology initiatives forward.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      path: "/services/it-talent-supply"
    },
    {
      id: 5,
      title: "Job Support & IT Consulting",
      description: "Expert consulting and job support services to help you navigate complex IT challenges and career growth.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      path: "/services/job-support"
    },
    {
      id: 6,
      title: "Cyber Security",
      description: "Comprehensive security solutions to protect your digital assets and ensure data integrity across all platforms.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
        <Link to="/" className="view-all-services-btn">
          View All Services
        </Link>
      </div>
    </div>
  );

};

export default ServicesDropdown;