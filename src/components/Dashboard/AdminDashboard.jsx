// src/components/Dashboard/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login status
    localStorage.removeItem('userRole'); // Clear the stored role
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '50px auto',
      border: '1px solid #dc3545', // Red border to distinguish from client dashboard
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(220, 53, 69, 0.2)', // Red shadow
      backgroundColor: '#fff3f3' // Light red background
    }}>
      <h2 style={{ textAlign: 'center', color: '#dc3545', marginBottom: '25px' }}>Admin Dashboard</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#555', marginBottom: '30px' }}>
        Welcome, Administrator! This is your privileged view for system management.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div style={adminCardStyle}>
          <h4>Manage Users</h4>
          <p>Create, update, and delete user accounts.</p>
          <button style={adminCardButtonStyle} onClick={() => alert('Manage Users functionality coming soon!')}>Go to Users</button>
        </div>
        <div style={adminCardStyle}>
          <h4>System Analytics</h4>
          <p>View overall platform performance and data.</p>
          <button style={adminCardButtonStyle} onClick={() => alert('Analytics functionality coming soon!')}>View Analytics</button>
        </div>
        <div style={adminCardStyle}>
          <h4>Content Moderation</h4>
          <p>Review and approve user-generated content.</p>
          <button style={adminCardButtonStyle} onClick={() => alert('Content Moderation functionality coming soon!')}>Moderate Content</button>
        </div>
        <div style={adminCardStyle}>
          <h4>Settings</h4>
          <p>Configure global application settings.</p>
          <button style={adminCardButtonStyle} onClick={() => alert('Settings functionality coming soon!')}>Edit Settings</button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'block',
          width: '150px',
          margin: '40px auto 0',
          padding: '12px 20px',
          backgroundColor: '#dc3545', // Red logout button
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
        }}
      >
        Log Out
      </button>
    </div>
  );
};

const adminCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  width: 'calc(50% - 10px)', // Two cards per row on larger screens
  minWidth: '280px', // Minimum width for responsiveness
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const adminCardButtonStyle = {
  marginTop: '15px',
  padding: '10px 15px',
  backgroundColor: '#007bff', // Example button color for actions
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.9em',
  transition: 'background-color 0.3s ease'
};


export default AdminDashboard;