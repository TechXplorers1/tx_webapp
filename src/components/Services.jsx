import React from 'react';
import { Link } from 'react-router-dom';
import mobileIcon from '../assets/mobileAppService.png';
import webIcon from '../assets/webAppService.png';
import marketingIcon from '../assets/digitalMarketingService.png';
import talentIcon from '../assets/ItTalentSupplyService.png';
import consultingIcon from '../assets/JobSupportingService.png';
import CyberIcon from '../assets/CyberSecurityService.png';
import '../styles/Services.css';

const services = [
  { title: "Mobile Application Development",icon: mobileIcon, path: "/services/mobile-app-development" },
  { title: "Web Application Development",icon: webIcon, path: "/services/web-app-development" },
  { title: "Digital Marketing",icon: marketingIcon, path: "/services/digital-marketing" },
  { title: "IT Talent Supply",icon: talentIcon, path: "/services/it-talent-supply" },
  { title: "Job Support & IT Consulting", icon: consultingIcon, path: "/services/job-support" },
  { title: "Cyber Security", icon: CyberIcon, path: "/services/cyber-security" },
];

const ServicesDropdown = () => {
  return (
    <div className="services-popup-content">
      <div className="services-left">
       <div className="services-dropdown">
  <Link to="/services/mobile-app-development" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${mobileIcon})` }}>
      <span>Mobile Application Development</span>
    </div>
  </Link>

  <Link to="/services/web-app-development" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${webIcon})` }}>
      <span>Web Application Development</span>
    </div>
  </Link>

  <Link to="/services/digital-marketing" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${marketingIcon})` }}>
      <span>Digital Marketing</span>
    </div>
  </Link>

  <Link to="/services/it-talent-supply" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${talentIcon})` }}>
      <span>IT Talent Supply</span>
    </div>
  </Link>

  <Link to="/services/job-support" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${consultingIcon})` }}>
      <span>Job Support & IT Consulting</span>
    </div>
  </Link>
  <Link to="/services/cyber-security" className="service-card-link">
    <div className="service-card1 custom-bg" style={{ backgroundImage: `url(${CyberIcon})` }}>
      <span>Cyber Security</span>
    </div>
  </Link>
</div>

      </div>

      <div className="services-right">
        <h3>OTHER NEEDS</h3>
        <p>CONNECT WITH TECHXPLORERS</p>
        <form className="services-form" onClick={(e) => e.stopPropagation()}>
          <input type="text" placeholder="Message" className="services-input" onClick={(e) => e.stopPropagation()} />
          <input type="email" placeholder="Mail ID" className="services-input" onClick={(e) => e.stopPropagation()} />
          <button type="submit" className="services-submit-btn" onClick={(e) => e.stopPropagation()}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ServicesDropdown;
