import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CustomNavbar from './Navbar'; // Update this path if needed

const ContactPage = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    if (formSubmitted) {
        return (
            <div style={{ color: 'black', height: '100vh' }} className="d-flex flex-column justify-content-center align-items-center text-center px-3">
                <h1 className="fw-bold display-4 mb-3">THANK YOU</h1>
                <hr style={{ width: '80px', borderTop: '2px solid white' }} />
                <p className="fs-5">For showing interest in our products and services. Our team will be in contact with you shortly.</p>
                <p className="fs-5 mt-4">TechXplorers – Celebrating 5+ years of industrial experience and a strong brand value our team has created!</p>
            </div>
        );
    }

    return (
        <div className="contact-us-page">
            <CustomNavbar />

            {/* Contact Locations Section */}
            <Container className="my-5">
                <h1 className="text-center mb-3">OUR CONTACT LOCATIONS</h1>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body >
                                <iframe
                                    className='rounded'
                                    title="Google Map 1"
                                    src="https://www.google.com/maps?q=Tech+Xplorers+Private+Limited,+3rd+Cross+Rd,+Anantapur,+India&output=embed"
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
                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body>
                                <iframe
                                    className='rounded'
                                    title="Google Map 2"
                                    src="https://www.google.com/maps?q=Techxplorers+Pvt+Ltd+new+branch,+Srinagar+Colony,+Anantapur,+India&output=embed"
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
                    <Col md={6}>
                        <div
                            className="p-4 form"
                            style={{
                                border: '2px solid #e0e0e0',
                                borderRadius: '20px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            }}
                        >
                            <h2 className="fw-bold mb-2">Talk with TechXplorers</h2>
                            <p className=" mb-4">BUILDING THE FUTURE WITH STYLE AND INNOVATION. JOIN US ON OUR JOURNEY!</p>

                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email*"
                                            className="p-3 border-light"
                                            style={{ borderRadius: '20px' }}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Phone Number*"
                                            className="p-3 border-light"
                                            style={{ borderRadius: '20px' }}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="First name*"
                                            className="p-3 bg-light border-light"
                                            style={{ borderRadius: '20px' }}
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Last name"
                                            className="p-3 bg-light border-light"
                                            style={{ borderRadius: '20px' }}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Message"
                                            className="p-3 bg-light border-light"
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
                    <Col md={6}>
                        <div
                            className="p-4 d-flex flex-column justify-content-center align-items-center text-center"
                            style={{
                                border: '2px solid #e0e0e0',
                                borderRadius: '20px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                height: '100%',
                                
                            }}
                        >
                            <h2 className="fw-bold mb-4">CONTACT MAIL ID</h2>
                            <p className="mb-3 fs-5"><a href="mailto:txhr@techxplores.in">txhr@techxplores.in</a></p>
                            <p className="mb-3 fs-5"><a href="mailto:sales@techxplores.in">sales@techxplores.in</a></p>
                            <p className="fs-5"><a href="mailto:support@techxplores.in">support@techxplores.in</a></p>

                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className=" py-5">
                <Container className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                    <p className="mb-0">Techxplorers©️2025</p>
                    <div>
                        <a href="#" className=" me-2 text-decoration-none">Privacy & Legal</a>
                        <a href="#" className=" text-decoration-none">Contact</a>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default ContactPage;
