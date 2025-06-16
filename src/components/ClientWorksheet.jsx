import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientWorksheet = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

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

  // Load initial date range
  useEffect(() => {
    const today = new Date();
    // Start range 6 days before today to show a full week including today
    const initialStartDate = new Date(today);
    initialStartDate.setDate(today.getDate() - 6);
    setCurrentStartDate(initialStartDate);
    setDateRange(generateDateRange(initialStartDate));
    setSelectedDate(formatDate(today)); // Select today's date initially
  }, []);

  // Navigate to previous week
  const showPreviousWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setCurrentStartDate(newStartDate);
    setDateRange(generateDateRange(newStartDate));
  };

  // Navigate to next week
  const showNextWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    
    // Don't allow going beyond today's week
    const today = new Date();
    // Calculate the start of today's week (Sunday/Monday depending on locale, for simplicity using fixed 7-day blocks)
    const startOfTodayWeek = new Date(today);
    startOfTodayWeek.setDate(today.getDate() - 6); // Assuming the 7-day range starts 6 days ago for consistency

    // Only update if the new start date is not past the start of the current week (i.e., not pushing into the future beyond current visible range)
    if (newStartDate <= today) { // Simplified check: don't go past today's actual date
      setCurrentStartDate(newStartDate);
      setDateRange(generateDateRange(newStartDate));
    } else {
        // Optional: you could snap back to the current week's start if they try to go too far forward
        // setCurrentStartDate(startOfTodayWeek);
        // setDateRange(generateDateRange(startOfTodayWeek));
    }
  };


  // Sample applications data (expanded)
  // Ensure the dates here match the formatDate output (DD-MM-YYYY)
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

  // Get applications for selected date
  const currentApplications = selectedDate ? applicationsData[selectedDate] || [] : [];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa', // Light background color for the page
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
          onClick={() => navigate(-1)}
          style={{
            background: '#00bfff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          ⬅ Back to Dashboard
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
            background: '#00bfff',
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
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
          WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
          '&::-webkit-scrollbar': { // Hide scrollbar for Chrome/Safari
            display: 'none',
          },
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
                  backgroundColor: selectedDate === date ? '#007bff' : '#e9ecef', // Highlight selected date
                  color: selectedDate === date ? 'white' : '#333',
                  cursor: 'pointer',
                  minWidth: '100px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedDate === date ? '0 2px 5px rgba(0,123,255,0.3)' : 'none',
                  flexShrink: 0 // Prevent dates from squeezing
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
          disabled={new Date(currentStartDate).setDate(currentStartDate.getDate() + 7) > new Date()}
          style={{
            background: '#00bfff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '16px',
            opacity: new Date(new Date(currentStartDate).setDate(currentStartDate.getDate() + 7)).getTime() > new Date().getTime() ? 0.5 : 1,
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
        {selectedDate && (
          <>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Applications for {selectedDate}
            </h3>

            {currentApplications.length > 0 ? (
              <div style={{ overflowX: 'auto' }}> {/* Makes the table itself horizontally scrollable */}
                <table style={{
                  width: '100%',
                  minWidth: '700px', // Ensure min-width for scrolling if content is small
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#007bff', color: 'white' }}> {/* Blue header as per image */}
                      <th style={{ padding: '12px', textAlign: 'center'}}>S.No</th>
                      <th style={{ padding: '12px', textAlign: 'center'}}>Website</th>
                      <th style={{ padding: '12px', textAlign: 'center'}}>Position</th>
                      <th style={{ padding: '12px', textAlign: 'center'}}>Company</th>
                      <th style={{ padding: '12px', textAlign: 'center'}}>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplications.map((app, index) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
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
              <p style={{ textAlign: 'center', color: '#666' }}>No applications found for this date. Try selecting another date.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientWorksheet;