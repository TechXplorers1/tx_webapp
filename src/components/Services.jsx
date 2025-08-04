import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button
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

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // NEW: Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Create the submission object
    const formData = new FormData(e.target);
    const newSubmission = {
      id: Date.now(),
      email:  formData.get('email'),
      message: formData.get('message'),
      receivedDate: new Date().toISOString().split('T')[0],
    };

    // Retrieve existing submissions and add the new one
    const existingSubmissions = JSON.parse(localStorage.getItem('service_submissions')) || [];
    const updatedSubmissions = [newSubmission, ...existingSubmissions];
    localStorage.setItem('service_submissions', JSON.stringify(updatedSubmissions));

    // Reset form and show the success modal
    setMessage('');
    setEmail('');
    setShowSuccessModal(true);
  };
  return (
     <>
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
        <form className="services-form" onSubmit={handleSubmit}>
             <input 
              type="text" 
              name="message" 
              placeholder="Message" 
              className="services-input" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              required
            />          
              <input 
              type="email" 
              name="email" 
              placeholder="Mail ID" 
              className="services-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              required
            /> 
            <button 
              type="submit" 
              className="services-submit-btn" 
              onClick={(e) => e.stopPropagation()}
            >
              Submit
            </button>
        </form>
      </div>
    </div>
     {/* NEW: Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center p-4">
            <h5 className="mt-3">Your request has been submitted successfully.</h5>
            <p className="text-muted mt-2">
                For showing interest in our products and services. Our team will be in contact with you shortly.
            </p>
            <Button variant="primary" onClick={() => setShowSuccessModal(false)} className="mt-3">
                Close
            </Button>
        </Modal.Body>
      </Modal>
      </>
  );
};

export default ServicesDropdown;
