import React from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from 'react-bootstrap';

const LineChartComponent = () => {
  // Chart Data
  const data = {
    labels: ['01 Jun 2025', '01 Jul 2025', '01 Aug 2025', '01 Sep 2025', '01 Oct 2025', '01 Nov 2025', '01 Dec 2025'],
    datasets: [
      {
        label: 'LinkedIn',
        data: [3, 20, 25, 22, 28, 30, 27],
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        pointBackgroundColor: '#007bff',
        fill: false,
      },
      {
        label: 'Indeed',
        data: [5, 19, 22, 24, 26, 28, 25],
        borderColor: '#6c757d',
        backgroundColor: '#6c757d',
        pointBackgroundColor: '#6c757d',
        fill: false,
      },
      {
        label: 'Glassdoor',
        data: [7, 18, 20, 21, 23, 25, 22],
        borderColor: '#28a745',
        backgroundColor: '#28a745',
        pointBackgroundColor: '#28a745',
        fill: false,
      },
      {
        label: 'Other',
        data: [9, 17, 19, 20, 22, 24, 21],
        borderColor: '#dc3545',
        backgroundColor: '#dc3545',
        pointBackgroundColor: '#dc3545',
        fill: false,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: ${context.parsed.y}`;
            }
            return context.parsed.y;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return (
    <div className="line-chart-container">
      {/* Line Chart */}
      <Line data={data} options={options} />

      {/* Buttons Below Chart */}
      <div className="button-group mt-4 d-flex justify-content-center gap-3">
        <Button variant="primary">Work Sheet</Button>
      </div>

      {/* Large Rectangular Buttons */}
      <div className="large-buttons mt-5 d-flex justify-content-center gap-5">
        <div className="btn-large bg-dark text-white p-5 rounded">
          INTERVIEWS SCHEDULED
        </div>
        <div className="btn-large bg-primary text-white p-5 rounded">
          UPDATED RESUME & JOB PORTAL FILE
        </div>
      </div>
    </div>
  );
};

export default LineChartComponent;