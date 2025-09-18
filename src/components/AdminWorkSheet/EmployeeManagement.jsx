// In EmployeeManagement.jsx, replace the entire file content with this code.
import React, { useState, useEffect, useRef } from 'react';
import { database, auth } from '../../firebase'; // Import your Firebase config
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Spinner } from 'react-bootstrap';


const EmployeeManagement = () => {
  // --- Employee Management States ---
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);
  const [currentEmployeeToEdit, setCurrentEmployeeToEdit] = useState(null);
  const [isStatusConfirmModalOpen, setIsStatusConfirmModalOpen] = useState(false);
  const [employeeToUpdateStatus, setEmployeeToUpdateStatus] = useState(null);
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
  const [isConfirmUpdateModalOpen, setIsConfirmUpdateModalOpen] = useState(false);
  const [confirmUpdateMessage, setConfirmUpdateMessage] = useState('');
  const [confirmActionType, setConfirmActionType] = useState(null);
  const [pendingEmployeeUpdate, setPendingEmployeeUpdate] = useState(null);
  const [employeeToDeleteDetails, setEmployeeToDeleteDetails] = useState(null);

  // NEW: State for loading spinners
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [isUpdatingEmployee, setIsUpdatingEmployee] = useState(false);
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);


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

  const departmentOptions = departments.map(d => d.name);
  departmentOptions.unshift('No department assigned');

  const roleOptions = [
    { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
    { value: 'Admin', label: 'Admin', description: 'Full system access and employee management' },
    { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
    { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
  ];
  const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  // --- Employee Management Handlers ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    (employee.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.personalEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.roles || []).some(role => (role || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );


  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    // Set up a listener for real-time data fetching
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase returns an object; convert it to an array
        const allUsersArray = Object.keys(data).map(key => ({
          firebaseKey: key, // Keep the Firebase key for future updates/deletes
          ...data[key]
        }));

        // --- NEW: Filter for users with the 'employee' role ---
        const filteredUsers = allUsersArray.filter(user => 
            user.roles && Array.isArray(user.roles) && (
                user.roles.includes('employee') || 
                user.roles.includes('admin') || 
                user.roles.includes('manager')
            )
        );

        setEmployees(filteredUsers);
      } else {
        setEmployees([]); // Handle case where there are no users
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase employees fetch error:", error);
      setError(error.message);
      setLoading(false);
    });

    // Cleanup function: Unsubscribe from Firebase listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const savedEmployees = localStorage.getItem('users');
        if (savedEmployees && JSON.parse(savedEmployees).length > 0) {
          setEmployees(JSON.parse(savedEmployees));
        } else {
          const response = await fetch('/employees.json');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setEmployees(data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to load employees:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!loading && employees.length > 0) {
      localStorage.setItem('users', JSON.stringify(employees));
    }
  }, [employees, loading]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'users' && event.newValue) {
        try {
          setEmployees(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Failed to parse employees from storage event", error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAddEmployeeClick = () => {
    setIsAddEmployeeModalOpen(true);
  };

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
    setNewEmployee(prevemployee => ({
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
    setNewEmployee(prev => ({ ...prev, temporaryPassword: password }));
  };



  const handleCreateEmployeeAccount = async (e) => {
    e.preventDefault();
    setIsCreatingEmployee(true); // NEW: Start loading

    // Construct the new employee object from the form state
    const newEmployeeData = {
      // Personal Info
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      gender: newEmployee.gender,
      dateOfBirth: newEmployee.dateOfBirth,
      maritalStatus: newEmployee.maritalStatus,
      
      // Contact Info
      personalNumber: newEmployee.personalNumber,
      alternativeNumber: newEmployee.alternativeNumber,
      personalEmail: newEmployee.personalEmail,
      workEmail: newEmployee.workEmail,

      // Address Info
      address: newEmployee.address,
      country: newEmployee.country,
      state: newEmployee.state,
      city: newEmployee.city,
      zipcode: newEmployee.zipcode,
      
      // Employment Info
      dateOfJoin: newEmployee.dateOfJoin,
      temporaryPassword: newEmployee.temporaryPassword,
      accountStatus: newEmployee.accountStatus,
      roles: [newEmployee.role.toLowerCase()],
      department: newEmployee.department,
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmployee.workEmail,
        newEmployee.temporaryPassword
      );
      const user = userCredential.user;

      newEmployeeData.firebaseKey = user.uid;
      
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, newEmployeeData);
      
      console.log("Employee created successfully in Firebase Auth and Database!");
      handleCloseAddEmployeeModal();

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please use a different work email.");
      } else {
        console.error("Error creating employee:", error);
        alert("Failed to create employee. Please check the details and try again.");
      }
    } finally {
      setIsCreatingEmployee(false); // NEW: Stop loading
    }
  };

  const getEmployeeChanges = (original, updated) => {
    const changes = [];
    const fieldsToCompare = [
      'firstName', 'lastName', 'gender', 'dateOfBirth', 'maritalStatus',
      'personalNumber', 'alternativeNumber', 'personalEmail', 'workEmail',
      'address', 'city', 'state', 'zipcode', 'country', 'dateOfJoin'
    ];

    fieldsToCompare.forEach(field => {
      if (original[field] !== updated[field]) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        changes.push(`${fieldName} changed`);
      }
    });

    const originalRole = roleOptions.find(opt => (original.roles || []).includes(opt.value.toLowerCase()))?.value || 'Employee';
    const originalDepartment = departmentOptions.find(dept => (original.roles || []).includes(dept.toLowerCase())) || 'No department assigned';
    const originalAccountStatus = accountStatusOptions.find(status => (original.roles || []).includes(status.toLowerCase())) || 'Active';

    if (originalRole !== updated.role) {
      changes.push(`Role changed`);
    }
    if (originalDepartment !== updated.department) {
      changes.push(`Department changed`);
    }
    if (originalAccountStatus !== updated.accountStatus) {
      changes.push(`Account Status changed`);
    }

    return changes.length > 0 ? changes.join(', ') : 'no changes';
  };

  const handleEditEmployeeClick = (firebaseKey) => {
    const employee = employees.find(u => u.firebaseKey === firebaseKey);
    if (employee) {
      const employeeDepartment = departmentOptions.find(dept => (employee.roles || []).includes(dept.toLowerCase())) || 'No department assigned';
      const employeeAccountStatus = accountStatusOptions.find(status => (employee.roles || []).includes(status.toLowerCase())) || 'Active';
      const employeeRole = roleOptions.find(role => (employee.roles || []).includes(role.value.toLowerCase()))?.value || 'Employee';

      setCurrentEmployeeToEdit({
        firebaseKey: employee.firebaseKey,
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
      setIsEditEmployeeModalOpen(true);
    }
  };

  const handleCloseEditEmployeeModal = () => {
    setIsEditEmployeeModalOpen(false);
    setCurrentEmployeeToEdit(null);
  };

  const handleEditemployeeChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployeeToEdit(prevemployee => ({
      ...prevemployee,
      [name]: value
    }));
  };
  
  const handleUpdateEmployeeAccount = (e) => {
    e.preventDefault();
    const originalEmployee = employees.find(emp => emp.firebaseKey === currentEmployeeToEdit.firebaseKey);
    const changes = getEmployeeChanges(originalEmployee, currentEmployeeToEdit);

    if (changes === 'no changes') {
      setConfirmUpdateMessage('No changes were made to the employee details.');
      setIsConfirmUpdateModalOpen(true);
      setConfirmActionType(null);
      return;
    }
    
    setPendingEmployeeUpdate(currentEmployeeToEdit);
    setConfirmUpdateMessage(`Are you sure you want to apply the following changes: ${changes}?`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('employeeUpdate');
  };

  const confirmEmployeeUpdate = async () => {
    if (!pendingEmployeeUpdate || !pendingEmployeeUpdate.firebaseKey) {
      console.error("Update failed: Employee data or Firebase key is missing.");
      return;
    }

    setIsUpdatingEmployee(true); // NEW: Start loading

    const { firebaseKey, ...employeeDataToUpdate } = pendingEmployeeUpdate;
    const originalEmployee = employees.find(emp => emp.firebaseKey === firebaseKey);

    const updatedData = {
      ...originalEmployee,
      ...employeeDataToUpdate,
      accountStatus: pendingEmployeeUpdate.accountStatus,
      roles: [pendingEmployeeUpdate.role.toLowerCase()],
      department: pendingEmployeeUpdate.department
    };
    delete updatedData.id;

    try {
      const usersRef = ref(database, `users/${firebaseKey}`);
      await update(usersRef, updatedData);
      console.log("Employee updated successfully in Firebase!");
    } catch (error) {
      console.error("Error updating employee in Firebase:", error);
      alert("Failed to update employee. Please try again.");
    } finally {
      setIsUpdatingEmployee(false); // NEW: Stop loading
      handleCloseEditEmployeeModal();
      setIsConfirmUpdateModalOpen(false);
      setPendingEmployeeUpdate(null);
    }
  };
  
  const handleDeleteEmployeeClick = (employeeId) => {
    const employee = employees.find(emp => emp.firebaseKey === employeeId);
    setEmployeeToDeleteDetails(employee);
    setConfirmUpdateMessage(`Are you sure you want to delete employee '${employee.firstName} ${employee.lastName}'? This action cannot be undone.`);
    setIsConfirmUpdateModalOpen(true);
    setConfirmActionType('employeeDelete');
  };
  
  const handleConfirmDelete = async () => {
    if (!employeeToDeleteDetails || !employeeToDeleteDetails.firebaseKey) {
      console.error("Delete failed: Employee data or Firebase key is missing.");
      return;
    }

    setIsDeletingEmployee(true); // NEW: Start loading

    try {
      const usersRef = ref(database, `users/${employeeToDeleteDetails.firebaseKey}`);
      await remove(usersRef);
      console.log("Employee deleted successfully from Firebase!");
    } catch (error) {
      console.error("Error deleting employee from Firebase:", error);
      alert("Failed to delete employee. Please try again.");
    } finally {
      setIsDeletingEmployee(false); // NEW: Stop loading
      setIsConfirmUpdateModalOpen(false);
      setEmployeeToDeleteDetails(null);
    }
  };


  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = (name || '').split(' ').filter(part => part.length > 0);
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length >= 2) return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    return '';
  };

  const handleStatusToggle = (employee) => {
    const newStatus = employee.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setEmployeeToUpdateStatus({ ...employee, newStatus: newStatus });
    setIsStatusConfirmModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!employeeToUpdateStatus) return;

    const { firebaseKey, newStatus } = employeeToUpdateStatus;
    const userRef = ref(database, `users/${firebaseKey}`);

    try {
      await update(userRef, { accountStatus: newStatus });
      console.log(`Employee status for ${firebaseKey} updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update employee status in Firebase:", error);
      alert("An error occurred while updating the employee's status.");
    } finally {
      setIsStatusConfirmModalOpen(false);
      setEmployeeToUpdateStatus(null);
    }
  };



  const getRoleTagBg = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#fee2e2';
      case 'manager': return '#E0F7FA';
      case 'team lead': return '#F3E5F5';
      case 'employee': return '#E1F5FE';
      case 'active': return '#E8F5E9';
      case 'inactive': return '#FFEBEE';
      case 'management': return '#E3F2FD';
      case 'tech placement': return '#FCE4EC';
      default: return '#f3f4f6';
    }
  };

  const getRoleTagText = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#991b1b';
      case 'manager': return '#00BCD4';
      case 'team lead': return '#9C27B0';
      case 'employee': return '#2196F3';
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      case 'management': return '#2196F3';
      case 'tech placement': return '#E91E63';
      default: return '#6b7280';
    }
  };

  return (
    <div className="ad-body-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
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
        .ad-body-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            min-height: 100vh;
            color: var(--text-primary);
        }

           .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 28px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #28a745; /* Green for Active */
        }

        input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }
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
      `}
      </style>
      <main>
        <div className="employee-management-container">
          <div className="employee-management-box">
            <div className="employee-management-header">
              <h2 className="employee-management-title">Employee Management</h2>
              <div className="employee-search-add">
                <input type="text" placeholder="Search employees..." className="employee-search-input" value={searchTerm} onChange={handleSearchChange} />
                <button className="add-employee-btn" onClick={handleAddEmployeeClick}>Add Employee</button>
              </div>
            </div>
            <div className="employee-list">
              {filteredEmployees.map(employee => (
                <div className="employee-card" key={employee.firebaseKey}>
                  <div className="employee-card-left">
                    <div className="employee-avatar">{getInitials(`${employee.firstName} ${employee.lastName}`)}</div>
                    <div className="employee-info">
                      <div className="employee-name">{`${employee.firstName} ${employee.lastName}`}</div>
                      <div className="employee-email">{employee.workEmail}</div>
                      <div className="employee-roles">
                        {(employee.roles || []).map(role => (
                          <span key={role} className="role-tag" style={{ backgroundColor: getRoleTagBg(role), color: getRoleTagText(role) }}>{role}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="employee-actions">
                    <label className="toggle-switch" style={{top:"10px"}}>
                      <input
                        type="checkbox"
                        checked={employee.accountStatus === 'Active'}
                        onChange={() => handleStatusToggle(employee)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <button className="action-btn" onClick={() => handleEditEmployeeClick(employee.firebaseKey)}>Edit</button>
                    
                    <button className="action-btn delete-btn" onClick={() => handleDeleteEmployeeClick(employee.firebaseKey)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

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
                <button type="submit" className="create-employee-btn" disabled={isCreatingEmployee}>
                  {isCreatingEmployee ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Employee Account"
                  )}
                </button>
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
              <button type="button" className="confirm-save-btn" onClick={handleUpdateEmployeeAccount} disabled={isUpdatingEmployee}>
                {isUpdatingEmployee ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Account"
                )}
              </button>
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
              <button className="modal-close-btn" onClick={() => setIsDeleteConfirmModalOpen(false)}>&times;</button>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={() => setIsDeleteConfirmModalOpen(false)}>Cancel</button>
              <button type="button" className="confirm-delete-btn" onClick={handleConfirmDelete} disabled={isDeletingEmployee}>
                {isDeletingEmployee ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFICATION: Add the new Status Change Confirmation Modal */}
      {isStatusConfirmModalOpen && employeeToUpdateStatus && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Status Change</h3>
              <button className="modal-close-btn" onClick={() => setIsStatusConfirmModalOpen(false)}>&times;</button>
            </div>
            <p>
              Are you sure you want to change the status of 
              <strong> {`${employeeToUpdateStatus.firstName} ${employeeToUpdateStatus.lastName}`} </strong> 
              to <strong>{employeeToUpdateStatus.newStatus}</strong>?
            </p>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={() => setIsStatusConfirmModalOpen(false)}>Cancel</button>
              <button 
                type="button" 
                className={employeeToUpdateStatus.newStatus === 'Active' ? 'create-employee-btn' : 'confirm-delete-btn'}
                onClick={confirmStatusUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {isConfirmUpdateModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Action</h3>
              <button className="modal-close-btn" onClick={() => setIsConfirmUpdateModalOpen(false)}>&times;</button>
            </div>
            <p>{confirmUpdateMessage}</p>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={() => setIsConfirmUpdateModalOpen(false)}>Cancel</button>
              {confirmActionType === 'employeeUpdate' && (
                <button type="button" className="create-employee-btn" onClick={confirmEmployeeUpdate} disabled={isUpdatingEmployee}>
                  {isUpdatingEmployee ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Confirm Update"
                  )}
                </button>
              )}
              {confirmActionType === 'employeeDelete' && (
                <button type="button" className="confirm-delete-btn" onClick={handleConfirmDelete} disabled={isDeletingEmployee}>
                  {isDeletingEmployee ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


export default EmployeeManagement;

