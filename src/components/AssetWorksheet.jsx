import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, User, ChevronDown, Plus, Search, Info, X, Tag, Calendar, MapPin, Hash, Edit, Trash2, LogOut, Settings, CheckCircle, Wrench, DollarSign, FilterX } from 'lucide-react';

const AssetWorksheet = () => {
  // State variables for managing UI and data
  const [activeTab, setActiveTab] = useState('Assets Overview');
  const [showAssignAssetModal, setShowAssignAssetModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showUnassignConfirmationModal, setShowUnassignConfirmationModal] = useState(false);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);
  const [assetToUnassign, setAssetToUnassign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedAssetFilter, setAssignedAssetFilter] = useState('All Assets');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to Asset Management Dashboard!', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, message: 'New update available for system assets.', timestamp: new Date(Date.now() - 7200000) },
  ]);

  // Refs for dropdowns
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Data
  const [assets, setAssets] = useState([
    { id: 'TXP-LT-001', name: 'Dell Latitude 5520', type: 'Laptop', status: 'available', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 1', value: '$1,200', brand: 'Dell', purchaseDate: '15/03/2023', serialNumber: 'DLT-001-2023', returnDate: null },
    { id: 'TXP-LT-004', name: 'Dell Latitude 5520', type: 'Laptop', status: 'available', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 1', value: '$1,200', brand: 'Dell', purchaseDate: '15/03/2023', serialNumber: 'DLT-004-2023', returnDate: null },
    { id: 'TXP-LT-002', name: 'MacBook Pro 14"', type: 'Laptop', status: 'available', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 1', value: '$2,500', brand: 'Apple', purchaseDate: '20/06/2023', serialNumber: 'MBP-002-2023', returnDate: null },
    { id: 'TXP-MON-001', name: 'Dell Ultrasharp U2720Q', type: 'Monitor', status: 'available', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 1', value: '$400', brand: 'Dell', purchaseDate: '10/02/2024', serialNumber: 'DMON-001-2024', returnDate: null },
    { id: 'TXP-DT-001', name: 'HP EliteDesk 800 G9', type: 'Desktop', status: 'assigned', assignedTo: 'Prakash', assignedDate: '10/07/2024', location: 'Branch 2', value: '$800', brand: 'HP', purchaseDate: '05/09/2022', serialNumber: 'HPDT-001-2022', returnDate: null },
    { id: 'TXP-MB-001', name: 'iPhone 15 Pro', type: 'Mobile', status: 'in maintenance', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 2', value: '$1,000', brand: 'Apple', purchaseDate: '12/11/2023', serialNumber: 'IP-001-2023', returnDate: null },
    { id: 'TXP-LT-003', name: 'Lenovo ThinkPad', type: 'Laptop', status: 'assigned', assignedTo: 'Sai', assignedDate: '01/06/2024', location: 'Branch 1', value: '$1,100', brand: 'Lenovo', purchaseDate: '10/01/2023', serialNumber: 'LNV-003-2023', returnDate: '31/12/2024' },
    { id: 'TXP-MSE-001', name: 'Logitech MX Master 3', type: 'Mouse', status: 'available', assignedTo: 'Unassigned', assignedDate: null, location: 'Branch 1', value: '$99', brand: 'Logitech', purchaseDate: '01/01/2024', serialNumber: 'LGM-001-2024', returnDate: null },
  ]);

  const users = ['Prakash', 'Sai', 'Bharath', 'Chaveen', 'Sandeep', 'Sapare', 'Humer', 'Unassigned'];
  const branchLocations = ['Branch 1', 'Branch 2'];

  // Calculated values
  const availableAssetCounts = useMemo(() => {
    return assets.reduce((acc, asset) => {
      if (asset.status === 'available') {
        acc[asset.type] = (acc[asset.type] || 0) + 1;
      } else if (!acc[asset.type]) {
        // Ensure the type is initialized to 0 if no assets of that type are available
        acc[asset.type] = 0;
      }
      return acc;
    }, {});
  }, [assets]);

  const totalAssetValue = assets.reduce((sum, asset) => {
    const value = parseFloat(asset.value.replace(/[$,]/g, ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const isFilterActive = filterStatus !== 'All Statuses' || searchTerm !== '';

  const filteredAssets = assets.filter(asset => {
    const matchesStatus = filterStatus === 'All Statuses' || asset.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const assignedAssets = assets.filter(asset => {
      const isAssigned = asset.status === 'assigned';
      const matchesFilter = assignedAssetFilter === 'All Assets' || asset.id === assignedAssetFilter;
      return isAssigned && matchesFilter;
  });

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All Statuses');
  };
  
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

  const handleEditAssetClick = (asset) => {
    setAssetToEdit(asset);
    setShowEditAssetModal(true);
  };

  const handleUpdateAsset = (updatedAsset) => {
    const originalAsset = assets.find(asset => asset.id === updatedAsset.id);
    setAssets(prevAssets => prevAssets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset));
    setShowEditAssetModal(false);
    setAssetToEdit(null);

    if (originalAsset && originalAsset.assignedTo !== updatedAsset.assignedTo && updatedAsset.assignedTo !== 'Unassigned') {
      setNotifications(prev => [{ id: Date.now(), message: `Asset "${updatedAsset.name}" assigned to ${updatedAsset.assignedTo}.`, timestamp: new Date() }, ...prev]);
    } else if (originalAsset && originalAsset.status !== updatedAsset.status) {
      setNotifications(prev => [{ id: Date.now(), message: `Status of "${updatedAsset.name}" changed to ${updatedAsset.status}.`, timestamp: new Date() }, ...prev]);
    }
  };

  const handleDeleteAssetClick = (assetId) => {
    setAssetIdToDelete(assetId);
    setShowDeleteConfirmationModal(true);
  };
  
  const handleUnassignAssetClick = (asset) => {
    setAssetToUnassign(asset);
    setShowUnassignConfirmationModal(true);
  };

  const handleDeleteAssetConfirm = () => {
    const deletedAsset = assets.find(asset => asset.id === assetIdToDelete);
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetIdToDelete));
    setShowDeleteConfirmationModal(false);
    setAssetIdToDelete(null);

    if (deletedAsset) {
      setNotifications(prev => [{ id: Date.now(), message: `Asset "${deletedAsset.name}" (${deletedAsset.id}) was deleted.`, timestamp: new Date() }, ...prev]);
    }
  };
  
  const handleUnassignAssetConfirm = () => {
    setAssets(prevAssets => prevAssets.map(asset => 
        asset.id === assetToUnassign.id 
        ? { ...asset, status: 'available', assignedTo: 'Unassigned', assignedDate: null, returnDate: null } 
        : asset
    ));
    setShowUnassignConfirmationModal(false);
    setNotifications(prev => [{ id: Date.now(), message: `Asset "${assetToUnassign.name}" has been unassigned.`, timestamp: new Date() }, ...prev]);
    setAssetToUnassign(null);
  };

  const toggleProfileDropdown = () => setShowProfileDropdown(prev => !prev);
  const toggleNotifications = () => setShowNotifications(prev => !prev);

  // Simple, direct logout function as per the working example.
  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleAssignAsset = (assignedAssetId, assignedUser, assignmentReason, assignedDate) => {
    const assetToAssign = assets.find(a => a.id === assignedAssetId);
    setAssets(prevAssets => prevAssets.map(asset =>
      asset.id === assignedAssetId
        ? { ...asset, status: 'assigned', assignedTo: assignedUser, assignedDate: assignedDate, returnDate: null }
        : asset
    ));
    setShowAssignAssetModal(false);
    setNotifications(prev => [{ id: Date.now(), message: `Asset "${assetToAssign?.name}" assigned to ${assignedUser}.`, timestamp: new Date() }, ...prev]);
  };
  
  const handleAddAsset = (newAssets) => { // Expects an array of assets
    setAssets(prevAssets => [...prevAssets, ...newAssets]);
    setShowAddAssetModal(false);
    setNotifications(prev => [{ 
      id: Date.now(), 
      message: `Added ${newAssets.length} new asset(s): "${newAssets[0].name}".`, 
      timestamp: new Date() 
    }, ...prev]);
    // Switch to the assets tab and filter for the new asset name
    setActiveTab('Assets');
    setSearchTerm(newAssets[0].name);
  };

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions to convert date formats
  const formatDateForInput = (dateStr) => {
    if (!dateStr || dateStr.split('/').length !== 3) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatDateForState = (dateStr) => {
    if (!dateStr || dateStr.split('-').length !== 3) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Modals
  const EditAssetModal = ({ show, onClose, asset, onUpdate }) => {
    const [formData, setFormData] = useState(asset);
    const [otherType, setOtherType] = useState('');

    useEffect(() => {
        setFormData(asset);
        if (asset && !['Laptop', 'Monitor', 'Desktop', 'Mobile', 'Mouse'].includes(asset.type)) {
            setOtherType(asset.type);
            setFormData(prev => ({ ...prev, type: 'Other' }));
        }
    }, [asset]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const finalData = { ...formData };
      if (formData.type === 'Other') {
        finalData.type = otherType;
      }
      onUpdate(finalData);
    };

    if (!show) return null;

    return (
      <div className="modal-overlay edit-asset-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Edit Asset</h3>
            <button className="modal-close-button" onClick={onClose}><X size={20} /></button>
          </div>
          <p className="modal-description">
            Modify the details of the asset.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Asset Name *</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
                    <option>Laptop</option><option>Monitor</option><option>Desktop</option><option>Mobile</option><option>Mouse</option><option>Other</option>
                </select>
              </div>
              {formData.type === 'Other' && (
                <div className="form-group">
                  <label className="form-label">Specify Type *</label>
                  <input type="text" placeholder="e.g., Keyboard" className="form-input" value={otherType} onChange={(e) => setOtherType(e.target.value)} required />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <select name="assignedTo" className="form-select" value={formData.assignedTo} onChange={handleChange}>
                  {users.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Date</label>
                <input type="date" name="assignedDate" className="form-input" value={formatDateForInput(formData.assignedDate)} onChange={(e) => setFormData(prev => ({...prev, assignedDate: formatDateForState(e.target.value)}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Return Date</label>
                <input type="date" name="returnDate" className="form-input" value={formatDateForInput(formData.returnDate)} onChange={(e) => setFormData(prev => ({...prev, returnDate: formatDateForState(e.target.value)}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                  <option>available</option><option>assigned</option><option>in maintenance</option>
                </select>
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

  const AddAssetModal = ({ show, onClose, onAdd }) => {
    const [formData, setFormData] = useState({ name: '', type: '', brand: '', value: '', purchaseDate: '', location: 'Branch 1', serialNumber: '', count: 1 });
    const [otherType, setOtherType] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalType = formData.type === 'Other' ? otherType : formData.type;
        if (!finalType) {
            alert('Please specify an asset type.');
            return;
        }

        const newAssets = [];
        const quantity = parseInt(formData.count, 10) || 1;

        for (let i = 0; i < quantity; i++) {
            const newAsset = {
                id: `TXP-${finalType.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}${i}`,
                status: 'available',
                assignedTo: 'Unassigned',
                assignedDate: null,
                returnDate: null,
                ...formData,
                serialNumber: formData.serialNumber ? `${formData.serialNumber}-${i + 1}` : `SN-${Date.now()}${i}`,
                type: finalType,
            };
            delete newAsset.count; // Do not store count on the asset object itself
            newAssets.push(newAsset);
        }
        onAdd(newAssets);
        // Reset form after submission
        setFormData({ name: '', type: '', brand: '', value: '', purchaseDate: '', location: 'Branch 1', serialNumber: '', count: 1 });
        setOtherType('');
    };

    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Add New Asset</h3>
            <button className="modal-close-button" onClick={onClose}><X size={20} /></button>
          </div>
          <p className="modal-description">Create a new asset record in the system.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Asset Name *</label><input type="text" name="name" placeholder="e.g., MacBook Pro 16" className="form-input" value={formData.name} onChange={handleChange} required /></div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
                    <option value="">Select type</option><option>Laptop</option><option>Monitor</option><option>Desktop</option><option>Mobile</option><option>Mouse</option><option>Other</option>
                </select>
              </div>
              {formData.type === 'Other' && (
                <div className="form-group">
                  <label className="form-label">Specify Type *</label>
                  <input type="text" placeholder="e.g., Keyboard" className="form-input" value={otherType} onChange={(e) => setOtherType(e.target.value)} required />
                </div>
              )}
              <div className="form-group"><label className="form-label">Quantity *</label><input type="number" name="count" className="form-input" value={formData.count} onChange={handleChange} min="1" required /></div>
              <div className="form-group"><label className="form-label">Vendor/Brand</label><input type="text" name="brand" placeholder="e.g., Apple, Dell, HP" className="form-input" value={formData.brand} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Purchase Price</label><input type="text" name="value" placeholder="e.g., $2499" className="form-input" value={formData.value} onChange={handleChange} /></div>
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input type="date" name="purchaseDate" className="form-input" value={formatDateForInput(formData.purchaseDate)} onChange={(e) => setFormData(prev => ({...prev, purchaseDate: formatDateForState(e.target.value)}))} />
              </div>
              <div className="form-group"><label className="form-label">Branch</label><select name="location" className="form-select" value={formData.location} onChange={handleChange}>{branchLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
              <div className="form-group" style={{gridColumn: 'span 2'}}><label className="form-label">Serial Number (Base)</label><input type="text" name="serialNumber" placeholder="e.g., MBP-001-2024" className="form-input" value={formData.serialNumber} onChange={handleChange} /></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-button primary">Add Asset(s)</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignAssetModal = ({ show, onClose, onAssign, availableAssets, users }) => {
    const [selectedAssetName, setSelectedAssetName] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [assignmentReason, setAssignmentReason] = useState('');
    const [assignedDate, setAssignedDate] = useState('');

    // Group available assets by name, and then by type
    const groupedAssets = useMemo(() => {
        const byName = availableAssets.reduce((acc, asset) => {
            if (!acc[asset.name]) {
                acc[asset.name] = {
                    count: 0,
                    ids: [],
                    type: asset.type,
                };
            }
            acc[asset.name].count++;
            acc[asset.name].ids.push(asset.id);
            return acc;
        }, {});

        return Object.entries(byName).reduce((acc, [name, data]) => {
            const { type } = data;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push({ name, ...data });
            return acc;
        }, {});
    }, [availableAssets]);

    useEffect(() => {
      if (show) {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        setAssignedDate(formattedDate);
      }
    }, [show]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedAssetName && assignedUser && assignmentReason && assignedDate) {
        // Find the selected group to get an available ID
        let assetIdToAssign = null;
        for (const typeGroup of Object.values(groupedAssets)) {
            const foundAsset = typeGroup.find(asset => asset.name === selectedAssetName);
            if (foundAsset) {
                assetIdToAssign = foundAsset.ids[0]; // Assign the first available ID
                break;
            }
        }
        
        if (assetIdToAssign) {
            onAssign(assetIdToAssign, assignedUser, assignmentReason, assignedDate);
            onClose();
        } else {
            alert("Could not find the selected asset. Please try again.");
        }
      }
    };

    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header"><h3 className="modal-title">Assign Asset to Employee</h3><button className="modal-close-button" onClick={onClose}><X size={20} /></button></div>
          <p className="modal-description">Select an available asset and assign it to an Employee.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Select Asset *</label>
                <select className="form-select" value={selectedAssetName} onChange={(e) => setSelectedAssetName(e.target.value)} required>
                    <option value="">Choose an available asset</option>
                    {Object.entries(groupedAssets).map(([type, assets]) => (
                        <optgroup key={type} label={type}>
                            {assets.map(asset => (
                                <option key={asset.name} value={asset.name}>
                                    {asset.name} ({asset.count} nos)
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}><label className="form-label">Assign to Employee *</label><select className="form-select" value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} required><option value="">Choose an Employee</option>{users.filter(u => u !== 'Unassigned').map(u => (<option key={u} value={u}>{u}</option>))}</select></div>
            <div className="form-group" style={{marginTop: '16px'}}><label className="form-label">Assigned Date *</label><input type="text" value={assignedDate} className="form-input" readOnly /></div>
            <div className="form-group" style={{marginTop: '16px'}}><label className="form-label">Assignment Reason *</label><textarea placeholder="Reason for assignment..." className="form-textarea" rows="3" value={assignmentReason} onChange={(e) => setAssignmentReason(e.target.value)} required></textarea></div>
            <div className="modal-footer"><button type="button" className="modal-button cancel" onClick={onClose}>Cancel</button><button type="submit" className="modal-button primary">Assign Asset</button></div>
          </form>
        </div>
      </div>
    );
  };


  return (
    <>
      <style jsx>{`
        /* All CSS from previous version is included here, with minor adjustments for new elements */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; margin: 0; }
        .dashboard-container { min-height: 100vh; background-color: #f3f4f6; padding: 24px; }
        .new-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); margin: -24px -24px 24px -24px; width: calc(100% + 48px); box-sizing: border-box; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1f2937; }
        .logo-x { color: #3b82f6; }
        .user-profile { position: relative; display: flex; align-items: center; gap: 16px; }
        .user-info { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .user-name { font-size: 14px; font-weight: 500; color: #1f2937; }
        .employee-tag { display: inline-flex; align-items: center; padding: 2px 8px; background-color: #fce7f3; color: #be185d; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-top: 4px; }
        .employee-tag svg { margin-right: 4px; height: 12px; width: 12px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 9999px; background-color: #1f2937; color: #ffffff; display: flex; justify-content: center; align-items: center; font-size: 16px; font-weight: 600; cursor: pointer; }
        
        /* New Profile Dropdown Styles from AdminWorksheet */
        .profile-dropdown-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background-color: #ffffff;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          min-width: 12rem;
          padding: 0.5rem 0;
          list-style: none;
          margin: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out;
          z-index: 100;
        }
        .profile-dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .profile-dropdown-item {
          padding: 0.75rem 1rem;
          color: #1f2937;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background-color 0.15s ease;
          cursor: pointer;
        }
        .profile-dropdown-item:hover {
          background-color: #f9fafb;
        }
        .profile-dropdown-item.logout {
          color: #ef4444;
        }
        .profile-dropdown-item.logout:hover {
          background-color: #fee2e2;
        }
        .profile-dropdown-item svg {
          width: 1rem;
          height: 1rem;
        }

        .notification-dot-container { position: relative; cursor: pointer; }
        .notification-dot-solid { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; border: 1px solid #ffffff; }
        .notification-dot-ping { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75; z-index: 1; }
        .notification-panel { position: absolute; top: 55px; right: 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); width: 300px; max-height: 400px; overflow-y: auto; z-index: 100; padding: 8px 0; }
        .notification-panel-header { padding: 10px 16px; font-size: 16px; font-weight: 600; color: #1f2937; border-bottom: 1px solid #e5e7eb; margin-bottom: 8px; }
        .notification-item { padding: 10px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; }
        .notification-item:last-child { border-bottom: none; }
        .notification-item-message { margin-bottom: 4px; line-height: 1.4; }
        .notification-item-timestamp { font-size: 12px; color: #6b7280; }
        .notification-panel-empty { padding: 16px; text-align: center; color: #6b7280; font-style: italic; }
        .main-content-area { background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); overflow: hidden; }
        .nav-tabs { display: flex; border-bottom: 1px solid #e5e7eb; }
        .tab-button { padding: 12px 24px; font-size: 14px; font-weight: 500; border-top-left-radius: 6px; border-top-right-radius: 6px; transition: all 0.2s ease-in-out; outline: none; background-color: transparent; border: none; cursor: pointer; }
        .tab-button.active { border-bottom: 2px solid #2563eb; color: #2563eb; background-color: #f9fafb; }
        .tab-button:not(.active) { color: #6b7280; }
        .tab-button:not(.active):hover { color: #374151; background-color: #f9fafb; }
        .asset-content { padding: 20px; }
        .dashboard-header { margin-bottom: 24px; }
        .dashboard-title { font-size: 24px; font-weight: 700; color: #1f2937; }
        .dashboard-subtitle { font-size: 16px; color: #6b7280; margin-top: 4px; }
        .summary-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .summary-card { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; display: flex; justify-content: space-between; align-items: center; transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out; }
        .summary-card:hover { transform: translateY(-4px); box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
        .summary-card-title { font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px; }
        .summary-card-value { font-size: 32px; font-weight: 700; color: #1f2937; }
        .summary-card-icon-wrapper { height: 48px; width: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
        .summary-card-icon-wrapper.total { background-color: #e0f2fe; color: #0284c7; }
        .summary-card-icon-wrapper.assigned { background-color: #fef9c3; color: #a16207; }
        .summary-card-icon-wrapper.available { background-color: #d1fae5; color: #065f46; }
        .summary-card-icon-wrapper.maintenance { background-color: #fee2e2; color: #991b1b; }
        .summary-card-icon-wrapper.value { background-color: #e0e7ff; color: #4338ca; }
        .asset-inventory-header { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 12px; }
        @media (min-width: 640px) { .asset-inventory-header { flex-direction: row; align-items: center; gap: 0; } }
        .asset-inventory-title { font-size: 20px; font-weight: 600; color: #1f2937; display: flex; align-items: center; }
        .asset-inventory-icon { height: 24px; width: 24px; margin-right: 8px; color: #6b7280; }
        .asset-action-buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        .asset-action-button { display: flex; align-items: center; padding: 8px 16px; background-color: #3b82f6; color: #ffffff; border-radius: 6px; font-size: 14px; transition: background-color 0.2s ease-in-out; border: none; }
        .asset-action-button:hover { background-color: #2563eb; }
        .asset-action-button-icon { height: 16px; width: 16px; margin-right: 4px; }
        .search-filter-bar { display: flex; flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 16px; }
        @media (min-width: 768px) { .search-filter-bar { flex-direction: row; align-items: center; gap: 16px; } }
        .search-input-container { position: relative; flex-grow: 1; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; height: 18px; width: 18px; }
        .search-input { width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; box-sizing: border-box; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
        .filter-dropdown-container { position: relative; width: 100%; }
        @media (min-width: 640px) { .filter-dropdown-container { width: auto; } }
        .filter-dropdown { appearance: none; width: 100%; padding: 10px 32px 10px 16px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; outline: none; cursor: pointer; font-size: 14px; box-sizing: border-box; }
        .filter-dropdown:focus { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
        .dropdown-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #6b7280; pointer-events: none; height: 16px; width: 16px; }
        .clear-filter-button { display: flex; align-items: center; padding: 8px 16px; background-color: #6b7280; color: #ffffff; border-radius: 6px; font-size: 14px; transition: background-color 0.2s ease-in-out; border: none; }
        .clear-filter-button:hover { background-color: #4b5563; }
        .asset-table-container { overflow-x: auto; border-radius: 6px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .asset-table { min-width: 100%; border-collapse: collapse; border-spacing: 0; width: 100%; }
        .asset-table thead { background-color: #f9fafb; }
        .asset-table th { padding: 12px 24px; text-align: left; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .asset-table th:last-child { text-align: center; }
        .asset-table tbody { background-color: #ffffff; border-top: 1px solid #e5e7eb; }
        .asset-table tr { border-bottom: 1px solid #e5e7eb; }
        .asset-table tr:last-child { border-bottom: none; }
        .asset-table tr:hover { background-color: #f9fafb; }
        .asset-table td { padding: 16px 24px; white-space: nowrap; font-size: 14px; color: #6b7280; text-align: left; }
        .asset-table td:last-child { text-align:center; }
        .asset-table-asset-cell { display: flex; align-items: center; justify-content: flex-start; }
        .asset-table-asset-icon { height: 20px; width: 20px; color: #9ca3af; margin-right: 8px; }
        .asset-table-asset-id { font-size: 14px; font-weight: 500; color: #1f2937; }
        .asset-table-asset-name { font-size: 14px; color: #6b7280; }
        .status-badge { padding: 4px 8px; display: inline-flex; font-size: 12px; line-height: 16px; font-weight: 600; border-radius: 9999px; }
        .status-badge.available { background-color: #d1fae5; color: #065f46; }
        .status-badge.assigned { background-color: #fef9c3; color: #a16207; }
        .status-badge.in-maintenance { background-color: #fee2e2; color: #991b1b; }
        .action-icon-button { background: none; border: none; cursor: pointer; color: #9ca3af; transition: color 0.2s ease-in-out; padding: 4px; border-radius: 4px; }
        .action-icon-button:hover { color: #4b5563; background-color: #f0f0f0; }
        .action-icon-button.delete:hover { color: #dc2626; }
        .actions-cell { display: flex; justify-content: center; gap: 8px; white-space: nowrap; }
        @keyframes ping { 0% { transform: scale(1); opacity: 1; } 75%, 100% { transform: scale(2); opacity: 0; } }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background-color: #ffffff; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); padding: 24px; width: 90%; max-width: 550px; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-title { font-size: 20px; font-weight: 600; color: #1f2937; }
        .modal-close-button { background: none; border: none; cursor: pointer; color: #6b7280; }
        .modal-close-button:hover { color: #1f2937; }
        .modal-description { font-size: 14px; color: #6b7280; margin-bottom: 20px; }
        .form-group { margin-bottom: 0; }
        .form-label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; box-sizing: border-box; background-color: #fff; }
        .form-input:disabled, .form-select:disabled { background-color: #f3f4f6; cursor: not-allowed; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .modal-button { padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease-in-out; border: none; }
        .modal-button.cancel { background-color: #e5e7eb; color: #374151; }
        .modal-button.cancel:hover { background-color: #d1d5db; }
        .modal-button.primary { background-color: #2563eb; color: #ffffff; }
        .modal-button.primary:hover { background-color: #1d4ed8; }
        .confirmation-modal .modal-content { max-width: 400px; }
        .confirmation-modal .modal-description { text-align: center; font-size: 16px; color: #374151; }
        .confirmation-modal .modal-footer { justify-content: center; }
        .confirmation-modal .modal-button.confirm-delete { background-color: #ef4444; color: #ffffff; }
        .confirmation-modal .modal-button.confirm-delete:hover { background-color: #dc2626; }
      `}</style>
      <div className="dashboard-container">
        <header className="new-header">
          <div className="logo-text">Tech<span className="logo-x">X</span>plorers</div>
          <div className="user-profile">
            <div className="notification-dot-container" onClick={toggleNotifications} ref={notificationsRef}>
              {notifications.length > 0 && (<><span className="notification-dot-ping"></span><span className="notification-dot-solid"></span></>)}
              <Bell size={20} />
            </div>
            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-panel-header">Notifications ({notifications.length})</div>
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="notification-item">
                    <div className="notification-item-message">{n.message}</div>
                    <div className="notification-item-timestamp">{formatTimestamp(n.timestamp)}</div>
                  </div>
                )) : <div className="notification-panel-empty">No new notifications.</div>}
              </div>
            )}

            <div className="profile-dropdown-container" ref={profileDropdownRef}>
              <div className="user-info" onClick={toggleProfileDropdown}>
                <div style={{textAlign: 'right'}}>
                  <span className="employee-tag"><User size={12} />Asset</span>
                </div>
                <div className="user-avatar">AM</div>
              </div>
              {showProfileDropdown && (
                <ul className="profile-dropdown-menu open">
                  <li className="profile-dropdown-item logout" onClick={handleLogout}>
                    <LogOut />
                    <span>Log out</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </header>

        <div className="main-content-area">
          <nav className="nav-tabs">
            {['Assets Overview', 'Assets', 'Assigned'].map((tab) => (
              <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </nav>

          {activeTab === 'Assets Overview' && (
            <div className="asset-content">
              <div className="dashboard-header"><h2 className="dashboard-title">Assets Overview</h2><p className="dashboard-subtitle">A quick summary of your asset inventory.</p></div>
              <div className="summary-cards-grid">
                <div className="summary-card"><div className="summary-card-content"><p className="summary-card-title">Total Assets</p><p className="summary-card-value">{assets.length}</p></div><div className="summary-card-icon-wrapper total"><Hash size={24} /></div></div>
                <div className="summary-card"><div className="summary-card-content"><p className="summary-card-title">Total Value</p><p className="summary-card-value">${totalAssetValue.toLocaleString()}</p></div><div className="summary-card-icon-wrapper value"><DollarSign size={24} /></div></div>
                <div className="summary-card"><div className="summary-card-content"><p className="summary-card-title">Assigned</p><p className="summary-card-value">{assets.filter(a => a.status === 'assigned').length}</p></div><div className="summary-card-icon-wrapper assigned"><User size={24} /></div></div>
                <div className="summary-card"><div className="summary-card-content"><p className="summary-card-title">Available</p><p className="summary-card-value">{assets.filter(a => a.status === 'available').length}</p></div><div className="summary-card-icon-wrapper available"><CheckCircle size={24} /></div></div>
                <div className="summary-card"><div className="summary-card-content"><p className="summary-card-title">In Maintenance</p><p className="summary-card-value">{assets.filter(a => a.status === 'in maintenance').length}</p></div><div className="summary-card-icon-wrapper maintenance"><Wrench size={24} /></div></div>
              </div>
            </div>
          )}

          {activeTab === 'Assets' && (
            <div className="asset-content">
              <div className="asset-inventory-header"><h2 className="asset-inventory-title"><Info className="asset-inventory-icon" />Asset Inventory</h2><div className="asset-action-buttons"><button className="asset-action-button" onClick={() => setShowAddAssetModal(true)}><Plus size={16} className="asset-action-button-icon" />Add Asset</button></div></div>
              <div className="search-filter-bar">
                <div className="search-input-container"><Search size={18} className="search-icon" /><input type="text" placeholder="Search assets..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="filter-dropdown-container"><select className="filter-dropdown" onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}><option>All Statuses</option><option>available</option><option>assigned</option><option>in maintenance</option></select><ChevronDown size={16} className="dropdown-chevron" /></div>
                {isFilterActive && <button className="clear-filter-button" onClick={handleClearFilters}><FilterX size={16} className="asset-action-button-icon" />Clear Filter</button>}
              </div>
              <div className="asset-table-container">
                <table className="asset-table">
                  <thead><tr><th>Asset</th><th>Type</th><th>Available</th><th>Status</th><th>Branch</th><th>Value</th><th>Actions</th></tr></thead>
                  <tbody>{filteredAssets.map((asset) => (<tr key={asset.id}><td><div className="asset-table-asset-cell"><div><div className="asset-table-asset-id">{asset.id}</div><div className="asset-table-asset-name">{asset.name}</div></div></div></td><td>{asset.type}</td><td>{availableAssetCounts[asset.type] || 0}</td><td><span className={`status-badge ${asset.status.replace(/\s+/g, '-')}`}>{asset.status}</span></td><td>{asset.location}</td><td>{asset.value}</td><td className="actions-cell"><button className="action-icon-button" onClick={() => handleEditAssetClick(asset)}><Edit size={18} /></button><button className="action-icon-button" onClick={() => handleDeleteAssetClick(asset.id)}><Trash2 size={18} /></button></td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Assigned' && (
            <div className="asset-content">
              <div className="asset-inventory-header"><h2 className="asset-inventory-title"><User size={24} className="asset-inventory-icon" />Assigned Assets</h2><div className="asset-action-buttons"><button className="asset-action-button" onClick={() => setShowAssignAssetModal(true)}><Plus size={16} className="asset-action-button-icon" />Assign Assets</button></div></div>
              <div className="search-filter-bar">
                <div className="filter-dropdown-container">
                  <select className="filter-dropdown" onChange={(e) => setAssignedAssetFilter(e.target.value)} value={assignedAssetFilter}>
                    <option value="All Assets">All Assets</option>
                    {assets.filter(a => a.status === 'assigned').map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.id})</option>)}
                  </select>
                  <ChevronDown size={16} className="dropdown-chevron" />
                </div>
              </div>
              <div className="asset-table-container">
                <table className="asset-table">
                  <thead><tr><th>Asset</th><th>Assigned To</th><th>Assigned Date</th><th>Return Date</th><th>Actions</th></tr></thead>
                  <tbody>{assignedAssets.length > 0 ? assignedAssets.map((asset) => (<tr key={asset.id}><td><div className="asset-table-asset-cell"><div><div className="asset-table-asset-id">{asset.id}</div><div className="asset-table-asset-name">{asset.name}</div></div></div></td><td>{asset.assignedTo}</td><td>{asset.assignedDate || 'N/A'}</td><td>{asset.returnDate || 'Not Yet'}</td><td className="actions-cell"><button className="action-icon-button" onClick={() => handleEditAssetClick(asset)}><Edit size={18} /></button><button className="action-icon-button" onClick={() => handleUnassignAssetClick(asset)}><Trash2 size={18} /></button></td></tr>)) : (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No assets are currently assigned.</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAssignAssetModal && <AssignAssetModal show={showAssignAssetModal} onClose={() => setShowAssignAssetModal(false)} onAssign={handleAssignAsset} availableAssets={assets.filter(a => a.status === 'available')} users={users} />}
      {showAddAssetModal && <AddAssetModal show={showAddAssetModal} onClose={() => setShowAddAssetModal(false)} onAdd={handleAddAsset} />}
      {showEditAssetModal && assetToEdit && <EditAssetModal show={showEditAssetModal} onClose={() => setShowEditAssetModal(false)} asset={assetToEdit} onUpdate={handleUpdateAsset} />}
      
      {showDeleteConfirmationModal && (
        <div className="modal-overlay confirmation-modal">
          <div className="modal-content"><div className="modal-header"><h3 className="modal-title">Confirm Deletion</h3><button className="modal-close-button" onClick={() => setShowDeleteConfirmationModal(false)}><X size={20} /></button></div><p className="modal-description">Are you sure you want to delete asset **{assetIdToDelete}**? This action cannot be undone.</p><div className="modal-footer"><button className="modal-button cancel" onClick={() => setShowDeleteConfirmationModal(false)}>Cancel</button><button type="button" className="modal-button confirm-delete" onClick={handleDeleteAssetConfirm}>Delete</button></div></div>
        </div>
      )}
      
      {showUnassignConfirmationModal && (
        <div className="modal-overlay confirmation-modal">
          <div className="modal-content"><div className="modal-header"><h3 className="modal-title">Confirm Unassignment</h3><button className="modal-close-button" onClick={() => setShowUnassignConfirmationModal(false)}><X size={20} /></button></div><p className="modal-description">Are you sure you want to unassign **{assetToUnassign?.name}**? This will set its status to 'available'.</p><div className="modal-footer"><button className="modal-button cancel" onClick={() => setShowUnassignConfirmationModal(false)}>Cancel</button><button type="button" className="modal-button confirm-delete" onClick={handleUnassignAssetConfirm}>Unassign</button></div></div>
        </div>
      )}
    </>
  );
};

export default AssetWorksheet;
