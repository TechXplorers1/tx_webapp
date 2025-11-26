import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import ServicesDropdown from '../components/Services';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthContext';
import '../styles/Navbar.css'; // You can keep your base CSS file

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
    setShowServicesPopup(prev => !prev);
    if (window.innerWidth < 992) {
        const nav = document.getElementById('basic-navbar-nav');
        if(nav) nav.classList.remove('show');
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
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

  // Inline SVGs for the clean look
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  return (
    <>
      <style>{`
        /* Brand Styling */
        .brand-full {
          font-size: 1.7rem;
          font-weight: 700;
          background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        /* Navigation Links Styling */
        .nav-link-custom {
          color: ${isDarkMode ? '#e0e0e0' : '#333'} !important;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.5rem 1rem !important;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
        }

        .nav-link-custom:hover, .nav-link-custom.active {
          color: #4F46E5 !important;
        }

        /* Theme Button Styling */
        .theme-btn-minimal {
          background-color: ${isDarkMode ? '#2d2d2d' : '#f3f4f6'};
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 12px; /* Soft square look */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
          color: ${isDarkMode ? '#fbbf24' : '#4b5563'};
        }
        
        .theme-btn-minimal:hover {
           background-color: ${isDarkMode ? '#3d3d3d' : '#e5e7eb'};
        }

        /* Login Button Styling */
        .login-btn-minimal {
          background-color: transparent;
          border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'};
          color: ${isDarkMode ? '#e0e0e0' : '#1f2937'};
          padding: 8px 20px;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .login-btn-minimal:hover {
          border-color: #4F46E5;
          color: #4F46E5;
          background-color: ${isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#fff'};
        }

        .dark-navbar {
          background-color: #111 !important;
          border-bottom: 1px solid #333 !important;
        }
        
        /* Dropdown positioning fixes */
        .services-dropdown-container {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1050;
        }
      `}</style>

      <Navbar 
        bg={isDarkMode ? 'dark' : 'white'} 
        expand="lg" 
        className={`fixed-top shadow-sm py-3 ${isDarkMode ? 'dark-navbar' : 'bg-white'}`}
      >
        <Container fluid className="px-lg-5">
          {/* 1. Logo Section (Kept as requested) */}
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
            <span className="brand-full">TechXplorers</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* 2. Center Links Section */}
            <Nav className="mx-auto d-flex align-items-center gap-2 gap-lg-4">
               {/* Services with Hover/Click logic */}
               <div 
                className="position-relative services-popup-wrapper"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <div 
                  className="nav-link-custom" 
                  style={{cursor: 'pointer'}}
                  onClick={handleServicesClick}
                >
                  Services <ChevronDown />
                </div>
                {showServicesPopup && (
                  <div ref={servicesRef} className="services-dropdown-container">
                    <ServicesDropdown />
                  </div>
                )}
              </div>

              <NavLink to="/careers" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                Career
              </NavLink>
              <NavLink to="/aboutus" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                About Us
              </NavLink>
              <NavLink to="/contactus" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </Nav>

            {/* 3. Right Side Actions (Theme + Login) */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {/* Minimal Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="theme-btn-minimal"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <MoonIcon /> : <SunIcon />}
              </button>

              {/* Authentication Section */}
              {isLoggedIn ? (
                <div 
                  className={`position-relative ${showProfileDropdown ? 'show' : ''}`}
                  ref={profileDropdownRef}
                >
                  <img
                    src={user?.avatar || 'https://placehold.co/40x40/6c757d/white?text=P'}
                    alt="Profile"
                    className="rounded-circle border"
                    style={{ width: '40px', height: '40px', cursor: 'pointer', objectFit: 'cover' }}
                    onClick={toggleProfileDropdown}
                  />
                  {showProfileDropdown && (
                    <div
                      className="dropdown-menu show dropdown-menu-end"
                      style={{ position: 'absolute', top: '110%', right: '0', zIndex: 1001 }}
                    >
                      <Dropdown.Item as={Link} to={dashboardPath} onClick={() => setShowProfileDropdown(false)}>
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
                <button 
                  className="login-btn-minimal" 
                  onClick={() => navigate('/login')}
                >
                  Login <ArrowRight />
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