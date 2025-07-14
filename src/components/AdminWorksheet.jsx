import React, { useState, useEffect, useRef } from 'react'; // Import employeeef

const AdminWorksheet = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState(' employeeManagement'); // Default view to employee Management
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const profileDropdownRef = useRef(null); // Ref for the profile dropdown area

  const [employees, setemployees] = useState([
    { id: 1, name: 'Admin employee', email: 'admin@techxplorers.in', roles: ['admin', 'active', 'Management'] },
    { id: 2, name: 'Sarah Wilson', email: 'manager@techxplorers.in', roles: ['manager', 'active', 'Management'] },
    { id: 3, name: 'Michael Johnson', email: 'teamlead@techxplorers.in', roles: ['team lead', 'active', 'Tech Placement'] },
    { id: 4, name: 'Asset Manager', email: 'assets@techxplorers.in', roles: ['asset manager', 'active', 'Operations'] },
    { id: 5, name: 'John Employee', email: 'employee@techxplorers.in', roles: ['employee', 'active', 'Development'] },
    { id: 6, name: 'John Client', email: 'client', roles: ['client', 'active', 'External'] }, // Changed role to 'client' for consistency
    { id: 7, name: 'Regular employee', email: 'employee@techxplorers.in', roles: ['employee', 'active', 'Development'] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // States for modals
  const [isAddemployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditemployeeModalOpen, setIsEditemployeeModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteId, setemployeeToDeleteId] = useState(null);
  const [currentemployeeToEdit, setCurrentemployeeToEdit] = useState(null);

  // State for the new employee form
  const [newemployee, setNewemployee] = useState({
    fullName: '',
    email: '',
    role: 'employee', // Default role
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
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false); // New state for create department modal
  const [newDepartment, setNewDepartment] = useState({ // State for new department form
    name: '',
    description: '',
    head: 'Not assigned',
    status: 'active',
  });

  // Client Management States (for the inline display)
  const [clientFilter, setClientFilter] = useState('registered'); // Default filter for client management
  const [selectedManagerPerClient, setSelectedManagerPerClient] = useState({});
  const [editingClientId, setEditingClientId] = useState(null);
  const [tempSelectedManager, setTempSelectedManager] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState(''); // Search term for clients

  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', mobile: '123-456-7890', email: 'john.doe@example.com', jobsApplyFor: 'Software Engineer', registeredDate: '2023-01-15', country: 'USA', visaStatus: 'H1B', paymentStatus: 'Pending', displayStatuses: ['registered'] },
    { id: 2, name: 'Jane Smith', mobile: '098-765-4321', email: 'jane.smith@example.com', jobsApplyFor: 'Data Analyst', registeredDate: '2023-02-20', country: 'Canada', visaStatus: 'PR', paymentStatus: 'Paid', displayStatuses: ['unassigned'] },
    { id: 3, name: 'Alice Johnson', mobile: '111-222-3333', email: 'alice.j@example.com', jobsApplyFor: 'UX Designer', registeredDate: '2023-03-01', country: 'UK', visaStatus: 'Tier 2', manager: 'Sarah Wilson', paymentStatus: 'N/A', displayStatuses: ['active'] },
    { id: 4, name: 'Bob Williams', mobile: '444-555-6666', email: 'bob.w@example.com', jobsApplyFor: 'Project Manager', registeredDate: '2023-04-10', country: 'Australia', visaStatus: 'Working Holiday', paymentStatus: 'Pending', displayStatuses: ['rejected'] },
    { id: 5, name: 'Charlie Brown', mobile: '777-888-9999', email: 'charlie.b@example.com', jobsApplyFor: 'DevOps Engineer', registeredDate: '2023-05-05', country: 'Germany', visaStatus: 'Blue Card', manager: 'Michael Johnson', paymentStatus: 'Paid', displayStatuses: ['active'] },
    { id: 6, name: 'Diana Prince', mobile: '123-123-1234', email: 'diana.p@example.com', jobsApplyFor: 'Product Manager', registeredDate: '2023-06-01', country: 'USA', visaStatus: 'Green Card', paymentStatus: 'N/A', displayStatuses: ['restored'] },
  ]);

  const managers = [
    { id: 1, firstName: 'Sarah', lastName: 'Wilson' },
    { id: 2, firstName: 'Michael', lastName: 'Johnson' },
    { id: 3, firstName: 'Emily', lastName: 'Davis' },
  ];


  const adminemployeeName = "Admin employee";
  const adminemployeeEmail = "administrator@company.com";

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
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState(''); // New state for the generated link

  // Effect to manage body scroll when any modal is open
  useEffect(() => {
    if (isAddemployeeModalOpen || isEditemployeeModalOpen || isDeleteConfirmModalOpen || isEditDepartmentModalOpen || isDeleteDepartmentConfirmModalOpen || isCreateDepartmentModalOpen || isPaymentModalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Cleanup function
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isAddemployeeModalOpen, isEditemployeeModalOpen, isDeleteConfirmModalOpen, isEditDepartmentModalOpen, isDeleteDepartmentConfirmModalOpen, isCreateDepartmentModalOpen, isPaymentModalOpen]);

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

  const filteredemployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add employee Modal Handlers
  const handleAddEmployeeClick = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    setNewemployee({
      fullName: '',
      email: '',
      role: 'employee',
      department: 'No department assigned',
      accountStatus: 'Active',
      temporaryPassword: '',
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
      newRoles.push(newemployee.department.toLowerCase()); // Ensure department is lowercase for consistency
    }
    setemployees(prevemployees => [
      ...prevemployees,
      {
        id: newemployeeId,
        name: newemployee.fullName,
        email: newemployee.email,
        roles: newRoles,
      }
    ]);
    handleCloseAddEmployeeModal();
  };

  // Edit employee Modal Handlers
  const handleEditEmployeeClick = (employeeId) => {
    const employee = employees.find(u => u.id === employeeId);
    if (employee) {
      // Extract the department from roles, assuming it's one of the departmentOptions
      const employeeDepartment = departmentOptions.find(dept => employee.roles.includes(dept.toLowerCase())) || 'No department assigned';
      // Extract account status
      const employeeAccountStatus = accountStatusOptions.find(status => employee.roles.includes(status.toLowerCase())) || 'Active';
      // Extract role
      const employeeRole = roleOptions.find(role => employee.roles.includes(role.value.toLowerCase()))?.value || 'employee';

      setCurrentemployeeToEdit({
        id: employee.id,
        fullName: employee.name,
        email: employee.email,
        role: employeeRole,
        department: employeeDepartment,
        accountStatus: employeeAccountStatus,
        temporaryPassword: '', // Password is not editable directly, or would be handled securely
      });
      setIsEditemployeeModalOpen(true);
    }
  };

  const handleCloseEditemployeeModal = () => {
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

  const handleUpdateemployeeAccount = (e) => {
    e.preventDefault();
    setemployees(prevemployees => prevemployees.map(employee => {
      if (employee.id === currentemployeeToEdit.id) {
        // Reconstruct roles based on updated form data
        const updatedRoles = [currentemployeeToEdit.role.toLowerCase()];
        if (currentemployeeToEdit.accountStatus.toLowerCase() === 'active') {
          updatedRoles.push('active');
        } else if (currentemployeeToEdit.accountStatus.toLowerCase() === 'inactive') {
          updatedRoles.push('inactive');
        } else if (currentemployeeToEdit.accountStatus.toLowerCase() === 'pending') {
          updatedRoles.push('pending');
        }
        if (currentemployeeToEdit.department !== 'No department assigned') {
          updatedRoles.push(currentemployeeToEdit.department.toLowerCase());
        }
        return {
          ...employee,
          name: currentemployeeToEdit.fullName,
          email: currentemployeeToEdit.email,
          roles: updatedRoles,
        };
      }
      return employee;
    }));
    handleCloseEditemployeeModal();
  };

  // Delete employee Confirmation Handlers
  const handleDeleteemployeeClick = (employeeId) => {
    setemployeeToDeleteId(employeeId);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalOpen(false);
    setemployeeToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    setemployees(employees.filter(employee => employee.id !== employeeToDeleteId));
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
        employees: 0, // New departments start with 0 employees
        status: newDepartment.status,
        createdDate: formattedDate,
      }
    ]);
    handleCloseCreateDepartmentModal();
  };


  // Client Management Handlers (for the inline display)
  const handleAcceptClient = (clientId) => {
    console.log(`Accept client with ID: ${clientId}`);
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['unassigned'], manager: null } : client
    ));
  };

  const handleDeclineClient = (clientId) => {
    console.log(`Decline client with ID: ${clientId}`);
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['rejected'] } : client
    ));
  };

  const handleAssignClient = (clientId) => {
    const managerName = selectedManagerPerClient[clientId];
    if (managerName) {
      console.log(`Assign client ${clientId} to manager ${managerName}`);
      setClients(prevClients => prevClients.map(client =>
        client.id === clientId ? { ...client, displayStatuses: ['active'], manager: managerName } : client
      ));
      setSelectedManagerPerClient(prev => {
        const newSelection = { ...prev };
        delete newSelection[clientId];
        return newSelection;
      });
    }
  };

  const handleRestoreClient = (clientId) => {
    console.log(`Restore client with ID: ${clientId}`);
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['restored', 'registered'], manager: null } : client
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
    return clients
      .filter(client => client.displayStatuses.includes(clientFilter))
      .filter(client =>
        [client.name, client.email, client.mobile, client.jobsApplyFor, client.country] // Removed paymentStatus from search fields
          .some(field => field && field.toLowerCase().includes(clientSearchTerm.toLowerCase()))
      );
  };

  const filteredClients = getFilteredClients();


  // Define options for the radio button navigation
  const adminViewOptions = [
    { value: 'clientManagement', label: 'Client Management' }, // Keep the tab
    { value: 'departments', label: 'Departments' },
    { value: ' employeeManagement', label: 'Employee Management' },
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
  // This should ideally come from a list of employees with appropriate roles.
  const headOfDepartmentOptions = [
    'Not assigned',
    'Sarah Wilson',
    'Michael Johnson',
    // Add other potential heads of department here
  ];

  const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const departmentStatusOptions = ['active', 'inactive', 'pending']; // For department table filter and edit

  // Payment Modal Handlers
  const handleOpenPaymentModal = (client) => {
    setSelectedClientForPayment(client);
    setPaymentDetails({
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().slice(0, 10), // Default to current date
    });
    setGeneratedPaymentLink(''); // Clear any previous generated link
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
    setGeneratedPaymentLink(''); // Clear generated link on close
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGeneratePaymentLink = () => {
    // In a real application, you would make an API call to generate a unique link.
    // For this example, we'll create a mock link.
    const mockLink = `https://31228083-199d-476b-a6cb-d029dbd0ce9-figmaiframepreview.figma.site#/pay/1/INV-14752-12703`;
    setGeneratedPaymentLink(mockLink);
    console.log('Generating payment link with details:', paymentDetails, ' for client:', selectedClientForPayment);
  };

  const handlePayNow = () => {
    console.log('Processing immediate payment with details:', paymentDetails, ' for client:', selectedClientForPayment);
    // In a real application, you would integrate with a payment gateway here for immediate payment.
    // For now, we'll just close the modal.
    handleClosePaymentModal();
  };

  const handleCopyLink = () => {
    if (generatedPaymentLink) {
      document.execCommand('copy'); // Use execCommand for broader iframe compatibility
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
    // In a real app, this would open an email client or trigger an email API.
  };

  const handlePreviewLink = () => {
    if (generatedPaymentLink) {
      window.open(generatedPaymentLink, '_blank');
    }
  };

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
      case 'hr': '#F0F4C3'; // Light Khaki
      case 'external': return '#F9FBE7'; // Light Yellow-Green
      // Client Status Tags (for modal, keeping them here as they might be used elsewhere too)
      case 'registered': return '#DBEAFE'; // Light Blue
      case 'unassigned': return '#FEF3C7'; // Light Yellow
      case 'rejected': return '#FEE2E2'; // Light Red
      case 'restored': return '#EDE9FE'; // Light Purple
      // Payment Status Tags
      case 'paid': return '#D9F5E6'; // Light Green
      case 'pending': return '#FFFDE7'; // Light Yellow
      case 'n/a': return '#E5E7EB'; // Light Grey
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
      case 'hr': return '#AFB42B'; // Lime
      case 'external': return '#AFB42B'; // Lime
      // Client Status Tags (for modal)
      case 'registered': return '#1D4ED8'; // Darker Blue
      case 'unassigned': return '#B45309'; // Darker Yellow
      case 'rejected': return '#B91C1C'; // Darker Red
      case 'restored': return '#6D28D9'; // Darker Purple
      // Payment Status Tags
      case 'paid': return '#28A745'; // Green
      case 'pending': return '#B45309'; // Darker Yellow
      case 'n/a': return '#6B7280'; // Grey
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
          // margin-left: auto;
          // margin-right: auto;
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
        .client-filter-tab-item.registered input[type="radio"]:checked + .client-filter-tab-label { background-color: #E6F0FF; color: #3A60EE; }
        .client-filter-tab-item.registered .badge { background-color: #3A60EE; }

        .client-filter-tab-item.unassigned input[type="radio"]:checked + .client-filter-tab-label { background-color: #FEF3C7; color: #B45309; }
        .client-filter-tab-item.unassigned .badge { background-color: #B45309; }

        .client-filter-tab-item.active input[type="radio"]:checked + .client-filter-tab-label { background-color: #D9F5E6; color: #28A745; }
        .client-filter-tab-item.active .badge { background-color: #28A745; }

        .client-filter-tab-item.rejected input[type="radio"]:checked + .client-filter-tab-label { background-color: #FFEDEE; color: #DC3545; }
        .client-filter-tab-item.rejected .badge { background-color: #DC3545; }

        .client-filter-tab-item.restored input[type="radio"]:checked + .client-filter-tab-label { background-color: #F0E6FF; color: #6A40EE; }
        .client-filter-tab-item.restored .badge { background-color: #6A40EE; }


        .client-search-input-group {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
          background-color: var(--bg-card);
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
            justify-content: space-between; /* Distribute space between items */
            flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
        }

        .modal-footer button {
            flex-grow: 1; /* Allow buttons to grow and fill space */
            flex-basis: auto; /* Allow buttons to shrink as needed */
            min-width: 120px; /* Ensure a minimum width for buttons */
            padding: 0.75rem 1rem; /* Consistent padding */
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
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <div className="ad-notification-icon">
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
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
          <div className="profile-dropdown-container" ref={profileDropdownRef}> {/* Added ref here */}
            <div className="ad-employee-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}> {/* Toggle dropdown */}
              <div className="ad-employee-info-text">
                <p className="ad-employee-name">{adminemployeeName}</p>
                {/* Added Admin Tag */}
                <span className="ad-admin-tag">
                  {/* employee Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Admin
                </span>
              </div>
              <div className="ad-initials-avatar">
                <span className="ad-initials-text">{adminInitials}</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li className="profile-dropdown-item header">My Account</li>
                <li className="profile-dropdown-item">
                  {/* employee Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Profile
                </li>
                <li className="profile-dropdown-item">
                  {/* Settings Icon (Gear icon from screenshot) */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.07 4.11C16.96 4.41 20 7.71 20 12C20 16.3 16.96 19.59 13.07 19.89L13.07 4.11ZM10.93 4.11L10.93 19.89C7.04 19.59 4 16.3 4 12C4 7.71 7.04 4.41 10.93 4.11Z" />
                  </svg>
                  Settings
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
              <p className="ad-subtitle">System administration and Employee management</p>
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

          {currentView === ' employeeManagement' && (
            <div className="employee-management-container">
              <div className="employee-management-box"> {/* New employee Management Box */}
                <div className="employee-management-header">
                  <h2 className="employee-management-title">Employee Management</h2>
                  <div className="employee-search-add">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="employee-search-input"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button className="add-employee-btn" onClick={handleAddEmployeeClick}>
                      {/* Plus Icon (Font Awesome: fa-plus) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}>
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                      </svg>
                      Add Employee
                    </button>
                  </div>
                </div>

                <div className="employee-list">
                  {filteredemployees.length > 0 ? (
                    filteredemployees.map(employee => (
                      <div className="employee-card" key={employee.id}>
                        <div className="employee-card-left">
                          <div className="employee-avatar">
                            {/* employee Icon for Avatar (Font Awesome: fa-employee) */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                            </svg>
                          </div>
                          <div className="employee-info">
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-email">{employee.email}</div>
                            <div className="employee-roles">
                              {employee.roles.map(role => (
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
                        <div className="employee-actions">
                          <button className="action-btn" onClick={() => handleEditEmployeeClick(employee.id)}>
                            {/* Edit Icon (Font Awesome: fa-pen-to-square) */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                              <path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-56.6 56.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l56.6-56.6L362.4 97.5c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0zm-16.3 16.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM128 448H64V384c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32H128c17.7 0 32-14.3 32-32s-14.3-32-32-32zM480 352c-17.7 0-32 14.3-32 32v64H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32z" />
                            </svg>
                            Edit
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteemployeeClick(employee.id)}>
                            {/* Trash Can Icon (Font Awesome: fa-trash-can) */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ad-card" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p className="ad-subtitle">No employees found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </div> {/* End of employee-management-box */}
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
                  <button className="create-department-btn" onClick={handleCreateDepartmentClick}>
                    {/* Plus Icon (Font Awesome: fa-plus) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
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
                        <path d="M192 32c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V32zm64 0V480H384V32H256zM64 128c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H64zm32 32V448h32V160H96z" />
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
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                      </svg>
                    </div>
                    <div className="department-stat-card-value">{departments.filter(d => d.status === 'active').length}</div>
                    <div className="department-stat-card-label">Active Departments</div>
                  </div>

                  {/* Total Employees Card - ICON CHANGED HERE */}
                  <div className="department-stat-card">
                    <div className="department-stat-card-icon-wrapper employees">
                      {/* New employee Icon (from Screenshot 2025-07-02 at 7.30.49 PM.png) */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25Z" />
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
                                {/* New employee Icon (from Screenshot 2025-07-02 at 7.30.49 PM.png) */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.8rem', height: '0.8rem' }}>
                                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 19.25C9.03261 19.25 6.48033 17.6169 5 15.1672C5.00001 13.197 8.33333 12.1667 12 12.1667C15.6667 12.1667 19 13.197 19 15.1672C17.5197 17.6169 14.9674 19.25 12 19.25Z" />
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
                                    <path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-56.6 56.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l56.6-56.6L362.4 97.5c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0zm-16.3 16.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM128 448H64V384c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32H128c17.7 0 32-14.3 32-32s-14.3-32-32-32zM480 352c-17.7 0-32 14.3-32 32v64H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32z" />
                                  </svg>
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDeleteDepartmentClick(dept.id)}>
                                  {/* Trash Can Icon (Font Awesome: fa-trash-can) */}
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '0.8rem', height: '0.8rem' }}>
                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
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
            <div className="client-management-container">
              <div className="client-management-box">
                <div className="client-management-header-section">
                  <h2 className="client-management-title">Client Details Management</h2>
                </div>

                {/* Client Filter Tabs */}
                <div className="client-filter-tabs">
                  {[
                    { label: 'Registered Clients', value: 'registered', count: clients.filter(c => c.displayStatuses.includes('registered')).length, activeBg: '#E6F0FF', activeColor: '#3A60EE', badgeBg: '#3A60EE' },
                    { label: 'Unassigned Clients', value: 'unassigned', count: clients.filter(c => c.displayStatuses.includes('unassigned')).length, activeBg: '#FEF3C7', activeColor: '#B45309', badgeBg: '#B45309' },
                    { label: 'Active Clients', value: 'active', count: clients.filter(c => c.displayStatuses.includes('active')).length, activeBg: '#D9F5E6', activeColor: '#28A745', badgeBg: '#28A745' },
                    { label: 'Rejected Clients', value: 'rejected', count: clients.filter(c => c.displayStatuses.includes('rejected')).length, activeBg: '#FFEDEE', activeColor: '#DC3545', badgeBg: '#DC3545' },
                    { label: 'Restore Clients', value: 'restored', count: clients.filter(c => c.displayStatuses.includes('restored')).length, activeBg: '#F0E6FF', activeColor: '#6A40EE', badgeBg: '#6A40EE' },
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
                          setClientSearchTerm(''); // Clear search when changing filter
                        }}
                      />
                      <span className="client-filter-tab-label">{option.label}</span>
                      <span className="badge" style={{ backgroundColor: clientFilter === option.value ? option.badgeBg : '#9AA0A6' }}>
                        {option.count}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Search Input */}
                <div className="client-search-input-group">
                  <span className="search-icon-wrapper">
                    {/* Search Icon (SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search clients by name, email, mobile, job, or country"
                    className="client-search-input"
                    value={clientSearchTerm}
                    onChange={handleClientSearchChange}
                  />
                </div>

                <h4 className="client-table-title">
                  {clientFilter === 'registered' && `Registered Clients`}
                  {clientFilter === 'unassigned' && `Unassigned Clients`}
                  {clientFilter === 'active' && `Active Clients`}
                  {clientFilter === 'rejected' && `Rejected Clients`}
                  {clientFilter === 'restored' && `Restored Clients`} ({filteredClients.length})
                </h4>

                {/* Client Table */}
                <div className="client-table-container">
                  <table className="client-table">
                    <thead>
                      <tr>
                        {/* Headers based on current filter */}
                        {(() => {
                          const headers = {
                            registered: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
                            unassigned: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
                            active: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Manager', 'Actions'],
                            rejected: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
                            restored: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
                          };
                          return headers[clientFilter].map((header) => (
                            <th key={header} style={{ textAlign: header === 'Actions' ? 'center' : 'left' }}> {/* Centered Actions column title */}
                              {header}
                            </th>
                          ));
                        })()}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client, index) => (
                          <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.mobile}</td>
                            <td>{client.email}</td>
                            <td>{client.jobsApplyFor}</td>
                            <td>{client.registeredDate}</td>
                            <td>{client.country}</td>
                            <td>{client.visaStatus}</td>
                            {(clientFilter === 'unassigned' || clientFilter === 'restored') && (
                              <td>
                                <select
                                  className="manager-select"
                                  value={selectedManagerPerClient[client.id] || ''}
                                  onChange={(e) => setSelectedManagerPerClient(prev => ({
                                    ...prev,
                                    [client.id]: e.target.value,
                                  }))}
                                >
                                  <option value="">Select Manager</option>
                                  {managers.map((mgr, idx) => (
                                    <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>
                                      {mgr.firstName} {mgr.lastName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            )}
                            {clientFilter === 'active' && (
                              <td>
                                {editingClientId === client.id ? (
                                  <select
                                    className="manager-select"
                                    value={tempSelectedManager}
                                    onChange={(e) => setTempSelectedManager(e.target.value)}
                                  >
                                    <option value="">Select Manager</option>
                                    {managers.map((mgr, idx) => (
                                      <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>
                                        {mgr.firstName} {mgr.lastName}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  client.manager || '-'
                                )}
                              </td>
                            )}
                            <td>
                              <div className="action-buttons">
                                {clientFilter === 'registered' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button
                                        onClick={() => handleAcceptClient(client.id)}
                                        className="action-button accept"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleDeclineClient(client.id)}
                                        className="action-button decline"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                     </div>

                                    )}
                                    {(clientFilter === 'unassigned' || clientFilter === 'restored') && (
                                      <button
                                        onClick={() => handleAssignClient(client.id)}
                                        className="action-button assign"
                                        disabled={!selectedManagerPerClient[client.id]}
                                      >
                                        Assign
                                      </button>
                                    )}
                                    {clientFilter === 'active' && (
                                      editingClientId === client.id ? (
                                        <>
                                          <button
                                            onClick={() => handleSaveManagerChange(client.id)}
                                            className="action-button save"
                                            disabled={!tempSelectedManager}
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={handleCancelEdit}
                                            className="action-button cancel"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          onClick={() => handleEditManager(client)}
                                          className="action-button edit-manager"
                                        >
                                          Edit Manager
                                        </button>
                                      )
                                    )}
                                    {clientFilter === 'rejected' && (
                                      <button
                                        onClick={() => handleRestoreClient(client.id)}
                                        className="action-button restore"
                                      >
                                        Restore
                                      </button>
                                    )}
                                    {/* Send Payment Link Button */}
                                    <div>
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
                                  </div>
                                  
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={(() => {
                            const headers = {
                              registered: 8, // Changed from 9
                              unassigned: 9, // Changed from 10
                              active: 9,     // Changed from 10
                              rejected: 8,   // Changed from 9
                              restored: 9    // Changed from 10
                            };
                            return headers[clientFilter];
                          })()} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No {clientFilter} clients found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create New employee Account Modal */}
      {isAddemployeeModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Create New employee Account</h3>
                <p className="modal-subtitle">Create a new employee account for the TechXplorers platform. Select the appropriate role and fill in all required information.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseAddEmployeeModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleCreateemployeeAccount}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter full name"
                  value={newemployee.fullName}
                  onChange={handleNewemployeeChange}
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
                  value={newemployee.email}
                  onChange={handleNewemployeeChange}
                  required
                />
              </div>
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
                    type="text" // Can change to 'password' type if desired for masking
                    id="temporaryPassword"
                    name="temporaryPassword"
                    className="form-input"
                    placeholder="Enter temporary password"
                    value={newemployee.temporaryPassword}
                    onChange={handleNewemployeeChange}
                    required
                  />
                  <button type="button" className="generate-password-btn" onClick={generateTemporaryPassword}>
                    {/* Eye Icon (Font Awesome: fa-eye) */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.3 183.5 64 223.8 64 256c0 32.2 25.3 72.5 64.1 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.7 328.5 512 288.2 512 256c0-32.2-25.3-72.5-64.1-108.3C406.8 109.6 353.2 80 288 80zM96 256c0-10.8 2.8-21.6 7.9-31.7c17.5-35.3 47.6-64.7 85.8-84.3c15.2-7.8 31.5-12 48.3-12s33.1 4.2 48.3 12c38.2 19.6 68.3 49 85.8 84.3c5.1 10.1 7.9 20.9 7.9 31.7s-2.8 21.6-7.9 31.7c-17.5 35.3-47.6 64.7-85.8-84.3c-15.2 7.8-31.5 12-48.3 12s-33.1-4.2-48.3-12c-38.2-19.6-68.3-49-85.8-84.3C98.8 277.6 96 266.8 96 256zm192 0a64 64 0 1 0 0-128 64 64 0 1 0 0 128z" />
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
      {isEditemployeeModalOpen && currentemployeeToEdit && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit employee Account</h3>
                <p className="modal-subtitle">Modify the details for {currentemployeeToEdit.fullName}.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseEditemployeeModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleUpdateemployeeAccount}>
              <div className="form-group">
                <label htmlFor="editFullName" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="editFullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter full name"
                  value={currentemployeeToEdit.fullName}
                  onChange={handleEditemployeeChange}
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
                  value={currentemployeeToEdit.email}
                  onChange={handleEditemployeeChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="editRole" className="form-label">Role *</label>
                <select
                  id="editRole"
                  name="role"
                  className="form-select"
                  value={currentemployeeToEdit.role}
                  onChange={handleEditemployeeChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="role-description">
                  {roleOptions.find(option => option.value === currentemployeeToEdit.role)?.description}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="editDepartment" className="form-label">Department</label>
                <select
                  id="editDepartment"
                  name="department"
                  className="form-select"
                  value={currentemployeeToEdit.department}
                  onChange={handleEditemployeeChange}
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
                  value={currentemployeeToEdit.accountStatus}
                  onChange={handleEditemployeeChange}
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
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseEditemployeeModal}>Cancel</button>
                <button type="submit" className="create-employee-btn">Update employee Account</button>
              </div>
            </form>
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
                <button type="submit" className="create-employee-btn">Update Department</button>
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
                  readOnly // Made non-editable
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
                    {/* Checkmark Circle Icon */}
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
                        {/* Copy Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1ZM18 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H18C19.1046 23 20 22.1046 20 21V7C20 5.89543 19.1046 5 18 5ZM8 7H18V21H8V7Z" />
                        </svg>
                        Copy Link
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handleSendEmail}>
                        {/* Send Icon (Paper Plane) */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Send Email
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handlePreviewLink}>
                        {/* External Link/Preview Icon */}
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
                  <button type="button" className="pay-now-btn" onClick={handlePayNow}>
                    {/* Credit Card Icon (from Screenshot 2025-07-02 at 7.33.16 PM.png) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4ZM5 7H19V9H5V7ZM5 11H17V13H5V11ZM5 15H13V17H5V15Z" />
                    </svg>
                    Pay Now
                  </button>
                  <button type="submit" className="create-employee-btn">
                    {/* Link Icon (from Screenshot 2025-07-02 at 7.33.37 PM.png) */}
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
    </div>
  );
};

export default AdminWorksheet;
