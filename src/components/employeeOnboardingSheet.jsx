import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Country, State, City } from 'country-state-city';

const EmployeeOnboardingWorkSheet = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
      const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
      const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('Awaiting');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [selectedDesignations, setSelectedDesignations] = useState([]);

    // NEW: State for the confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // 'approve', 'edit', or 'delete'
    const [employeeToConfirm, setEmployeeToConfirm] = useState(null);

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


    const allCountries = Country.getAllCountries();
    const [editFormStates, setEditFormStates] = useState([]);
    const [editFormCities, setEditFormCities] = useState([]);

    const personalNumberCountryCode = 91;
    const alternativeNumberCountryCode = 91;
    const availableDesignations = ['Admin', 'Job Application Specialist', 'Manager', 'Asset Manager', 'Team Lead'];

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
    { value: 'Administrator', label: 'Administrator', description: 'Full system access and employee management' },
    { value: 'Manager', label: 'Manager', description: 'Manages teams and oversees operations' },
    { value: 'Team Lead', label: 'Team Lead', description: 'Leads a team and monitors activities' },
    { value: 'Employee', label: 'Employee', description: 'Standard employee access for job processing' },
  ];

      const accountStatusOptions = ['Active', 'Inactive', 'Pending'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const savedEmployees = localStorage.getItem('employees');
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
            localStorage.setItem('employees', JSON.stringify(employees));
        }
    }, [employees, loading]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'employees' && event.newValue) {
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

    useEffect(() => {
        if (selectedEmployee) {
            setEditFormData({
                firstName: selectedEmployee.firstName, lastName: selectedEmployee.lastName,
                gender: selectedEmployee.gender, dateOfBirth: selectedEmployee.dateOfBirth,
                personalNumber: selectedEmployee.personalNumber, alternativeNumber: selectedEmployee.alternativeNumber,
                personalEmail: selectedEmployee.personalEmail, workEmail: selectedEmployee.workEmail, dateOfJoin: selectedEmployee.dateOfJoin,
                country: selectedEmployee.country, state: selectedEmployee.state, city: selectedEmployee.city,
                zipcode: selectedEmployee.zipcode, address: selectedEmployee.address,
            });
            setEditFormStates(State.getStatesOfCountry(selectedEmployee.country));
            setEditFormCities(City.getCitiesOfState(selectedEmployee.country, selectedEmployee.state));
        }
    }, [selectedEmployee]);

    // --- Action Handlers ---

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailsModal(true);
    };
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

  

      const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewEmployee(prev => ({ ...prev, temporaryPassword: password }));
  };

     const handleCreateEmployeeAccount = (e) => {
    e.preventDefault();
    const newEmployeeId = employees.length > 0 ? Math.max(...employees.map(u => u.id)) + 1 : 1;
    const newRoles = [newEmployee.role.toLowerCase()];
    if (newEmployee.accountStatus.toLowerCase() === 'active') {
      newRoles.push('active');
    } else if (newEmployee.accountStatus.toLowerCase() === 'inactive') {
      newRoles.push('inactive');
    } else if (newEmployee.accountStatus.toLowerCase() === 'pending') {
      newRoles.push('pending');
    }
    if (newEmployee.department !== 'No department assigned') {
      newRoles.push(newEmployee.department.toLowerCase());
    }
    setEmployees(prevemployees => [
      ...prevemployees,
       {
        id: newEmployeeId,
    firstName: newEmployee.firstName,
    lastName: newEmployee.lastName,
    gender: newEmployee.gender,
    dateOfBirth: newEmployee.dateOfBirth,
    maritalStatus: newEmployee.maritalStatus,
    personalNumber: newEmployee.personalNumber,
    alternativeNumber: newEmployee.alternativeNumber,
    personalEmail: newEmployee.personalEmail,
    workEmail: newEmployee.workEmail,
    country: newEmployee.country,
    state: newEmployee.state,
    city: newEmployee.city,
    address: newEmployee.address,
    zipcode: newEmployee.zipcode,
    status: 'Awaiting',
    role: newEmployee.role || 'employee',
    department: newEmployee.department || 'No department assigned',
    accountStatus: newEmployee.accountStatus || 'Active',
    dateOfJoin: newEmployee.dateOfJoin || '',
    temporaryPassword: newEmployee.temporaryPassword || '',
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


    // MODIFIED: This function now sets the employee's status to 'Review'
    const handleApprove = (employeeId) => {
        const employeeToMove = employees.find(emp => emp.id === employeeId);
        if (!employeeToMove) return;

        const approvedEmployee = { ...employeeToMove, status: 'Review' };

        // Update the employee's status in the current component's state
        setEmployees(employees.map(emp =>
            emp.id === employeeId ? { ...emp, status: 'Review' } : emp
        ));

        // Also save to the separate local storage key for the admin worksheet
        const adminEmployees = JSON.parse(localStorage.getItem('admin_managed_employees') || '[]');
        localStorage.setItem(
            'admin_managed_employees',
            JSON.stringify([approvedEmployee, ...adminEmployees])
        );


        setShowDetailsModal(false);
    };

    // NEW: Function to handle deleting an employee
    const handleDelete = (employeeId) => {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        setShowDetailsModal(false); // Close details modal if open
    };

    // NEW: Functions to open the confirmation modal for each action
    const openConfirmationModal = (employee, action) => {
        setEmployeeToConfirm(employee);
        setConfirmAction(action);
        setShowConfirmModal(true);
    };

    // NEW: Function that runs when the user confirms the action
    const handleConfirmAction = () => {
        if (!employeeToConfirm) return;

        if (confirmAction === 'approve') {
            handleApprove(employeeToConfirm.id);
        } else if (confirmAction === 'edit') {
            setShowDetailsModal(false); // Close details modal
            setShowEditForm(true); // Open edit form
            setSelectedEmployee(employeeToConfirm); // Ensure the correct employee is selected for editing
        } else if (confirmAction === 'delete') {
            handleDelete(employeeToConfirm.id);
        }

        // Close the confirmation modal
        setShowConfirmModal(false);
        setEmployeeToConfirm(null);
        setConfirmAction(null);
    };

    const handleSaveEditedDetails = (e) => {
        e.preventDefault();
        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id ? { ...emp, ...editFormData } : emp
        ));
        setShowEditForm(false);
        setSelectedEmployee(null);
        setEditFormData({});
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setSelectedEmployee(null);
        setEditFormData({});
    };

    const handleDesignationChange = (designation) => {
        setSelectedDesignations(prevSelected =>
            prevSelected.includes(designation) ?
            prevSelected.filter(d => d !== designation) :
            [...prevSelected, designation]
        );
    };

    const handleSaveDesignations = () => {
        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id ?
            { ...emp,
                designations: selectedDesignations.join(', ')
            } :
            emp
        ));
        setShowDesignationModal(false);
        setSelectedEmployee(prev => ({ ...prev,
            designations: selectedDesignations.join(', ')
        }));
    };
     const handleEditDetails = () => {
                setShowDetailsModal(false);
        setShowEditForm(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditFormCountryChange = (e) => {
        const countryIsoCode = e.target.value;
        setEditFormData(prevData => ({ ...prevData, country: countryIsoCode, state: '', city: '' }));
        setEditFormStates(State.getStatesOfCountry(countryIsoCode));
        setEditFormCities([]);
    };

    const handleEditFormStateChange = (e) => {
        const stateIsoCode = e.target.value;
        setEditFormData(prevData => ({ ...prevData, state: stateIsoCode, city: '' }));
        setEditFormCities(City.getCitiesOfState(editFormData.country, stateIsoCode));
    };

    const handleEditFormCityChange = (e) => {
        const cityName = e.target.value;
        setEditFormData(prevData => ({ ...prevData, city: cityName }));
    };



    const handleCloseDesignationModal = () => setShowDesignationModal(false);

    const getDisplayName = (type, isoCode, countryIsoCode = '') => {
        if (!isoCode) return 'N/A';
        if (type === 'country') {
            const country = allCountries.find(c => c.isoCode === isoCode);
            return country ? country.name : isoCode;
        } else if (type === 'state') {
            const state = State.getStatesOfCountry(countryIsoCode).find(s => s.isoCode === isoCode);
            return state ? state.name : isoCode;
        }
        return isoCode;
    };

       const handleNewemployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevemployee => ({
      ...prevemployee,
      [name]: value
    }));
  };
    
    // --- All styles are preserved and unchanged ---
    const containerStyle = { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' };
    const headerStyle = { textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '2em' };
    const tabsContainerStyle = { display: 'flex', justifyContent: 'center', marginBottom: '30px', backgroundColor: '#e9ecef', borderRadius: '8px', padding: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const tabButtonStyle = { padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.3s ease, color 0.3s ease', backgroundColor: 'transparent', color: '#555', margin: '0 5px' };
    const activeTabButtonStyle = { ...tabButtonStyle, backgroundColor: '#007bff', color: '#fff', boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)' };
    const tableContainerStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflowX: 'auto' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
    const thStyle = { padding: '12px 15px', borderBottom: '2px solid #dee2e6', textAlign: 'left', backgroundColor: '#f8f9fa', color: '#495057', fontSize: '0.9em', textTransform: 'uppercase' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'left', color: '#343a40', fontSize: '0.9em' };
    const statusBadgeStyle = { padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8em', display: 'inline-flex', alignItems: 'center', gap: '5px' };
    const awaitingStatusStyle = { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
    const reviewStatusStyle = { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' };
    const actionButtonStyle = { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1em', margin: '0 5px', color: '#007bff', transition: 'color 0.2s ease' };
    const actionButtonHoverStyle = { color: '#0056b3' };
    const detailsModalTitleStyle = { fontSize: '1.8em', fontWeight: 'bold', color: '#333', marginBottom: '10px', textAlign: 'center' };
    const detailsModalSubtitleStyle = { fontSize: '0.9em', color: '#666', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const detailsSectionStyle = { marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e9e9e9' };
    const detailsSectionTitleStyle = { fontSize: '1.2em', fontWeight: 'bold', color: '#555', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' };
    const detailLabelStyle = { fontSize: '0.85em', color: '#777', marginBottom: '5px', fontWeight: 'bold' };
    const detailValueStyle = { fontSize: '1em', color: '#333', wordBreak: 'break-word' };
    const assignDesignationsButtonStyle = { backgroundColor: '#e7f0fd', color: '#007bff', padding: '10px 15px', borderRadius: '5px', border: '1px solid #007bff', cursor: 'pointer', fontSize: '0.9em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s ease, color 0.2s ease' };
     const assignDesignationsButtonHoverStyle = { backgroundColor: '#007bff', color: '#fff' };
    const editDetailsButtonStyle = { backgroundColor: '#ffc107', color: '#343a40', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.2s ease' };
    const editDetailsButtonHoverStyle = { backgroundColor: '#e0a800' };
    const approveOnboardingButtonStyle = { backgroundColor: '#28a745', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.2s ease' };
    const approveOnboardingButtonHoverStyle = { backgroundColor: '#218838' };
    const rejectApplicationButtonStyle = { backgroundColor: '#dc3545', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.2s ease' };
    const rejectApplicationButtonHoverStyle = { backgroundColor: '#c82333' };
    const editFormHeaderStyle = { fontSize: '1.5em', fontWeight: 'bold', color: '#333' };
    const editFormSectionTitleStyle = { fontSize: '1.3em', color: '#007bff', marginBottom: '15px', borderBottom: '1px solid #e9e9e9', paddingBottom: '8px', marginTop: '20px' };
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9em' };
    const fieldStyle = { width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '1em', boxSizing: 'border-box' };
    const selectStyle = { width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '1em', boxSizing: 'border-box', backgroundColor: '#fff' };
    const textareaStyle = { width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '1em', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' };
    const saveButtonEditStyle = { backgroundColor: '#2ecc71', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.2s ease', marginRight: '10px' };
    const cancelButtonEditStyle = { backgroundColor: '#6c757d', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', transition: 'background-color 0.2s ease' };
    const addEmployeeBtnStyle = { backgroundColor: '#2563EB', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' };


    const filteredEmployees = employees.filter(emp => emp.status === activeTab);

    if (loading) return <div style = { containerStyle } > Loading... </div>;
    if (error) return <div style = { containerStyle } > Error: { error } </div>;

    // --- JSX Return ---
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
        <div style={containerStyle}>
            <h1 style={headerStyle}>Employee Onboarding Worksheet</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Track and manage new employee onboarding process</p>
            <div style={tabsContainerStyle}>
                 <button style={activeTab === 'Awaiting' ? activeTabButtonStyle : tabButtonStyle} onClick={() => setActiveTab('Awaiting')}>Awaiting {employees.filter(emp => emp.status === 'Awaiting').length > 0 && <span style={{ marginLeft: '5px', padding: '3px 8px', backgroundColor: '#dc3545', borderRadius: '50%', color: '#fff', fontSize: '0.8em' }}>{employees.filter(emp => emp.status === 'Awaiting').length}</span>}</button>
                <button style={activeTab === 'Review' ? activeTabButtonStyle : tabButtonStyle} onClick={() => setActiveTab('Review')}>Review {employees.filter(emp => emp.status === 'Review').length > 0 && <span style={{ marginLeft: '5px', padding: '3px 8px', backgroundColor: '#17a2b8', borderRadius: '50%', color: '#fff', fontSize: '0.8em' }}>{employees.filter(emp => emp.status === 'Review').length}</span>}</button>
            </div>
            <div style={tableContainerStyle}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>{activeTab} Employees</h3>
                {activeTab === 'Awaiting' && (
                        <button style={addEmployeeBtnStyle} onClick={handleAddEmployeeClick}>Add Employee</button>
                    )}
                </div>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Employee</th>
                            <th style={thStyle}>Contact</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Location</th>
                            <th style={thStyle}>Join Date</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Designations</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr><td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: '20px' }}>No {activeTab.toLowerCase()} employees found.</td></tr>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td style={tdStyle}><div style={{ fontWeight: 'bold' }}>{`${employee.firstName} ${employee.lastName}`}</div><div style={{ fontSize: '0.8em', color: '#777' }}>{employee.gender}</div></td>
                                    <td style={tdStyle}>{employee.personalNumber}</td>
                                    <td style={tdStyle}>{employee.personalEmail}</td>
                                    <td style={tdStyle}>{`${employee.city}, ${getDisplayName('state', employee.state, employee.country)}, ${getDisplayName('country', employee.country)}`}</td>
                                    <td style={tdStyle}>{employee.dateOfJoin}</td>
                                    <td style={tdStyle}>
                                        <span style={{ ...statusBadgeStyle, ...(employee.status === 'Awaiting' ? awaitingStatusStyle : reviewStatusStyle) }}>
                                            <span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span>{employee.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{employee.designations || 'No designations assigned'}</td>
                                    <td style={tdStyle}>
                                        <button style={actionButtonStyle} onClick={() => handleViewDetails(employee)}>&#128065;</button>
                                        <button style={actionButtonStyle} onClick={() => openConfirmationModal(employee, 'approve')}>&#10003;</button>
                                        <button style={actionButtonStyle} onClick={() => openConfirmationModal(employee, 'delete')}>&#10060;</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


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


            {/* --- Details Modal --- */}
            {selectedEmployee && showDetailsModal && (
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                    <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: '0' }}>
                        <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1em', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}>&larr; Back to Worksheet</button>
                    </Modal.Header>
                    <Modal.Body style={{ paddingTop: '0' }}>
                        <h5 style={detailsModalTitleStyle}>Employee Onboarding Details</h5>
                        <p style={detailsModalSubtitleStyle}>Submitted on {selectedEmployee.submittedOn || 'N/A'}<span style={{ ...statusBadgeStyle, ...awaitingStatusStyle, marginLeft: '10px' }}><span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span>{selectedEmployee.status || 'Awaiting'}</span></p>
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Personal Information</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Full Name</div><div style={detailValueStyle}>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Gender</div><div style={detailValueStyle}>{selectedEmployee.gender}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Date of Birth</div><div style={detailValueStyle}>{selectedEmployee.dateOfBirth}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Marital Status</div><div style={detailValueStyle}>{selectedEmployee.maritalStatus}</div></div></div>
                        </div>
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Contact Information</h6>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Personal Number</div><div style={detailValueStyle}>{selectedEmployee.personalNumber}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Alternative Number</div><div style={detailValueStyle}>{selectedEmployee.alternativeNumber || '-'}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Personal Mail</div><div style={detailValueStyle}>{selectedEmployee.personalEmail}</div><div style={detailLabelStyle}>Work Mail</div><div style={detailValueStyle}>{selectedEmployee.workEmail}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Date of Join</div><div style={detailValueStyle}>{selectedEmployee.dateOfJoin}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Password Status</div><div style={{ ...detailValueStyle, display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ fontSize: '16px' }}>&#128274;</span> {selectedEmployee.passwordStatus || 'Password Created'}</div></div></div>
                        </div>
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Address Information</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Country</div><div style={detailValueStyle}>{getDisplayName('country', selectedEmployee.country)}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>State</div><div style={detailValueStyle}>{getDisplayName('state', selectedEmployee.state, selectedEmployee.country)}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>City</div><div style={detailValueStyle}>{selectedEmployee.city}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Zipcode</div><div style={detailValueStyle}>{selectedEmployee.zipcode}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Full Address</div><div style={{ ...detailValueStyle, gridColumn: '1 / span 2' }}>{selectedEmployee.address}</div></div></div>
                        </div>
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Assigned Designations</h6>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={detailValueStyle}>{selectedEmployee.designations || 'No designations assigned'}</div><button style={assignDesignationsButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle, assignDesignationsButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle)} onClick={() => { setSelectedDesignations(selectedEmployee?.designations?.split(", ").filter(d => d !== '') || []); setShowDesignationModal(true); }}><span style={{ fontSize: '18px' }}>&#128100;</span> Assign Designations</button></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: 'none', paddingTop: '0', display: 'flex', justifyContent: 'center', gap: '20px' }}>
<button style={editDetailsButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, editDetailsButtonStyle, editDetailsButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, editDetailsButtonStyle)} onClick={handleEditDetails}>&#9998; Edit Details</button>                        
<button style={approveOnboardingButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle, approveOnboardingButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle)} onClick={() => handleApprove(selectedEmployee.id)}>&#10003; Approve Onboarding</button>
<button style={rejectApplicationButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle, rejectApplicationButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle)}onClick={() => handleDelete(selectedEmployee.id)}>&#10060; Reject Application</button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* --- NEW: Confirmation Modal --- */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {confirmAction} this employee?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {selectedEmployee && showEditForm && (
                <Modal show={showEditForm} onHide={handleCancelEdit} size="lg" centered>
                    <Modal.Header closeButton><Modal.Title style={editFormHeaderStyle}>Edit Employee Details</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSaveEditedDetails}>
                            <h3 style={editFormSectionTitleStyle}>Personal Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="firstName" style={labelStyle}>First Name <span style={{ color: 'red' }}>*</span></label><input type="text" id="firstName" name="firstName" value={editFormData.firstName || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div><div style={{ flex: 1 }}><label htmlFor="lastName" style={labelStyle}>Last Name <span style={{ color: 'red' }}>*</span></label><input type="text" id="lastName" name="lastName" value={editFormData.lastName || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="gender" style={labelStyle}>Gender <span style={{ color: 'red' }}>*</span></label><select id="gender" name="gender" value={editFormData.gender || ""} onChange={handleEditFormChange} required style={selectStyle}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div><div style={{ flex: 1 }}><label htmlFor="dateOfBirth" style={labelStyle}>Date of Birth <span style={{ color: 'red' }}>*</span></label><input type="date" id="dateOfBirth" name="dateOfBirth" value={editFormData.dateOfBirth || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Contact Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="personalNumber" style={labelStyle}>Personal Number <span style={{ color: 'red' }}>*</span></label><div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>+{personalNumberCountryCode}</span><input type="text" id="personalNumber" name="personalNumber" value={editFormData.personalNumber || ""} onChange={handleEditFormChange}  style={fieldStyle}/></div></div><div style={{ flex: 1 }}><label htmlFor="alternativeNumber" style={labelStyle}>Alternative Number</label><div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>+{alternativeNumberCountryCode}</span><input type="text" id="alternativeNumber" name="alternativeNumber" value={editFormData.alternativeNumber || ""} onChange={handleEditFormChange} style={fieldStyle}/></div></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="personalEmail" style={labelStyle}>Personal Mail <span style={{ color: 'red' }}>*</span></label><input type="email" id="personalEmail" name="personalEmail" value={editFormData.personalEmail || ""} onChange={handleEditFormChange}  style={fieldStyle}/></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="workEmail" style={labelStyle}>Work Mail <span style={{ color: 'red' }}>*</span></label><input type="email" id="workEmail" name="workEmail" value={editFormData.workEmail || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Address Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="address" style={labelStyle}>Address <span style={{ color: 'red' }}>*</span></label><textarea id="address" name="address" value={editFormData.address || ""} onChange={handleEditFormChange}  style={textareaStyle}/></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="country" style={labelStyle}>Country <span style={{ color: 'red' }}>*</span></label><select id="country" name="country" value={editFormData.country || ""} onChange={(e) => {handleEditFormChange(e); handleEditFormCountryChange(e);}}  style={selectStyle}><option value="">Select Country</option>{allCountries.map((country) => (<option key={country.isoCode} value={country.isoCode}>{country.name}</option>))}</select></div><div style={{ flex: 1 }}><label htmlFor="state" style={labelStyle}>State <span style={{ color: 'red' }}>*</span></label><select id="state" name="state" value={editFormData.state || ""} onChange={(e) => {handleEditFormChange(e); handleEditFormStateChange(e);}}  style={selectStyle}><option value="">Select State</option>{editFormStates.map((state) => (<option key={state.isoCode} value={state.isoCode}>{state.name}</option>))}</select></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="city" style={labelStyle}>City <span style={{ color: 'red' }}>*</span></label><select id="city" name="city" value={editFormData.city || ""} onChange={handleEditFormCityChange}  style={selectStyle}><option value="">Select City</option>{editFormCities.map((city) => (<option key={city.name} value={city.name}>{city.name}</option>))}</select></div><div style={{ flex: 1 }}><label htmlFor="zipcode" style={labelStyle}>Zipcode <span style={{ color: 'red' }}>*</span></label><input type="text" id="zipcode" name="zipcode" value={editFormData.zipcode || ""} onChange={handleEditFormChange}  style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Employment Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="dateOfJoin" style={labelStyle}>Date of Join <span style={{ color: 'red' }}>*</span></label><input type="date" id="dateOfJoin" name="dateOfJoin" value={editFormData.dateOfJoin || ""} onChange={handleEditFormChange}  style={fieldStyle}/></div></div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}><button type="submit" style={saveButtonEditStyle} onMouseEnter={(e) => (e.target.style.backgroundColor = '#27ae60')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#2ecc71')}>Save Changes</button><button type="button" onClick={handleCancelEdit} style={cancelButtonEditStyle} onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}>Cancel</button></div>
                        </form>
                    </Modal.Body>
                </Modal>
            )}

            <Modal show={showDesignationModal} onHide={handleCloseDesignationModal} size="md" centered>
                <Modal.Header closeButton><Modal.Title style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Assign Designations</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p style={{ marginBottom: '20px', color: '#555' }}>Assign designations to {selectedEmployee?.firstName} {selectedEmployee?.lastName}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {availableDesignations.map((designation) => (<div key={designation} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><input type="checkbox" id={designation} value={designation} checked={selectedDesignations.includes(designation)} onChange={() => handleDesignationChange(designation)} style={{ marginRight: '10px', width: '20px', height: '20px' }}/><label htmlFor={designation} style={{ fontSize: '1.1em', color: '#333', cursor: 'pointer' }}>{designation}</label></div>))}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none', paddingTop: '0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button style={{ backgroundColor: '#6c757d', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '10px', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')} onClick={handleCloseDesignationModal}>Cancel</button>
                    <button style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')} onClick={handleSaveDesignations}>Save Designations</button>
                </Modal.Footer>
            </Modal>
            
            {/* All other modals (Edit, Designations) remain unchanged */}
        </div>
        </div>
    );
};

export default EmployeeOnboardingWorkSheet;

