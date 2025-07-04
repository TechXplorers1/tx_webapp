import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap'; // Using react-bootstrap Modal

const EmployeeData = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // State for filters (reused across tabs)
  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [quickFilter, setQuickFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All Activities');

  // States for Modals (Applications Tab)
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [newApplicationFormData, setNewApplicationFormData] = useState({
    jobTitle: '', company: '', platform: '', jobUrl: '', salaryRange: '', location: '', notes: ''
  });
  const [selectedClientForApplication, setSelectedClientForApplication] = useState(null);

  const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
  const [viewedApplication, setViewedApplication] = useState(null);

  const [showEditApplicationModal, setShowEditApplicationModal] = useState(false);
  const [editedApplicationFormData, setEditedApplicationFormData] = useState(null);

  // States for Modals (Files Tab)
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [newFileFormData, setNewFileFormData] = useState({
    clientId: '', fileType: '', fileName: '', notes: ''
  });
  const [selectedClientForFile, setSelectedClientForFile] = useState(null);

  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [viewedFile, setViewedFile] = useState(null);

  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [editedFileFormData, setEditedFileFormData] = useState(null);


  // Mock data for employee's assigned clients with job applications and files
  const [assignedClients, setAssignedClients] = useState([
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
      resumeUpdates: [
        { date: '2025-06-21', type: 'Resume', status: 'Updated', details: 'Added new project experience' },
        { date: '2025-06-15', type: 'LinkedIn Profile', status: 'Reviewed', details: 'Optimized keywords' },
        { date: '2025-06-10', type: 'Resume', status: 'Draft 2 Sent', details: 'Revised for client feedback' },
      ],
      jobApplications: [
        { id: 101, jobTitle: 'Full Stack Developer', company: 'WebTech Solutions', platform: 'LinkedIn', status: 'Applied', appliedDate: '2025-06-21', jobUrl: 'https://example.com/job1', salaryRange: '$90,000 - $110,000', location: 'San Francisco, CA', notes: 'Initial application sent.' },
        { id: 102, jobTitle: 'Senior Frontend Developer', company: 'TechFlow Inc', platform: 'LinkedIn', status: 'Interview', appliedDate: '2025-06-20', jobUrl: 'https://example.com/job2', salaryRange: '$100,000 - $120,000', location: 'Remote', notes: 'Interview scheduled for next week.' },
        { id: 103, jobTitle: 'React Developer', company: 'StartupXYZ', platform: 'Indeed', status: 'Applied', appliedDate: '2025-06-19', jobUrl: 'https://example.com/job3', salaryRange: '$80,000 - $100,000', location: 'New York, NY', notes: 'Followed up via email.' },
      ],
      files: [
        { id: 1001, name: 'john_anderson_resume_2025.pdf', size: '245 KB', type: 'resume', status: 'Uploaded', uploadDate: '2025-06-15', notes: '' },
        { id: 1002, name: 'techflow_interview_screenshot.png', size: '1.2 MB', type: 'interview screenshot', status: 'Uploaded', uploadDate: '2025-06-21', notes: 'Interview invitation for Senior Frontend Developer position' },
        { id: 1003, name: 'john_cover_letter.pdf', size: '98 KB', type: 'cover letter', status: 'Uploaded', uploadDate: '2025-06-16', notes: '' },
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
      resumeUpdates: [
        { date: '2025-06-20', type: 'Resume', status: 'Updated', details: 'Design portfolio link added' },
        { date: '2025-06-18', type: 'Glassdoor Profile', status: 'Created', details: 'New profile setup' },
      ],
      jobApplications: [
        { id: 201, jobTitle: 'Product Designer', company: 'DesignCo', platform: 'Behance', status: 'Applied', appliedDate: '2025-06-18', jobUrl: 'https://example.com/job4', salaryRange: '$75,000 - $90,000', location: 'Remote', notes: 'Portfolio reviewed.' },
        { id: 202, jobTitle: 'UI/UX Lead', company: 'InnovateCorp', platform: 'LinkedIn', status: 'Rejected', appliedDate: '2025-06-15', jobUrl: 'https://example.com/job5', salaryRange: '$80,000 - $95,000', location: 'Austin, TX', notes: 'Received rejection email.' },
        { id: 203, jobTitle: 'Junior UX Designer', company: 'CreativeLabs', platform: 'AngelList', status: 'Interview', appliedDate: '2025-06-10', jobUrl: 'https://example.com/job6', salaryRange: '$60,000 - $75,000', location: 'San Diego, CA', notes: 'First round interview completed.' },
      ],
      files: [
        { id: 2001, name: 'sarah_portfolio.pdf', size: '3.5 MB', type: 'portfolio', status: 'Uploaded', uploadDate: '2025-06-18', notes: '' },
        { id: 2002, name: 'sarah_resume.docx', size: '150 KB', type: 'resume', status: 'Uploaded', uploadDate: '2025-06-20', notes: 'Latest version' },
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
      resumeUpdates: [
        { date: '2025-06-19', type: 'Resume', status: 'Updated', details: 'Optimized for data science roles' },
        { date: '2025-06-17', type: 'Resume', status: 'Draft 1 Sent', details: 'Initial draft sent' },
      ],
      jobApplications: [
        { id: 301, jobTitle: 'Data Scientist', company: 'Data Insights', platform: 'Indeed', status: 'Applied', appliedDate: '2025-06-19', jobUrl: 'https://example.com/job7', salaryRange: '$85,000 - $105,000', location: 'New York, NY', notes: 'Awaiting response.' },
        { id: 302, jobTitle: 'Business Intelligence Analyst', company: 'Analytics Pros', platform: 'Glassdoor', status: 'Interview', appliedDate: '2025-06-17', jobUrl: 'https://example.com/job8', salaryRange: '$70,000 - $90,000', location: 'Chicago, IL', notes: 'Technical interview next week.' },
      ],
      files: [
        { id: 3001, name: 'michael_resume.pdf', size: '280 KB', type: 'resume', status: 'Uploaded', uploadDate: '2025-06-19', notes: '' },
        { id: 3002, name: 'data_analysis_report.xlsx', size: '800 KB', type: 'report', status: 'Uploaded', uploadDate: '2025-06-17', notes: 'Sample report for portfolio' },
      ],
    },
  ]);

  // Combined activities for the timeline
  const allActivities = assignedClients.flatMap(client => {
    const clientActivities = [];

    // Job application activities
    client.jobApplications.forEach(app => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Applied for ${app.jobTitle} position at ${app.company}`,
        type: 'job application',
        date: app.appliedDate,
        time: '4:00 PM', // Placeholder for time
        status: app.status === 'Applied' ? 'Active' : (app.status === 'Interview' ? 'Active' : 'Completed'), // Simplified status
      });
      if (app.status === 'Interview') {
        clientActivities.push({
          clientId: client.id,
          initials: client.initials,
          name: client.name,
          description: `Interview scheduled with ${app.company} for ${app.jobTitle} position`,
          type: 'interview scheduled',
          date: app.appliedDate, // Using applied date as placeholder for interview date
          time: '9:30 PM', // Placeholder for time
          status: 'Active',
        });
      }
      // Add more application-related activities as needed (e.g., Rejected, Offered)
    });

    // File activities
    client.files.forEach(file => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Uploaded ${file.type} for ${client.name} position`,
        type: 'file upload',
        date: file.uploadDate,
        time: '2:15 PM', // Placeholder for time
        status: 'Active',
      });
    });

    // Resume update activities
    client.resumeUpdates.forEach(update => {
      clientActivities.push({
        clientId: client.id,
        initials: client.initials,
        name: client.name,
        description: `Resume update: ${update.details}`,
        type: 'resume update',
        date: update.date,
        time: '1:00 PM', // Placeholder for time
        status: update.status,
      });
    });

    return clientActivities;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first


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

  // --- Filter Functions (reused across tabs) ---
  const handleDateRangeChange = (e) => {
    setFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickFilterChange = (filterType) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0]; // Today's date

    if (filterType === 'Last 7 Days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'All Time') {
      startDate = ''; // Clear start date
      endDate = ''; // Clear end date
    }
    setFilterDateRange({ startDate, endDate });
    setQuickFilter(filterType);
  };

  const handleClearFilters = () => {
    setFilterDateRange({ startDate: '', endDate: '' });
    setSortOrder('Newest First');
    setQuickFilter('');
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setFileTypeFilter('All File Types');
    setActivityTypeFilter('All Activities');
  };

  // --- Applications Tab Functions ---
  const handleOpenAddApplicationModal = (client) => {
    setSelectedClientForApplication(client);
    setNewApplicationFormData({
      jobTitle: '', company: '', platform: '', jobUrl: '', salaryRange: '', location: '', notes: ''
    });
    setShowAddApplicationModal(true);
  };

  const handleNewApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setNewApplicationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewApplication = () => {
    if (!selectedClientForApplication) return;

    const newApp = {
      id: Date.now(),
      ...newApplicationFormData,
      status: 'Applied', // Default status for new applications
      appliedDate: new Date().toISOString().split('T')[0], // Current date
    };

    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === selectedClientForApplication.id
          ? {
              ...client,
              jobApplications: [...client.jobApplications, newApp],
            }
          : client
      )
    );
    setShowAddApplicationModal(false);
    setNewApplicationFormData({
      jobTitle: '', company: '', platform: '', jobUrl: '', salaryRange: '', location: '', notes: ''
    });
  };

  const handleViewApplication = (application) => {
    setViewedApplication(application);
    setShowViewApplicationModal(true);
  };

  const handleEditApplication = (application) => {
    // Find the client associated with this application to set selectedClientForApplication
    const client = assignedClients.find(c => c.jobApplications.some(appItem => appItem.id === application.id));
    setSelectedClientForApplication(client);
    setEditedApplicationFormData({ ...application }); // Copy for editing
    setShowEditApplicationModal(true);
  };

  const handleEditedApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setEditedApplicationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedApplication = () => {
    if (!editedApplicationFormData || !selectedClientForApplication) return;

    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === selectedClientForApplication.id
          ? {
              ...client,
              jobApplications: client.jobApplications.map(app =>
                app.id === editedApplicationFormData.id ? editedApplicationFormData : app
              ),
            }
          : client
      )
    );
    setShowEditApplicationModal(false);
    setEditedApplicationFormData(null);
    setSelectedClientForApplication(null); // Clear selected client after saving
  };


  const handleDeleteApplication = (clientId, appId) => {
    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? {
              ...client,
              jobApplications: client.jobApplications.filter(app => app.id !== appId),
            }
          : client
      )
    );
  };

  // Function to filter and sort job applications
  const getFilteredAndSortedApplications = (applications) => {
    let filtered = applications.filter(app => {
      // Search term filter
      const matchesSearch = searchTerm
        ? Object.values(app).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      // Status filter
      const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;

      // Date range filter
      const appDate = new Date(app.appliedDate);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || appDate >= start) && (!end || appDate <= end);

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Job Title A-Z':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'Company A-Z':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Files Tab Functions ---
  const handleOpenUploadFileModal = (client) => {
    setSelectedClientForFile(client);
    setNewFileFormData({
      clientId: client.id, fileType: '', fileName: '', notes: ''
    });
    setShowUploadFileModal(true);
  };

  const handleNewFileFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fileName' && files && files[0]) {
      setNewFileFormData(prev => ({ ...prev, fileName: files[0].name }));
    } else {
      setNewFileFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveNewFile = () => {
    if (!selectedClientForFile || !newFileFormData.fileType || !newFileFormData.fileName) {
      alert('Please fill in all required fields (File Type, File).');
      return;
    }

    const newFile = {
      id: Date.now(),
      name: newFileFormData.fileName,
      size: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`, // Simulate file size
      type: newFileFormData.fileType,
      status: 'Uploaded',
      uploadDate: new Date().toISOString().split('T')[0],
      notes: newFileFormData.notes,
    };

    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === selectedClientForFile.id
          ? {
              ...client,
              files: [...client.files, newFile],
            }
          : client
      )
    );
    setShowUploadFileModal(false);
    setNewFileFormData({ clientId: '', fileType: '', fileName: '', notes: '' });
    setSelectedClientForFile(null);
  };

  const handleViewFile = (file) => {
    setViewedFile(file);
    setShowViewFileModal(true);
  };

  const handleEditFile = (file) => {
    // Find the client associated with this file
    const client = assignedClients.find(c => c.files.some(fileItem => fileItem.id === file.id));
    setSelectedClientForFile(client); // Set this for context in save
    setEditedFileFormData({ ...file });
    setShowEditFileModal(true);
  };

  const handleEditedFileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedFileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedFile = () => {
    if (!editedFileFormData || !selectedClientForFile) return;

    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === selectedClientForFile.id
          ? {
              ...client,
              files: client.files.map(file =>
                file.id === editedFileFormData.id ? editedFileFormData : file
              ),
            }
          : client
      )
    );
    setShowEditFileModal(false);
    setEditedFileFormData(null);
    setSelectedClientForFile(null);
  };


  const handleDeleteFile = (clientId, fileId) => {
    setAssignedClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? {
              ...client,
              files: client.files.filter(file => file.id !== fileId),
            }
          : client
      )
    );
  };

  const getFilteredAndSortedFiles = (files) => {
    let filtered = files.filter(file => {
      const matchesSearch = searchTerm
        ? Object.values(file).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesFileType = fileTypeFilter === 'All File Types' || file.type === fileTypeFilter;

      const fileDate = new Date(file.uploadDate);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || fileDate >= start) && (!end || fileDate <= end);

      return matchesSearch && matchesFileType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'File Name A-Z':
          return a.name.localeCompare(b.name);
        case 'File Size (Asc)':
          return parseFloat(a.size) - parseFloat(b.size); // Assuming size is "X KB" or "Y MB"
        case 'File Size (Desc)':
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Activity Tab Functions ---
  const getFilteredAndSortedActivities = (activities) => {
    let filtered = activities.filter(activity => {
      const matchesSearch = searchTerm
        ? Object.values(activity).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesActivityType = activityTypeFilter === 'All Activities' || activity.type === activityTypeFilter;

      const activityDate = new Date(activity.date);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || activityDate >= start) && (!end || activityDate <= end);

      return matchesSearch && matchesActivityType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Activity Type A-Z':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
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

      {/* Overview Content */}
      {activeTab === 'Overview' && (
        <>
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
              <p style={cardValueStyle}>{assignedClients.length}</p>
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
              <p style={cardValueStyle}>
                {assignedClients.reduce((total, client) => total + client.jobApplications.length, 0)}
              </p>
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
              <p style={cardValueStyle}>
                {assignedClients.reduce((total, client) =>
                  total + client.jobApplications.filter(app => app.status === 'Interview').length, 0)}
              </p>
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
              <p style={cardValueStyle}>
                {assignedClients.reduce((total, client) => total + client.files.length, 0)}
              </p>
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
                  <div >
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
                    <span style={footerItemValueStyle}>{client.jobApplications.length}</span>
                    <button style={viewButtonStyle} className="view-button">View</button>
                  </div>
                  <div style={footerItemStyle}>
                    <span style={footerItemLabelStyle}>Files</span>
                    <span style={footerItemValueStyle}>{client.files.length}</span>
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
        </>
      )}

      {/* Applications Tab Content */}
      {activeTab === 'Applications' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>Advanced Filters</h2>
          <div style={filterContainerStyle}>
            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Date Range</label>
              <div style={dateRangeInputGroupStyle}>
                <input
                  type="date"
                  name="startDate"
                  value={filterDateRange.startDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
                <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                <input
                  type="date"
                  name="endDate"
                  value={filterDateRange.endDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={selectFilterStyle}
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Job Title A-Z">Job Title A-Z</option>
                <option value="Company A-Z">Company A-Z</option>
              </select>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Quick Filters</label>
              <div style={quickFilterButtonsStyle}>
                <button
                  onClick={() => handleQuickFilterChange('Last 7 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('Last 30 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('All Time')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                >
                  All Time
                </button>
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Actions</label>
              <button
                onClick={handleClearFilters}
                style={clearFiltersButtonStyle}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Client Job Applications</h2>
          <p style={subLabelStyle}>Manage job applications for each assigned client</p>

          {assignedClients.map(client => (
            <div key={client.id} style={clientApplicationsContainerStyle}>
              <div style={clientApplicationsHeaderStyle}>
                <div style={initialsCircleStyle}>{client.initials}</div>
                <div style={{ flexGrow: 1 }}>
                  <p style={clientNameStyle}>{client.name} <span style={{ ...priorityBadgeStyle, backgroundColor: client.priority === 'high' ? '#fee2e2' : client.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: client.priority === 'high' ? '#dc2626' : client.priority === 'medium' ? '#d97706' : '#2563eb' }}>{client.priority}</span></p>
                  <p style={clientCodeStyle}>{client.role} - {client.location}</p>
                </div>
                <div style={clientAppStatsStyle}>
                  <span>Showing: <strong>{getFilteredAndSortedApplications(client.jobApplications).length}</strong></span>
                  <span>Total: <strong>{client.jobApplications.length}</strong></span>
                  <span>Interviews: <strong>{client.jobApplications.filter(app => app.status === 'Interview').length}</strong></span>
                  <span>Applied: <strong>{client.jobApplications.filter(app => app.status === 'Applied').length}</strong></span>
                </div>
                <button
                  style={addApplicationButtonStyle}
                  onClick={() => handleOpenAddApplicationModal(client)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Application
                </button>
              </div>

              <div style={applicationTableControlsStyle}>
                <input
                  type="text"
                  placeholder="Search applications..."
                  style={searchInputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={statusFilterSelectStyle}
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offered">Offered</option>
                </select>
              </div>

              <div style={applicationTableWrapperStyle}>
                <table style={applicationTableStyle}>
                  <thead>
                    <tr>
                      <th style={applicationTableHeaderCellStyle}>Job Title</th>
                      <th style={applicationTableHeaderCellStyle}>Company</th>
                      <th style={applicationTableHeaderCellStyle}>Platform</th>
                      <th style={applicationTableHeaderCellStyle}>Status</th>
                      <th style={applicationTableHeaderCellStyle}>Applied Date</th>
                      <th style={applicationTableHeaderCellStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAndSortedApplications(client.jobApplications).length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          No applications found for this client.
                        </td>
                      </tr>
                    ) : (
                      getFilteredAndSortedApplications(client.jobApplications).map(app => (
                        <tr key={app.id}>
                          <td style={applicationTableDataCellStyle}>{app.jobTitle}</td>
                          <td style={applicationTableDataCellStyle}>{app.company}</td>
                          <td style={applicationTableDataCellStyle}>{app.platform}</td>
                          <td style={applicationTableDataCellStyle}>
                            <span style={{ ...applicationStatusBadgeStyle, ...getApplicationStatusStyle(app.status) }}>
                              {app.status}
                            </span>
                          </td>
                          <td style={applicationTableDataCellStyle}>{app.appliedDate}</td>
                          <td style={applicationTableDataCellStyle}>
                            <button onClick={() => handleViewApplication(app)} style={actionButtonAppStyle}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button onClick={() => handleEditApplication(app)} style={actionButtonAppStyle}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteApplication(client.id, app.id)} style={deleteButtonAppStyle}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files Tab Content */}
      {activeTab === 'Files' && (
        <div style={applicationsSectionStyle}> {/* Reusing applicationsSectionStyle for consistent padding/shadow */}
          <h2 style={sectionTitleStyle}>Advanced Filters</h2>
          <div style={filterContainerStyle}>
            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Date Range</label>
              <div style={dateRangeInputGroupStyle}>
                <input
                  type="date"
                  name="startDate"
                  value={filterDateRange.startDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
                <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                <input
                  type="date"
                  name="endDate"
                  value={filterDateRange.endDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={selectFilterStyle}
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="File Name A-Z">File Name A-Z</option>
                <option value="File Size (Asc)">File Size (Asc)</option>
                <option value="File Size (Desc)">File Size (Desc)</option>
              </select>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Quick Filters</label>
              <div style={quickFilterButtonsStyle}>
                <button
                  onClick={() => handleQuickFilterChange('Last 7 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('Last 30 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('All Time')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                >
                  All Time
                </button>
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Actions</label>
              <button
                onClick={handleClearFilters}
                style={clearFiltersButtonStyle}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Client File Management</h2>
          <p style={subLabelStyle}>View, manage and download files for each assigned client</p>

          {assignedClients.map(client => (
            <div key={client.id} style={clientApplicationsContainerStyle}> {/* Reusing for consistent styling */}
              <div style={clientApplicationsHeaderStyle}>
                <div style={initialsCircleStyle}>{client.initials}</div>
                <div style={{ flexGrow: 1 }}>
                  <p style={clientNameStyle}>{client.name} <span style={{ ...priorityBadgeStyle, backgroundColor: client.priority === 'high' ? '#fee2e2' : client.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: client.priority === 'high' ? '#dc2626' : client.priority === 'medium' ? '#d97706' : '#2563eb' }}>{client.priority}</span></p>
                  <p style={clientCodeStyle}>{client.role} - {client.location}</p>
                </div>
                <div style={clientAppStatsStyle}> {/* Reusing for stats display */}
                  <span>Showing: <strong>{getFilteredAndSortedFiles(client.files).length}</strong></span>
                  <span>Total Files: <strong>{client.files.length}</strong></span>
                  <span>Resumes: <strong>{client.files.filter(file => file.type === 'resume').length}</strong></span>
                  <span>Screenshots: <strong>{client.files.filter(file => file.type === 'interview screenshot').length}</strong></span>
                </div>
                <button
                  style={addApplicationButtonStyle} // Reusing for consistent button style
                  onClick={() => handleOpenUploadFileModal(client)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload File
                </button>
              </div>

              <div style={applicationTableControlsStyle}> {/* Reusing for search and filter */}
                <input
                  type="text"
                  placeholder="Search files..."
                  style={searchInputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  style={statusFilterSelectStyle} // Reusing select style
                >
                  <option value="All File Types">All File Types</option>
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  <option value="interview screenshot">Interview Screenshot</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={filesGridStyle}>
                {getFilteredAndSortedFiles(client.files).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', gridColumn: '1 / -1' }}>
                    No files found for this client.
                  </div>
                ) : (
                  getFilteredAndSortedFiles(client.files).map(file => (
                    <div key={file.id} style={fileCardStyle}>
                      <div style={fileCardHeaderStyle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={fileIconStyle}>
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        <div style={{ flexGrow: 1 }}>
                          <p style={fileNameStyle}>{file.name}</p>
                          <p style={fileSizeStyle}>{file.size}</p>
                        </div>
                        <span style={{ ...fileTypeBadgeStyle, ...getFileTypeBadgeStyle(file.type) }}>
                          {file.type}
                        </span>
                      </div>
                      <p style={fileStatusStyle}>
                        Status: <span style={{ fontWeight: '600', color: '#10b981' }}>{file.status}</span>
                      </p>
                      <p style={fileUploadDateStyle}>Uploaded: {file.uploadDate}</p>
                      {file.notes && (
                        <p style={fileNotesStyle}>Notes: {file.notes}</p>
                      )}
                      <div style={fileActionsStyle}>
                        <button onClick={() => handleViewFile(file)} style={actionButtonAppStyle}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button onClick={() => handleEditFile(file)} style={actionButtonAppStyle}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteFile(client.id, file.id)} style={deleteButtonAppStyle}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Activity Tab Content */}
      {activeTab === 'Activity' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>Advanced Filters</h2>
          <div style={filterContainerStyle}>
            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Date Range</label>
              <div style={dateRangeInputGroupStyle}>
                <input
                  type="date"
                  name="startDate"
                  value={filterDateRange.startDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
                <span style={{ margin: '0 8px', color: '#64748b' }}>to</span>
                <input
                  type="date"
                  name="endDate"
                  value={filterDateRange.endDate}
                  onChange={handleDateRangeChange}
                  style={dateInputStyle}
                />
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={selectFilterStyle}
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Activity Type A-Z">Activity Type A-Z</option>
              </select>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Quick Filters</label>
              <div style={quickFilterButtonsStyle}>
                <button
                  onClick={() => handleQuickFilterChange('Last 7 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 7 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('Last 30 Days')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'Last 30 Days' ? quickFilterButtonActiveStyle : {}) }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleQuickFilterChange('All Time')}
                  style={{ ...quickFilterButtonStyle, ...(quickFilter === 'All Time' ? quickFilterButtonActiveStyle : {}) }}
                >
                  All Time
                </button>
              </div>
            </div>

            <div style={filterGroupStyle}>
              <label style={filterLabelStyle}>Actions</label>
              <button
                onClick={handleClearFilters}
                style={clearFiltersButtonStyle}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 16 7 16h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          <h2 style={sectionTitleStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', color: '#3b82f6' }}>
              <path d="M13 10L3 14 10 21 21 3 13 10z"></path>
            </svg>
            Recent Activity Timeline
          </h2>
          <div style={activityTimelineContainerStyle}>
            {getFilteredAndSortedActivities(allActivities).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                No activities found matching your criteria.
              </div>
            ) : (
              getFilteredAndSortedActivities(allActivities).map((activity, index) => (
                <div key={index} style={activityItemStyle}>
                  <div style={activityIconContainerStyle}>
                    <div style={initialsCircleSmallStyle}>{activity.initials}</div>
                  </div>
                  <div style={activityContentStyle}>
                    <p style={activityDescriptionStyle}>
                      <span style={{ fontWeight: '600' }}>{activity.name}</span> - {activity.description}
                    </p>
                    <p style={activityDateStyle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle', color: '#94a3b8' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {activity.date}, {activity.time}
                    </p>
                  </div>
                  <div style={{ ...activityBadgeStyle, ...getActivityBadgeStyle(activity.type) }}>
                    {activity.type}
                  </div>
                  <div style={{ ...activityStatusBadgeStyle, ...getActivityStatusStyle(activity.status) }}>
                    {activity.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'Notes' && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
          Notes content will go here.
        </div>
      )}

      {/* Add New Application Modal */}
      {selectedClientForApplication && (
        <Modal show={showAddApplicationModal} onHide={() => setShowAddApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Add Job Application for {selectedClientForApplication.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Apply for a job on behalf of {selectedClientForApplication.name}. The application will be automatically sent to the client.</p>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={newApplicationFormData.jobTitle}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="company"
                  value={newApplicationFormData.company}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., TechCorp"
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={newApplicationFormData.platform}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="Select platform"
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job URL <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="url"
                  name="jobUrl"
                  value={newApplicationFormData.jobUrl}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="https://..."
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={newApplicationFormData.salaryRange}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., $90,000 - $120,000"
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newApplicationFormData.location}
                  onChange={handleNewApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={newApplicationFormData.notes}
                  onChange={handleNewApplicationFormChange}
                  style={modalTextareaStyle}
                  placeholder="Any additional notes about this application..."
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowAddApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewApplication}
              style={modalAddButtonPrimaryStyle}
            >
              Add Application
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Application Details Modal */}
      {viewedApplication && (
        <Modal show={showViewApplicationModal} onHide={() => setShowViewApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Job Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalViewDetailsGridStyle}>
              <p style={modalViewDetailItemStyle}><strong>Job Title:</strong> {viewedApplication.jobTitle}</p>
              <p style={modalViewDetailItemStyle}><strong>Company:</strong> {viewedApplication.company}</p>
              <p style={modalViewDetailItemStyle}><strong>Platform:</strong> {viewedApplication.platform}</p>
              <p style={modalViewDetailItemStyle}><strong>Job URL:</strong> <a href={viewedApplication.jobUrl} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>{viewedApplication.jobUrl}</a></p>
              <p style={modalViewDetailItemStyle}><strong>Salary Range:</strong> {viewedApplication.salaryRange || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Location:</strong> {viewedApplication.location || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Status:</strong> <span style={{ ...applicationStatusBadgeStyle, ...getApplicationStatusStyle(viewedApplication.status) }}>{viewedApplication.status}</span></p>
              <p style={modalViewDetailItemStyle}><strong>Applied Date:</strong> {viewedApplication.appliedDate}</p>
              <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}><strong>Notes:</strong> {viewedApplication.notes || '-'}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowViewApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit Application Details Modal */}
      {editedApplicationFormData && (
        <Modal show={showEditApplicationModal} onHide={() => setShowEditApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit Job Application</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedApplicationFormData.jobTitle}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="company"
                  value={editedApplicationFormData.company}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={editedApplicationFormData.platform}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job URL <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="url"
                  name="jobUrl"
                  value={editedApplicationFormData.jobUrl}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={editedApplicationFormData.salaryRange}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editedApplicationFormData.location}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="status"
                  value={editedApplicationFormData.status}
                  onChange={handleEditedApplicationFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offered">Offered</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Applied Date <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  name="appliedDate"
                  value={editedApplicationFormData.appliedDate}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={editedApplicationFormData.notes}
                  onChange={handleEditedApplicationFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedApplication}
              style={modalAddButtonPrimaryStyle}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Upload File Modal */}
      {selectedClientForFile && (
        <Modal show={showUploadFileModal} onHide={() => setShowUploadFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Upload File</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Upload resume, interview screenshot, or other documents for your clients. Files will be automatically sent to clients.</p>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Client <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="clientId"
                  value={selectedClientForFile.id}
                  onChange={(e) => setSelectedClientForFile(assignedClients.find(c => c.id === parseInt(e.target.value)))}
                  style={modalSelectStyle}
                  required
                  disabled // Client is pre-selected
                >
                  {assignedClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="fileType"
                  value={newFileFormData.fileType}
                  onChange={handleNewFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="">Select file type</option>
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  <option value="interview screenshot">Interview Screenshot</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>File <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="file"
                  name="fileName"
                  onChange={handleNewFileFormChange}
                  style={modalInputStyle}
                  required
                />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG (Max 10MB)</p>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={newFileFormData.notes}
                  onChange={handleNewFileFormChange}
                  style={modalTextareaStyle}
                  placeholder="Any additional notes about this file..."
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowUploadFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewFile}
              style={modalAddButtonPrimaryStyle}
            >
              Upload File
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View File Details Modal */}
      {viewedFile && (
        <Modal show={showViewFileModal} onHide={() => setShowViewFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>File Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalViewDetailsGridStyle}>
              <p style={modalViewDetailItemStyle}><strong>File Name:</strong> {viewedFile.name}</p>
              <p style={modalViewDetailItemStyle}><strong>File Type:</strong> {viewedFile.type}</p>
              <p style={modalViewDetailItemStyle}><strong>File Size:</strong> {viewedFile.size}</p>
              <p style={modalViewDetailItemStyle}><strong>Status:</strong> <span style={{ fontWeight: '600', color: '#10b981' }}>{viewedFile.status}</span></p>
              <p style={modalViewDetailItemStyle}><strong>Upload Date:</strong> {viewedFile.uploadDate}</p>
              <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}><strong>Notes:</strong> {viewedFile.notes || '-'}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowViewFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit File Details Modal */}
      {editedFileFormData && (
        <Modal show={showEditFileModal} onHide={() => setShowEditFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit File Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Name <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editedFileFormData.name}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="type"
                  value={editedFileFormData.type}
                  onChange={handleEditedFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  <option value="interview screenshot">Interview Screenshot</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Size</label>
                <input
                  type="text"
                  name="size"
                  value={editedFileFormData.size}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status</label>
                <input
                  type="text"
                  name="status"
                  value={editedFileFormData.status}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  disabled // Status is usually derived or set internally
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Upload Date</label>
                <input
                  type="date"
                  name="uploadDate"
                  value={editedFileFormData.uploadDate}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Notes</label>
                <textarea
                  name="notes"
                  value={editedFileFormData.notes}
                  onChange={handleEditedFileFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedFile}
              style={modalAddButtonPrimaryStyle}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      )}

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
  flexDirection: 'column', // Stack children vertically
  alignItems: 'flex-start', // Align children (including tabs) to the left
  gap: '20px',
  width: '100%', // Ensure the header takes full width to allow centering of its child
};

const headerTitleStyle = {
  width: '100%', // Make the title container take full width
  textAlign: 'center', // Center the text content within this container
  marginBottom: '10px', // Add some space below the title
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
  backgroundColor: '#3b82f6',
  color: '#ffffff',
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

// --- NEW STYLES FOR APPLICATIONS TAB ---
const applicationsSectionStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
};

const subLabelStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: '4px 0 24px 0',
};

const filterContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '1px solid #f1f5f9',
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const filterLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#475569',
};

const dateRangeInputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const dateInputStyle = {
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  flex: 1,
};

const selectFilterStyle = {
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none', // Remove default arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
};

const quickFilterButtonsStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const quickFilterButtonStyle = {
  background: '#e2e8f0',
  color: '#475569',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
};

const quickFilterButtonActiveStyle = {
  background: '#3b82f6',
  color: '#ffffff',
};

const clearFiltersButtonStyle = {
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const clientApplicationsContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '24px',
};

const clientApplicationsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid #f1f5f9',
  flexWrap: 'wrap', // Allow wrapping on smaller screens
};

const clientAppStatsStyle = {
  display: 'flex',
  gap: '16px',
  fontSize: '0.9rem',
  color: '#475569',
  marginLeft: 'auto', // Push stats to the right
  marginRight: '20px', // Space before add button
  flexWrap: 'wrap',
  justifyContent: 'flex-end', // Align stats to the right if wrapped
};

const addApplicationButtonStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '150px',
  justifyContent: 'center',
};

const applicationTableControlsStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const searchInputStyle = {
  flexGrow: 1,
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  maxWidth: '300px', // Limit search input width
};

const statusFilterSelectStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  minWidth: '150px',
};

const applicationTableWrapperStyle = {
  overflowX: 'auto', // Enable horizontal scrolling for the table on small screens
  width: '100%',
};

const applicationTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
};

const applicationTableHeaderCellStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontSize: '0.85rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0',
};

const applicationTableDataCellStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '0.9rem',
  color: '#1e293b',
  verticalAlign: 'middle',
};

const applicationStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  display: 'inline-block',
};

const getApplicationStatusStyle = (status) => {
  switch (status) {
    case 'Applied':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'Interview':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'Rejected':
      return { backgroundColor: '#fee2e2', color: '#ef4444' };
    case 'Offered':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const actionButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#64748b',
  marginRight: '4px',
  transition: 'color 0.2s, background-color 0.2s',
};

const saveButtonAppStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const deleteButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#ef4444',
  transition: 'color 0.2s, background-color 0.2s',
};

const editableInputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

const editableSelectStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '8px',
};

// --- NEW STYLES FOR FILES TAB ---
const filesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginTop: '20px',
};

const fileCardStyle = {
  background: '#f8fafc', // Lighter background for file cards
  borderRadius: '10px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
};

const fileCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const fileIconStyle = {
  color: '#64748b',
};

const fileNameStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
  wordBreak: 'break-word', // Ensure long file names wrap
};

const fileSizeStyle = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  margin: 0,
};

const fileTypeBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
};

const getFileTypeBadgeStyle = (type) => {
  switch (type) {
    case 'resume':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'cover letter':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview screenshot':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'portfolio':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'report':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};


const fileStatusStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileUploadDateStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileNotesStyle = {
  fontSize: '0.85rem',
  color: '#475569',
  margin: '8px 0',
  fontStyle: 'italic',
  borderLeft: '2px solid #cbd5e1',
  paddingLeft: '8px',
};

const fileActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: 'auto', // Push actions to the bottom
  paddingTop: '12px',
  borderTop: '1px solid #f1f5f9',
};

const editableSelectSmallStyle = {
  padding: '4px 6px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.75rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 4px center',
  backgroundSize: '6px',
};

// --- NEW STYLES FOR ACTIVITY TAB ---
const activityTimelineContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const activityItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px',
  borderRadius: '10px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

const activityIconContainerStyle = {
  flexShrink: 0,
};

const initialsCircleSmallStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  fontWeight: '600',
};

const activityContentStyle = {
  flexGrow: 1,
};

const activityDescriptionStyle = {
  fontSize: '0.95rem',
  color: '#1e293b',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const activityDateStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  margin: 0,
};

const activityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const getActivityBadgeStyle = (type) => {
  switch (type) {
    case 'job application':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'file upload':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview scheduled':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'status update':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'resume update':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const activityStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  marginLeft: '8px', // Space between activity type and status
};

const getActivityStatusStyle = (status) => {
  switch (status) {
    case 'Active':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'Completed':
      return { backgroundColor: '#e2e8f0', color: '#475569' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

// --- NEW STYLES FOR MODALS (Add/View/Edit Application) ---
const modalHeaderStyle = {
  borderBottom: 'none',
  paddingBottom: '15px',
  textAlign: 'center',
};

const modalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const modalBodyStyle = {
  padding: '20px 30px',
  lineHeight: '1.8',
  color: '#444',
};

const modalFormGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const modalFormFieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const modalLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#475569',
};

const modalInputStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  width: '100%',
};

const modalSelectStyle = {
  ...modalInputStyle,
  appearance: 'none',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
};

const modalTextareaStyle = {
  ...modalInputStyle,
  minHeight: '80px',
  resize: 'vertical',
};

const modalFooterStyle = {
  borderTop: 'none',
  paddingTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end', // Align buttons to the right
  gap: '15px',
};

const modalCancelButtonStyle = {
  background: '#cbd5e1',
  color: '#475569',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalAddButtonPrimaryStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalViewDetailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px 20px',
  fontSize: '0.95rem',
  color: '#333',
};

const modalViewDetailItemStyle = {
  margin: 0,
  padding: '5px 0',
};

export default EmployeeData;