import React, { useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInterviewsModal, setShowInterviewsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleInterviewsModal = () => setShowInterviewsModal(!showInterviewsModal);
  const toggleResumeModal = () => setShowResumeModal(!showResumeModal);

  const profilePlaceholder = "https://via.placeholder.com/80/E0E0E0/808080?text=👤";

  const data = {
    labels: [
      '01 jun 2025', '01 jun 2025', '01 jun 2025',
      '01 jun 2025', '01 jun 2025', '01 jun 2025',
      '01 jun 2025'
    ],
    datasets: [
      {
        label: 'linkedin',
        data: [25, 20, 22, 28, 26, 24, 27],
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false
      },
      {
        label: 'indeed',
        data: [5, 10, 15, 20, 25, 22, 15],
        borderColor: 'dodgerblue',
        backgroundColor: 'dodgerblue',
        tension: 0.4,
        pointRadius: 5,
        fill: false
      },
      {
        label: 'company site',
        data: [10, 12, 18, 20, 25, 23, 28],
        borderColor: 'purple',
        backgroundColor: 'purple',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false
      },
      {
        label: 'glassdoor',
        data: [20, 10, 14, 16, 15, 10, 30],
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.4,
        pointRadius: 5,
        fill: false
      },
      {
        label: 'other',
        data: [15, 25, 18, 26, 22, 28, 18],
        borderColor: 'orange',
        backgroundColor: 'orange',
        tension: 0.4,
        pointRadius: 5,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'nearest', intersect: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 5,
        max: 30
      }
    }
  };

  // Mock data for Scheduled Interviews
  const scheduledInterviews = [
    { id: 1, date: '2025-06-15', time: '10:00 AM', company: 'Innovate Solutions', role: 'Software Developer', interviewer: 'Alice Johnson', type: 'Virtual' },
    { id: 2, date: '2025-06-18', time: '02:30 PM', company: 'Global Tech Corp', role: 'UX Designer', interviewer: 'Bob Williams', type: 'In-person' },
    { id: 3, date: '2025-06-20', time: '11:00 AM', company: 'Data Insights Ltd.', role: 'Data Analyst', interviewer: 'Charlie Brown', type: 'Virtual' },
    { id: 4, date: '2025-06-22', time: '09:00 AM', company: 'FutureTech Inc.', role: 'Project Manager', interviewer: 'David Lee', type: 'Virtual' },
    { id: 5, date: '2025-06-25', time: '01:00 PM', company: 'Digital Innovators', role: 'DevOps Engineer', interviewer: 'Eve Davis', type: 'In-person' },
    { id: 6, date: '2025-06-28', time: '03:45 PM', company: 'Quant Computing', role: 'Machine Learning Scientist', interviewer: 'Frank White', type: 'Virtual' },
    { id: 7, date: '2025-07-01', time: '10:30 AM', company: 'CyberSec Solutions', role: 'Cybersecurity Analyst', interviewer: 'Grace Kim', type: 'Virtual' },
    { id: 8, date: '2025-07-03', time: '04:00 PM', company: 'HealthTech Connect', role: 'Mobile App Developer', interviewer: 'Henry Green', type: 'In-person' },
  ];

  // Mock data for Resume & Job Portal Updates
  const resumeUpdates = [
    { id: 1, date: '2025-06-08', type: 'Resume', status: 'Updated', details: 'Added new project experience' },
    { id: 2, date: '2025-06-05', type: 'LinkedIn Profile', status: 'Reviewed', details: 'Optimized keywords' },
    { id: 3, date: '2025-06-01', type: 'Job Portal Profile', status: 'Completed', details: 'Indeed profile sync' },
    { id: 4, date: '2025-05-28', type: 'Cover Letter Template', status: 'Revised', details: 'Tailored for specific roles' },
    { id: 5, date: '2025-05-25', type: 'Resume', status: 'Draft 1 Sent', details: 'Initial review with consultant' },
    { id: 6, date: '2025-05-20', type: 'Glassdoor Profile', status: 'Created', details: 'New profile setup' },
    { id: 7, date: '2025-05-18', type: 'Portfolio Link', status: 'Added', details: 'Updated portfolio on resume' },
    { id: 8, date: '2025-05-15', type: 'Skills Section', status: 'Enhanced', details: 'Added new technical skills' },
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#fff', color: '#333', display: 'flex' }}>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9
          }}
        />
      )}

      {/* Interviews Modal Overlay */}
      {showInterviewsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleInterviewsModal} style={modalCloseButtonStyle}>X</button>
            <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Scheduled Interviews</h3>
            <table style={modalTableStyle}>
              <thead>
                <tr>
                  <th style={modalTableHeaderStyle}>Date</th>
                  <th style={modalTableHeaderStyle}>Time</th>
                  <th style={modalTableHeaderStyle}>Company</th>
                  <th style={modalTableHeaderStyle}>Role</th>
                  <th style={modalTableHeaderStyle}>Interviewer</th>
                  <th style={modalTableHeaderStyle}>Type</th>
                </tr>
              </thead>
              <tbody>
                {scheduledInterviews.map((interview) => (
                  <tr key={interview.id}>
                    <td style={modalTableCellStyle}>{interview.date}</td>
                    <td style={modalTableCellStyle}>{interview.time}</td>
                    <td style={modalTableCellStyle}>{interview.company}</td>
                    <td style={modalTableCellStyle}>{interview.role}</td>
                    <td style={modalTableCellStyle}>{interview.interviewer}</td>
                    <td style={modalTableCellStyle}>{interview.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resume & Job Portal Updates Modal Overlay */}
      {showResumeModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleResumeModal} style={modalCloseButtonStyle}>X</button>
            <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Resume & Job Portal Updates</h3>
            <table style={modalTableStyle}>
              <thead>
                <tr>
                  <th style={modalTableHeaderStyle}>Date</th>
                  <th style={modalTableHeaderStyle}>Update Type</th>
                  <th style={modalTableHeaderStyle}>Status</th>
                  <th style={modalTableHeaderStyle}>Details</th>
                </tr>
              </thead>
              <tbody>
                {resumeUpdates.map((update) => (
                  <tr key={update.id}>
                    <td style={modalTableCellStyle}>{update.date}</td>
                    <td style={modalTableCellStyle}>{update.type}</td>
                    <td style={modalTableCellStyle}>{update.status}</td>
                    <td style={modalTableCellStyle}>{update.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sidebar Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: menuOpen ? 0 : '-250px',
        height: '100%',
        width: '250px',
        background: '#fff',
        color: '#333',
        padding: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
        zIndex: 10,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Profile Icon */}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          backgroundColor: '#e0e0e0',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <img src={profilePlaceholder} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
        </div>

        {/* Dashboard Text */}
        <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>DASHBOARD</h4>

        {/* Plan Details */}
        <div style={{
          display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>1 Month Plan</p>
            <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold' }}>$000</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>Days Left</p>
            <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold' }}>28</p>
          </div>
        </div>

        {/* Renewal Button */}
        <button style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '1em',
          cursor: 'pointer',
          marginBottom: '30px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          Renewal
        </button>

        {/* Spacer to push Help & Support and Log Out to bottom */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Help & Support */}
        <button onClick={() => alert('Help & Support clicked')} style={bottomLinkStyle}>
          Help & Support
        </button>

        {/* Log Out Button */}
        <button
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/');
            toggleMenu();
          }}
          style={bottomLinkStyleLogout}
        >
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, marginLeft: menuOpen ? '250px' : '0', transition: 'margin-left 0.3s ease', padding: '20px' }}>
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 0 20px 0'
        }}>
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#00bfff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              ⬅ Back
            </button>
          </div>
          <div
            onClick={toggleMenu}
            style={{ fontSize: '24px', cursor: 'pointer' }}
          >
            &#9776;
          </div>
        </header>

        <h2 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>USER DASHBOARD</h2>

        {/* Chart Section */}
        <div style={{ width: '100%', maxWidth: '900px', margin: 'auto', marginBottom: '20px' }}>
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
             <h4 style={{ marginBottom: '15px', textAlign: 'center', color: '#555' }}>Job Source Performance</h4>
             <Line data={data} options={options} />
          </div>
          <button style={{
            margin: '20px auto',
            display: 'block',
            background: '#00bfff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}>
            Work Sheet
          </button>
        </div>

        {/* Cards - Interviews Scheduled & Updated Resume */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          margin: '40px 0',
          flexWrap: 'wrap'
        }}>
          <div
            onClick={toggleInterviewsModal}
            style={{
              padding: '40px',
              borderRadius: '15px',
              backgroundColor: '#a0541b',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: '5px 5px 10px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              flex: '1 1 300px',
              maxWidth: '45%'
            }}
          >
            INTERVIEWS SCHEDULED
          </div>

          <div
            onClick={toggleResumeModal}
            style={{
              padding: '40px',
              borderRadius: '15px',
              backgroundColor: '#8234af',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: '5px 5px 10px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              flex: '1 1 300px',
              maxWidth: '45%'
            }}
          >
            UPDATED RESUME & JOB PORTAL FILE
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  textAlign: 'left',
  padding: '10px 0',
  cursor: 'pointer',
  width: '100%'
};

const bottomLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#333',
  fontSize: '16px',
  textAlign: 'center',
  padding: '10px 0',
  cursor: 'pointer',
  width: '100%',
  marginTop: '10px'
};

const bottomLinkStyleLogout = {
  background: '#64B5F6',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  fontSize: '16px',
  textAlign: 'center',
  cursor: 'pointer',
  width: '80%',
  marginBottom: '20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

// Styles for the new Modal/Overlay
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100
};

const modalContentStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  maxWidth: '90%',
  width: '950px', // Increased width here from 800px to 950px
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative'
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
  color: '#666'
};

const modalTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px'
};

const modalTableHeaderStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  borderBottom: '2px solid #e0e0e0',
  backgroundColor: '#f2f2f2',
  color: '#555'
};

const modalTableCellStyle = {
  padding: '10px 15px',
  textAlign: 'left',
  borderBottom: '1px solid #e9e9e9'
};

const actionButtonStyle = {
  background: '#00bfff',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  fontSize: '0.9em',
  cursor: 'pointer',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
};


export default ClientDashboard;