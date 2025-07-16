import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, ChevronDown, Plus, Search, Info, X, Tag, Calendar, MapPin, Hash, Edit, Trash2, LogOut, Settings } from 'lucide-react';

const AssetWorksheet = () => {
  // State variables for managing UI and data
  const [activeTab, setActiveTab] = useState('Assets');
  const [showAssignAssetModal, setShowAssignAssetModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state for notification panel
  const [notifications, setNotifications] = useState([ // Sample notifications
    { id: 1, message: 'Welcome to Asset Management Dashboard!', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, message: 'New update available for system assets.', timestamp: new Date(Date.now() - 7200000) },
  ]);  

  // Refs for dropdowns to handle clicks outside
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null); // Ref for notification panel

  // Sample data for the asset table (using useState to allow modification)
  const [assets, setAssets] = useState([
    { id: 'TXP-OTHER-261', name: 'apple pen', type: 'Other', status: 'available', assignedTo: 'Unassigned', location: 'straight opposite', value: '$300,000', brand: 'Apple', purchaseDate: '01/01/2024', serialNumber: 'AP-001-2024' },
    { id: 'TXP-LT-001', name: 'Dell Latitude 5520', type: 'Laptop', status: 'available', assignedTo: 'Unassigned', location: 'Office Floor 1', value: '$1,200', brand: 'Dell', purchaseDate: '15/03/2023', serialNumber: 'DLT-001-2023' },
    { id: 'TXP-LT-002', name: 'MacBook Pro 14"', type: 'Laptop', status: 'available', assignedTo: 'Unassigned', location: 'Asset Storage', value: '$2,500', brand: 'Apple', purchaseDate: '20/06/2023', serialNumber: 'MBP-002-2023' },
    { id: 'TXP-MON-001', name: 'Dell Ultrasharp U2720Q', type: 'Monitor', status: 'available', assignedTo: 'Unassigned', location: 'Office Floor 1', value: '$400', brand: 'Dell', purchaseDate: '10/02/2024', serialNumber: 'DMON-001-2024' },
    { id: 'TXP-DT-001', name: 'HP EliteDesk 800 G9', type: 'Desktop', status: 'assigned', assignedTo: 'John Doe', location: 'Office Floor 2', value: '$800', brand: 'HP', purchaseDate: '05/09/2022', serialNumber: 'HPDT-001-2022' },
    { id: 'TXP-MB-001', name: 'iPhone 15 Pro', type: 'Mobile', status: 'in maintenance', assignedTo: 'Unassigned', location: 'Repair Shop', value: '$1,000', brand: 'Apple', purchaseDate: '12/11/2023', serialNumber: 'IP-001-2023' },
  ]);

  // Sample users for assignment dropdown
  const users = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily White', 'Unassigned'];

  // Filtered assets based on selected status and search term
  const filteredAssets = assets.filter(asset => {
    const matchesStatus = filterStatus === 'All Statuses' || asset.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Utility to format timestamp for notifications
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'just now';
    if (diffHours < 1) return `${diffMinutes} min ago`;
    if (diffDays < 1) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Handles click for quick action buttons (Assign Assets, Add New Asset)
  const handleQuickActionClick = (action) => {
    if (action === 'assign') {
      setShowAssignAssetModal(true);
    } else if (action === 'add') {
      setShowAddAssetModal(true);
    }
  };

  // Handles click for the Edit icon in the asset table
  const handleEditAssetClick = (asset) => {
    setAssetToEdit(asset); // Set the asset to be edited
    setShowEditAssetModal(true); // Open the edit modal
  };

  // Handles updating an asset from the Edit Asset modal
  const handleUpdateAsset = (updatedAsset) => {
    // Find the original asset to compare changes
    const originalAsset = assets.find(asset => asset.id === updatedAsset.id);

    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === updatedAsset.id ? updatedAsset : asset // Replace the old asset with the updated one
      )
    );
    setShowEditAssetModal(false); // Close the edit modal
    setAssetToEdit(null); // Clear the asset to edit

    // Add notification if assignedTo changes
    if (originalAsset && originalAsset.assignedTo !== updatedAsset.assignedTo && updatedAsset.assignedTo !== 'Unassigned') {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Asset "${updatedAsset.name}" assigned to ${updatedAsset.assignedTo}.`,
        timestamp: new Date()
      }, ...prev]);
    } else if (originalAsset && originalAsset.status !== updatedAsset.status) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Status of "${updatedAsset.name}" changed to ${updatedAsset.status}.`,
        timestamp: new Date()
      }, ...prev]);
    }
  };

  // Handles click for the Delete icon in the asset table
  const handleDeleteAssetClick = (assetId) => {
    setAssetIdToDelete(assetId); // Set the ID of the asset to delete
    setShowDeleteConfirmationModal(true); // Show the delete confirmation modal
  };

  // Confirms and performs asset deletion
  const handleDeleteAssetConfirm = () => {
    console.log('Deleting asset:', assetIdToDelete);
    const deletedAsset = assets.find(asset => asset.id === assetIdToDelete);
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetIdToDelete)); // Remove the asset from the list
    setShowDeleteConfirmationModal(false); // Close the modal
    setAssetIdToDelete(null); // Clear the asset ID

    if (deletedAsset) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Asset "${deletedAsset.name}" (${deletedAsset.id}) was deleted.`,
        timestamp: new Date()
      }, ...prev]);
    }
  };

  // Cancels asset deletion
  const handleDeleteAssetCancel = () => {
    setShowDeleteConfirmationModal(false); // Close the modal
    setAssetIdToDelete(null); // Clear the asset ID
  };

  // Toggles the profile dropdown visibility
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
    setShowNotifications(false); // Close notifications if opening profile dropdown
  };

  // Toggles the notification panel visibility
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    setShowProfileDropdown(false); // Close profile dropdown if opening notifications
  };

  // Handles logout action (redirects to clientdashboard page)
  const handleLogout = () => {
    console.log('Logging out...'); // Log to check if the function is called
    // Attempt to redirect the parent window first
    if (window.parent && window.parent.location) {
      window.parent.location.href = '/clientdashboard';
    } else {
      // Fallback for environments where window.parent might not be accessible
      window.location.href = '/clientdashboard';
    }
  };

  // Handles assigning an asset from the Assign Asset modal
  const handleAssignAsset = (assignedAssetId, assignedUser, assignmentReason) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assignedAssetId
          ? { ...asset, status: 'assigned', assignedTo: assignedUser }
          : asset
      )
    );
    setShowAssignAssetModal(false); // Close the modal
    setNotifications(prev => [{
      id: Date.now(),
      message: `Asset "${assignedAssetId}" assigned to ${assignedUser} for: ${assignmentReason}.`,
      timestamp: new Date()
    }, ...prev]);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef, notificationsRef]);


  // Component for the Edit Asset Modal
  const EditAssetModal = ({ show, onClose, asset, onUpdate }) => {
    // Local state for form data, initialized with the asset prop
    const [formData, setFormData] = useState(asset);

    // Effect to update form data if the 'asset' prop changes (e.g., editing a different asset)
    useEffect(() => {
      setFormData(asset);
    }, [asset]);

    // Handles changes in form input fields
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    // Handles form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData); // Call the onUpdate prop with the current form data
    };

    // If 'show' is false, don't render the modal
    if (!show) return null;

    return (
      <div className="modal-overlay edit-asset-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Edit Asset</h3>
            <button className="modal-close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <p className="modal-description">
            Modify the details of the asset.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Grid layout for two fields per row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Asset Name *</label>
                <input type="text" name="name" placeholder="e.g., MacBook Pro 16" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <div className="form-input-icon-wrapper">
                  <select name="type" className="form-select" style={{ paddingLeft: '12px' }} value={formData.type} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Desktop</option>
                    <option>Mobile</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown size={18} className="form-input-icon" style={{ left: 'auto', right: '12px', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Vendor/Brand</label>
                <input type="text" name="brand" placeholder="e.g., Apple, Dell, HP" className="form-input" value={formData.brand || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Price</label>
                <input type="text" name="value" placeholder="e.g., $2499" className="form-input" value={formData.value} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <div className="form-input-icon-wrapper">
                  <Calendar size={18} className="form-input-icon" />
                  <input type="text" name="purchaseDate" placeholder="dd/mm/yyyy" className="form-input form-input-with-icon" value={formData.purchaseDate || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="form-input-icon-wrapper">
                  <MapPin size={18} className="form-input-icon" />
                  <input type="text" name="location" placeholder="e.g., Asset Storage, Floor 1" className="form-input form-input-with-icon" value={formData.location} onChange={handleChange} />
              </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}> {/* Span full width */}
                <label className="form-label">Serial Number</label>
                <div className="form-input-icon-wrapper">
                  <Hash size={18} className="form-input-icon" />
                  <input type="text" name="serialNumber" placeholder="e.g., MBP-001-2024" className="form-input form-input-with-icon" value={formData.serialNumber || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}> {/* Span full width */}
                <label className="form-label">Status *</label>
                <div className="form-input-icon-wrapper">
                  <select name="status" className="form-select" style={{ paddingLeft: '12px' }} value={formData.status} onChange={handleChange} required>
                    <option>available</option>
                    <option>assigned</option>
                    <option>in maintenance</option>
                  </select>
                  <ChevronDown size={18} className="form-input-icon" style={{ left: 'auto', right: '12px', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}> {/* Span full width */}
                <label className="form-label">Assigned To</label>
                <input type="text" name="assignedTo" placeholder="e.g., John Doe" className="form-input" value={formData.assignedTo} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-button primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Component for the Add New Asset Modal
  const AddAssetModal = ({ show, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      brand: '',
      value: '',
      purchaseDate: '',
      location: '',
      serialNumber: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Generate a simple ID for new assets
      const newAsset = {
        id: `TXP-${formData.type.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'available', // New assets are always available initially
        assignedTo: 'Unassigned',
        ...formData
      };
      onAdd(newAsset);
      setFormData({ // Reset form after submission
        name: '', type: '', brand: '', value: '', purchaseDate: '', location: '', serialNumber: ''
      });
    };

    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Add New Asset</h3>
            <button className="modal-close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <p className="modal-description">
            Create a new asset record in the system
          </p>
          <form onSubmit={handleSubmit}>
            {/* Grid layout for two fields per row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Asset Name *</label>
                <input type="text" name="name" placeholder="e.g., MacBook Pro 16" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <div className="form-input-icon-wrapper">
                  <select name="type" className="form-select" style={{ paddingLeft: '12px' }} value={formData.type} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option>Laptop</option>
                    <option>Monitor</option>
                    <option>Desktop</option>
                    <option>Mobile</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown size={18} className="form-input-icon" style={{ left: 'auto', right: '12px', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Vendor/Brand</label>
                <input type="text" name="brand" placeholder="e.g., Apple, Dell, HP" className="form-input" value={formData.brand} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Price</label>
                <input type="text" name="value" placeholder="e.g., 2499" className="form-input" value={formData.value} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <div className="form-input-icon-wrapper">
                  <Calendar size={18} className="form-input-icon" />
                  <input type="text" name="purchaseDate" placeholder="dd/mm/yyyy" className="form-input form-input-with-icon" value={formData.purchaseDate} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="form-input-icon-wrapper">
                  <MapPin size={18} className="form-input-icon" />
                  <input type="text" name="location" placeholder="e.g., Asset Storage, Floor 1" className="form-input form-input-with-icon" value={formData.location} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}> {/* Span full width */}
                <label className="form-label">Serial Number</label>
                <div className="form-input-icon-wrapper">
                  <Hash size={18} className="form-input-icon" />
                  <input type="text" name="serialNumber" placeholder="e.g., MBP-001-2024 (Optional - will be auto-generated)" className="form-input form-input-with-icon" value={formData.serialNumber} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-button primary">Add Asset</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Function to handle adding a new asset from the Add Asset modal
  const handleAddAsset = (newAsset) => {
    setAssets(prevAssets => [...prevAssets, newAsset]);
    setShowAddAssetModal(false);
    setNotifications(prev => [{
      id: Date.now(),
      message: `Added new asset: "${newAsset.name}" (${newAsset.id}).`,
      timestamp: new Date()
    }, ...prev]);
  };

  // Component for the Assign Asset Modal
  const AssignAssetModal = ({ show, onClose, onAssign, availableAssets, users }) => { // Added users prop
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [assignmentReason, setAssignmentReason] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedAssetId && assignedUser && assignmentReason) {
        onAssign(selectedAssetId, assignedUser, assignmentReason);
        setSelectedAssetId('');
        setAssignedUser('');
        setAssignmentReason('');
      } else {
        // Basic validation feedback
        // Replaced alert with console.error for better UX in Canvas
        console.error('Please fill in all required fields for assignment.');
      }
    };

    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Assign Asset to User</h3>
            <button className="modal-close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <p className="modal-description">
            Select an available asset and assign it to a user with a reason for the assignment.
          </p>
          <form onSubmit={handleSubmit}> {/* Added form tag */}
            <div className="form-group">
              <label className="form-label">Select Asset *</label>
              <div className="form-input-icon-wrapper">
                <select
                  className="form-select"
                  style={{ paddingLeft: '12px' }}
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                >
                  <option value="">Choose an available asset</option>
                  {availableAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="form-input-icon" style={{ left: 'auto', right: '12px', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Assign to User *</label>
              <div className="form-input-icon-wrapper">
                <select // Changed from input to select
                  className="form-select"
                  style={{ paddingLeft: '12px' }}
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  required
                >
                  <option value="">Choose a user</option>
                  {users.map(userOption => (
                    <option key={userOption} value={userOption}>{userOption}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="form-input-icon" style={{ left: 'auto', right: '12px', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Assignment Reason *</label>
              <textarea
                placeholder="Enter the reason for this assignment (e.g., New employee laptop setup, Project requirement, etc.)"
                className="form-textarea"
                rows="3"
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-button primary">Assign Asset</button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  return (
    <>
      {/* Embedded CSS for the component */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); /* Added 800 for extra bold */

        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f3f4f6; /* bg-gray-100 */
          padding: 24px; /* p-6 */
        }

        /* NEW HEADER STYLES */
        .new-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px; /* px-6 py-4 */
          background-color: #ffffff; /* bg-white */
          border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-md */
          margin: -24px -24px 24px -24px; /* Adjust to extend full width and compensate for container padding */
          width: calc(100% + 48px); /* Adjust width to cover full screen */
          box-sizing: border-box; /* Include padding in width calculation */
        }

        .logo-text {
          font-size: 24px; /* text-2xl */
          font-weight: 800; /* font-extrabold */
          color: #1f2937; /* text-gray-800 */
        }

        .logo-x {
          color: #3b82f6; /* text-blue-500 */
        }

        .user-profile {
          position: relative; /* Added for dropdown positioning */
          display: flex;
          align-items: center;
          gap: 16px; /* space-x-4 */
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.2; /* Adjust line height for better spacing */
        }

        .user-name {
          font-size: 14px; /* text-sm */
          font-weight: 500; /* font-medium */
          color: #1f2937; /* text-gray-800 */
        }

        .employee-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px; /* px-2 py-0.5 */
          background-color: #fce7f3; /* bg-pink-100 */
          color: #be185d; /* text-rose-700 */
          border-radius: 9999px; /* rounded-full */
          font-size: 12px; /* text-xs */
          font-weight: 500; /* font-medium */
          margin-top: 4px; /* mt-1 */
        }

        .employee-tag svg {
          margin-right: 4px; /* mr-1 */
          height: 12px; /* h-3 */
          width: 12px; /* w-3 */
        }

        .user-avatar {
          width: 40px; /* w-10 */
          height: 40px; /* h-10 */
          border-radius: 9999px; /* rounded-full */
          background-color: #1f2937; /* bg-gray-800 */
          color: #ffffff; /* text-white */
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px; /* text-base */
          font-weight: 600; /* font-semibold */
          cursor: pointer; /* Indicate it's clickable */
        }

        /* Profile Dropdown Styles */
        .profile-dropdown {
          position: absolute;
          top: 55px; /* Position below the avatar */
          right: 0;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 180px; /* Adjust width as needed */
          z-index: 100; /* Ensure it's above other content */
          padding: 8px 0;
        }

        .profile-dropdown-heading {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 8px;
        }

        .profile-dropdown-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          font-size: 14px;
          color: #374151; /* text-gray-700 */
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .profile-dropdown-item:hover {
          background-color: #f3f4f6; /* bg-gray-100 */
        }

        .profile-dropdown-item svg {
          margin-right: 12px;
          color: #6b7280; /* text-gray-500 */
        }

        .profile-dropdown-item.logout {
          color: #ef4444; /* red-500 */
        }

        .profile-dropdown-item.logout svg {
          color: #ef4444; /* red-500 */
        }

        /* Notification Bell and Panel Styles */
        .notification-dot-container {
          position: relative;
          cursor: pointer;
        }

        .notification-dot-solid {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: #ef4444; /* Red dot */
          border-radius: 50%;
          border: 1px solid #ffffff; /* White border */
        }

        .notification-dot-ping {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ef4444;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.75;
          z-index: 1; /* Ensure ping is behind solid dot */
        }

        .notification-panel {
          position: absolute;
          top: 55px; /* Adjust based on header height */
          right: 200px; /* Position next to the profile dropdown */
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 300px; /* Width of notification panel */
          max-height: 400px;
          overflow-y: auto;
          z-index: 100;
          padding: 8px 0;
        }

        .notification-panel-header {
          padding: 10px 16px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 8px;
        }

        .notification-item {
          padding: 10px 16px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f3f4f6; /* Light separator */
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item-message {
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .notification-item-timestamp {
          font-size: 12px;
          color: #6b7280;
        }

        .notification-panel-empty {
          padding: 16px;
          text-align: center;
          color: #6b7280;
          font-style: italic;
        }

        /* END NEW HEADER STYLES */


        .header { /* Old header, now removed or replaced */
          display: none; /* Hide the old header */
        }

        /* Removed .quick-actions-section styles */

        .main-content-area {
          background-color: #ffffff; /* bg-white */
          border-radius: 8px; /* rounded-lg */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          overflow: hidden; /* overflow-hidden */
        }

        .nav-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
        }

        .tab-button {
          padding: 12px 24px; /* px-6 py-3 */
          font-size: 14px; /* text-sm */
          font-weight: 500; /* font-medium */
          border-top-left-radius: 6px; /* rounded-t-lg */
          border-top-right-radius: 6px; /* rounded-t-lg */
          transition: all 0.2s ease-in-out;
          outline: none; /* focus:outline-none */
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        .tab-button.active {
          border-bottom: 2px solid #2563eb; /* border-b-2 border-blue-600 */
          color: #2563eb; /* text-blue-600 */
          background-color: #f9fafb; /* bg-gray-50 */
        }

        .tab-button:not(.active) {
          color: #6b7280; /* text-gray-500 */
        }

        .tab-button:not(.active):hover {
          color: #374151; /* hover:text-gray-700 */
          background-color: #f9fafb; /* hover:bg-gray-50 */
        }

        .asset-content {
          padding: 20px; /* p-5 */
        }

        .asset-inventory-header {
          display: flex;
          flex-direction: column; /* flex-col */
          justify-content: space-between;
          align-items: flex-start; /* items-start */
          margin-bottom: 16px; /* mb-4 */
          gap: 12px; /* gap-3 */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .asset-inventory-header {
            flex-direction: row; /* sm:flex-row */
            align-items: center; /* sm:items-center */
            gap: 0; /* sm:gap-0 */
          }
        }

        .asset-inventory-title {
          font-size: 20px; /* text-xl */
          font-weight: 600; /* font-semibold */
          color: #1f2937; /* text-gray-800 */
          display: flex;
          align-items: center;
        }

        .asset-inventory-icon {
          height: 24px; /* h-6 */
          width: 24px; /* w-6 */
          margin-right: 8px; /* mr-2 */
          color: #6b7280; /* text-gray-500 */
        }

        .asset-action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px; /* gap-3 */
        }

        .asset-action-button {
          display: flex;
          align-items: center;
          padding: 8px 16px; /* px-4 py-2 */
          background-color: #3b82f6; /* bg-blue-500 */
          color: #ffffff; /* text-white */
          border-radius: 6px; /* rounded-md */
          font-size: 14px; /* text-sm */
          transition: background-color 0.2s ease-in-out;
          border: none; /* Removed button border */
        }

        .asset-action-button:hover {
          background-color: #2563eb; /* hover:bg-blue-600 */
        }

        .asset-action-button.add { /* Changed to blue */
          background-color: #2563eb; /* bg-blue-600 */
        }

        .asset-action-button.add:hover { /* Changed to blue */
          background-color: #1d4ed8; /* hover:bg-blue-700 */
        }

        .asset-action-button-icon {
          height: 16px; /* h-4 */
          width: 16px; /* w-4 */
          margin-right: 4px; /* mr-1 */
        }

        .search-filter-bar {
          display: flex;
          flex-direction: column; /* flex-col */
          align-items: stretch; /* items-stretch */
          gap: 12px; /* space-y-3 */
          margin-bottom: 16px; /* mb-4 */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .search-filter-bar {
            flex-direction: row; /* sm:flex-row */
            align-items: center; /* sm:items-center */
            /* Adjusted gap for horizontal spacing */
            gap: 16px; /* Added explicit gap for horizontal layout */
          }
        }

        .search-input-container {
          position: relative;
          flex-grow: 1; /* flex-grow */
        }

        .search-icon {
          position: absolute;
          left: 12px; /* left-3 */
          top: 50%;
          transform: translateY(-50%); /* -translate-y-1/2 */
          color: #9ca3af; /* text-gray-400 */
          height: 18px; /* size={18} */
          width: 18px;
        }

        .search-input {
          width: 100%; /* w-full */
          padding: 10px 12px;
          border: 1px solid #d1d5db; /* border border-gray-300 */
          border-radius: 6px; /* rounded-md */
          font-size: 14px;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #3b82f6; /* focus:ring-1 focus:ring-blue-500 */
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .filter-dropdown-container {
          position: relative;
          width: 100%; /* w-full */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .filter-dropdown-container {
            width: auto; /* sm:w-auto */
          }
        }

        .filter-dropdown {
          appearance: none;
          width: 100%; /* w-full */
          padding: 10px 32px 10px 16px; /* px-4 py-2 pr-8 -> adjusted padding */
          border: 1px solid #d1d5db; /* border border-gray-300 */
          border-radius: 6px; /* rounded-md */
          background-color: #ffffff; /* bg-white */
          outline: none; /* focus:outline-none */
          cursor: pointer;
          font-size: 14px;
          color: #1f2937;
          box-sizing: border-box;
        }

        .filter-dropdown:focus {
          border-color: #3b82f6; /* focus:ring-1 focus:ring-blue-500 */
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .dropdown-chevron {
          position: absolute;
          right: 12px; /* right-3 */
          top: 50%;
          transform: translateY(-50%); /* -translate-y-1/2 */
          color: #6b7280; /* text-gray-500 */
          pointer-events: none;
          height: 16px; /* size={16} */
          width: 16px;
        }

        .asset-table-container {
          overflow-x: auto;
          border-radius: 6px; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          border: 1px solid #e5e7eb; /* border border-gray-200 */
        }

        .asset-table {
          min-width: 100%; /* min-w-full */
          border-collapse: collapse; /* Ensures borders collapse properly */
          border-spacing: 0;
          width: 100%;
        }

        .asset-table thead {
          background-color: #f9fafb; /* bg-gray-50 */
        }

        .asset-table th {
          padding: 12px 24px; /* px-6 py-3 */
          text-align: center; /* Centered column names */
          font-size: 12px; /* text-xs */
          font-weight: 500; /* font-medium */
          color: #6b7280; /* text-gray-500 */
          text-transform: uppercase; /* uppercase */
          letter-spacing: 0.05em; /* tracking-wider */
        }

        .asset-table th:first-child {
          border-top-left-radius: 6px; /* rounded-tl-md */
        }

        .asset-table th:last-child {
          border-top-right-radius: 6px; /* rounded-tr-md */
        }

        .asset-table tbody {
          background-color: #ffffff; /* bg-white */
          border-top: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
        }

        .asset-table tr {
          border-bottom: 1px solid #e5e7eb; /* For the divide-y effect */
        }

        .asset-table tr:last-child {
          border-bottom: none;
        }

        .asset-table tr:hover {
          background-color: #f9fafb; /* hover:bg-gray-50 */
          transition: background-color 0.15s ease-in-out;
        }

        .asset-table td {
          padding: 16px 24px; /* px-6 py-4 */
          white-space: nowrap; /* whitespace-nowrap */
          font-size: 14px; /* text-sm */
          color: #6b7280; /* text-gray-500 */
          text-align: center; /* Center content in table cells */
        }

        .asset-table td:first-child {
          color: #1f2937; /* text-gray-900 */
          font-weight: 500; /* font-medium */
          text-align: left; /* Keep first column left-aligned */
        }

        .asset-table-asset-cell {
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Ensure asset cell content is left-aligned */
        }

        .asset-table-asset-icon {
          height: 20px; /* h-5 */
          width: 20px; /* w-5 */
          color: #9ca3af; /* text-gray-400 */
          margin-right: 8px; /* mr-2 */
        }

        .asset-table-asset-id {
          font-size: 14px; /* text-sm */
          font-weight: 500; /* font-medium */
          color: #1f2937; /* text-gray-900 */
        }

        .asset-table-asset-name {
          font-size: 14px; /* text-sm */
          color: #6b7280; /* text-gray-500 */
        }

        /* Base status badge style */
        .status-badge {
          padding: 4px 8px; /* px-2 py-1 */
          display: inline-flex;
          font-size: 12px; /* text-xs */
          line-height: 16px; /* leading-5 */
          font-weight: 600; /* font-semibold */
          border-radius: 9999px; /* rounded-full */
        }

        /* Status-specific colors */
        .status-badge.available {
          background-color: #d1fae5; /* bg-green-100 */
          color: #065f46; /* text-green-800 */
        }

        .status-badge.assigned {
          background-color: #fef9c3; /* bg-yellow-100 */
          color: #a16207; /* text-yellow-800 */
        }

        .status-badge.in-maintenance {
          background-color: #fee2e2; /* bg-red-100 */
          color: #991b1b; /* text-red-800 */
        }

        .action-icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af; /* text-gray-400 */
          transition: color 0.2s ease-in-out;
          padding: 4px; /* Add padding for easier clicking */
          border-radius: 4px; /* Slightly rounded for hover effect */
        }

        .action-icon-button:hover {
          color: #4b5563; /* hover:text-gray-600 */
          background-color: #f0f0f0; /* Light background on hover */
        }

        .action-icon-button.delete {
          color: #ef4444; /* red-500 */
        }

        .action-icon-button.delete:hover {
          color: #dc2626; /* red-600 */
        }

        .actions-cell {
          display: flex;
          justify-content: center; /* Center the action buttons */
          gap: 8px; /* Space between buttons */
          white-space: nowrap; /* Prevent wrapping */
        }


        /* Keyframes for ping animation */
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* Ensure modal is on top */
        }

        .modal-content {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 24px;
          width: 90%;
          max-width: 500px; /* Default max width for modals */
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s ease-in-out;
        }

        .modal-close-button:hover {
          color: #1f2937;
        }

        .modal-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 0; /* Removed margin-bottom here as gap handles spacing */
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .form-input-icon-wrapper {
          position: relative;
        }

        .form-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          height: 18px;
          width: 18px;
        }

        .form-input-with-icon {
          padding-left: 40px; /* Space for icon */
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .modal-button {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
          border: none; /* Ensure no border */
        }

        .modal-button.cancel {
          background-color: #e5e7eb; /* gray-200 */
          color: #374151; /* gray-700 */
        }

        .modal-button.cancel:hover {
          background-color: #d1d5db; /* gray-300 */
        }

        .modal-button.primary {
          background-color: #2563eb; /* blue-600 */
          color: #ffffff;
        }

        .modal-button.primary:hover {
          background-color: #1d4ed8; /* blue-700 */
        }

        /* Delete Confirmation Modal Specific Styles */
        .delete-confirmation-modal .modal-content {
          max-width: 400px;
        }
        .delete-confirmation-modal .modal-description {
          text-align: center;
          font-size: 16px;
          color: #374151;
        }
        .delete-confirmation-modal .modal-footer {
          justify-content: center;
        }
        .delete-confirmation-modal .modal-button.delete-confirm {
          background-color: #ef4444; /* red-500 */
          color: #ffffff;
        }
        .delete-confirmation-modal .modal-button.delete-confirm:hover {
          background-color: #dc2626; /* red-600 */
        }

        /* Edit Asset Modal specific styles - now matches Add Asset modal */
        .edit-asset-modal .modal-content {
          max-width: 500px; /* Matched Add Asset modal width */
          padding: 24px; /* Matched Add Asset modal padding */
        }
      `}</style>

      {/* Main container for the entire dashboard */}
      <div className="dashboard-container">
        {/* NEW HEADER SECTION */}
        <header className="new-header">
          {/* Logo Section */}
          <div className="logo-text">
            Tech<span className="logo-x">X</span>plorers
          </div>

          {/* User Profile Section */}
          <div className="user-profile">
            {/* Bell Icon with Notification Dot */}
            <div className="notification-dot-container" onClick={toggleNotifications}>
              {notifications.length > 0 && ( // Show ping and solid dot only if there are notifications
                <>
                  <span className="notification-dot-ping"></span>
                  <span className="notification-dot-solid"></span>
                </>
              )}
              <Bell className="icon-button" size={20} />
            </div>

            {/* Notification Panel (NEW) */}
            {showNotifications && (
              <div className="notification-panel" ref={notificationsRef}>
                <div className="notification-panel-header">
                  Notifications ({notifications.length})
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-item-message">{notification.message}</div>
                      <div className="notification-item-timestamp">{formatTimestamp(notification.timestamp)}</div>
                    </div>
                  ))
                ) : (
                  <div className="notification-panel-empty">No new notifications.</div>
                )}
              </div>
            )}

            {/* User Info (Asset Manager & Asset Tag) */}
            <div className="user-info">
              <span className="user-name">Asset Manager</span>
              <span className="employee-tag">
                <User size={12} />
                Asset
              </span>
            </div>

            {/* User Avatar - Add onClick handler */}
            <div className="user-avatar" onClick={toggleProfileDropdown} ref={profileDropdownRef}> {/* Attach ref here */}
              AM
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Log out
                </div>
              </div>
            )}
          </div>
        </header>
        {/* END NEW HEADER SECTION */}

        {/* Removed Quick Actions Section */}
        {/* <section className="quick-actions-section">
          <h2 className="quick-actions-title">
            <svg xmlns="http://www.w3.org/2000/svg" className="quick-actions-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Quick Actions
          </h2>
          <div className="quick-actions-buttons">
            <button className="action-button" onClick={() => handleQuickActionClick('assign')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="action-button-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Assign Assets
            </button>
            <button className="action-button" onClick={() => handleQuickActionClick('add')}>
              <Plus size={20} className="action-button-icon" />
              Add New Asset
            </button>
          </div>
        </section> */}

        {/* Main Content Area with Tabs */}
        <div className="main-content-area">
          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            {['Assets'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Content for the 'Assets' Tab */}
          {activeTab === 'Assets' && (
            <div className="asset-content">
              {/* Asset Inventory Header with Action Buttons */}
              <div className="asset-inventory-header">
                <h2 className="asset-inventory-title">
                  {/* Icon for Asset Inventory */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="asset-inventory-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                  Asset Inventory
                </h2>
                {/* Action buttons for Asset Inventory */}
                <div className="asset-action-buttons">
                  <button className="asset-action-button" onClick={() => setShowAssignAssetModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="asset-action-button-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Assign Assets
                  </button>
                  <button className="asset-action-button" onClick={() => setShowAddAssetModal(true)}>
                    <Plus size={16} className="asset-action-button-icon" />
                    Add Asset
                  </button>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="search-filter-bar">
                {/* Search Input */}
                <div className="search-input-container">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Status Filter Dropdown */}
                <div className="filter-dropdown-container">
                  <select
                    className="filter-dropdown"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    value={filterStatus}
                  >
                    <option>All Statuses</option>
                    <option>available</option>
                    <option>assigned</option>
                    <option>in maintenance</option>
                  </select>
                  <ChevronDown size={16} className="dropdown-chevron" />
                </div>
              </div>

              {/* Asset Table */}
              <div className="asset-table-container">
                <table className="asset-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        Asset
                      </th>
                      <th scope="col">
                        Type
                      </th>
                      <th scope="col">
                        Status
                      </th>
                      <th scope="col">
                        Assigned To
                      </th>
                      <th scope="col">
                        Location
                      </th>
                      <th scope="col">
                        Value
                      </th>
                      <th scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="asset-table-asset-cell">
                          {/* Generic asset icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="asset-table-asset-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <div>
                            <div className="asset-table-asset-id">{asset.id}</div>
                            <div className="asset-table-asset-name">{asset.name}</div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm text-gray-900">{asset.type}</div>
                        </td>
                        <td>
                          {/* Status badge - dynamically apply class based on status */}
                          <span className={`status-badge ${asset.status.replace(/\s+/g, '-')}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td>
                          {asset.assignedTo}
                        </td>
                        <td>
                          {asset.location}
                        </td>
                        <td>
                          {asset.value}
                        </td>
                        <td className="actions-cell">
                          {/* Edit icon with onClick handler */}
                          <button className="action-icon-button" onClick={() => handleEditAssetClick(asset)}>
                            <Edit size={18} />
                          </button>
                          <button className="action-icon-button delete" onClick={() => handleDeleteAssetClick(asset.id)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Asset Modal */}
      {showAssignAssetModal && (
        <AssignAssetModal
          show={showAssignAssetModal}
          onClose={() => setShowAssignAssetModal(false)}
          onAssign={handleAssignAsset}
          availableAssets={assets.filter(a => a.status === 'available')} // Pass only available assets
          users={users} // Pass the users array to the modal
        />
      )}

      {/* Add New Asset Modal */}
      {showAddAssetModal && (
        <AddAssetModal
          show={showAddAssetModal}
          onClose={() => setShowAddAssetModal(false)}
          onAdd={handleAddAsset}
        />
      )}

      {/* Edit Asset Modal */}
      {showEditAssetModal && assetToEdit && (
        <EditAssetModal
          show={showEditAssetModal}
          onClose={() => setShowEditAssetModal(false)}
          asset={assetToEdit} // Pass the asset to be edited
          onUpdate={handleUpdateAsset} // Pass the update handler
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <div className="modal-overlay delete-confirmation-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Deletion</h3>
              <button className="modal-close-button" onClick={handleDeleteAssetCancel}>
                <X size={20} />
              </button>
            </div>
            <p className="modal-description">
              Are you sure you want to delete asset **{assetIdToDelete}**? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="modal-button cancel" onClick={handleDeleteAssetCancel}>Cancel</button>
              <button className="modal-button delete-confirm" onClick={handleDeleteAssetConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetWorksheet;
