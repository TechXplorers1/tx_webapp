import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Using react-bootstrap Modal
import { getDatabase, ref, onValue, update, push, set } from "firebase/database"; // Import Firebase functions
import { database, auth } from '../firebase'; // Import your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";




const FilterComponent = ({
  filterDateRange,
  handleDateRangeChange,
  sortOrder,
  setSortOrder,
  quickFilter,
  handleQuickFilterChange,
  areFiltersActive,
  handleClearFilters,
  sortOptions
}) => {
  return (
    <div className="filter-container-style">
      <div className="filter-group-style">
        <label className="filter-label-style">Date Range</label>
        <div className="date-range-input-group-style">
          <input
            type="date"
            name="startDate"
            value={filterDateRange.startDate}
            onChange={handleDateRangeChange}
            className="date-input-style"
          />
          <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
          <input
            type="date"
            name="endDate"
            value={filterDateRange.endDate}
            onChange={handleDateRangeChange}
            className="date-input-style"
          />
        </div>
      </div>

      <div className="filter-group-style" style={{ marginLeft: 'auto' }}>
        <label className="filter-label-style">Sort Order</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select-filter-style"
        >
          {sortOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      <div className="filter-group-style">
        <label className="filter-label-style">Quick Filters</label>
        <div className="quick-filter-buttons-style">
          <button
            onClick={() => handleQuickFilterChange('Last 7 Days')}
            className={`quick-filter-button-style ${quickFilter === 'Last 7 Days' ? 'active' : ''}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleQuickFilterChange('Last 30 Days')}
            className={`quick-filter-button-style ${quickFilter === 'Last 30 Days' ? 'active' : ''}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handleQuickFilterChange('All Time')}
            className={`quick-filter-button-style ${quickFilter === 'All Time' ? 'active' : ''}`}
          >
            All Time
          </button>
        </div>
      </div>

      {areFiltersActive() && (
        <div className="clear-filters-button-container-style">
          <label className="filter-label-style">Actions</label>
          <button onClick={handleClearFilters} className="clear-filters-button-style">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};


const ManagerWorkSheet = () => {

  const navigate = useNavigate();
  // State to manage the current theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    // Initialize theme from local storage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  const [clients, setClients] = useState([]); // REMOVE THIS LINE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage the active tab, now including 'Assigned', 'Interviews', 'Notes'
  const [activeTab, setActiveTab] = useState('Assignments'); // Default to 'Assignments'

  // State for logged-in user's name and avatar initial
  const [userName, setUserName] = useState('Manager'); // Changed from Balaji to Chaveen
  const [userAvatarLetter, setUserAvatarLetter] = useState('C'); // Derived from userName

  // NEW STATE: State to control the visibility of the profile dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Ref for the profile dropdown to detect clicks outside
  const profileDropdownRef = useRef(null);

  // NEW STATE: For Notifications Modal
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];

  // Dummy notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Feature Alert', message: 'Discover our new analytics dashboard!', time: '2 hours ago' },
    { id: 2, title: 'Payment Due Soon', message: 'Your subscription renews in 3 days.', time: '1 day ago' },
    { id: 3, title: 'Profile Update', message: 'Your profile information has been updated.', time: '2 days ago' },
  ]);

  // NEW STATE: For User Profile Edit Modal
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Manager',
    employeeId: 'MNG001',
    email: 'manager@techxplorers.com',
    mobile: '+91 98765 43210',
    lastLogin: '2025-07-15 10:30 AM',
  });

  const [displayEmployees, setDisplayEmployees] = useState([]);

    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
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
  
  // --- MODIFICATION 2: Port the dropdown options ---
  const departmentOptions = ['No department assigned', 'Management', 'Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Support', 'Quality Assurance', 'Tech Placement', 'HR', 'External'];
  const roleOptions = [
    { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
    { value: 'Admin', label: 'Admin', description: 'Full system access and employee management' },
    { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
    { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
  ];
  const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  // ... (all existing useEffect hooks remain the same)

  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    setNewEmployee({
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
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewEmployee(prev => ({ ...prev, temporaryPassword: password }));
  };

  const handleCreateEmployeeAccount = async (e) => {
    e.preventDefault();
    const newEmployeeData = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      accountStatus: newEmployee.accountStatus,
      roles: [newEmployee.role.toLowerCase()],
      department: newEmployee.department,
      workEmail: newEmployee.workEmail,
      temporaryPassword: newEmployee.temporaryPassword,
      gender: newEmployee.gender,
      dateOfBirth: newEmployee.dateOfBirth,
      maritalStatus: newEmployee.maritalStatus,
      personalNumber: newEmployee.personalNumber,
      alternativeNumber: newEmployee.alternativeNumber,
      country: newEmployee.country,
      state: newEmployee.state,
      city: newEmployee.city,
      address: newEmployee.address,
      zipcode: newEmployee.zipcode,
      dateOfJoin: newEmployee.dateOfJoin,
      personalEmail: newEmployee.personalEmail,
    };

    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmployee.workEmail,
        newEmployee.temporaryPassword
      );
      const user = userCredential.user;

      // Step 2: Add the unique auth UID (firebaseKey) to the data object
      newEmployeeData.firebaseKey = user.uid;


      const usersRef = ref(database, `users/${user.uid}`);
      
      
    await set(usersRef, newEmployeeData);
      
      console.log("Employee created successfully from Manager Worksheet!");
      handleCloseAddEmployeeModal();
      setSuccessMessage(`${newEmployee.firstName} ${newEmployee.lastName} has been successfully added.`);
      setShowSuccessModal(true);

      } catch (error) {
       if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please use a different work email.");
      } else {
        console.error("Error creating employee:", error);
        alert("Failed to create employee. Please check the details and try again.");
      }
    }
  };


  // NEW: useEffect to get logged-in user data from sessionStorage
useEffect(() => {
    const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
    const managerFirebaseKey = loggedInUserData ? loggedInUserData.firebaseKey : null;

    if (!managerFirebaseKey) {
        setLoading(false);
        return; // Stop if no manager is logged in
    }

    const clientsRef = ref(database, 'clients');
    const usersRef = ref(database, 'users'); // Reference the 'users' node

    const unsubscribeClients = onValue(clientsRef, (snapshot) => {
  const clientsData = snapshot.val();
      const allRegistrations = []; // We will create a flat list of registrations here.

      if (clientsData) {
        // Iterate over each client object from Firebase
        Object.keys(clientsData).forEach(clientKey => {
          const client = clientsData[clientKey];
          // Check if the client has the nested serviceRegistrations
          if (client.serviceRegistrations) {
            // Iterate over each individual service registration
            Object.keys(client.serviceRegistrations).forEach(regKey => {
              const registration = client.serviceRegistrations[regKey];
              // Create a new, combined object with both client and registration info
              allRegistrations.push({
                ...registration, // service, assignmentStatus, etc.
                clientFirebaseKey: clientKey,
                registrationKey: regKey,
                email: client.email,
                mobile: client.mobile,
                // Use the name from the registration, fallback to the parent client's name
                firstName: registration.firstName || client.firstName,
                lastName: registration.lastName || client.lastName,
              });
            });
          }
        });
      }
      
      // Now, filter this complete list of registrations for the logged-in manager
      const unassignedForManager = allRegistrations.filter(reg => 
        reg.assignedManager === managerFirebaseKey && reg.assignmentStatus === 'pending_employee'
      );
      
      const assignedByManager = allRegistrations.filter(reg => 
        reg.assignedManager === managerFirebaseKey && ['pending_acceptance', 'active'].includes(reg.assignmentStatus)
      );

      setUnassignedClients(unassignedForManager);
      setAssignedClients(assignedByManager);

      // The logic for applications and interviews can now also use the 'assignedByManager' list
      // which is derived from the correctly filtered registrations.
      const allApplications = assignedByManager.flatMap(clientReg => 
          (clientReg.jobApplications || []).map(app => ({
              ...app,
              clientName: `${clientReg.firstName} ${clientReg.lastName}`,
              assignedTo: clientReg.assignedTo
          }))
      );
      setApplicationData(allApplications);

      const allInterviews = assignedByManager.flatMap(clientReg => 
          (clientReg.jobApplications || [])
              .filter(app => app.status === 'Interview')
              .map(app => ({ ...app, clientName: `${clientReg.firstName} ${clientReg.lastName}`, assignedTo: clientReg.assignedTo }))
      );
      setInterviewData(allInterviews);
      
      setLoading(false);
    });

    // --- MODIFIED: Fetch all users and filter for employees ---
      const unsubscribeUsers = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.keys(data).map(key => ({ firebaseKey: key, ...data[key] }));
          setAllEmployees(usersArray); 
          const employeesOnly = usersArray.filter(user => 
            user.roles && Array.isArray(user.roles) && user.roles.includes('employee')
          );
          setEmployeesForAssignment(employeesOnly);
        }
    });

    return () => {
      unsubscribeClients();
      unsubscribeUsers();
    };
  }, []);

 

  // State to manage editable profile fields
  const [editableProfile, setEditableProfile] = useState({});
  // NEW: State to control if user profile fields are editable
  const [isEditingUserProfile, setIsEditingUserProfile] = useState(false);


  // State to control the visibility of the Unassigned Clients modal
  const [isUnassignedClientsModalOpen, setIsUnassignedClientsModalOpen] = useState(false);

  // State to control the visibility of the Assign Client to Employee modal
  const [isAssignClientModalOpen, setIsAssignClientModalOpen] = useState(false);
  // State to hold the client data for the "Assign Client to Employee" modal
  const [selectedClientToAssign, setSelectedClientToAssign] = useState(null);

  // States for the "Assign Client to Employee" form
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [assignmentPriority, setAssignmentPriority] = useState('medium'); // Default priority
  // FIX: Corrected assignmentNotes state initialization
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // State for the selected priority filter in the modal
  const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'high', 'medium', 'low'
  // NEW STATE: Search query for the Unassigned Clients modal
  const [unassignedSearchQuery, setUnassignedSearchQuery] = useState('');


  // New state for the "Total Clients" modal visibility
  const [isTotalClientsModalOpen, setIsTotalClientsModalOpen] = useState(false);

  // NEW STATE: For the Employee's Assigned Clients Detail Modal
  const [isEmployeeClientsModalOpen, setIsEmployeeClientsModalOpen] = useState(false);
  const [selectedEmployeeForClients, setSelectedEmployeeForClients] = useState(null); // Changed to useState(null)

  // NEW STATE: Search query for Interviews tab
  const [interviewSearchQuery, setInterviewSearchQuery] = useState('');
  // NEW STATE: Filter for Interviews tab
  const [interviewFilterRound, setInterviewFilterRound] = useState('All Rounds');

  // NEW STATE: Search query for Applications tab
  const [applicationSearchQuery, setApplicationSearchQuery] = useState(''); // Added for Applications tab search
  // FIX: Corrected useState initialization for applicationFilterEmployee
  const [applicationFilterEmployee, setApplicationFilterEmployee] = useState(''); // Added for Applications tab filter
  // NEW STATE: Filter by client for Applications tab
  const [applicationFilterClient, setApplicationFilterClient] = useState(''); // New state for client filter
  // NEW STATES: Date range filters for Applications tab
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');


  // NEW STATE: Search query for Assigned tab employees
  const [assignedEmployeeSearchQuery, setAssignedEmployeeSearchQuery] = useState(''); // New state for employee search

  // NEW STATE: For Client Preview Modal
  const [isClientPreviewModalOpen, setIsClientPreviewModalOpen] = useState(false);
  const [clientToPreview, setClientToPreview] = useState(null);

  // NEW STATE: For Reassign Client Modal
  const [isReassignClientModalOpen, setIsReassignClientModalOpen] = useState(false);
  const [clientToReassign, setClientToReassign] = useState(null);

  // NEW STATE: For Edit Client Modal (repurposing the preview modal)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  // NEW: State to control if user profile fields are editable
  const [isEditingClient, setIsEditingClient] = useState(false);

  // Add these states near your other useState declarations
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // NEW: State for LLM response and loading status
  const [llmResponse, setLlmResponse] = useState('');
  const [isLoadingLLMResponse, setIsLoadingLLMResponse] = useState(false);


  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [quickFilter, setQuickFilter] = useState('');
  

  // ... (rest of the state declarations)

  // MODIFICATION: Add filter handler functions
  const handleDateRangeChange = (e) => {
    setFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickFilterChange = (filterType) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    if (filterType === 'Last 7 Days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'All Time') {
      startDate = '';
      endDate = '';
    }
    setFilterDateRange({ startDate, endDate });
    setQuickFilter(filterType);
  };
  
  const areFiltersActive = () => {
    return filterDateRange.startDate !== '' || filterDateRange.endDate !== '' || sortOrder !== 'Newest First' || quickFilter !== '';
  };

  const handleClearFilters = () => {
    setFilterDateRange({ startDate: '', endDate: '' });
    setSortOrder('Newest First');
    setQuickFilter('');
    // Clear specific search/filter states depending on the active tab
    if (activeTab === 'Applications') {
      setApplicationSearchQuery('');
      setApplicationFilterEmployee('');
      setApplicationFilterClient('');
    } else if (activeTab === 'Interviews') {
      setInterviewSearchQuery('');
      setInterviewFilterRound('All Rounds');
    }
  };





  // Helper function to format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        // If it's not a valid date, try to parse it as DD/MM/YYYY if it already is
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
        return dateString; // Return original if invalid and not DD/MM/YYYY
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString; // Fallback to original string on error
    }
  };


  // Initial dummy data for unassigned clients (7 clients)
  const initialUnassignedClientsData = [
    { id: 1, name: 'David Wilson', priority: 'high', skills: ['Python', 'Django', 'PostgreSQL'], experience: '6 years experience', remote: true, email: 'david.wilson@example.com', salary: '$100,000 - $120,000' },
    // NEW: Added full profiles for clients previously only in applications/interviews
    { id: 8, name: 'Sarah Mitchell', priority: 'medium', skills: ['UX Design', 'Figma', 'User Research'], experience: '5 years experience', remote: false, email: 'sarah.m@example.com', salary: '$90,000 - $110,000' },
    { id: 9, name: 'Mohammed Sheikh', priority: 'high', skills: ['Data Analysis', 'SQL', 'Python (Pandas)'], experience: '4 years experience', remote: true, email: 'michael.chen.client@example.com', salary: '$85,000 - $105,000' },
    { id: 10, name: 'Jessica Williams', priority: 'medium', skills: ['Product Design', 'Sketch', 'Prototyping'], experience: '6 years experience', remote: false, email: 'jessica.w@example.com', salary: '$95,000 - $115,000' },
    { id: 11, name: 'David Kim', priority: 'low', skills: ['Backend Development', 'Java', 'Spring'], experience: '3 years experience', remote: true, email: 'david.k@example.com', salary: '$75,000 - $95,000' },
  ];

  // Initial dummy data for assigned clients (5 clients, all for Vyshnavi Vysh for testing)
  const initialAssignedClientsData = [
    { id: 201, clientName: 'John Anderson', location: 'New York, NY', position: 'Senior Frontend Developer', salary: '$120,000 - $150,000', company: 'TechFlow Inc', assignedTo: 'Vyshnavi Vysh', priority: 'high', status: 'interview', assignedDate: '2025-07-15', platform: 'LinkedIn', jobId: 'LI-1001', appliedDate: '2025-07-10' },
    { id: 205, clientName: 'Alex Thompson', location: 'Boston, MA', position: 'Full Stack Developer', salary: '$110,000 - $140,000', company: 'StartupXYZ', assignedTo: 'Krishna Kumar', priority: 'medium', status: 'applied', assignedDate: '2025-07-14', platform: 'Indeed', jobId: 'IND-2005', appliedDate: '2025-07-11' },
    { id: 208, clientName: 'Maria Rodriguez', location: 'Denver, CO', position: 'React Developer', salary: '$95,000 - $115,000', company: 'WebDev Inc', assignedTo: 'Nagarjuna Sai', priority: 'high', status: 'applied', assignedDate: '2025-07-13', platform: 'Company Website', jobId: 'WEB-3008', appliedDate: '2025-07-12' },
    { id: 209, clientName: 'Chris Evans', location: 'Miami, FL', position: 'DevOps Engineer', salary: '$130,000 - $150,000', company: 'CloudOps', assignedTo: 'Vyshnavi Vysh', priority: 'high', status: 'interview', assignedDate: '2025-07-12', platform: 'Glassdoor', jobId: 'GD-4009', appliedDate: '2025-07-13' },
    { id: 210, clientName: 'Anna Lee', location: 'Portland, OR', position: 'Data Scientist', salary: '$115,000 - $145,000', company: 'DataInsights', assignedTo: 'Mohammed Sheikh', priority: 'medium', status: 'applied', assignedDate: '2025-07-11', platform: 'LinkedIn', jobId: 'LI-5010', appliedDate: '2025-07-14' },
  ];





  // Add this helper function inside your ManagerWorkSheet component
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return ''; // Safety check
    const parts = name.split(' ').filter(Boolean); // Filter out empty strings
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + (parts[parts.length - 1].charAt(0) || '')).toUpperCase();
  };

  // State variables for dynamic data
  // 2. REPLACE your 'useState' for unassignedClients with this new logic

  const [unassignedClients, setUnassignedClients] = useState([]);
  const [assignedClients, setAssignedClients] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [applicationData, setApplicationData] = useState([]); // Initialize as empty, will be populated by useEffect

  // State to store application counts per client
  const [clientApplicationCounts, setClientApplicationCounts] = useState({});

  // NEW: Comprehensive dummy data for client details (from EmployeeData.txt structure)
  // This data will be the source of truth for detailed client profiles
  const [mockDetailedClientsData, setMockDetailedClientsData] = useState([
    {
      id: 1, // Corresponds to David Wilson in unassignedClientsData
      name: 'David Wilson',
      firstName: 'David',
      middleName: '',
      lastName: 'Wilson',
      dob: '1990-01-01',
      gender: 'Male',
      ethnicity: 'Caucasian',
      address: '123 Tech Lane, Austin, TX',
      zipCode: '73301',
      mobile: '555-111-2222',
      email: 'david.wilson@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'Yes',
      workPreference: 'Remote',
      restrictedCompanies: 'None',
      jobsToApply: 'Python Developer, Backend Engineer',
      technologySkills: 'Python, Django, PostgreSQL, AWS',
      currentSalary: '$95,000',
      expectedSalary: '$110,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'University of Texas at Austin',
      schoolAddress: 'Austin, TX',
      schoolPhone: '512-555-1234',
      courseOfStudy: 'Computer Science',
      graduationDate: '2012-05-20',
      currentCompany: 'Innovate Solutions',
      currentDesignation: 'Software Engineer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-08-01',
      relievingDate: '2025-07-31',
      referenceName: 'Alice Johnson',
      referencePhone: '555-987-6543',
      referenceAddress: '456 Elm St',
      referenceEmail: 'alice.j@example.com',
      referenceRole: 'Manager',
      jobPortalAccountName: 'davidw_linkedin',
      jobPortalCredentials: 'password123',
      priority: 'high',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: '6 years experience',
      remote: true,
      salary: '$100,000 - $120,000',
      location: 'Austin, TX',
      position: 'Python Developer',
      company: 'Innovate Solutions',
      resume: 'david_wilson_resume.pdf' // Added resume field
    },
    {
      id: 2, // Corresponds to Sarah J. Unassigned in unassignedClientsData
      name: 'Sarah J. Unassigned',
      firstName: 'Sarah',
      middleName: 'Jane',
      lastName: 'Unassigned',
      dob: '1995-03-20',
      gender: 'Female',
      ethnicity: 'Caucasian',
      address: '789 Oak Avenue, San Jose, CA',
      zipCode: '95123',
      mobile: '555-222-3333',
      email: 'sarah.j.unassigned@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'No',
      workPreference: 'On-site',
      restrictedCompanies: 'Apple Inc.',
      jobsToApply: 'Frontend Developer, React Developer',
      technologySkills: 'React, Node.js, MongoDB, JavaScript',
      currentSalary: '$75,000',
      expectedSalary: '$90,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'San Jose State University',
      schoolAddress: 'San Jose, CA',
      schoolPhone: '408-555-5678',
      courseOfStudy: 'Software Engineering',
      graduationDate: '2017-05-18',
      currentCompany: 'WebSolutions Co.',
      currentDesignation: 'Junior Frontend Developer',
      preferredInterviewTime: 'Afternoon',
      earliestJoiningDate: '2025-09-01',
      relievingDate: '2025-08-31',
      referenceName: 'Bob Williams',
      referencePhone: '555-123-9876',
      referenceAddress: '101 Pine St',
      referenceEmail: 'bob.w@example.com',
      referenceRole: 'Team Lead',
      jobPortalAccountName: 'sarahj_github',
      jobPortalCredentials: 'securepass',
      priority: 'medium',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['React', 'Node.js', 'MongoDB'],
      experience: '4 years experience',
      remote: false,
      salary: '$80,000 - $100,000',
      location: 'San Jose, CA',
      position: 'Frontend Developer',
      company: 'WebSolutions Co.',
      resume: 'sarah_unassigned_resume.docx' // Added resume field
    },
    {
      id: 3, // Corresponds to Michael Brown in unassignedClientsData
      name: 'Michael Brown',
      firstName: 'Michael',
      middleName: '',
      lastName: 'Brown',
      dob: '1998-07-10',
      gender: 'Male',
      ethnicity: 'African American',
      address: '456 River Road, Seattle, WA',
      zipCode: '98101',
      mobile: '555-333-4444',
      email: 'michael.b@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'Yes',
      workPreference: 'Hybrid',
      restrictedCompanies: 'Microsoft',
      jobsToApply: 'Java Developer, Backend Engineer',
      technologySkills: 'Java, Spring Boot, MySQL',
      currentSalary: '$65,000',
      expectedSalary: '$80,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'University of Washington',
      schoolAddress: 'Seattle, WA',
      schoolPhone: '206-555-4321',
      courseOfStudy: 'Computer Science',
      graduationDate: '2020-06-15',
      currentCompany: 'Cloud Innovations',
      currentDesignation: 'Software Developer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-07-20',
      relievingDate: '2025-07-15',
      referenceName: 'Carol White',
      referencePhone: '555-456-7890',
      referenceAddress: '789 Maple Ave',
      referenceEmail: 'carol.w@example.com',
      referenceRole: 'Mentor',
      jobPortalAccountName: 'michaelb_indeed',
      jobPortalCredentials: 'javapass',
      priority: 'low',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['Java', 'Spring Boot'],
      experience: '3 years experience',
      remote: true,
      salary: '$70,000 - $90,000',
      location: 'Seattle, WA',
      position: 'Java Developer',
      company: 'Cloud Innovations',
      resume: 'michael_brown_cv.pdf' // Added resume field
    },
    {
      id: 4, // Corresponds to Emily White in unassignedClientsData
      name: 'Emily White',
      firstName: 'Emily',
      middleName: '',
      lastName: 'White',
      dob: '1993-09-05',
      gender: 'Female',
      ethnicity: 'Asian',
      address: '101 Ocean Drive, Los Angeles, CA',
      zipCode: '90001',
      mobile: '555-444-5555',
      email: 'emily.w@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'No',
      workPreference: 'On-site',
      restrictedCompanies: 'Netflix',
      jobsToApply: 'Frontend Developer, Vue.js Specialist',
      technologySkills: 'Vue.js, Firebase, TypeScript, HTML, CSS',
      currentSalary: '$90,000',
      expectedSalary: '$105,000',
      visaStatus: 'Green Card',
      otherVisaStatus: '',
      schoolName: 'University of Southern California',
      schoolAddress: 'Los Angeles, CA',
      schoolPhone: '213-555-8765',
      courseOfStudy: 'Web Design',
      graduationDate: '2015-05-20',
      currentCompany: 'Creative Digital',
      currentDesignation: 'Frontend Developer',
      preferredInterviewTime: 'Any',
      earliestJoiningDate: '2025-08-10',
      relievingDate: '2025-08-05',
      referenceName: 'David Green',
      referencePhone: '555-789-0123',
      referenceAddress: '222 Hill St',
      referenceEmail: 'david.g@example.com',
      referenceRole: 'Colleague',
      jobPortalAccountName: 'emilyw_behance',
      jobPortalCredentials: 'designpass',
      priority: 'high',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['Vue.js', 'Firebase', 'TypeScript'],
      experience: '5 years experience',
      remote: false,
      salary: '$95,000 - $115,000',
      location: 'Los Angeles, CA',
      position: 'Frontend Developer',
      company: 'Creative Digital',
      resume: 'emily_white_portfolio.pdf' // Added resume field
    },
    {
      id: 5, // Corresponds to Daniel Green in unassignedClientsData
      name: 'Daniel Green',
      firstName: 'Daniel',
      middleName: '',
      lastName: 'Green',
      dob: '1989-11-12',
      gender: 'Male',
      ethnicity: 'Hispanic',
      address: '202 Mountain View, Denver, CO',
      zipCode: '80202',
      mobile: '555-666-7777',
      email: 'daniel.g@example.com',
      securityClearance: 'Yes',
      clearanceLevel: 'Secret',
      willingToRelocate: 'Yes',
      workPreference: 'Remote',
      restrictedCompanies: 'Amazon',
      jobsToApply: 'C# Developer, .NET Engineer',
      technologySkills: 'C#, .NET, SQL Server, Azure',
      currentSalary: '$100,000',
      expectedSalary: '$120,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'University of Colorado Denver',
      schoolAddress: 'Denver, CO',
      schoolPhone: '303-555-9876',
      courseOfStudy: 'Software Engineering',
      graduationDate: '2010-05-25',
      currentCompany: 'Enterprise Solutions',
      currentDesignation: 'Senior Software Engineer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-07-01',
      relievingDate: '2025-06-30',
      referenceName: 'Frank Black',
      referencePhone: '555-000-1111',
      referenceAddress: '333 Valley Rd',
      referenceEmail: 'frank.b@example.com',
      referenceRole: 'CTO',
      jobPortalAccountName: 'danielg_monster',
      jobPortalCredentials: 'dotnetpass',
      priority: 'medium',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['C#', '.NET', 'SQL Server'],
      experience: '7 years experience',
      remote: true,
      salary: '$110,000 - $130,000',
      location: 'Denver, CO',
      position: 'C# Developer',
      company: 'Enterprise Solutions',
      resume: 'daniel_green_resume.pdf' // Added resume field
    },
    {
      id: 6, // Corresponds to Olivia Black in unassignedClientsData
      name: 'Olivia Black',
      firstName: 'Olivia',
      middleName: '',
      lastName: 'Black',
      dob: '1999-02-18',
      gender: 'Female',
      ethnicity: 'Caucasian',
      address: '303 Lake Shore, Chicago, IL',
      zipCode: '60601',
      mobile: '555-888-9999',
      email: 'olivia.b@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'No',
      workPreference: 'On-site',
      restrictedCompanies: 'IBM',
      jobsToApply: 'PHP Developer, Web Developer',
      technologySkills: 'PHP, Laravel, MySQL, JavaScript',
      currentSalary: '$55,000',
      expectedSalary: '$70,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'DePaul University',
      schoolAddress: 'Chicago, IL',
      schoolPhone: '312-555-2222',
      courseOfStudy: 'Web Development',
      graduationDate: '2022-06-10',
      currentCompany: 'Startup Hub',
      currentDesignation: 'Junior Web Developer',
      preferredInterviewTime: 'Afternoon',
      earliestJoiningDate: '2025-09-15',
      relievingDate: '2025-09-10',
      referenceName: 'Grace Lee',
      referencePhone: '555-333-4444',
      referenceAddress: '444 Park Ave',
      referenceEmail: 'grace.l@example.com',
      referenceRole: 'Lead Developer',
      jobPortalAccountName: 'oliviab_upwork',
      jobPortalCredentials: 'phpdev',
      priority: 'low',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['PHP', 'Laravel', 'MySQL'],
      experience: '2 years experience',
      remote: false,
      salary: '$60,000 - $80,000',
      location: 'Chicago, IL',
      position: 'PHP Developer',
      company: 'Startup Hub',
      resume: 'olivia_black_webdev.pdf' // Added resume field
    },
    {
      id: 7, // Corresponds to James Blue in unassignedClientsData
      name: 'James Blue',
      firstName: 'James',
      middleName: '',
      lastName: 'Blue',
      dob: '1987-04-25',
      gender: 'Male',
      ethnicity: 'African American',
      address: '404 Tech Park, San Francisco, CA',
      zipCode: '94107',
      mobile: '555-000-1111',
      email: 'james.b@example.com',
      securityClearance: 'Yes',
      clearanceLevel: 'Top Secret',
      willingToRelocate: 'Yes',
      workPreference: 'Hybrid',
      restrictedCompanies: 'Google',
      jobsToApply: 'DevOps Engineer, Go Developer',
      technologySkills: 'Go, Docker, Kubernetes, AWS, CI/CD',
      currentSalary: '$115,000',
      expectedSalary: '$135,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'Stanford University',
      schoolAddress: 'Stanford, CA',
      schoolPhone: '650-555-5555',
      courseOfStudy: 'Computer Engineering',
      graduationDate: '2009-06-10',
      currentCompany: 'Cloud Native Corp',
      currentDesignation: 'DevOps Lead',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-08-01',
      relievingDate: '2025-07-31',
      referenceName: 'Henry Red',
      referencePhone: '555-678-9012',
      referenceAddress: '555 Tech Rd',
      referenceEmail: 'henry.r@example.com',
      referenceRole: 'Director of Engineering',
      jobPortalAccountName: 'jamesb_stack',
      jobPortalCredentials: 'godevops',
      priority: 'high',
      status: 'unassigned',
      assignedTo: 'N/A',
      assignedDate: 'N/A',
      skills: ['Go', 'Docker', 'Kubernetes'],
      experience: '8 years experience',
      remote: true,
      salary: '$120,000 - $140,000',
      location: 'San Francisco, CA',
      position: 'DevOps Engineer',
      company: 'Cloud Native Corp',
      resume: 'james_blue_devops.pdf' // Added resume field
    },
    {
      id: 201, // Corresponds to John Anderson in assignedClients
      name: 'John Anderson',
      firstName: 'John',
      middleName: '',
      lastName: 'Anderson',
      dob: '1990-05-15',
      gender: 'Male',
      ethnicity: 'Caucasian',
      address: '123 Main St, San Francisco, CA',
      zipCode: '94105',
      mobile: '123-456-7890',
      email: 'john.anderson@example.com',
      securityClearance: 'Yes',
      clearanceLevel: 'Top Secret',
      willingToRelocate: 'Yes',
      workPreference: 'Hybrid',
      restrictedCompanies: 'None',
      jobsToApply: 'Frontend, Fullstack',
      technologySkills: 'React, JavaScript, HTML, CSS, Node.js',
      currentSalary: '$110,000',
      expectedSalary: '$130,000',
      visaStatus: 'H1B',
      otherVisaStatus: '',
      schoolName: 'University of California, Berkeley',
      schoolAddress: 'Berkeley, CA',
      schoolPhone: '555-123-4567',
      courseOfStudy: 'Computer Science',
      graduationDate: '2012-05-20',
      currentCompany: 'WebTech Solutions',
      currentDesignation: 'Senior Frontend Developer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-08-01',
      relievingDate: '2025-07-31',
      referenceName: 'Jane Smith',
      referencePhone: '555-987-6543',
      referenceAddress: '456 Oak Ave',
      referenceEmail: 'jane.smith@example.com',
      referenceRole: 'Manager',
      jobPortalAccountName: 'john.anderson.linkedin',
      jobPortalCredentials: 'encrypted_password_123',
      priority: 'high', // Added for consistency with other client data
      status: 'interview', // Added for consistency with other client data
      assignedTo: 'Vyshnavi Vysh', // Added for consistency with other client data
      assignedDate: '2024-11-15', // Added for consistency with other client data
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'], // Added for consistency
      experience: '8 years experience', // Added for consistency
      location: 'San Francisco, CA', // Added for consistency
      salary: '$120,000 - $150,000', // Added for consistency
      position: 'Senior Frontend Developer', // Added for consistency
      company: 'TechFlow Inc', // Added for consistency
      round: '1st Round', // Example for interview data
      date: '2025-07-08', // Example for interview data
      resume: 'john_anderson_resume.pdf' // Added resume field
    },
    {
      id: 205, // Corresponds to Alex Thompson in assignedClients
      name: 'Alex Thompson',
      firstName: 'Alex',
      middleName: '',
      lastName: 'Thompson',
      dob: '1991-08-20',
      gender: 'Male',
      ethnicity: 'Caucasian',
      address: '456 Elm St, Boston, MA',
      zipCode: '02108',
      mobile: '555-123-4567',
      email: 'alex.t@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'Yes',
      workPreference: 'Hybrid',
      restrictedCompanies: '',
      jobsToApply: 'Full Stack, Backend',
      technologySkills: 'Node.js, Express, PostgreSQL, React',
      currentSalary: '$105,000',
      expectedSalary: '$130,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'MIT',
      schoolAddress: 'Cambridge, MA',
      schoolPhone: '555-987-6543',
      courseOfStudy: 'Computer Science',
      graduationDate: '2013-05-30',
      currentCompany: 'StartupXYZ',
      currentDesignation: 'Full Stack Developer',
      preferredInterviewTime: 'Any',
      earliestJoiningDate: '2025-08-15',
      relievingDate: '2025-08-10',
      referenceName: 'Mark Johnson',
      referencePhone: '555-333-2222',
      referenceAddress: '123 Pine St',
      referenceEmail: 'mark.j@example.com',
      referenceRole: 'Colleague',
      jobPortalAccountName: 'alex.linkedin',
      jobPortalCredentials: 'password_abc',
      priority: 'medium',
      status: 'applied',
      assignedTo: 'Vyshnavi Vysh',
      assignedDate: '2024-11-20',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'React'],
      experience: '7 years experience',
      remote: false,
      salary: '$110,000 - $140,000',
      location: 'Boston, MA',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      round: '2nd Round',
      date: '2025-07-06',
      resume: 'alex_thompson_resume.pdf' // Added resume field
    },
    {
      id: 208, // Corresponds to Maria Rodriguez in assignedClients
      name: 'Maria Rodriguez',
      firstName: 'Maria',
      middleName: '',
      lastName: 'Rodriguez',
      dob: '1993-02-28',
      gender: 'Female',
      ethnicity: 'Hispanic',
      address: '789 Oak Ave, Denver, CO',
      zipCode: '80202',
      mobile: '777-888-9999',
      email: 'maria.r@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'No',
      workPreference: 'On-site',
      restrictedCompanies: 'Google',
      jobsToApply: 'Frontend, UI Developer',
      technologySkills: 'React, Redux, JavaScript, CSS',
      currentSalary: '$90,000',
      expectedSalary: '$110,000',
      visaStatus: 'Green Card',
      otherVisaStatus: '',
      schoolName: 'University of Colorado Denver',
      schoolAddress: 'Denver, CO',
      schoolPhone: '555-666-7777',
      courseOfStudy: 'Web Development',
      graduationDate: '2015-05-15',
      currentCompany: 'WebDev Inc',
      currentDesignation: 'React Developer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-09-01',
      relievingDate: '2025-08-31',
      referenceName: 'Carlos Sanchez',
      referencePhone: '555-111-0000',
      referenceAddress: '321 Cedar St',
      referenceEmail: 'carlos.s@example.com',
      referenceRole: 'Team Lead',
      jobPortalAccountName: 'maria.webdev',
      jobPortalCredentials: 'secure_password',
      priority: 'high',
      status: 'applied',
      assignedTo: 'Vyshnavi Vysh',
      assignedDate: '2024-11-28',
      skills: ['React', 'Redux', 'JavaScript', 'CSS'],
      experience: '6 years experience',
      remote: false,
      salary: '$95,000 - $115,000',
      location: 'Denver, CO',
      jobTitle: 'React Developer',
      company: 'WebDev Inc',
      round: '2nd Round',
      date: '2025-07-11',
      resume: 'maria_rodriguez_cv.pdf' // Added resume field
    },
    {
      id: 209, // Corresponds to Chris Evans in assignedClients
      name: 'Chris Evans',
      firstName: 'Chris',
      middleName: '',
      lastName: 'Evans',
      dob: '1985-10-01',
      gender: 'Male',
      ethnicity: 'Caucasian',
      address: '888 Beachfront, Miami, FL',
      zipCode: '33101',
      mobile: '555-123-0000',
      email: 'chris.e@example.com',
      securityClearance: 'Yes',
      clearanceLevel: 'Secret',
      willingToRelocate: 'No',
      workPreference: 'Remote',
      restrictedCompanies: 'None',
      jobsToApply: 'DevOps, Cloud Engineer',
      technologySkills: 'Docker, Kubernetes, AWS, Azure, CI/CD',
      currentSalary: '$125,000',
      expectedSalary: '$145,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'University of Florida',
      schoolAddress: 'Gainesville, FL',
      schoolPhone: '352-555-1234',
      courseOfStudy: 'Computer Engineering',
      graduationDate: '2007-05-10',
      currentCompany: 'CloudOps Solutions',
      currentDesignation: 'DevOps Engineer',
      preferredInterviewTime: 'Morning',
      earliestJoiningDate: '2025-08-15',
      relievingDate: '2025-08-10',
      referenceName: 'Tony Stark',
      referencePhone: '555-999-8888',
      referenceAddress: '1000 Avengers Tower',
      referenceEmail: 'tony.s@example.com',
      referenceRole: 'CEO',
      jobPortalAccountName: 'chrise_devops',
      jobPortalCredentials: 'cloudpass',
      priority: 'high',
      status: 'interview',
      assignedTo: 'Vyshnavi Vysh',
      assignedDate: '2024-12-01',
      skills: ['DevOps', 'Kubernetes', 'AWS'],
      experience: '10 years experience',
      remote: true,
      salary: '$130,000 - $150,000',
      location: 'Miami, FL',
      jobTitle: 'DevOps Engineer',
      company: 'CloudOps',
      resume: 'chris_evans_devops.pdf' // Added resume field
    },
    {
      id: 210, // Corresponds to Anna Lee in assignedClients
      name: 'Anna Lee',
      firstName: 'Anna',
      middleName: '',
      lastName: 'Lee',
      dob: '1994-07-07',
      gender: 'Female',
      ethnicity: 'Asian',
      address: '999 Data Way, Portland, OR',
      zipCode: '97201',
      mobile: '555-333-1111',
      email: 'anna.l@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'Yes',
      workPreference: 'Hybrid',
      restrictedCompanies: 'None',
      jobsToApply: 'Data Scientist, Machine Learning Engineer',
      technologySkills: 'Python, R, SQL, Machine Learning, TensorFlow',
      currentSalary: '$110,000',
      expectedSalary: '$140,000',
      visaStatus: 'US Citizen',
      otherVisaStatus: '',
      schoolName: 'Oregon State University',
      schoolAddress: 'Corvallis, OR',
      schoolPhone: '541-555-2222',
      courseOfStudy: 'Data Science',
      graduationDate: '2016-06-10',
      currentCompany: 'Data Insights',
      currentDesignation: 'Data Scientist',
      preferredInterviewTime: 'Afternoon',
      earliestJoiningDate: '2025-09-01',
      relievingDate: '2025-08-31',
      referenceName: 'Peter Jones',
      referencePhone: '555-444-5555',
      referenceAddress: '111 Analytics Ave',
      referenceEmail: 'peter.j@example.com',
      referenceRole: 'Lead Data Scientist',
      jobPortalAccountName: 'annal_kaggle',
      jobPortalCredentials: 'datapass',
      priority: 'medium',
      status: 'applied',
      assignedTo: 'Vyshnavi Vysh',
      assignedDate: '2024-12-03',
      skills: ['Data Science', 'Python', 'Machine Learning'],
      experience: '6 years experience',
      remote: false,
      salary: '$115,000 - $145,000',
      location: 'Portland, OR',
      jobTitle: 'Data Scientist',
      company: 'DataInsights',
      resume: 'anna_lee_data_scientist.pdf' // Added resume field
    },
  ]);


  // Effect to update userAvatarLetter when userName changes (if it were dynamic)
  useEffect(() => {
    if (userName) {
      setUserAvatarLetter(userName.charAt(0).toUpperCase());
    }
  }, [userName]);

  // Effect to apply the theme class to the body and save to local storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    console.log('Current theme:', theme); // Debugging: log theme changes
  }, [theme]);

  // Effect to freeze/unfreeze background scrolling based on any modal being open
  useEffect(() => {
    if (isUnassignedClientsModalOpen || isAssignClientModalOpen || isTotalClientsModalOpen || isEmployeeClientsModalOpen || isClientPreviewModalOpen || isReassignClientModalOpen || isEditClientModalOpen || isNotificationsModalOpen || isUserProfileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // Reset to default
    }
    // Cleanup function to ensure overflow is reset when component unmounts or modals close
    return () => {
      document.body.style.overflow = '';
    };
  }, [isUnassignedClientsModalOpen, isAssignClientModalOpen, isTotalClientsModalOpen, isEmployeeClientsModalOpen, isClientPreviewModalOpen, isReassignClientModalOpen, isEditClientModalOpen, isNotificationsModalOpen, isUserProfileModalOpen]);

  // Effect to handle clicks outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);



  // Effect to calculate application counts per client
  useEffect(() => {
    const counts = {};
    applicationData.forEach(app => {
      counts[app.clientName] = (counts[app.clientName] || 0) + 1;
    });
    setClientApplicationCounts(counts);
  }, [applicationData]);


  // NEW: Effect to update employee assigned client counts whenever assignedClients changes
  // ADD THIS NEW useEffect TO PROCESS AND COMBINE ALL EMPLOYEE DATA
  useEffect(() => {
    // 1. Create a map of client counts for efficient lookup
    const clientCounts = assignedClients.reduce((acc, client) => {
      acc[client.assignedTo] = (acc[client.assignedTo] || 0) + 1;
      return acc;
    }, {});

    // 2. Enrich the master employee list with the calculated data
    const enrichedEmployees = allEmployees.map(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`;

      // 3. Provide a fallback success rate if one doesn't exist
      const successRate = emp.successRate || Math.floor(75 + Math.random() * 20); // Random rate between 75-95

      return {
        ...emp,
        fullName: fullName,
        assignedClients: clientCounts[fullName] || 0, // Get count from the map
        successRate: successRate,
        avatar: emp.avatar || getInitials(fullName), // Use existing avatar or fallback to initials
      };
    });

    setDisplayEmployees(enrichedEmployees);

  }, [allEmployees, assignedClients]); // This effect re-runs when the source data changes

  // Add this new state variable for the employee selection modal
  const [isEmployeeSelectModalOpen, setIsEmployeeSelectModalOpen] = useState(false);


  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    setActiveTab(event.target.value);
    console.log('Active tab set to:', event.target.value); // Debugging: log tab changes
  };

  // Function to open the Unassigned Clients modal
  const openUnassignedClientsModal = () => {
    setIsUnassignedClientsModalOpen(true);
  };

  // Function to close the Unassigned Clients modal
  const closeUnassignedClientsModal = () => {
    setIsUnassignedClientsModalOpen(false);
    // Reset filter and search when closing the modal
    setFilterPriority('all');
    setUnassignedSearchQuery('');
  };

  // Handler for priority filter change in Unassigned Clients modal
  const handleFilterPriorityChange = (event) => {
    setFilterPriority(event.target.value);
  };

  // Handler for search input change in Unassigned Clients modal
  const handleUnassignedSearchChange = (event) => {
    setUnassignedSearchQuery(event.target.value);
  };

  // Filter clients based on selected priority AND search query
  const filteredClients = unassignedClients.filter(client => {
    const matchesPriority = filterPriority === 'all' || client.priority === filterPriority;
    const lowerCaseSearchQuery = unassignedSearchQuery.toLowerCase();

    // NEW: Added checks (e.g., client.name || '') to prevent errors if a property is missing.
    const matchesSearch =
      (client.name || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (client.skills || []).some(skill => (skill || '').toLowerCase().includes(lowerCaseSearchQuery)) ||
      (client.experience || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (client.email || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (client.salary || '').toLowerCase().includes(lowerCaseSearchQuery);

    return matchesPriority && matchesSearch;
  });

  // Function to open the Assign Client to Employee modal (for NEW assignments)
  const openAssignClientModal = (client) => {
    setSelectedClientToAssign(client);
    // Reset employee and notes when opening for a new assignment
    setSelectedEmployee('');
    setAssignmentPriority(client.priority || 'medium'); // Pre-fill with client's priority
    setAssignmentNotes('');
    setIsAssignClientModalOpen(true);
  };

  // Function to close the Assign Client to Employee modal (for NEW assignments)
  const closeAssignClientModal = () => {
    setIsAssignClientModalOpen(false);
    setSelectedClientToAssign(null); // Clear selected client
  };

  // Function to open the Reassign Client modal
  const openReassignClientModal = (client) => {
    setClientToReassign(client);
    setSelectedEmployee(''); // Reset selected employee for the new modal
    setAssignmentPriority(client.priority || 'medium'); // Pre-fill with client's priority
    setAssignmentNotes('');
    setIsReassignClientModalOpen(true);
  };

  // Function to close the Reassign Client modal
  const closeReassignClientModal = () => {
    setIsReassignClientModalOpen(false);
    setClientToReassign(null);
    setSelectedEmployee(''); // Clear selected employee
    setAssignmentPriority('medium'); // Reset priority
    setAssignmentNotes(''); // Reset notes
  };


  // Handler for "Assign Client" or "Reassign Client" button submission
  const handleAssignmentSubmit = async () => {
  const clientToProcess = clientToReassign || selectedClientToAssign;
    
   if (!clientToProcess || !selectedEmployee || !clientToProcess.clientFirebaseKey || !clientToProcess.registrationKey) {
      alert('Error: Missing client, employee, or necessary keys to complete the assignment.');
      return;
    }

     const employeeInfo = allEmployees.find(emp => emp.firebaseKey === selectedEmployee);
  
    // --- ADD THIS SAFETY CHECK ---
    if (!employeeInfo) {
      alert('Error: Could not find the selected employee. Please try again.');
      return;
    }

   
   
    const employeeFullName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
    const registrationRef = ref(database, `clients/${clientToProcess.clientFirebaseKey}/serviceRegistrations/${clientToProcess.registrationKey}`);


    // Create a comprehensive client object with all necessary fields for the manager's view
    const updates = {
      assignedTo: employeeFullName,
      assignmentStatus: 'pending_acceptance', // Status for the manager's "Total assigned Clients" view
      assignedDate: new Date().toISOString().split('T')[0],
      priority: assignmentPriority, // Add priority from the modal's state
      // Add additional fields for consistent display in the "Total assigned Clients" table
      // clientName: clientToProcess.name || `${clientToProcess.firstName} ${clientToProcess.lastName}`,
      // position: clientToProcess.jobsApplyFor || 'Not specified',
      // salary: clientToProcess.expectedSalary ? `$${clientToProcess.currentSalary} - $${clientToProcess.expectedSalary}` : 'Not specified',
      // company: clientToProcess.currentCompany || 'Not specified',
      // location: clientToProcess.address ? clientToProcess.address.split(',').slice(-2).join(', ').trim() : 'Not specified',
    };
    try {
      await update(registrationRef, updates);

      // --- THE BLOCK OF CODE THAT SENT CLIENTS TO THE EMPLOYEE'S LOCALSTORAGE HAS BEEN REMOVED FROM HERE ---
      
      setSuccessMessage(`Successfully assigned ${clientToProcess.firstName} to ${employeeFullName}.`);
      setShowSuccessModal(true);
      
    if (clientToReassign) closeReassignClientModal();
      else closeAssignClientModal();

    } catch (error) {
        console.error("Firebase update failed:", error);
        alert("Failed to assign client. Please try again.");
    }
  };

  // Handler for "Quick Assign" button
  const handleQuickAssign = () => {
    if (filteredClients.length > 0) {
      openAssignClientModal(filteredClients[0]); // Open with the first filtered client
    } else {
      console.error('No clients available to quick assign. Please add clients or adjust filters.');
    }
  };

  // Function to open the Total Clients modal
  const openTotalClientsModal = () => {
    setIsTotalClientsModalOpen(true);
  };

  // Function to close the Total Clients modal
  const closeTotalClientsModal = () => {
    setIsTotalClientsModalOpen(false);
  };

  // NEW: Function to open Employee Clients Detail Modal
  const openEmployeeClientsModal = (employee) => {
    setSelectedEmployeeForClients(employee);
    setIsEmployeeClientsModalOpen(true);
  };

  // NEW: Function to close Employee Clients Detail Modal
  const closeEmployeeClientsModal = () => {
    setIsEmployeeClientsModalOpen(false);
    setSelectedEmployeeForClients(null);
  };

  // Handlers for Interviews tab search and filter
  const handleInterviewSearchChange = (event) => {
    setInterviewSearchQuery(event.target.value);
  };

  const handleInterviewFilterRoundChange = (event) => {
    setInterviewFilterRound(event.target.value);
  };

const filteredInterviewData = interviewData.filter(interview => {
    const lowerCaseSearchQuery = interviewSearchQuery.toLowerCase();
    const matchesSearch = 
      (interview.assignedTo || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (interview.clientName || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (interview.jobTitle || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (interview.company || '').toLowerCase().includes(lowerCaseSearchQuery);
      
    const matchesRound = interviewFilterRound === 'All Rounds' || interview.round === interviewFilterRound;

    const interviewDate = new Date(interview.interviewDate);
    const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
    const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;
    if(start) start.setHours(0,0,0,0);
    if(end) end.setHours(23,59,59,999);
    const matchesDateRange = (!start || interviewDate >= start) && (!end || interviewDate <= end);

    return matchesSearch && matchesRound && matchesDateRange;
  }).sort((a, b) => {
      const dateA = new Date(a.interviewDate);
      const dateB = new Date(b.interviewDate);
      if (sortOrder === 'Newest First') return dateB - dateA;
      if (sortOrder === 'Oldest First') return dateA - dateB;
      // Add other sort options if needed
      return 0;
  });


  // Handlers for Applications tab search and filter
  const handleApplicationSearchChange = (event) => {
    setApplicationSearchQuery(event.target.value);
  };

  const handleApplicationFilterEmployeeChange = (event) => {
    setApplicationFilterEmployee(event.target.value);
  };

  // NEW: Handler for client filter change in Applications tab
  const handleApplicationFilterClientChange = (event) => {
    setApplicationFilterClient(event.target.value);
  };

  // NEW: Handlers for date range filters
  const handleStartDateFilterChange = (event) => {
    setStartDateFilter(event.target.value);
  };

  const handleEndDateFilterChange = (event) => {
    setEndDateFilter(event.target.value);
  };


  const filteredApplicationData = applicationData.filter(app => {
    const lowerCaseSearchQuery = applicationSearchQuery.toLowerCase();
    const matchesSearch = 
      (app.assignedTo || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (app.clientName || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (app.jobTitle || '').toLowerCase().includes(lowerCaseSearchQuery) ||
      (app.company || '').toLowerCase().includes(lowerCaseSearchQuery);
      
    const matchesEmployee = applicationFilterEmployee === '' || app.assignedTo === applicationFilterEmployee;
    const matchesClient = applicationFilterClient === '' || app.clientName === applicationFilterClient;

    const appDate = new Date(app.appliedDate);
    const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
    const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;
    if(start) start.setHours(0,0,0,0);
    if(end) end.setHours(23,59,59,999);
    const matchesDateRange = (!start || appDate >= start) && (!end || appDate <= end);
    
    return matchesSearch && matchesEmployee && matchesClient && matchesDateRange;
  }).sort((a, b) => {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);
      if (sortOrder === 'Newest First') return dateB - dateA;
      if (sortOrder === 'Oldest First') return dateA - dateB;
      if (sortOrder === 'Job Title A-Z') return (a.jobTitle || '').localeCompare(b.jobTitle || '');
      if (sortOrder === 'Company A-Z') return (a.company || '').localeCompare(b.company || '');
      return 0;
  });

  // Get unique client names for the filter dropdown - NOW ONLY FROM ASSIGNED CLIENTS
  const uniqueAssignedClientNames = [...new Set(assignedClients.map(client => client.clientName))];

  // Determine if any filter is active for the "Applications" tab
  const isApplicationFilterActive = applicationSearchQuery !== '' || applicationFilterEmployee !== '' || applicationFilterClient !== '' || startDateFilter !== '' || endDateFilter !== '';

  // Function to clear all filters for the "Applications" tab
  const handleClearApplicationFilters = () => {
    setApplicationSearchQuery('');
    setApplicationFilterEmployee('');
    setApplicationFilterClient('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Handler for Assigned Employees search bar
  const handleAssignedEmployeeSearchChange = (event) => {
    setAssignedEmployeeSearchQuery(event.target.value);
  };

  // Filtered employees for the "Assigned" tab
  const filteredEmployees = displayEmployees.filter(employee => {

    if (!employee || !employee.fullName) {
      return false; 
    }

    const hasEmployeeRole = employee.roles && employee.roles.includes('employee');
    const fullName = employee.fullName.toLowerCase();
    const lowerCaseSearchQuery = assignedEmployeeSearchQuery.toLowerCase();
    const matchesSearch = fullName.includes(lowerCaseSearchQuery);
    return hasEmployeeRole && matchesSearch;
  });

   const [employeesForAssignment, setEmployeesForAssignment] = useState([]);


  // NEW: Function to open Client Preview/Edit Modal
  const openEditClientModal = (clientObject) => {
    // Find the comprehensive client data
    // const client = mockDetailedClientsData.find(c => c.name === clientName || c.clientName === clientName);

    if (clientObject) {
      setClientToEdit({ ...clientObject }); // Create a copy for editing
      setIsEditingClient(false); // Set to read-only initially
      setIsEditClientModalOpen(true);
      setLlmResponse(''); // Clear previous LLM response
    } else {
      console.warn(`Client with name not found for editing.`);
      alert(`Client details for are not available for editing.`);
    }
  };

  // NEW: Function to close Client Preview/Edit Modal
  const closeEditClientModal = () => {
    setIsEditClientModalOpen(false);
    setClientToEdit(null);
    setIsEditingClient(false); // Reset edit mode on close
    setLlmResponse(''); // Clear LLM response on close
  };

  // NEW: Handle changes in the edit client form
  const handleEditClientChange = (e) => {
    const { name, value } = e.target;

    // Special handling for skills, which should be an array
    if (name === 'technologySkills') {
      setClientToEdit(prev => ({
        ...prev,
        [name]: value.split(',').map(skill => skill.trim())
      }));
    } else {
      setClientToEdit(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // NEW: Handle updating client details
 const handleUpdateClient = async () => {
    // 1. Check for the correct keys to ensure we can save.
    if (!clientToEdit || !clientToEdit.clientFirebaseKey || !clientToEdit.registrationKey) {
      console.error("Cannot update: missing client or registration key.");
      alert("An error occurred while trying to save client details.");
      return;
    }

    // 2. Separate the data: some fields belong to the main client profile,
    //    and the rest belong to the specific service registration.
    const {
        clientFirebaseKey,
        registrationKey,
        // Parent client fields
        firstName,
        lastName,
        email,
        mobile,
        // The rest of the data is for the registration
        ...registrationData
    } = clientToEdit;

    // 3. Define the two paths we need to update in Firebase.
    const registrationRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`);
    const clientProfileRef = ref(database, `clients/${clientFirebaseKey}`);

    // 4. Prepare the objects for the two separate updates.
    const profileUpdate = {
        firstName,
        lastName,
        email,
        mobile
    };

    try {
        // 5. Perform both updates: one for the registration and one for the main profile.
        await update(registrationRef, registrationData);
        await update(clientProfileRef, profileUpdate);

        setSuccessMessage(`Successfully updated details for ${firstName} ${lastName}.`);
        setShowSuccessModal(true);
        setIsEditingClient(false); // Switch back to view mode
        closeEditClientModal(); // Close the modal on success
    } catch (error) {
        console.error("Failed to update client details:", error);
        alert("Error updating client details.");
    }
  };

  // NEW: Function to handle resume download
  const handleResumeDownload = (resumeFileName) => {
    if (resumeFileName) {
      alert(`Simulating download for: ${resumeFileName}\n(In a real application, this would trigger a file download.)`);
      // In a real application, you would typically have a backend endpoint
      // that serves the file, and you would trigger a download like this:
      // window.open(`/api/download-resume/${resumeFileName}`, '_blank');
      // Or if it's a direct URL to a static asset:
      // window.open(`/assets/resumes/${resumeFileName}`, '_blank');
    } else {
      alert('No resume file available for this client.');
    }
  };

  // NEW: Function to call LLM for client summary
  const generateClientSummary = async () => {
    if (!clientToEdit) return;

    setIsLoadingLLMResponse(true);
    setLlmResponse(''); // Clear previous response

    const prompt = `Generate a concise summary for the following client profile, highlighting key skills, experience, job preferences, and any notable information relevant for a placement specialist. Focus on what makes this candidate suitable for a role.

Client Name: ${clientToEdit.name || clientToEdit.clientName}
Experience: ${clientToEdit.experience}
Skills: ${Array.isArray(clientToEdit.skills) ? clientToEdit.skills.join(', ') : clientToEdit.skills}
Jobs to Apply: ${clientToEdit.jobsToApply}
Work Preference: ${clientToEdit.workPreference}
Current Company: ${clientToEdit.currentCompany}
Current Designation: ${clientToEdit.currentDesignation}
Expected Salary: ${clientToEdit.expectedSalary}
Visa Status: ${clientToEdit.visaStatus}
Security Clearance: ${clientToEdit.securityClearance} ${clientToEdit.securityClearance === 'Yes' ? `(${clientToEdit.clearanceLevel})` : ''}
Willing to Relocate: ${clientToEdit.willingToRelocate}
Priority: ${clientToEdit.priority}

Please provide a summary no longer than 150 words.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setLlmResponse(text);
      } else {
        setLlmResponse('Failed to generate summary. Please try again.');
        console.error('Gemini API response was unexpected:', result);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setLlmResponse('Error generating summary. Please check your network or try again later.');
    } finally {
      setIsLoadingLLMResponse(false);
    }
  };


  // Calculate priority counts for the modal header based on current unassignedClients state
  const highPriorityCount = unassignedClients.filter(client => client.priority === 'high').length;
  const mediumPriorityCount = unassignedClients.filter(client => client.priority === 'medium').length;
  const lowPriorityCount = unassignedClients.filter(client => client.priority === 'low').length;
  const totalUnassignedCount = unassignedClients.length;
  // totalClientsCount now dynamically reflects current assigned clients ONLY
  const totalClientsCount = assignedClients.length;

  // Calculate total assigned clients from employees data for the "Assigned" tab header
  const totalAssignedClientsByEmployee = displayEmployees.reduce((sum, emp) => sum + (emp.assignedClients || 0), 0);; // Ensure it handles undefined assignedClients


  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prevState => !prevState);
  };

  // NEW: Function to open Notifications Modal
  const openNotificationsModal = () => {
    setIsNotificationsModalOpen(true);
  };

  // NEW: Function to close Notifications Modal
  const closeNotificationsModal = () => {
    setIsNotificationsModalOpen(false);
  };

  // NEW: Function to open User Profile Modal
  const openUserProfileModal = () => {
    setEditableProfile({ ...userProfile }); // Initialize editable profile with current user data
    setIsEditingUserProfile(false); // Set to read-only initially
    setIsUserProfileModalOpen(true);
    setIsProfileDropdownOpen(false); // Close dropdown when modal opens
  };

  // NEW: Function to close User Profile Modal
  const closeUserProfileModal = () => {
    setIsUserProfileModalOpen(false);
    setIsEditingUserProfile(false); // Reset edit mode on close
  };

  // NEW: Handle changes in the editable profile form
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NEW: Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!userProfile.firebaseKey) {
        alert("Error: Cannot update profile. User key is missing.");
        return;
    }
    try {
        const userRef = ref(database, `employees/${userProfile.firebaseKey}`);
        await update(userRef, editableProfile);

        // Update local state and session storage
        setUserProfile(editableProfile);
        setUserName(editableProfile.name); // Also update the display name
        sessionStorage.setItem('loggedInEmployee', JSON.stringify(editableProfile));
        
        setIsEditingUserProfile(false);
        alert('Profile updated successfully!');
    } catch (error) {
        console.error("Error updating profile in Firebase:", error);
        alert("Failed to update profile. Please try again.");
    }
  };

  const handleProfileClick = () => {
    console.log('View Profile clicked');
    openUserProfileModal(); // Open the new user profile modal
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsProfileDropdownOpen(false);
    // Add navigation to settings page or open settings modal
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsProfileDropdownOpen(false);
    // Implement logout logic (e.g., clear session, redirect to login)
    window.location.href = '/'; // Redirect to home page on logout
  };

  // --- NEW Component for the Applications Tab UI ---
 const ApplicationsTab = ({ 
    applicationData, 
    employees,
    filterDateRange,
    handleDateRangeChange,
    sortOrder,
    setSortOrder,
    quickFilter,
    handleQuickFilterChange,
    areFiltersActive,
    handleClearFilters
  }) => {
  const [expandedClient, setExpandedClient] = useState(null);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return name.substring(0, 2);
  };

  const groupedByClient = applicationData.reduce((acc, app) => {
    if (!acc[app.clientName]) {
      acc[app.clientName] = {
        apps: [],
        employeeName: app.assignedTo,
      };
    }
    acc[app.clientName].apps.push(app);
    return acc;
  }, {});

  return (
    <section className="applications-management-section">
      <h2 className="client-assignment-title">Client Applications</h2>
       <FilterComponent
              filterDateRange={filterDateRange}
              handleDateRangeChange={handleDateRangeChange}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              quickFilter={quickFilter}
              handleQuickFilterChange={handleQuickFilterChange}
              areFiltersActive={areFiltersActive}
              handleClearFilters={handleClearFilters}
              sortOptions={['Newest First', 'Oldest First', 'Job Title A-Z', 'Company A-Z']}
            />
      <div className="table-responsive">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Client</th>
              <th>Job Title</th>
              <th>Total Applications</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByClient).map(([clientName, data]) => {
              const employee = employees.find(e => e.fullName === data.employeeName);
              const isExpanded = expandedClient === clientName;
              return (
                <React.Fragment key={clientName}>
                  <tr onClick={() => setExpandedClient(isExpanded ? null : clientName)} style={{ cursor: 'pointer' }}>
                    <td className="employee-cell">
                      <div className="employee-avatar">{employee ? employee.avatar : '??'}</div>
                      {data.employeeName}
                    </td>
                    <td>{clientName}</td>
                    <td>{data.apps[0]?.jobTitle}</td>
                    <td style={{ textAlign: 'center' }}>{data.apps.length}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}>⋁</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="5" style={{ padding: '0 15px', backgroundColor: 'var(--bg-color)' }}>
                        <div style={{ padding: '15px', border: '1px solid var(--header-border-color)', borderRadius: '8px', margin: '10px 0' }}>
                          <table className="applications-table" style={{ minWidth: 'auto' }}>
                            <thead>
                              <tr>
                                <th>Company</th>
                                <th>Platform</th>
                                <th>Job ID</th>
                                <th>Link</th>
                                <th>Applied Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.apps.map(app => (
                                <tr key={app.id}>
                                  <td>{app.company}</td>
                                  <td>{app.platform}</td>
                                  <td>{app.jobId}</td>
                                  <td><a href={app.jobUrl} target="_blank" rel="noopener noreferrer">Link</a></td>
                                  <td>{formatDateToDDMMYYYY(app.appliedDate)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};


  return (
    <div className="manager-dashboard-container">
      {/* Font Awesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
          /* Light Theme Colors (Default) */
          --bg-color: #f8f9fa;
          --text-color: #333;
          --header-border-color: #e0e0e0;
          --card-bg: #ffffff;
          --card-shadow: rgba(0, 0, 0, 0.08);
          --card-hover-shadow: rgba(0, 0, 0, 0.12);
          --button-hover-bg: #e9ecef;
          --icon-color: #6c757d;
          --tab-button-color: #6c757d;
          --tab-button-hover-bg: #f1f3f5;
          --tab-button-active-bg: #e9ecef;
          --tab-button-active-color: #212529;
          --member-border-color: #f1f3f5;
          --employee-count-bg: #e9ecef;
          --employee-count-color: #6c757d;
          --activity-subtitle-color: #868e96;
          --main-title-color: #212529;
          --subtitle-color: #6c757d;
          --user-profile-shadow: rgba(0, 0, 0, 0.08);
          --user-profile-bg: #ffffff;
          --user-name-color: #343a40;
          --user-role-color: #868e96;
          --user-avatar-bg: #343a40;
          --user-avatar-color: #ffffff;
          --manager-badge-bg: #f3e8ff;
          --manager-badge-color: #6f42c1;
          --notification-badge-bg: #dc3545;
          --notification-badge-border: #ffffff;
          --card-title-color: #6c757d;
          --card-value-color: #212529;
          --card-description-color: #868e96;
          --card-icon-blue-bg: #e7f5ff;
          --card-icon-blue-color: #007bff;
          --card-icon-green-bg: #e6ffed;
          --card-icon-green-color: #28a745;
          --card-icon-orange-bg: #fff4e6;
          --card-icon-orange-color: #fd7e14;
          --card-icon-purple-bg: #f3e8ff;
          --card-icon-purple-color: #6f42c1;
          --success-rate-green: #28a745;
          --section-header-color: #212529;
          --section-header-icon-color: #6c757d;
          --red-icon-color: #dc3545;
          --action-button-border: #ced4da;
          --action-button-color: #495057;
          --action-button-bg: #ffffff;
          --action-button-hover-bg: #f1f3f5;
          --action-button-hover-border: #adb5bd;
          --attention-item-color: #495057;
          --attention-badge-bg: #f8d7da;
          --attention-badge-color: #721c24;
          --attention-badge-gray-bg: #e9ecef;
          --attention-badge-gray-color: #495057;
          --performance-value-color: #343a40;
          --member-avatar-bg-default: #e7f5ff;
          --member-avatar-color-default: #007bff;
          --member-avatar-bg-employee: #e0e7ff;
          --member-avatar-color-employee: #4338ca;
          --status-badge-excellent-bg: #d4edda;
          --status-badge-excellent-color: #155724;
          --status-badge-good-bg: #cce5ff;
          --status-badge-good-color: #004085;

          /* Application Status Badges */
          --status-interview-bg: #f3e8ff;
          --status-interview-color: #6f42c1;
          --status-applied-bg: #e0e7ff;
          --status-applied-color: #4338ca;
          --status-pending-bg: #fff4e6;
          --status-pending-color: #fd7e14;
          --status-verified-bg: #e6ffed;
          --status-verified-color: #28a745;

          /* Assignment Cards */
          --assignment-card-unassigned-bg: #ffffff;
          --assignment-card-unassigned-color: #333;
          --assignment-card-assigned-bg: #e6ffed;
          --assignment-card-assigned-color: #28a745;
          --assign-client-button-bg: #007bff;
          --assign-client-button-color: #ffffff;
          --assign-client-button-hover-bg: #0056b3;

          /* Modal Specific Colors */
          --modal-overlay-bg: rgba(0, 0, 0, 0.5);
          --modal-bg: #ffffff;
          --modal-border-color: #e0e0e0;
          --modal-header-color: #212529;
          --modal-close-button-color: #6c757d;
          --modal-close-button-hover-bg: #e9ecef;
          --modal-priority-card-bg: #f8f9fa;
          --modal-priority-card-border: #e0e0e0;
          --modal-priority-text-color: #333;
          --modal-priority-high-color: #dc3545;
          --modal-priority-medium-color: #fd7e14;
          --modal-priority-low-color: #28a745;
          --modal-quick-assign-bg: #007bff;
          --modal-quick-assign-color: #ffffff;
          --modal-quick-assign-hover-bg: #0056b3;
          --modal-search-border: #ced4da;
          --modal-search-bg: #ffffff;
          --modal-search-text-color: #333;
          --modal-export-button-bg: #f1f3f5;
          --modal-export-button-color: #495057;
          --modal-export-button-hover-bg: #e9ecef;
          --modal-client-card-bg: #ffffff;
          --modal-client-card-border: #e0e0e0;
          --modal-client-name-color: #212529;
          --modal-client-detail-color: #6c757d;
          --modal-client-skill-bg: #e9ecef;
          --modal-client-skill-color: #495057;
          --modal-assign-button-bg: #007bff;
          --modal-assign-button-color: #ffffff;
          --modal-assign-button-hover-bg: #0056b3;
          --modal-view-profile-bg: #f1f3f5;
          --modal-view-profile-color: #495057;
          --modal-view-profile-hover-bg: #e9ecef;

          /* Assign Client Modal Specific Colors */
          --form-label-color: #495057;
          --form-input-border: #ced4da;
          --form-input-bg: #ffffff;
          --form-input-text: #333;
          --form-input-focus-border: #80bdff;
          --form-input-focus-shadow: rgba(0, 123, 255, 0.25);
          --form-button-cancel-bg: #e9ecef;
          --form-button-cancel-color: #495057;
          --form-button-cancel-hover-bg: #dee2e6;
          --form-button-assign-bg: #007bff;
          --form-button-assign-color: #ffffff;
          --form-button-assign-hover-bg: #0056b3;

          /* Client Preview Modal New Styles */
          --client-preview-grid-gap: 20px;
          --client-preview-section-bg: #f8f9fa;
          --client-preview-section-border: #e0e0e0;
          --client-preview-section-title-color: #007bff;
          --client-preview-detail-label-color: #6c757d;
          --client-preview-detail-value-color: #333;

          /* Notification Modal Specific Styles */
          --notification-item-border: #e9ecef;
          --notification-item-time-color: #868e96;

          /* User Profile Modal Specific Styles */
          --profile-label-color: #6c757d;
          --profile-value-color: #333;
          --edit-button-bg: #007bff;
          --edit-button-color: #ffffff;
          --edit-button-hover-bg: #0056b3;
          --close-button-bg: #e9ecef;
          --close-button-color: #495057;
          --close-button-hover-bg: #dee2e6;

          /* LLM Section */
          --llm-section-bg: #e9f7ef; /* Light green for LLM section */
          --llm-section-border: #d4edda;
          --llm-text-color: #155724; /* Dark green text */
          --llm-loading-color: #007bff;

                --bg-body: #f3f4f6;
          --bg-card: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --shadow-color-1: rgba(0, 0, 0, 0.05);
          --shadow-color-3: rgba(0, 0, 0, 0.04);
          --add-employee-btn-bg: #2563EB;
          --add-employee-btn-hover-bg: #1D4ED8;
          --add-employee-btn-text: #ffffff;
          --search-input-border: #d1d5db;
          --search-input-bg: #ffffff;
          --search-input-text: #1f2937;
          --search-placeholder-color: #9ca3af;
          --employee-card-bg: #ffffff;
          --employee-card-border: #e5e7eb;
          --employee-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          --employee-avatar-bg: #E0F2FE;
          --employee-avatar-icon: #2563EB;
          --employee-name-color: #1f2937;
          --employee-email-color: #6b7280;
          --action-btn-border: #e5e7eb;
          --action-btn-text: #4b5563;
          --action-btn-hover-bg: #f9fafb;
          --delete-btn-bg: #EF4444;
          --delete-btn-hover-bg: #DC2626;
          --delete-btn-text: #ffffff;
          --modal-overlay-bg: rgba(0, 0, 0, 0.5);
          --modal-bg: #ffffff;
          --modal-border: #e5e7eb;
          --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --modal-title-color: #1f2937;
          --modal-subtitle-color: #6b7280;
          --modal-close-btn-color: #6b7280;
          --modal-close-btn-hover: #1f2937;
          --modal-input-bg: #ffffff;
          --modal-input-border: #d1d5db;
          --modal-input-text: #1f2937;
          --modal-input-placeholder: #9ca3af;
          --modal-focus-border: #2563eb;
          --modal-label-color: #374151;
          --modal-generate-btn-bg: #e0e7ff;
          --modal-generate-btn-text: #3b82f6;
          --modal-generate-btn-hover: #c7d2fe;
          --modal-create-btn-bg: #2563eb;
          --modal-create-btn-text: #ffffff;
          --modal-create-btn-hover: #1d4ed8;
          --confirm-modal-danger-btn-bg: #EF4444;
          --confirm-modal-danger-btn-hover: #DC2626;
          --confirm-modal-cancel-btn-bg: #e5e7eb;
          --confirm-modal-cancel-btn-text: #4b5563;
          --confirm-modal-cancel-btn-hover: #d1d5db;
      
        }

        [data-theme='dark'] {
          --bg-color: #2c2c2c; /* Darker background */
          --text-color: #e0e0e0;
          --header-border-color: #444444;
          --card-bg: #3a3a3a;
          --card-shadow: rgba(0, 0, 0, 0.3);
          --card-hover-shadow: rgba(0, 0, 0, 0.5);
          --button-hover-bg: #4a4a4a;
          --icon-color: #bbbbbb;
          --tab-button-color: #bbbbbb;
          --tab-button-hover-bg: #4a4a4a;
          --tab-button-active-bg: #5a5a5a;
          --tab-button-active-color: #ffffff;
          --member-border-color: #4a4a4a;
          --employee-count-bg: #4a4a4a;
          --employee-count-color: #e0e0e0;
          --activity-subtitle-color: #aaaaaa;
          --main-title-color: #ffffff;
          --subtitle-color: #bbbbbb;
          --user-profile-shadow: rgba(0, 0, 0, 0.3);
          --user-profile-bg: #3a3a3a;
          --user-name-color: #ffffff;
          --user-role-color: #bbbbbb;
          --user-avatar-bg: #5a5a5a;
          --user-avatar-color: #ffffff;
          --manager-badge-bg: #4a3c61; /* Darker purple */
          --manager-badge-color: #d1b3ff; /* Lighter purple text */
          --notification-badge-bg: #ef5350; /* Slightly brighter red */
          --notification-badge-border: #2c2c2c; /* Dark border */
          --card-title-color: #bbbbbb;
          --card-value-color: #ffffff;
          --card-description-color: #aaaaaa;
          --card-icon-blue-bg: #334d66;
          --card-icon-blue-color: #66b3ff;
          --card-icon-green-bg: #335544;
          --card-icon-green-color: #66cc99;
          --card-icon-orange-bg: #664d33;
          --card-icon-orange-color: #ffcc66;
          --card-icon-purple-bg: #553366;
          --card-icon-purple-color: #cc99ff;
          --success-rate-green: #66cc99;
          --section-header-color: #ffffff;
          --section-header-icon-color: #bbbbbb;
          --red-icon-color: #ef5350;
          --action-button-border: #555555;
          --action-button-color: #e0e0e0;
          --action-button-bg: #3a3a3a;
          --action-button-hover-bg: #4a4a4a;
          --action-button-hover-border: #666666;
          --attention-item-color: #e0e0e0;
          --attention-badge-bg: #5a3a3a;
          --attention-badge-color: #ffaaaa;
          --attention-badge-gray-bg: #4a4a4a;
          --attention-badge-gray-color: #e0e0e0;
          --performance-value-color: #ffffff;
          --member-avatar-bg-default: #334d66;
          --member-avatar-color-default: #66b3ff;
          --member-avatar-bg-employee: #4338ca; /* Keeping original for contrast */
          --member-avatar-color-employee: #e0e7ff; /* Keeping original for contrast */
          --status-badge-excellent-bg: #335544;
          --status-badge-excellent-color: #66cc99;
          --status-badge-good-bg: #334d66;
          --status-badge-good-color: #66b3ff;

          /* Application Status Badges (Dark Theme) */
          --status-interview-bg: #553366;
          --status-interview-color: #cc99ff;
          --status-applied-bg: #334d66;
          --status-applied-color: #66b3ff;
          --status-pending-bg: #664d33;
          --status-pending-color: #ffcc66;
          --status-verified-bg: #335544;
          --status-verified-color: #66cc99;

          /* Assignment Cards (Dark Theme) */
          --assignment-card-unassigned-bg: #3a3a3a;
          --assignment-card-unassigned-color: #e0e0e0;
          --assignment-card-assigned-bg: #335544;
          --assignment-card-assigned-color: #66cc99;
          --assign-client-button-bg: #0056b3;
          --assign-client-button-color: #ffffff;
          --assign-client-button-hover-bg: #007bff;

          /* Modal Specific Colors (Dark Theme) */
          --modal-overlay-bg: rgba(0, 0, 0, 0.7);
          --modal-bg: #3a3a3a;
          --modal-border-color: #555555;
          --modal-header-color: #ffffff;
          --modal-close-button-color: #bbbbbb;
          --modal-close-button-hover-bg: #4a4a4a;
          --modal-priority-card-bg: #4a4a4a;
          --modal-priority-card-border: #555555;
          --modal-priority-text-color: #e0e0e0;
          --modal-priority-high-color: #ef5350;
          --modal-priority-medium-color: #ffcc66;
          --modal-priority-low-color: #66cc99;
          --modal-quick-assign-bg: #0056b3;
          --modal-quick-assign-color: #ffffff;
          --modal-quick-assign-hover-bg: #007bff;
          --modal-search-border: #666666;
          --modal-search-bg: #4a4a4a;
          --modal-search-text-color: #e0e0e0;
          --modal-export-button-bg: #4a4a4a;
          --modal-export-button-color: #e0e0e0;
          --modal-export-button-hover-bg: #5a5a5a;
          --modal-client-card-bg: #4a4a4a;
          --modal-client-card-border: #555555;
          --modal-client-name-color: #ffffff;
          --modal-client-detail-color: #bbbbbb;
          --modal-client-skill-bg: #5a5a5a;
          --modal-client-skill-color: #e0e0e0;
          --modal-assign-button-bg: #0056b3;
          --modal-assign-button-color: #ffffff;
          --modal-assign-button-hover-bg: #007bff;
          --modal-view-profile-bg: #4a4a4a;
          --modal-view-profile-color: #e0e0e0;
          --modal-view-profile-hover-bg: #5a5a5a;

          /* Assign Client Modal Specific (Dark Theme) */
          --form-label-color: #e0e0e0;
          --form-input-border: #666666;
          --form-input-bg: #4a4a4a;
          --form-input-text: #e0e0e0;
          --form-input-focus-border: #66b3ff;
          --form-input-focus-shadow: rgba(102, 179, 255, 0.25);
          --form-button-cancel-bg: #4a4a4a;
          --form-button-cancel-color: #e0e0e0;
          --form-button-cancel-hover-bg: #5a5a5a;
          --form-button-assign-bg: #0056b3;
          --form-button-assign-color: #ffffff;
          --form-button-assign-hover-bg: #007bff;

          /* Client Preview Modal New Styles (Dark Theme) */
          --client-preview-section-bg: #3a3a3a;
          --client-preview-section-border: #555555;
          --client-preview-section-title-color: #66b3ff;
          --client-preview-detail-label-color: #bbbbbb;
          --client-preview-detail-value-color: #e0e0e0;

          /* Notification Modal Specific Styles (Dark Theme) */
          --notification-item-border: #4a4a4a;
          --notification-item-time-color: #aaaaaa;

          /* User Profile Modal Specific Styles (Dark Theme) */
          --profile-label-color: #bbbbbb;
          --profile-value-color: #e0e0e0;
          --edit-button-bg: #0056b3;
          --edit-button-color: #ffffff;
          --edit-button-hover-bg: #007bff;
          --close-button-bg: #4a4a4a;
          --close-button-color: #e0e0e0;
          --close-button-hover-bg: #5a5a5a;

          /* LLM Section (Dark Theme) */
          --llm-section-bg: #335544; /* Darker green for LLM section */
          --llm-section-border: #446655;
          --llm-text-color: #d4edda; /* Lighter green text */
          --llm-loading-color: #66b3ff;
        }

        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

----------------------------------------------
    .employee-management-container {
            padding: 1.5rem;
        }
        .employee-management-box {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
        }
        .employee-management-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
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
            flex-grow: 1;
            max-width: 400px;
        }
        .employee-search-input {
            flex-grow: 1;
            padding: 0.6rem 1rem;
            border: 1px solid var(--search-input-border);
            border-radius: 0.5rem;
            background-color: var(--search-input-bg);
            color: var(--search-input-text);
            font-size: 0.9rem;
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
            border: none;
            cursor: pointer;
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
            flex-wrap: wrap;
        }
        .employee-card-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-grow: 1;
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
            color: var(--employee-avatar-icon);
            font-size: 1.2rem;
            font-weight: 600;
        }
        .employee-info {
            display: flex;
            flex-direction: column;
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
        }
        .action-btn {
            padding: 0.5rem 1rem;
            border: 1px solid var(--action-btn-border);
            border-radius: 0.5rem;
            background-color: transparent;
            color: var(--action-btn-text);
            font-weight: 500;
            cursor: pointer;
        }
        .delete-btn {
            background-color: var(--delete-btn-bg);
            color: var(--delete-btn-text);
            border-color: var(--delete-btn-bg);
        }
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
            z-index: 1000;
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
        }
        .employee-edit-modal-content {
            max-width: 850px;
            max-height: 90vh;
            overflow-y: auto;
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
                grid-column: 1 / -1;
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
            width: 100%;
            box-sizing: border-box;
        }
        .password-input-group {
            display: flex;
            gap: 0.5rem;
        }
        .generate-password-btn {
            padding: 0.75rem 1rem;
            background-color: var(--modal-generate-btn-bg);
            color: var(--modal-generate-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
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
            gap: 0.75rem;
        }
        .create-employee-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--modal-create-btn-bg);
            color: var(--modal-create-btn-text);
            border-radius: 0.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
        }
        .confirm-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }
        .confirm-cancel-btn, .confirm-delete-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }
        .confirm-cancel-btn {
            background-color: var(--confirm-modal-cancel-btn-bg);
            color: var(--confirm-modal-cancel-btn-text);
        }
        .confirm-delete-btn {
            background-color: var(--confirm-modal-danger-btn-bg);
            color: var(--delete-btn-text);
        }
        .details-grid.form-layout {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
        }
        .section-title {
            grid-column: 1 / -1;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 16px 0 4px;
            color: #2b3e50;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
        }
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
        .form-item input, .form-item select, .form-item textarea {
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        .modal-footer.modal-form-full-width {
            grid-column: 1 / -1;
        }
        .confirm-save-btn {
            padding: 8px 16px;
            font-size: 0.95rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            background-color: #2e7d32;
            color: #fff;
        }


--------------------------------




          .filter-container-style {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--header-border-color);
    align-items: flex-end;
  }
  .filter-group-style {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .filter-label-style {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--subtitle-color);
  }
  .date-range-input-group-style {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .date-input-style {
    padding: 8px 12px;
    border: 1px solid var(--header-border-color);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-color);
    flex: 1;
    background-color: var(--card-bg);
  }
  .select-filter-style {
    padding: 8px 12px;
    border: 1px solid var(--header-border-color);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-color);
    background-color: var(--card-bg);
    width: 100%;
  }
  .quick-filter-buttons-style {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .quick-filter-button-style {
    background-color: var(--button-hover-bg);
    color: var(--tab-button-color);
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  .quick-filter-button-style.active {
    background-color: var(--card-icon-blue-color);
    color: white;
  }
  .clear-filters-button-container-style {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-self: end;
  }
  .clear-filters-button-style {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

        .manager-dashboard-container {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 20px;
          font-family: 'Inter', sans-serif;
          color: var(--text-color);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--header-border-color);
          margin-bottom: 20px;
          transition: border-color 0.3s ease;
        }

        .header-logo {
          font-size: 24px;
          font-weight: 700;
          color: var(--main-title-color);
          margin: 0;
        }

        .header-logo .x-highlight {
            color: var(--card-icon-blue-color);
        }

        .selected-employee-details {
            background-color: var(--client-preview-section-bg);
            border: 1px solid var(--client-preview-section-border);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }

        .selected-employee-details h4 {
            margin-top: 0;
            color: var(--client-preview-section-title-color);
        }

        .selected-employee-details p {
            margin: 5px 0;
            color: var(--text-color);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
.header-button {
          padding: 6px;
          border-radius: 50%;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
          position: relative;
        }

        .header-button:hover {
          background-color: var(--button-hover-bg);
          transform: translateY(-1px);
        }

        .header-button i {
          font-size: 20px;
          color: var(--icon-color);
          transition: color 0.3s ease;
        }

        .notification-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background-color: var(--notification-badge-bg);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
            border: 1px solid var(--notification-badge-border);
            transform: translate(25%, -25%);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer; /* Indicate it's clickable */
          position: relative; /* For dropdown positioning */
          z-index: 20; /* Ensure it's above other content but below modal overlays */
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          background-color: var(--user-avatar-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--user-avatar-color);
          font-weight: 600;
          font-size: 12px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Target the div directly within .user-profile for text grouping */
        .user-profile > div:first-of-type {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: flex-end;
        }

        .user-profile > div:first-of-type span:first-child {
          font-weight: 500;
          color: var(--user-name-color);
          transition: color 0.3s ease;
        }

        .manager-badge {
            background-color: var(--manager-badge-bg);
            color: var(--manager-badge-color);
            font-size: 10px;
            font-weight: 600;
            padding: 1px 6px;
            border-radius: 10px;
            margin-top: 1px;
            border: none !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .user-profile .dropdown-arrow {
          font-size: 12px;
          color: var(--icon-color);
          margin-left: 4px;
          transition: color 0.3s ease;
        }

        /* Profile Dropdown Styles */
        .profile-dropdown {
            position: absolute;
            top: 100%; /* Position below the user profile */
            right: 0;
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow for dropdown */
            min-width: 160px;
            overflow: hidden; /* Ensures rounded corners apply to content */
            margin-top: 10px; /* Space between profile and dropdown */
            z-index: 100; /* Ensure it's above other elements */
            border: 1px solid var(--header-border-color); /* Subtle border */
            transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .profile-dropdown-item {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-color);
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        .profile-dropdown-item:hover {
            background-color: var(--tab-button-hover-bg);
            color: var(--tab-button-active-color);
        }

        .profile-dropdown-item i {
            font-size: 16px;
            color: var(--icon-color);
            transition: color 0.2s ease;
        }

        .profile-dropdown-item:hover i {
            color: var(--tab-button-active-color);
        }

        .profile-dropdown-item:last-child {
            border-top: 1px solid var(--header-border-color); /* Separator for logout */
            color: var(--red-icon-color); /* Red color for logout */
        }
        .profile-dropdown-item:last-child i {
            color: var(--red-icon-color);
        }
        .profile-dropdown-item:last-child:hover {
            background-color: var(--attention-badge-bg); /* Light red hover for logout */
            color: var(--attention-badge-color); /* Dark red text for logout hover */
        }
        .profile-dropdown-item:last-child:hover i {
            color: var(--attention-badge-color);
        }

        /* Title and Subtitle above tabs */
        .tab-section-header {
            margin-bottom: 20px; /* Space between header and tabs */
            text-align: left; /* Align content to the left */
        }

        .tab-section-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--main-title-color);
            margin: 0 0 5px 0;
            transition: color 0.3s ease;
        }

        .tab-section-header p {
            font-size: 15px;
            color: var(--subtitle-color);
            margin: 0;
            transition: color 0.3s ease;
        }

        /* Styling for the radio button group */
        .radio-group {
            display: flex;
            width: 100%;
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 10px;
            margin-bottom: 20px;
            gap: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Style for the new clickable field that replaces the dropdown */
        .pseudo-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--form-input-border);
            border-radius: 8px;
            background-color: var(--form-input-bg);
            color: var(--form-input-text);
            font-size: 14px;
            cursor: pointer;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

        .pseudo-input:hover {
            border-color: var(--form-input-focus-border);
        }

        /* Styles for the list of employees in the new modal */
        .employee-select-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .employee-select-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border: 1px solid var(--header-border-color);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .employee-select-item:hover {
            background-color: var(--button-hover-bg);
            border-color: var(--card-icon-blue-color);
        }

        .employee-select-info {
            color: var(--text-color);
        }

        .employee-select-info strong {
            font-weight: 600;
        }

        .employee-select-info span {
            display: block;
            font-size: 0.9rem;
            color: var(--subtitle-color);
            margin-top: 2px;
        }

        .radio-option {
            flex-grow: 1;
            text-align: center;
        }

        .radio-option input[type="radio"] {
            display: none; /* Hide the actual radio button */
        }

        .radio-option label {
            display: block;
            padding: 10px 20px;
            border: none;
            background-color: transparent;
            font-size: 16px;
            font-weight: 500;
            color: var(--tab-button-color);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .radio-option input[type="radio"]:checked + label {
            background-color: var(--tab-button-active-bg);
            color: var(--tab-button-active-color);
            font-weight: 600;
        }

        .radio-option label:hover {
            background-color: var(--tab-button-hover-bg);
            color: var(--tab-button-active-color);
        }

        /* Client Assignment Overview Section */
        .client-assignment-overview {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 20px;
            margin-top: 20px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .client-assignment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .client-assignment-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--section-header-color);
            transition: color 0.3s ease;
        }

        .assign-client-button {
            background-color: var(--assign-client-button-bg);
            color: var(--assign-client-button-color);
            padding: 10px 15px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease-in-out, color 0.3s ease;
        }

        .assign-client-button:hover {
            background-color: var(--assign-client-button-hover-bg);
        }

        .assignment-cards-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @media (min-width: 768px) {
            .assignment-cards-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .assignment-card {
            background-color:rgba(68, 68, 68, 0.05);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            text-align: center;
            /* Add initial border for transition */
            border: 1px solid transparent;
            transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            cursor: pointer; /* Indicate clickable */
        }

        /* Hover effect for assignment cards */
        .assignment-card:hover {
            border-color: var(--card-icon-blue-color); /* Use a blue border on hover */
        }

        .assignment-card.assigned {
            background-color: var(--assignment-card-assigned-bg);
        }

        .assignment-card-value {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 5px;
            color: var(--assignment-card-unassigned-color);
            transition: color 0.3s ease;
        }

        .assignment-card.assigned .assignment-card-value {
            color: var(--assignment-card-assigned-color);
        }

        .assignment-card-title {
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            margin-bottom: 5px;
            transition: color 0.3s ease;
        }

        .assignment-card-description {
            font-size: 13px;
            color: var(--icon-color);
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.3s ease;
        }

        /* Styles for Employee Applications Management */
        .applications-management-section {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 20px;
            margin-top: 20px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .applications-header {
            display: flex;
            justify-content: space-between; /* Keep title left, actions right */
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }

        /* New container for right-aligned actions in applications header */
        .applications-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap; /* Allow wrapping on small screens */
        }

        .applications-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--section-header-color);
            transition: color 0.3s ease;
        }

        .pending-review-badge {
            background-color: var(--status-pending-bg);
            color: var(--status-pending-color);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 15px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .applications-filters {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            align-items: flex-end; /* Align items to the bottom, especially for date inputs with labels */
        }

        .search-input-wrapper {
            position: relative;
            flex: 1 1 200px;
            min-width: 200px;
        }

        .search-input-wrapper input {
            width: 100%;
            padding: 10px 10px 10px 40px;
            border: 1px solid var(--header-border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-size: 14px;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }

        .search-input-wrapper i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--icon-color);
            font-size: 16px;
            transition: color 0.3s ease;
        }

        .filter-dropdown {
            position: relative;
            flex: 1 1 150px;
            min-width: 150px;
        }

        .filter-dropdown select {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--header-border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-size: 14px;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            cursor: pointer;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }

        .filter-dropdown i {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--icon-color);
            font-size: 14px;
            pointer-events: none;
            transition: color 0.3s ease;
        }

        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        .applications-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left;
            min-width: 700px;
        }

        .applications-table th,
        .applications-table td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--header-border-color);
            transition: border-color 0.3s ease;
            vertical-align: middle; /* Ensure vertical alignment for all cells */
        }

        .applications-table th {
            color: var(--subtitle-color);
            font-weight: 600;
            white-space: nowrap;
        }

        /* Center the TOTAL APPLICATIONS column */
        .applications-table th:nth-last-child(1),
        .applications-table td:nth-last-child(1) {
            text-align: center;
        }

        .applications-table td {
            color: var(--text-color);
        }

        .applications-table tr:last-child td {
            border-bottom: none;
        }

        .applications-table .employee-cell {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .applications-table .employee-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            background-color: var(--member-avatar-bg-default);
            color: var(--member-avatar-color-default);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .applications-table .status-badge {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            white-space: nowrap;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        .applications-table .status-badge.status-interview {
            background-color: var(--status-interview-bg);
            color: var(--status-interview-color);
        }

        .applications-table .status-badge.status-applied {
            background-color: var(--status-applied-bg);
            color: var(--status-applied-color);
        }

        .applications-table .status-badge.status-pending {
            background-color: var(--status-pending-bg);
            color: var(--status-pending-color);
        }

        .applications-table .status-badge.status-verified {
            background-color: var(--status-verified-bg);
            color: var(--status-verified-color);
        }

        .applications-table .action-buttons {
            display: flex;
            gap: 5px;
            white-space: nowrap;
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
            height: 100%; /* Take full height of cell */
        }

        .applications-table .action-button {
            padding: 0; /* Remove padding to make it a perfect square */
            border-radius: 6px;
            border: 1px solid var(--action-button-border);
            background-color: var(--action-button-bg);
            color: var(--action-button-color);
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.3s ease;
            display: flex; /* Make it a flex container to center icon */
            align-items: center; /* Center icon vertically */
            justify-content: center; /* Center icon horizontally */
            width: 30px; /* Consistent square size */
            height: 30px; /* Consistent square size */
        }

        .applications-table .action-button:hover {
            background-color: var(--action-button-hover-bg);
            border-color: var(--action-button-hover-border);
        }

        .applications-table .action-button i {
            margin-right: 0; /* Remove margin if only icon */
            color: var(--icon-color);
            transition: color 0.3s ease;
        }

        /* New styles for Assigned Clients by Employee cards */
        .employee-cards-grid {
            display: grid;
            grid-template-columns: 1fr; /* Single column on small screens */
            gap: 20px;
        }

        @media (min-width: 768px) {
            .employee-cards-grid {
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Two columns on larger screens, flexible */
            }
        }

        .employee-card {
            background-color:rgba(68, 68, 68, 0.05);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transition: all 0.3s ease;
            border: 1px solid var(--header-border-color); /* Light border */
        }

        .employee-card:hover {
            box-shadow: 0 6px 12px var(--card-hover-shadow);
            transform: translateY(-2px);
            border-color: var(--card-icon-green-color); /* Subtle hover effect */
        }

        .employee-card-header {
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 1px solid var(--member-border-color); /* Line below header */
            padding-bottom: 15px;
        }

        .employee-avatar-large {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: var(--member-avatar-bg-employee); /* Employee-specific avatar color */
            color: var(--member-avatar-color-employee);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
            flex-shrink: 0;
        }

        .employee-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .employee-name {
            font-size: 18px;
            font-weight: 600;
            color: var(--main-title-color); /* ADJUSTED: For better contrast */
        }

        .employee-role {
            font-size: 14px;
            color: var(--subtitle-color);
        }

        .clients-count-badge {
            background-color: var(--status-verified-bg); /* Greenish badge from screenshot */
            color: var(--status-verified-color);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .employee-card-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .success-rate {
            font-size: 15px;
            color: var(--text-color);
            font-weight: 500;
        }

        .success-rate-value {
            color: var(--success-rate-green); /* Green color for the percentage */
            font-weight: 600;
        }

        .view-employee-details-button {
            background: none;
            border: none;
            color: var(--icon-color); /* Neutral icon color */
            font-size: 18px;
            cursor: pointer;
            padding: 8px; /* Make it easier to click */
            border-radius: 50%;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        .view-employee-details-button:hover {
            background-color: var(--button-hover-bg);
            color: var(--main-title-color); /* Darker on hover */
        }


        /* Responsive adjustments */
        @media (max-width: 767px) {
            .header-section {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }

            .header-actions {
                width: 100%;
                justify-content: space-between;
            }

            .user-profile {
                flex-grow: 1;
                justify-content: flex-end;
            }

            .radio-group {
                flex-direction: column;
                padding: 5px;
            }

            .radio-option label {
                padding: 8px 15px;
                font-size: 15px;
            }

            .client-assignment-header,
            .applications-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .assign-client-button {
                width: 100%;
                justify-content: center;
            }

            .applications-filters {
                flex-direction: column;
                width: 100%;
                gap: 10px;
            }

            .search-input-wrapper,
            .filter-dropdown {
                width: 100%;
                min-width: unset;
            }
            .applications-header-actions {
                width: 100%; /* Take full width on small screens */
                justify-content: flex-start; /* Align left for better readability */
            }
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
          z-index: 1000;
          transition: background-color 0.3s ease;
        }

        .modal-content {
          background-color: var(--modal-bg);
          padding: 0 25px 25px 25px; /* Removed padding-top here */
          border-radius: 12px;
          box-shadow: 0 8px 20px var(--card-shadow);
          width: 90%;
          max-width: 700px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid var(--modal-border-color);
          transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          max-height: 90vh; /* Make the entire modal scrollable */
          overflow-y: auto; /* Enable vertical scrolling for the modal content */
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 25px; /* Added padding-top here */
          padding-bottom: 15px;
          border-bottom: 1px solid var(--header-border-color);
          /* Ensure header stays visible when scrolling modal content */
          position: sticky;
          top: 0;
          background-color: var(--modal-bg); /* Match modal background */
          z-index: 10; /* Ensure it's above scrolling content */
        }
.modal-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--modal-header-color);
          transition: color 0.3s ease;
        }

        .modal-close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--modal-close-button-color);
          cursor: pointer;
          transition: color 0.2s ease, background-color 0.2s ease;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-close-button:hover {
            background-color: var(--modal-close-button-hover-bg);
        }

        .modal-priority-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .priority-card {
            background-color: var(--modal-priority-card-bg);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            border: 1px solid var(--modal-priority-card-border);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .priority-card-value {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            color: var(--modal-priority-text-color);
            transition: color 0.3s ease;
        }

        .priority-card-title {
            font-size: 14px;
            color: var(--modal-priority-text-color);
            transition: color 0.3s ease;
        }

        .priority-card.high .priority-card-value,
        .priority-card.high .priority-card-title {
            color: var(--modal-priority-high-color);
        }
        .priority-card.medium .priority-card-value,
        .priority-card.medium .priority-card-title {
            color: var(--modal-priority-medium-color);
        }
        .priority-card.low .priority-card-value,
        .priority-card.low .priority-card-title {
            color: var(--modal-priority-low-color);
        }

        .modal-actions-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .modal-actions-top .search-input-wrapper {
            flex-grow: 1;
            min-width: 180px;
        }

        .modal-actions-top .filter-dropdown {
            min-width: 120px;
        }

        .modal-quick-assign-button {
            background-color: var(--modal-quick-assign-bg);
            color: var(--modal-quick-assign-color);
            padding: 8px 15px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease;
            white-space: nowrap;
        }
        .modal-quick-assign-button:hover {
            background-color: var(--modal-quick-assign-hover-bg);
        }

        .modal-export-button {
            background-color: var(--modal-export-button-bg);
            color: var(--modal-export-button-color);
            padding: 8px 15px;
            border-radius: 8px;
            border: 1px solid var(--modal-search-border);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
            white-space: nowrap;
        }
        .modal-export-button:hover {
            background-color: var(--modal-export-button-hover-bg);
            border-color: var(--modal-export-button-hover-border);
        }

        .modal-available-clients-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-height: unset; /* Allow it to expand within the scrollable modal */
            overflow-y: visible; /* Let the modal handle scrolling */
            padding-right: 0; /* Remove padding for scrollbar as modal handles it */
        }

        .modal-client-card {
            background-color: var(--modal-client-card-bg);
            border-radius: 10px;
            border: 1px solid var(--modal-client-card-border);
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .modal-client-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .modal-client-name {
            font-size: 18px;
            font-weight: 600;
            color: var(--modal-client-name-color);
            transition: color 0.3s ease;
        }

        .modal-client-priority-badge {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 12px;
            white-space: nowrap;
        }
        .modal-client-priority-badge.high {
            background-color: var(--attention-badge-bg);
            color: var(--attention-badge-color);
        }
        .modal-client-priority-badge.medium {
            background-color: var(--status-pending-bg);
            color: var(--status-pending-color);
        }
        .modal-client-priority-badge.low {
            background-color: var(--status-verified-bg);
            color: var(--status-verified-color);
        }

        .modal-client-details {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 14px;
            color: var(--modal-client-detail-color);
            transition: color 0.3s ease;
        }

        .modal-client-details span {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .modal-client-details i {
            font-size: 14px;
            color: var(--icon-color);
            transition: color 0.3s ease;
        }

        .modal-client-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-end;
        }

        .modal-assign-button {
            background-color: var(--modal-assign-button-bg);
            color: var(--modal-assign-button-color);
            padding: 8px 15px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease;
        }
        .modal-assign-button:hover {
            background-color: var(--modal-assign-button-hover-bg);
        }

        .modal-view-profile-button {
            background-color: var(--modal-view-profile-bg);
            color: var(--modal-view-profile-color);
            padding: 8px 15px;
            border-radius: 8px;
            border: 1px solid var(--modal-search-border);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
        }
        .modal-view-profile-button:hover {
            background-color: var(--modal-view-profile-hover-bg);
            border-color: var(--modal-view-profile-hover-border);
        }

        /* Assign Client Modal Specific Colors */
        .assign-modal-content {
            background-color: var(--modal-bg);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 20px var(--card-shadow);
            width: 90%;
            max-width: 1200px; /* Adjusted max-width for this modal */
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            border: 1px solid var(--modal-border-color);
            transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }

        .assign-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--header-border-color);
        }

        .assign-modal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--modal-header-color);
        }

        .assign-modal-close-button {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--modal-close-button-color);
            cursor: pointer;
            transition: color 0.2s ease, background-color 0.2s ease;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .assign-modal-close-button:hover {
            background-color: var(--modal-close-button-hover-bg);
        }

        .assign-form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .assign-form-group label {
            font-size: 14px;
            font-weight: 500;
            color: var(--form-label-color);
            transition: color 0.3s ease;
        }

        .assign-form-group select,
        .assign-form-group textarea,
        .assign-form-group input[type="text"],
        .assign-form-group input[type="email"],
        .assign-form-group input[type="tel"],
        .assign-form-group input[type="date"],
        .assign-form-group input[type="number"] { /* Added number type */
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--form-input-border);
            border-radius: 8px;
            background-color: var(--form-input-bg);
            color: var(--form-input-text);
            font-size: 14px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease;
            -webkit-appearance: none; /* Remove default arrow for selects */
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
        }

        .assign-form-group select:focus,
        .assign-form-group textarea:focus,
        .assign-form-group input[type="text"]:focus,
        .assign-form-group input[type="email"]:focus,
        .assign-form-group input[type="tel"]:focus,
        .assign-form-group input[type="date"]:focus,
        .assign-form-group input[type="number"]:focus { /* Added number type */
            outline: none;
            border-color: var(--form-input-focus-border);
            box-shadow: 0 0 0 0.2rem var(--form-input-focus-shadow);
        }

        .assign-form-group textarea {
            min-height: 80px;
            resize: vertical;
        }

        .assign-form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }

        .assign-form-button {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: background-color 0.2s ease, color 0.3s ease;
        }

        .assign-form-button.cancel {
            background-color: var(--form-button-cancel-bg);
            color: var(--form-button-cancel-color);
            border: 1px solid var(--form-input-border);
        }
        .assign-form-button.cancel:hover {
            background-color: var(--form-button-cancel-hover-bg);
        }

        .assign-form-button.assign {
            background-color: var(--form-button-assign-bg);
            color: var(--form-button-assign-color);
        }
        .assign-form-button.assign:hover {
            background-color: var(--form-button-assign-hover-bg);
        }

        /* Total Clients Modal Specific Styles */
        .total-clients-modal-content {
            background-color: var(--modal-bg);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 20px var(--card-shadow);
            width: 90%;
            max-width: 900px; /* Wider for the table */
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            border: 1px solid var(--modal-border-color);
            transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }

        .total-clients-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--header-border-color);
            position: sticky;
            top: -25px; /* Adjust to account for modal content padding */
            background-color: var(--modal-bg);
            z-index: 10;
            margin: -25px -25px 0 -25px; /* Compensate for padding to make it full width */
            padding: 25px 25px 15px 25px; /* Add back padding for content */
        }

        .total-clients-modal-title {
            font-size: 22px;
            font-weight: 600;
            color: var(--modal-header-color);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .total-clients-modal-title i {
            font-size: 20px;
            color: var(--icon-color);
        }

        .total-clients-modal-subtitle {
            font-size: 14px;
            color: var(--subtitle-color);
            margin-top: 5px;
        }

        /* Adjust table styles for this modal specifically if needed, otherwise reuse existing */
        .total-clients-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left;
            min-width: 950px; /* Increased min-width for side scroll */
        }

        .total-clients-table th,
        .total-clients-table td {
            padding: 10px; /* Adjusted padding for reduced height */
            border-bottom: 1px solid var(--header-border-color);
            transition: border-color 0.3s ease;
            vertical-align: middle; /* Ensure vertical centering */
        }

        .total-clients-table th {
            color: var(--subtitle-color);
            font-weight: 600;
            white-space: nowrap;
            text-align: left; /* Ensure header text is left-aligned */
        }

        .total-clients-table td {
            color: var(--text-color);
            min-height: 50px; /* Added min-height for consistent row size */
        }

        .total-clients-table tr:last-child td {
            border-bottom: none;
        }

        .total-clients-table .employee-cell {
            display: flex;
            align-items: center; /* Align items to the center */
            gap: 10px;
        }

        .total-clients-table .employee-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            background-color: var(--member-avatar-bg-default);
            color: var(--member-avatar-color-default);
            transition: background-color 0.3s ease, color 0.3s ease;
            flex-shrink: 0; /* Prevent avatar from shrinking */
        }

        /* Specific styles for multi-line content in total clients table */
        .total-clients-table .client-info,
        .total-clients-table .position-info {
            display: flex;
            flex-direction: column;
            justify-content: center; /* Center content vertically within these flex columns */
        }

        .total-clients-table .client-info .main-text {
            font-weight: 500;
            color: var(--text-color);
        }

        .total-clients-table .client-info .sub-text,
        .total-clients-table .position-info .sub-text {
            font-size: 12px;
            color: var(--subtitle-color);
        }

        .total-clients-table .position-info .main-text {
            font-weight: 500;
            color: var(--text-color);
        }

        /* NEW: Employee Clients Detail Modal Styles */
        .employee-clients-modal-content {
            background-color: var(--modal-bg);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 20px var(--card-shadow);
            width: 90%;
            max-width: 700px;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 20px;
            border: 1px solid var(--modal-border-color);
            max-height: 90vh;
            overflow-y: auto;
        }

        .employee-clients-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--header-border-color);
        }

        .employee-clients-modal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--modal-header-color);
        }

        .employee-clients-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .employee-client-card {
            background-color: var(--card-bg);
            border-radius: 10px;
            border: 1px solid var(--member-border-color);
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .employee-client-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .employee-client-name {
            font-weight: 600;
            color: var(--text-color);
        }

        .employee-client-position {
            font-size: 14px;
            color: var(--subtitle-color);
        }

        .employee-client-details-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 20px; /* Row gap, column gap */
            font-size: 13px;
            color: var(--icon-color);
        }

        .employee-client-details-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }


        /* NEW: Client Preview Modal Specific Styles */
        .client-preview-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--client-preview-grid-gap);
        }

        .client-preview-section {
            background-color: var(--client-preview-section-bg);
            border: 1px solid var(--client-preview-section-border);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .client-preview-section-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--client-preview-section-title-color);
            margin-bottom: 5px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--client-preview-section-border);
            transition: color 0.3s ease, border-color 0.3s ease;
        }

        .client-preview-detail-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .client-preview-detail-label {
            font-size: 13px;
            color: var(--client-preview-detail-label-color);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .client-preview-detail-value {
            font-size: 15px;
            color: var(--client-preview-detail-value-color);
            font-weight: 600;
            word-break: break-word; /* Ensure long values wrap */
            transition: color 0.3s ease;
        }

        .client-preview-skills-section {
            margin-top: 10px;
        }

        .client-preview-skills-section .modal-client-skills {
            margin-top: 10px;
        }


        /* Responsive adjustments for modals */
        @media (max-width: 600px) {
            .modal-content, .assign-modal-content, .total-clients-modal-content, .employee-clients-modal-content {
                padding: 15px;
                width: 95%;
                max-height: 90vh;
            }
            /* Apply to client preview modal as well */
            .modal-content {
                max-width: 95%; /* Make it slightly wider on small screens */
            }

            .modal-title, .assign-modal-title, .total-clients-modal-title, .employee-clients-modal-title {
                font-size: 18px;
            }
            .modal-close-button, .assign-modal-close-button {
                font-size: 20px;
            }
            .modal-priority-overview {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
            .priority-card-value {
                font-size: 24px;
            }
            .priority-card-title {
                font-size: 12px;
            }
            .modal-actions-top {
                flex-direction: column;
                align-items: stretch;
            }
.modal-quick-assign-button,
            .modal-export-button {
                width: 100%;
                justify-content: center;
            }
            .modal-client-actions {
                flex-direction: column;
                align-items: stretch;
            }
            .modal-assign-button,
            .modal-view-profile-button {
                width: 100%;
                justify-content: center;
            }
            .assign-form-actions {
                flex-direction: column;
                align-items: stretch;
            }
            .assign-form-button {
                width: 100%;
            }
            .total-clients-modal-header {
                padding: 15px 15px 10px 15px; /* Adjust padding for small screens */
                margin: -15px -15px 0 -15px;
            }
            .total-clients-table {
                min-width: 600px; /* Still need some min-width for all columns */
            }

            .client-preview-grid-container {
                grid-template-columns: 1fr; /* Single column on small screens */
            }
        }

        /* NEW: Interview Table Specific Styles */
        .interview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left; /* Default left alignment for most columns */
            min-width: 900px; /* Adjusted min-width for interview table columns */
        }

        .interview-table th,
        .interview-table td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--header-border-color);
            transition: border-color 0.3s ease;
            vertical-align: middle; /* Ensures all content is vertically centered */
        }

        .interview-table th {
            color: var(--subtitle-color);
            font-weight: 600;
            white-space: nowrap;
            text-align: left; /* Explicitly left-align headers by default */
        }

        /* Specific rule for the 'ACTIONS' header to center align */
        /* REMOVED: .interview-table th:last-child {
            text-align: center;
        } */

        /* Specific rule for the 'ACTIONS' column data cells to center align */
        /* REMOVED: .interview-table td:last-child {
            text-align: center;
            display: flex; /* Make the td a flex container */
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
            height: 100%; /* Ensure it takes full height of the row */
        } */

        .interview-table tr:last-child td {
            border-bottom: none;
        }

        .interview-table .employee-cell {
            display: flex;
            align-items: center; /* Ensures avatar and text are aligned */
            gap: 10px;
        }

        .interview-table .employee-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            background-color: var(--member-avatar-bg-default);
            color: var(--member-avatar-color-default);
            transition: background-color 0.3s ease, color 0.3s ease;
            flex-shrink: 0; /* Prevent avatar from shrinking */
        }

        .interview-table .round-badge {
            background-color: var(--status-applied-bg); /* Use a blueish badge for rounds */
            color: var(--status-applied-color);
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            white-space: nowrap;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .interview-table .date-cell {
            /* No flex here, let text-align on td handle it if it's just text */
            /* If you want an icon here again, you'd add display: flex; align-items: center; */
            white-space: nowrap;
        }

        /* Removed .action-buttons as the td itself is now the flex container */
        /* .interview-table .action-buttons {
            display: flex;
            gap: 5px;
            white-space: nowrap;
            justify-content: center;
            align-items: center;
            height: 100%;
        } */

        .interview-table .action-button {
            padding: 0; /* Remove padding to make it a perfect square */
            border-radius: 6px;
            border: 1px solid var(--action-button-border);
            background-color: var(--action-button-bg);
            color: var(--action-button-color);
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.3s ease;
            display: flex; /* Make it a flex container to center icon */
            align-items: center; /* Center icon vertically */
            justify-content: center; /* Center icon horizontally */
            width: 30px; /* Fixed width for square button */
            height: 30px; /* Fixed height for square button */
        }

        .interview-table .action-button:hover {
            background-color: var(--action-button-hover-bg);
            border-color: var(--action-button-hover-border);
        }

        .interview-table .action-button i {
            color: var(--icon-color);
            transition: color 0.3s ease;
        }

        .interviews-header .total-interviews-badge {
            background-color: var(--status-verified-bg); /* Greenish badge */
            color: var(--status-verified-color);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 15px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Styles for the Assigned tab employee search bar */
        .assigned-employee-search-bar {
            justify-content: flex-end; /* Pushes content to the right */
        }

        .assigned-employee-search-bar .search-input-wrapper {
            flex: none; /* Prevent it from growing */
            width: 250px; /* Set a fixed width */
            min-width: unset; /* Override min-width from general rule */
        }

        @media (max-width: 767px) {
            .assigned-employee-search-bar {
                justify-content: flex-start; /* Revert to default on small screens */
            }
            .assigned-employee-search-bar .search-input-wrapper {
                width: 100%; /* Full width on small screens */
            }
        }

        /* NEW: Notification Modal Styles */
        .notification-modal-content {
          max-width: 500px; /* Smaller modal for notifications */
        }

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .notification-item {
          padding-bottom: 15px;
          border-bottom: 1px solid var(--notification-item-border);
          transition: border-color 0.3s ease;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 5px;
        }

        .notification-item-message {
          font-size: 14px;
          color: var(--subtitle-color);
          margin-bottom: 8px;
        }

        .notification-item-time {
          font-size: 12px;
          color: var(--notification-item-time-color);
          text-align: right;
        }

        /* NEW: User Profile Modal Styles */
        .user-profile-modal-content {
          max-width: 500px;
        }

        .profile-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 15px;
        }

        .profile-detail-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--profile-label-color);
        }

        .profile-detail-value {
          font-size: 16px;
          color: var(--profile-value-color);
          font-weight: 600;
        }

        .profile-detail-item input[type="text"],
        .profile-detail-item input[type="email"],
        .profile-detail-item input[type="tel"] {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--form-input-border);
          border-radius: 8px;
          background-color: var(--form-input-bg);
          color: var(--form-input-text);
          font-size: 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease;
        }

        .profile-detail-item input[type="text"]:focus,
        .profile-detail-item input[type="email"]:focus,
        .profile-detail-item input[type="tel"]:focus {
          outline: none;
          border-color: var(--form-input-focus-border);
          box-shadow: 0 0 0 0.2rem var(--form-input-focus-shadow);
        }

        .profile-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .profile-actions .edit-button {
          background-color: var(--edit-button-bg);
          color: var(--edit-button-color);
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        .profile-actions .edit-button:hover {
          background-color: var(--edit-button-hover-bg);
        }

        .profile-actions .close-button {
          background-color: var(--close-button-bg);
          color: var(--close-button-color);
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid var(--form-input-border);
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
        }
        .profile-actions .close-button:hover {
          background-color: var(--close-button-hover-bg);
        }

        /* Styles for the Clear Filter button */
        .clear-filter-button {
            background-color: var(--modal-export-button-bg); /* Reusing a neutral button style */
            color: var(--modal-export-button-color);
            padding: 8px 15px;
            border-radius: 8px;
            border: 1px solid var(--modal-search-border);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
            white-space: nowrap;
        }

        .clear-filter-button:hover {
            background-color: var(--modal-export-button-hover-bg);
            border-color: var(--modal-export-button-hover-border);
        }

        /* LLM Summary Section */
        .llm-summary-section {
            background-color: var(--llm-section-bg);
            border: 1px solid var(--llm-section-border);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            font-size: 14px;
            color: var(--llm-text-color);
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }

        .llm-summary-section h4 {
            font-size: 16px;
            font-weight: 600;
            color: var(--llm-text-color);
            margin-top: 0;
            margin-bottom: 10px;
            transition: color 0.3s ease;
        }

        .llm-summary-section p {
            margin: 0;
            line-height: 1.5;
        }

        .llm-loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            font-size: 15px;
            color: var(--llm-loading-color);
            font-weight: 500;
        }

        .llm-loading-indicator i {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `}
      </style>

      {/* Header Section */}
      <header className="header-section">
        <h1 className="header-logo">
          Tech<span className="x-highlight">X</span>plorers
        </h1>
        <div className="header-actions">
          {/* Notification button */}
          <button className="header-button" onClick={openNotificationsModal}>
            <i className="fas fa-bell"></i>
            <span className="notification-badge">{notifications.length}</span>
          </button>
          {/* Theme toggle button - moved next to notification */}
          {/* <button className="header-button" onClick={toggleTheme}>
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
          </button> */}
          {/* User Profile with Dropdown */}
          <div className="user-profile" onClick={toggleProfileDropdown} ref={profileDropdownRef}>
            <div className='user-info'>
              <span>{userName}</span>
              <span className="manager-badge">Manager</span>
            </div>
            <div className="user-avatar">{userAvatarLetter}</div>
            <i className="fas fa-chevron-down dropdown-arrow"></i>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item" onClick={handleProfileClick}>
                  <i className="fas fa-user-circle"></i> Profile
                </div>
                <div className="profile-dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Title and Subtitle */}
      <section className="tab-section-header">
        <h1>Welcome, {userName}!</h1>
        <p>Manage your employee assignments and applications efficiently.</p>
      </section>

      {/* Radio Button Navigation */}
      <nav className="radio-group">
        <div className="radio-option">
          <input
            type="radio"
            id="assignmentsRadio"
            name="tabSelection"
            value="Assignments"
            checked={activeTab === 'Assignments'}
            onChange={handleRadioChange}
          />
          <label htmlFor="assignmentsRadio">Clients</label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="assignedRadio"
            name="tabSelection"
            value="Assigned"
            checked={activeTab === 'Assigned'}
            onChange={handleRadioChange}
          />
          <label htmlFor="assignedRadio">Employees</label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="applicationsRadio"
            name="tabSelection"
            value="Applications"
            checked={activeTab === 'Applications'}
            onChange={handleRadioChange}
          />
          <label htmlFor="applicationsRadio">Applications</label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="interviewsRadio"
            name="tabSelection"
            value="Interviews"
            checked={activeTab === 'Interviews'}
            onChange={handleRadioChange}
          />
          <label htmlFor="interviewsRadio">Interviews</label>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'Assignments' && (
          <section className="client-assignment-overview">
            <div className="client-assignment-header">
              <h2 className="client-assignment-title">Client Assignment Overview</h2>
              {/* Removed Assign New Client button */}
            </div>
            <div className="assignment-cards-grid">
              {/* Unassigned Card - now clickable to open modal */}
              <div className="assignment-card" onClick={() => setIsUnassignedClientsModalOpen(true)}>
                <div className="assignment-card-value">{totalUnassignedCount}</div>
                <div className="assignment-card-title">Clients Unassigned</div>
                <div className="assignment-card-description">View all unassigned clients</div>
              </div>

              {/* Total Clients Card (formerly Assigned) - now clickable to open new modal */}
              <div className="assignment-card assigned" onClick={openTotalClientsModal}>
                <div className="assignment-card-value">{totalClientsCount}</div>
                <div className="assignment-card-title">Total assigned Clients</div>
                <div className="assignment-card-description">View all assigned clients</div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Assigned' && (
          <section className="assigned-employee-overview client-assignment-overview">
            <div className="client-assignment-header">
              {/* Changed title to "Assigned Clients" */}
              <h2 className="client-assignment-title">All Employees</h2>
              {/* Display total assigned clients here, matching the screenshot */}
              <div className="clients-count-badge">
                Total {totalAssignedClientsByEmployee} clients
              </div>

              <button className="assign-client-button" onClick={() => setIsAddEmployeeModalOpen(true)}>
                <i className="fas fa-user-plus"></i> Add Employee
              </button>
              {/* Removed "Manage Employees" button */}
            </div>



            {/* NEW: Search bar for employees in Assigned tab */}
            <div className="applications-filters assigned-employee-search-bar" style={{ marginBottom: '20px' }}> {/* Reusing styles and added new class */}
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={assignedEmployeeSearchQuery}
                  onChange={handleAssignedEmployeeSearchChange}
                />
              </div>
            </div>

            <div className="employee-cards-grid">
              {filteredEmployees.map((employee) => (
                <div key={employee.firebaseKey} className="employee-card">
                  <div className="employee-card-header">
                    <div className="employee-avatar-large">{employee.avatar}</div>
                    <div className="employee-info">
                      <div className="employee-name">{employee.fullName}</div>
                      <div className="employee-role">{employee.role}</div>
                    </div>
                    <div className="clients-count-badge">
                      {employee.assignedClients} clients
                    </div>
                  </div>
                  <div className="employee-card-details">
                    <div className="success-rate">Success Rate: <span className="success-rate-value">{employee.successRate}%</span></div>
                    <button className="view-employee-details-button" onClick={() => openEmployeeClientsModal(employee)}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              ))}
              {filteredEmployees.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-color)', gridColumn: '1 / -1' }}>
                  No employees found matching your search.
                </p>
              )}
            </div>
          </section>
        )}

       {/* --- NEW Applications Tab UI --- */}
        {activeTab === 'Applications' && (
          <ApplicationsTab
            applicationData={applicationData}
            employees={displayEmployees}
            filterDateRange={filterDateRange}
            handleDateRangeChange={handleDateRangeChange}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            quickFilter={quickFilter}
            handleQuickFilterChange={handleQuickFilterChange}
            areFiltersActive={areFiltersActive}
            handleClearFilters={handleClearFilters}
          />
        )}

        {activeTab === 'Interviews' && (
          <section className="interviews-section client-assignment-overview">
            <div className="client-assignment-header interviews-header">
              <h2 className="client-assignment-title">Interview Management</h2>
              <span className="total-interviews-badge">{filteredInterviewData.length} total interviews</span>
            </div>

            <FilterComponent
              filterDateRange={filterDateRange}
              handleDateRangeChange={handleDateRangeChange}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              quickFilter={quickFilter}
              handleQuickFilterChange={handleQuickFilterChange}
              areFiltersActive={areFiltersActive}
              handleClearFilters={handleClearFilters}
              sortOptions={['Newest First', 'Oldest First']}
            />

            <div className="applications-filters"> {/* Reusing applications-filters for consistent styling */}
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={interviewSearchQuery}
                  onChange={handleInterviewSearchChange}
                />
              </div>
              <div className="filter-dropdown">
                <select
                  value={interviewFilterRound}
                  onChange={handleInterviewFilterRoundChange}
                >
                  <option value="All Rounds">All Rounds</option>
                  <option value="1st Round">1st Round</option>
                  <option value="2st Round">2st Round</option>
                  <option value="3rd Round">3rd Round</option>
                  {/* Add more rounds as needed based on your data */}
                </select>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>

            <div className="table-responsive">
              <table className="interview-table">
                <thead><tr>
                  <th>EMPLOYEE</th>
                  <th>CLIENT</th>
                  <th>JOB TITLE</th>
                  <th>COMPANY</th>
                  <th>ROUND</th>
                  <th>DATE</th>
                  <th>STATUS</th> {/* New column header for Status */}
                  {/* REMOVED: <th>ACTIONS</th> */}
                </tr></thead>
                <tbody>
                  {filteredInterviewData.map((interview) => (
                    <tr key={interview.id}>
                      <td className="employee-cell">
                        <div className="employee-avatar">{interview.employeeAvatar}</div>
                        {interview.employeeName}
                      </td>
                      <td>{interview.clientName}</td>
                      <td>{interview.jobTitle}</td>
                      <td>{interview.company}</td>
                      <td>
                        <span className="round-badge">{interview.round}</span>
                      </td>
                      <td className="date-cell">
                        {formatDateToDDMMYYYY(interview.date)}
                      </td>
                      <td>
                        {interview.status} {/* Display the new status */}
                      </td>
                      {/* REMOVED:
                      <td className="action-buttons">
                        <button className="action-button" onClick={() => openEditClientModal(interview.clientName)}>
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                      */}
                    </tr>
                  ))}
                  {filteredInterviewData.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-color)' }}> {/* Updated colspan */}
                        No interviews to display matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
      {/* Unassigned Clients Modal */}
      {isUnassignedClientsModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Unassigned Clients Management</h3>
              <button className="modal-close-button" onClick={closeUnassignedClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-priority-overview">
              <div className="priority-card">
                <div className="priority-card-value">{totalUnassignedCount}</div>
                <div className="priority-card-title">Total Unassigned</div>
              </div>
              <div className="priority-card high">
                <div className="priority-card-value">{highPriorityCount}</div>
                <div className="priority-card-title">High Priority</div>
              </div>
              <div className="priority-card medium">
                <div className="priority-card-value">{mediumPriorityCount}</div>
                <div className="priority-card-title">Medium Priority</div>
              </div>
              <div className="priority-card low">
                <div className="priority-card-value">{lowPriorityCount}</div>
                <div className="priority-card-title">Low Priority</div>
              </div>
            </div>

            <div className="modal-actions-top">
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search clients by name, position..."
                  value={unassignedSearchQuery}
                  onChange={handleUnassignedSearchChange}
                />
              </div>
              <div className="filter-dropdown">
                {/* Updated select with value and onChange handler */}
                <select value={filterPriority} onChange={handleFilterPriorityChange}>
                  <option value="all">Filter by priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <i className="fas fa-chevron-down"></i>
              </div>
              <button className="modal-quick-assign-button" onClick={handleQuickAssign}>
                <i className="fas fa-bolt"></i> Quick Assign
              </button>
              <button className="modal-export-button">
                <i className="fas fa-download"></i> Export List
              </button>
            </div>

            <h4 className="modal-title" style={{ marginBottom: '10px' }}>Available Clients</h4>
            <div className="modal-available-clients-list">
              {/* Render filtered clients */}
              {filteredClients.map((client) => {
                // This logic safely handles both data structures
                const clientName = client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim();

                // THE FIX: Use .skills OR .technologySkills, and default to an empty array if neither exists
                const clientSkills = client.skills || client.technologySkills || [];

                const clientExperience = client.experience || `Experience not specified`;
                const clientEmail = client.email || client.personalMail;
                const clientSalary = client.salary || `$${client.expectedSalary || 'N/A'}`;

                return (
                  <div key={client.registrationKey} className="modal-client-card">
                    <div className="modal-client-card-header">
                      <span className="modal-client-name">{clientName}</span>
                      {client.priority && (
                        <span className={`modal-client-priority-badge ${client.priority}`}>{client.priority} priority</span>
                      )}
                    </div>
                    <div className="modal-client-skills">
                      {/* This now safely maps over the clientSkills array, which is guaranteed to exist */}
                      {clientSkills.map((skill, index) => (
                        <span key={index} className="modal-client-skill-tag">{skill}</span>
                      ))}
                    </div>
                     <div className="modal-client-details">
                      {simplifiedServices.includes(client.service) ? (
                        // Simplified View for the 5 main services
                        <>
                          <span><i className="fas fa-concierge-bell"></i><strong>Service:</strong> {client.service || 'N/A'}</span>
                          <span><i className="fas fa-envelope"></i> {client.email || 'N/A'}</span>
                          <span><i className="fas fa-calendar-alt"></i><strong>Registered:</strong> {client.registeredDate || 'N/A'}</span>
                          <span><i className="fas fa-user-tag"></i><strong>Type:</strong> {client.userType || 'N/A'}</span>
                        </>
                      ) : (
                        // Detailed View for "Job Supporting & Consulting"
                        <>
                       <span><i className="fas fa-concierge-bell"></i><strong>Service:</strong> {client.service || 'N/A'}</span>
                          <span><i className="fas fa-envelope"></i> {client.email || 'N/A'}</span>
                          <span><i className="fas fa-calendar-alt"></i><strong>Registered:</strong> {client.registeredDate || 'N/A'}</span>
                          <span><i className="fas fa-user-tie"></i><strong>Designation:</strong> {client.currentDesignation || 'N/A'}</span>
                          <span><i className="fas fa-money-bill-wave"></i><strong>Salary:</strong> {client.currentSalary ? `$${client.currentSalary}` : 'N/A'}</span>
                        </>
                      )}
                    </div>

                    <div className="modal-client-actions">
                      <button className="modal-assign-button" onClick={() => openAssignClientModal(client)}>
                        <i className="fas fa-user-plus"></i> Assign Employee
                      </button>
                      <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                        <i className="fas fa-eye"></i> View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredClients.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>No clients match the selected filter or search query.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Client to Employee Modal (for NEW assignments) */}
      {/* Assign Client to Employee Modal (for NEW assignments) */}
      {isAssignClientModalOpen && selectedClientToAssign && (
        <div className="modal-overlay open">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">
                Assign Client: {selectedClientToAssign.name || `${selectedClientToAssign.firstName} ${selectedClientToAssign.lastName}`}
              </h3>
              <button className="assign-modal-close-button" onClick={closeAssignClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* MODIFIED: Replaced the <select> with a clickable <div> */}
            <div className="assign-form-group">
              <label>Select Employee</label>
              <div className="pseudo-input" onClick={() => setIsEmployeeSelectModalOpen(true)}>
                {selectedEmployee
                  ? employeesForAssignment.find(e => e.firebaseKey === parseInt(selectedEmployee))?.fullName
                  : "Click to choose an employee..."
                }
              </div>
            </div>

            {/* The confirmation box still works perfectly! */}
            {selectedEmployee && (() => {
              const employeeDetails = employeesForAssignment.find(e => e.firebaseKey === selectedEmployee);
              if (!employeeDetails) return null;

              return (
                <div className="selected-employee-details">
                  <h4>Selected Employee Details</h4>
                  <p><strong>Name:</strong> {employeeDetails.fullName}</p>
                  <p><strong>Role:</strong> {employeeDetails.role}</p>
                  <p><strong>Current Workload:</strong> {employeeDetails.assignedClients} assigned clients</p>
                </div>
              );
            })()}

            {/* --- The rest of the form remains the same --- */}
            <div className="assign-form-group">
              <label htmlFor="priorityLevel">Priority Level</label>
              <select id="priorityLevel" value={assignmentPriority} onChange={(e) => setAssignmentPriority(e.target.value)}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="assign-form-group">
              <label htmlFor="assignmentNotes">Assignment Notes</label>
              <textarea id="assignmentNotes" placeholder="Any specific instructions or requirements..." value={assignmentNotes} onChange={(e) => setAssignmentNotes(e.target.value)}></textarea>
            </div>
            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={closeAssignClientModal}>Cancel</button>
              <button className="assign-form-button assign" onClick={handleAssignmentSubmit}>Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Modal Popup for Selecting an Employee */}
      {isEmployeeSelectModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Select an Employee</h3>
              <button className="modal-close-button" onClick={() => setIsEmployeeSelectModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="employee-select-list">
              {employeesForAssignment.map(employee => (
                <div
                  key={employee.firebaseKey}
                  className="employee-select-item"
                  onClick={() => {
                    setSelectedEmployee(employee.firebaseKey); // Set the selected employee's ID
                    setIsEmployeeSelectModalOpen(false); // Close this modal
                  }}
                >
                  <div className="employee-select-info">
                    <strong>{`${employee.firstName} ${employee.lastName}`}</strong>
                    <span>{employee.role || (employee.roles && employee.roles.join(', '))}</span>
                  </div>
                  <div className="clients-count-badge">
                    {displayEmployees.find(e => e.firebaseKey === employee.firebaseKey)?.assignedClients || 0} clients
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Total Clients Modal */}
      {isTotalClientsModalOpen && (
        <div className="modal-overlay open">
          <div className="total-clients-modal-content">
            <div className="total-clients-modal-header">
              <div>
                <h3 className="total-clients-modal-title">
                  <i className="fas fa-users"></i> Total Assigned Clients
                </h3>
                <p className="total-clients-modal-subtitle">
                  Overview of all clients currently assigned to employees ({assignedClients.length} total)
                </p>
              </div>
              <button className="modal-close-button" onClick={closeTotalClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="table-responsive">
              <table className="total-clients-table">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>POSITION</th>
                    <th>COMPANY</th>
                    <th>ASSIGNED TO</th>
                    <th>PRIORITY</th>
                    {/* REMOVED: <th>STATUS</th> */}
                    <th>ASSIGNED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.map((client) => (
                    <tr key={client.registrationKey}>
                      <td>
                        <div className="employee-cell"> {/* Reusing employee-cell for client avatar/name layout */}
                          <div className="employee-avatar">
                            {getInitials(client.clientName)}</div>
                          <div className="client-info">
                            <div className="main-text">{client.clientName}</div>
                            <div className="sub-text">{client.location}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="position-info">
                          <div className="main-text">{client.position}</div>
                          <div className="sub-text">{client.salary}</div>
                        </div>
                      </td>
                      <td>{client.company}</td>
                      <td>
                        <div className="employee-cell">
                          <div className="employee-avatar">
                            {getInitials(client.assignedTo)}
                          </div>
                          {client.assignedTo}
                        </div>
                      </td>
                      <td>
                        <span className={`modal-client-priority-badge ${client.priority}`}>
                          {(client.priority || '').charAt(0).toUpperCase() + (client.priority || '').slice(1)}
                        </span>
                      </td>
                      {/* REMOVED:
                      <td>
                        <span className={`status-badge status-${client.status}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      */}
                      <td>
                        <div className="employee-cell">
                          <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>{formatDateToDDMMYYYY(client.assignedDate)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {assignedClients.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-color)' }}> {/* Adjusted colspan */}
                        No assigned clients to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Employee Clients Detail Modal */}
      {isEmployeeClientsModalOpen && selectedEmployeeForClients && (
        <div className="modal-overlay open">
          <div className="employee-clients-modal-content">
            <div className="employee-clients-modal-header">
              <h3 className="employee-clients-modal-title">
                {/* FIX: Changed .name to .fullName */}
                Clients Assigned to {selectedEmployeeForClients.fullName}
              </h3>
              <button className="modal-close-button" onClick={closeEmployeeClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="employee-clients-list">
              {assignedClients
                // FIX: Changed .name to .fullName for correct filtering
                .filter(client => client.assignedTo === selectedEmployeeForClients.fullName)
                .map(client => (
                  <div key={client.firebaseKey} className="employee-client-card">
                    <div className="employee-client-card-header">
                      <span className="employee-client-name">{client.clientName}</span>
                      <span className={`modal-client-priority-badge ${client.priority}`}>
                        {client.priority.charAt(0).toUpperCase() + client.priority.slice(1)}
                      </span>
                    </div>
                    <div className="employee-client-position">
                      {client.position} at {client.company}
                    </div>
                    <div className="employee-client-details-row">
                      <span className="employee-client-details-item">
                        <i className="fas fa-money-bill-wave"></i> {client.salary}
                      </span>
                      <span className="employee-client-details-item">
                        <i className="fas fa-map-marker-alt"></i> {client.location}
                      </span>
                      <span className="employee-client-details-item">
                        <i className="fas fa-calendar-alt"></i> Assigned: {formatDateToDDMMYYYY(client.assignedDate)}
                      </span>
                      <span className="employee-client-details-item">
                        <i className="fas fa-info-circle"></i> Status: {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>
                    <div className="modal-client-actions" style={{ justifyContent: 'flex-start' }}>
                      <button className="modal-assign-button" onClick={() => openReassignClientModal(client)}>
                        <i className="fas fa-exchange-alt"></i> Change Employee
                      </button>
                      <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                        <i className="fas fa-eye"></i> View Profile
                      </button>
                    </div>
                  </div>
                ))}
              {/* FIX: Changed .name to .fullName for correct filtering */}
              {assignedClients.filter(client => client.assignedTo === selectedEmployeeForClients.fullName).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                  {/* FIX: Changed .name to .fullName */}
                  No clients currently assigned to {selectedEmployeeForClients.fullName}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Reassign Client Modal (reusing assign-modal-content) */}
      {isReassignClientModalOpen && clientToReassign && (
        <div className="modal-overlay open">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">Reassign Client: {clientToReassign.clientName}</h3>
              <button className="assign-modal-close-button" onClick={closeReassignClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--subtitle-color)', margin: '0' }}>
              Select a new employee for {clientToReassign.clientName}.
            </p>

            <div className="assign-form-group">
              <label htmlFor="currentEmployee">Current Employee</label>
              <input
                type="text"
                id="currentEmployee"
                value={clientToReassign.assignedTo}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>

            <div className="assign-form-group">
              <label htmlFor="selectNewEmployee">Select New Employee</label>
              <select
                id="selectNewEmployee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Choose new employee</option>
                {employeesForAssignment
                  .filter(emp => `${emp.firstName} ${emp.lastName}` !== clientToReassign.assignedTo) // Exclude current employee
                  .map((employee) => (
                    <option key={employee.firebaseKey} value={employee.firebaseKey}>
                      {`${employee.firstName} ${employee.lastName}`} - {employee.role || (employee.roles && employee.roles.join(', '))}
                    </option>
                  ))}
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="reassignPriorityLevel">Priority Level</label>
              <select
                id="reassignPriorityLevel"
                value={assignmentPriority}
                onChange={(e) => setAssignmentPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="reassignAssignmentNotes">Reassignment Notes</label>
              <textarea
                id="reassignAssignmentNotes"
                placeholder="Any specific instructions for reassignment..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={closeReassignClientModal}>
                Cancel
              </button>
              <button className="assign-form-button assign" onClick={handleAssignmentSubmit}>
                Reassign Client
              </button>
            </div>
          </div>
        </div>
      )}


      {/* NEW: Client Edit Modal (repurposing the preview modal for editing) */}
      {isEditClientModalOpen && clientToEdit && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">
                {isEditingClient ? 'Edit Client Details' : 'View Client Details'}: {clientToEdit.name || clientToEdit.clientName}
              </h3>
              <button className="assign-modal-close-button" onClick={closeEditClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Comprehensive Client Details Grid - now with input fields */}
            {simplifiedServices.includes(clientToEdit.service) ? (
              // --- RENDER SIMPLIFIED VIEW ---
              <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">Service Request Details</h4>
                  <div className="assign-form-group">
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={clientToEdit.firstName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={clientToEdit.lastName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Mobile *</label>
                    <input type="tel" name="mobile" value={clientToEdit.mobile || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Email ID *</label>
                    <input type="email" name="email" value={clientToEdit.email || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Service *</label>
                    <input type="text" name="service" value={clientToEdit.service || ''} readOnly style={{ cursor: 'not-allowed' }} />
                  </div>
                  {clientToEdit.subServices && (
                    <div className="assign-form-group">
                      <label>Selected Sub-Services</label>
                      <textarea name="subServices" value={Array.isArray(clientToEdit.subServices) ? clientToEdit.subServices.join(', ') : ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                    </div>
                  )}
                  <div className="assign-form-group">
                    <label>User Type</label>
                    <input type="text" name="userType" value={clientToEdit.userType || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                  </div>
                </div>
              </div>
            ) : (
              <>
            <div className="client-preview-grid-container">
              {/* Personal Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Personal Information</h4>
                <div className="assign-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={clientToEdit.firstName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input type="text" id="middleName" name="middleName" value={clientToEdit.middleName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={clientToEdit.lastName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" name="dob" value={clientToEdit.dob || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="gender">Gender</label>
                  <input type="text" id="gender" name="gender" value={clientToEdit.gender || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="ethnicity">Ethnicity</label>
                  <input type="text" id="ethnicity" name="ethnicity" value={clientToEdit.ethnicity || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Contact Information</h4>
                <div className="assign-form-group">
                  <label htmlFor="address">Address</label>
                  <textarea id="address" name="address" value={clientToEdit.address || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input type="text" id="zipCode" name="zipCode" value={clientToEdit.zipCode || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="mobile">Mobile</label>
                  <input type="tel" id="mobile" name="mobile" value={clientToEdit.mobile || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={clientToEdit.email || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* Job Preferences & Status */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Preferences & Status</h4>
                <div className="assign-form-group">
                  <label htmlFor="securityClearance">Security Clearance</label>
                  <select id="securityClearance" name="securityClearance" value={clientToEdit.securityClearance || 'No'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {clientToEdit.securityClearance === 'Yes' && (
                  <div className="assign-form-group">
                    <label htmlFor="clearanceLevel">Clearance Level</label>
                    <input type="text" id="clearanceLevel" name="clearanceLevel" value={clientToEdit.clearanceLevel || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                  </div>
                )}
                <div className="assign-form-group">
                  <label htmlFor="willingToRelocate">Willing to Relocate</label>
                  <select id="willingToRelocate" name="willingToRelocate" value={clientToEdit.willingToRelocate || 'No'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="workPreference">Work Preference</label>
                  <input type="text" id="workPreference" name="workPreference" value={clientToEdit.workPreference || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="restrictedCompanies">Restricted Companies</label>
                  <input type="text" id="restrictedCompanies" name="restrictedCompanies" value={clientToEdit.restrictedCompanies || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="jobsToApply">Jobs to Apply</label>
                  <input type="text" id="jobsToApply" name="jobsToApply" value={clientToEdit.jobsToApply || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="technologySkills">Technology Skills</label>
                  <textarea id="technologySkills" name="technologySkills" value={clientToEdit.technologySkills || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="currentSalary">Current Salary</label>
                  <input type="text" id="currentSalary" name="currentSalary" value={clientToEdit.currentSalary || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="expectedSalary">Expected Salary</label>
                  <input type="text" id="expectedSalary" name="expectedSalary" value={clientToEdit.expectedSalary || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="visaStatus">Visa Status</label>
                  <input type="text" id="visaStatus" name="visaStatus" value={clientToEdit.visaStatus || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                {clientToEdit.visaStatus === 'Other' && (
                  <div className="assign-form-group">
                    <label htmlFor="otherVisaStatus">Other Visa Status</label>
                    <input type="text" id="otherVisaStatus" name="otherVisaStatus" value={clientToEdit.otherVisaStatus || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                  </div>
                )}
                <div className="assign-form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" value={clientToEdit.priority || 'medium'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="status">Status</label>
                  <input type="text" id="status" name="status" value={clientToEdit.status || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                {/* NEW: Platform, Job ID, Applied Date for editing */}
                <div className="assign-form-group">
                  <label htmlFor="platform">Platform</label>
                  <input type="text" id="platform" name="platform" value={clientToEdit.platform || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="jobId">Job ID</label>
                  <input type="text" id="jobId" name="jobId" value={clientToEdit.jobId || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="appliedDate">Applied Date</label>
                  <input type="date" id="appliedDate" name="appliedDate" value={clientToEdit.appliedDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* Education Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Education Details</h4>
                <div className="assign-form-group">
                  <label htmlFor="schoolName">School Name</label>
                  <input type="text" id="schoolName" name="schoolName" value={clientToEdit.schoolName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="schoolAddress">School Address</label>
                  <textarea id="schoolAddress" name="schoolAddress" value={clientToEdit.schoolAddress || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="schoolPhone">School Phone</label>
                  <input type="tel" id="schoolPhone" name="schoolPhone" value={clientToEdit.schoolPhone || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="courseOfStudy">Course of Study</label>
                  <input type="text" id="courseOfStudy" name="courseOfStudy" value={clientToEdit.courseOfStudy || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="graduationDate">Graduation Date</label>
                  <input type="date" id="graduationDate" name="graduationDate" value={clientToEdit.graduationDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* Employment Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Employment Details</h4>
                <div className="assign-form-group">
                  <label htmlFor="currentCompany">Current Company</label>
                  <input type="text" id="currentCompany" name="currentCompany" value={clientToEdit.currentCompany || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="currentDesignation">Current Designation</label>
                  <input type="text" id="currentDesignation" name="currentDesignation" value={clientToEdit.currentDesignation || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="preferredInterviewTime">Preferred Interview Time</label>
                  <input type="text" id="preferredInterviewTime" name="preferredInterviewTime" value={clientToEdit.preferredInterviewTime || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="earliestJoiningDate">Earliest Joining Date</label>
                  <input type="date" id="earliestJoiningDate" name="earliestJoiningDate" value={clientToEdit.earliestJoiningDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="relievingDate">Relieving Date</label>
                  <input type="date" id="relievingDate" name="relievingDate" value={clientToEdit.relievingDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* References */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">References</h4>
                <div className="assign-form-group">
                  <label htmlFor="referenceName">Reference Name</label>
                  <input type="text" id="referenceName" name="referenceName" value={clientToEdit.referenceName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referencePhone">Reference Phone</label>
                  <input type="tel" id="referencePhone" name="referencePhone" value={clientToEdit.referencePhone || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceAddress">Reference Address</label>
                  <textarea id="referenceAddress" name="referenceAddress" value={clientToEdit.referenceAddress || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceEmail">Reference Email</label>
                  <input type="email" id="referenceEmail" name="referenceEmail" value={clientToEdit.referenceEmail || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceRole">Reference Role</label>
                  <input type="text" id="referenceRole" name="referenceRole" value={clientToEdit.referenceRole || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* Job Portal Accounts */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Portal Accounts</h4>
                <div className="assign-form-group">
                  <label htmlFor="jobPortalAccountName">Account Name</label>
                  <input type="text" id="jobPortalAccountName" name="jobPortalAccountName" value={clientToEdit.jobPortalAccountName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="jobPortalCredentials">Credentials</label>
                  <input type="text" id="jobPortalCredentials" name="jobPortalCredentials" value={clientToEdit.jobPortalCredentials || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                </div>
              </div>

              {/* NEW: Resume Download Section */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Resume</h4>
                <div className="assign-form-group">
                  <label htmlFor="resumeFileName">Resume File:</label>
                  <input
                    type="text"
                    id="resumeFileName"
                    name="resume"
                    value={clientToEdit.resume || 'N/A'}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <button
                  className="assign-form-button assign"
                  onClick={() => handleResumeDownload(clientToEdit.resume)}
                  disabled={!clientToEdit.resume}
                  style={{ marginTop: '10px' }}
                >
                  <i className="fas fa-download"></i> Download Resume
                </button>
              </div>

            </div>

            {/* Skills section for editing */}
            {clientToEdit.skills && (
              <div className="client-preview-skills-section">
                <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                <div className="assign-form-group">
                  <textarea
                    id="skills"
                    name="skills"
                    value={Array.isArray(clientToEdit.skills) ? clientToEdit.skills.join(', ') : clientToEdit.skills || ''}
                    onChange={(e) => setClientToEdit(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                    readOnly={!isEditingClient}
                  ></textarea>
                </div>
              </div>
            )}
            </> // FIX: Closing fragment tag was missing
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={closeEditClientModal}>
                Cancel
              </button>
              {isEditingClient ? (
                <button className="assign-form-button assign" onClick={handleUpdateClient}>
                  Save Changes
                </button>
              ) : (
                <button className="assign-form-button assign" onClick={() => setIsEditingClient(true)}>
                  Edit Profile
                </button>
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
            <form className="modal-form" onSubmit={handleCreateEmployeeAccount}>
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
                  value={newEmployee.firstName}
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
                  value={newEmployee.lastName}
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
                  value={newEmployee.dateOfBirth}
                  onChange={handleNewemployeeChange}
            
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={newEmployee.gender}
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
                  value={newEmployee.maritalStatus}
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
                  value={newEmployee.personalNumber}
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
                  value={newEmployee.alternativeNumber}
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
                  value={newEmployee.personalEmail}
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
                  value={newEmployee.workEmail}
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
                  value={newEmployee.address}
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
                  value={newEmployee.city}
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
                  value={newEmployee.state}
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
                  value={newEmployee.zipcode}
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
                  value={newEmployee.country}
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
                  value={newEmployee.role}
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
                  {roleOptions.find(option => option.value === newEmployee.role)?.description}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={newEmployee.department}
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
                  value={newEmployee.accountStatus}
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
                    value={newEmployee.temporaryPassword}
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
      {isEditEmployeeModalOpen && currentEmployeeToEdit && (
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

      {/* NEW: Notifications Modal */}
      {isNotificationsModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content notification-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Notifications</h3>
              <button className="modal-close-button" onClick={closeNotificationsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-item-title">{notification.title}</div>
                    <div className="notification-item-message">{notification.message}</div>
                    <div className="notification-item-time">{notification.time}</div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--subtitle-color)' }}>No new notifications.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: User Profile Modal */}
       {isUserProfileModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content user-profile-modal-content" style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">Manager Profile</h3>
              <button className="modal-close-button" onClick={closeUserProfileModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="profile-details-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Personal Info Section */}
                <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--header-border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h4 style={{ color: 'var(--card-icon-blue-color)', margin: 0 }}>Personal Information</h4>
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" name="firstName" value={editableProfile.firstName || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" value={editableProfile.lastName || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="dateOfBirth">Date of Birth:</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={editableProfile.dateOfBirth || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="gender">Gender:</label>
                    <input type="text" id="gender" name="gender" value={editableProfile.gender || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>

                {/* Contact & Address Section */}
                <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--header-border-color)', paddingBottom: '10px', margin: '15px 0' }}>
                    <h4 style={{ color: 'var(--card-icon-blue-color)', margin: 0 }}>Contact & Address</h4>
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="personalEmail">Personal Email:</label>
                    <input type="email" id="personalEmail" name="personalEmail" value={editableProfile.personalEmail || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="workEmail">Work Email:</label>
                    <input type="email" id="workEmail" name="workEmail" value={editableProfile.workEmail || ''} readOnly style={{ cursor: 'not-allowed', backgroundColor: '#f1f1f1' }}/>
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="personalNumber">Personal Number:</label>
                    <input type="tel" id="personalNumber" name="personalNumber" value={editableProfile.personalNumber || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item">
                    <label className="profile-detail-label" htmlFor="alternativeNumber">Alternative Number:</label>
                    <input type="tel" id="alternativeNumber" name="alternativeNumber" value={editableProfile.alternativeNumber || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
                </div>
                <div className="profile-detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label className="profile-detail-label" htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" value={editableProfile.address || ''} onChange={handleProfileChange} readOnly={!isEditingUserProfile} />
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
      {/* NEW: Success Confirmation Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ fontSize: '1.1rem' }}>{successMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerWorkSheet;