import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CustomNavbar from './Navbar'; // Adjust the path as needed

const ContactPage = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { subject, message });
    };

    const sharedContainerStyle = {
        background: '#fff',
        border: '2px solid #e0e0e0',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        padding: '2rem',
        borderRadius: '1rem',
        height: '100%',
    };

    return (
        <div className="contact-us-page">
            <CustomNavbar />

            {/* Google Maps Section */}
            <Container className="my-5">
                <h1 className="text-center mb-3">OUR CONTACT LOCATIONS</h1>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body>
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps?q=Tech+Xplorers+Private+Limited,+3rd+Cross+Rd,+Anantapur,+India&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="mb-4 shadow-sm h-100">
                            <Card.Body>
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps?q=Techxplorers+Pvt+Ltd+new+branch,+Srinagar+Colony,+Anantapur,+India&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Contact Form + Mail IDs */}
            <Container className="my-5">
                <Row>
                    {/* Contact Form */}
                    <Col md={6}>
                        <div style={sharedContainerStyle}>
                            <h2 className="fw-bold text-dark mb-2">Talk with TechXplorers</h2>
                            <p className="text-secondary mb-4">
                                BUILDING THE FUTURE WITH STYLE AND INNOVATION. JOIN US ON OUR JOURNEY!
                            </p>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email*"
                                            className="rounded-pill p-3 bg-light border-light"
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="Phone Number*"
                                            className="rounded-pill p-3 bg-light border-light"
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="First name*"
                                            className="rounded-pill p-3 bg-light border-light"
                                            required
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Last name"
                                            className="rounded-pill p-3 bg-light border-light"
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Select className="rounded-pill p-3 bg-light border-light">
                                            <option value="">Product</option>
                                            <option value="product1">Product 1</option>
                                            <option value="product2">Product 2</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Message"
                                            className="rounded-4 p-3 bg-light border-light"
                                            required
                                        />
                                    </Col>
                                </Row>

                                <div className="text-center">
                                    <Button variant="primary" className="rounded-2 px-4 py-2" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>

                    {/* Contact Mail IDs */}
                    <Col md={6}>
                        <div
                            style={sharedContainerStyle}
                            className="d-flex flex-column justify-content-center align-items-center text-center"
                        >
                            <h2 className="mb-4">Contact Mail ID</h2>
                            <p className="mb-2 fs-5">
                                <a href="mailto:txhr@techxplores.in">txhr@techxplores.in</a>
                            </p>
                            <p className="mb-2 fs-5">
                                <a href="mailto:sales@techxplores.in">sales@techxplores.in</a>
                            </p>
                            <p className="fs-5">
                                <a href="mailto:support@techxplores.in">support@techxplores.in</a>
                            </p>

                        </div>
                    </Col>

                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-white py-5">
                <Container>
                    <div className="d-flex justify-content-center align-items-center">
                        <p className="mb-0 text-dark">Techxplorers ©2025</p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
