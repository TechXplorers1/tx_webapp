import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Adjust path if needed
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const styles = `
    /* Footer Specific Styles */
    :root {
      /* Defaults (Light Mode) */
      --secondary-color: #1F2937;
      --text-color: #4B5563;
      --light-gray: #F9FAFB;
      --border-color: #E5E7EB;
      --primary-light: #EDE9FE;
    }

    /* Dark Mode Override logic handled by parent class or manual check below */
    .dark-mode-footer {
      --secondary-color: #F9FAFB;
      --text-color: #D1D5DB;
      --light-gray: #1F2937;
      --border-color: #374151;
      --primary-light: #4c1d95;
    }

    .footer-modern {
      text-align: center;
      padding: 2rem 0;
      /* Background logic is handled inline for dynamic gradient */
    }
    .footer-modern a {
      text-decoration: none;
      margin: 0 0.5rem; /* Default margin */
      transition: color 0.3s;
    }
    .footer-modern a:hover {
      color: var(--primary-light) !important;
    }
    
    /* Fixed: Added gap between social icons */
    .social-icons a {
       margin-right: 15px !important;
    }
    .social-icons a:last-child {
       margin-right: 0 !important;
    }

    /* Animation Keyframes */
    @keyframes fadeUpFooter {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .fade-up-footer {
      animation: fadeUpFooter 0.8s ease-out forwards;
    }
  `;

  // Dynamic Styles based on Theme and View State
  const containerStyle = {
    backgroundColor: 'var(--light-gray)',
    backgroundImage: isDarkMode 
        ? 'radial-gradient(circle at 10% 20%, rgba(76, 29, 149, 0.5), transparent 40%), radial-gradient(circle at 80% 90%, rgba(76, 29, 149, 0.5), transparent 50%)'
        : 'radial-gradient(circle at 10% 20%, rgba(190, 182, 224, 0.5), transparent 40%), radial-gradient(circle at 80% 90%, rgba(184, 169, 250, 0.5), transparent 50%)',
    opacity: inView ? 1 : 0, 
    transitionDuration: '1s',
    color: 'var(--text-color)'
  };

  return (
    <>
      <style>{styles}</style>
      <footer 
        ref={ref}
        className={`footer-modern py-5 ${inView ? 'fade-up-footer' : ''} ${isDarkMode ? 'dark-mode-footer' : ''}`}
        style={containerStyle}
      >
        <Container>
          <Row className="g-4">
            {/* 1. BRAND & SOCIALS */}
            <Col md={4} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>TechXplorers</h5>
              <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
                Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.
              </p>
              <div className="d-flex social-icons mt-3">
                  <a href="https://www.instagram.com/techxplorers.pvt.ltd/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
                  <FaInstagram />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61571029190090" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
                  <FaFacebookF />
                </a>
                  <a href="https://x.com/techXplorers_" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
                  <FaTwitter />
                </a>
                 <a href="https://www.linkedin.com/company/techxplorers-private-limited/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
                  <FaLinkedinIn />
                </a>
              </div>
            </Col>

            {/* 2. SERVICES LINKS */}
            <Col md={2} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Services</h5>
              <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
                <li className="mb-2"><a href="/services/mobile-app-development" style={{ color: 'var(--text-color)' }}>Mobile App</a></li>
                <li className="mb-2"><a href="/services/web-app-development" style={{ color: 'var(--text-color)' }}>Web App</a></li>
                <li className="mb-2"><a href="/services/digital-marketing" style={{ color: 'var(--text-color)' }}>Digital Marketing</a></li>
                <li className="mb-2"><a href="/services/it-talent-supply" style={{ color: 'var(--text-color)' }}>IT Talent Supply</a></li>
                <li className="mb-2"><a href="/services/job-support" style={{ color: 'var(--text-color)' }}>Job Support & IT</a></li>
                <li className="mb-2"><a href="/services/cyber-security" style={{ color: 'var(--text-color)' }}>Cyber Security</a></li>
              </ul>
            </Col>

            {/* 3. COMPANY LINKS */}
            <Col md={2} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Company</h5>
              <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
                <li className="mb-2"><a href="/aboutus" style={{ color: 'var(--text-color)' }}>About Us</a></li>
                <li className="mb-2"><a href="/careers" style={{ color: 'var(--text-color)' }}>Career</a></li>
                <li className="mb-2"><a href="/contactus" style={{ color: 'var(--text-color)' }}>Contact</a></li>
                <li className="mb-2"><a href="/projects" style={{ color: 'var(--text-color)' }}>Our Projects</a></li>
              </ul>
            </Col>

            {/* 4. CONTACT DETAILS (UPDATED) */}
            <Col md={4} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Contact</h5>
              
              {/* India Location */}
              <div className="mb-3">
                <strong style={{ color: 'var(--secondary-color)', fontSize: '0.95rem' }}>India</strong>
                <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', marginBottom: '2px' }}>
                  Maruthi Nagar 3rd cross, Near Panda Mini mart, Anantapur, 515001
                </p>
                <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', marginBottom: '0' }}>
                   +91 85220 90765 <br/>
                   inquiries@techxplorers.in
                </p>
              </div>

              {/* Nigeria Location */}
              <div>
                <strong style={{ color: 'var(--secondary-color)', fontSize: '0.95rem' }}>Nigeria</strong>
                <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', marginBottom: '2px' }}>
                  2034 Masaka close Wuse zone 7 FCT Abuja
                </p>
                <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', marginBottom: '0' }}>
                   +2348188560032 <br/>
                   inquiries@techxplorers.in
                </p>
              </div>

            </Col>
          </Row>

          <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
          
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p className="small mb-0" style={{ color: 'var(--text-color)' }}>© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            <div className="small">
              <a href="#" className="me-3" style={{ color: 'var(--text-color)' }}>Privacy Policy</a>
              <a href="#" className="me-3" style={{ color: 'var(--text-color)' }}>Terms of Service</a>
              <a href="#" style={{ color: 'var(--text-color)' }}>Cookie Policy</a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Footer;