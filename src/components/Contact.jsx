import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import CustomNavbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { database, auth } from '../firebase';
import { ref, push } from "firebase/database";

const ContactPage = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        const submission = {
            id: Date.now(),
            ...formData,
            receivedDate: new Date().toISOString().split('T')[0],
            status: "Pending",
            userId: currentUser ? currentUser.uid : "guest"
        };

         try {
            const contactSubmissionsRef = ref(database, 'submissions/contactMessages');
            await push(contactSubmissionsRef, submission);
            
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to submit contact message to Firebase", error);
            alert("Submission failed. Please try again.");
        }
    };
    
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
        });
    }

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

        :root {
            --light-bg: #f8f9fa;
            --light-surface: #ffffff;
            --light-text-primary: #212529;
            --light-text-secondary: #6c757d;
            --light-border: #e9ecef;
            --primary-color: #007bff;
            --shadow-light: 0 10px 30px rgba(0, 0, 0, 0.07);

            --dark-bg: #121212;
            --dark-surface: #1e1e1e;
            --dark-text-primary: #e0e0e0;
            --dark-text-secondary: #a0a0a0;
            --dark-border: #333333;
            --shadow-dark: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        body {
            background-color: var(--light-bg);
            font-family: 'Inter', sans-serif;
            transition: background-color 0.3s ease;
        }
        .dark-mode body {
            background-color: var(--dark-bg);
        }

        .contact-page-container {
            padding-top: 80px;
        }
        
        .section-padding {
            padding: 2rem 1rem;
        }

        .section-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--light-text-primary);
            transition: color 0.3s ease;
        }
        .dark-mode .section-title {
            color: var(--dark-text-primary);
        }

        .section-subtitle {
            text-align: center;
            font-size: 1.13rem;
            color: var(--light-text-secondary);
            max-width: 700px;
            margin: 0 auto 3rem auto;
            transition: color 0.3s ease;
        }
        .dark-mode .section-subtitle {
            color: var(--dark-text-secondary);
        }

        .contact-card {
            background-color: var(--light-surface);
            border: 1px solid var(--light-border);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: var(--shadow-light);
            height: 100%;
            transition: all 0.3s ease;
        }
        .dark-mode .contact-card {
            background-color: var(--dark-surface);
            border-color: var(--dark-border);
            box-shadow: var(--shadow-dark);
        }

        .contact-card h3 {
            font-weight: 600;
            color: var(--light-text-primary);
            margin-bottom: 1.5rem;
            transition: color 0.3s ease;
        }
        .dark-mode .contact-card h3 {
            color: var(--dark-text-primary);
        }

        .map-iframe {
            border: 0;
            border-radius: 0.75rem;
            width: 100%;
            height: 300px;
        }

        .form-label-modern {
            font-weight: 500;
            color: var(--light-text-secondary);
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
            font-size: 0.9rem;
        }
        .dark-mode .form-label-modern {
            color: var(--dark-text-secondary);
        }

        .form-control-modern {
            background-color: #f1f3f5;
            border: 1px solid #f1f3f5;
            border-radius: 0.75rem;
            padding: 0.85rem 1.1rem;
            color: var(--light-text-primary);
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        .dark-mode .form-control-modern {
            background-color: #2a2a2a;
            border-color: var(--dark-border);
            color: #ffffff;
        }
        .dark-mode .form-control-modern::placeholder {
            color: #bbbbbb;
            opacity: 1;
        }
        .form-control-modern:focus {
            background-color: var(--light-surface);
            border-color: #80bdff;
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
        }
        .dark-mode .form-control-modern:focus {
            background-color: var(--dark-surface);
        }
        
        .submit-button {
            border-radius: 50px;
            font-weight: 600;
            padding: 0.75rem 2.5rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .submit-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }
        
        .email-card {
            background: linear-gradient(45deg, #007bff, #0056b3);
            color: white;
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 1rem;
            text-align: center;
            transition: transform 0.3s ease;
        }
        .email-card:hover {
            transform: translateY(-5px);
        }
        .email-card .icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .email-card .email-address {
            font-size: 1.1rem;
            font-weight: 500;
            color: white;
            text-decoration: none;
        }
        .email-card .email-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .contact-footer {
            text-align: center;
            padding: 2rem 1rem;
            background-color: var(--light-surface);
            border-top: 1px solid var(--light-border);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .dark-mode .contact-footer {
            background-color: var(--dark-surface);
            border-top-color: var(--dark-border);
        }
        .dark-mode .contact-footer p, .dark-mode .contact-footer a {
            color: var(--dark-text-secondary);
        }

        .success-modal .modal-content {
            background-color: var(--light-surface);
            border-radius: 1rem;
            border: none;
            text-align: center;
            padding: 1.5rem;
            transition: background-color 0.3s ease;
        }
        .dark-mode .success-modal .modal-content {
            background-color: var(--dark-surface);
        }
        .dark-mode .success-modal .modal-title, .dark-mode .success-modal .modal-body p {
            color: var(--dark-text-primary);
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="contact-page-container">
                <CustomNavbar />

                <section className="section-padding">
                    <Container>
                        <h3 className="section-title">Get In Touch</h3>
                        <p className="section-subtitle">
                            We're here to help and answer any question you might have. We look forward to hearing from you.
                        </p>
                        <Row className="g-4">
                            <Col lg={7}>
                                <div className="contact-card" data-aos="fade-right">
                                    <h3>Send us a Message</h3>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Label className="form-label-modern">First Name*</Form.Label>
                                                <Form.Control name="firstName" type="text" placeholder="John" required className="form-control-modern" onChange={handleChange} value={formData.firstName} />
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Label className="form-label-modern">Last Name</Form.Label>
                                                <Form.Control name="lastName" type="text" placeholder="Doe" className="form-control-modern" onChange={handleChange} value={formData.lastName} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Label className="form-label-modern">Email*</Form.Label>
                                                <Form.Control name="email" type="email" placeholder="you@example.com" required className="form-control-modern" onChange={handleChange} value={formData.email} />
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Label className="form-label-modern">Phone Number*</Form.Label>
                                                <Form.Control name="phone" type="tel" placeholder="(123) 456-7890" required className="form-control-modern" onChange={handleChange} value={formData.phone} />
                                            </Col>
                                        </Row>
                                        <div className="mb-3">
                                            <Form.Label className="form-label-modern">Message*</Form.Label>
                                            <Form.Control name="message" as="textarea" rows={5} placeholder="Your message..." required className="form-control-modern" onChange={handleChange} value={formData.message} />
                                        </div>
                                        <div className="text-center">
                                            <Button type="submit" variant="primary" className="submit-button">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div className="contact-card" data-aos="fade-left">
                                    <h3>Contact Information</h3>
                                    <div>
                                        <div className="email-card" style={{background: 'linear-gradient(45deg, #1a75ff, #3399ff)'}}>
                                            <div className="icon"><FontAwesomeIcon icon={faEnvelope} /></div>
                                            <div className="email-label">HR Department</div>
                                            <a href="mailto:txhr@techxplores.in" className="email-address">txhr@techxplores.in</a>
                                        </div>
                                        <div className="email-card" style={{background: 'linear-gradient(45deg, #28a745, #20c997)'}}>
                                            <div className="icon"><FontAwesomeIcon icon={faEnvelope} /></div>
                                            <div className="email-label">Sales Inquiries</div>
                                            <a href="mailto:sales@techxplores.in" className="email-address">sales@techxplores.in</a>
                                        </div>
                                        <div className="email-card" style={{background: 'linear-gradient(45deg, #6f42c1, #8a63d2)'}}>
                                            <div className="icon"><FontAwesomeIcon icon={faEnvelope} /></div>
                                            <div className="email-label">General Support</div>
                                            <a href="mailto:support@techxplores.in" className="email-address">support@techxplores.in</a>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* <section className="section-padding" style={{paddingTop: 0}}>
                    <Container>
                         <h2 className="section-title">Our Locations</h2>
                         <Row className="g-4">
                            <Col md={6}>
                                <div className="contact-card" data-aos="zoom-in-up">
                                     <h3>Branch 1</h3>
                                     <iframe
                                        title="India Office Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.0853368085723!2d77.59042042179124!3d14.667414503603284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165cab3f%3A0xcefe46ad8e4291aa!2sTECH%20XPLORERS%20PRIVATE%20LIMITED!5e1!3m2!1sen!2sin!4v1750159356731!5m2!1sen!2sin"
                                        className="map-iframe"
                                        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </Col>
                             <Col md={6}>
                                <div className="contact-card" data-aos="zoom-in-up">
                                     <h3>Branch 2</h3>
                                     <iframe
                                        title="USA Office Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5681.928928098746!2d77.57701155042699!3d14.666123989298168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14b00165094f3%3A0x9bf5c8ec88ce2b98!2sTechxplorers%20Pvt%20Ltd%20new%20branch!5e1!3m2!1sen!2sin!4v1750159515282!5m2!1sen!2sin"
                                        className="map-iframe"
                                        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </Col>
                         </Row>
                    </Container>
                </section> */}

                <footer className="contact-footer">
                    <Container>
                        <p className="mb-2">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
                        <div>
                            <a href="#" className="text-secondary text-decoration-none mx-2">Privacy & Legal</a>
                            <a href="/contactus" className="text-secondary text-decoration-none mx-2">Contact</a>
                        </div>
                    </Container>
                </footer>
            </div>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered dialogClassName="success-modal">
                <Modal.Body>
                    <div className="text-center">
                        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '4rem', marginBottom: '1rem'}}></i>
                        <h3 className="fw-bold mb-3 modal-title">THANK YOU</h3>
                        <p className="fs-5 text-secondary">For showing interest in our products and services. Our team will be in contact with you shortly.</p>
                        <p className="fs-5 mt-4 text-secondary">TechXplorers – Celebrating 5+ years of industrial experience and a strong brand value our team has created!</p>
                        <Button variant="primary" onClick={handleCloseSuccessModal} className="mt-3 rounded-pill px-4">
                            Close
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ContactPage;
