import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap'; // Using react-bootstrap Modal
import { getDatabase, ref, onValue, query, orderByChild, equalTo, update, remove, set } from "firebase/database";
import { database } from '../../firebase'; // Import your Firebase config
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";


const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];


// AdminHeader Component - Provided by the user
const AdminHeader = ({
  adminUserName,
  adminInitials,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  // New props for profile modal
  showProfileModal,
  setShowProfileModal,
  // New prop for notification click
  onNotificationClick
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
      {/* Inline styles for AdminHeader - extracted from AdminWorksheet.jsx */}
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
          --admin-avatar-bg: #1f2937;
          --admin-avatar-text: #ffffff;
          --logo-x-color: #2563eb;
          --admin-tag-bg: #fee2e2;
          --admin-tag-text: #991b1b;
          --bg-nav-link-hover: #f9fafb; /* For dropdown items */
        }

        html.dark-mode {
          --bg-header: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --shadow-color-1: rgba(0, 0, 0, 0.2);
          --icon-color: #cbd5e0;
          --admin-avatar-bg: #4299e1;
          --admin-avatar-text: #ffffff;
          --logo-x-color: #4299e1;
          --admin-tag-bg: #fbd38d;
          --admin-tag-text: #6b4617;
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
          background-color: var(--admin-avatar-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ad-initials-text {
          color: var(--admin-avatar-text);
          font-size: 0.875rem;
          fontWeight: 600;
        }

        /* Admin Tag in Header */
        .ad-admin-tag {
            background-color: var(--admin-tag-bg);
            color: var(--admin-tag-text);
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
          <div className="ad-notification-icon">
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }} onClick={onNotificationClick}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <span className="ad-notification-badge">3</span>
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="ad-user-info-text">
                <p className="ad-user-name">{adminUserName}</p>
                <span className="ad-admin-tag">
                  {/* User Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Employee
                </span>
              </div>
              <div className="ad-initials-avatar">
                <span className="ad-initials-text">{adminInitials}</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li className="profile-dropdown-item header">My Account</li>
                <li className="profile-dropdown-item" onClick={() => {
                  setIsProfileDropdownOpen(false); // Close dropdown
                  setShowProfileModal(true); // Open profile modal
                }}>
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Profile
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
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>
      </header>
    </>
  );
};







const EmployeeData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for theme and profile dropdown for AdminHeader
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const profileDropdownRef = useRef(null);

  // NEW: State for controlling the visibility of the Employee Profile Modal
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  // NEW: State for controlling edit mode of employee profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // NEW: State for employee details (now mutable)
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "Employee User",
    employeeId: "EMP001",
    mobile: "+1 (555) 123-4567",
    email: "employee.user@techxplorers.com", // Added email
    lastLogin: new Date().toLocaleString(),
  });

  // NEW: useEffect to get logged-in user data from sessionStorage
  // Update useEffect to get the full employee object from sessionStorage
  useEffect(() => {
    const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
    if (!loggedInUserData || !loggedInUserData.firebaseKey) {
      console.error("No logged in user found, redirecting...");
      navigate('/login'); // Redirect if not logged in
      return;
    }
    setEmployeeDetails(loggedInUserData);
    const employeeFullName = loggedInUserData ? `${loggedInUserData.firstName} ${loggedInUserData.lastName}` : null;

    if (!employeeFullName) {
      console.warn("No employee is logged in.");
      return;
    }

    const clientsRef = ref(database, 'clients');

    const unsubscribe = onValue(clientsRef, (snapshot) => {
      const clientsData = snapshot.val();


      const allRegistrations = [];
      if (clientsData) {
        // --- MODIFICATION START ---
        // Step 1: Flatten the nested data structure from Firebase
        Object.keys(clientsData).forEach(clientKey => {
          const client = clientsData[clientKey];
          if (client.serviceRegistrations) {
            Object.keys(client.serviceRegistrations).forEach(regKey => {
              const registration = client.serviceRegistrations[regKey];
              // Create a new, combined object with all necessary info
              allRegistrations.push({
                ...registration,
                clientFirebaseKey: clientKey,
                registrationKey: regKey,
                email: client.email,
                mobile: client.mobile,
                // Create a consistent name and initials for display
                name: `${registration.firstName || client.firstName || ''} ${registration.lastName || client.lastName || ''}`.trim(),
                initials: `${(registration.firstName || 'C').charAt(0)}${(registration.lastName || 'L').charAt(0)}`
              });
            });
          }
        });
      }

      // Filter for clients assigned to THIS employee
      const myRegistrations = allRegistrations.filter(client => client.assignedTo === employeeFullName);

      // --- Separate clients into tabs based on their status ---
      const newAssigned = myRegistrations.filter(c => c.assignmentStatus === 'pending_acceptance'); // 'assigned' is the "New" status for employees
      const active = myRegistrations.filter(c => c.assignmentStatus === 'active');
      const inactive = myRegistrations.filter(c => c.assignmentStatus === 'inactive');

      setNewClients(newAssigned);
      setActiveClients(active);
      setInactiveClients(inactive);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  // NEW: Temporary state for editing profile
  const [editedEmployeeDetails, setEditedEmployeeDetails] = useState({});

  // NEW: State for notifications (toast messages)
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // NEW: State for the notification modal (from screenshot)
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Mock notifications for the modal
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Feature Alert', description: 'Discover our new analytics dashboard!', timeAgo: '2 hours ago' },
    { id: 2, title: 'Payment Due Soon', description: 'Your subscription renews in 3 days.', timeAgo: '1 day ago' },
    { id: 3, title: 'Profile Update', description: 'Your profile information has been updated.', timeAgo: '2 days ago' },
  ]);


  // Function to show a notification (toast)
  const triggerNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000); // Notification disappears after 3 seconds
  };

  // Function to handle notification icon click (now opens the modal)
  const handleNotificationIconClick = () => {
    setShowNotificationModal(true);
  };


  // Function to derive initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Dynamically calculate adminInitials
  const adminInitials = getInitials(employeeDetails.name);


  useEffect(() => {
    document.documentElement.className = theme + '-mode';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Dummy toggleSidebar function as it's required by AdminHeader but not explicitly defined for EmployeeData's context
  // You might want to implement a proper sidebar functionality if needed.
  const toggleSidebar = () => {
    console.log("Toggle sidebar functionality goes here.");
  };

  // NEW: Handle opening profile modal and initializing edit state
  const handleOpenProfileModal = () => {
    setEditedEmployeeDetails({ ...employeeDetails }); // Copy current details for editing
    setIsEditingProfile(false); // Start in view mode
    setShowEmployeeProfileModal(true);
  };

  // NEW: Handle changes in edit profile form
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployeeDetails(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Handle saving edited profile
  const handleSaveProfileChanges = async () => {
    if (!employeeDetails.firebaseKey) {
      alert("Error: Cannot update profile. User key is missing.");
      return;
    }
    try {
      const employeeRef = ref(database, `users/${employeeDetails.firebaseKey}`);
      await update(employeeRef, editedEmployeeDetails); // Use update to save changes

      // Also update the local state and session storage
      setEmployeeDetails(editedEmployeeDetails);
      sessionStorage.setItem('loggedInEmployee', JSON.stringify(editedEmployeeDetails));

      setIsEditingProfile(false);
      triggerNotification("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile in Firebase:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // NEW: Handle canceling edit profile
  const handleCancelEditProfile = () => {
    setIsEditingProfile(false); // Exit edit mode
    setEditedEmployeeDetails({ ...employeeDetails }); // Revert changes
  };


  // Initial active tab is now 'New Clients'
  const [activeTab, setActiveTab] = useState('New Clients');
  // NEW: State for the active sub-tab (for client-specific data)
  const [activeSubTab, setActiveSubTab] = useState('Applications');

  // State for filters (reused across tabs)
  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [quickFilter, setQuickFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All Activities');

  // States for Modals (Applications Tab)
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [newApplicationFormData, setNewApplicationFormData] = useState({
    jobTitle: '', company: '',jobType: '', platform: '', jobUrl: '', location: '', notes: '', jobId: '', role: '' // Added jobId
  });
  const [selectedClientForApplication, setSelectedClientForApplication] = useState(null);

  const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
  const [viewedApplication, setViewedApplication] = useState(null);

  const [showEditApplicationModal, setShowEditApplicationModal] = useState(false);
  // Updated state for edited application to include round and interviewDate
  const [editedApplicationFormData, setEditedApplicationFormData] = useState(null);

  // States for Modals (Files Tab)
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [newFileFormData, setNewFileFormData] = useState({
    clientId: '', fileType: '', fileName: '', notes: ''
  });
  const [selectedClientForFile, setSelectedClientForFile] = useState(null);

  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [viewedFile, setViewedFile] = useState(null);

  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [editedFileFormData, setEditedFileFormData] = useState(null);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrlToView, setImageUrlToView] = useState('');

 const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // NEW: State for new clients awaiting acceptance
  const [newClients, setNewClients] = useState([]);

  // Add this useEffect to load the new clients from localStorage
  useEffect(() => {
    const loadNewClients = () => {
      const clientsFromManager = JSON.parse(localStorage.getItem('employee_new_clients')) || [];
      setNewClients(clientsFromManager);
    };

    loadNewClients();

    // Also, listen for real-time changes
    const handleStorageChange = (event) => {
      if (event.key === 'employee_new_clients') {
        setNewClients(JSON.parse(event.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Mock data for employee's assigned clients (now only accepted clients)
  const [activeClients, setActiveClients] = useState([]);

  // NEW: Add this useEffect to save the activeClients list to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('employee_active_clients', JSON.stringify(activeClients));
    } catch (error) {
      console.error("Failed to save active clients to local storage", error);
    }
  }, [activeClients]);

  // NEW: State for inactive clients
  const [inactiveClients, setInactiveClients] = useState([]);

  // NEW: State for the currently selected client from the dropdown
  const [selectedClient, setSelectedClient] = useState(null);

  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const [isClientSelectModalOpen, setIsClientSelectModalOpen] = useState(false);
  const [clientSearchTermInModal, setClientSearchTermInModal] = useState('');
    const [newResumeFile, setNewResumeFile] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);



  useEffect(() => {
    if (activeTab === 'New Clients') {
      setSelectedClient(newClients[0] || null);
    } else if (activeTab === 'Active Clients') {
      setSelectedClient(activeClients[0] || null);
    } else if (activeTab === 'Inactive Clients') {
      setSelectedClient(inactiveClients[0] || null);
    }
    setNewResumeFile(null);
  }, [activeTab, newClients, activeClients, inactiveClients]);


  // Combined activities for the timeline
  // This will now only include activities for the selected client if one is chosen
  const allActivities = (selectedClient ? [selectedClient] : []).flatMap(client => {
    const clientActivities = [];

    // Job application activities
    (client.jobApplications || []).forEach(app => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Applied for ${app.jobTitle} position at ${app.company}`,
        type: 'job application',
        date: app.appliedDate,
        time: '4:00 PM', // Placeholder for time
        status: app.status === 'Interview' ? 'Active' : 'Completed',
      });
      if (app.status === 'Interview') {
        clientActivities.push({
          clientId: client.id,
          initials: client.initials,
          name: client.name,
          description: `Interview scheduled with ${app.company} for ${app.jobTitle} position (Round: ${app.round || 'N/A'}, Date: ${app.interviewDate || 'N/A'}, Mail: ${app.recruiterMail || 'N/A'})`,
          type: 'interview scheduled',
          date: app.interviewDate || app.appliedDate, // Use interview date if available, otherwise applied date
          time: '9:30 PM', // Placeholder for time
          status: 'Active',
        });
      }
      // Add more application-related activities as needed (e.g., Rejected, Offered)
    });

    // File activities
    (client.files || []).forEach(file => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Uploaded ${file.type} for ${client.name} position`,
        type: 'file upload',
        date: file.uploadDate,
        time: '2:15 PM', // Placeholder for time
        status: 'Active',
      });
    });

    // Resume update activities
    (client.resumeUpdates || []).forEach(update => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Resume update: ${update.details}`,
        type: 'resume update',
        date: update.date,
        time: '1:00 PM', // Placeholder for time
        status: update.status,
      });
    });

    return clientActivities;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first


  // Helper function to get the latest resume update date for a client
  const getLatestResumeUpdateDate = (clientResumeUpdates) => {
    const resumeTypeUpdates = clientResumeUpdates.filter(update => update.type === 'Resume');
    if (resumeTypeUpdates.length === 0) {
      return null;
    }
    const latestDate = new Date(Math.max(...resumeTypeUpdates.map(update => new Date(update.date))));
    return latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

    const handleResumeFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewResumeFile(e.target.files[0]);
    }
  };

   const handleSaveNewResume = async () => {
    if (!newResumeFile || !selectedClient) {
      alert("Please select a file to upload.");
      return;
    }

    const { clientFirebaseKey, registrationKey } = selectedClient;
    if (!clientFirebaseKey || !registrationKey) {
      alert("Error: Client information is missing. Cannot upload file.");
      return;
    }

    try {
      // 1. Create a unique path in Firebase Storage
      const fileRef = storageRef(getStorage(), `resumes/${clientFirebaseKey}/${registrationKey}/${newResumeFile.name}`);
      
      // 2. Upload the new file
      await uploadBytes(fileRef, newResumeFile);
      
      // 3. Get the public download URL
      const downloadURL = await getDownloadURL(fileRef);

      // 4. Update the client's registration in the Realtime Database with the new URL and file name
      const registrationRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`);
      await update(registrationRef, {
        resumeUrl: downloadURL,
        resumeFileName: newResumeFile.name
      });

      // 5. Provide feedback and reset state
      triggerNotification("Resume updated successfully!");
      setNewResumeFile(null); // Clear the selected file

    } catch (error) {
      console.error("Error updating resume:", error);
      alert("Failed to update resume. Please try again.");
    }
  };

  const handleRequestDeleteFile = (client, file) => {
    // Store all necessary info for deletion
    setFileToDelete({
      clientFirebaseKey: client.clientFirebaseKey,
      registrationKey: client.registrationKey,
      file: file, // Pass the whole file object
    });
    setShowDeleteFileModal(true);
  };

  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;


     setIsDeleting(true);
    const { clientFirebaseKey, registrationKey, file } = fileToDelete;

    try {
      // 1. Create a reference from the download URL and delete from Firebase Storage
      const fileStorageRef = storageRef(getStorage(), file.downloadUrl);
      await deleteObject(fileStorageRef);

      // 2. Get the current list of files from the Realtime Database
      const filesRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/files`);
      onValue(ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`), (snapshot) => {
        const registrationData = snapshot.val();
        const currentFiles = registrationData.files || [];
        
        // 3. Filter out the deleted file and update the list in the Realtime Database
        const updatedFiles = currentFiles.filter(f => f.id !== file.id);
        set(filesRef, updatedFiles);

      }, { onlyOnce: true }); // Fetch the data once to perform the update

      triggerNotification("File deleted successfully from storage and database!");

    } catch (error) {
      console.error("Error deleting file:", error);
      // Handle specific Firebase Storage errors if needed
      if (error.code === 'storage/object-not-found') {
        alert("File not found in storage, but removing from database.");
        // You might still want to proceed with database removal here
      } else {
        alert("Failed to delete file. Please check permissions or try again.");
      }
    } finally {
      // 4. Close the modal and reset the state
      setShowDeleteFileModal(false);
      setFileToDelete(null);
      setIsDeleting(false);
    }
  };


  const handleDownloadResume = (clientName) => {
    // Placeholder for actual resume download logic
    alert(`Downloading the latest resume for ${clientName}... (Placeholder action)`);
  };

  // --- Filter Functions (reused across tabs) ---
  const handleDateRangeChange = (e) => {
    setFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickFilterChange = (filterType) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0]; // Today's date

    if (filterType === 'Last 7 Days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'All Time') {
      startDate = ''; // Clear start date
      endDate = ''; // Clear end date
    }
    setFilterDateRange({ startDate, endDate });
    setQuickFilter(filterType);
  };

  const handleClearFilters = () => {
    setFilterDateRange({ startDate: '', endDate: '' });
    setSortOrder('Newest First');
    setQuickFilter('');
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setFileTypeFilter('All File Types');
    setActivityTypeFilter('All Activities');
  };

  // Function to check if any filters are active
  const areFiltersActive = () => {
    return (
      filterDateRange.startDate !== '' ||
      filterDateRange.endDate !== '' ||
      sortOrder !== 'Newest First' ||
      quickFilter !== '' ||
      searchTerm !== '' ||
      statusFilter !== 'All Statuses' ||
      fileTypeFilter !== 'All File Types' ||
      activityTypeFilter !== 'All Activities'
    );
  };

  // --- Applications Tab Functions ---
  const handleOpenAddApplicationModal = (client) => {
    setSelectedClient(client);
    setShowAddApplicationModal(true);
  };

  const handleNewApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setNewApplicationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewApplication = async () => {
    if (!selectedClient) return;

   const newApp = {
      id: Date.now(),
      ...newApplicationFormData,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      attachments: []
    };


     const existingApplications = selectedClient.jobApplications || [];
    const updatedApplications = [newApp, ...existingApplications];
    
    const registrationRef = ref(database, `clients/${selectedClient.clientFirebaseKey}/serviceRegistrations/${selectedClient.registrationKey}/jobApplications`);
    
    try {
      await set(registrationRef, updatedApplications);
      setShowAddApplicationModal(false);
      triggerNotification("Application added successfully!");
    } catch (error) {
      console.error("Failed to save new application:", error);
      alert("Error saving application.");
    }
  };

  const handleViewApplication = (application) => {
    setViewedApplication(application);
    setShowViewApplicationModal(true);
  };

const handleEditApplication = (application) => {
      setEditedApplicationFormData({ ...application, attachments: application.attachments || [] });
      setShowEditApplicationModal(true);
  };

 const handleEditedApplicationFormChange = (e) => {
      const { name, value } = e.target;
      setEditedApplicationFormData(prev => ({ ...prev, [name]: value }));
  };

   const handleSaveEditedApplication = async () => {
    if (!editedApplicationFormData || !selectedClient) return;

    try {
      // Create a mutable copy of the form data to work with
      const applicationDataToSave = { ...editedApplicationFormData };
      const attachmentsToSave = [];
      let hasNewUploads = false;

      // Iterate through attachments to find and upload new files
      for (const attachment of applicationDataToSave.attachments || []) {
        // A new file will have a 'file' property and no 'downloadUrl'
        if (attachment.file && !attachment.downloadUrl) {
          hasNewUploads = true;
          const { clientFirebaseKey, registrationKey } = selectedClient;
          const appId = applicationDataToSave.id;
          const fileName = `${Date.now()}_${attachment.file.name}`;
          
          // Create a storage path
          const attachmentRef = storageRef(getStorage(), `application_attachments/${clientFirebaseKey}/${registrationKey}/${appId}/${fileName}`);
          
          // Upload the file
          const uploadResult = await uploadBytes(attachmentRef, attachment.file);
          const downloadURL = await getDownloadURL(uploadResult.ref);

          // Create a clean metadata object for the database (without the local 'file' object)
          attachmentsToSave.push({
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
            uploadDate: attachment.uploadDate,
            downloadUrl: downloadURL, // Save the URL instead of the file
          });
        } else {
          // This is an existing attachment, so keep it as is
          attachmentsToSave.push(attachment);
        }
      }
      
      if (hasNewUploads) {
          triggerNotification("Uploading attachments...");
      }

      // Replace the old attachments array with the new one containing URLs
      applicationDataToSave.attachments = attachmentsToSave;

      // Now, update the Realtime Database with the final application data
      const updatedApplications = (selectedClient.jobApplications || []).map(app =>
        app.id === applicationDataToSave.id ? applicationDataToSave : app
      );
      
      const registrationRef = ref(database, `clients/${selectedClient.clientFirebaseKey}/serviceRegistrations/${selectedClient.registrationKey}/jobApplications`);
      
      await set(registrationRef, updatedApplications);
      
      setShowEditApplicationModal(false);
      triggerNotification("Application updated successfully!");

    } catch (error) {
      console.error("Failed to save edited application or upload file:", error);
      alert("Error saving application. Please try again.");
    }
  };



  const handlePasteAttachment = useCallback((event) => {
    // Check if the edit modal is the active context
    if (!showEditApplicationModal) return;

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let pastedFiles = [];

    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) { // Only handle pasted images
        const file = item.getAsFile();
        // Create a new file object matching your state's structure
        const newFileObject = {
          name: `Pasted Screenshot ${Date.now()}.${file.type.split('/')[1] || 'png'}`,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: 'interview screenshot', // <-- CORRECTED TYPE
          uploadDate: new Date().toISOString().split('T')[0],
          file: file, // The actual File object
        };
        pastedFiles.push(newFileObject);
      }
    }

    if (pastedFiles.length > 0) {
      // Add the pasted files to the attachments in the edit form state
      setEditedApplicationFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...pastedFiles],
      }));
      triggerNotification(`${pastedFiles.length} file(s) pasted successfully!`);
    }
  }, [showEditApplicationModal]); // Dependencies for useCallback

  // This useEffect adds and removes the paste event listener
  useEffect(() => {
    window.addEventListener('paste', handlePasteAttachment);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('paste', handlePasteAttachment);
    };
  }, [handlePasteAttachment]);

  const handleDeleteApplication = (clientId, appId) => {
    const updateClientList = (prevClients) => {
      return prevClients.map(client =>
        client.id === clientId
          ? {
            ...client,
            jobApplications: client.jobApplications.filter(app => app.id !== appId),
          }
          : client
      );
    };

    // Determine which client list to update
    const targetClient = [...activeClients, ...inactiveClients].find(c => c.id === clientId);
    if (targetClient && targetClient.status === 'active') {
      setActiveClients(updateClientList);
    } else if (targetClient && targetClient.status === 'inactive') {
      setInactiveClients(updateClientList);
    }

    // Update selectedClient to reference the newly updated client object
    setSelectedClient(prevSelected => {
      if (prevSelected && prevSelected.id === clientId) {
        const updatedClient = updateClientList([prevSelected]).find(c => c.id === prevSelected.id);
        return updatedClient || null; // If the client itself is removed, clear selectedClient
      }
      return prevSelected;
    });

    triggerNotification("Application deleted successfully!"); // Trigger notification
  };

  // Function to filter and sort job applications
  const getFilteredAndSortedApplications = (applications) => {
    let filtered = applications || [];

    // Client filter (NEW) - This filter is now handled by passing the specific client's applications
    // if (selectedClient) {
    //   filtered = filtered.filter(app => app.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(app => {
      // Search term filter
      const matchesSearch = searchTerm
        ? Object.values(app).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      // Status filter
      const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;

      // Date range filter
      const appDate = new Date(app.appliedDate);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || appDate >= start) && (!end || appDate <= end);

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Job Title A-Z':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'Company A-Z':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Files Tab Functions ---
  const handleOpenUploadFileModal = (client) => {
    setSelectedClientForFile(client);
    setNewFileFormData({
      clientId: '', fileType: '', fileName: '', notes: ''
    });
    setShowUploadFileModal(true);
  };

const handleNewFileFormChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'fileName' && files && files[0]) {
    // Store the actual file object for uploading
    setFileToUpload(files[0]);
    // Update the form data with the file's name for display
    setNewFileFormData(prev => ({ ...prev, fileName: files[0].name }));
  } else {
    setNewFileFormData(prev => ({ ...prev, [name]: value }));
  }
};

  const handleOpenClientSelectModal = () => setIsClientSelectModalOpen(true);
  const handleCloseClientSelectModal = () => setIsClientSelectModalOpen(false);
  const handleSelectClientFromModal = (client) => {
      setSelectedClient(client);
      handleCloseClientSelectModal();
  };

// In EmployeeData.jsx, replace the existing handleSaveNewFile function

const handleSaveNewFile = async () => {
  // 1. Validation
  if (!selectedClientForFile || !newFileFormData.fileType || !fileToUpload) {
    alert('Please select a client, file type, and a file to upload.');
    return;
  }

  setIsUploading(true);
  const { clientFirebaseKey, registrationKey } = selectedClientForFile;

  try {
    triggerNotification("Uploading file, please wait..."); // Inform user

    // 2. Upload the file to Firebase Storage
    const storagePath = `client_files/${clientFirebaseKey}/${registrationKey}/${Date.now()}_${fileToUpload.name}`;
    const fileRef = storageRef(getStorage(), storagePath);
    await uploadBytes(fileRef, fileToUpload);
    const downloadURL = await getDownloadURL(fileRef);

    // 3. Prepare metadata for the Realtime Database
    const newFileMetadata = {
      id: Date.now(),
      downloadUrl: downloadURL,
      name: fileToUpload.name,
      size: `${(fileToUpload.size / 1024).toFixed(1)} KB`,
      type: newFileFormData.fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      notes: newFileFormData.notes || '',
    };

    // 4. Get existing files and add the new one
    const filesRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/files`);
    const existingFiles = selectedClientForFile.files || [];
    const updatedFiles = [newFileMetadata, ...existingFiles]; // Prepend new file to the list

    // 5. Save the updated file list back to the database
    await set(filesRef, updatedFiles);

    // 6. Reset UI and provide feedback
    setShowUploadFileModal(false);
    setFileToUpload(null);
    setNewFileFormData({ fileType: '', fileName: '', notes: '' });
    triggerNotification("File uploaded successfully!");

  } catch (error) {
    console.error("Error uploading file:", error);
    alert("File upload failed. Please try again.");
  } finally {
    setIsUploading(false); // Stop loading spinner regardless of outcome
  }
};

  const handleViewFile = (file) => {
    // NEW LOGIC: Check if the file is an image
    if (file.file && typeof file.file.type === 'string' && file.file.type.startsWith('image/')) {
      // If it's an image, create a URL and open the image viewer modal
      setImageUrlToView(URL.createObjectURL(file.file));
      setShowImageViewer(true);
    } else {
      // Otherwise, open the existing file details modal
      setViewedFile(file);
      setShowViewFileModal(true);
    }
  };

  const handleEditFile = (file) => {
    // Find the client associated with this file
    const client = [...activeClients, ...inactiveClients].find(c => c.files.some(fileItem => fileItem.id === file.id));
    setSelectedClientForFile(client); // Set this for context in save
    setEditedFileFormData({ ...file });
    setShowEditFileModal(true);
  };

  const handleEditedFileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedFileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedFile = () => {
    if (!editedFileFormData || !selectedClientForFile) return;

    const updateClientList = (prevClients) => {
      return prevClients.map(client =>
        client.id === selectedClientForFile.id
          ? {
            ...client,
            files: client.files.map(file =>
              file.id === editedFileFormData.id ? editedFileFormData : file
            ),
          }
          : client
      );
    };

    if (selectedClientForFile.status === 'active') {
      setActiveClients(updateClientList);
    } else if (selectedClientForFile.status === 'inactive') {
      setInactiveClients(updateClientList);
    }

    // Update selectedClient to reference the newly updated client object
    setSelectedClient(prevSelected => {
      const updatedClient = updateClientList([prevSelected]).find(c => c.id === prevSelected.id);
      return updatedClient || prevSelected;
    });

    setShowEditFileModal(false);
    setEditedFileFormData(null);
    setSelectedClientForFile(null);
    triggerNotification("File updated successfully!"); // Trigger notification
  };


  const openDeleteConfirmModal = (client, file) => {
    setFileToDelete({ client, file });
    setShowDeleteConfirmModal(true);
  };

  // 2. New function to handle the actual deletion after confirmation
  const confirmDeleteFile = () => {
    if (!fileToDelete) return;

    const { client, file } = fileToDelete;

    const updateClientList = (prevClients) => {
      return prevClients.map(c =>
        c.id === client.id
          ? {
            ...c,
            files: c.files.filter(f => f.id !== file.id),
          }
          : c
      );
    };

    if (client.status === 'active') {
      setActiveClients(updateClientList);
    } else if (client.status === 'inactive') {
      setInactiveClients(updateClientList);
    }

    setSelectedClient(prevSelected => {
      if (prevSelected && prevSelected.id === client.id) {
        return updateClientList([prevSelected])[0] || null;
      }
      return prevSelected;
    });
    
    triggerNotification("File deleted successfully!");
    closeDeleteConfirmModal(); // Close modal after deleting
  };
  
  // 3. New helper function to close the modal and reset state
  const closeDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setFileToDelete(null);
  };

  const getFilteredAndSortedFiles = (files) => {
    let filtered = files|| [];

    // Client filter (NEW) - This filter is now handled by passing the specific client's files
    // if (selectedClient) {
    //   filtered = filtered.filter(file => file.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(file => {
      const matchesSearch = searchTerm
        ? Object.values(file).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      const matchesFileType = fileTypeFilter === 'All File Types' || file.type === fileTypeFilter;

      const fileDate = new Date(file.uploadDate);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || fileDate >= start) && (!end || fileDate <= end);

      return matchesSearch && matchesFileType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'File Name A-Z':
          return a.name.localeCompare(b.name);
        case 'File Size (Asc)':
          return parseFloat(a.size) - parseFloat(b.size); // Assuming size is "X KB" or "Y MB"
        case 'File Size (Desc)':
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Activity Tab Functions ---
  const getFilteredAndSortedActivities = (activities) => {
    let filtered = activities;

    // Client filter (NEW) - This filter is now handled by passing the specific client's activities
    // if (selectedClient) {
    //   filtered = filtered.filter(activity => activity.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(activity => {
      const matchesSearch = searchTerm
        ? Object.values(activity).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      const matchesActivityType = activityTypeFilter === 'All Activities' || activity.type === activityTypeFilter;

      const activityDate = new Date(activity.date);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || activityDate >= start) && (!end || activityDate <= end);

      return matchesSearch && matchesActivityType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Activity Type A-Z':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleAcceptClient = async (clientToAccept) => {
    const registrationRef = ref(database, `clients/${clientToAccept.clientFirebaseKey}/serviceRegistrations/${clientToAccept.registrationKey}`);
    try {
      await update(registrationRef, { assignmentStatus: 'active' });
      triggerNotification(`Client ${clientToAccept.name} has been moved to Active Clients!`);
    } catch (error) {
      console.error("Failed to accept client:", error);
      alert("Error accepting client.");
    }
  };

  // ... inside the EmployeeData component, before the return statement ...

  // Apply all filters to the relevant base set of applications
  const filteredApplicationsForDisplay = useMemo(() => {
    // --- FIX: Add a safety check ---
    // If no client is selected, return an empty array immediately.
    if (!selectedClient) {
      return [];
    }

    // The rest of the logic runs only if a client is selected.
    let baseApps = selectedClient.jobApplications || [];

    return baseApps.filter(app => {
      const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
      const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
      const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        searchTerm === '' ||
        (app.website && app.website.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.position && app.position.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.company && app.company.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(lowerCaseSearchTerm));

      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
        const appDate = new Date(convertDDMMYYYYtoYYYYMMDD(app.dateAdded));
        appDate.setHours(0, 0, 0, 0);

        const start = startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null;
        const end = endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        matchesDateRange =
          (!start || appDate >= start) &&
          (!end || appDate <= end);
      }

      return matchesWebsite && matchesPosition && matchesCompany && matchesSearchTerm && matchesDateRange;
    });
  }, [selectedClient, filterWebsites, filterPositions, filterCompanies, searchTerm, startDateFilter, endDateFilter]);



  return (
    <div style={containerStyle}>
      <AdminHeader
        adminUserName={employeeDetails.name} // Pass dynamic name
        adminInitials={adminInitials} // Pass dynamic initials
        isDarkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar} // Pass the dummy toggleSidebar
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        profileDropdownRef={profileDropdownRef}
        showProfileModal={showEmployeeProfileModal} // Pass the state
        setShowProfileModal={handleOpenProfileModal} // Pass the function to open profile modal
        onNotificationClick={handleNotificationIconClick} // Pass notification click handler
      />
      {/* Centralized CSS styles for hover effects and animations */}
      <style>
        {`
         .custom-file-input-container {
          display: flex;
          align-items: center;
          gap: 0; /* Remove gap to make it look like one continuous field */
          border: 1px solid #cbd5e1;
          border-radius: 25px; /* Fully rounded corners */
          padding: 4px; /* Padding to contain the button */
          cursor: text;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .custom-file-input-container:hover,
        .custom-file-input-container:focus-within {
        border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
         }

       .add-attachment-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none; /* Remove border from button */
          background-color: transparent;
          font-size: 24px;
          font-weight: 300;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .add-attachment-btn:hover {
          background-color: #e0effe;
          color: #3b82f6;
        }

        .file-input-facade {
            flex-grow: 1;
            padding: 8px 12px;
            height: 100%;
        }

        .file-input-placeholder {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        /* NEW: Attachment Preview Styles */
        .attachments-preview-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f8fafc;
          border-radius: 8px;
        }

        .attachment-item {
          display: flex;
          align-items: center;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 5px 8px;
          font-size: 0.85rem;
          max-width: 200px;
        }
        
        .attachment-image-preview {
          width: 24px;
          height: 24px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 8px;
        }
        
        .attachment-file-icon {
          margin-right: 8px;
          color: #64748b;
        }

        .attachment-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-grow: 1;
        }

        .attachment-remove-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          margin-left: 8px;
          padding: 0 4px;
        }
        
        .attachment-remove-btn:hover {
          color: #ef4444;
        }

        /* General hover effect for buttons */
        .button-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        /* Tab button specific active and hover styles */
        .tab-button.active {
            background-color: #3b82f6; /* Directly set background-color */
            color: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .tab-button:hover {
            color: #3b82f6;
        }

        /* Client Card hover effect */
        .client-card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        /* Download button specific styles and animation */
        .download-button {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 8px 16px; /* Slightly smaller padding for card button */
          border-radius: 8px;
          font-size: 0.875rem; /* Smaller font size for card button */
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px; /* Smaller gap */
          width: 100%; /* Make button fill its container in the card */
          text-align: center;
        }

        .download-button:hover {
          transform: translateY(-2px); /* Slightly less movement */
          box-shadow: 0 6px 12px rgba(0,0,0,0.15); /* Slightly less intense shadow */
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }
        .download-button:disabled {
          background: #cbd5e1; /* Greyed out background */
          cursor: not-allowed;
          box-shadow: none;
        }
        .download-button:disabled:hover {
          transform: none; /* No movement on hover when disabled */
          box-shadow: none;
          background: #cbd5e1; /* Stays greyed out on hover */
        }


        /* View button specific hover */
        .view-button:hover {
          background-color: #c4e0ff;
        }

        /* Activity button specific hover */
        .activity-button:hover {
          background-color: #e2e8f0;
        }

        /* Notification Toast Styles */
        .notification-toast {
          position: fixed;
          top: 20px; /* Adjust as needed */
          right: 20px; /* Adjust as needed */
          background-color: #333;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000; /* Ensure it's on top */
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        .notification-toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* Notification Modal Styles */
        .notification-modal .modal-content {
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          overflow: hidden; /* Ensures rounded corners are respected */
        }

        .notification-modal .modal-header {
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-modal .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .notification-modal .btn-close-custom { /* Custom class for our SVG close button */
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          opacity: 1;
          transition: color 0.2s ease-out;
          padding: 0; /* Remove padding to make SVG size control easier */
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px; /* Explicit size for the button area */
          height: 24px;
        }

        .notification-modal .btn-close-custom:hover {
          color: #1e293b;
        }

        .notification-modal .modal-body {
          padding: 0; /* Remove default padding as items have their own */
        }

        .notification-item {
          padding: 15px 25px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background-color 0.2s ease-out;
        }

        .notification-item:last-child {
          border-bottom: none; /* No border for the last item */
        }

        .notification-item:hover {
          background-color: #f8fafc;
        }

        .notification-item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .notification-item-description {
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 5px;
        }

        .notification-item-time {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .client-select-search-container {
            margin-bottom: 15px;
        }
        .client-select-search-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 0.9rem;
        }
        .client-select-list {
            max-height: 40vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .client-select-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .client-select-item:hover {
            background-color: #f1f5f9;
        }
        .client-select-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #e0effe;
            color: #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
        }
        .client-select-info {
            display: flex;
            flex-direction: column;
        }
        .client-select-name {
            font-weight: 600;
            color: #1e293b;
        }
        .client-select-role {
            font-size: 0.85rem;
            color: #64748b;
        }

        `}
      </style>

      {/* Notification Toast */}
      {showNotification && (
        <div className="notification-toast show">
          {notificationMessage}
        </div>
      )}

      {/* Header */}
      <header style={headerContentStyle}> {/* Adjusted style here */}
        <div style={headerTitleStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Employee WorkSheet
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Manage job applications and client assignments
          </p>
        </div>
        <div style={tabsContainerStyle}>
          {/* Only top-level tabs here */}
          {['New Clients', 'Active Clients', 'Inactive Clients'].map(tab => (
            <button
              key={tab}
              style={{
                ...tabButtonStyle,
                ...(activeTab === tab ? tabButtonActiveStyle : {})
              }}
              className="tab-button"
              onClick={() => {
                setActiveTab(tab);
                // Reset sub-tab when switching main tabs
                setActiveSubTab('Applications');
                // Set selected client based on the new active tab
                if (tab === 'New Clients' && newClients.length > 0) {
                  setSelectedClient(newClients[0]);
                } else if (tab === 'Active Clients' && activeClients.length > 0) {
                  setSelectedClient(activeClients[0]);
                } else if (tab === 'Inactive Clients' && inactiveClients.length > 0) {
                  setSelectedClient(inactiveClients[0]);
                } else {
                  setSelectedClient(null);
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* NEW: New Clients Tab Content */}
      {activeTab === 'New Clients' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>New Client Requests</h2>
          <p style={subLabelStyle}>Review and manage new client registrations.</p>
          {newClients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              No new client requests at this time.
            </div>
          ) : (
            <div style={newClientsGridStyle}>
              {newClients.map(client => (
                <div key={client.registrationKey} style={newClientCardStyle}>
                  <div style={newClientCardHeaderStyle}>
                    <div style={initialsCircleStyle}>{client.initials}</div>
                    <div style={{ flexGrow: 1 }}>
                      <p style={newClientNameStyle}>{client.name}</p>
                      <p style={newClientDetailStyle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                          <path d="M22 16.92v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3"></path>
                          <polyline points="16 16 12 20 8 16"></polyline>
                          <line x1="12" y1="20" x2="12" y2="10"></line>
                        </svg>
                        {client.mobile}
                      </p>
                      <p style={newClientDetailStyle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <p style={newClientDetailStyle}><strong>Applying For:</strong> {client.jobsApplyFor}</p>
                  <p style={newClientDetailStyle}><strong>Registered:</strong> {client.registeredDate}</p>
                  <p style={newClientDetailStyle}><strong>Country:</strong> {client.country}</p>
                  <p style={newClientDetailStyle}><strong>Visa Status:</strong> {client.visaStatus}</p>
                  <div style={newClientCardActionsStyle}>
                    <button onClick={() => handleAcceptClient(client)} style={acceptButtonStyle}>Accept</button>
                    {/* <button onClick={() => handleDeclineClient(client.id)} style={declineButtonStyle}>Decline</button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Clients Tab Content */}
      {activeTab === 'Active Clients' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>Select Client</h2>
          <p style={subLabelStyle}>Choose a client to view their specific data across other tabs.</p>
          <div style={clientSelectContainerStyle}>
            <label style={filterLabelStyle}>Select Client:</label>
            <button onClick={handleOpenClientSelectModal} style={selectClientButtonStyle}>
              {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Select a Client'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          {selectedClient && selectedClient.assignmentStatus === 'active' ? (
            <>
              <div style={{ marginTop: '20px', padding: '15px', background: '#e0effe', borderRadius: '8px', border: '1px solid #c4e0ff' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6', margin: '0 0 10px 0' }}>
                  Currently viewing data for: {`${selectedClient.firstName} ${selectedClient.lastName}`}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                  Role: {selectedClient.role} | Job Location: {selectedClient.location} | Salary: {selectedClient.jobType}
                </p>
              </div>

              {/* Sub-tabs for selected client */}
              <div style={{ ...tabsContainerStyle, marginTop: '20px', justifyContent: 'flex-start' }}>
                {['Applications', 'Client data', 'Files', 'Activity'].map(subTab => (
                  <button
                    key={subTab}
                    style={{
                      ...tabButtonStyle,
                      ...(activeSubTab === subTab ? tabButtonActiveStyle : {})
                    }}
                    className="tab-button"
                    onClick={() => setActiveSubTab(subTab)}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* Sub-tab content - conditionally rendered based on activeSubTab */}
              {activeSubTab === 'Overview' && (
                <>
                  {/* Overview Cards */}
                  <div style={{ ...overviewCardsContainerStyle, marginTop: '24px' }}>
                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
                          <path d="M17 21v-2a4 0 0 0-4-4H5a4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Assigned Clients</p>
                      <p style={cardValueStyle}>{activeClients.length}</p>
                      <p style={cardSubLabelStyle}>Active assignments</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Job Applications</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.jobApplications || []).length}
                      </p>
                      <p style={cardSubLabelStyle}>Total submitted</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Active Interviews</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.jobApplications || []).filter(app => app.status === 'Interview').length}
                      </p>
                      <p style={cardSubLabelStyle}>In progress</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
                          <path d="M13 2H6a2 0 0 0-2 2v16a2 0 0 0 2 2h12a2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Files Uploaded</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.files || []).length}
                      </p>
                      <p style={cardSubLabelStyle}>Resumes & screenshots</p>
                    </div>
                  </div>

                  {/* My Assigned Clients Section (for the selected client) */}
                  <h2 style={sectionTitleStyle}>
                    Client Details
                  </h2>
                  <div style={clientsGridStyle}>
                    {/* Display only the selected client's card */}
                    {selectedClient && (
                      <div key={selectedClient.id} style={clientCardStyle} className="client-card-hover">
                        <div style={clientCardHeaderStyle}>
                          <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                          <div style={{ flexGrow: 1 }}>
                            <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                            <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                          </div>
                          <div style={{ ...statusBadgeStyle, backgroundColor: selectedClient.status === 'active' ? '#dcfce7' : '#fef2f2', color: selectedClient.status === 'active' ? '#16a34a' : '#ef4444' }}>
                            {selectedClient.status}
                          </div>
                          <div style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>
                            {selectedClient.priority}
                          </div>
                        </div>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          {selectedClient.role}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {selectedClient.location}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          {selectedClient.jobType}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Last activity: {selectedClient.lastActivity}
                        </p>

                        <div style={clientCardFooterStyle}>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Applications</span>
                            <span style={footerItemValueStyle}>{selectedClient.jobApplications.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Files</span>
                            <span style={footerItemValueStyle}>{selectedClient.files.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Resume</span>
                            {/* Conditionally render checkmark/cross based on resume availability */}
                            {(selectedClient.resumeUpdates || []).filter(u => u.type === 'Resume').length > 0 ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            )}
                            <button
                              onClick={() => handleDownloadResume(selectedClient.name)}
                              className="download-button"
                              disabled={(selectedClient.resumeUpdates || []).filter(u => u.type === 'Resume').length === 0}
                            >
                              Download
                            </button>
                            {getLatestResumeUpdateDate(selectedClient.resumeUpdates || []) && (
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                                Last updated: {getLatestResumeUpdateDate(selectedClient.resumeUpdates || [])}
                              </p>
                            )}
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Activity</span>
                            <button style={activityButtonStyle} className="activity-button">Activity</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Applications Tab Content */}
              {activeSubTab === 'Applications' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2> {/* Centered title */}
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}> {/* Moved Sort Order to the right */}
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Job Title A-Z">Job Title A-Z</option>
                        <option value="Company A-Z">Company A-Z</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && ( // Conditionally render Clear Filters button
                      <div style={clearFiltersButtonContainerStyle}> {/* New container for positioning */}
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>Client Job Applications</h2>
                  <p style={subLabelStyle}>Manage job applications for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}>
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 0 }}>
                        <p style={clientNameStyle}>{`${selectedClient.firstName} ${selectedClient.lastName}`} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                        <p style={clientCodeStyle}>{selectedClient.role || selectedClient.position} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}>
                        <span>Showing: <strong>{getFilteredAndSortedApplications(selectedClient?.jobApplications).length}</strong></span>
                        <span>Total: <strong>{selectedClient?.jobApplications?.length ?? 0}</strong></span>
                        <span>Interviews: <strong>{selectedClient?.jobApplications?.filter(app => app.status === 'Interview').length ?? 0}</strong></span>
                        <span>Applied: <strong>{selectedClient?.jobApplications?.filter(app => app.status === 'Applied').length ?? 0}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle}
                        onClick={() => handleOpenAddApplicationModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Application
                      </button>
                    </div>

                    <div style={applicationTableControlsStyle}>
                      <input
                        type="text"
                        placeholder="Search applications..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={statusFilterSelectStyle}
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offered">Offered</option>
                      </select>
                    </div>

                    <div style={applicationTableWrapperStyle}>
                      <table style={applicationTableStyle}>
                        <thead>
                          <tr>
                            <th style={applicationTableHeaderCellStyle}>S.No</th>
                            <th style={applicationTableHeaderCellStyle}>Job Title</th>
                            <th style={applicationTableHeaderCellStyle}>Company</th>
                            <th style={applicationTableHeaderCellStyle}>Job Type</th>
                            <th style={applicationTableHeaderCellStyle}>Platform</th>
                            <th style={applicationTableHeaderCellStyle}>Job ID</th>
                            <th style={applicationTableHeaderCellStyle}>Link</th>
                            <th style={applicationTableHeaderCellStyle}>Applied Date</th>
                            <th style={applicationTableHeaderCellStyle}>Attachments</th>
                            <th style={applicationTableHeaderCellStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredAndSortedApplications(selectedClient.jobApplications || []).length === 0 ? (
                            <tr>
                              <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                No applications found for this client.
                              </td>
                            </tr>
                          ) : (
                            getFilteredAndSortedApplications(selectedClient.jobApplications || []).map((app, index) => (
                              <tr key={app.id}>
                                <td style={applicationTableDataCellStyle}>
                                  {getFilteredAndSortedApplications(selectedClient.jobApplications).length - index}
                                </td>
                                <td style={applicationTableDataCellStyle}>{app.jobTitle}</td>
                                <td style={applicationTableDataCellStyle}>{app.company}</td>
                                <td style={applicationTableDataCellStyle}>{app.jobType}</td>
                                <td style={applicationTableDataCellStyle}>{app.platform}</td>
                                <td style={applicationTableDataCellStyle}>{app.jobId || '-'}</td> {/* Display Job ID */}
                                <td style={applicationTableDataCellStyle}>
                                  {app.jobUrl && (
                                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                                      Link
                                    </a>
                                  )}
                                </td>

                                <td style={applicationTableDataCellStyle}>{app.appliedDate}</td>

                                <td style={applicationTableDataCellStyle}>
                                  {app.attachments && app.attachments.length > 0 ? (
                                    <button
                                      onClick={() => {
                                        setViewedApplication(app);
                                        setShowViewApplicationModal(true);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3b82f6',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      View ({app.attachments.length})
                                    </button>
                                  ) : 'N/A'}
                                </td>


                                <td style={applicationTableDataCellStyle}>
                                  <button onClick={() => handleViewApplication(app)} style={actionButtonAppStyle}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                  </button>
                                  <button onClick={() => handleEditApplication(app)} style={actionButtonAppStyle}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 20h9"></path>
                                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                    </svg>
                                  </button>
                                  <button onClick={() => handleDeleteApplication(selectedClient.id, app.id)} style={deleteButtonAppStyle}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Tab Content */}
              {activeSubTab === 'Files' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}> {/* Reusing applicationsSectionStyle for consistent padding/shadow */}
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2>
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}>
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="File Name A-Z">File Name A-Z</option>
                        <option value="File Size (Asc)">File Size (Asc)</option>
                        <option value="File Size (Desc)">File Size (Desc)</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && ( // Conditionally render Clear Filters button
                      <div style={clearFiltersButtonContainerStyle}> {/* New container for positioning */}
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>Client File Management</h2>
                  <p style={subLabelStyle}>View, manage and download files for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}> {/* Reusing for consistent styling */}
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 1 }}>
                        <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                        <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}> {/* Reusing for stats display */}
                        <span>Showing: <strong>{getFilteredAndSortedFiles(selectedClient.files).length}</strong></span>
                        <span>Total Files: <strong>{(selectedClient.files || []).length}</strong></span>
                        <span>Resumes: <strong>{(selectedClient.files || []).filter(file => file.type === 'resume').length}</strong></span>
                        <span>Screenshots: <strong>{(selectedClient.files || []).filter(file => file.type === 'interview screenshot').length}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle} // Reusing for consistent button style
                        onClick={() => handleOpenUploadFileModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload File
                      </button>
                    </div>

                    <div style={applicationTableControlsStyle}> {/* Reusing for search and filter */}
                      <input
                        type="text"
                        placeholder="Search files..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={fileTypeFilter}
                        onChange={(e) => setFileTypeFilter(e.target.value)}
                        style={statusFilterSelectStyle} // Reusing select style
                      >
                        <option value="All File Types">All File Types</option>
                        <option value="resume">Resume</option>
                        <option value="cover letter">Cover Letter</option>
                        <option value="interview screenshot">Interview Screenshot</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="offers">Offers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div style={filesGridStyle}>
                      {getFilteredAndSortedFiles(selectedClient.files).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', gridColumn: '1 / -1' }}>
                          No files found for this client.
                        </div>
                      ) : (
                        getFilteredAndSortedFiles(selectedClient.files).map(file => (
                          <div key={file.id} style={fileCardStyle}>
                            <div style={fileCardHeaderStyle}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={fileIconStyle}>
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                              </svg>
                              <div style={{ flexGrow: 1 }}>
                                <p style={fileNameStyle}>{file.name}</p>
                                <p style={fileSizeStyle}>{file.size}</p>
                              </div>
                              <span style={{ ...fileTypeBadgeStyle, ...getFileTypeBadgeStyle(file.type) }}>
                                {file.type}
                              </span>
                            </div>
                            <p style={fileStatusStyle}>
                              Status: <span style={{ fontWeight: '600', color: '#10b981' }}>{file.status}</span>
                            </p>
                            <p style={fileUploadDateStyle}>Uploaded: {file.uploadDate}</p>
                            {file.notes && (
                              <p style={fileNotesStyle}>Notes: {file.notes}</p>
                            )}
                            <div style={fileActionsStyle}>
                              <button onClick={() => handleViewFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              <button onClick={() => handleEditFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                </svg>
                              </button>
                              <button onClick={() => handleRequestDeleteFile(selectedClient, file)} style={deleteButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* Activity Tab Content */}
              {activeSubTab === 'Activity' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2>
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}>
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Activity Type A-Z">Activity Type A-Z</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && ( // Conditionally render Clear Filters button
                      <div style={clearFiltersButtonContainerStyle}> {/* New container for positioning */}
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 0 0 0-2-2z"></path>
                            <line x1="18" y1="9" x2="12" y2="15"></line>
                            <line x1="12" y1="9" x2="18" y2="15"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', color: '#3b82f6' }}>
                      <polygon points="13 10 3 14 10 21 21 3 13 10"></polygon>
                    </svg>
                    Recent Activity Timeline
                  </h2>
                  <div style={activityTimelineContainerStyle}>
                    {getFilteredAndSortedActivities(allActivities).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No activities found for this client.
                      </div>
                    ) : (
                      getFilteredAndSortedActivities(allActivities).map((activity, index) => (
                        <div key={index} style={activityItemStyle}>
                          <div style={activityIconContainerStyle}>
                            <div style={initialsCircleSmallStyle}>{activity.initials}</div>
                          </div>
                          <div style={activityContentStyle}>
                            <p style={activityDescriptionStyle}>
                              <span style={{ fontWeight: '600' }}>{activity.name}</span> - {activity.description}
                            </p>
                            <p style={activityDateStyle}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle', color: '#94a3b8' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {activity.date}, {activity.time}
                            </p>
                          </div>
                          <div style={{ ...activityBadgeStyle, ...getActivityBadgeStyle(activity.type) }}>
                            {activity.type}
                          </div>
                          <div style={{ ...activityStatusBadgeStyle, ...getActivityStatusStyle(activity.status) }}>
                            {activity.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab Content */}
              {activeSubTab === 'Notes' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px', padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Notes content will go here for {selectedClient.name}.
                </div>
              )}

              {/* NEW: Client Data Tab Content */}
              {activeSubTab === 'Client data' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h2 style={sectionTitleStyle}>Full details of {selectedClient.name}</h2>
                      <p style={subLabelStyle}>Comprehensive information about the selected client.</p>
                    </div>
                    {/* Add Application Button for Client Data Tab */}
                    <button
                      style={addApplicationButtonStyle}
                      onClick={() => handleOpenAddApplicationModal(selectedClient)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Application
                    </button>
                  </div>
                  {simplifiedServices.includes(selectedClient.service) ? (
                    // --- RENDER SIMPLIFIED VIEW for ServiceForm clients (View Only) ---
                    <div style={{ ...clientDataGridStyle, gridTemplateColumns: '1fr' }}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Service Request Details</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Service:</strong> {selectedClient.service || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Sub-Services:</strong> {(selectedClient.subServices || []).join(', ') || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>User Type:</strong> {selectedClient.userType || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    <div style={clientDataGridStyle}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Personal Information</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Middle Name:</strong> {selectedClient.middleName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Date of Birth:</strong> {selectedClient.dob || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Gender:</strong> {selectedClient.gender || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Ethnicity:</strong> {selectedClient.ethnicity || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Contact Information</h3>
                        <p style={clientDataDetailStyle}><strong>Address:</strong> {selectedClient.address || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Zip Code:</strong> {selectedClient.zipCode || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Preferences & Status</h3>
                        <p style={clientDataDetailStyle}><strong>Security Clearance:</strong> {selectedClient.securityClearance || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Clearance Level:</strong> {selectedClient.clearanceLevel || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Willing to Relocate:</strong> {selectedClient.willingToRelocate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Work Preference:</strong> {selectedClient.workPreference || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Restricted Companies:</strong> {selectedClient.restrictedCompanies || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Jobs to Apply:</strong> {selectedClient.jobsToApply || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Technology Skills:</strong> {selectedClient.technologySkills || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Salary:</strong> {selectedClient.currentSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Expected Salary:</strong> {selectedClient.expectedSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Visa Status:</strong> {selectedClient.visaStatus || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Other Visa Status:</strong> {selectedClient.otherVisaStatus || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Education Details</h3>
                        <p style={clientDataDetailStyle}><strong>School Name:</strong> {selectedClient.schoolName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>School Address:</strong> {selectedClient.schoolAddress || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>School Phone:</strong> {selectedClient.schoolPhone || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Course of Study:</strong> {selectedClient.courseOfStudy || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Graduation Date:</strong> {selectedClient.graduationDate || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Employment Details</h3>
                        <p style={clientDataDetailStyle}><strong>Current Company:</strong> {selectedClient.currentCompany || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Designation:</strong> {selectedClient.currentDesignation || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Preferred Interview Time:</strong> {selectedClient.preferredInterviewTime || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Earliest Joining Date:</strong> {selectedClient.earliestJoiningDate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Relieving Date:</strong> {selectedClient.relievingDate || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>References</h3>
                        <p style={clientDataDetailStyle}><strong>Reference Name:</strong> {selectedClient.referenceName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Phone:</strong> {selectedClient.referencePhone || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Address:</strong> {selectedClient.referenceAddress || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Email:</strong> {selectedClient.referenceEmail || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Portal Accounts</h3>
                        <p style={clientDataDetailStyle}><strong>Account Name:</strong> {selectedClient.jobPortalAccountName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Credentials:</strong> {selectedClient.jobPortalCredentials ? '********' : '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Resume</h3>
                    <div style={clientDataDetailStyle}>
                      <strong>Current File:</strong>
                      {selectedClient.resumeUrl ? (
                        <a 
                          href={selectedClient.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ marginLeft: '8px', color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          {selectedClient.resumeFileName || 'Download File'}
                        </a>
                      ) : (
                        <span style={{ marginLeft: '8px', color: '#64748b' }}>No resume on file.</span>
                      )}
                    </div>
                    <div style={{ ...clientDataDetailStyle, marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label htmlFor="resumeUpload" style={{ fontWeight: '600' }}>Upload New Resume:</label>
                      <input
                        type="file"
                        id="resumeUpload"
                        onChange={handleResumeFileChange}
                        accept=".pdf,.doc,.docx"
                        style={{ ...modalInputStyle, maxWidth: '400px' }} // Re-using a style for consistency
                      />
                      {newResumeFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                          <p style={{ margin: 0, fontSize: '0.9em', color: '#475569' }}>
                            Selected: <strong>{newResumeFile.name}</strong>
                          </p>
                          <button
                            onClick={handleSaveNewResume}
                            style={{ ...acceptButtonStyle, padding: '6px 12px' }} // Re-using a style
                          >
                            Save New Resume
                          </button>
                        </div>
                      )}
                    </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              Please select a client from the dropdown to view their specific data.
            </div>
          )}
        </div>
      )}

      {/* NEW: Inactive Clients Tab Content */}
      {activeTab === 'Inactive Clients' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>Select Inactive Client</h2>
          <p style={subLabelStyle}>Choose an inactive client to view their specific data across other tabs.</p>
          <div style={clientSelectContainerStyle}>
            <label style={filterLabelStyle}>Select Client:</label>
            <button onClick={handleOpenClientSelectModal} style={selectClientButtonStyle}>
              {selectedClient ? selectedClient.name : 'Select an Inactive Client'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          {selectedClient && selectedClient.status === 'inactive' ? (
            <>
              <div style={{ marginTop: '20px', padding: '15px', background: '#ffe4e6', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ef4444', margin: '0 0 10px 0' }}>
                  Currently viewing data for: {selectedClient.name} (Inactive)
                </p>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                  Role: {selectedClient.role} | Job Location: {selectedClient.location} | Salary: {selectedClient.jobType}
                </p>
              </div>

              {/* Sub-tabs for selected inactive client */}
              <div style={{ ...tabsContainerStyle, marginTop: '20px', justifyContent: 'flex-start' }}>
                {['Applications', 'Client data', 'Files', 'Activity'].map(subTab => (
                  <button
                    key={subTab}
                    style={{
                      ...tabButtonStyle,
                      ...(activeSubTab === subTab ? tabButtonActiveStyle : {})
                    }}
                    className="tab-button"
                    onClick={() => setActiveSubTab(subTab)}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* Sub-tab content - conditionally rendered based on activeSubTab */}
              {activeSubTab === 'Overview' && (
                <>
                  {/* Overview Cards (adapted for inactive clients) */}
                  <div style={{ ...overviewCardsContainerStyle, marginTop: '24px' }}>
                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                          <path d="M17 21v-2a4 0 0 0-4-4H5a4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Inactive Clients</p>
                      <p style={cardValueStyle}>{inactiveClients.length}</p>
                      <p style={cardSubLabelStyle}>Total inactive</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: '#10b981' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Job Applications</p>
                      <p style={cardValueStyle}>
                        {selectedClient.jobApplications.length}
                      </p>
                      <p style={cardSubLabelStyle}>Total submitted</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Active Interviews</p>
                      <p style={cardValueStyle}>
                        {selectedClient.jobApplications.filter(app => app.status === 'Interview').length}
                      </p>
                      <p style={cardSubLabelStyle}>In progress</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Files Uploaded</p>
                      <p style={cardValueStyle}>
                        {selectedClient.files.length}
                      </p>
                      <p style={cardSubLabelStyle}>Resumes & screenshots</p>
                    </div>
                  </div>

                 
                  <h2 style={sectionTitleStyle}>
                    Client Details
                  </h2>
                  <div style={clientsGridStyle}>
                    {selectedClient && (
                      <div key={selectedClient.id} style={clientCardStyle} className="client-card-hover">
                        <div style={clientCardHeaderStyle}>
                          <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                          <div style={{ flexGrow: 1 }}>
                            <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                            <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                          </div>
                          <div style={{ ...statusBadgeStyle, backgroundColor: selectedClient.status === 'active' ? '#dcfce7' : '#fef2f2', color: selectedClient.status === 'active' ? '#16a34a' : '#ef4444' }}>
                            {selectedClient.status}
                          </div>
                          <div style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>
                            {selectedClient.priority}
                          </div>
                        </div>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          {selectedClient.role}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {selectedClient.location}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          {selectedClient.jobType}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Last activity: {selectedClient.lastActivity}
                        </p>

                        <div style={clientCardFooterStyle}>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Applications</span>
                            <span style={footerItemValueStyle}>{selectedClient.jobApplications.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Files</span>
                            <span style={footerItemValueStyle}>{selectedClient.files.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Resume</span>
                            {/* Conditionally render checkmark/cross based on resume availability */}
                            {selectedClient.resumeUpdates.filter(u => u.type === 'Resume').length > 0 ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            )}
                            <button
                              onClick={() => handleDownloadResume(selectedClient.name)}
                              className="download-button"
                              disabled={selectedClient.resumeUpdates.filter(u => u.type === 'Resume').length === 0}
                            >
                              Download
                            </button>
                            {getLatestResumeUpdateDate(selectedClient.resumeUpdates) && (
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                                Last updated: {getLatestResumeUpdateDate(selectedClient.resumeUpdates)}
                              </p>
                            )}
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Activity</span>
                            <button style={activityButtonStyle} className="activity-button">Activity</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Applications Tab Content for Inactive Clients */}
              {activeSubTab === 'Applications' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2>
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}>
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Job Title A-Z">Job Title A-Z</option>
                        <option value="Company A-Z">Company A-Z</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && (
                      <div style={clearFiltersButtonContainerStyle}>
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>Client Job Applications</h2>
                  <p style={subLabelStyle}>Manage job applications for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}>
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 0 }}>
                        <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                        <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}>
                        <span>Showing: <strong>{getFilteredAndSortedApplications(selectedClient.jobApplications).length}</strong></span>
                        <span>Total: <strong>{selectedClient.jobApplications.length}</strong></span>
                        <span>Interviews: <strong>{selectedClient.jobApplications.filter(app => app.status === 'Interview').length}</strong></span>
                        <span>Applied: <strong>{selectedClient.jobApplications.filter(app => app.status === 'Applied').length}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle}
                        onClick={() => handleOpenAddApplicationModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Application
                      </button>
                    </div>

                    <div style={applicationTableControlsStyle}>
                      <input
                        type="text"
                        placeholder="Search applications..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={statusFilterSelectStyle}
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offered">Offered</option>
                      </select>
                    </div>

                    <div style={applicationTableWrapperStyle}>
                      <table style={applicationTableStyle}>
                        <thead>
                          <tr>
                            <th style={applicationTableHeaderCellStyle}>S.No</th>
                            <th style={applicationTableHeaderCellStyle}>Job Title</th>
                            <th style={applicationTableHeaderCellStyle}>Company</th>
                            <th style={applicationTableHeaderCellStyle}>Platform</th>
                            <th style={applicationTableHeaderCellStyle}>Job ID</th>
                            <th style={applicationTableHeaderCellStyle}>Link</th>
                            <th style={applicationTableHeaderCellStyle}>Applied Date</th>
                            <th style={applicationTableHeaderCellStyle}>Attachments</th>
                            <th style={applicationTableHeaderCellStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredAndSortedApplications(selectedClient.jobApplications || []).length === 0 ? (
                            <tr>
                              <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                No applications found for this client.
                              </td>
                            </tr>
                          ) : (
                            getFilteredAndSortedApplications(selectedClient.jobApplications || []).map((app, index) => (
                              <tr key={app.id}>
                                <td style={applicationTableDataCellStyle}>
                                  {getFilteredAndSortedApplications(selectedClient.jobApplications).length - index}
                                </td>
                                <td style={applicationTableDataCellStyle}>{app.jobTitle}</td>
                                <td style={applicationTableDataCellStyle}>{app.company}</td>
                                <td style={applicationTableDataCellStyle}>{app.platform}</td>
                                <td style={applicationTableDataCellStyle}>{app.jobId || '-'}</td>
                                <td style={applicationTableDataCellStyle}>
                                  {app.jobUrl && (
                                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                                      Link
                                    </a>
                                  )}
                                </td>

                                <td style={applicationTableDataCellStyle}>{app.appliedDate}</td>

                                <td style={applicationTableDataCellStyle}>
                                  {app.attachments && app.attachments.length > 0 ? (
                                    <button
                                      onClick={() => {
                                        setViewedApplication(app);
                                        setShowViewApplicationModal(true);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3b82f6',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      View ({app.attachments.length})
                                    </button>
                                  ) : 'N/A'}
                                </td>


                                <td style={applicationTableDataCellStyle}>
                                  <button onClick={() => handleViewApplication(app)} style={actionButtonAppStyle}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                  </button>
                                  <button onClick={() => handleEditApplication(app)} style={actionButtonAppStyle}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 20h9"></path>
                                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                    </svg>
                                  </button>
                                  <button onClick={() => handleDeleteApplication(selectedClient.id, app.id)} style={deleteButtonAppStyle}>
                                    {/* FIX: Replaced malformed SVG with a standard trash icon */}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Tab Content for Inactive Clients */}
              {activeSubTab === 'Files' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2>
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}>
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="File Name A-Z">File Name A-Z</option>
                        <option value="File Size (Asc)">File Size (Asc)</option>
                        <option value="File Size (Desc)">File Size (Desc)</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && (
                      <div style={clearFiltersButtonContainerStyle}>
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 0 0 0-2-2z"></path>
                            <line x1="18" y1="9" x2="12" y2="15"></line>
                            <line x1="12" y1="9" x2="18" y2="15"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>Client File Management</h2>
                  <p style={subLabelStyle}>View, manage and download files for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}>
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 1 }}>
                        <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                        <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}>
                        <span>Showing: <strong>{getFilteredAndSortedFiles(selectedClient.files).length}</strong></span>
                        <span>Total Files: <strong>{selectedClient.files.length}</strong></span>
                        <span>Resumes: <strong>{selectedClient.files.filter(file => file.type === 'resume').length}</strong></span>
                        <span>Screenshots: <strong>{selectedClient.files.filter(file => file.type === 'interview screenshot').length}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle}
                        onClick={() => handleOpenUploadFileModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload File
                      </button>
                    </div>

                    <div style={applicationTableControlsStyle}>
                      <input
                        type="text"
                        placeholder="Search files..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={fileTypeFilter}
                        onChange={(e) => setFileTypeFilter(e.target.value)}
                        style={statusFilterSelectStyle}
                      >
                        <option value="All File Types">All File Types</option>
                        <option value="resume">Resume</option>
                        <option value="cover letter">Cover Letter</option>
                        <option value="interview screenshot">Interview Screenshot</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="report">Offers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div style={filesGridStyle}>
                      {getFilteredAndSortedFiles(selectedClient.files).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', gridColumn: '1 / -1' }}>
                          No files found for this client.
                        </div>
                      ) : (
                        getFilteredAndSortedFiles(selectedClient.files).map(file => (
                          <div key={file.id} style={fileCardStyle}>
                            <div style={fileCardHeaderStyle}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={fileIconStyle}>
                                <path d="M13 2H6a2 0 0 0-2 2v16a2 0 0 0 2 2h12a2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                              </svg>
                              <div style={{ flexGrow: 1 }}>
                                <p style={fileNameStyle}>{file.name}</p>
                                <p style={fileSizeStyle}>{file.size}</p>
                              </div>
                              <span style={{ ...fileTypeBadgeStyle, ...getFileTypeBadgeStyle(file.type) }}>
                                {file.type}
                              </span>
                            </div>
                            <p style={fileStatusStyle}>
                              Status: <span style={{ fontWeight: '600', color: '#10b981' }}>{file.status}</span>
                            </p>
                            <p style={fileUploadDateStyle}>Uploaded: {file.uploadDate}</p>
                            {file.notes && (
                              <p style={fileNotesStyle}>Notes: {file.notes}</p>
                            )}
                            <div style={fileActionsStyle}>
                              <button onClick={() => handleViewFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              <button onClick={() => handleEditFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                </svg>
                              </button>
                              <button onClick={() => handleDeleteFile(selectedClient.id, file.id)} style={deleteButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* Activity Tab Content for Inactive Clients */}
              {activeSubTab === 'Activity' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Advanced Filters</h2>
                  <div style={filterContainerStyle}>
                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Date Range</label>
                      <div style={dateRangeInputGroupStyle}>
                        <input
                          type="date"
                          name="startDate"
                          value={filterDateRange.startDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                        <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                        <input
                          type="date"
                          name="endDate"
                          value={filterDateRange.endDate}
                          onChange={handleDateRangeChange}
                          style={dateInputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ ...filterGroupStyle, marginLeft: 'auto' }}>
                      <label style={filterLabelStyle}>Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={selectFilterStyle}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Activity Type A-Z">Activity Type A-Z</option>
                      </select>
                    </div>

                    <div style={filterGroupStyle}>
                      <label style={filterLabelStyle}>Quick Filters</label>
                      <div style={quickFilterButtonsStyle}>
                        <button
                          onClick={() => handleQuickFilterChange('Last 7 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('Last 30 Days')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          Last 30 Days
                        </button>
                        <button
                          onClick={() => handleQuickFilterChange('All Time')}
                          style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                        >
                          All Time
                        </button>
                      </div>
                    </div>

                    {areFiltersActive() && (
                      <div style={clearFiltersButtonContainerStyle}>
                        <label style={filterLabelStyle}>Actions</label>
                        <button
                          onClick={handleClearFilters}
                          style={clearFiltersButtonStyle}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 0 0 0-2-2z"></path>
                            <line x1="18" y1="9" x2="12" y2="15"></line>
                            <line x1="12" y1="9" x2="18" y2="15"></line>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 style={sectionTitleStyle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', color: '#3b82f6' }}>
                      <path d="M13 10L3 14 10 21 21 3 13 10z"></path>
                    </svg>
                    Recent Activity Timeline
                  </h2>
                  <div style={activityTimelineContainerStyle}>
                    {getFilteredAndSortedActivities(allActivities).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No activities found for this client.
                      </div>
                    ) : (
                      getFilteredAndSortedActivities(allActivities).map((activity, index) => (
                        <div key={index} style={activityItemStyle}>
                          <div style={activityIconContainerStyle}>
                            <div style={initialsCircleSmallStyle}>{activity.initials}</div>
                          </div>
                          <div style={activityContentStyle}>
                            <p style={activityDescriptionStyle}>
                              <span style={{ fontWeight: '600' }}>{activity.name}</span> - {activity.description}
                            </p>
                            <p style={activityDateStyle}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle', color: '#94a3b8' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {activity.date}, {activity.time}
                            </p>
                          </div>
                          <div style={{ ...activityBadgeStyle, ...getActivityBadgeStyle(activity.type) }}>
                            {activity.type}
                          </div>
                          <div style={{ ...activityStatusBadgeStyle, ...getActivityStatusStyle(activity.status) }}>
                            {activity.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab Content for Inactive Clients */}
              {activeSubTab === 'Notes' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px', padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Notes content will go here for {selectedClient.name}.
                </div>
              )}

              {/* Client Data Tab Content for Inactive Clients */}
              {activeSubTab === 'Client data' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h2 style={sectionTitleStyle}>Full details of {selectedClient.name}</h2>
                      <p style={subLabelStyle}>Comprehensive information about the selected client.</p>
                    </div>
                    <button
                      style={addApplicationButtonStyle}
                      onClick={() => handleOpenAddApplicationModal(selectedClient)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Application
                    </button>
                  </div>

                  {simplifiedServices.includes(selectedClient.service) ? (
                    // --- RENDER SIMPLIFIED VIEW for ServiceForm clients ---
                    <div style={{ ...clientDataGridStyle, gridTemplateColumns: '1fr' }}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Service Request Details</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Service:</strong> {selectedClient.service || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Sub-Services:</strong> {(selectedClient.subServices || []).join(', ') || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>User Type:</strong> {selectedClient.userType || '-'}</p>
                      </div>
                    </div>
                  ) : (

                    <div style={clientDataGridStyle}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Personal Information</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Middle Name:</strong> {selectedClient.middleName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Date of Birth:</strong> {selectedClient.dob || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Gender:</strong> {selectedClient.gender || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Ethnicity:</strong> {selectedClient.ethnicity || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Contact Information</h3>
                        <p style={clientDataDetailStyle}><strong>Address:</strong> {selectedClient.address || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Zip Code:</strong> {selectedClient.zipCode || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Preferences & Status</h3>
                        <p style={clientDataDetailStyle}><strong>Security Clearance:</strong> {selectedClient.securityClearance || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Clearance Level:</strong> {selectedClient.clearanceLevel || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Willing to Relocate:</strong> {selectedClient.willingToRelocate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Work Preference:</strong> {selectedClient.workPreference || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Restricted Companies:</strong> {selectedClient.restrictedCompanies || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Jobs to Apply:</strong> {selectedClient.jobsToApply || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Technology Skills:</strong> {selectedClient.technologySkills || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Salary:</strong> {selectedClient.currentSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Expected Salary:</strong> {selectedClient.expectedSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Visa Status:</strong> {selectedClient.visaStatus || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Other Visa Status:</strong> {selectedClient.otherVisaStatus || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Education Details</h3>
                        <p style={clientDataDetailStyle}><strong>School Name:</strong> {selectedClient.schoolName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>School Address:</strong> {selectedClient.schoolAddress || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>School Phone:</strong> {selectedClient.schoolPhone || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Course of Study:</strong> {selectedClient.courseOfStudy || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Graduation Date:</strong> {selectedClient.graduationDate || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Employment Details</h3>
                        <p style={clientDataDetailStyle}><strong>Current Company:</strong> {selectedClient.currentCompany || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Designation:</strong> {selectedClient.currentDesignation || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Preferred Interview Time:</strong> {selectedClient.preferredInterviewTime || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Earliest Joining Date:</strong> {selectedClient.earliestJoiningDate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Relieving Date:</strong> {selectedClient.relievingDate || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>References</h3>
                        <p style={clientDataDetailStyle}><strong>Reference Name:</strong> {selectedClient.referenceName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Phone:</strong> {selectedClient.referencePhone || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Address:</strong> {selectedClient.referenceAddress || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Email:</strong> {selectedClient.referenceEmail || '-'}</p>
                      </div>

                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Portal Accounts</h3>
                        <p style={clientDataDetailStyle}><strong>Account Name:</strong> {selectedClient.jobPortalAccountName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Credentials:</strong> {selectedClient.jobPortalCredentials ? '********' : '-'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              Please select an inactive client from the dropdown to view their specific data.
            </div>
          )}
        </div>
      )}

      {/* Add New Application Modal */}
      {selectedClient && (
        <Modal show={showAddApplicationModal} onHide={() => setShowAddApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Add Job Application for {selectedClient.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Apply for a job on behalf of {selectedClient.name}. The application will be automatically sent to the client.</p>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={newApplicationFormData.jobTitle}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
          

              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="company"
                  value={newApplicationFormData.company}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., TechCorp"
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={newApplicationFormData.platform}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="Select platform"
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job URL <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="url"
                  name="jobUrl"
                  value={newApplicationFormData.jobUrl}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="https://..."
                  required
                />
              </div>
                        <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Type</label>
                <select
                  name="jobType"
                  value={newApplicationFormData.jobType}
                  onChange={handleNewApplicationFormChange}
                  style={modalSelectStyle}
                >
                  <option value="">Select Job Type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Location</label>
                <input
                  type="text"
                  name="location"
                  value={newApplicationFormData.location}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div style={modalFormFieldGroupStyle}> {/* New Job ID field */}
                <label style={modalLabelStyle}>Job ID</label>
                <input
                  type="text"
                  name="jobId"
                  value={newApplicationFormData.jobId}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., ABC-12345"
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={newApplicationFormData.notes}
                  onChange={handleNewApplicationFormChange}
                  style={modalTextareaStyle}
                  placeholder="Any additional notes about this application..."
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowAddApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewApplication}
              style={modalAddButtonPrimaryStyle}
            >
              Add Application
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Application Details Modal */}
      {viewedApplication && (
        <Modal show={showViewApplicationModal} onHide={() => setShowViewApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Job Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalViewDetailsGridStyle}>
              <p style={modalViewDetailItemStyle}><strong>Job Title:</strong> {viewedApplication.jobTitle}</p>
              <p style={modalViewDetailItemStyle}><strong>Company:</strong> {viewedApplication.company}</p>
              <p style={modalViewDetailItemStyle}><strong>Platform:</strong> {viewedApplication.platform}</p>
              <p style={modalViewDetailItemStyle}><strong>Job ID:</strong> {viewedApplication.jobId || '-'}</p> {/* Display Job ID */}
              <p style={modalViewDetailItemStyle}><strong>Job URL:</strong> <a href={viewedApplication.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{viewedApplication.jobUrl}</a></p>
              <p style={modalViewDetailItemStyle}><strong>Job Type:</strong> {viewedApplication.jobType || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Job Location:</strong> {viewedApplication.location || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Status:</strong> <span style={{ ...applicationStatusBadgeStyle, ...getApplicationStatusStyle(viewedApplication.status) }}>{viewedApplication.status}</span></p>
              {viewedApplication.status === 'Interview' && (
                <>
                  <p style={modalViewDetailItemStyle}><strong>Round:</strong> {viewedApplication.round || '-'}</p>
                  <p style={modalViewDetailItemStyle}><strong>Interview Date:</strong> {viewedApplication.interviewDate || '-'}</p>
                  <p style={modalViewDetailItemStyle}><strong>Recruiter Mail ID:</strong> {viewedApplication.recruiterMail || '-'}</p>
                </>
              )}
              <div style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}>
                <strong>Attachments:</strong>
                {viewedApplication.attachments && viewedApplication.attachments.length > 0 ? (
                <div style={{ marginTop: '10px' }}>
                  {viewedApplication.attachments.map((file, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}>
                      {/* ... file icon and info ... */}
                      <div style={{ flexGrow: 1 }}>{file.name}</div>
                      <button
                        onClick={() => {
                          // Open the image viewer with the download URL
                          setImageUrlToView(file.downloadUrl);
                          setShowImageViewer(true);
                        }}
                        style={{
                          background: '#3b82f6', color: 'white', border: 'none',
                          padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                    </div>
                  ))}
                  </div>
                ) : 'N/A'}
              </div>
              <p style={modalViewDetailItemStyle}><strong>Applied Date:</strong> {viewedApplication.appliedDate}</p>
              <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}><strong>Notes:</strong> {viewedApplication.notes || '-'}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowViewApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit Application Details Modal */}
      {editedApplicationFormData && (
        <Modal show={showEditApplicationModal} onHide={() => setShowEditApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit Job Application</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedApplicationFormData.jobTitle}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="company"
                  value={editedApplicationFormData.company}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={editedApplicationFormData.platform}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job URL <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="url"
                  name="jobUrl"
                  value={editedApplicationFormData.jobUrl}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
               <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Type</label>
                <select
                  name="jobType"
                  value={editedApplicationFormData.jobType}
                  onChange={handleEditedApplicationFormChange}
                  style={modalSelectStyle}
                >
                  <option value="">Select Job Type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Location</label>
                <input
                  type="text"
                  name="location"
                  value={editedApplicationFormData.location}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job ID</label> {/* Edit Job ID field */}
                <input
                  type="text"
                  name="jobId"
                  value={editedApplicationFormData.jobId}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., ABC-12345"
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="status"
                  value={editedApplicationFormData.status}
                  onChange={handleEditedApplicationFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offered">Offered</option>
                </select>
              </div>

              {/* Conditionally render Round and Interview Date fields */}
              {editedApplicationFormData.status === 'Interview' && (
                <>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Round<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="round"
                      value={editedApplicationFormData.round || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                      placeholder="e.g., 1st Round, Technical"
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Recruiter Mail ID<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="email"
                      name="recruiterMail"
                      value={editedApplicationFormData.recruiterMail || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Interview Date<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={editedApplicationFormData.interviewDate || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Interview Time<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="time"
                      name="interviewTime"
                      value={editedApplicationFormData.interviewTime || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>

                </>
              )}

              {/* Add this new field for attachments */}
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Attachments</label>

                {/* Preview area for pasted/selected files */}
                {editedApplicationFormData.attachments.length > 0 && (
                  <div className="attachments-preview-container">
                    {(editedApplicationFormData.attachments || []).map((file, index) => (
                      <div key={index} className="attachment-item">
                        {file.file && typeof file.file.type === 'string' && file.file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file.file)} alt={file.name} className="attachment-image-preview" />
                        ) : (
                          <div className="attachment-file-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                          </div>
                        )}
                        <span className="attachment-name">{file.name}</span>
                        <button
                          onClick={() => {
                            const updatedAttachments = [...editedApplicationFormData.attachments];
                            updatedAttachments.splice(index, 1);
                            setEditedApplicationFormData(prev => ({ ...prev, attachments: updatedAttachments }));
                          }}
                          className="attachment-remove-btn"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="custom-file-input-container"
                >
                  {/* This button is now the only way to trigger the file dialog */}
                  <button
                    type="button"
                    className="add-attachment-btn"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    +
                  </button>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Hide the actual input
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files).map(file => ({
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        // If it's an image, classify it; otherwise, it's a general attachment.
                        type: file.type.startsWith('image/') ? 'interview screenshot' : 'application attachment',
                        uploadDate: new Date().toLocaleString(),
                        file: file
                      }));
                      setEditedApplicationFormData(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), ...newFiles]
                      }));
                    }}
                  />
                  <div className="file-input-facade">
                    <span className="file-input-placeholder">
                      Add file or paste a screenshot
                    </span>
                  </div>
                </div>
              </div>


              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Applied Date <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  name="appliedDate"
                  value={editedApplicationFormData.appliedDate}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  disabled
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={editedApplicationFormData.notes}
                  onChange={handleEditedApplicationFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedApplication}
              style={modalAddButtonPrimaryStyle}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Upload File Modal */}
      {selectedClientForFile && (
        <Modal show={showUploadFileModal} onHide={() => setShowUploadFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Upload File</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Upload resume, interview screenshot, or other documents for your clients. Files will be automatically sent to clients.</p>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Client <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="clientId"
                  value={selectedClientForFile.id}
                  onChange={(e) => setSelectedClientForFile([...activeClients, ...inactiveClients].find(c => c.id === parseInt(e.target.value)))}
                  style={modalSelectStyle}
                  required
                  disabled // Client is pre-selected
                >
                  {[...activeClients, ...inactiveClients].map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="fileType"
                  value={newFileFormData.fileType}
                  onChange={handleNewFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="">Select file type</option>
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  <option value="interview screenshot">Interview Screenshot</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="offers">Offers</option>
                  <option value="other">Others</option>
                </select>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>File <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="file"
                  name="fileName"
                  onChange={handleNewFileFormChange}
                  style={modalInputStyle}
                  required
                />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG (Max 10MB)</p>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Details</label>
                <textarea
                  name="notes"
                  value={newFileFormData.notes}
                  onChange={handleNewFileFormChange}
                  style={modalTextareaStyle}
                  placeholder="Any additional notes about this file..."
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowUploadFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewFile}
              style={modalAddButtonPrimaryStyle}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span style={{ marginLeft: '5px' }}>Uploading...</span>
                </>
              ) : (
                'Upload File'
              )}
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {viewedFile && (
        <Modal show={showViewFileModal} onHide={() => setShowViewFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>File Viewer: {viewedFile.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              minHeight: '300px',
              justifyContent: 'center'
            }}>
              {/* File preview content - simplified to just show file info */}
              <div style={{
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <p style={{ color: '#64748b' }}>File preview not available in demo</p>
                <button
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`Downloading ${viewedFile.name}... (Demo mode)`)}
                >
                  Download File (Demo)
                </button>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <p style={{ marginBottom: '10px' }}><strong>File Details:</strong></p>
              <div style={modalViewDetailsGridStyle}>
                <p style={modalViewDetailItemStyle}><strong>File Name:</strong> {viewedFile.name}</p>
                <p style={modalViewDetailItemStyle}><strong>File Type:</strong> {viewedFile.type}</p>
                <p style={modalViewDetailItemStyle}><strong>File Size:</strong> {viewedFile.size}</p>
                <p style={modalViewDetailItemStyle}><strong>Upload Date:</strong> {viewedFile.uploadDate}</p>
                {viewedFile.notes && (
                  <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}>
                    <strong>Notes:</strong> {viewedFile.notes}
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => {
                setShowViewFileModal(false);
                if (viewedApplication) {
                  setShowViewApplicationModal(true);
                }
              }}
              style={modalCancelButtonStyle}
            >
              Back to Application
            </button>
            <button
              onClick={() => setShowViewFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit File Details Modal */}
      {editedFileFormData && (
        <Modal show={showEditFileModal} onHide={() => setShowEditFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit File Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Name <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editedFileFormData.name}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="type"
                  value={editedFileFormData.type}
                  onChange={handleEditedFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  <option value="interview screenshot">Interview Screenshot</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="offers">Offers</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Size</label>
                <input
                  type="text"
                  name="size"
                  value={editedFileFormData.size}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status</label>
                <input
                  type="text"
                  name="status"
                  value={editedFileFormData.status}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  disabled // Status is usually derived or set internally
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Upload Date</label>
                <input
                  type="date"
                  name="uploadDate"
                  value={editedFileFormData.uploadDate}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={editedFileFormData.notes}
                  onChange={handleEditedFileFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedFile}
              style={modalAddButtonPrimaryStyle}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Employee Profile Details Modal */}
      {/* Employee Profile Details Modal */}
      <Modal show={showEmployeeProfileModal} onHide={() => setShowEmployeeProfileModal(false)} size="lg" centered>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...modalBodyStyle, maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={modalFormGridStyle}>
            {/* Personal Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Personal Information</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>First Name</label>
              <input type="text" name="firstName" value={isEditingProfile ? editedEmployeeDetails.firstName : employeeDetails.firstName} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Last Name</label>
              <input type="text" name="lastName" value={isEditingProfile ? editedEmployeeDetails.lastName : employeeDetails.lastName} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={isEditingProfile ? editedEmployeeDetails.dateOfBirth : employeeDetails.dateOfBirth} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Gender</label>
              <input type="text" name="gender" value={isEditingProfile ? editedEmployeeDetails.gender : employeeDetails.gender} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>

            {/* Contact Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', margin: '15px 0' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Contact Details</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Personal Email</label>
              <input type="email" name="personalEmail" value={isEditingProfile ? editedEmployeeDetails.personalEmail : employeeDetails.personalEmail} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Work Email</label>
              <input type="email" name="workEmail" value={employeeDetails.workEmail} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Personal Number</label>
              <input type="tel" name="personalNumber" value={isEditingProfile ? editedEmployeeDetails.personalNumber : employeeDetails.personalNumber} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Alternative Number</label>
              <input type="tel" name="alternativeNumber" value={isEditingProfile ? editedEmployeeDetails.alternativeNumber : employeeDetails.alternativeNumber} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
              <label style={modalLabelStyle}>Address</label>
              <textarea name="address" value={isEditingProfile ? editedEmployeeDetails.address : employeeDetails.address} onChange={handleProfileFormChange} style={modalTextareaStyle} disabled={!isEditingProfile}></textarea>
            </div>

            {/* Employment Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', margin: '15px 0' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Employment Details</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Employee ID</label>
              <input type="text" value={employeeDetails.firebaseKey} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Date of Joining</label>
              <input type="date" name="dateOfJoin" value={employeeDetails.dateOfJoin} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Roles</label>
              <input type="text" value={(employeeDetails.roles || []).join(', ')} style={modalInputStyle} disabled />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          {isEditingProfile ? (
            <>
              <button onClick={handleCancelEditProfile} style={modalCancelButtonStyle}>Cancel</button>
              <button onClick={handleSaveProfileChanges} style={modalAddButtonPrimaryStyle}>Save Changes</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditingProfile(true)} style={modalAddButtonPrimaryStyle}>Edit Profile</button>
              <button onClick={() => setShowEmployeeProfileModal(false)} style={modalCancelButtonStyle}>Close</button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Notification Modal (New from screenshot) */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered className="notification-modal">
        <Modal.Header>
          <Modal.Title>Notifications</Modal.Title>
          <button
            type="button"
            className="btn-close-custom"
            aria-label="Close"
            onClick={() => setShowNotificationModal(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
              No new notifications.
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <p className="notification-item-title">{notification.title}</p>
                  <p className="notification-item-description">{notification.description}</p>
                  <p className="notification-item-time">{notification.timeAgo}</p>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {isClientSelectModalOpen && (
        <Modal show={isClientSelectModalOpen} onHide={handleCloseClientSelectModal} size="md" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Select a Client</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ ...modalBodyStyle, padding: '15px 25px' }}>
            <div className="client-select-search-container">
              <input
                type="text"
                placeholder="Search clients by name..."
                className="client-select-search-input"
                value={clientSearchTermInModal}
                onChange={(e) => setClientSearchTermInModal(e.target.value)}
                autoFocus
              />
            </div>
            <div className="client-select-list">
              {(activeTab === 'Active Clients' ? activeClients : inactiveClients)
                .filter(client =>
                  `${client.firstName} ${client.lastName}`.toLowerCase().includes(clientSearchTermInModal.toLowerCase())
                )
                .map(client => (
                  <div key={client.registrationKey} className="client-select-item" onClick={() => handleSelectClientFromModal(client)}>
                    <div className="client-select-avatar">{client.initials}</div>
                    <div className="client-select-info">
                      <div className="client-select-name">{`${client.firstName} ${client.lastName}`}</div>
                      <div className="client-select-role">{client.role}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showImageViewer} onHide={() => setShowImageViewer(false)} size="lg" centered>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...modalBodyStyle, textAlign: 'center', padding: '10px' }}>
          <img
            src={imageUrlToView}
            alt="Attachment Preview"
            style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px' }}
          />
        </Modal.Body>
      </Modal>

            {/* Delete File Confirmation Modal */}
      <Modal show={showDeleteFileModal} onHide={() => setShowDeleteFileModal(false)} centered size="md">
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#475569' }}>
            Are you sure you want to permanently delete this file?
          </p>
          {fileToDelete && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 15px', textAlign: 'center', color: '#1e293b', wordBreak: 'break-all' }}>
              <strong>{fileToDelete.file.name}</strong>
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#ef4444', marginTop: '15px' }}>
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <button
            onClick={() => setShowDeleteFileModal(false)}
            style={modalCancelButtonStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeleteFile}
            style={{...modalAddButtonPrimaryStyle, backgroundColor: '#ef4444' }}
            disabled={isDeleting} // Disable the button while loading
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span style={{ marginLeft: '5px' }}>Deleting...</span>
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
  background: '#f8fafc',
  color: '#1e293b',
  minHeight: '100vh',
  padding: '0', // Removed padding-top here
};

const headerContentStyle = { // New style for the content under AdminHeader
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '20px',
  width: '100%',
  paddingTop: '32px', // Added padding-top here to move content down
};

const headerTitleStyle = {
  width: '100%',
  textAlign: 'center',
  marginBottom: '10px',
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '8px',
  background: '#ffffff',
  borderRadius: '8px',
  padding: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginLeft: '20px', // Move tabs slightly to the right
};

const tabButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'color 0.2s, background-color 0.2s',
};

const tabButtonActiveStyle = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
};


const overviewCardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
  marginBottom: '40px',
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  position: 'relative',
  overflow: 'hidden',
};

const cardIconContainerStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '50%',
  padding: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
};

const cardLabelStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
  margin: 0,
};

const cardValueStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: '4px 0',
};

const cardSubLabelStyle = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  margin: 0,
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '24px',
  // textAlign: 'center', // Added for centering the title
};

const clientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const clientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', // Added transition for client cards
};

const clientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const initialsCircleStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: '600',
};

const clientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const clientCodeStyle = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0,
};

const statusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
};

const priorityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto', // Push to the right
};

const clientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
};

const clientDetailIconStyle = {
  color: '#94a3b8',
  marginRight: '8px',
};

const clientCardFooterStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #f1f5f9',
};

const footerItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const footerItemLabelStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  marginBottom: '4px',
};

const footerItemValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '8px',
};

const footerItemIconStyle = {
  marginBottom: '8px',
};

const viewButtonStyle = {
  background: '#e0effe',
  color: '#3b82f6',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

const activityButtonStyle = {
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

// --- NEW STYLES FOR APPLICATIONS TAB ---
const applicationsSectionStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
};

const subLabelStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: '4px 0 24px 0',
};

const filterContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '1px solid #f1f5f9',
  alignItems: 'flex-end', // Align items to the bottom
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const filterLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#475569',
};

const dateRangeInputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const dateInputStyle = {
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  flex: 1,
};

const selectFilterStyle = {
  padding: '8px 25px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none', // Remove default arrow
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  width: '100%', // Ensure it takes full width of its grid column
  maxWidth: '250px', // Increased max-width for dropdowns
};

const selectClientDropdownStyle = { // New style for the specific client dropdown
  padding: '8px 25px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none', // Remove default arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  width: '250px', // Increased width for this specific dropdown
};

const quickFilterButtonsStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const quickFilterButtonStyle = {
  background: '#e2e8f0',
  color: '#475569',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
};

const quickFilterButtonActiveStyle = {
  background: '#3b82f6',
  color: '#ffffff',
};

const clearFiltersButtonContainerStyle = { // New style for positioning
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginLeft: 'auto', // Push to the right
  gridColumn: 'span 1', // Ensure it takes its own grid column
  justifySelf: 'end', // Align to the end of its grid area
};

const clearFiltersButtonStyle = {
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  whiteSpace: 'nowrap', // Prevent text wrapping
  justifyContent: 'center',
  minWidth: '150px',
};

const clientApplicationsContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '24px',
};

const clientApplicationsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid #f1f5f9',
  flexWrap: 'wrap', // Allow wrapping on smaller screens
};

const clientAppStatsStyle = {
  display: 'flex',
  gap: '16px',
  fontSize: '0.9rem',
  color: '#475569',
  marginLeft: 'auto', // Push stats to the right
  marginRight: '20px', // Space before add button
  flexWrap: 'wrap',
  justifyContent: 'flex-end', // Align stats to the right if wrapped
};

const addApplicationButtonStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '150px',
  justifyContent: 'center',
};

const applicationTableControlsStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const searchInputStyle = {
  flexGrow: 1,
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  maxWidth: '300px', // Limit search input width
};

const statusFilterSelectStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  minWidth: '150px',
};

const applicationTableWrapperStyle = {
  overflowX: 'auto', // Enable horizontal scrolling for the table on small screens
  width: '100%',
};

const applicationTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
};

const applicationTableHeaderCellStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontSize: '0.85rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0',
};

const applicationTableDataCellStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '0.9rem',
  color: '#1e293b',
  verticalAlign: 'middle',
};

const applicationStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  display: 'inline-block',
};

const getApplicationStatusStyle = (status) => {
  switch (status) {
    case 'Applied':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'Interview':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'Rejected':
      return { backgroundColor: '#fee2e2', color: '#ef4444' };
    case 'Offered':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const actionButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#1e293b',
  marginRight: '4px',
  transition: 'color 0.2s, background-color 0.2s',
};

const saveButtonAppStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const deleteButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#ef4444',
  transition: 'color 0.2s, background-color 0.2s',
};

const editableInputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

const editableSelectStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '8px',
};

// --- NEW STYLES FOR FILES TAB ---
const filesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginTop: '20px',
};

const fileCardStyle = {
  background: '#f8fafc', // Lighter background for file cards
  borderRadius: '10px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
};

const fileCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const fileIconStyle = {
  color: '#64748b',
};

const fileNameStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
  wordBreak: 'break-word', // Ensure long file names wrap
};

const fileSizeStyle = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  margin: 0,
};

const fileTypeBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
};

const getFileTypeBadgeStyle = (type) => {
  switch (type) {
    case 'resume':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'cover letter':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview screenshot':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'portfolio':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'Offers':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    case 'application attachment':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};


const fileStatusStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileUploadDateStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileNotesStyle = {
  fontSize: '0.85rem',
  color: '#475569',
  margin: '8px 0',
  fontStyle: 'italic',
  borderLeft: '2px solid #cbd5e1',
  paddingLeft: '8px',
};

const fileActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: 'auto', // Push actions to the bottom
  paddingTop: '12px',
  borderTop: '1px solid #f1f5f9',
};

const editableSelectSmallStyle = {
  padding: '4px 6px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.75rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 4px center',
  backgroundSize: '6px',
};

// --- NEW STYLES FOR ACTIVITY TAB ---
const activityTimelineContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const activityItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px',
  borderRadius: '10px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

const activityIconContainerStyle = {
  flexShrink: 0,
};

const initialsCircleSmallStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  fontWeight: '600',
};

const activityContentStyle = {
  flexGrow: 1,
};

const activityDescriptionStyle = {
  fontSize: '0.95rem',
  color: '#1e293b',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const activityDateStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  margin: 0,
};

const activityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const getActivityBadgeStyle = (type) => {
  switch (type) {
    case 'job application':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'file upload':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview scheduled':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'status update':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'resume update':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const activityStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  marginLeft: '8px', // Space between activity type and status
};

const getActivityStatusStyle = (status) => {
  switch (status) {
    case 'Active':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'Completed':
      return { backgroundColor: '#e2e8f0', color: '#475569' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

// --- NEW STYLES FOR MODALS (Add/View/Edit Application) ---
const modalHeaderStyle = {
  borderBottom: 'none',
  paddingBottom: '15px',
  textAlign: 'center',
};

const modalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const modalBodyStyle = {
  padding: '20px 30px',
  lineHeight: '1.8',
  color: '#444',
};

const modalFormGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const modalFormFieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const modalLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#475569',
};

const modalInputStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  width: '100%',
};

const modalSelectStyle = {
  ...modalInputStyle,
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
};

const modalTextareaStyle = {
  ...modalInputStyle,
  minHeight: '80px',
  resize: 'vertical',
};

const modalFooterStyle = {
  borderTop: 'none',
  paddingTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end', // Align buttons to the right
  gap: '15px',
};

const modalCancelButtonStyle = {
  background: '#cbd5e1',
  color: '#475569',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalAddButtonPrimaryStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalViewDetailsGridStyle = {
  // Removed grid properties to make items stack one by one
  // display: 'grid',
  // gridTemplateColumns: '1fr 1fr',
  gap: '10px 20px',
  fontSize: '0.95rem',
  color: '#333',
};

const modalViewDetailItemStyle = {
  margin: 0,
  padding: '5px 0',
};

// --- NEW CLIENTS TAB STYLES ---
const newClientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '20px',
};

const newClientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const newClientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const newClientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const newClientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
};

const newClientCardActionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '16px',
  justifyContent: 'flex-end',
};

const acceptButtonStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const declineButtonStyle = {
  background: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const clientSelectContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  marginLeft: '20px', // Move client select slightly to the right
};

// --- NEW STYLES FOR CLIENT DATA TAB ---
const clientDataGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '20px',
};

const clientDataSectionStyle = {
  background: '#f8fafc',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
};

const clientDataSectionTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#3b82f6',
  marginBottom: '15px',
  borderBottom: '1px solid #c4e0ff',
  paddingBottom: '10px',
};

const clientDataDetailStyle = {
  fontSize: '0.95rem',
  color: '#1e293b',
  margin: '8px 0',
  lineHeight: '1.4',
};

const selectClientButtonStyle = {
  padding: '8px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: '250px',
};



export default EmployeeData;
