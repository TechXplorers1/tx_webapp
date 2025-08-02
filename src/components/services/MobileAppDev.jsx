import React, { useState } from 'react';
import img1 from '../../assets/WebDev.png';
import '../../styles/Services/WebAppDev.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../components/AuthContext'; // Corrected the import path

const WebAppDev = () => {
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

  const cardsData = [
    {
      title: 'Our Web Application Development Services',
      description: (
        <p>
        We provide comprehensive end-to-end web application development solutions tailored to meet your business needs. Our team ensures that every web platform we build is fully responsive across devices, highly secure, scalable, and optimized for performance. From initial planning and UI/UX design to full-stack development and post-launch support, we align every aspect of your web application with your strategic goals and user expectations.
        </p>
      ),
    },
    {
      title: 'Custom Web App Development',
      description: (
        <ul className="flip-card-list">
          <li>We create web applications that align with your business needs, industry standards, and customer expectations.</li>
          <li><b>Modern Tech Stack</b> – We utilize React.js, Angular, Vue.js, Node.js, Python, Laravel, and PHP for scalable and efficient development.</li>
          <li><b>Full-Stack Development</b> – From front-end design to back-end architecture, we deliver complete web solutions.</li>
          <li><b>Fast & Responsive</b> – Optimized performance for quick loading times.</li>
        </ul>
      ),
    },
    {
      title: 'Web Application Development Process',
      description: (
        <ul className="flip-card-list">
          <li><b>Requirement Analysis & Planning</b> – Understanding your business goals and project requirements.</li>
          <li><b>UI/UX Design & Prototyping</b> – Crafting intuitive and engaging interfaces for a seamless user experience.</li>
          <li><b>Development & Testing</b> – Coding, integration, and rigorous testing to ensure flawless functionality.</li>
          <li><b>Deployment & Launch</b> – Ensuring a smooth launch with cloud hosting, domain setup, and database configurations.</li>
          <li><b>Ongoing Maintenance & Upgrades</b> – Continuous monitoring, bug fixes, security updates, and feature enhancements.</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers Pvt Ltd',
      description: (
        <ul className="flip-card-list">
          <li><b>Expert Developers:</b> Talented professionals skilled in full-stack web development.</li><br />
          <li><b>User-Centric Design:</b> Focus on seamless user experience and beautiful, functional designs.</li><br />
          <li><b>Quality Assurance:</b> Rigorous testing to ensure flawless app performance.</li><br />
          <li><b>Confidentiality:</b> Full protection of your business idea with NDAs.</li>
        </ul>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <ul className="flip-card-list">
          TechXplorers proudly serves a wide range of industries including E-Commerce & Retail, Healthcare & Pharmaceuticals, Finance & Banking, Real Estate & Construction, Education & Training, and Technology & SaaS. Our tailored solutions are designed to meet the unique needs of each sector, empowering businesses to innovate, streamline operations, and drive sustainable growth in a competitive digital landscape.
        </ul>
      ),
    }
  ];

  // Step 3: Update the handler to check for login status
  const handleApplyNow = () => {
    if (isLoggedIn) {
      navigate('/services/servicesForm', { state: { service: 'Web Development' } });
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
    // Using a custom modal or toast notification is better than alert()
    setShowModal(false);
    // Reset form
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
          <h2 className="headline mb-3">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button onClick={handleApplyNow} className="contact-button btn-lg btn-primary mb-5">
            Register Now
          </button>
        </div>
      </section>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Web App Development</Modal.Title>
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

            <Button type="submit" className="w-100 btn btn-primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WebAppDev;
