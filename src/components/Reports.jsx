import React from 'react';

const Reports = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#1f2937' }}>
        Reports Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: '#f1f5f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Application Summary</h3>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>Overview of job applications submitted this week.</p>
        </div>

        <div style={{
          background: '#f1f5f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Conversion Rate</h3>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>Track response rates and interview callbacks.</p>
        </div>

        <div style={{
          background: '#f1f5f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Sources Breakdown</h3>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>LinkedIn, Indeed, Company Sites, and more.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
