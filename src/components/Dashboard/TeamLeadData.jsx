import React, { useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard/TeamLeadData.css';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import {
  FaUserCircle,
  FaBars,
  FaArrowLeft,
  FaArrowUp,
} from 'react-icons/fa';

const TeamLeadData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [promotionConfirmationOpen, setPromotionConfirmationOpen] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(null);
  const [promotionIndex, setPromotionIndex] = useState(null);
  const [isActivating, setIsActivating] = useState(false);

  const [teamLeads, setTeamLeads] = useState([
    { firstname: 'humer', lastname: 'r', mobile: '+91 9874561230', email: 'siva@gmail.com', password: '07072023@TxRm', role: 'Team Lead', isActive: true },
    { firstname: 'chaveen', lastname: 'reddy', mobile: '+91 9874561230', email: 'arjun@gmail.com', password: '07072023@TxRm', role: 'Team Lead', isActive: true },
    { firstname: 'sandeep', lastname: 'kumar', mobile: '+91 9874561230', email: 'satish@gmail.com', password: '07072023@TxRm', role: 'Team Lead', isActive: true },
  ]);

  const [newTeamLead, setNewTeamLead] = useState({
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    password: '',
    role: 'Team Lead',
    isActive: true,
  });

  const [currentTeamLeadIndex, setCurrentTeamLeadIndex] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => navigate('/');
  const goToDashboard = () => navigate('/AdminDashboard');
  const goToManagers = () => navigate('/managers');
  const goToTeamLeads = () => navigate('/teamleads');
  const goToEmployees = () => navigate('/employees');
  const goToClients = () => navigate('/clients');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentTeamLeadIndex(null);
    setNewTeamLead({
      firstname: '',
      lastname: '',
      mobile: '',
      email: '',
      password: '',
      role: 'Team Lead',
      isActive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeamLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeamLead = () => {
    const { firstname, lastname, mobile, email, password } = newTeamLead;
    if (!firstname || !lastname || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    const updated = [...teamLeads];
    if (isEditing) {
      updated[currentTeamLeadIndex] = newTeamLead;
    } else {
      updated.push({ ...newTeamLead, isActive: true });
    }

    setTeamLeads(updated);
    handleCloseModal();
  };

  const handleToggleStatus = (index) => {
    const teamLead = teamLeads[index];
    setToggleIndex(index);
    setIsActivating(!teamLead.isActive);
    setConfirmationOpen(true);
  };

  const updateStatus = (index, status) => {
    const updated = [...teamLeads];
    updated[index].isActive = status;
    setTeamLeads(updated);
    setConfirmationOpen(false);
    setToggleIndex(null);
  };

  const handlePromoteTeamLead = (index) => {
    setPromotionIndex(index);
    setPromotionConfirmationOpen(true);
  };

  const promoteToManager = (index) => {
    const teamLeadToPromote = teamLeads[index];
    const existingManagers = JSON.parse(localStorage.getItem('managers')) || [];
    const newManager = {
      ...teamLeadToPromote,
      role: 'Manager',
      isActive: true,
      promotedFrom: 'Team Lead'
    };
    const updatedManagers = [...existingManagers, newManager];
    localStorage.setItem('managers', JSON.stringify(updatedManagers));

    const updatedTeamLeads = [...teamLeads];
    updatedTeamLeads[index].isActive = false;
    setTeamLeads(updatedTeamLeads);

    setPromotionConfirmationOpen(false);
    setPromotionIndex(null);
  };

  return (
    <div className="teamlead-dashboard">
      <div className="teamlead-header">
        <h2 className="logo-heading">TeamLead Data</h2>
      </div>

      <div className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars size={24} />
      </div>

      <div className={`teamlead-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaArrowLeft size={20} />
          </div>
          <FaUserCircle size={50} className="user-icon" />
        </div>

        <ul className="sidebar-menu">
          <li onClick={goToDashboard}>Dashboard</li>
          <li onClick={goToClients}>Clients</li>
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
          <Button variant="success" onClick={handleShowModal}>+ Add TeamLead</Button>
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
              <th>PROMOTE</th>
            </tr>
          </thead>
          <tbody>
            {teamLeads
              .filter((t) =>
                [t.firstname, t.lastname, t.email, t.mobile].some((field) =>
                  field.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((teamlead, index) => (
                <tr key={index} className="table-warning">
                  <td>{teamlead.firstname}</td>
                  <td>{teamlead.lastname}</td>
                  <td>{teamlead.mobile}</td>
                  <td>{teamlead.email}</td>
                  <td>{teamlead.password}</td>
                  <td>{teamlead.role}</td>
                  <td>
                    <Button
                      variant="link"
                      className="text-decoration-none"
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentTeamLeadIndex(index);
                        setNewTeamLead(teamlead);
                        setShowModal(true);
                      }}
                    >
                      ✏️
                    </Button>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">{teamlead.isActive ? 'Active' : 'Inactive'}</span>
                      <Form.Check
                        type="switch"
                        id={`active-switch-${index}`}
                        checked={teamlead.isActive}
                        onChange={() => handleToggleStatus(index)}
                      />
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handlePromoteTeamLead(index)}
                      disabled={!teamlead.isActive}
                      title="Promote to Manager"
                    >
                      <FaArrowUp /> Promote
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit TeamLead' : 'Add TeamLead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstname" value={newTeamLead.firstname} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastname" value={newTeamLead.lastname} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newTeamLead.mobile} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newTeamLead.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newTeamLead.password} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" name="role" value={newTeamLead.role} disabled />
            </Form.Group>

            <Button variant="primary" onClick={handleAddTeamLead}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modals */}
      <Modal show={confirmationOpen} onHide={() => setConfirmationOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isActivating ? 'Activate' : 'Deactivate'} Team Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this team lead?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => updateStatus(toggleIndex, isActivating)}>
            Yes, {isActivating ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={promotionConfirmationOpen} onHide={() => setPromotionConfirmationOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Promote to Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to promote this Team Lead to Manager?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPromotionConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => promoteToManager(promotionIndex)}>
            Yes, Promote
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamLeadData;
