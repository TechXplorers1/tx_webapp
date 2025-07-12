import React, { useState, useEffect, useRef } from 'react';
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
import styled from 'styled-components'; // Import styled-components

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

// Styled-components for the Radio component
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


// ClientHeader Component (formerly AdminHeader)
const ClientHeader = ({
  clientUserName,
  clientInitials,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  onClientProfileClick,
  onSubscriptionClick
}) => {

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

        .ad-hamburger-menu {
          display: block;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background-color: var(--border-color);
          transition: background-color 150ms;
          cursor: pointer;
        }

        .ad-hamburger-menu:hover {
          background-color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .ad-hamburger-menu {
            display: none;
          }
        }
        `}
      </style>
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo">
            <span>Tech</span>
            <span className="ad-logo-x">X</span>
            <span>plorers</span>
          </div>
        </div>

        <div className="ad-header-right">
          {/* Search Icon */}
          <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
          <div className="ad-notification-icon">
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
            </svg>
            <span className="ad-notification-badge">3</span>
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="ad-user-info-text">
                <p className="ad-user-name">{clientUserName}</p>
                <span className="ad-client-tag">
                  {/* User Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
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
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                  </svg>
                  Client Profile
                </li>
                <li className="profile-dropdown-item" onClick={onSubscriptionClick}>
                  {/* Credit Card Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M22 9H2C1.44772 9 1 9.44772 1 10V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V10C23 9.44772 22.5523 9 22 9ZM3 11V18H21V11H3ZM22 4H2C1.44772 4 1 4.44772 1 5V7C1 7.55228 1.44772 8 2 8H22C22.5523 8 23 7.55228 23 7V5C23 4.44772 22.5523 4 22 4Z" />
                  </svg>
                  Subscription
                </li>
                <li className="profile-dropdown-item logout" onClick={() => window.location.href = '/'}>
                  {/* Log Out Icon (Door with arrow from screenshot) */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M10 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H10C10.5523 20 11 19.5523 11 19V17H13V19C13 20.6569 11.6569 22 10 22H4C2.34315 22 1 20.6569 1 19V5C1 3.34315 2.34315 2 4 2H10C11.6569 2 13 3.34315 13 5V7H11V5C11 4.44772 10.5523 4 10 4ZM19.2929 10.2929L22.2929 13.2929C22.6834 13.6834 22.6834 14.3166 22.2929 14.7071L19.2929 17.7071C18.9024 18.0976 18.2692 18.0976 17.8787 17.7071C17.4882 17.3166 17.4882 16.6834 17.8787 16.2929L19.5858 14.5858H11C10.4477 14.5858 10 14.1381 10 13.5858C10 13.0335 10.4477 12.5858 11 12.5858H19.5858L17.8787 10.8787C17.4882 10.4882 17.4882 9.85497 17.8787 9.46447C18.2692 9.07395 18.9024 9.07395 19.2929 9.46447Z" />
                  </svg>
                  Log out
                </li>
              </ul>
            )}
          </div>
        </div>

        <button
          className="ad-hamburger-menu"
          onClick={toggleSidebar}
        >
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
          </svg>
        </button>
      </header>
    </>
  );
};


// Dimming Overlay Component
const DimmingOverlay = ({ isVisible, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: isVisible ? 90 : -1, // Z-index needs to be below modals (100) but above content and header dropdown (60)
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    />
  );
};


// ClientProfile Component (now only shows profile details)
const ClientProfile = ({
  profilePlaceholder,
  clientUserName,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '90%', width: '1200px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={onClose} className="modal-close-button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h3 style={{
          marginBottom: '10px',
          textAlign: 'center',
          color: '#1e293b',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          Your Details
        </h3>

        <div className="profile-grid-container">
          {/* Personal Information */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Personal Information</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">First Name:</span>
              <span className="profile-detail-value">Mukesh</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Middle Name:</span>
              <span className="profile-detail-value"> -</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Last Name:</span>
              <span className="profile-detail-value">Ambani</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Date of Birth:</span>
              <span className="profile-detail-value">1990-05-15</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Gender:</span>
              <span className="profile-detail-value">Male</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Ethnicity:</span>
              <span className="profile-detail-value">Caucasian</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Contact Information</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Address:</span>
              <span className="profile-detail-value">123 Main St, San Francisco, CA</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Zip Code:</span>
              <span className="profile-detail-value">94105</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Mobile:</span>
              <span className="profile-detail-value">123-456-7890</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Email:</span>
              <span className="profile-detail-value">mukesh.ambani@example.com</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Secondary Email:</span>
              <span className="profile-detail-value">m.ambani.personal@example.com</span>
            </div>
          </div>

          {/* Job Preferences & Status */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Job Preferences & Status</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Security Clearance:</span>
              <span className="profile-detail-value">Yes</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Clearance Level:</span>
              <span className="profile-detail-value">Top Secret</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Willing to Relocate:</span>
              <span className="profile-detail-value">Yes</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Work Preference:</span>
              <span className="profile-detail-value">Hybrid</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Restricted Companies:</span>
              <span className="profile-detail-value">None</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Jobs to Apply:</span>
              <span className="profile-detail-value">Frontend, Fullstack</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Technology Skills:</span>
              <span className="profile-detail-value">React, JavaScript, HTML, CSS, Node.js</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Current Salary:</span>
              <span className="profile-detail-value">$110,000</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Expected Salary:</span>
              <span className="profile-detail-value">$130,000</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Visa Status:</span>
              <span className="profile-detail-value">H1B</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Other Visa Status:</span>
              <span className="profile-detail-value">-</span>
            </div>
          </div>

          {/* Education Details */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Education Details</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">School Name:</span>
              <span className="profile-detail-value">University of California, Berkeley</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">School Address:</span>
              <span className="profile-detail-value">Berkeley, CA</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">School Phone:</span>
              <span className="profile-detail-value">555-123-4567</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Course of Study:</span>
              <span className="profile-detail-value">Computer Science</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Graduation Date:</span>
              <span className="profile-detail-value">2012-05-20</span>
            </div>
          </div>

          {/* Employment Details */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Employment Details</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Current Company:</span>
              <span className="profile-detail-value">Web-tech Solutions</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Current Designation:</span>
              <span className="profile-detail-value">Senior Frontend Developer</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Preferred Interview Time:</span>
              <span className="profile-detail-value">Morning</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Earliest Joining Date:</span>
              <span className="profile-detail-value">2025-08-01</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Relieving Date:</span>
              <span className="profile-detail-value">2023-07-31</span>
            </div>
          </div>

          {/* References */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">References</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Reference Name:</span>
              <span className="profile-detail-value">Jane Smith</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Reference Phone:</span>
              <span className="profile-detail-value">555-987-6543</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Reference Address:</span>
              <span className="profile-detail-value">456 Oak Ave</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Reference Email:</span>
              <span className="profile-detail-value">jane.smith@example.com</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Reference Role:</span>
              <span className="profile-detail-value">Manager</span>
            </div>
          </div>

          {/* Job Portal Accounts */}
          <div className="profile-info-card">
            <h4 className="profile-info-title">Job Portal Accounts</h4>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Account Name:</span>
              <span className="profile-detail-value">john.anderson.linkedin</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Credentials:</span>
              <span className="profile-detail-value">********</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New SubscriptionDetailsModal Component
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
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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


const ClientDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInterviewsModal, setShowInterviewsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClientProfileModal, setShowClientProfileModal] = useState(false);
  const [showSubscriptionDetailsModal, setShowSubscriptionDetailsModal] = useState(false);
  const [selectedRadioPlan, setSelectedRadioPlan] = useState('glass-silver'); // Default to Silver

  // State for ClientHeader
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Mock Client User Data (formerly Admin User Data)
  const clientUserName = "Mukesh Ambani";
  const clientInitials = "MA";
  const currentPlanPrice = "$199"; // Example data for subscription
  const daysLeftInPlan = "28"; // Example data for subscription

  // Toggle Dark/Light Mode function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleInterviewsModal = () => setShowInterviewsModal(!showInterviewsModal);
  const toggleResumeModal = () => setShowResumeModal(!showResumeModal);
  const togglePaymentModal = () => setShowPaymentModal(!showPaymentModal);
  const toggleClientProfileModal = () => setShowClientProfileModal(!showClientProfileModal);
  const toggleSubscriptionDetailsModal = () => setShowSubscriptionDetailsModal(!showSubscriptionDetailsModal);

  // Handlers for profile dropdown items
  const handleClientProfileClick = () => {
    setIsProfileDropdownOpen(false); // Close dropdown
    setShowClientProfileModal(true); // Open client profile modal
  };

  const handleSubscriptionClick = () => {
    setIsProfileDropdownOpen(false); // Close dropdown
    setShowSubscriptionDetailsModal(true); // Open new subscription details modal
  };

  const profilePlaceholder = "https://imageio.forbes.com/specials-images/imageserve/5c7d7829a7ea434b351ba0b6/0x0.jpg?format=jpg&crop=1837,1839,x206,y250,safe&height=416&width=416&fit=bounds";

  // --- Dynamic Chart Date Generation ---
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

  // Mock data for Scheduled Interviews
  const scheduledInterviews = [
    { id: 1, date: '2025-06-15', time: '10:00 AM', company: 'Innovate Solutions', role: 'Software Developer', recruiterMailId: 'alice.j@innovate.com', round: 'Round 1' },
    { id: 2, date: '2025-06-18', time: '02:30 PM', company: 'Global Tech Corp', role: 'UX Designer', recruiterMailId: 'bob.w@globaltech.com', round: 'Round 2' },
    { id: 3, date: '2025-06-20', time: '11:00 AM', company: 'Data Insights Ltd.', role: 'Data Analyst', recruiterMailId: 'charlie.b@datainsights.com', round: 'Final Round' },
    { id: 4, date: '2025-06-22', time: '09:00 AM', company: 'FutureTech Inc.', role: 'Project Manager', recruiterMailId: 'david.l@futuretech.net', round: 'Round 1' },
    { id: 5, date: '2025-06-25', time: '01:00 PM', company: 'Digital Innovators', role: 'DevOps Engineer', recruiterMailId: 'eve.d@digitalinnov.io', round: 'Round 3' },
    { id: 6, date: '2025-06-28', time: '03:45 PM', company: 'Quant Computing', role: 'Machine Learning Scientist', recruiterMailId: 'frank.w@quantcomp.ai', round: 'Round 2' },
    { id: 7, date: '2025-07-01', time: '10:30 AM', company: 'CyberSec Solutions', role: 'Cybersecurity Analyst', recruiterMailId: 'grace.k@cybersec.com', round: 'Round 1' },
    { id: 8, date: '2025-07-03', time: '04:00 PM', company: 'HealthTech Connect', role: 'Mobile App Developer', recruiterMailId: 'henry.g@healthtech.org', round: 'Final Round' },
  ];

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

  // Handler for selecting a payment plan
  const handleProceedToPayment = () => {
    const currentPlan = planOptions[selectedRadioPlan];
    if (currentPlan) {
      console.log(`Proceeding with: ${currentPlan.name} plan for ${currentPlan.price}`);
      // In a real application, you'd trigger a payment gateway here
      // For now, we'll just close the modal and show an alert.
      alert(`Proceeding with the ${currentPlan.name} plan for ${currentPlan.price}. Payment integration would go here!`);
      togglePaymentModal();
    }
  };

  // Function to handle radio button change
  const handleRadioPlanChange = (planId) => {
    setSelectedRadioPlan(planId);
  };

  // Function to get glider style based on selected plan
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
    alert('Downloading the latest resume... (This is a placeholder action)');
  };

  // Determine if the overlay should be visible (for all modals and sidebar)
  const isOverlayVisible = menuOpen || showInterviewsModal || showResumeModal || showPaymentModal || showClientProfileModal || showSubscriptionDetailsModal;


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
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
        }
        .back-button:hover {
            background-color: #f8fafc;
        }

        .menu-toggle-button {
            font-size: 24px;
            cursor: pointer;
            color: #64748b;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s;
            background: none; /* Ensure no default button background */
            border: none; /* Ensure no default button border */
        }
        .menu-toggle-button:hover {
            background-color: #f1f5f9;
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
            padding-top: 80px; /* Added padding to account for fixed header */
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
        `}
      </style>

      {/* Client Header */}
      <ClientHeader
        clientUserName={clientUserName}
        clientInitials={clientInitials}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleMenu}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        profileDropdownRef={profileDropdownRef}
        onClientProfileClick={handleClientProfileClick}
        onSubscriptionClick={handleSubscriptionClick}
      />

      {/* Dimming Overlay */}
      <DimmingOverlay
        isVisible={isOverlayVisible}
        onClick={() => {
          if (menuOpen) setMenuOpen(false);
          if (showInterviewsModal) setShowInterviewsModal(false);
          if (showResumeModal) setShowResumeModal(false);
          if (showPaymentModal) setShowPaymentModal(false);
          if (showClientProfileModal) setShowClientProfileModal(false);
          if (showSubscriptionDetailsModal) setShowSubscriptionDetailsModal(false);
        }}
      />

      {/* Interviews Modal (remains light theme, but will respond to dark mode toggle) */}
      {showInterviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleInterviewsModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
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
                    <th className="modal-table-header">Company</th>
                    <th className="modal-table-header">Role</th>
                    <th className="modal-table-header">Recruiter Mail ID</th>
                    <th className="modal-table-header">Round</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledInterviews.map((interview) => (
                    <tr key={interview.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{interview.date}</div>
                      </td>
                      <td className="modal-table-cell">{interview.time}</td>
                      <td style={{fontWeight: '600'}} className="modal-table-cell">{interview.company}</td>
                      <td className="modal-table-cell">{interview.role}</td>
                      <td className="modal-table-cell">{interview.recruiterMailId}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal (remains light theme, but will respond to dark mode toggle) */}
      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleResumeModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
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
                      <td style={{fontWeight: '600'}} className="modal-table-cell">{update.type}</td>
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
                          {update.status === 'Updated' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {update.status === 'Reviewed' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {update.status === 'Completed' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M9 3L4.5 7.5L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
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

      {/* Payment Plan Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          {/* Removed ...modalContentStyle and applied specific styles directly */}
          <div className="modal-content-style" style={{ maxWidth: '600px', padding: '40px', background: '#334155', color: '#f1f5f9' }}>
            <button onClick={togglePaymentModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
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
                  <span style={paymentPlanPeriodStyle}>{currentSelectedPlanDetails.name === 'Silver' ? '/month' : currentSelectedPlanDetails.name === 'Gold' ? '/3 months' : '/year'}</span>
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
                  onClick={handleProceedToPayment}
                  style={paymentPlanSelectButtonStyle}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Client Profile Modal (now responds to dark mode toggle) */}
      {showClientProfileModal && (
        <ClientProfile
          profilePlaceholder={profilePlaceholder}
          clientUserName={clientUserName}
          onClose={toggleClientProfileModal}
        />
      )}

      {/* Subscription Details Modal (now responds to dark mode toggle) */}
      {showSubscriptionDetailsModal && (
        <SubscriptionDetailsModal
          togglePaymentModal={togglePaymentModal}
          currentPlanPrice={currentPlanPrice}
          daysLeftInPlan={daysLeftInPlan}
          onClose={toggleSubscriptionDetailsModal}
        />
      )}

      {/* Sidebar Menu */}
      <div className="sidebar-menu" style={{
        position: 'fixed',
        top: 0,
        right: menuOpen ? 0 : '-280px',
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
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6C6 6 6.5 5 8 5C9.5 5 10 6 10 6C10 6 9.5 7 8 7C6.5 7 6 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8H6.01M10 8H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Help & Support
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/');
            toggleMenu();
          }}
          className="logout-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        <h2 className="dashboard-title">
          Client Module
        </h2>

        <div className="chart-and-ads-container">
          <div className="ad-column">
            <div className="ad-placeholder">
              <p style={{ color: '#475569', marginBottom: '10px' }}>Sponsored</p>
              <img src="https://placehold.co/120x300/e0f2f7/475569?text=Ad+1" alt="Advertisement 1" onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/120x300/e0f2f7/475569?text=Ad+Load+Error'}}/>
              <p style={{ marginTop: '10px', color: '#64748b' }}>Discover new opportunities!</p>
            </div>
          </div>

          <div style={chartSectionStyle}>
            <h4 style={{
              marginBottom: '20px',
              textAlign: 'center',
              color: '#475569',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Job Source Performance
            </h4>
            <Line data={data} options={options} />
          </div>

          <div className="ad-column">
            <div className="ad-placeholder">
              <p style={{ color: '#475569', marginBottom: '10px' }}>Promoted</p>
              <img src="https://placehold.co/120x300/f0f9ff/475569?text=Ad+2" alt="Advertisement 2" onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/120x300/f0f9ff/475569?text=Ad+Load+Error'}}/>
              <p style={{ marginTop: '10px', color: '#64748b' }}>Boost your career today!</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/clientworksheet')}
            className="worksheet-button"
          >
            Go to Work Sheet
          </button>
        </div>

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
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <path d="M9 12H15M9 16H15M10 3H14C15.1046 3 16 3.89543 16 5V20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20V5C8 3.89543 8.89543 3 10 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      </div>
    </div>
  );
};

// --- STYLES (kept as constants for clarity, but they are NOT inline styles with pseudo-classes) ---
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

export default ClientDashboard;
