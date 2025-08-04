import React, { useState, useEffect } from 'react';

const RequestManagement = () => {
  // --- Request Management States ---
  const [requestTab, setRequestTab] = useState('career');
  const [showCareerDetailsModal, setShowCareerDetailsModal] = useState(false);
  const [selectedCareerSubmission, setSelectedCareerSubmission] = useState(null);
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [selectedContactSubmission, setSelectedContactSubmission] = useState(null);
  const [showRequestConfirmModal, setShowRequestConfirmModal] = useState(false);
  const [requestConfirmAction, setRequestConfirmAction] = useState(null);
  const [requestConfirmMessage, setRequestConfirmMessage] = useState('');
  const [itemToProcess, setItemToProcess] = useState(null);
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);

  // Mock data for Career Submissions
const initialCareerSubmissions = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.d@example.com', mobile: '1234567890', role: 'Data Analyst', experience: 3, currentSalary: '70000', expectedSalary: '85000', resume: 'john_doe_resume.pdf', status: 'Pending' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.s@example.com', mobile: '0987654321', role: 'Scrum Master', experience: 5, currentSalary: '90000', expectedSalary: '110000', resume: 'jane_smith_cv.docx', status: 'Pending' },
    { id: 3, firstName: 'Peter', lastName: 'Jones', email: 'peter.j@example.com', mobile: '1122334455', role: 'Cyber Security', experience: 2, currentSalary: '65000', expectedSalary: '75000', resume: 'peter_jones_resume.pdf', status: 'Accepted' },
  ];

   const [careerSubmissions, setCareerSubmissions] = useState(() => {
    const savedSubmissions = localStorage.getItem('career_submissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : initialCareerSubmissions;
  });

  // Mock data for Contact Us Submissions
   const initialContactSubmissions = [
    { id: 1, firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', phone: '5551234567', message: 'I am interested in your web development services. Can we schedule a call?', receivedDate: '2024-07-20' },
    { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob.b@example.com', phone: '5559876543', message: 'Question about pricing for digital marketing packages.', receivedDate: '2024-07-21' },
  ];

   const [contactSubmissions, setContactSubmissions] = useState(() => {
    const savedSubmissions = localStorage.getItem('contact_submissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : initialContactSubmissions;
  });   

const initialServiceSubmissions = [
  // Mock data for Service Request Submissions
    { id: 1, email: 'service.user1@example.com', message: 'I need help setting up my new software.', receivedDate: '2024-07-23' },
    { id: 2, email: 'service.user2@example.com', message: 'There is an issue with my account billing.', receivedDate: '2024-07-22' },
];

 const [serviceRequests, setServiceRequests] = useState(() => {
    const savedSubmissions = localStorage.getItem('service_submissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : initialServiceSubmissions;
  });



  // --- Request Management Handlers ---
  const handleViewCareerDetails = (submission) => {
    setSelectedCareerSubmission(submission);
    setShowCareerDetailsModal(true);
  };

  const handleCloseCareerDetailsModal = () => {
    setShowCareerDetailsModal(false);
    setSelectedCareerSubmission(null);
  };

  const handleViewContactDetails = (submission) => {
    setSelectedContactSubmission(submission);
    setShowContactDetailsModal(true);
  };

  const handleCloseContactDetailsModal = () => {
    setShowContactDetailsModal(false);
    setSelectedContactSubmission(null);
  };

  const handleViewServiceRequestDetails = (submission) => {
    setSelectedServiceRequest(submission);
    setShowServiceRequestModal(true);
  };

  const handleCloseServiceRequestModal = () => {
    setShowServiceRequestModal(false);
    setSelectedServiceRequest(null);
  };

  const handleRequestAction = (action, item) => {
    setItemToProcess(item);
    setRequestConfirmAction(action);
    let message = '';
    if (action === 'accept') message = `Are you sure you want to accept the application from ${item.firstName} ${item.lastName}?`;
    if (action === 'reject') message = `Are you sure you want to reject the application from ${item.firstName} ${item.lastName}?`;
    if (action === 'deleteContact') message = `Are you sure you want to delete the message from ${item.firstName} ${item.lastName}? This cannot be undone.`;
    if (action === 'deleteServiceRequest') message = `Are you sure you want to delete the service request from ${item.email}? This cannot be undone.`;
    setRequestConfirmMessage(message);
    setShowRequestConfirmModal(true);
  };

  const confirmRequestAction = () => {
    if (requestConfirmAction === 'accept') {
      setCareerSubmissions(prev => prev.map(sub => sub.id === itemToProcess.id ? { ...sub, status: 'Accepted' } : sub));
    }
    if (requestConfirmAction === 'reject') {
      setCareerSubmissions(prev => prev.map(sub => sub.id === itemToProcess.id ? { ...sub, status: 'Rejected' } : sub));
    }
    if (requestConfirmAction === 'deleteContact') {
      setContactSubmissions(prev => prev.filter(sub => sub.id !== itemToProcess.id));
    }
    if (requestConfirmAction === 'deleteServiceRequest') {
      setServiceRequests(prev => prev.filter(req => req.id !== itemToProcess.id));
    }
    closeRequestConfirmModal();
  };

  const closeRequestConfirmModal = () => {
    setShowRequestConfirmModal(false);
    setRequestConfirmAction(null);
    setRequestConfirmMessage('');
    setItemToProcess(null);
  };
  
  // --- Style Helper Functions ---
  const getRoleTagBg = (role) => {
    switch (role?.toLowerCase()) {
      case 'pending': return '#FEF3C7';
      case 'accepted': return '#D1FAE5';
      case 'rejected': return '#FEE2E2';
      default: return '#E5E7EB';
    }
  };

  const getRoleTagText = (role) => {
    switch (role?.toLowerCase()) {
      case 'pending': return '#B45309';
      case 'accepted': return '#065F46';
      case 'rejected': return '#991B1B';
      default: return '#374151';
    }
  };


  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'career_submissions' && event.newValue) {
        setCareerSubmissions(JSON.parse(event.newValue));
      }
      if (event.key === 'contact_submissions' && event.newValue) {
        setContactSubmissions(JSON.parse(event.newValue));
      }
       if (event.key === 'service_submissions' && event.newValue) {
        setContactSubmissions(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 


  return (
    <div className="add-body-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
            --bg-body: #f3f4f6;
            --bg-card: #ffffff;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
            --primary-color: #2563eb;
            --modal-overlay-bg: rgba(0, 0, 0, 0.5);
            --modal-bg: #ffffff;
            --modal-title-color: #1f2937;
            --modal-close-btn-color: #6b7280;
            --confirm-cancel-btn-bg: #e5e7eb;
            --confirm-cancel-btn-text: #4b5563;
            --confirm-delete-btn-bg: #EF4444;
            --create-employee-btn-bg: #2563eb;
        }
    
             .add-body-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            min-height: 100vh;
            color: var(--text-primary);
            padding: 1.5rem;
        }
        .request-management-container {
            background-color: var(--bg-card);
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
        .request-tabs {
            display: flex;
            gap: 0.5rem;
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 1.5rem;
        }
        .request-tab-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            background-color: transparent;
            color: var(--text-secondary);
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            position: relative;
            top: 2px;
        }
        .request-tab-btn.active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
            font-weight: 600;
        }
        .request-table-container {
            overflow-x: auto;
        }
        .request-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .request-table th, .request-table td {
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            text-align: left;
            vertical-align: middle;
        }
        .request-table th {
            font-weight: 600;
            background-color: #f8f9fa;
        }
        .request-table .action-buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-start;
        }
        .request-table .action-button {
            padding: 0.3rem 0.6rem;
            border-radius: 0.375rem;
            border: 1px solid transparent;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .request-table .action-button.view { background-color: #DBEAFE; color: #1D4ED8; }
        .request-table .action-button.accept { background-color: #D1FAE5; color: #065F46; }
        .request-table .action-button.reject { background-color: #FEE2E2; color: #991B1B; }
        .request-table .action-button.download { background-color: #E0E7FF; color: #3730A3; }
        .message-cell {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        .status-tag {
            padding: 0.25rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: capitalize;
        }
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--modal-overlay-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        }
        .modal-overlay.open {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            background-color: var(--modal-bg);
            border-radius: 0.75rem;
            width: 90%;
            max-width: 600px;
            padding: 1.5rem;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--modal-title-color);
        }
        .modal-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--modal-close-btn-color);
            cursor: pointer;
        }
        .modal-body .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        .modal-body .detail-label {
            font-weight: 600;
            color: var(--text-secondary);
        }
        .modal-body .message-content {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #f9fafb;
            border-radius: 0.5rem;
            white-space: pre-wrap;
        }
        .modal-footer, .confirm-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }
        .confirm-cancel-btn, .confirm-delete-btn, .create-employee-btn {
            padding: 0.6rem 1.2rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }
        .confirm-cancel-btn {
            background-color: var(--confirm-cancel-btn-bg);
            color: var(--confirm-cancel-btn-text);
        }
        .confirm-delete-btn {
            background-color: var(--confirm-delete-btn-bg);
            color: white;
        }
        .create-employee-btn {
            background-color: var(--create-employee-btn-bg);
            color: white;
        }
      `}
      </style>
      <div className="request-management-container">
        <div className="request-tabs">
          <button
            className={`request-tab-btn ${requestTab === 'career' ? 'active' : ''}`}
            onClick={() => setRequestTab('career')}
          >
            Career Applications ({careerSubmissions.length})
          </button>
          <button
            className={`request-tab-btn ${requestTab === 'contactUs' ? 'active' : ''}`}
            onClick={() => setRequestTab('contactUs')}
          >
            Contact Us Messages ({contactSubmissions.length})
          </button>
          <button
            className={`request-tab-btn ${requestTab === 'serviceRequest' ? 'active' : ''}`}
            onClick={() => setRequestTab('serviceRequest')}
          >
            Service Requests ({serviceRequests.length})
          </button>
        </div>

        {requestTab === 'career' && (
          <div className="request-table-container">
            <table className="request-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email & Mobile</th>
                  <th>Role Applied</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {careerSubmissions.map((sub, index) => (
                  <tr key={sub.id}>
                    <td>{index + 1}</td>
                    <td>{sub.firstName} {sub.lastName}</td>
                    <td>
                      <div>{sub.email}</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{sub.mobile}</div>
                    </td>
                    <td>{sub.role}</td>
                    <td>{sub.experience} yrs</td>
                    <td>
                      <span className="status-tag" style={{ backgroundColor: getRoleTagBg(sub.status), color: getRoleTagText(sub.status) }}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button download">{sub.resume}</button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-button view" onClick={() => handleViewCareerDetails(sub)}>View</button>
                        {sub.status === 'Pending' && (
                          <>
                            <button className="action-button accept" onClick={() => handleRequestAction('accept', sub)}>Accept</button>
                            <button className="action-button reject" onClick={() => handleRequestAction('reject', sub)}>Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {requestTab === 'contactUs' && (
          <div className="request-table-container">
            <table className="request-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email & Phone</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactSubmissions.map((sub, index) => (
                  <tr key={sub.id}>
                    <td>{index + 1}</td>
                    <td>{sub.firstName} {sub.lastName}</td>
                    <td>
                      <div>{sub.email}</div>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{sub.phone}</div>
                    </td>
                    <td className="message-cell" title={sub.message} onClick={() => handleViewContactDetails(sub)}>{sub.message}</td>
                    <td>{sub.receivedDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-button view" onClick={() => handleViewContactDetails(sub)}>View</button>
                        <button className="action-button reject" onClick={() => handleRequestAction('deleteContact', sub)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {requestTab === 'serviceRequest' && (
          <div className="request-table-container">
            <table className="request-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Received Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((req, index) => (
                  <tr key={req.id}>
                    <td>{index + 1}</td>
                    <td>{req.email}</td>
                    <td className="message-cell" title={req.message} onClick={() => handleViewServiceRequestDetails(req)}>{req.message}</td>
                    <td>{req.receivedDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-button view" onClick={() => handleViewServiceRequestDetails(req)}>View</button>
                        <button className="action-button reject" onClick={() => handleRequestAction('deleteServiceRequest', req)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Career Submission Details Modal */}
      {showCareerDetailsModal && selectedCareerSubmission && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Career Application Details</h3>
              <button className="modal-close-btn" onClick={handleCloseCareerDetailsModal}>&times;</button>
            </div>
            <div className="modal-body">
                <div>
                  <div className="detail-item"><span className="detail-label">Name:</span> <span>{selectedCareerSubmission.firstName} {selectedCareerSubmission.lastName}</span></div>
                  <div className="detail-item"><span className="detail-label">Email:</span> <span>{selectedCareerSubmission.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Mobile:</span> <span>{selectedCareerSubmission.mobile}</span></div>
                  <div className="detail-item"><span className="detail-label">Role Applied:</span> <span>{selectedCareerSubmission.role}</span></div>
                  <div className="detail-item"><span className="detail-label">Experience:</span> <span>{selectedCareerSubmission.experience} years</span></div>
                  <div className="detail-item"><span className="detail-label">Current Salary:</span> <span>${selectedCareerSubmission.currentSalary}</span></div>
                  <div className="detail-item"><span className="detail-label">Expected Salary:</span> <span>${selectedCareerSubmission.expectedSalary}</span></div>
                   <div className="detail-item"><span className="detail-label">Resume:</span> <span className="detail-value"><button className="action-button download">{selectedCareerSubmission.resume}</button></span></div>
                  <div className="detail-item"><span className="detail-label">Status:</span> <span className="detail-value">
                    <span className="status-tag" style={{ backgroundColor: getRoleTagBg(selectedCareerSubmission.status), color: getRoleTagText(selectedCareerSubmission.status) }}>
                      {selectedCareerSubmission.status}
                    </span>
                  </span></div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseCareerDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Details Modal */}
      {showContactDetailsModal && selectedContactSubmission && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Contact Message</h3>
              <button className="modal-close-btn" onClick={handleCloseContactDetailsModal}>&times;</button>
            </div>
            <div className="modal-body">
                <div>
                  <div className="detail-item"><span className="detail-label">From:</span> <span>{selectedContactSubmission.firstName} {selectedContactSubmission.lastName}</span></div>
                  <div className="detail-item"><span className="detail-label">Email:</span> <span>{selectedContactSubmission.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Phone:</span> <span>{selectedContactSubmission.phone}</span></div>
                  <div className="detail-item"><span className="detail-label">Received On:</span> <span className="detail-value">{selectedContactSubmission.receivedDate}</span></div>
                  <div className="message-content">
                    <h5 className="detail-label">Message:</h5>
                    <p>{selectedContactSubmission.message}</p>
                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseContactDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Details Modal */}
      {showServiceRequestModal && selectedServiceRequest && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Service Request Details</h3>
              <button className="modal-close-btn" onClick={handleCloseServiceRequestModal}>&times;</button>
            </div>
            <div className="modal-body">
                <div>
                  <div className="detail-item"><span className="detail-label">From:</span> <span>{selectedServiceRequest.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Received:</span> <span>{selectedServiceRequest.receivedDate}</span></div>
                  <div className="message-content">
                    <h5 className="detail-label">Message:</h5>
                    <p>{selectedServiceRequest.message}</p>
                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="confirm-cancel-btn" onClick={handleCloseServiceRequestModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showRequestConfirmModal && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Action</h3>
              <button className="modal-close-btn" onClick={closeRequestConfirmModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>{requestConfirmMessage}</p>
            </div>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={closeRequestConfirmModal}>Cancel</button>
              <button
                type="button"
                className={requestConfirmAction.includes('delete') || requestConfirmAction === 'reject' ? 'confirm-delete-btn' : 'create-employee-btn'}
                onClick={confirmRequestAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;
