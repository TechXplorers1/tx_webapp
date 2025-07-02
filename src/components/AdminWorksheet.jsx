import React, { useState, useEffect } from 'react'; // Removed useRef as it's no longer needed

const AdminWorksheet = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('userManagement'); // Default view to User Management
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@techxplorers.in', roles: ['admin', 'active', 'Management'] },
    { id: 2, name: 'Sarah Wilson', email: 'manager@techxplorers.in', roles: ['manager', 'active', 'Management'] },
    { id: 3, name: 'Michael Johnson', email: 'teamlead@techxplorers.in', roles: ['team lead', 'active', 'Tech Placement'] },
    { id: 4, name: 'Asset Manager', email: 'assets@techxplorers.in', roles: ['asset manager', 'active', 'Operations'] },
    { id: 5, name: 'John Employee', email: 'employee@techxplorers.in', roles: ['employee', 'active', 'Development'] },
    { id: 6, name: 'John Client', email: 'client@example.com', roles: ['client', 'active', 'External'] },
    { id: 7, name: 'Regular User', email: 'user@techxplorers.in', roles: ['user', 'active', 'Development'] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // States for modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  // State for the new user form
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'User', // Default role
    department: 'No department assigned', // Default department
    accountStatus: 'Active', // Default status
    temporaryPassword: '',
  });

  // Department Management States
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Management', description: 'Executive and senior management team', head: 'Sarah Wilson', employees: 5, status: 'active', createdDate: '15/01/2023' },
    { id: 2, name: 'Development', description: 'Software development and engineering', head: 'Michael Johnson', employees: 12, status: 'active', createdDate: '15/01/2023' },
    { id: 3, name: 'Design', description: 'UI/UX design and creative services', head: 'Not assigned', employees: 6, status: 'active', createdDate: '15/01/2023' },
    { id: 4, name: 'Marketing', description: 'Marketing and brand management', head: 'Not assigned', employees: 8, status: 'active', createdDate: '15/01/2023' },
    { id: 5, name: 'Sales', description: 'Sales and business development', head: 'Not assigned', employees: 10, status: 'active', createdDate: '15/01/2023' },
    { id: 6, name: 'Operations', description: 'Operations and process management', head: 'Not assigned', employees: 7, status: 'active', createdDate: '15/01/2023' },
    { id: 7, name: 'Finance', description: 'Financial planning and accounting', head: 'Not assigned', employees: 4, status: 'active', createdDate: '15/01/2023' },
    { id: 8, name: 'Support', description: 'Customer support and service', head: 'Not assigned', employees: 9, status: 'active', createdDate: '15/01/2023' },
    { id: 9, name: 'Quality Assurance', description: 'Quality testing and assurance', head: 'Not assigned', employees: 5, status: 'active', createdDate: '15/01/2023' },
    { id: 10, name: 'Tech Placement', description: 'Technology recruitment and placement', head: 'Michael Johnson', employees: 8, status: 'active', createdDate: '15/01/2023' },
    { id: 11, name: 'HR', description: 'Human resources and talent management', head: 'Not assigned', employees: 3, status: 'active', createdDate: '15/01/2023' },
    { id: 12, name: 'External', description: 'External clients and partners', head: 'Not assigned', employees: 0, status: 'active', createdDate: '15/01/2023' },
  ]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');

  // New states for Department Modals
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [currentDepartmentToEdit, setCurrentDepartmentToEdit] = useState(null);
  const [isDeleteDepartmentConfirmModalOpen, setIsDeleteDepartmentConfirmModalOpen] = useState(false);
  const [departmentToDeleteId, setDepartmentToDeleteId] = useState(null);

  // Removed isProfileDropdownOpen state


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

  // Effect to manage body scroll when any modal is open
  useEffect(() => {
    if (isAddUserModalOpen || isEditUserModalOpen || isDeleteConfirmModalOpen || isEditDepartmentModalOpen || isDeleteDepartmentConfirmModalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Cleanup function
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isAddUserModalOpen, isEditUserModalOpen, isDeleteConfirmModalOpen, isEditDepartmentModalOpen, isDeleteDepartmentConfirmModalOpen]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Removed useEffect for click outside dropdown


  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add User Modal Handlers
  const handleAddUserClick = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setNewUser({
      fullName: '',
      email: '',
      role: 'User',
      department: 'No department assigned',
      accountStatus: 'Active',
      temporaryPassword: '',
    });
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser(prevUser => ({
      ...prevUser,
      temporaryPassword: password
    }));
  };

  const handleCreateUserAccount = (e) => {
    e.preventDefault();
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newRoles = [newUser.role.toLowerCase()];
    if (newUser.accountStatus.toLowerCase() === 'active') {
      newRoles.push('active');
    } else if (newUser.accountStatus.toLowerCase() === 'inactive') {
      newRoles.push('inactive');
    } else if (newUser.accountStatus.toLowerCase() === 'pending') {
      newRoles.push('pending');
    }
    if (newUser.department !== 'No department assigned') {
      newRoles.push(newUser.department.toLowerCase()); // Ensure department is lowercase for consistency
    }
    setUsers(prevUsers => [
      ...prevUsers,
      {
        id: newUserId,
        name: newUser.fullName,
        email: newUser.email,
        roles: newRoles,
      }
    ]);
    handleCloseAddUserModal();
  };

  // Edit User Modal Handlers
  const handleEditUserClick = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Extract the department from roles, assuming it's one of the departmentOptions
      const userDepartment = departmentOptions.find(dept => user.roles.includes(dept.toLowerCase())) || 'No department assigned';
      // Extract account status
      const userAccountStatus = accountStatusOptions.find(status => user.roles.includes(status.toLowerCase())) || 'Active';
      // Extract role
      const userRole = roleOptions.find(role => user.roles.includes(role.value.toLowerCase()))?.value || 'User';

      setCurrentUserToEdit({
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: userRole,
        department: userDepartment,
        accountStatus: userAccountStatus,
        temporaryPassword: '', // Password is not editable directly, or would be handled securely
      });
      setIsEditUserModalOpen(true);
    }
  };

  const handleCloseEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setCurrentUserToEdit(null);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setCurrentUserToEdit(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleUpdateUserAccount = (e) => {
    e.preventDefault();
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === currentUserToEdit.id) {
        // Reconstruct roles based on updated form data
        const updatedRoles = [currentUserToEdit.role.toLowerCase()];
        if (currentUserToEdit.accountStatus.toLowerCase() === 'active') {
          updatedRoles.push('active');
        } else if (currentUserToEdit.accountStatus.toLowerCase() === 'inactive') {
          updatedRoles.push('inactive');
        } else if (currentUserToEdit.accountStatus.toLowerCase() === 'pending') {
          updatedRoles.push('pending');
        }
        if (currentUserToEdit.department !== 'No department assigned') {
          updatedRoles.push(currentUserToEdit.department.toLowerCase());
        }
        return {
          ...user,
          name: currentUserToEdit.fullName,
          email: currentUserToEdit.email,
          roles: updatedRoles,
        };
      }
      return user;
    }));
    handleCloseEditUserModal();
  };

  // Delete User Confirmation Handlers
  const handleDeleteUserClick = (userId) => {
    setUserToDeleteId(userId);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalOpen(false);
    setUserToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter(user => user.id !== userToDeleteId));
    handleCancelDelete();
  };

  // Department Search and Filter Handlers
  const handleDepartmentSearchChange = (event) => {
    setDepartmentSearchTerm(event.target.value);
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
                          dept.description.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
                          dept.head.toLowerCase().includes(departmentSearchTerm.toLowerCase());
    return matchesSearch; // Only filter by search term
  });

  // Department Edit Handlers
  const handleEditDepartmentClick = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      setCurrentDepartmentToEdit({ ...department });
      setIsEditDepartmentModalOpen(true);
    }
  };

  const handleCloseEditDepartmentModal = () => {
    setIsEditDepartmentModalOpen(false);
    setCurrentDepartmentToEdit(null);
  };

  const handleEditDepartmentChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartmentToEdit(prevDept => ({
      ...prevDept,
      [name]: value
    }));
  };

  const handleUpdateDepartment = (e) => {
    e.preventDefault();
    setDepartments(prevDepartments => prevDepartments.map(dept =>
      dept.id === currentDepartmentToEdit.id ? currentDepartmentToEdit : dept
    ));
    handleCloseEditDepartmentModal();
  };

  // Department Delete Confirmation Handlers
  const handleDeleteDepartmentClick = (departmentId) => {
    setDepartmentToDeleteId(departmentId);
    setIsDeleteDepartmentConfirmModalOpen(true);
  };

  const handleCancelDepartmentDelete = () => {
    setIsDeleteDepartmentConfirmModalOpen(false);
    setDepartmentToDeleteId(null);
  };

  const handleConfirmDepartmentDelete = () => {
    setDepartments(departments.filter(dept => dept.id !== departmentToDeleteId));
    handleCancelDepartmentDelete();
  };


  // Define options for the radio button navigation
  const adminViewOptions = [
    { value: 'userManagement', label: 'User Management' },
    { value: 'departments', label: 'Departments' },
    { value: 'clientManagement', label: 'Client Management' },
  ];

  // Data for dropdowns
  const roleOptions = [
    { value: 'Administrator', label: 'Administrator', description: 'Full system access and user management' },
    { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
    { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
    { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
    { value: 'User', label: 'User', description: 'General user access for job seeking' },
    { value: 'Client', label: 'Client', description: 'Client access for job applications and hiring' },
    { value: 'Asset Manager', label: 'Asset Manager', description: 'Asset and equipment management' },
  ];

  const departmentOptions = [
    'No department assigned',
    'Management',
    'Development',
    'Design',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'Support',
    'Quality Assurance',
    'Tech Placement',
    'HR',
    'External',
  ];

  // Head of Department options for the edit department modal.
  // This should ideally come from a list of users with appropriate roles.
  const headOfDepartmentOptions = [
    'Not assigned',
    'Sarah Wilson',
    'Michael Johnson',
    // Add other potential heads of department here
  ];

  const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const departmentStatusOptions = ['active', 'inactive', 'pending']; // For department table filter and edit


  // Helper to get role/status tag background color
  const getRoleTagBg = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'var(--admin-tag-bg)';
      case 'administrator': return 'var(--admin-tag-bg)';
      case 'manager': return '#E0F7FA'; // Light Cyan
      case 'team lead': return '#F3E5F5'; // Light Purple
      case 'asset manager': return '#FFF3E0'; // Light Orange
      case 'employee': return '#E1F5FE'; // Light Blue-ish
      case 'client': return '#E8F5E9'; // Light Green
      case 'user': return '#FBE9E7'; // Light Orange-Red
      case 'active': return '#E8F5E9'; // Light Green
      case 'inactive': return '#FFEBEE'; // Light Red
      case 'pending': return '#FFFDE7'; // Light Yellow
      case 'management': return '#E3F2FD'; // Light Blue
      case 'tech placement': return '#FCE4EC'; // Light Pink
      case 'operations': return '#F5F5DC'; // Beige
      case 'development': return '#EDE7F6'; // Light Indigo
      case 'design': return '#FFE0B2'; // Light Orange
      case 'marketing': return '#CFD8DC'; // Blue Grey
      case 'sales': return '#DCEDC8'; // Light Green
      case 'finance': return '#FFCDD2'; // Light Red
      case 'support': return '#C8E6C9'; // Darker Light Green
      case 'quality assurance': return '#BBDEFB'; // Light Blue
      case 'hr': return '#F0F4C3'; // Light Khaki
      case 'external': return '#F9FBE7'; // Light Yellow-Green
      default: return 'var(--border-color)';
    }
  };

  // Helper to get role/status tag text color
  const getRoleTagText = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'var(--admin-tag-text)';
      case 'administrator': return 'var(--admin-tag-text)';
      case 'manager': return '#00BCD4'; // Cyan
      case 'team lead': return '#9C27B0'; // Purple
      case 'asset manager': return '#FF9800'; // Orange
      case 'employee': return '#2196F3'; // Blue
      case 'client': return '#4CAF50'; // Green
      case 'user': return '#FF5722'; // Deep Orange
      case 'active': return '#4CAF50'; // Green
      case 'inactive': return '#F44336'; // Red
      case 'pending': return '#FFD700'; // Gold
      case 'management': return '#2196F3'; // Blue
      case 'tech placement': return '#E91E63'; // Pink
      case 'operations': return '#795548'; // Brown
      case 'development': return '#5E35B1'; // Indigo
      case 'design': return '#FB8C00'; // Dark Orange
      case 'marketing': return '#607D8B'; // Blue Grey
      case 'sales': return '#8BC34A'; // Light Green
      case 'finance': return '#E53935'; // Red
      case 'support': return '#388E3C'; // Dark Green
      case 'quality assurance': return '#1976D2'; // Dark Blue
      case 'hr': return '#F0F4C3'; // Light Khaki
      case 'external': return '#AFB42B'; // Lime
      default: return 'var(--text-secondary)';
    }
  };


  return (
    <div className="ad-body-container">
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
          --logo-x-color: #2563eb;

          /* Dashboard specific colors */
          --card-value-color: #1f2937;
          --card-label-color: #6b7280;
          --card-icon-bg: #e0f2fe;
          --card-icon-color: #2563eb;
          --card-chart-bg: #e0f2fe;
          --card-chart-color: #2563eb;
          --card-positive-change: #10b981;
          --card-negative-change: #ef4444;
          --card-neutral-change: #6b7280;
          --quick-action-bg: #2563eb;
          --quick-action-hover-bg: #1d4ed8;
          --quick-action-text: #ffffff;
          --alert-info-bg: #e0f2fe;
          --alert-info-text: #1e40af;
          --alert-warning-bg: #fef3c7;
          --alert-warning-text: #92400e;
          --alert-icon-color: inherit;

          /* Admin tag in header */
          --admin-tag-bg: #fee2e2;
          --admin-tag-text: #991b1b;

          /* Custom Radio Button Tabs Styles (Matching Screenshot) */
          --radio-group-bg: #ffffff; /* White background for the radio group */
          --radio-group-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for the container */
          --radio-item-color: #4b5563; /* Text color for inactive tabs */
          --radio-item-bg-checked: #eff6ff; /* Light blue background for active tab */
          --radio-item-text-checked: #1f2937; /* Dark text for active tab */
          --radio-item-hover-bg: #f9fafb; /* Subtle hover background for tabs */
          --radio-border-bottom-active: #2563eb; /* Blue border for active tab (not used in new style) */
          --radio-border-color: #e5e7eb; /* Border color for the bottom of the tab group (not used in new style) */

          /* User Management Specific Colors */
          --user-card-bg: #ffffff;
          --user-card-border: #e5e7eb;
          --user-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          --user-avatar-bg: #E0F2FE; /* Light blue for user avatars */
          --user-avatar-icon: #2563EB; /* Blue for user avatar icon */
          --user-name-color: #1f2937;
          --user-email-color: #6b7280;
          --action-btn-border: #e5e7eb;
          --action-btn-text: #4b5563;
          --action-btn-hover-bg: #f9fafb;
          --delete-btn-bg: #EF4444;
          --delete-btn-hover-bg: #DC2626;
          --delete-btn-text: #ffffff;
          --add-user-btn-bg: #2563EB;
          --add-user-btn-hover-bg: #1D4ED8;
          --add-user-btn-text: #ffffff;
          --search-input-bg: #ffffff;
          --search-input-border: #d1d5db;
          --search-input-text: #1f2937;
          --search-placeholder-color: #9ca3af;

          /* Modal specific colors */
          --modal-overlay-bg: rgba(0, 0, 0, 0.5);
          --modal-bg: #ffffff;
          --modal-border: #e5e7eb;
          --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --modal-title-color: #1f2937;
          --modal-subtitle-color: #6b7280;
          --modal-input-bg: #ffffff;
          --modal-input-border: #d1d5db;
          --modal-input-text: #1f2937;
          --modal-input-placeholder: #9ca3af;
          --modal-focus-border: #2563eb;
          --modal-label-color: #374151;
          --modal-close-btn-color: #6b7280;
          --modal-close-btn-hover: #1f2937;
          --modal-generate-btn-bg: #e0e7ff; /* Light blue for generate button */
          --modal-generate-btn-text: #3b82f6; /* Blue for generate button text */
          --modal-generate-btn-hover: #c7d2fe; /* Lighter blue on hover */
          --modal-create-btn-bg: #2563eb;
          --modal-create-btn-text: #ffffff;
          --modal-create-btn-hover: #1d4ed8;
          --modal-select-arrow: #6b7280;

          /* Delete Confirmation Modal */
          --confirm-modal-danger-btn-bg: #EF4444;
          --confirm-modal-danger-btn-hover: #DC2626;
          --confirm-modal-cancel-btn-bg: #e5e7eb;
          --confirm-modal-cancel-btn-text: #4b5563;
          --confirm-modal-cancel-btn-hover: #d1d5db;

          /* Department Management Specific Colors */
          --dept-card-icon-bg-1: #e0f2fe;
          --dept-card-icon-color-1: #2563eb;
          --dept-card-icon-bg-2: #e8f5e9;
          --dept-card-icon-color-2: #4CAF50;
          --dept-card-icon-bg-3: #f3e5f5;
          --dept-card-icon-color-3: #9C27B0;
          --dept-create-btn-bg: #2563eb;
          --dept-create-btn-hover: #1d4ed8;
          --dept-create-btn-text: #ffffff;
          --dept-search-input-bg: #ffffff;
          --dept-search-input-border: #d1d5db;
          --dept-search-input-text: #1f2937;
          --dept-search-placeholder-color: #9ca3af;
          --dept-select-bg: #ffffff;
          --dept-select-border: #d1d5db;
          --dept-select-text: #1f2937;
          --dept-table-header-bg: #f9fafb;
          --dept-table-header-text: #6b7280;
          --dept-table-row-border: #e5e7eb;
          --dept-table-row-hover-bg: #f9fafb;
          --dept-table-text-primary: #1f2937;
          --dept-table-text-secondary: #6b7280;
          --dept-active-tag-bg: #E8F5E9;
          --dept-active-tag-text: #4CAF50;
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
          --logo-x-color: #4299e1;

          /* Dashboard specific dark mode colors */
          --card-value-color: #e2e8f0;
          --card-label-color: #a0aec0;
          --card-icon-bg: #3182ce;
          --card-icon-color: #ffffff;
          --card-chart-bg: #3182ce;
          --card-chart-color: #ffffff;
          --card-positive-change: #68d391;
          --card-negative-change: #fc8181;
          --card-neutral-change: #a0aec0;
          --quick-action-bg: #4299e1;
          --quick-action-hover-bg: #3182ce;
          --quick-action-text: #ffffff;
          --alert-info-bg: #3182ce;
          --alert-info-text: #e0f2fe;
          --alert-warning-bg: #ecc94b;
          --alert-warning-text: #7b341f;
          --alert-icon-color: inherit;

          /* Admin tag in header */
          --admin-tag-bg: #fbd38d;
          --admin-tag-text: #6b4617;

          /* Custom Radio Button Tabs Styles (Matching Screenshot) */
          --radio-group-bg: #2d3748; /* Dark background for the radio group */
          --radio-group-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          --radio-item-color: #cbd5e0; /* Text color for inactive tabs */
          --radio-item-bg-checked: #4299e1; /* Darker blue background for active tab */
          --radio-item-text-checked: #ffffff; /* White text for active tab */
          --radio-item-hover-bg: #4a5568; /* Hover background for tabs */
          --radio-border-bottom-active: #4299e1; /* Blue border for active tab (not used in new style) */
          --radio-border-color: #4a5568; /* Border color for the bottom of the tab group (not used in new style) */

          /* User Management Specific Dark Mode Colors */
          --user-card-bg: #2d3748;
          --user-card-border: #4a5568;
          --user-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          --user-avatar-bg: #3182ce; /* Darker blue for user avatars */
          --user-avatar-icon: #ffffff; /* White for user avatar icon */
          --user-name-color: #e2e8f0;
          --user-email-color: #a0aec0;
          --action-btn-border: #4a5568;
          --action-btn-text: #cbd5e0;
          --action-btn-hover-bg: #4a5568;
          --delete-btn-bg: #DC2626;
          --delete-btn-hover-bg: #B91C1C;
          --delete-btn-text: #ffffff;
          --add-user-btn-bg: #4299e1;
          --add-user-btn-hover-bg: #3182ce;
          --add-user-btn-text: #ffffff;
          --search-input-bg: #2d3748;
          --search-input-border: #4a5568;
          --search-input-text: #e2e8f0;
          --search-placeholder-color: #a0aec0;

          /* Modal specific dark mode colors */
          --modal-overlay-bg: rgba(0, 0, 0, 0.7);
          --modal-bg: #2d3748;
          --modal-border: #4a5568;
          --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          --modal-title-color: #e2e8f0;
          --modal-subtitle-color: #a0aec0;
          --modal-input-bg: #4a5568;
          --modal-input-border: #6b7280;
          --modal-input-text: #e2e8f0;
          --modal-input-placeholder: #a0aec0;
          --modal-focus-border: #4299e1;
          --modal-label-color: #cbd5e0;
          --modal-close-btn-color: #a0aec0;
          --modal-close-btn-hover: #e2e8f0;
          --modal-generate-btn-bg: #3182ce;
          --modal-generate-btn-text: #ffffff;
          --modal-generate-btn-hover: #2b6cb0;
          --modal-create-btn-bg: #4299e1;
          --modal-create-btn-text: #ffffff;
          --modal-create-btn-hover: #3182ce;
          --modal-select-arrow: #cbd5e0;

          /* Delete Confirmation Modal */
          --confirm-modal-danger-btn-bg: #DC2626;
          --confirm-modal-danger-btn-hover: #B91C1C;
          --confirm-modal-cancel-btn-bg: #4a5568;
          --confirm-modal-cancel-btn-text: #cbd5e0;
          --confirm-modal-cancel-btn-hover: #6b7280;

          /* Department Management Specific Dark Mode Colors */
          --dept-card-icon-bg-1: #3182ce;
          --dept-card-icon-color-1: #ffffff;
          --dept-card-icon-bg-2: #388E3C;
          --dept-card-icon-color-2: #ffffff;
          --dept-card-icon-bg-3: #9C27B0;
          --dept-card-icon-color-3: #ffffff;
          --dept-create-btn-bg: #4299e1;
          --dept-create-btn-hover: #3182ce;
          --dept-create-btn-text: #ffffff;
          --dept-search-input-bg: #2d3748;
          --dept-search-input-border: #4a5568;
          --dept-search-input-text: #e2e8f0;
          --dept-search-placeholder-color: #a0aec0;
          --dept-select-bg: #2d3748;
          --dept-select-border: #4a5568;
          --dept-select-text: #e2e8f0;
          --dept-table-header-bg: #4a5568;
          --dept-table-header-text: #cbd5e0;
          --dept-table-row-border: #4a5568;
          --dept-table-row-hover-bg: #4a5568;
          --dept-table-text-primary: #e2e8f0;
          --dept-table-text-secondary: #a0aec0;
          --dept-active-tag-bg: #388E3C;
          --dept-active-tag-text: #ffffff;
        }

        /* Global no-scroll class */
        .no-scroll {
          overflow: hidden;
        }

        /* Base styles */
        .ad-body-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-body);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: var(--text-primary);
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
          /* Removed position: relative; as dropdown is gone */
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
          /* Removed cursor: pointer; as it's no longer clickable for dropdown */
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
          font-weight: 600;
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

        /* Sidebar for Mobile - removed navigation links */
        .ad-sidebar {
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

        .ad-sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .ad-sidebar {
            transform: translateX(100%);
          }
        }

        .ad-sidebar-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .ad-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        /* Main Content Area */
        .ad-main-content {
          flex: 1;
          padding: 1.5rem;
        }

        @media (min-width: 768px) {
          .ad-main-content {
            padding: 2rem;
          }
        }

        .ad-content-wrapper {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          background-color: var(--bg-body);
          border-radius: 0.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .ad-content-wrapper {
            padding: 0;
          }
        }

        .ad-dashboard-header {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0; /* Adjusted for radio buttons */
          padding: 0 1.5rem;
        }

        @media (min-width: 768px) {
          .ad-dashboard-header {
            flex-direction: row;
            align-items: center; /* This centers items vertically in a row, but we want text-align left for content */
          }
        }

        .ad-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: left; /* Ensure title text starts from left */
        }

        .ad-subtitle {
          color: var(--text-secondary);
          margin-top: 0.25rem;
          text-align: left; /* Ensure subtitle text starts from left */
        }

        /* Custom Radio Button Tabs Styles (Matching Screenshot) */
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

        .custom-radio-group-container .custom-radio-item input[type="radio"] {
          display: none; /* Hide the actual radio button */
        }

        .custom-radio-group-container .custom-radio-item .custom-radio-label {
          display: flex;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 9999px; /* Fully rounded for the active pill */
          border: none;
          padding: 0.75rem 1.5rem; /* Padding inside the tab button */
          transition: all 0.2s ease-in-out;
          white-space: nowrap; /* Prevent text wrapping */
          font-weight: 500; /* Medium font weight */
          line-height: 1; /* Ensure consistent height */
        }

        .custom-radio-group-container .custom-radio-item input[type="radio"]:checked + .custom-radio-label {
          background-color: var(--radio-item-bg-checked); /* Light blue background for active tab */
          color: var(--radio-item-text-checked); /* Blue text for active tab */
          font-weight: 600; /* Bolder text for active tab */
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* Subtle shadow for active tab */
        }

        .custom-radio-group-container .custom-radio-item .custom-radio-label:hover:not(.custom-radio-group-container .custom-radio-item input[type="radio"]:checked + .custom-radio-label) {
          background-color: var(--radio-item-hover-bg); /* Subtle hover background for inactive tabs */
        }
        /* End of Custom Radio Button Styles */


        /* User Management Specific Styles */
        .user-management-container {
            padding: 0 1.5rem 1.5rem; /* Consistent padding with other sections */
        }

        .user-management-box { /* New container for the user management section */
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem; /* Padding inside the box */
            margin-top: 1.5rem; /* Space from the radio buttons */
        }

        .user-management-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap; /* Allow wrapping on small screens */
            gap: 1rem; /* Space between elements when wrapped */
        }

        .user-management-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .user-search-add {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-grow: 1; /* Allow search and add to take available space */
            max-width: 400px; /* Limit width on larger screens */
        }

        .user-search-input {
            flex-grow: 1;
            padding: 0.6rem 1rem;
            border: 1px solid var(--search-input-border);
            border-radius: 0.5rem;
            background-color: var(--search-input-bg);
            color: var(--search-input-text);
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
            width: 100%;
            box-sizing: border-box;
        }

        .user-search-input::placeholder {
            color: var(--search-placeholder-color);
        }

        .user-search-input:focus {
            border-color: var(--add-user-btn-bg);
        }

        .add-user-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            background-color: var(--add-user-btn-bg);
            color: var(--add-user-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            white-space: nowrap; /* Prevent text from wrapping */
        }

        .add-user-btn:hover {
            background-color: var(--add-user-btn-hover-bg);
        }

        .user-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .user-card {
            background-color: var(--user-card-bg);
            border-radius: 0.75rem;
            box-shadow: var(--user-card-shadow);
            border: 1px solid var(--user-card-border);
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap; /* Allow content to wrap on small screens */
        }

        .user-card-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-grow: 1; /* Allow user info to take space */
        }

        .user-avatar {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            background-color: var(--user-avatar-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .user-avatar-icon {
            color: var(--user-avatar-icon);
            font-size: 1.5rem;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Ensure content starts on the left */
        }

        .user-name {
            font-size: 1rem;
            font-weight: 600;
            color: var(--user-name-color);
        }

        .user-email {
            font-size: 0.875rem;
            color: var(--user-email-color);
        }

        .user-roles {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .role-tag {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
        }

        .user-actions {
            display: flex;
            gap: 0.75rem;
            flex-shrink: 0; /* Prevent actions from shrinking */
        }

        .action-btn {
            padding: 0.5rem 1rem;
            border: 1px solid var(--action-btn-border);
            border-radius: 0.5rem;
            background-color: transparent;
            color: var(--action-btn-text);
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .action-btn:hover {
            background-color: var(--action-btn-hover-bg);
        }

        .delete-btn {
            background-color: var(--delete-btn-bg);
            color: var(--delete-btn-text);
            border-color: var(--delete-btn-bg); /* Match border to background */
        }

        .delete-btn:hover {
            background-color: var(--delete-btn-hover-bg);
            border-color: var(--delete-btn-hover-bg);
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--modal-overlay-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .modal-overlay.open {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background-color: var(--modal-bg);
            border-radius: 0.75rem;
            box-shadow: var(--modal-shadow);
            border: 1px solid var(--modal-border);
            width: 90%;
            max-width: 600px;
            padding: 1.5rem;
            position: relative;
            transform: translateY(-20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .modal-overlay.open .modal-content {
            transform: translateY(0);
            opacity: 1;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--modal-title-color);
            line-height: 1.2;
        }

        .modal-subtitle {
            font-size: 0.875rem;
            color: var(--modal-subtitle-color);
            margin-top: 0.25rem;
        }

        .modal-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--modal-close-btn-color);
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .modal-close-btn:hover {
            color: var(--modal-close-btn-hover);
        }

        .modal-form {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        @media (min-width: 640px) {
            .modal-form {
                grid-template-columns: 1fr 1fr;
            }
            .modal-form-full-width {
                grid-column: 1 / -1; /* Span full width */
            }
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--modal-label-color);
        }

        .form-input, .form-select {
            padding: 0.75rem 1rem;
            border: 1px solid var(--modal-input-border);
            border-radius: 0.5rem;
            background-color: var(--modal-input-bg);
            color: var(--modal-input-text);
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
            width: 100%;
            box-sizing: border-box; /* Include padding in width */
        }

        .form-input::placeholder {
            color: var(--modal-input-placeholder);
        }

        .form-input:focus, .form-select:focus {
            border-color: var(--modal-focus-border);
        }

        .password-input-group {
            display: flex;
            gap: 0.5rem;
            width: 100%;
        }

        .password-input-group .form-input {
            flex-grow: 1;
        }

        .generate-password-btn {
            padding: 0.75rem 1rem;
            background-color: var(--modal-generate-btn-bg);
            color: var(--modal-generate-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
            white-space: nowrap;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .generate-password-btn:hover {
            background-color: var(--modal-generate-btn-hover);
        }

        .role-description {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }

        .modal-footer {
            margin-top: 1.5rem;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem; /* Space between buttons in footer */
        }

        .create-user-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--modal-create-btn-bg);
            color: var(--modal-create-btn-text);
            border-radius: 0.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
        }

        .create-user-btn:hover {
            background-color: var(--modal-create-btn-hover);
        }

        /* Confirmation Modal Specific Styles */
        .confirm-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }

        .confirm-cancel-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--confirm-modal-cancel-btn-bg);
            color: var(--confirm-modal-cancel-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .confirm-cancel-btn:hover {
            background-color: var(--confirm-modal-cancel-btn-hover);
        }

        .confirm-delete-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--confirm-modal-danger-btn-bg);
            color: #ffffff;
            border-radius: 0.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .confirm-delete-btn:hover {
            background-color: var(--confirm-modal-danger-btn-hover);
        }

        /* Department View Styles */
        .department-management-container {
            padding: 0 1.5rem 1.5rem;
        }

        .department-management-box {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
            margin-top: 1.5rem;
        }

        .department-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .department-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .department-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }

        .create-department-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            background-color: var(--dept-create-btn-bg);
            color: var(--dept-create-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .create-department-btn:hover {
            background-color: var(--dept-create-btn-hover);
        }

        .department-stats-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
            .department-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
        }

        .department-stat-card {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border: 1px solid var(--border-color);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .department-stat-card-value {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .department-stat-card-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .department-stat-card-icon-wrapper {
            border-radius: 9999px;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            margin-left: auto; /* Push icon to the right */
        }

        .department-stat-card-icon-wrapper.total {
            background-color: var(--dept-card-icon-bg-1);
            color: var(--dept-card-icon-color-1);
        }
        .department-stat-card-icon-wrapper.active {
            background-color: var(--dept-card-icon-bg-2);
            color: var(--dept-card-icon-color-2);
        }
        .department-stat-card-icon-wrapper.employees {
            background-color: var(--dept-card-icon-bg-3);
            color: var(--dept-card-icon-color-3);
        }

        .department-search-filter {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        .department-search-input {
            flex-grow: 1;
            padding: 0.6rem 1rem;
            border: 1px solid var(--dept-search-input-border);
            border-radius: 0.5rem;
            background-color: var(--dept-search-input-bg);
            color: var(--dept-search-input-text);
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
            min-width: 200px;
        }

        .department-search-input::placeholder {
            color: var(--dept-search-placeholder-color);
        }

        .department-search-input:focus {
            border-color: var(--dept-create-btn-bg);
        }

        .department-status-select {
            padding: 0.6rem 1rem;
            border: 1px solid var(--dept-select-border);
            border-radius: 0.5rem;
            background-color: var(--dept-select-bg);
            color: var(--dept-select-text);
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        .department-status-select:focus {
            border-color: var(--dept-create-btn-bg);
        }

        .department-table-container {
            overflow-x: auto; /* Enable horizontal scrolling for small screens */
        }

        .department-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--bg-card); /* Ensure table background matches card */
            border-radius: 0.75rem; /* Apply border-radius to the table itself */
            overflow: hidden; /* Hide overflowing content for rounded corners */
        }

        .department-table th, .department-table td {
            padding: 1rem;
            text-align: left;
            white-space: nowrap; /* Prevent text wrapping in table cells */
        }

        .department-table thead {
            background-color: var(--dept-table-header-bg);
        }

        .department-table th {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--dept-table-header-text);
            border-bottom: 1px solid var(--dept-table-row-border);
        }

        .department-table tbody tr {
            border-bottom: 1px solid var(--dept-table-row-border);
        }

        .department-table tbody tr:last-child {
            border-bottom: none; /* No border for the last row */
        }

        .department-table tbody tr:hover {
            background-color: var(--dept-table-row-hover-bg);
        }

        .department-table td {
            font-size: 0.9rem;
            color: var(--dept-table-text-primary);
        }

        .department-table td.description {
            color: var(--dept-table-text-secondary);
            font-size: 0.8rem;
        }

        .department-table .employee-count {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            color: var(--dept-table-text-primary);
        }

        .department-table .status-tag {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
            background-color: var(--dept-active-tag-bg);
            color: var(--dept-active-tag-text);
        }

        .department-table .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .department-table .action-btn {
            padding: 0.4rem 0.7rem;
            border: 1px solid var(--action-btn-border);
            border-radius: 0.5rem;
            background-color: transparent;
            color: var(--action-btn-text);
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        }

        .department-table .action-btn:hover {
            background-color: var(--action-btn-hover-bg);
        }

        .department-table .delete-btn {
            background-color: var(--delete-btn-bg);
            color: var(--delete-btn-text);
            border-color: var(--delete-btn-bg);
        }

        .department-table .delete-btn:hover {
            background-color: var(--delete-btn-hover-bg);
            border-color: var(--delete-btn-hover-bg);
        }

        @media (max-width: 767px) {
            .user-management-header, .department-header {
                flex-direction: column;
                align-items: stretch;
            }
            .user-search-add {
                width: 100%;
                max-width: none;
                flex-direction: column;
                align-items: stretch;
            }
            .add-user-btn, .create-department-btn {
                width: 100%;
                justify-content: center;
            }
            .user-card {
                flex-direction: column;
                align-items: flex-start;
            }
            .user-card-left {
                width: 100%;
            }
            .user-actions {
                width: 100%;
                justify-content: flex-end; /* Align buttons to the right on small screens */
                margin-top: 1rem; /* Space between info and actions */
            }
            .department-search-filter {
                flex-direction: column;
                align-items: stretch;
            }
            .department-search-input, .department-status-select {
                width: 100%;
            }
        }
        `}
      </style>

      {/* Top Navigation Bar */}
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
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ad-icon-btn"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              // Sun Icon (FiSun equivalent)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.125rem', height: '1.125rem' }}>
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
            ) : (
              // Moon Icon (FiMoon equivalent)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.125rem', height: '1.125rem' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <div className="ad-user-info"> {/* Removed onClick handler */}
            <div className="ad-user-info-text">
              <p className="ad-user-name">{adminUserName}</p>
              {/* Added Admin Tag */}
              <span className="ad-admin-tag">
                {/* User Icon */}
                <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                </svg>
                Admin
              </span>
            </div>
            <div className="ad-initials-avatar">
              <span className="ad-initials-text">{adminInitials}</span>
            </div>
            {/* Removed dropdown arrow icon */}
          </div>

          {/* Removed Profile Dropdown Menu JSX block */}
        </div>

        <button
          className="ad-hamburger-menu"
          onClick={toggleSidebar}
        >
          {/* Hamburger Icon */}
          <svg className="ad-hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
          </svg>
        </button>
      </header>

      {/* Sidebar for Mobile */}
      <div
        className={`ad-sidebar ${isSidebarOpen ? 'ad-sidebar-open' : ''}`}
      >
        <button
          className="ad-sidebar-close-btn"
          onClick={toggleSidebar}
        >
          &times;
        </button>
        <nav className="ad-sidebar-nav">
          {/* Sidebar navigation links */}
          {adminViewOptions.map(option => (
            <a
              key={option.value}
              href="#"
              onClick={() => { setCurrentView(option.value); setIsSidebarOpen(false); }} // Close sidebar on click
              className={`ad-nav-link ${currentView === option.value ? 'ad-nav-link-active' : ''}`}
            >
              {option.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="ad-main-content">
        <div className="ad-content-wrapper">
          <div className="ad-dashboard-header">
            <div>
              {/* Changed title here */}
              <h1 className="ad-title">Admin Worksheet</h1>
              <p className="ad-subtitle">System administration and user management</p>
            </div>
          </div>

          {/* Custom Radio Button Navigation */}
          <div className="custom-radio-group-container">
            {adminViewOptions.map((option) => (
              <label className="custom-radio-item" key={option.value}>
                <input
                  type="radio"
                  name="adminView" // Use a consistent name for the radio group
                  value={option.value}
                  checked={currentView === option.value}
                  onChange={() => setCurrentView(option.value)}
                />
                <span className="custom-radio-label">{option.label}</span>
              </label>
            ))}
          </div>

          {currentView === 'userManagement' && (
            <div className="user-management-container">
              <div className="user-management-box"> {/* New User Management Box */}
                <div className="user-management-header">
                  <h2 className="user-management-title">User Management</h2>
                  <div className="user-search-add">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="user-search-input"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button className="add-user-btn" onClick={handleAddUserClick}>
                      {/* Plus Icon (Font Awesome: fa-plus) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}>
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                      </svg>
                      Add User
                    </button>
                  </div>
                </div>

                <div className="user-list">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div className="user-card" key={user.id}>
                        <div className="user-card-left">
                          <div className="user-avatar">
                            {/* User Icon for Avatar (Font Awesome: fa-user) */}
                            <svg className="user-avatar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                            </svg>
                          </div>
                          <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                            <div className="user-roles">
                              {user.roles.map(role => (
                                <span
                                  key={role}
                                  className="role-tag"
                                  style={{
                                    backgroundColor: getRoleTagBg(role),
                                    color: getRoleTagText(role),
                                  }}
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="user-actions">
                          <button className="action-btn" onClick={() => handleEditUserClick(user.id)}>
                            {/* Edit Icon (Font Awesome: fa-pen-to-square) */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                              <path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-56.6 56.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l56.6-56.6L362.4 97.5c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0zm-16.3 16.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM128 448H64V384c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32H128c17.7 0 32-14.3 32-32s-14.3-32-32-32zM480 352c-17.7 0-32 14.3-32 32v64H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32z"/>
                            </svg>
                            Edit
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteUserClick(user.id)}>
                            {/* Trash Can Icon (Font Awesome: fa-trash-can) */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ad-card" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p className="ad-subtitle">No users found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </div> {/* End of user-management-box */}
            </div>
          )}

          {currentView === 'departments' && (
            <div className="department-management-container">
              <div className="department-management-box"> {/* Added box for departments */}
                <div className="department-header">
                  <div>
                    <h2 className="department-title">Department Management</h2>
                    <p className="department-subtitle">Create and manage organizational departments</p>
                  </div>
                  <button className="create-department-btn">
                    {/* Plus Icon (Font Awesome: fa-plus) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                    </svg>
                    Create Department
                  </button>
                </div>

                <div className="department-stats-grid">
                  {/* Total Departments Card */}
                  <div className="department-stat-card">
                    <div className="department-stat-card-icon-wrapper total">
                      {/* Building Icon (Font Awesome: fa-building) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M192 32c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V32zm64 0V480H384V32H256zM64 128c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H64zm32 32V448h32V160H96z"/>
                      </svg>
                    </div>
                    <div className="department-stat-card-value">{departments.length}</div>
                    <div className="department-stat-card-label">Total Departments</div>
                  </div>

                  {/* Active Departments Card */}
                  <div className="department-stat-card">
                    <div className="department-stat-card-icon-wrapper active">
                      {/* Check Circle Icon (Font Awesome: fa-check-circle) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                      </svg>
                    </div>
                    <div className="department-stat-card-value">{departments.filter(d => d.status === 'active').length}</div>
                    <div className="department-stat-card-label">Active Departments</div>
                  </div>

                  {/* Total Employees Card - ICON CHANGED HERE */}
                  <div className="department-stat-card">
                    <div className="department-stat-card-icon-wrapper employees">
                      {/* Users Icon (Font Awesome: fa-users) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V64zm-80 0c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H360.3c-1.2-5.3-1.9-10.8-1.9-16.3V416H224c-70.7 0-128-57.3-128-128V64z"/>
                      </svg>
                    </div>
                    <div className="department-stat-card-value">{departments.reduce((sum, dept) => sum + dept.employees, 0)}</div>
                    <div className="department-stat-card-label">Total Employees</div>
                  </div>
                </div>

                <div className="department-search-filter">
                  <input
                    type="text"
                    placeholder="Search departments..."
                    className="department-search-input"
                    value={departmentSearchTerm}
                    onChange={handleDepartmentSearchChange}
                  />
                  {/* REMOVED "All Statuses" DROPDOWN HERE */}
                </div>

                <div className="department-table-container">
                  <table className="department-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Head of Department</th>
                        <th>Employees</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map(dept => (
                          <tr key={dept.id}>
                            <td>
                              <div>{dept.name}</div>
                              <div className="description">{dept.description}</div>
                            </td>
                            <td>{dept.head}</td>
                            <td>
                              <div className="employee-count">
                                {/* Users Icon (Font Awesome: fa-users) */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                                  <path d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V64zm-80 0c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H360.3c-1.2-5.3-1.9-10.8-1.9-16.3V416H224c-70.7 0-128-57.3-128-128V64z"/>
                                </svg>
                                {dept.employees}
                              </div>
                            </td>
                            <td>
                              <span className="status-tag" style={{
                                    backgroundColor: getRoleTagBg(dept.status),
                                    color: getRoleTagText(dept.status),
                                  }}>
                                {dept.status}
                              </span>
                            </td>
                            <td>{dept.createdDate}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn" onClick={() => handleEditDepartmentClick(dept.id)}>
                                  {/* Edit Icon (Font Awesome: fa-pen-to-square) */}
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                                    <path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-56.6 56.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l56.6-56.6L362.4 97.5c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0zm-16.3 16.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM128 448H64V384c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32H128c17.7 0 32-14.3 32-32s-14.3-32-32-32zM480 352c-17.7 0-32 14.3-32 32v64H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32z"/>
                                  </svg>
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDeleteDepartmentClick(dept.id)}>
                                  {/* Trash Can Icon (Font Awesome: fa-trash-can) */}
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No departments found matching your criteria.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div> {/* End of department-management-box */}
            </div>
          )}

          {currentView === 'clientManagement' && (
            <div className="ad-card" style={{padding: '2rem', textAlign: 'center'}}>
              <h2 className="ad-card-title">Client Management Section</h2>
              <p className="ad-subtitle">Content for client management will go here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Create New User Account Modal */}
      {isAddUserModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Create New User Account</h3>
                <p className="modal-subtitle">Create a new user account for the TechXplorers platform. Select the appropriate role and fill in all required information.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseAddUserModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleCreateUserAccount}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter full name"
                  value={newUser.fullName}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="role" className="form-label">Role *</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="role-description">
                  {roleOptions.find(option => option.value === newUser.role)?.description}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={newUser.department}
                  onChange={handleNewUserChange}
                >
                  {departmentOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="accountStatus" className="form-label">Account Status</label>
                <select
                  id="accountStatus"
                  name="accountStatus"
                  className="form-select"
                  value={newUser.accountStatus}
                  onChange={handleNewUserChange}
                >
                  {accountStatusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="temporaryPassword" className="form-label">Temporary Password *</label>
                <div className="password-input-group">
                  <input
                    type="text" // Can change to 'password' type if desired for masking
                    id="temporaryPassword"
                    name="temporaryPassword"
                    className="form-input"
                    placeholder="Enter temporary password"
                    value={newUser.temporaryPassword}
                    onChange={handleNewUserChange}
                    required
                  />
                  <button type="button" className="generate-password-btn" onClick={generateTemporaryPassword}>
                    {/* Eye Icon (Font Awesome: fa-eye) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.3 183.5 64 223.8 64 256c0 32.2 25.3 72.5 64.1 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.7 328.5 512 288.2 512 256c0-32.2-25.3-72.5-64.1-108.3C406.8 109.6 353.2 80 288 80zM96 256c0-10.8 2.8-21.6 7.9-31.7c17.5-35.3 47.6-64.7 85.8-84.3c15.2-7.8 31.5-12 48.3-12s33.1 4.2 48.3 12c38.2 19.6 68.3 49 85.8 84.3c5.1 10.1 7.9 20.9 7.9 31.7s-2.8 21.6-7.9 31.7c-17.5 35.3-47.6 64.7-85.8 84.3c-15.2 7.8-31.5 12-48.3 12s-33.1-4.2-48.3-12c-38.2-19.6-68.3-49-85.8-84.3C98.8 277.6 96 266.8 96 256zm192 0a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>
                    </svg>
                    Generate
                  </button>
                </div>
                <p className="role-description">The user will be prompted to change this password on first login.</p>
              </div>
              <div className="modal-footer modal-form-full-width">
                <button type="submit" className="create-user-btn">Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Account Modal */}
      {isEditUserModalOpen && currentUserToEdit && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit User Account</h3>
                <p className="modal-subtitle">Modify the details for {currentUserToEdit.fullName}.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseEditUserModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleUpdateUserAccount}>
              <div className="form-group">
                <label htmlFor="editFullName" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="editFullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter full name"
                  value={currentUserToEdit.fullName}
                  onChange={handleEditUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEmail" className="form-label">Email Address *</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={currentUserToEdit.email}
                  onChange={handleEditUserChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="editRole" className="form-label">Role *</label>
                <select
                  id="editRole"
                  name="role"
                  className="form-select"
                  value={currentUserToEdit.role}
                  onChange={handleEditUserChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="role-description">
                  {roleOptions.find(option => option.value === currentUserToEdit.role)?.description}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="editDepartment" className="form-label">Department</label>
                <select
                  id="editDepartment"
                  name="department"
                  className="form-select"
                  value={currentUserToEdit.department}
                  onChange={handleEditUserChange}
                >
                  {departmentOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editAccountStatus" className="form-label">Account Status</label>
                <select
                  id="editAccountStatus"
                  name="accountStatus"
                  className="form-select"
                  value={currentUserToEdit.accountStatus}
                  onChange={handleEditUserChange}
                >
                  {accountStatusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {/* Password field is typically not directly editable in an "edit" form for security reasons.
                  It would usually be a separate "Change Password" flow.
              */}
              <div className="modal-footer modal-form-full-width">
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseEditUserModal}>Cancel</button>
                <button type="submit" className="create-user-btn">Update User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteConfirmModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="modal-title">Confirm Deletion</h3>
                <p className="modal-subtitle">Are you sure you want to delete this user? This action cannot be undone.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCancelDelete}>&times;</button>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={handleCancelDelete}>Cancel</button>
              <button type="button" className="confirm-delete-btn" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {isEditDepartmentModalOpen && currentDepartmentToEdit && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit Department</h3>
                <p className="modal-subtitle">Modify the details for {currentDepartmentToEdit.name}.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseEditDepartmentModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleUpdateDepartment}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="editDeptName" className="form-label">Department Name *</label>
                <input
                  type="text"
                  id="editDeptName"
                  name="name"
                  className="form-input"
                  placeholder="Enter department name"
                  value={currentDepartmentToEdit.name}
                  onChange={handleEditDepartmentChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="editDeptDescription" className="form-label">Description</label>
                <input
                  type="text"
                  id="editDeptDescription"
                  name="description"
                  className="form-input"
                  placeholder="Enter department description"
                  value={currentDepartmentToEdit.description}
                  onChange={handleEditDepartmentChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDeptHead" className="form-label">Head of Department</label>
                <select
                  id="editDeptHead"
                  name="head"
                  className="form-select"
                  value={currentDepartmentToEdit.head}
                  onChange={handleEditDepartmentChange}
                >
                  {headOfDepartmentOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editDeptEmployees" className="form-label">Employees</label>
                <input
                  type="number"
                  id="editDeptEmployees"
                  name="employees"
                  className="form-input"
                  value={currentDepartmentToEdit.employees}
                  onChange={handleEditDepartmentChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDeptStatus" className="form-label">Status</label>
                <select
                  id="editDeptStatus"
                  name="status"
                  className="form-select"
                  value={currentDepartmentToEdit.status}
                  onChange={handleEditDepartmentChange}
                >
                  {departmentStatusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editDeptCreatedDate" className="form-label">Created Date</label>
                <input
                  type="text" // Could be 'date' type for date picker, but keeping 'text' for simplicity as per mock format
                  id="editDeptCreatedDate"
                  name="createdDate"
                  className="form-input"
                  value={currentDepartmentToEdit.createdDate}
                  onChange={handleEditDepartmentChange}
                />
              </div>
              <div className="modal-footer modal-form-full-width">
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseEditDepartmentModal}>Cancel</button>
                <button type="submit" className="create-user-btn">Update Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Department Confirmation Modal */}
      {isDeleteDepartmentConfirmModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="modal-title">Confirm Department Deletion</h3>
                <p className="modal-subtitle">Are you sure you want to delete the department "{departments.find(d => d.id === departmentToDeleteId)?.name}"? This action cannot be undone.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCancelDepartmentDelete}>&times;</button>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={handleCancelDepartmentDelete}>Cancel</button>
              <button type="button" className="confirm-delete-btn" onClick={handleConfirmDepartmentDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminWorksheet;
