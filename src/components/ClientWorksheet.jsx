import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// --- HELPER FUNCTIONS (MOVED OUTSIDE COMPONENT FOR GLOBAL SCOPE) ---

// Format date as DD-MM-YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Generate 7-day date range
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
    { id: 1, website: 'LinkedIn', position: 'Frontend Developer', company: 'Tech Corp', link: '#' },
    { id: 10, website: 'Company Site', position: 'Fullstack Engineer', company: 'Innovate Solutions', link: '#' },
    { id: 11, website: 'Indeed', position: 'DevOps Specialist', company: 'CloudWorks', link: '#' },
    { id: 12, website: 'Glassdoor', position: 'QA Engineer', company: 'Quality First', link: '#' },
    { id: 13, website: 'LinkedIn', position: 'Product Designer', company: 'Creative Minds', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))]: [ // Yesterday
    { id: 2, website: 'Indeed', position: 'Backend Engineer', company: 'Data Systems', link: '#' },
    { id: 14, website: 'Company Site', position: 'Data Scientist', company: 'Analytics Inc.', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 2)))]: [ // Two days ago
    { id: 3, website: 'Glassdoor', position: 'Product Manager', company: 'Innovate Inc', link: '#' },
    { id: 4, website: 'AngelList', position: 'Startup Engineer', company: 'New Ventures', link: '#' },
    { id: 15, website: 'LinkedIn', position: 'Mobile Developer', company: 'AppGenius', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 3)))]: [ // Three days ago
    { id: 16, website: 'Indeed', position: 'Network Administrator', company: 'SecureNet', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 4)))]: [ // Four days ago
    { id: 17, website: 'Company Site', position: 'Cybersecurity Analyst', company: 'Guardian Systems', link: '#' },
    { id: 18, website: 'LinkedIn', position: 'Technical Writer', company: 'DocuWrite', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 5)))]: [ // Five days ago
    { id: 19, website: 'Glassdoor', position: 'Scrum Master', company: 'Agile Teams', link: '#' },
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() - 6)))]: [ // Six days ago
    { id: 20, website: 'Indeed', position: 'Cloud Engineer', company: 'Sky Computing', link: '#' },
    { id: 21, website: 'Other', position: 'Marketing Specialist', company: 'Brand Boost', link: '#' },
  ],
  // Add more applications for dates in the future or past as needed for testing scrolling
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))]: [ // Tomorrow
    { id: 22, website: 'LinkedIn', position: 'Senior Software Architect', company: 'Innovate Tomorrow', link: '#' }
  ],
  [formatDate(new Date(new Date().setDate(new Date().getDate() + 2)))]: [ // Day after tomorrow
    { id: 23, website: 'Indeed', position: 'Lead Data Scientist', company: 'Future AI', link: '#' }
  ],
};


const ClientWorksheet = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  // Filter states (now arrays for multi-selection)
  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);

  // Consolidated modal visibility state
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Temporary selected options within the modal (for apply/cancel logic)
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

  // --- Handlers for the single combined filter modal ---
  const handleOpenFilterModal = () => {
    // Initialize temporary selections with current active filters
    setTempSelectedWebsites([...filterWebsites]);
    setTempSelectedPositions([...filterPositions]);
    setTempSelectedCompanies([...filterCompanies]);
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => setShowFilterModal(false);

  const handleApplyFilters = () => {
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

  // Function to clear ALL applied filters and reset temp states (for main page button)
  const clearAllFilters = () => {
    setFilterWebsites([]);
    setFilterPositions([]);
    setFilterCompanies([]);
    setTempSelectedWebsites([]); // Also clear temp states for consistency
    setTempSelectedPositions([]);
    setTempSelectedCompanies([]);
  };

  // Checkbox change handlers for temporary selections within the modal
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

  const downloadApplicationsData = () => {
    // Now download filteredApplicationsForDisplay, which can be all data or specific date data
    if (!filteredApplicationsForDisplay.length) return;

    const dataToExport = filteredApplicationsForDisplay.map((app, index) => ({
      'S.No': index + 1,
      'Website': app.website,
      'Position': app.position,
      'Company': app.company,
      'Link': app.link
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    // Dynamically name the sheet based on what's displayed
    const sheetName = isAnyFilterActive() ? 'Filtered Applications' : `Applications ${selectedDate}`;
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
    if (newStartDate.getTime() <= today.getTime()) {
      setCurrentStartDate(newStartDate);
      setDateRange(generateDateRange(newStartDate));
    }
  };

  // Helper to check if any filter is active
  const isAnyFilterActive = () => {
    return filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0;
  };

  // Determine the base applications to filter (all or just selected date)
  const baseApplicationsForFiltering = isAnyFilterActive()
    ? Object.values(applicationsData).flat() // Flatten all applications from all dates
    : (selectedDate ? applicationsData[selectedDate] || [] : []); // Only selected date's applications

  // Apply filters to the base set of applications
  const filteredApplicationsForDisplay = baseApplicationsForFiltering.filter(app => {
    const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
    const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
    const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);
    return matchesWebsite && matchesPosition && matchesCompany;
  });

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
        {(selectedDate || isAnyFilterActive()) && (
          <>
            {/* Centered Heading */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 auto', color: '#333' }}>
                {isAnyFilterActive() ? 'Filtered Applications (across all dates)' : `Applications for ${selectedDate}`}
              </h3>
            </div>

            {/* Download Button (Left) and Filter/Clear Buttons (Right) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {/* Download Button - Left Aligned */}
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
                  order: 1
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download
              </button>

              {/* Filter and Clear All Filters Buttons - Right Aligned */}
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap',
                order: 2
              }}>
                <button style={filterButtonStyle} onClick={handleOpenFilterModal}>
                  <i className="bi bi-funnel-fill" style={{ marginRight: '5px' }}></i>
                  Filter
                </button>

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>No applications found for this date with the current filters.</p>
            )}
          </>
        )}
      </div>

      {/* --- Consolidated Filter Modal --- */}
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
          <Button variant="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// --- Styles ---
const filterButtonStyle = {
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
