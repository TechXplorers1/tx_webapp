import React, { useState, useEffect, useRef } from 'react';

import ClientManagement from './ClientManagement';
import DepartmentManagement from './DepartmentManagement';
import EmployeeManagement from './EmployeeManagement';
import AssetManagement from './AssetManagement';
import RequestManagement from './RequestManagement';


const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('clientManagement');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const adminemployeeName = "Admin employee";
  const adminemployeeEmail = "administrator@company.com";

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = (name || '').split(' ').filter(part => part.length > 0);
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length >= 2) return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    return '';
  };

  const adminInitials = getInitials(adminemployeeName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const adminViewOptions = [
    { value: 'clientManagement', label: 'Client Management' },
    { value: 'departments', label: 'Departments' },
    { value: 'employeeManagement', label: 'Employee Management' },
    { value: 'assetManagement', label: 'Asset Management' },
    { value: 'requestManagement', label: 'Request Management' },
  ];

  return (
    <div className="ad-body-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
            --bg-body: #f3f4f6;
            --bg-card: #ffffff;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
            --shadow-color-1: rgba(0, 0, 0, 0.05);
            --bg-header: #ffffff;
            --logo-x-color: #2563eb;
            --admin-tag-bg: #fee2e2;
            --admin-tag-text: #991b1b;
            --admin-avatar-bg: #1f2937;
            --admin-avatar-text: #ffffff;
            --radio-group-bg: #ffffff;
            --radio-group-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            --radio-item-color: #4b5563;
            --radio-item-bg-checked: #eff6ff;
            --radio-item-text-checked: #1f2937;
            --radio-item-hover-bg: #f9fafb;
        }
        .ad-body-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            min-height: 100vh;
            color: var(--text-primary);
        }
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
        .ad-employee-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .ad-employee-info-text {
            display: none;
        }
        @media (min-width: 768px) {
            .ad-employee-info-text {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
        }
        .ad-employee-name {
            font-size: 0.875rem;
            font-weight: 600;
        }
        .ad-admin-tag {
            background-color: var(--admin-tag-bg);
            color: var(--admin-tag-text);
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .ad-initials-avatar {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 9999px;
            background-color: var(--admin-avatar-bg);
            color: var(--admin-avatar-text);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        .ad-main-content {
            padding: 1.5rem;
        }
        .ad-dashboard-header {
            margin-bottom: 1.5rem;
        }
        .ad-title {
            font-size: 1.875rem;
            font-weight: 700;
        }
        .ad-subtitle {
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }
        .custom-radio-group-container {
           position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 9999px; /* Fully rounded pill shape */
  background-color: var(--radio-group-bg);
  box-sizing: border-box;
  box-shadow: var(--radio-group-shadow); /* Soft shadow */
  padding: 0.5rem; /* Padding inside the container */
  font-size: 1rem; /* Base font size */
  font-family: 'Inter', sans-serif;
  color: var(--radio-item-color); /* Default text color for inactive items */
  min-width: 250px; /* Ensure it doesn't get too small */
  margin-bottom: 1.5rem; /* Space below the tabs, consistent with old style */
  margin-left: 1.5rem; /* Align with padding of dashboard header */
  margin-right: 1.5rem; /* Align with padding of dashboard header */
}
       .custom-radio-group-container .custom-radio-item {
  flex: 1 1 auto; /* Distribute items evenly */
  text-align: center;
  position: relative; /* For z-index if needed */
}
        .custom-radio-item input[type="radio"] {
            display: none;
        }
        .custom-radio-label {
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            padding: 0.75rem 1.5rem;
            transition: all 0.2s ease-in-out;
            white-space: nowrap; /* Prevent text wrapping */
            font-weight: 500;
            color: var(--radio-item-color);
        }
        .custom-radio-item input[type="radio"]:checked + .custom-radio-label {
            background-color: var(--radio-item-bg-checked);
            color: var(--radio-item-text-checked);
            font-weight: 600;
        }
        .custom-radio-item .custom-radio-label:hover:not(.custom-radio-group-container .custom-radio-item input[type="radio"]:checked + .custom-radio-label) {
            background-color: var(--radio-item-hover-bg);
        }
      `}
      </style>
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo">
            <span>Tech</span><span className="ad-logo-x">X</span><span>plorers</span>
          </div>
        </div>
        <div className="ad-header-right">
          <div className="ad-notification-icon">
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <span className="ad-notification-badge">3</span>
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-employee-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="ad-employee-info-text">
                <p className="ad-employee-name">{adminemployeeName}</p>
                <span className="ad-admin-tag">Admin</span>
              </div>
              <div className="ad-initials-avatar">{adminInitials}</div>
            </div>
          </div>
        </div>
      </header>
      <main className="ad-main-content">
        <div className="ad-dashboard-header">
          <div>
            <h1 className="ad-title">Admin Worksheet</h1>
            <p className="ad-subtitle">System administration and Employee management</p>
          </div>
        </div>
        <div className="custom-radio-group-container">
          {adminViewOptions.map((option) => (
            <label className="custom-radio-item" key={option.value}>
              <input type="radio" name="adminView" value={option.value} checked={currentView === option.value} onChange={() => setCurrentView(option.value)} />
              <span className="custom-radio-label">{option.label}</span>
            </label>
          ))}
        </div>
        
        {/* Conditionally render the selected component */}
        <div className="ad-content-wrapper">
            {currentView === 'clientManagement' && <ClientManagement />}
            {currentView === 'departments' && <DepartmentManagement />}
            {currentView === 'employeeManagement' && <EmployeeManagement />}
            {currentView === 'assetManagement' && <AssetManagement />}
            {currentView === 'requestManagement' && <RequestManagement />}
        </div>
      </main>
    </div>
  );
};


export default AdminPage;
