import React, { useState } from 'react';
import img1 from '../../assets/ItTalentSupply.png';
import '../../styles/Services/MobileAppDev.css'; // Reusing styles
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import { Modal, Button, Form } from 'react-bootstrap';

const ITTalentSupply = () => {
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

  const cardsData = [
    {
      title: 'IT Talent Supply – TechXplorers Private Limited',
      description: (
        <p>
          We connect companies with highly skilled IT professionals across various technologies and domains, ensuring you have the right talent to meet your project and business demands.
        </p>
      ),
    },
    {
      title: 'Key IT Talent Solutions',
      description: (
        <ul className="flip-card-list">
          <li><strong>Permanent Staffing</strong> – Hire top IT professionals for long-term roles across various industries.</li>
          <li><strong>Contract Staffing</strong> – Flexible hiring options for short-term and project-based requirements.</li>
          <li><strong>Remote IT Talent</strong> – Access a global pool of remote IT experts to work on your projects.</li>
          <li><strong>Executive Search</strong> – Find highly skilled and experienced IT leaders for critical roles.</li>
          <li><strong>Project-Based IT Staffing</strong> – Deploy the right talent for specific IT projects, ensuring success.</li>
          <li><strong>On-Demand IT Experts</strong> – Quickly hire professionals to address urgent skill gaps.</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers?',
      description: (
        <ul className="flip-card-list">
          <li>Proven Track Record – Years of experience in sourcing and supplying elite IT professionals.</li>
          <li>Global Reach – Access to a worldwide network of developers, engineers, and architects.</li>
          <li>Tailored Matching – We assess your needs to ensure we provide the perfect fit for your team.</li>
          <li>Scalable Hiring – From single freelancers to full teams, we support your growth at any scale.</li>
          <li>Compliance & Support – Full legal compliance and continuous support during engagement.</li>
        </ul>
      ),
    },
    {
      title: 'Our Talent Supply Process',
      description: (
        <ul className="flip-card-list">
          <li>Requirement Gathering – Understand your project scope and hiring goals.</li>
          <li>Candidate Sourcing – Leverage our global talent pool to find the best fit.</li>
          <li>Screening & Shortlisting – Technical assessments and interviews to ensure quality.</li>
          <li>Matching & Onboarding – Seamless integration into your team or project.</li>
          <li>Ongoing Management – Performance tracking, feedback, and support throughout the engagement.</li>
        </ul>
      ),
    }
  ];

  return (
    <div className="ittalent-supply-container">
      <CustomNavbar />
      
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="IT Talent Supply" className="header-image" />
          <div className="overlay-text">IT Talent Supply</div>
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

        {/* Contact Section */}
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button onClick={() => setShowModal(true)} className="contact-button btn-lg btn-primary">
            Apply Now
          </button>
        </div>
      </section>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>IT Talent Supply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Mobile <span className="text-danger">*</span></Form.Label>
              <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <div className="mb-3">
              <Form.Label className="fw-bold">What service do you want?</Form.Label>
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
              <Form.Label className="fw-bold">Who are you?</Form.Label>
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

export default ITTalentSupply;
