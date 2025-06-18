import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement, // Required for Donut/Pie charts
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaUsers, FaUserTie, FaUserCog, FaUserFriends, FaBell, FaSearch, FaBars } from 'react-icons/fa'; // Icons from react-icons
import { CgProfile } from 'react-icons/cg'; // For the profile icon (more generic)

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null); // State for tracking hovered card
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false); // State for Client Details modal
  const [clientFilter, setClientFilter] = useState('registered'); // Initial state: 'registered'

  // State to hold the selected manager for each client in the modal's dropdowns
  const [selectedManagerPerClient, setSelectedManagerPerClient] = useState({});

  // --- Client Data as State (Ensured consistent lowercase status values) ---
  const [clients, setClients] = useState([
    // Each client now has a 'status' (primary) and 'displayStatuses' array
    // Registered Clients (4 entries)
    { id: 1, name: 'John Doe', mobile: '9876543210', email: 'john@example.com', jobsApplyFor: 'Data Science', registeredDate: '2025-05-01', country: 'USA', visaStatus: 'Citizen (U.S.)', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 7, name: 'Michael White', mobile: '2233445566', email: 'michael@example.com', jobsApplyFor: 'UX Designer', registeredDate: '2025-05-12', country: 'USA', visaStatus: 'Green Card', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 13, name: 'Mia Davis', mobile: '5551112222', email: 'mia.d@example.com', jobsApplyFor: 'InnovateX Lead', registeredDate: '2025-05-19', country: 'Germany', visaStatus: 'Work Permit', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },
    { id: 15, name: 'Ethan Hunt', mobile: '9988776655', email: 'ethan.h@example.com', jobsApplyFor: 'Security Analyst', registeredDate: '2025-05-22', country: 'Canada', visaStatus: 'Citizen', status: 'registered', displayStatuses: ['registered'], assignedTo: null, manager: null },

    // Unassigned Clients (3 entries)
    { id: 3, name: 'Mcgregor', mobile: '7776543210', email: 'mcg@example.com', jobsApplyFor: 'Scrum Master', registeredDate: '2025-05-01', country: 'Australia', visaStatus: 'H-1B Visa', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },
    { id: 8, name: 'Sarah Wilson', mobile: '3344556677', email: 'sarah@example.com', jobsApplyFor: 'DevOps Engineer', registeredDate: '2025-05-15', country: 'France', visaStatus: 'Work Permit', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },
    { id: 10, name: 'Jack Taylor', mobile: '4445556666', email: 'jack.t@example.com', jobsApplyFor: 'Financial Analyst', registeredDate: '2025-05-25', country: 'UK', visaStatus: 'EU Citizen', status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null },

    // Active Clients (4 entries)
    { id: 2, name: 'Alice Brown', mobile: '7896543210', email: 'alice@example.com', jobsApplyFor: 'Cyber Security', registeredDate: '2025-05-03', country: 'UK', visaStatus: 'Green Card', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager B', manager: 'Manager B' },
    { id: 4, name: 'Jane Smith', mobile: '1234567890', email: 'jane@example.com', jobsApplyFor: 'Software Engineer', registeredDate: '2025-05-05', country: 'Canada', visaStatus: 'Work Permit', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager A', manager: 'Manager A' },
    { id: 9, name: 'David Lee', mobile: '4455667788', email: 'david@example.com', jobsApplyFor: 'AI/ML Engineer', registeredDate: '2025-05-18', country: 'Japan', visaStatus: 'Permanent Resident', status: 'active', displayStatuses: ['active'], assignedTo: 'Manager C', manager: 'Manager C' },
    { id: 12, name: 'Mike Green', mobile: '8876543210', email: 'mike@example.com', jobsApplyFor: 'Cyber Security', registeredDate: '2025-04-28', country: 'USA', visaStatus: 'L-1 Visa', status: 'active', displayStatuses: ['active'], assignedTo: 'Sarah Connor', manager: 'Sarah Connor' },

    // Rejected Clients (3 entries)
    { id: 5, name: 'Robert Johnson', mobile: '0987654321', email: 'robert@example.com', jobsApplyFor: 'Product Manager', registeredDate: '2025-04-20', country: 'Germany', visaStatus: 'Schengen Visa', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },
    { id: 11, name: 'Karen Hall', mobile: '6667778888', email: 'karen.h@example.com', jobsApplyFor: 'Graphic Designer', registeredDate: '2025-05-17', country: 'Australia', visaStatus: 'Working Holiday', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },
    { id: 14, name: 'Laura Martinez', mobile: '5566778899', email: 'laura@example.com', jobsApplyFor: 'Cloud Architect', registeredDate: '2025-05-20', country: 'Spain', visaStatus: 'Student Visa', status: 'rejected', displayStatuses: ['rejected'], assignedTo: null, manager: null },

    // Restored Clients (2 entries) - Note: Their status *is* 'restored', but they also display in 'registered'
    { id: 6, name: 'Emily Davis', mobile: '1122334455', email: 'emily@example.com', jobsApplyFor: 'Data Analyst', registeredDate: '2025-05-10', country: 'India', visaStatus: 'Citizen', status: 'restored', displayStatuses: ['restored'], assignedTo: 'Manager A', manager: null }, // Removed 'registered' from initial restored client displayStatuses to accurately test restore flow
    { id: 16, name: 'Chris Evans', mobile: '1122334455', email: 'chris.e@example.com', jobsApplyFor: 'Marketing Specialist', registeredDate: '2025-05-14', country: 'Brazil', visaStatus: 'Tourist Visa', status: 'restored', displayStatuses: ['restored'], assignedTo: 'Manager B', manager: null }, // Removed 'registered' from initial restored client displayStatuses
  ]);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleClientDetailsModal = () => setShowClientDetailsModal(!showClientDetailsModal);

  // Placeholders (consider replacing with actual assets if available)
  const logoPlaceholder = "https://placehold.co/40x40/0a193c/ffffff?text=TX";
  const profilePlaceholder = "https://placehold.co/40x40/E0E0E0/808080?text=👤";

  // Mock data for the Donut Chart, matching image values and colors
  const donutChartData = {
    labels: ['Team Leads', 'Employee', 'Clients', 'Manager'],
    datasets: [{
      data: [25, 250, 15, 11],
      backgroundColor: [
        '#FFC107',
        '#87CEEB',
        '#FF8C00',
        '#3CB371'
      ],
      hoverOffset: 8,
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  // Options for the Donut Chart
  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
            family: 'Segoe UI, sans-serif'
          }
        }
      }
    },
    cutout: '70%',
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked!`);
    if (cardType === 'clients') {
      setShowClientDetailsModal(true);
      setClientFilter('registered'); // Default to 'registered' when modal opens
    }
  };

  // --- Action Handlers that update state WITHOUT changing filter automatically ---
  const updateClientData = (clientId, updates) => { // Removed newFilterStatus param
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, ...updates }
          : client
      )
    );
    // clientFilter is NOT updated here, so the tab stays the same
  };

  const handleAcceptClient = (clientId) => {
    console.log(`Client ${clientId} Accepted! Moving to Unassigned.`);
    // Registered client accepted -> status becomes 'unassigned', displayStatuses updated
    updateClientData(clientId, { status: 'unassigned', displayStatuses: ['unassigned'], assignedTo: null, manager: null });
  };

  const handleDeclineClient = (clientId) => {
    console.log(`Client ${clientId} Declined! Staying on current table.`);
    // Declined client -> status becomes 'rejected', displayStatuses updated
    // The key change here: NO newFilterStatus is passed, so the filter doesn't change.
    updateClientData(clientId, { status: 'rejected', displayStatuses: ['rejected'] });
  };

  // Modified handleAssignClient to use selectedManagerPerClient
  const handleAssignClient = (clientId) => {
    const managerToAssign = selectedManagerPerClient[clientId];
    if (!managerToAssign) {
      alert("Please select a manager before assigning."); // Using alert for now, consider a custom modal
      return;
    }
    console.log(`Client ${clientId} assigned to ${managerToAssign}! Moving to Active.`);
    // Unassigned/Restored client assigned -> status becomes 'active'
    updateClientData(clientId, { status: 'active', displayStatuses: ['active'], assignedTo: managerToAssign, manager: managerToAssign });
    // Clear the selected manager for this client after assignment
    setSelectedManagerPerClient(prev => {
      const newState = { ...prev };
      delete newState[clientId];
      return newState;
    });
  };

  const handleRestoreClient = (clientId) => {
    console.log(`Client ${clientId} Restored! Showing in Restored Clients and Registered Clients.`);
    // Rejected client restored -> status becomes 'restored', and also added to 'registered' display list
    updateClientData(clientId, { status: 'restored', displayStatuses: ['restored', 'registered'], assignedTo: null, manager: null });
  };

  // Handler for dropdown change
  const handleManagerSelectChange = (clientId, managerName) => {
    setSelectedManagerPerClient(prev => ({
      ...prev,
      [clientId]: managerName,
    }));
  };

  // --- Helper to get client data value by header name (refined for robustness) ---
  const getClientValue = (client, header) => {
    let value;
    switch (header) {
      case 'Name': value = client.name; break;
      case 'Mobile': value = client.mobile; break;
      case 'Email': value = client.email; break;
      case 'Jobs Apply For': value = client.jobsApplyFor; break;
      case 'Registered Date': value = client.registeredDate; break;
      case 'Country': value = client.country; break;
      case 'Visa Status': value = client.visaStatus; break;
      case 'Assign To': value = client.assignedTo; break;
      case 'Manager': value = client.manager; break;
      case 'Actions': return null; // Actions are rendered by renderActions, not directly from data
      default: value = null; // Fallback for unknown headers
    }
    // Return '-' for undefined, null, or empty string values
    return value !== undefined && value !== null && value !== '' ? value : '-';
  };

  // --- Table Configuration based on Client Filter ---
  const tableConfig = {
    registered: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          <button onClick={() => handleAcceptClient(client.id)} style={{ ...actionButtonStyle, background: '#28a745' }}>Accept</button>
          <button onClick={() => handleDeclineClient(client.id)} style={{ ...actionButtonStyle, background: '#dc3545' }}>Decline</button>
        </div>
      )
    },
    unassigned: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', alignItems: 'center' }}>
          <select
            style={{
              padding: '6px 8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '0.85em',
            }}
            value={selectedManagerPerClient[client.id] || ''} // Use value prop for controlled component
            onChange={(e) => handleManagerSelectChange(client.id, e.target.value)}
          >
            <option value="">Select Manager</option>
            <option value="Manager A">Manager A</option>
            <option value="Manager B">Manager B</option>
            <option value="Manager C">Manager C</option>
          </select>
          <button onClick={() => handleAssignClient(client.id)} style={{ ...actionButtonStyle, background: '#007bff' }}>Assign</button>
        </div>
      )
    },
    active: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Manager', 'Actions'],
      renderActions: (client) => (
        <span style={{ color: '#666', fontSize: '0.9em' }}>--</span> // No direct actions for active clients in image
      )
    },
    rejected: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Actions'],
      renderActions: (client) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          <button onClick={() => handleRestoreClient(client.id)} style={{ ...actionButtonStyle, background: '#28a745' }}>Restore</button>
        </div>
      )
    },
    restored: {
      headers: ['Name', 'Mobile', 'Email', 'Jobs Apply For', 'Registered Date', 'Country', 'Visa Status', 'Assign To', 'Actions'],
      renderActions: (client) => (
         <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', alignItems: 'center' }}>
          <select
            style={{
              padding: '6px 8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '0.85em',
            }}
            value={selectedManagerPerClient[client.id] || ''} // Use value prop for controlled component
            onChange={(e) => handleManagerSelectChange(client.id, e.target.value)}
          >
            <option value="">Select Manager</option>
            <option value="Manager A">Manager A</option>
            <option value="Manager B">Manager B</option>
            <option value="Manager C">Manager C</option>
          </select>
          <button onClick={() => handleAssignClient(client.id)} style={{ ...actionButtonStyle, background: '#007bff' }}>Assign</button>
        </div>
      )
    },
  };

  // Filter clients based on the clientFilter state - now checks displayStatuses
  const getFilteredClients = () => {
    return clients.filter(client => client.displayStatuses.includes(clientFilter));
  };

  const filteredClients = getFilteredClients();


  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        background: '#1B3370',
        color: 'white',
        padding: '10px 25px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        height: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%'
      }}>
        {/* Top Row: Logo & Company Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '5px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>TECHXPLORERS</span>
              <span style={{ fontSize: '10px', opacity: 0.8, marginTop: '0px', paddingLeft: '42px' }}>Exploring The Future</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Hamburger Menu, Search Bar, Notification, Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <FaBars />
          </button>

          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '25px',
            padding: '8px 18px',
            flexGrow: 1,
            maxWidth: '400px',
            margin: '0 20px'
          }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                paddingLeft: '5px'
              }}
            />
            <FaSearch style={{ color: '#ccc', marginLeft: '10px', fontSize: '16px' }} />
          </div>

          {/* Right side icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <FaBell style={{ fontSize: '20px', cursor: 'pointer' }} />
            <CgProfile style={{ fontSize: '30px', color: '#fff', cursor: 'pointer' }} />
          </div>
        </div>
      </header>

      {/* Main Content Area - Using CSS Grid */}
      <div style={{
        flexGrow: 1,
        padding: '25px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto 1fr',
        gap: '25px',
        maxWidth: '1300px',
        margin: '25px auto',
      }}>

        {/* Clients Card */}
        <div
          onMouseEnter={() => setHoveredCardId('clients')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleCardClick('clients')}
          style={{ ...cardStyle, ...(hoveredCardId === 'clients' ? cardHoverStyle : {}) }}
        >
          <h3 style={cardTitleStyle}>Clients</h3>
          <FaUsers style={cardIconStyle} />
        </div>

        {/* Manager Card */}
        <div
          onMouseEnter={() => setHoveredCardId('manager')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleCardClick('manager')}
          style={{ ...cardStyle, ...(hoveredCardId === 'manager' ? cardHoverStyle : {}) }}
        >
          <h3 style={cardTitleStyle}>Manager</h3>
          <FaUserTie style={cardIconStyle} />
        </div>

        {/* Team Leads Card */}
        <div
          onMouseEnter={() => setHoveredCardId('teamleads')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleCardClick('teamleads')}
          style={{ ...cardStyle, ...(hoveredCardId === 'teamleads' ? cardHoverStyle : {}) }}
        >
          <h3 style={cardTitleStyle}>Team Leads</h3>
          <FaUserCog style={cardIconStyle} />
        </div>

        {/* Employee Card */}
        <div
          onMouseEnter={() => setHoveredCardId('employee')}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => handleCardClick('employee')}
          style={{ ...cardStyle, ...(hoveredCardId === 'employee' ? cardHoverStyle : {}) }}
        >
          <h3 style={cardTitleStyle}>Employee</h3>
          <FaUserFriends style={cardIconStyle} />
        </div>

        {/* Chart Section */}
        <div style={{
          gridColumn: 'span 2',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>CHART</h3>
          <div style={{ width: '100%', maxWidth: '500px', height: '350px' }}>
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
        </div>

        {/* About Section */}
        <div style={{
          gridColumn: 'span 2',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '400px',
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>About</h3>
          <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '15px', fontSize: '1.0em' }}>
            Gravida Massa Quis Malesuada Porta Diam Ex Quam Dui Lacus
            Hendrerit Ultrices Sollicitudin. Faucibus Ut Varius In Non Sit Amet, Nec
            Lobortis, Sapien Viverra In.
          </p>
          <p style={{ lineHeight: '1.6', color: '#555', fontSize: '1.0em' }}>
            Tincidunt Eu Vitae Lorem. Dui Non Donec Sollicitudin, Leo. Dui Enim.
            Placerat. Morbi Viverra Faucibus Nec Fringilla Quam Maximus Vehicula,
            Varius Ac Nulla, Ac.
          </p>
        </div>
      </div>

      {/* Logout Button (bottom, centered) */}
      <div style={{ textAlign: 'center', padding: '20px 0 40px 0' }}>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)',
            transition: 'background-color 0.3s ease'
          }}
        >
          Log Out
        </button>
      </div>

      {/* Overlay for when menu is open */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1002,
          }}
        />
      )}
      {/* Sidebar - This slides in from the left */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: menuOpen ? '0' : '-250px',
        height: '100vh',
        width: '250px',
        background: '#fff',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
        zIndex: 1001,
        transition: 'left 0.3s ease',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h4 style={{color: '#333'}}>Menu Options</h4>
        <a href="#" style={menuLinkStyle}>Dashboard</a>
        <a href="#" style={menuLinkStyle}>Reports</a>
        <a href="#" style={menuLinkStyle}>Settings</a>
      </div>

      {/* Client Details Modal */}
      {showClientDetailsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleClientDetailsModal} style={modalCloseButtonStyle}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingRight: '60px' // Padding to prevent content from overlapping the close button
            }}>
              <h3 style={{
                margin: 0,
                color: '#1e293b',
                fontSize: '1.6rem',
                fontWeight: '700'
              }}>
                Client Details
              </h3>
            </div>

            {/* Custom Styled Radio Buttons for Client Filter (single line) */}
            <div style={{
              position: 'relative',
              display: 'flex',
              borderRadius: '0.5rem',
              backgroundColor: '#EEE',
              boxSizing: 'border-box',
              boxShadow: '0 0 0px 1px rgba(0, 0, 0, 0.06)',
              padding: '0.25rem',
              width: '100%',
              maxWidth: '900px',
              fontSize: '14px',
              margin: '0 auto 20px auto',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              justifyContent: 'center',
            }}>
              {[
                // Counts are dynamically calculated from the 'clients' state based on displayStatuses
                { label: 'Registered Clients', value: 'registered', count: clients.filter(c => c.displayStatuses.includes('registered')).length },
                { label: 'Unassigned Clients', value: 'unassigned', count: clients.filter(c => c.displayStatuses.includes('unassigned')).length },
                { label: 'Active Clients', value: 'active', count: clients.filter(c => c.displayStatuses.includes('active')).length },
                { label: 'Rejected Clients', value: 'rejected', count: clients.filter(c => c.displayStatuses.includes('rejected')).length },
                { label: 'Restore Clients', value: 'restored', count: clients.filter(c => c.displayStatuses.includes('restored')).length },
              ].map((option) => (
                <label
                  key={option.value}
                  style={{
                    flexShrink: 0,
                    flexGrow: 1,
                    textAlign: 'center',
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.5rem',
                    border: 'none',
                    padding: '.5rem 10px',
                    color: 'rgba(51, 65, 85, 1)',
                    transition: 'all .15s ease-in-out',
                    backgroundColor: clientFilter === option.value ? '#fff' : 'transparent',
                    fontWeight: clientFilter === option.value ? '600' : 'normal',
                    margin: '0 2px',
                  }}
                >
                  <input
                    type="radio"
                    name="client-filter"
                    value={option.value}
                    checked={clientFilter === option.value}
                    onChange={(e) => setClientFilter(e.target.value)} // Set filter ONLY on explicit radio button click
                    style={{ display: 'none' }}
                  />
                  <span style={{ whiteSpace: 'nowrap' }}>{option.label} ({option.count})</span>
                </label>
              ))}
            </div>

            {/* Client Table - Dynamically Filtered */}
            <h4 style={{
              marginBottom: '15px',
              marginTop: '0px',
              color: '#333',
              fontSize: '1.2rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {clientFilter === 'registered' && `Registered Clients`}
              {clientFilter === 'unassigned' && `Unassigned Clients`}
              {clientFilter === 'active' && `Active Clients`}
              {clientFilter === 'rejected' && `Rejected Clients`}
              {clientFilter === 'restored' && `Restored Clients`} ({filteredClients.length})
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={modalTableStyle}>
                <thead>
                  <tr>
                    {tableConfig[clientFilter].headers.map(header => (
                      <th key={header} style={{...modalTableHeaderStyle,
                        borderTopLeftRadius: header === tableConfig[clientFilter].headers[0] ? '8px' : '0',
                        borderTopRightRadius: header === tableConfig[clientFilter].headers[tableConfig[clientFilter].headers.length - 1] ? '8px' : '0',
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client, index) => (
                      <tr key={client.id} style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff2f7',
                        ...modalTableRowStyle,
                      }}>
                        {tableConfig[clientFilter].headers.map((header, colIndex) => (
                          <td
                            key={`${client.id}-${header}`} // Unique key for cells
                            style={{
                              ...modalTableCellStyle,
                              // Apply border radius to the first/last cell of the first/last row
                              borderTopLeftRadius: (colIndex === 0 && index === 0) ? '12px' : '0',
                              borderBottomLeftRadius: (colIndex === 0 && index === filteredClients.length - 1) ? '12px' : '0',
                              borderTopRightRadius: (colIndex === tableConfig[clientFilter].headers.length - 1 && index === 0) ? '12px' : '0',
                              borderBottomRightRadius: (colIndex === tableConfig[clientFilter].headers.length - 1 && index === filteredClients.length - 1) ? '12px' : '0',
                            }}
                          >
                            {/* Render actions if header is 'Actions', otherwise get value from client data */}
                            {header === 'Actions' ? tableConfig[clientFilter].renderActions(client) : getClientValue(client, header)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableConfig[clientFilter].headers.length} style={{...modalTableCellStyle, textAlign: 'center', color: '#666'}}>
                        No {clientFilter} clients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Inline Styles ---
const cardStyle = {
  background: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  padding: '25px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '180px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  paddingBottom: '15px',
};

const cardHoverStyle = {
  transform: 'translateY(-5px)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
};

const cardTitleStyle = {
  fontSize: '1.6em',
  fontWeight: 'bold',
  marginBottom: 'auto',
  color: '#333'
};

const cardIconStyle = {
  fontSize: '2.5em',
  color: '#6c757d',
  alignSelf: 'flex-end',
  marginTop: '15px',
};

const menuLinkStyle = {
  color: '#333',
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#f0f0f0'
  }
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  maxWidth: '95%',
  width: '1400px', // Adjusted for wider table content
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  border: '1px solid #cbd5e1'
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '25px',
  right: '25px',
  background: '#f1f5f9',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s',
  color: '#64748b',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const modalTableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 12px',
  marginTop: '20px',
};

const modalTableHeaderStyle = {
  padding: '14px 10px',
  textAlign: 'left',
  backgroundColor: '#e2e8f0',
  color: '#334155',
  fontSize: '0.875rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.7px',
  border: 'none',
  position: 'sticky',
  top: '0',
  zIndex: '10',
};

const modalTableCellStyle = {
  padding: '18px 10px',
  textAlign: 'left',
  border: 'none',
  fontSize: '0.9rem',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
};

const modalTableRowStyle = {
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  // Pseudo-selectors like :first-child, :last-child are not directly supported in inline styles.
  // The border radius logic has been moved to the individual `<td>` elements in the `map` function
  // to ensure they apply correctly to the first/last cells of the first/last rows.
};

const actionButtonStyle = {
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.85em',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s'
};

export default AdminDashboard;
