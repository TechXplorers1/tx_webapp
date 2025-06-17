import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import '../../styles/Dashboard/AdminDashboard.css';
import {
  FaUserCircle,
  FaBars,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientsDropdownOpen, setClientsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleClientsDropdown = () => setClientsDropdownOpen(!clientsDropdownOpen);

   const handleLogout = () => {
    // You can also clear any session or token here if needed
    navigate('/'); // ← Redirects to the root or login route
  };

  const goToManagers = () => {
    navigate('/managers');
  };

   const goToClients = () => {
    navigate('/clients');
  };
   const goToEmployees = () => {
    navigate('/employees');
  };
    const goToTeamLeads = () => {
    navigate('/teamleads');
  };

  
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h2 className="logo-heading">Admin Dashboard</h2>
      </div>

      {/* Hamburger just below the logo */}
      <div className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars size={24} />
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaArrowLeft size={20} />
          </div>
          <FaUserCircle size={50} className="user-icon" />
        </div>

        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li onClick={goToClients}>
            <span>Clients</span>
            {/* {clientsDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />} */}
          </li>
          {/* {clientsDropdownOpen && (
            <ul className="sub-menu">
              <li>Registrations</li>
              <li>Active Clients</li>
              <li>Previous Clients</li>
              <li>Rejected Clients</li>
            </ul>
          )} */}
          <li onClick={goToManagers}>Managers</li>
          <li onClick={goToTeamLeads}>Team Leads</li>
          <li onClick={goToEmployees}>Employees</li>
        </ul>

        <div className="sidebar-footer">
          <p>Help & Support</p>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <Container>
          <Row className="card-row">
            <Col md={6}>
              <div className="admin-card green"
                 onClick={goToClients}
                style={{ cursor: 'pointer' }}
              >
                <p>Clients</p>
                <h4>96</h4>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="admin-card cyan"
                onClick={goToManagers}
                style={{ cursor: 'pointer' }}
              >
                <p>Managers</p>
                <h4>05</h4>
              </div>
            </Col>
          </Row>
          <Row className="card-row">
            <Col md={6}>
              <div className="admin-card navy"
                onClick={goToTeamLeads}
                style={{ cursor: 'pointer' }}
              >
                <p>Team Leads</p>
                <h4>05</h4>
              </div>
            </Col>
            <Col md={6}>
              <div className="admin-card blue"
               onClick={goToEmployees}
                style={{ cursor: 'pointer' }}
              >
                <p>Employees</p>
                <h4>30</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
