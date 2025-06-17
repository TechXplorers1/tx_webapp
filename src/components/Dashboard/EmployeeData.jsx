import React, { useState } from 'react';
import { Container, Row, Col, Modal, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard/EmployeeData.css';
import { FaUserCircle, FaBars, FaArrowLeft } from 'react-icons/fa';

const EmployeeData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [employeeToToggle, setEmployeeToToggle] = useState(null);
  const [isActivating, setIsActivating] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: '',
    active: true,
  });

  const [employees, setEmployees] = useState([
    { firstName: 'Humer', lastName: 'R', mobile: '+91 9874561230', email: 'humermployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Chaveen', lastName: 'Reddy', mobile: '+91 9874561230', email: 'chaveenemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Bharath', lastName: 'Surya', mobile: '+91 9874561230', email: 'bharathemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Sandeep', lastName: 'Kumar', mobile: '+91 9874561230', email: 'sandeepemployee@gmail.com', password: '07072023@TxRm', role: 'Employee', active: true },
    { firstName: 'Neelam', lastName: 'Sai Krishna', mobile: '+91 9874561230', email: 'saiemployee@gmail.com', password: '07072023@TxRm', role: 'Intern', active: true },
  ]);

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => navigate('/');
  const goToDashboard = () => navigate('/AdminDashboard');
  const goToManagers = () => navigate('/managers');
  const goToClients = () => navigate('/clients');
  const goToEmployees = () => navigate('/employees');
  const goToTeamLeads = () => navigate('/teamleads');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentEmployeeIndex(null);
    setNewEmployee({ firstName: '', lastName: '', mobile: '', email: '', password: '', role: '', active: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = () => {
    const { firstName, lastName, mobile, email, password } = newEmployee;
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    if (isEditing) {
      const updatedEmployees = [...employees];
      updatedEmployees[currentEmployeeIndex] = newEmployee;
      setEmployees(updatedEmployees);
    } else {
      setEmployees([...employees, { ...newEmployee }]);
    }

    handleCloseModal();
  };

  const toggleActivation = (index) => {
    const employee = employees[index];
    setEmployeeToToggle(index);

    if (employee.active) {
      setIsActivating(false);
      setConfirmationOpen(true);
    } else {
      setIsActivating(true);
      setConfirmationOpen(true);
    }
  };

  const confirmToggle = () => {
    if (employeeToToggle !== null) {
      const updatedEmployees = [...employees];
      updatedEmployees[employeeToToggle].active = !updatedEmployees[employeeToToggle].active;
      setEmployees(updatedEmployees);
      setConfirmationOpen(false);
      setEmployeeToToggle(null);
    }
  };

  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        <h2 className="logo-heading">Employees Data</h2>
      </div>

      <div className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars size={24} />
      </div>

      <div className={`employee-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaArrowLeft size={20} />
          </div>
          <FaUserCircle size={50} className="user-icon" />
        </div>

        <ul className="sidebar-menu">
          <li onClick={goToDashboard}>Dashboard</li>
          <li onClick={goToClients}><span>Clients</span></li>
          <li onClick={goToManagers}>Managers</li>
          <li onClick={goToTeamLeads}>Team Leads</li>
          <li onClick={goToEmployees}>Employees</li>
        </ul>

        <div className="sidebar-footer">
          <p>Help & Support</p>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <InputGroup className="w-50">
            <Form.Control
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="info">Search</Button>
          </InputGroup>

          <Button variant="success" onClick={handleShowModal}>+ Add Employee</Button>
        </div>

        <Table striped bordered hover responsive className="text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>MOBILE</th>
              <th>EMAIL</th>
              <th>PASSWORD</th>
              <th>ROLE</th>
              <th>EDIT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter((employee) =>
                [employee.firstName, employee.lastName, employee.email, employee.mobile]
                  .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((employee, index) => (
                <tr key={index} className="table-warning">
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.email}</td>
                  <td>{employee.password}</td>
                  <td>{employee.role}</td>
                  <td>
                    <Button
                      variant="link"
                      className="text-decoration-none"
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentEmployeeIndex(index);
                        setNewEmployee(employee);
                        setShowModal(true);
                      }}
                    >
                      ✏️
                    </Button>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">{employee.active ? 'Active' : 'Inactive'}</span>
                      <Form.Check
                        type="switch"
                        id={`active-switch-${index}`}
                        checked={employee.active}
                        onChange={() => toggleActivation(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Add/Edit Employee */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={newEmployee.firstName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={newEmployee.lastName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newEmployee.mobile} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newEmployee.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newEmployee.password} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={newEmployee.role} onChange={handleInputChange}>
                <option value="Employee">Employee</option>
                <option value="Intern">Intern</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeData;
