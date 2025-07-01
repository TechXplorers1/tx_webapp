import React, { useState, useEffect } from 'react';
import {
  FaBars, FaSearch, FaBell, FaEdit, FaTrashAlt, FaPlus, FaShieldAlt, FaUsers, FaCog, FaUser, FaUserPlus, FaUserMinus
} from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi'; // Import FiSun and FiMoon
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

// ToggleButton Component
const ToggleButton = ({ checked, onChange, ariaLabel }) => {
  return (
    <label className="um-toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className="um-slider"></span>
    </label>
  );
};

const WorkGroups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // For user deletion
  const [isDeleteDesignationConfirmModalOpen, setIsDeleteDesignationConfirmModalOpen] = useState(false); // For designation deletion
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('userManagement');
  const [isCreateSecurityGroupModalOpen, setIsCreateSecurityGroupModalOpen] = useState(false);
  const [isManageSecurityGroupModalOpen, setIsManageSecurityGroupModalOpen] = useState(false); // New state for manage modal
  const [selectedDesignationForManage, setSelectedDesignationForManage] = useState(null); // Stores the designation object being managed

  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null); // For user deletion
  const [designationToDelete, setDesignationToDelete] = useState(null); // For designation deletion

  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    designations: [], // Reverted to array
    status: 'active',
  });

  const [newSecurityGroup, setNewSecurityGroup] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [currentPermissionTab, setCurrentPermissionTab] = useState('Administration');

  // State for search within the manage users modal
  const [manageUsersSearchTerm, setManageUsersSearchTerm] = useState('');

  // State to manage visibility of permissions in Manage Security Group modal
  // Each key corresponds to a permission category, value is the number of visible items
  const [visiblePermissionCounts, setVisiblePermissionCounts] = useState({
    Administration: 5,
    Asset: 5,
    Work: 5,
    Inventory: 5,
  });


  const permissionsData = {
    Administration: [
      { id: 'sys-config', name: 'System Configuration', description: 'Configure system settings' },
      { id: 'user-admin', name: 'User Administration', description: 'Manage user accounts' },
      { id: 'security-mgmt', name: 'Security Management', description: 'Manage security settings' },
      { id: 'backup-recovery', name: 'Backup & Recovery', description: 'System backup and recovery' },
      { id: 'sys-audit', name: 'System Audit', description: 'Access system audit logs' }, // Added from image
      { id: 'sys-logs', name: 'System Logs', description: 'View and manage system logs' },
      { id: 'app-deploy', name: 'Application Deployment', description: 'Deploy and manage applications' },
      { id: 'db-access', name: 'Database Access', description: 'Direct database access' },
    ],
    Asset: [
      { id: 'asset-view', name: 'Asset View', description: 'View asset information' }, // Updated description
      { id: 'asset-edit', name: 'Asset Edit', description: 'Modify asset details' }, // Updated description
      { id: 'asset-create', name: 'Asset Create', description: 'Create new assets' }, // Updated description
      { id: 'asset-delete', name: 'Asset Delete', description: 'Delete assets' }, // Updated description
      { id: 'asset-approve', name: 'Asset Approval', description: 'Approve asset changes' }, // Added from image
      { id: 'asset-track', name: 'Asset Tracking', description: 'Track asset locations and status' },
      { id: 'asset-audit', name: 'Asset Audit', description: 'Conduct asset audits' },
    ],
    Work: [
      { id: 'wo-create', name: 'Work Order Create', description: 'Create new work orders' },
      { id: 'wo-assign', name: 'Work Order Assign', description: 'Assign work orders to personnel' },
      { id: 'wo-approve', name: 'Work Order Approve', description: 'Approve or reject work orders' },
      { id: 'wo-track', name: 'Work Order Track', description: 'Track work order progress' },
      { id: 'wo-close', name: 'Work Order Close', description: 'Close completed work orders' },
      { id: 'wo-report', name: 'Work Order Reporting', description: 'Generate reports on work orders' },
    ],
    Inventory: [
      { id: 'inv-view', name: 'Inventory View', description: 'View inventory levels' },
      { id: 'inv-adjust', name: 'Inventory Adjust', description: 'Adjust inventory counts' },
      { id: 'inv-transfer', name: 'Inventory Transfer', description: 'Transfer inventory between locations' },
      { id: 'inv-order', name: 'Inventory Order', description: 'Place new inventory orders' },
      { id: 'inv-receive', name: 'Inventory Receive', description: 'Receive new inventory shipments' },
      { id: 'inv-dispose', name: 'Inventory Dispose', description: 'Dispose of old or damaged inventory' },
    ],
  };

  // New state for the active tab inside the Manage Security Group modal
  const [currentManageSecurityGroupTab, setCurrentManageSecurityGroupTab] = useState('Permissions');

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

  const [designations, setDesignations] = useState([
    {
      id: 1,
      name: 'ADMIN',
      type: 'core',
      secondaryType: 'executive',
      description: 'Full system administration and configuration privileges',
      employees: 1,
      permissions: Object.keys(permissionsData).reduce((acc, curr) => acc + permissionsData[curr].length, 0), // Count all permissions
      keyPermissions: ['SYS CONFIG', 'USER ADMIN', 'SECURITY MGMT', '+ countless more'],
      permissionIds: [ // All permissions for ADMIN
        'sys-config', 'user-admin', 'security-mgmt', 'backup-recovery', 'sys-audit', 'sys-logs', 'app-deploy', 'db-access',
        'asset-view', 'asset-edit', 'asset-create', 'asset-delete', 'asset-approve', 'asset-track', 'asset-audit',
        'wo-create', 'wo-assign', 'wo-approve', 'wo-track', 'wo-close', 'wo-report',
        'inv-view', 'inv-adjust', 'inv-transfer', 'inv-order', 'inv-receive', 'inv-dispose'
      ],
      deletable: false,
      settingField1: '1000000', // Example setting for Admin
      settingField2: 'ABCDEFGH' // Example setting for Admin
    },
    {
      id: 2,
      name: 'MANAGER',
      type: 'core',
      description: 'Management level access with approval and oversight capabilities',
      employees: 4, // Corrected from 3 to 4 based on actual user data
      permissions: 13, // This number needs to match the permissionIds array length
      keyPermissions: ['ASSET APPROVE', 'ASSET TRANSFER', 'WO APPROVE', '+10 more'],
      permissionIds: [ // Example 13 permissions for MANAGER
        'asset-view', 'asset-edit', 'asset-approve', 'asset-track',
        'wo-create', 'wo-assign', 'wo-approve', 'wo-track',
        'inv-view', 'inv-adjust', 'inv-transfer',
        'sys-audit', 'user-admin' // Example for 13
      ],
      deletable: false,
      settingField1: '2000000',
      settingField2: 'IJKLMNOP'
    },
    {
      id: 3,
      name: 'ASSET MANAGER',
      type: 'specialized',
      description: 'Comprehensive asset lifecycle and inventory management',
      employees: 2,
      permissions: 15,
      keyPermissions: ['ASSET VIEW', 'ASSET EDIT', 'ASSET CREATE', '+12 more'],
      permissionIds: [
        'asset-view', 'asset-edit', 'asset-create', 'asset-delete', 'asset-approve', 'asset-track', 'asset-audit',
        'inv-view', 'inv-adjust', 'inv-transfer', 'inv-order', 'inv-receive', 'inv-dispose',
        'wo-create', 'wo-track'
      ],
      deletable: true,
      settingField1: '3000000',
      settingField2: 'QRSTUVWX'
    },
    {
      id: 4,
      name: 'TEAM LEAD',
      type: 'core',
      description: 'Team leadership with specialist coordination and task assignment',
      employees: 3,
      permissions: 13,
      keyPermissions: ['TEAM VIEW', 'TEAM ASSIGN', 'TEAM SCHEDULE', '+10 more'],
      permissionIds: [
        'user-admin', 'sys-audit',
        'wo-create', 'wo-assign', 'wo-track', 'wo-report',
        'asset-view', 'asset-track',
        'inv-view', 'inv-adjust', 'inv-order',
        'app-deploy', 'db-access'
      ],
      deletable: false,
      settingField1: '4000000',
      settingField2: 'YZABCDEF'
    },
    {
      id: 5,
      name: 'JOB APPLICATION SPECIALIST',
      type: 'specialized',
      description: 'HR recruitment and employee onboarding system access',
      employees: 2,
      permissions: 8,
      keyPermissions: ['HR CANDIDATE', 'HR ONBOARD', 'HR ACCESS', '+5 more'],
      permissionIds: [ // Example 8 permissions
        'user-admin', 'sys-audit', // For user administration oversight related to HR
        'wo-report', // Maybe for tracking HR related work orders
        'asset-view', // To view employee assets if needed
        'inv-view', // To view general inventory if relevant
        'sys-logs', // To check HR system logs
        'app-deploy', 'db-access' // Assuming they might need specific system access for HR apps
      ],
      deletable: true,
      settingField1: '5000000',
      settingField2: 'GHIJKLMN'
    },
  ]);


  const adminUserName = "Admin User";
  const adminUserEmail = "administrator@company.com";

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

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
      designations: [], // Reverted to empty array for new user
      status: 'active',
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

  // Reverted to original handleDesignationCheckboxChange
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
      setUsers([...users, { ...newUser, id: newId, lastLogin: 'N/A' }]);
      toast.success(`User ${newUser.name} added successfully!`);
    }
    closeAddUserModal();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      department: user.department,
      designations: Array.isArray(user.designations) ? user.designations : [], // Keep as array
      status: user.status,
      lastLogin: user.lastLogin,
    });
    setIsAddUserModalOpen(true);
  };

  // New function for direct status toggle
  const handleStatusToggle = (userToUpdate) => {
    setUsers(users.map(user =>
      user.id === userToUpdate.id
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast.success(`User ${userToUpdate.name} status changed to ${userToUpdate.status === 'active' ? 'inactive' : 'active'}!`);
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

  const handleDeleteDesignation = (designation) => {
    setDesignationToDelete(designation);
    setIsDeleteDesignationConfirmModalOpen(true);
  };

  const confirmDeleteDesignation = () => {
    if (designationToDelete) {
      setDesignations(designations.filter(d => d.id !== designationToDelete.id));
      toast.success(`Designation '${designationToDelete.name}' deleted successfully!`);
      setIsDeleteDesignationConfirmModalOpen(false);
      setDesignationToDelete(null);
    }
  };

  const cancelDeleteDesignation = () => {
    setIsDeleteDesignationConfirmModalOpen(false);
    setDesignationToDelete(null);
  };

  const openCreateSecurityGroupModal = () => {
    setNewSecurityGroup({ name: '', description: '', permissions: [] });
    setCurrentPermissionTab('Administration');
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

    const newId = designations.length > 0 ? Math.max(...designations.map(d => d.id)) + 1 : 1;

    // Aggregate all permissions by ID for easy lookup
    const allPermissionsById = {};
    for (const category in permissionsData) {
        permissionsData[category].forEach(p => {
            allPermissionsById[p.id] = p.name;
        });
    }

    const selectedPermissionNames = newSecurityGroup.permissions.map(id => allPermissionsById[id] || id);

    const keyPermissionsDisplay = selectedPermissionNames.slice(0, 3);
    if (selectedPermissionNames.length > 3) {
      keyPermissionsDisplay.push(`+${selectedPermissionNames.length - 3} more`);
    }

    const newDesignation = {
      id: newId,
      name: newSecurityGroup.name.toUpperCase(),
      type: 'custom',
      secondaryType: 'n/a',
      description: newSecurityGroup.description,
      employees: 0,
      permissions: newSecurityGroup.permissions.length,
      keyPermissions: keyPermissionsDisplay,
      // Store the actual permission IDs for managing later
      permissionIds: newSecurityGroup.permissions,
      deletable: true,
      settingField1: '', // Initialize settings for new groups
      settingField2: ''
    };

    setDesignations(prevDesignations => [...prevDesignations, newDesignation]);
    toast.success(`Work Group '${newSecurityGroup.name}' created!`);
    closeCreateSecurityGroupModal();
  };

  // --- Manage Security Group Modal functions ---
  const handleManageDesignationClick = (designation) => {
    setSelectedDesignationForManage(designation);
    setManageUsersSearchTerm(''); // Clear search term when opening modal
    setIsManageSecurityGroupModalOpen(true);
    setCurrentManageSecurityGroupTab('Permissions'); // Always open to Permissions tab

    // Reset visible permission counts when opening the modal for a new designation
    const initialCounts = {};
    Object.keys(permissionsData).forEach(category => {
      initialCounts[category] = 5;
    });
    setVisiblePermissionCounts(initialCounts);
  };

  const closeManageSecurityGroupModal = () => {
    setIsManageSecurityGroupModalOpen(false);
    setSelectedDesignationForManage(null);
  };

  const handleManagePermissionsChange = (permissionId) => {
    if (!selectedDesignationForManage) return;

    setSelectedDesignationForManage(prevDesignation => {
        const currentPermissions = prevDesignation.permissionIds || []; // Ensure it's an array

        const updatedPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter(id => id !== permissionId)
            : [...currentPermissions, permissionId];

        // Update keyPermissionsDisplay based on new selection (simplified for display)
        const allPermissionsById = {};
        for (const category in permissionsData) {
            permissionsData[category].forEach(p => {
                allPermissionsById[p.id] = p.name;
            });
        }
        const selectedPermissionNames = updatedPermissions.map(id => allPermissionsById[id] || id);
        const keyPermissionsDisplay = selectedPermissionNames.slice(0, 3);
        if (selectedPermissionNames.length > 3) {
            keyPermissionsDisplay.push(`+${selectedPermissionNames.length - 3} more`);
        }

        return {
            ...prevDesignation,
            permissionIds: updatedPermissions,
            permissions: updatedPermissions.length, // Update count
            keyPermissions: keyPermissionsDisplay, // Update display array
        };
    });
  };

  // Handler for settings tab inputs
  const handleManageSettingsChange = (e) => {
    const { name, value } = e.target;
    setSelectedDesignationForManage(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Toggle function for "Show More/Show Less" permissions
  const toggleShowPermissions = (category) => {
    setVisiblePermissionCounts(prevCounts => {
      const currentCount = prevCounts[category];
      const totalCount = permissionsData[category].length;
      return {
        ...prevCounts,
        [category]: currentCount === totalCount ? 5 : totalCount // Toggle between 5 and all
      };
    });
  };

  const saveManagedDesignation = () => {
    if (selectedDesignationForManage) {
        setDesignations(designations.map(d =>
            d.id === selectedDesignationForManage.id ? selectedDesignationForManage : d
        ));
        toast.success(`Work Group '${selectedDesignationForManage.name}' updated!`);
    }
    closeManageSecurityGroupModal();
  };

  // --- User Assignment Logic within Manage Security Group Modal ---
  const handleAssignUnassignUser = (userToUpdate, action) => {
    if (!selectedDesignationForManage) return;

    const designationName = selectedDesignationForManage.name;

    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userToUpdate.id) {
          const updatedDesignations = new Set(user.designations);
          if (action === 'assign') {
            updatedDesignations.add(designationName);
            toast.success(`Assigned ${designationName} to ${user.name}`);
          } else { // action === 'unassign'
            updatedDesignations.delete(designationName);
            toast.success(`Unassigned ${designationName} from ${user.name}`);
          }
          return { ...user, designations: Array.from(updatedDesignations) };
        }
        return user;
      });
    });

    // Update the employees count for the selected designation
    setDesignations(prevDesignations => {
        return prevDesignations.map(designation => {
            if (designation.id === selectedDesignationForManage.id) {
                const newEmployeeCount = action === 'assign' ? designation.employees + 1 : designation.employees - 1;
                return { ...designation, employees: Math.max(0, newEmployeeCount) }; // Ensure count doesn't go below 0
            }
            return designation;
        });
    });

    // Update the selectedDesignationForManage in state immediately to reflect count in modal
    setSelectedDesignationForManage(prev => {
        const newEmployeeCount = action === 'assign' ? prev.employees + 1 : prev.employees - 1;
        return {...prev, employees: Math.max(0, newEmployeeCount)};
    });
  };

  const getAssignedUsers = () => {
    if (!selectedDesignationForManage) return [];
    return users.filter(user =>
      user.designations.includes(selectedDesignationForManage.name) &&
      (user.name.toLowerCase().includes(manageUsersSearchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(manageUsersSearchTerm.toLowerCase()))
    );
  };

  const getAvailableUsers = () => {
    if (!selectedDesignationForManage) return [];
    return users.filter(user =>
      !user.designations.includes(selectedDesignationForManage.name) &&
      (user.name.toLowerCase().includes(manageUsersSearchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(manageUsersSearchTerm.toLowerCase()))
    );
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
          --status-active-bg: #10b981; /* Darker green */
          --status-inactive-bg: #ef4444; /* Red */
          --status-active-text: #ffffff; /* Text color for active status, adjust if needed */
          --status-inactive-text: #ffffff; /* Text color for inactive status, adjust if needed */
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
          --tab-border: #e5e7eb;
          --permission-item-bg-hover: #f9fafb;
          --permission-border-bottom: #e5e7eb;

          /* Custom Radio Button Tabs Styles */
          --radio-group-bg: #EEE;
          --radio-group-shadow: rgba(0, 0, 0, 0.06);
          --radio-item-color: rgba(51, 65, 85, 1);
          --radio-item-bg-checked: #fff;

          /* User card in manage modal */
          --user-card-border: #e5e7eb;
          --user-card-shadow: rgba(0,0,0,0.05);
          --user-card-hover: #f9fafb;
          --user-card-name-color: #1f2937;
          --user-card-email-color: #6b7280;
          --user-card-dept-color: #4b5563;
          --user-card-action-icon: #2563eb;
          --user-card-action-icon-hover: #1d4ed8;
          --user-card-no-users-bg: #f0f4f8;
          --user-card-no-users-text: #6b7280;
          --user-card-no-users-icon: #9ca3af;
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
          --status-active-bg: #10b981; /* Darker green for dark mode */
          --status-inactive-bg: #dc2626; /* Darker red for dark mode */
          --status-active-text: #ffffff;
          --status-inactive-text: #ffffff;
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

          /* Custom Radio Button Tabs Styles */
          --radio-group-bg: #4a5568;
          --radio-group-shadow: rgba(0, 0, 0, 0.2);
          --radio-item-color: #e2e8f0;
          --radio-item-bg-checked: #2d3748;

          /* User card in manage modal */
          --user-card-border: #4a5568;
          --user-card-shadow: rgba(0,0,0,0.2);
          --user-card-hover: #3f4c60;
          --user-card-name-color: #e2e8f0;
          --user-card-email-color: #a0aec0;
          --user-card-dept-color: #cbd5e0;
          --user-card-action-icon: #4299e1;
          --user-card-action-icon-hover: #3182ce;
          --user-card-no-users-bg: #4a5568;
          --user-card-no-users-text: #cbd5e0;
          --user-card-no-users-icon: #a0aec0;
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
          gap: 1.5rem; /* Gap between direct children */
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

        /* Removed .um-employee-directory-card styling as the wrapper is removed */
        /* Its children (header row, search, table) will now be direct children of um-content-wrapper */

        /* Layout for Employee Directory Header and Search (now direct inside content-wrapper) */
        .um-employee-directory-header-row {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            background-color: var(--bg-card); /* Added background for clarity */
            padding: 1.5rem; /* Added padding */
            border-radius: 0.5rem; /* Added border-radius */
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
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
          background-color: var(--bg-card); /* Added background for consistency */
          padding: 0; /* Table wrapper handles its own padding internally now */
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
          font-weight: 700; /* Made bold */
          color: var(--text-primary); /* Changed to text-primary for darker color */
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        /* New: Left-align specific table headers and cells */
        .um-text-left {
          text-align: left !important; /* Use !important to override .um-table-th centering */
        }

        .um-table-tbody {
          background-color: var(--bg-card);
        }

        .um-table-tr {
          border-bottom: 1px solid var(--border-color);
          transition: background-color 150ms ease-in-out; /* Add transition for smooth hover */
        }
        .um-table-tr:last-child {
            border-bottom: none;
        }

        /* Hover effect for table rows */
        .um-table-tr:hover {
            background-color: var(--action-hover-bg); /* Use an existing color variable for hover, or define a new one */
        }
        /* Ensure hover works in dark mode too */
        html.dark-mode .um-table-tr:hover {
            background-color: #3f4c60; /* A darker shade for dark mode hover */
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

        /* Status Tags (for users table) - Keeping the old definition for possible reuse, but adding toggle styles */
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

        /* Toggle Button Styles */
        .um-toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px; /* Increased width for better appearance */
          height: 24px; /* Increased height */
          vertical-align: middle;
        }

        .um-toggle-switch input {
          display: none;
        }

        .um-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--status-inactive-bg); /* Use inactive color for off state */
          transition: .4s;
          border-radius: 24px; /* Half of height for rounded corners */
        }

        .um-slider:before {
          position: absolute;
          content: "";
          height: 18px; /* Slightly smaller than slider height */
          width: 18px; /* Make it a circle */
          left: 3px; /* Margin from left */
          bottom: 3px; /* Margin from bottom */
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2); /* Small shadow for the thumb */
        }

        input:checked + .um-slider {
          background-color: var(--status-active-bg); /* Use active color for on state */
        }

        input:checked + .um-slider:before {
          transform: translateX(20px); /* Move thumb to the right (44 - 18 - 2*3 = 20) */
        }

        /* Dark mode adjustments for toggle */
        html.dark-mode .um-slider {
          background-color: var(--status-inactive-bg); /* Ensure dark mode color for inactive */
        }

        html.dark-mode input:checked + .um-slider {
          background-color: var(--status-active-bg); /* Ensure dark mode color for active */
        }

        html.dark-mode .um-slider:before {
          background-color: var(--bg-card); /* White thumb in dark mode too, or a contrasting color */
        }


        /* Action Buttons */
        .um-action-buttons {
          display: flex;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          align-items: center; /* Align items vertically in action buttons */
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
        /* Adjusted max-width for Manage Security Group modal to match image */
        .um-manage-modal-content {
            max-width: 40rem; /* Increased width for managing security groups */
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

        .um-modal-subtitle {
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
        /* Specific height for manage permissions to match image */
        .um-manage-permissions-scrollable {
            max-height: 300px; /* Adjust height as needed */
            padding-bottom: 0; /* Remove bottom padding if categories handle spacing */
        }
        /* Scrollable area for users tab */
        .um-manage-users-scrollable {
            max-height: 450px; /* Adjust height for users list */
            padding-bottom: 1rem;
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
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .um-checkbox-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        .um-checkbox-item input[type="checkbox"] {
            width: 1.15rem;
            height: 1.15rem;
            accent-color: #2563eb;
            border: 1px solid var(--modal-input-border);
            border-radius: 0.25rem;
            cursor: pointer;
            flex-shrink: 0;
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
          align-items: flex-start;
          justify-content: space-between;
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
          flex-grow: 1;
        }

        .designation-stats {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          align-items: center;
        }

        .designation-stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .designation-manage-btn {
          padding: 0.6rem 1.2rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 150ms, border-color 150ms;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .designation-manage-btn:hover {
          background-color: var(--bg-nav-link-hover);
          border-color: var(--text-secondary);
        }

        .designation-delete-btn {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--action-red);
          font-size: 1.125rem;
          cursor: pointer;
          padding: 0.6rem 0.8rem;
          border-radius: 0.5rem;
          transition: background-color 150ms, border-color 150ms;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .designation-delete-btn:hover {
          background-color: var(--action-hover-bg);
          border-color: var(--action-red);
        }

        /* Custom Radio Button Tabs Styles */
        .um-radio-inputs {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          border-radius: 0.5rem;
          background-color: var(--radio-group-bg);
          box-sizing: border-box;
          box-shadow: 0 0 0px 1px var(--radio-group-shadow);
          padding: 0.25rem;
          width: 100%;
          max-width: 450px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          min-width: 200px;
        }
        .um-radio-inputs-modal {
            max-width: unset;
            justify-content: flex-start;
            padding: 0;
            box-shadow: none;
            background-color: transparent;
            border-bottom: 1px solid var(--border-color);
            border-radius: 0;
            margin-bottom: 1.5rem;
        }
        .um-radio-inputs-modal .um-radio-item {
            flex: unset;
            padding-bottom: 0.75rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            border-bottom: 2px solid transparent;
            border-radius: 0;
        }
        .um-radio-inputs-modal .um-radio-item .um-radio-name {
            padding: 0.5rem 1rem;
            background-color: transparent;
        }
        .um-radio-inputs-modal .um-radio-item input:checked + .um-radio-name {
            background-color: transparent;
            color: var(--text-primary);
        }
        .um-radio-inputs-modal .um-radio-item:has(input:checked) {
            border-bottom: 2px solid #2563eb;
        }
        .um-radio-inputs-modal .um-radio-item:hover .um-radio-name {
            background-color: var(--bg-nav-link-hover);
        }
        html.dark-mode .um-radio-inputs-modal .um-radio-item:hover .um-radio-name {
            background-color: var(--action-hover-bg);
        }


        .um-radio-inputs .um-radio-item {
          flex: 1 1 auto;
          text-align: center;
        }

        .um-radio-inputs .um-radio-item input {
          display: none;
        }

        .um-radio-inputs .um-radio-item .um-radio-name {
          display: flex;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          border: none;
          padding: .5rem 0;
          color: var(--radio-item-color);
          transition: all .15s ease-in-out;
        }

        .um-radio-inputs .um-radio-item input:checked + .um-radio-name {
          background-color: var(--radio-item-bg-checked);
          font-weight: 600;
        }

        .um-security-group-permissions-content {
            border: 1px solid var(--tab-border);
            border-radius: 0.5rem;
            padding: 1rem;
            background-color: var(--bg-card);
            min-height: 10rem;
            overflow-y: auto;
        }

        /* Specific styles for permission sections within the modal */
        .um-permission-section {
            border: 1px solid var(--tab-border);
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            overflow: hidden;
            background-color: var(--bg-card);
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .um-permission-section-title {
            font-weight: 600;
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            background-color: var(--table-header-bg);
            border-bottom: 1px solid var(--tab-border);
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
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

        /* Styles for user cards within manage modal */
        .um-user-section-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }

        .um-user-list-card {
            border: 1px solid var(--user-card-border);
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px var(--user-card-shadow);
            padding: 1rem;
            background-color: var(--bg-card);
        }

        .um-user-list-card-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            font-size: 1rem;
        }

        .um-user-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .um-user-card-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 0.5rem;
            border: 1px solid var(--user-card-border);
            border-radius: 0.5rem;
            transition: background-color 150ms ease-in-out;
        }
        .um-user-card-item:hover {
            background-color: var(--user-card-hover);
        }

        .um-user-card-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
        }
        .um-user-card-name {
            font-weight: 600;
            color: var(--user-card-name-color);
            font-size: 0.9rem;
        }
        .um-user-card-email {
            color: var(--user-card-email-color);
            font-size: 0.8rem;
        }
        .um-user-card-dept {
            color: var(--user-card-dept-color);
            font-size: 0.75rem;
            margin-top: 0.25rem;
        }
        .um-user-card-designations {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-top: 0.4rem;
        }
        .um-user-card-status-tag {
            padding: 0.1rem 0.4rem;
            font-size: 0.7rem;
            font-weight: 600;
            border-radius: 9999px;
            text-transform: uppercase;
        }
        .um-user-card-status-active {
            background-color: var(--status-active-bg);
            color: var(--status-active-text);
        }
        .um-user-card-status-inactive {
            background-color: var(--status-inactive-bg);
            color: var(--status-inactive-text);
        }

        .um-user-card-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;
            margin-left: 1rem;
        }
        .um-user-card-action-btn {
            background: none;
            border: none;
            color: var(--user-card-action-icon);
            font-size: 1.15rem;
            cursor: pointer;
            padding: 0.4rem;
            border-radius: 9999px;
            transition: background-color 150ms, color 150ms;
        }
        .um-user-card-action-btn:hover {
            background-color: var(--action-hover-bg);
            color: var(--user-card-action-icon-hover);
        }

        .um-no-users-message {
            text-align: center;
            padding: 2rem;
            background-color: var(--user-card-no-users-bg);
            border-radius: 0.5rem;
            color: var(--user-card-no-users-text);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            min-height: 8rem;
            font-size: 0.9rem;
        }
        .um-no-users-icon {
            font-size: 2rem;
            color: var(--user-card-no-users-icon);
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
            {isDarkMode ? <FiSun /> : <FiMoon />} {/* Changed icons here */}
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

              {/* Employee Directory Section - NOW WITHOUT THE OUTER CARD */}
              <div className="um-employee-directory-header-row"> {/* This div now acts as the header/search container */}
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

              {/* User Table (no changes needed here, as it had its own styling) */}
              <div className="um-table-wrapper">
                <table className="um-table">
                  <thead className="um-table-thead">
                    <tr>
                      <th scope="col" className="um-table-th um-text-left"> {/* Added um-text-left class */}
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
                          <td className="um-table-td um-cell-responsive um-text-left"> {/* Added um-text-left class */}
                            <div className="um-employee-name">{user.name}</div>
                            <div className="um-employee-email">{user.email}</div>
                          </td>
                          <td className="um-table-td um-cell-responsive">
                            <div className="um-employee-name">{user.department}</div>
                          </td>
                          <td className="um-table-td um-cell-responsive">
                            <div className="um-designation-container">
                              {/* Display all designations a user has from their array */}
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
                            {/* Replaced status text with ToggleButton */}
                            <ToggleButton
                              checked={user.status === 'active'}
                              onChange={() => handleStatusToggle(user)}
                              ariaLabel={`Toggle status for ${user.name}`}
                            />
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
            </>
          )}

          {currentView === 'workGroups' && (
            <>
              <div className="um-header-section">
                <div>
                  <h1 className="um-title">Company Designations</h1>
                  <p className="um-subtitle">Manage role designations and their system permissions</p>
                </div>
                <button
                  onClick={openCreateSecurityGroupModal}
                  className="um-add-btn"
                >
                  <FaPlus />
                  <span>Create Work Group</span>
                </button>
              </div>

              <div className="designations-grid">
                {designations.map((designation) => (
                  <div key={designation.id} className="designation-card">
                    <div className="designation-header">
                      <div className="designation-title-group">
                        <FaShieldAlt style={{ color: 'var(--icon-color)', fontSize: '1.25rem' }} />
                        <h3 className="designation-name">{designation.name}</h3>
                      </div>
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
                    <div className="designation-card-actions">
                      <button
                        onClick={() => handleManageDesignationClick(designation)} // Updated onClick
                        className="designation-manage-btn"
                      >
                        <FaEdit /> Manage
                      </button>
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
            </p>
            <form onSubmit={saveUser} className="um-modal-form">
              <div className="um-modal-body-scrollable">
                <div className="um-modal-form-fields-group">
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
                    >
                      <option value="">Select Department</option>
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

      {/* User Delete Confirmation Modal (kept as it is not for status toggle) */}
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

      {/* Designation Delete Confirmation Modal */}
      {isDeleteDesignationConfirmModalOpen && designationToDelete && (
        <div className="um-modal-overlay">
          <div className="um-modal-content um-confirm-modal-content">
            <button
              onClick={cancelDeleteDesignation}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-confirm-modal-title">Confirm Deletion</h3>
            <p className="um-confirm-modal-message">
              Are you sure you want to delete designation "{designationToDelete.name}"? This action cannot be undone.
              <br/><br/>
              Note: This will not unassign users from this designation.
            </p>
            <div className="um-confirm-modal-actions">
              <button
                onClick={cancelDeleteDesignation}
                className="um-modal-cancel-btn"
                >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDesignation}
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
            <h3 className="um-modal-title">Create New Work Group</h3>
            <p className="um-modal-subtitle">Define a new work group with specific permissions</p>
            <form onSubmit={handleCreateSecurityGroupSubmit} className="um-modal-form">
              <div className="um-modal-body-scrollable">
                <div className="um-modal-form-fields-group">
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="securityGroupName">
                      Work Group Name
                    </label>
                    <input
                      type="text"
                      id="securityGroupName"
                      name="name"
                      value={newSecurityGroup.name}
                      onChange={handleSecurityGroupInputChange}
                      className="um-modal-input"
                      placeholder="Work Group Name"
                      required
                    />
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" style={{marginBottom: '0'}}>
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

                  {/* Permissions Section - Styled Radio Buttons */}
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" style={{marginBottom: '0'}}>
                      Permissions
                    </label>
                    <div className="um-radio-inputs"> {/* Main wrapper for radio group */}
                      {Object.keys(permissionsData).map(tabName => (
                        <label key={tabName} className="um-radio-item">
                          <input
                            type="radio"
                            name="permissionCategory"
                            value={tabName}
                            checked={currentPermissionTab === tabName}
                            onChange={(e) => setCurrentPermissionTab(e.target.value)}
                          />
                          <span className="um-radio-name">{tabName}</span>
                        </label>
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
                </div>
              </div>
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
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Security Group Modal */}
      {isManageSecurityGroupModalOpen && selectedDesignationForManage && (
        <div className="um-modal-overlay">
          <div className="um-modal-content um-manage-modal-content">
            <button
              onClick={closeManageSecurityGroupModal}
              className="um-modal-close-btn"
            >
              &times;
            </button>
            <h3 className="um-modal-title">
              Manage Security Group: {selectedDesignationForManage.name} ({selectedDesignationForManage.employees} Users)
            </h3>
            <p className="um-modal-subtitle">
              Edit permissions and settings for this security group
            </p>

            <div className="um-radio-inputs um-radio-inputs-modal">
                <label className="um-radio-item">
                  <input
                    type="radio"
                    name="manageSecurityGroupTab"
                    value="Permissions"
                    checked={currentManageSecurityGroupTab === 'Permissions'}
                    onChange={() => setCurrentManageSecurityGroupTab('Permissions')}
                  />
                  <span className="um-radio-name">Permissions</span>
                </label>
                <label className="um-radio-item">
                  <input
                    type="radio"
                    name="manageSecurityGroupTab"
                    value="Users"
                    checked={currentManageSecurityGroupTab === 'Users'}
                    onChange={() => setCurrentManageSecurityGroupTab('Users')}
                  />
                  <span className="um-radio-name" style={{color: '#EF4444'}}>Users ({selectedDesignationForManage.employees})</span>
                </label>
                <label className="um-radio-item">
                  <input
                    type="radio"
                    name="manageSecurityGroupTab"
                    value="Settings"
                    checked={currentManageSecurityGroupTab === 'Settings'}
                    onChange={() => setCurrentManageSecurityGroupTab('Settings')}
                  />
                  <span className="um-radio-name">Settings</span>
                </label>
            </div>

            <div className="um-modal-body-scrollable um-manage-permissions-scrollable um-manage-users-scrollable">
              {currentManageSecurityGroupTab === 'Permissions' && (
                <div className="um-modal-form-fields-group">
                  {Object.keys(permissionsData).map(category => {
                    const categoryPermissions = permissionsData[category];
                    const currentVisibleCount = visiblePermissionCounts[category] || 5;
                    const displayedPermissions = categoryPermissions.slice(0, currentVisibleCount);
                    const hasMorePermissions = categoryPermissions.length > currentVisibleCount;

                    return (
                      <div key={category} className="um-permission-section">
                        <div className="um-permission-section-title">{category}</div>
                        {displayedPermissions.map(permission => (
                          <div key={permission.id} className="um-permission-item">
                            <div className="um-permission-checkbox-wrapper">
                              <input
                                type="checkbox"
                                id={`manage-permission-${selectedDesignationForManage.id}-${permission.id}`}
                                className="um-permission-checkbox"
                                checked={selectedDesignationForManage.permissionIds && selectedDesignationForManage.permissionIds.includes(permission.id)}
                                onChange={() => handleManagePermissionsChange(permission.id)}
                              />
                            </div>
                            <div className="um-permission-details">
                              <label htmlFor={`manage-permission-${selectedDesignationForManage.id}-${permission.id}`} className="um-permission-name">
                                {permission.name}
                              </label>
                              <p className="um-permission-description">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                        {/* {categoryPermissions.length > 5 && ( // Only show button if there are more than 5 permissions
                          <button
                            type="button"
                            onClick={() => toggleShowPermissions(category)}
                            className="um-show-more-btn"
                          >
                            {currentVisibleCount === categoryPermissions.length ? 'Show Less' : 'Show More'}
                          </button>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              )}
              {currentManageSecurityGroupTab === 'Users' && (
                <div className="um-modal-form-fields-group">
                  {/* Search bar for users in modal */}
                  <div className="um-search-container" style={{maxWidth: '100%', marginBottom: '1rem'}}>
                      <div className="um-search-input-wrapper">
                          <input
                              type="text"
                              placeholder="Search users..."
                              className="um-search-input"
                              value={manageUsersSearchTerm}
                              onChange={(e) => setManageUsersSearchTerm(e.target.value)}
                          />
                          <FaSearch className="um-search-icon" />
                      </div>
                  </div>

                  {/* Assigned Users Section */}
                  <div className="um-user-section-container">
                    <div className="um-user-list-card-header">
                       Assigned Users ({getAssignedUsers().length})
                    </div>
                    {getAssignedUsers().length > 0 ? (
                      <div className="um-user-list">
                        {getAssignedUsers().map(user => (
                          <div key={user.id} className="um-user-card-item">
                            <div className="um-user-card-details">
                              <div className="um-user-card-name">{user.name}</div>
                              <div className="um-user-card-email">{user.email}</div>
                              <div className="um-user-card-dept">{user.department}</div>
                              <div className="um-user-card-designations">
                                {user.designations.map((designation, idx) => (
                                  <span key={idx} className={`um-designation-tag ${
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
                            </div>
                            <div className="um-user-card-actions">
                              <span className={`um-user-card-status-tag ${user.status === 'active' ? 'um-user-card-status-active' : 'um-user-card-status-inactive'}`}>
                                {user.status}
                              </span>
                              <button
                                onClick={() => handleAssignUnassignUser(user, 'unassign')}
                                className="um-user-card-action-btn"
                                aria-label={`Unassign ${user.name} from ${selectedDesignationForManage.name}`}
                              >
                                <FaUserMinus />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="um-no-users-message">
                        <FaUsers className="um-no-users-icon" />
                        No users assigned to this group
                      </div>
                    )}
                  </div>

                  {/* Available Users Section */}
                  <div className="um-user-section-container" style={{marginTop: '2rem'}}>
                    <div className="um-user-list-card-header">
                      Available Users ({getAvailableUsers().length})
                    </div>
                    {getAvailableUsers().length > 0 ? (
                      <div className="um-user-list">
                        {getAvailableUsers().map(user => (
                          <div key={user.id} className="um-user-card-item">
                            <div className="um-user-card-details">
                              <div className="um-user-card-name">{user.name}</div>
                              <div className="um-user-card-email">{user.email}</div>
                              <div className="um-user-card-dept">{user.department}</div>
                              <div className="um-user-card-designations">
                                {user.designations.map((designation, idx) => (
                                  <span key={idx} className={`um-designation-tag ${
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
                            </div>
                            <div className="um-user-card-actions">
                              <span className={`um-user-card-status-tag ${user.status === 'active' ? 'um-user-card-status-active' : 'um-user-card-status-inactive'}`}>
                                {user.status}
                              </span>
                              <button
                                onClick={() => handleAssignUnassignUser(user, 'assign')}
                                className="um-user-card-action-btn"
                                aria-label={`Assign ${user.name} to ${selectedDesignationForManage.name}`}
                              >
                                <FaUserPlus />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="um-no-users-message">
                        <FaUsers className="um-no-users-icon" />
                        All users are assigned to this group, or no unassigned users match the search.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {currentManageSecurityGroupTab === 'Settings' && (
                <div className="um-modal-form-fields-group">
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="groupNameSetting">
                      Group Name
                    </label>
                    <input
                      type="text"
                      id="groupNameSetting"
                      name="name" // Map to 'name' property of selectedDesignationForManage
                      value={selectedDesignationForManage.name}
                      onChange={handleManageSettingsChange}
                      className="um-modal-input"
                      placeholder="Group Name"
                      required
                    />
                  </div>
                  <div className="um-modal-form-group">
                    <label className="um-modal-label" htmlFor="groupDescriptionSetting">
                      Description
                    </label>
                    <textarea
                      id="groupDescriptionSetting"
                      name="description" // Map to 'description' property
                      value={selectedDesignationForManage.description}
                      onChange={handleManageSettingsChange}
                      className="um-modal-textarea"
                      placeholder="Group Description"
                      rows="3"
                    ></textarea>
                  </div>
                  {/* Any other settings fields can be added here */}
                </div>
              )}
            </div>

            <div className="um-modal-form-actions">
                <button
                  type="button"
                  onClick={closeManageSecurityGroupModal}
                  className="um-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveManagedDesignation}
                  className="um-modal-save-btn"
                >
                  Save Changes
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkGroups;
