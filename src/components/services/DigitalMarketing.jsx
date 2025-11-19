import React, { useState } from 'react';
import img1 from '../../assets/DigiMark.jpeg';
import '../../styles/Services/DigitalMarketing.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../components/AuthContext'; // Step 1: Import useAuth

const DigitalMarketing = () => {
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
      navigate('/services/servicesForm', { state: { service: 'Digital Marketing' } });
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
      title: 'Our Digital Marketing Services',
      description: (
        <p>TechXplorers offers a wide range of digital marketing services, including Search Engine Optimization (SEO) to improve website visibility on search engines, Social Media Marketing (SMM) to engage audiences across platforms, and Content Marketing to deliver valuable, targeted information. We also specialize in Influencer & Affiliate Marketing to amplify brand reach through trusted voices, along with Online Reputation Management (ORM) to maintain and enhance your brand’s image in the digital world.</p>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <ul className="flip-card-list">
         TechXplorers offers services across a diverse range of industries, including E-Commerce & Retail, Healthcare & Pharmaceuticals, Finance & Banking, Real Estate & Construction, Education & Training, Technology & SaaS, Hospitality & Travel, and Automotive & Manufacturing.

        </ul>
      ),
    },
    {
      title: 'Our Digital Marketing Process',
      description: (
        <p>The process includes <b>Market Research & Analysis</b>, followed by Strategy Development to outline a clear roadmap. Once the strategy is in place, focus shifts to **Implementation & Execution**, ensuring all plans are put into action effectively. This is supported by continuous **Monitoring & Optimization** to enhance performance, and culminates in comprehensive **Reporting & Insights** that inform future decisions.
</p>
      ),
    },
    {
      title: 'Why Choose TechXplorers for Digital Marketing?',
      description: (
        <ul className="flip-card-list">
         TechXplorers stands out through its **expertise and experience**, offering clients **custom strategies** tailored to their unique goals. With a strong **data-driven approach**, we ensure every decision is backed by analytics. Our **multi-channel marketing** capabilities help businesses reach audiences effectively across platforms, all while maintaining **transparent reporting** to keep clients informed and empowered.

        </ul>
      ),
    }
  ];

  return (
    <div className="digital-marketing-container">
      <CustomNavbar />
      
      {/* Header Section */}
       <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Digital Marketing" className="header-image" />
          {/* This new container will hold both the title and the buttons */}
          <div className="glassy-mask"></div>
          <div className="overlay-content">
            <div className="overlay-text">Digital Marketing</div>
            
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
          <Modal.Title>Digital Marketing</Modal.Title>
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
    </div>
  );
};

export default DigitalMarketing;
