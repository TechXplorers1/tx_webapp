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
    }

    /* Dark Mode Override */
    .dark-mode-footer {
      --secondary-color: #F9FAFB;
      --text-color: #D1D5DB;
      --light-gray: #1F2937;
      --border-color: #374151;
    }

    .footer-modern {
      text-align: center;
      padding: 2rem 0;
    }

    /* --- UNIFIED LINK STYLING --- */
    /* Base Link Style (Replaces inline styles) */
    .footer-link {
      color: var(--text-color) !important;
      text-decoration: none;
      transition: color 0.3s ease;
      margin: 0 0.5rem;
      cursor: pointer;
    }

    /* HOVER: Light Mode (Vivid Purple) */
    .footer-link:hover {
      color: #6D28D9 !important; 
    }

    /* HOVER: Dark Mode (Bright Lavender) */
    /* We target the parent class to override light mode hover */
    .dark-mode-footer .footer-link:hover {
      color: #A78BFA !important;
    }
    
    /* Social Icons specific spacing */
    .social-icons .footer-link {
       margin-right: 15px;
       margin-left: 0;
    }
    .social-icons .footer-link:last-child {
       margin-right: 0;
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
                  <a href="https://www.instagram.com/techxplorers.pvt.ltd/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.2rem' }}>
                  <FaInstagram />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61571029190090" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.2rem' }}>
                  <FaFacebookF />
                </a>
                  <a href="https://x.com/techXplorers_" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.2rem' }}>
                  <FaTwitter />
                </a>
                 <a href="https://www.linkedin.com/company/techxplorers-private-limited/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '1.2rem' }}>
                  <FaLinkedinIn />
                </a>
              </div>
            </Col>

            {/* 2. SERVICES LINKS */}
            <Col md={2} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Services</h5>
              <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
                <li className="mb-2"><a href="/services/mobile-app-development" className="footer-link">Mobile App</a></li>
                <li className="mb-2"><a href="/services/web-app-development" className="footer-link">Web App</a></li>
                <li className="mb-2"><a href="/services/digital-marketing" className="footer-link">Digital Marketing</a></li>
                <li className="mb-2"><a href="/services/it-talent-supply" className="footer-link">IT Talent Supply</a></li>
                <li className="mb-2"><a href="/services/job-support" className="footer-link">Job Support & IT</a></li>
                <li className="mb-2"><a href="/services/cyber-security" className="footer-link">Cyber Security</a></li>
              </ul>
            </Col>

            {/* 3. COMPANY LINKS */}
            <Col md={2} className="text-start">
              <h5 style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Company</h5>
              <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
                <li className="mb-2"><a href="/aboutus" className="footer-link">About Us</a></li>
                <li className="mb-2"><a href="/careers" className="footer-link">Career</a></li>
                <li className="mb-2"><a href="/contactus" className="footer-link">Contact</a></li>
                <li className="mb-2"><a href="/projects" className="footer-link">Our Projects</a></li>
              </ul>
            </Col>

            {/* 4. CONTACT DETAILS */}
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
              <a href="/privacy-policy" className="footer-link me-3">Privacy Policy</a>
              <a href="/terms-of-service" className="footer-link me-3">Terms of Service</a>
              <a href="/cookie-policy" className="footer-link">Cookie Policy</a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Footer;