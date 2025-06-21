import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const navigate = useNavigate();

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Applications Submitted',
        data: [12, 15, 18, 14],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Applications Reviewed',
        data: [8, 10, 12, 9],
        backgroundColor: '#60a5fa',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'LinkedIn',
        data: [10, 12, 15, 14],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f633',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Indeed',
        data: [8, 10, 12, 9],
        borderColor: '#06b6d4',
        backgroundColor: '#06b6d433',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Company Sites',
        data: [6, 7, 8, 5],
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/admindashboard')}
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
          marginBottom: '20px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <h2 style={{ marginBottom: '30px' }}>Comprehensive Reports Dashboard</h2>

      {/* Summary Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Applications in Period', value: '0', trend: 'No data' },
          { label: 'Response Rate', value: '0.0%', trend: '+8% from last period' },
          { label: 'Interview Rate', value: '0.0%', trend: '+12% from last period' },
          { label: 'Avg Response Time', value: '3.2 days', trend: '-0.5 days improvement' },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontWeight: 600 }}>{item.label}</p>
            <h3>{item.value}</h3>
            <span style={{ color: 'green' }}>{item.trend}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', minHeight: '400px' }}>
          <h4 style={{ marginBottom: '10px' }}>Weekly Application Trends</h4>
          <Bar data={barData} options={barOptions} />
        </div>

        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', minHeight: '400px' }}>
          <h4 style={{ marginBottom: '10px' }}>Application Sources</h4>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Report;
