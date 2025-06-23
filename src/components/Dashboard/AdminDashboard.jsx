// App.jsx (This file contains the main application structure)

import React, { useState, useEffect } from 'react';
// Import BrowserRouter, Routes, and Route for routing
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import Chart.js components and register them for use
import {
  Chart as ChartJS,
  ArcElement, // Required for Donut/Pie charts
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Import icons from react-icons. Added FaEdit for the edit icon.
import { FaUsers, FaUserTie, FaUserCog, FaUserFriends, FaBell, FaSearch, FaBars, FaEdit } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg'; // For the profile icon (more generic)

// Import Bootstrap components
import { Table, Button, Form, InputGroup, Modal } from 'react-bootstrap';

// IMPORTANT: Import Bootstrap CSS. This line is crucial for styling React-Bootstrap components.
// If you are using a bundler (like Webpack with Create React App or Vite), this is the correct way.
import 'bootstrap/dist/css/bootstrap.min.css';
// If you are not using a bundler (e.g., a simple HTML file), you would need to add this to your public/index.html:
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6h+ALEwIH" crossorigin="anonymous">


// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);


// Define the AdminDashboard component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [managerToDeactivate, setManagerToDeactivate] = useState(null);
  const [teamLeadToDeactivate, setTeamLeadToDeactivate] = useState(null);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState(null);

  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [showManagersDetailsModal, setShowManagersDetailsModal] = useState(false);
  const [showTeamLeadsDetailsModal, setShowTeamLeadsDetailsModal] = useState(false);
  const [showEmployeesDetailsModal, setShowEmployeesDetailsModal] = useState(false);
  const [showProfileDetailsModal, setShowProfileDetailsModal] = useState(false);
  const [showNotificationDetailsModal, setShowNotificationDetailsModal] = useState(false);

  const [clientFilter, setClientFilter] = useState('registered');

  const [editingClientId, setEditingClientId] = useState(null);
  const [tempSelectedManager, setTempSelectedManager] = useState('');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [contentLoaded, setContentLoaded] = useState(false);

  // State for notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New Client Registered: John Doe', timestamp: '2025-06-23 07:09 PM' },
    { id: 2, message: 'Manager Update: Sreenivasulu S. details were updated by Admin.', timestamp: '2025-06-23 06:00 PM' },
    { id: 3, message: 'New Employee Added: Prakash Kumar (Employee)', timestamp: '2025-06-23 05:00 PM' },
  ]);

  useEffect(() => {
    setContentLoaded(true);
  }, []);

  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };

    const restoreScrollPosition = () => {
      const savedScrollY = sessionStorage.getItem('scrollPosition');
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        sessionStorage.removeItem('scrollPosition');
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log("Menu state changed to:", menuOpen);
  }, [menuOpen]);

  const [isManagerEditing, setIsManagerEditing] = useState(false);
  const [isTeamLeadEditing, setIsTeamLeadEditing] = useState(false);
  const [isEmployeeEditing, setIsEmployeeEditing] = useState(false);

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showTeamLeadModal, setShowTeamLeadModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedManagerIndex, setSelectedManagerIndex] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [showManagerAssignedPeopleModal, setShowManagerAssignedPeopleModal] = useState(false);
  const [selectedManagerData, setSelectedManagerData] = useState(null);

  const [originalTeamLeads, setOriginalTeamLeads] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [originalInterns, setOriginalInterns] = useState([]);

  const [filteredTeamLeads, setFilteredTeamLeads] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  const [teamLeadSearch, setTeamLeadSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [internSearch, setInternSearch] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedManager, setExpandedManager] = useState(null);

  const [currentManagerIndex, setCurrentManagerIndex] = useState(null);
  const [currentTeamLeadIndex, setCurrentTeamLeadIndex] = useState(null);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(null);

  const [isActivating, setIsActivating] = useState(false);

  const toggleManagerActivation = (index) => {
    const manager = managers[index];
    setManagerToDeactivate(index);
    setIsActivating(!manager.active); // Determine if activating or deactivating
    setConfirmationOpen(true);
  };

  const toggleTeamLeadActivation = (index) => {
    const teamLead = teamLeads[index];
    setTeamLeadToDeactivate(index);
    setIsActivating(!teamLead.active);
    setConfirmationOpen(true);
  };

  const toggleEmployeeActivation = (index) => {
    const employee = employees[index];
    setEmployeeToDeactivate(index);
    setIsActivating(!employee.active);
    setConfirmationOpen(true);
  };

  const confirmManagerToggle = () => {
    if (managerToDeactivate !== null) {
      const updatedManagers = [...managers];
      updatedManagers[managerToDeactivate].active = !updatedManagers[managerToDeactivate].active;
      setManagers(updatedManagers);
      setConfirmationOpen(false);
      setManagerToDeactivate(null);
    }
  };

  const confirmTeamLeadToggle = () => {
    if (teamLeadToDeactivate !== null) {
      const updatedTeamLeads = [...teamLeads];
      updatedTeamLeads[teamLeadToDeactivate].active = !updatedTeamLeads[teamLeadToDeactivate].active;
      setTeamLeads(updatedTeamLeads);
      setConfirmationOpen(false);
      setTeamLeadToDeactivate(null);
    }
  };

  const confirmEmployeeToggle = () => {
    if (employeeToDeactivate !== null) {
      const updatedEmployees = [...employees];
      updatedEmployees[employeeToDeactivate].active = !updatedEmployees[employeeToDeactivate].active;
      setEmployees(updatedEmployees);
      setConfirmationOpen(false);
      setEmployeeToDeactivate(null);
    }
  };

  const [selectedManagerPerClient, setSelectedManagerPerClient] = useState({});

  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', mobile: '9876543210', email: 'john@example.com', jobsApplyFor: 'Data Science', registeredDate: '2025-05-01', country: 'USA', visaStatus: 'Citizen (U.S.)', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 7, name: 'Michael White', mobile: '2233445566', email: 'michael@example.com', jobsApplyFor: 'UX Designer', registeredDate: '2025-05-12', country: 'USA', visaStatus: 'Green Card', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 13, name: 'Mia Davis', mobile: '5551112222', email: 'mia.d@example.com', jobsApplyFor: 'InnovateX Lead', registeredDate: '2025-05-19', country: 'Germany', visaStatus: 'Work Permit', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 15, name: 'Ethan Hunt', mobile: '9988776655', email: 'ethan.h@example.com', jobsApplyFor: 'Security Analyst', registeredDate: '2025-05-22', country: 'Canada', visaStatus: 'Citizen', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 3, name: 'Mcgregor', mobile: '7776543210', email: 'mcg@example.com', jobsApplyFor: 'Scrum Master', registeredDate: '2025-05-01', country: 'Australia', visaStatus: 'H-1B Visa', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },
    { id: 8, name: 'Sarah Wilson', mobile: '3344556677', email: 'sarah@example.com', jobsApplyFor: 'DevOps Engineer', registeredDate: '2025-05-15', country: 'France', visaStatus: 'Work Permit', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },
    { id: 10, name: 'Jack Taylor', mobile: '4445556666', email: 'jack.t@example.com', jobsApplyFor: 'Financial Analyst', registeredDate: '2025-05-25', country: 'UK', visaStatus: 'EU Citizen', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },
    { id: 2, name: 'Alice Brown', mobile: '7896543210', email: 'alice@example.com', jobsApplyFor: 'Cyber Security', registeredDate: '2025-05-03', country: 'UK', visaStatus: 'Green Card', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager B', manager: 'Manager B' },
    { id: 4, name: 'Jane Smith', mobile: '1234567890', email: 'jane@example.com', jobsApplyFor: 'Software Engineer', registeredDate: '2025-05-05', country: 'Canada', visaStatus: 'Work Permit', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager A', manager: 'Manager A' },
    { id: 9, name: 'David Lee', mobile: '4455667788', email: 'david@example.com', jobsApplyFor: 'AI/ML Engineer', registeredDate: '2025-05-18', country: 'Japan', visaStatus: 'Permanent Resident', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager C', manager: 'Manager C' },
    { id: 12, name: 'Mike Green', mobile: '8876543210', email: 'mike@example.com', jobsApplyFor: 'Cyber Security', registeredDate: '2025-04-28', country: 'USA', visaStatus: 'L-1 Visa', status: 'active', displayStatuses: ['active'], assignedTo: 'Sarah Connor', manager: 'Sarah Connor' },
    { id: 5, name: 'Robert Johnson', mobile: '0987654321', email: 'robert@example.com', jobsApplyFor: 'Product Manager', registeredDate: '2025-04-20', country: 'Germany', visaStatus: 'Schengen Visa', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },
    { id: 11, name: 'Karen Hall', mobile: '6667778888', email: 'karen.h@example.com', jobsApplyFor: 'Graphic Designer', registeredDate: '2025-05-17', country: 'Australia', visaStatus: 'Working Holiday', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },
    { id: 14, name: 'Laura Martinez', mobile: '5566778899', email: 'laura@example.com', jobsApplyFor: 'Cloud Architect', registeredDate: '2025-05-20', country: 'Spain', visaStatus: 'Student Visa', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },
    { id: 6, name: 'Emily Davis', mobile: '1122334455', email: 'emily@example.com', jobsApplyFor: 'Data Analyst', registeredDate: '2025-05-10', country: 'India', visaStatus: 'Citizen', status: 'restored', displayStatuses: ['restored'], assignedTo: 'Manager A', manager: null },
    { id: 16, name: 'Chris Evans', mobile: '1122334455', email: 'chris.e@example.com', jobsApplyFor: 'Marketing Specialist', registeredDate: '2025-05-14', country: 'Brazil', visaStatus: 'Tourist Visa', status: 'restored', displayStatuses: ['restored'], assignedTo: 'Manager B', manager: null },
  ]);

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const [managers, setManagers] = useState([
    {
      firstName: "Sreenivasulu",
      lastName: "S",
      mobile: "+91 9874561230",
      email: "seenu@gmail.com",
      password: "07072023@Tx123",
      role: "Manager",
      active: true,
      assignedPeople: [
        { firstName: 'Murali', lastName: 'M', mobile: '+91 987456123', email: 'murali@gmail.com', role: 'Team Lead' },
        { firstName: 'Madhu', lastName: 'A', mobile: '+91 987456123', email: 'madhuemployee@gmail.com', role: 'Employee' }
      ]
    },
    {
      firstName: "Vamsi",
      lastName: "V",
      mobile: "+91 7894561230",
      email: "vamsi@gmail.com",
      password: "07072023@TxSm",
      role: "Manager",
      active: true,
      assignedPeople: [
        { firstName: 'Kavitha', lastName: 'K', mobile: '+91 987456123', email: 'kavitha@gmail.com', role: 'Team Lead' },
        { firstName: 'santhosh', lastName: 'S', mobile: '+91 987456123', email: 'santhoshemployee@gmail.com', role: 'Employee' }
      ]
    },
    {
      firstName: "Kavitha",
      lastName: "K",
      mobile: "+91 7894561230",
      email: "kavitha@gmail.com",
      password: "07072023@TxSm",
      role: "Manager",
      active: true,
      assignedPeople: [
        { firstName: 'meera', lastName: 'm', mobile: '+91 987456123', email: 'meera@gmail.com', role: 'Team Lead' },
        { firstName: 'vijay', lastName: 'v', mobile: '+91 987456123', email: 'vijayemployee@gmail.com', role: 'Employee' }
      ]
    },
  ]);

  const [newManager, setNewManager] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: 'Manager',
    active: true
  });

  const [teamLeads, setTeamLeads] = useState([
    { firstName: 'Vaishnavi', lastName: 'V', mobile: '+91 9874561230', email: 'vaishnavi@gmail.com', password: '07072023@TxRm', role: 'Team Lead', active: true },
    { firstName: 'Murali', lastName: 'reddy', mobile: '+91 9874561230', email: 'murali@gmail.com', password: '07072023@TxRm', role: 'Team Lead', active: true },
    { firstName: 'Sai Krishna', lastName: 'kumar', mobile: '+91 9874561230', email: 'sai@gmail.com', password: '07072023@TxRm', role: 'Team Lead', active: true },
  ]);

  const [newTeamLead, setNewTeamLead] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: 'Team Lead',
    active: true,
  });

  const [employees, setEmployees] = useState([
    { firstName: 'Humer', lastName: 'R', mobile: '+91 9874561230', email: 'humermployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Chaveen', lastName: 'Reddy', mobile: '+91 9874561230', email: 'chaveenemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Bharath', lastName: 'Surya', mobile: '+91 9874561230', email: 'bharathemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Sandeep', lastName: 'Kumar', mobile: '+91 9874561230', email: 'sandeepemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Neelam', lastName: 'Sai Krishna', mobile: '+91 9874561230', email: 'saiemployee@gmail.com', role: 'Intern', active: true },
    { firstName: 'Prakash', lastName: 'Kumar', mobile: '+91 9874561230', email: 'prakashployee@gmail.com', role: 'Employee', active: true },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: '',
    active: true,
  });

  // Function to add a new notification
  const addNotification = (message) => {
    setNotifications(prevNotifications => [
      { id: Date.now(), message, timestamp: new Date().toLocaleString() },
      ...prevNotifications, // Newest notification at the top
    ]);
  };

  useEffect(() => {
    const initialTeamLeads = [
      { firstName: 'Murali', lastName: 'M', mobile: '+91 9874561230', email: 'murali@gmail.com', role: 'Team Lead' },
      { firstName: 'Vamsi', lastName: 'V', mobile: '+91 9874561230', email: 'vamsi@gmail.com', role: 'Team Lead' },
      { firstName: 'Kavitha', lastName: 'K', mobile: '+91 9874561230', email: 'kavitha@gmail.com', role: 'Team Lead' },
      { firstName: 'Bharath', lastName: 'B', mobile: '+91 9874561230', email: 'bharath@gmail.com', role: 'Team Lead' },
      { firstName: 'SaiKrishna', lastName: 'S', mobile: '+91 9874561230', email: 'saikrishna@gmail.com', role: 'Team Lead' },
      { firstName: 'Vyshnavi', lastName: 'V', mobile: '+91 9874561230', email: 'vyshnavi@gmail.com', role: 'Team Lead' }
    ];

    const initialEmployees = [
      { firstName: 'Madhu', lastName: 'M', mobile: '+91 9874561230', email: 'madhuemployee@gmail.com', role: 'Employee' },
      { firstName: 'krishna', lastName: 'K', mobile: '+91 9874561230', email: 'krishnaemployee@gmail.com', role: 'Employee' },
      { firstName: 'arun', lastName: 'A', mobile: '+91 9874561230', email: 'arunemployee@gmail.com', role: 'Employee' },
      { firstName: 'dharani', lastName: 'D', mobile: '+91 9874561230', email: 'dharaniemployee@gmail.com', role: 'Employee' },
      { firstName: 'rajitha', lastName: 'R', mobile: '+91 9874561230', email: 'rajithaemployee@gmail.com', role: 'Employee' },
      { firstName: 'siva', lastName: 'S', mobile: '+91 9874561230', email: 'sivaemployee@gmail.com', role: 'Employee' },
      { firstName: 'ashok', lastName: 'A', mobile: '+91 9874561230', email: 'ashokemployee@gmail.com', role: 'Employee' },
      { firstName: 'deepak', lastName: 'D', mobile: '+91 9874561230', email: 'deepakemployee@gmail.com', role: 'Employee' },
      { firstName: 'santhosh', lastName: 'S', mobile: '+91 9874561230', email: 'santhoshemployee@gmail.com', role: 'Employee' }
    ];

    const initialInterns = [
      { firstName: 'Sandeep', lastName: 'S', mobile: '+91 9874561230', email: 'sandeepmployee@gmail.com', role: 'Intern' },
      { firstName: 'Humer', lastName: 'H', mobile: '+91 9874561230', email: 'humeremployee@gmail.com', role: 'Intern' },
      { firstName: 'Chaveen', lastName: 'C', mobile: '+91 9874561230', email: 'chaveenemployee@gmail.com', role: 'Intern' }
    ];

    setOriginalTeamLeads(initialTeamLeads);
    setOriginalEmployees(initialEmployees);
    setOriginalInterns(initialInterns);
  }, []);

  const getAllAssignedPeople = () => {
    return managers.flatMap(manager => manager.assignedPeople || []);
  };

  const togglePersonSelection = (person) => {
    setSelectedPeople((prev) =>
      prev.some(p => p.email === person.email)
        ? prev.filter(p => p.email !== person.email)
        : [...prev, person]
    );
  };

  const toggleClientDetailsModal = () => setShowClientDetailsModal(!showClientDetailsModal);
  const toggleManagersDetailsModal = () => setShowManagersDetailsModal(!showManagersDetailsModal);
  const toggleTeamLeadsDetailsModal = () => setShowTeamLeadsDetailsModal(!showTeamLeadsDetailsModal);
  const toggleEmployeesDetailsModal = () => setShowEmployeesDetailsModal(!showEmployeesDetailsModal);
  const toggleProfileDetailsModal = () => setShowProfileDetailsModal(!showProfileDetailsModal);
  const toggleNotificationDetailsModal = () => setShowNotificationDetailsModal(!showNotificationDetailsModal);


  const toggleManagerExpand = (index) => {
    const manager = managers[index];
    setSelectedManagerData(manager);
    setShowManagerAssignedPeopleModal(true);
  };

  const handleManagerAssignDone = () => {
    const updatedManagers = [...managers];
    updatedManagers[selectedManagerIndex].assignedPeople = selectedPeople;
    setManagers(updatedManagers);
    setAssignModalOpen(false);
  };

  const donutChartData = {
    labels: ['Team Leads', 'Employee', 'Clients', 'Manager'],
    datasets: [{
      data: [25, 250, 15, 11],
      backgroundColor: [
        '#FFC107',
        '#87CEEB',
        '#FF8C00',
        '#3CB371'
      ],
      hoverOffset: 8,
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleClientCardClick = (cardType) => {
    if (cardType === 'clients') {
      setShowClientDetailsModal(true);
      setClientFilter('registered');
    }
  };
  const handleManagersCardClick = (cardType) => {
    if (cardType === 'manager') {
      setShowManagersDetailsModal(true);
    }
  };
  const handleTeamLeadsCardClick = (cardType) => {
    if (cardType === 'teamleads') {
      setShowTeamLeadsDetailsModal(true);
    }
  };

  const handleEmployeesCardClick = (cardType) => {
    if (cardType === 'employees') {
      setShowEmployeesDetailsModal(true);
    }
  };

  const updateClientData = (clientId, updates) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, ...updates }
          : client
      )
    );
  };

  const handleAcceptClient = (clientId) => {
    updateClientData(clientId, { status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null });
  };

  const handleDeclineClient = (clientId) => {
    updateClientData(clientId, { status: 'rejected', displayStatuses: ['rejected'] });
  };

  const handleAssignClient = (clientId) => {
    const managerToAssign = selectedManagerPerClient[clientId];
    if (!managerToAssign) {
      alert("Please select a manager before assigning.");
      return;
    }
    updateClientData(clientId, { status: 'active', displayStatuses: ['active'], assignedTo: managerToAssign, manager: managerToAssign });
    setSelectedManagerPerClient(prev => {
      const newState = { ...prev };
      delete newState[clientId];
      return newState;
    });
  };

  const handleRestoreClient = (clientId) => {
    updateClientData(clientId, { status: 'restored', displayStatuses: ['restored', 'registered'], assignedTo: null, manager: null });
  };

  const handleManagerSelectChange = (clientId, managerName) => {
    setSelectedManagerPerClient(prev => ({
      ...prev,
      [clientId]: managerName,
    }));
  };

  const handleManagerShowModal = () => setShowManagerModal(true);
  const handleManagerCloseModal = () => {
    setShowManagerModal(false);
    setIsManagerEditing(false);
    setCurrentManagerIndex(null);
    setNewManager({ firstName: '', lastName: '', mobile: '', email: '', password: '', role: 'Manager', active: true });
  };

  const handleTempManagerSelectChange = (managerName) => {
    setTempSelectedManager(managerName);
  };

  const handleEditManager = (client) => {
    setEditingClientId(client.id);
    setTempSelectedManager(client.manager || '');
  };

  const handleSaveManagerChange = (clientId) => {
    if (!tempSelectedManager) {
      console.warn("Please select a manager to save.");
      return;
    }
    updateClientData(clientId, { assignedTo: tempSelectedManager, manager: tempSelectedManager });
    setEditingClientId(null);
    setTempSelectedManager('');
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setTempSelectedManager('');
  };

  const handleTeamLeadShowModal = () => setShowTeamLeadModal(true);
  const handleTeamLeadCloseModal = () => {
    setShowTeamLeadModal(false);
    setIsTeamLeadEditing(false);
    setCurrentTeamLeadIndex(null);
    setNewTeamLead({ firstName: '', lastName: '', mobile: '', email: '', password: '', role: 'Team Lead', active: true });
  };

  const handleEmployeeShowModal = () => setShowEmployeeModal(true);
  const handleEmployeeCloseModal = () => {
    setShowEmployeeModal(false);
    setIsEmployeeEditing(false);
    setCurrentEmployeeIndex(null);
    setNewEmployee({ firstName: '', lastName: '', mobile: '', email: '', password: '', role: '', active: true });
  };

  const handleManagerInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };
  const handleTeamLeadInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeamLead((prev) => ({ ...prev, [name]: value }));
  };
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManager = () => {
    const { firstName, lastName, mobile, email, password } = newManager;
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }
    if (isManagerEditing) {
      const updatedManagers = [...managers];
      updatedManagers[currentManagerIndex] = newManager;
      setManagers(updatedManagers);
      addNotification(`Manager Updated: ${newManager.firstName} ${newManager.lastName}`);
    } else {
      setManagers([...managers, { ...newManager, assignedPeople: [] }]);
      addNotification(`New Manager Added: ${newManager.firstName} ${newManager.lastName}`);
    }
    handleManagerCloseModal();
  };

  const handleAddTeamLead = () => {
    const { firstName, lastName, mobile, email, password } = newTeamLead;
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }
    if (isTeamLeadEditing) {
      const updatedTeamLeads = [...teamLeads];
      updatedTeamLeads[currentTeamLeadIndex] = newTeamLead;
      setTeamLeads(updatedTeamLeads);
      addNotification(`Team Lead Updated: ${newTeamLead.firstName} ${newTeamLead.lastName}`);
    } else {
      setTeamLeads([...teamLeads, { ...newTeamLead }]);
      addNotification(`New Team Lead Added: ${newTeamLead.firstName} ${newTeamLead.lastName}`);
    }
    handleTeamLeadCloseModal();
  };

  const handleAddEmployee = () => {
    const { firstName, lastName, mobile, email, password } = newEmployee;
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }
    if (isEmployeeEditing) {
      const updatedEmployees = [...employees];
      updatedEmployees[currentEmployeeIndex] = newEmployee;
      setEmployees(updatedEmployees);
      addNotification(`Employee Updated: ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.role})`);
    } else {
      setEmployees([...employees, { ...newEmployee }]);
      addNotification(`New Employee Added: ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.role})`);
    }
    handleEmployeeCloseModal();
  };

  const openAssignModal = (index) => {
    setSelectedManagerIndex(index);
    const previouslyAssigned = managers[index].assignedPeople || [];
    setSelectedPeople(previouslyAssigned);

    const allAssigned = getAllAssignedPeople();

    setFilteredTeamLeads(originalTeamLeads.filter(tl =>
      !allAssigned.some(a => a.email === tl.email) ||
      previouslyAssigned.some(pa => pa.email === tl.email)
    ));

    setFilteredEmployees(originalEmployees.filter(emp =>
      !allAssigned.some(a => a.email === emp.email) ||
      previouslyAssigned.some(pa => pa.email === emp.email))
    );
    setFilteredInterns(originalInterns.filter(int =>
      !allAssigned.some(a => a.email === int.email) ||
      previouslyAssigned.some(pa => pa.email === int.email)
    ));

    setAssignModalOpen(true);
  };

  const getValue = (item, header) => {
    if (item.hasOwnProperty('name')) {
      switch (header) {
        case 'Name': return item.name;
        case 'Mobile': return item.mobile;
        case 'Email': return item.email;
        case 'Jobs Apply For': return item.jobsApplyFor;
        case 'Registered Date': return item.registeredDate;
        case 'Country': return item.country;
        case 'Visa Status': return item.visaStatus;
        case 'Assign To':
          if (item.displayStatuses.includes('unassigned') || item.displayStatuses.includes('restored')) {
            return (
              <select
                style={{
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  fontSize: '0.85em',
                  width: '100%',
                }}
                value={selectedManagerPerClient[item.id] || ''}
                onChange={(e) => handleManagerSelectChange(item.id, e.target.value)}
              >
                <option value="">Select Manager</option>
                {managers.map((mgr, idx) => (
                  <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>
                    {mgr.firstName} {mgr.lastName}
                  </option>
                ))}
              </select>
            );
          }
          return item.assignedTo || '-';
        case 'Manager':
          if (item.status === 'active' && editingClientId === item.id) {
            return (
              <select
                style={{
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  fontSize: '0.85em',
                  width: '100%',
                }}
                value={tempSelectedManager}
                onChange={(e) => handleTempManagerSelectChange(e.target.value)}
              >
                <option value="">Select Manager</option>
                {managers.map((mgr, idx) => (
                  <option key={idx} value={`${mgr.firstName} ${mgr.lastName}`}>
                    {mgr.firstName} {mgr.lastName}
                  </option>
                ))}
              </select>
            );
          }
          return item.manager || '-';
        case 'Actions': return null;
        default: return item[header.toLowerCase().replace(/\s/g, '')] || '-';
      }
    } else {
      switch (header) {
        case 'FIRST NAME': return item.firstName;
        case 'LAST NAME': return item.lastName;
        case 'MOBILE': return item.mobile;
        case 'EMAIL': return item.email;
        case 'PASSWORD': return item.password;
        case 'ROLE': return item.role;
        case 'PEOPLE':
          return (
            <Button size="sm" variant="success" onClick={() => openAssignModal(item.index)}>
              Add Employees ({item.assignedPeople?.length || 0})
            </Button>
          );
        case 'EDIT':
          let handleEdit;
          if (item.role === 'Manager') {
            handleEdit = () => {
              setIsManagerEditing(true);
              setCurrentManagerIndex(item.index);
              setNewManager(managers[item.index]);
              setShowManagerModal(true);
            };
          } else if (item.role === 'Team Lead') {
            handleEdit = () => {
              setIsTeamLeadEditing(true);
              setCurrentTeamLeadIndex(item.index);
              setNewTeamLead(teamLeads[item.index]);
              setShowTeamLeadModal(true);
            };
          } else {
            handleEdit = () => {
              setIsEmployeeEditing(true);
              setCurrentEmployeeIndex(item.index);
              setNewEmployee(employees[item.index]);
              setShowEmployeeModal(true);
            };
          }
          return (
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={handleEdit}
            >
              {/* Replaced pencil emoji with FaEdit icon */}
              <FaEdit style={{ fontSize: '1.2em', color: '#007bff' }} />
            </Button>
          );
        case 'STATUS':
          let toggleActivation;
          if (item.role === 'Manager') {
            toggleActivation = () => toggleManagerActivation(item.index);
          } else if (item.role === 'Team Lead') {
            toggleActivation = () => toggleTeamLeadActivation(item.index);
          } else {
            toggleActivation = () => toggleEmployeeActivation(item.index);
          }
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ marginRight: '8px' }}>{item.active ? 'Active' : 'Inactive'}</span>
              <Form.Check
                type="switch"
                id={`${item.role.toLowerCase()}-active-switch-${item.index}`}
                checked={item.active}
                onChange={toggleActivation}
              />
            </div>
          );
        default: return '-';
      }
    }
  };

  const tableConfig = {
    registered: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => handleAcceptClient(client.id)}
            style={{ ...actionButtonStyle, background: '#28a745', ':hover': { backgroundColor: '#218838' } }}
            className="button-hover-effect"
          >
            Accept
          </button>
          <button
            onClick={() => handleDeclineClient(client.id)}
            style={{ ...actionButtonStyle, background: '#dc3545', ':hover': { backgroundColor: '#c82333' } }}
            className="button-hover-effect"
          >
            Decline
          </button>
        </div>
      )
    },
    unassigned: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => handleAssignClient(client.id)}
            style={{ ...actionButtonStyle, background: '#007bff', ':hover': { backgroundColor: '#0056b3' } }}
            disabled={!selectedManagerPerClient[client.id]}
            className="button-hover-effect"
          >
            Assign
          </button>
        </div>
      )
    },
    active: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Manager', 'Actions'],
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          {editingClientId === client.id ? (
            <>
              <button
                onClick={() => handleSaveManagerChange(client.id)}
                style={{ ...actionButtonStyle, background: '#28a745', ':hover': { backgroundColor: '#218838' } }}
                className="button-hover-effect"
                disabled={!tempSelectedManager}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{ ...actionButtonStyle, background: '#6c757d', ':hover': { backgroundColor: '#5a6268' } }}
                className="button-hover-effect"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEditManager(client)}
                style={{ ...actionButtonStyle, background: '#007bff', ':hover': { backgroundColor: '#0056b3' } }}
                className="button-hover-effect"
              >
                Edit Manager
              </button>
            </>
          )}
        </div>
      )
    },
    rejected: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => handleRestoreClient(client.id)}
            style={{ ...actionButtonStyle, background: '#6f42c1', ':hover': { backgroundColor: '#563d7c' } }}
            className="button-hover-effect"
          >
            Restore
          </button>
        </div>
      )
    },
    restored: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => handleAssignClient(client.id)}
            style={{ ...actionButtonStyle, background: '#007bff', ':hover': { backgroundColor: '#0056b3' } }}
            disabled={!selectedManagerPerClient[client.id]}
            className="button-hover-effect"
          >
            Assign
          </button>
        </div>
      )
    },
    manager: {
      headers: ['FIRST NAME', 'LAST NAME', 'MOBILE', 'EMAIL', 'PASSWORD', 'ROLE', 'PEOPLE', 'EDIT', 'STATUS'],
      widths: ['10%', '10%', '12%', '15%', '12%', '8%', '18%', '6%', '10%'],
    },
    teamlead: {
      headers: ['FIRST NAME', 'LAST NAME', 'MOBILE', 'EMAIL', 'PASSWORD', 'ROLE', 'EDIT', 'STATUS'],
      widths: ['12%', '12%', '14%', '20%', '16%', '10%', '8%', '10%'],
    },
    employee: {
      headers: ['FIRST NAME', 'LAST NAME', 'MOBILE', 'EMAIL', 'PASSWORD', 'ROLE', 'EDIT', 'STATUS'],
      widths: ['12%', '12%', '14%', '20%', '16%', '10%', '8%', '10%'],
    }
  };

  const getFilteredClients = () => {
    return clients.filter(client => client.displayStatuses.includes(clientFilter));
  };

  const filteredClients = getFilteredClients();

  return (
    // The main container for the dashboard
    <div style={{
      fontFamily: 'Inter, sans-serif',
      background: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      // Removed previous opacity/transform to avoid conflicts
    }}>
      {/* Removed DimmingOverlay component */}

      {/* Styles for various elements (unchanged) */}
      <style>
        {`
        .button-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .tab-button.active {
            border-bottom: 2px solid #3b82f6;
            color: #3b82f6;
        }
        .tab-button:hover {
            color: #3b82f6;
        }
        .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 25px rgba(0,0,0,0.2);
        }
        .action-button:hover {
            background-color: #218838 !important;
        }
        .action-button:active {
            transform: scale(0.95);
        }
        .download-button {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          text-align: center;
        }
        .download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }
        .download-button:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          box-shadow: none;
        }
        .download-button:disabled:hover {
          transform: none;
          box-shadow: none;
          background: #cbd5e1;
        }
        .view-button:hover {
          background-color: #c4e0ff !important;
        }
        .activity-button:hover {
          background-color: #e2e8f0 !important;
        }
        .modal.show .modal-dialog {
          transform: none !important; /* Ensure modals don't jump around in iframes */
        }
        .custom-modal-dialog {
            max-width: 95% !important;
            width: 1400px !important;
            margin: 1.75rem auto;
        }
        .custom-modal-content {
            background: #ffffff !important;
            padding: 30px !important;
            border-radius: 20px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
            border: 1px solid #cbd5e1 !important;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        .modal-header {
            border-bottom: 1px solid #f1f5f9 !important;
            padding: 20px 30px !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        .modal-title {
            color: #1e293b !important;
            font-size: 1.6rem !important;
            font-weight: 700 !important;
            margin: 0 !important;
        }
        .modal-body {
            padding: 30px !important;
        }
        .modal-footer {
            border-top: 1px solid #f1f5f9 !important;
            padding: 20px 30px !important;
        }
        .form-control, .input-group-text, .form-select {
            border-radius: 8px !important;
            border: 1px solid #cbd5e1 !important;
            padding: 10px 15px !important;
            font-size: 0.95rem !important;
        }
        .form-label {
            font-weight: 600 !important;
            color: #334155 !important;
            margin-bottom: 8px !important;
        }
        .btn-success {
            background-color: #28a745 !important;
            border-color: #28a745 !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: background-color 0.2s, transform 0.1s !important;
        }
        .btn-success:hover {
            background-color: #218838 !important;
            border-color: #218838 !important;
            transform: translateY(-1px);
        }
        .btn-primary {
            background-color: #007bff !important;
            border-color: #007bff !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: background-color 0.2s, transform 0.1s !important;
        }
        .btn-primary:hover {
            background-color: #0069d9 !important;
            border-color: #0062cc !important;
            transform: translateY(-1px);
        }
        .btn-secondary {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: background-color 0.2s, transform 0.1s !important;
        }
        .btn-secondary:hover {
            background-color: #5a6268 !important;
            border-color: #545b62 !important;
            transform: translateY(-1px);
        }
        .btn-danger {
            background-color: #dc3545 !important;
            border-color: #dc3545 !important;
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 600 !important;
            transition: background-color 0.2s, transform 0.1s !important;
        }
        .btn-danger:hover {
            background-color: #c82333 !important;
            border-color: #bd2130 !important;
            transform: translateY(-1px);
        }
        .btn-link {
            color: #007bff !important;
            text-decoration: none !important;
        }
        .btn-link:hover {
            color: #0056b3 !important;
            text-decoration: underline !important;
        }
        .table-striped > tbody > tr:nth-of-type(odd) {
            background-color: #ffffff;
        }
        .table-striped > tbody > tr:nth-of-type(even) {
            background-color: #eff2f7;
        }
        .table-hover tbody tr:hover {
            background-color: #e2e8f0 !important;
        }
        .form-check-input:checked {
            background-color: #007bff !important;
            border-color: #007bff !important;
        }
        .form-check-input:focus {
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
        }
        /* New style for the smaller profile icon and hover effect */
        .profile-icon {
            font-size: 1.8em; /* Adjusted from 30px to 1.8em for relative sizing */
            color: #fff;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .profile-icon:hover {
            transform: scale(1.1); /* Slightly enlarge on hover */
            color: #e0e7ff; /* Lighter color on hover */
        }
        /* New style for notification icon and hover effect */
        .notification-icon {
            font-size: 1.8em; /* Adjusted for consistency with profile icon */
            color: #fff;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .notification-icon:hover {
            transform: scale(1.1);
            color: #e0e7ff;
        }
        `}
      </style>

      {/* Top Navigation Bar */}
      <header style={{
        background: '#0a193c',
        color: 'white',
        padding: '10px 25px',
        display: 'flex',
        flexDirection: 'column', // Stack children vertically for rows
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        height: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%'
      }}>
        {/* Row 1: Logo and Company Name (Left Corner) */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start', // Align logo to the start (left)
          alignItems: 'center',
          width: '100%', // Take full width of header
          paddingBottom: '5px', // Small space between this row and the next
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>TECHXPLORERS</span>
            <span style={{ fontSize: '10px', opacity: 0.8, marginTop: '0px', paddingLeft: '42px' }}>Exploring The Future</span>
          </div>
        </div>

        {/* Bottom Row: Hamburger Menu, Notification, Profile (Search Bar Removed) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // Adjust to space-between
          width: '100%'
        }}>
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <FaBars />
          </button>

          {/* This is where the search bar used to be. It has been removed. */}

          {/* Notification and Profile Icons (Right) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            flexShrink: 0,
          }}>
            <FaBell
              className="notification-icon" // Apply the new class for styling
              onClick={toggleNotificationDetailsModal} // Added onClick handler
            />
            <CgProfile
              className="profile-icon" // Apply the new class for styling
              onClick={toggleProfileDetailsModal}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area - Using CSS Grid */}
      <div style={{
        flexGrow: 1,
        padding: windowWidth < 640 ? '15px' : '25px',
        display: 'grid',
        gridTemplateColumns:
          windowWidth < 640 ? '1fr' :
            windowWidth < 1024 ? 'repeat(2, 1fr)' :
              'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto 1fr',
        gap: windowWidth < 640 ? '15px' : '25px',
        maxWidth: windowWidth < 1024 ? '95%' : '1300px',
        margin: '25px auto',
      }}>
        {/* Clients Card */}
        <div
          onMouseEnter={() => setHoveredCardId('clients')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleClientCardClick('clients')}
          style={{
            ...cardStyle,
            opacity: contentLoaded ? 1 : 0,
            transform: contentLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transitionDelay: contentLoaded ? '0s' : '0s',
          }}
          className={hoveredCardId === 'clients' ? 'card-hover' : ''}
        >
          <h3 style={cardTitleStyle}>Clients</h3>
          <FaUsers style={cardIconStyle} />
        </div>

        {/* Manager Card */}
        <div
          onMouseEnter={() => setHoveredCardId('manager')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleManagersCardClick('manager')}
          style={{
            ...cardStyle,
            opacity: contentLoaded ? 1 : 0,
            transform: contentLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transitionDelay: contentLoaded ? '0.05s' : '0s',
          }}
          className={hoveredCardId === 'manager' ? 'card-hover' : ''}
        >
          <h3 style={cardTitleStyle}>Manager</h3>
          <FaUserTie style={cardIconStyle} />
        </div>

        {/* Team Leads Card */}
        <div
          onMouseEnter={() => setHoveredCardId('teamleads')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleTeamLeadsCardClick('teamleads')}
          style={{
            ...cardStyle,
            opacity: contentLoaded ? 1 : 0,
            transform: contentLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transitionDelay: contentLoaded ? '0.1s' : '0s',
          }}
          className={hoveredCardId === 'teamleads' ? 'card-hover' : ''}
        >
          <h3 style={cardTitleStyle}>Team Leads</h3>
          <FaUserCog style={cardIconStyle} />
        </div>

        {/* Employee Card */}
        <div
          onMouseEnter={() => setHoveredCardId('employees')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleEmployeesCardClick('employees')}
          style={{
            ...cardStyle,
            opacity: contentLoaded ? 1 : 0,
            transform: contentLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transitionDelay: contentLoaded ? '0.15s' : '0s',
          }}
          className={hoveredCardId === 'employees' ? 'card-hover' : ''}
        >
          <h3 style={cardTitleStyle}>Employee</h3>
          <FaUserFriends style={cardIconStyle} />
        </div>

        {/* Chart Section */}
        <div style={{
          ...chartSectionStyle,
          gridColumn: windowWidth < 1024 ? 'span 1' : 'span 2',
          opacity: contentLoaded ? 1 : 0,
          transform: contentLoaded ? 'translateX(0)' : 'translateX(-50px)',
          transitionDelay: contentLoaded ? '0.2s' : '0s',
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>CHART</h3>
          <div style={{ width: '100%', maxWidth: windowWidth < 640 ? '250px' : '500px', height: '350px' }}>
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
        </div>

        {/* About Section */}
        <div style={{
          ...aboutSectionStyle,
          gridColumn: windowWidth < 1024 ? 'span 1' : 'span 2',
          opacity: contentLoaded ? 1 : 0,
          transform: contentLoaded ? 'translateX(0)' : 'translateX(50px)',
          transitionDelay: contentLoaded ? '0.25s' : '0s',
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>About</h3>
          <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '15px', fontSize: '1.0em' }}>
            Gravida Massa Quis Malesuada Porta Diam Ex Quam Dui Lacus
            Hendrerit Ultrices Sollicitudin. Faucibus Ut Varius In Non Sit Amet, Nec
            Lobortis, Sapien Viverra In.
          </p>
          <p style={{ lineHeight: '1.6', color: '#555', fontSize: '1.0em' }}>
            Tincidunt Eu Vitae Lorem. Dui Non Donec Sollicitudin, Leo. Dui Enim.
            Placerat. Morbi Viverra Faucibus Nec Fringilla Quam Maximus Vehicula,
            Varius Ac Nulla, Ac.
          </p>
        </div>
      </div>

      {/* Overlay for when menu is open */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1002,
          }}
        />
      )}
      {/* Sidebar - This slides in from the left */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: menuOpen ? '0' : '-250px',
        height: '100vh',
        width: '250px',
        background: '#fff',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
        zIndex: 1003,
        transition: 'left 0.3s ease',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h4 style={{ color: '#333' }}>Menu Options</h4>
        <a
          href="/admindashboard"
          style={menuLinkBaseStyle}
          className="button-hover-effect"
        >
          Dashboard
        </a>

        <a
          href="/reports"
          style={menuLinkBaseStyle}
          className="button-hover-effect"
        >Reports</a>

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userRole');
              navigate('/login');
              toggleMenu();
            }}
            style={{
              background: '#f1f5f9',
              color: '#ef4444',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              margin: '16px 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            className="button-hover-effect"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* Client Details Modal */}
      <Modal
        show={showClientDetailsModal}
        onHide={toggleClientDetailsModal}
        centered
        size="xl"
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static" // Ensures a static backdrop is used
      >
        <Modal.Header>
          <Modal.Title>Client Details</Modal.Title>
          <button
            onClick={toggleClientDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div style={{
            position: 'relative',
            display: 'flex',
            borderRadius: '0.5rem',
            backgroundColor: '#EEE',
            boxSizing: 'border-box',
            boxShadow: '0 0 0px 1px rgba(0, 0, 0, 0.06)',
            padding: '0.25rem',
            width: '100%',
            maxWidth: '900px',
            fontSize: '14px',
            margin: '0 auto 20px auto',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {[
              { label: 'Registered Clients', value: 'registered', count: clients.filter(c => c.displayStatuses.includes('registered')).length, activeBg: '#E6F0FF', activeColor: '#3A60EE', badgeBg: '#3A60EE' },
              { label: 'Unassigned Clients', value: 'unassigned', count: clients.filter(c => c.displayStatuses.includes('unassigned')).length, activeBg: '#E6E6E6', activeColor: '#334155', badgeBg: '#9AA0A6' },
              { label: 'Active Clients', value: 'active', count: clients.filter(c => c.displayStatuses.includes('active')).length, activeBg: '#D9F5E6', activeColor: '#28A745', badgeBg: '#28A745' },
              { label: 'Rejected Clients', value: 'rejected', count: clients.filter(c => c.displayStatuses.includes('rejected')).length, activeBg: '#FFEDEE', activeColor: '#DC3545', badgeBg: '#DC3545' },
              { label: 'Restore Clients', value: 'restored', count: clients.filter(c => c.displayStatuses.includes('restored')).length, activeBg: '#F0E6FF', activeColor: '#6A40EE', badgeBg: '#6A40EE' },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  flexShrink: 0,
                  flexGrow: 1,
                  textAlign: 'center',
                  display: 'flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  border: 'none',
                  padding: '.5rem 10px',
                  transition: 'all .15s ease-in-out',
                  backgroundColor: clientFilter === option.value ? option.activeBg : 'transparent',
                  color: clientFilter === option.value ? option.activeColor : 'rgba(51, 65, 85, 1)',
                  fontWeight: clientFilter === option.value ? '600' : 'normal',
                  margin: '0 2px 5px 2px',
                }}
              >
                <input
                  type="radio"
                  name="client-filter"
                  value={option.value}
                  checked={clientFilter === option.value}
                  onChange={(e) => {
                    setClientFilter(e.target.value);
                  }}
                  style={{ display: 'none' }}
                />
                <span style={{ whiteSpace: 'nowrap', marginRight: '8px' }}>{option.label}</span>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: clientFilter === option.value ? option.badgeBg : '#9AA0A6',
                }}>
                  {option.count}
                </span>
              </label>
            ))}
          </div>

          <h4 style={{
            marginBottom: '15px',
            marginTop: '0px',
            color: '#333',
            fontSize: '1.2rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {clientFilter === 'registered' && `Registered Clients`}
            {clientFilter === 'unassigned' && `Unassigned Clients`}
            {clientFilter === 'active' && `Active Clients`}
            {clientFilter === 'rejected' && `Rejected Clients`}
            {clientFilter === 'restored' && `Restored Clients`} ({filteredClients.length})
          </h4>
          <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
            <table style={modalTableStyle}>
              <thead>
                <tr>
                  {tableConfig[clientFilter].headers.map((header, index) => (
                    <th key={header} style={{
                      ...modalTableHeaderStyle,
                      width: tableConfig[clientFilter].widths[index],
                      textAlign: header === 'Actions' ? 'right' : 'left',
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client, index) => (
                    <tr key={client.id} style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff2f7',
                    }}>
                      {tableConfig[clientFilter].headers.map((header, colIndex) => (
                        <td
                          key={`${client.id}-${header}`}
                          style={{
                            ...modalTableCellStyle,
                            textAlign: header === 'Actions' ? 'right' : 'left',
                          }}
                        >
                          {header === 'Actions' ? tableConfig[clientFilter].renderActions(client) : getValue(client, header)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableConfig[clientFilter].headers.length} style={{ ...modalTableCellStyle, textAlign: 'center', color: '#666' }}>
                      No {clientFilter} clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      {/* Manager Details Modal */}
      <Modal
        show={showManagersDetailsModal}
        onHide={toggleManagersDetailsModal}
        centered
        size="xl"
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static" // Ensures a static backdrop is used
      >
        <Modal.Header>
          <Modal.Title>Manager Details</Modal.Title>
          <button
            onClick={toggleManagersDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Reduced search bar width to w-25 */}
              <InputGroup className="w-25">
                <Form.Control
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Button variant="success" onClick={handleManagerShowModal}>+ Add Manager</Button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
              <table style={modalTableStyle}>
                <thead>
                  <tr>
                    {tableConfig.manager.headers.map((header, index) => (
                      <th key={header} style={{
                        ...modalTableHeaderStyle,
                        width: tableConfig.manager.widths[index],
                        textAlign: (header === 'PEOPLE' || header === 'EDIT' || header === 'STATUS') ? 'center' : 'left',
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {managers
                    .filter((manager) =>
                      [manager.firstName, manager.lastName, manager.email, manager.mobile].some((field) =>
                        field.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    ).map((manager, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff2f7' }}>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'FIRST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'LAST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'MOBILE')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'EMAIL')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'PASSWORD')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...manager, index: index }, 'ROLE')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...manager, index: index }, 'PEOPLE')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...manager, index: index }, 'EDIT')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...manager, index: index }, 'STATUS')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for Add/Edit Manager */}
      <Modal show={showManagerModal} onHide={handleManagerCloseModal} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isManagerEditing ? 'Edit Manager' : 'Add Manager'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={newManager.firstName} onChange={handleManagerInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={newManager.lastName} onChange={handleManagerInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newManager.mobile} onChange={handleManagerInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newManager.email} onChange={handleManagerInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newManager.password} onChange={handleManagerInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={newManager.role}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleManagerCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddManager}>
            {isManagerEditing ? 'Update Manager' : 'Add Manager'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Manager Activation/Deactivation */}
      <Modal show={confirmationOpen && managerToDeactivate !== null} onHide={() => setConfirmationOpen(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isActivating ? 'Confirm Activation' : 'Confirm Deactivation'} Manager
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this Manager?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmManagerToggle}>
            Yes, {isActivating ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Assign People (to a manager) */}
      <Modal show={assignModalOpen} onHide={() => setAssignModalOpen(false)} centered backdrop="static" keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Assign People</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Team Leads</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Team Leads by name or email"
              value={teamLeadSearch}
              onChange={(e) => setTeamLeadSearch(e.target.value)}
            />
          </InputGroup>
          <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
            <Table striped size="sm" style={modalTableStyle}>
              <thead>
                <tr>
                  <th style={modalTableHeaderStyle}>Select</th>
                  <th style={modalTableHeaderStyle}>First Name</th>
                  <th style={modalTableHeaderStyle}>Last Name</th>
                  <th style={modalTableHeaderStyle}>Mobile</th>
                  <th style={modalTableHeaderStyle}>Email</th>
                  <th style={modalTableHeaderStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeamLeads
                  .filter(p =>
                    p.firstName.toLowerCase().includes(teamLeadSearch.toLowerCase()) ||
                    p.email.toLowerCase().includes(teamLeadSearch.toLowerCase())
                  )
                  .map((person, idx) => (
                    <tr key={`tl-${idx}`}>
                      <td style={modalTableCellStyle}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedPeople.some(p => p.email === person.email)}
                          onChange={() => togglePersonSelection(person)}
                        />
                      </td>
                      <td style={modalTableCellStyle}>{person.firstName}</td>
                      <td style={modalTableCellStyle}>{person.lastName}</td>
                      <td style={modalTableCellStyle}>{person.mobile}</td>
                      <td style={modalTableCellStyle}>{person.email}</td>
                      <td style={modalTableCellStyle}>{person.role}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          <h5 className="mt-4">Employees</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Employees by name or email"
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
            />
          </InputGroup>
          <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
            <Table striped size="sm" style={modalTableStyle}>
              <thead>
                <tr>
                  <th style={modalTableHeaderStyle}>Select</th>
                  <th style={modalTableHeaderStyle}>First Name</th>
                  <th style={modalTableHeaderStyle}>Last Name</th>
                  <th style={modalTableHeaderStyle}>Mobile</th>
                  <th style={modalTableHeaderStyle}>Email</th>
                  <th style={modalTableHeaderStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .filter(p =>
                    p.firstName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                    p.email.toLowerCase().includes(employeeSearch.toLowerCase())
                  )
                  .map((person, index) => (
                    <tr key={`emp-${index}`}>
                      <td style={modalTableCellStyle}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedPeople.some(p => p.email === person.email)}
                          onChange={() => togglePersonSelection(person)}
                        />
                      </td>
                      <td style={modalTableCellStyle}>{person.firstName}</td>
                      <td style={modalTableCellStyle}>{person.lastName}</td>
                      <td style={modalTableCellStyle}>{person.mobile}</td>
                      <td style={modalTableCellStyle}>{person.email}</td>
                      <td style={modalTableCellStyle}>{person.role}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          <h5 className="mt-4">Interns</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Interns by name or email"
              value={internSearch}
              onChange={(e) => setInternSearch(e.target.value)}
            />
          </InputGroup>
          <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
            <Table striped size="sm" style={modalTableStyle}>
              <thead>
                <tr>
                  <th style={modalTableHeaderStyle}>Select</th>
                  <th style={modalTableHeaderStyle}>First Name</th>
                  <th style={modalTableHeaderStyle}>Last Name</th>
                  <th style={modalTableHeaderStyle}>Mobile</th>
                  <th style={modalTableHeaderStyle}>Email</th>
                  <th style={modalTableHeaderStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterns
                  .filter(p =>
                    p.firstName.toLowerCase().includes(internSearch.toLowerCase()) ||
                    p.email.toLowerCase().includes(internSearch.toLowerCase())
                  )
                  .map((person, index) => (
                    <tr key={`int-${index}`}>
                      <td style={modalTableCellStyle}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedPeople.some(p => p.email === person.email)}
                          onChange={() => togglePersonSelection(person)}
                        />
                      </td>
                      <td style={modalTableCellStyle}>{person.firstName}</td>
                      <td style={modalTableCellStyle}>{person.lastName}</td>
                      <td style={modalTableCellStyle}>{person.mobile}</td>
                      <td style={modalTableCellStyle}>{person.email}</td>
                      <td style={modalTableCellStyle}>{person.role}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleManagerAssignDone}>Done</Button>
        </Modal.Footer>
      </Modal>

      {/* Manager Details Modal (to view assigned people) */}
      {selectedManagerData && (
        <Modal show={showManagerAssignedPeopleModal} onHide={() => setShowManagerAssignedPeopleModal(false)} centered size="lg" contentClassName="custom-modal-content" backdrop="static">
          <Modal.Header>
            <Modal.Title>Assigned Team Leads & Employees</Modal.Title>
            <button
              onClick={() => setShowManagerAssignedPeopleModal(false)}
              style={modalCloseButtonStyle}
              className="button-hover-effect"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </Modal.Header>
          <Modal.Body>
            <h5 className="mb-3">Manager: {selectedManagerData.firstName} {selectedManagerData.lastName}</h5>

            {/* Assigned People Table */}
            {selectedManagerData.assignedPeople?.length > 0 ? (
              <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
                <table style={modalTableStyle}>
                  <thead>
                    <tr>
                      <th style={modalTableHeaderStyle}>S.No</th>
                      <th style={modalTableHeaderStyle}>First Name</th>
                      <th style={modalTableHeaderStyle}>Last Name</th>
                      <th style={modalTableHeaderStyle}>Mobile</th>
                      <th style={modalTableHeaderStyle}>Email</th>
                      <th style={modalTableHeaderStyle}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedManagerData.assignedPeople.map((person, idx) => (
                      <tr key={`assigned-${idx}`} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#eff2f7' }}>
                        <td style={modalTableCellStyle}>{idx + 1}</td>
                        <td style={modalTableCellStyle}>{person.firstName}</td>
                        <td style={modalTableCellStyle}>{person.lastName}</td>
                        <td style={modalTableCellStyle}>{person.mobile}</td>
                        <td style={modalTableCellStyle}>{person.email}</td>
                        <td style={modalTableCellStyle}>{person.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted" style={{ ...modalTableCellStyle, textAlign: 'center' }}>No people assigned yet.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowManagerAssignedPeopleModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* TeamLead Details Modal */}
      <Modal
        show={showTeamLeadsDetailsModal}
        onHide={toggleTeamLeadsDetailsModal}
        centered
        size="xl"
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static" // Ensures a static backdrop is used
      >
        <Modal.Header>
          <Modal.Title>Team Leads Details</Modal.Title>
          <button
            onClick={toggleTeamLeadsDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Reduced search bar width to w-25 */}
              <InputGroup className="w-25">
                <Form.Control
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Button variant="success" onClick={handleTeamLeadShowModal}>+ Add TeamLead</Button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
              <table style={modalTableStyle}>
                <thead>
                  <tr>
                    {tableConfig.teamlead.headers.map((header, index) => (
                      <th key={header} style={{
                        ...modalTableHeaderStyle,
                        width: tableConfig.teamlead.widths[index],
                        textAlign: (header === 'EDIT' || header === 'STATUS') ? 'center' : 'left',
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamLeads
                    .filter((teamlead) =>
                      [teamlead.firstName, teamlead.lastName, teamlead.email, teamlead.mobile].some((field) =>
                        field.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    )
                    .map((teamlead, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff2f7' }}>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'FIRST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'LAST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'MOBILE')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'EMAIL')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'PASSWORD')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...teamlead, index: index }, 'ROLE')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...teamlead, index: index }, 'EDIT')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...teamlead, index: index }, 'STATUS')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add/Edit TeamLead Modal */}
      <Modal show={showTeamLeadModal} onHide={handleTeamLeadCloseModal} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isTeamLeadEditing ? 'Edit TeamLead' : 'Add TeamLead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={newTeamLead.firstName} onChange={handleTeamLeadInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={newTeamLead.lastName} onChange={handleTeamLeadInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newTeamLead.mobile} onChange={handleTeamLeadInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newTeamLead.email} onChange={handleTeamLeadInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newTeamLead.password} onChange={handleTeamLeadInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" name="role" value={newTeamLead.role} readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTeamLeadCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddTeamLead}>
            {isTeamLeadEditing ? 'Update TeamLead' : 'Add TeamLead'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modals for TeamLead Activation/Deactivation */}
      <Modal show={confirmationOpen && teamLeadToDeactivate !== null} onHide={() => setConfirmationOpen(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isActivating ? 'Confirm Activation' : 'Confirm Deactivation'} Team Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this team lead?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmTeamLeadToggle}>
            Yes, {isActivating ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Employee Details Modal */}
      <Modal
        show={showEmployeesDetailsModal}
        onHide={toggleEmployeesDetailsModal}
        centered
        size="xl"
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static" // Ensures a static backdrop is used
      >
        <Modal.Header>
          <Modal.Title>Employee Details</Modal.Title>
          <button
            onClick={toggleEmployeesDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Reduced search bar width to w-25 */}
              <InputGroup className="w-25">
                <Form.Control
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Button variant="success" onClick={handleEmployeeShowModal}>+ Add Employee</Button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '8px', marginBottom: '30px' }}>
              <table style={modalTableStyle}>
                <thead>
                  <tr>
                    {tableConfig.employee.headers.map((header, index) => (
                      <th key={header} style={{
                        ...modalTableHeaderStyle,
                        width: tableConfig.employee.widths[index],
                        textAlign: (header === 'EDIT' || header === 'STATUS') ? 'center' : 'left',
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter((employee) =>
                      [employee.firstName, employee.lastName, employee.email, employee.mobile]
                        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((employee, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff2f7' }}>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'FIRST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'LAST NAME')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'MOBILE')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'EMAIL')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'PASSWORD')}</td>
                        <td style={modalTableCellStyle}>{getValue({ ...employee, index: index }, 'ROLE')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...employee, index: index }, 'EDIT')}</td>
                        <td style={{ ...modalTableCellStyle, textAlign: 'center' }}>{getValue({ ...employee, index: index }, 'STATUS')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for Add/Edit Employee */}
      <Modal show={showEmployeeModal} onHide={handleEmployeeCloseModal} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isEmployeeEditing ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={newEmployee.firstName} onChange={handleEmployeeInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={newEmployee.lastName} onChange={handleEmployeeInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newEmployee.mobile} onChange={handleEmployeeInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newEmployee.email} onChange={handleEmployeeInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newEmployee.password} onChange={handleEmployeeInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={newEmployee.role} onChange={handleEmployeeInputChange}>
                <option value="Employee">Employee</option>
                <option value="Intern">Intern</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEmployeeCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            {isEmployeeEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Employee Activation/Deactivation */}
      <Modal show={confirmationOpen && employeeToDeactivate !== null} onHide={() => setConfirmationOpen(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{isActivating ? 'Confirm Activation' : 'Confirm Deactivation'} Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this Employee?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmEmployeeToggle}>
            Yes, {isActivating ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Details Modal */}
      <Modal
        show={showProfileDetailsModal}
        onHide={toggleProfileDetailsModal}
        centered
        size="md" // Smaller size for profile details
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Profile Details</Modal.Title>
          <button
            onClick={toggleProfileDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <CgProfile style={{ fontSize: '6em', color: '#0a193c', marginBottom: '15px' }} />
            <h4 style={{ color: '#333', marginBottom: '5px' }}>Admin User</h4>
            <p style={{ color: '#666', fontSize: '0.95em' }}>admin@techxplorers.com</p>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <p style={{ color: '#444', marginBottom: '10px' }}><strong>Role:</strong> Administrator</p>
            <p style={{ color: '#444', marginBottom: '10px' }}><strong>Status:</strong> Active</p>
            <p style={{ color: '#444', marginBottom: '10px' }}><strong>Last Login:</strong> 2025-06-23 07:09 PM</p>
            <p style={{ color: '#444', marginBottom: '10px' }}><strong>Contact:</strong> +91 98765 43210</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleProfileDetailsModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Details Modal */}
      <Modal
        show={showNotificationDetailsModal}
        onHide={toggleNotificationDetailsModal}
        centered
        size="md" // Smaller size for notification details
        dialogClassName="custom-modal-dialog"
        contentClassName="custom-modal-content"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Notifications</Modal.Title>
          <button
            onClick={toggleNotificationDetailsModal}
            style={modalCloseButtonStyle}
            className="button-hover-effect"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <p style={{ fontWeight: '600', color: '#333', marginBottom: '5px' }}>{notification.message}</p>
                <p style={{ fontSize: '0.8em', color: '#999' }}>{notification.timestamp}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No new notifications.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleNotificationDetailsModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// --- Inline Styles (moved outside the AdminDashboard component) ---
const cardStyle = {
  background: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  padding: '25px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '180px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.4s ease-out',
};

const cardTitleStyle = {
  fontSize: '1.6em',
  fontWeight: 'bold',
  marginBottom: 'auto',
  color: '#333'
};

const cardIconStyle = {
  fontSize: '2.5em',
  color: '#6c757d',
  alignSelf: 'flex-end',
  marginTop: '15px',
};

const menuLinkBaseStyle = {
  color: '#333',
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  transition: 'background-color 0.2s',
  display: 'block',
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '25px',
  right: '25px',
  background: '#f1f5f9',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s, transform 0.1s',
  color: '#64748b',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const modalTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: '0',
  marginTop: '20px',
  borderRadius: '8px',
  overflow: 'hidden',
  tableLayout: 'fixed',
};

const modalTableHeaderStyle = {
  padding: '10px 10px',
  textAlign: 'left',
  backgroundColor: '#e2e8f0',
  color: '#334155',
  fontSize: '0.875rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.7px',
  position: 'sticky',
  top: '0',
  zIndex: '10',
};

const modalTableCellStyle = {
  padding: '14px 10px',
  textAlign: 'left',
  fontSize: '0.9rem',
  color: '#334155',
  wordBreak: 'break-word',
  verticalAlign: 'middle',
};

const actionButtonStyle = {
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.85em',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
};

const chartSectionStyle = {
  gridColumn: 'span 2',
  background: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
  transform: 'translateX(-50px)',
  opacity: 0,
};

const aboutSectionStyle = {
  gridColumn: 'span 2',
  background: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '400px',
  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
  transform: 'translateX(50px)',
  opacity: 0,
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '20px',
  height: '20px',
  borderRadius: '50%',
  color: 'white',
  fontSize: '0.75em',
  fontWeight: 'bold',
  padding: '0 6px',
  marginLeft: '5px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  transition: 'background-color 0.15s ease',
};

// This is the main App component that will be rendered in your index.js/main.jsx
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Render AdminDashboard component for the root path and /admindashboard */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        {/* You can add other routes here as needed, e.g., for /reports */}
        <Route path="/reports" element={<div>Reports Page - Content to be added</div>} />
        <Route path="/login" element={<div>Login Page - Content to be added</div>} />
        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AdminDashboard; // Export App as the default component
