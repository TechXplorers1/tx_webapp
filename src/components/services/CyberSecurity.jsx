import React, { useState } from 'react';
import img1 from '../../assets/CyberSecurity.jpeg';
import '../../styles/Services/CyberSecurity.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../components/AuthContext';
import Footer from '../../components/Footer';  // Step 1: Import useAuth

const CyberSecurity = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Step 2: Get auth status
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    service: '',
    userType: '',
  });

  // Step 3: Update the handler to check for login status
  const handleApplyNow = () => {
    if (isLoggedIn) {
      navigate('/services/servicesForm', { state: { service: 'Cyber Security' } });
    } else {
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service });
  };

  const handleUserTypeSelect = (userType) => {
    setFormData({ ...formData, userType });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // A custom modal or toast is better than alert()
    setShowModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      service: '',
      userType: '',
    });
  };

  const cardsData = [
    {
      title: 'Our Cyber Security Services',
      description: (
        <p>TechXplorers provides comprehensive cyber security solutions designed to protect your digital assets. Our services include Vulnerability Assessment & Penetration Testing (VAPT) to identify and fix security weaknesses, Managed Detection and Response (MDR) for real-time threat monitoring, and Endpoint Security to safeguard devices across your network. We also offer Security Information and Event Management (SIEM), Identity and Access Management (IAM), and tailored Cyber Security Consulting to ensure your organization stays ahead of evolving threats.</p>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <ul className="flip-card-list">
         TechXplorers delivers cyber security services to a broad spectrum of industries, including Banking, Financial Services & Insurance (BFSI), Healthcare & Pharmaceuticals, Government & Defense, E-Commerce & Retail, Energy & Utilities, Education, Technology & SaaS, and Manufacturing.

        </ul>
      ),
    },
    {
      title: 'Our Cyber Security Process',
      description: (
        <p>Our approach begins with a thorough <b>Security Assessment</b> to understand your current posture. This is followed by <b>Risk Analysis & Planning</b> to prioritize threats and define mitigation strategies. Next, we move to <b>Implementation & Hardening</b> of systems and policies, ensuring robust protection. Continuous <b>Monitoring, Detection & Response</b> keeps your environment secure, supported by regular <b>Audits & Compliance Reporting</b> to meet industry standards.

</p>
      ),
    },
    {
      title: 'Why Choose TechXplorers for Cyber Security?',
      description: (
        <ul className="flip-card-list">
         TechXplorers brings deep <strong>technical expertise</strong> and certified professionals to every engagement. We deliver <strong>customized security frameworks</strong> aligned with your business needs, backed by a <strong>proactive threat intelligence</strong> system. Our <strong>24/7 monitoring and incident response</strong> ensures rapid action when needed, and we maintain <strong>full compliance</strong> with global standards like ISO 27001, GDPR, and HIPAA, all with <strong>transparent communication</strong> throughout the partnership.

        </ul>
      ),
    }
  ];

  return (
    <div className="cyber-security-container">
      <CustomNavbar />
      

         <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Cyber Security" className="header-image" />
          {/* This new container will hold both the title and the buttons */}
          <div className="glassy-mask"></div>
          <div className="overlay-content">
            <div className="overlay-text">Cyber Security</div>
            
            {/* Add the new button container here */}
            <div className="header-button-container">
              <button onClick={() => navigate('/contactus')} className="header-action-btn btn-contact">
                Contact Us
              </button>
              <button onClick={handleApplyNow} className="header-action-btn btn-register">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Flip Cards */}
      <section className="cards-section">
        <h2 className="section-title">Explore Our Services</h2>
        <div className="cards-wrapper">
          {cardsData.map((card, index) => (
            <div key={index} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{card.title}</h3>
                </div>
                <div className="flip-card-back">{card.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Buttons */}
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="btn-lg btn-primary contact-button">
            Contact Us
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button onClick={handleApplyNow} className="btn-lg btn-primary contact-button">
            Register Now
          </button>
        </div>
      </section>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cyber Security</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Form.Label className="fw-bold">First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">Mobile <span className="text-danger">*</span></Form.Label>
              <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label><strong>What service do you want?</strong></label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5', 'Service 6'].map(service => (
                  <Button
                    key={service}
                    variant={formData.service === service ? 'primary' : 'outline-primary'}
                    onClick={() => handleServiceSelect(service)}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label><strong>Who are you?</strong></label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {['Individual', 'Business Owner', 'Startup Founder', 'Agency', 'Student', 'Other'].map(type => (
                  <Button
                    key={type}
                    variant={formData.userType === type ? 'primary' : 'outline-primary'}
                    onClick={() => handleUserTypeSelect(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-100 btn btn-primary">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
       <Footer />
    </div>
  );
};

export default CyberSecurity;
