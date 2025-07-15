import React, { useState, useEffect, useRef } from 'react'; // Import useRef

const ManagerWorkSheet = () => {
  // State to manage the current theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    // Initialize theme from local storage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // State to manage the active tab, now including 'Assigned', 'Interviews', 'Notes'
  const [activeTab, setActiveTab] = useState('Assignments'); // Default to 'Assignments'

  // State for logged-in user's name and avatar initial
  const [userName, setUserName] = useState('Sreenivasulu'); // Changed from Balaji to Chaveen
  const [userAvatarLetter, setUserAvatarLetter] = useState('C'); // Derived from userName

  // NEW STATE: State to control the visibility of the profile dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Ref for the profile dropdown to detect clicks outside
  const profileDropdownRef = useRef(null);


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

  // NEW STATE: Search query for Assigned tab employees
  const [assignedEmployeeSearchQuery, setAssignedEmployeeSearchQuery] = useState(''); // New state for employee search

  // NEW STATE: For Client Preview Modal
  const [isClientPreviewModalOpen, setIsClientPreviewModalOpen] = useState(false);
  const [clientToPreview, setClientToPreview] = useState(null);

  // NEW STATE: For Reassign Client Modal
  const [isReassignClientModalOpen, setIsReassignClientModalOpen] = useState(false);
  const [clientToReassign, setClientToReassign] = useState(null);


  // Initial dummy data for unassigned clients (7 clients)
  const initialUnassignedClientsData = [
    { id: 1, name: 'David Wilson', priority: 'high', skills: ['Python', 'Django', 'PostgreSQL'], experience: '6 years experience', remote: true, email: 'david.wilson@example.com', salary: '$100,000 - $120,000' },
    { id: 2, name: 'Sarah J. Unassigned', priority: 'medium', skills: ['React', 'Node.js', 'MongoDB'], experience: '4 years experience', remote: false, email: 'sarah.j.unassigned@example.com', salary: '$80,000 - $100,000' },
    { id: 3, name: 'Michael Brown', priority: 'low', skills: ['Java', 'Spring Boot'], experience: '3 years experience', remote: true, email: 'michael.b@example.com', salary: '$70,000 - $90,000' },
    { id: 4, name: 'Emily White', priority: 'high', skills: ['Vue.js', 'Firebase', 'TypeScript'], experience: '5 years experience', remote: false, email: 'emily.w@example.com', salary: '$95,000 - $115,000' },
    { id: 5, name: 'Daniel Green', priority: 'medium', skills: ['C#', '.NET', 'SQL Server'], experience: '7 years experience', remote: true, email: 'daniel.g@example.com', salary: '$110,000 - $130,000' },
    { id: 6, name: 'Olivia Black', priority: 'low', skills: ['PHP', 'Laravel', 'MySQL'], experience: '2 years experience', remote: false, email: 'olivia.b@example.com', salary: '$60,000 - $80,000' },
    { id: 7, name: 'James Blue', priority: 'high', skills: ['Go', 'Docker', 'Kubernetes'], experience: '8 years experience', remote: true, email: 'james.b@example.com', salary: '$120,000 - $140,000' },
    // NEW: Added full profiles for clients previously only in applications/interviews
    { id: 8, name: 'Sarah Mitchell', priority: 'medium', skills: ['UX Design', 'Figma', 'User Research'], experience: '5 years experience', remote: false, email: 'sarah.m@example.com', salary: '$90,000 - $110,000' },
    { id: 9, name: 'Michael Chen', priority: 'high', skills: ['Data Analysis', 'SQL', 'Python (Pandas)'], experience: '4 years experience', remote: true, email: 'michael.chen.client@example.com', salary: '$85,000 - $105,000' },
    { id: 10, name: 'Jessica Williams', priority: 'medium', skills: ['Product Design', 'Sketch', 'Prototyping'], experience: '6 years experience', remote: false, email: 'jessica.w@example.com', salary: '$95,000 - $115,000' },
    { id: 11, name: 'David Kim', priority: 'low', skills: ['Backend Development', 'Java', 'Spring'], experience: '3 years experience', remote: true, email: 'david.k@example.com', salary: '$75,000 - $95,000' },
  ];

  // Initial dummy data for assigned clients (5 clients, all for Sarah Johnson for testing)
  const initialAssignedClientsData = [
    { id: 201, clientName: 'John Anderson', location: 'New York, NY', position: 'Senior Frontend Developer', salary: '$120,000 - $150,000', company: 'TechFlow Inc', assignedTo: 'Sarah Johnson', priority: 'high', status: 'interview', assignedDate: '2024-11-15' },
    { id: 205, clientName: 'Alex Thompson', location: 'Boston, MA', position: 'Full Stack Developer', salary: '$110,000 - $140,000', company: 'StartupXYZ', assignedTo: 'Sarah Johnson', priority: 'medium', status: 'applied', assignedDate: '2024-11-20' },
    { id: 208, clientName: 'Maria Rodriguez', location: 'Denver, CO', position: 'React Developer', salary: '$95,000 - $115,000', company: 'WebDev Inc', assignedTo: 'Sarah Johnson', priority: 'high', status: 'applied', assignedDate: '2024-11-28' },
    { id: 209, clientName: 'Chris Evans', location: 'Miami, FL', position: 'DevOps Engineer', salary: '$130,000 - $150,000', company: 'CloudOps', assignedTo: 'Sarah Johnson', priority: 'high', status: 'interview', assignedDate: '2024-12-01' },
    { id: 210, clientName: 'Anna Lee', location: 'Portland, OR', position: 'Data Scientist', salary: '$115,000 - $145,000', company: 'DataInsights', assignedTo: 'Sarah Johnson', priority: 'medium', status: 'applied', assignedDate: '2024-12-03' },
  ];

  // Initial dummy data for employees, reflecting assignedClients counts from initialAssignedClientsData
  const initialDummyEmployees = [
    {
      id: 101,
      name: 'Sarah Johnson',
      role: 'Senior Placement Specialist',
      assignedClients: 5, // Matches 5 clients assigned to her in initialAssignedClientsData
      successRate: 85,
      avatar: 'SJ',
    },
    {
      id: 102,
      name: 'Michael Chen',
      role: 'Placement Specialist',
      assignedClients: 0, // No clients assigned to him initially in this specific dummy data
      successRate: 78,
      avatar: 'MC',
    },
    {
      id: 103,
      name: 'Emily Rodriguez',
      role: 'Junior Placement Specialist',
      assignedClients: 0, // No clients assigned to her initially
      successRate: 72,
      avatar: 'ER',
    },
    {
      id: 104,
      name: 'Daniel Green',
      role: 'Placement Specialist',
      assignedClients: 0, // No clients assigned to him initially
      successRate: 65,
      avatar: 'DG',
    },
  ];

  // NEW DUMMY DATA for the Applications tab, matching the screenshot
  const initialApplicationData = [ // Renamed to initialApplicationData
    {
      id: 301,
      employeeName: 'Sarah Johnson',
      employeeAvatar: 'SJ',
      clientName: 'John Anderson',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechFlow Inc',
    },
    {
      id: 302,
      employeeName: 'Michael Chen',
      employeeAvatar: 'MC',
      clientName: 'Sarah Mitchell', // This client now has a full profile in unassignedClientsData
      jobTitle: 'UX Designer',
      company: 'DesignCorp',
    },
    {
      id: 303,
      employeeName: 'Emily Rodriguez',
      employeeAvatar: 'ER',
      clientName: 'Michael Chen', // This client now has a full profile in unassignedClientsData
      jobTitle: 'Data Analyst',
      company: 'DataTech Solutions',
    },
    {
      id: 304,
      employeeName: 'Sarah Johnson',
      employeeAvatar: 'SJ',
      clientName: 'Alex Thompson',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
    },
    {
      id: 305,
      employeeName: 'Michael Chen',
      employeeAvatar: 'MC',
      clientName: 'Jessica Williams', // This client now has a full profile in unassignedClientsData
      jobTitle: 'Product Designer',
      company: 'Design Studio',
    },
    {
      id: 306,
      employeeName: 'Emily Rodriguez',
      employeeAvatar: 'ER',
      clientName: 'David Kim', // This client now has a full profile in unassignedClientsData
      jobTitle: 'Backend Developer',
      company: 'TechCorp',
    },
    {
      id: 307,
      employeeName: 'Sarah Johnson',
      employeeAvatar: 'SJ',
      clientName: 'Maria Rodriguez',
      jobTitle: 'React Developer',
      company: 'WebDev Inc',
    },
  ];

  // NEW DUMMY DATA for the Interviews tab, including a 'status' field
  const initialInterviewData = [
    { id: 401, employeeName: 'Sarah Johnson', employeeAvatar: 'SJ', clientName: 'John Anderson', jobTitle: 'Senior Frontend Developer', company: 'TechFlow Inc', round: '1st Round', date: '2025-07-08', status: 'Scheduled' },
    { id: 402, employeeName: 'Sarah Johnson', employeeAvatar: 'SJ', clientName: 'Alex Thompson', jobTitle: 'Full Stack Developer', company: 'StartupXYZ', round: '2nd Round', date: '2025-07-06', status: 'Completed' },
    { id: 403, employeeName: 'Michael Chen', employeeAvatar: 'MC', clientName: 'Jessica Williams', jobTitle: 'Product Designer', company: 'Design Studio', round: '3rd Round', date: '2025-07-10', status: 'Pending Review' },
    { id: 404, employeeName: 'Emily Rodriguez', employeeAvatar: 'ER', clientName: 'David Kim', jobTitle: 'Backend Developer', company: 'TechCorp', round: '1st Round', date: '2025-07-09', status: 'Scheduled' },
    { id: 405, employeeName: 'Sarah Johnson', employeeAvatar: 'SJ', clientName: 'Maria Rodriguez', jobTitle: 'React Developer', company: 'WebDev Inc', round: '2nd Round', date: '2025-07-11', status: 'Completed' },
  ];


  // State variables for dynamic data
  const [unassignedClients, setUnassignedClients] = useState(initialUnassignedClientsData);
  const [assignedClients, setAssignedClients] = useState(initialAssignedClientsData);
  const [employees, setEmployees] = useState(initialDummyEmployees);
  const [interviewData, setInterviewData] = useState(initialInterviewData);
  const [applicationData, setApplicationData] = useState(initialApplicationData); // Now managed by state

  // NEW: Comprehensive dummy data for client details (from EmployeeData.txt structure)
  const mockDetailedClientsData = [
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
      assignedTo: 'Sarah Johnson', // Added for consistency with other client data
      assignedDate: '2024-11-15', // Added for consistency with other client data
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'], // Added for consistency
      experience: '8 years experience', // Added for consistency
      location: 'San Francisco, CA', // Added for consistency
      salary: '$120,000 - $150,000', // Added for consistency
      position: 'Senior Frontend Developer', // Added for consistency
      company: 'TechFlow Inc', // Added for consistency
      round: '1st Round', // Example for interview data
      date: '2025-07-08', // Example for interview data
    },
    {
      id: 8, // Corresponds to Sarah Mitchell in initialUnassignedClientsData
      name: 'Sarah Mitchell',
      firstName: 'Sarah',
      middleName: 'Jane',
      lastName: 'Mitchell',
      dob: '1992-11-22',
      gender: 'Female',
      ethnicity: 'Asian',
      address: '789 Pine St, Remote',
      zipCode: '00000',
      mobile: '987-654-3210',
      email: 'sarah.m@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'No',
      workPreference: 'Remote',
      restrictedCompanies: 'Acme Corp',
      jobsToApply: 'UX, Product Design',
      technologySkills: 'Figma, Sketch, Adobe XD, User Research',
      currentSalary: '$85,000',
      expectedSalary: '$100,000',
      visaStatus: 'Green Card',
      otherVisaStatus: '',
      schoolName: 'ArtCenter College of Design',
      schoolAddress: 'Pasadna, CA',
      schoolPhone: '555-999-8888',
      courseOfStudy: 'Product Design',
      graduationDate: '2014-06-01',
      currentCompany: 'DesignCo',
      currentDesignation: 'Product Designer',
      preferredInterviewTime: 'Afternoon',
      earliestJoiningDate: '2025-09-01',
      relievingDate: '2025-08-31',
      referenceName: 'David Lee',
      referencePhone: '555-111-2222',
      referenceAddress: '101 Elm St',
      referenceEmail: 'david.lee@example.com',
      referenceRole: 'Colleague',
      jobPortalAccountName: 'sarah.behance',
      jobPortalCredentials: 'another_encrypted_password',
      priority: 'medium',
      status: 'applied',
      assignedTo: 'Michael Chen', // Example assignment
      assignedDate: '2024-12-10',
      skills: ['UX Design', 'Figma', 'User Research'],
      experience: '5 years experience',
      remote: false,
      salary: '$90,000 - $110,000',
      location: 'Remote',
      jobTitle: 'UX Designer',
      company: 'DesignCorp',
    },
    {
      id: 9, // Corresponds to Michael Chen in initialUnassignedClientsData
      name: 'Michael Chen',
      firstName: 'Michael',
      middleName: '',
      lastName: 'Chen',
      dob: '1988-03-10',
      gender: 'Male',
      ethnicity: 'Asian',
      address: '456 Elm St, New York, NY',
      zipCode: '10001',
      mobile: '111-222-3333',
      email: 'michael.c@example.com',
      securityClearance: 'No',
      clearanceLevel: '',
      willingToRelocate: 'Yes',
      workPreference: 'On-site',
      restrictedCompanies: '',
      jobsToApply: 'Data Analyst, BI Developer',
      technologySkills: 'Python, SQL, Tableau, Excel',
      currentSalary: '$95,000',
      expectedSalary: '$110,000',
      visaStatus: 'H1B',
      otherVisaStatus: '',
      schoolName: 'New York University',
      schoolAddress: 'New York, NY',
      schoolPhone: '555-444-5555',
      courseOfStudy: 'Data Science',
      graduationDate: '2010-05-25',
      currentCompany: 'Data Insights',
      currentDesignation: 'Data Analyst',
      preferredInterviewTime: 'Any',
      earliestJoiningDate: '2025-07-15',
      relievingDate: '2025-07-10',
      referenceName: 'Chris Green',
      referencePhone: '555-777-8888',
      referenceAddress: '789 Maple St',
      referenceEmail: 'chris.g@example.com',
      referenceRole: 'Colleague',
      jobPortalAccountName: 'michael.indeed',
      jobPortalCredentials: 'another_strong_password',
      priority: 'high',
      status: 'applied',
      assignedTo: 'Emily Rodriguez', // Example assignment
      assignedDate: '2024-12-15',
      skills: ['Data Analysis', 'SQL', 'Python (Pandas)'],
      experience: '4 years experience',
      remote: true,
      salary: '$85,000 - $105,000',
      location: 'New York, NY',
      jobTitle: 'Data Analyst',
      company: 'DataTech Solutions',
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
      assignedTo: 'Sarah Johnson',
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
      assignedTo: 'Sarah Johnson',
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
    },
    // Add more detailed clients as needed, ensuring unique IDs and names
  ];


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
    if (isUnassignedClientsModalOpen || isAssignClientModalOpen || isTotalClientsModalOpen || isEmployeeClientsModalOpen || isClientPreviewModalOpen || isReassignClientModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // Reset to default
    }
    // Cleanup function to ensure overflow is reset when component unmounts or modals close
    return () => {
      document.body.style.overflow = '';
    };
  }, [isUnassignedClientsModalOpen, isAssignClientModalOpen, isTotalClientsModalOpen, isEmployeeClientsModalOpen, isClientPreviewModalOpen, isReassignClientModalOpen]);

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);


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
    const matchesSearch = client.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                          client.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchQuery)) ||
                          client.experience.toLowerCase().includes(lowerCaseSearchQuery) ||
                          client.email.toLowerCase().includes(lowerCaseSearchQuery) ||
                          client.salary.toLowerCase().includes(lowerCaseSearchQuery);
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
  const handleAssignmentSubmit = () => {
    // Determine if it's a new assignment or a reassignment
    const isReassignment = !!clientToReassign;
    const clientToProcess = isReassignment ? clientToReassign : selectedClientToAssign;

    if (!clientToProcess || !selectedEmployee) {
      console.error('Please select both a client and an employee before assigning/reassigning.');
      return;
    }

    // Find the selected new employee
    const newAssignedEmployee = employees.find(emp => emp.id === parseInt(selectedEmployee));

    if (!newAssignedEmployee) {
      console.error('Selected employee not found.');
      return;
    }

    if (isReassignment) {
      // Reassignment Logic
      const originalAssignedToName = clientToProcess.assignedTo;
      const originalEmployee = employees.find(emp => emp.name === originalAssignedToName);

      // 1. Update assignedClients state: change assignedTo, priority, notes
      setAssignedClients(prevAssigned => prevAssigned.map(client =>
        client.id === clientToProcess.id
          ? {
              ...client,
              assignedTo: newAssignedEmployee.name,
              priority: assignmentPriority,
              assignmentNotes: assignmentNotes, // Add assignmentNotes to assigned client
              assignedDate: new Date().toISOString().slice(0, 10), // Update date on reassignment
            }
          : client
      ));

      // 2. Update employee assignedClients counts
      setEmployees(prevEmployees => prevEmployees.map(emp => {
        if (emp.id === newAssignedEmployee.id) {
          return { ...emp, assignedClients: emp.assignedClients + 1 };
        } else if (originalEmployee && emp.id === originalEmployee.id) {
          return { ...emp, assignedClients: Math.max(0, emp.assignedClients - 1) }; // Ensure not negative
        }
        return emp;
      }));

      console.log('Reassigned Client:', clientToProcess.clientName);
      console.log('From Employee:', originalAssignedToName);
      console.log('To Employee:', newAssignedEmployee.name);
      closeReassignClientModal();

    } else {
      // New Assignment Logic
      // 1. Remove client from unassignedClients
      setUnassignedClients(prevClients => prevClients.filter(
        client => client.id !== clientToProcess.id
      ));

      // 2. Add client to assignedClients
      const newAssignedClient = {
        id: clientToProcess.id, // Reusing ID for simplicity, in real app might generate new
        clientName: clientToProcess.name,
        location: clientToProcess.remote ? 'Remote' : 'On-site', // Simplified location
        position: clientToProcess.skills[0] || 'N/A', // Using first skill as position
        salary: clientToProcess.salary,
        company: 'Client Company', // Dummy company name
        assignedTo: newAssignedEmployee.name,
        priority: assignmentPriority,
        status: 'applied', // Default status for new assignments
        assignedDate: new Date().toISOString().slice(0, 10), // Current date
        assignmentNotes: assignmentNotes, // Add assignmentNotes to new assigned client
      };
      setAssignedClients(prevAssigned => [...prevAssigned, newAssignedClient]);

      // 3. Update the assignedClients count for the relevant employee in employees state
      setEmployees(prevEmployees => prevEmployees.map(emp =>
        emp.id === newAssignedEmployee.id
          ? { ...emp, assignedClients: emp.assignedClients + 1 }
          : emp
      ));

      console.log('Assigning Client:', clientToProcess.name);
      console.log('To Employee:', newAssignedEmployee.name);
      console.log('Priority:', assignmentPriority);
      console.log('Notes:', assignmentNotes);

      closeAssignClientModal();
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

  // Filtered interview data based on search and round filter
  const filteredInterviewData = initialInterviewData.filter(interview => { // Use initialInterviewData here
    const matchesSearch = interview.employeeName.toLowerCase().includes(interviewSearchQuery.toLowerCase()) ||
                          interview.clientName.toLowerCase().includes(interviewSearchQuery.toLowerCase()) ||
                          interview.jobTitle.toLowerCase().includes(interviewSearchQuery.toLowerCase()) ||
                          interview.company.toLowerCase().includes(interviewSearchQuery.toLowerCase());
    const matchesRound = interviewFilterRound === 'All Rounds' || interview.round === interviewFilterRound;
    return matchesSearch && matchesRound;
  });

  // Handlers for Applications tab search and filter
  const handleApplicationSearchChange = (event) => {
    setApplicationSearchQuery(event.target.value);
  };

  const handleApplicationFilterEmployeeChange = (event) => {
    setApplicationFilterEmployee(event.target.value);
  };

  // Filtered application data based on search and employee filter
  const filteredApplicationData = initialApplicationData.filter(app => { // Use initialApplicationData here
    const matchesSearch = app.employeeName.toLowerCase().includes(applicationSearchQuery.toLowerCase()) ||
                          app.clientName.toLowerCase().includes(applicationSearchQuery.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(applicationSearchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(applicationSearchQuery.toLowerCase());
    const matchesEmployee = applicationFilterEmployee === '' || app.employeeName === applicationFilterEmployee;
    return matchesSearch && matchesEmployee;
  });

  // Handler for Assigned Employees search bar
  const handleAssignedEmployeeSearchChange = (event) => {
    setAssignedEmployeeSearchQuery(event.target.value);
  };

  // Filtered employees for the "Assigned" tab
  const filteredEmployees = employees.filter(employee => {
    const lowerCaseSearchQuery = assignedEmployeeSearchQuery.toLowerCase();
    return employee.name.toLowerCase().includes(lowerCaseSearchQuery) ||
           employee.role.toLowerCase().includes(lowerCaseSearchQuery);
  });


  // NEW: Function to open Client Preview Modal
  const openClientPreviewModal = (clientName) => {
    // First, try to find the client in the comprehensive detailed data
    let client = mockDetailedClientsData.find(c => c.name === clientName || c.clientName === clientName);

    // If not found in detailed data, try to find in assignedClients (which has some extended info)
    if (!client) {
      client = assignedClients.find(c => c.clientName === clientName);
    }

    // If still not found, try to find in initialUnassignedClientsData (which has skills, experience)
    if (!client) {
      client = initialUnassignedClientsData.find(c => c.name === clientName);
    }

    // Fallback: If still not found, construct a basic profile from applicationData or interviewData
    if (!client) {
      const appClient = initialApplicationData.find(c => c.clientName === clientName);
      if (appClient) {
        client = {
          name: appClient.clientName,
          clientName: appClient.clientName, // For consistency with assignedClients structure
          jobTitle: appClient.jobTitle,
          company: appClient.company,
          priority: 'N/A', // Default if not found in detailed data
          experience: 'N/A',
          remote: 'N/A',
          email: 'N/A',
          salary: 'N/A',
          location: 'N/A',
          assignedTo: appClient.employeeName,
          status: 'applied',
          assignedDate: 'N/A',
          skills: [],
        };
      }
    }

    if (!client) {
      const interviewClient = initialInterviewData.find(c => c.clientName === clientName);
      if (interviewClient) {
        client = {
          name: interviewClient.clientName,
          clientName: interviewClient.clientName,
          jobTitle: interviewClient.jobTitle,
          company: interviewClient.company,
          round: interviewClient.round,
          date: interviewClient.date,
          status: interviewClient.status,
          priority: 'N/A',
          experience: 'N/A',
          remote: 'N/A',
          email: 'N/A',
          salary: 'N/A',
          location: 'N/A',
          assignedTo: interviewClient.employeeName,
          assignedDate: 'N/A',
          skills: [],
        };
      }
    }

    if (client) {
      setClientToPreview(client);
      setIsClientPreviewModalOpen(true);
    } else {
      console.warn(`Client with name "${clientName}" not found for preview.`);
      // Optionally, show a user-friendly message if client is not found
      alert(`Client details for "${clientName}" are not available.`);
    }
  };

  // NEW: Function to close Client Preview Modal
  const closeClientPreviewModal = () => {
    setIsClientPreviewModalOpen(false);
    setClientToPreview(null);
  };


  // Calculate priority counts for the modal header based on current unassignedClients state
  const highPriorityCount = unassignedClients.filter(client => client.priority === 'high').length;
  const mediumPriorityCount = unassignedClients.filter(client => client.priority === 'medium').length;
  const lowPriorityCount = unassignedClients.filter(client => client.priority === 'low').length;
  const totalUnassignedCount = unassignedClients.length;
  // totalClientsCount now dynamically reflects current assigned clients ONLY
  const totalClientsCount = assignedClients.length;

  // Calculate total assigned clients from employees data for the "Assigned" tab header
  const totalAssignedClientsByEmployee = employees.reduce((sum, emp) => sum + emp.assignedClients, 0);

  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prevState => !prevState);
  };

  const handleProfileClick = () => {
    console.log('View Profile clicked');
    setIsProfileDropdownOpen(false);
    // Add navigation to profile page or open profile modal
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
        }

        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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
            background-color: var(--assignment-card-unassigned-bg);
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
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
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
            align-items: center;
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

        /* Center the ACTIONS header for applications table */
        .applications-table th:last-child {
            text-align: center;
        }

        .applications-table td {
            color: var(--text-color);
        }

        /* Center the content of the ACTIONS column for applications table */
        .applications-table td:last-child {
            text-align: center;
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
            background-color: var(--card-bg); /* Use card background for consistency */
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
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
            color: var(--text-color);
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

        .modal-client-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .modal-client-skill-tag {
            background-color: var(--modal-client-skill-bg);
            color: var(--modal-client-skill-color);
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 13px;
            white-space: nowrap;
            transition: background-color 0.3s ease, color 0.3s ease;
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
        .assign-form-group textarea {
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
        .assign-form-group textarea:focus {
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
        .interview-table th:last-child {
            text-align: center;
        }

        /* Specific rule for the 'ACTIONS' column data cells to center align */
        .interview-table td:last-child {
            text-align: center;
            display: flex; /* Make the td a flex container */
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
            height: 100%; /* Ensure it takes full height of the row */
        }

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
        `}
      </style>

      {/* Header Section */}
      <header className="header-section">
        <h1 className="header-logo">
          Tech<span className="x-highlight">X</span>plorers
        </h1>
        <div className="header-actions">
          {/* Notification button */}
          <button className="header-button">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
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
                <div className="profile-dropdown-item" onClick={handleSettingsClick}>
                  <i className="fas fa-cog"></i> Settings
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
          <label htmlFor="assignmentsRadio">Assignments</label>
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
          <label htmlFor="assignedRadio">Assigned</label>
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
              <div className="assignment-card" onClick={openUnassignedClientsModal}>
                <div className="assignment-card-value">{totalUnassignedCount}</div>
                <div className="assignment-card-title">Clients Unassigned</div>
                <div className="assignment-card-description">View all unassigned clients</div>
              </div>

              {/* Total Clients Card (formerly Assigned) - now clickable to open new modal */}
              <div className="assignment-card assigned" onClick={openTotalClientsModal}>
                <div className="assignment-card-value">{totalClientsCount}</div>
                <div className="assignment-card-title">Total Clients</div>
                <div className="assignment-card-description">View all assigned clients</div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Assigned' && (
          <section className="assigned-employee-overview client-assignment-overview">
            <div className="client-assignment-header">
              {/* Changed title to "Assigned Clients" */}
              <h2 className="client-assignment-title">Assigned Clients</h2>
              {/* Display total assigned clients here, matching the screenshot */}
              <div className="clients-count-badge">
                {totalAssignedClientsByEmployee} clients
              </div>
              {/* Removed "Manage Employees" button */}
            </div>

            {/* NEW: Search bar for employees in Assigned tab */}
            <div className="applications-filters assigned-employee-search-bar" style={{marginBottom: '20px'}}> {/* Reusing styles and added new class */}
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

            <div className="employee-cards-grid"> {/* New grid container */}
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="employee-card">
                  <div className="employee-card-header">
                    <div className="employee-avatar-large">{employee.avatar}</div>
                    <div className="employee-info">
                      <div className="employee-name">{employee.name}</div>
                      <div className="employee-role">{employee.role}</div>
                    </div>
                    {/* Display employee's individual assigned client count */}
                    <div className="clients-count-badge">
                      {employee.assignedClients} clients
                    </div>
                  </div>
                  <div className="employee-card-details">
                    <div className="success-rate">Success Rate: <span className="success-rate-value">{employee.successRate}%</span></div>
                    {/* Eye icon to open modal for this employee's clients */}
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

        {activeTab === 'Applications' && (
          <section className="applications-management-section">
            <div className="applications-header">
              <h2 className="applications-title">Employee Applications Management</h2>
              {/* Changed badge text as per screenshot */}
              <span className="pending-review-badge">0 pending review</span>
            </div>

            <div className="applications-filters">
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={applicationSearchQuery} // Bind value to state
                  onChange={handleApplicationSearchChange} // Add onChange handler
                />
              </div>
              <div className="filter-dropdown">
                <select
                  value={applicationFilterEmployee} // Bind value to state
                  onChange={handleApplicationFilterEmployeeChange} // Add onChange handler
                >
                  <option value="">Filter by employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>

            <div className="table-responsive">
              <table className="applications-table">
                <thead><tr>
                  <th>EMPLOYEE</th>
                  <th>CLIENT</th>
                  <th>JOB TITLE</th>
                  <th>COMPANY</th>
                  <th>ACTIONS</th>
                </tr></thead>
                <tbody>
                  {filteredApplicationData.map((app) => (
                    <tr key={app.id}>
                      <td className="employee-cell">
                        <div className="employee-avatar">{app.employeeAvatar}</div>
                        {app.employeeName}
                      </td>
                      <td>{app.clientName}</td>
                      <td>{app.jobTitle}</td>
                      <td>{app.company}</td>
                      <td className="action-buttons">
                        <button className="action-button" onClick={() => openClientPreviewModal(app.clientName)}>
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredApplicationData.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                        No applications to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Interviews' && (
          <section className="interviews-section client-assignment-overview">
            <div className="client-assignment-header interviews-header">
              <h2 className="client-assignment-title">Interview Management</h2>
              <span className="total-interviews-badge">{interviewData.length} total interviews</span>
            </div>

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
                  <option value="2nd Round">2st Round</option>
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
                  <th>ACTIONS</th>
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
                         {interview.date}
                      </td>
                      <td>
                        {interview.status} {/* Display the new status */}
                      </td>
                      <td className="action-buttons"> {/* This td now has flex properties from CSS */}
                        <button className="action-button" onClick={() => openClientPreviewModal(interview.clientName)}>
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInterviewData.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-color)' }}> {/* Updated colspan */}
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
        <div className="modal-overlay">
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

            <h4 className="modal-title" style={{marginBottom: '10px'}}>Available Clients</h4>
            <div className="modal-available-clients-list">
              {/* Render filtered clients */}
              {filteredClients.map((client) => (
                <div key={client.id} className="modal-client-card">
                  <div className="modal-client-card-header">
                    <span className="modal-client-name">{client.name}</span>
                    <span className={`modal-client-priority-badge ${client.priority}`}>{client.priority} priority</span>
                  </div>
                  <div className="modal-client-skills">
                    {client.skills.map((skill, index) => (
                      <span key={index} className="modal-client-skill-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="modal-client-details">
                    <span><i className="fas fa-briefcase"></i> {client.experience}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {client.remote ? 'Remote' : 'On-site'}</span>
                    <span><i className="fas fa-envelope"></i> {client.email}</span>
                    <span><i className="fas fa-money-bill-wave"></i> {client.salary}</span>
                  </div>
                  <div className="modal-client-actions">
                    {/* Assign Employee button now opens the new modal */}
                    <button className="modal-assign-button" onClick={() => openAssignClientModal(client)}>
                      <i className="fas fa-user-plus"></i> Assign Employee
                    </button>
                    <button className="modal-view-profile-button" onClick={() => openClientPreviewModal(client.name)}>
                      <i className="fas fa-eye"></i> View Profile
                    </button>
                  </div>    
                </div>
              ))}
              {filteredClients.length === 0 && (
                <p style={{textAlign: 'center', color: 'var(--text-color)'}}>No clients match the selected filter or search query.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Client to Employee Modal (for NEW assignments) */}
      {isAssignClientModalOpen && selectedClientToAssign && (
        <div className="modal-overlay">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">Assign Client to Employee</h3>
              <button className="assign-modal-close-button" onClick={closeAssignClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--subtitle-color)', margin: '0' }}>
              Select a client and employee to create a new assignment
            </p>

            <div className="assign-form-group">
              <label htmlFor="selectClient">Select Client</label>
              <select id="selectClient" value={selectedClientToAssign.id} disabled>
                <option value={selectedClientToAssign.id}>
                  {selectedClientToAssign.name} - {selectedClientToAssign.skills[0] || 'No Role'}
                </option>
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="selectEmployee">Select Employee</label>
              <select
                id="selectEmployee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Choose employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="priorityLevel">Priority Level</label>
              <select
                id="priorityLevel"
                value={assignmentPriority}
                onChange={(e) => setAssignmentPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="assignmentNotes">Assignment Notes</label>
              <textarea
                id="assignmentNotes"
                placeholder="Any specific instructions or requirements..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={handleAssignmentSubmit}>
                Cancel
              </button>
              <button className="assign-form-button assign" onClick={handleAssignmentSubmit}>
                Assign Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Clients Modal */}
      {isTotalClientsModalOpen && (
        <div className="modal-overlay">
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
                    <th>STATUS</th>
                    <th>ASSIGNED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="employee-cell"> {/* Reusing employee-cell for client avatar/name layout */}
                          <div className="employee-avatar">
                            {client.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
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
                            {client.assignedTo.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          {client.assignedTo}
                        </div>
                      </td>
                      <td>
                        <span className={`modal-client-priority-badge ${client.priority}`}>
                          {client.priority.charAt(0).toUpperCase() + client.priority.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${client.status}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="employee-cell">
                           <i className="fas fa-calendar-alt" style={{marginRight: '5px'}}></i>{client.assignedDate}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {assignedClients.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-color)' }}>
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
        <div className="modal-overlay">
          <div className="employee-clients-modal-content">
            <div className="employee-clients-modal-header">
              <h3 className="employee-clients-modal-title">
                Clients Assigned to {selectedEmployeeForClients.name}
              </h3>
              <button className="modal-close-button" onClick={closeEmployeeClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="employee-clients-list">
              {assignedClients
                .filter(client => client.assignedTo === selectedEmployeeForClients.name)
                .map(client => (
                  <div key={client.id} className="employee-client-card">
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
                        <i className="fas fa-calendar-alt"></i> Assigned: {client.assignedDate}
                      </span>
                      <span className="employee-client-details-item">
                        <i className="fas fa-info-circle"></i> Status: {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>
                    <div className="modal-client-actions" style={{justifyContent: 'flex-start'}}> {/* Align left */}
                        <button className="modal-assign-button" onClick={() => openReassignClientModal(client)}>
                            <i className="fas fa-exchange-alt"></i> Change Employee
                        </button>
                        <button className="modal-view-profile-button" onClick={() => openClientPreviewModal(client.clientName)}>
                            <i className="fas fa-eye"></i> View Profile
                        </button>
                    </div>
                  </div>
                ))}
              {assignedClients.filter(client => client.assignedTo === selectedEmployeeForClients.name).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                  No clients currently assigned to {selectedEmployeeForClients.name}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Reassign Client Modal (reusing assign-modal-content) */}
      {isReassignClientModalOpen && clientToReassign && (
        <div className="modal-overlay">
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
                {employees
                  .filter(emp => emp.name !== clientToReassign.assignedTo) // Exclude current employee
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
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


      {/* NEW: Client Preview Modal */}
      {isClientPreviewModalOpen && clientToPreview && (
        <div className="modal-overlay">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">Client Details: {clientToPreview.name || clientToPreview.clientName}</h3>
              <button className="assign-modal-close-button" onClick={closeClientPreviewModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Comprehensive Client Details Grid */}
            <div className="client-preview-grid-container">
              {/* Personal Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Personal Information</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">First Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.firstName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Middle Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.middleName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Last Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.lastName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Date of Birth</span>
                  <span className="client-preview-detail-value">{clientToPreview.dob || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Gender</span>
                  <span className="client-preview-detail-value">{clientToPreview.gender || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Ethnicity</span>
                  <span className="client-preview-detail-value">{clientToPreview.ethnicity || '-'}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Contact Information</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Address</span>
                  <span className="client-preview-detail-value">{clientToPreview.address || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Zip Code</span>
                  <span className="client-preview-detail-value">{clientToPreview.zipCode || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Mobile</span>
                  <span className="client-preview-detail-value">{clientToPreview.mobile || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Email</span>
                  <span className="client-preview-detail-value">{clientToPreview.email || '-'}</span>
                </div>
              </div>

              {/* Job Preferences & Status */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Preferences & Status</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Security Clearance</span>
                  <span className="client-preview-detail-value">{clientToPreview.securityClearance || '-'}</span>
                </div>
                {clientToPreview.clearanceLevel && (
                  <div className="client-preview-detail-item">
                    <span className="client-preview-detail-label">Clearance Level</span>
                    <span className="client-preview-detail-value">{clientToPreview.clearanceLevel}</span>
                  </div>
                )}
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Willing to Relocate</span>
                  <span className="client-preview-detail-value">{clientToPreview.willingToRelocate || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Work Preference</span>
                  <span className="client-preview-detail-value">{clientToPreview.workPreference || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Restricted Companies</span>
                  <span className="client-preview-detail-value">{clientToPreview.restrictedCompanies || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Jobs to Apply</span>
                  <span className="client-preview-detail-value">{clientToPreview.jobsToApply || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Technology Skills</span>
                  <span className="client-preview-detail-value">{clientToPreview.technologySkills || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Current Salary</span>
                  <span className="client-preview-detail-value">{clientToPreview.currentSalary || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Expected Salary</span>
                  <span className="client-preview-detail-value">{clientToPreview.expectedSalary || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Visa Status</span>
                  <span className="client-preview-detail-value">{clientToPreview.visaStatus || '-'}</span>
                </div>
                {clientToPreview.otherVisaStatus && (
                  <div className="client-preview-detail-item">
                    <span className="client-preview-detail-label">Other Visa Status</span>
                    <span className="client-preview-detail-value">{clientToPreview.otherVisaStatus}</span>
                  </div>
                )}
              </div>

              {/* Education Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Education Details</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">School Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.schoolName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">School Address</span>
                  <span className="client-preview-detail-value">{clientToPreview.schoolAddress || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">School Phone</span>
                  <span className="client-preview-detail-value">{clientToPreview.schoolPhone || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Course of Study</span>
                  <span className="client-preview-detail-value">{clientToPreview.courseOfStudy || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Graduation Date</span>
                  <span className="client-preview-detail-value">{clientToPreview.graduationDate || '-'}</span>
                </div>
              </div>

              {/* Employment Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Employment Details</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Current Company</span>
                  <span className="client-preview-detail-value">{clientToPreview.currentCompany || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Current Designation</span>
                  <span className="client-preview-detail-value">{clientToPreview.currentDesignation || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Preferred Interview Time</span>
                  <span className="client-preview-detail-value">{clientToPreview.preferredInterviewTime || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Earliest Joining Date</span>
                  <span className="client-preview-detail-value">{clientToPreview.earliestJoiningDate || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Relieving Date</span>
                  <span className="client-preview-detail-value">{clientToPreview.relievingDate || '-'}</span>
                </div>
              </div>

              {/* References */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">References</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Reference Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.referenceName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Reference Phone</span>
                  <span className="client-preview-detail-value">{clientToPreview.referencePhone || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Reference Address</span>
                  <span className="client-preview-detail-value">{clientToPreview.referenceAddress || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Reference Email</span>
                  <span className="client-preview-detail-value">{clientToPreview.referenceEmail || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Reference Role</span>
                  <span className="client-preview-detail-value">{clientToPreview.referenceRole || '-'}</span>
                </div>
              </div>

              {/* Job Portal Accounts */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Portal Accounts</h4>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Account Name</span>
                  <span className="client-preview-detail-value">{clientToPreview.jobPortalAccountName || '-'}</span>
                </div>
                <div className="client-preview-detail-item">
                  <span className="client-preview-detail-label">Credentials</span>
                  <span className="client-preview-detail-value">{clientToPreview.jobPortalCredentials ? '********' : '-'}</span>
                </div>
              </div>

              {/* Other relevant details that might come from application/interview data */}
              {(clientToPreview.priority && clientToPreview.priority !== 'N/A') && (
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">General Details</h4>
                  <div className="client-preview-detail-item">
                      <span className="client-preview-detail-label">Priority</span>
                      <span className={`modal-client-priority-badge ${clientToPreview.priority}`}>
                          {clientToPreview.priority.charAt(0).toUpperCase() + clientToPreview.priority.slice(1)} Priority
                      </span>
                  </div>
                  {(clientToPreview.experience && clientToPreview.experience !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Experience</span>
                          <span className="client-preview-detail-value">{clientToPreview.experience}</span>
                      </div>
                  )}
                  {(clientToPreview.remote !== undefined && clientToPreview.remote !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Remote Preference</span>
                          <span className="client-preview-detail-value">{clientToPreview.remote ? 'Remote' : 'On-site'}</span>
                      </div>
                  )}
                  {(clientToPreview.salary && clientToPreview.salary !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Salary Expectation</span>
                          <span className="client-preview-detail-value">{clientToPreview.salary}</span>
                      </div>
                  )}
                  {(clientToPreview.assignedTo && clientToPreview.assignedTo !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Assigned To</span>
                          <span className="client-preview-detail-value">{clientToPreview.assignedTo}</span>
                      </div>
                  )}
                  {(clientToPreview.status && clientToPreview.status !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Status</span>
                          <span className={`status-badge status-${clientToPreview.status}`}>
                              {clientToPreview.status.charAt(0).toUpperCase() + clientToPreview.status.slice(1)}
                          </span>
                      </div>
                  )}
                  {(clientToPreview.assignedDate && clientToPreview.assignedDate !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Assigned Date</span>
                          <span className="client-preview-detail-value">{clientToPreview.assignedDate}</span>
                      </div>
                  )}
                  {(clientToPreview.round && clientToPreview.round !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Interview Round</span>
                          <span className="client-preview-detail-value">{clientToPreview.round}</span>
                      </div>
                  )}
                  {(clientToPreview.date && clientToPreview.date !== 'N/A') && (
                      <div className="client-preview-detail-item">
                          <span className="client-preview-detail-label">Interview Date</span>
                          <span className="client-preview-detail-value">{clientToPreview.date}</span>
                      </div>
                  )}
                </div>
              )}

            </div>

            {/* Render skills section only if skills exist and are not empty */}
            {clientToPreview.skills && clientToPreview.skills.length > 0 && (
                <div className="client-preview-skills-section">
                    <h4 className="assign-modal-title" style={{marginBottom: '10px', fontSize: '18px'}}>Skills</h4>
                    <div className="modal-client-skills">
                        {clientToPreview.skills.map((skill, index) => (
                            <span key={index} className="modal-client-skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerWorkSheet;
