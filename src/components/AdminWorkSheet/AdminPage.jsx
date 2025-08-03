import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientManagement from './ClientManagement';
import DepartmentManagement from './DepartmentManagement';
import EmployeeManagement from './EmployeeManagement';
import AssetManagement from './AssetManagement';
import RequestManagement from './RequestManagement';

const AdminPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('clientManagement');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Centralized state for the logged-in user's profile
  const [userProfile, setUserProfile] = useState({
    name: 'Admin',
    employeeId: 'ADMIN001',
    email: 'admin@techxplorers.com',
    mobile: '+91 99999 88888',
    lastLogin: new Date().toLocaleString(),
  });
  
  // States for the profile modal
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [isEditingUserProfile, setIsEditingUserProfile] = useState(false);

  // useEffect to get logged-in user data from sessionStorage
  useEffect(() => {
    const loggedInUserData = sessionStorage.getItem('loggedInEmployee');
    if (loggedInUserData) {
        const userData = JSON.parse(loggedInUserData);
        setUserProfile(prevDetails => ({
            ...prevDetails,
            name: userData.name,
            email: userData.email,
        }));
    }
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = (name || '').split(' ').filter(part => part.length > 0);
    if (nameParts.length >= 2) return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    return nameParts[0]?.charAt(0).toUpperCase() || '';
  };

  // --- Profile Modal Handlers ---
  const openUserProfileModal = () => {
    setEditableProfile({ ...userProfile }); // Initialize with current data
    setIsEditingUserProfile(false); // Start in view-only mode
    setIsUserProfileModalOpen(true);
    setIsProfileDropdownOpen(false); // Close dropdown when modal opens
  };

  const closeUserProfileModal = () => {
    setIsUserProfileModalOpen(false);
    setIsEditingUserProfile(false); // Reset edit mode
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setUserProfile(editableProfile); // Update the main profile state
    setIsEditingUserProfile(false); // Switch back to view-only mode
    alert('Profile updated successfully!');
  };

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
        document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const adminViewOptions = [
    { value: 'clientManagement', label: 'Client Management' },
    { value: 'departments', label: 'Departments' },
    { value: 'employeeManagement', label: 'Employee Management' },
    { value: 'assetManagement', label: 'Asset Management' },
    { value: 'requestManagement', label: 'Request Management' },
  ];

  return (
    <div className="ad-body-container1">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
            --bg-body: #f3f4f6; --bg-card: #ffffff; --text-primary: #1f2937;
            --text-secondary: #6b7280; --border-color: #e5e7eb;
            --shadow-color-1: rgba(0, 0, 0, 0.05); --bg-header: #ffffff;
            --logo-x-color: #2563eb; --admin-tag-bg: #fee2e2;
            --admin-tag-text: #991b1b; --admin-avatar-bg: #1f2937;
            --admin-avatar-text: #ffffff; --radio-group-bg: #ffffff;
            --radio-group-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            --radio-item-color: #4b5563; --radio-item-bg-checked: #eff6ff;
            --radio-item-text-checked: #1f2937; --radio-item-hover-bg: #f9fafb;
            --bg-nav-link-hover: #f9fafb;
        }
        .ad-body-container1 { font-family: 'Inter', sans-serif; background-color: var(--bg-body); min-height: 100vh; color: var(--text-primary); }
        .ad-header { background-color: var(--bg-header); box-shadow: 0 1px 2px 0 var(--shadow-color-1); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .ad-logo { display: flex; align-items: center; color: var(--text-primary); font-size: 1.5rem; font-weight: 700; }
        .ad-logo-x { color: var(--logo-x-color); }
        .ad-header-right { display: flex; align-items: center; gap: 1rem; }
        .ad-employee-info { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .ad-employee-info-text { display: none; }
        @media (min-width: 768px) { .ad-employee-info-text { display: flex; flex-direction: column; align-items: flex-end; } }
        .ad-employee-name { font-size: 0.875rem; font-weight: 600; }
        .ad-admin-tag { background-color: var(--admin-tag-bg); color: var(--admin-tag-text); padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .ad-initials-avatar { width: 2.5rem; height: 2.5rem; border-radius: 9999px; background-color: var(--admin-avatar-bg); color: var(--admin-avatar-text); display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .ad-main-content { padding: 1.5rem; }
        .custom-radio-group-container { display: flex; flex-wrap: wrap; border-radius: 9999px; background-color: var(--radio-group-bg); box-shadow: var(--radio-group-shadow); padding: 0.5rem; margin-bottom: 1.5rem; }
        .custom-radio-item { flex: 1 1 auto; text-align: center; }
        .custom-radio-item input[type="radio"] { display: none; }
        .custom-radio-label { display: flex; cursor: pointer; align-items: center; justify-content: center; border-radius: 9999px; padding: 0.75rem 1.5rem; transition: all 0.2s ease-in-out; font-weight: 500; color: var(--radio-item-color); }
        .custom-radio-item input[type="radio"]:checked + .custom-radio-label { background-color: var(--radio-item-bg-checked); color: var(--radio-item-text-checked); font-weight: 600; }
        
        .profile-dropdown-container { position: relative; }
        .profile-dropdown-menu { position: absolute; top: calc(100% + 0.5rem); right: 0; background-color: var(--bg-header); border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid var(--border-color); min-width: 12rem; padding: 0.5rem 0; list-style: none; margin: 0; z-index: 60; }
        .profile-dropdown-item { padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 0.75rem; transition: background-color 0.15s ease; }
        .profile-dropdown-item:hover { background-color: var(--bg-nav-link-hover); }
        .profile-dropdown-item.logout { color: #ef4444; }
        .profile-dropdown-item.logout:hover { background-color: #fee2e2; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background-color: var(--bg-card); border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 90%; max-width: 500px; padding: 1.5rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .modal-title { font-size: 1.25rem; font-weight: 600; }
        .modal-close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .profile-details-grid { display: flex; flex-direction: column; gap: 1rem; }
        .profile-detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .profile-detail-label { font-size: 0.875rem; color: var(--text-secondary); }
        .profile-detail-item input { width: 100%; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid var(--border-color); }
        .profile-detail-item input:read-only { background-color: #f9fafb; cursor: not-allowed; }
        .profile-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
        .edit-button, .close-button { padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid transparent; font-weight: 500; cursor: pointer; }
        .edit-button { background-color: #3b82f6; color: white; }
        .close-button { background-color: #e5e7eb; color: #374151; }
      `}
      </style>
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo">
            <span>Tech</span><span className="ad-logo-x">X</span><span>plorers</span>
          </div>
        </div>
        <div className="ad-header-right">
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-employee-info" onClick={() => setIsProfileDropdownOpen(prev => !prev)}>
              <div className="ad-employee-info-text">
                <p className="ad-employee-name">{userProfile.name}</p>
                <span className="ad-admin-tag">Admin</span>
              </div>
              <div className="ad-initials-avatar">{getInitials(userProfile.name)}</div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu">
                <li className="profile-dropdown-item" onClick={openUserProfileModal}>
                  Profile
                </li>
                <li className="profile-dropdown-item logout" onClick={() => navigate('/')}>
                  Log out
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>
      <main className="ad-main-content">
        <div className="custom-radio-group-container">
          {adminViewOptions.map((option) => (
            <label className="custom-radio-item" key={option.value}>
              <input type="radio" name="adminView" value={option.value} checked={currentView === option.value} onChange={() => setCurrentView(option.value)} />
              <span className="custom-radio-label">{option.label}</span>
            </label>
          ))}
        </div>
        <div className="ad-content-wrapper">
            {currentView === 'clientManagement' && <ClientManagement />}
            {currentView === 'departments' && <DepartmentManagement />}
            {currentView === 'employeeManagement' && <EmployeeManagement />}
            {currentView === 'assetManagement' && <AssetManagement />}
            {currentView === 'requestManagement' && <RequestManagement />}
        </div>
      </main>

      {/* User Profile Modal */}
      {isUserProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Admin Profile</h3>
              <button className="modal-close-button" onClick={closeUserProfileModal}>&times;</button>
            </div>
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <label className="profile-detail-label" htmlFor="profileName">Name:</label>
                <input type="text" id="profileName" name="name" value={editableProfile.name || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
              </div>
              <div className="profile-detail-item">
                <label className="profile-detail-label">Admin ID:</label>
                <input type="text" value={userProfile.employeeId} readOnly />
              </div>
              <div className="profile-detail-item">
                <label className="profile-detail-label" htmlFor="profileEmail">Email:</label>
                <input type="email" id="profileEmail" name="email" value={editableProfile.email || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
              </div>
              <div className="profile-detail-item">
                <label className="profile-detail-label" htmlFor="profileMobile">Mobile No.:</label>
                <input type="tel" id="profileMobile" name="mobile" value={editableProfile.mobile || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
              </div>
              <div className="profile-detail-item">
                <label className="profile-detail-label">Last Login:</label>
                <input type="text" value={userProfile.lastLogin} readOnly />
              </div>
            </div>
            <div className="profile-actions">
              {isEditingUserProfile ? (
                <button className="edit-button" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditingUserProfile(true)}>
                  Edit Profile
                </button>
              )}
              <button className="close-button" onClick={closeUserProfileModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;