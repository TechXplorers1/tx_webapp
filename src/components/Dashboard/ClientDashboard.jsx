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

// Dimming Overlay Component
const DimmingOverlay = ({ isVisible, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: isVisible ? 99 : -1, // Z-index needs to be below modals (100) but above content
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    />
  );
};


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

  const profilePlaceholder = "https://imageio.forbes.com/specials-images/imageserve/5c7d7829a7ea434b351ba0b6/0x0.jpg?format=jpg&crop=1837,1839,x206,y250,safe&height=416&width=416&fit=bounds";

  // --- Dynamic Chart Date Generation ---
  const generateChartLabelsForPastDays = (numDays) => {
    const labels = [];
    const today = new Date();
    const options = { day: '2-digit', month: 'short' }; // Format as "DD Mon"

    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', options));
    }
    return labels;
  };

  const chartLabels = generateChartLabelsForPastDays(7); // Last 7 days

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'LinkedIn',
        data: [25, 20, 22, 28, 26, 24, 27], // 7 data points for 7 days
        borderColor: '#0A66C2',
        backgroundColor: '#0A66C2',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Indeed',
        data: [5, 10, 15, 20, 25, 22, 15], // 7 data points for 7 days
        borderColor: '#2164F4',
        backgroundColor: '#2164F4',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Company Site',
        data: [10, 12, 20, 6, 29, 23, 28], // 7 data points for 7 days
        borderColor: '#6A0DAD',
        backgroundColor: '#6A0DAD',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Glassdoor',
        data: [20, 15, 8, 16, 15, 10, 30], // 7 data points for 7 days
        borderColor: '#0CAA41',
        backgroundColor: '#0CAA41',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Other',
        data: [15, 25, 18, 26, 22, 28, 18], // 7 data points for 7 days
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
        min: 0,
        max: 35,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: true, // Display vertical grid lines
          color: 'rgba(0,0,0,0.1)',
          drawOnChartArea: true,
          drawTicks: false,
          lineWidth: 1,
          borderDash: [5, 5],
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
    { id: 1, date: '2025-06-15', time: '10:00 AM', company: 'Innovate Solutions', role: 'Software Developer', recruiterMailId: 'alice.j@innovate.com', round: 'Round 1' },
    { id: 2, date: '2025-06-18', time: '02:30 PM', company: 'Global Tech Corp', role: 'UX Designer', recruiterMailId: 'bob.w@globaltech.com', round: 'Round 2' },
    { id: 3, date: '2025-06-20', time: '11:00 AM', company: 'Data Insights Ltd.', role: 'Data Analyst', recruiterMailId: 'charlie.b@datainsights.com', round: 'Final Round' },
    { id: 4, date: '2025-06-22', time: '09:00 AM', company: 'FutureTech Inc.', role: 'Project Manager', recruiterMailId: 'david.l@futuretech.net', round: 'Round 1' },
    { id: 5, date: '2025-06-25', time: '01:00 PM', company: 'Digital Innovators', role: 'DevOps Engineer', recruiterMailId: 'eve.d@digitalinnov.io', round: 'Round 3' },
    { id: 6, date: '2025-06-28', time: '03:45 PM', company: 'Quant Computing', role: 'Machine Learning Scientist', recruiterMailId: 'frank.w@quantcomp.ai', round: 'Round 2' },
    { id: 7, date: '2025-07-01', time: '10:30 AM', company: 'CyberSec Solutions', role: 'Cybersecurity Analyst', recruiterMailId: 'grace.k@cybersec.com', round: 'Round 1' },
    { id: 8, date: '2025-07-03', time: '04:00 PM', company: 'HealthTech Connect', role: 'Mobile App Developer', recruiterMailId: 'henry.g@healthtech.org', round: 'Final Round' },
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

  // Filtered resume updates to show only type 'Resume'
  const filteredResumeUpdates = resumeUpdates.filter(update => update.type === 'Resume');

  // Find the latest resume update date
  const latestResumeUpdate = filteredResumeUpdates.length > 0
    ? new Date(Math.max(...filteredResumeUpdates.map(update => new Date(update.date))))
    : null;

  const formattedLatestResumeDate = latestResumeUpdate
    ? latestResumeUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';


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
      transform: transformValue,
      background: backgroundValue,
      boxShadow: boxShadowValue,
    };
  };

  // Get current selected plan details for display below radio buttons
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];

  // Handler for downloading resume
  const handleDownloadResume = () => {
    alert('Downloading the latest resume... (This is a placeholder action)');
  };

  // Determine if the overlay should be visible
  const isOverlayVisible = menuOpen || showInterviewsModal || showResumeModal || showPaymentModal;


  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      background: '#f8fafc',
      color: '#1e293b',
      minHeight: '100vh',
      display: 'flex',
      overflowX: 'hidden' // Prevent horizontal scroll due to fixed sidebar
    }}>
      {/* Dynamic Styles injected here */}
      <style>
        {`
        .download-button {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .download-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.2);
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        }

        .renew-plan-button {
          background: linear-gradient(135deg, #4ade80 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 32px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          width: 100%;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .renew-plan-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .help-support-button {
            background: none;
            border: none;
            color: #64748b;
            font-size: 0.9375rem;
            font-weight: 500;
            text-align: center;
            padding: 12px 0;
            cursor: pointer;
            width: 100%;
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }
        .help-support-button:hover {
            color: #3b82f6;
        }

        .logout-button {
            background: #f1f5f9;
            color: #ef4444;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin: 16px 0 24px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .logout-button:hover {
            background-color: #fee2e2;
        }

        .back-button {
            background: #ffffff;
            color: #3b82f6;
            border: 1px solid #e2e8f0;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
        }
        .back-button:hover {
            background-color: #f8fafc;
        }

        .menu-toggle-button {
            font-size: 24px;
            cursor: pointer;
            color: #64748b;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s;
            background: none; /* Ensure no default button background */
            border: none; /* Ensure no default button border */
        }
        .menu-toggle-button:hover {
            background-color: #f1f5f9;
        }

        .worksheet-button {
            margin: 0 auto;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .worksheet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            background: #2563eb;
        }

        .interviews-card {
            padding: 40px 24px;
            border-radius: 16px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 10px 15px rgba(99, 102, 241, 0.3);
            cursor: pointer;
            flex: 1 1 300px;
            max-width: 100%;
            min-width: 300px;
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative; /* For inner absolute elements */
            overflow: hidden; /* To contain background elements */
        }
        .interviews-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 25px rgba(99, 102, 241, 0.4);
        }

        .resume-card {
            padding: 40px 24px;
            border-radius: 16px;
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: white;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 10px 15px rgba(16, 185, 129, 0.3);
            cursor: pointer;
            flex: 1 1 300px;
            max-width: 100%;
            min-width: 300px;
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative; /* For inner absolute elements */
            overflow: hidden; /* To contain background elements */
        }
        .resume-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 25px rgba(16, 185, 129, 0.4);
        }

        .modal-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .modal-close-button:hover {
            background-color: #f1f5f9;
        }

        /* Styles for the chart and advertisement container */
        .chart-and-ads-container {
          display: grid;
          grid-template-columns: minmax(0, 150px) 1fr minmax(0, 150px); /* Fixed width for ads, flexible for chart */
          gap: 24px;
          margin-bottom: 32px;
          align-items: center; /* Vertically align items in the grid */
        }

        @media (max-width: 1024px) { /* Responsive adjustments for smaller screens */
          .chart-and-ads-container {
            grid-template-columns: 1fr; /* Stack columns on smaller screens */
            grid-template-areas: "ad-left" "chart" "ad-right"; /* Define grid areas for stacking */
          }
          .ad-column:first-child { grid-area: ad-left; } /* Left ad comes first */
          .ad-column:last-child { grid-area: ad-right; }  /* Right ad comes last */
        }

        .ad-column {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%; /* Ensure ads take full height of the grid row */
          min-height: 350px; /* Ensure a minimum height for visibility */
        }

        .ad-placeholder {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 150px; /* Max width for ad content */
        }

        /* Styles for payment radio buttons and glider */
        .radio-group {
          display: flex;
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          backdrop-filter: blur(12px);
          box-shadow: inset 1px 1px 4px rgba(255, 255, 255, 0.2), inset -1px -1px 6px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          width: fit-content;
          margin: 20px auto 30px auto;
        }

        .hidden-radio-input {
          display: none;
        }

        .radio-label-base {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          font-size: 14px;
          padding: 0.8rem 1.6rem;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.3px;
          position: relative;
          z-index: 2;
          transition: color 0.3s ease-in-out;
        }
        /* Specific color for selected radio label */
        input[type="radio"]:checked + .radio-label-base {
          color: #fff;
        }
        /* Hover effect for radio labels */
        .radio-label-base:hover {
          color: white; /* Always white on hover for dark background */
        }

        .radio-glider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: calc(100% / 3); /* 3 options */
          border-radius: 1rem;
          z-index: 1;
          transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56), background 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
        }

        .modal-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
            min-width: 700px; /* Adjusted table width */
        }

        .modal-table-header {
            padding: 12px 16px;
            text-align: left;
            background-color: #f8fafc;
            color: #475569;
            font-size: 0.8125rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .modal-table-cell {
            padding: 16px;
            text-align: left;
            background-color: #ffffff;
            border: none;
            font-size: 0.875rem;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
        }

        .modal-table-row {
            transition: background-color 0.2s;
        }
        .modal-table-row:hover {
            background-color: #f8fafc;
        }
        .modal-table-row td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        .modal-table-row td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        `}
      </style>

      {/* Dimming Overlay */}
      <DimmingOverlay
        isVisible={isOverlayVisible}
        onClick={() => {
          if (menuOpen) setMenuOpen(false);
          if (showInterviewsModal) setShowInterviewsModal(false);
          if (showResumeModal) setShowResumeModal(false);
          if (showPaymentModal) setShowPaymentModal(false);
        }}
      />

      {/* Interviews Modal */}
      {showInterviewsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleInterviewsModal} className="modal-close-button">
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
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Time</th>
                    <th className="modal-table-header">Company</th>
                    <th className="modal-table-header">Role</th>
                    <th className="modal-table-header">Recruiter Mail ID</th>
                    <th className="modal-table-header">Round</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledInterviews.map((interview) => (
                    <tr key={interview.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{interview.date}</div>
                      </td>
                      <td className="modal-table-cell">{interview.time}</td>
                      <td style={{fontWeight: '600'}} className="modal-table-cell">{interview.company}</td>
                      <td className="modal-table-cell">{interview.role}</td>
                      <td className="modal-table-cell">{interview.recruiterMailId}</td>
                      <td className="modal-table-cell">
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            interview.round === 'Round 1' ? '#EFF6FF' :
                            interview.round === 'Round 2' ? '#ECFDF5' :
                            interview.round === 'Round 3' ? '#FEF3C7' : '#F3E8FF',
                          color:
                            interview.round === 'Round 1' ? '#1D4ED8' :
                            interview.round === 'Round 2' ? '#047857' :
                            interview.round === 'Round 3' ? '#92400E' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {interview.round}
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
            <button onClick={toggleResumeModal} className="modal-close-button">
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
              Resume Updates
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Update Type</th>
                    <th className="modal-table-header">Status</th>
                    <th className="modal-table-header">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumeUpdates.map((update) => (
                    <tr key={update.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{update.date}</div>
                      </td>
                      <td style={{fontWeight: '600'}} className="modal-table-cell">{update.type}</td>
                      <td className="modal-table-cell">
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
                      <td className="modal-table-cell">{update.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Download Button with Animation (using a CSS class now) */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleDownloadResume}
                className="download-button" // Applying the CSS class
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Latest Resume
              </button>
              {latestResumeUpdate && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                  Last updated: {formattedLatestResumeDate}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Plan Modal */}
      {showPaymentModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '600px', padding: '40px', background: '#334155' }}> {/* Dark background for glass effect */}
            <button onClick={togglePaymentModal} className="modal-close-button">
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
            <div className="radio-group">
              <input
                type="radio"
                name="plan"
                id="glass-silver"
                checked={selectedRadioPlan === 'glass-silver'}
                onChange={() => handleRadioPlanChange('glass-silver')}
                className="hidden-radio-input"
              />
              <label htmlFor="glass-silver" className="radio-label-base">
                Silver
              </label>

              <input
                type="radio"
                name="plan"
                id="glass-gold"
                checked={selectedRadioPlan === 'glass-gold'}
                onChange={() => handleRadioPlanChange('glass-gold')}
                className="hidden-radio-input"
              />
              <label htmlFor="glass-gold" className="radio-label-base">
                Gold
              </label>

              <input
                type="radio"
                name="plan"
                id="glass-platinum"
                checked={selectedRadioPlan === 'glass-platinum'}
                onChange={() => handleRadioPlanChange('glass-platinum')}
                className="hidden-radio-input"
              />
              <label htmlFor="glass-platinum" className="radio-label-base">
                Platinum
              </label>
              <div className="radio-glider" style={getGliderDynamicStyle()} />
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
        zIndex: 100, // Higher z-index for sidebar
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
          Mukesh Ambani
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
          className="renew-plan-button"
        >
          Renew Plan
        </button>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Bottom Links */}
        <button
          onClick={() => navigate('/contactus')}
          className="help-support-button"
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
          className="logout-button"
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
            className="back-button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <button
            onClick={toggleMenu}
            className="menu-toggle-button"
          >
            &#9776;
          </button>
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

        {/* New container for Chart and Advertisements */}
        <div className="chart-and-ads-container">
          {/* Left Advertisement */}
          <div className="ad-column">
            <div className="ad-placeholder">
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '10px' }}>Sponsored</p>
              <img src="https://placehold.co/120x300/e0f2f7/475569?text=Your+Ad" alt="Advertisement 1" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/120x300/e0f2f7/475569?text=Ad+Load+Error'}}/>
              <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>Discover new opportunities!</p>
            </div>
          </div>

          {/* Chart Section */}
          <div style={chartSectionStyle}> {/* Keep chartSectionStyle inline for transitions */}
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

          {/* Right Advertisement */}
          <div className="ad-column">
            <div className="ad-placeholder">
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '10px' }}>Promoted</p>
              <img src="https://placehold.co/120x300/f0f9ff/475569?text=Another+Ad" alt="Advertisement 2" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/120x300/f0f9ff/475569?text=Ad+Load+Error'}}/>
              <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>Boost your career today!</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/clientworksheet')}
            className="worksheet-button"
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
            className="interviews-card"
          >
            {/* Background elements, keep inline for now as they don't have pseudo-classes */}
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
            className="resume-card"
          >
            {/* Background elements, keep inline for now as they don't have pseudo-classes */}
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
                RESUME UPDATES
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: '0.9',
                marginTop: '8px',
                fontWeight: '400'
              }}>
                {filteredResumeUpdates.length} recent updates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (kept as constants for clarity, but they are NOT inline styles with pseudo-classes) ---
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

const chartSectionStyle = {
  width: '100%',
  maxWidth: '1000px',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0'
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
};

export default ClientDashboard;
