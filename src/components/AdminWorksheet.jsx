import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';


const AdminWorksheet = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('clientManagement');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // --- Request Management States ---
  const [requestTab, setRequestTab] = useState('career');
  const [showCareerDetailsModal, setShowCareerDetailsModal] = useState(false);
  const [selectedCareerSubmission, setSelectedCareerSubmission] = useState(null);
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [selectedContactSubmission, setSelectedContactSubmission] = useState(null);
  const [showRequestConfirmModal, setShowRequestConfirmModal] = useState(false);
  const [requestConfirmAction, setRequestConfirmAction] = useState(null);
  const [requestConfirmMessage, setRequestConfirmMessage] = useState('');
  const [itemToProcess, setItemToProcess] = useState(null);
  // New states for Service Request tab
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);

  const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];

  // Mock data for Career Submissions
  const [careerSubmissions, setCareerSubmissions] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.d@example.com', mobile: '1234567890', role: 'Data Analyst', experience: 3, currentSalary: '70000', expectedSalary: '85000', resume: 'john_doe_resume.pdf', status: 'Pending' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.s@example.com', mobile: '0987654321', role: 'Scrum Master', experience: 5, currentSalary: '90000', expectedSalary: '110000', resume: 'jane_smith_cv.docx', status: 'Pending' },
    { id: 3, firstName: 'Peter', lastName: 'Jones', email: 'peter.j@example.com', mobile: '1122334455', role: 'Cyber Security', experience: 2, currentSalary: '65000', expectedSalary: '75000', resume: 'peter_jones_resume.pdf', status: 'Accepted' },
  ]);

  // Mock data for Contact Us Submissions
  const [contactSubmissions, setContactSubmissions] = useState([
    { id: 1, firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', phone: '5551234567', message: 'I am interested in your web development services. Can we schedule a call?', date: '2024-07-20' },
    { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob.b@example.com', phone: '5559876543', message: 'Question about pricing for digital marketing packages.', date: '2024-07-21' },
    { id: 3, firstName: 'Charlie', lastName: 'Davis', email: 'charlie.d@example.com', phone: '5551112222', message: 'Support request regarding a previous project. Need assistance.', date: '2024-07-22' },
  ]);

  // Mock data for Service Request Submissions
  const [serviceRequests, setServiceRequests] = useState([
    { id: 1, email: 'service.user1@example.com', message: 'I need help setting up my new software.', receivedDate: '2024-07-23' },
    { id: 2, email: 'service.user2@example.com', message: 'There is an issue with my account billing.', receivedDate: '2024-07-22' },
    { id: 3, email: 'service.user3@example.com', message: 'Requesting a feature enhancement for the dashboard.', receivedDate: '2024-07-21' },
  ]);

  const [employees, setemployees] = useState([
    {
      id: 1, name: 'Admin employee', workEmail: 'admin@techxplorers.in', roles: ['admin', 'active', 'Management'],
      firstName: "Admin", lastName: "employee", gender: "Male", dateOfBirth: "1985-05-20", maritalStatus: "Married",
      personalNumber: "9876543210", alternativeNumber: "8765432109", country: "India", state: "Telangana",
      city: "Hyderabad", address: "123 Tech Park, Hitech City", zipcode: "500081", dateOfJoin: "2020-01-15",
      personalEmail: "admin.personal@email.com"
    },
    {
      id: 2, workEmail: 'admin@techxplorers.in', roles: ['manager', 'active', 'Management'],
      firstName: "Sarah", lastName: "Wilson", gender: "Female", dateOfBirth: "1988-11-10", maritalStatus: "Single",
      personalNumber: "9123456780", alternativeNumber: "", country: "USA", state: "California",
      city: "San Francisco", address: "456 Bay Area", zipcode: "94105", dateOfJoin: "2021-03-22",
      personalEmail: "sarah.wilson@email.com"
    },
    {
      id: 3, workEmail: 'admin@techxplorers.in', roles: ['team lead', 'active', 'Tech Placement'],
      firstName: "Michael", lastName: "Johnson", gender: "Male", dateOfBirth: "1992-02-25", maritalStatus: "Single",
      personalNumber: "8123456789", alternativeNumber: "7123456789", country: "UK", state: "London",
      city: "London", address: "789 Tech Street", zipcode: "SW1A 0AA", dateOfJoin: "2022-07-01",
      personalEmail: "michael.j@email.com"
    },
    {
      id: 4, workEmail: 'admin@techxplorers.in', roles: ['asset manager', 'active', 'Operations'],
      firstName: "Asset", lastName: "Manager", gender: "Other", dateOfBirth: "1990-01-01", maritalStatus: "Single",
      personalNumber: "1234509876", alternativeNumber: "", country: "Canada", state: "Ontario",
      city: "Toronto", address: "101 Operations Ave", zipcode: "M5H 2N2", dateOfJoin: "2021-06-18",
      personalEmail: "asset.mgr@email.com"
    },
    {
      id: 5, workEmail: 'admin@techxplorers.in', roles: ['employee', 'active', 'Development'],
      firstName: "John", lastName: "Employee", gender: "Male", dateOfBirth: "1995-09-15", maritalStatus: "Married",
      personalNumber: "7890123456", alternativeNumber: "", country: "Australia", state: "New South Wales",
      city: "Sydney", address: "22 Dev Lane", zipcode: "2000", dateOfJoin: "2023-01-20",
      personalEmail: "john.emp@email.com"
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // States for modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditemployeeModalOpen, setIsEditemployeeModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteId, setemployeeToDeleteId] = useState(null);
  const [currentEmployeeToEdit, setCurrentemployeeToEdit] = useState(null);

  // State for the new employee form
  const [newemployee, setNewemployee] = useState({
    workEmail: '',
    role: 'employee',
    department: 'No department assigned',
    accountStatus: 'Active',
    temporaryPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    personalNumber: '',
    alternativeNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipcode: '',
    dateOfJoin: '',
    personalEmail: '',
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
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    head: 'Not assigned',
    status: 'active',
  });

  // NEW STATES FOR DEPARTMENT DETAILS VIEW
  const [isDepartmentDetailsModalOpen, setIsDepartmentDetailsModalOpen] = useState(false);
  const [selectedDepartmentForDetails, setSelectedDepartmentForDetails] = useState(null);
  const [employeesInSelectedDepartment, setEmployeesInSelectedDepartment] = useState([]);
  // State for managing employees in the edit department modal
  const [employeesToAddInDepartment, setEmployeesToAddInDepartment] = useState([]);
  const [availableEmployeesForDepartment, setAvailableEmployeesForDepartment] = useState([]);
  // NEW STATE FOR ADD EMPLOYEE TO DEPARTMENT
  const [isAddEmployeeToDepartmentModalOpen, setIsAddEmployeeToDepartmentModalOpen] = useState(false);
  const [employeeToAddToDepartment, setEmployeeToAddToDepartment] = useState(''); // To hold selected employee ID

  // Client Management States (for the inline display)
  const [clientFilter, setClientFilter] = useState('registered');
  // Removed selectedManagerPerClient as it's no longer needed for unassigned/restored flow
  const [editingClientId, setEditingClientId] = useState(null); // Still needed for 'active' client manager edit
  const [tempSelectedManager, setTempSelectedManager] = useState(''); // Still needed for 'active' client manager edit
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [isDeleteClientConfirmModalOpen, setIsDeleteClientConfirmModalOpen] = useState(false); // New state for client delete confirmation
  const [clientToDeleteId, setClientToDeleteId] = useState(null); // New state for client to delete

  // New states for Client Details and Edit Client Modals
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState(null);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [currentClientToEdit, setCurrentClientToEdit] = useState(null);

  // New state for service filter
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');


  // 1. UPDATE: Initialize state from 'admin_employees'
  const [employees2, setEmployees] = useState(() => {
    try {
      const savedEmployees = localStorage.getItem('admin_employees');
      return savedEmployees ? JSON.parse(savedEmployees) : []; // Default to an empty array
    } catch (error) {
      console.error("Failed to parse admin employees from local storage", error);
      return [];
    }
  });

  // 2. UPDATE: The first useEffect should save changes back to 'admin_employees'
  useEffect(() => {
    try {
      localStorage.setItem('admin_employees', JSON.stringify(employees2));
    } catch (error) {
      console.error("Failed to save admin employees to local storage", error);
    }
  }, [employees]);

  // 3. UPDATE: The second useEffect should listen for changes to 'admin_employees'
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'admin_employees' && event.newValue) {
        try {
          setEmployees(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Failed to parse admin employees from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 4. Set the default active tab to 'Review' to see the newly moved employees
  const [activeTab, setActiveTab] = useState('Review');



  

  const [clients, setClients] = useState([]);

  // useEffect to load clients from localStorage on component mount
  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('clients')) || [];
    if (storedClients.length > 0) {
      // Combine initial clients with stored clients, avoiding duplicates
      setClients(prevClients => {
        const clientIds = new Set(prevClients.map(c => c.id));
        const newClients = storedClients.filter(sc => !clientIds.has(sc.id));
        return [...prevClients, ...newClients];
      });
    }
  }, []);

  const managers = [
    { id: 1, firstName: 'Sreenivasulu', lastName: 'Sake' },
  ];

  const employees1 = [
    { id: 1, name: 'Admin User', roles: ['admin'], email: 'admin@example.com' }
  ];

  // Asset Management States
  const [assets, setAssets] = useState([
    { id: 1, tag: 'TXP-LT-001', name: 'Dell Latitude 5520', type: 'Laptop', status: 'assigned', assignedTo: 'John Smith', assignedDate: '2024-02-01' },
    { id: 2, tag: 'TXP-MON-001', name: 'Dell UltraSharp U2720Q', type: 'Monitor', status: 'assigned', assignedTo: 'Sarah Johnson', assignedDate: '2024-01-10' },
    { id: 3, tag: 'TXP-MB-001', name: 'iPhone 15 Pro', type: 'Mobile', status: 'assigned', assignedTo: 'Mike Chen', assignedDate: '2024-05-04' },
    { id: 4, tag: 'TXP-LT-002', name: 'HP Spectre x360', type: 'Laptop', status: 'available', assignedTo: null, assignedDate: null },
    { id: 5, tag: 'TXP-KB-001', name: 'Logitech MX Keys', type: 'Keyboard', status: 'available', assignedTo: null, assignedDate: null },
  ]);
  const [assetAssignments, setAssetAssignments] = useState([
    { id: 1, assetId: 1, employeeId: 5, assignedDate: '2024-02-01', reason: 'New employee laptop setup' },
    { id: 2, assetId: 2, employeeId: 2, assignedDate: '2024-01-10', reason: 'Manager workstation upgrade' },
    { id: 3, assetId: 3, employeeId: 3, assignedDate: '2024-05-04', reason: 'Team lead mobile device' },
  ]);

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Employee Profile Modal States
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [editedEmployeeDetails, setEditedEmployeeDetails] = useState({});

  const [isAssignAssetModalOpen, setIsAssignAssetModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assetId: '',
    employeeId: '',
    reason: '',
  });
  const [assetSearchTermInModal, setAssetSearchTermInModal] = useState('');
  const [employeeSearchTermInModal, setEmployeeSearchTermInModal] = useState('');



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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // State for Payment Management Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    description: '',
    transactionDate: '',
  });
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');


  // NEW: State for Generic Confirmation Modal
  const [isConfirmUpdateModalOpen, setIsConfirmUpdateModalOpen] = useState(false);
  const [confirmUpdateMessage, setConfirmUpdateMessage] = useState('');
  const [confirmActionType, setConfirmActionType] = useState(null); // 'departmentUpdate', 'employeeUpdate', 'employeeDelete', 'departmentDelete'
  const [pendingDepartmentUpdate, setPendingDepartmentUpdate] = useState(null); // To hold department data before confirmed update
  const [pendingEmployeeUpdate, setPendingEmployeeUpdate] = useState(null); // To hold employee data before confirmed update
  const [employeeToDeleteDetails, setEmployeeToDeleteDetails] = useState(null); // To hold employee details for delete confirmation
  const [departmentToDeleteDetails, setDepartmentToDeleteDetails] = useState(null); // To hold department details for delete confirmation

  // --- Request Management Handlers ---
  const handleViewCareerDetails = (submission) => {
    setSelectedCareerSubmission(submission);
    setShowCareerDetailsModal(true);
  };

  const handleCloseCareerDetailsModal = () => {
    setShowCareerDetailsModal(false);
    setSelectedCareerSubmission(null);
  };

  const handleViewContactDetails = (submission) => {
    setSelectedContactSubmission(submission);
    setShowContactDetailsModal(true);
  };

  const handleCloseContactDetailsModal = () => {
    setShowContactDetailsModal(false);
    setSelectedContactSubmission(null);
  };

  const handleViewServiceRequestDetails = (submission) => {
    setSelectedServiceRequest(submission);
    setShowServiceRequestModal(true);
  };

  const handleCloseServiceRequestModal = () => {
    setShowServiceRequestModal(false);
    setSelectedServiceRequest(null);
  };

  const handleRequestAction = (action, item) => {
    setItemToProcess(item);
    setRequestConfirmAction(action);
    let message = '';
    if (action === 'accept') message = `Are you sure you want to accept the application from ${item.firstName} ${item.lastName}?`;
    if (action === 'reject') message = `Are you sure you want to reject the application from ${item.firstName} ${item.lastName}?`;
    if (action === 'deleteContact') message = `Are you sure you want to delete the message from ${item.firstName} ${item.lastName}? This cannot be undone.`;
    if (action === 'deleteServiceRequest') message = `Are you sure you want to delete the service request from ${item.email}? This cannot be undone.`;
    setRequestConfirmMessage(message);
    setShowRequestConfirmModal(true);
  };

  const confirmRequestAction = () => {
    if (requestConfirmAction === 'accept') {
      setCareerSubmissions(prev => prev.map(sub => sub.id === itemToProcess.id ? { ...sub, status: 'Accepted' } : sub));
    }
    if (requestConfirmAction === 'reject') {
      setCareerSubmissions(prev => prev.map(sub => sub.id === itemToProcess.id ? { ...sub, status: 'Rejected' } : sub));
    }
    if (requestConfirmAction === 'deleteContact') {
      setContactSubmissions(prev => prev.filter(sub => sub.id !== itemToProcess.id));
    }
    if (requestConfirmAction === 'deleteServiceRequest') {
      setServiceRequests(prev => prev.filter(req => req.id !== itemToProcess.id));
    }
    closeRequestConfirmModal();
  };

  const closeRequestConfirmModal = () => {
    setShowRequestConfirmModal(false);
    setRequestConfirmAction(null);
    setRequestConfirmMessage('');
    setItemToProcess(null);
  };

  // --- End of Request Management Handlers ---


  // Effect to manage body scroll when any modal is open
  useEffect(() => {
    if (isAddEmployeeModalOpen || isEditemployeeModalOpen || isEditDepartmentModalOpen || isCreateDepartmentModalOpen || isPaymentModalOpen || isAssignAssetModalOpen || isDeleteClientConfirmModalOpen || isClientDetailsModalOpen || isEditClientModalOpen || isConfirmUpdateModalOpen || isDepartmentDetailsModalOpen || showEmployeeProfileModal || isAddEmployeeToDepartmentModalOpen || showCareerDetailsModal || showContactDetailsModal || showRequestConfirmModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Cleanup function
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isAddEmployeeModalOpen, isEditemployeeModalOpen, isEditDepartmentModalOpen, isCreateDepartmentModalOpen, isPaymentModalOpen, isAssignAssetModalOpen, isDeleteClientConfirmModalOpen, isClientDetailsModalOpen, isEditClientModalOpen, isConfirmUpdateModalOpen, isDepartmentDetailsModalOpen, showEmployeeProfileModal, isAddEmployeeToDepartmentModalOpen, showCareerDetailsModal, showContactDetailsModal, showRequestConfirmModal]);
  // Effect to close profile dropdown when clicking outside
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    (employee.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.personalEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.roles || []).some(role => (role || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add employee Modal Handlers
  const handleAddEmployeeClick = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    setNewemployee({
      role: 'employee',
      workEmail: '',
      department: 'No department assigned',
      accountStatus: 'Active',
      temporaryPassword: '',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      personalNumber: '',
      alternativeNumber: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zipcode: '',
      dateOfJoin: '',
      personalEmail: '',
    });
  };

  const handleNewemployeeChange = (e) => {
    const { name, value } = e.target;
    setNewemployee(prevemployee => ({
      ...prevemployee,
      [name]: value
    }));
  };

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewemployee(prevemployee => ({
      ...prevemployee,
      temporaryPassword: password
    }));
  };

  const handleCreateemployeeAccount = (e) => {
    e.preventDefault();
    const newemployeeId = employees.length > 0 ? Math.max(...employees.map(u => u.id)) + 1 : 1;
    const newRoles = [newemployee.role.toLowerCase()];
    if (newemployee.accountStatus.toLowerCase() === 'active') {
      newRoles.push('active');
    } else if (newemployee.accountStatus.toLowerCase() === 'inactive') {
      newRoles.push('inactive');
    } else if (newemployee.accountStatus.toLowerCase() === 'pending') {
      newRoles.push('pending');
    }
    if (newemployee.department !== 'No department assigned') {
      newRoles.push(newemployee.department.toLowerCase());
    }
    setemployees(prevemployees => [
      ...prevemployees,
      {
         id: newemployeeId,
    firstName: newemployee.firstName,
    lastName: newemployee.lastName,
    gender: newemployee.gender,
    dateOfBirth: newemployee.dateOfBirth,
    maritalStatus: newemployee.maritalStatus,
    personalNumber: newemployee.personalNumber,
    alternativeNumber: newemployee.alternativeNumber,
    personalEmail: newemployee.personalEmail,
    workEmail: newemployee.workEmail,
    country: newemployee.country,
    state: newemployee.state,
    city: newemployee.city,
    address: newemployee.address,
    zipcode: newemployee.zipcode,
    role: newemployee.role || 'employee',
    department: newemployee.department || 'No department assigned',
    accountStatus: newemployee.accountStatus || 'Active',
    dateOfJoin: newemployee.dateOfJoin || '',
    temporaryPassword: newemployee.temporaryPassword || '',
    roles: newRoles,
      }
    ]);
    handleCloseAddEmployeeModal();
  };

  const getEmployeeChanges = (original, updated) => {
    const changes = [];
    if (original.firstName !== updated.firstName) {
      changes.push(`Name from '${original.firstName}' to '${updated.firstName}'`);
    }
    if (original.personalEmail !== updated.personalEmail) {
      changes.push(`Email from '${original.personalEmail}' to '${updated.personalEmail}'`);
    }
    // Extract original role and department from roles array for comparison
    const originalRole = roleOptions.find(opt => original.roles.includes(opt.value.toLowerCase()))?.value || 'employee';
    const originalDepartment = departmentOptions.find(dept => original.roles.includes(dept.toLowerCase())) || 'No department assigned';
    const originalAccountStatus = accountStatusOptions.find(status => original.roles.includes(status.toLowerCase())) || 'Active';

    if (originalRole !== updated.role) {
      changes.push(`Role from '${originalRole}' to '${updated.role}'`);
    }
    if (originalDepartment !== updated.department) {
      changes.push(`Department from '${originalDepartment}' to '${updated.department}'`);
    }
    if (originalAccountStatus !== updated.accountStatus) {
      changes.push(`Account Status from '${originalAccountStatus}' to '${updated.accountStatus}'`);
    }
    return changes.length > 0 ? changes.join(', ') : 'no changes';
  };


  // Edit employee Modal Handlers
  const handleEditEmployeeClick = (employeeId) => {
    const employee = employees.find(u => u.id === employeeId);
    if (employee) {

      const employeeDepartment = departmentOptions.find(dept => (employee.roles || []).includes(dept.toLowerCase())) || 'No department assigned';
      const employeeAccountStatus = accountStatusOptions.find(status => (employee.roles || []).includes(status.toLowerCase())) || 'Active';
      const employeeRole = roleOptions.find(role => (employee.roles || []).includes(role.value.toLowerCase()))?.value || 'Employee';

      setCurrentemployeeToEdit({
        id: employee.id,
        role: employeeRole,
        department: employeeDepartment,
        accountStatus: employeeAccountStatus,
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        gender: employee.gender || '',
        dateOfBirth: employee.dateOfBirth || '',
        maritalStatus: employee.maritalStatus || '',
        personalNumber: employee.personalNumber || '',
        alternativeNumber: employee.alternativeNumber || '',
        country: employee.country || '',
        state: employee.state || '',
        city: employee.city || '',
        address: employee.address || '',
        zipcode: employee.zipcode || '',
        dateOfJoin: employee.dateOfJoin || '',
        personalEmail: employee.personalEmail || '',
        workEmail: employee.workEmail || '',

      });
      setIsEditemployeeModalOpen(true);
    }
  };

  const handleCloseEditEmployeeModal = () => {
    setIsEditemployeeModalOpen(false);
    setCurrentemployeeToEdit(null);
  };

  const handleEditemployeeChange = (e) => {
    const { name, value } = e.target;
    setCurrentemployeeToEdit(prevemployee => ({
      ...prevemployee,
      [name]: value
    }));
  };

  const handleUpdateEmployeeAccount = (e) => {
    e.preventDefault();
    const originalEmployee = employees.find(emp => emp.id === currentEmployeeToEdit.id);
    const changes = getEmployeeChanges(originalEmployee, currentEmployeeToEdit);

    if (changes === 'no changes') {
      setConfirmUpdateMessage('No changes were made to the employee details.');
      setIsConfirmUpdateModalOpen(true);
      setConfirmActionType(null); // No action needed
      return;
    }

    setPendingEmployeeUpdate(currentEmployeeToEdit);
    setConfirmUpdateMessage(`Are you sure you want to update employee '${originalEmployee.name}' with the following changes: ${changes}?`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('employeeUpdate');
  };

  const confirmEmployeeUpdate = () => {
    setemployees(prevemployees => prevemployees.map(employee => {
      if (employee.id === pendingEmployeeUpdate.id) {
        // Filter out old department role before adding the new one
        const baseRoles = employee.roles.filter(r => !departmentOptions.map(d => d.toLowerCase()).includes(r));

        const updatedRoles = [pendingEmployeeUpdate.role.toLowerCase()];
        if (pendingEmployeeUpdate.accountStatus) updatedRoles.push(pendingEmployeeUpdate.accountStatus.toLowerCase());
        if (pendingEmployeeUpdate.department && pendingEmployeeUpdate.department !== 'No department assigned') {
          updatedRoles.push(pendingEmployeeUpdate.department.toLowerCase());
        }
        return {
          ...employee,
          roles: updatedRoles,
          firstName: pendingEmployeeUpdate.firstName,
          lastName: pendingEmployeeUpdate.lastName,
          gender: pendingEmployeeUpdate.gender,
          dateOfBirth: pendingEmployeeUpdate.dateOfBirth,
          maritalStatus: pendingEmployeeUpdate.maritalStatus,
          personalNumber: pendingEmployeeUpdate.personalNumber,
          alternativeNumber: pendingEmployeeUpdate.alternativeNumber,
          country: pendingEmployeeUpdate.country,
          state: pendingEmployeeUpdate.state,
          city: pendingEmployeeUpdate.city,
          address: pendingEmployeeUpdate.address,
          zipcode: pendingEmployeeUpdate.zipcode,
          dateOfJoin: pendingEmployeeUpdate.dateOfJoin,
          personalEmail: pendingEmployeeUpdate.personalEmail,
          workEmail: pendingEmployeeUpdate.workEmail,

        };
      }
      return employee;
    }));
    handleCloseEditEmployeeModal();
    setIsConfirmUpdateModalOpen(false);
    setPendingEmployeeUpdate(null);
    setConfirmActionType(null);
  };

  // Delete employee Confirmation Handlers
  const handleDeleteemployeeClick = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setEmployeeToDeleteDetails(employee);
    setConfirmUpdateMessage(`Are you sure you want to delete employee '${employee.name}' (${employee.email})? This action cannot be undone.`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('employeeDelete');
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalOpen(false);
    setemployeeToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    setemployees(employees.filter(employee => employee.id !== employeeToDeleteId));
    setIsDeleteConfirmModalOpen(false);
    setemployeeToDeleteId(null);
  };

  const handleRemoveEmployeeFromDepartment = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && currentDepartmentToEdit) {
      // Remove employee from the department's employee list in the modal state
      setEmployeesInSelectedDepartment(prev => prev.filter(id => id !== employee.id));
      // Add back to available employees if not 'client' or 'admin'
      setAvailableEmployeesForDepartment(prev => [...prev, employee]);
    }
  };

  const confirmEmployeeDelete = () => {





    setemployees(employees.filter(employee => employee.id !== employeeToDeleteDetails.id));
    setIsConfirmUpdateModalOpen(false);
    setEmployeeToDeleteDetails(null);
    setConfirmActionType(null);
  };

  // Department Search and Filter Handlers
  const handleDepartmentSearchChange = (event) => {
    setDepartmentSearchTerm(event.target.value);
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(departmentSearchTerm.toLowerCase());
  });

  // Helper to get department changes for confirmation message
  const getDepartmentChanges = (original, updated) => {
    const changes = [];
    if (original.name !== updated.name) {
      changes.push(`Department Name from '${original.name}' to '${updated.name}'`);
    }
    if (original.description !== updated.description) {
      changes.push(`Description from '${original.description}' to '${updated.description}'`);
    }
    if (original.head !== updated.head) {
      changes.push(`Head of Department from '${original.head}' to '${updated.head}'`);
    }
    // Compare employee counts
    const currentEmployeesInDept = employees.filter(emp =>
      (emp.roles || []).includes(department.name.toLowerCase())
    );
    const updatedEmployeesInDeptCount = employeesToAddInDepartment.length;

    if (currentEmployeesInDept.length !== updatedEmployeesInDeptCount) {
      changes.push(`Employee count from '${currentEmployeesInDept.length}' to '${updatedEmployeesInDeptCount}'`);
    }

    if (original.status !== updated.status) {
      changes.push(`Status from '${original.status}' to '${updated.status}'`);
    }
    if (original.createdDate !== updated.createdDate) {
      changes.push(`Created Date from '${original.createdDate}' to '${updated.createdDate}'`);
    }
    return changes.length > 0 ? changes.join(', ') : 'no changes';
  };

  // Department Edit Handlers
   const handleEditDepartmentClick = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      const currentEmployeesInDept = employees.filter(emp =>
        emp.roles.includes(department.name.toLowerCase())
      );
      setEmployeesInSelectedDepartment(currentEmployeesInDept);
      
      const available = employees.filter(emp => !emp.roles.includes(department.name.toLowerCase()));
      setAvailableEmployeesForDepartment(available);

      setCurrentDepartmentToEdit({ ...department });
      setIsEditDepartmentModalOpen(true);
    }
  };

  const handleCloseEditDepartmentModal = () => {
    setIsEditDepartmentModalOpen(false);
    setCurrentDepartmentToEdit(null);
    setEmployeesToAddInDepartment([]);
    setAvailableEmployeesForDepartment([]);
  };

  const handleEditDepartmentChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartmentToEdit(prevDept => ({
      ...prevDept,
      [name]: value
    }));
  };

  const handleAddEmployeeToDepartment = (employeeId) => {
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    if (employee && currentDepartmentToEdit) {
      // Add employee to the department's employee list in the modal state
      setEmployeesInSelectedDepartment(prev => [...prev, employee]);
      // Remove from available employees
      setAvailableEmployeesForDepartment(prev => prev.filter(emp => emp.id !== employee.id));
    }

  };


 const handleUpdateDepartment = (e) => {
    e.preventDefault();
    setPendingDepartmentUpdate({
        ...currentDepartmentToEdit,
        employeeIds: employeesInSelectedDepartment.map(e => e.id)
    });
    setConfirmUpdateMessage(`Are you sure you want to update department '${currentDepartmentToEdit.name}'?`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('departmentUpdate');
  };

  const confirmDepartmentUpdate = () => {
    setDepartments(prev => prev.map(dept => 
      dept.id === pendingDepartmentUpdate.id ? { ...pendingDepartmentUpdate, employees: pendingDepartmentUpdate.employeeIds.length } : dept
    ));
    
    // Update employee roles
    const deptNameLower = pendingDepartmentUpdate.name.toLowerCase();
    setEmployees(prev => prev.map(emp => {
        const isNowInDept = pendingDepartmentUpdate.employeeIds.includes(emp.id);
        const wasInDept = emp.roles.includes(deptNameLower);

        if(isNowInDept && !wasInDept) {
            // Add department role
            return {...emp, roles: [...emp.roles.filter(r => !departmentOptions.includes(r)), deptNameLower]};
        }
        if(!isNowInDept && wasInDept) {
            // Remove department role
            return {...emp, roles: emp.roles.filter(r => r !== deptNameLower)};
        }
        return emp;
    }));

    handleCloseEditDepartmentModal();
    setIsConfirmUpdateModalOpen(false);
    setPendingDepartmentUpdate(null);
  };



  // Department Delete Confirmation Handlers
  const handleDeleteDepartmentClick = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    setDepartmentToDeleteDetails(department);
    setConfirmUpdateMessage(`Are you sure you want to delete the department '${department.name}'? This action cannot be undone.`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('departmentDelete');
  };

  const confirmDepartmentDelete = () => {
    setDepartments(departments.filter(dept => dept.id !== departmentToDeleteDetails.id));
    // Also remove the department role from any employees who had it
    setemployees(prevEmployees => prevEmployees.map(emp => ({
      ...emp,
      roles: emp.roles.filter(role => role !== departmentToDeleteDetails.name.toLowerCase())
    })));




    setIsConfirmUpdateModalOpen(false);
    setDepartmentToDeleteDetails(null);
    setConfirmActionType(null);
  };



  // Department Details Modal Handlers
  const handleViewDepartmentDetails = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      const employeesInDept = employees.filter(emp =>
        emp.roles.includes(department.name.toLowerCase())
      );
      setSelectedDepartmentForDetails(department);
      setEmployeesInSelectedDepartment(employeesInDept);
      setIsDepartmentDetailsModalOpen(true);
    }
  };

  const handleCloseViewDepartmentDetailsModal = () => {
    setIsViewDepartmentDetailsModalOpen(false);
    setSelectedDepartmentForDetails(null);
    setEmployeesInSelectedDepartment([]);
  };

  const handleCloseDepartmentDetailsModal = () => {
    setIsDepartmentDetailsModalOpen(false);
    setSelectedDepartmentForDetails(null);
    setEmployeesInSelectedDepartment([]);
  };


  // NEW: Add Employee to Department Handlers
  const handleAddEmployeeToDepartmentClick = () => {
    setIsAddEmployeeToDepartmentModalOpen(true);
  };

  const handleCloseAddEmployeeToDepartmentModal = () => {
    setIsAddEmployeeToDepartmentModalOpen(false);
    setEmployeeToAddToDepartment('');
  };

  const handleSaveEmployeeToDepartment = () => {
    if (employeeToAddToDepartment && currentDepartmentToEdit) {
      const employeeId = parseInt(employeeToAddToDepartment);
      setemployees(prevEmployees => prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          // Remove any existing department role and add the new one
          const updatedRoles = emp.roles.filter(role => !departmentOptions.map(d => d.toLowerCase()).includes(role));
          updatedRoles.push(currentDepartmentToEdit.name.toLowerCase());
          return { ...emp, roles: updatedRoles };
        }
        return emp;
      }));

      // Update the employee count in the department.
      setDepartments(prevDepartments => prevDepartments.map(dept => {
        if (dept.id === currentDepartmentToEdit.id) {
          const updatedEmployeesInDept = employees.filter(emp => emp.roles.includes(dept.name.toLowerCase()) || emp.id === employeeId).length;
          return { ...dept, employees: updatedEmployeesInDept };
        }
        return dept;
      }));


      handleCloseAddEmployeeToDepartmentModal();
    }
  };



  // Create Department Modal Handlers
  const handleCreateDepartmentClick = () => {
    setIsCreateDepartmentModalOpen(true);
  };

  const handleCloseCreateDepartmentModal = () => {
    setIsCreateDepartmentModalOpen(false);
    setNewDepartment({
      name: '',
      description: '',
      head: 'Not assigned',
      status: 'active',
    });
  };

  const handleNewDepartmentChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prevDept => ({
      ...prevDept,
      [name]: value
    }));
  };

  const handleSaveNewDepartment = (e) => {
    e.preventDefault();
    const newDeptId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    setDepartments(prevDepartments => [
      ...prevDepartments,
      {
        id: newDeptId,
        name: newDepartment.name,
        description: newDepartment.description,
        head: newDepartment.head,
        employees: 0,
        status: newDepartment.status,
        createdDate: formattedDate,
      }
    ]);
    handleCloseCreateDepartmentModal();
  };


  // Client Management Handlers
  const handleAcceptClient = (clientId) => {
    console.log(`Accept client with ID: ${clientId}`);
    // Move client from 'registered' to 'unassigned'
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['unassigned'], manager: null } : client
    ));
  };

  const handleDeclineClient = (clientId) => {
    console.log(`Decline client with ID: ${clientId}`);
    // Move client to 'rejected'
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['rejected'] } : client
    ));
  };

  const handleDeleteRejectedClient = (clientId) => {
    setClientToDeleteId(clientId);
    setIsDeleteClientConfirmModalOpen(true);
  };

  const handleConfirmClientDelete = () => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientToDeleteId));
    setIsDeleteClientConfirmModalOpen(false);
    setClientToDeleteId(null);
  };

  const handleCancelClientDelete = () => {
    setIsDeleteClientConfirmModalOpen(false);
    setClientToDeleteId(null);
  };


  // In AdminWorksheet.js

  const handleAssignClient = (clientId) => {
    const clientToAssign = clients.find(c => c.id === clientId);

    if (clientToAssign && clientToAssign.manager) {
      console.log(`Assign client ${clientId} to manager ${clientToAssign.manager}`);

      // 1. UPDATE THE LOCAL STATE TO MOVE THE CLIENT TO THE 'ACTIVE' TAB
      const updatedClient = { ...clientToAssign, displayStatuses: ['active'] };
      setClients(prevClients => prevClients.map(client =>
        client.id === clientId ? updatedClient : client
      ));

      // 2. NEW: SEND THE ASSIGNED CLIENT TO THE MANAGER'S LOCAL STORAGE
      try {
        // Get the current list of clients waiting for the manager
        const managerUnassignedClients = JSON.parse(localStorage.getItem('manager_unassigned_clients') || '[]');

        // Add the newly assigned client to the list
        const updatedManagerList = [updatedClient, ...managerUnassignedClients];

        // Save the updated list back to local storage
        localStorage.setItem('manager_unassigned_clients', JSON.stringify(updatedManagerList));

      } catch (error) {
        console.error("Failed to update manager's local storage", error);
      }

    } else {
      alert('Please select a manager first.');
    }
  };

  const handleRestoreClient = (clientId) => {
    console.log(`Restore client with ID: ${clientId}`);
    // Move client from 'rejected' to 'unassigned'
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['unassigned'], manager: null } : client
    ));
  };

  const handleEditManager = (client) => {
    setEditingClientId(client.id);
    setTempSelectedManager(client.manager || '');
  };

  const handleSaveManagerChange = (clientId) => {
    console.log(`Save manager change for client ${clientId} to ${tempSelectedManager}`);
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, manager: tempSelectedManager } : client
    ));
    setEditingClientId(null);
    setTempSelectedManager('');
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setTempSelectedManager('');
  };

  const handleClientSearchChange = (event) => {
    setClientSearchTerm(event.target.value);
  };

  const getFilteredClients = () => {
    let filtered = clients.filter(client => client.displayStatuses.includes(clientFilter));

    if (selectedServiceFilter !== 'All') {


      filtered = filtered.filter(client => client.service === selectedServiceFilter);

    }

    return filtered.filter(client =>
      [client.name, client.email, client.mobile, client.jobsApplyFor, client.country, client.service]
        .some(field => field && String(field).toLowerCase().includes(clientSearchTerm.toLowerCase()))
    );
  };

  const filteredClients = getFilteredClients();


  // Client Details and Edit Client Modals Handlers
  const handleViewClientDetails = (client) => {
    setSelectedClientForDetails(client);
    setIsClientDetailsModalOpen(true);
  };

  const handleCloseClientDetailsModal = () => {
    setIsClientDetailsModalOpen(false);
    setSelectedClientForDetails(null);
  };

  const handleEditClientDetailsClick = () => {
    setCurrentClientToEdit({ ...selectedClientForDetails });
    setIsClientDetailsModalOpen(false); // Close details modal
    setIsEditClientModalOpen(true); // Open edit modal
  };

  const handleCloseEditClientModal = () => {
    setIsEditClientModalOpen(false);
    setCurrentClientToEdit(null);
  };

  const handleEditClientChange = (e) => {
    const { name, value } = e.target;
    setCurrentClientToEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClientDetails = (e) => {
    e.preventDefault();
    setClients(prevClients => prevClients.map(client =>
      client.id === currentClientToEdit.id ? { ...currentClientToEdit } : client
    ));
    handleCloseEditClientModal();
  };


  // Define options for the radio button navigation
  const adminViewOptions = [
    { value: 'clientManagement', label: 'Client Management' },
    { value: 'departments', label: 'Departments' },
    { value: 'employeeManagement', label: 'Employee Management' },
    { value: 'assetManagement', label: 'Asset Management' },
    { value: 'requestManagement', label: 'Request Management' },
  ];

  // Data for dropdowns
  const roleOptions = [
    { value: 'Administrator', label: 'Administrator', description: 'Full system access and employee management' },
    { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
    { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
    { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
    { value: 'employee', label: 'employee', description: 'General employee access for job seeking' },
    { value: 'Client', label: 'Client', description: 'Client access for job applications and hiring' },
    { value: 'Asset Manager', label: 'Asset Manager', description: 'Asset and equipment management' },
  ];

  const departmentOptions = departments.map(d => d.name);
  departmentOptions.unshift('No department assigned');

  // Head of Department options for the edit department modal.

  const headOfDepartmentOptions = ['Not assigned', ...employees.filter(e => e.roles.includes('manager') || e.roles.includes('team lead')).map(e => e.name)];


  const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const departmentStatusOptions = ['active', 'inactive', 'pending'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];


  // Payment Modal Handlers
  const handleOpenPaymentModal = (client) => {
    setSelectedClientForPayment(client);
    setPaymentDetails({
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().slice(0, 10),
    });
    setGeneratedPaymentLink('');
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedClientForPayment(null);
    setPaymentDetails({
      amount: '',
      description: '',
      transactionDate: '',
    });
    setGeneratedPaymentLink('');
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGeneratePaymentLink = () => {


    const mockLink = `https://31228083-199d-476b-a6cb-d029dbd0ce9-figmaiframepreview.figma.site#/pay/1/INV-14752-12703`;
    setGeneratedPaymentLink(mockLink);
    console.log('Generating payment link with details:', paymentDetails, ' for client:', selectedClientForPayment);
  };

  const handlePayNow = () => {
    console.log('Processing immediate payment with details:', paymentDetails, ' for client:', selectedClientForPayment);

    handleClosePaymentModal();
  };

  const handleCopyLink = () => {
    if (generatedPaymentLink) {

      const textArea = document.createElement('textarea');
      textArea.value = generatedPaymentLink;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Payment link copied using execCommand!');
      } catch (e) {
        console.error('Fallback copy failed: ', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSendEmail = () => {
    console.log('Sending email with link:', generatedPaymentLink);

  };

  const handlePreviewLink = () => {
    if (generatedPaymentLink) {
      window.open(generatedPaymentLink, '_blank');
    }
  };

  // Asset Management Handlers
  const handleAssignAssetClick = () => {
    setIsAssignAssetModalOpen(true);
  };

  const handleCloseAssignAssetModal = () => {
    setIsAssignAssetModalOpen(false);
    setNewAssignment({
      assetId: '',
      employeeId: '',
      reason: '',
    });
    setAssetSearchTermInModal('');
    setEmployeeSearchTermInModal('');
  };

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignAsset = (e) => {
    e.preventDefault();
    const { assetId, employeeId, reason } = newAssignment;

    if (!assetId || !employeeId || !reason) {
      // Replaced alert with a console.error for better practice in React apps
      console.error('Please fill in all required fields.');
      return;
    }

    const assignedAsset = assets.find(asset => asset.id === parseInt(assetId));
    const assignedEmployee = employees.find(emp => emp.id === parseInt(employeeId));

    if (assignedAsset && assignedEmployee) {
      const newAssignmentEntry = {
        id: assetAssignments.length > 0 ? Math.max(...assetAssignments.map(a => a.id)) + 1 : 1,
        assetId: assignedAsset.id,
        employeeId: assignedEmployee.id,
        assignedDate: new Date().toISOString().slice(0, 10),
        reason: reason,
      };

      setAssetAssignments(prev => [...prev, newAssignmentEntry]);


      setAssets(prevAssets => prevAssets.map(asset =>
        asset.id === assignedAsset.id
          ? { ...asset, status: 'assigned', assignedTo: assignedEmployee.name, assignedDate: newAssignmentEntry.assignedDate }
          : asset
      ));

      handleCloseAssignAssetModal();
    } else {
      console.error('Selected asset or employee not found.');
    }
  };

  const filteredAvailableAssets = assets.filter(asset =>
    asset.status === 'available' &&
    (asset.tag.toLowerCase().includes(assetSearchTermInModal.toLowerCase()) ||
      asset.name.toLowerCase().includes(assetSearchTermInModal.toLowerCase()) ||
      asset.type.toLowerCase().includes(assetSearchTermInModal.toLowerCase()))
  );

  const filteredEmployeesForAssignment = employees.filter(employee =>
    (employee.name || '').toLowerCase().includes(employeeSearchTermInModal.toLowerCase()) ||
    (employee.email || '').toLowerCase().includes(employeeSearchTermInModal.toLowerCase())
  );

  useEffect(() => {
    try {
      // This saves the entire 'clients' list, including their current statuses,
      // so the correct clients appear in the correct tabs on page reload.
      localStorage.setItem('admin_clients', JSON.stringify(clients));
    } catch (error) {
      console.error("Failed to save admin clients to local storage", error);
    }
  }, [clients]); // This runs whenever the 'clients' state changes



  // Helper to get role/status tag background color
  const getRoleTagBg = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'var(--admin-tag-bg)';
      case 'administrator': return 'var(--admin-tag-bg)';
      case 'manager': return '#E0F7FA';
      case 'team lead': return '#F3E5F5';
      case 'asset manager': return '#FFF3E0';
      case 'employee': return '#E1F5FE';
      case 'client': return '#E8F5E9';
      case 'user': return '#FBE9E7';
      case 'active': return '#E8F5E9';
      case 'inactive': return '#FFEBEE';
      case 'management': return '#E3F2FD';
      case 'tech placement': return '#FCE4EC';
      case 'operations': return '#F5F5DC';
      case 'development': return '#EDE7F6';
      case 'design': return '#FFE0B2';
      case 'marketing': return '#CFD8DC';
      case 'sales': return '#DCEDC8';
      case 'finance': return '#FFCDD2';
      case 'support': return '#C8E6C9';
      case 'quality assurance': return '#BBDEFB';
      case 'hr': return '#F0F4C3';
      case 'external': return '#F9FBE7';

      case 'registered': return '#DBEAFE';
      case 'unassigned': return '#FEF3C7';
      case 'rejected': return '#FEE2E2';
      case 'restored': return '#EDE9FE';

      case 'paid': return '#D9F5E6';
      case 'pending': return '#FFFDE7';
      case 'n/a': return '#E5E7EB';

      case 'assigned': return '#E0F2FE';
      case 'available': return '#D9F5E6';
      case 'accepted': return '#C8E6C9';
      default: return 'var(--border-color)';
    }
  };

  // Helper to get role/status tag text color
  const getRoleTagText = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'var(--admin-tag-text)';
      case 'administrator': return 'var(--admin-tag-text)';
      case 'manager': return '#00BCD4';
      case 'team lead': return '#9C27B0';
      case 'asset manager': return '#FF9800';
      case 'employee': return '#2196F3';
      case 'client': return '#4CAF50';
      case 'user': return '#FF5722';
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      case 'management': return '#2196F3';
      case 'tech placement': return '#E91E63';
      case 'operations': return '#795548';
      case 'development': return '#5E35B1';
      case 'design': return '#FB8C00';
      case 'marketing': return '#607D8B';
      case 'sales': return '#8BC34A';
      case 'finance': return '#E53935';
      case 'support': return '#388E3C';
      case 'quality assurance': return '#1976D2';
      case 'hr': return '#AFB42B';
      case 'external': return '#AFB42B';

      case 'registered': return '#1D4ED8';
      case 'unassigned': return '#B45309';
      case 'rejected': return '#B91C1C';
      case 'restored': return '#6D28D9';

      case 'paid': return '#28A745';
      case 'pending': return '#B45309';
      case 'n/a': return '#6B7280';
      case 'accepted': return '#388E3C';


      case 'assigned': return '#2563EB';
      case 'available': return '#28A745';
      default: return 'var(--text-secondary)';
    }
  };

  const serviceOptions = [
    'All',
    'Mobile Development',
    'Web Development',
    'Digital Marketing',
    'IT Talent Supply',
    'Job Supporting & Consulting',
    'Cyber Security'
  ];

  // Employee Profile Modal Handlers
  const handleOpenProfileModal = () => {
    // Assuming the admin is the user with the 'admin' role.
    const adminUser = employees.find(e => e.roles.includes('admin'));
    if (adminUser) {
      const details = {
        name: adminUser.name,
        employeeId: `EMP${String(adminUser.id).padStart(3, '0')}`,
        email: adminUser.email,
        mobile: '+1 (555) 123-4567', // Mock data as it's not in the user object
        lastLogin: '2025-07-15 10:30 AM' // Mock data
      };
      setEmployeeDetails(details);
      setEditedEmployeeDetails(details);
      setShowEmployeeProfileModal(true);
      setIsEditingProfile(false);
    }
  };

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployeeDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSaveProfileChanges = () => {
    setEmployeeDetails(editedEmployeeDetails);
    // Also update the main 'employees' array for the logged-in user
    const adminUser = employees.find(e => e.roles.includes('admin'));
    if (adminUser) {
      setemployees(prevEmployees => prevEmployees.map(emp =>
        emp.id === adminUser.id ? { ...emp, name: editedEmployeeDetails.name } : emp
      ));
    }
    setIsEditingProfile(false);
  };

  const handleCancelEditProfile = () => {
    setEditedEmployeeDetails(employeeDetails); // Revert changes from form
    setIsEditingProfile(false);
  };

  // Styles for the Employee Profile Modal
  const modalHeaderStyle = {
    backgroundColor: isDarkMode ? '#2d3748' : '#f9fafb',
    color: isDarkMode ? '#e2e8f0' : '#1f2937',
    borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'}`,
    fontFamily: 'Inter, sans-serif'
  };

  const modalTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
  };

  const modalBodyStyle = {
    backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
    color: isDarkMode ? '#e2e8f0' : '#1f2937',
    padding: '20px',
    fontFamily: 'Inter, sans-serif'
  };

  const modalFooterStyle = {
    backgroundColor: isDarkMode ? '#2d3748' : '#f9fafb',
    borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '15px 20px',
  };

  const modalFormFieldGroupStyle = {
    marginBottom: '15px'
  };

  const modalLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: isDarkMode ? '#cbd5e0' : '#374151'
  };

  const modalInputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '0.375rem',
    border: `1px solid ${isDarkMode ? '#4a5568' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    color: isDarkMode ? '#e2e8f0' : '#1f2937'
  };

  const modalInputDisabledStyle = {
    ...modalInputStyle,
    backgroundColor: isDarkMode ? '#4a5568' : '#e5e7eb',
    cursor: 'not-allowed'
  }

  const modalViewDetailItemStyle = {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    color: isDarkMode ? '#cbd5e0' : '#374151'
  };

  const modalCancelButtonStyle = {
    padding: '10px 20px',
    borderRadius: '0.375rem',
    border: `1px solid ${isDarkMode ? '#4a5568' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    color: isDarkMode ? '#f9fafb' : '#374151',
    cursor: 'pointer'
  };

  const modalAddButtonPrimaryStyle = {
    padding: '10px 20px',
    borderRadius: '0.375rem',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer'
  };


  const renderClientTable = (clientsToRender, serviceType, currentClientFilter, title = '') => {
    const headers = ['First Name', 'Last Name', 'Mobile', 'Email', serviceType === 'Job Supporting & Consulting' ? 'Jobs Apply For' : 'Service', 'Registered Date', 'Country'];











    if (serviceType === 'Job Supporting & Consulting') headers.push('Visa Status');
    if (['unassigned', 'active', 'restored'].includes(currentClientFilter)) headers.push('Manager');






    headers.push('Details', 'Actions');


    return (
      <div className="client-table-container">
        {title && <h4 className="client-table-title">{title} ({clientsToRender.length})</h4>}
        <table className="client-table">
          <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>

          <tbody>
            {clientsToRender.length > 0 ? (
              clientsToRender.map(client => (
                <tr key={client.id}>
                  <td>{client.firstName}</td>
                  <td>{client.lastName}</td>
                  <td>{client.mobile}</td>
                  <td>{client.email}</td>
                  <td>{client.service === 'Job Supporting & Consulting' ? client.jobsApplyFor : client.service}</td>
                  <td>{client.registeredDate}</td>
                  <td>{client.country}</td>
                  {client.service === 'Job Supporting & Consulting' && <td>{client.visaStatus}</td>}

                  {(currentClientFilter === 'unassigned' || currentClientFilter === 'restored') && (
                    <td>

                      <select className="manager-select" value={client.manager || ''} onChange={(e) => setClients(prev => prev.map(c => c.id === client.id ? { ...c, manager: e.target.value } : c))}>
                        <option value="">Select Manager</option>
                        {managers.map((mgr, idx) => <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>{mgr.firstName} {mgr.lastName}</option>)}
                      </select>



                    </td>
                  )}
                  {currentClientFilter === 'active' && (
                    <td>
                      {editingClientId === client.id ? (
                        <select
                          className="manager-select"
                          value={tempSelectedManager}
                          onChange={(e) => setTempSelectedManager(e.target.value)}
                        >
                          <option value="">Select Manager</option>
                          {managers.map((mgr, idx) =>
                            <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>
                              {mgr.firstName} {mgr.lastName}
                            </option>
                          )}
                        </select>
                      ) : (
                        client.manager || '-'
                      )}
                    </td>
                  )}



                  <td><button onClick={() => handleViewClientDetails(client)} className="action-button">View</button></td>
                  <td>
                    <div className="action-buttons">
                      {currentClientFilter === 'registered' && (<><button onClick={() => handleAcceptClient(client.id)} className="action-button accept">Accept</button><button onClick={() => handleDeclineClient(client.id)} className="action-button decline">Decline</button></>)}
                      {(currentClientFilter === 'unassigned' || currentClientFilter === 'restored') && <button onClick={() => handleAssignClient(client.id)} className="action-button assign" disabled={!client.manager}>Assign</button>}
                      {currentClientFilter === 'active' && (editingClientId === client.id ? (<><button onClick={() => handleSaveManagerChange(client.id)} className="action-button save" disabled={!tempSelectedManager}>Save</button><button onClick={handleCancelEdit} className="action-button cancel">Cancel</button></>) : (<button onClick={() => handleEditManager(client)} className="action-button edit-manager">Edit Manager</button>))}
                      {currentClientFilter === 'rejected' && (<><button onClick={() => handleRestoreClient(client.id)} className="action-button restore">Restore</button><button onClick={() => handleDeleteRejectedClient(client.id)} className="action-button delete-btn">Delete</button></>)}
                      {/* Send Payment Link Button */}
                      <button
                        onClick={() => handleOpenPaymentModal(client)}
                        className="action-button send-payment-link"
                      >
                        {/* Credit Card Icon (from Screenshot 2025-07-02 at 7.33.16 PM.png) */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                          <path d="M20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4ZM5 7H19V9H5V7ZM5 11H17V13H5V11ZM5 15H13V17H5V15Z" />
                        </svg>
                        Send Payment Link
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No {serviceType !== 'All' ? serviceType : ''} clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };


  const renderAllServiceTables = () => {
    const servicesToDisplay = serviceOptions.filter(service => service !== 'All'); // Exclude 'All' from individual tables

    return (
      <div className="all-services-list">
        {servicesToDisplay.map(service => {
          const clientsForService = clients.filter(client =>
            client.displayStatuses.includes(clientFilter) &&
            client.service === service &&
            // FIX: Added a check for client.name and client.email to prevent .toLowerCase() on undefined
            ((client.name || '').toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
              (client.email || '').toLowerCase().includes(clientSearchTerm.toLowerCase()))
          );

          if (clientsForService.length === 0) {
            return null; // Don't render the table if there are no clients for this service
          }

          return (
            <div key={service} className="service-table-list-item">
              {renderClientTable(clientsForService, service, clientFilter, service)}
            </div>
          );
        })}
      </div>
    );
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
  --primary-color: #007bff;
  --background-primary: #ffffff;

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

  /* employee Management Specific Colors */
  --employee-card-bg: #ffffff;
  --employee-card-border: #e5e7eb;
  --employee-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --employee-avatar-bg: #E0F2FE; /* Light blue for employee avatars */
  --employee-avatar-icon: #2563EB; /* Blue for employee avatar icon */
  --employee-name-color: #1f2937;
  --employee-email-color: #6b7280;
  --action-btn-border: #e5e7eb;
  --action-btn-text: #4b5563;
  --action-btn-hover-bg: #f9fafb;
  --delete-btn-bg: #EF4444;
  --delete-btn-hover-bg: #DC2626;
  --delete-btn-text: #ffffff;
  --add-employee-btn-bg: #2563EB;
  --add-employee-btn-hover-bg: #1D4ED8;
  --add-employee-btn-text: #ffffff;
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
  /* Client Management Specific Colors */
  --client-filter-tab-bg-active-registered: #E6F0FF;
  --client-filter-tab-text-active-registered: #3A60EE;
  --client-filter-tab-badge-registered: #3A60EE;

  --client-filter-tab-bg-active-unassigned: #FEF3C7;
  --client-filter-tab-text-active-unassigned: #B45309;
  --client-filter-tab-badge-unassigned: #B45309;

  --client-filter-tab-bg-active-active: #D9F5E6;
  --client-filter-tab-text-active-active: #28A745;
  --client-filter-tab-badge-active: #28A745;

  --client-filter-tab-bg-active-rejected: #FFEDEE;
  --client-filter-tab-text-active-rejected: #DC3545;
  --client-filter-tab-badge-rejected: #DC3545;

  --client-filter-tab-bg-active-restored: #F0E6FF;
  --client-filter-tab-text-active-restored: #6A40EE;
  --client-filter-tab-badge-restored: #6A40EE;

  /* Asset Management Specific Colors */
  --asset-card-icon-bg-total: #E0F2FE;
  --asset-card-icon-color-total: #2563EB;
  --asset-card-icon-bg-available: #D9F5E6;
  --asset-card-icon-color-available: #28A745;
  --asset-card-icon-bg-assigned: #F3E5F5;
  --asset-card-icon-color-assigned: #9C27B0;
  --asset-card-icon-bg-pending: #FFF3E0;
  --asset-card-icon-color-pending: #FF9800;
  --assign-asset-btn-bg: #2563EB;
  --assign-asset-btn-hover: #1D4ED8;
  --assign-asset-btn-text: #ffffff;
  --asset-section-title-color: #1f2937;
  --asset-section-subtitle-color: #6b7280;
  --asset-quick-assign-bg: #ffffff;
  --asset-quick-assign-border: #e5e7eb;
  --asset-quick-assign-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --asset-quick-assign-card-bg: #f9fafb;
  --asset-quick-assign-card-border: #e5e7eb;
  --asset-quick-assign-card-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  --asset-quick-assign-card-title: #1f2937;
  --asset-quick-assign-card-text: #6b7280;
  --asset-quick-assign-btn-bg: #2563eb;
  --asset-quick-assign-btn-hover: #1d4ed8;
  --asset-quick-assign-btn-text: #ffffff;
  --asset-activity-table-header-bg: #f9fafb;
  --asset-activity-table-header-text: #6b7280;
  --asset-activity-table-row-border: #e5e7eb;
  --asset-activity-table-row-hover-bg: #f9fafb;
  --asset-activity-text-primary: #1f2937;
  --asset-activity-text-secondary: #6b7280;
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

  /* employee Management Specific Dark Mode Colors */
  --employee-card-bg: #2d3748;
  --employee-card-border: #4a5568;
  --employee-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  --employee-avatar-bg: #3182ce; /* Darker blue for employee avatars */
  --employee-avatar-icon: #ffffff; /* White for employee avatar icon */
  --employee-name-color: #e2e8f0;
  --employee-email-color: #a0aec0;
  --action-btn-border: #4a5568;
  --action-btn-text: #cbd5e0;
  --action-btn-hover-bg: #4a5568;
  --delete-btn-bg: #DC2626;
  --delete-btn-hover-bg: #B91C1C;
  --delete-btn-text: #ffffff;
  --add-employee-btn-bg: #4299e1;
  --add-employee-btn-hover-bg: #3182ce;
  --add-employee-btn-text: #ffffff;
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
            /* Asset Management Specific Dark Mode Colors */
  --asset-card-icon-bg-total: #3182ce;
  --asset-card-icon-color-total: #ffffff;
  --asset-card-icon-bg-available: #388E3C;
  --asset-card-icon-color-available: #ffffff;
  --asset-card-icon-bg-assigned: #9C27B0;
  --asset-card-icon-color-assigned: #ffffff;
  --asset-card-icon-bg-pending: #FF9800;
  --asset-card-icon-color-pending: #ffffff;
  --assign-asset-btn-bg: #4299e1;
  --assign-asset-btn-hover: #3182ce;
  --assign-asset-btn-text: #ffffff;
  --asset-section-title-color: #e2e8f0;
  --asset-section-subtitle-color: #a0aec0;
  --asset-quick-assign-bg: #2d3748;
  --asset-quick-assign-border: #4a5568;
  --asset-quick-assign-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  --asset-quick-assign-card-bg: #4a5568;
  --asset-quick-assign-card-border: #6b7280;
  --asset-quick-assign-card-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  --asset-quick-assign-card-title: #e2e8f0;
  --asset-quick-assign-card-text: #a0aec0;
  --asset-quick-assign-btn-bg: #4299e1;
  --asset-quick-assign-btn-hover: #3182ce;
  --asset-quick-assign-btn-text: #ffffff;
  --asset-activity-table-header-bg: #4a5568;
  --asset-activity-table-header-text: #cbd5e0;
  --asset-activity-table-row-border: #4a5568;
  --asset-activity-table-row-hover-bg: #4a5568;
  --asset-activity-text-primary: #e2e8f0;
  --asset-activity-text-secondary: #a0aec0;
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
  background-color: var(--bg-card);
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

.ad-employee-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ad-employee-info-text {
  display: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

@media (min-width: 768px) {
  .ad-employee-info-text {
    display: flex;
  }
}

.ad-employee-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
  line-height: 1.2;
}

.ad-employee-email {
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
  max-width: 100rem;
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


/* Edit Employee Modal overlay */
.modal-overlay .open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal content */
.employee-edit-modal-content {
  background: #fff;
  border-radius: 12px;
  max-width: 850px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
  .employee-add-modal-content {
  background: #fff;
  border-radius: 12px;
  max-width: 850px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2d3d;
}

.modal-subtitle {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #6c757d;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #333;
}

/* Form layout grid */
.details-grid.form-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

/* Section Title */
.section-title {
  grid-column: 1 / -1;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 16px 0 4px;
  color: #2b3e50;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

/* Form items */
.form-item {
  display: flex;
  flex-direction: column;
}

.form-item label {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.92rem;
  color: #34495e;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
}

.form-item textarea {
  resize: vertical;
}

/* Modal footer */
.modal-footer.modal-form-full-width {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.confirm-cancel-btn,
.confirm-save-btn {
  padding: 8px 16px;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-cancel-btn {
  background-color: #f1f1f1;
  color: #555;
}

.confirm-cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-save-btn {
  background-color: #2e7d32;
  color: #fff;
}

.confirm-save-btn:hover {
  background-color: #27642a;
}


/* employee Management Specific Styles */
.employee-management-container {
    padding: 0 1.5rem 1.5rem; /* Consistent padding with other sections */
}

.employee-management-box { /* New container for the employee management section */
    background-color: var(--bg-card);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
    border: 1px solid var(--border-color);
    padding: 1.5rem; /* Padding inside the box */
    margin-top: 1.5rem; /* Space from the radio buttons */
}

.employee-management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap; /* Allow wrapping on small screens */
    gap: 1rem; /* Space between elements when wrapped */
}

.employee-management-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.employee-search-add {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-grow: 1; /* Allow search and add to take available space */
    max-width: 400px; /* Limit width on larger screens */
}

.employee-search-input {
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

.employee-search-input::placeholder {
    color: var(--search-placeholder-color);
}

.employee-search-input:focus {
    border-color: var(--add-employee-btn-bg);
}

.add-employee-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: var(--add-employee-btn-bg);
    color: var(--add-employee-btn-text);
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap; /* Prevent text from wrapping */
}

.add-employee-btn:hover {
    background-color: var(--add-employee-btn-hover-bg);
}

.employee-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.employee-card {
    background-color: var(--employee-card-bg);
    border-radius: 0.75rem;
    box-shadow: var(--employee-card-shadow);
    border: 1px solid var(--employee-card-border);
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap; /* Allow content to wrap on small screens */
}

.employee-card-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-grow: 1; /* Allow employee info to take space */
}

.employee-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background-color: var(--employee-avatar-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.employee-avatar-icon {
    color: var(--employee-avatar-icon);
    font-size: 1.5rem;
}

.employee-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Ensure content starts on the left */
}

.employee-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--employee-name-color);
}

.employee-email {
    font-size: 0.875rem;
    color: var(--employee-email-color);
}

.employee-roles {
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

.employee-actions {
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

/* Modal Styles (kept for other modals) */
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

.create-employee-btn {
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

.create-employee-btn:hover {
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
    white-space: nowrap;
    border-bottom: 1px solid var(--border-color);
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

.department-table tbody tr:last-child {
    border-bottom: none; /* No border for the last row */
}

.department-table tbody tr:hover {
    background-color: var(--dept-table-row-hover-bg);
}

.department-table td {
    font-size: 0.9rem;
    color: var(--text-primary);
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

/* Client Management Inline Styles */
.client-management-container {
    padding: 0 1.5rem 1.5rem;
}

.client-management-box {
    background-color: var(--bg-card);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    margin-top: 1.5rem;
}

.client-management-header-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.client-management-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.client-filter-tabs {
  position: relative;
  display: flex;
  border-radius: 0.5rem;
  background-color: #EEE; /* Light grey background for the tabs container */
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 100%;
  font-size: 14px;
  margin: 0 auto 20px auto;
  overflow-x: auto;
  white-space: nowrap;
  flex-wrap: wrap;
  justify-content: center;
}

.client-filter-tab-item {
  flex-shrink: 0;
  flex-grow: 1;
  text-align: center;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 10px;
  transition: all .15s ease-in-out;
  color: rgba(51, 65, 85, 1);
  font-weight: normal;
  margin: 0 2px 5px 2px;
}

.client-filter-tab-item input[type="radio"] {
  display: none;
}

.client-filter-tab-item input[type="radio"]:checked + .client-filter-tab-label {
  font-weight: 600;
  
}

.client-filter-tab-item .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  font-size: 0.75em;
  font-weight: bold;
  padding: 0 6px;
  margin-left: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: background-color 0.15s ease;
}

/* Specific colors for client filter tabs */
.client-filter-tab-item.registered input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-registered); color: var(--client-filter-tab-text-active-registered); }
.client-filter-tab-item.registered .badge { background-color: var(--client-filter-tab-badge-registered); }

.client-filter-tab-item.unassigned input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-unassigned); color: var(--client-filter-tab-text-active-unassigned); }
.client-filter-tab-item.unassigned .badge { background-color: var(--client-filter-tab-badge-unassigned); }

.client-filter-tab-item.active input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-active); color: var(--client-filter-tab-text-active-active); }
.client-filter-tab-item.active .badge { background-color: var(--client-filter-tab-badge-active); }

.client-filter-tab-item.rejected input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-rejected); color: var(--client-filter-tab-text-active-rejected); }
.client-filter-tab-item.rejected .badge { background-color: var(--client-filter-tab-badge-rejected); }

.client-filter-tab-item.restored input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-restored); color: var(--client-filter-tab-text-active-restored); }
.client-filter-tab-item.restored .badge { background-color: var(--client-filter-tab-badge-restored); }


.client-search-and-filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-end; /* Align items to the bottom */
}

.client-search-input-group {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
                        
  background-color: var(--bg-card);
  flex-grow: 1; /* Allow search input to grow */
  min-width: 200px; /* Minimum width for responsiveness */
}

.client-search-input-group .search-icon-wrapper {
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-search-input-group .client-search-input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.client-search-input-group .client-search-input::placeholder {
  color: var(--text-secondary);
}

.client-search-input-group .client-search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25);
}

.service-filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1; /* Allow service filter to grow */
  min-width: 180px; /* Ensure dropdown has enough width */
}

.service-filter-group .form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--modal-label-color);
  margin-bottom: 0;
}

.service-filter-group .form-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--modal-input-border);
  border-radius: 0.5rem;
  background-color: var(--modal-input-bg);
  color: var(--modal-input-text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.client-table-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.client-table-container {
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem; /* Add margin for spacing between tables in grid */
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--bg-card);
}

.client-table th, .client-table td {
  padding: 1rem;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--border-color);
}

.client-table thead th {
  background-color: var(--dept-table-header-bg);
  color: var(--dept-table-header-text);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.client-table tbody tr:last-child td {
  border-bottom: none;
}

.client-table tbody tr:nth-child(even) {
  background-color: var(--bg-body); /* Slightly different background for even rows */
}

.client-table tbody tr:hover {
  background-color: var(--dept-table-row-hover-bg);
}

.client-table td {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.client-table td .action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
}

.client-table td .action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.client-table td .action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* Specific client action button colors */
.client-table td .action-button.accept { background-color: #28a745; color: white; }
.client-table td .action-button.accept:hover { background-color: #218838; }
.client-table td .action-button.decline { background-color: #dc3545; color: white; }
.client-table td .action-button.decline:hover { background-color: #c82333; }
.client-table td .action-button.assign { background-color: #007bff; color: white; }
.client-table td .action-button.assign:hover { background-color: #0056b3; }
.client-table td .action-button.restore { background-color: #6f42c1; color: white; }
.client-table td .action-button.restore:hover { background-color: #563d7c; }
.client-table td .action-button.edit-manager { background-color: #007bff; color: white; }
.client-table td .action-button.edit-manager:hover { background-color: #0056b3; }
.client-table td .action-button.save { background-color: #28a745; color: white; }
.client-table td .action-button.save:hover { background-color: #218838; }
.client-table td .action-button.cancel { background-color: #6c757d; color: white; }
.client-table td .action-button.cancel:hover { background-color: #5a6268; }
.client-table td .action-button.send-payment-link {
  background-color: #28a745; /* Green color for payment link */
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.client-table td .action-button.send-payment-link:hover {
  background-color: #218838;
}


.client-table td .manager-select {
  padding: 6px 8px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.85em;
  width: 100%;
  box-sizing: border-box;
}

.client-table td .manager-select:focus {
  border-color: #2563eb;
  outline: none;
}

.payment-status-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    display: inline-block; /* Ensure it respects padding and background */
}

/* Payment Management Modal Specific Styles */
.payment-modal-content {
    max-width: 500px; /* Adjust max-width for payment modal */
    padding: 1.25rem; /* Reduced padding */
}

.payment-modal-client-details {
    background-color: var(--bg-body);
    border-radius: 0.5rem;
    padding: 0.75rem; /* Reduced padding */
    margin-top: 0.75rem; /* Reduced margin */
    border: 1px solid var(--border-color);
}

.payment-modal-client-details p {
    margin: 0.15rem 0; /* Reduced margin */
    font-size: 0.85rem; /* Slightly smaller font */
    color: var(--text-primary);
}

.payment-modal-client-details strong {
    font-weight: 600;
    color: var(--text-primary);
}

.payment-modal-options {
    margin-top: 1rem; /* Reduced margin */
    padding-top: 0.75rem; /* Reduced padding */
    border-top: 1px solid var(--border-color);
}

.payment-modal-options h4 {
    font-size: 0.95rem; /* Slightly smaller font */
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem; /* Reduced margin */
}

.payment-modal-option-item {
    font-size: 0.8rem; /* Smaller font */
    color: var(--text-secondary);
    margin-bottom: 0.3rem; /* Reduced margin */
}

.payment-modal-option-item strong {
    color: var(--text-primary);
}

.modal-form .form-group {
    gap: 0.4rem; /* Reduced gap between label and input */
}

.modal-form .form-label {
    margin-bottom: 0; /* Remove default margin */
}

.modal-footer {
    margin-top: 1rem; /* Reduced margin */
    gap: 0.6rem; /* Reduced gap between buttons */
    /* Added for equal sizing and filling space */
    display: flex;
    justify-content: flex-end; /* Changed to flex-end */
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.modal-footer button {
    flex-grow: 0; /* Changed to 0 */
    flex-basis: auto; /* Allow buttons to shrink as needed */
    min-width: unset; /* Reset min-width */
    padding: 0.75rem 1.5rem; /* Consistent padding */
    font-size: 0.9rem; /* Consistent font size */
}

.pay-now-btn {
    background-color: #007bff; /* Blue for Pay Now button */
    color: #ffffff;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex; /* Ensure icon and text are aligned */
    align-items: center;
    justify-content: center;
    gap: 0.5rem; /* Space between icon and text */
}

.pay-now-btn:hover {
    background-color: #0056b3; /* Darker blue on hover */
}

/* Generated Link Section */
.generated-link-section {
    margin-top: 1rem; /* Reduced margin-top */
    padding-top: 0.75rem; /* Reduced padding-top */
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Reduced gap */
}

.generated-link-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #28a745; /* Green for success */
    font-weight: 600;
    font-size: 0.9rem; /* Slightly smaller font */
}

.generated-link-input-group {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--modal-input-bg);
}

.generated-link-input {
    flex-grow: 1;
    padding: 0.6rem 0.8rem; /* Reduced padding */
    border: none;
    outline: none;
    background-color: transparent;
    color: var(--modal-input-text);
    font-size: 0.85rem; /* Slightly smaller font */
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
    max-height: 3.5rem; /* Reduced max-height for scrollability */
    overflow-y: auto; /* Make it scrollable vertically */
}

.generated-link-actions {
    display: flex;
    gap: 0.4rem; /* Reduced gap */
    padding: 0.4rem; /* Reduced padding */
    border-left: 1px solid var(--border-color);
    flex-shrink: 0;
}

.generated-link-action-btn {
    padding: 0.5rem 0.7rem; /* Reduced padding */
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--bg-card);
    color: var(--text-primary);
    font-size: 0.75rem; /* Slightly smaller font */
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.3rem; /* Reduced gap */
    white-space: nowrap;
}

.generated-link-action-btn:hover {
    background-color: var(--bg-nav-link-hover);
}

.generated-link-close-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: var(--confirm-modal-cancel-btn-bg);
    color: var(--confirm-modal-cancel-btn-text);
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 0.75rem; /* Reduced margin-top */
}

.generated-link-close-btn:hover {
    background-color: var(--confirm-modal-cancel-btn-hover);
}
   .payment-modal-content .generated-link-input-group {
                flex-direction: column;
            }

            .payment-modal-content .generated-link-action-btn {
                width: 100%;
                justify-content: center;
            }

 
 /* Asset Management Styles */
.asset-management-container {
    padding: 0 1.5rem 1.5rem;
}

.asset-management-box {
    background-color: var(--bg-card);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    margin-top: 1.5rem;
}

.asset-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.asset-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--asset-section-title-color);
}

.asset-subtitle {
    font-size: 0.875rem;
    color: var(--asset-section-subtitle-color);
    margin-top: 0.25rem;
}

.assign-asset-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: var(--assign-asset-btn-bg);
    color: var(--assign-asset-btn-text);
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap;
}

.assign-asset-btn:hover {
    background-color: var(--assign-asset-btn-hover);
}

.asset-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
    .asset-stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

.asset-stat-card {
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

.asset-stat-card-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--text-primary);
}

.asset-stat-card-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.asset-stat-card-icon-wrapper {
    border-radius: 9999px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin-left: auto; /* Push icon to the right */
}

.asset-stat-card-icon-wrapper.total {
    background-color: var(--asset-card-icon-bg-total);
    color: var(--asset-card-icon-color-total);
}
.asset-stat-card-icon-wrapper.available {
    background-color: var(--asset-card-icon-bg-available);
    color: var(--asset-card-icon-color-available);
}
.asset-stat-card-icon-wrapper.assigned {
    background-color: var(--asset-card-icon-bg-assigned);
    color: var(--asset-card-icon-color-assigned);
}
.asset-stat-card-icon-wrapper.pending {
    background-color: var(--asset-card-icon-bg-pending);
    color: var(--asset-card-icon-color-pending);
}

.quick-assign-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background-color: var(--asset-quick-assign-bg);
    border-radius: 0.75rem;
    border: 1px solid var(--asset-quick-assign-border);
    box-shadow: var(--asset-quick-assign-shadow);
}

.quick-assign-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--asset-section-title-color);
    margin-bottom: 1rem;
}

.quick-assign-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .quick-assign-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .quick-assign-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.quick-assign-card {
    background-color: var(--asset-quick-assign-card-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--asset-quick-assign-card-border);
    box-shadow: var(--asset-quick-assign-card-shadow);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.quick-assign-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.quick-assign-card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--asset-quick-assign-card-title);
}

.quick-assign-card-users {
    background-color: var(--asset-card-icon-bg-assigned); /* Using assigned color for consistency */
    color: var(--asset-card-icon-color-assigned);
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.quick-assign-card-info {
    font-size: 0.875rem;
    color: var(--asset-quick-assign-card-text);
}

.quick-assign-card-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: var(--asset-quick-assign-btn-bg);
    color: var(--asset-quick-assign-btn-text);
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
}

.quick-assign-card-btn:hover {
    background-color: var(--asset-quick-assign-btn-hover);
}

.recent-activity-section {
    padding: 1.5rem;
    background-color: var(--bg-card);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-color-1);
}

.recent-activity-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--asset-section-title-color);
    margin-bottom: 1rem;
}

.asset-activity-table-container {
    overflow-x: auto;
}

.asset-activity-table {
    width: 100%;
    border-collapse: collapse;
}

.asset-activity-table th, .asset-activity-table td {
    padding: 1rem;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid var(--asset-activity-table-row-border);
}

.asset-activity-table thead {
    background-color: var(--asset-activity-table-header-bg);
}

.asset-activity-table th {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--asset-activity-table-header-text);
}

.asset-activity-table tbody tr:last-child {
    border-bottom: none;
}

.asset-activity-table tbody tr:hover {
    background-color: var(--asset-activity-table-row-hover-bg);
}

.asset-activity-table td {
    font-size: 0.9rem;
    color: var(--asset-activity-text-primary);
}

.asset-activity-table .asset-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.asset-activity-table .asset-icon-wrapper {
    background-color: var(--asset-card-icon-bg-total); /* Reusing total asset icon bg */
    color: var(--asset-card-icon-color-total);
    padding: 0.5rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.asset-activity-table .asset-name {
    font-weight: 500;
}

.asset-activity-table .asset-description {
    font-size: 0.8rem;
    color: var(--asset-activity-text-secondary);
}
.asset-activity-table .assigned-to-info {
    font-size: 0.85rem;
    color: var(--asset-activity-text-secondary);
}

/* Client Details Modal & Edit Client Modal Styles */
.client-details-modal-content, .edit-client-modal-content {
  max-width: 600px;
  padding: 1.5rem;
}

/* New styles for the form-like display in view/edit modals */
.assign-modal-content {
  background-color: var(--modal-bg);
  border-radius: 0.75rem;
  box-shadow: var(--modal-shadow);
  border: 1px solid var(--modal-border);
  width: 90%;
  max-width: 900px; /* Wider layout for client details */
  padding: 1.5rem;
  position: relative;
  transform: translateY(-20px);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  overflow-y: auto; /* Enable scrolling for content */
  max-height: 90vh; /* Limit height to viewport height */
}

.modal-overlay.open .assign-modal-content {
    transform: translateY(0);
    opacity: 1;
}

.assign-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.assign-modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--modal-title-color);
    line-height: 1.2;
}

.assign-modal-close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--modal-close-btn-color);
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s;
}

.assign-modal-close-button:hover {
    color: var(--modal-close-btn-hover);
}

.client-preview-grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* Gap between sections */
                       
}

@media (min-width: 768px) {
  .client-preview-grid-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns for larger screens */
  }
}

@media (min-width: 1024px) {
  .client-preview-grid-container {
    grid-template-columns: repeat(3, 1fr); /* Three columns for even larger screens */
  }
}

.client-preview-section {
  background-color: var(--bg-body); /* Light background for each section */
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Gap between form groups within a section */
}

.client-preview-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.assign-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* Smaller gap for label and input */
}

.assign-form-group label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.assign-form-group input[type="text"],
.assign-form-group input[type="date"],
.assign-form-group input[type="tel"],
.assign-form-group input[type="email"],
.assign-form-group textarea,
.assign-form-group select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--modal-input-border);
  border-radius: 0.4rem;
  background-color: var(--modal-input-bg);
  color: var(--modal-input-text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.assign-form-group input[type="text"]:focus,
.assign-form-group input[type="date"]:focus,
.assign-form-group input[type="tel"]:focus,
.assign-form-group input[type="email"]:focus,
.assign-form-group textarea:focus,
.assign-form-group select:focus {
  border-color: var(--modal-focus-border);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* Read-only styling for client details modal */
.assign-form-group .read-only-value {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color); /* Lighter border for read-only */
  border-radius: 0.4rem;
  background-color: var(--bg-card); /* Slightly different background for read-only */
  color: var(--text-primary);
  font-size: 0.9rem;
  min-height: 38px; /* Match input height */
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.client-preview-skills-section {
  grid-column: 1 / -1; /* Span full width */
  background-color: var(--bg-body);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  padding: 1rem;
  margin-top: 1.5rem; /* Space from the grid */
}

.client-preview-skills-section .assign-form-group textarea {
  min-height: 80px; /* Adjust height for skills textarea */
                        
                    
                   
                      
                        
}

.assign-form-actions {
  grid-column: 1 / -1; /* Span full width */
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.assign-form-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.assign-form-button.cancel {
  background-color: var(--confirm-modal-cancel-btn-bg);
  color: var(--confirm-modal-cancel-btn-text);
}

.assign-form-button.cancel:hover {
  background-color: var(--confirm-modal-cancel-btn-hover);
}

.assign-form-button.assign {
  background-color: var(--modal-create-btn-bg);
  color: var(--modal-create-btn-text);
}

.assign-form-button.assign:hover {
  background-color: var(--modal-create-btn-hover);
}

/* Styles for the All Services List View */
.all-services-list { /* Renamed from .all-services-grid */
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 2rem; /* Gap between different service tables */
  margin-top: 1.5rem;
}

.service-table-list-item { /* Renamed from .service-table-grid-item */
  background-color: var(--bg-card);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  width: 100%; /* Ensure it takes full width */
}


 /* Department Details Modal */
        .department-details-modal-content .details-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .department-details-modal-content .detail-item {
            display: flex;
            flex-direction: column;
        }

        .department-details-modal-content .detail-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.25rem;
        }

        .department-details-modal-content .detail-value {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary);
        }

        .department-details-modal-content .employees-list-section {
            margin-top: 1.5rem;
            border-top: 1px solid var(--border-color);
            padding-top: 1.5rem;
        }

        .department-details-modal-content .employees-list-section h4 {
            font-size: 1.1rem;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .department-details-modal-content .employees-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--background-color);
            padding: 0.5rem;
        }

        .department-details-modal-content .employee-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }

        .department-details-modal-content .employee-list-item:last-child {
            border-bottom: none;
        }

        .department-details-modal-content .employee-list-item span {
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        /* Edit Department Modal - Employee Management */
        .edit-department-modal-employees {
            grid-column: 1 / -1;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }

        .edit-department-modal-employees h4 {
            font-size: 1.1rem;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .edit-department-modal-employees .employee-selection-box {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .edit-department-modal-employees .employee-selection-box > div {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            background-color: var(--background-color);
        }

        .edit-department-modal-employees .employee-selection-box h5 {
            font-size: 0.95rem;
            color: var(--text-primary);
            margin-top: 0;
            margin-bottom: 0.75rem;
        }

        .edit-department-modal-employees .employee-list-scroll {
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--card-background);
        }

        .edit-department-modal-employees .employee-list-item-manage {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }

        .edit-department-modal-employees .employee-list-item-manage:last-child {
            border-bottom: none;
        }

        .edit-department-modal-employees .employee-list-item-manage span {
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        .edit-department-modal-employees .employee-list-item-manage button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.3rem 0.6rem;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background-color 0.2s ease;
        }

        .edit-department-modal-employees .employee-list-item-manage button.remove {
            background-color: var(--delete-red);
        }

        .edit-department-modal-employees .employee-list-item-manage button:hover {
            background-color: #3A7AD9;
        }

        .edit-department-modal-employees .employee-list-item-manage button.remove:hover {
            background-color: var(--delete-red-hover);
        }

            /* Profile Modal */
        .profile-modal-content .profile-details-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .profile-modal-content .profile-detail-item {
            display: flex;
            flex-direction: column;
        }

        .profile-modal-content .profile-detail-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.25rem;
        }

        .profile-modal-content .profile-detail-value {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary);
        }

        .profile-modal-content .profile-avatar-large {
            width: 80px;
            height: 80px;
            font-size: 2rem;
            margin: 0 auto 1.5rem;
        }


         /* NEW STYLES FOR REQUEST MANAGEMENT */
        .request-management-container {
          background-color: var(--background-primary);
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
        .request-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 1.5rem;
        }
        .request-tab-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background-color: transparent;
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          position: relative;
          top: 2px;
        }
        .request-tab-btn.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          font-weight: 600;
        }
        .request-table-container {
          overflow-x: auto;
        }
        .request-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .request-table th, .request-table td {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          text-align: left;
           vertical-align: middle;
        }
        .request-table th {
           font-weight: 600;
            color: var(--text-primary);
            background-color: #f8f9fa;
        }
        .request-table tr:nth-child(even) {
          background-color: var(--background-secondary);
        }
        .request-table .action-buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-start;
        }
        .request-table .action-button {
            padding: 0.3rem 0.6rem;
            border-radius: 0.375rem;
            border: 1px solid transparent;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .request-table .action-button.view {
            background-color: #DBEAFE;
            color: #1D4ED8;
            border-color: #BFDBFE;
        }
        .request-table .action-button.accept {
            background-color: #D1FAE5;
            color: #065F46;
            border-color: #A7F3D0;
        }
        .request-table .action-button.reject {
            background-color: #FEE2E2;
            color: #991B1B;
            border-color: #FECACA;
        }
        .request-table .action-button.download {
            background-color: #E0E7FF;
            color: #3730A3;
            border-color: #C7D2FE;
        }
        .request-table .message-cell {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .action-button.view { background-color: #e0e7ff; color: #3730a3; }
        .action-button.view:hover { background-color: #c7d2fe; }
        
        .action-button.accept { background-color: #dcfce7; color: #166534; }
        .action-button.accept:hover { background-color: #bbf7d0; }

        .action-button.reject { background-color: #fee2e2; color: #991b1b; }
        .action-button.reject:hover { background-color: #fecaca; }

        .action-button.download { background-color: #e0f2fe; color: #075985; }
        .action-button.download:hover { background-color: #bae6fd; }

        .message-cell {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }

        .status-tag {
            padding: 0.25rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: capitalize;
        }

        /* Modal Styles for Request Management */
        .request-details-modal .modal-body {
            font-size: 1rem;
        }
        .request-details-modal .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .request-details-modal .detail-label {
            font-weight: 600;
            color: #4b5563;
        }
        .request-details-modal .detail-value {
            color: #1f2937;
        }
        .request-details-modal .message-content {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #f9fafb;
            border-radius: 0.5rem;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

              /* Responsive adjustments */
         @media (max-width: 768px) {
            .ad-header-right {
                gap: 1rem;
            }

            .ad-employee-info-text {
                display: none; /* Hide name/role on smaller screens */
            }

            .ad-hamburger-menu {
                display: block;
            }

            .ad-sidebar {
                position: fixed;
                top: 0;
                left: -250px;
                width: 250px;
                height: 100%;
                background-color: var(--card-background);
                box-shadow: var(--shadow-color) 2px 0 5px;
                transition: left 0.3s ease;
                z-index: 1500;
                padding-top: 4rem;
                display: block;
            }

            .ad-sidebar-open {
                left: 0;
            }

            .ad-sidebar-close-btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text-secondary);
                cursor: pointer;
            }

            .ad-sidebar-nav {
                display: flex;
                flex-direction: column;
                padding: 1rem;
            }

            .ad-nav-link {
                padding: 0.75rem 1rem;
                color: var(--text-primary);
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.2s ease;
            }

            .ad-nav-link:hover {
                background-color: var(--button-hover-bg);
            }

            .ad-nav-link-active {
                background-color: var(--primary-color);
                color: white;
            }

            .ad-main-content {
                padding: 1rem;
            }

            .ad-content-wrapper {
                padding: 1rem;
            }

            .ad-dashboard-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }

            .ad-title {
                font-size: 1.75rem;
            }

            .custom-radio-group-container {
                flex-direction: column;
                align-items: stretch;
            }

            .custom-radio-item {
                width: 100%;
            }

            .employee-management-header, .department-header, .asset-header, .client-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .employee-search-add, .department-search-filter, .asset-search-filter, .client-search-filter {
                width: 100%;
                flex-direction: column;
                gap: 0.75rem;
            }

            .employee-search-input, .department-search-input, .asset-search-input, .client-search-input {
                width: 100%;
                min-width: unset;
            }

            .add-employee-btn, .create-department-btn, .assign-asset-btn, .add-new-client-btn {
                width: 100%;
                justify-content: center;
            }

            .employee-card {
                flex-direction: column;
                align-items: flex-start;
            }

            .employee-actions {
                width: 100%;
                justify-content: flex-start;
                margin-top: 1rem;
            }

            .modal-content {
                width: 95%;
                padding: 1.5rem;
            }

            .modal-form {
                grid-template-columns: 1fr;
            }

            .modal-footer {
                flex-direction: column-reverse;
                gap: 0.75rem;
            }

            .create-employee-btn, .confirm-cancel-btn, .confirm-delete-btn {
                width: 100%;
                justify-content: center;
            }

            .department-stats-grid {
                grid-template-columns: 1fr;
            }

            .client-table .action-buttons {
                flex-direction: column;
            }

         
        } }

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

          <div className="ad-notification-icon">
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <span className="ad-notification-badge">3</span>
          </div>
          {/* Dark/Light Mode Toggle Button */}
          {/* <button
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
          </button> */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-employee-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="ad-employee-info-text">
                <p className="ad-employee-name">{(employees.find(e => (e.roles || []).includes('admin')) || {}).name || 'Admin'}</p>
                <span className="ad-admin-tag">Admin</span>

              </div>
              <div className="ad-initials-avatar"><span className="ad-initials-text">{getInitials((employees.find(e => (e.roles || []).includes('admin')) || {}).name)}</span></div>

            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li>Profile</li>
                <li onClick={() => window.location.href = '/'}>Log out</li>
              </ul>
            )}
          </div>
        </div>

        <button className="ad-hamburger-menu" onClick={toggleSidebar}>&#9776;</button>
      </header>
      <div className={`ad-sidebar ${isSidebarOpen ? 'ad-sidebar-open' : ''}`}>
        <button className="ad-sidebar-close-btn" onClick={toggleSidebar}>&times;</button>
        <nav className="ad-sidebar-nav">
          {adminViewOptions.map(option => (
            <a key={option.value} href="#" onClick={(e) => { e.preventDefault(); setCurrentView(option.value); setIsSidebarOpen(false); }}
              className={`ad-nav-link ${currentView === option.value ? 'ad-nav-link-active' : ''}`}>
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

              <h2 className="ad-title">Admin Worksheet</h2>
              <p className="ad-subtitle">System administration and Employee management</p>
            </div>
          </div>

          {/* Custom Radio Button Navigation */}
          <div className="custom-radio-group-container">
            {adminViewOptions.map((option) => (
              <label className="custom-radio-item" key={option.value}>
                <input type="radio" name="adminView" value={option.value} checked={currentView === option.value} onChange={() => setCurrentView(option.value)} />
                <span className="custom-radio-label">{option.label}</span>
              </label>
            ))}
          </div>


          {/* NEW: Request Management View */}
          {currentView === 'requestManagement' && (
            <div className="request-management-container">
              <div className="request-tabs">
                <button
                  className={`request-tab-btn ${requestTab === 'career' ? 'active' : ''}`}
                  onClick={() => setRequestTab('career')}
                >
                  Career Applications ({careerSubmissions.length})
                </button>
                <button
                  className={`request-tab-btn ${requestTab === 'contactUs' ? 'active' : ''}`}
                  onClick={() => setRequestTab('contactUs')}
                >
                  Contact Us Messages ({contactSubmissions.length})
                </button>
                <button
                  className={`request-tab-btn ${requestTab === 'serviceRequest' ? 'active' : ''}`}
                  onClick={() => setRequestTab('serviceRequest')}
                >
                  Service Requests ({serviceRequests.length})
                </button>
              </div>

              {requestTab === 'career' && (
                <div className="request-table-container">
                  <table className="request-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email & Mobile</th>
                        <th>Role Applied</th>
                        <th>Experience (Yrs)</th>
                        <th>Status</th>
                        <th>Resume</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careerSubmissions.map((sub, index) => (
                        <tr key={sub.id}>
                          <td>{index + 1}</td>
                          <td>{sub.firstName} {sub.lastName}</td>
                          <td>
                            <div>{sub.email}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{sub.mobile}</div>
                          </td>
                          <td>{sub.role}</td>
                          <td>{sub.experience} yrs</td>
                          <td>
                            <span className="status-tag" style={{ backgroundColor: getRoleTagBg(sub.status), color: getRoleTagText(sub.status) }}>
                              {sub.status}
                            </span>
                          </td>
                          <td>
                            <button className="action-button download">{sub.resume}</button>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-button view" onClick={() => handleViewCareerDetails(sub)}>View</button>
                              {sub.status === 'Pending' && (
                                <>
                                  <button className="action-button accept" onClick={() => handleRequestAction('accept', sub)}>Accept</button>
                                  <button className="action-button reject" onClick={() => handleRequestAction('reject', sub)}>Reject</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {requestTab === 'contactUs' && (
                <div className="request-table-container">
                  <table className="request-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email & Phone</th>
                        <th>Message</th>
                        <th>Received</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactSubmissions.map((sub, index) => (
                        <tr key={sub.id}>
                          <td>{index + 1}</td>
                          <td>{sub.firstName} {sub.lastName}</td>
                          <td>
                            <div>{sub.email}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{sub.phone}</div>
                          </td>
                          <td className="message-cell" title={sub.message} onClick={() => handleViewContactDetails(sub)}>{sub.message}</td>
                          <td>{sub.date}</td>                          <td>
                            <div className="action-buttons">
                              <button className="action-button view" onClick={() => handleViewContactDetails(sub)}>View</button>
                              <button className="action-button reject" onClick={() => handleRequestAction('deleteContact', sub)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {requestTab === 'serviceRequest' && (
                <div className="request-table-container">
                  <table className="request-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Received Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRequests.map((req, index) => (
                        <tr key={req.id}>
                          <td>{index + 1}</td>
                          <td>{req.email}</td>
                          <td className="message-cell" title={req.message} onClick={() => handleViewServiceRequestDetails(req)}>{req.message}</td>
                          <td>{req.receivedDate}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-button view" onClick={() => handleViewServiceRequestDetails(req)}>View</button>
                              <button className="action-button reject" onClick={() => handleRequestAction('deleteServiceRequest', req)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}




          {currentView === 'employeeManagement' && (
            <div className="employee-management-container">
              <div className="employee-management-box">
                <div className="employee-management-header">
                  <h2 className="employee-management-title">Employee Management</h2>
                  <div className="employee-search-add">
                    <input type="text" placeholder="Search employees..." className="employee-search-input" value={searchTerm} onChange={handleSearchChange} />
                    <button className="add-employee-btn" onClick={handleAddEmployeeClick}  >Add Employee</button>
                  </div>
                </div>
                <div className="employee-list">
                  {filteredEmployees.map(employee => (
                    <div className="employee-card" key={employee.id}>
                      <div className="employee-card-left">
                        <div className="employee-avatar">{getInitials(`${employee.firstName} ${employee.lastName}`)}</div>
                        <div className="employee-info">
                          <div className="employee-name">{`${employee.firstName} ${employee.lastName}`}</div>
                          <div className="employee-email">{employee.personalEmail}</div>
                          <div className="employee-roles">
                            {(employee.roles || []).map(role => (
                              <span key={role} className="role-tag" style={{ backgroundColor: getRoleTagBg(role), color: getRoleTagText(role) }}>{role}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="employee-actions">
                        <button className="action-btn" onClick={() => handleEditEmployeeClick(employee.id)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteemployeeClick(employee.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'departments' && (
            <div className="department-management-container">
              <div className="department-management-box">
                <div className="department-header">
                  <h2>Department Management</h2>
                </div>
                <div className="department-table-container">
                  <table className="department-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Head of Department</th>
                        <th>Employees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>{dept.head}</td>
                          <td>{employees.filter(e => (e.roles || []).includes(dept.name.toLowerCase())).length}</td>
                          <td>
                            <button className="action-btn" onClick={() => handleEditDepartmentClick(dept.id)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === 'assetManagement' && (
            <div className="asset-management-container">
              <div className="asset-management-box">
                <div className="asset-header">
                  <div>
                    <h2 className="asset-title">Asset Management</h2>
                    <p className="asset-subtitle">Assign and manage laptops, devices, and equipment for your team</p>
                  </div>
                  <button className="assign-asset-btn" onClick={handleAssignAssetClick}>


                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25ZM19 12H22V14H19V17H17V14H14V12H17V9H19V12Z" />
                    </svg>
                    Assign Asset
                  </button>
                </div>

                <div className="asset-stats-grid">

                  <div className="asset-stat-card">
                    <div className="asset-stat-card-icon-wrapper total">

                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4ZM5 7H19V9H5V7ZM5 11H17V13H5V11ZM5 15H13V17H5V15Z" />
                      </svg>
                    </div>
                    <div className="asset-stat-card-value">{assets.length}</div>
                    <div className="asset-stat-card-label">Total Assets</div>
                  </div>


                  <div className="asset-stat-card">
                    <div className="asset-stat-card-icon-wrapper available">

                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.29289C17.0976 8.90237 17.0976 8.26921 16.7071 7.87869C16.3166 7.48816 15.6834 7.48816 15.2929 7.87869L10.5 12.6716L8.70711 10.8787C8.31658 10.4882 7.68342 10.4882 7.29289 10.8787C6.90237 11.2692 6.90237 11.9024 7.29289 12.2929L9.87869 14.8787C10.2692 15.2692 10.9024 15.2692 11.2929 14.8787L16.7071 9.46447V9.29289Z" />
                      </svg>
                    </div>
                    <div className="asset-stat-card-value">{assets.filter(a => a.status === 'available').length}</div>
                    <div className="asset-stat-card-label">Available</div>
                  </div>


                  <div className="asset-stat-card">
                    <div className="asset-stat-card-icon-wrapper assigned">

                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25Z" />
                      </svg>
                    </div>
                    <div className="asset-stat-card-value">{assets.filter(a => a.status === 'assigned').length}</div>
                    <div className="asset-stat-card-label">Assigned</div>
                  </div>


                  <div className="asset-stat-card">
                    <div className="asset-stat-card-icon-wrapper pending">

                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 6V12H18V10H14V6H12Z" />
                      </svg>
                    </div>
                    <div className="asset-stat-card-value">0</div>
                    <div className="asset-stat-card-label">Pending Requests</div>
                  </div>
                </div>

                <div className="quick-assign-section">
                  <h3>Quick Asset Assignment by Role</h3>
                  <div className="quick-assign-grid">
                    {['Admin', 'Manager', 'Team Lead', 'Employee'].map(role => (
                      <div className="quick-assign-card" key={role}>
                        <div className="quick-assign-card-header">
                          <div className="quick-assign-card-title">{role}</div>
                          <div className="quick-assign-card-users">{employees.filter(emp => emp.roles.includes(role.toLowerCase())).length} users</div>
                        </div>
                        <div className="quick-assign-card-info">Assets Assigned: {assets.filter(a => a.assignedTo && employees.find(e => e.name === a.assignedTo)?.roles.includes(role.toLowerCase())).length}</div>
                        <div className="quick-assign-card-info">Available Laptops: {assets.filter(a => a.status === 'available' && a.type === 'Laptop').length}</div>
                        <button className="quick-assign-card-btn" onClick={handleAssignAssetClick}>

                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25ZM19 12H22V14H19V17H17V14H14V12H17V9H19V12Z" />
                          </svg>
                          Assign to {role.toLowerCase()}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recent-activity-section">
                  <h3>Recent Asset Activity</h3>
                  <div className="asset-activity-table-container">
                    <table className="asset-activity-table">
                      <thead>
                        <tr>
                          <th>Asset</th>
                          <th>Assigned To</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetAssignments.length > 0 ? (
                          assetAssignments.map(assignment => {
                            const asset = assets.find(a => a.id === assignment.assetId);
                            const employee = employees.find(e => e.id === assignment.employeeId);
                            return (
                              <tr key={assignment.id}>
                                <td>
                                  <div className="asset-info">
                                    <div className="asset-icon-wrapper">

                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                                        <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2ZM13 4.5L17.5 9H13V4.5ZM7 11V13H17V11H7ZM7 15V17H17V15H7Z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="asset-name">{asset?.tag} - {asset?.name}</div>
                                      <div className="asset-description">Assigned for {assignment.reason}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {employee?.name} ({employee?.roles.find(r => !['active', 'inactive', 'pending'].includes(r)) || 'N/A'})
                                  <div className="assigned-to-info">{employee?.email}</div>
                                </td>
                                <td>
                                  <span
                                    className="asset-status-tag"
                                    style={{
                                      backgroundColor: getRoleTagBg(asset?.status || 'N/A'),
                                      color: getRoleTagText(asset?.status || 'N/A'),
                                    }}
                                  >
                                    {asset?.status || 'N/A'}
                                  </span>
                                </td>
                                <td>{assignment.assignedDate}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No recent asset activity.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}


          {currentView === 'clientManagement' && (
            <div className="client-management-container">
              <div className="client-management-box">
                <div className="client-management-header-section">
                  <h2 className="client-management-title">Client Details Management</h2>
                </div>

                {/* Client Filter Tabs */}
                <div className="client-filter-tabs">
                  {[
                    { label: 'Registered Clients', value: 'registered', count: clients.filter(c => c.displayStatuses.includes('registered')).length, activeBg: 'var(--client-filter-tab-bg-active-registered)', activeColor: 'var(--client-filter-tab-text-active-registered)', badgeBg: 'var(--client-filter-tab-badge-registered)' },
                    { label: 'Unassigned Clients', value: 'unassigned', count: clients.filter(c => c.displayStatuses.includes('unassigned')).length, activeBg: 'var(--client-filter-tab-bg-active-unassigned)', activeColor: 'var(--client-filter-tab-text-active-unassigned)', badgeBg: 'var(--client-filter-tab-badge-unassigned)' },
                    { label: 'Active Clients', value: 'active', count: clients.filter(c => c.displayStatuses.includes('active')).length, activeBg: 'var(--client-filter-tab-bg-active-active)', activeColor: 'var(--client-filter-tab-text-active-active)', badgeBg: 'var(--client-filter-tab-badge-active)' },
                    { label: 'Rejected Clients', value: 'rejected', count: clients.filter(c => c.displayStatuses.includes('rejected')).length, activeBg: 'var(--client-filter-tab-bg-active-rejected)', activeColor: 'var(--client-filter-tab-text-active-rejected)', badgeBg: 'var(--client-filter-tab-badge-rejected)' },
                    // { label: 'Restore Clients', value: 'restored', count: clients.filter(c => c.displayStatuses.includes('restored')).length, activeBg: 'var(--client-filter-tab-bg-active-restored)', activeColor: 'var(--client-filter-tab-text-active-restored)', badgeBg: 'var(--client-filter-tab-badge-restored)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`client-filter-tab-item ${option.value}`}
                      style={{
                        backgroundColor: clientFilter === option.value ? option.activeBg : 'transparent',
                        color: clientFilter === option.value ? option.activeColor : 'rgba(51, 65, 85, 1)',
                      }}
                    >
                      <input
                        type="radio"
                        name="client-filter"
                        value={option.value}
                        checked={clientFilter === option.value}
                        onChange={(e) => {
                          setClientFilter(e.target.value);
                          setClientSearchTerm('');
                          // selectedServiceFilter state is intentionally NOT reset here, to maintain selection across tabs
                        }}
                      />
                      <span className="client-filter-tab-label">{option.label}</span>
                      <span className="badge" style={{ backgroundColor: clientFilter === option.value ? option.badgeBg : '#9AA0A6' }}>
                        {option.count}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Search Input and Service Dropdown */}
                <div className="client-search-and-filter-group">
                  <div className="client-search-input-group">
                    <span className="search-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="clientSearch"
                      placeholder="Search clients by name, email, mobile, job, or country"
                      className="client-search-input"
                      value={clientSearchTerm}
                      onChange={handleClientSearchChange}
                    />
                  </div>


                  <div className="service-filter-group">
                    <label htmlFor="serviceFilter" className="form-label" style={{ fontSize: '20px' }}>Services:</label>
                    <select
                      id="serviceFilter"
                      name="serviceFilter"


                      className="form-select"
                      value={selectedServiceFilter}
                      onChange={(e) => setSelectedServiceFilter(e.target.value)}
                    >
                      {serviceOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {selectedServiceFilter === 'All' ? (
                  renderAllServiceTables()
                ) : (
                  <>
                    <h4 className="client-table-title">
                      {clientFilter === 'registered' && `Registered Clients`}
                      {clientFilter === 'unassigned' && `Unassigned Clients`}
                      {clientFilter === 'active' && `Active Clients`}
                      {clientFilter === 'rejected' && `Rejected Clients`}
                      {clientFilter === 'restored' && `Restored Clients`} ({filteredClients.length})
                    </h4>


                    {renderClientTable(filteredClients, selectedServiceFilter, clientFilter)}
                  </>
                )}

              </div>
            </div>
          )}
        </div>
      </main>


      {/* Employee Profile Details Modal */}
      {showEmployeeProfileModal && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Employee Profile</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEmployeeProfileModal(false)}>&times;</button>
            </div>

            <div className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {isEditingProfile ? (
                // Edit Mode
                <>
                  <div className="form-group">
                    <label className="form-label">Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={editedEmployeeDetails.name || ''}
                      onChange={handleProfileFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={editedEmployeeDetails.employeeId || ''}
                      className="form-input"
                      style={{ cursor: 'not-allowed', backgroundColor: 'var(--border-color)' }}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={editedEmployeeDetails.email || ''}
                      onChange={handleProfileFormChange}
                      className="form-input"
                      style={{ cursor: 'not-allowed', backgroundColor: 'var(--border-color)' }}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile No. <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="mobile"
                      value={editedEmployeeDetails.mobile || ''}
                      onChange={handleProfileFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Login</label>
                    <input
                      type="text"
                      name="lastLogin"
                      value={editedEmployeeDetails.lastLogin || ''}
                      className="form-input"
                      style={{ cursor: 'not-allowed', backgroundColor: 'var(--border-color)' }}
                      disabled
                    />
                  </div>
                </>
              ) : (
                // View Mode
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p><strong>Name:</strong> {employeeDetails.name}</p>
                  <p><strong>Employee ID:</strong> {employeeDetails.employeeId}</p>
                  <p><strong>Email:</strong> {employeeDetails.email}</p>
                  <p><strong>Mobile No.:</strong> {employeeDetails.mobile}</p>
                  <p><strong>Last Login:</strong> {employeeDetails.lastLogin}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={handleCancelEditProfile}
                    className="confirm-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfileChanges}
                    className="create-employee-btn"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="create-employee-btn"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowEmployeeProfileModal(false)}
                    className="confirm-cancel-btn"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}




      {/* Create New employee Account Modal */}
      {isAddEmployeeModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content employee-add-modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Create New employee Account</h3>
                <p className="modal-subtitle">Create a new employee account for the TechXplorers platform. Select the appropriate role and fill in all required information.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseAddEmployeeModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleCreateemployeeAccount}>
              {/* Personal Info */}
              <div className="section-title">Personal Information</div>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  placeholder="Enter first name"
                  value={newemployee.firstName}
                  onChange={handleNewemployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  placeholder="Enter first name"
                  value={newemployee.lastName}
                  onChange={handleNewemployeeChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  id="date"
                  name="dateOfBirth"
                  className="form-input"
                  placeholder="Enter Your DOB"
                  value={newemployee.dateOfBirth}
                  onChange={handleNewemployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={newemployee.gender}
                  onChange={handleNewemployeeChange}
                >
                  <option value="">Select...</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  className="form-select"
                  value={newemployee.maritalStatus}
                  onChange={handleNewemployeeChange}
                >
                  <option value="">Select...</option>
                  {maritalStatusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {/* Contact Info */}
              <div className="section-title">Contact Details</div>
              <div className="form-group">
                <label htmlFor="personalNumber" className="form-label">Personal Phone</label>
                <input
                  type="tel"
                  id="personalNumber"
                  name="personalNumber"
                  className="form-input"
                  placeholder="Enter personal phone"
                  value={newemployee.personalNumber}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="alternativeNumber" className="form-label">Alternative Phone</label>
                <input
                  type="tel"
                  id="alternativeNumber"
                  name="alternativeNumber"
                  className="form-input"
                  placeholder="Enter alternative phone"
                  value={newemployee.alternativeNumber}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="personalEmail" className="form-label">Personal Email</label>
                <input
                  type="email"
                  id="personalEmail"
                  name="personalEmail"
                  className="form-input"
                  placeholder="Enter personal email"
                  value={newemployee.personalEmail}
                  onChange={handleNewemployeeChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="workEmail" className="form-label">Work Email</label>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  className="form-input"
                  placeholder="Enter work email"
                  value={newemployee.workEmail}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-input"
                  placeholder="Enter address"
                  rows="2"
                  value={newemployee.address}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="Enter city"
                  value={newemployee.city}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  placeholder="Enter state"
                  value={newemployee.state}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipcode" className="form-label">Zip Code</label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  className="form-input"
                  placeholder="Enter zip code"
                  value={newemployee.zipcode}
                  onChange={handleNewemployeeChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-input"
                  placeholder="Enter country"
                  value={newemployee.country}
                  onChange={handleNewemployeeChange}
                />
              </div>
              {/* Company Info */}
              <div className="section-title">Company Details</div>

              <div className="form-group modal-form-full-width">
                <label htmlFor="role" className="form-label">Role *</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={newemployee.role}
                  onChange={handleNewemployeeChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="role-description">
                  {roleOptions.find(option => option.value === newemployee.role)?.description}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={newemployee.department}
                  onChange={handleNewemployeeChange}
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
                  value={newemployee.accountStatus}
                  onChange={handleNewemployeeChange}
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
                    type="text"
                    id="temporaryPassword"
                    name="temporaryPassword"
                    className="form-input"
                    placeholder="Enter temporary password"
                    value={newemployee.temporaryPassword}
                    onChange={handleNewemployeeChange}
                    required
                  />
                  <button type="button" className="generate-password-btn" onClick={generateTemporaryPassword}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.3 183.5 64 223.8 64 256c0 32.2 25.3 72.5 64.1 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.7 328.5 512 288.2 512 256c0-32.2-25.3-72.5-64.1-108.3C406.8 109.6 353.2 80 288 80zM96 256c0-10.8 2.8-21.6 7.9-31.7c17.5-35.3 47.6-64.7 85.8-84.3c15.2-7.8 31.5-12 48.3-12s33.1 4.2 48.3 12c38.2 19.6 68.3 49 85.8 84.3c5.1 10.1 7.9 20.9 7.9 31.7s-2.8 21.6-7.9 31.7c-17.5 35.3-47.6 64.7-85.8 84.3c-15.2 7.8-31.5 12-48.3 12c-38.2-19.6-68.3-49-85.8-84.3C98.8 277.6 96 266.8 96 256zm192 0a64 64 0 1 0 0-128 64 64 0 1 0 0 128z" />
                    </svg>
                    Generate
                  </button>
                </div>
                <p className="role-description">The employee will be prompted to change this password on first login.</p>
              </div>
              <div className="modal-footer modal-form-full-width">
                <button type="submit" className="create-employee-btn">Create employee Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit employee Account Modal */}
      {isEditemployeeModalOpen && currentEmployeeToEdit && (
        <div className="modal-overlay open">
          <div className="modal-content employee-edit-modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit Employee Account</h3>
                <p className="modal-subtitle">Update employee's personal and work details.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseEditEmployeeModal}>&times;</button>
            </div>

            <div className="details-grid form-layout">
              {/* Personal Info */}
              <div className="section-title">Personal Information</div>
              <div className="form-item">
                <label>First Name *</label>
                <input type="text" name="firstName" value={currentEmployeeToEdit.firstName} onChange={handleEditemployeeChange} required />
              </div>
              <div className="form-item">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={currentEmployeeToEdit.lastName} onChange={handleEditemployeeChange} required />
              </div>
              <div className="form-item">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={currentEmployeeToEdit.dateOfBirth} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Gender</label>
                <select name="gender" value={currentEmployeeToEdit.gender} onChange={handleEditemployeeChange}>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-item">
                <label>Marital Status</label>
                <select name="maritalStatus" value={currentEmployeeToEdit.maritalStatus} onChange={handleEditemployeeChange}>
                  <option value="">Select...</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="section-title">Contact Details</div>
              <div className="form-item">
                <label>Personal Phone</label>
                <input type="tel" name="personalNumber" value={currentEmployeeToEdit.personalNumber} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Alternative Phone</label>
                <input type="tel" name="alternativeNumber" value={currentEmployeeToEdit.alternativeNumber} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Personal Email</label>
                <input type="email" name="personalEmail" value={currentEmployeeToEdit.personalEmail} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Work Email *</label>
                <input type="email" name="workEmail" value={currentEmployeeToEdit.workEmail} onChange={handleEditemployeeChange} required />
              </div>
              <div className="form-item">
                <label>Address</label>
                <textarea name="address" value={currentEmployeeToEdit.address} onChange={handleEditemployeeChange}></textarea>
              </div>
              <div className="form-item">
                <label>City</label>
                <input type="text" name="city" value={currentEmployeeToEdit.city} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>State</label>
                <input type="text" name="state" value={currentEmployeeToEdit.state} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Zip Code</label>
                <input type="text" name="zipcode" value={currentEmployeeToEdit.zipcode} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Country</label>
                <input type="text" name="country" value={currentEmployeeToEdit.country} onChange={handleEditemployeeChange} />
              </div>

              {/* Company Info */}
              <div className="section-title">Company Details</div>
              <div className="form-item">
                <label>Date of Joining</label>
                <input type="date" name="dateOfJoin" value={currentEmployeeToEdit.dateOfJoin} onChange={handleEditemployeeChange} />
              </div>
              <div className="form-item">
                <label>Role *</label>
                <select name="role" value={currentEmployeeToEdit.role} onChange={handleEditemployeeChange} required>
                  {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-item">
                <label>Department</label>
                <select name="department" value={currentEmployeeToEdit.department} onChange={handleEditemployeeChange}>
                  {departmentOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-item">
                <label>Account Status</label>
                <select name="accountStatus" value={currentEmployeeToEdit.accountStatus} onChange={handleEditemployeeChange}>
                  {accountStatusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-footer modal-form-full-width">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseEditEmployeeModal}>Cancel</button>
              <button type="button" className="confirm-save-btn" onClick={handleUpdateEmployeeAccount}>Update Account</button>
            </div>
          </div>
        </div>
      )}


      {/* Delete employee Confirmation Modal */}
      {isDeleteConfirmModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="modal-title">Confirm Deletion</h3>
                <p className="modal-subtitle">Are you sure you want to delete this employee? This action cannot be undone.</p>
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

      {/* Create New Department Modal */}
      {isCreateDepartmentModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Create New Department</h3>
                <p className="modal-subtitle">Add a new department to the organization</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseCreateDepartmentModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSaveNewDepartment}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="newDeptName" className="form-label">Department Name *</label>
                <input
                  type="text"
                  id="newDeptName"
                  name="name"
                  className="form-input"
                  placeholder="Enter department name"
                  value={newDepartment.name}
                  onChange={handleNewDepartmentChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="newDeptDescription" className="form-label">Description</label>
                <input
                  type="text"
                  id="newDeptDescription"
                  name="description"
                  className="form-input"
                  placeholder="Enter department description"
                  value={newDepartment.description}
                  onChange={handleNewDepartmentChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newDeptHead" className="form-label">Head of Department</label>
                <select
                  id="newDeptHead"
                  name="head"
                  className="form-select"
                  value={newDepartment.head}
                  onChange={handleNewDepartmentChange}
                >
                  {headOfDepartmentOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="newDeptStatus" className="form-label">Status</label>
                <select
                  id="newDeptStatus"
                  name="status"
                  className="form-select"
                  value={newDepartment.status}
                  onChange={handleNewDepartmentChange}
                >
                  {departmentStatusOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer modal-form-full-width">
                <button type="submit" className="create-employee-btn">Create Department</button>
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseCreateDepartmentModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Details Modal */}
      {isDepartmentDetailsModalOpen && selectedDepartmentForDetails && (
        <div className="modal-overlay open">
          <div className="modal-content department-details-modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Department Details: {selectedDepartmentForDetails.name}</h3>
                <p className="modal-subtitle">Comprehensive information about the department.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDepartmentDetailsModal}>&times;</button>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Description</span>
                <span className="detail-value">{selectedDepartmentForDetails.description}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Head of Department</span>
                <span className="detail-value">{selectedDepartmentForDetails.head}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  <span className="status-tag" style={{
                    backgroundColor: getRoleTagBg(selectedDepartmentForDetails.status),
                    color: getRoleTagText(selectedDepartmentForDetails.status),
                  }}>
                    {selectedDepartmentForDetails.status}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created Date</span>
                <span className="detail-value">{selectedDepartmentForDetails.createdDate}</span>
              </div>
            </div>

            <div className="employees-list-section">
              <h4>Employees in this Department ({employeesInSelectedDepartment.length})</h4>
              <div className="employees-list">
                {employeesInSelectedDepartment.length > 0 ? (
                  employeesInSelectedDepartment.map(employee => (
                    <div key={employee.id} className="employee-list-item">
                      <span>{employee.name} ({employee.email})</span>
                      <span className="role-tag" style={{
                        backgroundColor: getRoleTagBg(employee.roles[0]),
                        color: getRoleTagText(employee.roles[0]),
                      }}>
                        {employee.roles[0]}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No employees currently assigned to this department.</p>
                )}
              </div>
            </div>

            <div className="modal-footer modal-form-full-width">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseDepartmentDetailsModal}>Close</button>
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
              
               <h4>Manage Employees</h4>
                <div className="employee-selection-box">
                    <div>
                        <h5>Employees in Department ({employeesInSelectedDepartment.length})</h5>
                        <div className="employee-list-scroll">
                            {employeesInSelectedDepartment.map(emp => (
                                <div key={emp.id} className="employee-list-item-manage">
                                    <span>{emp.name}</span>
                                    <button type="button" className="remove" onClick={() => handleRemoveEmployeeFromDepartment(emp.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5>Available Employees ({availableEmployeesForDepartment.length})</h5>
                        <div className="employee-list-scroll">
                            {availableEmployeesForDepartment.map(emp => (
                                <div key={emp.id} className="employee-list-item-manage">
                                    <span>{emp.name}</span>
                                    <button type="button" onClick={() => handleAddEmployeeToDepartment(emp.id)}>Add</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              <div className="modal-footer modal-form-full-width">
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseEditDepartmentModal}>Cancel</button>
                <button type="submit" className="create-user-btn">Update Department</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Generic Confirmation Modal */}
      {isConfirmUpdateModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="modal-title">Confirm Action</h3>
                <p className="modal-subtitle">{confirmUpdateMessage}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsConfirmUpdateModalOpen(false)}>&times;</button>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={() => setIsConfirmUpdateModalOpen(false)}>Cancel</button>
              {confirmActionType === 'departmentUpdate' && (
                <button type="button" className="create-employee-btn" onClick={confirmDepartmentUpdate}>Confirm Update</button>
              )}
              {confirmActionType === 'departmentDelete' && (
                <button type="button" className="confirm-delete-btn" onClick={confirmDepartmentDelete}>Confirm Delete</button>
              )}
              {confirmActionType === 'employeeUpdate' && (
                <button type="button" className="create-employee-btn" onClick={confirmEmployeeUpdate}>Confirm Update</button>
              )}
              {confirmActionType === 'employeeDelete' && (
                <button type="button" className="confirm-delete-btn" onClick={confirmEmployeeDelete}>Confirm Delete</button>
              )}
              {confirmActionType === null && ( // For "no changes" message
                <button type="button" className="create-employee-btn" onClick={() => setIsConfirmUpdateModalOpen(false)}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {isClientDetailsModalOpen && selectedClientForDetails && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">

              <h3 className="assign-modal-title">Client Details: {selectedClientForDetails.name || selectedClientForDetails.firstName + ' ' + selectedClientForDetails.lastName}</h3>




              <button className="assign-modal-close-button" onClick={handleCloseClientDetailsModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.2rem', height: '1.2rem' }}>
                  <path d="M6.29289 6.29289C6.68342 5.90237 7.31658 5.90237 7.70711 6.29289L12 10.5858L16.2929 6.29289C16.6834 5.90237 17.3166 5.90237 17.7071 6.29289C18.0976 6.68342 18.0976 7.31658 17.7071 7.70711L13.4142 12L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L12 13.4142L7.70711 17.7071C5.90237 7.31658 5.90237 6.68342 6.29289 6.29289Z" />
                </svg>
              </button>
            </div>

            {/* ====== CONDITIONAL RENDERING LOGIC STARTS HERE ====== */}
            {simplifiedServices.includes(selectedClientForDetails.service) ? (
              // --- NEW SIMPLIFIED VIEW ---
              <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">Service Request Details</h4>
                  <div className="assign-form-group">
                    <label>First Name *</label>
                    <div className="read-only-value">{selectedClientForDetails.firstName || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Last Name *</label>
                    <div className="read-only-value">{selectedClientForDetails.lastName || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Mobile *</label>
                    <div className="read-only-value">{selectedClientForDetails.mobile || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Email ID *</label>
                    <div className="read-only-value">{selectedClientForDetails.email || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Service *</label>
                    <div className="read-only-value">{selectedClientForDetails.service || '-'}</div>
                  </div>
                  {selectedClientForDetails.subServices && selectedClientForDetails.subServices.length > 0 && (
                    <div className="assign-form-group">
                      <label>What service do you want?</label>
                      <div className="read-only-value">
                        {selectedClientForDetails.subServices.join(', ') || '-'}
                      </div>
                    </div>
                  )}
                  <div className="assign-form-group">
                    <label>Who are you?</label>
                    <div className="read-only-value">{selectedClientForDetails.userType || '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              // --- ORIGINAL DETAILED VIEW ---
              <>
                {/* Comprehensive Client Details Grid - now read-only form fields */}
                <div className="client-preview-grid-container">
                  {/* Personal Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Personal Information</h4>
                    <div className="assign-form-group">
                      <label>First Name</label>
                      <div className="read-only-value">{selectedClientForDetails.firstName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Middle Name</label>
                      <div className="read-only-value">{selectedClientForDetails.middleName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Last Name</label>
                      <div className="read-only-value">{selectedClientForDetails.lastName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Date of Birth</label>
                      <div className="read-only-value">{selectedClientForDetails.dob || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Gender</label>
                      <div className="read-only-value">{selectedClientForDetails.gender || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Ethnicity</label>
                      <div className="read-only-value">{selectedClientForDetails.ethnicity || '-'}</div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Contact Information</h4>
                    <div className="assign-form-group">
                      <label>Address</label>
                      <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.address || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Zip Code</label>
                      <div className="read-only-value">{selectedClientForDetails.zipCode || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Mobile</label>
                      <div className="read-only-value">{selectedClientForDetails.mobile || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Email</label>
                      <div className="read-only-value">{selectedClientForDetails.email || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Country</label>
                      <div className="read-only-value">{selectedClientForDetails.country || '-'}</div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Service Details</h4>
                    <div className="assign-form-group">
                      <label>Service</label>
                      <div className="read-only-value">{selectedClientForDetails.service || '-'}</div>
                    </div>
                    {selectedClientForDetails.subServices && selectedClientForDetails.subServices.length > 0 && (
                      <div className="assign-form-group">
                        <label>What Service do you want?</label>
                        <div className="read-only-value">
                          {selectedClientForDetails.subServices.join(', ') || '-'}
                        </div>
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label>Who are you?</label>
                      <div className="read-only-value">{selectedClientForDetails.userType || '-'}</div>
                    </div>
                  </div>

                  {/* Job Preferences & Status */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Preferences & Status</h4>
                    <div className="assign-form-group">
                      <label>Security Clearance</label>
                      <div className="read-only-value">{selectedClientForDetails.securityClearance || '-'}</div>
                    </div>
                    {selectedClientForDetails.securityClearance === 'Yes' && (
                      <div className="assign-form-group">
                        <label>Clearance Level</label>
                        <div className="read-only-value">{selectedClientForDetails.clearanceLevel || '-'}</div>
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label>Willing to Relocate</label>
                      <div className="read-only-value">{selectedClientForDetails.willingToRelocate || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Work Preference</label>
                      <div className="read-only-value">{selectedClientForDetails.workPreference || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Restricted Companies</label>
                      <div className="read-only-value">{selectedClientForDetails.restrictedCompanies || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Jobs to Apply</label>
                      <div className="read-only-value">{selectedClientForDetails.jobsToApply || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Current Salary</label>
                      <div className="read-only-value">${selectedClientForDetails.currentSalary || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Expected Salary</label>
                      <div className="read-only-value">${selectedClientForDetails.expectedSalary || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Visa Status</label>
                      <div className="read-only-value">{selectedClientForDetails.visaStatus || '-'}</div>
                    </div>
                    {selectedClientForDetails.visaStatus === 'Other' && (
                      <div className="assign-form-group">
                        <label>Other Visa Status</label>
                        <div className="read-only-value">{selectedClientForDetails.otherVisaStatus || '-'}</div>
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label>Priority</label>
                      <div className="read-only-value">{selectedClientForDetails.priority || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Status</label>
                      <div className="read-only-value">{selectedClientForDetails.status || '-'}</div>
                    </div>
                  </div>

                  {/* Education Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Education Details</h4>
                    <div className="assign-form-group">
                      <label>School Name</label>
                      <div className="read-only-value">{selectedClientForDetails.schoolName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>School Address</label>
                      <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.schoolAddress || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>School Phone</label>
                      <div className="read-only-value">{selectedClientForDetails.schoolPhone || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Course of Study</label>
                      <div className="read-only-value">{selectedClientForDetails.courseOfStudy || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Graduation Date</label>
                      <div className="read-only-value">{selectedClientForDetails.graduationDate || '-'}</div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Employment Details</h4>
                    <div className="assign-form-group">
                      <label>Current Company</label>
                      <div className="read-only-value">{selectedClientForDetails.currentCompany || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Current Designation</label>
                      <div className="read-only-value">{selectedClientForDetails.currentDesignation || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Preferred Interview Time</label>
                      <div className="read-only-value">{selectedClientForDetails.preferredInterviewTime || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Earliest Joining Date</label>
                      <div className="read-only-value">{selectedClientForDetails.earliestJoiningDate || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Relieving Date</label>
                      <div className="read-only-value">{selectedClientForDetails.relievingDate || '-'}</div>
                    </div>
                  </div>

                  {/* References */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">References</h4>
                    <div className="assign-form-group">
                      <label>Reference Name</label>
                      <div className="read-only-value">{selectedClientForDetails.referenceName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Reference Phone</label>
                      <div className="read-only-value">{selectedClientForDetails.referencePhone || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Reference Address</label>
                      <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.referenceAddress || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Reference Email</label>
                      <div className="read-only-value">{selectedClientForDetails.referenceEmail || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Reference Role</label>
                      <div className="read-only-value">{selectedClientForDetails.referenceRole || '-'}</div>
                    </div>
                  </div>

                  {/* Job Portal Accounts */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Portal Accounts</h4>

                    <div className="assign-form-group">
                      <label>Account Name</label>
                      <div className="read-only-value">{selectedClientForDetails.jobPortalAccountName || '-'}</div>
                    </div>
                    <div className="assign-form-group">
                      <label>Credentials</label>
                      <div className="read-only-value">{selectedClientForDetails.jobPortalCredentials || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Skills section for viewing */}
                {selectedClientForDetails.technologySkills && (
                  <div className="client-preview-skills-section">
                    <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                    <div className="assign-form-group">
                      <div className="read-only-value" style={{ minHeight: '80px', alignItems: 'flex-start' }}>
                        {Array.isArray(selectedClientForDetails.technologySkills) ? selectedClientForDetails.technologySkills.join(', ') : selectedClientForDetails.technologySkills || '-'}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button assign" onClick={handleEditClientDetailsClick}>



                Edit Client Details
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Client Modal (now with matching style) */}
      {isEditClientModalOpen && currentClientToEdit && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">

              <h3 className="assign-modal-title">Edit Client Details: {currentClientToEdit.name || currentClientToEdit.firstName + ' ' + currentClientToEdit.lastName}</h3>


              <button className="assign-modal-close-button" onClick={handleCloseEditClientModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.2rem', height: '1.2rem' }}>
                  <path d="M6.29289 6.29289C6.68342 5.90237 7.31658 5.90237 7.70711 6.29289L12 10.5858L16.2929 6.29289C16.6834 5.90237 17.3166 5.90237 17.7071 6.29289C18.0976 6.68342 18.0976 7.31658 17.7071 7.70711L13.4142 12L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L12 13.4142L7.70711 17.7071C5.90237 7.31658 5.90237 6.68342 6.29289 6.29289Z" />
                </svg>
              </button>
            </div>
            {/* ====== CONDITIONAL RENDERING LOGIC FOR EDIT FORM ====== */}
            {simplifiedServices.includes(currentClientToEdit.service) ? (
              // --- NEW SIMPLIFIED EDIT FORM ---
              <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">Service Request Details</h4>
                  <div className="assign-form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input type="text" id="firstName" name="firstName" value={currentClientToEdit.firstName || ''} onChange={handleEditClientChange} required />
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input type="text" id="lastName" name="lastName" value={currentClientToEdit.lastName || ''} onChange={handleEditClientChange} required />
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="mobile">Mobile *</label>
                    <input type="tel" id="mobile" name="mobile" value={currentClientToEdit.mobile || ''} onChange={handleEditClientChange} required />
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="email">Email ID *</label>
                    <input type="email" id="email" name="email" value={currentClientToEdit.email || ''} onChange={handleEditClientChange} required />
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="service">Service *</label>
                    <select id="service" name="service" value={currentClientToEdit.service || ''} onChange={handleEditClientChange} required>
                      <option value="">Select Service</option>
                      {serviceOptions.filter(opt => opt !== 'All').map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="subServices">What service do you want? (Comma Separated)</label>
                    <textarea
                      id="subServices"
                      name="subServices"
                      value={Array.isArray(currentClientToEdit.subServices) ? currentClientToEdit.subServices.join(', ') : (currentClientToEdit.subServices || '')}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setCurrentClientToEdit(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()) }));
                      }}
                    ></textarea>
                  </div>
                  <div className="assign-form-group">
                    <label htmlFor="userType">Who are you?</label>
                    <select id="userType" name="userType" value={currentClientToEdit.userType || ''} onChange={handleEditClientChange}>
                      <option value="">Select Type</option>
                      <option value="Individual">Individual</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Startup Founder">Startup Founder</option>
                      <option value="Agency">Agency</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // --- ORIGINAL DETAILED EDIT FORM ---
              <>

                {/* Comprehensive Client Details Grid - now with input fields */}
                <div className="client-preview-grid-container">
                  {/* Personal Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Personal Information</h4>

                    <div className="assign-form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" id="firstName" name="firstName" value={currentClientToEdit.firstName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="middleName">Middle Name</label>
                      <input type="text" id="middleName" name="middleName" value={currentClientToEdit.middleName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" id="lastName" name="lastName" value={currentClientToEdit.lastName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="dob">Date of Birth</label>
                      <input type="date" id="dob" name="dob" value={currentClientToEdit.dob || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="gender">Gender</label>
                      <select id="gender" name="gender" value={currentClientToEdit.gender || ''} onChange={handleEditClientChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="ethnicity">Ethnicity</label>
                      <input type="text" id="ethnicity" name="ethnicity" value={currentClientToEdit.ethnicity || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Contact Information</h4>

                    <div className="assign-form-group">
                      <label htmlFor="address">Address</label>
                      <textarea id="address" name="address" value={currentClientToEdit.address || ''} onChange={handleEditClientChange}></textarea>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="zipCode">Zip Code</label>
                      <input type="text" id="zipCode" name="zipCode" value={currentClientToEdit.zipCode || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="mobile">Mobile</label>
                      <input type="tel" id="mobile" name="mobile" value={currentClientToEdit.mobile || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" value={currentClientToEdit.email || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="country">Country</label>
                      <input type="text" id="country" name="country" value={currentClientToEdit.country || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Service Details</h4>
                    <div className="assign-form-group">
                      <label htmlFor="service">Service</label>
                      <select id="service" name="service" value={currentClientToEdit.service || ''} onChange={handleEditClientChange}>
                        <option value="">Select Service</option>
                        {serviceOptions.filter(opt => opt !== 'All').map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    {(currentClientToEdit.service === 'Mobile Development' ||
                      currentClientToEdit.service === 'Web Development' ||
                      currentClientToEdit.service === 'Digital Marketing' ||
                      currentClientToEdit.service === 'IT Talent Supply') && (
                        <div className="assign-form-group">
                          <label htmlFor="subServices">What Service do you want? (Comma Separated)</label>
                          <textarea
                            id="subServices"
                            name="subServices"
                            value={Array.isArray(currentClientToEdit.subServices) ? currentClientToEdit.subServices.join(', ') : currentClientToEdit.subServices || ''}
                            onChange={(e) => setCurrentClientToEdit(prev => ({ ...prev, subServices: e.target.value.split(',').map(s => s.trim()) }))}
                          ></textarea>
                        </div>
                      )}
                    <div className="assign-form-group">
                      <label htmlFor="userType">Who are you?</label>
                      <input type="text" id="userType" name="userType" value={currentClientToEdit.userType || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* Job Preferences & Status */}

                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Preferences & Status</h4>



                    <div className="assign-form-group">
                      <label htmlFor="securityClearance">Security Clearance</label>
                      <select id="securityClearance" name="securityClearance" value={currentClientToEdit.securityClearance || 'No'} onChange={handleEditClientChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>





                    </div>
                    {currentClientToEdit.securityClearance === 'Yes' && (
                      <div className="assign-form-group">
                        <label htmlFor="clearanceLevel">Clearance Level</label>
                        <input type="text" id="clearanceLevel" name="clearanceLevel" value={currentClientToEdit.clearanceLevel || ''} onChange={handleEditClientChange} />
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label htmlFor="willingToRelocate">Willing to Relocate</label>
                      <select id="willingToRelocate" name="willingToRelocate" value={currentClientToEdit.willingToRelocate || 'No'} onChange={handleEditClientChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="workPreference">Work Preference</label>
                      <input type="text" id="workPreference" name="workPreference" value={currentClientToEdit.workPreference || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="restrictedCompanies">Restricted Companies</label>
                      <input type="text" id="restrictedCompanies" name="restrictedCompanies" value={currentClientToEdit.restrictedCompanies || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="jobsToApply">Jobs to Apply</label>
                      <input type="text" id="jobsToApply" name="jobsToApply" value={currentClientToEdit.jobsToApply || ''} onChange={handleEditClientChange} />
                    </div>




                    <div className="assign-form-group">

                      <label htmlFor="currentSalary">Current Salary</label>
                      <input type="text" id="currentSalary" name="currentSalary" value={currentClientToEdit.currentSalary || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="expectedSalary">Expected Salary</label>
                      <input type="text" id="expectedSalary" name="expectedSalary" value={currentClientToEdit.expectedSalary || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="visaStatus">Visa Status</label>
                      <input type="text" id="visaStatus" name="visaStatus" value={currentClientToEdit.visaStatus || ''} onChange={handleEditClientChange} />
                    </div>
                    {currentClientToEdit.visaStatus === 'Other' && (
                      <div className="assign-form-group">
                        <label htmlFor="otherVisaStatus">Other Visa Status</label>
                        <input type="text" id="otherVisaStatus" name="otherVisaStatus" value={currentClientToEdit.otherVisaStatus || ''} onChange={handleEditClientChange} />
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label htmlFor="priority">Priority</label>
                      <select id="priority" name="priority" value={currentClientToEdit.priority || 'medium'} onChange={handleEditClientChange}>
                        <option value="high">High</option>

                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="status">Status</label>
                      <input type="text" id="status" name="status" value={currentClientToEdit.status || ''} onChange={handleEditClientChange} />




                    </div>
                  </div>

                  {/* Education Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Education Details</h4>
                    <div className="assign-form-group">
                      <label htmlFor="schoolName">School Name</label>
                      <input type="text" id="schoolName" name="schoolName" value={currentClientToEdit.schoolName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="schoolAddress">School Address</label>
                      <textarea id="schoolAddress" name="schoolAddress" value={currentClientToEdit.schoolAddress || ''} onChange={handleEditClientChange}></textarea>




                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="schoolPhone">School Phone</label>
                      <input type="tel" id="schoolPhone" name="schoolPhone" value={currentClientToEdit.schoolPhone || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="courseOfStudy">Course of Study</label>
                      <input type="text" id="courseOfStudy" name="courseOfStudy" value={currentClientToEdit.courseOfStudy || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="graduationDate">Graduation Date</label>
                      <input type="date" id="graduationDate" name="graduationDate" value={currentClientToEdit.graduationDate || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Employment Details</h4>

                    <div className="assign-form-group">
                      <label htmlFor="currentCompany">Current Company</label>
                      <input type="text" id="currentCompany" name="currentCompany" value={currentClientToEdit.currentCompany || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="currentDesignation">Current Designation</label>
                      <input type="text" id="currentDesignation" name="currentDesignation" value={currentClientToEdit.currentDesignation || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="preferredInterviewTime">Preferred Interview Time</label>
                      <input type="text" id="preferredInterviewTime" name="preferredInterviewTime" value={currentClientToEdit.preferredInterviewTime || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="earliestJoiningDate">Earliest Joining Date</label>
                      <input type="date" id="earliestJoiningDate" name="earliestJoiningDate" value={currentClientToEdit.earliestJoiningDate || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="relievingDate">Relieving Date</label>
                      <input type="date" id="relievingDate" name="relievingDate" value={currentClientToEdit.relievingDate || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* References */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">References</h4>
                    <div className="assign-form-group">
                      <label htmlFor="referenceName">Reference Name</label>
                      <input type="text" id="referenceName" name="referenceName" value={currentClientToEdit.referenceName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referencePhone">Reference Phone</label>
                      <input type="tel" id="referencePhone" name="referencePhone" value={currentClientToEdit.referencePhone || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceAddress">Reference Address</label>
                      <textarea id="referenceAddress" name="referenceAddress" value={currentClientToEdit.referenceAddress || ''} onChange={handleEditClientChange}></textarea>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceEmail">Reference Email</label>
                      <input type="email" id="referenceEmail" name="referenceEmail" value={currentClientToEdit.referenceEmail || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceRole">Reference Role</label>
                      <input type="text" id="referenceRole" name="referenceRole" value={currentClientToEdit.referenceRole || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                  {/* Job Portal Accounts */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Portal Accounts</h4>

                    <div className="assign-form-group">
                      <label htmlFor="jobPortalAccountName">Account Name</label>
                      <input type="text" id="jobPortalAccountName" name="jobPortalAccountName" value={currentClientToEdit.jobPortalAccountName || ''} onChange={handleEditClientChange} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="jobPortalCredentials">Credentials</label>
                      <input type="text" id="jobPortalCredentials" name="jobPortalCredentials" value={currentClientToEdit.jobPortalCredentials || ''} onChange={handleEditClientChange} />
                    </div>
                  </div>

                </div>

                {/* Skills section for editing */}
                {currentClientToEdit.technologySkills && (
                  <div className="client-preview-skills-section">
                    <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                    <div className="assign-form-group">
                      <textarea
                        id="skills"
                        name="technologySkills" // Changed to technologySkills to match the client object
                        value={Array.isArray(currentClientToEdit.technologySkills) ? currentClientToEdit.technologySkills.join(', ') : currentClientToEdit.technologySkills || ''}
                        onChange={handleEditClientChange} // Use the general handler
                      ></textarea>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={handleCloseEditClientModal}>
                Cancel
              </button>
              <button className="assign-form-button assign" onClick={handleSaveClientDetails}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Management Modal */}
      {isPaymentModalOpen && selectedClientForPayment && (
        <div className="modal-overlay open">
          <div className="modal-content payment-modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Payment Management</h3>
                <p className="modal-subtitle">Create payment links or process immediate payments for {selectedClientForPayment.name}</p>
              </div>
              <button className="modal-close-btn" onClick={handleClosePaymentModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleGeneratePaymentLink(); }}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="paymentAmount" className="form-label">Amount *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>USD</span>
                  <input
                    type="number"
                    id="paymentAmount"
                    name="amount"
                    className="form-input"
                    placeholder="0.00"
                    value={paymentDetails.amount}
                    onChange={handlePaymentDetailsChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="paymentDescription" className="form-label">Description *</label>
                <input
                  type="text"
                  id="paymentDescription"
                  name="description"
                  className="form-input"
                  placeholder="e.g., Service charges, Consultation fee"
                  value={paymentDetails.description}
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="transactionDate" className="form-label">Transaction Date</label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  className="form-input"
                  value={paymentDetails.transactionDate}
                  readOnly
                />
              </div>

              <div className="payment-modal-client-details modal-form-full-width">
                <p><strong>Client Details:</strong></p>
                <p>Name: {selectedClientForPayment.name}</p>
                <p>Email: {selectedClientForPayment.email}</p>
                <p>Phone: {selectedClientForPayment.mobile}</p>
              </div>

              {generatedPaymentLink ? (
                <div className="generated-link-section modal-form-full-width">
                  <div className="generated-link-header">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.29289C17.0976 8.90237 17.0976 8.26921 16.7071 7.87869C16.3166 7.48816 15.6834 7.48816 15.2929 7.87869L10.5 12.6716L8.70711 10.8787C8.31658 10.4882 7.68342 10.4882 7.29289 10.8787C6.90237 11.2692 6.90237 11.9024 7.29289 12.2929L9.87869 14.8787C10.2692 15.2692 10.9024 15.2692 11.2929 14.8787L16.7071 9.46447V9.29289Z" />
                    </svg>
                    Payment Link Generated:
                  </div>
                  <div className="generated-link-input-group">
                    <input
                      type="text"
                      className="generated-link-input"
                      value={generatedPaymentLink}
                      readOnly
                    />
                    <div className="generated-link-actions">
                      <button type="button" className="generated-link-action-btn" onClick={handleCopyLink}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1ZM18 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H18C19.1046 23 20 22.1046 20 21V7C20 5.89543 19.1046 5 18 5ZM8 7H18V21H8V7Z" />
                        </svg>
                        Copy Link
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handleSendEmail}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Send Email
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handlePreviewLink}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4L20 4M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>
                  <button type="button" className="generated-link-close-btn" onClick={handleClosePaymentModal}>Close</button>
                </div>
              ) : (
                <div className="modal-footer modal-form-full-width">
                  <button type="button" className="confirm-cancel-btn" onClick={handleClosePaymentModal}>Cancel</button>

                  <button type="submit" className="create-employee-btn">

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M12 4H10C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12H12V14H10C6.68629 14 4 11.3137 4 8C4 4.68629 6.68629 2 10 2H12V4ZM14 10H12C9.79086 10 8 11.7909 8 14C8 16.2091 9.79086 18 12 18H14V20H12C8.68629 20 6 17.3137 6 14C6 10.6863 8.68629 8 12 8H14V10ZM18 6H16V8H18C21.3137 8 24 10.6863 24 14C24 17.3137 21.3137 20 18 20H16V18H18C20.2091 18 22 16.2091 22 14C22 11.7909 20.2091 10 18 10H16V6Z" />
                    </svg>
                    Generate Link
                  </button>
                </div>
              )}

              <div className="payment-modal-options modal-form-full-width">
                <h4>Payment Options:</h4>
                <p className="payment-modal-option-item">
                  • <strong>Pay Now:</strong> Opens secure payment gateway for immediate processing
                </p>
                <p className="payment-modal-option-item">
                  • <strong>Generate Link:</strong> Creates shareable payment link for client use
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Asset Modal */}
      {isAssignAssetModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Assign Asset to User</h3>
                <p className="modal-subtitle">Select an available asset and assign it to a user with a reason for the assignment.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseAssignAssetModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleAssignAsset}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="searchAssets" className="form-label">Search Available Assets</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--modal-input-border)', borderRadius: '0.5rem', backgroundColor: 'var(--modal-input-bg)' }}>
                  <span style={{ padding: '0.75rem 0.75rem 0.75rem 1rem', color: 'var(--search-icon)' }}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="searchAssets"
                    className="form-input"
                    placeholder="Search by asset tag, brand, or model..."
                    value={assetSearchTermInModal}
                    onChange={(e) => setAssetSearchTermInModal(e.target.value)}
                    style={{ border: 'none', padding: '0.75rem 1rem', flexGrow: 1 }}
                  />
                </div>
              </div>

              <div className="form-group modal-form-full-width">
                <label htmlFor="assetId" className="form-label">Select Asset *</label>
                <select
                  id="assetId"
                  name="assetId"
                  className="form-select"
                  value={newAssignment.assetId}
                  onChange={handleNewAssignmentChange}
                  required
                >
                  <option value="">Choose an available asset</option>
                  {filteredAvailableAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.tag} - {asset.name} ({asset.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group modal-form-full-width">
                <label htmlFor="employeeId" className="form-label">Assign to User *</label>
                <select
                  id="employeeId"
                  name="employeeId"
                  className="form-select"
                  value={newAssignment.employeeId}
                  onChange={handleNewAssignmentChange}
                  required
                >
                  <option value="">Choose a user</option>
                  {filteredEmployeesForAssignment.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group modal-form-full-width">
                <label htmlFor="reason" className="form-label">Assignment Reason *</label>
                <textarea
                  id="reason"
                  name="reason"
                  className="form-input"
                  placeholder="Enter the reason for this assignment (e.g., New employee laptop setup, Project requirement, etc.)"
                  value={newAssignment.reason}
                  onChange={handleNewAssignmentChange}
                  rows="3"
                  required
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="modal-footer modal-form-full-width" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseAssignAssetModal}>Cancel</button>
                <button type="submit" className="create-employee-btn">
                  {/* Person Plus Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25ZM19 12H22V14H19V17H17V14H14V12H17V9H19V12Z" />
                  </svg>
                  Assign Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Request Management Modals (Refactored) --- */}

      {/* Career Submission Details Modal */}
      {showCareerDetailsModal && (
        <div className="modal-overlay open">
          <div className="modal-content request-details-modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Career Application Details</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseCareerDetailsModal}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedCareerSubmission && (
                <div>
                  <div className="detail-item"><span className="detail-label">Name:</span> <span className="detail-value">{selectedCareerSubmission.firstName} {selectedCareerSubmission.lastName}</span></div>
                  <div className="detail-item"><span className="detail-label">Email:</span> <span className="detail-value">{selectedCareerSubmission.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Mobile:</span> <span className="detail-value">{selectedCareerSubmission.mobile}</span></div>
                  <div className="detail-item"><span className="detail-label">Role Applied For:</span> <span className="detail-value">{selectedCareerSubmission.role}</span></div>
                  <div className="detail-item"><span className="detail-label">Years of Experience:</span> <span className="detail-value">{selectedCareerSubmission.experience}</span></div>
                  <div className="detail-item"><span className="detail-label">Current Salary:</span> <span className="detail-value">${selectedCareerSubmission.currentSalary}</span></div>
                  <div className="detail-item"><span className="detail-label">Expected Salary:</span> <span className="detail-value">${selectedCareerSubmission.expectedSalary}</span></div>
                  <div className="detail-item"><span className="detail-label">Resume:</span> <span className="detail-value"><button className="action-button download">{selectedCareerSubmission.resume}</button></span></div>
                  <div className="detail-item"><span className="detail-label">Status:</span> <span className="detail-value">
                    <span className="status-tag" style={{ backgroundColor: getRoleTagBg(selectedCareerSubmission.status), color: getRoleTagText(selectedCareerSubmission.status) }}>
                      {selectedCareerSubmission.status}
                    </span>
                  </span></div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseCareerDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Message Details Modal */}
      {showContactDetailsModal && (
        <div className="modal-overlay open">
          <div className="modal-content request-details-modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Contact Us Message</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseContactDetailsModal}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedContactSubmission && (
                <div>
                  <div className="detail-item"><span className="detail-label">From:</span> <span className="detail-value">{selectedContactSubmission.firstName} {selectedContactSubmission.lastName}</span></div>
                  <div className="detail-item"><span className="detail-label">Email:</span> <span className="detail-value">{selectedContactSubmission.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Phone:</span> <span className="detail-value">{selectedContactSubmission.phone}</span></div>
                  <div className="detail-item"><span className="detail-label">Received On:</span> <span className="detail-value">{selectedContactSubmission.date}</span></div>
                  <div className="message-content">
                    <h5 className="detail-label">Message:</h5>
                    <p className="detail-value">{selectedContactSubmission.message}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseContactDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Details Modal */}
      {showServiceRequestModal && (
        <div className="modal-overlay open">
          <div className="modal-content request-details-modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Service Request Details</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseServiceRequestModal}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedServiceRequest && (
                <div>
                  <div className="detail-item">
                    <span className="detail-label">From Email:</span>
                    <span className="detail-value">{selectedServiceRequest.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Received On:</span>
                    <span className="detail-value">{selectedServiceRequest.receivedDate}</span>
                  </div>
                  <div className="message-content">
                    <h5 className="detail-label">Message:</h5>
                    <p className="detail-value">{selectedServiceRequest.message}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseServiceRequestModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Request Confirmation Modal */}
      {showRequestConfirmModal && (
        <div className="modal-overlay open">
          <div className="modal-content request-details-modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Confirm Action</h3>
              </div>
              <button className="modal-close-btn" onClick={closeRequestConfirmModal}>&times;</button>
            </div>
            <div className="modal-body" style={{ paddingTop: "1rem" }}>
              <p>{requestConfirmMessage}</p>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={closeRequestConfirmModal}>Cancel</button>
              <button
                type="button"
                className={requestConfirmAction === 'deleteContact' || requestConfirmAction === 'reject' || requestConfirmAction === 'deleteServiceRequest' ? 'confirm-delete-btn' : 'create-employee-btn'}
                onClick={confirmRequestAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Client Confirmation Modal */}
      {isDeleteClientConfirmModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Deletion</h3>
              <button className="modal-close-btn" onClick={handleCancelClientDelete}>&times;</button>
            </div>
            <p className="modal-subtitle">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={handleCancelClientDelete}>Cancel</button>
              <button type="button" className="confirm-delete-btn" onClick={handleConfirmClientDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Details Modal */}
      {showServiceRequestModal && (
        <div className="modal-overlay open">
          <div className="modal-content request-details-modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Service Request Details</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseServiceRequestModal}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedServiceRequest && (
                <div>
                  <div className="detail-item">
                    <span className="detail-label">From Email:</span>
                    <span className="detail-value">{selectedServiceRequest.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Received On:</span>
                    <span className="detail-value">{selectedServiceRequest.receivedDate}</span>
                  </div>
                  <div className="message-content">
                    <h5 className="detail-label">Message:</h5>
                    <p className="detail-value">{selectedServiceRequest.message}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseServiceRequestModal}>Close</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminWorksheet;
