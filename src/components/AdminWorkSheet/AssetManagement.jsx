import React, { useState } from 'react';

const AssetManagement = () => {
  // --- Asset Management States ---
  const [assets, setAssets] = useState([
    { id: 1, tag: 'TXP-LT-001', name: 'Dell Latitude 5520', type: 'Laptop', status: 'assigned', assignedTo: 'John Smith', assignedDate: '2024-02-01' },
    { id: 2, tag: 'TXP-MON-001', name: 'Dell UltraSharp U2720Q', type: 'Monitor', status: 'assigned', assignedTo: 'Sarah Johnson', assignedDate: '2024-01-10' },
    { id: 3, tag: 'TXP-MB-001', name: 'iPhone 15 Pro', type: 'Mobile', status: 'assigned', assignedTo: 'Mike Chen', assignedDate: '2024-05-04' },
    { id: 4, tag: 'TXP-LT-002', name: 'HP Spectre x360', type: 'Laptop', status: 'available', assignedTo: null, assignedDate: null },
    { id: 5, tag: 'TXP-KB-001', name: 'Logitech MX Keys', type: 'Keyboard', status: 'available', assignedTo: null, assignedDate: null },
  ]);

  const [assetAssignments, setAssetAssignments] = useState([
    { id: 1, assetId: 1, employeeId: 5, assignedDate: '2024-02-01', reason: 'New employee laptop setup' },
    { id: 2, assetId: 2, employeeId: 2, assignedDate: '2024-01-10', reason: 'Manager workstation upgrade' },
    { id: 3, assetId: 3, employeeId: 3, assignedDate: '2024-05-04', reason: 'Team lead mobile device' },
  ]);

  // Employee state is needed for assignment dropdowns
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Admin employee', email: 'admin@techxplorers.in', roles: ['admin', 'active', 'management'] },
    { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', roles: ['manager', 'active', 'management'] },
    { id: 3, name: 'Michael Johnson', email: 'michael.j@example.com', roles: ['team lead', 'active', 'tech placement'] },
    { id: 4, name: 'Asset Manager', email: 'asset.mgr@email.com', roles: ['asset manager', 'active', 'operations'] },
    { id: 5, name: 'John Employee', email: 'john.emp@email.com', roles: ['employee', 'active', 'development'] },
  ]);

  // Modal and Search States
  const [isAssignAssetModalOpen, setIsAssignAssetModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assetId: '',
    employeeId: '',
    reason: '',
  });
  const [assetSearchTermInModal, setAssetSearchTermInModal] = useState('');
  const [employeeSearchTermInModal, setEmployeeSearchTermInModal] = useState('');

  // --- Asset Management Handlers ---
  const handleAssignAssetClick = () => {
    setIsAssignAssetModalOpen(true);
  };

  const handleCloseAssignAssetModal = () => {
    setIsAssignAssetModalOpen(false);
    setNewAssignment({ assetId: '', employeeId: '', reason: '' });
    setAssetSearchTermInModal('');
    setEmployeeSearchTermInModal('');
  };

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignAsset = (e) => {
    e.preventDefault();
    const { assetId, employeeId, reason } = newAssignment;
    if (!assetId || !employeeId || !reason) {
      console.error('Please fill in all required fields.');
      return;
    }
    const assignedAsset = assets.find(asset => asset.id === parseInt(assetId));
    const assignedEmployee = employees.find(emp => emp.id === parseInt(employeeId));

    if (assignedAsset && assignedEmployee) {
      const newAssignmentEntry = {
        id: assetAssignments.length > 0 ? Math.max(...assetAssignments.map(a => a.id)) + 1 : 1,
        assetId: assignedAsset.id,
        employeeId: assignedEmployee.id,
        assignedDate: new Date().toISOString().slice(0, 10),
        reason: reason,
      };
      setAssetAssignments(prev => [...prev, newAssignmentEntry]);
      setAssets(prevAssets => prevAssets.map(asset =>
        asset.id === assignedAsset.id
          ? { ...asset, status: 'assigned', assignedTo: assignedEmployee.name, assignedDate: newAssignmentEntry.assignedDate }
          : asset
      ));
      handleCloseAssignAssetModal();
    } else {
      console.error('Selected asset or employee not found.');
    }
  };
  
  const filteredAvailableAssets = assets.filter(asset =>
    asset.status === 'available' &&
    (asset.tag.toLowerCase().includes(assetSearchTermInModal.toLowerCase()) ||
      asset.name.toLowerCase().includes(assetSearchTermInModal.toLowerCase()))
  );

  const filteredEmployeesForAssignment = employees.filter(employee =>
    (employee.name || '').toLowerCase().includes(employeeSearchTermInModal.toLowerCase()) ||
    (employee.email || '').toLowerCase().includes(employeeSearchTermInModal.toLowerCase())
  );

  // --- Style Helper Functions ---
  const getRoleTagBg = (role) => {
    switch (role?.toLowerCase()) {
      case 'assigned': return '#E0F2FE';
      case 'available': return '#D9F5E6';
      default: return '#E5E7EB';
    }
  };

  const getRoleTagText = (role) => {
    switch (role?.toLowerCase()) {
      case 'assigned': return '#2563EB';
      case 'available': return '#28A745';
      default: return '#6B7280';
    }
  };

  return (
    <div className="ad-body-container">
      <style>{`
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
            --modal-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
            --modal-title-color: #1f2937;
            --modal-subtitle-color: #6b7280;
            --modal-close-btn-color: #6b7280;
            --modal-input-border: #d1d5db;
            --modal-input-bg: #ffffff;
            --search-icon: #9ca3af;
            --modal-label-color: #374151;
            --confirm-modal-cancel-btn-bg: #e5e7eb;
            --confirm-modal-cancel-btn-text: #4b5563;
            --create-employee-btn-bg: #2563eb;
            --create-employee-btn-text: #ffffff;
            --asset-card-icon-bg-total: #E0F2FE;
            --asset-card-icon-color-total: #2563EB;
            --asset-card-icon-bg-available: #D9F5E6;
            --asset-card-icon-color-available: #28A745;
            --asset-card-icon-bg-assigned: #F3E5F5;
            --asset-card-icon-color-assigned: #9C27B0;
            --asset-card-icon-bg-pending: #FFF3E0;
            --asset-card-icon-color-pending: #FF9800;
            --assign-asset-btn-bg: #2563EB;
            --assign-asset-btn-hover: #1D4ED8;
            --assign-asset-btn-text: #ffffff;
            --asset-section-title-color: #1f2937;
            --asset-section-subtitle-color: #6b7280;
            --asset-quick-assign-bg: #ffffff;
            --asset-quick-assign-border: #e5e7eb;
            --asset-quick-assign-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            --asset-quick-assign-card-bg: #f9fafb;
            --asset-quick-assign-card-border: #e5e7eb;
            --asset-quick-assign-card-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            --asset-quick-assign-card-title: #1f2937;
            --asset-quick-assign-card-text: #6b7280;
            --asset-quick-assign-btn-bg: #2563eb;
            --asset-quick-assign-btn-hover: #1d4ed8;
            --asset-quick-assign-btn-text: #ffffff;
            --asset-activity-table-header-bg: #f9fafb;
            --asset-activity-table-header-text: #6b7280;
            --asset-activity-table-row-border: #e5e7eb;
            --asset-activity-table-row-hover-bg: #f9fafb;
            --asset-activity-text-primary: #1f2937;
            --asset-activity-text-secondary: #6b7280;
        }

        .ad-body-container {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            min-height: 100vh;
            color: var(--text-primary);
        }

        .asset-management-container {
            padding: 1.5rem;
        }
        .asset-management-box {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color-1), 0 2px 4px -1px var(--shadow-color-3);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
        }
        .asset-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .asset-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--asset-section-title-color);
        }
        .asset-subtitle {
            font-size: 0.875rem;
            color: var(--asset-section-subtitle-color);
        }
        .assign-asset-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            background-color: var(--assign-asset-btn-bg);
            color: var(--assign-asset-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }
        .asset-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .asset-stat-card {
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .asset-stat-card-icon-wrapper {
            border-radius: 9999px;
            padding: 0.75rem;
            font-size: 1.5rem;
        }
        .asset-stat-card-icon-wrapper.total { background-color: var(--asset-card-icon-bg-total); color: var(--asset-card-icon-color-total); }
        .asset-stat-card-icon-wrapper.available { background-color: var(--asset-card-icon-bg-available); color: var(--asset-card-icon-color-available); }
        .asset-stat-card-icon-wrapper.assigned { background-color: var(--asset-card-icon-bg-assigned); color: var(--asset-card-icon-color-assigned); }
        .asset-stat-card-icon-wrapper.pending { background-color: var(--asset-card-icon-bg-pending); color: var(--asset-card-icon-color-pending); }
        .asset-stat-card-value { font-size: 1.875rem; font-weight: 700; }
        .asset-stat-card-label { font-size: 0.875rem; color: var(--text-secondary); }
        .quick-assign-section {
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background-color: var(--asset-quick-assign-bg);
            border-radius: 0.75rem;
            border: 1px solid var(--asset-quick-assign-border);
        }
        .quick-assign-section h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .quick-assign-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        .quick-assign-card {
            background-color: var(--asset-quick-assign-card-bg);
            border-radius: 0.5rem;
            border: 1px solid var(--asset-quick-assign-card-border);
            padding: 1rem;
        }
        .quick-assign-card-header { display: flex; justify-content: space-between; align-items: center; }
        .quick-assign-card-title { font-weight: 600; }
        .quick-assign-card-info { font-size: 0.875rem; color: var(--asset-quick-assign-card-text); margin-top: 0.5rem; }
        .quick-assign-card-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            margin-top: 1rem;
            width: 100%;
            background-color: var(--asset-quick-assign-btn-bg);
            color: var(--asset-quick-assign-btn-text);
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }
        .recent-activity-section {
            padding: 1.5rem;
            background-color: var(--bg-card);
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
        }
        .recent-activity-section h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .asset-activity-table-container { overflow-x: auto; }
        .asset-activity-table { width: 100%; border-collapse: collapse; }
        .asset-activity-table th, .asset-activity-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--asset-activity-table-row-border); }
        .asset-activity-table thead { background-color: var(--asset-activity-table-header-bg); }
        .asset-activity-table th { font-weight: 600; color: var(--asset-activity-table-header-text); }
        .asset-activity-table .asset-info { display: flex; align-items: center; gap: 0.75rem; }
        .asset-activity-table .asset-icon-wrapper { background-color: var(--asset-card-icon-bg-total); color: var(--asset-card-icon-color-total); padding: 0.5rem; border-radius: 0.5rem; }
        .asset-status-tag { padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.8rem; }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--modal-overlay-bg); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s ease; }
        .modal-overlay.open { opacity: 1; visibility: visible; }
        .modal-content { background-color: var(--modal-bg); border-radius: 0.75rem; box-shadow: var(--modal-shadow); width: 90%; max-width: 600px; padding: 1.5rem; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .modal-title { font-size: 1.25rem; font-weight: 600; }
        .modal-subtitle { font-size: 0.875rem; color: var(--modal-subtitle-color); margin-top: 0.25rem; }
        .modal-close-btn { background: none; border: none; font-size: 1.5rem; color: var(--modal-close-btn-color); cursor: pointer; }
        .modal-form { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .modal-form-full-width { grid-column: 1 / -1; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label { font-weight: 500; color: var(--modal-label-color); }
        .form-input, .form-select, textarea { padding: 0.75rem 1rem; border: 1px solid var(--modal-input-border); border-radius: 0.5rem; width: 100%; box-sizing: border-box; }
        .modal-footer { margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem; }
        .create-employee-btn { padding: 0.75rem 1.5rem; background-color: var(--create-employee-btn-bg); color: var(--create-employee-btn-text); border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; }
        .confirm-cancel-btn { padding: 0.75rem 1.5rem; background-color: var(--confirm-modal-cancel-btn-bg); color: var(--confirm-modal-cancel-btn-text); border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer; }
      `}
      </style>

      <main>
        <div className="asset-management-container">
          <div className="asset-management-box">
            <div className="asset-header">
              <div>
                <h2 className="asset-title">Asset Management</h2>
                <p className="asset-subtitle">Assign and manage equipment for your team.</p>
              </div>
              <button className="assign-asset-btn" onClick={handleAssignAssetClick}>Assign Asset</button>
            </div>

            <div className="asset-stats-grid">
              <div className="asset-stat-card">
                <div className="asset-stat-card-icon-wrapper total">A</div>
                <div>
                  <div className="asset-stat-card-value">{assets.length}</div>
                  <div className="asset-stat-card-label">Total Assets</div>
                </div>
              </div>
              <div className="asset-stat-card">
                <div className="asset-stat-card-icon-wrapper available">✓</div>
                <div>
                  <div className="asset-stat-card-value">{assets.filter(a => a.status === 'available').length}</div>
                  <div className="asset-stat-card-label">Available</div>
                </div>
              </div>
              <div className="asset-stat-card">
                <div className="asset-stat-card-icon-wrapper assigned">👤</div>
                <div>
                  <div className="asset-stat-card-value">{assets.filter(a => a.status === 'assigned').length}</div>
                  <div className="asset-stat-card-label">Assigned</div>
                </div>
              </div>
              <div className="asset-stat-card">
                <div className="asset-stat-card-icon-wrapper pending">⏳</div>
                <div>
                  <div className="asset-stat-card-value">0</div>
                  <div className="asset-stat-card-label">Pending</div>
                </div>
              </div>
            </div>

            <div className="quick-assign-section">
              <h3>Quick Asset Assignment by Role</h3>
              <div className="quick-assign-grid">
                {['Admin', 'Manager', 'Team Lead', 'Employee'].map(role => (
                  <div className="quick-assign-card" key={role}>
                    <div className="quick-assign-card-header">
                      <div className="quick-assign-card-title">{role}</div>
                    </div>
                    <div className="quick-assign-card-info">Users: {employees.filter(emp => emp.roles.includes(role.toLowerCase())).length}</div>
                    <button className="quick-assign-card-btn" onClick={handleAssignAssetClick}>Assign to {role}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-activity-section">
              <h3>Recent Asset Activity</h3>
              <div className="asset-activity-table-container">
                <table className="asset-activity-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetAssignments.map(assignment => {
                      const asset = assets.find(a => a.id === assignment.assetId);
                      const employee = employees.find(e => e.id === assignment.employeeId);
                      return (
                        <tr key={assignment.id}>
                          <td>
                            <div className="asset-info">
                              <div className="asset-icon-wrapper">💻</div>
                              <div>
                                <div>{asset?.tag} - {asset?.name}</div>
                                <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{assignment.reason}</div>
                              </div>
                            </div>
                          </td>
                          <td>{employee?.name}</td>
                          <td>
                            <span className="asset-status-tag" style={{ backgroundColor: getRoleTagBg(asset?.status), color: getRoleTagText(asset?.status) }}>
                              {asset?.status}
                            </span>
                          </td>
                          <td>{assignment.assignedDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Assign Asset Modal */}
      {isAssignAssetModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Assign Asset to User</h3>
                <p className="modal-subtitle">Select an available asset and assign it.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseAssignAssetModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleAssignAsset}>
              <div className="form-group modal-form-full-width">
                <label htmlFor="searchAssets" className="form-label">Search Available Assets</label>
                <input
                  type="text"
                  id="searchAssets"
                  className="form-input"
                  placeholder="Search by asset tag or name..."
                  value={assetSearchTermInModal}
                  onChange={(e) => setAssetSearchTermInModal(e.target.value)}
                />
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="assetId" className="form-label">Select Asset *</label>
                <select id="assetId" name="assetId" className="form-select" value={newAssignment.assetId} onChange={handleNewAssignmentChange} required>
                  <option value="">Choose an asset</option>
                  {filteredAvailableAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.tag} - {asset.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="employeeId" className="form-label">Assign to User *</label>
                <select id="employeeId" name="employeeId" className="form-select" value={newAssignment.employeeId} onChange={handleNewAssignmentChange} required>
                  <option value="">Choose a user</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name} ({employee.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group modal-form-full-width">
                <label htmlFor="reason" className="form-label">Assignment Reason *</label>
                <textarea id="reason" name="reason" className="form-input" value={newAssignment.reason} onChange={handleNewAssignmentChange} rows="3" required></textarea>
              </div>
              <div className="modal-footer modal-form-full-width">
                <button type="button" className="confirm-cancel-btn" onClick={handleCloseAssignAssetModal}>Cancel</button>
                <button type="submit" className="create-employee-btn">Assign Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
