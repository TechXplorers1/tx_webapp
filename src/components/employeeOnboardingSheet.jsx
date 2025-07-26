import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Country, State, City } from 'country-state-city';

const EmployeeOnboardingWorkSheet = () => {
    // Hardcoded data to be used as a fallback if local storage is empty
    const initialEmployees = [
        { id: 1, firstName: 'John', lastName: 'Doe', gender: 'Male', dateOfBirth: '1990-05-15', personalNumber: '1234567890', alternativeNumber: '', personalMail: 'john.doe@example.com', dateOfJoin: '2023-09-01', country: 'US', state: 'NY', city: 'New York', zipcode: '10001', address: '123 Main St', submittedOn: '2025-06-26 at 12:31:22 PM', status: 'Awaiting', designations: '', maritalStatus: 'Married' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', gender: 'Female', dateOfBirth: '1988-11-22', personalNumber: '9876543210', alternativeNumber: '9988776655', personalMail: 'jane.smith@example.com', dateOfJoin: '2023-10-15', country: 'US', state: 'CA', city: 'Los Angeles', zipcode: '90001', address: '456 Oak Ave', submittedOn: '2025-06-26 at 12:31:22 PM', status: 'Awaiting', designations: '', maritalStatus: 'Married' },
        { id: 3, firstName: 'Alice', lastName: 'Johnson', gender: 'Female', dateOfBirth: '1992-03-10', personalNumber: '5555555555', alternativeNumber: '', personalMail: 'alice.johnson@example.com', dateOfJoin: '2023-11-01', country: 'US', state: 'IL', city: 'Chicago', zipcode: '60601', address: '789 Pine Ln', submittedOn: '2025-06-26 at 12:31:22 PM', status: 'Awaiting', designations: '', maritalStatus: 'Married' },
    ];

    // NEW: Initialize state from local storage or use fallback data
    const [employees, setEmployees] = useState(() => {
        try {
            const savedEmployees = localStorage.getItem('employees');
            if (savedEmployees) {
                return JSON.parse(savedEmployees);
            }
        } catch (error) {
            console.error("Failed to parse employees from local storage", error);
        }
        return initialEmployees;
    });

    const [activeTab, setActiveTab] = useState('Awaiting');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [selectedDesignations, setSelectedDesignations] = useState([]);

    const allCountries = Country.getAllCountries();
    const [editFormStates, setEditFormStates] = useState([]);
    const [editFormCities, setEditFormCities] = useState([]);
    
    const personalNumberCountryCode = 91;
    const alternativeNumberCountryCode = 91;

    const availableDesignations = ['Admin', 'Job Application Specialist', 'Manager', 'Asset Manager', 'Team Lead'];

    // NEW: Effect to save employees to local storage whenever the list changes
    useEffect(() => {
        try {
            localStorage.setItem('employees', JSON.stringify(employees));
        } catch (error) {
            console.error("Failed to save employees to local storage", error);
        }
    }, [employees]);
    
    // NEW: Effect to listen for storage changes from other tabs/windows
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
                personalMail: selectedEmployee.personalMail, dateOfJoin: selectedEmployee.dateOfJoin,
                country: selectedEmployee.country, state: selectedEmployee.state, city: selectedEmployee.city,
                zipcode: selectedEmployee.zipcode, address: selectedEmployee.address,
            });
            const states = State.getStatesOfCountry(selectedEmployee.country);
            setEditFormStates(states);
            const cities = City.getCitiesOfState(selectedEmployee.country, selectedEmployee.state);
            setEditFormCities(cities);
        }
    }, [selectedEmployee]);

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailsModal(true);
    };

    const handleEditDetails = () => {
        setShowDetailsModal(false);
        setShowEditForm(true);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setSelectedEmployee(null);
        setEditFormData({});
    };

    const handleSaveEditedDetails = (e) => {
        e.preventDefault();
        // The useEffect hook will automatically save the updated list to local storage
        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id ? { ...emp, ...editFormData } : emp
        ));
        setShowEditForm(false);
        setSelectedEmployee(null);
        setEditFormData({});
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

    const handleDesignationChange = (designation) => {
        setSelectedDesignations(prevSelected =>
            prevSelected.includes(designation)
                ? prevSelected.filter(d => d !== designation)
                : [...prevSelected, designation]
        );
    };

    const handleSaveDesignations = () => {
        // The useEffect hook will automatically save the updated list to local storage
        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id
                ? { ...emp, designations: selectedDesignations.join(', ') }
                : emp
        ));
        setShowDesignationModal(false);
        setSelectedEmployee(prev => ({ ...prev, designations: selectedDesignations.join(', ') }));
    };

    const handleCloseDesignationModal = () => setShowDesignationModal(false);

    const handleApprove = (employeeId) => {
        // The useEffect hook will automatically save the updated list to local storage
        setEmployees(employees.map(emp =>
            emp.id === employeeId ? { ...emp, status: 'Review' } : emp
        ));
        setShowDetailsModal(false);
        setSelectedEmployee(null);
    };

    const filteredEmployees = employees.filter(emp => emp.status === activeTab);

    // --- All existing styles are preserved below ---
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

    return (
        <div style={containerStyle}>
            {/* --- All JSX and rendering logic remains unchanged --- */}
            <h1 style={headerStyle}>Employee Onboarding Worksheet</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Track and manage new employee onboarding process</p>
            <div style={tabsContainerStyle}>
                <button style={activeTab === 'Awaiting' ? activeTabButtonStyle : tabButtonStyle} onClick={() => setActiveTab('Awaiting')}>Awaiting {employees.filter(emp => emp.status === 'Awaiting').length > 0 && <span style={{ marginLeft: '5px', padding: '3px 8px', backgroundColor: '#dc3545', borderRadius: '50%', color: '#fff', fontSize: '0.8em' }}>{employees.filter(emp => emp.status === 'Awaiting').length}</span>}</button>
                <button style={activeTab === 'Review' ? activeTabButtonStyle : tabButtonStyle} onClick={() => setActiveTab('Review')}>Review {employees.filter(emp => emp.status === 'Review').length > 0 && <span style={{ marginLeft: '5px', padding: '3px 8px', backgroundColor: '#17a2b8', borderRadius: '50%', color: '#fff', fontSize: '0.8em' }}>{employees.filter(emp => emp.status === 'Review').length}</span>}</button>
            </div>
            <div style={tableContainerStyle}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>{activeTab} Employees</h3>
                <table style={tableStyle}>
                    <thead><tr><th style={thStyle}>Employee</th><th style={thStyle}>Contact</th><th style={thStyle}>Email</th><th style={thStyle}>Location</th><th style={thStyle}>Join Date</th><th style={thStyle}>Status</th><th style={thStyle}>Designations</th><th style={thStyle}>Actions</th></tr></thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (<tr><td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: '20px' }}>No {activeTab.toLowerCase()} employees found.</td></tr>) : (
                            filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td style={tdStyle}><div style={{ fontWeight: 'bold' }}>{`${employee.firstName} ${employee.lastName}`}</div><div style={{ fontSize: '0.8em', color: '#777' }}>{employee.gender}</div></td>
                                    <td style={tdStyle}>{employee.personalNumber}</td><td style={tdStyle}>{employee.personalMail}</td>
                                    <td style={tdStyle}>{`${employee.city}, ${employee.state ? getDisplayName('state', employee.state, employee.country) : ''}, ${employee.country ? getDisplayName('country', employee.country) : ''}`}</td>
                                    <td style={tdStyle}>{employee.dateOfJoin}</td>
                                    <td style={tdStyle}><span style={{ ...statusBadgeStyle, ...(employee.status === 'Awaiting' ? awaitingStatusStyle : reviewStatusStyle) }}><span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span>{employee.status}</span></td>
                                    <td style={tdStyle}>{employee.designations || 'No designations assigned'}</td>
                                    <td style={tdStyle}>
                                        <button style={actionButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, actionButtonStyle, actionButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, actionButtonStyle)} onClick={() => handleViewDetails(employee)}>&#128065;</button>
                                        <button style={actionButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, actionButtonStyle, actionButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, actionButtonStyle)} onClick={() => handleApprove(employee.id)}>&#10003;</button>
                                        <button style={actionButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, actionButtonStyle, actionButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, actionButtonStyle)}>&#10060;</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedEmployee && showDetailsModal && (
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                    <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: '0' }}><button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1em', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}>&larr; Back to Worksheet</button></Modal.Header>
                    <Modal.Body style={{ paddingTop: '0' }}>
                        <h5 style={detailsModalTitleStyle}>Employee Onboarding Details</h5>
                        <p style={detailsModalSubtitleStyle}>Submitted on {selectedEmployee.submittedOn || 'N/A'}<span style={{ ...statusBadgeStyle, ...awaitingStatusStyle, marginLeft: '10px' }}><span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span>{selectedEmployee.status || 'Awaiting'}</span></p>
                        <div style={detailsSectionStyle}><h6 style={detailsSectionTitleStyle}>Personal Information</h6><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Full Name</div><div style={detailValueStyle}>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Gender</div><div style={detailValueStyle}>{selectedEmployee.gender}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Date of Birth</div><div style={detailValueStyle}>{selectedEmployee.dateOfBirth}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Marital Status</div><div style={detailValueStyle}>{selectedEmployee.maritalStatus}</div></div></div></div>
                        <div style={detailsSectionStyle}><h6 style={detailsSectionTitleStyle}>Contact Information</h6><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Personal Number</div><div style={detailValueStyle}>{selectedEmployee.personalNumber}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Alternative Number</div><div style={detailValueStyle}>{selectedEmployee.alternativeNumber || '-'}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Personal Mail</div><div style={detailValueStyle}>{selectedEmployee.personalMail}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Date of Join</div><div style={detailValueStyle}>{selectedEmployee.dateOfJoin}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Password Status</div><div style={{ ...detailValueStyle, display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ fontSize: '16px' }}>&#128274;</span> {selectedEmployee.passwordStatus || 'Password Created'}</div></div></div></div>
                        <div style={detailsSectionStyle}><h6 style={detailsSectionTitleStyle}>Address Information</h6><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Country</div><div style={detailValueStyle}>{getDisplayName('country', selectedEmployee.country)}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>State</div><div style={detailValueStyle}>{getDisplayName('state', selectedEmployee.state, selectedEmployee.country)}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>City</div><div style={detailValueStyle}>{selectedEmployee.city}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Zipcode</div><div style={detailValueStyle}>{selectedEmployee.zipcode}</div></div><div style={{ marginBottom: '10px' }}><div style={detailLabelStyle}>Full Address</div><div style={{ ...detailValueStyle, gridColumn: '1 / span 2' }}>{selectedEmployee.address}</div></div></div></div>
                        <div style={detailsSectionStyle}><h6 style={detailsSectionTitleStyle}>Assigned Designations</h6><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={detailValueStyle}>{selectedEmployee.designations || 'No designations assigned'}</div><button style={assignDesignationsButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle, assignDesignationsButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle)} onClick={() => { setSelectedDesignations(selectedEmployee?.designations?.split(", ").filter(d => d !== '') || []); setShowDesignationModal(true); }}><span style={{ fontSize: '18px' }}>&#128100;</span> Assign Designations</button></div></div>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: 'none', paddingTop: '0', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <button style={editDetailsButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, editDetailsButtonStyle, editDetailsButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, editDetailsButtonStyle)} onClick={handleEditDetails}>&#9998; Edit Details</button>
                        <button style={approveOnboardingButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle, approveOnboardingButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle)} onClick={() => handleApprove(selectedEmployee.id)}>&#10003; Approve Onboarding</button>
                        <button style={rejectApplicationButtonStyle} onMouseEnter={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle, rejectApplicationButtonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle)}>&#10060; Reject Application</button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedEmployee && showEditForm && (
                <Modal show={showEditForm} onHide={handleCancelEdit} size="lg" centered>
                    <Modal.Header closeButton><Modal.Title style={editFormHeaderStyle}>Edit Employee Details</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSaveEditedDetails}>
                            <h3 style={editFormSectionTitleStyle}>Personal Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="firstName" style={labelStyle}>First Name <span style={{ color: 'red' }}>*</span></label><input type="text" id="firstName" name="firstName" value={editFormData.firstName || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div><div style={{ flex: 1 }}><label htmlFor="lastName" style={labelStyle}>Last Name <span style={{ color: 'red' }}>*</span></label><input type="text" id="lastName" name="lastName" value={editFormData.lastName || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="gender" style={labelStyle}>Gender <span style={{ color: 'red' }}>*</span></label><select id="gender" name="gender" value={editFormData.gender || ""} onChange={handleEditFormChange} required style={selectStyle}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div><div style={{ flex: 1 }}><label htmlFor="dateOfBirth" style={labelStyle}>Date of Birth <span style={{ color: 'red' }}>*</span></label><input type="date" id="dateOfBirth" name="dateOfBirth" value={editFormData.dateOfBirth || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Contact Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="personalNumber" style={labelStyle}>Personal Number <span style={{ color: 'red' }}>*</span></label><div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>+{personalNumberCountryCode}</span><input type="text" id="personalNumber" name="personalNumber" value={editFormData.personalNumber || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div><div style={{ flex: 1 }}><label htmlFor="alternativeNumber" style={labelStyle}>Alternative Number</label><div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>+{alternativeNumberCountryCode}</span><input type="text" id="alternativeNumber" name="alternativeNumber" value={editFormData.alternativeNumber || ""} onChange={handleEditFormChange} style={fieldStyle}/></div></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="personalMail" style={labelStyle}>Personal Mail <span style={{ color: 'red' }}>*</span></label><input type="email" id="personalMail" name="personalMail" value={editFormData.personalMail || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Address Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="address" style={labelStyle}>Address <span style={{ color: 'red' }}>*</span></label><textarea id="address" name="address" value={editFormData.address || ""} onChange={handleEditFormChange} required style={textareaStyle}/></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="country" style={labelStyle}>Country <span style={{ color: 'red' }}>*</span></label><select id="country" name="country" value={editFormData.country || ""} onChange={(e) => {handleEditFormChange(e); handleEditFormCountryChange(e);}} required style={selectStyle}><option value="">Select Country</option>{allCountries.map((country) => (<option key={country.isoCode} value={country.isoCode}>{country.name}</option>))}</select></div><div style={{ flex: 1 }}><label htmlFor="state" style={labelStyle}>State <span style={{ color: 'red' }}>*</span></label><select id="state" name="state" value={editFormData.state || ""} onChange={(e) => {handleEditFormChange(e); handleEditFormStateChange(e);}} required style={selectStyle}><option value="">Select State</option>{editFormStates.map((state) => (<option key={state.isoCode} value={state.isoCode}>{state.name}</option>))}</select></div></div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="city" style={labelStyle}>City <span style={{ color: 'red' }}>*</span></label><select id="city" name="city" value={editFormData.city || ""} onChange={handleEditFormCityChange} required style={selectStyle}><option value="">Select City</option>{editFormCities.map((city) => (<option key={city.name} value={city.name}>{city.name}</option>))}</select></div><div style={{ flex: 1 }}><label htmlFor="zipcode" style={labelStyle}>Zipcode <span style={{ color: 'red' }}>*</span></label><input type="text" id="zipcode" name="zipcode" value={editFormData.zipcode || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
                            <h3 style={editFormSectionTitleStyle}>Employment Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}><div style={{ flex: 1 }}><label htmlFor="dateOfJoin" style={labelStyle}>Date of Join <span style={{ color: 'red' }}>*</span></label><input type="date" id="dateOfJoin" name="dateOfJoin" value={editFormData.dateOfJoin || ""} onChange={handleEditFormChange} required style={fieldStyle}/></div></div>
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
        </div>
    );
};

export default EmployeeOnboardingWorkSheet;
