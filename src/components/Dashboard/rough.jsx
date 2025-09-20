// import React, { useState, useEffect, useRef, useMemo } from 'react'; // Import useRef
// import { useNavigate } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap'; // Using react-bootstrap Modal
// import { getDatabase, ref, onValue, update, push, set } from "firebase/database"; // Import Firebase functions
// import { initializeApp, getApps } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// // Firebase setup
// let database, auth, storage;
// try {
//   const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
//   let app;
//   if (!getApps().length) {
//     app = initializeApp(firebaseConfig);
//   } else {
//     app = getApps()[0];
//   }
//   database = getDatabase(app);
//   auth = getAuth(app);
//   storage = getStorage(app);
// } catch (e) {
//   console.error("Firebase initialization error", e);
// }


// const FilterComponent = ({
//   filterDateRange,
//   handleDateRangeChange,
//   sortOrder,
//   setSortOrder,
//   quickFilter,
//   handleQuickFilterChange,
//   areFiltersActive,
//   handleClearFilters,
//   sortOptions
// }) => {
//   return (
//     <div className="filter-container-style">
//       <div className="filter-group-style">
//         <label className="filter-label-style">Date Range</label>
//         <div className="date-range-input-group-style">
//           <input
//             type="date"
//             name="startDate"
//             value={filterDateRange.startDate}
//             onChange={handleDateRangeChange}
//             className="date-input-style"
//           />
//           <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
//           <input
//             type="date"
//             name="endDate"
//             value={filterDateRange.endDate}
//             onChange={handleDateRangeChange}
//             className="date-input-style"
//           />
//         </div>
//       </div>

//       <div className="filter-group-style" style={{ marginLeft: 'auto' }}>
//         <label className="filter-label-style">Sort Order</label>
//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           className="select-filter-style"
//         >
//           {sortOptions.map(option => <option key={option} value={option}>{option}</option>)}
//         </select>
//       </div>


//       {areFiltersActive() && (
//         <div className="clear-filters-button-container-style">
//           <label className="filter-label-style">Actions</label>
//           <button onClick={handleClearFilters} className="clear-filters-button-style">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
//             Clear Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


// const ManagerWorkSheet = () => {

//   const navigate = useNavigate();
//   // State to manage the current theme: 'light' or 'dark'
//   const [theme, setTheme] = useState(() => {
//     // Initialize theme from local storage or default to 'light'
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme ? savedTheme : 'light';
//   });

//   const [clients, setClients] = useState([]); // REMOVE THIS LINE
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State to manage the active tab, now including 'Assigned', 'Interviews', 'Notes'
//   const [activeTab, setActiveTab] = useState('Assignments'); // Default to 'Assignments'

//   // State for logged-in user's name and avatar initial
//   const [userName, setUserName] = useState('Manager'); // Changed from Balaji to Chaveen
//   const [userAvatarLetter, setUserAvatarLetter] = useState('C'); // Derived from userName

//   const [managerFirebaseKey, setManagerFirebaseKey] = useState(null);

//   const [newCoverLetterFile, setNewCoverLetterFile] = useState(null);

// const [showAttachmentModal, setShowAttachmentModal] = useState(false);
// const [currentAttachments, setCurrentAttachments] = useState([]);



//   // NEW STATE: State to control the visibility of the profile dropdown
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   // Ref for the profile dropdown to detect clicks outside
//   const profileDropdownRef = useRef(null);

//   // Get unique employee names for the filter dropdown

//   // NEW STATE: For Notifications Modal
//   const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

//   const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];

//   // Dummy notifications data
//   const [notifications, setNotifications] = useState([
//     { id: 1, title: 'New Feature Alert', message: 'Discover our new analytics dashboard!', time: '2 hours ago' },
//     { id: 2, title: 'Payment Due Soon', message: 'Your subscription renews in 3 days.', time: '1 day ago' },
//     { id: 3, title: 'Profile Update', message: 'Your profile information has been updated.', time: '2 days ago' },
//   ]);

//   // NEW STATE: For User Profile Edit Modal
//   const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
//   const [userProfile, setUserProfile] = useState({});

//   const [displayEmployees, setDisplayEmployees] = useState([]);

//   const [selectedApplication, setSelectedApplication] = useState(null);
// const [isApplicationDetailModalOpen, setIsApplicationDetailModalOpen] = useState(false);
// const [isEditApplicationModalOpen, setIsEditApplicationModalOpen] = useState(false);
// const [editableApplication, setEditableApplication] = useState({});

// const formatDateTime = (timestamp) => {
//     if (!timestamp) return { date: 'N/A', time: 'N/A' };
//     try {
//         const date = new Date(timestamp);
//         const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//         const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

//         const formattedDate = date.toLocaleDateString('en-US', dateOptions);
//         const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

//         return { date: formattedDate, time: formattedTime };
//     } catch (e) {
//         console.error("Error formatting timestamp:", e);
//         return { date: 'Invalid Date', time: 'N/A' };
//     }
// };

// // Add these functions to handle application operations
// const openApplicationDetailModal = (application) => {
//   setSelectedApplication(application);
//   setIsApplicationDetailModalOpen(true);
// };

// const closeApplicationDetailModal = () => {
//   setIsApplicationDetailModalOpen(false);
//   setSelectedApplication(null);
// };

// const openEditApplicationModal = (application) => {
  
  
//   // Ensure we're passing all the necessary identifiers
//   setEditableApplication({
//     ...application,
//     clientFirebaseKey: application.clientFirebaseKey || application.clientFirebaseKey,
//     registrationKey: application.registrationKey || application.registrationKey,
//     applicationId: application.applicationId || application.id || application.key
//   });
  
//   setIsEditApplicationModalOpen(true);
//   setIsApplicationDetailModalOpen(false);
// };

// const handleAttachmentClick = (attachments) => {
//   setCurrentAttachments(attachments);
//   setShowAttachmentModal(true);
// };

// const closeAttachmentModal = () => {
//   setShowAttachmentModal(false);
//   setCurrentAttachments([]); // Clear attachments when closing
// };

// const closeEditApplicationModal = () => {
//   setIsEditApplicationModalOpen(false);
//   setEditableApplication({});
// };

// const handleApplicationChange = (e) => {
//   const { name, value } = e.target;
//   setEditableApplication(prev => ({
//     ...prev,
//     [name]: value
//   }));
// };

// // Find and replace your existing handleUpdateApplication function.
// const handleUpdateApplication = async () => {
//     // Check for all required identifiers
//     const clientFirebaseKey = editableApplication.clientFirebaseKey;
//     const registrationKey = editableApplication.registrationKey;
//     const applicationId = editableApplication.id; // Use 'id' for array-based lookups

//     if (!clientFirebaseKey || !registrationKey || !applicationId) {
//         alert("Error: Missing required application identifiers.");
//         return;
//     }

//     try {
//         // 1. Get a reference to the entire jobApplications array
//         const jobApplicationsRef = ref(database,
//             `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/jobApplications`
//         );
        
//         // 2. Fetch the current array from the database once
//         const snapshot = await new Promise(resolve => onValue(jobApplicationsRef, resolve, { onlyOnce: true }));
//         const currentApplications = snapshot.val() || [];

//         // 3. Create a new array with the updated application
//         const updatedApplications = currentApplications.map(app =>
//             app.id === applicationId ? { ...app, ...editableApplication } : app
//         );
        
//         // 4. Use 'set' to replace the entire array in the database
//         await set(jobApplicationsRef, updatedApplications);
        
//         // 5. Update local state
//         setApplicationData(prev => prev.map(app => 
//             app.id === applicationId ? {...editableApplication} : app
//         ));
        
//         setSuccessMessage("Application updated successfully!");
//         setShowSuccessModal(true);
//         closeEditApplicationModal();
//     } catch (error) {
//         console.error("Error updating application:", error);
//         alert("Failed to update application. Please try again.");
//     }
// };

// const handleDeleteApplication = async () => {
//   const clientFirebaseKey = selectedApplication.clientFirebaseKey;
//   const registrationKey = selectedApplication.registrationKey;
//   const applicationId = selectedApplication.id; // Use 'id' for array-based lookups
  
//   if (!clientFirebaseKey || !registrationKey || !applicationId) {
//     alert("Error: Missing required application identifiers.");
//     return;
//   }

//   if (!window.confirm("Are you sure you want to delete this application?")) {
//     return;
//   }

//   try {
//     // 1. Get a reference to the entire jobApplications array
//     const jobApplicationsRef = ref(database, 
//       `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/jobApplications`
//     );
    
//     // 2. Fetch the current array from the database
//     const snapshot = await new Promise(resolve => onValue(jobApplicationsRef, resolve, { onlyOnce: true }));
//     const currentApplications = snapshot.val() || [];
    
//     // 3. Filter out the deleted application to create a new array
//     const updatedApplications = currentApplications.filter(app => 
//       app.id !== applicationId
//     );
    
//     // 4. Use 'set' to replace the entire array in the database
//     await set(jobApplicationsRef, updatedApplications);
    
//     // 5. Update local state
//     setApplicationData(prev => prev.filter(app => 
//       app.id !== selectedApplication.id
//     ));
    
//     setSuccessMessage("Application deleted successfully!");
//     setShowSuccessModal(true);
//     closeApplicationDetailModal();
//   } catch (error) {
//     console.error("Error deleting application:", error);
//     alert("Failed to delete application. Please try again.");
//   }
// };

//     const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
//     const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
//   const [newEmployee, setNewEmployee] = useState({
//     workEmail: '',
//     role: 'employee',
//     department: 'No department assigned',
//     accountStatus: 'Active',
//     temporaryPassword: '',
//     firstName: '',
//     lastName: '',
//     gender: '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     personalNumber: '',
//     alternativeNumber: '',
//     country: '',
//     state: '',
//     city: '',
//     address: '',
//     zipcode: '',
//     dateOfJoin: '',
//     personalEmail: '',
//   });
  
//   // --- MODIFICATION 2: Port the dropdown options ---
//   const departmentOptions = ['No department assigned', 'Management', 'Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Support', 'Quality Assurance', 'Tech Placement', 'HR', 'External'];
//   const roleOptions = [
//     { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
//     { value: 'Admin', label: 'Admin', description: 'Full system access and employee management' },
//     { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
//     { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
//   ];
//   const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

//   // ... (all existing useEffect hooks remain the same)

//   const handleCloseAddEmployeeModal = () => {
//     setIsAddEmployeeModalOpen(false);
//     setNewEmployee({
//           role: 'employee',
//       workEmail: '',
//       department: 'No department assigned',
//       accountStatus: 'Active',
//       temporaryPassword: '',
//       firstName: '',
//       lastName: '',
//       gender: '',
//       dateOfBirth: '',
//       maritalStatus: '',
//       personalNumber: '',
//       alternativeNumber: '',
//       country: '',
//       state: '',
//       city: '',
//       address: '',
//       zipcode: '',
//       dateOfJoin: '',
//       personalEmail: '',
//     });
//   };

//   const handleNewemployeeChange = (e) => {
//     const { name, value } = e.target;
//     setNewEmployee(prev => ({ ...prev, [name]: value }));
//   };

//   const generateTemporaryPassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
//     let password = '';
//     for (let i = 0; i < 12; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setNewEmployee(prev => ({ ...prev, temporaryPassword: password }));
//   };

//       const handleCoverLetterFileChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setNewCoverLetterFile(e.target.files[0]);
//         }
//     };

//   const handleCreateEmployeeAccount = async (e) => {
//     e.preventDefault();
//     const newEmployeeData = {
//       firstName: newEmployee.firstName,
//       lastName: newEmployee.lastName,
//       accountStatus: newEmployee.accountStatus,
//       roles: [newEmployee.role.toLowerCase()],
//       department: newEmployee.department,
//       workEmail: newEmployee.workEmail,
//       temporaryPassword: newEmployee.temporaryPassword,
//       gender: newEmployee.gender,
//       dateOfBirth: newEmployee.dateOfBirth,
//       maritalStatus: newEmployee.maritalStatus,
//       personalNumber: newEmployee.personalNumber,
//       alternativeNumber: newEmployee.alternativeNumber,
//       country: newEmployee.country,
//       state: newEmployee.state,
//       city: newEmployee.city,
//       address: newEmployee.address,
//       zipcode: newEmployee.zipcode,
//       dateOfJoin: newEmployee.dateOfJoin,
//       personalEmail: newEmployee.personalEmail,
//     };

//     try {
      
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         newEmployee.workEmail,
//         newEmployee.temporaryPassword
//       );
//       const user = userCredential.user;

//       // Step 2: Add the unique auth UID (firebaseKey) to the data object
//       newEmployeeData.firebaseKey = user.uid;


//       const usersRef = ref(database, `users/${user.uid}`);
      
      
//     await set(usersRef, newEmployeeData);
      
//       console.log("Employee created successfully from Manager Worksheet!");
//       handleCloseAddEmployeeModal();
//       setSuccessMessage(`${newEmployee.firstName} ${newEmployee.lastName} has been successfully added.`);
//       setShowSuccessModal(true);

//       } catch (error) {
//        if (error.code === 'auth/email-already-in-use') {
//         alert("This email is already registered. Please use a different work email.");
//       } else {
//         console.error("Error creating employee:", error);
//         alert("Failed to create employee. Please check the details and try again.");
//       }
//     }
//   };


//   // NEW: useEffect to get logged-in user data from sessionStorage
// // NEW: useEffect to get logged-in user data from sessionStorage and filter data
// // In ManagerWorksheet.jsx, replace the entire useEffect hook
// // that fetches data from Firebase with the following corrected version.
// useEffect(() => {
//     const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
//     const managerFirebaseKey = loggedInUserData ? loggedInUserData.firebaseKey : null;
//     setManagerFirebaseKey(managerFirebaseKey);

//     if (!managerFirebaseKey || !database) {
//         setLoading(false);
//         return;
//     }

//     const managerRef = ref(database, `users/${managerFirebaseKey}`);
//     const unsubscribeManager = onValue(managerRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//             const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
//             const avatarLetter = fullName.charAt(0).toUpperCase();

//             setUserProfile({ ...data, fullName: fullName });
//             setUserName(fullName);
//             setUserAvatarLetter(avatarLetter);
//         }
//     });

//     const clientsRef = ref(database, 'clients');
//     const usersRef = ref(database, 'users');

//     const unsubscribeClients = onValue(clientsRef, (snapshot) => {
//         const clientsData = snapshot.val();
//         const allRegistrations = [];
//         if (clientsData) {
//             Object.keys(clientsData).forEach(clientKey => {
//                 const client = clientsData[clientKey];
//                 if (client.serviceRegistrations) {
//                     Object.keys(client.serviceRegistrations).forEach(regKey => {
//                         const registration = client.serviceRegistrations[regKey];
                        
//                         // FIX: Convert the jobApplications object to an array here
//                         const jobApplicationsArray = registration.jobApplications
//                             ? Object.values(registration.jobApplications)
//                             : [];

//                         allRegistrations.push({
//                             ...registration,
//                             jobApplications: jobApplicationsArray, // Use the new array
//                             clientFirebaseKey: clientKey,
//                             registrationKey: regKey,
//                             email: client.email,
//                             mobile: client.mobile,
//                             firstName: registration.firstName || client.firstName,
//                             lastName: registration.lastName || client.lastName,
//                             name: registration.name || `${registration.firstName || ''} ${registration.lastName || ''}`,
//                         });
//                     });
//                 }
//             });
//         }
        
//         const clientsForManager = allRegistrations.filter(reg => 
//             reg.assignedManager === managerFirebaseKey
//         );

//         const unassignedForManager = clientsForManager.filter(reg => reg.assignmentStatus === 'pending_employee');
//         const assignedByManager = clientsForManager.filter(reg => ['pending_acceptance', 'active'].includes(reg.assignmentStatus));

//         setUnassignedClients(unassignedForManager);
//         setAssignedClients(assignedByManager);
        
//         setApplicationData(assignedByManager.flatMap(clientReg =>
//             (clientReg.jobApplications || []).map(app => ({
//                 ...app,
//                 clientFirebaseKey: clientReg.clientFirebaseKey,
//                 registrationKey: clientReg.registrationKey,
//                 clientName: `${clientReg.firstName} ${clientReg.lastName}`,
//                 assignedTo: clientReg.assignedTo
//             }))
//         ));
//         setInterviewData(assignedByManager.flatMap(clientReg => 
//             (clientReg.jobApplications || [])
//                 .filter(app => app.status === 'Interview')
//                 .map(app => ({ 
//                     ...app,
//                     clientFirebaseKey: clientReg.clientFirebaseKey,
//                     registrationKey: clientReg.registrationKey,
//                     clientName: `${clientReg.firstName} ${clientReg.lastName}`, 
//                     assignedTo: clientReg.assignedTo
//                 }))
//         ));
        
//         setLoading(false);
//     });

//     const unsubscribeUsers = onValue(usersRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//             const usersArray = Object.keys(data).map(key => ({ firebaseKey: key, ...data[key] }));
//             setAllEmployees(usersArray); 
//             const employeesOnly = usersArray.filter(user => 
//                 user.roles && Array.isArray(user.roles) && user.roles.includes('employee')
//             );
//             setEmployeesForAssignment(employeesOnly);
//         }
//     });

//     return () => {
//         unsubscribeManager();
//         unsubscribeClients();
//         unsubscribeUsers();
//     };
// }, []);
 

//   // State to manage editable profile fields
//   const [editableProfile, setEditableProfile] = useState({});
//   // NEW: State to control if user profile fields are editable
//   const [isEditingUserProfile, setIsEditingUserProfile] = useState(false);


//   // State to control the visibility of the Unassigned Clients modal
//   const [isUnassignedClientsModalOpen, setIsUnassignedClientsModalOpen] = useState(false);

//   // State to control the visibility of the Assign Client to Employee modal
//   const [isAssignClientModalOpen, setIsAssignClientModalOpen] = useState(false);
//   // State to hold the client data for the "Assign Client to Employee" modal
//   const [selectedClientToAssign, setSelectedClientToAssign] = useState(null);

//   // States for the "Assign Client to Employee" form
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [assignmentPriority, setAssignmentPriority] = useState('medium'); // Default priority
//   // FIX: Corrected assignmentNotes state initialization
//   const [assignmentNotes, setAssignmentNotes] = useState('');

//   // State for the selected priority filter in the modal
//   const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'high', 'medium', 'low'
//   // NEW STATE: Search query for the Unassigned Clients modal
//   const [unassignedSearchQuery, setUnassignedSearchQuery] = useState('');


//   // New state for the "Total Clients" modal visibility
//   const [isTotalClientsModalOpen, setIsTotalClientsModalOpen] = useState(false);

//   // NEW STATE: For the Employee's Assigned Clients Detail Modal
//   const [isEmployeeClientsModalOpen, setIsEmployeeClientsModalOpen] = useState(false);
// const [selectedEmployeeForClients, setSelectedEmployeeForClients] = useState({
//    fullName: '',
//   role: '',
//   workEmail: '',
//   email: '',
//   assignedClients: [] // Initialize with empty array
// });
//   // NEW STATE: Search query for Interviews tab
//   const [interviewSearchQuery, setInterviewSearchQuery] = useState('');
//   // NEW STATE: Filter for Interviews tab
//   const [interviewFilterRound, setInterviewFilterRound] = useState('All Rounds');

//   // NEW STATE: Search query for Applications tab
//   const [applicationSearchQuery, setApplicationSearchQuery] = useState(''); // Added for Applications tab search
//   // FIX: Corrected useState initialization for applicationFilterEmployee
//   const [applicationFilterEmployee, setApplicationFilterEmployee] = useState(''); // Added for Applications tab filter
//   // NEW STATE: Filter by client for Applications tab
//   const [applicationFilterClient, setApplicationFilterClient] = useState(''); // New state for client filter
  
//   // NEW STATE: Search query for Assigned tab employees
//   const [assignedEmployeeSearchQuery, setAssignedEmployeeSearchQuery] = useState(''); // New state for employee search

//   // NEW STATE: For Client Preview Modal
//   const [isClientPreviewModalOpen, setIsClientPreviewModalOpen] = useState(false);
//   const [clientToPreview, setClientToPreview] = useState(null);

//   // NEW STATE: For Reassign Client Modal
//   const [isReassignClientModalOpen, setIsReassignClientModalOpen] = useState(false);
//   const [clientToReassign, setClientToReassign] = useState(null);

//   // NEW STATE: For Edit Client Modal (repurposing the preview modal)
//   const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
//   const [clientToEdit, setClientToEdit] = useState(null);
//   // NEW: State to control if user profile fields are editable
//   const [isEditingClient, setIsEditingClient] = useState(false);

//   // Add these states near your other useState declarations
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   // NEW: State for LLM response and loading status
//   const [llmResponse, setLlmResponse] = useState('');
//   const [isLoadingLLMResponse, setIsLoadingLLMResponse] = useState(false);
//     const [newResumeFile, setNewResumeFile] = useState(null);


// const [applicationFilterDateRange, setApplicationFilterDateRange] = useState({ startDate: '', endDate: '' });
// const [interviewFilterDateRange, setInterviewFilterDateRange] = useState({ startDate: '', endDate: '' });


//   const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
//   const [sortOrder, setSortOrder] = useState('Newest First');
//   const [quickFilter, setQuickFilter] = useState('');
  

//   // ... (rest of the state declarations)

//   // MODIFICATION: Add filter handler functions
//   const handleDateRangeChange = (e) => {
//     setFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleQuickFilterChange = (filterType) => {
//     const today = new Date();
//     let startDate = '';
//     let endDate = today.toISOString().split('T')[0];

//     if (filterType === 'Last 7 Days') {
//       const sevenDaysAgo = new Date(today);
//       sevenDaysAgo.setDate(today.getDate() - 7);
//       startDate = sevenDaysAgo.toISOString().split('T')[0];
//     } else if (filterType === 'Last 30 Days') {
//       const thirtyDaysAgo = new Date(today);
//       thirtyDaysAgo.setDate(today.getDate() - 30);
//       startDate = thirtyDaysAgo.toISOString().split('T')[0];
//     } else if (filterType === 'All Time') {
//       startDate = '';
//       endDate = '';
//     }
//     setFilterDateRange({ startDate, endDate });
//     setQuickFilter(filterType);
//   };
  
//   const areFiltersActive = () => {
//     return filterDateRange.startDate !== '' || filterDateRange.endDate !== '' || sortOrder !== 'Newest First' || quickFilter !== '';
//   };

// const handleClearFilters = () => {
//     // Clear filters for the currently active tab
//     if (activeTab === 'Applications') {
//         setApplicationFilterDateRange({ startDate: '', endDate: '' });
//         setSortOrder('Newest First');
//     } else if (activeTab === 'Interviews') {
//         setInterviewFilterDateRange({ startDate: '', endDate: '' });
//         setSortOrder('Newest First');
//     }
//     // Clear specific search/filter states that are not part of the date range
//     setApplicationSearchQuery('');
//     setApplicationFilterEmployee('');
//     setApplicationFilterClient('');
//     setInterviewSearchQuery('');
//     setInterviewFilterRound('All Rounds');
// };

// // Inside the ManagerWorkSheet component, replace or add these functions
// const handleClearApplicationsFilters = () => {
//     // Clear all filter states specific to the Applications tab
//     setApplicationFilterDateRange({ startDate: '', endDate: '' });
//     setSortOrder('Newest First');
//     setApplicationSearchQuery('');
//     setApplicationFilterEmployee('');
//     setApplicationFilterClient('');
// };

// const areApplicationsFiltersActive = () => {
//     // Check all filter states specific to the Applications tab
//     return (
//         applicationFilterDateRange.startDate !== '' ||
//         applicationFilterDateRange.endDate !== '' ||
//         sortOrder !== 'Newest First' ||
//         applicationSearchQuery !== '' ||
//         applicationFilterEmployee !== '' ||
//         applicationFilterClient !== ''
//     );
// };

// const handleClearInterviewsFilters = () => {
//     // Clear all filter states specific to the Interviews tab
//     setInterviewFilterDateRange({ startDate: '', endDate: '' });
//     setSortOrder('Newest First');
//     setInterviewSearchQuery('');
//     setInterviewFilterRound('All Rounds');
// };

// const areInterviewsFiltersActive = () => {
//     // Check all filter states specific to the Interviews tab
//     return (
//         interviewFilterDateRange.startDate !== '' ||
//         interviewFilterDateRange.endDate !== '' ||
//         sortOrder !== 'Newest First' ||
//         interviewSearchQuery !== '' ||
//         interviewFilterRound !== 'All Rounds'
//     );
// };

//   const selectedEmployeeDetails = useMemo(() => {
//     if (!selectedEmployee || !displayEmployees.length) return null;
//     return displayEmployees.find(e => e.firebaseKey === selectedEmployee);
// }, [selectedEmployee, displayEmployees]);



//   // Helper function to format date to DD/MM/YYYY
//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       // Check if the date is valid
//       if (isNaN(date.getTime())) {
//         // If it's not a valid date, try to parse it as DD/MM/YYYY if it already is
//         const parts = dateString.split('/');
//         if (parts.length === 3) {
//           const [day, month, year] = parts;
//           return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
//         }
//         return dateString; // Return original if invalid and not DD/MM/YYYY
//       }
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error);
//       return dateString; // Fallback to original string on error
//     }
//   };

//   const getLocalDateString = (date = new Date()) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

//   const [unassignedClients, setUnassignedClients] = useState([]);
//   const [assignedClients, setAssignedClients] = useState([]);
//   const [allEmployees, setAllEmployees] = useState([]);
//   const [interviewData, setInterviewData] = useState([]);
//   const [applicationData, setApplicationData] = useState([]); // Initialize as empty, will be populated by useEffect

//   // State to store application counts per client
//   const [clientApplicationCounts, setClientApplicationCounts] = useState({});

//   // NEW: Comprehensive dummy data for client details (from EmployeeData.txt structure)
//   // This data will be the source of truth for detailed client profiles
//   const [mockDetailedClientsData, setMockDetailedClientsData] = useState([]);


//   // Effect to update userAvatarLetter when userName changes (if it were dynamic)
//   useEffect(() => {
//     if (userName) {
//       setUserAvatarLetter(userName.charAt(0).toUpperCase());
//     }
//   }, [userName]);

//   // Effect to apply the theme class to the body and save to local storage
//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//     localStorage.setItem('theme', theme);
//     console.log('Current theme:', theme); // Debugging: log theme changes
//   }, [theme]);

//   // Effect to freeze/unfreeze background scrolling based on any modal being open
//   useEffect(() => {
//     if (isUnassignedClientsModalOpen || isAssignClientModalOpen || isTotalClientsModalOpen || isEmployeeClientsModalOpen || isClientPreviewModalOpen || isReassignClientModalOpen || isEditClientModalOpen || isNotificationsModalOpen || isUserProfileModalOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = ''; // Reset to default
//     }
//     // Cleanup function to ensure overflow is reset when component unmounts or modals close
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isUnassignedClientsModalOpen, isAssignClientModalOpen, isTotalClientsModalOpen, isEmployeeClientsModalOpen, isClientPreviewModalOpen, isReassignClientModalOpen, isEditClientModalOpen, isNotificationsModalOpen, isUserProfileModalOpen]);

//   // Effect to handle clicks outside the profile dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//         setIsProfileDropdownOpen(false);
//       }
//     };

//     if (isProfileDropdownOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isProfileDropdownOpen]);



//   // Effect to calculate application counts per client
//   useEffect(() => {
//     const counts = {};
//     applicationData.forEach(app => {
//       counts[app.clientName] = (counts[app.clientName] || 0) + 1;
//     });
//     setClientApplicationCounts(counts);
//   }, [applicationData]);


//   // NEW: useEffect to update employee assigned client counts whenever assignedClients changes
//   // ADD THIS NEW useEffect TO PROCESS AND COMBINE ALL EMPLOYEE DATA
//   useEffect(() => {
//     // 1. Create a map of client counts for efficient lookup
//     const clientCounts = assignedClients.reduce((acc, client) => {
//       acc[client.assignedTo] = (acc[client.assignedTo] || 0) + 1;
//       return acc;
//     }, {});

//     // 2. Enrich the master employee list with the calculated data
//     const enrichedEmployees = allEmployees.map(emp => {
//       const fullName = `${emp.firstName} ${emp.lastName}`;

//       // 3. Provide a fallback success rate if one doesn't exist
//       const successRate = emp.successRate || Math.floor(75 + Math.random() * 20); // Random rate between 75-95

//       return {
//         ...emp,
//         fullName: fullName,
//         assignedClients: clientCounts[emp.firebaseKey] || 0, // Get count from the map
//         successRate: successRate,
//         avatar: emp.avatar || getInitials(fullName), // Use existing avatar or fallback to initials
//       };
//     });

//     setDisplayEmployees(enrichedEmployees);

//   }, [allEmployees, assignedClients]); // This effect re-runs when the source data changes

//   // Add this new state variable for the employee selection modal
//   const [isEmployeeSelectModalOpen, setIsEmployeeSelectModalOpen] = useState(false);


//   // Function to toggle between light and dark themes
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   // Function to handle radio button change
//   const handleRadioChange = (event) => {
//     setActiveTab(event.target.value);
//     console.log('Active tab set to:', event.target.value); // Debugging: log tab changes
//   };

//   // Function to open the Unassigned Clients modal
//   const openUnassignedClientsModal = () => {
//     setIsUnassignedClientsModalOpen(true);
//   };

//   // Function to close the Unassigned Clients modal
//   const closeUnassignedClientsModal = () => {
//     setIsUnassignedClientsModalOpen(false);
//     // Reset filter and search when closing the modal
//     setFilterPriority('all');
//     setUnassignedSearchQuery('');
//   };

//   // Handler for priority filter change in Unassigned Clients modal
//   const handleFilterPriorityChange = (event) => {
//     setFilterPriority(event.target.value);
//   };

//   // Handler for search input change in Unassigned Clients modal
//   const handleUnassignedSearchChange = (event) => {
//     setUnassignedSearchQuery(event.target.value);
//   };

//   // Filter clients based on selected priority AND search query
//   const filteredClients = unassignedClients.filter(client => {
//     const matchesPriority = filterPriority === 'all' || client.priority === filterPriority;
//     const lowerCaseSearchQuery = unassignedSearchQuery.toLowerCase();

//     // NEW: Added checks (e.g., client.name || '') to prevent errors if a property is missing.
//     const matchesSearch =
//       (client.name || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//       (client.skills || []).some(skill => (skill || '').toLowerCase().includes(lowerCaseSearchQuery)) ||
//       (client.experience || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//       (client.email || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//       (client.salary || '').toLowerCase().includes(lowerCaseSearchQuery);

//     return matchesPriority && matchesSearch;
//   });

//   // Function to open the Assign Client to Employee modal (for NEW assignments)
//   const openAssignClientModal = (client) => {
//     setSelectedClientToAssign(client);
//     // Reset employee and notes when opening for a new assignment
//     setSelectedEmployee('');
//     setAssignmentPriority(client.priority || 'medium'); // Pre-fill with client's priority
//     setAssignmentNotes('');
//     setIsAssignClientModalOpen(true);
//   };

//   // Function to close the Assign Client to Employee modal (for NEW assignments)
//   const closeAssignClientModal = () => {
//     setIsAssignClientModalOpen(false);
//     setSelectedClientToAssign(null); // Clear selected client
//   };

//   // Function to open the Reassign Client modal
//   const openReassignClientModal = (client) => {
//     setClientToReassign(client);
//     setSelectedEmployee(''); // Reset selected employee for the new modal
//     setAssignmentPriority(client.priority || 'medium'); // Pre-fill with client's priority
//     setAssignmentNotes('');
//     setIsReassignClientModalOpen(true);
//   };

//   // Function to close the Reassign Client modal
//   const closeReassignClientModal = () => {
//     setIsReassignClientModalOpen(false);
//     setClientToReassign(null);
//     setSelectedEmployee(''); // Clear selected employee
//     setAssignmentPriority('medium'); // Reset priority
//     setAssignmentNotes(''); // Reset notes
//   };


//   // Handler for "Assign Client" or "Reassign Client" button submission
// const handleAssignmentSubmit = async () => {
//     const clientToProcess = clientToReassign || selectedClientToAssign;

//     if (!clientToProcess || !selectedEmployee || !clientToProcess.clientFirebaseKey || !clientToProcess.registrationKey) {
//         alert('Error: Missing client, employee, or necessary keys to complete the assignment.');
//         return;
//     }

//     const employeeInfo = allEmployees.find(emp => emp.firebaseKey === selectedEmployee);
//     if (!employeeInfo) {
//         alert('Error: Could not find the selected employee. Please try again.');
//         return;
//     }

//     const registrationRef = ref(database, `clients/${clientToProcess.clientFirebaseKey}/serviceRegistrations/${clientToProcess.registrationKey}`);

//     const updates = {
//         assignedTo: employeeInfo.firebaseKey,
//         assignmentStatus: 'pending_acceptance',
//         assignedDate: new Date().toISOString().split('T')[0],
//         priority: assignmentPriority,
//     };

//     try {
//         await update(registrationRef, updates);

//         const updatedClient = { ...clientToProcess, ...updates };

//         // Check if the client is being reassigned or newly assigned.
//         const isReassigning = !!clientToReassign;

//         // Atomically update both the assigned and unassigned client lists.
//      if (isReassigning) {
//   // For a reassignment, just update the client in the assigned list.
//   setAssignedClients(prevAssigned =>
//     prevAssigned.map(c => c.registrationKey === updatedClient.registrationKey ? updatedClient : c)
//   );
// } else {
//   // For a new assignment, remove from unassigned and add to assigned without duplication.
//   setUnassignedClients(prevUnassigned =>
//     prevUnassigned.filter(c => c.registrationKey !== updatedClient.registrationKey)
//   );
//   setAssignedClients(prevAssigned => {
//     const filtered = prevAssigned.filter(c => c.registrationKey !== updatedClient.registrationKey);
//     return [...filtered, updatedClient];
//   });
// }
        
//         setSuccessMessage(`Successfully assigned ${clientToProcess.firstName} to ${employeeInfo.firstName} ${employeeInfo.lastName}.`);
//         setShowSuccessModal(true);

//         if (isReassigning) closeReassignClientModal();
//         else closeAssignClientModal();

//     } catch (error) {
//         console.error("Firebase update failed:", error);
//         alert("Failed to assign client. Please try again.");
//     }
// };

//   // Handler for "Quick Assign" button
//   const handleQuickAssign = () => {
//     if (filteredClients.length > 0) {
//       openAssignClientModal(filteredClients[0]); // Open with the first filtered client
//     } else {
//       console.error('No clients available to quick assign. Please add clients or adjust filters.');
//     }
//   };

//   // Function to open the Total Clients modal
//   const openTotalClientsModal = () => {
//     setIsTotalClientsModalOpen(true);
//   };

//   // Function to close the Total Clients modal
//   const closeTotalClientsModal = () => {
//     setIsTotalClientsModalOpen(false);
//   };

//   // NEW: Function to open Employee Clients Detail Modal
// const openEmployeeClientsModal = (employee) => {
//   // Get clients assigned to this specific employee
//   const employeeClients = assignedClients.filter(client => 
//     client.assignedTo === (employee.firebaseKey || employee.id)
//   );
  
//   setSelectedEmployeeForClients({
//     fullName: employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
//     role: employee.role || (employee.roles && employee.roles.join(', ')) || '',
//     workEmail: employee.workEmail || '',
//     email: employee.email || '',
//     assignedClients: employeeClients
//   });
//   setIsEmployeeClientsModalOpen(true);
// };

//   // NEW: Function to close Employee Clients Detail Modal
//   const closeEmployeeClientsModal = () => {
//     setIsEmployeeClientsModalOpen(false);
//     setSelectedEmployeeForClients(null);
//   };

//   // Handlers for Interviews tab search and filter
//   const handleInterviewSearchChange = (event) => {
//     setInterviewSearchQuery(event.target.value);
//   };

//   const handleInterviewFilterRoundChange = (event) => {
//     setInterviewFilterRound(event.target.value);
//   };

// const filteredInterviewData = useMemo(() => {
//     const lowerCaseSearchQuery = interviewSearchQuery.toLowerCase();
    
//     // Create an employee map for efficient lookup
//     const employeeMap = new Map(allEmployees.map(emp => [emp.firebaseKey, emp]));

//     return interviewData.filter(interview => {
//         // Find the employee's name for the search
//         const employee = employeeMap.get(interview.assignedTo);
//         const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.toLowerCase() : '';

//         const matchesSearch = 
//             employeeName.includes(lowerCaseSearchQuery) ||
//             (interview.clientName || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//             (interview.jobTitle || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//             (interview.company || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//             // FIX: Add 'round' to the search criteria
//             (interview.round || '').toLowerCase().includes(lowerCaseSearchQuery);
        
//         const matchesRound = interviewFilterRound === 'All Rounds' || interview.round === interviewFilterRound;

//         const interviewDate = new Date(interview.interviewDate);
//         const start = interviewFilterDateRange.startDate ? new Date(interviewFilterDateRange.startDate) : null;
//         const end = interviewFilterDateRange.endDate ? new Date(interviewFilterDateRange.endDate) : null;
//         if(start) start.setHours(0,0,0,0);
//         if(end) end.setHours(23,59,59,999);
//         const matchesDateRange = (!start || interviewDate >= start) && (!end || interviewDate <= end);

//         return matchesSearch && matchesRound && matchesDateRange;
//     }).sort((a, b) => {
//         const dateA = new Date(a.interviewDate);
//         const dateB = new Date(b.interviewDate);
//         if (sortOrder === 'Newest First') return dateB - dateA;
//         if (sortOrder === 'Oldest First') return dateA - dateB;
//         return 0;
//     });
// }, [interviewData, interviewSearchQuery, interviewFilterRound, interviewFilterDateRange, sortOrder, allEmployees]);


//   // Handlers for Applications tab search and filter
//   const handleApplicationSearchChange = (event) => {
//     setApplicationSearchQuery(event.target.value);
//   };

//   const handleApplicationFilterEmployeeChange = (event) => {
//     setApplicationFilterEmployee(event.target.value);
//   };

//   // NEW: Handler for client filter change in Applications tab
//   const handleApplicationFilterClientChange = (event) => {
//     setApplicationFilterClient(event.target.value);
//   };

// const filteredApplicationData = useMemo(() => {
//     const employeeMap = new Map(allEmployees.map(emp => [emp.firebaseKey, emp]));

//     let filtered = applicationData.filter(app => {
//         const employee = employeeMap.get(app.assignedTo);
//         const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
        
//         const lowerCaseSearchQuery = applicationSearchQuery.toLowerCase();
        
//         const matchesSearch = applicationSearchQuery === '' ||
//             (employeeName.toLowerCase().includes(lowerCaseSearchQuery)) ||
//             (app.clientName || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//             (app.jobTitle || '').toLowerCase().includes(lowerCaseSearchQuery) ||
//             (app.company || '').toLowerCase().includes(lowerCaseSearchQuery);
        
//         const matchesEmployee = applicationFilterEmployee === '' || app.assignedTo === applicationFilterEmployee;
//         const matchesClient = applicationFilterClient === '' || app.clientName === applicationFilterClient;

//         const appDate = new Date(app.appliedDate);
//         const start = applicationFilterDateRange.startDate ? new Date(applicationFilterDateRange.startDate) : null;
//         const end = applicationFilterDateRange.endDate ? new Date(applicationFilterDateRange.endDate) : null;
//         if(start) start.setHours(0,0,0,0);
//         if(end) end.setHours(23,59,59,999);
//         const matchesDateRange = (!start || appDate >= start) && (!end || appDate <= end);
        
//         return matchesSearch && matchesEmployee && matchesClient && matchesDateRange;
//     });

//     filtered.sort((a, b) => {
//         const dateA = new Date(a.appliedDate);
//         const dateB = new Date(b.appliedDate);
//         if (sortOrder === 'Newest First') return dateB - dateA;
//         if (sortOrder === 'Oldest First') return dateA - dateB;
//         if (sortOrder === 'Job Title A-Z') return (a.jobTitle || '').localeCompare(b.jobTitle || '');
//         if (sortOrder === 'Company A-Z') return (a.company || '').localeCompare(b.company || '');
//         return 0;
//     });

//     return filtered;
// }, [applicationData, applicationSearchQuery, applicationFilterEmployee, applicationFilterClient, applicationFilterDateRange, sortOrder, allEmployees]);

//   // Get unique client names for the filter dropdown - NOW ONLY FROM ASSIGNED CLIENTS
// const uniqueAssignedClientNames = useMemo(() => {
//   return [...new Set(assignedClients.map(client => `${client.firstName} ${client.lastName}`.trim()))];
// }, [assignedClients]);

// const uniqueAssignedEmployeeNames = [...new Set(assignedClients.map(client => client.assignedTo))];

//   // Handler for Assigned Employees search bar
//   const handleAssignedEmployeeSearchChange = (event) => {
//     setAssignedEmployeeSearchQuery(event.target.value);
//   };

//   // Filtered employees for the "Assigned" tab
// const filteredEmployees = displayEmployees.filter(employee => {
//     // Only show employees that have at least one client assigned by this manager
//     const clientsForEmployee = assignedClients.filter(c => c.assignedTo === employee.firebaseKey);
//     return clientsForEmployee.length > 0;
// });

//    const [employeesForAssignment, setEmployeesForAssignment] = useState([]);

//     const handleResumeFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewResumeFile(e.target.files[0]);
//     }
//   };

//   // NEW: Function to open Client Preview/Edit Modal
//   const openEditClientModal = (clientObject) => {
//     if (clientObject) {
//       setClientToEdit({ ...clientObject }); // Create a copy for editing
//       setIsEditingClient(false); // Set to read-only initially
//       setIsEditClientModalOpen(true);
//       setLlmResponse(''); // Clear previous LLM response
//       setNewResumeFile(null);
//     } else {
//       console.warn(`Client with name not found for editing.`);
//       alert(`Client details for are not available for editing.`);
//     }
//   };

//   // NEW: Function to close Client Preview/Edit Modal
//   const closeEditClientModal = () => {
//     setIsEditClientModalOpen(false);
//     setClientToEdit(null);
//     setIsEditingClient(false); // Reset edit mode on close
//     setLlmResponse(''); // Clear LLM response on close
//     setNewResumeFile(null);
//   };

//   // NEW: Handle changes in the edit client form
//   const handleEditClientChange = (e) => {
//     const { name, value } = e.target;

//     // Special handling for skills, which should be an array
//     if (name === 'technologySkills') {
//       setClientToEdit(prev => ({
//         ...prev,
//         [name]: value.split(',').map(skill => skill.trim())
//       }));
//     } else {
//       setClientToEdit(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // NEW: Handle updating client details
//  const handleUpdateClient = async () => {
//     // 1. Check for the correct keys to ensure we can save.
//     if (!clientToEdit || !clientToEdit.clientFirebaseKey || !clientToEdit.registrationKey) {
//       console.error("Cannot update: missing client or registration key.");
//       alert("An error occurred while trying to save client details.");
//       return;
//     }

//     let updatedClientData = { ...clientToEdit };

//     // Handle new resume upload if a file was selected
//     if (newResumeFile) {
//       try {
//         const fileRef = storageRef(getStorage(), `resumes/${clientToEdit.clientFirebaseKey}/${clientToEdit.registrationKey}/${newResumeFile.name}`);
//         const uploadResult = await uploadBytes(fileRef, newResumeFile);
//         const downloadURL = await getDownloadURL(uploadResult.ref);

//         // Update the data object with the new resume info
//         updatedClientData.resumeUrl = downloadURL;
//         updatedClientData.resumeFileName = newResumeFile.name;
        
//       } catch (uploadError) {
//         console.error("Failed to upload new resume:", uploadError);
//         alert("Error uploading resume. Client details were not saved.");
//         return; // Stop the save process if upload fails
//       }
//     }

//             // NEW: Handle new cover letter upload if a file was selected
//         if (newCoverLetterFile) {
//             try {
//                 const fileRef = storageRef(getStorage(), `coverletters/${clientToEdit.clientFirebaseKey}/${clientToEdit.registrationKey}/${newCoverLetterFile.name}`);
//                 const uploadResult = await uploadBytes(fileRef, newCoverLetterFile);
//                 const downloadURL = await getDownloadURL(uploadResult.ref);
//                 updatedClientData.coverLetterUrl = downloadURL;
//                 updatedClientData.coverLetterFileName = newCoverLetterFile.name;
//             } catch (uploadError) {
//                 console.error("Failed to upload new cover letter:", uploadError);
//                 alert("Error uploading cover letter. Client details were not saved.");
//                 return;
//             }
//         }

//     // 2. Separate the data: some fields belong to the main client profile,
//     //    and the rest belong to the specific service registration.
//     const {
//         clientFirebaseKey,
//         registrationKey,
//         // Parent client fields
//         firstName,
//         lastName,
//         email,
//         mobile,
//         // The rest of the data is for the registration
//         ...registrationData
//     } = updatedClientData;

//     // 3. Define the two paths we need to update in Firebase.
//     const registrationRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`);
//     const clientProfileRef = ref(database, `clients/${clientFirebaseKey}`);

//     // 4. Prepare the objects for the two separate updates.
//     const profileUpdate = {
//         firstName,
//         lastName,
//         email,
//         mobile
//     };

//     try {
//         // 5. Perform both updates: one for the registration and one for the main profile.
//         await update(registrationRef, registrationData);
//         await update(clientProfileRef, profileUpdate);

//         setSuccessMessage(`Successfully updated details for ${firstName} ${lastName}.`);
//         setShowSuccessModal(true);
//         // setIsEditingClient(false); // Switch back to view mode
//         closeEditClientModal(); // Close the modal on success
//     } catch (error) {
//         console.error("Failed to update client details:", error);
//         alert("Error updating client details.");
//     }
//   };

//   // NEW: Function to handle resume download
//   const handleResumeDownload = (resumeFileName) => {
//     if (resumeFileName) {
//       alert(`Simulating download for: ${resumeFileName}\n(In a real application, this would trigger a file download.)`);
//     } else {
//       alert('No resume file available for this client.');
//     }
//   };

//   // NEW: Function to call LLM for client summary
//   const generateClientSummary = async () => {
//     if (!clientToEdit) return;

//     setIsLoadingLLMResponse(true);
//     setLlmResponse(''); // Clear previous response

//     const prompt = `Generate a concise summary for the following client profile, highlighting key skills, experience, job preferences, and any notable information relevant for a placement specialist. Focus on what makes this candidate suitable for a role.

// Client Name: ${clientToEdit.name || clientToEdit.clientName}
// Experience: ${clientToEdit.experience}
// Skills: ${Array.isArray(clientToEdit.skills) ? clientToEdit.skills.join(', ') : clientToEdit.skills}
// Jobs to Apply: ${clientToEdit.jobsToApply}
// Work Preference: ${clientToEdit.workPreference}
// Current Company: ${clientToEdit.currentCompany}
// Current Designation: ${clientToEdit.currentDesignation}
// Expected Salary: ${clientToEdit.expectedSalary}
// Visa Status: ${clientToEdit.visaStatus}
// Security Clearance: ${clientToEdit.securityClearance} ${clientToEdit.securityClearance === 'Yes' ? `(${clientToEdit.clearanceLevel})` : ''}
// Willing to Relocate: ${clientToEdit.willingToRelocate}
// Priority: ${clientToEdit.priority}

// Please provide a summary no longer than 150 words.`;

//     try {
//       let chatHistory = [];
//       chatHistory.push({ role: "user", parts: [{ text: prompt }] });
//       const payload = { contents: chatHistory };
//       const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       if (result.candidates && result.candidates.length > 0 &&
//         result.candidates[0].content && result.candidates[0].content.parts &&
//         result.candidates[0].content.parts.length > 0) {
//         const text = result.candidates[0].content.parts[0].text;
//         setLlmResponse(text);
//       } else {
//         setLlmResponse('Failed to generate summary. Please try again.');
//         console.error('Gemini API response was unexpected:', result);
//       }
//     } catch (error) {
//       console.error('Error calling Gemini API:', error);
//       setLlmResponse('Error generating summary. Please check your network or try again later.');
//     } finally {
//       setIsLoadingLLMResponse(false);
//     }
//   };


//   // Calculate priority counts for the modal header based on current unassignedClients state
//   const highPriorityCount = unassignedClients.filter(client => client.priority === 'high').length;
//   const mediumPriorityCount = unassignedClients.filter(client => client.priority === 'medium').length;
//   const lowPriorityCount = unassignedClients.filter(client => client.priority === 'low').length;
//   const totalUnassignedCount = unassignedClients.length;
//   // totalClientsCount now dynamically reflects current assigned clients ONLY
//   const totalClientsCount = assignedClients.length;

//   // Calculate total assigned clients from employees data for the "Assigned" tab header
//   const totalAssignedClientsByEmployee = displayEmployees.reduce((sum, emp) => sum + (emp.assignedClients || 0), 0);; // Ensure it handles undefined assignedClients


//   // Profile dropdown handlers
//   const toggleProfileDropdown = () => {
//     setIsProfileDropdownOpen(prevState => !prevState);
//   };

//   // NEW: Function to open Notifications Modal
//   const openNotificationsModal = () => {
//     setIsNotificationsModalOpen(true);
//   };

//   // NEW: Function to close Notifications Modal
//   const closeNotificationsModal = () => {
//     setIsNotificationsModalOpen(false);
//   };

//   // NEW: Function to open User Profile Modal
//   const openUserProfileModal = () => {
//     setEditableProfile({ ...userProfile }); // Initialize editable profile with current user data
//     setIsEditingUserProfile(false); // Set to read-only initially
//     setIsUserProfileModalOpen(true);
//     setIsProfileDropdownOpen(false); // Close dropdown when modal opens
//   };

//   // NEW: Function to close User Profile Modal
//   const closeUserProfileModal = () => {
//     setIsUserProfileModalOpen(false);
//     setIsEditingUserProfile(false); // Reset edit mode on close
//   };

//   // NEW: Handle changes in the editable profile form
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setEditableProfile(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // NEW: Handle saving profile changes
//     const handleSaveProfile = async () => {
//         if (!userProfile.firebaseKey) {
//             alert("Error: Cannot update profile. User key is missing.");
//             return;
//         }
//         try {
//             const userRef = ref(database, `users/${userProfile.firebaseKey}`);
//             await update(userRef, editableProfile);

//             // Update local state and session storage
//             setUserProfile(editableProfile);
//             setUserName(`${editableProfile.firstName} ${editableProfile.lastName}`);
//             sessionStorage.setItem('loggedInEmployee', JSON.stringify(editableProfile));
            
//             setIsEditingUserProfile(false);
//             setSuccessMessage("Profile updated successfully!");
//             setShowSuccessModal(true);
//         } catch (error) {
//             console.error("Error updating profile in Firebase:", error);
//             alert("Failed to update profile. Please try again.");
//         }
//     };

//   const handleProfileClick = () => {
//     console.log('View Profile clicked');
//     openUserProfileModal(); // Open the new user profile modal
//   };

//   const handleSettingsClick = () => {
//     console.log('Settings clicked');
//     setIsProfileDropdownOpen(false);
//     // Add navigation to settings page or open settings modal
//   };

//   const handleLogout = () => {
//     console.log('Logout clicked');
//     setIsProfileDropdownOpen(false);
//     // Implement logout logic (e.g., clear session, redirect to login)
//     window.location.href = '/'; // Redirect to home page on logout
//   };

//   // --- NEW Component for the Applications Tab UI ---
// const ApplicationsTab = ({ 
//   applicationData,
//   employees,
//   uniqueClientNames,
//   applicationFilterEmployee,
//   handleApplicationFilterEmployeeChange,
//   applicationFilterClient,
//   handleApplicationFilterClientChange,
//   applicationFilterDateRange,
//   handleApplicationFilterDateRangeChange,
//   sortOrder,
//   setSortOrder,
//   applicationSearchQuery,
//   handleApplicationSearchChange,
//   areFiltersActive,
//   handleClearFilters,
//   onViewDetails,
//   onEdit,
//   onDelete
//   }) => {
//   const [expandedDate, setExpandedDate] = useState(null);

//   const getInitials = (name) => {
//     if (!name) return '';
//     const parts = name.split(' ');
//     if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
//     return name.substring(0, 2);
//   };
  
//     const groupedByDate = useMemo(() => {
//     return applicationData.reduce((acc, app) => {
//         const dateKey = getLocalDateString(new Date(app.appliedDate));
//         if (!acc[dateKey]) {
//             acc[dateKey] = [];
//         }
//         acc[dateKey].push(app);
//         return acc;
//     }, {});
//   }, [applicationData]);

//   const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

//    return (
// <section className="applications-management-section">
//       <h2 className="client-assignment-title">Client Applications</h2>
//        <FilterComponent
//               filterDateRange={applicationFilterDateRange}
//               handleDateRangeChange={handleApplicationFilterDateRangeChange}
//               sortOrder={sortOrder}
//               setSortOrder={setSortOrder}
//               areFiltersActive={areFiltersActive}
//               handleClearFilters={handleClearFilters}
//               sortOptions={['Newest First', 'Oldest First', 'Job Title A-Z', 'Company A-Z']}
//             />
      
//       <div className="applications-filters">
//         <div className="search-input-wrapper">
//           <i className="fas fa-search"></i>
//           <input
//             type="text"
//             placeholder="Search by Employee, Client, Job Title..."
//             value={applicationSearchQuery}
//             onChange={handleApplicationSearchChange}
//           />
//         </div>
//         <div className="filter-dropdown">
//          <select value={applicationFilterEmployee} onChange={handleApplicationFilterEmployeeChange}>
//             <option value="">Filter by Employee</option>
//             {employees.map(employee => (
//                  <option key={employee.firebaseKey} value={employee.firebaseKey}>{employee.fullName}</option>
//             ))}
//             </select>
//           <i className="fas fa-chevron-down"></i>
//         </div>
//         <div className="filter-dropdown">
//           <select value={applicationFilterClient} onChange={handleApplicationFilterClientChange}>
//             <option value="">Filter by Client</option>
//             {uniqueClientNames.map(name => (
//               <option key={name} value={name}>{name}</option>
//             ))}
//           </select>
//           <i className="fas fa-chevron-down"></i>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="applications-table">
//           <thead>
//             <tr>
//               <th>Employee</th>
//               <th>Client</th>
//               <th>Job Title</th>
//               <th>Applied Date</th>
//               <th>Total Applications</th>
//               <th>Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedDates.length > 0 ? (
//                 sortedDates.map(dateKey => {
//                     const dateApplications = groupedByDate[dateKey];
//                     const isExpanded = expandedDate === dateKey;
//                     const firstApp = dateApplications[0];
//                     const employee = employees.find(e => e.firebaseKey === firstApp.assignedTo);
//                     const clientName = firstApp.clientName;

//                     return (
//                         <React.Fragment key={dateKey}>
//                             <tr onClick={() => setExpandedDate(isExpanded ? null : dateKey)} style={{ cursor: 'pointer' }}>
//                                 <td className="employee-cell">
//                                     <div className="employee-avatar">{employee ? getInitials(`${employee.firstName} ${employee.lastName}`) : '??'}</div>
//                                     {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
//                                 </td>
//                                 <td>{clientName}</td>
//                                 <td>{firstApp.jobTitle}</td>
//                                 <td style={{ textAlign: 'center' }}>
//                                   {formatDateToDDMMYYYY(dateKey)}
//                                 </td>
//                                 <td style={{ textAlign: 'center' }}>{dateApplications.length}</td>
//                                 <td style={{ textAlign: 'center' }}>
//                                     <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}>
//                                         <i className="fas fa-chevron-down"></i>
//                                     </span>
//                                 </td>
//                             </tr>
//                             {isExpanded && (
//                                 <tr>
//                                     <td colSpan="6" style={{ padding: '0 15px', backgroundColor: 'var(--bg-color)' }}>
//                                         <div style={{ padding: '15px', border: '1px solid var(--header-border-color)', borderRadius: '8px', margin: '10px 0' }}>
//                                             <table className="applications-table" style={{ minWidth: 'auto' }}>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Company</th>
//                                                         <th>Job Boards</th>
//                                                         <th>Job ID</th>
//                                                         <th>Link</th>
//                                                         <th>Applied Date</th>
//                                                         <th>Status</th>
//                                                         <th>Actions</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {dateApplications.map(app => (
//                                                         <tr key={app.id}>
//                                                             <td>{app.company}</td>
//                                                             <td>{app.jobBoards}</td>
//                                                             <td>{app.jobId}</td>
//                                                             <td><a href={app.jobUrl} target="_blank" rel="noopener noreferrer">Link</a></td>
//                                                             <td>{formatDateToDDMMYYYY(app.appliedDate)}</td>
//                                                             <td>
//                                                                 <span className={`status-badge status-${app.status?.toLowerCase()}`}>
//                                                                     {app.status}
//                                                                 </span>
//                                                             </td>
//                                                             <td>
//                                                                 <div className="action-buttons">
//                                                                     <button className="action-button" onClick={() => onViewDetails(app)} title="View Details" >
//                                                                         <i className="fas fa-eye"></i>
//                                                                     </button>
//                                                                     <button className="action-button" onClick={() => onEdit(app)} title="Edit Application" >
//                                                                         <i className="fas fa-edit"></i>
//                                                                     </button>
//                                                                     <button className="action-button" onClick={() => onDelete(app)} title="Delete Application" >
//                                                                         <i className="fas fa-trash"></i>
//                                                                     </button>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </React.Fragment>
//                     );
//                 })
//             ) : (
//                 <tr>
//                     <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-color)' }}>
//                         No applications found matching your criteria.
//                     </td>
//                 </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// };

//   return (
//     <div className="manager-dashboard-container">
//       {/* Font Awesome CDN for icons */}
//       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

//       <style>
//         {`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

//         :root {
//           /* Light Theme Colors (Default) */
//           --bg-color: #f8f9fa;
//           --text-color: #333;
//           --header-border-color: #e0e0e0;
//           --card-bg: #ffffff;
//           --card-shadow: rgba(0, 0, 0, 0.08);
//           --card-hover-shadow: rgba(0, 0, 0, 0.12);
//           --button-hover-bg: #e9ecef;
//           --icon-color: #6c757d;
//           --tab-button-color: #6c757d;
//           --tab-button-hover-bg: #f1f3f5;
//           --tab-button-active-bg: #e9ecef;
//           --tab-button-active-color: #212529;
//           --member-border-color: #f1f3f5;
//           --employee-count-bg: #e9ecef;
//           --employee-count-color: #6c757d;
//           --activity-subtitle-color: #868e96;
//           --main-title-color: #212529;
//           --subtitle-color: #6c757d;
//           --user-profile-shadow: rgba(0, 0, 0, 0.08);
//           --user-profile-bg: #ffffff;
//           --user-name-color: #343a40;
//           --user-role-color: #868e96;
//           --user-avatar-bg: #343a40;
//           --user-avatar-color: #ffffff;
//           --manager-badge-bg: #f3e8ff;
//           --manager-badge-color: #6f42c1;
//           --notification-badge-bg: #dc3545;
//           --notification-badge-border: #ffffff;
//           --card-title-color: #6c757d;
//           --card-value-color: #212529;
//           --card-description-color: #868e96;
//           --card-icon-blue-bg: #e7f5ff;
//           --card-icon-blue-color: #007bff;
//           --card-icon-green-bg: #e6ffed;
//           --card-icon-green-color: #28a745;
//           --card-icon-orange-bg: #fff4e6;
//           --card-icon-orange-color: #fd7e14;
//           --card-icon-purple-bg: #f3e8ff;
//           --card-icon-purple-color: #6f42c1;
//           --success-rate-green: #28a745;
//           --section-header-color: #212529;
//           --section-header-icon-color: #6c757d;
//           --red-icon-color: #dc3545;
//           --action-button-border: #ced4da;
//           --action-button-color: #495057;
//           --action-button-bg: #ffffff;
//           --action-button-hover-bg: #f1f3f5;
//           --action-button-hover-border: #adb5bd;
//           --attention-item-color: #495057;
//           --attention-badge-bg: #f8d7da;
//           --attention-badge-color: #721c24;
//           --attention-badge-gray-bg: #e9ecef;
//           --attention-badge-gray-color: #495057;
//           --performance-value-color: #343a40;
//           --member-avatar-bg-default: #e7f5ff;
//           --member-avatar-color-default: #007bff;
//           --member-avatar-bg-employee: #e0e7ff;
//           --member-avatar-color-employee: #4338ca;
//           --status-badge-excellent-bg: #d4edda;
//           --status-badge-excellent-color: #155724;
//           --status-badge-good-bg: #cce5ff;
//           --status-badge-good-color: #004085;

//           /* Application Status Badges */
//           --status-interview-bg: #f3e8ff;
//           --status-interview-color: #6f42c1;
//           --status-applied-bg: #e0e7ff;
//           --status-applied-color: #4338ca;
//           --status-pending-bg: #fff4e6;
//           --status-pending-color: #fd7e14;
//           --status-verified-bg: #e6ffed;
//           --status-verified-color: #28a745;

//           /* Assignment Cards */
//           --assignment-card-unassigned-bg: #ffffff;
//           --assignment-card-unassigned-color: #333;
//           --assignment-card-assigned-bg: #e6ffed;
//           --assignment-card-assigned-color: #28a745;
//           --assign-client-button-bg: #007bff;
//           --assign-client-button-color: #ffffff;
//           --assign-client-button-hover-bg: #0056b3;

//           /* Modal Specific Colors */
//           --modal-overlay-bg: rgba(0, 0, 0, 0.5);
//           --modal-bg: #ffffff;
//           --modal-border-color: #e0e0e0;
//           --modal-header-color: #212529;
//           --modal-close-button-color: #6c757d;
//           --modal-close-button-hover-bg: #e9ecef;
//           --modal-priority-card-bg: #f8f9fa;
//           --modal-priority-card-border: #e0e0e0;
//           --modal-priority-text-color: #333;
//           --modal-priority-high-color: #dc3545;
//           --modal-priority-medium-color: #fd7e14;
//           --modal-priority-low-color: #28a745;
//           --modal-quick-assign-bg: #007bff;
//           --modal-quick-assign-color: #ffffff;
//           --modal-quick-assign-hover-bg: #0056b3;
//           --modal-search-border: #ced4da;
//           --modal-search-bg: #ffffff;
//           --modal-search-text-color: #333;
//           --modal-export-button-bg: #f1f3f5;
//           --modal-export-button-color: #495057;
//           --modal-export-button-hover-bg: #e9ecef;
//           --modal-client-card-bg: #ffffff;
//           --modal-client-card-border: #e0e0e0;
//           --modal-client-name-color: #212529;
//           --modal-client-detail-color: #6c757d;
//           --modal-client-skill-bg: #e9ecef;
//           --modal-client-skill-color: #495057;
//           --modal-assign-button-bg: #007bff;
//           --modal-assign-button-color: #ffffff;
//           --modal-assign-button-hover-bg: #0056b3;
//           --modal-view-profile-bg: #f1f3f5;
//           --modal-view-profile-color: #495057;
//           --modal-view-profile-hover-bg: #e9ecef;

//           /* Assign Client Modal Specific Colors */
//           --form-label-color: #495057;
//           --form-input-border: #ced4da;
//           --form-input-bg: #ffffff;
//           --form-input-text: #333;
//           --form-input-focus-border: #80bdff;
//           --form-input-focus-shadow: rgba(0, 123, 255, 0.25);
//           --form-button-cancel-bg: #e9ecef;
//           --form-button-cancel-color: #495057;
//           --form-button-cancel-hover-bg: #dee2e6;
//           --form-button-assign-bg: #007bff;
//           --form-button-assign-color: #ffffff;
//           --form-button-assign-hover-bg: #0056b3;

//           /* Client Preview Modal New Styles */
//           --client-preview-grid-gap: 20px;
//           --client-preview-section-bg: #f8f9fa;
//           --client-preview-section-border: #e0e0e0;
//           --client-preview-section-title-color: #007bff;
//           --client-preview-detail-label-color: #6c757d;
//           --client-preview-detail-value-color: #333;

//           /* Notification Modal Specific Styles */
//           --notification-item-border: #e9ecef;
//           --notification-item-time-color: #868e96;

//           /* User Profile Modal Specific Styles */
//           --profile-label-color: #6c757d;
//           --profile-value-color: #333;
//           --edit-button-bg: #007bff;
//           --edit-button-color: #ffffff;
//           --edit-button-hover-bg: #0056b3;
//           --close-button-bg: #e9ecef;
//           --close-button-color: #495057;
//           --close-button-hover-bg: #dee2e6;

//           /* LLM Section */
//           --llm-section-bg: #e9f7ef; /* Light green for LLM section */
//           --llm-section-border: #d4edda;
//           --llm-text-color: #155724; /* Dark green text */
//           --llm-loading-color: #007bff;

//                 --bg-body: #f3f4f6;
//           --bg-card: #ffffff;
//           --text-primary: #1f2937;
//           --text-secondary: #6b7280;
//           --border-color: #e5e7eb;
//           --shadow-color-1: rgba(0, 0, 0, 0.05);
//           --shadow-color-3: rgba(0, 0, 0, 0.04);
//           --add-employee-btn-bg: #2563EB;
//           --add-employee-btn-hover-bg: #1D4ED8;
//           --add-employee-btn-text: #ffffff;
//           --search-input-border: #d1d5db;
//           --search-input-bg: #ffffff;
//           --search-input-text: #1f2937;
//           --search-placeholder-color: #9ca3af;
//           --employee-card-bg: #ffffff;
//           --employee-card-border: #e5e7eb;
//           --employee-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
//           --employee-avatar-bg: #E0F2FE;
//           --employee-avatar-icon: #2563EB;
//           --employee-name-color: #1f2937;
//           --employee-email-color: #6b7280;
//           --action-btn-border: #e5e7eb;
//           --action-btn-text: #4b5563;
//           --action-btn-hover-bg: #f9fafb;
//           --delete-btn-bg: #EF4444;
//           --delete-btn-hover-bg: #DC2626;
//           --delete-btn-text: #ffffff;
//           --modal-overlay-bg: rgba(0, 0, 0, 0.5);
//           --modal-bg: #ffffff;
//           --modal-border: #e5e7eb;
//           --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//           --modal-title-color: #1f2937;
//           --modal-subtitle-color: #6b7280;
//           --modal-close-btn-color: #6b7280;
//           --modal-close-btn-hover: #1f2937;
//           --modal-input-bg: #ffffff;
//           --modal-input-border: #d1d5db;
//           --modal-input-text: #1f2937;
//           --modal-input-placeholder: #9ca3af;
//           --modal-focus-border: #2563eb;
//           --modal-label-color: #374151;
//           --modal-generate-btn-bg: #e0e7ff;
//           --modal-generate-btn-text: #3b82f6;
//           --modal-generate-btn-hover: #c7d2fe;
//           --modal-create-btn-bg: #2563eb;
//           --modal-create-btn-text: #ffffff;
//           --modal-create-btn-hover: #1d4ed8;
//           --confirm-modal-danger-btn-bg: #EF4444;
//           --confirm-modal-danger-btn-hover: #DC2626;
//           --confirm-modal-cancel-btn-bg: #e5e7eb;
//           --confirm-modal-cancel-btn-text: #4b5563;
//           --confirm-modal-cancel-btn-hover: #d1d5db;
      
//         }

//         [data-theme='dark'] {
//           --bg-color: #2c2c2c; /* Darker background */
//           --text-color: #e0e0e0;
//           --header-border-color: #444444;
//           --card-bg: #3a3a3a;
//           --card-shadow: rgba(0, 0, 0, 0.3);
//           --card-hover-shadow: rgba(0, 0, 0, 0.5);
//           --button-hover-bg: #4a4a4a;
//           --icon-color: #bbbbbb;
//           --tab-button-color: #bbbbbb;
//           --tab-button-hover-bg: #4a4a4a;
//           --tab-button-active-bg: #5a5a5a;
//           --tab-button-active-color: #ffffff;
//           --member-border-color: #4a4a4a;
//           --employee-count-bg: #4a4a4a;
//           --employee-count-color: #e0e0e0;
//           --activity-subtitle-color: #aaaaaa;
//           --main-title-color: #ffffff;
//           --subtitle-color: #bbbbbb;
//           --user-profile-shadow: rgba(0, 0, 0, 0.3);
//           --user-profile-bg: #3a3a3a;
//           --user-name-color: #ffffff;
//           --user-role-color: #bbbbbb;
//           --user-avatar-bg: #5a5a5a;
//           --user-avatar-color: #ffffff;
//           --manager-badge-bg: #4a3c61; /* Darker purple */
//           --manager-badge-color: #d1b3ff; /* Lighter purple text */
//           --notification-badge-bg: #ef5350; /* Slightly brighter red */
//           --notification-badge-border: #2c2c2c; /* Dark border */
//           --card-title-color: #bbbbbb;
//           --card-value-color: #ffffff;
//           --card-description-color: #aaaaaa;
//           --card-icon-blue-bg: #334d66;
//           --card-icon-blue-color: #66b3ff;
//           --card-icon-green-bg: #335544;
//           --card-icon-green-color: #66cc99;
//           --card-icon-orange-bg: #664d33;
//           --card-icon-orange-color: #ffcc66;
//           --card-icon-purple-bg: #553366;
//           --card-icon-purple-color: #cc99ff;
//           --success-rate-green: #66cc99;
//           --section-header-color: #ffffff;
//           --section-header-icon-color: #bbbbbb;
//           --red-icon-color: #ef5350;
//           --action-button-border: #555555;
//           --action-button-color: #e0e0e0;
//           --action-button-bg: #3a3a3a;
//           --action-button-hover-bg: #4a4a4a;
//           --action-button-hover-border: #666666;
//           --attention-item-color: #e0e0e0;
//           --attention-badge-bg: #5a3a3a;
//           --attention-badge-color: #ffaaaa;
//           --attention-badge-gray-bg: #4a4a4a;
//           --attention-badge-gray-color: #e0e0e0;
//           --performance-value-color: #ffffff;
//           --member-avatar-bg-default: #334d66;
//           --member-avatar-color-default: #66b3ff;
//           --member-avatar-bg-employee: #4338ca; /* Keeping original for contrast */
//           --member-avatar-color-employee: #e0e7ff; /* Keeping original for contrast */
//           --status-badge-excellent-bg: #335544;
//           --status-badge-excellent-color: #66cc99;
//           --status-badge-good-bg: #334d66;
//           --status-badge-good-color: #66b3ff;

//           /* Application Status Badges (Dark Theme) */
//           --status-interview-bg: #553366;
//           --status-interview-color: #cc99ff;
//           --status-applied-bg: #334d66;
//           --status-applied-color: #66b3ff;
//           --status-pending-bg: #664d33;
//           --status-pending-color: #ffcc66;
//           --status-verified-bg: #335544;
//           --status-verified-color: #66cc99;

//           /* Assignment Cards (Dark Theme) */
//           --assignment-card-unassigned-bg: #3a3a3a;
//           --assignment-card-unassigned-color: #e0e0e0;
//           --assignment-card-assigned-bg: #335544;
//           --assignment-card-assigned-color: #66cc99;
//           --assign-client-button-bg: #0056b3;
//           --assign-client-button-color: #ffffff;
//           --assign-client-button-hover-bg: #007bff;

//           /* Modal Specific Colors (Dark Theme) */
//           --modal-overlay-bg: rgba(0, 0, 0, 0.7);
//           --modal-bg: #3a3a3a;
//           --modal-border-color: #555555;
//           --modal-header-color: #ffffff;
//           --modal-close-button-color: #bbbbbb;
//           --modal-close-button-hover-bg: #4a4a4a;
//           --modal-priority-card-bg: #4a4a4a;
//           --modal-priority-card-border: #555555;
//           --modal-priority-text-color: #e0e0e0;
//           --modal-priority-high-color: #ef5350;
//           --modal-priority-medium-color: #ffcc66;
//           --modal-priority-low-color: #66cc99;
//           --modal-quick-assign-bg: #0056b3;
//           --modal-quick-assign-color: #ffffff;
//           --modal-quick-assign-hover-bg: #007bff;
//           --modal-search-border: #666666;
//           --modal-search-bg: #4a4a4a;
//           --modal-search-text-color: #e0e0e0;
//           --modal-export-button-bg: #4a4a4a;
//           --modal-export-button-color: #e0e0e0;
//           --modal-export-button-hover-bg: #5a5a5a;
//           --modal-client-card-bg: #4a4a4a;
//           --modal-client-card-border: #555555;
//           --modal-client-name-color: #ffffff;
//           --modal-client-detail-color: #bbbbbb;
//           --modal-client-skill-bg: #5a5a5a;
//           --modal-client-skill-color: #e0e0e0;
//           --modal-assign-button-bg: #0056b3;
//           --modal-assign-button-color: #ffffff;
//           --modal-assign-button-hover-bg: #007bff;
//           --modal-view-profile-bg: #4a4a4a;
//           --modal-view-profile-color: #e0e0e0;
//           --modal-view-profile-hover-bg: #5a5a5a;

//           /* Assign Client Modal Specific (Dark Theme) */
//           --form-label-color: #e0e0e0;
//           --form-input-border: #666666;
//           --form-input-bg: #4a4a4a;
//           --form-input-text: #e0e0e0;
//           --form-input-focus-border: #66b3ff;
//           --form-input-focus-shadow: rgba(102, 179, 255, 0.25);
//           --form-button-cancel-bg: #4a4a4a;
//           --form-button-cancel-color: #e0e0e0;
//           --form-button-cancel-hover-bg: #5a5a5a;
//           --form-button-assign-bg: #0056b3;
//           --form-button-assign-color: #ffffff;
//           --form-button-assign-hover-bg: #007bff;

//           /* Client Preview Modal New Styles (Dark Theme) */
//           --client-preview-section-bg: #3a3a3a;
//           --client-preview-section-border: #555555;
//           --client-preview-section-title-color: #66b3ff;
//           --client-preview-detail-label-color: #bbbbbb;
//           --client-preview-detail-value-color: #e0e0e0;

//           /* Notification Modal Specific Styles (Dark Theme) */
//           --notification-item-border: #4a4a4a;
//           --notification-item-time-color: #aaaaaa;

//           /* User Profile Modal Specific Styles (Dark Theme) */
//           --profile-label-color: #bbbbbb;
//           --profile-value-color: #e0e0e0;
//           --edit-button-bg: #0056b3;
//           --edit-button-color: #ffffff;
//           --edit-button-hover-bg: #007bff;
//           --close-button-bg: #4a4a4a;
//           --close-button-color: #e0e0e0;
//           --close-button-hover-bg: #5a5a5a;

//           /* LLM Section (Dark Theme) */
//           --llm-section-bg: #335544; /* Darker green for LLM section */
//           --llm-section-border: #446655;
//           --llm-text-color: #d4edda; /* Lighter green text */
//           --llm-loading-color: #66b3ff;
//         }

//         body {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

// ----------------------------------------------
//     .employee-management-container {
//             padding: 1.5rem;
//         }
//         .employee-management-box {
//             background-color: var(--bg-card);
//             border-radius: 0.75rem;
//             box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
//             border: 1px solid var(--border-color);
//             padding: 1.5rem;
//         }
//         .employee-management-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-bottom: 1.5rem;
//             flex-wrap: wrap;
//             gap: 1rem;
//         }
//         .employee-management-title {
//             font-size: 1.5rem;
//             font-weight: 600;
//             color: var(--text-primary);
//         }
//         .employee-search-add {
//             display: flex;
//             align-items: center;
//             gap: 0.75rem;
//             flex-grow: 1;
//             max-width: 400px;
//         }
//         .employee-search-input {
//             flex-grow: 1;
//             padding: 0.6rem 1rem;
//             border: 1px solid var(--search-input-border);
//             border-radius: 0.5rem;
//             background-color: var(--search-input-bg);
//             color: var(--search-input-text);
//             font-size: 0.9rem;
//         }
//         .add-employee-btn {
//             display: flex;
//             align-items: center;
//             gap: 0.5rem;
//             padding: 0.6rem 1rem;
//             background-color: var(--add-employee-btn-bg);
//             color: var(--add-employee-btn-text);
//             border-radius: 0.5rem;
//             font-weight: 500;
//             border: none;
//             cursor: pointer;
//         }
//         .employee-list {
//             display: flex;
//             flex-direction: column;
//             gap: 1rem;
//         }
//         .employee-card {
//             background-color: var(--employee-card-bg);
//             border-radius: 0.75rem;
//             box-shadow: var(--employee-card-shadow);
//             border: 1px solid var(--employee-card-border);
//             padding: 1.25rem 1.5rem;
//             display: flex;
//             align-items: center;
//             gap: 1rem;
//             flex-wrap: wrap;
//         }
//         .employee-card-left {
//             display: flex;
//             align-items: center;
//             gap: 1rem;
//             flex-grow: 1;
//         }
//         .employee-avatar {
//             width: 3rem;
//             height: 3rem;
//             border-radius: 9999px;
//             background-color: var(--employee-avatar-bg);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             flex-shrink: 0;
//             color: var(--employee-avatar-icon);
//             font-size: 1.2rem;
//             font-weight: 600;
//         }
//         .employee-info {
//             display: flex;
//             flex-direction: column;
//         }
//         .employee-name {
//             font-size: 1rem;
//             font-weight: 600;
//             color: var(--employee-name-color);
//         }
//         .employee-email {
//             font-size: 0.875rem;
//             color: var(--employee-email-color);
//         }
//         .employee-roles {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 0.5rem;
//             margin-top: 0.5rem;
//         }
//         .role-tag {
//             padding: 0.25rem 0.75rem;
//             border-radius: 9999px;
//             font-size: 0.75rem;
//             font-weight: 500;
//             white-space: nowrap;
//         }
//         .employee-actions {
//             display: flex;
//             gap: 0.75rem;
//         }
//         .action-btn {
//             padding: 0.5rem 1rem;
//             border: 1px solid var(--action-btn-border);
//             border-radius: 0.5rem;
//             background-color: transparent;
//             color: var(--action-btn-text);
//             font-weight: 500;
//             cursor: pointer;
//         }
//         .delete-btn {
//             background-color: var(--delete-btn-bg);
//             color: var(--delete-btn-text);
//             border-color: var(--delete-btn-bg);
//         }
//         .modal-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-color: var(--modal-overlay-bg);
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             z-index: 1000;
//             opacity: 0;
//             visibility: hidden;
//             transition: opacity 0.3s ease, visibility 0.3s ease;
//         }
//         .modal-overlay.open {
//             opacity: 1;
//             visibility: visible;
//         }
//         .modal-content {
//             background-color: var(--modal-bg);
//             border-radius: 0.75rem;
//             box-shadow: var(--modal-shadow);
//             border: 1px solid var(--modal-border);
//             width: 90%;
//             max-width: 600px;
//             padding: 1.5rem;
//             position: relative;
//         }
//         .employee-edit-modal-content {
//             max-width: 850px;
//             max-height: 90vh;
//             overflow-y: auto;
//         }

//           .employee-add-modal-content {
//   background: #fff;
//   border-radius: 12px;
//   max-width: 850px;
//   width: 95%;
//   max-height: 90vh;
//   overflow-y: auto;
//   padding: 24px 32px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
// }
//         .modal-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             margin-bottom: 1.5rem;
//         }
//         .modal-title {
//             font-size: 1.25rem;
//             font-weight: 600;
//             color: var(--modal-title-color);
//         }
//         .modal-subtitle {
//             font-size: 0.875rem;
//             color: var(--modal-subtitle-color);
//             margin-top: 0.25rem;
//         }
//         .modal-close-btn {
//             background: none;
//             border: none;
//             font-size: 1.5rem;
//             color: var(--modal-close-btn-color);
//             cursor: pointer;
//         }
//         .modal-form {
//             display: grid;
//             grid-template-columns: 1fr;
//             gap: 1rem;
//         }
//         @media (min-width: 640px) {
//             .modal-form {
//                 grid-template-columns: 1fr 1fr;
//             }
//             .modal-form-full-width {
//                 grid-column: 1 / -1;
//             }
//         }
//         .form-group {
//             display: flex;
//             flex-direction: column;
//             gap: 0.5rem;
//         }
//         .form-label {
//             font-size: 0.875rem;
//             font-weight: 500;
//             color: var(--modal-label-color);
//         }
//         .form-input, .form-select {
//             padding: 0.75rem 1rem;
//             border: 1px solid var(--modal-input-border);
//             border-radius: 0.5rem;
//             background-color: var(--modal-input-bg);
//             color: var(--modal-input-text);
//             font-size: 0.9rem;
//             width: 100%;
//             box-sizing: border-box;
//         }
//         .password-input-group {
//             display: flex;
//             gap: 0.5rem;
//         }
//         .generate-password-btn {
//             padding: 0.75rem 1rem;
//             background-color: var(--modal-generate-btn-bg);
//             color: var(--modal-generate-btn-text);
//             border-radius: 0.5rem;
//             font-weight: 500;
//             border: none;
//             cursor: pointer;
//         }
//         .role-description {
//             font-size: 0.75rem;
//             color: var(--text-secondary);
//             margin-top: 0.25rem;
//         }
//         .modal-footer {
//             margin-top: 1.5rem;
//             display: flex;
//             justify-content: flex-end;
//             gap: 0.75rem;
//         }
//         .create-employee-btn {
//             padding: 0.75rem 1.5rem;
//             background-color: var(--modal-create-btn-bg);
//             color: var(--modal-create-btn-text);
//             border-radius: 0.5rem;
//             font-weight: 600;
//             border: none;
//             cursor: pointer;
//         }
//         .confirm-modal-buttons {
//             display: flex;
//             justify-content: flex-end;
//             gap: 0.75rem;
//             margin-top: 1.5rem;
//         }
//         .confirm-cancel-btn, .confirm-delete-btn {
//             padding: 0.75rem 1.5rem;
//             border-radius: 0.5rem;
//             font-weight: 500;
//             border: none;
//             cursor: pointer;
//         }
//         .confirm-cancel-btn {
//             background-color: var(--confirm-modal-cancel-btn-bg);
//             color: var(--confirm-modal-cancel-btn-text);
//         }
//         .confirm-delete-btn {
//             background-color: var(--confirm-modal-danger-btn-bg);
//             color: var(--delete-btn-text);
//         }
//         .details-grid.form-layout {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//             gap: 16px;
//         }
//         .section-title {
//             grid-column: 1 / -1;
//             font-size: 1.1rem;
//             font-weight: 600;
//             margin: 16px 0 4px;
//             color: #2b3e50;
//             border-bottom: 1px solid #ddd;
//             padding-bottom: 4px;
//         }
//         .form-item {
//             display: flex;
//             flex-direction: column;
//         }
//         .form-item label {
//             font-weight: 500;
//             margin-bottom: 4px;
//             font-size: 0.92rem;
//             color: #34495e;
//         }
//         .form-item input, .form-item select, .form-item textarea {
//             padding: 8px 10px;
//             border: 1px solid #ccc;
//             border-radius: 6px;
//             font-size: 0.95rem;
//         }
//         .modal-footer.modal-form-full-width {
//             grid-column: 1 / -1;
//         }
//         .confirm-save-btn {
//             padding: 8px 16px;
//             font-size: 0.95rem;
//             border: none;
//             border-radius: 6px;
//             cursor: pointer;
//             background-color: #2e7d32;
//             color: #fff;
//         }


// --------------------------------




//           .filter-container-style {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//     gap: 20px;
//     margin-bottom: 32px;
//     padding-bottom: 24px;
//     border-bottom: 1px solid var(--header-border-color);
//     align-items: flex-end;
//   }
//   .filter-group-style {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     margin-bottom:10px;
//   }
//   .filter-label-style {
//     font-size: 0.875rem;
//     font-weight: 600;
//     color: var(--subtitle-color);
//   }
//   .date-range-input-group-style {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
//   .date-input-style {
//     padding: 8px 12px;
//     border: 1px solid var(--header-border-color);
//     border-radius: 6px;
//     font-size: 0.9rem;
//     color: var(--text-color);
//     flex: 1;
//     background-color: var(--card-bg);
//   }
//   .select-filter-style {
//     padding: 8px 12px;
//     border: 1px solid var(--header-border-color);
//     border-radius: 6px;
//     font-size: 0.9rem;
//     color: var(--text-color);
//     background-color: var(--card-bg);
//     width: 50%;
//      margin-bottom: 10px;
    
//   }
//   .quick-filter-buttons-style {
   
//     gap: 8px;
    
//   }
//   .quick-filter-button-style {
//     background-color: var(--button-hover-bg);
//     color: var(--tab-button-color);
//     border: none;
//     padding: 8px 14px;
//     border-radius: 6px;
//     font-size: 0.85rem;
//     font-weight: 500;
//     cursor: pointer;
//     transition: background-color 0.2s, color 0.2s;
//   }
//   .quick-filter-button-style.active {
//     background-color: var(--card-icon-blue-color);
//     color: white;
//   }
//   .clear-filters-button-container-style {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     justify-self: start;
//      margin-bottom: 10px;
//   }
//   .clear-filters-button-style {
//     background: #fef2f2;
//     color: #ef4444;
//     border: 1px solid #fecaca;
//     padding: 8px 16px;
//     border-radius: 6px;
//     font-size: 0.9rem;
//     font-weight: 600;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//         .manager-dashboard-container {
//           min-height: 100vh;
//           background-color: var(--bg-color);
//           padding: 20px;
//           font-family: 'Inter', sans-serif;
//           color: var(--text-color);
//           transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .header-section {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding-bottom: 15px;
//           border-bottom: 1px solid var(--header-border-color);
//           margin-bottom: 20px;
//           transition: border-color 0.3s ease;
//         }

//         .header-logo {
//           font-size: 24px;
//           font-weight: 700;
//           color: var(--main-title-color);
//           margin: 0;
//         }

//         .header-logo .x-highlight {
//             color: var(--card-icon-blue-color);
//         }

//         .selected-employee-details {
//             background-color: var(--client-preview-section-bg);
//             border: 1px solid var(--client-preview-section-border);
//             border-radius: 8px;
//             padding: 15px;
//             margin-top: 15px;
//         }

//         .selected-employee-details h4 {
//             margin-top: 0;
//             color: var(--client-preview-section-title-color);
//         }

//         .selected-employee-details p {
//             margin: 5px 0;
//             color: var(--text-color);
//         }

//         .header-actions {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
// .header-button {
//           padding: 6px;
//           border-radius: 50%;
//           background-color: transparent;
//           border: none;
//           cursor: pointer;
//           transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
//           position: relative;
//         }

//         .header-button:hover {
//           background-color: var(--button-hover-bg);
//           transform: translateY(-1px);
//         }

//         .header-button i {
//           font-size: 20px;
//           color: var(--icon-color);
//           transition: color 0.3s ease;
//         }

//         .notification-badge {
//             position: absolute;
//             top: 4px;
//             right: 4px;
//             background-color: var(--notification-badge-bg);
//             color: white;
//             border-radius: 50%;
//             width: 16px;
//             height: 16px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 9px;
//             font-weight: 600;
//             border: 1px solid var(--notification-badge-border);
//             transform: translate(25%, -25%);
//             transition: background-color 0.3s ease, border-color 0.3s ease;
//         }

//         .user-profile {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           padding: 4px 10px;
//           transition: background-color 0.3s ease, box-shadow 0.3s ease;
//           cursor: pointer; /* Indicate it's clickable */
//           position: relative; /* For dropdown positioning */
//           z-index: 20; /* Ensure it's above other content but below modal overlays */
//         }

//         .user-avatar {
//           width: 28px;
//           height: 28px;
//           background-color: var(--user-avatar-bg);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: var(--user-avatar-color);
//           font-weight: 600;
//           font-size: 12px;
//           transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         /* Target the div directly within .user-profile for text grouping */
//         .user-profile > div:first-of-type {
//           display: flex;
//           flex-direction: column;
//           font-size: 12px;
//           align-items: flex-end;
//         }

//         .user-profile > div:first-of-type span:first-child {
//           font-weight: 500;
//           color: var(--user-name-color);
//           transition: color 0.3s ease;
//         }

//         .manager-badge {
//             background-color: var(--manager-badge-bg);
//             color: var(--manager-badge-color);
//             font-size: 10px;
//             font-weight: 600;
//             padding: 1px 6px;
//             border-radius: 10px;
//             margin-top: 1px;
//             border: none !important;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .user-profile .dropdown-arrow {
//           font-size: 12px;
//           color: var(--icon-color);
//           margin-left: 4px;
//           transition: color 0.3s ease;
//         }

//         /* Profile Dropdown Styles */
//         .profile-dropdown {
//             position: absolute;
//             top: 100%; /* Position below the user profile */
//             right: 0;
//             background-color: var(--card-bg);
//             border-radius: 8px;
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow for dropdown */
//             min-width: 160px;
//             overflow: hidden; /* Ensures rounded corners apply to content */
//             margin-top: 10px; /* Space between profile and dropdown */
//             z-index: 100; /* Ensure it's above other elements */
//             border: 1px solid var(--header-border-color); /* Subtle border */
//             transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//         }

//         .profile-dropdown-item {
//             padding: 10px 15px;
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             color: var(--text-color);
//             font-size: 15px;
//             cursor: pointer;
//             transition: background-color 0.2s ease, color 0.2s ease;
//         }

//         .profile-dropdown-item:hover {
//             background-color: var(--tab-button-hover-bg);
//             color: var(--tab-button-active-color);
//         }

//         .profile-dropdown-item i {
//             font-size: 16px;
//             color: var(--icon-color);
//             transition: color 0.2s ease;
//         }

//         .profile-dropdown-item:hover i {
//             color: var(--tab-button-active-color);
//         }

//         .profile-dropdown-item:last-child {
//             border-top: 1px solid var(--header-border-color); /* Separator for logout */
//             color: var(--red-icon-color); /* Red color for logout */
//         }
//         .profile-dropdown-item:last-child i {
//             color: var(--red-icon-color);
//         }
//         .profile-dropdown-item:last-child:hover {
//             background-color: var(--attention-badge-bg); /* Light red hover for logout */
//             color: var(--attention-badge-color); /* Dark red text for logout hover */
//         }
//         .profile-dropdown-item:last-child:hover i {
//             color: var(--attention-badge-color);
//         }

//         /* Title and Subtitle above tabs */
//         .tab-section-header {
//             margin-bottom: 20px; /* Space between header and tabs */
//             text-align: left; /* Align content to the left */
//         }

//         .tab-section-header h1 {
//             font-size: 28px;
//             font-weight: 700;
//             color: var(--main-title-color);
//             margin: 0 0 5px 0;
//             transition: color 0.3s ease;
//         }

//         .tab-section-header p {
//             font-size: 15px;
//             color: var(--subtitle-color);
//             margin: 0;
//             transition: color 0.3s ease;
//         }

//         /* Styling for the radio button group */
//         .radio-group {
//             display: flex;
//             width: 100%;
//             background-color: var(--card-bg);
//             border-radius: 10px;
//             box-shadow: 0 4px 8px var(--card-shadow);
//             padding: 10px;
//             margin-bottom: 20px;
//             gap: 5px;
//             transition: background-color 0.3s ease, box-shadow 0.3s ease;
//         }

//         /* Style for the new clickable field that replaces the dropdown */
//         .pseudo-input {
//             width: 100%;
//             padding: 10px 12px;
//             border: 1px solid var(--form-input-border);
//             border-radius: 8px;
//             background-color: var(--form-input-bg);
//             color: var(--form-input-text);
//             font-size: 14px;
//             cursor: pointer;
//             transition: border-color 0.2s ease, box-shadow 0.2s ease;
//             -webkit-appearance: none;
//             -moz-appearance: none;
//             appearance: none;
//         }

//         .pseudo-input:hover {
//             border-color: var(--form-input-focus-border);
//         }

//         /* Styles for the list of employees in the new modal */
//         .employee-select-list {
//             display: flex;
//             flex-direction: column;
//             gap: 10px;
//         }

//         .employee-select-item {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 15px;
//             border: 1px solid var(--header-border-color);
//             border-radius: 8px;
//             cursor: pointer;
//             transition: background-color 0.2s ease, border-color 0.2s ease;
//         }

//         .employee-select-item:hover {
//             background-color: var(--button-hover-bg);
//             border-color: var(--card-icon-blue-color);
//         }

//         .employee-select-info {
//             color: var(--text-color);
//         }

//         .employee-select-info strong {
//             font-weight: 600;
//         }

//         .employee-select-info span {
//             display: block;
//             font-size: 0.9rem;
//             color: var(--subtitle-color);
//             margin-top: 2px;
//         }

//         .radio-option {
//             flex-grow: 1;
//             text-align: center;
//         }

//         .radio-option input[type="radio"] {
//             display: none; /* Hide the actual radio button */
//         }

//         .radio-option label {
//             display: block;
//             padding: 10px 20px;
//             border: none;
//             background-color: transparent;
//             font-size: 16px;
//             font-weight: 500;
//             color: var(--tab-button-color);
//             border-radius: 8px;
//             cursor: pointer;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .radio-option input[type="radio"]:checked + label {
//             background-color: var(--tab-button-active-bg);
//             color: var(--tab-button-active-color);
//             font-weight: 600;
//         }

//         .radio-option label:hover {
//             background-color: var(--tab-button-hover-bg);
//             color: var(--tab-button-active-color);
//         }

//         /* Client Assignment Overview Section */
//         .client-assignment-overview {
//             background-color: var(--card-bg);
//             border-radius: 10px;
//             box-shadow: 0 4px 8px var(--card-shadow);
//             padding: 20px;
//             margin-top: 20px;
//             transition: background-color 0.3s ease, box-shadow 0.3s ease;
//         }

//         .client-assignment-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-bottom: 20px;
//             flex-wrap: wrap;
//             gap: 10px;
//         }

//         .client-assignment-title {
//             font-size: 20px;
//             font-weight: 600;
//             color: var(--section-header-color);
//             transition: color 0.3s ease;
//         }

//         .assign-client-button {
//             background-color: var(--assign-client-button-bg);
//             color: var(--assign-client-button-color);
//             padding: 10px 15px;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease-in-out, color 0.3s ease;
//         }

//         .assign-client-button:hover {
//             background-color: var(--assign-client-button-hover-bg);
//         }

//         .assignment-cards-grid {
//             display: grid;
//             grid-template-columns: 1fr;
//             gap: 20px;
//         }

//         @media (min-width: 768px) {
//             .assignment-cards-grid {
//                 grid-template-columns: repeat(2, 1fr);
//             }
//         }

//         .assignment-card {
//             background-color:rgba(68, 68, 68, 0.05);
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//             padding: 20px;
//             text-align: center;
//             /* Add initial border for transition */
//             border: 1px solid transparent;
//             transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//             cursor: pointer; /* Indicate clickable */
//         }

//         /* Hover effect for assignment cards */
//         .assignment-card:hover {
//             border-color: var(--card-icon-blue-color); /* Use a blue border on hover */
//         }

//         .assignment-card.assigned {
//             background-color: var(--assignment-card-assigned-bg);
//         }

//         .assignment-card-value {
//             font-size: 36px;
//             font-weight: 700;
//             margin-bottom: 5px;
//             color: var(--assignment-card-unassigned-color);
//             transition: color 0.3s ease;
//         }

//         .assignment-card.assigned .assignment-card-value {
//             color: var(--assignment-card-assigned-color);
//         }

//         .assignment-card-title {
//             font-size: 16px;
//             font-weight: 500;
//             color: var(--text-color);
//             margin-bottom: 5px;
//             transition: color 0.3s ease;
//         }

//         .assignment-card-description {
//             font-size: 13px;
//             color: var(--icon-color);
//             cursor: pointer;
//             text-decoration: underline;
//             transition: color 0.3s ease;
//         }

//         /* Styles for Employee Applications Management */
//         .applications-management-section {
//             background-color: var(--card-bg);
//             border-radius: 10px;
//             box-shadow: 0 4px 8px var(--card-shadow);
//             padding: 20px;
//             margin-top: 20px;
//             transition: background-color 0.3s ease, box-shadow 0.3s ease;
//         }

//         .applications-header {
//             display: flex;
//             justify-content: space-between; /* Keep title left, actions right */
//             align-items: center;
//             margin-bottom: 20px;
//             flex-wrap: wrap;
//             gap: 10px;
//         }

//         /* New container for right-aligned actions in applications header */
//         .applications-header-actions {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             flex-wrap: wrap; /* Allow wrapping on small screens */
//         }

//         .applications-title {
//             font-size: 20px;
//             font-weight: 600;
//             color: var(--section-header-color);
//             transition: color 0.3s ease;
//         }

//         .pending-review-badge {
//             background-color: var(--status-pending-bg);
//             color: var(--status-pending-color);
//             font-size: 12px;
//             font-weight: 600;
//             padding: 6px 12px;
//             border-radius: 15px;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .applications-filters {
//             display: flex;
//             gap: 15px;
//             margin-bottom: 20px;
//             flex-wrap: wrap;
//             align-items: flex-end; /* Align items to the bottom, especially for date inputs with labels */
//         }

//         .search-input-wrapper {
//             position: relative;
//             flex: 1 1 200px;
//             min-width: 200px;
//         }

//         .search-input-wrapper input {
//             width: 100%;
//             padding: 10px 10px 10px 40px;
//             border: 1px solid var(--header-border-color);
//             border-radius: 8px;
//             background-color: var(--bg-color);
//             color: var(--text-color);
//             font-size: 14px;
//             transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
//         }

//         .search-input-wrapper i {
//             position: absolute;
//             left: 15px;
//             top: 50%;
//             transform: translateY(-50%);
//             color: var(--icon-color);
//             font-size: 16px;
//             transition: color 0.3s ease;
//         }

//         .filter-dropdown {
//             position: relative;
//             flex: 1 1 150px;
//             min-width: 150px;
//         }

//         .filter-dropdown select {
//             width: 100%;
//             padding: 10px;
//             border: 1px solid var(--header-border-color);
//             border-radius: 8px;
//             background-color: var(--bg-color);
//             color: var(--text-color);
//             font-size: 14px;
//             appearance: none;
//             -webkit-appearance: none;
//             -moz-appearance: none;
//             cursor: pointer;
//             transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
//         }

//         .filter-dropdown i {
//             position: absolute;
//             right: 15px;
//             top: 50%;
//             transform: translateY(-50%);
//             color: var(--icon-color);
//             font-size: 14px;
//             pointer-events: none;
//             transition: color 0.3s ease;
//         }

//         .table-responsive {
//             overflow-x: auto;
//             -webkit-overflow-scrolling: touch;
//         }

//         .applications-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 14px;
//             text-align: left;
//             min-width: 700px;
//         }

//         .applications-table th,
//         .applications-table td {
//             padding: 12px 10px;
//             border-bottom: 1px solid var(--header-border-color);
//             transition: border-color 0.3s ease;
//             vertical-align: middle; /* Ensure vertical alignment for all cells */
//         }

//         .applications-table th {
//             color: var(--subtitle-color);
//             font-weight: 600;
//             white-space: nowrap;
//         }

//         /* Center the TOTAL APPLICATIONS column */
//         .applications-table th:nth-last-child(2),
//         .applications-table td:nth-last-child(2) {
//             text-align: center;
//         }
//         .applications-table th:nth-last-child(1),
//         .applications-table td:nth-last-child(1) {
//             text-align: center;
//         }

//         .applications-table td {
//             color: var(--text-color);
//         }

//         .applications-table tr:last-child td {
//             border-bottom: none;
//         }

//         .applications-table .employee-cell {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//         }

//         .applications-table .employee-avatar {
//             width: 30px;
//             height: 30px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             background-color: var(--member-avatar-bg-default);
//             color: var(--member-avatar-color-default);
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .applications-table .status-badge {
//             padding: 4px 10px;
//             border-radius: 15px;
//             font-size: 12px;
//             font-weight: 600;
//             display: inline-block;
//             white-space: nowrap;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }
//         .applications-table .status-badge.status-interview {
//             background-color: var(--status-interview-bg);
//             color: var(--status-interview-color);
//         }

//         .applications-table .status-badge.status-applied {
//             background-color: var(--status-applied-bg);
//             color: var(--status-applied-color);
//         }

//         .applications-table .status-badge.status-pending {
//             background-color: var(--status-pending-bg);
//             color: var(--status-pending-color);
//         }

//         .applications-table .status-badge.status-verified {
//             background-color: var(--status-verified-bg);
//             color: var(--status-verified-color);
//         }

//         .applications-table .action-buttons {
//             display: flex;
//             gap: 5px;
//             white-space: nowrap;
//             justify-content: center; /* Center horizontally */
//             align-items: center; /* Center vertically */
//             height: 100%; /* Take full height of cell */
//         }

//         .applications-table .action-button {
//             padding: 0; /* Remove padding to make it a perfect square */
//             border-radius: 6px;
//             border: 1px solid var(--action-button-border);
//             background-color: var(--action-button-bg);
//             color: var(--action-button-color);
//             font-size: 13px;
//             cursor: pointer;
//             transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.3s ease;
//             display: flex; /* Make it a flex container to center icon */
//             align-items: center; /* Center icon vertically */
//             justify-content: center; /* Center icon horizontally */
//             width: 30px; /* Consistent square size */
//             height: 30px; /* Consistent square size */
//         }

//         .applications-table .action-button:hover {
//             background-color: var(--action-button-hover-bg);
//             border-color: var(--action-button-hover-border);
//         }

//         .applications-table .action-button i {
//             margin-right: 0; /* Remove margin if only icon */
//             color: var(--icon-color);
//             transition: color 0.3s ease;
//         }

//         /* New styles for Assigned Clients by Employee cards */
//         .employee-cards-grid {
//             display: grid;
//             grid-template-columns: 1fr; /* Single column on small screens */
//             gap: 20px;
//         }

//         @media (min-width: 768px) {
//             .employee-cards-grid {
//                 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Two columns on larger screens, flexible */
//             }
//         }

//         .employee-card {
//             background-color:rgba(68, 68, 68, 0.05);
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//             padding: 20px;
//             display: flex;
//             flex-direction: column;
//             gap: 15px;
//             transition: all 0.3s ease;
//             border: 1px solid var(--header-border-color); /* Light border */
//         }

//         .employee-card:hover {
//             box-shadow: 0 6px 12px var(--card-hover-shadow);
//             transform: translateY(-2px);
//             border-color: var(--card-icon-green-color); /* Subtle hover effect */
//         }

//         .employee-card-header {
//             display: flex;
//             align-items: center;
//             gap: 15px;
//             border-bottom: 1px solid var(--member-border-color); /* Line below header */
//             padding-bottom: 15px;
//         }

//         .employee-avatar-large {
//             width: 48px;
//             height: 48px;
//             border-radius: 50%;
//             background-color: var(--member-avatar-bg-employee); /* Employee-specific avatar color */
//             color: var(--member-avatar-color-employee);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 18px;
//             font-weight: 600;
//             flex-shrink: 0;
//         }

//         .employee-info {
//             flex-grow: 1;
//             display: flex;
//             flex-direction: column;
//         }

//         .employee-name {
//             font-size: 18px;
//             font-weight: 600;
//             color: var(--main-title-color); /* ADJUSTED: For better contrast */
//         }

//         .employee-role {
//             font-size: 14px;
//             color: var(--subtitle-color);
//         }

//         .clients-count-badge {
//             background-color: var(--status-verified-bg); /* Greenish badge from screenshot */
//             color: var(--status-verified-color);
//             padding: 6px 12px;
//             border-radius: 20px;
//             font-size: 13px;
//             font-weight: 600;
//             white-space: nowrap;
//             flex-shrink: 0;
//         }

//         .employee-card-details {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//         }

//         .success-rate {
//             font-size: 15px;
//             color: var(--text-color);
//             font-weight: 500;
//         }

//         .success-rate-value {
//             color: var(--success-rate-green); /* Green color for the percentage */
//             font-weight: 600;
//         }

//         .view-employee-details-button {
//             background-color: var(--modal-view-profile-bg);
//             color: var(--modal-view-profile-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: 1px solid var(--modal-search-border);
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
//         }

//         .view-employee-details-button:hover {
//             background-color: var(--button-hover-bg);
//             color: var(--main-title-color); /* Darker on hover */
//         }


//         /* Responsive adjustments */
//         @media (max-width: 767px) {
//             .header-section {
//                 flex-direction: column;
//                 align-items: flex-start;
//                 gap: 15px;
//             }

//             .header-actions {
//                 width: 100%;
//                 justify-content: space-between;
//             }

//             .user-profile {
//                 flex-grow: 1;
//                 justify-content: flex-end;
//             }

//             .radio-group {
//                 flex-direction: column;
//                 padding: 5px;
//             }

//             .radio-option label {
//                 padding: 8px 15px;
//                 font-size: 15px;
//             }

//             .client-assignment-header,
//             .applications-header {
//                 flex-direction: column;
//                 align-items: flex-start;
//                 gap: 10px;
//             }

//             .assign-client-button {
//                 width: 100%;
//                 justify-content: center;
//             }

//             .applications-filters {
//                 flex-direction: column;
//                 width: 100%;
//                 gap: 10px;
//             }

//             .search-input-wrapper,
//             .filter-dropdown {
//                 width: 100%;
//                 min-width: unset;
//             }
//             .applications-header-actions {
//                 width: 100%; /* Take full width on small screens */
//                 justify-content: flex-start; /* Align left for better readability */
//             }
//         }

//         /* Modal Styles */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: var(--modal-overlay-bg);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//           transition: background-color 0.3s ease;
//         }

//         .modal-content {
//           background-color: var(--modal-bg);
//           padding: 0 25px 25px 25px; /* Removed padding-top here */
//           border-radius: 12px;
//           box-shadow: 0 8px 20px var(--card-shadow);
//           width: 90%;
//           max-width: 700px;
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           border: 1px solid var(--modal-border-color);
//           transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//           max-height: 90vh; /* Make the entire modal scrollable */
//           overflow-y: auto; /* Enable vertical scrolling for the modal content */
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding-top: 25px; /* Added padding-top here */
//           padding-bottom: 15px;
//           border-bottom: 1px solid var(--header-border-color);
//           /* Ensure header stays visible when scrolling modal content */
//           position: sticky;
//           top: 0;
//           background-color: var(--modal-bg); /* Match modal background */
//           z-index: 10; /* Ensure it's above scrolling content */
//         }
// .modal-title {
//           font-size: 22px;
//           font-weight: 600;
//           color: var(--modal-header-color);
//           transition: color 0.3s ease;
//         }

//         .modal-close-button {
//           background: none;
//           border: none;
//           font-size: 24px;
//           color: var(--modal-close-button-color);
//           cursor: pointer;
//           transition: color 0.2s ease, background-color 0.2s ease;
//           border-radius: 50%;
//           width: 30px;
//           height: 30px;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         .modal-close-button:hover {
//             background-color: var(--modal-close-button-hover-bg);
//         }

//         .modal-priority-overview {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//             gap: 15px;
//             margin-bottom: 20px;
//         }

//         .priority-card {
//             background-color: var(--modal-priority-card-bg);
//             border-radius: 10px;
//             padding: 15px;
//             text-align: center;
//             border: 1px solid var(--modal-priority-card-border);
//             transition: background-color 0.3s ease, border-color 0.3s ease;
//         }

//         .priority-card-value {
//             font-size: 28px;
//             font-weight: 700;
//             margin-bottom: 5px;
//             color: var(--modal-priority-text-color);
//             transition: color 0.3s ease;
//         }

//         .priority-card-title {
//             font-size: 14px;
//             color: var(--modal-priority-text-color);
//             transition: color 0.3s ease;
//         }

//         .priority-card.high .priority-card-value,
//         .priority-card.high .priority-card-title {
//             color: var(--modal-priority-high-color);
//         }
//         .priority-card.medium .priority-card-value,
//         .priority-card.medium .priority-card-title {
//             color: var(--modal-priority-medium-color);
//         }
//         .priority-card.low .priority-card-value,
//         .priority-card.low .priority-card-title {
//             color: var(--modal-priority-low-color);
//         }

//         .modal-actions-top {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             gap: 10px;
//             flex-wrap: wrap;
//         }

//         .modal-actions-top .search-input-wrapper {
//             flex-grow: 1;
//             min-width: 180px;
//         }

//         .modal-actions-top .filter-dropdown {
//             min-width: 120px;
//         }

//         .modal-quick-assign-button {
//             background-color: var(--modal-quick-assign-bg);
//             color: var(--modal-quick-assign-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease;
//             white-space: nowrap;
//         }
//         .modal-quick-assign-button:hover {
//             background-color: var(--modal-quick-assign-hover-bg);
//         }

//         .modal-export-button {
//             background-color: var(--modal-export-button-bg);
//             color: var(--modal-export-button-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: 1px solid var(--modal-search-border);
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
//             white-space: nowrap;
//         }
//         .modal-export-button:hover {
//             background-color: var(--modal-export-button-hover-bg);
//             border-color: var(--modal-export-button-hover-border);
//         }

//         .modal-available-clients-list {
//             display: flex;
//             flex-direction: column;
//             gap: 15px;
//             max-height: unset; /* Allow it to expand within the scrollable modal */
//             overflow-y: visible; /* Let the modal handle scrolling */
//             padding-right: 0; /* Remove padding for scrollbar as modal handles it */
//         }

//         .modal-client-card {
//             background-color: var(--modal-client-card-bg);
//             border-radius: 10px;
//             border: 1px solid var(--modal-client-card-border);
//             padding: 15px;
//             display: flex;
//             flex-direction: column;
//             gap: 10px;
//             transition: background-color 0.3s ease, border-color 0.3s ease;
//         }

//         .modal-client-card-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             flex-wrap: wrap;
//             gap: 10px;
//         }

//         .modal-client-name {
//             font-size: 18px;
//             font-weight: 600;
//             color: var(--modal-client-name-color);
//             transition: color 0.3s ease;
//         }

//         .modal-client-priority-badge {
//             font-size: 12px;
//             font-weight: 600;
//             padding: 4px 10px;
//             border-radius: 12px;
//             white-space: nowrap;
//         }
//         .modal-client-priority-badge.high {
//             background-color: var(--attention-badge-bg);
//             color: var(--attention-badge-color);
//         }
//         .modal-client-priority-badge.medium {
//             background-color: var(--status-pending-bg);
//             color: var(--status-pending-color);
//         }
//         .modal-client-priority-badge.low {
//             background-color: var(--status-verified-bg);
//             color: var(--status-verified-color);
//         }

//         .modal-client-details {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 15px;
//             font-size: 14px;
//             color: var(--modal-client-detail-color);
//             transition: color 0.3s ease;
//         }

//         .modal-client-details span {
//             display: flex;
//             align-items: center;
//             gap: 5px;
//         }

//         .modal-client-details i {
//             font-size: 14px;
//             color: var(--icon-color);
//             transition: color 0.3s ease;
//         }

//         .modal-client-actions {
//             display: flex;
//             gap: 10px;
//             flex-wrap: wrap;
//             justify-content: flex-end;
//         }

//         .modal-assign-button {
//             background-color: var(--modal-assign-button-bg);
//             color: var(--modal-assign-button-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease;
//         }
//         .modal-assign-button:hover {
//             background-color: var(--modal-assign-button-hover-bg);
//         }

//         .modal-view-profile-button {
//             background-color: var(--modal-view-profile-bg);
//             color: var(--modal-view-profile-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: 1px solid var(--modal-search-border);
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
//         }
//         .modal-view-profile-button:hover {
//             background-color: var(--modal-view-profile-hover-bg);
//             border-color: var(--modal-view-profile-hover-border);
//         }

//         /* Assign Client Modal Specific Colors */
//         .assign-modal-content {
//             background-color: var(--modal-bg);
//             padding: 25px;
//             border-radius: 12px;
//             box-shadow: 0 8px 20px var(--card-shadow);
//             width: 90%;
//             max-width: 1200px; /* Adjusted max-width for this modal */
//             position: relative;
//             display: flex;
//             flex-direction: column;
//             gap: 20px;
//             border: 1px solid var(--modal-border-color);
//             transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//             max-height: 90vh;
//             overflow-y: auto;
//         }

//         .assign-modal-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding-bottom: 15px;
//             border-bottom: 1px solid var(--header-border-color);
//         }

//         .assign-modal-title {
//             font-size: 20px;
//             font-weight: 600;
//             color: var(--modal-header-color);
//         }

//         .assign-modal-close-button {
//             background: none;
//             border: none;
//             font-size: 24px;
//             color: var(--modal-close-button-color);
//             cursor: pointer;
//             transition: color 0.2s ease, background-color 0.2s ease;
//             border-radius: 50%;
//             width: 30px;
//             height: 30px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//         }
//         .assign-modal-close-button:hover {
//             background-color: var(--modal-close-button-hover-bg);
//         }

//         .assign-form-group {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//         }

//         .assign-form-group label {
//             font-size: 14px;
//             font-weight: 500;
//             color: var(--form-label-color);
//             transition: color 0.3s ease;
//         }

//         .assign-form-group select,
//         .assign-form-group textarea,
//         .assign-form-group input[type="text"],
//         .assign-form-group input[type="email"],
//         .assign-form-group input[type="tel"],
//         .assign-form-group input[type="date"],
//         .assign-form-group input[type="number"] { /* Added number type */
//             width: 100%;
//             padding: 10px 12px;
//             border: 1px solid var(--form-input-border);
//             border-radius: 8px;
//             background-color: var(--form-input-bg);
//             color: var(--form-input-text);
//             font-size: 14px;
//             transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease;
//             -webkit-appearance: none; /* Remove default arrow for selects */
//             -moz-appearance: none;
//             appearance: none;
//             cursor: pointer;
//         }

//         .assign-form-group select:focus,
//         .assign-form-group textarea:focus,
//         .assign-form-group input[type="text"]:focus,
//         .assign-form-group input[type="email"]:focus,
//         .assign-form-group input[type="tel"]:focus,
//         .assign-form-group input[type="date"]:focus,
//         .assign-form-group input[type="number"]:focus { /* Added number type */
//             outline: none;
//             border-color: var(--form-input-focus-border);
//             box-shadow: 0 0 0 0.2rem var(--form-input-focus-shadow);
//         }

//         .assign-form-group textarea {
//             min-height: 80px;
//             resize: vertical;
//         }

//         .assign-form-actions {
//             display: flex;
//             justify-content: flex-end;
//             gap: 10px;
//             margin-top: 10px;
//         }

//         .assign-form-button {
//             padding: 10px 20px;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             font-size: 15px;
//             font-weight: 500;
//             transition: background-color 0.2s ease, color 0.3s ease;
//         }

//         .assign-form-button.cancel {
//             background-color: var(--form-button-cancel-bg);
//             color: var(--form-button-cancel-color);
//             border: 1px solid var(--form-input-border);
//         }
//         .assign-form-button.cancel:hover {
//             background-color: var(--form-button-cancel-hover-bg);
//         }

//         .assign-form-button.assign {
//             background-color: var(--form-button-assign-bg);
//             color: var(--form-button-assign-color);
//         }
//         .assign-form-button.assign:hover {
//             background-color: var(--form-button-assign-hover-bg);
//         }

//         /* Total Clients Modal Specific Styles */
//         .total-clients-modal-content {
//             background-color: var(--modal-bg);
//             padding: 25px;
//             border-radius: 12px;
//             box-shadow: 0 8px 20px var(--card-shadow);
//             width: 90%;
//             max-width: 900px; /* Wider for the table */
//             position: relative;
//             display: flex;
//             flex-direction: column;
//             gap: 20px;
//             border: 1px solid var(--modal-border-color);
//             transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//             max-height: 90vh;
//             overflow-y: auto;
//         }

//         .total-clients-modal-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding-bottom: 15px;
//             border-bottom: 1px solid var(--header-border-color);
//             position: sticky;
//             top: -25px; /* Adjust to account for modal content padding */
//             background-color: var(--modal-bg);
//             z-index: 10;
//             margin: -25px -25px 0 -25px; /* Compensate for padding to make it full width */
//             padding: 25px 25px 15px 25px; /* Add back padding for content */
//         }

//         .total-clients-modal-title {
//             font-size: 22px;
//             font-weight: 600;
//             color: var(--modal-header-color);
//             display: flex;
//             align-items: center;
//             gap: 10px;
//         }
//         .total-clients-modal-title i {
//             font-size: 20px;
//             color: var(--icon-color);
//         }

//         .total-clients-modal-subtitle {
//             font-size: 14px;
//             color: var(--subtitle-color);
//             margin-top: 5px;
//         }

//         /* Adjust table styles for this modal specifically if needed, otherwise reuse existing */
//         .total-clients-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 14px;
//             text-align: left;
//             min-width: 950px; /* Increased min-width for side scroll */
//         }

//         .total-clients-table th,
//         .total-clients-table td {
//             padding: 10px; /* Adjusted padding for reduced height */
//             border-bottom: 1px solid var(--header-border-color);
//             transition: border-color 0.3s ease;
//             vertical-align: middle; /* Ensure vertical centering */
//         }

//         .total-clients-table th {
//             color: var(--subtitle-color);
//             font-weight: 600;
//             white-space: nowrap;
//             text-align: left; /* Ensure header text is left-aligned */
//         }

//         .total-clients-table td {
//             color: var(--text-color);
//             min-height: 50px; /* Added min-height for consistent row size */
//         }

//         .total-clients-table tr:last-child td {
//             border-bottom: none;
//         }

//         .total-clients-table .employee-cell {
//             display: flex;
//             align-items: center; /* Align items to the center */
//             gap: 10px;
//         }

//         .total-clients-table .employee-avatar {
//             width: 30px;
//             height: 30px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             background-color: var(--member-avatar-bg-default);
//             color: var(--member-avatar-color-default);
//             transition: background-color 0.3s ease, color 0.3s ease;
//             flex-shrink: 0; /* Prevent avatar from shrinking */
//         }

//         /* Specific styles for multi-line content in total clients table */
//         .total-clients-table .client-info,
//         .total-clients-table .position-info {
//             display: flex;
//             flex-direction: column;
//             justify-content: center; /* Center content vertically within these flex columns */
//         }

//         .total-clients-table .client-info .main-text {
//             font-weight: 500;
//             color: var(--text-color);
//         }

//         .total-clients-table .client-info .sub-text,
//         .total-clients-table .position-info .sub-text {
//             font-size: 12px;
//             color: var(--subtitle-color);
//         }

//         .total-clients-table .position-info .main-text {
//             font-weight: 500;
//             color: var(--text-color);
//         }

//         /* NEW: Employee Clients Detail Modal Styles */
//         .employee-clients-modal-content {
//             background-color: var(--modal-bg);
//             padding: 25px;
//             border-radius: 12px;
//             box-shadow: 0 8px 20px var(--card-shadow);
//             width: 90%;
//             max-width: 700px;
//             position: relative;
//             display: flex;
//             flex-direction: column;
//             gap: 20px;
//             border: 1px solid var(--modal-border-color);
//             max-height: 90vh;
//             overflow-y: auto;
//         }

//         .employee-clients-modal-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding-bottom: 15px;
//             border-bottom: 1px solid var(--header-border-color);
//         }

//         .employee-clients-modal-title {
//             font-size: 20px;
//             font-weight: 600;
//             color: var(--modal-header-color);
//         }

//         .employee-clients-list {
//             display: flex;
//             flex-direction: column;
//             gap: 15px;
//         }

//         .employee-client-card {
//             background-color: var(--card-bg);
//             border-radius: 10px;
//             border: 1px solid var(--member-border-color);
//             padding: 15px;
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//         }

//         .employee-client-card-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//         }

//         .employee-client-name {
//             font-weight: 600;
//             color: var(--text-color);
//         }

//         .employee-client-position {
//             font-size: 14px;
//             color: var(--subtitle-color);
//         }

//         .employee-client-details-row {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 10px 20px; /* Row gap, column gap */
//             font-size: 13px;
//             color: var(--icon-color);
//         }

//         .employee-client-details-item {
//             display: flex;
//             align-items: center;
//             gap: 5px;
//         }


//         /* NEW: Client Preview Modal Specific Styles */
//         .client-preview-grid-container {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//             gap: var(--client-preview-grid-gap);
//         }

//         .client-preview-section {
//             background-color: var(--client-preview-section-bg);
//             border: 1px solid var(--client-preview-section-border);
//             border-radius: 8px;
//             padding: 15px;
//             display: flex;
//             flex-direction: column;
//             gap: 10px;
//             transition: background-color 0.3s ease, border-color 0.3s ease;
//         }

//         .client-preview-section-title {
//             font-size: 16px;
//             font-weight: 600;
//             color: var(--client-preview-section-title-color);
//             margin-bottom: 5px;
//             padding-bottom: 8px;
//             border-bottom: 1px solid var(--client-preview-section-border);
//             transition: color 0.3s ease, border-color 0.3s ease;
//         }

//         .client-preview-detail-item {
//             display: flex;
//             flex-direction: column;
//             gap: 2px;
//         }

//         .client-preview-detail-label {
//             font-size: 13px;
//             color: var(--client-preview-detail-label-color);
//             font-weight: 500;
//             transition: color 0.3s ease;
//         }

//         .client-preview-detail-value {
//             font-size: 15px;
//             color: var(--client-preview-detail-value-color);
//             font-weight: 600;
//             word-break: break-word; /* Ensure long values wrap */
//             transition: color 0.3s ease;
//         }

//         .client-preview-skills-section {
//             margin-top: 10px;
//         }

//         .client-preview-skills-section .modal-client-skills {
//             margin-top: 10px;
//         }


//         /* Responsive adjustments for modals */
//         @media (max-width: 600px) {
//             .modal-content, .assign-modal-content, .total-clients-modal-content, .employee-clients-modal-content {
//                 padding: 15px;
//                 width: 95%;
//                 max-height: 90vh;
//             }
//             /* Apply to client preview modal as well */
//             .modal-content {
//                 max-width: 95%; /* Make it slightly wider on small screens */
//             }

//             .modal-title, .assign-modal-title, .total-clients-modal-title, .employee-clients-modal-title {
//                 font-size: 18px;
//             }
//             .modal-close-button, .assign-modal-close-button {
//                 font-size: 20px;
//             }
//             .modal-priority-overview {
//                 grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
//             }
//             .priority-card-value {
//                 font-size: 24px;
//             }
//             .priority-card-title {
//                 font-size: 12px;
//             }
//             .modal-actions-top {
//                 flex-direction: column;
//                 align-items: stretch;
//             }
// .modal-quick-assign-button,
//             .modal-export-button {
//                 width: 100%;
//                 justify-content: center;
//             }
//             .modal-client-actions {
//                 flex-direction: column;
//                 align-items: stretch;
//             }
//             .modal-assign-button,
//             .modal-view-profile-button {
//                 width: 100%;
//                 justify-content: center;
//             }
//             .assign-form-actions {
//                 flex-direction: column;
//                 align-items: stretch;
//             }
//             .assign-form-button {
//                 width: 100%;
//             }
//             .total-clients-modal-header {
//                 padding: 15px 15px 10px 15px; /* Adjust padding for small screens */
//                 margin: -15px -15px 0 -15px;
//             }
//             .total-clients-table {
//                 min-width: 600px; /* Still need some min-width for all columns */
//             }

//             .client-preview-grid-container {
//                 grid-template-columns: 1fr; /* Single column on small screens */
//             }
//         }

//         /* NEW: Interview Table Specific Styles */
//         .interview-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 14px;
//             text-align: left; /* Default left alignment for most columns */
//             min-width: 900px; /* Adjusted min-width for interview table columns */
//         }

//         .interview-table th,
//         .interview-table td {
//             padding: 12px 10px;
//             border-bottom: 1px solid var(--header-border-color);
//             transition: border-color 0.3s ease;
//             vertical-align: middle; /* Ensures all content is vertically centered */
//         }

//         .interview-table th {
//             color: var(--subtitle-color);
//             font-weight: 600;
//             white-space: nowrap;
//             text-align: left; /* Explicitly left-align headers by default */
//         }

//         .interview-table tr:last-child td {
//             border-bottom: none;
//         }

//         .interview-table .employee-cell {
//             display: flex;
//             align-items: center; /* Ensures avatar and text are aligned */
//             gap: 10px;
//         }

//         .interview-table .employee-avatar {
//             width: 30px;
//             height: 30px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             font-weight: 600;
//             background-color: var(--member-avatar-bg-default);
//             color: var(--member-avatar-color-default);
//             transition: background-color 0.3s ease, color 0.3s ease;
//             flex-shrink: 0; /* Prevent avatar from shrinking */
//         }

//         .interview-table .round-badge {
//             background-color: var(--status-applied-bg); /* Use a blueish badge for rounds */
//             color: var(--status-applied-color);
//             padding: 4px 10px;
//             border-radius: 15px;
//             font-size: 12px;
//             font-weight: 600;
//             display: inline-block;
//             white-space: nowrap;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .interview-table .date-cell {
//             white-space: nowrap;
//         }

//         .interview-table .action-button {
//             padding: 0; /* Remove padding to make it a perfect square */
//             border-radius: 6px;
//             border: 1px solid var(--action-button-border);
//             background-color: var(--action-button-bg);
//             color: var(--action-button-color);
//             font-size: 13px;
//             cursor: pointer;
//             transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.3s ease;
//             display: flex; /* Make it a flex container to center icon */
//             align-items: center; /* Center icon vertically */
//             justify-content: center; /* Center icon horizontally */
//             width: 30px; /* Fixed width for square button */
//             height: 30px; /* Fixed height for square button */
//         }

//         .interview-table .action-button:hover {
//             background-color: var(--action-button-hover-bg);
//             border-color: var(--action-button-hover-border);
//         }

//         .interview-table .action-button i {
//             color: var(--icon-color);
//             transition: color 0.3s ease;
//         }

//         .interviews-header .total-interviews-badge {
//             background-color: var(--status-verified-bg); /* Greenish badge */
//             color: var(--status-verified-color);
//             font-size: 12px;
//             font-weight: 600;
//             padding: 6px 12px;
//             border-radius: 15px;
//             transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         /* Styles for the Assigned tab employee search bar */
//         .assigned-employee-search-bar {
//             justify-content: flex-end; /* Pushes content to the right */
//         }

//         .assigned-employee-search-bar .search-input-wrapper {
//             flex: none; /* Prevent it from growing */
//             width: 250px; /* Set a fixed width */
//             min-width: unset; /* Override min-width from general rule */
//         }

//         @media (max-width: 767px) {
//             .assigned-employee-search-bar {
//                 justify-content: flex-start; /* Revert to default on small screens */
//             }
//             .assigned-employee-search-bar .search-input-wrapper {
//                 width: 100%; /* Full width on small screens */
//             }
//         }

//         /* NEW: Notification Modal Styles */
//         .notification-modal-content {
//           max-width: 500px; /* Smaller modal for notifications */
//         }

//         .notification-list {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }

//         .notification-item {
//           padding-bottom: 15px;
//           border-bottom: 1px solid var(--notification-item-border);
//           transition: border-color 0.3s ease;
//         }

//         .notification-item:last-child {
//           border-bottom: none;
//         }

//         .notification-item-title {
//           font-size: 16px;
//           font-weight: 600;
//           color: var(--text-color);
//           margin-bottom: 5px;
//         }

//         .notification-item-message {
//           font-size: 14px;
//           color: var(--subtitle-color);
//           margin-bottom: 8px;
//         }

//         .notification-item-time {
//           font-size: 12px;
//           color: var(--notification-item-time-color);
//           text-align: right;
//         }

//         /* NEW: User Profile Modal Styles */
//         .user-profile-modal-content {
//           max-width: 500px;
//         }

//         .profile-detail-item {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//           margin-bottom: 15px;
//         }

//         .profile-detail-label {
//           font-size: 14px;
//           font-weight: 500;
//           color: var(--profile-label-color);
//         }

//         .profile-detail-value {
//           font-size: 16px;
//           color: var(--profile-value-color);
//           font-weight: 600;
//         }

//         .profile-detail-item input[type="text"],
//         .profile-detail-item input[type="email"],
//         .profile-detail-item input[type="tel"] {
//           width: 100%;
//           padding: 10px 12px;
//           border: 1px solid var(--form-input-border);
//           border-radius: 8px;
//           background-color: var(--form-input-bg);
//           color: var(--form-input-text);
//           font-size: 14px;
//           transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease;
//         }

//         .profile-detail-item input[type="text"]:focus,
//         .profile-detail-item input[type="email"]:focus,
//         .profile-detail-item input[type="tel"]:focus {
//           outline: none;
//           border-color: var(--form-input-focus-border);
//           box-shadow: 0 0 0 0.2rem var(--form-input-focus-shadow);
//         }

//         .profile-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//           margin-top: 20px;
//         }

//         .profile-actions .edit-button {
//           background-color: var(--edit-button-bg);
//           color: var(--edit-button-color);
//           padding: 10px 20px;
//           border-radius: 8px;
//           border: none;
//           cursor: pointer;
//           font-size: 15px;
//           font-weight: 500;
//           transition: background-color 0.2s ease;
//         }
//         .profile-actions .edit-button:hover {
//           background-color: var(--edit-button-hover-bg);
//         }

//         .profile-actions .close-button {
//           background-color: var(--close-button-bg);
//           color: var(--close-button-color);
//           padding: 10px 20px;
//           border-radius: 8px;
//           border: 1px solid var(--form-input-border);
//           cursor: pointer;
//           font-size: 15px;
//           font-weight: 500;
//           transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
//         }
//         .profile-actions .close-button:hover {
//           background-color: var(--close-button-hover-bg);
//         }

//         /* Styles for the Clear Filter button */
//         .clear-filter-button {
//             background-color: var(--modal-export-button-bg); /* Reusing a neutral button style */
//             color: var(--modal-export-button-color);
//             padding: 8px 15px;
//             border-radius: 8px;
//             border: 1px solid var(--modal-search-border);
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             transition: background-color 0.2s ease, border-color 0.2s ease, color 0.3s ease;
//             white-space: nowrap;
//         }

//         .clear-filter-button:hover {
//             background-color: var(--modal-export-button-hover-bg);
//             border-color: var(--modal-export-button-hover-border);
//         }

//         /* LLM Summary Section */
//         .llm-summary-section {
//             background-color: var(--llm-section-bg);
//             border: 1px solid var(--llm-section-border);
//             border-radius: 8px;
//             padding: 15px;
//             margin-top: 15px;
//             font-size: 14px;
//             color: var(--llm-text-color);
//             transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
//         }

//         .llm-summary-section h4 {
//             font-size: 16px;
//             font-weight: 600;
//             color: var(--llm-text-color);
//             margin-top: 0;
//             margin-bottom: 10px;
//             transition: color 0.3s ease;
//         }

//         .llm-summary-section p {
//             margin: 0;
//             line-height: 1.5;
//         }

//         .llm-loading-indicator {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 10px;
//             padding: 15px;
//             font-size: 15px;
//             color: var(--llm-loading-color);
//             font-weight: 500;
//         }

//         .llm-loading-indicator i {
//             animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//         }
//         `}
//       </style>

//       {/* Header Section */}
//       <header className="header-section">
//         <h1 className="header-logo">
//           Tech<span className="x-highlight">X</span>plorers
//         </h1>
//         <div className="header-actions">
//           {/* Notification button */}
//           <button className="header-button" onClick={openNotificationsModal}>
//             <i className="fas fa-bell"></i>
//             <span className="notification-badge">{notifications.length}</span>
//           </button>
//           {/* Theme toggle button - moved next to notification */}
//           {/* <button className="header-button" onClick={toggleTheme}>
//             <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
//           </button> */}
//           {/* User Profile with Dropdown */}
//           <div className="user-profile" onClick={toggleProfileDropdown} ref={profileDropdownRef}>
//             <div className='user-info'>
//               <span>{userName}</span>
//               <span className="manager-badge">Manager</span>
//             </div>
//             <div className="user-avatar">{userAvatarLetter}</div>
//             <i className="fas fa-chevron-down dropdown-arrow"></i>

//             {isProfileDropdownOpen && (
//               <div className="profile-dropdown">
//                 <div className="profile-dropdown-item" onClick={handleProfileClick}>
//                   <i className="fas fa-user-circle"></i> Profile
//                 </div>
//                 {/* <div className="profile-dropdown-item" onClick={handleLogout}>
//                   <i className="fas fa-sign-out-alt"></i> Logout
//                 </div> */}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content Title and Subtitle */}
//       <section className="tab-section-header">
//         <h1>Welcome, {userName}!</h1>
//         <p>Manage your employee assignments and applications efficiently.</p>
//       </section>

//       {/* Radio Button Navigation */}
//       <nav className="radio-group">
//         <div className="radio-option">
//           <input
//             type="radio"
//             id="assignmentsRadio"
//             name="tabSelection"
//             value="Assignments"
//             checked={activeTab === 'Assignments'}
//             onChange={handleRadioChange}
//           />
//           <label htmlFor="assignmentsRadio">Clients</label>
//         </div>
//         <div className="radio-option">
//           <input
//             type="radio"
//             id="assignedRadio"
//             name="tabSelection"
//             value="Assigned"
//             checked={activeTab === 'Assigned'}
//             onChange={handleRadioChange}
//           />
//           <label htmlFor="assignedRadio">Employees</label>
//         </div>
//         <div className="radio-option">
//           <input
//             type="radio"
//             id="applicationsRadio"
//             name="tabSelection"
//             value="Applications"
//             checked={activeTab === 'Applications'}
//             onChange={handleRadioChange}
//           />
//           <label htmlFor="applicationsRadio">Applications</label>
//         </div>
//         <div className="radio-option">
//           <input
//             type="radio"
//             id="interviewsRadio"
//             name="tabSelection"
//             value="Interviews"
//             checked={activeTab === 'Interviews'}
//             onChange={handleRadioChange}
//           />
//           <label htmlFor="interviewsRadio">Interviews</label>
//         </div>
//       </nav>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {activeTab === 'Assignments' && (
//           <section className="client-assignment-overview">
//             <div className="client-assignment-header">
//               <h2 className="client-assignment-title">Client Assignment Overview</h2>
//               {/* Removed Assign New Client button */}
//             </div>
//             <div className="assignment-cards-grid">
//               {/* Unassigned Card - now clickable to open modal */}
//               <div className="assignment-card" onClick={() => setIsUnassignedClientsModalOpen(true)}>
//                 <div className="assignment-card-value">{totalUnassignedCount}</div>
//                 <div className="assignment-card-title">Clients Unassigned</div>
//                 <div className="assignment-card-description">View all unassigned clients</div>
//               </div>

//               {/* Total Clients Card (formerly Assigned) - now clickable to open new modal */}
//               <div className="assignment-card assigned" onClick={openTotalClientsModal}>
//                 <div className="assignment-card-value">{totalClientsCount}</div>
//                 <div className="assignment-card-title">Total assigned Clients</div>
//                 <div className="assignment-card-description">View all assigned clients</div>
//               </div>
//             </div>
//           </section>
//         )}

// {activeTab === 'Assigned' && (
//     <section className="assigned-employee-overview client-assignment-overview">
//         <div className="client-assignment-header">
//             <h2 className="client-assignment-title">My Employees</h2>
//             <div className="clients-count-badge">
//                 Total {totalAssignedClientsByEmployee} clients
//             </div>
//             <button className="assign-client-button" onClick={() => setIsAddEmployeeModalOpen(true)}>
//                 <i className="fas fa-user-plus"></i> Add Employee
//             </button>
//         </div>
        
//         <div className="applications-filters assigned-employee-search-bar" style={{ marginBottom: '20px' }}>
//             <div className="search-input-wrapper">
//                 <i className="fas fa-search"></i>
//                 <input
//                     type="text"
//                     placeholder="Search employees..."
//                     value={assignedEmployeeSearchQuery}
//                     onChange={handleAssignedEmployeeSearchChange}
//                 />
//             </div>
//         </div>
        
//         <div className="employee-cards-grid">
//             {filteredEmployees.map((employee) => (
//                 <div key={employee.firebaseKey} className="employee-card">
//                     <div className="employee-card-header">
//                         <div className="employee-avatar-large">{getInitials(employee.fullName)}</div>
//                         <div className="employee-info">
//                             <div className="employee-name">{employee.fullName}</div>
//                             <div className="employee-role">{employee.role}</div>
//                         </div>
//                         <div className="clients-count-badge">
//                             {assignedClients.filter(c => c.assignedTo === employee.firebaseKey).length} clients
//                         </div>
//                     </div>
//                     <div className="employee-card-details">
//                         <div className="success-rate">Success Rate: <span className="success-rate-value">{employee.successRate}%</span></div>&nbsp; 
//                         <button className="view-employee-details-button" onClick={() => openEmployeeClientsModal(employee)}>
//   <i className="fas fa-eye"></i>View Client
// </button>
//                     </div>
//                 </div>
//             ))}
//             {filteredEmployees.length === 0 && (
//                 <p style={{ textAlign: 'center', color: 'var(--text-color)', gridColumn: '1 / -1' }}>
//                     No employees assigned to your clients.
//                 </p>
//             )}
//         </div>
//     </section>
// )}

//        {/* --- NEW Applications Tab UI --- */}
//         {activeTab === 'Applications' && (
//           <ApplicationsTab
//             applicationData={filteredApplicationData}
//             employees={displayEmployees}
//             uniqueClientNames={uniqueAssignedClientNames}
//             applicationFilterEmployee={applicationFilterEmployee}
//             handleApplicationFilterEmployeeChange={handleApplicationFilterEmployeeChange}
//             applicationFilterClient={applicationFilterClient}
//             handleApplicationFilterClientChange={handleApplicationFilterClientChange}
//             applicationFilterDateRange={applicationFilterDateRange}
//             handleApplicationFilterDateRangeChange={(e) => setApplicationFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }))}
//             sortOrder={sortOrder}
//             setSortOrder={setSortOrder}
//             applicationSearchQuery={applicationSearchQuery}
//             handleApplicationSearchChange={handleApplicationSearchChange}
//             areFiltersActive={areApplicationsFiltersActive}
//             handleClearFilters={handleClearApplicationsFilters}
//             onViewDetails={openApplicationDetailModal}
//             onEdit={openEditApplicationModal}
//             onDelete={(app) => {
//                 setSelectedApplication(app);
//                 handleDeleteApplication();
//             }}
//           />

//         )}

//         {showAttachmentModal && (
//   <AttachmentModal
//     attachments={currentAttachments}
//     onClose={closeAttachmentModal}
//   />
// )}

//         {activeTab === 'Interviews' && (
//           <section className="interviews-section client-assignment-overview">
//             <div className="client-assignment-header interviews-header">
//               <h2 className="client-assignment-title">Interview Management</h2>
//               <span className="total-interviews-badge">{filteredInterviewData.length} total interviews</span>
//             </div>

//             <FilterComponent
//               filterDateRange={interviewFilterDateRange} // Use interviews state
//               handleDateRangeChange={(e) => setInterviewFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }))}
//               sortOrder={sortOrder}
//               setSortOrder={setSortOrder}
//               quickFilter={quickFilter}
//               handleQuickFilterChange={handleQuickFilterChange}
//               areFiltersActive={areInterviewsFiltersActive}
//               handleClearFilters={handleClearInterviewsFilters}
//               sortOptions={['Newest First', 'Oldest First']}
//             />

//             <div className="applications-filters"> {/* Reusing applications-filters for consistent styling */}
//               <div className="search-input-wrapper">
//                 <i className="fas fa-search"></i>
//                 <input
//                   type="text"
//                   placeholder="Search interviews..."
//                   value={interviewSearchQuery}
//                   onChange={handleInterviewSearchChange}
//                 />
//               </div>
//               <div className="filter-dropdown">
//                 <select
//                   value={interviewFilterRound}
//                   onChange={handleInterviewFilterRoundChange}
//                 >
//                   <option value="All Rounds">All Rounds</option>
//                   <option value="1st Round">Round 1</option>
//                   <option value="2st Round">Round 2</option>
//                   <option value="3rd Round">ROund 3</option>
//                   {/* Add more rounds as needed based on your data */}
//                 </select>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//             </div>

//             <div className="table-responsive">
//               <table className="interview-table">
//                 <thead><tr>
//                   <th>EMPLOYEE</th>
//                   <th>CLIENT</th>
//                   <th>JOB TITLE</th>
//                   <th>COMPANY</th>
//                   <th>ROUND</th>
//                   <th>ATTACHMENTS</th>
//                   <th>TIME</th>
//                   <th>DATE</th>
//                   <th>STATUS</th> {/* New column header for Status */}
//                   {/* REMOVED: <th>ACTIONS</th> */}
//                 </tr></thead>
//                 <tbody>
//                   {filteredInterviewData.map((interview) => {
//         // FIX: Find the assigned employee object using the 'assignedTo' key
//         const assignedEmployee = allEmployees.find(
//           (emp) => emp.firebaseKey === interview.assignedTo
//         );

//         // FIX: Safely get the employee's name and initials, providing a fallback
//         const employeeName = assignedEmployee
//           ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}`
//           : 'N/A';
//         const employeeInitials = assignedEmployee
//           ? getInitials(employeeName)
//           : '??';

//         return (
//                     <tr key={interview.id}>
//                       <td className="employee-cell">
//                         <div className="employee-avatar">{employeeInitials}</div>
//                         {employeeName}
//                       </td>
//                       <td>{interview.clientName}</td>
//                       <td>{interview.jobTitle}</td>
//                       <td>{interview.company}</td>
//                       <td>
//                         <span className="round-badge">{interview.round}</span>
//                       </td>
//                        <td className="action-buttons">
//               {interview.attachments && interview.attachments.length > 0 ? (
//                 <button
//                   onClick={() => handleAttachmentClick(interview.attachments)}
//                   className="action-button"
//                   title="View Attachments"
//                 >
//                   <i className="fas fa-paperclip"></i> ({interview.attachments.length})
//                 </button>
//               ) : (
//                 <span style={{ color: 'var(--text-color)', opacity: 0.6 }}>N/A</span>
//               )}
//             </td>
//              <td className="date-cell">
//                         {interview.interviewTime}
//                       </td>
//                       <td className="date-cell">
//                         {formatDateToDDMMYYYY(interview.interviewDate)}
//                       </td>
                     
//                       <td>
//                         {interview.status} {/* Display the new status */}
//                       </td>
//                     </tr>
//                   );
//       })}
//                   {filteredInterviewData.length === 0 && (
//                     <tr>
//                       <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-color)' }}> 
//                         No interviews to display matching your criteria.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// const AttachmentModal = ({ attachments, onClose }) => {
//   return (
//     <Modal show={true} onHide={onClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Interview Attachments</Modal.Title>
//       </Modal.Header>
//       <Modal.Body style={{ textAlign: 'center' }}>
//         {attachments.length === 0 ? (
//           <p>No attachments available for this interview.</p>
//         ) : (
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
//             {attachments.map((attachment, index) => (
//               <a
//                 key={attachment.downloadUrl || index}
//                 href={attachment.downloadUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ textDecoration: 'none' }}
//               >
//                 <div style={{
//                   border: '1px solid #e2e8f0',
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   width: '200px',
//                   height: '150px',
//                   backgroundColor: '#f8fafc',
//                   cursor: 'pointer',
//                   transition: 'transform 0.2s ease',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}
//                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
//                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
//                 >
//                   <img
//                     src={attachment.downloadUrl}
//                     alt={attachment.name || `Attachment ${index + 1}`}
//                     style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
//                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150/e2e8f0/64748B?text=Image+Error'; }}
//                   />
//                 </div>
//               </a>
//             ))}
//           </div>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ManagerWorkSheet;
