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
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4296.444043533194!2d77.58445815918705!3d14.66620358598588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165094f3%3A0x9bf5c8ec88ce2b98!2sTechxplorers%20Pvt%20Ltd%20new%20branch!5e1!3m2!1sen!2sin!4v1748514565850!5m2!1sen!2sin "
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
                                {/* Placeholder for Google Map */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d709.765200898061!2d77.58993104299888!3d14.666434711346092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165cab3f%3A0xcefe46ad8e4291aa!2sTECH%20XPLORERS%20PRIVATE%20LIMITED!5e1!3m2!1sen!2sin!4v1748514787859!5m2!1sen!2sin "
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
                            <p className="mb-2"><a href="mailto:hr@techxplores.in">hr@techxplores.in</a></p>
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