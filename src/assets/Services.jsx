import React from 'react';
import { Link } from 'react-router-dom';
import mobileIcon from '../assets/mobile_app_dev.jpeg';
import webIcon from '../assets/web_app_dev.jpeg';
import marketingIcon from '../assets/digi_mark.jpeg';
import talentIcon from '../assets/it_talent_supply.jpeg';
import consultingIcon from '../assets/job_support.jpeg';
import '../styles/Services.css';

const services = [
  { 
    title: "Mobile Application Development", 
    icon: mobileIcon,
    path: "/services/mobile-app-development" 
  },
  { 
    title: "Web Application Development", 
    icon: webIcon,
    path: "/services/web-app-development" 
  },
  { 
    title: "Digital Marketing", 
    icon: marketingIcon,
    path: "/services/digital-marketing" 
  },
  { 
    title: "IT Talent Supply", 
    icon: talentIcon,
    path: "/services/it-talent-supply" 
  },
  { 
    title: "Job Support & IT Consulting", 
    icon: consultingIcon,
    path: "/services/job-support" 
  },
];

const ServicesDropdown = () => {
  return (
    <div className="services-dropdown">
      {services.map((service, index) => (
        <Link to={service.path} key={index} className="service-card-link">
          <div className="service-card">
            <img src={service.icon} alt={service.title} />
            <span>{service.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ServicesDropdown;