import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getDatabase, ref, onValue, query, orderByChild, equalTo, update, remove, set } from "firebase/database";
import { database, storage } from '../../firebase'; // Import your Firebase config
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { utils, writeFile } from 'xlsx'; // Corrected import: Using named exports
import 'bootstrap-icons/font/bootstrap-icons.css'; // For icons in Applications tab
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // For modals in Applications tab and others
import { FaCalendarAlt } from 'react-icons/fa'; // For calendar icon in Applications tab

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const documentTypes = {
  Resumes: 'resume',
  CoverLetters: 'cover letter',
  Interviews: 'interview screenshot',
  Offers: 'offers', // Assuming 'Offers' corresponds to 'portfolio' type
  Portfolio: 'portfolio',
  Others: 'other'
};

// --- Styled Components for Radio ---
const StyledWrapper = styled.div`
  .glass-radio-group {
    --bg: rgba(255, 255, 255, 0.06);
    --text: #e5e5e5;

    display: flex;
    position: relative;
    background: var(--bg);
    border-radius: 1rem;
    backdrop-filter: blur(12px);
    box-shadow:
      inset 1px 1px 4px rgba(255, 255, 255, 0.2),
      inset -1px -1px 6px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: fit-content;
  }

  @media (max-width: 480px) {
      .glass-radio-group {
          flex-direction: column; /* Stack radio buttons on very small screens */
          width: 80%; /* Wider to accommodate stacked labels */
          border-radius: 1rem;
          padding: 10px 0; /* Add vertical padding */
      }
      .glass-glider {
          display: none; /* Hide glider when stacked */
      }
  }

  .glass-radio-group input {
    display: none;
  }

  .glass-radio-group label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    font-size: 14px;
    padding: 0.8rem 1.6rem;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--text);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease-in-out;
  }

  .glass-radio-group label:hover {
    color: white;
  }

  .glass-radio-group input:checked + label {
    color: #fff;
  }

  .glass-glider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(100% / 3);
    border-radius: 1rem;
    z-index: 1;
    transition:
      transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56),
      background 0.4s ease-in-out,
      box-shadow 0.4s ease-in-out;
  }

  /* Silver */
  #glass-silver:checked ~ .glass-glider {
    transform: translateX(0%);
    background: linear-gradient(135deg, #c0c0c055, #e0e0e0);
    box-shadow:
      0 0 18px rgba(192, 192, 192, 0.5),
      0 0 10px rgba(255, 255, 255, 0.4) inset;
  }

  /* Gold */
  #glass-gold:checked ~ .glass-glider {
    transform: translateX(100%);
    background: linear-gradient(135deg, #ffd70055, #ffcc00);
    box-shadow:
      0 0 18px rgba(255, 215, 0, 0.5),
      0 0 10px rgba(255, 235, 150, 0.4) inset;
  }

  /* Platinum */
  #glass-platinum:checked ~ .glass-glider {
    transform: translateX(200%);
    background: linear-gradient(135deg, #d0e7ff55, #a0d8ff);
    box-shadow:
      0 0 18px rgba(160, 216, 255, 0.5),
      0 0 10px rgba(200, 240, 255, 0.4) inset;
  }
`;

// Radio Component (now accepts props for controlled state)
const Radio = ({ selectedRadioPlan, handleRadioPlanChange }) => {
  return (
    <StyledWrapper>
      <div className="glass-radio-group">
        <input
          type="radio"
          name="plan"
          id="glass-silver"
          checked={selectedRadioPlan === 'glass-silver'}
          onChange={() => handleRadioPlanChange('glass-silver')}
        />
        <label htmlFor="glass-silver">Silver</label>
        <input
          type="radio"
          name="plan"
          id="glass-gold"
          checked={selectedRadioPlan === 'glass-gold'}
          onChange={() => handleRadioPlanChange('glass-gold')}
        />
        <label htmlFor="glass-gold">Gold</label>
        <input
          type="radio"
          name="plan"
          id="glass-platinum"
          checked={selectedRadioPlan === 'glass-platinum'}
          onChange={() => handleRadioPlanChange('glass-platinum')}
        />
        <label htmlFor="glass-platinum">Platinum</label>
        <div className="glass-glider" /> {/* This will be dynamically styled by the parent */}
      </div>
    </StyledWrapper>
  );
};


// --- ClientHeader Component ---
const ClientHeader = ({
  clientUserName,
  clientInitials,
  onLogoClick,
  isDarkMode,
  toggleTheme,
  toggleSidebar, // This prop is no longer used for the hamburger menu, but kept for consistency
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  onClientProfileClick,
  onSubscriptionClick,
  unreadNotificationsCount,
  onNotificationClick,
  onLogoutClick,
  activeServices,
  inactiveServices,
  onActiveServiceClick,
  onInactiveServiceClick
}) => {

  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesMenuRef = useRef(null);

  // Effect to close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if profileDropdownRef.current exists and if the click is outside it
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef, setIsProfileDropdownOpen]); // Dependencies: profileDropdownRef and setIsProfileDropdownOpen

  useEffect(() => {
    const handleClickOutsideServices = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };
    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideServices);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideServices);
  }, [isServicesDropdownOpen]);

  return (
    <>
      {/* Inline styles for ClientHeader */}
      <style>
        {`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* CSS Variables for theming (Header specific) */
        :root {
          --bg-header: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --shadow-color-1: rgba(0, 0, 0, 0.05);
          --icon-color: #6b7280;
          --client-avatar-bg: #1f2937;
          --client-avatar-text: #ffffff;
          --logo-x-color: #2563eb;
          --client-tag-bg: #e0f2f7;
          --client-tag-text: #0891b2;
          --bg-nav-link-hover: #f9fafb; /* For dropdown items */
        }

        html.dark-mode { /* Re-added dark mode styles */
          --bg-header: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --shadow-color-1: rgba(0, 0, 0, 0.2);
          --icon-color: #cbd5e0;
          --client-avatar-bg: #4299e1;
          --client-avatar-text: #ffffff;
          --logo-x-color: #4299e1;
          --client-tag-bg: #fbd38d;
          --client-tag-text: #6b4617;
          --bg-nav-link-hover: #4a5568; /* For dropdown items */
        }

        /* Profile Dropdown Styles */
        .profile-dropdown-container {
          position: relative;
          cursor: pointer;
          z-index: 60; /* Higher than header for dropdown to appear on top */
        }

        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem); /* Position below the avatar */
          right: 0;
          background-color: var(--bg-header); /* Use header background for consistency */
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--border-color);
          min-width: 12rem;
          padding: 0.5rem 0;
          list-style: none;
          margin: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out;
        }

        .profile-dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .profile-dropdown-item {
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background-color 0.15s ease;
        }
          
          .header-button-item {
            position: relative; /* Needed for the dropdown positioning */
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            background-color: transparent;
            border: 1px solid transparent;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;
          }

          .header-button-item:hover {
            background-color: var(--bg-nav-link-hover);
            color: var(--text-primary);
          }

          .services-dropdown-menu {
            position: absolute;
            top: calc(100% + 0.5rem); /* Position below the button */
            right: 0;
            background-color: var(--bg-header);
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid var(--border-color);
            min-width: 16rem; /* Wider for service names */
            padding: 0.5rem 0;
            list-style: none;
            margin: 0;
            z-index: 70; /* Above other content but below profile dropdown if needed */
          }

          .services-dropdown-header {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 0.5rem;
          }

          .services-dropdown-item {
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: background-color 0.15s ease;
            cursor: pointer;
          }

          .services-dropdown-item:hover {
            background-color: var(--bg-nav-link-hover);
          }

        .profile-dropdown-item:hover {
          background-color: var(--bg-nav-link-hover);
        }

        .profile-dropdown-item.header {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }

        .profile-dropdown-item.logout {
          color: #ef4444; /* Red for logout */
        }

        .profile-dropdown-item.logout:hover {
          background-color: #fee2e2; /* Light red background on hover */
        }

        /* Top Navigation Bar */
        .ad-header {
          background-color: var(--bg-header);
          box-shadow: 0 1px 2px 0 var(--shadow-color-1);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .ad-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .ad-logo {
          display: flex;
          align-items: center;
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .ad-logo-x {
          color: var(--logo-x-color);
        }

        .ad-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ad-icon-btn {
          color: var(--icon-color);
          font-size: 1.125rem;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-icon-btn:hover {
          color: #2563eb;
        }

        .ad-notification-icon {
          position: relative;
          cursor: pointer; /* Make it clear it's clickable */
        }

        .ad-notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background-color: #ef4444;
          color: #ffffff;
          font-size: 0.75rem;
          border-radius: 9999px;
          height: 1rem;
          width: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          ${unreadNotificationsCount === 0 ? 'display: none;' : ''} /* Hide badge if no notifications */
        }

        .ad-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ad-user-info-text {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }

        @media (min-width: 768px) {
          .ad-user-info-text {
            display: flex;
          }
        }

        .ad-user-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        .ad-user-email {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        /* Initials Avatar Styles */
        .ad-initials-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background-color: var(--client-avatar-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ad-initials-text {
          color: var(--client-avatar-text);
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Client Tag in Header */
        .ad-client-tag {
            background-color: var(--client-tag-bg);
            color: var(--client-tag-text);
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 0.5rem;
            white-space: nowrap;
            display: inline-flex; /* Ensure it behaves like a tag */
            align-items: center;
            gap: 0.25rem;
        }

        /* Hamburger menu is removed, so no styles are needed for it */
        `}
      </style>
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
            <span>Tech</span>
            <span className="ad-logo-x">X</span>
            <span>plorers</span>
          </div>
        </div>

        <div className="ad-header-right">
          <li className="profile-dropdown-item" onClick={onSubscriptionClick}>
            {/* Credit Card Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
              <path d="M22 9H2C1.44772 9 1 9.44772 1 10V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V10C23 9.44772 22.5523 9 22 9ZM3 11V18H21V11H3ZM22 4H2C1.44772 4 1 4.44772 1 5V7C1 7.55228 1.44772 8 2 8H22C22.5523 8 23 7.55228 23 7V5C23 4.44772 22.5523 4 22 4Z" />
            </svg>
            Subscription
          </li>

          <div className="header-button-item" onMouseEnter={() => setIsServicesDropdownOpen(true)} onMouseLeave={() => setIsServicesDropdownOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            Services
            {isServicesDropdownOpen && (
              <ul className="services-dropdown-menu">
                <li className="services-dropdown-header">Active Services</li>
                {activeServices.length > 0 ? (
                  activeServices.map(service => (
                    <li key={service.path} className="services-dropdown-item" onClick={() => onActiveServiceClick(service)}>
                      {service.title}
                    </li>
                  ))
                ) : (
                  <li className="services-dropdown-item" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No active services</li>
                )}

                <li className="services-dropdown-header" style={{ marginTop: '0.5rem' }}>Inactive Services</li>
                {inactiveServices.map(service => (
                  <li key={service.path} className="services-dropdown-item" onClick={() => onInactiveServiceClick(service.path)}>
                    {service.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ad-notification-icon" onClick={onNotificationClick}>
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="ad-notification-badge">{unreadNotificationsCount}</span>
            )}
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(prev => !prev)}>
              <div className="ad-user-info-text">
                <p className="ad-user-name">{clientUserName}</p>
                <span className="ad-client-tag">
                  {/* User Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Client
                </span>
              </div>
              <div className="ad-initials-avatar">
                <span className="ad-initials-text">{clientInitials}</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li className="profile-dropdown-item header">My Account</li>
                <li className="profile-dropdown-item" onClick={onClientProfileClick}>
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Your Profile
                </li>

                {/* <li className="profile-dropdown-item logout" onClick={onLogoutClick}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M10 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H10C10.5523 20 11 19.5523 11 19V17H13V19C13 20.6569 11.6569 22 10 22H4C2.34315 22 1 20.6569 1 19V5C1 3.34315 2.34315 2 4 2H10C11.6569 2 13 3.34315 13 5V7H11V5C11 4.44772 10.5523 4 10 4ZM19.2929 10.2929L22.2929 13.2929C22.6834 13.6834 22.6834 14.3166 22.2929 14.7071L19.2929 17.7071C18.9024 18.0976 18.2692 18.0976 17.8787 17.7071C17.4882 17.3166 17.4882 16.6834 17.8787 16.2929L19.5858 14.5858H11C10.4477 14.5858 10 14.1381 10 13.5858C10 13.0335 10.4477 12.5858 11 12.5858H19.5858L17.8787 10.8787C17.4882 10.4882 17.4882 9.85497 17.8787 9.46447C18.2692 9.07395 18.9024 9.07395 19.2929 9.46447Z" />
                  </svg>
                  Log out
                </li> */}
              </ul>
            )}
          </div>
        </div>

        {/* Removed the hamburger menu button */}
      </header>
    </>
  );
};


// --- Dimming Overlay Component ---
const DimmingOverlay = ({ isVisible, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: isVisible ? 90 : -1, // Z-index needs to be below modals (100) but above content and header dropdown (60)
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    />
  );
};


// --- ClientProfile Component ---
const ClientProfile = ({
  profilePlaceholder, // Not used in this version but kept for consistency with original prop signature
  clientUserName, // Not used in this version but kept for consistency with original prop signature
  onClose
}) => {
  return (
    <div className="modal-overlay">
    </div>
  );
};

// --- SubscriptionDetailsModal Component ---
const SubscriptionDetailsModal = ({
  togglePaymentModal,
  currentPlanPrice,
  daysLeftInPlan,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '500px', padding: '40px', background: '#ffffff', color: '#1e293b' }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: '#64748B' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: '#1e293b',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          Your Subscription Details
        </h3>
        <div className="subscription-details-card" style={{ background: '#f8fafc', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="subscription-detail-item" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <p className="subscription-detail-label" style={{ color: '#64748b' }}>Current Plan</p>
            <strong className="subscription-detail-value" style={{ color: '#1e293b' }}>1 Month Plan</strong>
          </div>
          <div className="subscription-detail-item" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <p className="subscription-detail-label" style={{ color: '#64748b' }}>Price</p>
            <strong className="subscription-detail-value" style={{ color: '#1e293b' }}>{currentPlanPrice}</strong>
          </div>
          <div className="subscription-detail-item" style={{ borderBottom: 'none' }}>
            <p className="subscription-detail-label" style={{ color: '#64748b' }}>Days Left</p>
            <strong className="subscription-detail-value" style={{ color: '#1e293b' }}>{daysLeftInPlan}</strong>
          </div>
        </div>
        <button
          onClick={() => { onClose(); togglePaymentModal(); }}
          className="renew-button-style"
          style={{ marginTop: '30px' }}
        >
          Renew Plan
        </button>
      </div>
    </div>
  );
};

// --- PaymentOptionsModal Component (NEW) ---
const PaymentOptionsModal = ({ onClose, selectedPlanName, selectedPlanPrice }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Default to card

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayClick = () => {
    console.log(`Processing payment for ${selectedPlanName} plan (${selectedPlanPrice}) via ${selectedPaymentMethod}`);
    // In a real application, this would trigger a payment gateway integration
    // For now, just close the modal after a short delay
    setTimeout(() => {
      onClose();
      // Optionally show a success message or navigate
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal-content-wrapper">
        <button onClick={onClose} className="modal-close-button" style={{ top: '20px', right: '20px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="payment-modal-grid">
          {/* Payment Information Section */}
          <div className="payment-info-section">
            <div className="payment-section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Payment Information
              <span className="ssl-badge">256-bit SSL</span>
            </div>

            <h4 className="payment-sub-heading">Choose Payment Method</h4>
            <div className="payment-method-options">
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>Visa + Mastercard - Amex</span>
              </div>
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('paypal')}
              >
                <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal" style={{ height: '24px' }} />
                <span>Pay with PayPal</span>
              </div>
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'direct_transfer' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('direct_transfer')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Direct transfer</span>
              </div>
            </div>

            <p className="all-methods-secured">All methods secured</p>

            {/* Card Payment Form (visible if 'card' is selected) */}
            {selectedPaymentMethod === 'card' && (
              <div className="card-form">
                <label htmlFor="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" placeholder="john@example.com" />

                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />

                <div className="form-row">
                  <div>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" />
                  </div>
                </div>

                <label htmlFor="cardholderName">Cardholder Name</label>
                <input type="text" id="cardholderName" placeholder="John Doe" />

                <div className="checkbox-group">
                  <input type="checkbox" id="saveCard" />
                  <label htmlFor="saveCard">Save this card for future payments</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" id="rememberMe" defaultChecked />
                  <label htmlFor="rememberMe">Remember me for faster checkout</label>
                </div>
              </div>
            )}

            {/* PayPal Details (visible if 'paypal' is selected) */}
            {selectedPaymentMethod === 'paypal' && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                color: '#1e293b', // Dark text for light mode
                background: '#f8fafc',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe', // Light blue background for icon
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>Continue with PayPal</h3>
                <p style={{ fontSize: '1rem', color: '#475569', margin: '0' }}>
                  You'll be securely redirected to PayPal to complete your payment of
                  <span style={{ fontWeight: '600', color: '#1e293b', marginLeft: '5px' }}>{selectedPlanPrice}</span>
                </p>
                <button
                  onClick={() => {
                    // In a real app, this would initiate PayPal redirect
                    window.open('https://www.paypal.com', '_blank'); // Placeholder for actual PayPal redirection
                    onClose(); // Close modal after initiating redirect
                  }}
                  style={{
                    background: '#0070BA', // PayPal blue
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s, transform 0.2s',
                    width: 'fit-content', // Adjust width to content
                    margin: '0 auto' // Center the button
                  }}
                >
                  <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal Icon" style={{ height: '20px', filter: 'brightness(0) invert(1)' }} />
                  Continue to PayPal
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {/* Direct Transfer/Bank Transfer Details (visible if 'direct_transfer' is selected) */}
            {selectedPaymentMethod === 'direct_transfer' && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#1e293b', // Dark text for light mode
                background: '#f8fafc',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe', // Light blue background for icon
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>Bank Transfer Details</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0' }}>Secure wire transfer information</p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  width: '100%',
                  maxWidth: '500px',
                  margin: '20px 0'
                }}>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Bank Name:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>TechXplorers Business Bank</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Account Number:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>1234567890</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Routing Number:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>021000021</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Reference:</p>
                    <strong style={{ fontSize: '1rem', color: '#047857' }}>INV-ADMIN-1752558009349</strong>
                  </div>
                </div>

                <div style={{
                  background: '#fffbe0', // Light yellow background
                  border: '1px solid #ffe0b2', // Orange border
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%',
                  maxWidth: '500px',
                  textAlign: 'left'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#78350f' }}>
                    <strong style={{ color: '#f59e0b' }}>Important Instructions:</strong> Please include the reference number <strong style={{ color: '#f59e0b' }}>INV-ADMIN-1752558009349</strong> in your transfer description to ensure proper processing.
                  </p>
                </div>
              </div>
            )}

            <div className="payment-buttons">
              <button className="cancel-button" onClick={onClose}>Cancel</button>
              {/* The "Pay" button only makes sense for card or PayPal direct action.
                  For bank transfer, the user has to manually transfer. */}
              {selectedPaymentMethod === 'card' && (
                <button className="pay-button" onClick={handlePayClick}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M12 1v22"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Pay {selectedPlanPrice}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="payment-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Order Summary
            </div>

            <div className="summary-card">
              <div className="summary-item-logo">
                <img src="https://placehold.co/40x40/475569/ffffff?text=TX" alt="TechXplorers Logo" style={{ borderRadius: '8px' }} />
                <div>
                  <p className="summary-main-text">TechXplorers</p>
                  <p className="summary-sub-text">Verified Merchant</p>
                </div>
              </div>
              <div className="summary-rating">
                <span className="star-icon">⭐</span>4.9/5 <span className="reviews-count">(2,847 reviews)</span>
              </div>

              <div className="summary-divider"></div>

              <h5 className="summary-sub-heading">Bill To:</h5>
              <div className="bill-to-details">
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> John Smith</p>
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> john@example.com</p>
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2.003 16.92 16.92 0 0 1-13.82-13.82A2.003 2.003 0 0 1 3.08 2H6.1a2 2 0 0 1 1.95 1.54L9 8.23a2 2 0 0 1-1.1 2.13 11.05 11.05 0 0 0 5.85 5.85 2 2 0 0 1 2.13-1.1l4.69-1.95a2 2 0 0 1 1.54 1.95z"></path></svg> +91 1234567890</p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line-item">
                <span>Invoice:</span>
                <span>#INV-001</span>
              </div>
              <div className="summary-line-item">
                <span>Service:</span>
                <span>Executive and senior management team</span>
              </div>
              <div className="summary-line-item">
                <span>Subtotal:</span>
                <span>USD {selectedPlanPrice.replace('$', '')}</span>
              </div>
              <div className="summary-line-item">
                <span>Processing Fee:</span>
                <span className="included-text">Included</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>USD {selectedPlanPrice.replace('$', '')}</span>
              </div>
            </div>

            <div className="security-trust-info">
              <h5 className="summary-sub-heading">Security & Trust</h5>
              <p><span className="green-dot"></span> 256-bit SSL</p>
              <p><span className="green-dot"></span> PCI Compliant</p>
              <p><span className="green-dot"></span> Fraud Protection</p>
              <p><span className="green-dot"></span> Encrypted</p>
            </div>

            <button className="back-to-dashboard-button" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M10 12L6 8L10 4"></path>
              </svg>
              Back to Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- PaymentPlanModal Component ---
const PaymentPlanModal = ({ selectedRadioPlan, handleRadioPlanChange, handleProceedToPayment, onClose }) => {
  const planOptions = {
    'glass-silver': { name: 'Silver', price: '$199', period: '/month', features: ['Full dashboard access', 'Monthly chart updates', 'Basic support'] },
    'glass-gold': { name: 'Gold', price: '$499', period: '/3 months', features: ['All Silver features', 'Priority support', 'Quarterly review calls'] },
    'glass-platinum': { name: 'Platinum', price: '$999', period: '/year', features: ['All Gold features', 'Dedicated account manager', 'Annual strategic planning session'] },
  };
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];

  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '600px', padding: '40px', background: '#334155', color: '#f1f5f9' }}>
        <button onClick={onClose} className="modal-close-button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: '#f1f5f9',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          Choose Your Plan
        </h3>

        {/* Integrated Radio Component */}
        <div style={{ margin: '20px auto 30px auto', width: 'fit-content' }}>
          <Radio
            selectedRadioPlan={selectedRadioPlan}
            handleRadioPlanChange={handleRadioPlanChange}
          />
        </div>


        {/* Display details of the currently selected plan */}
        {currentSelectedPlanDetails && (
          <div style={selectedPlanDetailsStyle}>
            <h4 style={paymentPlanTitleStyle}>{currentSelectedPlanDetails.name} Plan</h4>
            <p style={paymentPlanPriceStyle}>
              {currentSelectedPlanDetails.price}
              <span style={paymentPlanPeriodStyle}>{currentSelectedPlanDetails.period}</span>
            </p>
            <ul style={paymentPlanFeaturesListStyle}>
              {currentSelectedPlanDetails.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4ade80' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleProceedToPayment(currentSelectedPlanDetails.name, currentSelectedPlanDetails.price)}
              style={paymentPlanSelectButtonStyle}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- NotificationModal Component ---
const NotificationModal = ({ notifications, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '500px', padding: '40px', background: '#ffffff', color: '#1e293b' }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: '#64748B' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#1e293b', fontSize: '1.8rem', fontWeight: '700' }}>
          Notifications
        </h3>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No new notifications.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map((notification, index) => (
              <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                <p style={{ fontWeight: '600', marginBottom: '5px' }}>{notification.title}</p>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{notification.message}</p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{notification.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- AttachmentModal Component ---
// In ClientDashboard.jsx, replace the existing AttachmentModal with this version.

// --- AttachmentModal Component ---
const AttachmentModal = ({ attachments, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '700px', padding: '40px', background: '#ffffff', color: '#1e293b' }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: '#64748B' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#1e293b', fontSize: '1.8rem', fontWeight: '700' }}>
          Interview Attachments
        </h3>
        {attachments.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No attachments available for this interview.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {attachments.map((attachment, index) => (
              // MODIFICATION: Wrap image in an anchor (<a>) tag to make it clickable
              <a
                key={attachment.downloadUrl || index}
                href={attachment.downloadUrl} // <-- Set link destination
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '200px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer', // <-- Add pointer cursor
                  transition: 'transform 0.2s ease'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    // FIX: Use the 'downloadUrl' property from the attachment object
                    src={attachment.downloadUrl}
                    // MODIFICATION: Use the attachment name for better accessibility
                    alt={attachment.name || `Attachment ${index + 1}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150/e2e8f0/64748B?text=Image+Error'; }}
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Mock DateRangeCalendar ---
const DateRangeCalendar = ({ initialStartDate, initialEndDate, onSelectRange }) => {
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);

  useEffect(() => {
    onSelectRange(start, end);
  }, [start, end, onSelectRange]);

  const handleStartDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setStart(newDate);
  };

  const handleEndDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setEnd(newDate);
  };

  const formatToInputDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Date Range:</p>
      <Form.Group controlId="tempStartDate" className="mb-3">
        <Form.Label>From Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(start)}
          onChange={handleStartDateChange}
        />
      </Form.Group>
      <Form.Group controlId="tempEndDate" className="mb-3">
        <Form.Label>To Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(end)}
          onChange={handleEndDateChange}
        />
      </Form.Group>
    </div>
  );
};

// --- HELPER FUNCTIONS ---

// Format date as DD-MM-YYYY
const formatDate = (date) => {
  if (!date) return ''; // Handle empty date
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format date string from DD-MM-YYYY to YYYY-MM-DD for Date constructor
const convertDDMMYYYYtoYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-'); // ["DD", "MM", "YYYY"]
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // "YYYY-MM-DD"
  }
  return dateString; // Return as is if format is unexpected
};


// Generate 7-day date range for the ribbon
const generateDateRange = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

// --- SAMPLE APPLICATIONS DATA ---
const applicationsData = {
  [formatDate(new Date())]: [ // Today's date
    { id: 1, jobId: 'Tx101', website: 'LinkedIn', position: 'Frontend Developer', company: 'Tech Corp', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Develop and maintain web applications using React.js, proficient in HTML, CSS, JavaScript, and modern front-end build tools.' },
    { id: 10, jobId: 'Tx110', website: 'Company Site', position: 'Fullstack Engineer', company: 'Innovate Solutions', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Design, develop, and deploy full-stack applications with expertise in Node.js, Python, and database management (SQL/NoSQL).' },
    { id: 11, jobId: 'Tx111', website: 'Indeed', position: 'DevOps Specialist', company: 'CloudWorks', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Implement and manage CI/CD pipelines, automate infrastructure using tools like Docker, Kubernetes, and Ansible. Cloud platform experience (AWS/Azure/GCP) is a plus.' },
    { id: 12, jobId: 'Tx112', website: 'Glassdoor', position: 'QA Engineer', company: 'Quality First', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Execute test plans, identify and document software defects, and contribute to the overall quality assurance process for web and mobile applications.' },
    { id: 13, jobId: 'Tx113', website: 'LinkedIn', position: 'Product Designer', company: 'Creative Minds', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Create intuitive and engaging user experiences through wireframes, prototypes, and user flows. Proficient in Figma, Sketch, or Adobe XD.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))]: [ // Yesterday
    { id: 2, jobId: 'Tx102', website: 'Indeed', position: 'Backend Engineer', company: 'Data Systems', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), jobDescription: 'Develop robust server-side logic and APIs using Java Spring Boot. Experience with RESTful services and microservices architecture is required.' },
    { id: 14, jobId: 'Tx114', website: 'Company Site', position: 'Data Scientist', company: 'Analytics Inc.', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), jobDescription: 'Analyze large datasets to extract actionable insights. Build predictive models using machine learning techniques and Python/R.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 2)))]: [ // Two days ago
    { id: 3, jobId: 'Tx103', website: 'Glassdoor', position: 'Product Manager', company: 'Innovate Inc', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Define product vision, strategy, and roadmap. Collaborate with engineering, design, and marketing teams to deliver successful products.' },
    { id: 4, jobId: 'Tx104', website: 'AngelList', position: 'Startup Engineer', company: 'New Ventures', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Work across the stack in a fast-paced startup environment. Opportunity to contribute to all phases of product development.' },
    { id: 15, jobId: 'Tx115', website: 'LinkedIn', position: 'Mobile Developer', company: 'AppGenius', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Develop native iOS or Android applications. Strong knowledge of Swift/Kotlin and mobile UI/UX principles.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 3)))]: [ // Three days ago
    { id: 16, jobId: 'Tx116', website: 'Indeed', position: 'Network Administrator', company: 'SecureNet', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))), jobDescription: 'Manage and maintain network infrastructure, troubleshoot connectivity issues, and ensure network security and performance.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 4)))]: [ // Four days ago
    { id: 17, jobId: 'Tx117', website: 'Company Site', position: 'Cybersecurity Analyst', company: 'Guardian Systems', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 4))), jobDescription: 'Monitor security systems, respond to incidents, and implement security measures to protect organizational data and systems.' },
    { id: 18, jobId: 'Tx118', website: 'LinkedIn', position: 'Technical Writer', company: 'DocuWrite', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 4))), jobDescription: 'Produce clear, concise, and comprehensive technical documentation for software products, including user manuals and API documentation.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 5)))]: [ // Five days ago
    { id: 19, jobId: 'Tx119', website: 'Glassdoor', position: 'Scrum Master', company: 'Agile Teams', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 5))), jobDescription: 'Facilitate agile ceremonies, remove impediments, and coach development teams in Scrum principles and practices to maximize delivery.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 6)))]: [ // Six days ago
    { id: 20, jobId: 'Tx120', website: 'CloudComputing', position: 'Cloud Engineer', company: 'Sky Computing', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), jobDescription: 'Design, deploy, and manage cloud-based solutions on AWS, Azure, or GCP. Experience with cloud automation and cost optimization.' },
    { id: 21, jobId: 'Tx121', website: 'Other', position: 'Marketing Specialist', company: 'Brand Boost', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), jobDescription: 'Develop and execute digital marketing campaigns, analyze market trends, and manage social media presence to enhance brand visibility.' },
  ],
  // Add more applications for dates in the future or past as needed for testing scrolling
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))]: [ // Tomorrow
    { id: 22, jobId: 'Tx122', website: 'LinkedIn', position: 'Senior Software Architect', company: 'Innovate Tomorrow', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), jobDescription: 'Lead the architectural design and development of complex software systems, ensuring scalability, reliability, and performance.' }
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 2)))]: [ // Day after tomorrow
    { id: 23, jobId: 'Tx123', website: 'Indeed', position: 'Lead Data Scientist', company: 'Future AI', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() + 2))), jobDescription: 'Lead a team of data scientists to develop and deploy advanced analytical solutions and machine learning models.' }
  ],
};


// --- Applications Tab Content ---
const Applications = ({
  selectedDate, setSelectedDate, dateRange, currentStartDate, setCurrentStartDate,
  showPreviousWeek, showNextWeek, searchTerm, setSearchTerm,
  startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter,
  showDateRangeModal, setShowDateRangeModal, tempStartDate, setTempStartDate, tempEndDate, setTempEndDate,
  handleDateRangeChangeFromCalendar, handleApplyDateRange, handleClearDateRangeInModal,
  showJobDescriptionModal, setShowJobDescriptionModal, currentJobDescription, setCurrentJobDescription,
  handleOpenJobDescriptionModal, handleCloseJobDescriptionModal,
  filterWebsites, setFilterWebsites, filterPositions, setFilterPositions, filterCompanies, setFilterCompanies,
  uniqueWebsites, uniquePositions, uniqueCompanies,
  showFilterModal, setShowFilterModal, tempSelectedWebsites, setTempSelectedWebsites, tempSelectedPositions, setTempSelectedPositions, tempSelectedCompanies, setTempSelectedCompanies,
  handleOpenFilterModal, handleCloseFilterModal, handleApplyCategoricalFilters, handleClearTempFiltersInModal,
  handleWebsiteCheckboxChange, handlePositionCheckboxChange, handleCompanyCheckboxChange,
  isGlobalFilterActive, clearAllFilters, getApplicationsSectionTitle, filteredApplicationsForDisplay,
  downloadApplicationsData, applicationsData, allApplicationsFlattened,
  activeWorksheetTab, setActiveWorksheetTab // New prop to control worksheet tabs
}) => {


  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Date navigation with arrows and horizontal scroll */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        background: '#fff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={showPreviousWeek}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px',
            flexShrink: 0
          }}
        >
          ◀
        </button>

        <div style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px 0',
          flexGrow: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <div style={{ display: 'inline-flex', gap: '8px' }}>
            {dateRange.map((date) => (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  backgroundColor: selectedDate === date ? '#007bff' : '#e9ecef',
                  color: selectedDate === date ? 'white' : '#333',
                  cursor: 'pointer',
                  minWidth: '100px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedDate === date ? '0 2px 5px rgba(0,123,255,0.3)' : 'none',
                  flexShrink: 0
                }}
              >
                {date}
                {applicationsData[date] && (
                  <div style={{
                    fontSize: '12px',
                    marginTop: '5px',
                    fontWeight: 'bold',
                    color: selectedDate === date ? 'rgba(255,255,255,0.8)' : '#666'
                  }}>
                    {applicationsData[date].length} application(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={showNextWeek}
          disabled={new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + 7).getTime() > new Date().getTime()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '16px',
            opacity: new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + 7).getTime() > new Date().getTime() ? 0.5 : 1,
            flexShrink: 0
          }}
        >
          ▶
        </button>
      </div>

      {/* Applications section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 auto', color: '#333' }}>
            {getApplicationsSectionTitle()}
          </h3>
        </div>

        {/* Download Button (Left), and Search Bar + Date Range (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', // Pushes left group and right group to ends
          alignItems: 'center',
          marginBottom: '15px',
          flexWrap: 'wrap', // Allows wrapping on smaller screens
          gap: '10px' // Gap between items when wrapped
        }}>
          {/* Left Group: Download button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={downloadApplicationsData}
              disabled={!filteredApplicationsForDisplay.length}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !filteredApplicationsForDisplay.length ? 0.5 : 1,
                transition: 'all 0.2s',
                flexShrink: 0 // Prevent shrinking
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </button>

            {/* Clear All Filters Button (Always present with global filters) */}
            {isGlobalFilterActive && (
              <button
                onClick={clearAllFilters}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="bi bi-x-circle"></i>
                Clear All Filters
              </button>
            )}
          </div>

          {/* Right Group: Search Bar + Date Range (Always open) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // Gap between search and date picker
            flexWrap: 'wrap', // Allow wrapping for responsiveness
            justifyContent: 'flex-end', // Aligns this entire group to the right
            flexGrow: 1, // Allows this group to take available space
          }}>
            {/* Search Bar (Always open at fixed size) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                borderRadius: '25px',
                padding: '8px 18px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '250px', // Fixed width as requested
                transition: 'width 0.3s ease-in-out',
              }}
            >
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  flexGrow: 1,
                  fontSize: '1rem',
                  padding: '0',
                  width: '100%', // Take full width of its container
                  color: '#333',
                  whiteSpace: 'nowrap',
                }}
              />
              {/* Removed FaSearch icon here as per request 1 */}
            </div>

            {/* Combined Date Range Picker Icon Trigger */}
            <div
              onClick={() => setShowDateRangeModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center the icon
                background: '#ffffff',
                borderRadius: '6px',
                padding: '8px 12px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                flexShrink: 0,
                width: '40px', // Fixed width for icon only
                height: '40px', // Fixed height for icon only
                cursor: 'pointer',
              }}
            >
              <FaCalendarAlt style={{
                fontSize: '1.1rem',
                color: (startDateFilter && endDateFilter) ? '#007bff' : '#666', // Dynamic color
                transition: 'color 0.2s', // Smooth color transition
              }} />
            </div>
          </div>
        </div>

        {filteredApplicationsForDisplay.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              minWidth: '700px',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'center' }}>S.No</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Applied Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Boards</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Title</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job ID</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Type</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Link</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicationsForDisplay.map((app, index) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f0f8ff' // Light alternating colors
                    }}
                  >
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>
                      {app.dateAdded} {/* Display Applied Date */}
                    </td>
                    <td style={{ padding: '12px' }}>{app.website}</td>
                    <td style={{ padding: '12px' }}>{app.position}</td>
                    <td style={{ padding: '12px' }}>{app.jobId}</td>
                    <td style={{ padding: '12px' }}>{app.company}</td>
                    <td style={{ padding: '12px' }}>{app.jobType || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Link
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Button
                        variant="link"
                        onClick={() => handleOpenJobDescriptionModal(app.jobDescription)}
                        style={{ padding: '0', border: 'none', color: '#007bff', textDecoration: 'underline' }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>No applications found for this date with the current filters.</p>
        )}
      </div>

      {/* --- Date Range Picker Modal --- */}
      <Modal show={showDateRangeModal} onHide={() => setShowDateRangeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DateRangeCalendar
            initialStartDate={tempStartDate}
            initialEndDate={tempEndDate}
            onSelectRange={handleDateRangeChangeFromCalendar}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearDateRangeInModal} style={modalClearButtonStyle}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleApplyDateRange}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Job Description View Modal --- */}
      <Modal show={showJobDescriptionModal} onHide={handleCloseJobDescriptionModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentJobDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseJobDescriptionModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Consolidated Categorical Filter Modal (Still present, but not accessible from a button) --- */}
      {/* Keeping this modal and its related states/logic in case you wish to re-enable categorical filtering later */}
      <Modal show={showFilterModal} onHide={handleCloseFilterModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* Website Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Website</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueWebsites.map(website => (
                    <Form.Check
                      key={website}
                      type="checkbox"
                      id={`modal-website-${website}`}
                      label={website}
                      value={website}
                      checked={tempSelectedWebsites.includes(website)}
                      onChange={handleWebsiteCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Position Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Position</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniquePositions.map(position => (
                    <Form.Check
                      key={position}
                      type="checkbox"
                      id={`modal-position-${position}`}
                      label={position}
                      value={position}
                      checked={tempSelectedPositions.includes(position)}
                      onChange={handlePositionCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Company Filter Column */}
              <Col md={4}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Company</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueCompanies.map(company => (
                    <Form.Check
                      key={company}
                      type="checkbox"
                      id={`modal-company-${company}`}
                      label={company}
                      value={company}
                      checked={tempSelectedCompanies.includes(company)}
                      onChange={handleCompanyCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearTempFiltersInModal} style={modalClearButtonStyle}>
            <i className="bi bi-trash"></i> Clear Selections
          </Button>
          <Button variant="primary" onClick={handleApplyCategoricalFilters}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// --- Documents Tab Content ---
const Documents = ({ activeSubTab, handleSubTabChange, clientFiles = [], onImageView }) => {
  // Filter files based on the active sub-tab
  const filesForSubTab = clientFiles.filter(file => file.type === documentTypes[activeSubTab]);
  const otherFiles = clientFiles.filter(file => !Object.values(documentTypes).includes(file.type) || file.type === 'other');

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "16px", textAlign: 'center' }}>
        My Documents
      </h3>
      {/* Sub-Tabs */}
      <div style={{ display: "flex", gap: "10px", justifyContent: 'center', flexWrap: 'wrap' }}>
        {Object.keys(documentTypes).map(tabName => (
          <button key={tabName} style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: activeSubTab === tabName ? "#007bff" : "#f0f0f0", color: activeSubTab === tabName ? "#fff" : "#333", cursor: "pointer" }} onClick={() => handleSubTabChange(tabName)}>
            {tabName} ({tabName === 'Others' ? otherFiles.length : clientFiles.filter(f => f.type === documentTypes[tabName]).length})
          </button>
        ))}
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === "Resumes" && <Resumes files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "CoverLetters" && <CoverLetters files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Interviews" && <Interviews files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Offers" && <Offers files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Portfolio" && <Portfolio files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Others" && <Others files={otherFiles} onImageView={onImageView} />}
      </div>
    </div>
  );
};
// Resumes Sub-Tab Content
const Resumes = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No resumes found.</p>}
    </div>
  );
};


// Cover Letters Sub-Tab Content
const CoverLetters = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No cover letters found.</p>}
    </div>
  );
};

// Interviews Sub-Tab Content
const Interviews = ({ files }) => { // onImageView is no longer needed here
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a
          key={file.id || file.name}
          href={file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              padding: "20px", border: "1px solid #ccc", borderRadius: "8px",
              width: "250px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              backgroundColor: '#fff', cursor: 'pointer', transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={file.downloadUrl}
              alt={file.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
            />
            <p style={{ margin: 0, fontWeight: '500', wordBreak: 'break-word' }}>{file.name}</p>
          </div>
        </a>
      )) : <p>No interview screenshots found.</p>}
    </div>
  );
};

// Offers Sub-Tab Content
const Offers = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No offers found.</p>}
    </div>
  );
};

const Portfolio = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No offers found.</p>}
    </div>
  );
};

const Others = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No other documents found.</p>}
    </div>
  );
};

// --- WorksheetView Component (New) ---
// This component will house the Applications and Documents tabs
const WorksheetView = ({ setActiveTab, activeWorksheetTab, setActiveWorksheetTab,
  selectedDate, setSelectedDate, dateRange, currentStartDate, setCurrentStartDate,
  showPreviousWeek, showNextWeek, searchTerm, setSearchTerm,
  startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter,
  showDateRangeModal, setShowDateRangeModal, tempStartDate, setTempStartDate, tempEndDate, setTempEndDate,
  handleDateRangeChangeFromCalendar, handleApplyDateRange, handleClearDateRangeInModal,
  showJobDescriptionModal, setShowJobDescriptionModal, currentJobDescription, setCurrentJobDescription,
  handleOpenJobDescriptionModal, handleCloseJobDescriptionModal,
  filterWebsites, setFilterWebsites, filterPositions, setFilterPositions, filterCompanies, setFilterCompanies,
  uniqueWebsites, uniquePositions, uniqueCompanies,
  showFilterModal, setShowFilterModal, tempSelectedWebsites, setTempSelectedWebsites, tempSelectedPositions, setTempSelectedPositions, tempSelectedCompanies, setTempSelectedCompanies,
  handleOpenFilterModal, handleCloseFilterModal, handleApplyCategoricalFilters, handleClearTempFiltersInModal,
  handleWebsiteCheckboxChange, handlePositionCheckboxChange, handleCompanyCheckboxChange,
  isGlobalFilterActive, clearAllFilters, getApplicationsSectionTitle, filteredApplicationsForDisplay,
  downloadApplicationsData, applicationsData, allApplicationsFlattened,
  activeSubTab, setActiveSubTab, clientData, // New prop to pass sub-tab state for Documents
  setIsInWorksheetView, onImageView // New prop to allow WorksheetView to set its own visibility
}) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Back button for the entire worksheet view */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <button
          onClick={() => setIsInWorksheetView(false)} // Go back to the main Dashboard view
          style={{
            background: '#ffffff',
            color: '#3b82f6',
            border: '1px solid #e2e8f0',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        {/* Removed the "Job Applications Worksheet" title here, it's now inside the Applications component */}
        <div style={{ width: '100px' }}></div> {/* Spacer */}
      </div>

      {/* Tabs for Applications and Documents within the Worksheet View */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: 'wrap', // Allow tabs to wrap on smaller screens
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            backgroundColor: activeWorksheetTab === "Applications" ? "#007bff" : "#e9ecef",
            color: activeWorksheetTab === "Applications" ? "#fff" : "#333",
            borderColor: activeWorksheetTab === "Applications" ? "#007bff" : "#ccc",
          }}
          onClick={() => setActiveWorksheetTab("Applications")}
        >
          Applications
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            backgroundColor: activeWorksheetTab === "Documents" ? "#007bff" : "#e9ecef",
            color: activeWorksheetTab === "Documents" ? "#fff" : "#333",
            borderColor: activeWorksheetTab === "Documents" ? "#007bff" : "#ccc",
          }}
          onClick={() => setActiveWorksheetTab("Documents")}
        >
          Documents
        </button>
      </div>

      {/* Conditional Rendering based on activeWorksheetTab */}
      {activeWorksheetTab === "Applications" && (
        <Applications
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateRange={dateRange}
          currentStartDate={currentStartDate}
          setCurrentStartDate={setCurrentStartDate}
          showPreviousWeek={showPreviousWeek}
          showNextWeek={showNextWeek}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
          showDateRangeModal={showDateRangeModal}
          setShowDateRangeModal={setShowDateRangeModal}
          tempStartDate={tempStartDate}
          setTempStartDate={setTempStartDate}
          tempEndDate={tempEndDate}
          setTempEndDate={tempEndDate}
          handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
          handleApplyDateRange={handleApplyDateRange}
          handleClearDateRangeInModal={handleClearDateRangeInModal}
          showJobDescriptionModal={showJobDescriptionModal}
          setShowJobDescriptionModal={setShowJobDescriptionModal}
          currentJobDescription={currentJobDescription}
          setCurrentJobDescription={setCurrentJobDescription}
          handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
          handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
          filterWebsites={filterWebsites}
          setFilterWebsites={setFilterWebsites}
          filterPositions={filterPositions}
          setFilterPositions={setFilterPositions}
          filterCompanies={filterCompanies}
          setFilterCompanies={setFilterCompanies}
          uniqueWebsites={uniqueWebsites}
          uniquePositions={uniquePositions}
          uniqueCompanies={uniqueCompanies}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          tempSelectedWebsites={tempSelectedWebsites}
          setTempSelectedWebsites={setTempSelectedWebsites}
          tempSelectedPositions={tempSelectedPositions}
          setTempSelectedPositions={setTempSelectedPositions}
          tempSelectedCompanies={tempSelectedCompanies}
          setTempSelectedCompanies={setTempSelectedCompanies}
          handleOpenFilterModal={() => setShowFilterModal(true)}
          handleCloseFilterModal={() => setShowFilterModal(false)}
          handleApplyCategoricalFilters={() => {
            setFilterWebsites(tempSelectedWebsites);
            setFilterPositions(tempSelectedPositions);
            setFilterCompanies(tempSelectedCompanies);
            setShowFilterModal(false);
          }}
          handleClearTempFiltersInModal={() => {
            setTempSelectedWebsites([]);
            setTempSelectedPositions([]);
            setTempSelectedCompanies([]);
          }}
          handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
          handlePositionCheckboxChange={handlePositionCheckboxChange}
          handleCompanyCheckboxChange={handleCompanyCheckboxChange}
          isGlobalFilterActive={isGlobalFilterActive}
          clearAllFilters={clearAllFilters}
          getApplicationsSectionTitle={getApplicationsSectionTitle}
          filteredApplicationsForDisplay={filteredApplicationsForDisplay}
          downloadApplicationsData={downloadApplicationsData}
          applicationsData={applicationsData}
          allApplicationsFlattened={allApplicationsFlattened}
          activeWorksheetTab={activeWorksheetTab} // Pass down
          setActiveWorksheetTab={setActiveWorksheetTab} // Pass down
        />
      )}

      {activeWorksheetTab === "Documents" && (
        <Documents
          activeSubTab={activeSubTab}
          handleSubTabChange={setActiveSubTab}
          clientFiles={clientData ? clientData.files : []}
          onImageView={onImageView}
        />
      )}
    </div>
  );
};


// --- ClientDashboard Main Component ---
const ClientDashboard = () => {
  const navigate = useNavigate();

  const [applicationsData, setApplicationsData] = useState({});
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [allFiles, setAllFiles] = useState([]);


  // Initialize activeTab from localStorage, default to "Dashboard" if not found
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    return savedTab || "Dashboard";
  });

  const [showUnderDevelopment, setShowUnderDevelopment] = useState(false);
  const [developmentService, setDevelopmentService] = useState('');
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  // ADD this new handler for the "Notify me" button
  const handleNotifyMeClick = () => {
    setShowNotifyMessage(true);
  };

  // ADD this new handler for the "Go Back" button
  const handleGoBack = () => {
    setShowUnderDevelopment(false);
    setShowNotifyMessage(false);
  };

  const allJobSupportFields = {
  // Personal Information
  firstName: 'N/A',
  middleName: 'N/A',
  lastName: 'N/A',
  dob: 'N/A',
  gender: 'N/A',
  ethnicity: 'N/A',
  // Contact Information
  address: 'N/A',
  county: 'N/A',
  zipCode: 'N/A',
  countryCode: 'N/A',
  mobile: 'N/A',
  email: 'N/A',
  // Employment Information
  securityClearance: 'N/A',
  clearanceLevel: 'N/A',
  willingToRelocate: 'N/A',
  workPreference: 'N/A',
  restrictedCompanies: 'N/A',
  yearsOfExperience: 'N/A',
  // Job Preferences
  jobsToApply: 'N/A',
  currentSalary: 'N/A',
  expectedSalary: 'N/A',
  visaStatus: 'N/A',
  otherVisaStatus: 'N/A',
  // Education
  universityName: 'N/A',
  universityAddress: 'N/A',
  courseOfStudy: 'N/A',
  graduationFromDate: 'N/A',
  graduationToDate: 'N/A',
  noticePeriod: 'N/A',
  // Current Employment
  currentCompany: 'N/A',
  currentDesignation: 'N/A',
  preferredInterviewTime: 'N/A',
  earliestJoiningDate: 'N/A',
  relievingDate: 'N/A',
  // References
  referenceName: 'N/A',
  referencePhone: 'N/A',
  referenceAddress: 'N/A',
  referenceEmail: 'N/A',
  referenceRole: 'N/A',
  // Job Portal Information
  jobPortalAccountNameandCredentials: 'N/A',
  // Resume & Cover Letter
  resumeFileName: 'N/A',
  coverLetterFileName: 'N/A',
};


  // Effect to save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeClientDashboardTab', activeTab);
  }, [activeTab]);

  // New state to manage the visibility of the "Worksheet" specific view
  const [isInWorksheetView, setIsInWorksheetView] = useState(() => {
    // Check if the saved tab is 'Applications' or 'Documents' to determine initial isInWorksheetView
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    return savedTab === "Applications" || savedTab === "Documents";
  });

  // State for tabs within the WorksheetView (Applications or Documents)
  const [activeWorksheetTab, setActiveWorksheetTab] = useState(() => {
    // If we're starting in WorksheetView, determine which sub-tab was active
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    if (savedTab === "Applications" || savedTab === "Documents") {
      return savedTab;
    }
    return "Applications"; // Default to Applications if starting in worksheet view
  });


  // States from clientdashboard.txt
  const [menuOpen, setMenuOpen] = useState(false); // No longer used for hamburger menu
  const [showInterviewsModal, setShowInterviewsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionDetailsModal, setShowSubscriptionDetailsModal] = useState(false);
  const [selectedRadioPlan, setSelectedRadioPlan] = useState('glass-silver');

  const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] = useState(false);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);

  const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrlToView, setImageUrlToView] = useState('');

  // New state for the PaymentOptionsModal
  const [showPaymentOptionsModal, setShowPaymentOptionsModal] = useState(false);
  const [planToPayFor, setPlanToPayFor] = useState({ name: '', price: '' });


  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [activeServices, setActiveServices] = useState([]);
  const [inactiveServices, setInactiveServices] = useState([]);

  const allServices = [
    { title: "Mobile Development", path: "/services/mobile-app-development" },
    { title: "Web Development", path: "/services/web-app-development" },
    { title: "Digital Marketing", path: "/services/digital-marketing" },
    { title: "IT Talent Supply", path: "/services/it-talent-supply" },
    { title: "Job Supporting", path: "/services/job-contact-form" },
    { title: "Cyber Security", path: "/services/cyber-security" },
  ];

  const clientUserName = useMemo(() => {
    if (clientData) {
      return `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim() || 'Client';
    }
    return 'Client';
  }, [clientData]);

  const clientInitials = useMemo(() => {
    if (clientData) {
      const first = clientData.firstName ? clientData.firstName.charAt(0) : '';
      const last = clientData.lastName ? clientData.lastName.charAt(0) : '';
      return `${first}${last}` || 'C';
    }
    return 'C';
  }, [clientData]);

  // Keep these as they are not part of the client's dynamic data
  const currentPlanPrice = "$199";
  const daysLeftInPlan = "28";


  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { title: 'New Feature Alert', message: 'Discover our new analytics dashboard!', time: '2 hours ago' },
    { title: 'Payment Due Soon', message: 'Your subscription renews in 3 days.', time: '1 day ago' },
    { title: 'Profile Update', message: 'Your profile information has been updated.', time: '2 days ago' },
  ]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState([]);

  // States for Applications tab (from clientworksheet.txt)
  const [selectedDate, setSelectedDate] = useState(null); // For the daily date navigation ribbon
  const [dateRange, setDateRange] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);
    const [filtereJobType, setFilterJobType] = useState([]);


  const [uniqueWebsites, setUniqueWebsites] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueJobType, setUniqueJobType] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);
  const [currentJobDescription, setCurrentJobDescription] = useState(''); // Initialize with empty string

  const [showFilterModal, setShowFilterModal] = useState(false); // Categorical filter modal
  const [tempSelectedWebsites, setTempSelectedWebsites] = useState([]);
  const [tempSelectedPositions, setTempSelectedPositions] = useState([]);
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState([]);

  // States for Documents tab
  const [activeSubTab, setActiveSubTab] = useState("Resumes");


  // --- Handlers for ClientDashboard (main component) ---
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen); // This function is now effectively unused for the UI
  const toggleInterviewsModal = () => setShowInterviewsModal(!showInterviewsModal);
  const toggleResumeModal = () => setShowResumeModal(!showResumeModal);
  const togglePaymentModal = () => setShowPaymentModal(!showPaymentModal);
  const toggleSubscriptionDetailsModal = () => setShowSubscriptionDetailsModal(!showSubscriptionDetailsModal);

  // Handlers for profile dropdown items
// UPDATE: The handleClientProfileClick function needs to reference the new allJobSupportFields object.
const handleClientProfileClick = useCallback(() => {
  setIsProfileDropdownOpen(false);
  if (clientData && clientData.serviceRegistrations) {
    const registrationKeys = Object.keys(clientData.serviceRegistrations);
    if (registrationKeys.length > 0) {
      const mostRecentRegistration = registrationKeys.reduce((latest, key) => {
        const current = { ...clientData.serviceRegistrations[key], key: key };
        if (!latest || new Date(current.registeredDate) > new Date(latest.registeredDate)) {
          return current;
        }
        return latest;
      }, null);

      if (mostRecentRegistration) {
        const fullDetails = {
          ...allJobSupportFields, // Use all form fields as a base
          ...mostRecentRegistration, // Overwrite with data from Firebase
          // Combine parent client data for consistency
          email: clientData.email || mostRecentRegistration.email,
          mobile: clientData.mobile || mostRecentRegistration.mobile,
          firstName: clientData.firstName || mostRecentRegistration.firstName,
          lastName: clientData.lastName || mostRecentRegistration.lastName,
          // Ensure file names and URLs are present for the modal
          resumeFileName: mostRecentRegistration.resumeFileName,
          resumeUrl: mostRecentRegistration.resumeUrl,
          coverLetterFileName: mostRecentRegistration.coverLetterFileName,
          coverLetterUrl: mostRecentRegistration.coverLetterUrl,
        };
        setSelectedServiceForDetails(fullDetails);
        setIsServiceDetailsModalOpen(true);
      }
    } else {
      alert("You have no registered services to display.");
    }
  } else {
    alert("Profile data is not available yet. Please try again in a moment.");
  }
}, [clientData]);

  const handleSubscriptionClick = useCallback(() => {
    setIsProfileDropdownOpen(false); // Close dropdown
    setShowSubscriptionDetailsModal(true); // Open new subscription details modal
  }, []);

  const handleNotificationClick = useCallback(() => {
    setShowNotificationsModal(true);
    setUnreadNotificationsCount(0); // Mark all as read when modal is opened
  }, []);

  const closeNotificationsModal = useCallback(() => {
    setShowNotificationsModal(false);
  }, []);

  const handleAttachmentClick = useCallback((attachments) => {
    setCurrentAttachments(attachments);
    setShowAttachmentModal(true);
  }, []);

  const closeAttachmentModal = useCallback(() => {
    setShowAttachmentModal(false);
    setCurrentAttachments([]); // Clear attachments when closing
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activeClientDashboardTab'); // Clear persisted tab on logout
    navigate('/'); // Redirect to home/login page
    console.log("User logged out successfully.");
    setIsProfileDropdownOpen(false); // Close dropdown
  }, [navigate]);

  // Example of how to add a new notification (you'd replace this with actual logic)
  const addNewNotification = () => {
    const newNotification = {
      title: 'New Update Available',
      message: 'A new version of the dashboard has been released!',
      time: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadNotificationsCount(prev => prev + 1);
  };

  // Optional: Simulate updates
  useEffect(() => {
    const interval = setInterval(() => {
      // You would replace this with actual checks for updates (e.g., fetching from an API)
      // For demonstration, let's add a new notification every 30 seconds
      // addNewNotification();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ... other states ...

  // ClientDashboard.jsx

// In ClientDashboard.jsx, replace the useEffect hook that fetches client data
useEffect(() => {
    const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
    // Ensure you are logged in as a client and have a firebaseKey
    if (!loggedInUserData || !loggedInUserData.firebaseKey) return;

    // Create a direct reference to this client's data in Firebase
    const clientRef = ref(database, `clients/${loggedInUserData.firebaseKey}`);

    const unsubscribe = onValue(clientRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setClientData(data);

            const registrations = data.serviceRegistrations ? Object.values(data.serviceRegistrations) : [];

            // 1. Get files from the client's main 'files' node
            const generalFiles = registrations.flatMap(reg => reg.files || []);

            // 2. Get attachment files from within each job application
            const applicationAttachments = registrations
                .flatMap(reg => reg.jobApplications || [])
                .flatMap(app => app.attachments || []);

            // 3. Combine and deduplicate the file lists.
            // Use a Map to ensure each file (identified by its downloadUrl) is only present once.
            const allFilesMap = new Map();

            [...generalFiles, ...applicationAttachments].forEach(file => {
                // Use a unique property like downloadUrl as the key for deduplication
                if (file.downloadUrl) {
                    allFilesMap.set(file.downloadUrl, file);
                }
            });

            // 4. Convert the Map values back to an array and set the state
            const combinedFiles = Array.from(allFilesMap.values());
            setAllFiles(combinedFiles);

            // 5. This logic is correct and doesn't need to be changed
            const allApplications = registrations.flatMap(reg => reg.jobApplications || []);
            const interviews = allApplications.filter(app => app.status === 'Interview');
            setScheduledInterviews(interviews);

            // This logic groups applications by date for the worksheet view
            const groupedApplications = allApplications.reduce((acc, app) => {
                const dateKey = formatDate(app.appliedDate);
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push({
                    id: app.id,
                    jobId: app.jobId,
                    website: app.jobBoards,
                    position: app.jobTitle,
                    company: app.company,
                    link: app.jobUrl,
                    jobType: app.jobType || 'N/A',
                    dateAdded: formatDate(app.appliedDate),
                    jobDescription: app.notes,
                    status: app.status,
                    role: app.role,
                });
                return acc;
            }, {});
            setApplicationsData(groupedApplications);

            // Process service registrations to categorize them
            const registeredServiceNames = registrations.map(reg => reg.service);

            const active = allServices.filter(service => registeredServiceNames.includes(service.title));
            const inactive = allServices.filter(service => !registeredServiceNames.includes(service.title));

            setActiveServices(active);
            setInactiveServices(inactive);
        }
    });

    return () => unsubscribe();
}, []);


  const handleActiveServiceClick = (service) => {
    if (clientData && clientData.serviceRegistrations) {
      // Find the registration that matches the clicked service title
      const registration = Object.values(clientData.serviceRegistrations).find(reg => reg.service === service.title);
      if (registration) {
        const fullDetails = {
          ...registration,
          email: clientData.email || registration.email,
          mobile: clientData.mobile || registration.mobile,
        };
        setSelectedServiceForDetails(fullDetails);
        setIsServiceDetailsModalOpen(true);
        setIsProfileDropdownOpen(false); // Close the services dropdown
      } else {
        alert(`Could not find details for the service: ${service.title}`);
      }
    }
  };

  // Handler for when a client clicks on an INACTIVE service
  const handleInactiveServiceClick = (path) => {
    navigate(path); // Navigate to the corresponding service page to sign up
    setIsProfileDropdownOpen(false); // Close the dropdown
  };

  const profilePlaceholder = "https://imageio.forbes.com/specials-images/imageserve/5c7d7829a7ea434b351ba0b6/0x0.jpg?format=jpg&crop=1837,1839,x206,y250,safe&height=416&width=416&fit=bounds";

  // Chart data for Dashboard content
  const generateChartLabelsForPastDays = (numDays) => {
    const labels = [];
    const today = new Date();
    const options = { day: '2-digit', month: 'short' }; // Format as "DD Mon"

    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', options));
    }
    return labels;
  };

  const chartLabels = generateChartLabelsForPastDays(7); // Last 7 days

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'LinkedIn',
        data: [25, 20, 22, 28, 26, 24, 27], // 7 data points for 7 days
        borderColor: '#0A66C2',
        backgroundColor: '#0A66C2',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Indeed',
        data: [5, 10, 15, 20, 25, 22, 15], // 7 data points for 7 days
        borderColor: '#2164F4',
        backgroundColor: '#2164F4',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Company Site',
        data: [10, 12, 20, 6, 29, 23, 28], // 7 data points for 7 days
        borderColor: '#6A0DAD',
        backgroundColor: '#6A0DAD',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Glassdoor',
        data: [20, 15, 8, 16, 15, 10, 30], // 7 data points for 7 days
        borderColor: '#0CAA41',
        backgroundColor: '#0CAA41',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Other',
        data: [15, 25, 18, 26, 22, 28, 18], // 7 data points for 7 days
        borderColor: '#FF6B00',
        backgroundColor: '#FF6B00',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Segoe UI', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 35,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: true, // Display vertical grid lines
          color: 'rgba(0,0,0,0.1)',
          drawOnChartArea: true,
          drawTicks: false,
          lineWidth: 1,
          borderDash: [5, 5],
        }
      }
    },
    elements: {
      line: {
        fill: false
      }
    }
  };

  // Mock data for Scheduled Interviews (UPDATED with attachment field)
  // const scheduledInterviews = [
  //   { id: 1, date: '2025-06-15', jobId: 'TX101', time: '10:00 AM', company: 'Innovate Solutions', role: 'Software Developer', recruiterMailId: 'alice.j@innovate.com', round: 'Round 1', attachments: ['https://placehold.co/200x150/FFD700/000000?text=Screenshot+1'] },
  //   { id: 2, date: '2025-06-18', jobId: 'TX102', time: '02:30 PM', company: 'Global Tech Corp', role: 'UX Designer', recruiterMailId: 'bob.w@globaltech.com', round: 'Round 2', attachments: ['https://placehold.co/200x150/ADD8E6/000000?text=Design+Brief', 'https://placehold.co/200x150/90EE90/000000?text=Wireframes'] },
  //   { id: 3, date: '2025-06-20', jobId: 'TX103', time: '11:00 AM', company: 'Data Insights Ltd.', role: 'Data Analyst', recruiterMailId: 'charlie.b@datainsights.com', round: 'Final Round', attachments: [] },
  //   { id: 4, date: '2025-06-22', jobId: 'TX104', time: '09:00 AM', company: 'FutureTech Inc.', role: 'Project Manager', recruiterMailId: 'david.l@futuretech.net', round: 'Round 1', attachments: ['https://placehold.co/200x150/FFC0CB/000000?text=Project+Spec'] },
  //   { id: 5, date: '2025-06-25', jobId: 'TX105', time: '01:00 PM', company: 'Digital Innovators', role: 'DevOps Engineer', recruiterMailId: 'eve.d@digitalinnov.io', round: 'Round 3', attachments: [] },
  //   { id: 6, date: '2025-06-28', jobId: 'TX106', time: '03:45 PM', company: 'Quant Computing', role: 'Machine Learning Scientist', recruiterMailId: 'frank.w@quantcomp.ai', round: 'Round 2', attachments: ['https://placehold.co/200x150/DDA0DD/000000?text=Algorithm+Flow'] },
  //   { id: 7, date: '2025-07-01', jobId: 'TX107', time: '10:30 AM', company: 'CyberSec Solutions', role: 'Cybersecurity Analyst', recruiterMailId: 'grace.k@cybersec.com', round: 'Round 1', attachments: ['https://placehold.co/200x150/F08080/000000?text=Security+Report'] },
  //   { id: 8, date: '2025-07-03', jobId: 'TX108', time: '04:00 PM', company: 'HealthTech Connect', role: 'Mobile App Developer', recruiterMailId: 'henry.g@healthtech.org', round: 'Final Round', attachments: [] },
  // ];

  // Mock data for Resume & Job Portal Updates
  const resumeUpdates = [
    { id: 1, date: '2025-06-08', type: 'Resume', status: 'Updated', details: 'Added new project experience' },
    { id: 2, date: '2025-06-05', type: 'LinkedIn Profile', status: 'Reviewed', details: 'Optimized keywords' },
    { id: 3, date: '2025-06-01', type: 'Job Portal Profile', status: 'Completed', details: 'Indeed profile sync' },
    { id: 4, date: '2025-05-28', type: 'Cover Letter Template', status: 'Revised', details: 'Tailored for specific roles' },
    { id: 5, date: '2025-05-25', type: 'Resume', status: 'Draft 1 Sent', details: 'Initial review with consultant' },
    { id: 6, date: '2025-05-20', type: 'Glassdoor Profile', status: 'Created', details: 'New profile setup' },
    { id: 7, date: '2025-05-18', type: 'Portfolio Link', status: 'Added', details: 'Updated portfolio on resume' },
    { id: 8, date: '2025-05-15', type: 'Skills Section', status: 'Enhanced', details: 'Added new technical skills' },
  ];

  // Filtered resume updates to show only type 'Resume'
  const filteredResumeUpdates = resumeUpdates.filter(update => update.type === 'Resume');

  // Find the latest resume update date
  const latestResumeUpdate = filteredResumeUpdates.length > 0
    ? new Date(Math.max(...filteredResumeUpdates.map(update => new Date(update.date))))
    : null;

  const formattedLatestResumeDate = latestResumeUpdate
    ? latestResumeUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';


  // Map plans to prices and features for display
  const planOptions = {
    'glass-silver': { name: 'Silver', price: '$199', features: ['Full dashboard access', 'Monthly chart updates', 'Basic support'] },
    'glass-gold': { name: 'Gold', price: '$499', features: ['All Silver features', 'Priority support', 'Quarterly review calls'] },
    'glass-platinum': { name: 'Platinum', price: '$999', features: ['All Gold features', 'Dedicated account manager', 'Annual strategic planning session'] },
  };

  // Handler for proceeding to payment options from PaymentPlanModal
  const handleProceedToPayment = (planName, planPrice) => {
    setPlanToPayFor({ name: planName, price: planPrice });
    setShowPaymentModal(false); // Close the plan selection modal
    setShowPaymentOptionsModal(true); // Open the new payment options modal
  };

  // Function to handle radio button change
  const handleRadioPlanChange = (planId) => {
    setSelectedRadioPlan(planId);
  };

  // Function to get glider style based on selected plan (not directly used in render, but kept for logic)
  const getGliderDynamicStyle = () => {
    let transformValue = 'translateX(0%)';
    let backgroundValue = 'linear-gradient(135deg, #c0c0c055, #e0e0e0)';
    let boxShadowValue = '0 0 18px rgba(192, 192, 192, 0.5), 0 0 10px rgba(255, 255, 255, 0.4) inset';

    if (selectedRadioPlan === 'glass-gold') {
      transformValue = 'translateX(100%)';
      backgroundValue = 'linear-gradient(135deg, #ffd70055, #ffcc00)';
      boxShadowValue = '0 0 18px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 235, 150, 0.4) inset';
    } else if (selectedRadioPlan === 'glass-platinum') {
      transformValue = 'translateX(200%)';
      backgroundValue = 'linear-gradient(135deg, #d0e7ff55, #a0d8ff)';
      boxShadowValue = '0 0 18px rgba(160, 216, 255, 0.5), 0 0 10px rgba(200, 240, 255, 0.4) inset';
    }

    return {
      transform: transformValue,
      background: backgroundValue,
      boxShadow: boxShadowValue,
    };
  };

  // Get current selected plan details for display below radio buttons
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];

  // Handler for downloading resume
  const handleDownloadResume = () => {
    console.log('Downloading the latest resume... (This is a placeholder action)');
  };

  // --- Handlers for Applications tab ---

  // Effect to generate initial date range and select today's date for Applications tab
  useEffect(() => {
    const today = new Date();
    const initialStartDate = new Date(today);
    initialStartDate.setDate(today.getDate() - 6);
    setCurrentStartDate(initialStartDate);
    setDateRange(generateDateRange(initialStartDate));
    setSelectedDate(formatDate(today));
  }, []);

  // Effect to populate unique filter options from all application data for Applications tab
  useEffect(() => {
    const allWebsites = new Set();
    const allPositions = new Set();
    const allCompanies = new Set();
    const allJobType = new Set();

    Object.values(applicationsData).forEach(dateApps => {
      dateApps.forEach(app => {
        allWebsites.add(app.website);
        allPositions.add(app.position);
        allCompanies.add(app.company);
        allJobType.add(app.jobType);
      });
    });

    setUniqueWebsites(Array.from(allWebsites).sort());
    setUniquePositions(Array.from(allPositions).sort());
    setUniqueCompanies(Array.from(allCompanies).sort());
     setUniqueJobType(Array.from(allJobType).sort());
  }, []);

  // Flatten all applications once and add their original date for Applications tab
  const allApplicationsFlattened = useMemo(() => {
    const flattened = [];
    for (const dateKey in applicationsData) {
      if (Object.prototype.hasOwnProperty.call(applicationsData, dateKey)) {
        applicationsData[dateKey].forEach(app => {
          flattened.push({ ...app, dateAdded: dateKey }); // Add the original date string to each app (DD-MM-YYYY)
        });
      }
    }
    return flattened;
  }, []);


  // Helper to determine if any global filter (search, date range, or categorical) is active
  const isGlobalFilterActive = useMemo(() => {
    return searchTerm !== '' ||
      startDateFilter !== '' ||
      endDateFilter !== '' ||
      filterWebsites.length > 0 ||
      filterPositions.length > 0 ||
      filterCompanies.length > 0;
  }, [searchTerm, startDateFilter, endDateFilter, filterWebsites, filterPositions, filterCompanies]);

  // Function to clear ALL applied filters and reset temp states (for main page button)
  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
    setFilterWebsites([]); // Clear categorical filters too on global clear
    setFilterPositions([]);
    setFilterCompanies([]);
    setTempStartDate(null); // Clear temp states for date range modal
    setTempEndDate(null);   // Clear temp states for date range modal
    setTempSelectedWebsites([]); // Clear temp states for categorical modal
    setTempSelectedPositions([]);
    setTempSelectedCompanies([]);
  };

  // Checkbox change handlers for temporary selections within the categorical modal
  const handleWebsiteCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedWebsites(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handlePositionCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedPositions(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleCompanyCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedCompanies(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };


  // --- Handlers for the NEW Date Range Picker Modal ---
  const handleOpenDateRangeModal = () => {
    // Convert DD-MM-YYYY strings back to Date objects for the calendar component
    setTempStartDate(startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null);
    setTempEndDate(endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null);
    setShowDateRangeModal(true);
  };

  const handleCloseDateRangeModal = () => {
    setShowDateRangeModal(false);
  };

  // Callback from DateRangeCalendar when a range is selected
  const handleDateRangeChangeFromCalendar = useCallback((start, end) => {
    setTempStartDate(start);
    setTempEndDate(end);
  }, []);

  const handleApplyDateRange = () => {
    // Validate dates before applying (optional, but good practice)
    if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
      console.error('Start date cannot be after end date.');
      // You might want to show a user-friendly error message here
      return;
    }
    // Set the main filter states (converted back to DD-MM-YYYY strings for consistency)
    setStartDateFilter(tempStartDate ? formatDate(tempStartDate) : '');
    setEndDateFilter(tempEndDate ? formatDate(tempEndDate) : '');
    setShowDateRangeModal(false);
  };

  const handleClearDateRangeInModal = () => {
    setTempStartDate(null);
    setTempEndDate(null);
  };

  // --- Handlers for Job Description Modal ---
  const handleOpenJobDescriptionModal = (description) => {
    setCurrentJobDescription(description);
    setShowJobDescriptionModal(true);
  };

  const handleCloseJobDescriptionModal = () => {
    setShowJobDescriptionModal(false);
    setCurrentJobDescription('');
  };

  const downloadApplicationsData = () => {
    if (!filteredApplicationsForDisplay.length) return;

    const dataToExport = filteredApplicationsForDisplay.map((app, index) => ({
      'S.No': index + 1,
      'Applied Date': app.dateAdded,
      'Job Boards': app.jobBoards,
      'Job Title': app.position,
      'Job ID': app.jobId,
      'Company': app.company,
      'Job Type': app.jobType || 'N/A',
      'Link': app.link,
      'Job Description': app.jobDescription
    }));

    const ws = utils.json_to_sheet(dataToExport); // Use utils from named import
    const wb = utils.book_new(); // Use utils from named import
    const sheetName = isGlobalFilterActive ? 'Filtered Applications' : `Applications ${selectedDate}`;
    utils.book_append_sheet(wb, ws, sheetName); // Use utils from named import
    writeFile(wb, `JobApplications_${sheetName.replace(/\s/g, '_')}.xlsx`); // Use writeFile from named import
  };

  const showPreviousWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setCurrentStartDate(newStartDate);
    setDateRange(generateDateRange(newStartDate));
  };

  const showNextWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);

    const today = new Date();
    // Only allow navigating to future weeks if there's actual data in those weeks
    // For simplicity here, we only check against today's date to prevent going too far into future
    if (newStartDate.getTime() <= today.getTime() || Object.keys(applicationsData).some(date => new Date(convertDDMMYYYYtoYYYYMMDD(date)).getTime() >= newStartDate.getTime())) {
      setCurrentStartDate(newStartDate);
      setDateRange(generateDateRange(newStartDate));
    }
  };


  // Update the title dynamically based on active filters
  const getApplicationsSectionTitle = () => {
    const hasDateRangeFilter = startDateFilter && endDateFilter;
    const hasSearchTerm = searchTerm !== '';
    const hasCategoricalFilters = filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0;

    if (hasDateRangeFilter) {
      return `Filtered Applications (From ${startDateFilter} - To ${endDateFilter})`;
    } else if (hasSearchTerm || hasCategoricalFilters) {
      return 'Filtered Applications (by search and/or other criteria)';
    } else if (selectedDate) {
      return `Applications for ${selectedDate}`;
    }
    return 'Job Applications'; // Default title if nothing selected/filtered
  };

  // In ClientDashboard.jsx, add this new handler function.

  // In ClientDashboard.jsx, add this array before the return statement.

  const servicesData = [
    {
      key: 'Job Application',
      title: 'Job Supporting',
      description: 'Streamline your hiring process with our job application tracking system.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <path d="M16 2a4 4 0 0 0-4 4v1h-2v-1a4 4 0 0 0-4-4"></path>
        </svg>
      ),
      iconClass: 'job-app-icon',
    },
    {
      key: 'Mobile Development',
      title: 'Mobile Development',
      description: 'Track project progress, bug reports, and user engagement for your mobile applications.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <path d="M12 18h.01"></path>
        </svg>
      ),
      iconClass: 'mobile-app-icon',
    },
    {
      key: 'Web Development',
      title: 'Web Development',
      description: 'Monitor website uptime, user engagement, and feature deployment for your web projects.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2 12h20"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      iconClass: 'web-app-icon',
    },
    {
      key: 'Digital Marketing',
      title: 'Digital Marketing',
      description: 'Analyze campaign performance, conversion rates, and social media reach.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z"></path>
          <path d="M12 8l4 4-4 4V8z"></path>
          <path d="M12 8l-4 4 4 4-4-4z"></path>
        </svg>
      ),
      iconClass: 'digital-marketing-icon',
    },
    {
      key: 'IT Talent Supply',
      title: 'IT Talent Supply',
      description: 'Manage talent placement, skill matching, and client satisfaction metrics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      iconClass: 'it-talent-icon',
    },
    {
      key: 'Cyber Security',
      title: 'Cyber Security',
      description: 'View security health scores, threat detection rates, and compliance status.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      iconClass: 'cybersecurity-icon',
    }
  ];

  // In ClientDashboard.jsx, replace the existing handleViewDashboardClick function.

  const handleViewDashboardClick = (serviceName) => {
    // Find the service from the master list to get its path for navigation
    const service = allServices.find(s => s.title === serviceName);
    if (!service) {
      if (serviceName === 'Job Application') {
        setIsInWorksheetView(true);
        setActiveWorksheetTab("Applications");
      }
      return;
    }

    const isActive = activeServices.some(active => active.title === service.title);

    if (isActive) {
      // If the active service is "Job Supporting", show the main worksheet view
      if (service.title === 'Job Supporting') {
        setIsInWorksheetView(true);
        setActiveWorksheetTab("Applications");
      } else {
        // For all other active services, show the "under development" page
        setDevelopmentService(service.title);
        setShowUnderDevelopment(true);
      }
    } else {
      // If the service is inactive, navigate to its sign-up page
      handleInactiveServiceClick(service.path);
    }
  };



  // Apply all filters to the relevant base set of applications
  const filteredApplicationsForDisplay = useMemo(() => {
    let baseApps = [];

    const isDateRangeFilterSet = startDateFilter !== '' && endDateFilter !== '';
    const isSearchActiveOnly = searchTerm !== '' && !isDateRangeFilterSet;
    const isCategoricalFilterActiveOnly = (filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0) && !isDateRangeFilterSet;

    if (isDateRangeFilterSet) {
      // If date range is explicitly set, always filter from all data
      baseApps = allApplicationsFlattened;
    } else if (isSearchActiveOnly || isCategoricalFilterActiveOnly) {
      // If only search or categorical filters are active, filter only for the selected ribbon date
      // If no ribbon date is selected, default to today
      const targetDate = selectedDate || formatDate(new Date());
      baseApps = applicationsData[targetDate] || [];
    } else if (selectedDate) {
      // If only a ribbon date is selected (and no other global filters active), use that date's data.
      baseApps = applicationsData[selectedDate] || [];
    } else {
      // Default case, if no filters active and no ribbon date selected, show data for today.
      baseApps = applicationsData[formatDate(new Date())] || [];
    }


    return baseApps.filter(app => {
      const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
      const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
      const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        searchTerm === '' ||
        app.website.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(lowerCaseSearchTerm)); // Search in job description


      // Date Range Filter logic (applies only if startDateFilter or endDateFilter are explicitly set)
      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
        // Convert DD-MM-YYYY (app.dateAdded) to YYYY-MM-DD for Date constructor comparability
        // And normalize to start/end of day for accurate range comparison
        const appDate = new Date(convertDDMMYYYYtoYYYYMMDD(app.dateAdded));
        appDate.setHours(0, 0, 0, 0); // Normalize to start of day

        const start = startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null;
        const end = endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        matchesDateRange =
          (!start || appDate >= start) &&
          (!end || appDate <= end);
      }

      // Combine all conditions
      return matchesWebsite && matchesPosition && matchesCompany && matchesSearchTerm && matchesDateRange;
    });
  }, [selectedDate, applicationsData, filterWebsites, filterPositions, filterCompanies, searchTerm, startDateFilter, endDateFilter, allApplicationsFlattened, isGlobalFilterActive]);


  // Determine if the overlay should be visible (for all modals and sidebar)
  const isOverlayVisible = useMemo(() => {
    return menuOpen || showInterviewsModal || showResumeModal || showPaymentModal || showSubscriptionDetailsModal ||
      showNotificationsModal || showAttachmentModal || showDateRangeModal || showJobDescriptionModal || showFilterModal || showPaymentOptionsModal;
  }, [menuOpen, showInterviewsModal, showResumeModal, showPaymentModal,
    , showSubscriptionDetailsModal,
    showNotificationsModal, showAttachmentModal, showDateRangeModal, showJobDescriptionModal, showFilterModal, showPaymentOptionsModal]);


  // ClientDashboard.jsx

  // ... after other component definitions like Radio, ClientHeader etc.

  // ADD this new component for displaying service details
  const ClientServiceDetailsModal = ({ show, onHide, serviceDetails }) => {
    if (!serviceDetails) return null;

      const combinedDetails = {
    ...allJobSupportFields,
    ...serviceDetails,
  };

    const isSimpleService = simplifiedServices.includes(serviceDetails.service);

    const renderSimpleDetails = () => (
      <>
        <h4 className="border-bottom pb-2 mb-3">Service Request Details</h4>
        <Row>
          <Col md={6} className="mb-3"><Form.Label>First Name</Form.Label><div className="previewValueDisplay">{serviceDetails.firstName || 'N/A'}</div></Col>
          <Col md={6} className="mb-3"><Form.Label>Last Name</Form.Label><div className="previewValueDisplay">{serviceDetails.lastName || 'N/A'}</div></Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3"><Form.Label>Mobile</Form.Label><div className="previewValueDisplay">{serviceDetails.mobile || 'N/A'}</div></Col>
          <Col md={6} className="mb-3"><Form.Label>Email</Form.Label><div className="previewValueDisplay">{serviceDetails.email || 'N/A'}</div></Col>
        </Row>
        <Row>
          <Col className="mb-3"><Form.Label>Service</Form.Label><div className="previewValueDisplay">{serviceDetails.service || 'N/A'}</div></Col>
        </Row>
        <Row>
          <Col className="mb-3"><Form.Label>Sub-Services</Form.Label><div className="previewTextAreaDisplay">{(serviceDetails.subServices || []).join(', ') || 'N/A'}</div></Col>
        </Row>
        <Row>
          <Col className="mb-3"><Form.Label>User Type</Form.Label><div className="previewValueDisplay">{serviceDetails.userType || 'N/A'}</div></Col>
        </Row>
      </>
    );

 const renderJobSupportDetails = () => (
    <>
      <h4 className="border-bottom pb-2 mb-3">Personal Information</h4>
      <Row className="mb-3"><Col><Form.Label>First Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.firstName}</div></Col><Col><Form.Label>Middle Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.middleName}</div></Col><Col><Form.Label>Last Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.lastName}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Date of Birth:</Form.Label><div className="previewValueDisplay">{combinedDetails.dob}</div></Col><Col><Form.Label>Gender:</Form.Label><div className="previewValueDisplay">{combinedDetails.gender}</div></Col><Col><Form.Label>Ethnicity:</Form.Label><div className="previewValueDisplay">{combinedDetails.ethnicity}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Contact Information</h4>
      <Row className="mb-3"><Col><Form.Label>Address:</Form.Label><div className="previewValueDisplay">{combinedDetails.address}</div></Col><Col><Form.Label>County:</Form.Label><div className="previewValueDisplay">{combinedDetails.county}</div></Col><Col md={4}><Form.Label>Zip Code:</Form.Label><div className="previewValueDisplay">{combinedDetails.zipCode}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Country:</Form.Label><div className="previewValueDisplay">{combinedDetails.country || 'N/A'}</div></Col><Col><Form.Label>Mobile:</Form.Label><div className="previewValueDisplay">{combinedDetails.mobile}</div></Col><Col><Form.Label>Email:</Form.Label><div className="previewValueDisplay">{combinedDetails.email}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Employment Information</h4>
      <Row className="mb-3"><Col><Form.Label>Security Clearance:</Form.Label><div className="previewValueDisplay">{combinedDetails.securityClearance}</div></Col>{combinedDetails.securityClearance === 'yes' && (<Col><Form.Label>Clearance Level:</Form.Label><div className="previewValueDisplay">{combinedDetails.clearanceLevel}</div></Col>)}<Col><Form.Label>Willing to Relocate:</Form.Label><div className="previewValueDisplay">{combinedDetails.willingToRelocate}</div></Col></Row>
      <Row className="mb-3">
        <Col><Form.Label>Work Preference:</Form.Label><div className="previewValueDisplay">{combinedDetails.workPreference}</div></Col>
        <Col><Form.Label>Years of Experience:</Form.Label><div className="previewValueDisplay">{combinedDetails.yearsOfExperience}</div></Col>
      </Row>
      <Row className="mb-3">
        <Col><Form.Label>Restricted Companies:</Form.Label><div className="previewValueDisplay">{combinedDetails.restrictedCompanies}</div></Col>
      </Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Job Preferences</h4>
      <Row className="mb-3"><Col><Form.Label>Jobs to Apply For:</Form.Label><div className="previewValueDisplay">{combinedDetails.jobsToApply}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Current Salary:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentSalary}</div></Col><Col><Form.Label>Expected Salary:</Form.Label><div className="previewValueDisplay">{combinedDetails.expectedSalary}</div></Col><Col><Form.Label>Visa Status:</Form.Label><div className="previewValueDisplay">{combinedDetails.visaStatus}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Education</h4>
      <Row className="mb-3"><Col><Form.Label>University Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.universityName}</div></Col><Col><Form.Label>University Address:</Form.Label><div className="previewValueDisplay">{combinedDetails.universityAddress || 'N/A'}</div></Col><Col><Form.Label>Course of Study:</Form.Label><div className="previewValueDisplay">{combinedDetails.courseOfStudy}</div></Col></Row>
      <Row className="mb-3">
        <Col><Form.Label>Graduation From Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.graduationFromDate}</div></Col>
        <Col><Form.Label>Graduation To Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.graduationToDate}</div></Col>
        <Col><Form.Label>Notice Period:</Form.Label><div className="previewValueDisplay">{combinedDetails.noticePeriod}</div></Col>
      </Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Current Employment</h4>
      <Row className="mb-3"><Col><Form.Label>Current Company:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentCompany}</div></Col><Col><Form.Label>Current Designation:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentDesignation}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Preferred Interview Time:</Form.Label><div className="previewValueDisplay">{combinedDetails.preferredInterviewTime}</div></Col><Col><Form.Label>Earliest Joining Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.earliestJoiningDate}</div></Col><Col><Form.Label>Relieving Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.relievingDate}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">References</h4>
      <Row className="mb-3"><Col><Form.Label>Reference Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceName}</div></Col><Col><Form.Label>Reference Phone:</Form.Label><div className="previewValueDisplay">{combinedDetails.referencePhone}</div></Col><Col><Form.Label>Reference Address:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceAddress}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Reference Email:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceEmail}</div></Col><Col><Form.Label>Reference Role:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceRole}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Job Portal Information</h4>
      <Form.Group className="mb-3"><Form.Label>Account Name & Credentials:</Form.Label><div className="previewTextAreaDisplay">{combinedDetails.jobPortalAccountNameandCredentials}</div></Form.Group>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Uploaded Resume & Cover Letter</h4>
      <Form.Group className="mb-3">
        <Form.Label>Resume:</Form.Label>
        <div className="previewValueDisplay">
          {combinedDetails.resumeFileName ? <a href={combinedDetails.resumeUrl} target="_blank" rel="noopener noreferrer">{combinedDetails.resumeFileName}</a> : 'N/A'}
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Cover Letter:</Form.Label>
        <div className="previewValueDisplay">
          {combinedDetails.coverLetterFileName ? <a href={combinedDetails.coverLetterUrl} target="_blank" rel="noopener noreferrer">{combinedDetails.coverLetterFileName}</a> : 'N/A'}
        </div>
      </Form.Group>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Your Profile Details for "{serviceDetails.service}"</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isSimpleService ? renderSimpleDetails() : renderJobSupportDetails()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

  const handleImageView = (url) => {
    setImageUrlToView(url);
    setShowImageViewer(true);
  };

  // Add this useMemo hook to combine data efficiently
  const updatedClientData = useMemo(() => {
    if (!clientData) return null;
    return {
      ...clientData,
      files: allFiles // Replace the original 'files' array with the combined 'allFiles'
    };
  }, [clientData, allFiles]);


  // ... inside the ClientDashboard main component

  // In ClientDashboard.jsx, add this constant before the return statement.

  const modernWorksheetStyles = `
  /* --- Main Worksheet & Tab Styles --- */
  .worksheet-view {
    max-width: 100%; /* Use full width available */
    margin: 0 auto;
    padding: 1.5rem;
    background-color: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.07);
    border: 1px solid var(--border-color);
  }
  .worksheet-tabs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }
  .worksheet-tab-button {
    padding: 0.75rem 1.5rem;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    background-color: transparent;
    color: var(--text-secondary);
  }
  .worksheet-tab-button:hover {
    background-color: var(--bg-nav-link-hover);
    color: var(--text-primary);
  }
  .worksheet-tab-button--active {
    background-color: #3b82f6;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  /* --- Applications Tab Styles --- */
  .applications-container {
    font-family: 'Inter', sans-serif;
  }
  .date-ribbon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    background-color: var(--bg-body);
    padding: 0.75rem;
    border-radius: 12px;
  }
  .date-ribbon__nav-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    flex-shrink: 0;
    transition: background-color 0.2s;
  }
  .date-ribbon__nav-button:hover {
    background: #2563eb;
  }
  .date-ribbon__scroll-container {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.5rem 0;
    flex-grow: 1;
    scrollbar-width: none; /* Firefox */
  }
  .date-ribbon__scroll-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .date-ribbon__date-item {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: var(--bg-card);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    cursor: pointer;
    min-width: 120px;
    text-align: center;
    transition: all 0.2s ease;
    margin: 0 0.25rem;
  }
  .date-ribbon__date-item--active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    transform: translateY(-2px);
  }
  .worksheet-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .worksheet-search {
    display: flex;
    align-items: center;
    background-color: var(--bg-card);
    border-radius: 25px;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 300px;
  }
  .worksheet-search input {
    border: none;
    outline: none;
    flex-grow: 1;
    font-size: 1rem;
    background: transparent;
    color: var(--text-primary);
  }
  .worksheet-table-container {
    overflow-x: auto;
  }
  .worksheet-table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
  }
  .worksheet-table th, .worksheet-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  .worksheet-table thead th {
    background-color: var(--bg-body);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
  }
  .worksheet-table tbody tr:hover {
    background-color: var(--bg-nav-link-hover);
  }

  /* --- Documents Tab Styles --- */
  .documents-container {
    text-align: center;
  }
  .documents-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  .documents-subtabs {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  .documents-subtab-button {
    padding: 0.6rem 1.2rem;
    border: 1px solid var(--border-color);
    border-radius: 50px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background-color: var(--bg-card);
    color: var(--text-secondary);
  }
  .documents-subtab-button:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
  .documents-subtab-button--active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  .document-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .document-card {
    text-decoration: none;
    color: inherit;
  }
  .document-card__content {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .document-card__content:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  .document-card__image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  .document-card__title {
    margin: 0;
    font-weight: 600;
    word-break: break-word;
    color: var(--text-primary);
  }
  .document-card__placeholder {
    font-size: 3rem; /* Larger icon */
    color: #3b82f6;
    margin-bottom: 1rem;
  }

  /* --- Dark Mode Styles --- */
  html.dark-mode .worksheet-view {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  html.dark-mode .worksheet-tab-button {
    color: #a0aec0;
  }
  html.dark-mode .worksheet-tab-button:hover {
    background-color: #4a5568;
    color: #e2e8f0;
  }
  html.dark-mode .worksheet-tab-button--active {
    background-color: #4299e1;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);
  }
  html.dark-mode .date-ribbon {
    background-color: #1a202c;
  }
  html.dark-mode .date-ribbon__date-item {
    background-color: #2d3748;
    color: #a0aec0;
    border-color: #4a5568;
  }
  html.dark-mode .date-ribbon__date-item--active {
    background-color: #4299e1;
    color: #ffffff;
    border-color: #4299e1;
  }
  html.dark-mode .worksheet-search {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  html.dark-mode .worksheet-table thead th {
    background-color: #1a202c;
    color: #a0aec0;
  }
  html.dark-mode .worksheet-table tbody tr:hover {
    background-color: #4a5568;
  }
  html.dark-mode .documents-subtab-button {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #a0aec0;
  }
  html.dark-mode .documents-subtab-button:hover {
    border-color: #4299e1;
    color: #4299e1;
  }
  html.dark-mode .documents-subtab-button--active {
    background-color: #4299e1;
    color: #ffffff;
    border-color: #4299e1;
  }
  html.dark-mode .document-card__content {
    background-color: #2d3748;
    border-color: #4a5568;
  }
`;

  return (
    <div className="client-dashboard-container">
      {/* Dynamic Styles injected here */}
      <style>
        {`
        /* Base styles for the dashboard container */
        .client-dashboard-container {
          font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
          background: #f8fafc;
          color: #1e293b;
          min-height: 100vh;
          display: flex;
          flex-direction: column; /* Changed to column to stack header and content */
          overflow-x: hidden; /* Prevent horizontal scroll due to fixed sidebar */
        }

        html.dark-mode .client-dashboard-container {
          background: #1a202c;
          color: #e2e8f0;
        }

        html.dark-mode .modal-content-style {
          background: #2d3748;
          border: 1px solid #4a5568;
        }

        html.dark-mode .modal-close-button {
          color: #a0aec0;
        }

        html.dark-mode .modal-close-button:hover {
          background-color: #4a5568;
        }

        html.dark-mode .modal-table-header {
          background-color: #4a5568;
          color: #cbd5e1;
        }

        html.dark-mode .modal-table-cell {
          background-color: #2d3748;
          color: #e2e8f0;
          border-bottom: 1px solid #4a5568;
        }

        html.dark-mode .modal-table-row:hover {
          background-color: #4a5568;
        }

        html.dark-mode .chart-and-ads-container {
          background: #2d3748;
          border: 1px solid #4a5568;
        }

        html.dark-mode .ad-placeholder {
          background: #2d3748;
          border: 1px solid #4a5568;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }

        html.dark-mode .ad-placeholder p {
          color: #a0aec0;
        }

        html.dark-mode .dashboard-title {
          color: #e2e8f0;
        }

        html.dark-mode .sidebar-menu {
          background: #2d3748;
          color: #e2e8f0;
          box-shadow: -4px 0 20px rgba(0,0,0,0.3);
        }

        html.dark-mode .sidebar-menu h4 {
          color: #e2e8f0;
        }

        html.dark-mode .sidebar-menu div[style*="background-color: #f8fafc"] {
          background-color: #4a5568 !important;
        }

        html.dark-mode .sidebar-menu p[style*="color: #64748b"] {
          color: #a0aec0 !important;
        }

        html.dark-mode .sidebar-menu p[style*="color: #1e293b"] {
          color: #e2e8f0 !important;
        }

        html.dark-mode .help-support-button {
          color: #a0aec0;
        }

        html.dark-mode .help-support-button:hover {
          color: #63b3ed;
        }

        html.dark-mode .logout-button {
          background: #4a5568;
          color: #fc8181;
        }

        html.dark-mode .logout-button:hover {
          background-color: #6b4617;
        }

        .previewValueDisplay { padding: 0.4rem 0.6rem; font-size: 0.95rem; background-color: #e9ecef; border-radius: 5px; border: 1px solid #ced4da; min-height: 38px; display: flex; align-items: center; word-break: break-word; }
.previewTextAreaDisplay { padding: 0.4rem 0.6rem; font-size: 0.95rem; background-color: #e9ecef; border-radius: 5px; border: 1px solid #ced4da; min-height: 80px; align-items: flex-start; display: flex; word-break: break-word; }

       /* --- Under Development Page Styles --- */
.under-development-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
}
.back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #333;
  transition: background-color 0.3s ease;
  font-weight: 600;
  margin-bottom: 30px;
}
html.dark-mode .back-btn {
  background-color: #4a5568;
  color: #e2e8f0;
}
.back-btn:hover {
  background-color: #e0e0e0;
}
html.dark-mode .back-btn:hover {
  background-color: #64748B;
}
.development-message h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: var(--text-primary);
}
.development-message p {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.notify-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}
.notify-btn:hover {
  background-color: #0056b3;
}
.notify-success-message {
  color: #28a745;
  font-weight: 500;
  margin-top: 20px;
}
html.dark-mode .notify-success-message {
  color: #9ae6b4;
}

        /* Styles for various buttons and cards */
        .download-button {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .download-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.2);
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }

        /* New Renew Button Style */
        .renew-button-style {
          width: 6.5em;
          height: 2.3em;
          margin: 0.5em auto; /* Center the button */
          background: black;
          color: white;
          border: none;
          border-radius: 0.625em;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          z-index: 1;
          overflow: hidden;
          display: block; /* Ensure it takes full width of its container for margin:auto */
          text-align: center; /* Center text if display:block */
          line-height: 2.3em; /* Vertically center text */
        }

        .renew-button-style:hover {
          color: black;
        }

        .renew-button-style:after {
          content: "";
          background: white;
          position: absolute;
          z-index: -1;
          left: -20%;
          right: -20%;
          top: 0;
          bottom: 0;
          transform: skewX(-45deg) scale(0, 1);
          transition: all 0.5s;
        }

        .renew-button-style:hover:after {
          transform: skewX(-45deg) scale(1, 1);
          -webkit-transition: all 0.5s;
          transition: all 0.5s;
        }


        .renew-plan-button { /* This is for the sidebar button */
          background: linear-gradient(135deg, #4ade80 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 32px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          width: 100%;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .renew-plan-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            background: #2563eb;
        }

        .help-support-button {
            background: none;
            border: none;
            color: #64748b;
            font-size: 0.9375rem;
            font-weight: 500;
            text-align: center;
            padding: 12px 0;
            cursor: pointer;
            width: 100%;
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }
        .help-support-button:hover {
            color: #3b82f6;
        }

        .logout-button {
            background: #f1f5f9;
            color: #ef4444;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin: 16px 0 24px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .logout-button:hover {
            background-color: #fee2e2;
        }

        .back-button { /* This style is now unused for the ClientProfile modal */
            background: #ffffff;
            color: #3b82f6;
            border: 1px solid #e2e8f0;
            padding: '8px 16px';
            borderRadius: '6px';
            fontSize: '0.875rem';
            fontWeight: '500';
            cursor: 'pointer';
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)';
            display: 'flex';
            alignItems: 'center';
            transition: 'background-color 0.2s';
        }
        .back-button:hover {
            background-color: #f8fafc;
        }

        .worksheet-button {
            margin: 0 auto;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .worksheet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            background: #2563eb;
        }

        .interviews-card {
            padding: 40px 24px;
            border-radius: 16px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 10px 15px rgba(99, 102, 241, 0.3);
            cursor: pointer;
            flex: 1 1 300px; /* Flex-basis for cards, will wrap */
            max-width: 100%; /* Ensure it doesn't overflow on small screens */
            min-width: 280px; /* Minimum width for the card to be readable */
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative; /* For inner absolute elements */
            overflow: hidden; /* To contain background elements */
        }
        .interviews-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 25px rgba(99, 102, 241, 0.4);
        }

        .resume-card {
            padding: 40px 24px;
            border-radius: 16px;
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%)
            ;
            color: white;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 10px 15px rgba(16, 185, 129, 0.3);
            cursor: pointer;
            flex: 1 1 300px; /* Flex-basis for cards, will wrap */
            max-width: 100%; /* Ensure it doesn't overflow on small screens */
            min-width: 280px; /* Minimum width for the card to be readable */
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative; /* For inner absolute elements */
            overflow: hidden; /* To contain background elements */
        }
        .resume-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 25px rgba(16, 185, 129, 0.4);
        }

        /* Modal Specific Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .modal-content-style {
          background: #ffffff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
          width: 90%; /* Responsive width */
          max-width: 900px; /* Max width for larger screens */
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid #e2e8f0;
        }
        @media (max-width: 768px) {
            .modal-content-style {
                padding: 20px;
                width: 95%; /* Wider on small screens */
                margin: 10px; /* Some margin from edges */
            }
        }


        .modal-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .modal-close-button:hover {
            background-color: #f1f5f9;
        }

        .modal-table-container {
            overflow-x: auto; /* Enable horizontal scrolling for tables */
            border-radius: 8px;
        }

        .modal-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
            table-layout: auto; /* Allow column widths to adjust */
        }

        .modal-table-header {
            padding: 12px 16px;
            text-align: left;
            background-color: #f8fafc;
            color: #475569;
            font-size: 0.8125rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        @media (max-width: 768px) {
            .modal-table-header {
                font-size: 0.7rem; /* Smaller font on mobile */
                padding: 8px 10px;
            }
        }

        .modal-table-cell {
            padding: 16px;
            text-align: left;
            background-color: #ffffff;
            border: none;
            font-size: 0.875rem;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
            white-space: nowrap; /* Prevent text wrapping in cells on smaller screens */
        }
        @media (max-width: 768px) {
            .modal-table-cell {
                font-size: 0.8rem; /* Smaller font on mobile */
                padding: 10px;
            }
        }

        .modal-table-row {
            transition: background-color 0.2s;
        }
        .modal-table-row:hover {
            background-color: #f8fafc;
        }
        .modal-table-row td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        .modal-table-row td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        /* Chart and Advertisement Specific Styles */
        .chart-and-ads-container {
          display: grid;
          /* Explicitly setting fixed width for ads, 1fr for chart on large screens */
          grid-template-columns: 200px 1fr 200px;
          gap: 24px;
          margin: 0 auto 32px auto; /* Center the container */
          max-width: 1400px; /* Optional: Max width for the entire grid container */
          align-items: start; /* Align items to the start of the grid cell vertically */
          width: 100%; /* Ensure it takes full available width within its parent */
        }

        @media (max-width: 1024px) { /* Medium screens - stack ads above/below chart */
          .chart-and-ads-container {
            grid-template-columns: 1fr; /* Stack into a single column */
            grid-template-areas: "ad-left" "chart" "ad-right"; /* Define grid areas for stacking */
            gap: 20px;
          }
          .ad-column:first-child { grid-area: ad-left; } /* Left ad comes first */
          .ad-column:last-child { grid-area: ad-right; }  /* Right ad comes last */
        }

        @media (max-width: 768px) { /* Small screens (mobile) */
          .chart-and-ads-container {
            gap: 15px;
            padding: 0 10px; /* Add some horizontal padding */
          }
        }

        .ad-column {
          display: flex;
          justify-content: center;
          align-items: center; /* Center content vertically within the column */
          min-height: 250px; /* Ensure ads have a decent minimum height */
          height: auto; /* Allow height to adjust based on content */
          padding: 10px 0; /* Add some vertical padding within the column */
        }

        .ad-placeholder {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          padding: 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%; /* Ensure it fills its parent ad-column */
          height: 100%; /* Ensure it fills its parent ad-column */
          box-sizing: border-box; /* Include padding/border in element's total width and height */
        }
        .ad-placeholder p {
            font-size: 0.8rem; /* Slightly larger font for ad text */
            line-height: 1.4; /* Improve readability */
            margin-bottom: 5px;
        }
        .ad-placeholder img {
            max-width: 100%;
            height: auto; /* Maintain aspect ratio */
            border-radius: 8px;
            display: block; /* Remove extra space below image */
            margin: 0 auto 10px auto; /* Center image and add some margin */
            object-fit: contain; /* Ensure the image fits within its bounds without cropping */
            flex-grow: 1; /* Allow image to take available space */
        }
        .ad-placeholder p:last-of-type {
            margin-top: auto; /* Push the last paragraph to the bottom if space allows */
        }


        /* General element responsiveness */
        .main-content-area {
            flex-grow: 1;
            padding: 24px;
            max-width: 100%;
            padding-top: 60px; /* Added padding to account for fixed header */
        }
        @media (max-width: 768px) {
            .main-content-area {
                padding: 15px; /* Smaller padding on mobile */
                padding-top: 70px; /* Adjust for smaller header on mobile */
            }
            .dashboard-title {
                font-size: 1.5rem; /* Smaller title on mobile */
            }
        }
        @media (max-width: 480px) {
            .dashboard-title {
                font-size: 1.2rem;
            }
        }

        .cards-section {
            display: flex;
            justify-content: center;
            gap: 32px;
            margin: 40px 0;
            flex-wrap: wrap; /* Allow cards to wrap */
        }
        @media (max-width: 768px) {
            .cards-section {
                gap: 20px; /* Smaller gap on tablets */
                margin: 30px 0;
            }
        }
        @media (max-width: 480px) {
            .cards-section {
                gap: 15px; /* Even smaller gap on mobile */
                margin: 20px 0;
            }
        }

        /* ClientProfile Modal Specific Styles */
        .profile-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            width: 100%;
        }
        @media (max-width: 768px) {
            .profile-grid-container {
                grid-template-columns: 1fr; /* Stack on small screens */
            }
        }

        .profile-info-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        html.dark-mode .profile-info-card {
            background: #4a5568;
            border: 1px solid #64748B;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .profile-info-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1e293b;
            width: 100%;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        html.dark-mode .profile-info-title {
            color: #e2e8f0;
            border-bottom: 1px solid #64748B;
        }

        .profile-detail-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 8px;
            font-size: 0.95rem;
            color: #334155;
        }
        html.dark-mode .profile-detail-row {
            color: #e2e8f0;
        }

        .profile-detail-row .profile-detail-label {
            font-weight: 500;
            color: #475569;
            flex-basis: 40%;
            text-align: left;
        }
        html.dark-mode .profile-detail-row .profile-detail-label {
            color: #cbd5e1;
        }

        .profile-detail-row .profile-detail-value {
            flex-basis: 60%;
            text-align: right;
            font-weight: 400;
        }
        html.dark-mode .profile-detail-row .profile-detail-value {
            color: #e2e8f0;
        }


        /* Subscription Details Modal Specific Styles */
        .subscription-details-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin-bottom: 0;
          color: #1e293b;
        }

        html.dark-mode .subscription-details-card {
          background-color: #4a5568;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          color: #e2e8f0;
        }

        .subscription-detail-item {
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .subscription-detail-item:last-child {
          border-bottom: none;
        }
        html.dark-mode .subscription-detail-item {
          border-bottom: 1px solid #64748B;
        }

        .subscription-detail-label {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }
        html.dark-mode .subscription-detail-label {
          color: #a0aec0;
        }

        .subscription-detail-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 5px;
        }
        html.dark-mode .subscription-detail-value {
          color: #e2e8f0;
        }

        @media (max-width: 768px) {
          .subscription-details-card {
            padding: 15px;
            gap: 10px;
          }
          .subscription-detail-value {
            font-size: 1.3rem;
          }
        }

        /* Payment Options Modal Styles (New/Updated) */
        .payment-modal-content-wrapper {
            position: relative;
            background: #f8fafc; /* Light background for the overall modal */
            border-radius: 16px;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 1200px; /* Wider to accommodate two columns */
            max-height: 90vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column; /* Stack sections on small screens */
            padding: 20px; /* Overall padding */
        }
        @media (min-width: 1024px) {
            .payment-modal-content-wrapper {
                padding: 0; /* Remove overall padding if grid handles it */
            }
        }

        html.dark-mode .payment-modal-content-wrapper {
            background: #1a202c;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .payment-modal-grid {
            display: grid;
            grid-template-columns: 2fr 1fr; /* Payment Info takes 2/3, Order Summary 1/3 */
            gap: 20px;
            padding: 20px; /* Padding inside the grid */
        }
        @media (max-width: 1024px) {
            .payment-modal-grid {
                grid-template-columns: 1fr; /* Stack columns on smaller screens */
            }
        }

        .payment-info-section, .order-summary-section {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        html.dark-mode .payment-info-section, html.dark-mode .order-summary-section {
            background: #2d3748;
            border: 1px solid #4a5568;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .payment-section-header {
            display: flex;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        html.dark-mode .payment-section-header {
            color: #e2e8f0;
            border-bottom: 1px solid #4a5568;
        }
        .ssl-badge {
            background: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 5px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: auto;
        }
        html.dark-mode .ssl-badge {
            background: #4a5568;
            color: #9ae6b4;
        }

        .payment-sub-heading {
            font-size: 1rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 15px;
        }
        html.dark-mode .payment-sub-heading {
            color: #cbd5e1;
        }

        .payment-method-options {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap; /* Allow wrapping */
            justify-content: center; /* Center items when wrapped */
        }

        .payment-method-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            width: 120px; /* Fixed width for method cards */
            text-align: center;
            font-size: 0.85rem;
            font-weight: 500;
            color: #475569;
            transition: all 0.2s ease;
        }
        html.dark-mode .payment-method-card {
            background: #4a5568;
            border: 1px solid #64748B;
            color: #cbd5e1;
        }

        .payment-method-card.selected {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px #3b82f6;
            background: #e0f2fe; /* Light blue for selected */
            color: #1e293b;
        }
        html.dark-mode .payment-method-card.selected {
            background: #3182ce;
            color: #e2e8f0;
        }

        .payment-method-card svg {
            color: #64748b;
        }
        .payment-method-card.selected svg {
            color: #3b82f6;
        }
        html.dark-mode .payment-method-card svg {
            color: #a0aec0;
        }
        html.dark-mode .payment-method-card.selected svg {
            color: #90cdf4;
        }


        .all-methods-secured {
            text-align: center;
            font-size: 0.8rem;
            color: #64748b;
            margin-bottom: 25px;
        }
        html.dark-mode .all-methods-secured {
            color: #a0aec0;
        }

        .card-form label {
            display: block;
            font-size: 0.875rem;
            color: #475569;
            margin-bottom: 8px;
            font-weight: 500;
        }
        html.dark-mode .card-form label {
            color: #cbd5e1;
        }

        .card-form input[type="email"],
        .card-form input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            background: #f8fafc;
            color: #1e293b;
        }
        html.dark-mode .card-form input {
            background: #4a5568;
            border: 1px solid #64748B;
            color: #e2e8f0;
        }
        html.dark-mode .card-form input::placeholder {
            color: #a0aec0;
        }

        .card-form .form-row {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }
        .card-form .form-row > div {
            flex: 1;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            accent-color: #3b82f6; /* Modern way to style checkbox */
        }
        .checkbox-group label {
            margin-bottom: 0;
            font-size: 0.9rem;
            color: #475569;
            font-weight: 400;
        }
        html.dark-mode .checkbox-group label {
            color: #cbd5e1;
        }

        .payment-buttons {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-top: auto; /* Push buttons to the bottom */
            padding-top: 20px; /* Space from form fields */
            border-top: 1px solid #e2e8f0;
        }
        html.dark-mode .payment-buttons {
            border-top: 1px solid #4a5568;
        }

        .cancel-button {
            background: #e2e8f0;
            color: #475569;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
            flex: 1;
        }
        .cancel-button:hover {
            background-color: #cbd5e1;
        }
        html.dark-mode .cancel-button {
            background: #4a5568;
            color: #cbd5e1;
        }
        html.dark-mode .cancel-button:hover {
            background-color: #64748B;
        }

        .pay-button {
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
        }
        .pay-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }

        .order-summary-section {
            background: #f8fafc; /* Lighter background for summary */
            border: 1px solid #e2e8f0;
            padding: 30px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
        }
        html.dark-mode .order-summary-section {
            background: #2d3748;
            border: 1px solid #4a5568;
        }

        .summary-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-bottom: 25px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            border: 1px solid #e2e8f0;
        }
        html.dark-mode .summary-card {
            background: #4a5568;
            border: 1px solid #64748B;
        }

        .summary-item-logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .summary-main-text {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }
        html.dark-mode .summary-main-text {
            color: #e2e8f0;
        }
        .summary-sub-text {
            font-size: 0.85rem;
            color: #64748b;
            margin: 0;
        }
        html.dark-mode .summary-sub-text {
            color: #a0aec0;
        }

        .summary-rating {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #475569;
        }
        html.dark-mode .summary-rating {
            color: #cbd5e1;
        }
        .star-icon {
            margin-right: 5px;
            font-size: 1.1rem;
        }
        .reviews-count {
            margin-left: 10px;
            color: #94a3b8;
        }
        html.dark-mode .reviews-count {
            color: #a0aec0;
        }

        .summary-divider {
            border-top: 1px dashed #e2e8f0;
            margin: 15px 0;
        }
        html.dark-mode .summary-divider {
            border-top: 1px dashed #64748B;
        }

        .bill-to-details p {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #475569;
            margin-bottom: 8px;
        }
        html.dark-mode .bill-to-details p {
            color: #cbd5e1;
        }

        .summary-line-item {
            display: flex;
            justify-content: space-between;
            font-size: 0.95rem;
            color: #475569;
            margin-bottom: 10px;
        }
        html.dark-mode .summary-line-item {
            color: #cbd5e1;
        }
        .summary-line-item span:first-child {
            font-weight: 500;
        }
        .summary-line-item span:last-child {
            font-weight: 600;
            color: #1e293b;
        }
        html.dark-mode .summary-line-item span:last-child {
            color: #e2e8f0;
        }

        .included-text {
            color: #047857;
            font-weight: 600;
        }
        html.dark-mode .included-text {
            color: #9ae6b4;
        }

        .summary-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.2rem;
            font-weight: 700;
            color: #1e293b;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
        }
        html.dark-mode .summary-total {
            color: #e2e8f0;
            border-top: 1px solid #4a5568;
        }

        .security-trust-info {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px dashed #e2e8f0;
        }
        html.dark-mode .security-trust-info {
            border-top: 1px dashed #64748B;
        }
        .security-trust-info p {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #475569;
            margin-bottom: 8px;
        }
        html.dark-mode .security-trust-info p {
            color: #cbd5e1;
        }
        .green-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #047857;
            border-radius: 50%;
            margin-right: 8px;
        }
        html.dark-mode .green-dot {
            background-color: #9ae6b4;
        }

        .back-to-dashboard-button {
            background: none;
            border: none;
            color: #3b82f6;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            transition: background-color 0.2s;
        }
        .back-to-dashboard-button:hover {
            background-color: #e0f2fe;
        }
        html.dark-mode .back-to-dashboard-button {
            color: #90cdf4;
        }
        html.dark-mode .back-to-dashboard-button:hover {
            background-color: #4a5568;
        }

        @media (max-width: 768px) {
            .payment-info-section, .order-summary-section {
                padding: 20px;
            }
            .payment-section-header {
                font-size: 1rem;
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .payment-sub-heading {
                font-size: 0.9rem;
                margin-bottom: 10px;
            }
            .payment-method-options {
                gap: 10px;
                margin-bottom: 20px;
            }
            .payment-method-card {
                width: 100px;
                padding: 10px;
                font-size: 0.75rem;
            }
            .card-form input {
                padding: 10px;
                font-size: 0.85rem;
                margin-bottom: 15px;
            }
            .card-form .form-row {
                gap: 10px;
                margin-bottom: 15px;
            }
            .checkbox-group label {
                font-size: 0.8rem;
            }
            .payment-buttons {
                flex-direction: column;
                gap: 10px;
                padding-top: 15px;
            }
            .cancel-button, .pay-button {
                padding: 10px 15px;
                font-size: 0.9rem;
            }
            .summary-card {
                padding: 20px;
                gap: 10px;
            }
            .summary-main-text {
                font-size: 1rem;
            }
            .summary-sub-text {
                font-size: 0.75rem;
            }
            .summary-rating {
                font-size: 0.8rem;
            }
            .bill-to-details p, .summary-line-item, .security-trust-info p {
                font-size: 0.85rem;
            }
            .summary-total {
                font-size: 1rem;
            }
            .back-to-dashboard-button {
                font-size: 0.85rem;
            }
        }
         /* --- NEW STYLES FOR SERVICES SECTION --- */
        .services-browse {
            margin-top: 50px;
            text-align: center;
        }
        .services-browse h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            color: var(--text-primary);
        }
        .services-browse p {
            font-size: 16px;
            margin-bottom: 30px;
            color: var(--text-secondary);
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .service-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .card-icon-container {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
        }
        .card-icon-container svg {
            width: 28px;
            height: 28px;
        }
        .job-app-icon { background-color: #e0f2fe; color: #0ea5e9; }
        .mobile-app-icon { background-color: #e0e7ff; color: #6366f1; }
        .web-app-icon { background-color: #dcfce7; color: #22c55e; }
        .digital-marketing-icon { background-color: #ffedd5; color: #f97316; }
        .it-talent-icon { background-color: #f3e8ff; color: #a855f7; }
        .cybersecurity-icon { background-color: #fee2e2; color: #ef4444; }

        .service-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 15px 0 5px;
            color: var(--text-primary);
        }
        .service-card p {
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            color: var(--text-secondary);
            flex-grow: 1; /* Makes sure the text takes available space */
        }
        .dashboard-btn, .book-now-btn {
            color: #ffffff;
            padding: 12px 0;
            width: 100%;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        .book-now-btn { background-color: #10b981; }
        .book-now-btn:hover { background-color: #059669; }
        .dashboard-btn { background-color: #3b82f6; }
        .dashboard-btn:hover { background-color: #2563eb; }
        
        /* Dark mode styles for new section */
        html.dark-mode .services-browse p { color: #a0aec0; }
        html.dark-mode .service-card { background-color: #2d3748; border-color: #4a5568; }
        html.dark-mode .service-card:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        /* In ClientDashboard.jsx, add these styles to one of your existing <style> blocks. */



        `}
      </style>

      {/* Client Header */}
      <ClientHeader
        clientUserName={clientUserName}
        clientInitials={clientInitials}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleMenu} // Still passed, but the hamburger button is removed
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        profileDropdownRef={profileDropdownRef}
        onClientProfileClick={handleClientProfileClick}
        onSubscriptionClick={handleSubscriptionClick}
        unreadNotificationsCount={unreadNotificationsCount}
        onNotificationClick={handleNotificationClick}
        onLogoutClick={handleLogout}
        onLogoClick={() => navigate('/')}
        activeServices={activeServices}
        inactiveServices={inactiveServices}
        onActiveServiceClick={handleActiveServiceClick}
        onInactiveServiceClick={handleInactiveServiceClick}
      />

      {/* Dimming Overlay */}
      <DimmingOverlay
        isVisible={isOverlayVisible}
        onClick={() => {
          if (menuOpen) setMenuOpen(false); // This will no longer be triggered by hamburger menu
          if (showInterviewsModal) setShowInterviewsModal(false);
          if (showResumeModal) setShowResumeModal(false);
          if (showPaymentModal) setShowPaymentModal(false);
          if (showSubscriptionDetailsModal) setShowSubscriptionDetailsModal(false);
          if (showNotificationsModal) setShowNotificationsModal(false);
          if (showAttachmentModal) setShowAttachmentModal(false);
          if (showDateRangeModal) setShowDateRangeModal(false);
          if (showJobDescriptionModal) setShowJobDescriptionModal(false);
          if (showFilterModal) setShowFilterModal(false);
          if (showPaymentOptionsModal) setShowPaymentOptionsModal(false); // Close payment options modal
        }}
      />

      {/* Modals */}
      {showInterviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleInterviewsModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Scheduled Interviews
            </h3>
            <div className="modal-table-container">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Time</th>
                    <th className="modal-table-header">Job ID</th>
                    <th className="modal-table-header">Company</th>
                    <th className="modal-table-header">Job Type</th>
                    <th className="modal-table-header">Recruiter Mail ID</th>
                    <th className="modal-table-header">Round</th>
                    <th className="modal-table-header">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledInterviews.map((interview) => (
                    <tr key={interview.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{interview.appliedDate}</div>
                      </td>
                      <td className="modal-table-cell">{interview.interviewTime}</td>
                      <td className="modal-table-cell">{interview.jobId}</td>
                      <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.company}</td>
                       <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.jobType}</td>
                      <td className="modal-table-cell">{interview.recruiterMail}</td>
                      <td className="modal-table-cell">
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            interview.round === 'Round 1' ? '#EFF6FF' :
                              interview.round === 'Round 2' ? '#ECFDF5' :
                                interview.round === 'Round 3' ? '#FEF3C7' : '#F3E8FF',
                          color:
                            interview.round === 'Round 1' ? '#1D4ED8' :
                              interview.round === 'Round 2' ? '#047857' :
                                interview.round === 'Round 3' ? '#92400E' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {interview.round}
                        </div>
                      </td>
                      <td className="modal-table-cell">
                        {interview.attachments && interview.attachments.length > 0 ? (
                          <button
                            onClick={() => handleAttachmentClick(interview.attachments)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: '#3b82f6',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              borderRadius: '4px',
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                              <path d="M16 21v-6a2 2 0 0 1 2-2h2l-5 5-5-5h2a2 2 0 0 1 2 2v6z"></path>
                            </svg>
                            ({interview.attachments.length})
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleResumeModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Resume Updates
            </h3>
            <div className="modal-table-container">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Update Type</th>
                    <th className="modal-table-header">Status</th>
                    <th className="modal-table-header">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumeUpdates.map((update) => (
                    <tr key={update.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{update.date}</div>
                      </td>
                      <td style={{ fontWeight: '600' }} className="modal-table-cell">{update.type}</td>
                      <td className="modal-table-cell">
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            update.status === 'Updated' ? '#EFF6FF' :
                              update.status === 'Reviewed' ? '#FEF3C7' :
                                update.status === 'Completed' ? '#ECFDF5' : '#F3E8FF',
                          color:
                            update.status === 'Updated' ? '#1D4ED8' :
                              update.status === 'Reviewed' ? '#92400E' :
                                update.status === 'Completed' ? '#047857' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {update.status}
                        </div>
                      </td>
                      <td className="modal-table-cell">{update.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Download Button with Animation (using a CSS class now) */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleDownloadResume}
                className="download-button" // Applying the CSS class
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Latest Resume
              </button>
              {latestResumeUpdate && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                  Last updated: {formattedLatestResumeDate}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentPlanModal
          selectedRadioPlan={selectedRadioPlan}
          handleRadioPlanChange={handleRadioPlanChange}
          handleProceedToPayment={handleProceedToPayment} // This now triggers the new modal
          onClose={togglePaymentModal}
        />
      )}

      {showPaymentOptionsModal && (
        <PaymentOptionsModal
          onClose={() => setShowPaymentOptionsModal(false)}
          selectedPlanName={planToPayFor.name}
          selectedPlanPrice={planToPayFor.price}
        />
      )}

      <ClientServiceDetailsModal
        show={isServiceDetailsModalOpen}
        onHide={() => setIsServiceDetailsModalOpen(false)}
        serviceDetails={selectedServiceForDetails}
      />

      {showSubscriptionDetailsModal && (
        <SubscriptionDetailsModal
          togglePaymentModal={togglePaymentModal}
          currentPlanPrice={currentPlanPrice}
          daysLeftInPlan={daysLeftInPlan}
          onClose={toggleSubscriptionDetailsModal}
        />
      )}

      {showNotificationsModal && (
        <NotificationModal
          notifications={notifications}
          onClose={closeNotificationsModal}
        />
      )}

      {showAttachmentModal && (
        <AttachmentModal
          attachments={currentAttachments}
          onClose={closeAttachmentModal}
        />
      )}

      {/* Sidebar Menu (This is now permanently hidden as per request 1) */}
      <div className="sidebar-menu" style={{
        position: 'fixed',
        top: 0,
        right: '-280px', // Always off-screen
        height: '100%',
        width: '280px',
        background: '#ffffff',
        color: '#1e293b',
        padding: '24px',
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
        zIndex: 100,
        transition: 'right 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Profile Section */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '3px solid #e2e8f0'
        }}>
          <img
            src={profilePlaceholder}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <h4 style={{
          marginBottom: '16px',
          fontWeight: '700',
          fontSize: '1.25rem',
          color: '#1e293b'
        }}>
          {clientUserName}
        </h4>

        {/* Plan Details */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>1 Month Plan</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>$199</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>Days Left</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>28</p>
          </div>
        </div>

        {/* Renew Plan Button in Sidebar */}
        <button
          onClick={togglePaymentModal}
          className="renew-plan-button"
        >
          Renew Plan
        </button>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Bottom Links */}
        <button
          onClick={() => navigate('/contactus')}
          className="help-support-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6C6 6 6.5 5 8 5C9.5 5 10 6 10 6C10 6 9.5 7 8 7C6.5 7 6 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 8H6.01M10 8H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Help & Support
        </button>

        {/* <button
          onClick={handleLogout}
          className="logout-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log Out
        </button> */}
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Conditional rendering for Client Module vs. Worksheet View */}
          {showUnderDevelopment ? (
          // If true, render the "under development" container
          <div className="under-development-container">
            <button className="back-btn" onClick={handleGoBack}>← Go Back to Dashboard</button>
            <div className="development-message">
              <h2>{developmentService} Dashboard</h2>
              <p>This dashboard is currently under development. We will update you as soon as it's ready!</p>
              {!showNotifyMessage ? (
                <button className="notify-btn" onClick={handleNotifyMeClick}>Notify me</button>
              ) : (
                <p className="notify-success-message">Once it's ready, we will send you an email notification. Thank you!</p>
              )}
            </div>
          </div>
        ) : (
        !isInWorksheetView ? (
          <>
            <h2 className="dashboard-title">
              Client Module
            </h2>

            {/* Tabs for Dashboard, Applications, Documents */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: 'wrap', // Allow tabs to wrap on smaller screens
              }}
            >
            </div>

            {/* Content for main dashboard tabs */}
            {activeTab === "Dashboard" && (
              <>
                <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Welcome, {clientUserName} </h1>

                {/* <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <button
                    onClick={() => {
                      setIsInWorksheetView(true); // Switch to worksheet view
                      setActiveWorksheetTab("Applications"); // Default to Applications tab within worksheet
                    }}
                    className="worksheet-button"
                  >
                    View Your Job Applications
                  </button>
                </div> */}

                {/* --- NEW SECTION INSERTED HERE --- */}
                {/* In the return block, under the "Dashboard" tab, replace the entire services-browse section. */}

                <section className="services-browse">
                  <h2>Browse Our Services</h2>
                  <p>Find the right tools to accelerate your growth.</p>
                  <div className="services-grid">
                    {servicesData.map((service) => {
                      // Check if the current service title exists in the list of active services
                      const isActive = activeServices.some(active => active.title === service.title);

                      return (
                        <div key={service.key} className="service-card">
                          <div className={`card-icon-container ${service.iconClass}`}>
                            {service.icon}
                          </div>
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>

                          {isActive ? (
                            // If the service is active, show the "View Dashboard" button
                            <button
                              className="dashboard-btn"
                              onClick={() => handleViewDashboardClick(service.title)}
                            >
                              View Dashboard →
                            </button>
                          ) : (
                            // If the service is inactive, show the "Book Now" button
                            <button
                              className="book-now-btn"
                              onClick={() => handleViewDashboardClick(service.title)}
                            >
                              Book Now
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className="cards-section">
                  <div
                    onClick={toggleInterviewsModal}
                    className="interviews-card"
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      right: '-20px',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                      zIndex: 1
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '-30px',
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      zIndex: 1
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px' }}>
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                        INTERVIEWS SCHEDULED
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        opacity: '0.9',
                        marginTop: '8px',
                        fontWeight: '400'
                      }}>
                        {scheduledInterviews.length} upcoming
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={toggleResumeModal}
                    className="resume-card"
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      right: '-20px',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                      zIndex: 1
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '-30px',
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      zIndex: 1
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px' }}>
                        <path d="M9 12H15M9 16H15M10 3H14C15.1046 3 16 3.89543 16 5V20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20V5C8 3.89543 8.89543 3 10 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                        RESUME UPDATES
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        opacity: '0.9',
                        marginTop: '8px',
                        fontWeight: '400'
                      }}>
                        {filteredResumeUpdates.length} recent updates
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* If activeTab is 'Applications' or 'Documents' directly from the main tabs, render WorksheetView */}
            {activeTab === "Applications" && !isInWorksheetView && (
              <WorksheetView
                setActiveTab={setActiveTab}
                activeWorksheetTab={"Applications"} // Force Applications tab
                setActiveWorksheetTab={setActiveWorksheetTab}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateRange={dateRange}
                currentStartDate={currentStartDate}
                setCurrentStartDate={setCurrentStartDate}
                showPreviousWeek={showPreviousWeek}
                showNextWeek={showNextWeek}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startDateFilter={startDateFilter}
                setStartDateFilter={setStartDateFilter}
                endDateFilter={endDateFilter}
                setEndDateFilter={setEndDateFilter}
                showDateRangeModal={showDateRangeModal}
                setShowDateRangeModal={setShowDateRangeModal}
                tempStartDate={tempStartDate}
                setTempStartDate={setTempStartDate}
                tempEndDate={tempEndDate}
                setTempEndDate={tempEndDate}
                handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
                handleApplyDateRange={handleApplyDateRange}
                handleClearDateRangeInModal={handleClearDateRangeInModal}
                showJobDescriptionModal={showJobDescriptionModal}
                setShowJobDescriptionModal={setShowJobDescriptionModal}
                currentJobDescription={currentJobDescription}
                setCurrentJobDescription={setCurrentJobDescription}
                handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
                handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
                filterWebsites={filterWebsites}
                setFilterWebsites={setFilterWebsites}
                filterPositions={filterPositions}
                setFilterPositions={setFilterPositions}
                filterCompanies={filterCompanies}
                setFilterCompanies={setFilterCompanies}
                uniqueWebsites={uniqueWebsites}
                uniquePositions={uniquePositions}
                uniqueCompanies={uniqueCompanies}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
                tempSelectedWebsites={tempSelectedWebsites}
                setTempSelectedWebsites={setTempSelectedWebsites}
                tempSelectedPositions={tempSelectedPositions}
                setTempSelectedPositions={setTempSelectedPositions}
                tempSelectedCompanies={tempSelectedCompanies}
                setTempSelectedCompanies={setTempSelectedCompanies}
                handleOpenFilterModal={() => setShowFilterModal(true)}
                handleCloseFilterModal={() => setShowFilterModal(false)}
                handleApplyCategoricalFilters={() => {
                  setFilterWebsites(tempSelectedWebsites);
                  setFilterPositions(tempSelectedPositions);
                  setFilterCompanies(tempSelectedCompanies);
                  setShowFilterModal(false);
                }}
                handleClearTempFiltersInModal={() => {
                  setTempSelectedWebsites([]);
                  setTempSelectedPositions([]);
                  setTempSelectedCompanies([]);
                }}
                handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
                handlePositionCheckboxChange={handlePositionCheckboxChange}
                handleCompanyCheckboxChange={handleCompanyCheckboxChange}
                isGlobalFilterActive={isGlobalFilterActive}
                clearAllFilters={clearAllFilters}
                getApplicationsSectionTitle={getApplicationsSectionTitle}
                filteredApplicationsForDisplay={filteredApplicationsForDisplay}
                downloadApplicationsData={downloadApplicationsData}
                applicationsData={applicationsData}
                allApplicationsFlattened={allApplicationsFlattened}
                setActiveSubTab={setActiveSubTab}
                clientData={clientData}
                setIsInWorksheetView={setIsInWorksheetView}
                onImageView={handleImageView}
              />
            )}

            {activeTab === "Documents" && !isInWorksheetView && (
              <WorksheetView
                setActiveTab={setActiveTab}
                activeWorksheetTab={"Documents"} // Force Documents tab
                setActiveWorksheetTab={setActiveWorksheetTab}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateRange={dateRange}
                currentStartDate={currentStartDate}
                setCurrentStartDate={setCurrentStartDate}
                showPreviousWeek={showPreviousWeek}
                showNextWeek={showNextWeek}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startDateFilter={startDateFilter}
                setStartDateFilter={setStartDateFilter}
                endDateFilter={endDateFilter}
                setEndDateFilter={setEndDateFilter}
                showDateRangeModal={showDateRangeModal}
                setShowDateRangeModal={setShowDateRangeModal}
                tempStartDate={tempStartDate}
                setTempStartDate={setTempStartDate}
                tempEndDate={tempEndDate}
                setTempEndDate={tempEndDate}
                handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
                handleApplyDateRange={handleApplyDateRange}
                handleClearDateRangeInModal={handleClearDateRangeInModal}
                showJobDescriptionModal={showJobDescriptionModal}
                setShowJobDescriptionModal={setShowJobDescriptionModal}
                currentJobDescription={currentJobDescription}
                setCurrentJobDescription={setCurrentJobDescription}
                handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
                handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
                filterWebsites={filterWebsites}
                setFilterWebsites={setFilterWebsites}
                filterPositions={filterPositions}
                setFilterPositions={setFilterPositions}
                filterCompanies={filterCompanies}
                setFilterCompanies={setFilterCompanies}
                uniqueWebsites={uniqueWebsites}
                uniquePositions={uniquePositions}
                uniqueCompanies={uniqueCompanies}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
                tempSelectedWebsites={tempSelectedWebsites}
                setTempSelectedWebsites={setTempSelectedWebsites}
                tempSelectedPositions={tempSelectedPositions}
                setTempSelectedPositions={setTempSelectedPositions}
                tempSelectedCompanies={tempSelectedCompanies}
                setTempSelectedCompanies={setTempSelectedCompanies}
                handleOpenFilterModal={() => setShowFilterModal(true)}
                handleCloseFilterModal={() => setShowFilterModal(false)}
                handleApplyCategoricalFilters={() => {
                  setFilterWebsites(tempSelectedWebsites);
                  setFilterPositions(tempSelectedPositions);
                  setFilterCompanies(tempSelectedCompanies);
                  setShowFilterModal(false);
                }}
                handleClearTempFiltersInModal={() => {
                  setTempSelectedWebsites([]);
                  setTempSelectedPositions([]);
                  setTempSelectedCompanies([]);
                }}
                handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
                handlePositionCheckboxChange={handlePositionCheckboxChange}
                handleCompanyCheckboxChange={handleCompanyCheckboxChange}
                isGlobalFilterActive={isGlobalFilterActive}
                clearAllFilters={clearAllFilters}
                getApplicationsSectionTitle={getApplicationsSectionTitle}
                filteredApplicationsForDisplay={filteredApplicationsForDisplay}
                downloadApplicationsData={downloadApplicationsData}
                applicationsData={applicationsData}
                allApplicationsFlattened={allApplicationsFlattened}
                activeSubTab={activeSubTab} // Pass sub-tab state for Documents
                setActiveSubTab={setActiveSubTab} // Pass sub-tab state for Documents
                setIsInWorksheetView={setIsInWorksheetView} // Pass down
                clientData={updatedClientData}
                onImageView={handleImageView}
              />
            )}
            <Modal show={showImageViewer} onHide={() => setShowImageViewer(false)} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ textAlign: 'center', padding: '10px' }}>
                <img src={imageUrlToView} alt="Document Preview" style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px' }} />
              </Modal.Body>
            </Modal>
          </>
        ) : (
          // Render the WorksheetView when isInWorksheetView is true
          <WorksheetView
            setActiveTab={setActiveTab} // To go back to main Dashboard
            activeWorksheetTab={activeWorksheetTab}
            setActiveWorksheetTab={setActiveWorksheetTab}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dateRange={dateRange}
            currentStartDate={currentStartDate}
            setCurrentStartDate={setCurrentStartDate}
            showPreviousWeek={showPreviousWeek}
            showNextWeek={showNextWeek}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            showDateRangeModal={showDateRangeModal}
            setShowDateRangeModal={setShowDateRangeModal}
            tempStartDate={tempStartDate}
            setTempStartDate={setTempStartDate}
            tempEndDate={tempEndDate}
            setTempEndDate={tempEndDate}
            handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
            handleApplyDateRange={handleApplyDateRange}
            handleClearDateRangeInModal={handleClearDateRangeInModal}
            showJobDescriptionModal={showJobDescriptionModal}
            setShowJobDescriptionModal={setShowJobDescriptionModal}
            currentJobDescription={currentJobDescription}
            setCurrentJobDescription={setCurrentJobDescription}
            handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
            handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
            filterWebsites={filterWebsites}
            setFilterWebsites={setFilterWebsites}
            filterPositions={filterPositions}
            setFilterPositions={setFilterPositions}
            filterCompanies={filterCompanies}
            setFilterCompanies={setFilterCompanies}
            uniqueWebsites={uniqueWebsites}
            uniquePositions={uniquePositions}
            uniqueCompanies={uniqueCompanies}
            showFilterModal={showFilterModal}
            setShowFilterModal={setShowFilterModal}
            tempSelectedWebsites={tempSelectedWebsites}
            setTempSelectedWebsites={setTempSelectedWebsites}
            tempSelectedPositions={tempSelectedPositions}
            setTempSelectedPositions={setTempSelectedPositions}
            tempSelectedCompanies={tempSelectedCompanies}
            setTempSelectedCompanies={setTempSelectedCompanies}
            handleOpenFilterModal={() => setShowFilterModal(true)}
            handleCloseFilterModal={() => setShowFilterModal(false)}
            handleApplyCategoricalFilters={() => {
              setFilterWebsites(tempSelectedWebsites);
              setFilterPositions(tempSelectedPositions);
              setFilterCompanies(tempSelectedCompanies);
              setShowFilterModal(false);
            }}
            handleClearTempFiltersInModal={() => {
              setTempSelectedWebsites([]);
              setTempSelectedPositions([]);
              setTempSelectedCompanies([]);
            }}
            handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
            handlePositionCheckboxChange={handlePositionCheckboxChange}
            handleCompanyCheckboxChange={handleCompanyCheckboxChange}
            isGlobalFilterActive={isGlobalFilterActive}
            clearAllFilters={clearAllFilters}
            getApplicationsSectionTitle={getApplicationsSectionTitle}
            filteredApplicationsForDisplay={filteredApplicationsForDisplay}
            downloadApplicationsData={downloadApplicationsData}
            applicationsData={applicationsData}
            allApplicationsFlattened={allApplicationsFlattened}
            activeSubTab={activeSubTab} // Pass sub-tab state for Documents
            setActiveSubTab={setActiveSubTab} // Pass sub-tab state for Documents
            setIsInWorksheetView={setIsInWorksheetView} // Pass down
            clientData={updatedClientData}
            onImageView={handleImageView}
          />
          )
        )}

      </div>
    </div>
  );
};

// --- STYLES (Combined from both files) ---
const chartSectionStyle = {
  width: '100%',
  maxWidth: '1000px',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0'
};

const selectedPlanDetailsStyle = {
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center',
  color: '#f1f5f9',
};

const paymentPlanTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  marginBottom: '10px',
  color: '#f1f5f9', // Adjusted for dark background
};

const paymentPlanPriceStyle = {
  fontSize: '2.5rem',
  fontWeight: '800',
  color: '#fff', // Adjusted for dark background
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center', // Center price as well
};

const paymentPlanPeriodStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#cbd5e1', // Adjusted for dark background
  marginLeft: '8px',
};

const paymentPlanFeaturesListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '0 auto 30px auto', // Centered and increased margin
  textAlign: 'left',
  width: '100%',
  maxWidth: '300px', // Adjusted max-width for features list
  color: '#cbd5e1', // Adjusted for dark background
};

const paymentPlanSelectButtonStyle = {
  background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: 'auto',
  width: '100%',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s, transform 0.2s',
};

const paymentOptionButtonStyle = {
  background: '#475569',
  color: 'white',
  border: 'none',
  padding: '15px 20px',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s, transform 0.2s',
};

const modalClearButtonStyle = {
  backgroundColor: '#f0ad4e',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

export default ClientDashboard;