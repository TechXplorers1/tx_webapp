import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa'; // Import FaSearch and FaCalendarAlt icons

// Placeholder for DateRangeCalendar if it's not actually used or available
// In a real application, ensure this import path is correct and the file exists.
// import DateRangeCalendar from './DateRangeCalendar'; // Uncomment if DateRangeCalendar.jsx exists

// Mock DateRangeCalendar for demonstration if the file is not provided
const DateRangeCalendar = ({ initialStartDate, initialEndDate, onSelectRange }) => {
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);

  useEffect(() => {
    onSelectRange(start, end);
  }, [start, end, onSelectRange]);

  const handleStartDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setStart(newDate);
  };

  const handleEndDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setEnd(newDate);
  };

  const formatToInputDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Date Range:</p>
      <Form.Group controlId="tempStartDate" className="mb-3">
        <Form.Label>From Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(start)}
          onChange={handleStartDateChange}
        />
      </Form.Group>
      <Form.Group controlId="tempEndDate" className="mb-3">
        <Form.Label>To Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(end)}
          onChange={handleEndDateChange}
        />
      </Form.Group>
    </div>
  );
};


// --- HELPER FUNCTIONS (MOVED OUTSIDE COMPONENT FOR GLOBAL SCOPE) ---

// Format date as DD-MM-YYYY
const formatDate = (date) => {
  if (!date) return ''; // Handle empty date
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format date string from DD-MM-YYYY to YYYY-MM-DD for Date constructor
const convertDDMMYYYYtoYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-'); // ["DD", "MM", "YYYY"]
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // "YYYY-MM-DD"
    }
    return dateString; // Return as is if format is unexpected
};


// Generate 7-day date range for the ribbon
const generateDateRange = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

// --- SAMPLE APPLICATIONS DATA (MOVED OUTSIDE COMPONENT FOR ACCESSIBILITY) ---
const applicationsData = {
  [formatDate(new Date())]: [ // Today's date
    { id: 1, website: 'LinkedIn', position: 'Frontend Developer', company: 'Tech Corp', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Develop and maintain web applications using React.js, proficient in HTML, CSS, JavaScript, and modern front-end build tools.' },
    { id: 10, website: 'Company Site', position: 'Fullstack Engineer', company: 'Innovate Solutions', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Design, develop, and deploy full-stack applications with expertise in Node.js, Python, and database management (SQL/NoSQL).' },
    { id: 11, website: 'Indeed', position: 'DevOps Specialist', company: 'CloudWorks', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Implement and manage CI/CD pipelines, automate infrastructure using tools like Docker, Kubernetes, and Ansible. Cloud platform experience (AWS/Azure/GCP) is a plus.' },
    { id: 12, website: 'Glassdoor', position: 'QA Engineer', company: 'Quality First', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Execute test plans, identify and document software defects, and contribute to the overall quality assurance process for web and mobile applications.' },
    { id: 13, website: 'LinkedIn', position: 'Product Designer', company: 'Creative Minds', link: '#', dateAdded: formatDate(new Date()), jobDescription: 'Create intuitive and engaging user experiences through wireframes, prototypes, and user flows. Proficient in Figma, Sketch, or Adobe XD.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))]: [ // Yesterday
    { id: 2, website: 'Indeed', position: 'Backend Engineer', company: 'Data Systems', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), jobDescription: 'Develop robust server-side logic and APIs using Java Spring Boot. Experience with RESTful services and microservices architecture is required.' },
    { id: 14, website: 'Company Site', position: 'Data Scientist', company: 'Analytics Inc.', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), jobDescription: 'Analyze large datasets to extract actionable insights. Build predictive models using machine learning techniques and Python/R.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 2)))]: [ // Two days ago
    { id: 3, website: 'Glassdoor', position: 'Product Manager', company: 'Innovate Inc', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Define product vision, strategy, and roadmap. Collaborate with engineering, design, and marketing teams to deliver successful products.' },
    { id: 4, website: 'AngelList', position: 'Startup Engineer', company: 'New Ventures', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Work across the stack in a fast-paced startup environment. Opportunity to contribute to all phases of product development.' },
    { id: 15, website: 'LinkedIn', position: 'Mobile Developer', company: 'AppGenius', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), jobDescription: 'Develop native iOS or Android applications. Strong knowledge of Swift/Kotlin and mobile UI/UX principles.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 3)))]: [ // Three days ago
    { id: 16, website: 'Indeed', position: 'Network Administrator', company: 'SecureNet', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))), jobDescription: 'Manage and maintain network infrastructure, troubleshoot connectivity issues, and ensure network security and performance.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 4)))]: [ // Four days ago
    { id: 17, website: 'Company Site', position: 'Cybersecurity Analyst', company: 'Guardian Systems', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 4))), jobDescription: 'Monitor security systems, respond to incidents, and implement security measures to protect organizational data and systems.' },
    { id: 18, website: 'LinkedIn', position: 'Technical Writer', company: 'DocuWrite', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 4))), jobDescription: 'Produce clear, concise, and comprehensive technical documentation for software products, including user manuals and API documentation.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 5)))]: [ // Five days ago
    { id: 19, website: 'Glassdoor', position: 'Scrum Master', company: 'Agile Teams', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 5))), jobDescription: 'Facilitate agile ceremonies, remove impediments, and coach development teams in Scrum principles and practices to maximize delivery.' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 6)))]: [ // Six days ago
    { id: 20, website: 'Indeed', position: 'Cloud Engineer', company: 'Sky Computing', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), jobDescription: 'Design, deploy, and manage cloud-based solutions on AWS, Azure, or GCP. Experience with cloud automation and cost optimization.' },
    { id: 21, website: 'Other', position: 'Marketing Specialist', company: 'Brand Boost', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), jobDescription: 'Develop and execute digital marketing campaigns, analyze market trends, and manage social media presence to enhance brand visibility.' },
  ],
  // Add more applications for dates in the future or past as needed for testing scrolling
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))]: [ // Tomorrow
    { id: 22, website: 'LinkedIn', position: 'Senior Software Architect', company: 'Innovate Tomorrow', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), jobDescription: 'Lead the architectural design and development of complex software systems, ensuring scalability, reliability, and performance.' }
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 2)))]: [ // Day after tomorrow
    { id: 23, website: 'Indeed', position: 'Lead Data Scientist', company: 'Future AI', link: '#', dateAdded: formatDate(new Date(new Date().setDate(new Date().getDate() + 2))), jobDescription: 'Lead a team of data scientists to develop and deploy advanced analytical solutions and machine learning models.' }
  ],
};


const ClientWorksheet = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null); // For the daily date navigation ribbon
  const [dateRange, setDateRange] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  // Categorical Filter states (kept for modal functionality, though modal button removed)
  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State to control hover effect on search icon
  const [isSearchHovered, setIsSearchHovered] = useState(false);

  // States for date range filtering (DD-MM-YYYY string for display, internal logic uses Date objects)
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // New state for the custom date range modal visibility
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  // Temporary states for date inputs within the date range modal (Date objects for calendar component)
  const [tempStartDate, setTempStartDate] = useState(null); // Date object for calendar
  const [tempEndDate, setTempEndDate] = useState(null);   // Date object for calendar


  // State for Job Description Modal
  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);
  const [currentJobDescription, setCurrentJobDescription] = useState('');


  // Consolidated modal visibility state (kept for categorical filters if ever re-enabled)
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Temporary selected options within the categorical filter modal
  const [tempSelectedWebsites, setTempSelectedWebsites] = useState([]);
  const [tempSelectedPositions, setTempSelectedPositions] = useState([]);
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState([]);

  // Unique options for the filter modals
  const [uniqueWebsites, setUniqueWebsites] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);

  // Effect to generate initial date range and select today's date
  useEffect(() => {
    const today = new Date();
    const initialStartDate = new Date(today);
    initialStartDate.setDate(today.getDate() - 6);
    setCurrentStartDate(initialStartDate);
    setDateRange(generateDateRange(initialStartDate));
    setSelectedDate(formatDate(today));
  }, []);

  // Effect to populate unique filter options from all application data
  useEffect(() => {
    const allWebsites = new Set();
    const allPositions = new Set();
    const allCompanies = new Set();

    Object.values(applicationsData).forEach(dateApps => {
      dateApps.forEach(app => {
        allWebsites.add(app.website);
        allPositions.add(app.position);
        allCompanies.add(app.company);
      });
    });

    setUniqueWebsites(Array.from(allWebsites).sort());
    setUniquePositions(Array.from(allPositions).sort());
    setUniqueCompanies(Array.from(allCompanies).sort());
  }, []); // Empty dependency array means this runs once on mount

  // --- Handlers for the consolidated categorical filter modal (no longer directly accessible from a button) ---
  const handleOpenFilterModal = () => {
    setTempSelectedWebsites([...filterWebsites]);
    setTempSelectedPositions([...filterPositions]);
    setTempSelectedCompanies([...filterCompanies]);
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => setShowFilterModal(false);

  const handleApplyCategoricalFilters = () => {
    setFilterWebsites(tempSelectedWebsites);
    setFilterPositions(tempSelectedPositions);
    setFilterCompanies(tempSelectedCompanies);
    handleCloseFilterModal();
  };

  // Function to clear temporary selections WITHIN the modal
  const handleClearTempFiltersInModal = () => {
    setTempSelectedWebsites([]);
    setTempSelectedPositions([]);
    setTempSelectedCompanies([]);
  };

  // Helper to determine if any global filter (search, date range, or categorical) is active
  const isGlobalFilterActive = useMemo(() => {
    return searchTerm !== '' ||
           startDateFilter !== '' ||
           endDateFilter !== '' ||
           filterWebsites.length > 0 ||
           filterPositions.length > 0 ||
           filterCompanies.length > 0;
  }, [searchTerm, startDateFilter, endDateFilter, filterWebsites, filterPositions, filterCompanies]);

  // Function to clear ALL applied filters and reset temp states (for main page button)
  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
    setFilterWebsites([]); // Clear categorical filters too on global clear
    setFilterPositions([]);
    setFilterCompanies([]);
    setTempStartDate(null); // Clear temp states for date range modal
    setTempEndDate(null);   // Clear temp states for date range modal
    setTempSelectedWebsites([]); // Clear temp states for categorical modal
    setTempSelectedPositions([]);
    setTempSelectedCompanies([]);
  };

  // Checkbox change handlers for temporary selections within the categorical modal
  const handleWebsiteCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedWebsites(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handlePositionCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedPositions(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleCompanyCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedCompanies(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  // Handler for search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Handlers for the NEW Date Range Picker Modal ---
  const handleOpenDateRangeModal = () => {
    // Convert DD-MM-YYYY strings back to Date objects for the calendar component
    setTempStartDate(startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null);
    setTempEndDate(endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null);
    setShowDateRangeModal(true);
  };

  const handleCloseDateRangeModal = () => {
    setShowDateRangeModal(false);
  };

  // Callback from DateRangeCalendar when a range is selected
  const handleDateRangeChangeFromCalendar = useCallback((start, end) => {
    setTempStartDate(start);
    setTempEndDate(end);
  }, []);

  const handleApplyDateRange = () => {
    // Validate dates before applying (optional, but good practice)
    if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
      console.error('Start date cannot be after end date.');
      // You might want to show a user-friendly error message here
      return;
    }
    // Set the main filter states (converted back to DD-MM-YYYY strings for consistency)
    setStartDateFilter(tempStartDate ? formatDate(tempStartDate) : '');
    setEndDateFilter(tempEndDate ? formatDate(tempEndDate) : '');
    setShowDateRangeModal(false);
  };

  const handleClearDateRangeInModal = () => {
    setTempStartDate(null);
    setTempEndDate(null);
  };

  // --- Handlers for Job Description Modal ---
  const handleOpenJobDescriptionModal = (description) => {
    setCurrentJobDescription(description);
    setShowJobDescriptionModal(true);
  };

  const handleCloseJobDescriptionModal = () => {
    setShowJobDescriptionModal(false);
    setCurrentJobDescription('');
  };


  const downloadApplicationsData = () => {
    if (!filteredApplicationsForDisplay.length) return;

    const dataToExport = filteredApplicationsForDisplay.map((app, index) => ({
      'S.No': index + 1,
      'Website': app.website,
      'Position': app.position,
      'Company': app.company,
      'Link': app.link,
      'Job Description': app.jobDescription // Include job description in download
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    const sheetName = isGlobalFilterActive ? 'Filtered Applications' : `Applications ${selectedDate}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `JobApplications_${sheetName.replace(/\s/g, '_')}.xlsx`);
  };

  const showPreviousWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setCurrentStartDate(newStartDate);
    setDateRange(generateDateRange(newStartDate));
  };

  const showNextWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);

    const today = new Date();
    // Only allow navigating to future weeks if there's actual data in those weeks
    // For simplicity here, we only check against today's date to prevent going too far into future
    if (newStartDate.getTime() <= today.getTime() || Object.keys(applicationsData).some(date => new Date(convertDDMMYYYYtoYYYYMMDD(date)).getTime() >= newStartDate.getTime())) {
      setCurrentStartDate(newStartDate);
      setDateRange(generateDateRange(newStartDate));
    }
  };

  // Flatten all applications once and add their original date
  const allApplicationsFlattened = useMemo(() => {
    const flattened = [];
    for (const dateKey in applicationsData) {
      if (Object.prototype.hasOwnProperty.call(applicationsData, dateKey)) {
        applicationsData[dateKey].forEach(app => {
          flattened.push({ ...app, dateAdded: dateKey }); // Add the original date string to each app (DD-MM-YYYY)
        });
      }
    }
    return flattened;
  }, [applicationsData]);


  // Apply all filters to the relevant base set of applications
  const filteredApplicationsForDisplay = useMemo(() => {
    let baseApps = [];

    const isDateRangeFilterSet = startDateFilter !== '' && endDateFilter !== '';

    if (isGlobalFilterActive) {
        // If any global filter (search, categorical, or date range picker) is active, filter from all data.
        baseApps = allApplicationsFlattened;
    } else if (selectedDate) {
        // If only a ribbon date is selected (and no global filters active), use that date's data.
        baseApps = applicationsData[selectedDate] || [];
    } else {
        // Default case, if no filters active and no ribbon date selected, show data for today.
        baseApps = applicationsData[formatDate(new Date())] || []; // Fallback to today's data
    }


    return baseApps.filter(app => {
      const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
      const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
      const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        searchTerm === '' ||
        app.website.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(lowerCaseSearchTerm)); // Search in job description


      // Date Range Filter logic (applies only if startDateFilter or endDateFilter are explicitly set)
      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
          // Convert DD-MM-YYYY (app.dateAdded) to YYYY-MM-DD for Date constructor comparability
          // And normalize to start/end of day for accurate range comparison
          const appDate = new Date(convertDDMMYYYYtoYYYYMMDD(app.dateAdded));
          appDate.setHours(0, 0, 0, 0); // Normalize to start of day

          const start = startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null;
          const end = endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null;

          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);

          matchesDateRange =
              (!start || appDate >= start) &&
              (!end || appDate <= end);
      }

      // Combine all conditions
      return matchesWebsite && matchesPosition && matchesCompany && matchesSearchTerm && matchesDateRange;
    });
  }, [selectedDate, applicationsData, filterWebsites, filterPositions, filterCompanies, searchTerm, startDateFilter, endDateFilter, allApplicationsFlattened, isGlobalFilterActive]);


  // Update the title dynamically based on active filters
  const getApplicationsSectionTitle = () => {
    const hasDateRangeFilter = startDateFilter && endDateFilter;
    const hasSearchTerm = searchTerm !== '';
    const hasCategoricalFilters = filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0;

    if (hasDateRangeFilter) {
      return `Filtered Applications (From ${startDateFilter} - To ${endDateFilter})`;
    } else if (hasSearchTerm || hasCategoricalFilters) {
      return 'Filtered Applications (by search and/or other criteria)';
    } else if (selectedDate) {
      return `Applications for ${selectedDate}`;
    }
    return 'Job Applications'; // Default title if nothing selected/filtered
  };


  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Header with back button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <button
          onClick={() => navigate('/clientdashboard')}
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
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <h2 style={{ margin: 0, color: '#333' }}>Job Applications Worksheet</h2>
        <div style={{ width: '100px' }}></div> {/* Spacer */}
      </div>

      {/* Date navigation with arrows and horizontal scroll */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        background: '#fff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={showPreviousWeek}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px',
            flexShrink: 0
          }}
        >
          ◀
        </button>

        <div style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px 0',
          flexGrow: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <div style={{ display: 'inline-flex', gap: '8px' }}>
            {dateRange.map((date) => (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  backgroundColor: selectedDate === date ? '#007bff' : '#e9ecef',
                  color: selectedDate === date ? 'white' : '#333',
                  cursor: 'pointer',
                  minWidth: '100px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedDate === date ? '0 2px 5px rgba(0,123,255,0.3)' : 'none',
                  flexShrink: 0
                }}
              >
                {date}
                {applicationsData[date] && (
                  <div style={{
                    fontSize: '12px',
                    marginTop: '5px',
                    fontWeight: 'bold',
                    color: selectedDate === date ? 'rgba(255,255,255,0.8)' : '#666'
                  }}>
                    {applicationsData[date].length} application(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={showNextWeek}
          disabled={new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + 7).getTime() > new Date().getTime()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '16px',
            opacity: new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + 7).getTime() > new Date().getTime() ? 0.5 : 1,
            flexShrink: 0
          }}
        >
          ▶
        </button>
      </div>

      {/* Applications section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 auto', color: '#333' }}>
            {getApplicationsSectionTitle()}
          </h3>
        </div>

        {/* Download Button (Left), and Search Bar + Date Range (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', // Pushes left group and right group to ends
          alignItems: 'center',
          marginBottom: '15px',
          flexWrap: 'wrap', // Allows wrapping on smaller screens
          gap: '10px' // Gap between items when wrapped
        }}>
          {/* Left Group: Download button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={downloadApplicationsData}
              disabled={!filteredApplicationsForDisplay.length}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !filteredApplicationsForDisplay.length ? 0.5 : 1,
                transition: 'all 0.2s',
                flexShrink: 0 // Prevent shrinking
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </button>

            {/* Clear All Filters Button (Always present with global filters) */}
            {isGlobalFilterActive && (
              <button
                onClick={clearAllFilters}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="bi bi-x-circle"></i>
                Clear All Filters
              </button>
            )}
          </div>

          {/* Right Group: Search Bar + Date Range Picker */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // Gap between search and date picker
            flexWrap: 'wrap', // Allow wrapping for responsiveness
            justifyContent: 'flex-end', // Aligns this entire group to the right
            flexGrow: 1, // Allows this group to take available space
          }}>
            {/* Search Bar (Hover-to-reveal) */}
            <div
              onMouseEnter={() => setIsSearchHovered(true)}
              onMouseLeave={() => setIsSearchHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                borderRadius: '25px',
                padding: '8px 18px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                minWidth: '40px', // Initial width for just the icon
                maxWidth: '300px', // Max width for search input
                transition: 'min-width 0.3s ease-in-out', // Smooth transition for width change
                overflow: 'hidden', // Hide overflow content during transition
                cursor: 'pointer',
              }}
            >
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  flexGrow: 1, // Allow input to take available space
                  fontSize: '1rem',
                  padding: isSearchHovered ? '0 10px 0 0' : '0', // Add padding when hovered
                  width: isSearchHovered ? '100%' : '0px', // Expand width on hover
                  opacity: isSearchHovered ? 1 : 0, // Fade in on hover
                  transition: 'width 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.3s ease-in-out',
                  color: '#333',
                  whiteSpace: 'nowrap', // Prevent text wrapping
                }}
              />
              <FaSearch style={{ color: '#ccc', fontSize: '1.1rem', flexShrink: 0 }} />
            </div>

            {/* Combined Date Range Picker Icon Trigger */}
            <div
              onClick={handleOpenDateRangeModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center the icon
                background: '#ffffff',
                borderRadius: '6px',
                padding: '8px 12px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                flexShrink: 0,
                width: '40px', // Fixed width for icon only
                height: '40px', // Fixed height for icon only
                cursor: 'pointer',
              }}
            >
              <FaCalendarAlt style={{
                fontSize: '1.1rem',
                color: (startDateFilter && endDateFilter) ? '#007bff' : '#666', // Dynamic color
                transition: 'color 0.2s', // Smooth color transition
              }} />
            </div>
          </div>
        </div>

        {filteredApplicationsForDisplay.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              minWidth: '700px',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'center' }}>S.No</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Website</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Position</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Link</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Description</th> {/* New Header */}
                </tr>
              </thead>
              <tbody>
                {filteredApplicationsForDisplay.map((app, index) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f0f8ff' // Light alternating colors
                    }}
                  >
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>{app.website}</td>
                    <td style={{ padding: '12px' }}>{app.position}</td>
                    <td style={{ padding: '12px' }}>{app.company}</td>
                    <td style={{ padding: '12px' }}>
                      <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Link
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Button
                        variant="link"
                        onClick={() => handleOpenJobDescriptionModal(app.jobDescription)}
                        style={{ padding: '0', border: 'none', color: '#007bff', textDecoration: 'underline' }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>No applications found for this date with the current filters.</p>
        )}
      </div>

      {/* --- Date Range Picker Modal --- */}
      <Modal show={showDateRangeModal} onHide={handleCloseDateRangeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DateRangeCalendar
            initialStartDate={tempStartDate}
            initialEndDate={tempEndDate}
            onSelectRange={handleDateRangeChangeFromCalendar}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearDateRangeInModal} style={modalClearButtonStyle}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleApplyDateRange}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Job Description View Modal --- */}
      <Modal show={showJobDescriptionModal} onHide={handleCloseJobDescriptionModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentJobDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseJobDescriptionModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Consolidated Categorical Filter Modal (Still present, but not accessible from a button) --- */}
      {/* Keeping this modal and its related states/logic in case you wish to re-enable categorical filtering later */}
      <Modal show={showFilterModal} onHide={handleCloseFilterModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* Website Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Website</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueWebsites.map(website => (
                    <Form.Check
                      key={website}
                      type="checkbox"
                      id={`modal-website-${website}`}
                      label={website}
                      value={website}
                      checked={tempSelectedWebsites.includes(website)}
                      onChange={handleWebsiteCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Position Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Position</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniquePositions.map(position => (
                    <Form.Check
                      key={position}
                      type="checkbox"
                      id={`modal-position-${position}`}
                      label={position}
                      value={position}
                      checked={tempSelectedPositions.includes(position)}
                      onChange={handlePositionCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Company Filter Column */}
              <Col md={4}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Company</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueCompanies.map(company => (
                    <Form.Check
                      key={company}
                      type="checkbox"
                      id={`modal-company-${company}`}
                      label={company}
                      value={company}
                      checked={tempSelectedCompanies.includes(company)}
                      onChange={handleCompanyCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearTempFiltersInModal} style={modalClearButtonStyle}>
            <i className="bi bi-trash"></i> Clear Selections
          </Button>
          <Button variant="primary" onClick={handleApplyCategoricalFilters}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// --- Styles ---
const filterButtonStyle = { // This style is technically unused now as the button is gone
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '6px',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
  display: 'flex',
  alignItems: 'center',
};

const modalClearButtonStyle = {
  backgroundColor: '#f0ad4e',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

export default ClientWorksheet;
