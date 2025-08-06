import React, { useState, useEffect, useRef } from 'react';

const ClientManagement = () => {
  // --- Client Management States ---
  const [clientFilter, setClientFilter] = useState('registered');
  const [editingClientId, setEditingClientId] = useState(null);
  const [tempSelectedManager, setTempSelectedManager] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [isDeleteClientConfirmModalOpen, setIsDeleteClientConfirmModalOpen] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState(null);
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState(null);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [currentClientToEdit, setCurrentClientToEdit] = useState(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');
  const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];

    // State for Payment Management Modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
      amount: '',
      description: '',
      transactionDate: '',
    });
    const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');
  
      const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [clientForManagerSelection, setClientForManagerSelection] = useState(null);
   const [managerSearchTerm, setManagerSearchTerm] = useState('');

 const [employees, setEmployees] = useState([]);

  // MODIFIED: Initialize clients state as empty.
  const [clients, setClients] = useState([]);
  
  // NEW: Add loading and error states for fetching initial data.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // NEW: useEffect to load clients from localStorage or fetch from clients.json
  useEffect(() => {
    const loadData = async () => {
        try {
            // First, try to get clients from local storage
            const savedClients = localStorage.getItem('clients');
            if (savedClients && JSON.parse(savedClients).length > 0) {
                setClients(JSON.parse(savedClients));
            } else {
                // If not in local storage, fetch from the JSON file
                const response = await fetch('/clients.json'); // Assumes clients.json is in /public folder
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const clientData = await response.json();
                setClients(clientData);
            }
             // Load employees from local storage or fetch from employees.json
            const savedEmployees = localStorage.getItem('employees');
            if (savedEmployees && JSON.parse(savedEmployees).length > 0) {
                setEmployees(JSON.parse(savedEmployees));
            } else {
                const response = await fetch('/employees.json');
                if (!response.ok) throw new Error('Network response for employees was not ok');
                const employeeData = await response.json();
                setEmployees(employeeData);
            }
        } catch (err) {
            setError(err.message);
            console.error("Failed to load clients:", err);
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);

      // --- NEW: Add this useEffect to listen for real-time updates from other tabs ---
  useEffect(() => {
    const handleStorageChange = (event) => {
      // If the 'clients' item in localStorage changes, update the state
      if (event.key === 'clients' && event.newValue) {
        setClients(JSON.parse(event.newValue));
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup: remove event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // NEW: useEffect to save clients to localStorage whenever the list changes
  useEffect(() => {
    // We only save to localStorage after the initial loading is done
    // to avoid overwriting it with an empty array.
    if (!loading) {
        localStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients, loading]);
 // useEffect to save employees to localStorage
  useEffect(() => {
    if (!loading) {
        localStorage.setItem('employees', JSON.stringify(employees));
    }
  }, [employees, loading]);



// REMOVED: Hardcoded managers array is no longer needed
  // const managers = [ ... ];

  // NEW: Dynamically create the manager list from the employees state
  const managerList = employees.filter(emp => emp.roles && emp.roles.includes('manager'));

  const serviceOptions = [
    'All',
    'Mobile Development',
    'Web Development',
    'Digital Marketing',
    'IT Talent Supply',
    'Job Supporting & Consulting',
    'Cyber Security'
  ];

  // --- Client Management Handlers ---
  const handleAcceptClient = (clientId) => {
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['unassigned'], manager: null } : client
    ));
  };

  const handleDeclineClient = (clientId) => {
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['rejected'] } : client
    ));
  };

   // Payment Modal Handlers
  const handleOpenPaymentModal = (client) => {
    setSelectedClientForPayment(client);
    setPaymentDetails({
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().slice(0, 10),
    });
    setGeneratedPaymentLink('');
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedClientForPayment(null);
    setPaymentDetails({
      amount: '',
      description: '',
      transactionDate: '',
    });
    setGeneratedPaymentLink('');
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGeneratePaymentLink = () => {


    const mockLink = `https://31228083-199d-476b-a6cb-d029dbd0ce9-figmaiframepreview.figma.site#/pay/1/INV-14752-12703`;
    setGeneratedPaymentLink(mockLink);
    console.log('Generating payment link with details:', paymentDetails, ' for client:', selectedClientForPayment);
  };

  const handlePayNow = () => {
    console.log('Processing immediate payment with details:', paymentDetails, ' for client:', selectedClientForPayment);

    handleClosePaymentModal();
  };

  const handleCopyLink = () => {
    if (generatedPaymentLink) {

      const textArea = document.createElement('textarea');
      textArea.value = generatedPaymentLink;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Payment link copied using execCommand!');
      } catch (e) {
        console.error('Fallback copy failed: ', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSendEmail = () => {
    console.log('Sending email with link:', generatedPaymentLink);

  };

  const handlePreviewLink = () => {
    if (generatedPaymentLink) {
      window.open(generatedPaymentLink, '_blank');
    }
  };

  const handleDeleteRejectedClient = (clientId) => {
    setClientToDeleteId(clientId);
    setIsDeleteClientConfirmModalOpen(true);
  };

  const handleConfirmClientDelete = () => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientToDeleteId));
    setIsDeleteClientConfirmModalOpen(false);
    setClientToDeleteId(null);
  };

  const handleCancelClientDelete = () => {
    setIsDeleteClientConfirmModalOpen(false);
    setClientToDeleteId(null);
  };

  const handleAssignClient = (clientId) => {
    const clientToAssign = clients.find(c => c.id === clientId);
    if (clientToAssign && clientToAssign.manager) {
      setClients(prevClients => prevClients.map(client =>
        client.id === clientId ? { ...client, displayStatuses: ['active'] } : client
      ));
      try {
        const managerUnassignedClients = JSON.parse(localStorage.getItem('manager_unassigned_clients')) || [];
        
        // Avoid adding duplicates if the client is already there
        if (!managerUnassignedClients.some(c => c.id === clientToAssign.id)) {
          const updatedManagerClients = [...managerUnassignedClients, clientToAssign];
          localStorage.setItem('manager_unassigned_clients', JSON.stringify(updatedManagerClients));
        }
      } catch (error) {
        console.error("Failed to update manager's unassigned clients in localStorage", error);
      }
    } else {
      // In a real app, you'd use a proper notification system instead of alert.
      console.error('Please select a manager first.');
    }
  };

  const handleRestoreClient = (clientId) => {
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, displayStatuses: ['unassigned'], manager: null } : client
    ));
  };

  const handleEditManager = (client) => {
    setEditingClientId(client.id);
    setTempSelectedManager(client.manager || '');
  };

  const handleSaveManagerChange = (clientId) => {
    setClients(prevClients => prevClients.map(client =>
      client.id === clientId ? { ...client, manager: tempSelectedManager } : client
    ));
    setEditingClientId(null);
    setTempSelectedManager('');
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setTempSelectedManager('');
  };

    const handleOpenManagerModal = (client) => {
    setClientForManagerSelection(client);
    setIsManagerModalOpen(true);
  };

  const handleCloseManagerModal = () => {
    setIsManagerModalOpen(false);
    setClientForManagerSelection(null);
    setManagerSearchTerm('');
  };

  const handleSelectManager = (managerName) => {
    if (clientForManagerSelection) {
      setClients(prevClients => prevClients.map(client =>
        client.id === clientForManagerSelection.id ? { ...client, manager: managerName } : client
      ));
    }
    handleCloseManagerModal();
  };

  const handleClientSearchChange = (event) => {
    setClientSearchTerm(event.target.value);
  };

  const getFilteredClients = () => {
    let filtered = clients.filter(client => client.displayStatuses.includes(clientFilter));
    if (selectedServiceFilter !== 'All') {
      filtered = filtered.filter(client => client.service === selectedServiceFilter);
    }
    const searchTermLower = clientSearchTerm.toLowerCase();
    return filtered.filter(client =>
      (client.firstName?.toLowerCase().includes(searchTermLower)) ||
      (client.lastName?.toLowerCase().includes(searchTermLower)) ||
      (client.email?.toLowerCase().includes(searchTermLower)) ||
      (client.mobile?.toLowerCase().includes(searchTermLower)) ||
      (client.jobsApplyFor?.toLowerCase().includes(searchTermLower)) ||
      (client.country?.toLowerCase().includes(searchTermLower)) ||
      (client.service?.toLowerCase().includes(searchTermLower))
    );
  };

  const filteredClients = getFilteredClients();

  // --- Client Details and Edit Client Modals Handlers ---
  const handleViewClientDetails = (client) => {
    setSelectedClientForDetails(client);
    setIsClientDetailsModalOpen(true);
  };

  const handleCloseClientDetailsModal = () => {
    setIsClientDetailsModalOpen(false);
    setSelectedClientForDetails(null);
  };

  const handleEditClientDetailsClick = () => {
    setCurrentClientToEdit({ ...selectedClientForDetails });
    setIsClientDetailsModalOpen(false);
    setIsEditClientModalOpen(true);
  };

  const handleCloseEditClientModal = () => {
    setIsEditClientModalOpen(false);
    setCurrentClientToEdit(null);
  };

  const handleEditClientChange = (e) => {
    const { name, value } = e.target;
    setCurrentClientToEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClientDetails = (e) => {
    e.preventDefault();
    setClients(prevClients => prevClients.map(client =>
      client.id === currentClientToEdit.id ? { ...currentClientToEdit } : client
    ));
    handleCloseEditClientModal();
  };

  // --- Rendering Functions ---
  const renderClientTable = (clientsToRender, serviceType, currentClientFilter, title = '') => {
    const headers = ['First Name', 'Last Name', 'Mobile', 'Email', serviceType === 'Job Supporting & Consulting' ? 'Jobs Apply For' : 'Service', 'Registered Date', 'Country'];
    if (serviceType === 'Job Supporting & Consulting') headers.push('Visa Status');
    if (['unassigned', 'active', 'restored'].includes(currentClientFilter)) headers.push('Manager');
    headers.push('Details', 'Actions');

    return (
      <div className="client-table-container">
        {title && <h4 className="client-table-title">{title} ({clientsToRender.length})</h4>}
        <table className="client-table">
          <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {clientsToRender.length > 0 ? (
              clientsToRender.map(client => (
                <tr key={client.id}>
                  <td>{client.firstName}</td>
                  <td>{client.lastName}</td>
                  <td>{client.mobile}</td>
                  <td>{client.email}</td>
                  <td>{client.service === 'Job Supporting & Consulting' ? client.jobsApplyFor : client.service}</td>
                  <td>{client.registeredDate}</td>
                  <td>{client.country}</td>
                  {client.service === 'Job Supporting & Consulting' && <td>{client.visaStatus}</td>}

                  {(currentClientFilter === 'unassigned' || currentClientFilter === 'restored') && (
                    <td>
                      <button onClick={() => handleOpenManagerModal(client)} className="action-button select-manager">
                          {client.manager || 'Select Manager'}
                      </button>
                    </td>
                  )}
                  {currentClientFilter === 'active' && (
                    <td>
                      {client.manager || '-'}
                    </td>
                  )}
                  <td><button onClick={() => handleViewClientDetails(client)} className="action-button view">View</button></td>
                  <td>
                    <div className="action-buttons">
                      {currentClientFilter === 'registered' && (<><button onClick={() => handleAcceptClient(client.id)} className="action-button accept">Accept</button><button onClick={() => handleDeclineClient(client.id)} className="action-button decline">Decline</button></>)}
                      {(currentClientFilter === 'unassigned' || currentClientFilter === 'restored') && <button onClick={() => handleAssignClient(client.id)} className="action-button assign" disabled={!client.manager}>Assign</button>}
{currentClientFilter === 'active' && (<button onClick={() => handleOpenManagerModal(client)} className="action-button edit-manager">Edit Manager</button>)}                      {currentClientFilter === 'rejected' && (<><button onClick={() => handleRestoreClient(client.id)} className="action-button restore">Restore</button><button onClick={() => handleDeleteRejectedClient(client.id)} className="action-button delete-btn">Delete</button></>)}
                      {/* Send Payment Link Button */}
                                <button
                                  onClick={() => handleOpenPaymentModal(client)}
                                  className="action-button send-payment-link"
                                >
                                  {/* Credit Card Icon (from Screenshot 2025-07-02 at 7.33.16 PM.png) */}
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                                    <path d="M20 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44772 20.5523 4 20 4ZM5 7H19V9H5V7ZM5 11H17V13H5V11ZM5 15H13V17H5V15Z" />
                                  </svg>
                                  Send Payment Link
                                </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No {serviceType !== 'All' ? serviceType : ''} clients found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAllServiceTables = () => {
    const servicesToDisplay = serviceOptions.filter(service => service !== 'All');
    return (
      <div className="all-services-list">
        {servicesToDisplay.map(service => {
          const clientsForService = clients.filter(client =>
            client.displayStatuses.includes(clientFilter) &&
            client.service === service &&
            ((client.firstName || '').toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
             (client.lastName || '').toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
             (client.email || '').toLowerCase().includes(clientSearchTerm.toLowerCase()))
          );
          if (clientsForService.length === 0) {
            return null;
          }
          return (
            <div key={service} className="service-table-list-item">
              {renderClientTable(clientsForService, service, clientFilter, service)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ad-body-container">
      <style>{`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --bg-body: #f3f4f6;
          --bg-card: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --shadow-color-1: rgba(0, 0, 0, 0.05);
          --shadow-color-3: rgba(0, 0, 0, 0.04);
          --modal-overlay-bg: rgba(0, 0, 0, 0.5);
          --modal-bg: #ffffff;
          --modal-border: #e5e7eb;
          --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --modal-title-color: #1f2937;
          --modal-subtitle-color: #6b7280;
          --modal-close-btn-color: #6b7280;
          --modal-close-btn-hover: #1f2937;
          --modal-input-border: #d1d5db;
          --modal-input-bg: #ffffff;
          --modal-input-text: #1f2937;
          --modal-focus-border: #2563eb;
          --modal-label-color: #374151;
          --dept-table-header-bg: #f9fafb;
          --dept-table-header-text: #6b7280;
          --dept-table-row-hover-bg: #f9fafb;
          --action-btn-border: #e5e7eb;
          --action-btn-text: #4b5563;
          --action-btn-hover-bg: #f9fafb;
          --delete-btn-bg: #EF4444;
          --delete-btn-hover-bg: #DC2626;
          --delete-btn-text: #ffffff;
          --confirm-modal-cancel-btn-bg: #e5e7eb;
          --confirm-modal-cancel-btn-text: #4b5563;
          --confirm-modal-cancel-btn-hover: #d1d5db;
          --modal-create-btn-bg: #2563eb;
          --modal-create-btn-text: #ffffff;
          --modal-create-btn-hover: #1d4ed8;

          /* Client Management Specific Colors */
          --client-filter-tab-bg-active-registered: #E6F0FF;
          --client-filter-tab-text-active-registered: #3A60EE;
          --client-filter-tab-badge-registered: #3A60EE;
          --client-filter-tab-bg-active-unassigned: #FEF3C7;
          --client-filter-tab-text-active-unassigned: #B45309;
          --client-filter-tab-badge-unassigned: #B45309;
          --client-filter-tab-bg-active-active: #D9F5E6;
          --client-filter-tab-text-active-active: #28A745;
          --client-filter-tab-badge-active: #28A745;
          --client-filter-tab-bg-active-rejected: #FFEDEE;
          --client-filter-tab-text-active-rejected: #DC3545;
          --client-filter-tab-badge-rejected: #DC3545;
          --client-filter-tab-bg-active-restored: #F0E6FF;
          --client-filter-tab-text-active-restored: #6A40EE;
          --client-filter-tab-badge-restored: #6A40EE;
        }

        .ad-body-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            min-height: 100vh;
            flex-direction: column;
            color: var(--text-primary);
        }

        /* Client Management Styles */
        .client-management-container {
           padding: 0 1.5rem 1.5rem;
        }

        .client-management-box {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
             margin-top: 2.9rem;
        }

        .client-management-header-section {
            display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
        }

        .client-management-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            
        }

        .client-filter-tabs {
            position: relative;
            display: flex;
            border-radius: 0.5rem;
            background-color: #EEE;
            box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
            padding: 0.25rem;
            width: 100%;
            font-size: 14px;
            margin: 0 auto 20px auto;
            overflow-x: auto;
            white-space: nowrap;
            flex-wrap: wrap;
            justify-content: center;
        }

        .client-filter-tab-item {
            flex-shrink: 0;
            flex-grow: 1;
            text-align: center;
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            border: none;
            padding: .5rem 10px;
            transition: all .15s ease-in-out;
            color: rgba(51, 65, 85, 1);
            font-weight: normal;
            margin: 0 2px 5px 2px;
        }

        .client-filter-tab-item input[type="radio"] {
            display: none;
        }

        .client-filter-tab-item input[type="radio"]:checked + .client-filter-tab-label {
            font-weight: 600;
        }
        
        .client-filter-tab-label {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            padding: 0.3rem;
        }

        .client-filter-tab-item .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 20px;
            height: 20px;
            border-radius: 50%;
            color: white;
            font-size: 0.75em;
            font-weight: bold;
            padding: 0 6px;
            margin-left: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: background-color 0.15s ease;
        }

        .client-filter-tab-item.registered input[type="radio"]:checked + .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-registered); color: var(--client-filter-tab-text-active-registered); }
        .client-filter-tab-item.registered .badge { background-color: var(--client-filter-tab-badge-registered); }
        .client-filter-tab-item.unassigned input[type="radio"]:checked ~ .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-unassigned); color: var(--client-filter-tab-text-active-unassigned); }
        .client-filter-tab-item.unassigned .badge { background-color: var(--client-filter-tab-badge-unassigned); }
        .client-filter-tab-item.active input[type="radio"]:checked ~ .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-active); color: var(--client-filter-tab-text-active-active); }
        .client-filter-tab-item.active .badge { background-color: var(--client-filter-tab-badge-active); }
        .client-filter-tab-item.rejected input[type="radio"]:checked ~ .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-rejected); color: var(--client-filter-tab-text-active-rejected); }
        .client-filter-tab-item.rejected .badge { background-color: var(--client-filter-tab-badge-rejected); }
        .client-filter-tab-item.restored input[type="radio"]:checked ~ .client-filter-tab-label { background-color: var(--client-filter-tab-bg-active-restored); color: var(--client-filter-tab-text-active-restored); }
        .client-filter-tab-item.restored .badge { background-color: var(--client-filter-tab-badge-restored); }

        .client-search-and-filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.5rem;
            align-items: flex-end;
        }

        .client-search-input-group {
            display: flex;
            align-items: center;
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            overflow: hidden;
            background-color: var(--bg-card);
            flex-grow: 1;
            min-width: 200px;
        }

        .client-search-input-group .search-icon-wrapper {
            padding: 0.75rem 1rem;
            color: var(--text-secondary);
            background-color: var(--bg-card);
            border-right: 1px solid var(--border-color);
        }

        .client-search-input-group .client-search-input {
            flex-grow: 1;
            padding: 0.75rem 1rem;
            border: none;
            outline: none;
            background-color: var(--bg-card);
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        .service-filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex-grow: 1;
            min-width: 180px;
        }

        .service-filter-group .form-label {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--modal-label-color);
        }

        .service-filter-group .form-select {
            padding: 0.75rem 1rem;
            border: 1px solid var(--modal-input-border);
            border-radius: 0.5rem;
            background-color: var(--modal-input-bg);
            color: var(--modal-input-text);
            font-size: 0.9rem;
            width: 100%;
        }

        .client-table-title {
            margin-bottom: 1rem;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            text-align: center;
        }

        .client-table-container {
            overflow-x: auto;
        }

        .client-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--bg-card);
        }

        .client-table th, .client-table td {
            padding: 1rem;
            text-align: left;
            white-space: nowrap;
            border-bottom: 1px solid var(--border-color);
        }

        .client-table thead th {
            background-color: var(--dept-table-header-bg);
            color: var(--dept-table-header-text);
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .client-table tbody tr:last-child td {
            border-bottom: none;
        }

        .client-table tbody tr:nth-child(even) {
            background-color: var(--bg-body);
        }

        .client-table tbody tr:hover {
            background-color: var(--dept-table-row-hover-bg);
        }
        
        .client-table .action-buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-start;
            align-items: center;
        }

        .client-table .action-button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        
        .client-table .action-button:hover {
            transform: translateY(-1px);
        }
        
        .client-table .action-button.view { background-color: #e0e7ff; color: #3730a3; }
        .client-table .action-button.accept { background-color: #28a745; color: white; }
        .client-table .action-button.decline { background-color: #dc3545; color: white; }
        .client-table .action-button.assign { background-color: #007bff; color: white; }
        .client-table .action-button.restore { background-color: #6f42c1; color: white; }
        .client-table .action-button.edit-manager { background-color: #007bff; color: white; }
        .client-table .action-button.save { background-color: #28a745; color: white; }
        .client-table .action-button.cancel { background-color: #6c757d; color: white; }
        .client-table .action-button.delete-btn { background-color: var(--delete-btn-bg); color: var(--delete-btn-text); }
         .client-table td .action-button.send-payment-link {
         background-color: #28a745; /* Green color for payment link */
           color: white;
           display: flex;
           align-items: center;
           gap: 0.5rem;
           }
          .client-table td .action-button.send-payment-link:hover {
          background-color: #218838;
           } 

        .client-table .manager-select {
            padding: 6px 8px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            background-color: var(--bg-card);
            color: var(--text-primary);
            font-size: 0.85em;
            width: 100%;
        }

        .all-services-list {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            margin-top: 1.5rem;
        }

        .service-table-list-item {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
            width: 100%;
        }

        .client-table .action-button.select-manager {
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
        }
        
        /* Manager Select Modal Styles */
        .manager-select-modal {
            max-width: 450px;
        }
             .manager-search-container {
            margin-top: 1rem;
        }
        .manager-search-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--modal-input-border);
            border-radius: 0.5rem;
            font-size: 1rem;
        }
        .manager-list {
             display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
            max-height: 300px; /* Add max-height for scrollability */
            overflow-y: auto;
        }
        .manager-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .manager-item:hover {
            background-color: var(--dept-table-row-hover-bg);
        }
        .manager-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
        }
        .manager-info {
            display: flex;
            flex-direction: column;
        }
        .manager-name {
            font-weight: 600;
            color: var(--text-primary);
        }
        .manager-email {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        /* Modal Styles */
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
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .modal-overlay.open {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background-color: var(--modal-bg);
            border-radius: 0.75rem;
            box-shadow: var(--modal-shadow);
            border: 1px solid var(--modal-border);
            width: 90%;
            max-width: 500px;
            padding: 1.5rem;
            position: relative;
            transform: translateY(-20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .modal-overlay.open .modal-content {
            transform: translateY(0);
            opacity: 1;
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
        
        .modal-subtitle {
            font-size: 0.875rem;
            color: var(--modal-subtitle-color);
            margin-top: 0.25rem;
        }

        .modal-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--modal-close-btn-color);
            cursor: pointer;
        }
        
        .confirm-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }

        .confirm-cancel-btn, .confirm-delete-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }

        .confirm-cancel-btn {
            background-color: var(--confirm-modal-cancel-btn-bg);
            color: var(--confirm-modal-cancel-btn-text);
        }
        
        .confirm-delete-btn {
            background-color: var(--delete-btn-bg);
            color: var(--delete-btn-text);
        }

        .assign-modal-content {
            background-color: var(--modal-bg);
            border-radius: 0.75rem;
            width: 90%;
            max-width: 900px; 
            padding: 1.5rem;
            position: relative;
            overflow-y: auto;
            max-height: 90vh;
        }

        .assign-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .assign-modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--modal-title-color);
        }

        .assign-modal-close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--modal-close-btn-color);
            cursor: pointer;
        }

        .client-preview-grid-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        @media (min-width: 768px) {
            .client-preview-grid-container {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .client-preview-section {
            background-color: var(--bg-body);
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .client-preview-section-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        .assign-form-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .assign-form-group label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        
        .assign-form-group input, .assign-form-group select, .assign-form-group textarea, .read-only-value {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border: 1px solid var(--modal-input-border);
            border-radius: 0.4rem;
            background-color: var(--modal-input-bg);
            color: var(--modal-input-text);
            font-size: 0.9rem;
            box-sizing: border-box;
        }
        
        .read-only-value {
            background-color: var(--bg-body);
            min-height: 38px;
            display: flex;
            align-items: center;
        }

        .client-preview-skills-section {
            grid-column: 1 / -1;
            background-color: var(--bg-body);
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            padding: 1rem;
            margin-top: 1.5rem;
        }
        
        .assign-form-actions {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }
        
        .assign-form-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
        }
        
        .assign-form-button.cancel {
            background-color: var(--confirm-modal-cancel-btn-bg);
            color: var(--confirm-modal-cancel-btn-text);
        }

        .assign-form-button.assign {
            background-color: var(--modal-create-btn-bg);
            color: var(--modal-create-btn-text);
        }

        .payment-status-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    display: inline-block; /* Ensure it respects padding and background */
}

/* Payment Management Modal Specific Styles */
.payment-modal-content {
    max-width: 500px; /* Adjust max-width for payment modal */
    padding: 1.25rem; /* Reduced padding */
}

.payment-modal-client-details {
    background-color: var(--bg-body);
    border-radius: 0.5rem;
    padding: 0.75rem; /* Reduced padding */
    margin-top: 0.75rem; /* Reduced margin */
    border: 1px solid var(--border-color);
}

.payment-modal-client-details p {
    margin: 0.15rem 0; /* Reduced margin */
    font-size: 0.85rem; /* Slightly smaller font */
    color: var(--text-primary);
}

.payment-modal-client-details strong {
    font-weight: 600;
    color: var(--text-primary);
}

.payment-modal-options {
    margin-top: 1rem; /* Reduced margin */
    padding-top: 0.75rem; /* Reduced padding */
    border-top: 1px solid var(--border-color);
}

.payment-modal-options h4 {
    font-size: 0.95rem; /* Slightly smaller font */
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem; /* Reduced margin */
}

.payment-modal-option-item {
    font-size: 0.8rem; /* Smaller font */
    color: var(--text-secondary);
    margin-bottom: 0.3rem; /* Reduced margin */
}

.payment-modal-option-item strong {
    color: var(--text-primary);
}

.modal-form .form-group {
    gap: 0.4rem; /* Reduced gap between label and input */
}

.modal-form .form-label {
    margin-bottom: 0; /* Remove default margin */
}

.modal-footer {
    margin-top: 1rem; /* Reduced margin */
    gap: 0.6rem; /* Reduced gap between buttons */
    /* Added for equal sizing and filling space */
    display: flex;
    justify-content: flex-end; /* Changed to flex-end */
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.modal-footer button {
    flex-grow: 0; /* Changed to 0 */
    flex-basis: auto; /* Allow buttons to shrink as needed */
    min-width: unset; /* Reset min-width */
    padding: 0.75rem 1.5rem; /* Consistent padding */
    font-size: 0.9rem; /* Consistent font size */
}

.pay-now-btn {
    background-color: #007bff; /* Blue for Pay Now button */
    color: #ffffff;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex; /* Ensure icon and text are aligned */
    align-items: center;
    justify-content: center;
    gap: 0.5rem; /* Space between icon and text */
}

.pay-now-btn:hover {
    background-color: #0056b3; /* Darker blue on hover */
}

/* Generated Link Section */
.generated-link-section {
    margin-top: 1rem; /* Reduced margin-top */
    padding-top: 0.75rem; /* Reduced padding-top */
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Reduced gap */
}

.generated-link-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #28a745; /* Green for success */
    font-weight: 600;
    font-size: 0.9rem; /* Slightly smaller font */
}

.generated-link-input-group {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--modal-input-bg);
}

.generated-link-input {
    flex-grow: 1;
    padding: 0.6rem 0.8rem; /* Reduced padding */
    border: none;
    outline: none;
    background-color: transparent;
    color: var(--modal-input-text);
    font-size: 0.85rem; /* Slightly smaller font */
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
    max-height: 3.5rem; /* Reduced max-height for scrollability */
    overflow-y: auto; /* Make it scrollable vertically */
}

.generated-link-actions {
    display: flex;
    gap: 0.4rem; /* Reduced gap */
    padding: 0.4rem; /* Reduced padding */
    border-left: 1px solid var(--border-color);
    flex-shrink: 0;
}

.generated-link-action-btn {
    padding: 0.5rem 0.7rem; /* Reduced padding */
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    background-color: var(--bg-card);
    color: var(--text-primary);
    font-size: 0.75rem; /* Slightly smaller font */
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.3rem; /* Reduced gap */
    white-space: nowrap;
}

.generated-link-action-btn:hover {
    background-color: var(--bg-nav-link-hover);
}

.generated-link-close-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: var(--confirm-modal-cancel-btn-bg);
    color: var(--confirm-modal-cancel-btn-text);
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 0.75rem; /* Reduced margin-top */
}

.generated-link-close-btn:hover {
    background-color: var(--confirm-modal-cancel-btn-hover);
}
       .payment-modal-content .generated-link-input-group {
                flex-direction: column;
            }

            .payment-modal-content .generated-link-action-btn {
                width: 100%;
                justify-content: center;
            }

      `}
      </style>

      <main >
         <div className="client-management-container">
              <div className="client-management-box">
                <div className="client-management-header-section">
                  <h2 className="client-management-title">Client Details Management</h2>
                </div>

                {/* Client Filter Tabs */}
                <div className="client-filter-tabs">
                  {[
                    { label: 'Registered Clients', value: 'registered', count: clients.filter(c => c.displayStatuses.includes('registered')).length, activeBg: 'var(--client-filter-tab-bg-active-registered)', activeColor: 'var(--client-filter-tab-text-active-registered)', badgeBg: 'var(--client-filter-tab-badge-registered)' },
                    { label: 'Unassigned Clients', value: 'unassigned', count: clients.filter(c => c.displayStatuses.includes('unassigned')).length, activeBg: 'var(--client-filter-tab-bg-active-unassigned)', activeColor: 'var(--client-filter-tab-text-active-unassigned)', badgeBg: 'var(--client-filter-tab-badge-unassigned)' },
                    { label: 'Active Clients', value: 'active', count: clients.filter(c => c.displayStatuses.includes('active')).length, activeBg: 'var(--client-filter-tab-bg-active-active)', activeColor: 'var(--client-filter-tab-text-active-active)', badgeBg: 'var(--client-filter-tab-badge-active)' },
                    { label: 'Rejected Clients', value: 'rejected', count: clients.filter(c => c.displayStatuses.includes('rejected')).length, activeBg: 'var(--client-filter-tab-bg-active-rejected)', activeColor: 'var(--client-filter-tab-text-active-rejected)', badgeBg: 'var(--client-filter-tab-badge-rejected)' },
                    // { label: 'Restore Clients', value: 'restored', count: clients.filter(c => c.displayStatuses.includes('restored')).length, activeBg: 'var(--client-filter-tab-bg-active-restored)', activeColor: 'var(--client-filter-tab-text-active-restored)', badgeBg: 'var(--client-filter-tab-badge-restored)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`client-filter-tab-item ${option.value}`}
                      style={{
                        backgroundColor: clientFilter === option.value ? option.activeBg : 'transparent',
                        color: clientFilter === option.value ? option.activeColor : 'rgba(51, 65, 85, 1)',
                      }}
                    >
                      <input
                        type="radio"
                        name="client-filter"
                        value={option.value}
                        checked={clientFilter === option.value}
                        onChange={(e) => {
                          setClientFilter(e.target.value);
                          setClientSearchTerm('');
                          // selectedServiceFilter state is intentionally NOT reset here, to maintain selection across tabs
                        }}
                      />
                      <span className="client-filter-tab-label">{option.label}</span>
                      <span className="badge" style={{ backgroundColor: clientFilter === option.value ? option.badgeBg : '#9AA0A6' }}>
                        {option.count}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Search Input and Service Dropdown */}
                <div className="client-search-and-filter-group">
                  <div className="client-search-input-group">
                    <span className="search-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="clientSearch"
                      placeholder="Search clients by name, email, mobile, job, or country"
                      className="client-search-input"
                      value={clientSearchTerm}
                      onChange={handleClientSearchChange}
                    />
                  </div>


                  <div className="service-filter-group">
                    <label htmlFor="serviceFilter" className="form-label" style={{ fontSize: '20px' }}>Services:</label>
                    <select
                      id="serviceFilter"
                      name="serviceFilter"


                      className="form-select"
                      value={selectedServiceFilter}
                      onChange={(e) => setSelectedServiceFilter(e.target.value)}
                    >
                      {serviceOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {selectedServiceFilter === 'All' ? (
                  renderAllServiceTables()
                ) : (
                  <>
                    <h4 className="client-table-title">
                      {clientFilter === 'registered' && `Registered Clients`}
                      {clientFilter === 'unassigned' && `Unassigned Clients`}
                      {clientFilter === 'active' && `Active Clients`}
                      {clientFilter === 'rejected' && `Rejected Clients`}
                      {clientFilter === 'restored' && `Restored Clients`} ({filteredClients.length})
                    </h4>


                    {renderClientTable(filteredClients, selectedServiceFilter, clientFilter)}
                  </>
                )}

              </div>
            </div>
      </main>

      {/* Delete Client Confirmation Modal */}
      {isDeleteClientConfirmModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Deletion</h3>
              <button className="modal-close-btn" onClick={handleCancelClientDelete}>&times;</button>
            </div>
            <p className="modal-subtitle">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="confirm-modal-buttons">
              <button type="button" className="confirm-cancel-btn" onClick={handleCancelClientDelete}>Cancel</button>
              <button type="button" className="confirm-delete-btn" onClick={handleConfirmClientDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

{isManagerModalOpen && clientForManagerSelection && (
        <div className="modal-overlay open">
            <div className="modal-content manager-select-modal">
                <div className="modal-header">
                    <h3 className="modal-title">Select Manager for {clientForManagerSelection.firstName}</h3>
                    <button className="modal-close-btn" onClick={handleCloseManagerModal}>&times;</button>
                </div>

                 <div className="manager-search-container">
                    <input
                        type="text"
                        placeholder="Search managers by name..."
                        className="manager-search-input"
                        value={managerSearchTerm}
                        onChange={(e) => setManagerSearchTerm(e.target.value)}
                    />
                </div>

                <div className="manager-list">
                    {managerList
                        .filter(manager => 
                            `${manager.firstName} ${manager.lastName}`.toLowerCase().includes(managerSearchTerm.toLowerCase())
                        )
                        .map(manager => (
                            <div key={manager.id} className="manager-item" onClick={() => handleSelectManager(`${manager.firstName} ${manager.lastName}`)}>
                                <div className="manager-avatar">{`${manager.firstName.charAt(0)}${manager.lastName.charAt(0)}`}</div>
                                <div className="manager-info">
                                    <div className="manager-name">{`${manager.firstName} ${manager.lastName}`}</div>
                                    <div className="manager-email">{manager.personalEmail}</div>
                                </div>
                            </div>
                        ))
                      }
                </div>
            </div>
        </div>
      )}

{/* Client Details Modal */}
      {isClientDetailsModalOpen && selectedClientForDetails && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">

              <h3 className="assign-modal-title">Client Details: {selectedClientForDetails.name || selectedClientForDetails.firstName + ' ' + selectedClientForDetails.lastName}</h3>




              <button className="assign-modal-close-button" onClick={handleCloseClientDetailsModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.2rem', height: '1.2rem' }}>
                  <path d="M6.29289 6.29289C6.68342 5.90237 7.31658 5.90237 7.70711 6.29289L12 10.5858L16.2929 6.29289C16.6834 5.90237 17.3166 5.90237 17.7071 6.29289C18.0976 6.68342 18.0976 7.31658 17.7071 7.70711L13.4142 12L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L12 13.4142L7.70711 17.7071C5.90237 7.31658 5.90237 6.68342 6.29289 6.29289Z" />
                </svg>
              </button>
            </div>

              {/* ====== CONDITIONAL RENDERING LOGIC STARTS HERE ====== */}
            {simplifiedServices.includes(selectedClientForDetails.service) ? (
              // --- NEW SIMPLIFIED VIEW ---
              <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">Service Request Details</h4>
                  <div className="assign-form-group">
                    <label>First Name *</label>
                    <div className="read-only-value">{selectedClientForDetails.firstName || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Last Name *</label>
                    <div className="read-only-value">{selectedClientForDetails.lastName || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Mobile *</label>
                    <div className="read-only-value">{selectedClientForDetails.mobile || '-'}</div>
                  </div>
                   <div className="assign-form-group">
                    <label>Email ID *</label>
                    <div className="read-only-value">{selectedClientForDetails.email || '-'}</div>
                  </div>
                  <div className="assign-form-group">
                    <label>Service *</label>
                    <div className="read-only-value">{selectedClientForDetails.service || '-'}</div>
                  </div>
                  {selectedClientForDetails.subServices && selectedClientForDetails.subServices.length > 0 && (
                    <div className="assign-form-group">
                      <label>What service do you want?</label>
                      <div className="read-only-value">
                        {selectedClientForDetails.subServices.join(', ') || '-'}
                      </div>
                    </div>
                  )}
                  <div className="assign-form-group">
                    <label>Who are you?</label>
                    <div className="read-only-value">{selectedClientForDetails.userType || '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              // --- ORIGINAL DETAILED VIEW ---
              <>
            {/* Comprehensive Client Details Grid - now read-only form fields */}
            <div className="client-preview-grid-container">
              {/* Personal Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Personal Information</h4>
                <div className="assign-form-group">
                  <label>First Name</label>
                  <div className="read-only-value">{selectedClientForDetails.firstName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Middle Name</label>
                  <div className="read-only-value">{selectedClientForDetails.middleName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Last Name</label>
                  <div className="read-only-value">{selectedClientForDetails.lastName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Date of Birth</label>
                  <div className="read-only-value">{selectedClientForDetails.dob || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Gender</label>
                  <div className="read-only-value">{selectedClientForDetails.gender || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Ethnicity</label>
                  <div className="read-only-value">{selectedClientForDetails.ethnicity || '-'}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Contact Information</h4>
                <div className="assign-form-group">
                  <label>Address</label>
                  <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.address || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Zip Code</label>
                  <div className="read-only-value">{selectedClientForDetails.zipCode || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Mobile</label>
                  <div className="read-only-value">{selectedClientForDetails.mobile || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Email</label>
                  <div className="read-only-value">{selectedClientForDetails.email || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Country</label>
                  <div className="read-only-value">{selectedClientForDetails.country || '-'}</div>
                </div>
              </div>

              {/* Service Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Service Details</h4>
                <div className="assign-form-group">
                  <label>Service</label>
                  <div className="read-only-value">{selectedClientForDetails.service || '-'}</div>
                </div>
                {selectedClientForDetails.subServices && selectedClientForDetails.subServices.length > 0 && (
                  <div className="assign-form-group">
                    <label>What Service do you want?</label>
                    <div className="read-only-value">
                      {selectedClientForDetails.subServices.join(', ') || '-'}
                    </div>
                  </div>
                )}
                <div className="assign-form-group">
                  <label>Who are you?</label>
                  <div className="read-only-value">{selectedClientForDetails.userType || '-'}</div>
                </div>
              </div>

              {/* Job Preferences & Status */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Preferences & Status</h4>
                <div className="assign-form-group">
                  <label>Security Clearance</label>
                  <div className="read-only-value">{selectedClientForDetails.securityClearance || '-'}</div>
                </div>
                {selectedClientForDetails.securityClearance === 'Yes' && (
                  <div className="assign-form-group">
                    <label>Clearance Level</label>
                    <div className="read-only-value">{selectedClientForDetails.clearanceLevel || '-'}</div>
                  </div>
                )}
                <div className="assign-form-group">
                  <label>Willing to Relocate</label>
                  <div className="read-only-value">{selectedClientForDetails.willingToRelocate || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Work Preference</label>
                  <div className="read-only-value">{selectedClientForDetails.workPreference || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Restricted Companies</label>
                  <div className="read-only-value">{selectedClientForDetails.restrictedCompanies || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Jobs to Apply</label>
                  <div className="read-only-value">{selectedClientForDetails.jobsToApply || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Current Salary</label>
                  <div className="read-only-value">${selectedClientForDetails.currentSalary || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Expected Salary</label>
                  <div className="read-only-value">${selectedClientForDetails.expectedSalary || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Visa Status</label>
                  <div className="read-only-value">{selectedClientForDetails.visaStatus || '-'}</div>
                </div>
                {selectedClientForDetails.visaStatus === 'Other' && (
                  <div className="assign-form-group">
                    <label>Other Visa Status</label>
                    <div className="read-only-value">{selectedClientForDetails.otherVisaStatus || '-'}</div>
                  </div>
                )}
                <div className="assign-form-group">
                  <label>Priority</label>
                  <div className="read-only-value">{selectedClientForDetails.priority || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Status</label>
                  <div className="read-only-value">{selectedClientForDetails.status || '-'}</div>
                </div>
              </div>

              {/* Education Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Education Details</h4>
                <div className="assign-form-group">
                  <label>School Name</label>
                  <div className="read-only-value">{selectedClientForDetails.schoolName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>School Address</label>
                  <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.schoolAddress || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>School Phone</label>
                  <div className="read-only-value">{selectedClientForDetails.schoolPhone || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Course of Study</label>
                  <div className="read-only-value">{selectedClientForDetails.courseOfStudy || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Graduation Date</label>
                  <div className="read-only-value">{selectedClientForDetails.graduationDate || '-'}</div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Employment Details</h4>
                <div className="assign-form-group">
                  <label>Current Company</label>
                  <div className="read-only-value">{selectedClientForDetails.currentCompany || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Current Designation</label>
                  <div className="read-only-value">{selectedClientForDetails.currentDesignation || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Preferred Interview Time</label>
                  <div className="read-only-value">{selectedClientForDetails.preferredInterviewTime || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Earliest Joining Date</label>
                  <div className="read-only-value">{selectedClientForDetails.earliestJoiningDate || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Relieving Date</label>
                  <div className="read-only-value">{selectedClientForDetails.relievingDate || '-'}</div>
                </div>
              </div>

              {/* References */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">References</h4>
                <div className="assign-form-group">
                  <label>Reference Name</label>
                  <div className="read-only-value">{selectedClientForDetails.referenceName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Reference Phone</label>
                  <div className="read-only-value">{selectedClientForDetails.referencePhone || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Reference Address</label>
                  <div className="read-only-value" style={{ minHeight: '60px' }}>{selectedClientForDetails.referenceAddress || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Reference Email</label>
                  <div className="read-only-value">{selectedClientForDetails.referenceEmail || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Reference Role</label>
                  <div className="read-only-value">{selectedClientForDetails.referenceRole || '-'}</div>
                </div>
              </div>

              {/* Job Portal Accounts */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Portal Accounts</h4>

                <div className="assign-form-group">
                  <label>Account Name</label>
                  <div className="read-only-value">{selectedClientForDetails.jobPortalAccountName || '-'}</div>
                </div>
                <div className="assign-form-group">
                  <label>Credentials</label>
                  <div className="read-only-value">{selectedClientForDetails.jobPortalCredentials || '-'}</div>
                </div>
              </div>
            </div>

            {/* Skills section for viewing */}
            {selectedClientForDetails.technologySkills && (
              <div className="client-preview-skills-section">
                <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                <div className="assign-form-group">
                  <div className="read-only-value" style={{ minHeight: '80px', alignItems: 'flex-start' }}>
                    {Array.isArray(selectedClientForDetails.technologySkills) ? selectedClientForDetails.technologySkills.join(', ') : selectedClientForDetails.technologySkills || '-'}
                  </div>
                </div>
              </div>
              )}
              </>
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button assign" onClick={handleEditClientDetailsClick}>
                Edit Client Details
              </button>
            </div>
          </div>
        </div>
      )}

          {/* Edit Client Modal (now with matching style) */}
      {isEditClientModalOpen && currentClientToEdit && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">

              <h3 className="assign-modal-title">Edit Client Details: {currentClientToEdit.name || currentClientToEdit.firstName + ' ' + currentClientToEdit.lastName}</h3>


              <button className="assign-modal-close-button" onClick={handleCloseEditClientModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.2rem', height: '1.2rem' }}>
                  <path d="M6.29289 6.29289C6.68342 5.90237 7.31658 5.90237 7.70711 6.29289L12 10.5858L16.2929 6.29289C16.6834 5.90237 17.3166 5.90237 17.7071 6.29289C18.0976 6.68342 18.0976 7.31658 17.7071 7.70711L13.4142 12L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L12 13.4142L7.70711 17.7071C5.90237 7.31658 5.90237 6.68342 6.29289 6.29289Z" />
                </svg>
              </button>
            </div>
             {/* ====== CONDITIONAL RENDERING LOGIC FOR EDIT FORM ====== */}
              {simplifiedServices.includes(currentClientToEdit.service) ? (
                // --- NEW SIMPLIFIED EDIT FORM ---
                <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Service Request Details</h4>
                    <div className="assign-form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input type="text" id="firstName" name="firstName" value={currentClientToEdit.firstName || ''} onChange={handleEditClientChange} required />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input type="text" id="lastName" name="lastName" value={currentClientToEdit.lastName || ''} onChange={handleEditClientChange} required />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="mobile">Mobile *</label>
                      <input type="tel" id="mobile" name="mobile" value={currentClientToEdit.mobile || ''} onChange={handleEditClientChange} required />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="email">Email ID *</label>
                      <input type="email" id="email" name="email" value={currentClientToEdit.email || ''} onChange={handleEditClientChange} required />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="service">Service *</label>
                      <select id="service" name="service" value={currentClientToEdit.service || ''} onChange={handleEditClientChange} required>
                        <option value="">Select Service</option>
                        {serviceOptions.filter(opt => opt !== 'All').map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="subServices">What service do you want? (Comma Separated)</label>
                      <textarea
                        id="subServices"
                        name="subServices"
                        value={Array.isArray(currentClientToEdit.subServices) ? currentClientToEdit.subServices.join(', ') : (currentClientToEdit.subServices || '')}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setCurrentClientToEdit(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()) }));
                        }}
                      ></textarea>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="userType">Who are you?</label>
                       <select id="userType" name="userType" value={currentClientToEdit.userType || ''} onChange={handleEditClientChange}>
                         <option value="">Select Type</option>
                         <option value="Individual">Individual</option>
                         <option value="Business Owner">Business Owner</option>
                         <option value="Startup Founder">Startup Founder</option>
                         <option value="Agency">Agency</option>
                         <option value="Student">Student</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                // --- ORIGINAL DETAILED EDIT FORM ---
                <>

            {/* Comprehensive Client Details Grid - now with input fields */}
            <div className="client-preview-grid-container">
              {/* Personal Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Personal Information</h4>

                <div className="assign-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={currentClientToEdit.firstName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input type="text" id="middleName" name="middleName" value={currentClientToEdit.middleName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={currentClientToEdit.lastName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" name="dob" value={currentClientToEdit.dob || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={currentClientToEdit.gender || ''} onChange={handleEditClientChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="ethnicity">Ethnicity</label>
                  <input type="text" id="ethnicity" name="ethnicity" value={currentClientToEdit.ethnicity || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Contact Information</h4>

                <div className="assign-form-group">
                  <label htmlFor="address">Address</label>
                  <textarea id="address" name="address" value={currentClientToEdit.address || ''} onChange={handleEditClientChange}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input type="text" id="zipCode" name="zipCode" value={currentClientToEdit.zipCode || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="mobile">Mobile</label>
                  <input type="tel" id="mobile" name="mobile" value={currentClientToEdit.mobile || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={currentClientToEdit.email || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" name="country" value={currentClientToEdit.country || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* Service Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Service Details</h4>
                <div className="assign-form-group">
                  <label htmlFor="service">Service</label>
                  <select id="service" name="service" value={currentClientToEdit.service || ''} onChange={handleEditClientChange}>
                    <option value="">Select Service</option>
                    {serviceOptions.filter(opt => opt !== 'All').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {(currentClientToEdit.service === 'Mobile Development' ||
                  currentClientToEdit.service === 'Web Development' ||
                  currentClientToEdit.service === 'Digital Marketing' ||
                  currentClientToEdit.service === 'IT Talent Supply') && (
                    <div className="assign-form-group">
                      <label htmlFor="subServices">What Service do you want? (Comma Separated)</label>
                      <textarea
                        id="subServices"
                        name="subServices"
                        value={Array.isArray(currentClientToEdit.subServices) ? currentClientToEdit.subServices.join(', ') : currentClientToEdit.subServices || ''}
                        onChange={(e) => setCurrentClientToEdit(prev => ({ ...prev, subServices: e.target.value.split(',').map(s => s.trim()) }))}
                      ></textarea>
                    </div>
                  )}
                <div className="assign-form-group">
                  <label htmlFor="userType">Who are you?</label>
                  <input type="text" id="userType" name="userType" value={currentClientToEdit.userType || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* Job Preferences & Status */}

              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Preferences & Status</h4>



                <div className="assign-form-group">
                  <label htmlFor="securityClearance">Security Clearance</label>
                  <select id="securityClearance" name="securityClearance" value={currentClientToEdit.securityClearance || 'No'} onChange={handleEditClientChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>





                </div>
                {currentClientToEdit.securityClearance === 'Yes' && (
                  <div className="assign-form-group">
                    <label htmlFor="clearanceLevel">Clearance Level</label>
                    <input type="text" id="clearanceLevel" name="clearanceLevel" value={currentClientToEdit.clearanceLevel || ''} onChange={handleEditClientChange} />
                  </div>
                )}
                <div className="assign-form-group">
                  <label htmlFor="willingToRelocate">Willing to Relocate</label>
                  <select id="willingToRelocate" name="willingToRelocate" value={currentClientToEdit.willingToRelocate || 'No'} onChange={handleEditClientChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="workPreference">Work Preference</label>
                  <input type="text" id="workPreference" name="workPreference" value={currentClientToEdit.workPreference || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="restrictedCompanies">Restricted Companies</label>
                  <input type="text" id="restrictedCompanies" name="restrictedCompanies" value={currentClientToEdit.restrictedCompanies || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="jobsToApply">Jobs to Apply</label>
                  <input type="text" id="jobsToApply" name="jobsToApply" value={currentClientToEdit.jobsToApply || ''} onChange={handleEditClientChange} />
                </div>




                <div className="assign-form-group">

                  <label htmlFor="currentSalary">Current Salary</label>
                  <input type="text" id="currentSalary" name="currentSalary" value={currentClientToEdit.currentSalary || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="expectedSalary">Expected Salary</label>
                  <input type="text" id="expectedSalary" name="expectedSalary" value={currentClientToEdit.expectedSalary || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="visaStatus">Visa Status</label>
                  <input type="text" id="visaStatus" name="visaStatus" value={currentClientToEdit.visaStatus || ''} onChange={handleEditClientChange} />
                </div>
                {currentClientToEdit.visaStatus === 'Other' && (
                  <div className="assign-form-group">
                    <label htmlFor="otherVisaStatus">Other Visa Status</label>
                    <input type="text" id="otherVisaStatus" name="otherVisaStatus" value={currentClientToEdit.otherVisaStatus || ''} onChange={handleEditClientChange} />
                  </div>
                )}
                <div className="assign-form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" value={currentClientToEdit.priority || 'medium'} onChange={handleEditClientChange}>
                    <option value="high">High</option>

                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="status">Status</label>
                  <input type="text" id="status" name="status" value={currentClientToEdit.status || ''} onChange={handleEditClientChange} />




                </div>
              </div>

              {/* Education Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Education Details</h4>
                <div className="assign-form-group">
                  <label htmlFor="schoolName">School Name</label>
                  <input type="text" id="schoolName" name="schoolName" value={currentClientToEdit.schoolName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="schoolAddress">School Address</label>
                  <textarea id="schoolAddress" name="schoolAddress" value={currentClientToEdit.schoolAddress || ''} onChange={handleEditClientChange}></textarea>




                </div>
                <div className="assign-form-group">
                  <label htmlFor="schoolPhone">School Phone</label>
                  <input type="tel" id="schoolPhone" name="schoolPhone" value={currentClientToEdit.schoolPhone || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="courseOfStudy">Course of Study</label>
                  <input type="text" id="courseOfStudy" name="courseOfStudy" value={currentClientToEdit.courseOfStudy || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="graduationDate">Graduation Date</label>
                  <input type="date" id="graduationDate" name="graduationDate" value={currentClientToEdit.graduationDate || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* Employment Details */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Employment Details</h4>

                <div className="assign-form-group">
                  <label htmlFor="currentCompany">Current Company</label>
                  <input type="text" id="currentCompany" name="currentCompany" value={currentClientToEdit.currentCompany || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="currentDesignation">Current Designation</label>
                  <input type="text" id="currentDesignation" name="currentDesignation" value={currentClientToEdit.currentDesignation || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="preferredInterviewTime">Preferred Interview Time</label>
                  <input type="text" id="preferredInterviewTime" name="preferredInterviewTime" value={currentClientToEdit.preferredInterviewTime || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="earliestJoiningDate">Earliest Joining Date</label>
                  <input type="date" id="earliestJoiningDate" name="earliestJoiningDate" value={currentClientToEdit.earliestJoiningDate || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="relievingDate">Relieving Date</label>
                  <input type="date" id="relievingDate" name="relievingDate" value={currentClientToEdit.relievingDate || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* References */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">References</h4>
                <div className="assign-form-group">
                  <label htmlFor="referenceName">Reference Name</label>
                  <input type="text" id="referenceName" name="referenceName" value={currentClientToEdit.referenceName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referencePhone">Reference Phone</label>
                  <input type="tel" id="referencePhone" name="referencePhone" value={currentClientToEdit.referencePhone || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceAddress">Reference Address</label>
                  <textarea id="referenceAddress" name="referenceAddress" value={currentClientToEdit.referenceAddress || ''} onChange={handleEditClientChange}></textarea>
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceEmail">Reference Email</label>
                  <input type="email" id="referenceEmail" name="referenceEmail" value={currentClientToEdit.referenceEmail || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="referenceRole">Reference Role</label>
                  <input type="text" id="referenceRole" name="referenceRole" value={currentClientToEdit.referenceRole || ''} onChange={handleEditClientChange} />
                </div>
              </div>

              {/* Job Portal Accounts */}
              <div className="client-preview-section">
                <h4 className="client-preview-section-title">Job Portal Accounts</h4>

                <div className="assign-form-group">
                  <label htmlFor="jobPortalAccountName">Account Name</label>
                  <input type="text" id="jobPortalAccountName" name="jobPortalAccountName" value={currentClientToEdit.jobPortalAccountName || ''} onChange={handleEditClientChange} />
                </div>
                <div className="assign-form-group">
                  <label htmlFor="jobPortalCredentials">Credentials</label>
                  <input type="text" id="jobPortalCredentials" name="jobPortalCredentials" value={currentClientToEdit.jobPortalCredentials || ''} onChange={handleEditClientChange} />
                </div>
              </div>

            </div>

            {/* Skills section for editing */}
            {currentClientToEdit.technologySkills && (
              <div className="client-preview-skills-section">
                <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                <div className="assign-form-group">
                  <textarea
                    id="skills"
                    name="technologySkills" // Changed to technologySkills to match the client object
                    value={Array.isArray(currentClientToEdit.technologySkills) ? currentClientToEdit.technologySkills.join(', ') : currentClientToEdit.technologySkills || ''}
                    onChange={handleEditClientChange} // Use the general handler
                  ></textarea>
                </div>
              </div>
              )}
                </>
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={handleCloseEditClientModal}>
                Cancel
              </button>
              <button className="assign-form-button assign" onClick={handleSaveClientDetails}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Payment Management Modal */}
      {isPaymentModalOpen && selectedClientForPayment && (
        <div className="modal-overlay open">
          <div className="modal-content payment-modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Payment Management</h3>
                <p className="modal-subtitle">Create payment links or process immediate payments for {selectedClientForPayment.name}</p>
              </div>
              <button className="modal-close-btn" onClick={handleClosePaymentModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleGeneratePaymentLink(); }}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="paymentAmount" className="form-label">Amount *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>USD</span>
                  <input
                    type="number"
                    id="paymentAmount"
                    name="amount"
                    className="form-input"
                    placeholder="0.00"
                    value={paymentDetails.amount}
                    onChange={handlePaymentDetailsChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="paymentDescription" className="form-label">Description *</label>
                <input
                  type="text"
                  id="paymentDescription"
                  name="description"
                  className="form-input"
                  placeholder="e.g., Service charges, Consultation fee"
                  value={paymentDetails.description}
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="transactionDate" className="form-label">Transaction Date</label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  className="form-input"
                  value={paymentDetails.transactionDate}
                  readOnly
                />
              </div>

              <div className="payment-modal-client-details modal-form-full-width">
                <p><strong>Client Details:</strong></p>
                <p>Name: {selectedClientForPayment.name}</p>
                <p>Email: {selectedClientForPayment.email}</p>
                <p>Phone: {selectedClientForPayment.mobile}</p>
              </div>

              {generatedPaymentLink ? (
                <div className="generated-link-section modal-form-full-width">
                  <div className="generated-link-header">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.29289C17.0976 8.90237 17.0976 8.26921 16.7071 7.87869C16.3166 7.48816 15.6834 7.48816 15.2929 7.87869L10.5 12.6716L8.70711 10.8787C8.31658 10.4882 7.68342 10.4882 7.29289 10.8787C6.90237 11.2692 6.90237 11.9024 7.29289 12.2929L9.87869 14.8787C10.2692 15.2692 10.9024 15.2692 11.2929 14.8787L16.7071 9.46447V9.29289Z" />
                    </svg>
                    Payment Link Generated:
                  </div>
                  <div className="generated-link-input-group">
                    <input
                      type="text"
                      className="generated-link-input"
                      value={generatedPaymentLink}
                      readOnly
                    />
                    <div className="generated-link-actions">
                      <button type="button" className="generated-link-action-btn" onClick={handleCopyLink}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1ZM18 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H18C19.1046 23 20 22.1046 20 21V7C20 5.89543 19.1046 5 18 5ZM8 7H18V21H8V7Z" />
                        </svg>
                        Copy Link
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handleSendEmail}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Send Email
                      </button>
                      <button type="button" className="generated-link-action-btn" onClick={handlePreviewLink}>

                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4L20 4M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>
                  <button type="button" className="generated-link-close-btn" onClick={handleClosePaymentModal}>Close</button>
                </div>
              ) : (
                <div className="modal-footer modal-form-full-width">
                  <button type="button" className="confirm-cancel-btn" onClick={handleClosePaymentModal}>Cancel</button>

                  <button type="submit" className="create-employee-btn">

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.9rem', height: '0.9rem' }}>
                      <path d="M12 4H10C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12H12V14H10C6.68629 14 4 11.3137 4 8C4 4.68629 6.68629 2 10 2H12V4ZM14 10H12C9.79086 10 8 11.7909 8 14C8 16.2091 9.79086 18 12 18H14V20H12C8.68629 20 6 17.3137 6 14C6 10.6863 8.68629 8 12 8H14V10ZM18 6H16V8H18C21.3137 8 24 10.6863 24 14C24 17.3137 21.3137 20 18 20H16V18H18C20.2091 18 22 16.2091 22 14C22 11.7909 20.2091 10 18 10H16V6Z" />
                    </svg>
                    Generate Link
                  </button>
                </div>
              )}

              <div className="payment-modal-options modal-form-full-width">
                <h4>Payment Options:</h4>
                <p className="payment-modal-option-item">
                  • <strong>Pay Now:</strong> Opens secure payment gateway for immediate processing
                </p>
                <p className="payment-modal-option-item">
                  • <strong>Generate Link:</strong> Creates shareable payment link for client use
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// This is a wrapper to make the component runnable.
// In a real application, you would import ClientManagement and use it within your routing structure.
// const App = () => {
//     return <ClientManagement />;
// }

export default ClientManagement;
