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

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += context.raw;
            }
            return label;
          }
        },
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 10,
        cornerRadius: 5
      }
    },
    cutout: '70%',
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // New: Function to handle card clicks
  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked!`);
    // Example: You can navigate to a different route based on the card type
    // if (cardType === 'clients') {
    //   navigate('/admin/clients');
    // } else if (cardType === 'manager') {
    //   navigate('/admin/managers');
    // } else if (cardType === 'teamleads') {
    //   navigate('/admin/teamleads');
    // } else if (cardType === 'employee') {
    //   navigate('/admin/employees');
    // }
  };

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
        background: '#0a193c',
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
            background: '#2c3e50',
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
    </div>
  );
};

// --- Inline Styles for Visual Consistency with Image ---
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
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Keep transition for smooth effect
  paddingBottom: '15px',
};

const cardHoverStyle = { // New style for hover effect
  transform: 'translateY(-5px)', // Lift card slightly
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // More pronounced shadow
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

export default AdminDashboard;