import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmployeeOnboardingWorkSheet = () => {

    const [employees, setEmployees] = useState([
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            gender: "Male",
            dateOfBirth: "1990-05-15",
            maritalStatus: "Single",
            personalNumber: "1234567890",
            alternativeNumber: "0987654321",
            personalMail: "john.doe@example.com",
            city: "New York",
            state: "NY",
            country: "USA",
            dateOfJoin: "2023-09-01",
            status: "Awaiting",
            designations: "No designations assigned",
            submittedOn: "2023-08-25 10:30 AM",
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            gender: "Female",
            dateOfBirth: "1985-12-20",
            maritalStatus: "Married",
            personalNumber: "9876543210",
            alternativeNumber: "0123456789",
            personalMail: "jane.smith@example.com",
            city: "Los Angeles",
            state: "CA",
            country: "USA",
            dateOfJoin: "2023-10-15",
            status: "Awaiting",
            designations: "No designations assigned",
            submittedOn: "2023-09-01 02:45 PM",
        },
        {
            id: 3,
            firstName: "Alice",
            lastName: "Johnson",
            gender: "Female",
            dateOfBirth: "1995-07-10",
            maritalStatus: "Single",
            personalNumber: "5555555555",
            alternativeNumber: "6666666666",
            personalMail: "alice.johnson@example.com",
            city: "Chicago",
            state: "IL",
            country: "USA",
            dateOfJoin: "2023-11-01",
            status: "Awaiting",
            designations: "No designations assigned",
            submittedOn: "2023-09-10 09:15 AM",
        },
    ]);
    // Inline styles to replicate the design from the image
    const pageContainerStyle = {
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#f0f2f5', // Light gray background for the entire page
        minHeight: '100vh',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
    };

    const headerBoxStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: '30px 40px',
        marginBottom: '25px',
        width: '100%',
        maxWidth: '1300px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // For positioning the button
    };

    const headerTitleStyle = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '8px',
    };

    const headerDescriptionStyle = {
        fontSize: '16px',
        color: '#7f8c8d',
        marginBottom: '25px',
    };

    const backButtonContainerStyle = {
        position: 'absolute',
        top: '30px',
        right: '40px',
    };

    const backButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#e7f0fa',
        color: '#3498db',
        border: '1px solid #c9e1f8',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
    };

    const backButtonHoverStyle = {
        backgroundColor: '#d5e4f5',
        borderColor: '#b2d4f2',
    };

    const tabsContainerStyle = {
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
    };

    const tabStyle = {
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        color: "#555",
    };

    const activeTabStyle = {
        backgroundColor: "#007bff",
        color: "#fff",
    };

    const tabCountStyle = {
        marginLeft: "5px",
        fontSize: "14px",
        fontWeight: "500",
    };

    // const activeTabCountStyle = {
    //   backgroundColor: "#fff",
    //   color: "#007bff",
    // };

    const tableContainerStyle = {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        padding: "30px",
        width: "100%",
        maxWidth: "1300px",
        overflowX: "auto",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
    };

    const tableHeaderCellStyle = {
        padding: "12px",
        textAlign: "left",
        backgroundColor: "#f0f2f5",
        color: "#555",
        borderBottom: "1px solid #ccc",
    };
    const tableRowStyle = {
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
    };

    const tableRowHoverStyle = {
        backgroundColor: "#f9f9f9",
    };

    const tableDataCellStyle = {
        padding: "12px",
        borderBottom: "1px solid #ddd",
    };

    const statusBadgeStyle = {
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
    };

    const awaitingStatusStyle = {
        backgroundColor: "#ffc107",
        color: "#000",
    };

    const reviewStatusStyle = {
        backgroundColor: "#28a745",
        color: "#fff",
    };

    const actionIconStyle = {
        fontSize: '18px',
        color: '#7f8c8d',
        cursor: 'pointer',
        marginRight: '15px',
        transition: 'color 0.2s ease',
    };

    const actionIconHoverStyle = {
        color: '#3498db',
    };

    // Styles for the Details Modal
    const detailsModalTitleStyle = {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '10px',
    };

    const detailsModalSubtitleStyle = {
        fontSize: '14px',
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: '20px',
    };

    const detailsSectionStyle = {
        marginBottom: '25px',
    };

    const detailsSectionTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#34495e',
        borderBottom: '1px solid #ecf0f1',
        paddingBottom: '8px',
        marginBottom: '15px',
    };

    const detailRowStyle = {
        display: 'flex',
        marginBottom: '10px',
    };


    const sectionTitleStyle = {
        color: '#34495e',
        fontSize: '22px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px',
        marginBottom: '25px',
        marginTop: '35px',
        fontWeight: '600',
    };
    const detailLabelStyle = {
        flex: '0 0 150px', // Fixed width for labels
        fontWeight: '500',
        color: '#555',
        fontSize: '15px',
    };

    const detailValueStyle = {
        flex: '1',
        color: '#333',
        fontSize: '15px',
    };

    const assignDesignationsButtonStyle = {
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    };

    const assignDesignationsButtonHoverStyle = {
        backgroundColor: '#2980b9',
    };

    const modalFooterButtonStyle = {
        padding: '12px 25px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        border: 'none',
        cursor: 'pointer',
    };

    const editDetailsButtonStyle = {
        backgroundColor: '#e67e22',
        color: '#fff',
        ...modalFooterButtonStyle,
    };

    const editDetailsButtonHoverStyle = {
        backgroundColor: '#d35400',
        transform: 'translateY(-2px)',
    };

    const approveOnboardingButtonStyle = {
        backgroundColor: '#2ecc71',
        color: '#fff',
        ...modalFooterButtonStyle,
    };

    const approveOnboardingButtonHoverStyle = {
        backgroundColor: '#27ad60',
        transform: 'translateY(-2px)',
    };

    const rejectApplicationButtonStyle = {
        backgroundColor: '#e74c3c',
        color: '#fff',
        ...modalFooterButtonStyle,
    };

    const rejectApplicationButtonHoverStyle = {
        backgroundColor: '#c0392b',
        transform: 'translateY(-2px)',
    };

    // Styles for the Edit Form
    const editFormContainerStyle = {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '35px',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        background: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: '#333',
    };

    const editFormHeaderStyle = {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600',
    };

    const editFormSectionTitleStyle = {
        color: '#34495e',
        fontSize: '22px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px',
        marginBottom: '25px',
        marginTop: '35px',
        fontWeight: '600',
    };

    const fieldStyle = {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #dcdcdc',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '15px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    };

    const fieldFocusStyle = {
        borderColor: '#3498db',
        boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
        outline: 'none',
    };

    const selectFieldStyle = {
        ...fieldStyle,
        appearance: 'none', // Remove default arrow
        backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 15px center',
        backgroundSize: '12px',
        paddingRight: '35px',
    };

    const textareaFieldStyle = {
        ...fieldStyle,
        resize: 'vertical',
        minHeight: '90px',
    };

    const saveButtonEditStyle = {
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        padding: '13px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '17px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        width: 'auto',
        marginTop: '30px',
        marginRight: '15px',
    };

    const labelStyle = {
        fontSize: '15px',
        fontWeight: '500',
        color: '#555',
        marginBottom: '8px',
        display: 'block',
    };

    const selectStyle = {
        ...fieldStyle,
        height: '44px',
    };
    const textareaStyle = {
        ...fieldStyle,
        minHeight: '80px',
    };

    const cancelButtonEditStyle = {
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        padding: '13px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '17px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        width: 'auto',
        marginTop: '30px',
    };


    // Styles for Assign Designations Modal
    const designationModalBodyStyle = {
        padding: '20px 30px',
    };

    const designationCheckboxStyle = {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
    };

    const designationInputCheckboxStyle = {
        marginRight: '10px',
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    };

    const designationLabelStyle = {
        fontSize: '16px',
        color: '#333',
        fontWeight: 'normal',
        cursor: 'pointer',
    };

    const designationsList = [
        'Admin',
        'Job Application Specialist',
        'Manager',
        'Asset Manager',
        'Team Lead',
        'HR Associate',
        'Software Engineer',
        'QA Engineer',
        'Product Manager',
        'UX Designer'
    ];





    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAssignDesignationsModal, setShowAssignDesignationsModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [selectedDesignations, setSelectedDesignations] = useState([]);
    const [editFormData, setEditFormData] = useState({});
    const [designationsFormData, setDesignationsFormData] = useState([]); // Array to store selected designations

    const [allCountries, setAllCountries] = useState([]);
    const [editFormStates, setEditFormStates] = useState([]);
    const [editFormCities, setEditFormCities] = useState([]);


    const [awaitingEmployees, setAwaitingEmployees] = useState(employees || []);
    const [reviewEmployees, setReviewEmployees] = useState([]);

    const [activeTab, setActiveTab] = useState("Awaiting");

    const [personalNumberCountryCode, setPersonalNumberCountryCode] = useState('');
    const [alternativeNumberCountryCode, setAlternativeNumberCountryCode] = useState('');
    const filteredEmployees = employees.filter((emp) => emp.status === activeTab);


    const availableDesignations = [
        "No designations assigned",
        "Admin",
        "Job Application Specialist",
        "Manager",
        "Asset Manager",
        "Team Lead",
    ];

    useEffect(() => {
        setAllCountries(allCountries);
    }, []);

    useEffect(() => {
        if (selectedEmployee && showEditForm) {
            // Pre-fill the edit form with the selected employee's details
            setEditFormData({
                firstName: selectedEmployee.firstName || "",
                lastName: selectedEmployee.lastName || "",
                gender: selectedEmployee.gender || "",
                dateOfBirth: selectedEmployee.dateOfBirth || "",
                maritalStatus: selectedEmployee.maritalStatus || "",
                personalNumber: selectedEmployee.personalNumber || "",
                alternativeNumber: selectedEmployee.alternativeNumber || "",
                personalMail: selectedEmployee.personalMail || "",
                address: selectedEmployee.address || "",
                country: selectedEmployee.country || "",
                state: selectedEmployee.state || "",
                city: selectedEmployee.city || "",
                zipcode: selectedEmployee.zipcode || "",
                dateOfJoin: selectedEmployee.dateOfJoin || "",
            });

            // Set the country code and populate states
            const selectedCountry = allCountries.find(
                (country) => country.isoCode === selectedEmployee.country
            );
            if (selectedCountry) {
                setPersonalNumberCountryCode(selectedCountry.phonecode);
                setAlternativeNumberCountryCode(selectedCountry.phonecode);

                // Populate states based on the selected country
                const states = State.getStatesOfCountry(selectedEmployee.country);
                setEditFormStates(states);

                // Populate cities based on the selected state
                const selectedState = states.find(
                    (state) => state.isoCode === selectedEmployee.state
                );
                if (selectedState) {
                    const cities = City.getCitiesOfState(
                        selectedEmployee.country,
                        selectedEmployee.state
                    );
                    setEditFormCities(cities);
                } else {
                    setEditFormCities([]);
                }
            } else {
                setEditFormStates([]);
                setEditFormCities([]);
            }
        }
    }, [selectedEmployee, showEditForm]);


    // Function to handle designation assignment
    const handleAssignDesignations = () => {
        if (!selectedEmployee) {
            console.error("No employee selected");
            return;
        }
        setSelectedDesignations(selectedEmployee?.designations?.split(", ") || []);
        setShowDesignationModal(true);
    };

    // Function to save selected designations
    const saveDesignations = () => {
        const updatedEmployee = {
            ...selectedEmployee,
            designations: selectedDesignations,
        };
        setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === updatedEmployee.id ? updatedEmployee : employee
            )
        );
        setShowDesignationModal(false);
    };

    const handleCloseDesignationModal = () => {
        setSelectedDesignations([]);
        setShowDesignationModal(false);
    };


    const handleDesignationChange = (designation) => {
        setSelectedDesignations((prev) =>
            prev.includes(designation)
                ? prev.filter((d) => d !== designation)
                : [...prev, designation]
        );
    };

    const handleSaveDesignations = () => {
        // Update the selected employee's designations
        const updatedEmployee = {
            ...selectedEmployee,
            designations: selectedDesignations.join(", "), // Convert array to comma-separated string
        };

        // Update the correct state based on the active tab
        if (activeTab === "Awaiting") {
            setAwaitingEmployees((prev) =>
                prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
        } else if (activeTab === "Review") {
            setReviewEmployees((prev) =>
                prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
        }

        // Close the modal
        setSelectedDesignations([]);
        setShowDesignationModal(false);

        // Optionally, show a success message
        console.log("Designations saved successfully!");
    };


    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailsModal(true);
        // setShowEditForm(false);
    };

    const handleEditDetails = () => {
        // Pre-fill the edit form with the selected employee's details
        setEditFormData({
            firstName: selectedEmployee.firstName || "",
            lastName: selectedEmployee.lastName || "",
            gender: selectedEmployee.gender || "",
            dateOfBirth: selectedEmployee.dateOfBirth || "",
            maritalStatus: selectedEmployee.maritalStatus || "",
            personalNumber: selectedEmployee.personalNumber || "",
            alternativeNumber: selectedEmployee.alternativeNumber || "",
            personalMail: selectedEmployee.personalMail || "",
            address: selectedEmployee.address || "",
            country: selectedEmployee.country || "",
            state: selectedEmployee.state || "",
            city: selectedEmployee.city || "",
            zipcode: selectedEmployee.zipcode || "",
            dateOfJoin: selectedEmployee.dateOfJoin || "",
        });

        // Set the states and cities based on the selected country
        const selectedCountry = allCountries.find(
            (country) => country.isoCode === selectedEmployee.country
        );
        if (selectedCountry) {
            setPersonalNumberCountryCode(selectedCountry.phonecode);
            setAlternativeNumberCountryCode(selectedCountry.phonecode);

            const selectedState = State.getStatesOfCountry(selectedEmployee.country).find(
                (state) => state.isoCode === selectedEmployee.state
            );
            if (selectedState) {
                setEditFormStates(State.getStatesOfCountry(selectedEmployee.country));
                setEditFormCities(City.getCitiesOfState(selectedEmployee.country, selectedEmployee.state));
            } else {
                setEditFormStates(State.getStatesOfCountry(selectedEmployee.country));
                setEditFormCities([]);
            }
        } else {
            setEditFormStates([]);
            setEditFormCities([]);
        }

        setShowDetailsModal(false);
        setShowEditForm(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditFormCountryChange = (e) => {
        const countryIsoCode = e.target.value;
        const selectedCountry = allCountries.find(c => c.isoCode === countryIsoCode);
        setEditFormData((prev) => ({ ...prev, country: countryIsoCode, state: '', city: '' }));
        if (selectedCountry) {
            setPersonalNumberCountryCode(selectedCountry.phonecode);
            setAlternativeNumberCountryCode(selectedCountry.phonecode);
        } else {
            setPersonalNumberCountryCode('');
            setAlternativeNumberCountryCode('');
        }
        setEditFormStates(selectedCountry ? (selectedCountry.states || []) : []);
        setEditFormCities([]);
    };

    const handleEditFormStateChange = (e) => {
        const stateCode = e.target.value;
        setEditFormData((prev) => ({ ...prev, state: stateCode, city: '' }));
        const countryObj = allCountries.find(c => c.isoCode === editFormData.country);
        if (countryObj) {
            const stateObj = countryObj.states.find(s => s.isoCode === stateCode);
            setEditFormCities(stateObj ? (stateObj.cities || []) : []);
        } else {
            setEditFormCities([]);
        }
    };

    const handleEditFormCityChange = (e) => {
        setEditFormData((prev) => ({ ...prev, city: e.target.value }));
    };

    const updateEmployee = (updatedEmployee) => {
        // Assuming `employees` is the state holding all employees
        setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === updatedEmployee.id ? updatedEmployee : employee
            )
        );
    };

    const handleSaveEditedDetails = (e) => {
        e.preventDefault();
        setEmployees(prevEmployees =>
            prevEmployees.map(emp =>
                emp.id === selectedEmployee.id ? { ...emp, ...editFormData } : emp
            )
        );
        setSelectedEmployee({ ...selectedEmployee, ...editFormData });
        setShowEditForm(false);
        setShowDetailsModal(true);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setShowDetailsModal(true);
    };

    const getDisplayName = (type, code, countryCode = selectedEmployee?.country) => {
        if (!code) return '-';
        if (type === 'country') {
            return allCountries.find(c => c.isoCode === code)?.name || code;
        }
        if (type === 'state') {
            const countryObj = allCountries.find(c => c.isoCode === countryCode);
            return countryObj?.states.find(s => s.isoCode === code)?.name || code;
        }
        return code;
    };



    const handleApprove = (employeeId) => {
        // Find the employee to approve
        const employeeToApprove = awaitingEmployees.find(
            (emp) => emp.id === employeeId
        );

        if (employeeToApprove) {
            // Remove the employee from the awaiting list
            const updatedAwaitingEmployees = awaitingEmployees.filter(
                (emp) => emp.id !== employeeId
            );

            // Add the employee to the review list with updated status
            const updatedEmployee = { ...employeeToApprove, status: "Review" };
            setAwaitingEmployees(updatedAwaitingEmployees);
            setReviewEmployees((prevReviewEmployees) => [
                ...prevReviewEmployees,
                updatedEmployee,
            ]);
        }
    };





    return (
        <div style={pageContainerStyle}>
            {/* Header Box */}
            <div style={headerBoxStyle}>
                <div style={backButtonContainerStyle}>

                </div>
                <h1 style={headerTitleStyle}>Employee Onboarding Worksheet</h1>
                <p style={headerDescriptionStyle}>Track and manage new employee onboarding process</p>

                {/* Tabs */}
                <div style={tabsContainerStyle}>
                    <div
                        style={{
                            ...tabStyle,
                            ...(activeTab === "Awaiting" && activeTabStyle),
                        }}
                        onClick={() => setActiveTab("Awaiting")}
                    >
                        Awaiting{" "}
                        <span style={{ marginLeft: "5px", color: "#555" }}>
                            {awaitingEmployees.length}
                        </span>
                    </div>
                    <div
                        style={{
                            ...tabStyle,
                            ...(activeTab === "Review" && activeTabStyle),
                        }}
                        onClick={() => setActiveTab("Review")}
                    >
                        Review{" "}
                        <span style={{ marginLeft: "5px", color: "#555" }}>
                            {reviewEmployees.length}
                        </span>
                    </div>
                </div>
            </div>

            {activeTab === "Awaiting" && (
                <div style={tableContainerStyle}>
                    <h2 style={sectionTitleStyle}>Awaiting Employees</h2>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderCellStyle}>Employee</th>
                                <th style={tableHeaderCellStyle}>Contact</th>
                                <th style={tableHeaderCellStyle}>Email</th>
                                <th style={tableHeaderCellStyle}>Location</th>
                                <th style={tableHeaderCellStyle}>Join Date</th>
                                <th style={tableHeaderCellStyle}>Status</th>
                                <th style={tableHeaderCellStyle}>Designations</th>
                                <th style={tableHeaderCellStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {awaitingEmployees
                                .map((employee) => (
                                    <tr key={employee.id}>
                                        <td style={tableDataCellStyle}>
                                            <div style={{ fontWeight: "bold" }}>
                                                {employee.firstName} {employee.lastName}
                                            </div>
                                            <div style={{ color: "#555", fontSize: "13px" }}>
                                                {employee.gender}
                                            </div>
                                        </td>
                                        <td style={tableDataCellStyle}>{employee.personalNumber}</td>
                                        <td style={tableDataCellStyle}>{employee.personalMail}</td>
                                        <td style={tableDataCellStyle}>
                                            {`${employee.city}, ${employee.state}`}
                                        </td>
                                        <td style={tableDataCellStyle}>{employee.dateOfJoin}</td>
                                        <td style={tableDataCellStyle}>
                                            <span
                                                style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    backgroundColor:
                                                        employee.status === "Awaiting"
                                                            ? "#ffcc00"
                                                            : employee.status === "In Review"
                                                                ? "#2196f3"
                                                                : "#4caf50",
                                                    color: "#fff",
                                                }}
                                            >
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td style={tableDataCellStyle}>
                                            {employee.designations || "No designations assigned"}
                                        </td>
                                        <td style={tableDataCellStyle}>
                                            {/* View Details Button */}
                                            <span
                                                style={actionIconStyle}
                                                onMouseEnter={(e) =>
                                                    Object.assign(e.target.style, actionIconHoverStyle)
                                                }
                                                onMouseLeave={(e) =>
                                                    Object.assign(e.target.style, actionIconStyle)
                                                }
                                                title="View Details"
                                                onClick={() => handleViewDetails(employee)}
                                            >
                                                &#128065;
                                            </span>

                                            {/* Approve Button */}
                                            <span
                                                style={actionIconStyle}
                                                onMouseEnter={(e) =>
                                                    Object.assign(e.target.style, actionIconHoverStyle)
                                                }
                                                onMouseLeave={(e) =>
                                                    Object.assign(e.target.style, actionIconStyle)
                                                }
                                                title="Approve"
                                                onClick={() => handleApprove(employee.id)}
                                            >
                                                &#10003;
                                            </span>

                                            {/* Reject Button */}
                                            <span
                                                style={actionIconStyle}
                                                onMouseEnter={(e) =>
                                                    Object.assign(e.target.style, actionIconHoverStyle)
                                                }
                                                onMouseLeave={(e) =>
                                                    Object.assign(e.target.style, actionIconStyle)
                                                }
                                                title="Reject"
                                            >
                                                &#10060;
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === "Review" && (
                <div style={tableContainerStyle}>
                    <h2 style={sectionTitleStyle}>Review Employees</h2>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderCellStyle}>Employee</th>
                                <th style={tableHeaderCellStyle}>Contact</th>
                                <th style={tableHeaderCellStyle}>Email</th>
                                <th style={tableHeaderCellStyle}>Location</th>
                                <th style={tableHeaderCellStyle}>Join Date</th>
                                <th style={tableHeaderCellStyle}>Status</th>
                                <th style={tableHeaderCellStyle}>Designations</th>
                                <th style={tableHeaderCellStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    style={tableRowStyle}
                                    onMouseEnter={(e) =>
                                        Object.assign(e.currentTarget.style, tableRowStyle, tableRowHoverStyle)
                                    }
                                    onMouseLeave={(e) =>
                                        Object.assign(e.currentTarget.style, tableRowStyle)
                                    }
                                >
                                    <td style={tableDataCellStyle}>
                                        <div style={{ fontWeight: "bold" }}>
                                            {employee.firstName} {employee.lastName}
                                        </div>
                                        <div style={{ color: "#555", fontSize: "13px" }}>
                                            {employee.gender}
                                        </div>
                                    </td>
                                    <td style={tableDataCellStyle}>{employee.personalNumber}</td>
                                    <td style={tableDataCellStyle}>{employee.personalMail}</td>
                                    <td style={tableDataCellStyle}>
                                        {`${employee.city}, ${getDisplayName(
                                            "state",
                                            employee.state,
                                            employee.country
                                        )}`}
                                    </td>
                                    <td style={tableDataCellStyle}>{employee.dateOfJoin}</td>
                                    <td style={tableDataCellStyle}>
                                        <span style={{ ...statusBadgeStyle, ...reviewStatusStyle }}>
                                            <span style={{ fontSize: "18px", lineHeight: "1", marginRight: "4px" }}>
                                                &#x25CF;
                                            </span>
                                            {employee.status || "Review"}
                                        </span>
                                    </td>
                                    <td style={tableDataCellStyle}>
                                        {employee.designations || "No designations assigned"}
                                    </td>
                                    <td style={tableDataCellStyle}>
                                        <span
                                            style={actionIconStyle}
                                            onMouseEnter={(e) =>
                                                Object.assign(e.target.style, actionIconHoverStyle)
                                            }
                                            onMouseLeave={(e) =>
                                                Object.assign(e.target.style, actionIconStyle)
                                            }
                                            title="Edit"
                                            onClick={() => {
                                                setSelectedEmployee(employee);
                                                setShowEditForm(true);
                                            }}
                                        >
                                            📝
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Employee Details Modal */}
            {selectedEmployee && showDetailsModal && (
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                    <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: '0' }}>
                    </Modal.Header>
                    <Modal.Body style={{ paddingTop: '0' }}>
                        <h5 style={detailsModalTitleStyle}>Employee Onboarding Details</h5>
                        <p style={detailsModalSubtitleStyle}>Submitted on {selectedEmployee.submittedOn || 'N/A'}
                            <span style={{ ...statusBadgeStyle, ...awaitingStatusStyle, marginLeft: '10px' }}>
                                <span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span>
                                {selectedEmployee.status || 'Awaiting'}
                            </span>
                        </p>

                        {/* Personal Information */}
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Personal Information</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Full Name</div>
                                    <div style={detailValueStyle}>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Gender</div>
                                    <div style={detailValueStyle}>{selectedEmployee.gender}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Date of Birth</div>
                                    <div style={detailValueStyle}>{selectedEmployee.dateOfBirth}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Marital Status</div>
                                    <div style={detailValueStyle}>{selectedEmployee.maritalStatus}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Contact Information</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Personal Number</div>
                                    <div style={detailValueStyle}>{selectedEmployee.personalNumber}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Alternative Number</div>
                                    <div style={detailValueStyle}>{selectedEmployee.alternativeNumber || '-'}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Personal Mail</div>
                                    <div style={detailValueStyle}>{selectedEmployee.personalMail}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Date of Join</div>
                                    <div style={detailValueStyle}>{selectedEmployee.dateOfJoin}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Password Status</div>
                                    <div style={{ ...detailValueStyle, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '16px' }}>&#128274;</span> {selectedEmployee.passwordStatus || 'Not Created'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Address Information</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Country</div>
                                    <div style={detailValueStyle}>{getDisplayName('country', selectedEmployee.country)}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>State</div>
                                    <div style={detailValueStyle}>{getDisplayName('state', selectedEmployee.state, selectedEmployee.country)}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>City</div>
                                    <div style={detailValueStyle}>{selectedEmployee.city}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Zipcode</div>
                                    <div style={detailValueStyle}>{selectedEmployee.zipcode}</div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={detailLabelStyle}>Full Address</div>
                                    <div style={{ ...detailValueStyle, gridColumn: '1 / span 2' }}>{selectedEmployee.address}</div>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Designations */}
                        <div style={detailsSectionStyle}>
                            <h6 style={detailsSectionTitleStyle}>Assigned Designations</h6>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={detailValueStyle}>{selectedEmployee.designations || 'No designations assigned'}</div>
                                <button
                                    style={assignDesignationsButtonStyle}
                                    onMouseEnter={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle, assignDesignationsButtonHoverStyle)}
                                    onMouseLeave={(e) => Object.assign(e.target.style, assignDesignationsButtonStyle)}
                                    onClick={() => {
                                        setSelectedDesignations(selectedEmployee?.designations?.split(", ") || []);
                                        setShowDesignationModal(true);
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>&#128100;</span> Assign Designations
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: 'none', paddingTop: '0', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <button
                            style={editDetailsButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, editDetailsButtonStyle, editDetailsButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, editDetailsButtonStyle)}
                            onClick={handleEditDetails}
                        >
                            &#9998; Edit Details
                        </button>
                        <button
                            style={approveOnboardingButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle, approveOnboardingButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, approveOnboardingButtonStyle)}
                            onClick={() => handleApprove(selectedEmployee.id)}
                        >
                            &#10003; Approve Onboarding
                        </button>
                        <button
                            style={rejectApplicationButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle, rejectApplicationButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.target.style, rejectApplicationButtonStyle)}
                        >
                            &#10060; Reject Application
                        </button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Employee Edit Form Modal */}
            {selectedEmployee && showEditForm && (
                <Modal show={showEditForm} onHide={handleCancelEdit} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={editFormHeaderStyle}>Edit Employee Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSaveEditedDetails}>
                            {/* Personal Information */}
                            <h3 style={editFormSectionTitleStyle}>Personal Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="firstName" style={labelStyle}>
                                        First Name <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={editFormData.firstName || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="lastName" style={labelStyle}>
                                        Last Name <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={editFormData.lastName || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="gender" style={labelStyle}>
                                        Gender <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={editFormData.gender || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="dateOfBirth" style={labelStyle}>
                                        Date of Birth <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={editFormData.dateOfBirth || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <h3 style={editFormSectionTitleStyle}>Contact Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="personalNumber" style={labelStyle}>
                                        Personal Number <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '10px' }}>
                                            +{personalNumberCountryCode}
                                        </span>
                                        <input
                                            type="text"
                                            id="personalNumber"
                                            name="personalNumber"
                                            value={editFormData.personalNumber || ""}
                                            onChange={handleEditFormChange}
                                            required
                                            style={fieldStyle}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="alternativeNumber" style={labelStyle}>
                                        Alternative Number
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '10px' }}>
                                            +{alternativeNumberCountryCode}
                                        </span>
                                        <input
                                            type="text"
                                            id="alternativeNumber"
                                            name="alternativeNumber"
                                            value={editFormData.alternativeNumber || ""}
                                            onChange={handleEditFormChange}
                                            style={fieldStyle}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="personalMail" style={labelStyle}>
                                        Personal Mail <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="personalMail"
                                        name="personalMail"
                                        value={editFormData.personalMail || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <h3 style={editFormSectionTitleStyle}>Address Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="address" style={labelStyle}>
                                        Address <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={editFormData.address || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={textareaStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="country" style={labelStyle}>
                                        Country <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={editFormData.country || ""}
                                        onChange={(e) => {
                                            handleEditFormChange(e);
                                            handleEditFormCountryChange(e);
                                        }}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Select Country</option>
                                        {allCountries.map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="state" style={labelStyle}>
                                        State <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="state"
                                        name="state"
                                        value={editFormData.state || ""}
                                        onChange={(e) => {
                                            handleEditFormChange(e);
                                            handleEditFormStateChange(e);
                                        }}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Select State</option>
                                        {editFormStates.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="city" style={labelStyle}>
                                        City <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={editFormData.city || ""}
                                        onChange={handleEditFormCityChange}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Select City</option>
                                        {editFormCities.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="zipcode" style={labelStyle}>
                                        Zipcode <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="zipcode"
                                        name="zipcode"
                                        value={editFormData.zipcode || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>

                            {/* Employment Information */}
                            <h3 style={editFormSectionTitleStyle}>Employment Information</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="dateOfJoin" style={labelStyle}>
                                        Date of Join <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfJoin"
                                        name="dateOfJoin"
                                        value={editFormData.dateOfJoin || ""}
                                        onChange={handleEditFormChange}
                                        required
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>

                            {/* Save and Cancel Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                <button
                                    type="submit"
                                    style={saveButtonEditStyle}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#27ae60')}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#2ecc71')}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    style={cancelButtonEditStyle}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>



            )}

            <Modal
                show={showDesignationModal}
                onHide={() => setShowDesignationModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Assign Designations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Assign designations to {selectedEmployee?.firstName}</p>
                    <div>
                        {availableDesignations.map((designation) => (
                            <div key={designation} style={{ marginBottom: '8px' }}>
                                <input
                                    type="checkbox"
                                    id={designation}
                                    value={designation}
                                    checked={selectedDesignations.includes(designation)}
                                    onChange={(e) => handleDesignationChange(designation)}
                                />
                                <label htmlFor={designation} style={{ marginLeft: '8px' }}>
                                    {designation}
                                </label>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        style={{
                            backgroundColor: '#6c757d',
                            color: '#fff',
                            padding: '12px 25px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                        onClick={handleCloseDesignationModal}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            backgroundColor: '#2980b9',
                            color: '#fff',
                            padding: '12px 25px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={handleSaveDesignations}
                    >
                        Save Designations
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeOnboardingWorkSheet;