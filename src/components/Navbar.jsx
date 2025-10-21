import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import ServicesDropdown from '../components/Services';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthContext';
import '../styles/Navbar.css';

const CustomNavbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { isDarkMode, toggleTheme } = useTheme();
  const [showServicesPopup, setShowServicesPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const servicesTimeoutRef = useRef(null);
  const servicesRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const handleServicesEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    // Only show on hover for larger screens
    if (window.innerWidth >= 992) {
      setShowServicesPopup(true);
    }
  };

 const ROLE_REDIRECT_MAP = {
  'admin': '/adminpage',
  'manager': '/managerworksheet',
  'employee': '/employees',
  'asset': '/assetworksheet',
  'client': '/clientdashboard',
};

  const dashboardPath = user?.roles ? ROLE_REDIRECT_MAP[user.roles] : '/';


  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setShowServicesPopup(false);
    }, 300);
  };
  
  const handleServicesClick = () => {
    // Toggle the popup on click for all screen sizes
    setShowServicesPopup(prev => !prev);
    // If on a small screen, close the main navbar collapse menu
    if (window.innerWidth < 992) {
        document.getElementById('basic-navbar-nav').classList.remove('show');
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
  };

  const handleDashboardClick = () => {
    setShowProfileDropdown(false);
    navigate('/clientdashboard');
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target) && !event.target.closest('.services-popup-wrapper')) {
        setShowServicesPopup(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(servicesTimeoutRef.current);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* --- Style block for the new button and its animation --- */}
      <style>{`
        /* Keyframes for the heartbeat animation */
        @keyframes heartbeat {
          from {
            transform: scale(1);
            box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px 0 rgba(116, 79, 168, 0.55);
          }
          to {
            transform: scale(1);
            box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
          }
        }

        .brand-full {
  font-size: 1.7rem; /* Adjust size as needed */
  font-weight: 700;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%); /* Purple to Violet gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: -0.5px; /* Optional: adjust spacing */
}

        /* Modern Login Button Styles */
        .modern-login-btn {
          padding: 5px 20px;
          border: none;
          font-weight: bold;
          color: black;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          background-image: linear-gradient(45deg, #4a6bd6ff 0%, #76a3f0ff 100%);
          box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
          animation: heartbeat 1.5s ease-in-out infinite both;
        }

        .modern-login-btn:hover {
          background-image: linear-gradient(45deg, #2575fc 0%, #113ccbff 100%);
          box-shadow: 0 8px 25px 0 rgba(37, 117, 252, 0.5);
          animation-play-state: paused; /* Pause animation on hover for easier clicking */
        }
      `}</style>

      <Navbar bg="light" expand="lg" className={`fixed-top shadow-sm border-bottom ${isDarkMode ? 'dark-navbar' : ''}`}>
               <Container fluid>
          {/* Updated Logo Section */}
          <Navbar.Brand as={Link} to="/" className="fw-bold navbar-brand">
  <span className="brand-full">TechXplorers</span>
</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-lg-1 gap-1">
              <NavLink to="/" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                HOME
              </NavLink>
              <Nav.Link
                className="nav-link services-popup-wrapper nav-link-custom"
                onClick={handleServicesClick}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <span>SERVICES</span>
                {showServicesPopup && (
                  <div
                    ref={servicesRef}
                    className="services-dropdown-container"
                    onMouseEnter={() => clearTimeout(servicesTimeoutRef.current)}
                    onMouseLeave={handleServicesLeave}
                  >
                    <ServicesDropdown />
                  </div>
                )}
              </Nav.Link>
              <NavLink to="/careers" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                CAREER
              </NavLink>
              <NavLink to="/aboutus" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                ABOUT US
              </NavLink>
              <NavLink to="/contactus" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                CONTACT
              </NavLink>
            </Nav>

            <div className="d-flex align-items-center gap-3">
              <label className="dark-mode-toggle theme-switch">
                <input type="checkbox" className="theme-switch__checkbox" id="darkModeToggle"
                  checked={isDarkMode}
                  onChange={toggleTheme} />
                <div className="theme-switch__container">
                  <div className="theme-switch__clouds"></div>
                  <div className="theme-switch__stars-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path></svg>
                  </div>
                  <div className="theme-switch__circle-container"><div className="theme-switch__sun-moon-container"><div className="theme-switch__moon"><div className="theme-switch__spot"></div><div className="theme-switch__spot"></div><div className="theme-switch__spot"></div></div></div></div>
                </div>
              </label>
              
              {isLoggedIn ? (
                <div 
                className={`position-relative ${showProfileDropdown ? 'show' : ''}`}
                ref={profileDropdownRef}
              >
                  <img
                    src={user?.avatar || 'https://placehold.co/40x40/6c757d/white?text=P'}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                    onClick={toggleProfileDropdown}
                  />
                  {showProfileDropdown && (
                    <div
                      ref={profileDropdownRef}
                      className="profile-dropdown-menu dropdown-menu show"
                      style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1001 }}
                    >
                      <Dropdown.Item as={Link} to={dashboardPath}  onClick={() => setShowProfileDropdown(false)}>
                        Dashboard
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </div>
                  )}
                </div>
              ) : (
                // UPDATED: Replaced Button with a standard button using the new class
                <button className="modern-login-btn ms-lg-3" onClick={() => navigate('/login')}>
                  LOGIN <span style={{ fontSize: '1.2rem' }}>→</span>
                </button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;