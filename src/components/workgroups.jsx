import React, { useState, useEffect } from 'react';
import {
  FaBars, FaSearch, FaBell, FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaPlus, FaSun, FaMoon,
  FaShieldAlt, FaUsers, FaCog, FaUser
} from 'react-icons/fa';
import { Toaster, toast } from 'sonner';

// Reusable Tooltip Component
const Tooltip = ({ text, tooltipId, currentHoveredTooltipId }) => {
  if (tooltipId !== currentHoveredTooltipId) {
    return null;
  }
  return (
    <div className="um-tooltip">
      {text}
    </div>
  );
};

const WorkGroups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isConfirmModalForStatus, setIsConfirmModalForStatus] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('userManagement');
  const [isCreateSecurityGroupModalOpen, setIsCreateSecurityGroupModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    designations: [], // This will now store an array of selected designation names
    status: 'active',
    // Removed lastLogin from initial state for new user
  });

  const [newSecurityGroup, setNewSecurityGroup] = useState({
    name: '',
    description: '',
    permissions: [], // Stores selected permission IDs/names
  });
  const [currentPermissionTab, setCurrentPermissionTab] = useState('Administration'); // State for managing active tab

  const permissionsData = {
    Administration: [
      { id: 'sys-config', name: 'System Configuration', description: 'Configure system settings' },
      { id: 'user-admin', name: 'User Administration', description: 'Manage user accounts' },
      { id: 'security-mgmt', name: 'Security Management', description: 'Manage security settings' },
      { id: 'backup-recovery', name: 'Backup & Recovery', description: 'System backup and recovery' },
    ],
    Asset: [
      { id: 'asset-view', name: 'Asset View', description: 'View asset details' },
      { id: 'asset-edit', name: 'Asset Edit', description: 'Modify asset information' },
      { id: 'asset-create', name: 'Asset Create', description: 'Register new assets' },
      { id: 'asset-delete', name: 'Asset Delete', description: 'Remove assets from system' },
    ],
    Work: [
      { id: 'wo-create', name: 'Work Order Create', description: 'Create new work orders' },
      { id: 'wo-assign', name: 'Work Order Assign', description: 'Assign work orders to personnel' },
      { id: 'wo-approve', name: 'Work Order Approve', description: 'Approve or reject work orders' },
      { id: 'wo-track', name: 'Work Order Track', description: 'Track work order progress' },
    ],
    Inventory: [
      { id: 'inv-view', name: 'Inventory View', description: 'View inventory levels' },
      { id: 'inv-adjust', name: 'Inventory Adjust', description: 'Adjust inventory counts' },
      { id: 'inv-transfer', name: 'Inventory Transfer', description: 'Transfer inventory between locations' },
      { id: 'inv-order', name: 'Inventory Order', description: 'Place new inventory orders' },
    ],
  };

  // Dummy Data for Employee Directory
  const [users, setUsers] = useState([
    { id: 1, name: 'Michael Rodriguez', email: 'michael.rodriguez@company.com', department: 'IT Administration', designations: ['ADMIN'], status: 'active', lastLogin: '2024-06-24 14:30' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.chen@company.com', department: 'Human Resources', designations: ['JOB APPLICATION SPECIALIST', 'MANAGER'], status: 'active', lastLogin: '2024-06-24 09:15' },
    { id: 3, name: 'David Thompson', email: 'david.thompson@company.com', department: 'Operations', designations: ['MANAGER'], status: 'active', lastLogin: '2024-06-23 16:45' },
    { id: 4, name: 'Lisa Patel', email: 'lisa.patel@company.com', department: 'Asset Management', designations: ['ASSET MANAGER', 'MANAGER'], status: 'active', lastLogin: '2024-06-24 11:20' },
    { id: 5, name: 'James Wilson', email: 'james.wilson@company.com', department: 'Maintenance', designations: ['TEAM LEAD'], status: 'active', lastLogin: '2024-06-24 08:45' },
    { id: 6, name: 'Emily Johnson', email: 'emily.johnson@company.com', department: 'Finance', designations: ['MANAGER'], status: 'active', lastLogin: '2024-06-23 15:30' },
    { id: 7, name: 'Robert Garcia', email: 'robert.grape@company.com', department: 'Facilities', designations: ['ASSET MANAGER', 'TEAM LEAD'], status: 'active', lastLogin: '2024-06-24 10:15' },
    { id: 8, name: 'Amanda Foster', email: 'amanda.foster@company.com', department: 'Human Resources', designations: ['JOB APPLICATION SPECIALIST', 'TEAM LEAD'], status: 'inactive', lastLogin: '2024-06-20 14:20' },
  ]);

  // Dummy Data for Company Designations (for checkboxes in Add User form)
  const [designations, setDesignations] = useState([
    {
      id: 1,
      name: 'ADMIN',
      type: 'core',
      secondaryType: 'executive',
      description: 'Full system administration and configuration privileges',
      employees: 1,
      permissions: 13,
      keyPermissions: ['SYS CONFIG', 'SYS USERS', 'SYS SECURITY', '+10 more'],
      deletable: false,
    },
    {
      id: 2,
      name: 'MANAGER',
      type: 'core',
      description: 'Management level access with approval and oversight capabilities',
      employees: 3,
      permissions: 13,
      keyPermissions: ['ASSET APPROVE', 'ASSET TRANSFER', 'WO APPROVE', '+10 more'],
      deletable: false,
    },
    {
      id: 3,
      name: 'ASSET MANAGER',
      type: 'specialized',
      description: 'Comprehensive asset lifecycle and inventory management',
      employees: 2,
      permissions: 15,
      keyPermissions: ['ASSET VIEW', 'ASSET EDIT', 'ASSET CREATE', '+12 more'],
      deletable: true,
    },
    {
      id: 4,
      name: 'TEAM LEAD',
      type: 'core',
      description: 'Team leadership with specialist coordination and task assignment',
      employees: 3,
      permissions: 13,
      keyPermissions: ['TEAM VIEW', 'TEAM ASSIGN', 'TEAM SCHEDULE', '+10 more'],
      deletable: false,
    },
    {
      id: 5,
      name: 'JOB APPLICATION SPECIALIST',
      type: 'specialized',
      description: 'HR recruitment and employee onboarding system access',
      employees: 2,
      permissions: 8,
      keyPermissions: ['HR CANDIDATE', 'HR ONBOARD', 'HR ACCESS', '+5 more'],
      deletable: true,
    },
  ]);


  // Admin user data for header display
  const adminUserName = "Admin User";
  const adminUserEmail = "administrator@company.com";

  // Function to get initials from a name
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ').filter(part => part.length > 0);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return '';
  };

  const adminInitials = getInitials(adminUserName);

  // Load theme preference from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Apply or remove dark-mode class to the html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.designations.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      department: '',
      designations: [], // Initialize empty for new user
      status: 'active',
      // lastLogin is removed as it's not relevant for new user creation in this context
    });
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Updated handler for designation checkboxes
  const handleDesignationCheckboxChange = (designationName) => {
    setNewUser(prevUser => {
      const updatedDesignations = prevUser.designations.includes(designationName)
        ? prevUser.designations.filter(d => d !== designationName)
        : [...prevUser.designations, designationName];
      return { ...prevUser, designations: updatedDesignations };
    });
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...newUser, id: editingUser.id } : user
      ));
      toast.success(`User ${newUser.name} updated successfully!`);
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      // When adding a new user, set lastLogin to "N/A" or current date/time if desired
      // For this request, we'll set it to "N/A" as the field is removed from input
      setUsers([...users, { ...newUser, id: newId, lastLogin: 'N/A' }]);
      toast.success(`User ${newUser.name} added successfully!`);
    }
    closeAddUserModal();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // Ensure designations is an array for editing
    setNewUser({
      name: user.name,
      email: user.email,
      department: user.department,
      designations: Array.isArray(user.designations) ? user.designations : [],
      status: user.status,
      lastLogin: user.lastLogin, // Keep lastLogin for editing existing users
    });
    setIsAddUserModalOpen(true);
  };

  // Original function to open the confirmation modal for status change
  const openConfirmModal = (user) => {
    setUserToToggleStatus(user);
    setIsConfirmModalForStatus(true);
  };

  const confirmToggleStatus = () => {
    if (userToToggleStatus) {
      setUsers(users.map(user =>
        user.id === userToToggleStatus.id
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
      toast.success(`User ${userToToggleStatus.name} status changed to ${userToToggleStatus.status === 'active' ? 'inactive' : 'active'}!`);
      setIsConfirmModalForStatus(false);
      setUserToToggleStatus(null);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalForStatus(false);
    setUserToToggleStatus(null);
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast.success(`User ${userToDelete.name} deleted successfully!`);
      setIsDeleteConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setIsDeleteConfirmModalOpen(false);
    setUserToDelete(null);
  };

  // Function to handle designation deletion (placeholder)
  const handleDeleteDesignation = (designation) => {
    toast.info(`Attempting to delete ${designation.name}. (Not fully implemented)`);
    // Implement actual deletion logic here, possibly with a confirmation modal
  };

  // Functions for Create Work Group Modal
  const openCreateSecurityGroupModal = () => { // Function name remains consistent, but context changes
    setNewSecurityGroup({ name: '', description: '', permissions: [] });
    setCurrentPermissionTab('Administration'); // Reset to first tab
    setIsCreateSecurityGroupModalOpen(true);
  };

  const closeCreateSecurityGroupModal = () => {
    setIsCreateSecurityGroupModalOpen(false);
  };

  const handleSecurityGroupInputChange = (e) => {
    const { name, value } = e.target;
    setNewSecurityGroup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionCheckboxChange = (permissionId) => {
    setNewSecurityGroup(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleCreateSecurityGroupSubmit = (e) => {
    e.preventDefault();
    console.log("New Work Group Data:", newSecurityGroup);
    toast.success(`Work Group '${newSecurityGroup.name}' created!`);
    // Here you would typically send this data to a backend or update global state
    closeCreateSecurityGroupModal();
  };


  return (
    <div className="um-body-container">
      <Toaster position="bottom-right" richColors />
      <style>
        {`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* CSS Variables for theming */
        :root {
          --bg-body: #f3f4f6;
          --bg-card: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --shadow-color-1: rgba(0, 0, 0, 0.05);
          --shadow-color-2: rgba(0, 0, 0, 0.1);
          --shadow-color-3: rgba(0, 0, 0, 0.04);
          --bg-header: #ffffff;
          --bg-nav-active: #eff6ff;
          --text-nav-active: #1f2937;
          --text-nav-link: #4b5563;
          --bg-nav-link-hover: #f9fafb;
          --icon-color: #6b7280;
          --admin-avatar-bg: #1f2937;
          --admin-avatar-text: #ffffff;
          --add-btn-bg: #2563eb;
          --add-btn-hover-bg: #1d4ed8;
          --search-border: #d1d5db;
          --search-icon: #9ca3af;
          --table-header-bg: #f9fafb;
          --table-text-strong: #111827;
          --table-text-normal: #6b7280;
          --tag-admin-bg: #fee2e2;
          --tag-admin-text: #991b1b;
          --tag-job-application-specialist-bg: #e0f2fe;
          --tag-job-application-specialist-text: #1e40af;
          --tag-manager-bg: #fef3c7;
          --tag-manager-text: #92400e;
          --tag-asset-manager-bg: #dbeafe;
          --tag-asset-manager-text: #1e40af;
          --tag-team-lead-bg: #dcfce7;
          --tag-team-lead-text: #166534;
          --tag-default-bg: #f0f4f8;
          --tag-default-text: #606f7b;
          --status-active-bg: #d1fae5;
          --status-active-text: #047857;
          --status-inactive-bg: #e5e7eb;
          --status-inactive-text: #374151;
          --action-hover-bg: #f3f4f6;
          --action-yellow: #ca8a04;
          --action-yellow-hover: #a16207;
          --action-red: #ef4444;
          --action-red-hover: #dc2626;
          --action-green: #22c55e;
          --action-green-hover: #16a34a;
          --modal-bg: #ffffff;
          --modal-title-color: #1f2937;
          --modal-label-color: #374151;
          --modal-input-border: #d1d5db;
          --modal-input-color: #374151;
          --modal-cancel-bg: #ffffff;
          --modal-cancel-hover-bg: #f3f4f6;
          --modal-cancel-border: #d1d5db;
          --modal-confirm-red-bg: #ef4444;
          --modal-confirm-red-hover-bg: #dc2626;
          --modal-confirm-green-bg: #22c55e;
          --modal-confirm-green-hover-bg: #16a34a;
          --modal-overlay-bg: rgba(0, 0, 0, 0.75);
          --tooltip-bg: #333;
          --tooltip-text-color: #fff;
          --logo-x-color: #2563eb; /* New CSS variable for the blue 'X' */

          /* Designation-specific colors */
          --designation-core-bg: #1f2937; /* Darker for core as per image */
          --designation-core-text: #ffffff;
          --designation-specialized-bg: #fff7ed; /* Orangeish for specialized */
          --designation-specialized-text: #c2410c;
          --designation-executive-bg: #fecaca; /* Light red for executive */
          --designation-executive-text: #dc2626;
          --key-permission-tag-bg: #e5e7eb;
          --key-permission-tag-text: #4b5563;

          /* Security Group Modal specific styles */
          --tab-bg: #f3f4f6;
          --tab-text: #6b7280;
          --tab-active-bg: #ffffff;
          --tab-active-text: #1f2937;
          --tab-border: #e5e7eb;
          --permission-item-bg-hover: #f9fafb;
          --permission-border-bottom: #e5e7eb;
        }

        html.dark-mode {
          --bg-body: #1a202c;
          --bg-card: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --shadow-color-1: rgba(0, 0, 0, 0.2);
          --shadow-color-2: rgba(0, 0, 0, 0.3);
          --shadow-color-3: rgba(0, 0, 0, 0.2);
          --bg-header: #2d3748;
          --bg-nav-active: #4299e1;
          --text-nav-active: #ffffff;
          --text-nav-link: #cbd5e0;
          --bg-nav-link-hover: #4a5568;
          --icon-color: #cbd5e0;
          --admin-avatar-bg: #4299e1;
          --admin-avatar-text: #ffffff;
          --add-btn-bg: #4299e1;
          --add-btn-hover-bg: #3182ce;
          --search-border: #4a5568;
          --search-icon: #a0aec0;
          --table-header-bg: #2d3748;
          --table-text-strong: #e2e8f0;
          --table-text-normal: #a0aec0;
          --tag-admin-bg: #fbd38d;
          --tag-admin-text: #6b4617;
          --tag-job-application-specialist-bg: #a7d9f8;
          --tag-job-application-specialist-text: #2c5282;
          --tag-manager-bg: #ecc94b;
          --tag-manager-text: #7b341f;
          --tag-asset-manager-bg: #a7d9f8;
          --tag-asset-manager-text: #2c5282;
          --tag-team-lead-bg: #9ae6b4;
          --tag-team-lead-text: #2f855a;
          --tag-default-bg: #4a5568;
          --tag-default-text: #e2e8f0;
          --status-active-bg: #48bb78;
          --status-active-text: #ffffff;
          --status-inactive-bg: #a0aec0;
          --status-inactive-text: #2d3748;
          --action-hover-bg: #4a5568;
          --action-yellow: #ecc94b;
          --action-yellow-hover: #d69e2e;
          --action-red: #fc8181;
          --action-red-hover: #e53e3e;
          --action-green: #68d391;
          --action-green-hover: #38a169;
          --modal-bg: #2d3748;
          --modal-title-color: #e2e8f0;
          --modal-label-color: #cbd5e0;
          --modal-input-border: #4a5568;
          --modal-input-color: #e2e8f0;
          --modal-cancel-bg: #4a5568;
          --modal-cancel-hover-bg: #6a768f;
          --modal-cancel-border: #4a5568;
          --modal-confirm-red-bg: #e53e3e;
          --modal-confirm-red-hover-bg: #c53030;
          --modal-confirm-green-bg: #38a169;
          --modal-confirm-green-hover-bg: #2f855a;
          --modal-overlay-bg: rgba(0, 0, 0, 0.85);
          --tooltip-bg: #555;
          --tooltip-text-color: #eee;
          --logo-x-color: #4299e1; /* Dark mode blue for the 'X' */
        }

        /* Base styles */
        .um-body-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-body);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: var(--text-primary);
        }

        /* Top Navigation Bar */
        .um-header {
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

        .um-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .um-logo {
          display: flex;
          align-items: center;
          /* Removed gap: 0.5rem; to eliminate space around 'X' */
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .um-logo-x {
          color: var(--logo-x-color); /* Apply the blue color */
        }

        .um-nav-menu {
          display: none;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .um-nav-menu {
            display: flex;
          }
        }

        .um-nav-link {
          color: var(--text-nav-link);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          transition: background-color 150ms, color 150ms;
          text-decoration: none;
          font-weight: 500;
        }

        .um-nav-link:hover {
          color: #2563eb;
          background-color: var(--bg-nav-link-hover);
        }

        .um-nav-link-active {
          background-color: var(--bg-nav-active);
          color: var(--text-nav-active);
          font-weight: 600;
        }

        .um-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .um-icon-btn {
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

        .um-icon-btn:hover {
          color: #2563eb;
        }

        .um-notification-icon {
          position: relative;
        }

        .um-notification-badge {
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

        .um-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .um-user-info-text {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }

        @media (min-width: 768px) {
          .um-user-info-text {
            display: flex;
          }
        }

        .um-user-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        .um-user-email {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        /* Initials Avatar Styles */
        .um-initials-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background-color: var(--admin-avatar-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .um-initials-text {
          color: var(--admin-avatar-text);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .um-hamburger-menu {
          display: block;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background-color: var(--border-color);
          transition: background-color 150ms;
          cursor: pointer;
        }

        .um-hamburger-menu:hover {
          background-color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .um-hamburger-menu {
            display: none;
          }
        }

        /* Sidebar for Mobile */
        .um-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 16rem;
          background-color: var(--bg-card);
          box-shadow: 0 20px 25px -5px var(--shadow-color-2), 0 10px 10px -5px var(--shadow-color-3);
          padding: 1.5rem;
          z-index: 50;
          transform: translateX(100%);
          transition: transform 300ms ease-in-out;
        }

        .um-sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .um-sidebar {
            transform: translateX(100%);
          }
        }

        .um-sidebar-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .um-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        /* Main Content Area */
        .um-main-content {
          flex: 1;
          padding: 1.5rem;
        }

        @media (min-width: 768px) {
          .um-main-content {
            padding: 2rem;
          }
        }

        .um-content-wrapper {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          background-color: var(--bg-card);
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px var(--shadow-color-2), 0 10px 10px -5px var(--shadow-color-3);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .um-content-wrapper {
            padding: 2rem;
          }
        }

        .um-header-section {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
        }

        @media (min-width: 768px) {
          .um-header-section {
            flex-direction: row;
            align-items: center;
          }
        }

        .um-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .um-subtitle {
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .um-add-btn { /* Generic add button, used for 'Add New User' and 'Create Security Group' */
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: var(--add-btn-bg);
          color: #ffffff;
          font-weight: 600;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
          transition: background-color 150ms;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          white-space: nowrap; /* Prevent button text from wrapping */
        }

        @media (min-width: 768px) {
          .um-add-btn {
            margin-top: 0;
          }
        }

        .um-add-btn:hover {
          background-color: var(--add-btn-hover-bg);
        }

        /* Employee Directory Card Styling */
        .um-employee-directory-card {
            background-color: var(--bg-card);
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        /* Layout for Employee Directory Header and Search */
        .um-employee-directory-header-row {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        @media (min-width: 768px) {
            .um-employee-directory-header-row {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
            }
        }

        .um-directory-text-content {
            flex-shrink: 0;
        }

        .um-section-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .um-section-description {
          color: var(--text-secondary);
          margin-bottom: 0;
        }

        /* Search Bar */
        .um-search-container {
          min-width: 200px;
          width: 100%;
          max-width: 250px;
        }

        @media (min-width: 768px) {
            .um-search-container {
                align-self: flex-start;
            }
        }

        .um-search-input-wrapper {
          position: relative;
        }

        .um-search-input {
          width: 100%;
          padding-left: 2.5rem;
          padding-right: 1rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border: 1px solid var(--search-border);
          border-radius: 0.5rem;
          transition: border-color 150ms, box-shadow 150ms;
          outline: none;
          background-color: var(--bg-card);
          color: var(--text-primary);
        }

        .um-search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .um-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--search-icon);
        }

        /* User Table */
        .um-table-wrapper {
          overflow-x: auto;
          border-radius: 0.5rem;
          box-shadow: inset 0 2px 4px 0 var(--shadow-color-1);
          border: 1px solid var(--border-color);
          max-height: 400px; /* Added max-height */
          overflow-y: auto;  /* Added vertical scroll */
        }

        .um-table {
          min-width: 100%;
          border-collapse: collapse;
        }

        .um-table-thead {
          background-color: var(--table-header-bg);
          position: sticky; /* Make header sticky */
          top: 0; /* Stick to the top of its scrolling container */
          z-index: 1; /* Ensure it's above scrolling content */
        }

        .um-table-th {
          padding: 0.75rem 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .um-table-tbody {
          background-color: var(--bg-card);
        }

        .um-table-tr {
          border-bottom: 1px solid var(--border-color);
        }
        .um-table-tr:last-child {
            border-bottom: none;
        }

        .um-table-td {
          padding: 1rem 1.5rem;
          white-space: nowrap;
          vertical-align: top;
        }

        .um-cell-responsive {
            white-space: normal;
        }

        @media (max-width: 768px) {
          .um-table-td {
            white-space: normal;
          }
        }

        .um-employee-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--table-text-strong);
        }

        .um-employee-email {
          font-size: 0.875rem;
          color: var(--table-text-normal);
        }

        /* Designation Tags (for users table) */
        .um-designation-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .um-designation-tag {
          padding: 0.125rem 0.5rem;
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 600;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .um-tag-admin {
          background-color: var(--tag-admin-bg);
          color: var(--tag-admin-text);
        }
        .um-tag-job-application-specialist {
          background-color: var(--tag-job-application-specialist-bg);
          color: var(--tag-job-application-specialist-text);
        }
        .um-tag-manager {
          background-color: var(--tag-manager-bg);
          color: var(--tag-manager-text);
        }
        .um-tag-asset-manager {
          background-color: var(--tag-asset-manager-bg);
          color: var(--tag-asset-manager-text);
        }
        .um-tag-team-lead {
          background-color: var(--tag-team-lead-bg);
          color: var(--tag-team-lead-text);
        }
        .um-tag-default {
            background-color: var(--tag-default-bg);
            color: var(--tag-default-text);
        }

        /* Status Tags (for users table) */
        .um-status-container {
            display: inline-block;
        }
        .um-status-tag {
          padding: 0.125rem 0.5rem;
          display: inline-flex;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 600;
          border-radius: 9999px;
        }

        .um-status-active {
          background-color: var(--status-active-bg);
          color: var(--status-active-text);
        }

        .um-status-inactive {
          background-color: var(--status-inactive-bg);
          color: var(--status-inactive-text);
        }

        /* Action Buttons */
        .um-action-buttons {
          display: flex;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .um-action-btn-wrapper {
            position: relative;
            display: inline-block;
            flex-shrink: 0;
        }

        .um-action-btn {
          padding: 0.5rem;
          border-radius: 9999px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 150ms, color 150ms;
        }

        .um-action-btn:hover {
          background-color: var(--action-hover-bg);
        }

        .um-action-btn-blue {
          color: #2563eb;
        }

        .um-action-btn-blue:hover {
          color: #1e40af;
        }

        .um-action-btn-yellow {
          color: var(--action-yellow);
        }

        .um-action-btn-yellow:hover {
          color: var(--action-yellow-hover);
        }

        .um-action-btn-red {
          color: var(--action-red);
        }

        .um-action-btn-red:hover {
          color: var(--action-red-hover);
        }

        .um-action-btn-green {
          color: var(--action-green);
        }

        .um-action-btn-green:hover {
          color: var(--action-green-hover);
        }

        /* Tooltip Styles */
        .um-tooltip {
            position: absolute;
            background-color: var(--tooltip-bg);
            color: var(--tooltip-text-color);
            padding: 0.3rem 0.6rem;
            border-radius: 0.3rem;
            font-size: 0.75rem;
            white-space: nowrap;
            z-index: 100;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.9;
            pointer-events: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: opacity 0.2s ease-in-out;
        }

        .um-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: var(--tooltip-bg) transparent transparent transparent;
        }


        /* Modal Styles */
        .um-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--modal-overlay-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }

        .um-modal-content {
          background-color: var(--modal-bg);
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px var(--shadow-color-2), 0 10px 10px -5px var(--shadow-color-3);
          width: 100%;
          max-width: 32rem;
          padding: 1.5rem;
          position: relative;
          display: flex; /* Make content a flex container */
          flex-direction: column; /* Stack children vertically */
        }

        .um-modal-close-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          color: var(--text-secondary);
          transition: color 150ms;
          font-size: 1.5rem;
          cursor: pointer;
          background: none;
          border: none;
        }

        .um-modal-close-btn:hover {
          color: var(--text-primary);
        }

        .um-modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--modal-title-color);
          margin-bottom: 0.5rem; /* Reduced margin for subtitle */
        }

        .um-modal-subtitle { /* New style for modal subtitle */
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }


        /* New: Scrollable body for form fields */
        .um-modal-body-scrollable {
          flex-grow: 1; /* Allows it to take available space */
          max-height: 400px; /* Set a max height for the scrollable area */
          overflow-y: auto; /* Enable vertical scrolling */
          padding-right: 0.5rem; /* Space for scrollbar */
          padding-bottom: 0.5rem; /* Little padding at the bottom inside scroll */
          margin-bottom: 1.5rem; /* Space between scrollable area and actions */
        }

        /* New: Wrapper for form groups inside the scrollable area */
        .um-modal-form-fields-group {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* Spacing between form groups */
        }

        /* The form itself acts as a container for scrollable body and actions */
        .um-modal-form {
          display: flex;
          flex-direction: column;
          /* Gap is now primarily for spacing between .um-modal-body-scrollable and .um-modal-form-actions */
          /* Removed direct gap to be applied within .um-modal-form-fields-group */
          /* No gap needed here as margin-bottom on scrollable takes care of it */
        }

        .um-modal-form-group {
          margin-bottom: 0; /* Reset previous margin, handled by gap in .um-modal-form-fields-group */
        }

        .um-modal-label {
          display: block;
          color: var(--modal-label-color);
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .um-modal-input, .um-modal-select, .um-modal-textarea {
          box-shadow: 0 1px 2px 0 var(--shadow-color-1);
          appearance: none;
          border: 1px solid var(--modal-input-border);
          border-radius: 0.25rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          color: var(--modal-input-color);
          line-height: 1.25;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
          background-color: var(--bg-card);
        }

        .um-modal-input:focus, .um-modal-select:focus, .um-modal-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
        .um-modal-textarea {
            min-height: 5rem;
            resize: vertical;
        }

        .um-modal-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          flex-shrink: 0; /* Prevent actions from shrinking */
        }

        .um-modal-cancel-btn {
          padding: 0.5rem 1.5rem;
          border: 1px solid var(--modal-cancel-border);
          color: var(--modal-label-color);
          border-radius: 0.5rem;
          background-color: var(--modal-cancel-bg);
          transition: background-color 150ms;
          cursor: pointer;
        }

        .um-modal-cancel-btn:hover {
          background-color: var(--modal-cancel-hover-bg);
        }

        .um-modal-save-btn {
          padding: 0.5rem 1.5rem;
          background-color: var(--add-btn-bg);
          color: #ffffff;
          border-radius: 0.5rem;
          transition: background-color 150ms;
          cursor: pointer;
          border: none;
        }

        .um-modal-save-btn:hover {
          background-color: var(--add-btn-hover-bg);
        }

        /* Specific styles for checkbox groups */
        .um-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem; /* Spacing between checkboxes */
            margin-top: 0.5rem; /* Space between label and first checkbox */
        }

        .um-checkbox-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-primary); /* Color for checkbox label text */
            font-size: 0.875rem;
        }
        .um-checkbox-item input[type="checkbox"] {
            width: 1.15rem;
            height: 1.15rem;
            accent-color: #2563eb; /* Blue checkbox color */
            border: 1px solid var(--modal-input-border);
            border-radius: 0.25rem;
            cursor: pointer;
            flex-shrink: 0; /* Prevent checkbox from shrinking */
        }

        /* Confirm/Alert Modal specific (reused styles) */
        .um-confirm-modal-content {
            max-width: 24rem;
            text-align: center;
        }
        .um-confirm-modal-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--modal-title-color);
        }
        .um-confirm-modal-message {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        .um-confirm-modal-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        .um-confirm-modal-deactivate-btn, .um-confirm-delete-btn {
            background-color: var(--modal-confirm-red-bg);
            color: #ffffff;
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            transition: background-color 150ms;
            border: none;
            cursor: pointer;
        }
        .um-confirm-modal-deactivate-btn:hover, .um-confirm-delete-btn:hover {
            background-color: var(--modal-confirm-red-hover-bg);
        }
        .um-confirm-modal-activate-btn {
            background-color: var(--modal-confirm-green-bg);
            color: #ffffff;
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            transition: background-color 150ms;
            border: none;
            cursor: pointer;
        }
        .um-confirm-modal-activate-btn:hover {
            background-color: var(--modal-confirm-green-hover-bg);
        }

        /* Styles for Company Designations Section */
        .designations-grid {
          display: grid;
          grid-template-columns: 1fr; /* Default to single column on small screens */
          gap: 1.5rem;
          padding-top: 1rem;
        }

        @media (min-width: 768px) { /* On medium screens, two columns */
          .designations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) { /* On large screens, three columns */
          .designations-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .designation-card {
          background-color: var(--bg-card);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .designation-header {
          display: flex;
          align-items: flex-start; /* Align items to the start to make tags float right */
          justify-content: space-between; /* Space between name/icon and tags */
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .designation-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .designation-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .designation-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex-grow: 1; /* Allows description to take up available space */
        }

        .designation-stats {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          align-items: center; /* Vertically align stat items */
        }

        .designation-stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem; /* Increased gap for icon and text */
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .designation-stat-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .designation-card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem; /* Space between manage and delete */
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .designation-manage-btn {
          padding: 0.6rem 1.2rem;
          background-color: var(--bg-card); /* White background */
          border: 1px solid var(--border-color); /* Border */
          border-radius: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 150ms, border-color 150ms;
          display: flex;
          align-items: center;
          justify-content: center; /* Center text and icon */
          gap: 0.5rem;
          flex-grow: 1; /* Allow manage button to grow */
        }

        .designation-manage-btn:hover {
          background-color: var(--bg-nav-link-hover);
          border-color: var(--text-secondary);
        }

        /* Updated styles for the delete button to match the image */
        .designation-delete-btn {
          background-color: var(--bg-card); /* White background */
          border: 1px solid var(--border-color); /* Border */
          color: var(--action-red); /* Red icon color */
          font-size: 1.125rem; /* Icon size */
          cursor: pointer;
          padding: 0.6rem 0.8rem; /* Adjusted padding to make it a small rectangle */
          border-radius: 0.5rem; /* Rounded corners for rectangular shape */
          transition: background-color 150ms, border-color 150ms;
          display: flex; /* Use flex to center the icon */
          align-items: center;
          justify-content: center;
          flex-shrink: 0; /* Prevent button from stretching */
        }

        .designation-delete-btn:hover {
          background-color: var(--action-hover-bg);
          border-color: var(--action-red); /* Border color changes on hover for emphasis */
        }

        /* Security Group Modal specific styles - REINTRODUCED */
        .um-security-group-tab-nav {
            display: flex;
            border-bottom: 1px solid var(--tab-border);
            margin-bottom: 1rem;
        }

        .um-security-group-tab-btn {
            padding: 0.75rem 1rem;
            background-color: var(--tab-bg);
            color: var(--tab-text);
            border: 1px solid var(--tab-border);
            border-bottom: none;
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 150ms, color 150ms;
            margin-right: 0.25rem; /* Space between tabs */
        }

        .um-security-group-tab-btn:last-child {
            margin-right: 0;
        }

        .um-security-group-tab-btn.um-tab-active {
            background-color: var(--tab-active-bg);
            color: var(--tab-active-text);
            border-color: var(--tab-active-bg);
            transform: translateY(1px); /* Visually connect to the content area */
            z-index: 1; /* Bring active tab to front */
        }

        .um-security-group-permissions-content {
            border: 1px solid var(--tab-border);
            border-top-right-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            padding: 1rem;
            background-color: var(--bg-card);
            min-height: 10rem; /* Reduced height for scrollability */
            overflow-y: auto;
        }

        .um-permission-item {
            display: flex;
            align-items: flex-start;
            padding: 0.75rem 0.5rem;
            border-bottom: 1px solid var(--permission-border-bottom);
            transition: background-color 150ms;
        }
        .um-permission-item:last-child {
            border-bottom: none;
        }
        .um-permission-item:hover {
            background-color: var(--permission-item-bg-hover);
        }

        .um-permission-checkbox-wrapper {
            margin-right: 0.75rem;
            padding-top: 0.1rem;
        }

        .um-permission-checkbox {
            width: 1.125rem;
            height: 1.125rem;
            accent-color: #2563eb;
            cursor: pointer;
            border-radius: 0.25rem;
            border: 1px solid var(--modal-input-border);
        }
        .um-permission-checkbox:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }

        .um-permission-details {
            flex-grow: 1;
        }

        .um-permission-name {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.9rem;
            margin-bottom: 0.2rem;
        }

        .um-permission-description {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.4;
        }
        `}
      </style>

      {/* Top Navigation Bar */}
      <header className="um-header">
        <div className="um-header-left">
          <div className="um-logo">
            <span>Tech</span>
            <span className="um-logo-x">X</span>
            <span>plorers</span>
          </div>
          <nav className="um-nav-menu">
            <a
              href="#"
              onClick={() => setCurrentView('userManagement')}
              className={`um-nav-link ${currentView === 'userManagement' ? 'um-nav-link-active' : ''}`}
            >
              User Management
            </a>
            <a
              href="#"
              onClick={() => setCurrentView('workGroups')}
              className={`um-nav-link ${currentView === 'workGroups' ? 'um-nav-link-active' : ''}`}
            >
              Work Groups
            </a>
            <a href="#" className="um-nav-link">
              Settings
            </a>
          </nav>
        </div>

        <div className="um-header-right">
          <FaSearch className="um-icon-btn" />
          <div className="um-notification-icon">
            <FaBell className="um-icon-btn" />
            <span className="um-notification-badge">3</span>
          </div>
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="um-icon-btn"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="um-user-info">
            <div className="um-user-info-text">
              <p className="um-user-name">{adminUserName}</p>
              <p className="um-user-email">{adminUserEmail}</p>
            </div>
            <div className="um-initials-avatar">
              <span className="um-initials-text">{adminInitials}</span>
            </div>
          </div>
        </div>

        <button
          className="um-hamburger-menu"
          onClick={toggleSidebar}
        >
          <FaBars className="um-hamburger-icon" />
        </button>
      </header>

      {/* Sidebar for Mobile */}
      <div
        className={`um-sidebar ${isSidebarOpen ? 'um-sidebar-open' : ''}`}
      >
        <button
          className="um-sidebar-close-btn"
          onClick={toggleSidebar}
        >
          &times;
        </button>
        <nav className="um-sidebar-nav">
          <a
            href="#"
            onClick={() => setCurrentView('userManagement')}
            className={`um-nav-link ${currentView === 'userManagement' ? 'um-nav-link-active' : ''}`}
          >
            User Management
          </a>
          <a
            href="#"
            onClick={() => setCurrentView('workGroups')}
            className={`um-nav-link ${currentView === 'workGroups' ? 'um-nav-link-active' : ''}`}
          >
            Work Groups
          </a>
          <a href="#" className="um-nav-link">
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content Area - Conditional Rendering */}
      <main className="um-main-content">
        <div className="um-content-wrapper">
          {currentView === 'userManagement' && (
            <>
              <div className="um-header-section">
                <div>
                  <h1 className="um-title">User Management</h1>
                  <p className="um-subtitle">Manage user accounts and designation assignments</p>
                </div>
                <button
                  onClick={openAddUserModal}
                  className="um-add-btn"
                >
                  <FaPlus />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Employee Directory Section */}
              <div className="um-employee-directory-card">
                <div className="um-employee-directory-header-row">
                    <div className="um-directory-text-content">
                        <h2 className="um-section-heading">Employee Directory</h2>
                        <p className="um-section-description">Manage employee accounts and their role designations</p>
                    </div>

                    <div className="um-search-container">
                        <div className="um-search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search users, departments, or designations..."
                                className="um-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="um-search-icon" />
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="um-table-wrapper">
                  <table className="um-table">
                    <thead className="um-table-thead">
                      <tr>
                        <th scope="col" className="um-table-th">
                          Employee
                        </th>
                        <th scope="col" className="um-table-th">
                          Department
                        </th>
                        <th scope="col" className="um-table-th">
                          Designations
                        </th>
                        <th scope="col" className="um-table-th">
                          Status
                        </th>
                        <th scope="col" className="um-table-th">
                          Last Login
                        </th>
                        <th scope="col" className="um-table-th">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="um-table-tbody">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="um-table-tr">
                            <td className="um-table-td um-cell-responsive">
                              <div className="um-employee-name">{user.name}</div>
                              <div className="um-employee-email">{user.email}</div>
                            </td>
                            <td className="um-table-td um-cell-responsive">
                              <div className="um-employee-name">{user.department}</div>
                            </td>
                            <td className="um-table-td um-cell-responsive">
                              <div className="um-designation-container">
                                {user.designations.map((designation, index) => (
                                  <span key={index} className={`um-designation-tag ${
                                    designation === 'ADMIN' ? 'um-tag-admin' :
                                    designation === 'JOB APPLICATION SPECIALIST' ? 'um-tag-job-application-specialist' :
                                    designation === 'MANAGER' ? 'um-tag-manager' :
                                    designation === 'ASSET MANAGER' ? 'um-tag-asset-manager' :
                                    designation === 'TEAM LEAD' ? 'um-tag-team-lead' :
                                    'um-tag-default'
                                  }`}>
                                    {designation}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="um-table-td um-cell-responsive">
                              {/* Original Status Tag */}
                              <div className="um-status-container">
                                <span className={`um-status-tag ${user.status === 'active' ? 'um-status-active' : 'um-status-inactive'}`}>
                                  {user.status}
                                </span>
                              </div>
                            </td>
                            <td className="um-table-td um-cell-responsive">
                              <div className="um-employee-name">{user.lastLogin}</div>
                            </td>
                            <td className="um-table-td um-cell-responsive">
                              <div className="um-action-buttons">
                                {/* Edit Button with Custom Tooltip */}
                                <div
                                  className="um-action-btn-wrapper"
                                  onMouseEnter={() => setHoveredTooltipId(`${user.id}-edit`)}
                                  onMouseLeave={() => setHoveredTooltipId(null)}
                                >
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="um-action-btn um-action-btn-yellow"
                                    aria-label="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <Tooltip text="Edit" tooltipId={`${user.id}-edit`} currentHoveredTooltipId={hoveredTooltipId} />
                                </div>

                                {/* Delete Button with Custom Tooltip */}
                                <div
                                  className="um-action-btn-wrapper"
                                  onMouseEnter={() => setHoveredTooltipId(`${user.id}-delete`)}
                                  onMouseLeave={() => setHoveredTooltipId(null)}
                                >
                                  <button
                                    onClick={() => handleDeleteUserClick(user)}
                                    className="um-action-btn um-action-btn-red"
                                    aria-label="Delete"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                  <Tooltip text="Delete" tooltipId={`${user.id}-delete`} currentHoveredTooltipId={hoveredTooltipId} />
                                </div>

                                {/* Status Toggle Button (back to original icon button) with Custom Tooltip */}
                                <div
                                  className="um-action-btn-wrapper"
                                  onMouseEnter={() => setHoveredTooltipId(`${user.id}-status`)}
                                  onMouseLeave={() => setHoveredTooltipId(null)}
                                >
                                  <button
                                    onClick={() => openConfirmModal(user)}
                                    className={`um-action-btn ${user.status === 'active' ? 'um-action-btn-red' : 'um-action-btn-green'}`}
                                    aria-label={user.status === 'active' ? 'Inactivate' : 'Activate'}
                                  >
                                    {user.status === 'active' ? <FaTimesCircle /> : <FaCheckCircle />}
                                  </button>
                                  <Tooltip text={user.status === 'active' ? 'Inactivate User' : 'Activate User'} tooltipId={`${user.id}-status`} currentHoveredTooltipId={hoveredTooltipId} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="um-table-tr">
                          <td colSpan="6" className="um-table-td um-cell-responsive" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No users found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {currentView === 'workGroups' && (
            <>
              <div className="um-header-section">
                <div>
                  <h1 className="um-title">Company Designations</h1>
                  <p className="um-subtitle">Manage role designations and their system permissions</p>
                </div>
                {/* Button text changed to "Create Work Group" */}
                <button
                  onClick={openCreateSecurityGroupModal}
                  className="um-add-btn"
                >
                  <FaPlus />
                  <span>Create Work Group</span> {/* Changed button text */}
                </button>
              </div>

              <div className="designations-grid">
                {designations.map((designation) => (
                  <div key={designation.id} className="designation-card">
                    <div className="designation-header">
                      <div className="designation-title-group">
                        <FaShieldAlt style={{ color: 'var(--icon-color)', fontSize: '1.25rem' }} /> {/* Shield Icon */}
                        <h3 className="designation-name">{designation.name}</h3>
                      </div>
                      {/* Removed designation-tags-group div that contained type tags */}
                    </div>
                    <p className="designation-description">{designation.description}</p>
                    <div className="designation-stats">
                      <div className="designation-stat-item">
                        <FaUsers style={{color: 'var(--text-secondary)'}} /> {designation.employees} <span className="designation-stat-value">employees</span>
                      </div>
                      <div className="designation-stat-item">
                        <FaCog style={{color: 'var(--text-secondary)'}} /> {designation.permissions} <span className="designation-stat-value">permissions</span>
                      </div>
                    </div>
                    {/* Removed Key Permissions Section */}
                    <div className="designation-card-actions">
                      <button className="designation-manage-btn">
                        <FaEdit /> Manage
                      </button>
                      {/* Delete button now rendered for all designations, without the 'deletable' condition */}
                      <button
                        onClick={() => handleDeleteDesignation(designation)}
                        className="designation-delete-btn"
                        aria-label={`Delete ${designation.name}`}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add/Edit User Modal */}
      {isAddUserModalOpen && (
        <div className="um-modal-overlay">
          <div className="um-modal-content">
            <button
              onClick={closeAddUserModal}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-modal-title">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <p className="um-modal-subtitle">
              Create a new user account with designation assignment
            </p> {/* New Subtitle */}
            <form onSubmit={saveUser} className="um-modal-form">
              <div className="um-modal-body-scrollable"> {/* New: Scrollable area for form fields */}
                <div className="um-modal-form-fields-group"> {/* New: Group to apply gap to fields */}
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleNewUserChange}
                      className="um-modal-input"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      className="um-modal-input"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="department">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={newUser.department}
                      onChange={handleNewUserChange}
                      className="um-modal-select"
                      required
                    >
                      <option value="">Select Department</option>
                      {/* You would dynamically load departments here */}
                      <option value="IT Administration">IT Administration</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Operations">Operations</option>
                      <option value="Asset Management">Asset Management</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Finance">Finance</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label">
                      Designations
                    </label>
                    <div className="um-checkbox-group">
                      {designations.map((designation) => (
                        <div key={designation.id} className="um-checkbox-item">
                          <input
                            type="checkbox"
                            id={`designation-${designation.id}`}
                            name="designations"
                            value={designation.name}
                            checked={newUser.designations.includes(designation.name)}
                            onChange={() => handleDesignationCheckboxChange(designation.name)}
                          />
                          <label htmlFor={`designation-${designation.id}`}>
                            {designation.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Status field is always visible, but lastLogin is removed */}
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newUser.status}
                      onChange={handleNewUserChange}
                      className="um-modal-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="um-modal-form-actions">
                <button
                  type="button"
                  onClick={closeAddUserModal}
                  className="um-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="um-modal-save-btn"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Status Change Modal */}
      {isConfirmModalForStatus && userToToggleStatus && (
        <div className="um-modal-overlay">
          <div className="um-modal-content um-confirm-modal-content">
            <button
              onClick={closeConfirmModal}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-confirm-modal-title">
              Confirm {userToToggleStatus.status === 'active' ? 'Inactivation' : 'Activation'}
            </h3>
            <p className="um-confirm-modal-message">
              Are you sure you want to {userToToggleStatus.status === 'active' ? 'inactivate' : 'activate'} {userToToggleStatus.name}?
            </p>
            <div className="um-confirm-modal-actions">
              <button
                onClick={closeConfirmModal}
                className="um-modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className={userToToggleStatus.status === 'active' ? 'um-confirm-modal-deactivate-btn' : 'um-confirm-modal-activate-btn'}
              >
                {userToToggleStatus.status === 'active' ? 'Inactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && userToDelete && (
        <div className="um-modal-overlay">
          <div className="um-modal-content um-confirm-modal-content">
            <button
              onClick={cancelDeleteUser}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-confirm-modal-title">Confirm Deletion</h3>
            <p className="um-confirm-modal-message">
              Are you sure you want to delete user "{userToDelete.name}"? This action cannot be undone.
            </p>
            <div className="um-confirm-modal-actions">
              <button
                onClick={cancelDeleteUser}
                className="um-modal-cancel-btn"
                >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="um-confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Work Group Modal */}
      {isCreateSecurityGroupModalOpen && (
        <div className="um-modal-overlay">
          <div className="um-modal-content">
            <button
              onClick={closeCreateSecurityGroupModal}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-modal-title">Create New Work Group</h3> {/* Changed title */}
            <p className="um-modal-subtitle">Define a new work group with specific permissions</p> {/* New subtitle */}
            <form onSubmit={handleCreateSecurityGroupSubmit} className="um-modal-form">
              <div className="um-modal-body-scrollable"> {/* Scrollable body for form fields */}
                <div className="um-modal-form-fields-group"> {/* Group to apply gap to fields */}
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="securityGroupName">
                      Security Group Name
                    </label>
                    <input
                      type="text"
                      id="securityGroupName"
                      name="name"
                      value={newSecurityGroup.name}
                      onChange={handleSecurityGroupInputChange}
                      className="um-modal-input"
                      placeholder="Security Group Name"
                      required
                    />
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="securityGroupDescription">
                      Description
                    </label>
                    <textarea
                      id="securityGroupDescription"
                      name="description"
                      value={newSecurityGroup.description}
                      onChange={handleSecurityGroupInputChange}
                      className="um-modal-textarea"
                      placeholder="Description"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Permissions Section - Tabbed */}
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" style={{marginBottom: '0'}}>
                      Permissions
                    </label>
                    <div className="um-security-group-tab-nav">
                      {Object.keys(permissionsData).map(tabName => (
                        <button
                          key={tabName}
                          type="button"
                          className={`um-security-group-tab-btn ${currentPermissionTab === tabName ? 'um-tab-active' : ''}`}
                          onClick={() => setCurrentPermissionTab(tabName)}
                        >
                          {tabName}
                        </button>
                      ))}
                    </div>
                    <div className="um-security-group-permissions-content">
                      {permissionsData[currentPermissionTab].map(permission => (
                        <div key={permission.id} className="um-permission-item">
                          <div className="um-permission-checkbox-wrapper">
                            <input
                              type="checkbox"
                              id={`permission-${permission.id}`}
                              className="um-permission-checkbox"
                              checked={newSecurityGroup.permissions.includes(permission.id)}
                              onChange={() => handlePermissionCheckboxChange(permission.id)}
                            />
                          </div>
                          <div className="um-permission-details">
                            <label htmlFor={`permission-${permission.id}`} className="um-permission-name">
                              {permission.name}
                            </label>
                            <p className="um-permission-description">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> {/* End um-modal-form-fields-group */}
              </div> {/* End um-modal-body-scrollable */}
              <div className="um-modal-form-actions">
                <button
                  type="button"
                  onClick={closeCreateSecurityGroupModal}
                  className="um-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="um-modal-save-btn"
                >
                  Create Work Group
                </button> {/* Changed button text */}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkGroups;
