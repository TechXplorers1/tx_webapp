import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
// import txlogo from "../assets/txlogo.png";
import '../../styles/Dashboard/ClientDashboard.css';

const ClientDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Fixed Logo at Top-Left */}
      <div className="logo-container">
        {/* <img src={txlogo} alt="TechXplorers" className="logo" /> */}
        <h2 className="logo-heading">Client Dashboard</h2>
      </div>

      {/* Hamburger Icon Below Logo */}
      {!showSidebar && (
        <div className="hamburger-container" onClick={toggleSidebar}>
          <FaBars className="hamburger-icon" />
        </div>
      )}


      {/* Sidebar - Starts below the logo */}
      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-close" onClick={toggleSidebar}>
          <FaArrowLeft size={20} />
        </div>
        <h6>Dashboard</h6>

        <div className="plan-info-row">
          <div className="plan-box">
            <div>1 Month Plan</div>
            <div><strong>$000</strong></div>
          </div>
          <div className="vertical-divider"></div>
          <div className="plan-box">
            <div>Days Left</div>
            <div><strong>28</strong></div>
          </div>
        </div>
        <Button variant="success" className="renew-button">Renewal</Button>

        <div className="support-section">
          <div>Help & Support</div>
          <Button variant="info" className="logout-button" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center mb-4 mt-5">
            <Col md={8}>
              <div onClick={() => navigate('/AdminDashboard')} className="card-main">
                <div className="text-center">
                  <div>TODAY TOTAL APPLICATIONS</div>
                  <div className="card-number">16</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center g-4">
            <Col md={4}>
              <div className="card-secondary brown">Interviews Scheduled</div>
            </Col>
            <Col md={4}>
              <div className="card-secondary purple">Updated Resume & Job Portal File</div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ClientDashboard;