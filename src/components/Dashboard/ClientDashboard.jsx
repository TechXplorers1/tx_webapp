import React, { useState, useEffect } from 'react';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRadioPlan, setSelectedRadioPlan] = useState('glass-silver'); // Default to Silver


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleInterviewsModal = () => setShowInterviewsModal(!showInterviewsModal);
  const toggleResumeModal = () => setShowResumeModal(!showResumeModal);
  const togglePaymentModal = () => setShowPaymentModal(!showPaymentModal);

  const profilePlaceholder = "https://placehold.co/96x96/E0E0E0/808080?text=�";

  // --- Dynamic Chart Date Generation ---
  const today = new Date();
  const chartLabels = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    chartLabels.push(`${day} ${month} ${year}`);
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'LinkedIn',
        data: [25, 20, 22, 28, 26, 24, 27],
        borderColor: '#0A66C2',
        backgroundColor: '#0A66C2',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Indeed',
        data: [5, 10, 15, 20, 25, 22, 15],
        borderColor: '#2164F4',
        backgroundColor: '#2164F4',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Company Site',
        data: [10, 12, 20, 6, 29, 23, 28],
        borderColor: '#6A0DAD',
        backgroundColor: '#6A0DAD',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Glassdoor',
        data: [20, 15, 8, 16, 15, 10, 30],
        borderColor: '#0CAA41',
        backgroundColor: '#0CAA41',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Other',
        data: [15, 25, 18, 26, 22, 28, 18],
        borderColor: '#FF6B00',
        backgroundColor: '#FF6B00',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Segoe UI', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 5,
        max: 30,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        fill: false
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

  // Map plans to prices and features for display
  const planOptions = {
    'glass-silver': { name: 'Silver', price: '$199', features: ['Full dashboard access', 'Monthly chart updates', 'Basic support'] },
    'glass-gold': { name: 'Gold', price: '$499', features: ['All Silver features', 'Priority support', 'Quarterly review calls'] },
    'glass-platinum': { name: 'Platinum', price: '$999', features: ['All Gold features', 'Dedicated account manager', 'Annual strategic planning session'] },
  };

  // Handler for selecting a payment plan
  const handleProceedToPayment = () => {
    const currentPlan = planOptions[selectedRadioPlan];
    if (currentPlan) {
      console.log(`Proceeding with: ${currentPlan.name} plan for ${currentPlan.price}`);
      // In a real application, you'd trigger a payment gateway here
      // For now, we'll just close the modal and show an alert.
      alert(`Proceeding with the ${currentPlan.name} plan for ${currentPlan.price}. Payment integration would go here!`);
      togglePaymentModal();
    }
  };

  // Function to handle radio button change
  const handleRadioPlanChange = (planId) => {
    setSelectedRadioPlan(planId);
  };

  // Function to get glider style based on selected plan
  const getGliderDynamicStyle = () => {
    let transformValue = 'translateX(0%)';
    let backgroundValue = 'linear-gradient(135deg, #c0c0c055, #e0e0e0)';
    let boxShadowValue = '0 0 18px rgba(192, 192, 192, 0.5), 0 0 10px rgba(255, 255, 255, 0.4) inset';

    if (selectedRadioPlan === 'glass-gold') {
      transformValue = 'translateX(100%)';
      backgroundValue = 'linear-gradient(135deg, #ffd70055, #ffcc00)';
      boxShadowValue = '0 0 18px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 235, 150, 0.4) inset';
    } else if (selectedRadioPlan === 'glass-platinum') {
      transformValue = 'translateX(200%)';
      backgroundValue = 'linear-gradient(135deg, #d0e7ff55, #a0d8ff)';
      boxShadowValue = '0 0 18px rgba(160, 216, 255, 0.5), 0 0 10px rgba(200, 240, 255, 0.4) inset';
    }

    return {
      ...radioGliderStyle,
      transform: transformValue,
      background: backgroundValue,
      boxShadow: boxShadowValue,
    };
  };

  // Get current selected plan details for display below radio buttons
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];


  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      background: '#f8fafc',
      color: '#1e293b',
      minHeight: '100vh',
      display: 'flex'
    }}>

      {/* Sidebar Overlay */}
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
            zIndex: 9
          }}
        />
      )}

      {/* Interviews Modal */}
      {showInterviewsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleInterviewsModal} style={modalCloseButtonStyle}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Scheduled Interviews
            </h3>
            <div style={{ overflowX: 'auto' }}>
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
                    <tr key={interview.id} style={modalTableRowStyle}>
                      <td style={modalTableCellStyle}>
                        <div style={{ fontWeight: '500' }}>{interview.date}</div>
                      </td>
                      <td style={modalTableCellStyle}>{interview.time}</td>
                      <td style={{...modalTableCellStyle, fontWeight: '600'}}>{interview.company}</td>
                      <td style={modalTableCellStyle}>{interview.role}</td>
                      <td style={modalTableCellStyle}>{interview.interviewer}</td>
                      <td style={modalTableCellStyle}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor: interview.type === 'Virtual' ? '#EFF6FF' : '#ECFDF5',
                          color: interview.type === 'Virtual' ? '#1D4ED8' : '#047857',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {interview.type === 'Virtual' ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M9.5 3H2.5C2.22386 3 2 3.22386 2 3.5V8.5C2 8.77614 2.22386 9 2.5 9H9.5C9.77614 9 10 8.77614 10 8.5V3.5C10 3.22386 9.77614 3 9.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4 6H5M7 6H8M6 6V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {interview.type}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleResumeModal} style={modalCloseButtonStyle}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Resume & Job Portal Updates
            </h3>
            <div style={{ overflowX: 'auto' }}>
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
                    <tr key={update.id} style={modalTableRowStyle}>
                      <td style={modalTableCellStyle}>
                        <div style={{ fontWeight: '500' }}>{update.date}</div>
                      </td>
                      <td style={{...modalTableCellStyle, fontWeight: '600'}}>{update.type}</td>
                      <td style={modalTableCellStyle}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            update.status === 'Updated' ? '#EFF6FF' :
                            update.status === 'Reviewed' ? '#FEF3C7' :
                            update.status === 'Completed' ? '#ECFDF5' : '#F3E8FF',
                          color:
                            update.status === 'Updated' ? '#1D4ED8' :
                            update.status === 'Reviewed' ? '#92400E' :
                            update.status === 'Completed' ? '#047857' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {update.status === 'Updated' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {update.status === 'Reviewed' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {update.status === 'Completed' && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M9 3L4.5 7.5L3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {update.status}
                        </div>
                      </td>
                      <td style={modalTableCellStyle}>{update.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Plan Modal */}
      {showPaymentModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '600px', padding: '40px', background: '#334155' }}> {/* Dark background for glass effect */}
            <button onClick={togglePaymentModal} style={modalCloseButtonStyle}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/> {/* Lighter color for contrast */}
              </svg>
            </button>
            <h3 style={{
              marginBottom: '30px',
              textAlign: 'center',
              color: '#f1f5f9', // Lighter text color for dark background
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              Choose Your Plan
            </h3>

            {/* Glass Radio Group */}
            <div style={radioGroupStyle}>
              <input
                type="radio"
                name="plan"
                id="glass-silver"
                checked={selectedRadioPlan === 'glass-silver'}
                onChange={() => handleRadioPlanChange('glass-silver')}
                style={hiddenRadioInputStyle} // Apply hidden style
              />
              <label htmlFor="glass-silver" style={{
                ...radioLabelBaseStyle,
                color: selectedRadioPlan === 'glass-silver' ? '#fff' : '#e5e5e5',
                ...(true && { ':hover': { color: 'white' } })
              }}>
                Silver
              </label>

              <input
                type="radio"
                name="plan"
                id="glass-gold"
                checked={selectedRadioPlan === 'glass-gold'}
                onChange={() => handleRadioPlanChange('glass-gold')}
                style={hiddenRadioInputStyle}
              />
              <label htmlFor="glass-gold" style={{
                ...radioLabelBaseStyle,
                color: selectedRadioPlan === 'glass-gold' ? '#fff' : '#e5e5e5',
                ...(true && { ':hover': { color: 'white' } })
              }}>
                Gold
              </label>

              <input
                type="radio"
                name="plan"
                id="glass-platinum"
                checked={selectedRadioPlan === 'glass-platinum'}
                onChange={() => handleRadioPlanChange('glass-platinum')}
                style={hiddenRadioInputStyle}
              />
              <label htmlFor="glass-platinum" style={{
                ...radioLabelBaseStyle,
                color: selectedRadioPlan === 'glass-platinum' ? '#fff' : '#e5e5e5',
                ...(true && { ':hover': { color: 'white' } })
              }}>
                Platinum
              </label>
              <div style={getGliderDynamicStyle()} />
            </div>

            {/* Display details of the currently selected plan */}
            {currentSelectedPlanDetails && (
              <div style={selectedPlanDetailsStyle}>
                <h4 style={paymentPlanTitleStyle}>{currentSelectedPlanDetails.name} Plan</h4>
                <p style={paymentPlanPriceStyle}>
                  {currentSelectedPlanDetails.price}
                  <span style={paymentPlanPeriodStyle}>{currentSelectedPlanDetails.name === 'Silver' ? '/month' : currentSelectedPlanDetails.name === 'Gold' ? '/3 months' : '/year'}</span>
                </p>
                <ul style={paymentPlanFeaturesListStyle}>
                  {currentSelectedPlanDetails.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4ade80' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleProceedToPayment}
                  style={paymentPlanSelectButtonStyle}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: menuOpen ? 0 : '-280px',
        height: '100%',
        width: '280px',
        background: '#ffffff',
        color: '#1e293b',
        padding: '24px',
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
        zIndex: 10,
        transition: 'right 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Profile Section */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '3px solid #e2e8f0'
        }}>
          <img
            src={profilePlaceholder}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <h4 style={{
          marginBottom: '16px',
          fontWeight: '700',
          fontSize: '1.25rem',
          color: '#1e293b'
        }}>
          DASHBOARD
        </h4>

        {/* Plan Details */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>1 Month Plan</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>$199</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>Days Left</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>28</p>
          </div>
        </div>

        {/* Renewal Button */}
        <button
          onClick={togglePaymentModal} // Calls the new toggle function
          style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '32px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            width: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            // Corrected pseudo-class syntax for inline styles
            ...(true && { // Using a true condition to always apply for now, could be dynamic
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
              }
            })
          }}
        >
          Renew Plan
        </button>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Bottom Links */}
        <button
          onClick={() => navigate('/contactus')}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.9375rem',
            fontWeight: '500',
            textAlign: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            width: '100%',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            // Corrected pseudo-class syntax for inline styles
            ...(true && {
              ':hover': {
                color: '#3b82f6'
              }
            })
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6C6 6 6.5 5 8 5C9.5 5 10 6 10 6C10 6 9.5 7 8 7C6.5 7 6 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8H6.01M10 8H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Help & Support
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/');
            toggleMenu();
          }}
          style={{
            background: '#f1f5f9',
            color: '#ef4444',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            margin: '16px 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            // Corrected pseudo-class syntax for inline styles
            ...(true && {
              ':hover': {
                backgroundColor: '#fee2e2'
              }
            })
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        flexGrow: 1,
        padding: '24px',
        maxWidth: '100%'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#ffffff',
              color: '#3b82f6',
              border: '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s',
              // Corrected pseudo-class syntax for inline styles
              ...(true && {
                ':hover': {
                  backgroundColor: '#f8fafc'
                }
              })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div
            onClick={toggleMenu}
            style={{
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              // Corrected pseudo-class syntax for inline styles
              ...(true && {
                ':hover': {
                  backgroundColor: '#f1f5f9'
                }
              })
            }}
          >
            &#9776;
          </div>
        </header>

        <h2 style={{
          marginBottom: '24px',
          textAlign: 'center',
          color: '#1e293b',
          fontSize: '1.75rem',
          fontWeight: '700'
        }}>
          User Dashboard
        </h2>

        {/* Chart Section */}
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto 32px auto',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            marginBottom: '20px',
            textAlign: 'center',
            color: '#475569',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Job Source Performance
          </h4>
          <Line data={data} options={options} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/clientworksheet')}
            style={{
              margin: '0 auto',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              // Corrected pseudo-class syntax for inline styles
              ...(true && {
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  background: '#2563eb'
                }
              })
            }}
          >
            Go to Work Sheet
          </button>
        </div>

        {/* Cards Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          margin: '40px 0',
          flexWrap: 'wrap'
        }}>
          {/* Interviews Card */}
          <div
            onClick={toggleInterviewsModal}
            style={{
              padding: '40px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
              boxShadow: '0 10px 15px rgba(99, 102, 241, 0.3)',
              cursor: 'pointer',
              flex: '1 1 300px',
              maxWidth: '100%',
              minWidth: '300px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative',
              overflow: 'hidden',
              // Corrected pseudo-class syntax for inline styles
              ...(true && {
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 25px rgba(99, 102, 241, 0.4)'
                }
              })
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              zIndex: 1
            }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px' }}>
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                INTERVIEWS SCHEDULED
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: '0.9',
                marginTop: '8px',
                fontWeight: '400'
              }}>
                {scheduledInterviews.length} upcoming
              </div>
            </div>
          </div>

          {/* Resume Card */}
          <div
            onClick={toggleResumeModal}
            style={{
              padding: '40px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
              boxShadow: '0 10px 15px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              flex: '1 1 300px',
              maxWidth: '100%',
              minWidth: '300px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              // Corrected pseudo-class syntax for inline styles
              ...(true && {
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 25px rgba(16, 185, 129, 0.4)'
                }
              })
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              zIndex: 1
            }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px' }}>
                <path d="M9 12H15M9 16H15M10 3H14C15.1046 3 16 3.89543 16 5V20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20V5C8 3.89543 8.89543 3 10 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                UPDATED RESUME & JOB PORTAL FILE
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: '0.9',
                marginTop: '8px',
                fontWeight: '400'
              }}>
                {resumeUpdates.length} recent updates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100
};

const modalContentStyle = {
  background: '#ffffff',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
  maxWidth: '90%',
  width: '900px',
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
  border: '1px solid #e2e8f0'
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s',
  // Corrected pseudo-class syntax for inline styles
  ...(true && {
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  })
};

const modalTableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
};

const modalTableHeaderStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  backgroundColor: '#f8fafc',
  color: '#475569',
  fontSize: '0.8125rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  border: 'none',
  position: 'sticky',
  top: '0',
  zIndex: '10',
};

const modalTableCellStyle = {
  padding: '16px',
  textAlign: 'left',
  backgroundColor: '#ffffff',
  border: 'none',
  fontSize: '0.875rem',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
};

const modalTableRowStyle = {
  transition: 'background-color 0.2s',
  // Corrected pseudo-class syntax for inline styles
  ...(true && {
    ':hover': {
      backgroundColor: '#f8fafc'
    },
    'td:first-child': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px'
    },
    'td:last-child': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px'
    }
  })
};

// --- New Styles for Payment Radio Buttons ---
const radioGroupStyle = {
  display: 'flex',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.06)',
  borderRadius: '1rem',
  backdropFilter: 'blur(12px)',
  boxShadow: 'inset 1px 1px 4px rgba(255, 255, 255, 0.2), inset -1px -1px 6px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  width: 'fit-content',
  margin: '20px auto 30px auto', // Centered with margin
};

const hiddenRadioInputStyle = {
  display: 'none',
};

const radioLabelBaseStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '80px',
  fontSize: '14px',
  padding: '0.8rem 1.6rem',
  cursor: 'pointer',
  fontWeight: '600',
  letterSpacing: '0.3px',
  position: 'relative',
  zIndex: 2,
  transition: 'color 0.3s ease-in-out',
};

const radioGliderStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: `calc(100% / 3)`,
  borderRadius: '1rem',
  zIndex: 1,
  transition: 'transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56), background 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
};

const selectedPlanDetailsStyle = {
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center',
  color: '#f1f5f9',
};

const paymentPlanTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  marginBottom: '10px',
  color: '#f1f5f9', // Adjusted for dark background
};

const paymentPlanPriceStyle = {
  fontSize: '2.5rem',
  fontWeight: '800',
  color: '#fff', // Adjusted for dark background
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center', // Center price as well
};

const paymentPlanPeriodStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#cbd5e1', // Adjusted for dark background
  marginLeft: '8px',
};

const paymentPlanFeaturesListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '0 auto 30px auto', // Centered and increased margin
  textAlign: 'left',
  width: '100%',
  maxWidth: '300px', // Adjusted max-width for features list
  color: '#cbd5e1', // Adjusted for dark background
};

const paymentPlanSelectButtonStyle = {
  background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: 'auto',
  width: '100%',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s, transform 0.2s',
  ...(true && {
    ':hover': {
      background: '#2563eb',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    }
  })
};

export default ClientDashboard;
