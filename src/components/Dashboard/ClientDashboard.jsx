import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// Main Header Component that includes the logo and user information
const MainHeader = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="logo">Tech<span className="blue-x">X</span>plorers</div>
      <div className="header-icons">
        <span className="icon notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </span>
        <span className="icon theme-icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m4.93 19.07 1.41-1.41"></path>
              <path d="m17.66 6.34 1.41-1.41"></path>
            </svg>
          )}
        </span>
        <span className="icon user-icon">J</span>
        <span className="user-name">John Client</span>
        <span className="icon dropdown-icon">&#9662;</span>
      </div>
    </header>
  );
};

// Component for the Job Applications Table
const JobApplicationsTable = () => {
  const applications = [
    { id: 1, jobTitle: 'Senior Frontend Developer', location: 'San Francisco, CA', company: 'TechFlow Inc.', platform: 'LinkedIn', date: '06/20/2025', salary: '$95,000 - $125,000' },
    { id: 2, jobTitle: 'React Developer', location: 'Remote', company: 'StartupXYZ', platform: 'Indeed', date: '06/18/2025', salary: '$95,000 - $125,000' },
    { id: 3, jobTitle: 'Full Stack Engineer', location: 'New York, NY', company: 'Innovate Co.', platform: 'Company Site', date: '06/15/2025', salary: '$110,000 - $140,000' },
    { id: 4, jobTitle: 'Data Scientist', location: 'Remote', company: 'DataDriven LLC', platform: 'LinkedIn', date: '06/14/2025', salary: '$120,000 - $150,000' },
    { id: 5, jobTitle: 'UI/UX Designer', location: 'Austin, TX', company: 'Creative Solutions', platform: 'Dribbble', date: '06/12/2025', salary: '$85,000 - $115,000' },
  ];

  return (
    <div className="applications-table-container">
      <div className="table-header-controls">
        <div className="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input type="text" placeholder="Search applications..." className="search-input" />
        </div>
        <div className="filters">
          <div className="filter-dropdown">
            <select>
              <option>All Statuses</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
          </div>
          <div className="filter-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
            <input type="text" placeholder="From Date" className="date-input" />
          </div>
          <div className="filter-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
            <input type="text" placeholder="To Date" className="date-input" />
          </div>
        </div>
      </div>
      <div className="job-table">
        <div className="table-header">
          <div className="th">Job Title</div>
          <div className="th">Company</div>
          <div className="th">Platform</div>
          <div className="th">Applied Date</div>
          <div className="th">Salary Range</div>
          <div className="th">Actions</div>
        </div>
        {applications.map(app => (
          <div className="table-row" key={app.id}>
            <div className="td">
              <div className="job-title-main">{app.jobTitle}</div>
              <div className="job-location">{app.location}</div>
            </div>
            <div className="td">{app.company}</div>
            <div className="td">
              <span className="platform-tag">{app.platform}</span>
            </div>
            <div className="td">{app.date}</div>
            <div className="td">{app.salary}</div>
            <div className="td table-actions">
              <button className="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3 7 10 7 10-7 10-7-3-7-10-7-10 7-10 7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button className="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-9.5"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 16.5l-2 2-2-2"></path><path d="M8 18.5V12.5"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for the Documents Dashboard
const DocumentsDashboard = () => {
  const [docTab, setDocTab] = useState('Resumes');

  const documents = {
    Resumes: [
      { name: 'john_anderson_resume_2025.pdf' },
      { name: 'john_anderson_me_tech_focused.pdf' },
      { name: 'john_anderson_frontend_dev_resume.pdf' },
    ],
    'Cover Letters': [
      { name: 'cover_letter_google.pdf' },
      { name: 'cover_letter_microsoft.pdf' },
      { name: 'cover_letter_apple.pdf' },
    ],
    Interviews: [
      { name: 'interview_prep_notes.pdf' },
      { name: 'interview_feedback_techflow.pdf' },
      { name: 'interview_questions_innovate.pdf' },
    ],
    'Offer Letters': [
      { name: 'offer_letter_startupXYZ.pdf' },
      { name: 'offer_letter_dataDriven.pdf' },
    ],
  };

  const getDocCount = (docType) => {
    return documents[docType].length;
  };

  const getDocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  );

  const getTabIcon = (tabName) => {
    switch (tabName) {
      case 'Resumes':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 15h2"></path><path d="M8 19h8"></path><path d="M12 11h4"></path></svg>;
      case 'Cover Letters':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M10 2v4"></path><path d="M12 12h6"></path><path d="M12 16h6"></path><path d="M12 8h6"></path></svg>;
      case 'Interviews':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'Offer Letters':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 17H4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12z"></path><path d="M12 9l-4 4l4 4"></path><path d="M12 9l4 4l-4 4"></path></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="documents-dashboard">
      <h2 className="documents-heading">My Documents</h2>
      <div className="document-tabs">
        {['Resumes', 'Cover Letters', 'Interviews', 'Offer Letters'].map(tab => (
          <div key={tab} className={`document-tab-item ${docTab === tab ? 'active' : ''}`} onClick={() => setDocTab(tab)}>
            {getTabIcon(tab)}
            <span>{tab} ({getDocCount(tab)})</span>
          </div>
        ))}
      </div>
      <div className="document-grid">
        {documents[docTab].map((doc, index) => (
          <div key={index} className="document-card">
            {getDocumentIcon()}
            <p className="document-name">{doc.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const ClientDashboard = () => {
  // State to manage the theme. 'light' is the default.
  const [theme, setTheme] = useState('light');
  // State to manage which service page or path is currently active.
  const [selectedPath, setSelectedPath] = useState(null);
  // State to show a message after clicking "Notify me".
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);
  // State to manage the active tab on the Job Application dashboard
  const [activeTab, setActiveTab] = useState('Analytics');

  // Add an effect to apply the theme class to the body element
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handler for "View Dashboard" buttons for all services
  const handleViewDashboardClick = (serviceName) => {
    setSelectedPath(serviceName);
    setActiveTab('Analytics'); // Reset to Analytics when navigating to a service
    setShowNotifyMessage(false); // Reset message when a new page is shown
  };

  // Handler for the "Notify me" button
  const handleNotifyMeClick = () => {
    setShowNotifyMessage(true);
  };

  // Handler to go back to the main dashboard view
  const handleGoBack = () => {
    setSelectedPath(null);
    setShowNotifyMessage(false);
  };

  // Handler to change the active tab within the Job Application dashboard
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Conditional rendering based on the selected path
  const renderContent = () => {
    if (selectedPath === 'Job Application') {
      // Content for the unique "Job Application" page, mirroring the provided image.
      return (
        <div className="job-app-dashboard-container">
          <div className="back-container">
            <button className="back-btn" onClick={handleGoBack}>← Go Back</button>
          </div>
          <div className="job-app-main-content">
            <h1 className="job-app-main-heading">Job Application Dashboard</h1>
            <div className="job-app-tabs">
              <span className={`job-app-tab ${activeTab === 'Analytics' ? 'active' : ''}`} onClick={() => handleTabChange('Analytics')}>Analytics</span>
              <span className={`job-app-tab ${activeTab === 'Applications' ? 'active' : ''}`} onClick={() => handleTabChange('Applications')}>Applications</span>
              <span className={`job-app-tab ${activeTab === 'Documents' ? 'active' : ''}`} onClick={() => handleTabChange('Documents')}>Documents</span>
            </div>

            {activeTab === 'Analytics' && (
              <>
                <div className="job-app-card-grid">
                  {/* Total Applications Card */}
                  <div className="job-app-card">
                    <div className="card-top">
                      <div className="card-title">Total Applications</div>
                      <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    </div>
                    <div className="card-value">5</div>
                    <div className="card-subtext">+5 from last month</div>
                  </div>

                  {/* Interview Rate Card */}
                  <div className="job-app-card">
                    <div className="card-top">
                      <div className="card-title">Interview Rate</div>
                      <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 16 12 10 6 16 2 12" /></svg>
                    </div>
                    <div className="card-value">40%</div>
                    <div className="card-subtext">2 interviews</div>
                  </div>

                  {/* Offer Rate Card */}
                  <div className="job-app-card">
                    <div className="card-top">
                      <div className="card-title">Offer Rate</div>
                      <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                    </div>
                    <div className="card-value">20%</div>
                    <div className="card-subtext">1 offers</div>
                  </div>

                  {/* Top Platform Card */}
                  <div className="job-app-card">
                    <div className="card-top">
                      <div className="card-title">Top Platform</div>
                      <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.5" /><path d="M10 14L2 6" /><path d="M14 14L22 6" /><path d="M12 17v-13" /></svg>
                    </div>
                    <div className="card-value">LinkedIn</div>
                    <div className="card-subtext">28 applications</div>
                  </div>
                </div>

                <div className="job-app-chart-grid">
                  {/* Application Funnel */}
                  <div className="job-app-chart-card">
                    <h3>Application Funnel</h3>
                    <p>Status of all applications</p>
                    <div className="chart-content funnel-chart-container">
                      <div className="funnel-labels">
                        <span className="funnel-label">Applied</span>
                        <span className="funnel-label">Interview</span>
                        <span className="funnel-label">Offer</span>
                      </div>
                      <div className="funnel-bars-container">
                        <div className="funnel-bar-wrapper">
                          <div className="funnel-bar applied" style={{ width: '80%' }}></div>
                        </div>
                        <div className="funnel-bar-wrapper">
                          <div className="funnel-bar interview" style={{ width: '40%' }}></div>
                        </div>
                        <div className="funnel-bar-wrapper">
                          <div className="funnel-bar offer" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Applications Chart */}
                  <div className="job-app-chart-card">
                    <h3>Daily Applications (Last 7 Days)</h3>
                    <p>Application volume over the past week.</p>
                    <div className="chart-content daily-chart-container">
                      <div className="y-axis">
                        <span>8</span>
                        <span>6</span>
                        <span>4</span>
                        <span>2</span>
                        <span>0</span>
                      </div>
                      <div className="x-axis-bars">
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '50%' }}></div><span className="x-label">Mon 12/16</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '70%' }}></div><span className="x-label">Tue 12/17</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '20%' }}></div><span className="x-label">Wed 12/18</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '10%' }}></div><span className="x-label">Thu 12/19</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '30%' }}></div><span className="x-label">Fri 12/20</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '10%' }}></div><span className="x-label">Sat 12/21</span></div>
                        <div className="bar-wrapper"><div className="daily-bar" style={{ height: '5%' }}></div><span className="x-label">Sun 12/22</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Where Applications Were Sent */}
                <div className="job-app-chart-card full-width">
                  <h3>Where Applications Were Sent</h3>
                  <p>Breakdown of application sources.</p>
                  <div className="chart-content scatter-chart-container">
                    <div className="point" style={{ top: '65%', left: '15%', backgroundColor: '#64a1ff' }}>18</div>
                    <div className="point" style={{ top: '30%', left: '30%', backgroundColor: '#ff9900' }}>22</div>
                    <div className="point" style={{ top: '20%', left: '55%', backgroundColor: '#66c986' }}>28</div>
                    <div className="point" style={{ top: '40%', left: '70%', backgroundColor: '#e9606d' }}>4</div>
                    <div className="point" style={{ top: '55%', left: '78%', backgroundColor: '#a664ff' }}>8</div>
                    <div className="point" style={{ top: '75%', left: '85%', backgroundColor: '#e666ff' }}>15</div>
                    <div className="legend">
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#64a1ff' }}></span>LinkedIn</div>
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#ff9900' }}></span>Indeed</div>
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#66c986' }}></span>Company Sites</div>
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#a664ff' }}></span>AngelList</div>
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#e9606d' }}></span>Referrals</div>
                      <div className="legend-item"><span className="dot" style={{ backgroundColor: '#e666ff' }}></span>Other</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Applications' && <JobApplicationsTable />}

            {activeTab === 'Documents' && <DocumentsDashboard />}

          </div>
        </div>
      );
    } else if (selectedPath === 'IT Talent Supply') {
      // Content for the unique "IT Talent Supply" page
      return (
        <div className="talent-supply-container">
          <div className="back-container">
            <button className="back-btn" onClick={handleGoBack}>← Go Back</button>
          </div>
          <div className="talent-supply-content">
            <h1 className="talent-supply-heading">IT Talent Supply</h1>
            <p className="talent-supply-text">
              We provide top-tier IT talent to meet your specific project needs. Our rigorous selection process ensures you get the best professionals in the industry.
            </p>
            <div className="talent-supply-cards-container">
              <div className="talent-supply-card">
                <h3 className="talent-supply-card-heading">Find a Developer</h3>
                <p className="talent-supply-card-text">
                  Discover skilled developers for front-end, back-end, and full-stack projects.
                </p>
              </div>
              <div className="talent-supply-card">
                <h3 className="talent-supply-card-heading">UX/UI Designers</h3>
                <p className="talent-supply-card-text">
                  Get creative and experienced designers to craft seamless user experiences.
                </p>
              </div>
              <div className="talent-supply-card">
                <h3 className="talent-supply-card-heading">Data Scientists</h3>
                <p className="talent-supply-card-text">
                  Access experts in data analysis, machine learning, and AI to unlock insights.
                </p>
              </div>
            </div>
            <button className="contact-us-btn" onClick={handleGoBack}>Contact Us</button>
          </div>
        </div>
      );
    } else if (selectedPath) {
      return (
        <div className="under-development-container">
          <div className="back-container">
            <button className="back-btn" onClick={handleGoBack}>← Go Back</button>
          </div>
          <div className="development-message">
            <h2>{selectedPath} Dashboard</h2>
            <p>This dashboard is currently under development. We will update you as soon as it's ready!</p>
            {!showNotifyMessage ? (
              <button className="notify-btn" onClick={handleNotifyMeClick}>Notify me</button>
            ) : (
              <p className="notify-success-message">Once it's ready, we will send you an email notification. Thank you!</p>
            )}
          </div>
        </div>
      );
    } else {
      // Main dashboard content
      return (
        <>
          <section className="summer-savings">
            <div className="savings-content">
              <span className="limited-time-offer">Limited-time offer</span>
              <h1>Exclusive Summer Savings!</h1>
              <p>Save 10% on top solutions to help grow your business.</p>
              <div className="services-list">
                <div className="service-item">
                  <span className="check-mark">&#10003;</span>
                  Recruiting & Onboarding
                </div>
                <div className="service-item">
                  <span className="check-mark">&#10003;</span>
                  Data Connectors
                </div>
                <div className="service-item">
                  <span className="check-mark">&#10003;</span>
                  Compliance & Consulting
                </div>
                <div className="service-item">
                  <span className="check-mark">&#10003;</span>
                  Time & Labor Management
                </div>
                <div className="service-item">
                  <span className="check-mark">&#10003;</span>
                  Productivity & Collaboration
                </div>
              </div>
              <button className="explore-deals-btn">Explore Deals</button>
            </div>
            <div className="savings-image-container">
              <img src="https://www.palomar.edu/onlineeducation/wp-content/uploads/sites/20/2017/01/woman-sharing-her-presentation-with-her-colleagues-3153198.jpg" alt="A group of people collaborating at a table" className="savings-image" />
            </div>
          </section>

          <section className="services-browse">
            <h2>Browse Our Services</h2>
            <p>Find the right tools to accelerate your growth.</p>
            <div className="services-grid">
              <div className="service-card">
                <div className="card-icon-container job-app-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                    <path d="M16 2a4 4 0 0 0-4 4v1h-2v-1a4 4 0 0 0-4-4"></path>
                  </svg>
                </div>
                <h3>Job Application</h3>
                <p>Streamline your hiring process with our job application tracking system.</p>
                <button className="dashboard-btn" onClick={() => handleViewDashboardClick('Job Application')}>View Dashboard →</button>
              </div>
              <div className="service-card">
                <div className="card-icon-container mobile-app-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <path d="M12 18h.01"></path>
                  </svg>
                </div>
                <h3>Mobile App Development</h3>
                <p>Track project progress, bug reports, and user engagement for your mobile applications.</p>
                <button className="dashboard-btn" onClick={() => handleViewDashboardClick('Mobile App Development')}>View Dashboard →</button>
              </div>
              <div className="service-card">
                <div className="card-icon-container web-app-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3>Web App Development</h3>
                <p>Monitor website uptime, user engagement, and feature deployment for your web projects.</p>
                <button className="dashboard-btn" onClick={() => handleViewDashboardClick('Web App Development')}>View Dashboard →</button>
              </div>
              <div className="service-card">
                <div className="card-icon-container digital-marketing-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z"></path>
                    <path d="M12 8l4 4-4 4V8z"></path>
                    <path d="M12 8l-4 4 4 4-4-4z"></path>
                  </svg>
                </div>
                <h3>Digital Marketing</h3>
                <p>Analyze campaign performance, conversion rates, and social media reach.</p>
                <button className="dashboard-btn" onClick={() => handleViewDashboardClick('Digital Marketing')}>View Dashboard →</button>
              </div>
              <div className="service-card">
                <div className="card-icon-container it-talent-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>IT Talent Supply</h3>
                <p>Manage talent placement, skill matching, and client satisfaction metrics.</p>
                <Link to="/services/it-talent-supply" className="book-now-btn">
                  Book Now
                </Link>
              </div>
              <div className="service-card">
                <div className="card-icon-container cybersecurity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Cybersecurity Analytics</h3>
                <p>View security health scores, threat detection rates, and compliance status.</p>
                <button className="dashboard-btn" onClick={() => handleViewDashboardClick('Cybersecurity Analytics')}>View Dashboard →</button>
              </div>
            </div>
          </section>
        </>
      );
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Basic page and font setup */
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, color 0.3s ease;
            height: 100vh;
            overflow: auto;
          }

          /* Full-screen container */
          .dashboard-container {
            width: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 0 20px;
            box-sizing: border-box;
          }
          
          /* Main content to center on large screens while allowing it to flow on smaller ones */
          .main-content-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 0;
          }

          /* Header styling */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid;
          }

          .logo {
            font-size: 24px;
            font-weight: 700;
          }
          
          .logo .blue-x {
            color: #007bff;
          }

          .header-icons {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .icon {
            font-size: 24px;
            cursor: pointer;
            transition: color 0.3s ease;
          }

          .user-icon {
            width: 30px;
            height: 30px;
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
          }

          .user-name {
            font-size: 16px;
            font-weight: 500;
          }

          /* Summer Savings Section */
          .summer-savings {
            display: flex;
            border-radius: 12px;
            overflow: hidden;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }

          .savings-content {
            padding: 40px;
            flex: 1;
          }

          .limited-time-offer {
            display: inline-block;
            background-color: #e6f3ff;
            color: #007bff;
            font-size: 14px;
            font-weight: 600;
            padding: 5px 12px;
            border-radius: 20px;
          }

          .savings-content h1 {
            font-size: 40px;
            font-weight: 700;
            margin: 15px 0 10px;
          }

          .back-container {
            margin-bottom: 20px;
            display: flex;
            justify-content: flex-start; /* Aligns button to the left */
          }

          .savings-content p {
            font-size: 16px;
            margin-bottom: 20px;
            transition: color 0.3s ease;
          }

          .services-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 30px;
          }

          .service-item {
            display: flex;
            align-items: center;
            font-size: 16px;
            transition: color 0.3s ease;
          }

          .check-mark {
            color: #007bff;
            font-weight: bold;
            font-size: 18px;
            margin-right: 8px;
          }

          .explore-deals-btn {
            color: white;
            background-color: #007bff;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .explore-deals-btn:hover {
            background-color: #3399FF;
          }

          .savings-image-container {
            flex: 1;
            max-width: 50%;
          }

          .savings-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0 12px 12px 0;
          }

          /* Browse Our Services Section */
          .services-browse {
            margin-top: 50px;
          }

          .services-browse h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
          }

          .services-browse p {
            font-size: 16px;
            margin-bottom: 30px;
            transition: color 0.3s ease;
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .service-card {
            border-radius: 12px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }

          .card-icon-container {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #e6f3ff;
            color: #007bff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
          }

          .service-card h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 15px 0 5px;
          }

          .service-card p {
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            transition: color 0.3s ease;
          }

          .dashboard-btn, .book-now-btn {
            color: white;
            padding: 12px 0;
            width: 100%;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s ease;
          }

          .book-now-btn {
            background-color: #007bff;
          }

          .dashboard-btn {
            background-color: #007bff;
          }

          .dashboard-btn:hover {
            background-color: #3399FF;
          }

          .book-now-btn:hover {
            background-color: #3399FF;
          }
          
          /* Dark theme specific styles */
          body.dark-theme {
            background-color: #1a1a1a;
            color: #e0e0e0;
          }

          body.dark-theme .header {
            border-bottom-color: #333;
          }

          body.dark-theme .logo {
            color: #fff;
          }
          
          body.dark-theme .icon {
            color: #e0e0e0;
          }

          body.dark-theme .user-name {
            color: #e0e0e0;
          }

          body.dark-theme .summer-savings, body.dark-theme .service-card {
            background-color: #2c2c2c;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }
          
          body.dark-theme .savings-content h1, 
          body.dark-theme .services-browse h2, 
          body.dark-theme .service-card h3 {
            color: #fff;
          }
          
          body.dark-theme .savings-content p, 
          body.dark-theme .services-browse p, 
          body.dark-theme .service-card p {
            color: #b0b0b0;
          }

          body.dark-theme .explore-deals-btn,
          body.dark-theme .dashboard-btn {
            background-color: #0056b3;
          }
          
          body.dark-theme .explore-deals-btn:hover,
          body.dark-theme .dashboard-btn:hover {
            background-color: #002e5c;
          }
          
          body.dark-theme .book-now-btn {
            background-color: #66a8ff;
            color: #1a1a1a;
          }
          
          body.dark-theme .book-now-btn:hover {
            background-color: #3399FF;
          }

          /* New styles for under development and service pages */
          .under-development-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }
          
          .back-btn {
            position: relative; /* Changed from absolute to relative */
            top: auto;
            left: auto;
            margin-bottom: 20px; /* Added margin to push it above the main content */
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background-color: #f0f0f0;
            color: #333;
            transition: background-color 0.3s ease;
          }
          body.dark-theme .back-btn {
            background-color: #555;
            color: #eee;
          }
          
          .back-btn:hover {
            background-color: #e0e0e0;
          }
          
          body.dark-theme .back-btn:hover {
            background-color: #666;
          }

          .development-message {
            margin-top: 20px;
            font-size: 20px;
            line-height: 1.6;
          }
          
          .development-message h2 {
            font-size: 32px;
            margin-bottom: 10px;
          }
          
          .notify-btn {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
          }

          .notify-success-message {
            color: #28a745;
            font-weight: 500;
            margin-top: 20px;
          }

          /* Job Application Dashboard styles */
          .job-app-dashboard-container {
            padding: 20px;
          }
          
          .job-app-main-heading {
            font-size: 32px;
            margin-top: 0;
            margin-bottom: 10px;
          }
          
          .job-app-tabs {
            display: flex;
            gap: 20px;
            border-bottom: 2px solid #ddd;
            margin-bottom: 30px;
          }

          body.dark-theme .job-app-tabs {
            border-bottom-color: #444;
          }

          .job-app-tab {
            padding: 10px 0;
            cursor: pointer;
            font-weight: 500;
            transition: border-bottom 0.3s ease, color 0.3s ease;
          }
          
          .job-app-tab.active {
            border-bottom: 2px solid #007bff;
            color: #007bff;
          }
          
          body.dark-theme .job-app-tab.active {
            color: #66a8ff;
            border-bottom-color: #66a8ff;
          }

          .job-app-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .job-app-card {
            padding: 25px;
            border-radius: 12px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          
          body.dark-theme .job-app-card {
            background-color: #2c2c2c;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }

          .card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .card-title {
            font-size: 16px;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          
          .card-icon {
            color: #007bff;
          }
          
          .card-value {
            font-size: 36px;
            font-weight: 700;
            transition: color 0.3s ease;
          }
          
          .card-subtext {
            font-size: 14px;
            color: #666;
            transition: color 0.3s ease;
          }
          
          body.dark-theme .card-subtext {
            color: #b0b0b0;
          }

          .job-app-chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .job-app-chart-card {
            padding: 25px;
            border-radius: 12px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }

          body.dark-theme .job-app-chart-card {
            background-color: #2c2c2c;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }
          
          .job-app-chart-card.full-width {
            grid-column: 1 / -1;
          }
          
          .job-app-chart-card h3 {
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 5px;
            transition: color 0.3s ease;
          }

          .job-app-chart-card p {
            font-size: 14px;
            color: #666;
            margin-top: 0;
            transition: color 0.3s ease;
          }
          
          body.dark-theme .job-app-chart-card p {
            color: #b0b0b0;
          }
          
          .chart-content {
            margin-top: 20px;
          }
          
          /* Funnel Chart Specifics */
          .funnel-chart-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .funnel-labels {
            display: flex;
            justify-content: space-around;
            font-size: 14px;
            font-weight: 500;
          }
          
          .funnel-bar-wrapper {
            position: relative;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
          }
          
          body.dark-theme .funnel-bar-wrapper {
            background-color: #444;
          }

          .funnel-bar {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s ease;
          }
          
          .funnel-bar.applied { background-color: #007bff; }
          .funnel-bar.interview { background-color: #ff9900; }
          .funnel-bar.offer { background-color: #28a745; }
          
          /* Daily Applications Chart Specifics */
          .daily-chart-container {
            display: flex;
            align-items: flex-end;
            gap: 5px;
            padding-bottom: 10px;
            position: relative;
          }

          .y-axis {
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            height: 150px;
            padding-right: 10px;
            border-right: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }

          body.dark-theme .y-axis {
            border-right-color: #444;
            color: #b0b0b0;
          }

          .x-axis-bars {
            display: flex;
            height: 150px;
            gap: 10px;
            flex-grow: 1;
            align-items: flex-end;
          }
          
          .bar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            flex-grow: 1;
          }

          .daily-bar {
            width: 30px;
            background-color: #007bff;
            border-radius: 5px;
            margin-bottom: 5px;
            transition: height 0.5s ease;
          }
          
          .x-label {
            font-size: 12px;
            color: #666;
            margin-top: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 60px;
          }
          
          body.dark-theme .x-label {
            color: #b0b0b0;
          }

          /* Scatter Chart Specifics */
          .scatter-chart-container {
            position: relative;
            width: 100%;
            height: 250px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 20px;
          }
          
          body.dark-theme .scatter-chart-container {
            border-color: #444;
          }

          .point {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transform: translate(-50%, -50%);
          }
          
          .legend {
            position: absolute;
            bottom: 10px;
            left: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .legend-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;
          }
          
          body.dark-theme .legend-item {
            color: #e0e0e0;
          }
          
          .legend-item .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
          }
          
          /* IT Talent Supply Page Styles */
          .talent-supply-container {
            padding: 40px 20px;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .talent-supply-heading {
            font-size: 36px;
            margin-top: 0;
            margin-bottom: 10px;
          }
          
          .talent-supply-text {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 40px;
          }
          
          .talent-supply-cards-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .talent-supply-card {
            padding: 30px;
            border-radius: 12px;
            text-align: left;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          
          body.dark-theme .talent-supply-card {
            background-color: #2c2c2c;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }

          .talent-supply-card-heading {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 10px;
          }
          
          .talent-supply-card-text {
            font-size: 16px;
            margin: 0;
          }
          
          .contact-us-btn {
            background-color: #007bff;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          
          .contact-us-btn:hover {
            background-color: #3399FF;
          }
          
          /* New styles for applications table */
          .applications-table-container {
            margin-top: 20px;
          }

          .applications-table-container h2 {
            font-size: 28px;
            margin-top: 0;
          }

          .table-header-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .search-box {
            display: flex;
            align-items: center;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 8px 12px;
            flex-grow: 1;
            max-width: 300px;
          }
          
          body.dark-theme .search-box {
            border-color: #555;
          }
          
          .search-box svg {
            color: #999;
            margin-right: 8px;
          }
          
          .search-input {
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
          }

          body.dark-theme .search-input {
            color: #e0e0e0;
          }

          .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            flex-grow: 1;
            justify-content: flex-end;
          }
          
          .filter-dropdown, .filter-date {
            position: relative;
            display: flex;
            align-items: center;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
          }
          
          body.dark-theme .filter-dropdown, body.dark-theme .filter-date {
            border-color: #555;
          }

          .filter-dropdown select {
            border: none;
            outline: none;
            background: transparent;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding-right: 20px; /* Space for the dropdown icon */
            cursor: pointer;
          }

          body.dark-theme .filter-dropdown select {
            color: #e0e0e0;
          }

          .filter-dropdown svg {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
          }

          .filter-date svg {
            margin-right: 8px;
            color: #999;
          }
          
          .date-input {
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
          }
          
          body.dark-theme .date-input {
            color: #e0e0e0;
          }

          .job-table {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }

          body.dark-theme .job-table {
            border-color: #444;
          }

          .table-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr 1fr;
            background-color: #f5f5f5;
            padding: 15px 20px;
            font-weight: 600;
          }
          
          body.dark-theme .table-header {
            background-color: #333;
          }
          
          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr 1fr;
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            align-items: center;
          }
          
          body.dark-theme .table-row {
            border-bottom-color: #444;
          }

          .table-row:last-child {
            border-bottom: none;
          }

          .job-title-main {
            font-weight: 500;
          }

          .job-location {
            font-size: 12px;
            color: #666;
          }
          
          body.dark-theme .job-location {
            color: #aaa;
          }

          .platform-tag {
            background-color: #e6f3ff;
            color: #007bff;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }

          .table-actions {
            display: flex;
            gap: 5px;
          }
          
          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
          
          .action-btn:hover {
            background-color: #f0f0f0;
          }

          body.dark-theme .action-btn {
            color: #bbb;
          }
          
          body.dark-theme .action-btn:hover {
            background-color: #555;
          }

          /* New Documents Dashboard Styles */
          .documents-dashboard {
            padding: 20px;
          }

          .documents-heading {
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 20px;
          }

          .document-tabs {
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            margin-bottom: 30px;
          }

          .document-tab-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          body.dark-theme .document-tab-item {
            background-color: #2c2c2c;
            color: #e0e0e0;
          }

          .document-tab-item.active {
            background-color: #007bff;
            color: white;
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
          }
          
          .document-tab-item.active svg {
            stroke: white;
          }

          .document-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
          }

          .document-card {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          
          body.dark-theme .document-card {
            background-color: #2c2c2c;
          }

          .document-card:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          }
          
          body.dark-theme .document-card:hover {
            box-shadow: 0 6px 16px rgba(255, 255, 255, 0.08);
          }
          
          .document-name {
            font-size: 14px;
            font-weight: 500;
            word-break: break-all;
            margin-top: 15px;
            line-height: 1.4;
          }

          /* Responsive adjustments */
          @media (max-width: 1024px) {
            .services-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 768px) {
            .summer-savings {
              flex-direction: column;
              border-radius: 12px;
            }
            .savings-content {
              padding: 20px;
            }
            .savings-image-container {
              max-width: 100%;
              border-radius: 0 0 12px 12px;
            }
            .savings-image {
              border-radius: 0 0 12px 12px;
            }
            .services-list {
              grid-template-columns: 1fr;
            }
            .services-grid {
              grid-template-columns: 1fr;
            }
            .job-app-chart-grid {
              grid-template-columns: 1fr;
            }
            .table-header, .table-row {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              padding: 10px;
            }
            .table-header {
              display: none; /* Hide header on small screens for better flow */
            }
            .table-row {
              flex-direction: column;
              align-items: flex-start;
              border-bottom: 1px solid #eee;
            }
            .table-row:last-child {
              border-bottom: none;
            }
            .td:nth-child(1) { order: 1; }
            .td:nth-child(2) { order: 2; }
            .td:nth-child(3) { order: 3; }
            .td:nth-child(4) { order: 4; }
            .td:nth-child(5) { order: 5; }
            .td:nth-child(6) { order: 6; }
            
            .document-tabs {
                flex-wrap: wrap;
            }
          }
        `}
      </style>
      <div className="dashboard-container">
        <MainHeader theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content-wrapper">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default ClientDashboard;
