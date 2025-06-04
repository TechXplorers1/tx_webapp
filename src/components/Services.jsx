import React from 'react';
import { Link } from 'react-router-dom';
import mobileIcon from '../assets/mobile_app_dev.png';
import webIcon from '../assets/web_app_dev.png';
import marketingIcon from '../assets/digi_mark.png';
import talentIcon from '../assets/it_talent_supply.png';
import consultingIcon from '../assets/job_support.png';
import '../styles/Services.css';

const services = [
  { title: "Mobile Application Development",icon: mobileIcon, path: "/services/mobile-app-development" },
  { title: "Web Application Development",icon: webIcon, path: "/services/web-app-development" },
  { title: "Digital Marketing",icon: marketingIcon, path: "/services/digital-marketing" },
  { title: "IT Talent Supply",icon: talentIcon, path: "/services/it-talent-supply" },
  { title: "Job Support & IT Consulting", icon: consultingIcon, path: "/services/job-support" },
];

const ServicesDropdown = () => {
  return (
    <div className="services-popup-content">
      <div className="services-left">
        <h3>DIGITAL MARKETING</h3>
        <div className="services-dropdown">
          {services.map((service, index) => (
            <Link to={service.path} key={index} className="service-card-link">
              <div className="service-card1">
                <img src={service.icon} />
                <span>{service.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="services-right">
        <h3>OTHER NEEDS</h3>
        <p>CONNECT WITH TECHXPLORERS</p>
        <form className="services-form">
          <input type="text" placeholder="Subject" className="services-input" />
          <input type="email" placeholder="Mail ID" className="services-input" />
          <button type="submit" className="services-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ServicesDropdown;
