import React, {useState, useRef, useEffect} from 'react';
import '../styles/Navbar.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ServicesDropdown from '../components/Services';



const CustomNavbar = ({ scrolled, aboutRef }) => {
    const [showServicesPopup, setShowServicesPopup] = useState(false);

          const navigate = useNavigate();


    const servicesTimeoutRef = useRef(null);
    const servicesRef = useRef(null);
        

     // --- Services handlers ---
  const handleServicesEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setShowServicesPopup(true);
  };       


    const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      if (!servicesRef.current?.matches(':hover')) {
        setShowServicesPopup(false);
      }
    }, 300);
  };

  const handleServicesDropdownLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setShowServicesPopup(false);
    }, 300);
  };

  const handleServicesClick = () => {
  setShowServicesPopup(prev => !prev);
};

const handleClickOutside = (event) => {
  if (
    servicesRef.current &&
    !servicesRef.current.contains(event.target) &&
    !event.target.closest('.services-popup-wrapper')
  ) {
    setShowServicesPopup(false);
  }
};

  useEffect(() => {
    return () => {
      clearTimeout(servicesTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  
  return (
    <Navbar bg="light" expand="lg" className="fixed-top shadow-sm">
      <Container fluid> {/* Changed to Container fluid for full width */}
        {/* Brand Logo */}
<Navbar.Brand href="#home" className="fw-bold navbar-brand">
  <span className="brand-small">TECH</span>
  <span className="brand-x">X</span>
  <span className="brand-small">PLORERS</span>
</Navbar.Brand>


        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links (Centered) */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-lg-5 gap-3"> {/* Improved gap classes */}
            <Nav.Link  className="nav-link-custom" onClick={() => navigate('/')}>HOME</Nav.Link>

             {/* Services */}
            <Nav.Link
              className="nav-link services-popup-wrapper nav-link-custom"
              onClick={handleServicesClick}
                // onMouseEnter={handleServicesEnter}
              // onMouseLeave={handleServicesLeave}
            >
              <span>SERVICES</span>
              {showServicesPopup && (
                <div
                  className="services-dropdown-container"
                  ref={servicesRef}
                  onMouseEnter={() => clearTimeout(servicesTimeoutRef.current)}
                  onMouseLeave={handleServicesDropdownLeave}
                >
                  <ServicesDropdown />
                </div>
              )}
            </Nav.Link>

            <Nav.Link className="nav-link-custom" onClick={() => navigate('/careers')} >CAREER</Nav.Link>
            <Nav.Link className="nav-link-custom" onClick={() => navigate('/aboutus')}>ABOUT US</Nav.Link>
            <Nav.Link className="nav-link-custom" onClick={() => navigate('/contactus')}>CONTACT</Nav.Link>
          </Nav>
        
          {/* Login Button (Right-Aligned) */}
          <Button variant="primary" size="sm" className="ms-lg-3" onClick={() => navigate('/login')}>
            LOGIN
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;