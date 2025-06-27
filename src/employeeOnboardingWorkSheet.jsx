import React from 'react';

const EmployeeOnboardingWorksheet = () => {
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
    maxWidth: '1200px',
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
    display: 'flex',
    borderBottom: '2px solid #ecf0f1',
    marginBottom: '20px',
  };

  const tabStyle = {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#7f8c8d',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'color 0.3s ease, border-color 0.3s ease',
    marginRight: '15px',
  };

  const activeTabStyle = {
    color: '#3498db',
    borderColor: '#3498db',
    fontWeight: '600',
  };

  const tabCountStyle = {
    backgroundColor: '#ecf0f1',
    borderRadius: '10px',
    padding: '3px 8px',
    marginLeft: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#7f8c8d',
  };

  const activeTabCountStyle = {
    backgroundColor: '#3498db',
    color: '#ffffff',
  };

  const tableContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '30px',
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto', // For responsive table scrolling
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px', // Spacing between rows
  };

  const tableHeaderCellStyle = {
    padding: '15px 20px',
    textAlign: 'left',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #ecf0f1',
  };

  const tableRowStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const tableRowHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  };

  const tableDataCellStyle = {
    padding: '18px 20px',
    color: '#34495e',
    fontSize: '15px',
    fontWeight: '500',
  };

  const statusBadgeStyle = {
    // Removed duplicate 'display: inline-block'
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex', // Keep this as it enables gap and alignment
    alignItems: 'center',
    gap: '6px',
    width: 'fit-content',
  };

  const awaitingStatusStyle = {
    backgroundColor: '#fffbe6', // Light yellow background
    color: '#d4ac0d', // Dark yellow text
    border: '1px solid #fce883',
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

  // Sample data to populate the table, matching the image
  const employees = [
    {
      id: 1,
      name: 'fdgdgf',
      subName: 'fdgdffg',
      gender: 'Male',
      contact: '5465465465',
      email: 'Sand@123.com',
      location: 'Amaravati, Andhra Pradesh',
      joinDate: '2025-08-12',
      status: 'Awaiting',
      designations: 'No designations assigned',
    },
    // You can add more placeholder data here
  ];

  return (
    <div style={pageContainerStyle}>
      {/* Header Box */}
      <div style={headerBoxStyle}>
        <div style={backButtonContainerStyle}>
          <button
            style={backButtonStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, backButtonStyle, backButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, backButtonStyle)}
          >
            &#x2190; Back to Registration
          </button>
        </div>
        <h1 style={headerTitleStyle}>Employee Onboarding Worksheet</h1>
        <p style={headerDescriptionStyle}>Track and manage new employee onboarding process</p>

        {/* Tabs */}
        <div style={tabsContainerStyle}>
          <div
            style={{ ...tabStyle, ...activeTabStyle }}
            // No onClick for now, as functionality will be added later
          >
            Awaiting <span style={{ ...tabCountStyle, ...activeTabCountStyle }}>1</span>
          </div>
          <div
            style={tabStyle}
            // No onClick for now
          >
            Review <span style={tabCountStyle}>1</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={tableContainerStyle}>
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
            {employees.map((employee) => (
              <tr
                key={employee.id}
                style={tableRowStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, tableRowStyle, tableRowHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, tableRowStyle)}
              >
                <td style={tableDataCellStyle}>
                  <div style={{ fontWeight: 'bold' }}>{employee.name}</div>
                  <div style={{ color: '#555', fontSize: '13px' }}>{employee.subName}</div>
                  <div style={{ color: '#555', fontSize: '13px' }}>{employee.gender}</div>
                </td>
                <td style={tableDataCellStyle}>{employee.contact}</td>
                <td style={tableDataCellStyle}>{employee.email}</td>
                <td style={tableDataCellStyle}>{employee.location}</td>
                <td style={tableDataCellStyle}>{employee.joinDate}</td>
                <td style={tableDataCellStyle}>
                  <span style={{ ...statusBadgeStyle, ...awaitingStatusStyle }}>
                    <span style={{ fontSize: '18px', lineHeight: '1', marginRight: '4px' }}>&#x25CF;</span> {/* Circle icon */}
                    {employee.status}
                  </span>
                </td>
                <td style={tableDataCellStyle}>{employee.designations}</td>
                <td style={tableDataCellStyle}>
                  <span
                    style={actionIconStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, actionIconHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, actionIconStyle)}
                    title="View"
                  >
                    &#128065; {/* Eye icon */}
                  </span>
                  <span
                    style={actionIconStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, actionIconHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, actionIconStyle)}
                    title="Edit"
                  >
                    &#9998; {/* Pencil icon */}
                  </span>
                  <span
                    style={actionIconStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, actionIconHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, actionIconStyle)}
                    title="Approve"
                  >
                    &#10003; {/* Checkmark icon */}
                  </span>
                  <span
                    style={actionIconStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, actionIconHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, actionIconStyle)}
                    title="Reject"
                  >
                    &#10060; {/* Cross mark icon */}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeOnboardingWorksheet;
