import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CustomNavbar from './Navbar'; // Update this path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactPage = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        // Initialize the animation library only when the form is visible.
        if (!formSubmitted) {
            AOS.init({ duration: 1000 });
        }
    }, [formSubmitted]);

   const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- NEW: Capture form data and save to local storage ---
        const formData = new FormData(e.target);
        const submission = {
            id: Date.now(), // Unique ID for the submission
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            receivedDate: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD' format

        };
              // Get existing submissions from local storage or create a new array
        const existingSubmissions = JSON.parse(localStorage.getItem('contact_submissions')) || [];
        
        // Prepend the new submission
        const updatedSubmissions = [submission, ...existingSubmissions];
        
        // Save back to local storage
        localStorage.setItem('contact_submissions', JSON.stringify(updatedSubmissions));
        
        // --- End of new logic ---

        setFormSubmitted(true);
        };

    if (formSubmitted) {
        return (
            <div style={{ color: 'black', height: '100vh' }} className="d-flex flex-column justify-content-center align-items-center text-center px-3">
                <h1 className="fw-bold display-4 mb-3">THANK YOU</h1>
                {/* Note: Border color changed from white to black for visibility */}
                <hr style={{ width: '80px', borderTop: '2px solid black' }} />
                <p className="fs-5">For showing interest in our products and services. Our team will be in contact with you shortly.</p>
                <p className="fs-5 mt-4">TechXplorers – Celebrating 5+ years of industrial experience and a strong brand value our team has created!</p>
            </div>
        );
    }

   

    return (
        <div className="contact-us-page">
            <CustomNavbar />

            {/* Contact Locations Section */}
            <Container className="my-5 mt-5 pt-5">
                <Container className="my-3 mt-3 pt-3">
                    <h1 className="text-center mb-3">OUR CONTACT LOCATIONS</h1>
                    <Row>
                        <Col md={6} data-aos="zoom-in">
                            <Card className="mb-4 shadow-sm h-100" data-aos="fade-up">
                                <Card.Body >
                                    <iframe
                                        className='rounded'
                                        title="Google Map 1"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.0853368085723!2d77.59042042179124!3d14.667414503603284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165cab3f%3A0xcefe46ad8e4291aa!2sTECH%20XPLORERS%20PRIVATE%20LIMITED!5e1!3m2!1sen!2sin!4v1750159356731!5m2!1sen!2sin"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} data-aos="zoom-in">
                            <Card className="mb-4 shadow-sm h-100" data-aos="fade-up">
                                <Card.Body>
                                    <iframe
                                        className='rounded'
                                        title="Google Map 2"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5681.928928098746!2d77.57701155042699!3d14.666123989298168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165094f3%3A0x9bf5c8ec88ce2b98!2sTechxplorers%20Pvt%20Ltd%20new%20branch!5e1!3m2!1sen!2sin!4v1750159515282!5m2!1sen!2sin"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {/* Form + Mail Section */}
                <Container className="my-5 contact-card">
                    <Row>
                        {/* Form Container */}
                        <Col md={6} data-aos="zoom-in">
                            <div
                                className="p-4 form" data-aos="fade-right"
                                style={{
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                }}
                            >
                                <h2 className="fw-bold mb-2">Talk With Techxplorers</h2>
                                <p className=" mb-4">Building the future with style and innovation. Join us on our journey!</p>

                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col md={6} data-aos="zoom-in">
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Email*"
                                                className="p-3 bg-light border-info"
                                                style={{ borderRadius: '20px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} data-aos="zoom-in">
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                placeholder="Phone Number*"
                                                className="p-3 bg-light border-info"
                                                style={{ borderRadius: '20px' }}
                                                required
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6} data-aos="zoom-in">
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                placeholder="First name*"
                                                className="p-3 bg-light border-info"
                                                style={{ borderRadius: '20px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} data-aos="zoom-in">
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                placeholder="Last name"
                                                className="p-3 bg-light border-info"
                                                style={{ borderRadius: '20px' }}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col data-aos="zoom-in">
                                            <Form.Control
                                                as="textarea"
                                                name="message"
                                                rows={3}
                                                placeholder="Message"
                                                className="p-3 bg-light border-info"
                                                style={{ borderRadius: '20px' }}
                                                required
                                            />
                                        </Col>
                                    </Row>

                                    <div className="text-center">
                                        <Button type="submit" className="btn btn-primary px-4 py-2" style={{ borderRadius: '10px' }}>
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>

                        {/* Mail ID Box */}
                        <Col md={6} data-aos="zoom-in">
                            <div
                                className="p-4 d-flex flex-column justify-content-center align-items-center text-center" data-aos="fade-left"
                                style={{
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    height: '100%',

                                }}
                            >
                                <h2 className="fw-bold mb-4">Contact Mail ID</h2>
                                {[
                                    {
                                        email: "txhr@techxplores.in",
                                        bg: "#1a75ff",
                                    },
                                    {
                                        email: "sales@techxplores.in",
                                        bg: "#3399ff",
                                    },
                                    {
                                        email: "support@techxplores.in",
                                        bg: "#66ccff",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="email-card text-white text-center p-2 w-75 mb-2 rounded-4 flex-grow-1"
                                        style={{ backgroundColor: item.bg }}
                                    >
                                        <h5 className="fw-bold mb-4">Email</h5>
                                        <p className="mb-0">
                                            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                            <a
                                                href={`mailto:${item.email}`}
                                                className="text-white fs-3 text-decoration-none"
                                            >
                                                {item.email}
                                            </a>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Footer */}
                <footer className=" py-5">
                    <Container className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                        <p className="mb-2 mb-md-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
                        <div className="d-flex gap-3">
                            <a href="#" style={{ color: 'black' }} className="text-decoration-none">Privacy & Legal</a>
                            <a href="/contactus" style={{ color: 'black' }} className="text-decoration-none">Contact</a>
                        </div>
                    </Container>
                </footer>
                </Container>
        </div>
    );
};

export default ContactPage;
