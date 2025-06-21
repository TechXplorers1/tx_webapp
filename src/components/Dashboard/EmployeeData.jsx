import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeData = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // Mock data for employee's assigned clients
  const assignedClients = [
    {
      id: 1,
      initials: 'JA',
      name: 'John Anderson',
      code: 'C001',
      status: 'active',
      priority: 'high',
      role: 'Frontend Developer',
      location: 'San Francisco, CA',
      salaryRange: '$90,000 - $120,000',
      lastActivity: '6/21/2025',
      applicationsCount: 3,
      filesCount: 3,
      resumeUpdates: [ // Mock resume updates for this client
        { date: '2025-06-21', type: 'Resume', status: 'Updated', details: 'Added new project experience' },
        { date: '2025-06-15', type: 'LinkedIn Profile', status: 'Reviewed', details: 'Optimized keywords' },
        { date: '2025-06-10', type: 'Resume', status: 'Draft 2 Sent', details: 'Revised for client feedback' },
      ],
    },
    {
      id: 2,
      initials: 'SM',
      name: 'Sarah Mitchell',
      code: 'C002',
      status: 'active',
      priority: 'medium',
      role: 'UX Designer',
      location: 'Remote',
      salaryRange: '$70,000 - $95,000',
      lastActivity: '6/20/2025',
      applicationsCount: 3,
      filesCount: 3,
      resumeUpdates: [ // Mock resume updates for this client
        { date: '2025-06-20', type: 'Resume', status: 'Updated', details: 'Design portfolio link added' },
        { date: '2025-06-18', type: 'Glassdoor Profile', status: 'Created', details: 'New profile setup' },
      ],
    },
    {
      id: 3,
      initials: 'MC',
      name: 'Michael Chen',
      code: 'C003',
      status: 'active',
      priority: 'medium',
      role: 'Data Analyst',
      location: 'New York, NY',
      salaryRange: '$75,000 - $100,000',
      lastActivity: '6/19/2025',
      applicationsCount: 2,
      filesCount: 2,
      resumeUpdates: [ // Mock resume updates for this client
        { date: '2025-06-19', type: 'Resume', status: 'Updated', details: 'Optimized for data science roles' },
        { date: '2025-06-17', type: 'Resume', status: 'Draft 1 Sent', details: 'Initial draft sent' },
      ],
    },
  ];

  // Helper function to get the latest resume update date for a client
  const getLatestResumeUpdateDate = (clientResumeUpdates) => {
    const resumeTypeUpdates = clientResumeUpdates.filter(update => update.type === 'Resume');
    if (resumeTypeUpdates.length === 0) {
      return null;
    }
    const latestDate = new Date(Math.max(...resumeTypeUpdates.map(update => new Date(update.date))));
    return latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownloadResume = (clientName) => {
    // Placeholder for actual resume download logic
    alert(`Downloading the latest resume for ${clientName}... (Placeholder action)`);
  };


  return (
    <div style={containerStyle}>
      {/* Centralized CSS styles for hover effects and animations */}
      <style>
        {`
        /* General hover effect for buttons */
        .button-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        /* Tab button specific active and hover styles */
        .tab-button.active {
            background-color: #e0effe;
            color: #3b82f6;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .tab-button:hover {
            color: #3b82f6;
        }

        /* Client Card hover effect */
        .client-card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        /* Download button specific styles and animation */
        .download-button {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 8px 16px; /* Slightly smaller padding for card button */
          border-radius: 8px;
          font-size: 0.875rem; /* Smaller font size for card button */
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px; /* Smaller gap */
          width: 100%; /* Make button fill its container in the card */
          text-align: center;
        }

        .download-button:hover {
          transform: translateY(-2px); /* Slightly less movement */
          box-shadow: 0 6px 12px rgba(0,0,0,0.15); /* Slightly less intense shadow */
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }
        .download-button:disabled {
          background: #cbd5e1; /* Greyed out background */
          cursor: not-allowed;
          box-shadow: none;
        }
        .download-button:disabled:hover {
          transform: none; /* No movement on hover when disabled */
          box-shadow: none;
          background: #cbd5e1; /* Stays greyed out on hover */
        }


        /* View button specific hover */
        .view-button:hover {
          background-color: #c4e0ff;
        }

        /* Activity button specific hover */
        .activity-button:hover {
          background-color: #e2e8f0;
        }
        `}
      </style>

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerTitleStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Employee Dashboard
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Manage job applications and client assignments
          </p>
        </div>
        <div style={tabsContainerStyle}>
          {['Overview', 'Applications', 'Files', 'Activity', 'Notes'].map(tab => (
            <button
              key={tab}
              style={{
                ...tabButtonStyle,
                ...(activeTab === tab ? tabButtonActiveStyle : {})
              }}
              className="tab-button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Overview Cards */}
      <div style={overviewCardsContainerStyle}>
        <div style={cardStyle}>
          <div style={cardIconContainerStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <p style={cardLabelStyle}>Assigned Clients</p>
          <p style={cardValueStyle}>3</p>
          <p style={cardSubLabelStyle}>Active assignments</p>
        </div>

        <div style={cardStyle}>
          <div style={cardIconContainerStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <p style={cardLabelStyle}>Job Applications</p>
          <p style={cardValueStyle}>8</p>
          <p style={cardSubLabelStyle}>Total submitted</p>
        </div>

        <div style={cardStyle}>
          <div style={cardIconContainerStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <p style={cardLabelStyle}>Active Interviews</p>
          <p style={cardValueStyle}>2</p>
          <p style={cardSubLabelStyle}>In progress</p>
        </div>

        <div style={cardStyle}>
          <div style={cardIconContainerStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          </div>
          <p style={cardLabelStyle}>Files Uploaded</p>
          <p style={cardValueStyle}>8</p>
          <p style={cardSubLabelStyle}>Resumes & screenshots</p>
        </div>
      </div>

      {/* My Assigned Clients Section */}
      <h2 style={sectionTitleStyle}>
        My Assigned Clients
      </h2>
      <div style={clientsGridStyle}>
        {assignedClients.map(client => (
          <div key={client.id} style={clientCardStyle} className="client-card-hover">
            <div style={clientCardHeaderStyle}>
              <div style={initialsCircleStyle}>{client.initials}</div>
              <div style={{ flexGrow: 1 }}>
                <p style={clientNameStyle}>{client.name}</p>
                <p style={clientCodeStyle}>{client.code}</p>
              </div>
              <div style={{ ...statusBadgeStyle, backgroundColor: client.status === 'active' ? '#dcfce7' : '#fef2f2', color: client.status === 'active' ? '#16a34a' : '#ef4444' }}>
                {client.status}
              </div>
              <div style={{ ...priorityBadgeStyle, backgroundColor: client.priority === 'high' ? '#fee2e2' : client.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: client.priority === 'high' ? '#dc2626' : client.priority === 'medium' ? '#d97706' : '#2563eb' }}>
                {client.priority}
              </div>
            </div>
            <p style={clientDetailStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              {client.role}
            </p>
            <p style={clientDetailStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {client.location}
            </p>
            <p style={clientDetailStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              {client.salaryRange}
            </p>
            <p style={clientDetailStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Last activity: {client.lastActivity}
            </p>

            <div style={clientCardFooterStyle}>
              <div style={footerItemStyle}>
                <span style={footerItemLabelStyle}>Applications</span>
                <span style={footerItemValueStyle}>{client.applicationsCount}</span>
                <button style={viewButtonStyle} className="view-button">View</button>
              </div>
              <div style={footerItemStyle}>
                <span style={footerItemLabelStyle}>Files</span>
                <span style={footerItemValueStyle}>{client.filesCount}</span>
                <button style={viewButtonStyle} className="view-button">View</button>
              </div>
              <div style={footerItemStyle}>
                <span style={footerItemLabelStyle}>Resume</span>
                {/* Conditionally render checkmark/cross based on resume availability */}
                {client.resumeUpdates.filter(u => u.type === 'Resume').length > 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
                <button
                  onClick={() => handleDownloadResume(client.name)}
                  className="download-button"
                  disabled={client.resumeUpdates.filter(u => u.type === 'Resume').length === 0}
                >
                  Download
                </button>
                {getLatestResumeUpdateDate(client.resumeUpdates) && (
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                    Last updated: {getLatestResumeUpdateDate(client.resumeUpdates)}
                  </p>
                )}
              </div>
              <div style={footerItemStyle}>
                <span style={footerItemLabelStyle}>Activity</span>
                <button style={activityButtonStyle} className="activity-button">Activity</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
  background: '#f8fafc',
  color: '#1e293b',
  minHeight: '100vh',
  padding: '24px 32px',
};

const headerStyle = {
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
};

const headerTitleStyle = {
  flexGrow: 1,
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '8px',
  background: '#ffffff',
  borderRadius: '8px',
  padding: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
};

const tabButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'color 0.2s, background-color 0.2s',
};

const tabButtonActiveStyle = {
  // Styles for active state are now defined in CSS class '.tab-button.active'
};


const overviewCardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
  marginBottom: '40px',
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  position: 'relative',
  overflow: 'hidden',
};

const cardIconContainerStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '50%',
  padding: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
};

const cardLabelStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
  margin: 0,
};

const cardValueStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: '4px 0',
};

const cardSubLabelStyle = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  margin: 0,
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '24px',
};

const clientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const clientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', // Added transition for client cards
};

const clientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const initialsCircleStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: '600',
};

const clientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const clientCodeStyle = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0,
};

const statusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
};

const priorityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto', // Push to the right
};

const clientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
};

const clientDetailIconStyle = {
  color: '#94a3b8',
  marginRight: '8px',
};

const clientCardFooterStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #f1f5f9',
};

const footerItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const footerItemLabelStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  marginBottom: '4px',
};

const footerItemValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '8px',
};

const footerItemIconStyle = {
  marginBottom: '8px',
};

const viewButtonStyle = {
  background: '#e0effe',
  color: '#3b82f6',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

const activityButtonStyle = {
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

export default EmployeeData;
