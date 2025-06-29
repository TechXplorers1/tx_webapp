import React, { useState } from 'react';
import img1 from '../../assets/MobileDev.png';
import '../../styles/Services/MobileAppDev.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import { Modal, Button, Form } from 'react-bootstrap';

const MobileAppDev = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    service: '',
    userType: '',
  });

  const cardsData = [
    {
      title: 'Android App Development',
      description: (
        <p>
Android, developed by Google, powers millions of smartphones globally. At TechXplorers Pvt Ltd, we specialize in expert Android app development, delivering high-quality, custom mobile solutions that align with your unique business goals. From user-friendly interfaces to robust backend integration, our apps are designed to perform seamlessly across Android devices, helping you engage users effectively and drive business growth.
        </p>
      ),
    },
    {
      title: 'Android App Development Services',
      description: (
       <p>TechXplorers specializes in developing a wide range of applications tailored to diverse user needs. These include Bluetooth Low Energy (BLE) powered devices, music and video apps, health and fitness applications, security apps, and location-based services. The team also builds GPS tracking and dispatch apps, social media platforms, and offers custom Android app development to suit unique client requirements.</p>
      ),
    },
    {
      title: 'iOS App Development',
      description: (
        <p>
          Apple's iOS platform is known for its seamless hardware-software integration, setting high benchmarks for mobile operating systems. TechXplorers Pvt Ltd specializes in custom iPhone app development for iOS 15/iOS 16, delivering end-to-end solutions.
        </p>
      ),
    },
    {
      title: 'iOS App Development Services',
      description: (
       <p>

TechXplorers specializes in a wide range of mobile solutions including Bluetooth Low Energy (BLE) powered devices, music and video apps, health and fitness applications, security apps, and location-based services. We also develop GPS tracking and dispatch systems, social media applications, and offer custom iOS app development tailored to specific business needs.
</p>
      ),
    },
    {
      title: 'Why Choose TechXplorers Pvt Ltd',
      description: (
        <ul className="flip-card-list">
          <li><b>Expert Developers:</b> Talented professionals skilled in both Android and iOS app development.</li>
          <li><b>User-Centric Design:</b> Focus on seamless user experience and beautiful, functional designs.</li>
          <li><b>Quality Assurance:</b> Rigorous testing to ensure flawless app performance.</li>
          <li><b>Confidentiality:</b> Full protection of your business idea with NDAs.</li>
        </ul>
      ),
    },
  ];

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
    alert('Form submitted successfully!');
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

  return (
    <div className="mobile-app-dev-container">
      <CustomNavbar />
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Mobile Application Development" className="header-image" />
          <div className="overlay-text">Mobile App Development</div>
        </div>
      </header>

      {/* Flip Cards Section */}
      <section className="cards-section">
        <h2 className="section-title">Explore Our Services</h2>
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
          <h2 className="headline mb-3">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button onClick={() => setShowModal(true)} className="contact-button btn-lg btn-primary mb-5">
            Apply Now
          </button>
        </div>
      </section>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className=''>
        <Modal.Header className=" modal-service " closeButton>
          <Modal.Title>Mobile App Development</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Form.Label className="fw-bold">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">
                Mobile <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-bold">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Email ID"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label><strong>What service do you want?</strong></label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <Button
                    key={num}
                    variant={formData.service === `Service ${num}` ? 'primary' : 'outline-primary'}
                    onClick={() => handleServiceSelect(`Service ${num}`)}
                  >
                    Service {num}
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

            <Button type="submit" className="w-100 btn btn-primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default MobileAppDev;
