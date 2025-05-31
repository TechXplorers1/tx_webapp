import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CustomNavbar from './Navbar'; // Make sure this path is correct


const ContactPage = () => {
    // State for form inputs
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { subject, message });
        // Add your form submission logic here
    };

    return (
        <div className="contact-us-page">
            {/* Navigation Bar */}
            <CustomNavbar />

            {/* Contact Locations Section */}
            <Container className="my-5">
                <h1 className="text-center mb-5">OUR CONTACT LOCATIONS</h1>
                <Row>

                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body>
                                {/* Placeholder for Google Map */}
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps?q=Tech+Xplorers+Private+Limited,+3rd+Cross+Rd,+Anantapur,+India&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body>
                                {/* Placeholder for Google Map */}
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps?q=Techxplorers+Pvt+Ltd+new+branch,+Srinagar+Colony,+Anantapur,+India&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Contact Form Section */}
            <Container className="my-5">
                <Row>
                    <Col md={6}>
                        <h2 className="mb-4">GET A CALL FROM TECHXPLORES</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="SUBJECT"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="MESSAGE"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex flex-column justify-content-center align-items-start h-100">
                            <h2 className="mb-4">CONTACT MAIL ID</h2>
                            <p className="mb-2"><a href="mailto:hr@techxplores.in">txhr@techxplores.in</a></p>
                            <p className="mb-2"><a href="mailto:sales@techxplores.in">sales@techxplores.in</a></p>
                            <p><a href="mailto:support@techxplores.in">support@techxplores.in</a></p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-white py-5">
                <Container>
                    {/* Form Section */}
                    <Form className="d-flex justify-content-center align-items-center mb-5">
                        <Form.Control
                            type="text"
                            placeholder="Ask"
                            className="me-2 rounded-0 py-2"
                            style={{ width: '25%' }}
                        />
                        <button variant="primary" className="btn btn-primary rounded-0 px-4 py-2">Submit</button>
                    </Form>

                    {/* Copyright and Links */}
                    <div className="d-flex justify-content-center align-items-center">
                        {/* Centered Copyright */}
                        <p className="mb-0 text-dark">Techxplorers ©2025</p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

                        {/* Right-aligned Links */}
                        <div>
                            <a href="#" className="text-dark me-2 text-decoration-none">Privacy & Legal</a>
                            <a href="#" className="text-dark text-decoration-none">Contact</a>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default ContactPage;