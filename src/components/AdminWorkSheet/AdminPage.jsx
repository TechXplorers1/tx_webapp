import React, { useState } from 'react';
import ClientManagement from './ClientManagement';
import DepartmentManagement from './DepartmentManagement';
import EmployeeManagement from './EmployeeManagement';
import AssetManagement from './AssetManagement';
import RequestManagement from './RequestManagement';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('Employees');

    const containerStyle = {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f7f6',
        minHeight: '100vh',
    };

    const headerStyle = {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2em',
    };

    const tabsContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        padding: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    const tabButtonStyle = {
        padding: '12px 25px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        backgroundColor: 'transparent',
        color: '#555',
        margin: '0 5px',
    };

    const activeTabButtonStyle = {
        ...tabButtonStyle,
        backgroundColor: '#007bff',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
    };

    const renderComponent = () => {
        switch (activeTab) {
            case 'Clients':
                return <ClientManagement />;
            case 'Departments':
                return <DepartmentManagement />;
            case 'Employees':
                return <EmployeeManagement />;
            case 'Assets':
                return <AssetManagement />;
            case 'Requests':
                return <RequestManagement />;
            default:
                return <EmployeeManagement />;
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Admin Dashboard</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
                Manage clients, departments, employees, assets, and requests.
            </p>

            <div style={tabsContainerStyle}>
                <button
                    style={activeTab === 'Employees' ? activeTabButtonStyle : tabButtonStyle}
                    onClick={() => setActiveTab('Employees')}
                >
                    Employees
                </button>
                <button
                    style={activeTab === 'Clients' ? activeTabButtonStyle : tabButtonStyle}
                    onClick={() => setActiveTab('Clients')}
                >
                    Clients
                </button>
                <button
                    style={activeTab === 'Departments' ? activeTabButtonStyle : tabButtonStyle}
                    onClick={() => setActiveTab('Departments')}
                >
                    Departments
                </button>
                <button
                    style={activeTab === 'Assets' ? activeTabButtonStyle : tabButtonStyle}
                    onClick={() => setActiveTab('Assets')}
                >
                    Assets
                </button>
                <button
                    style={activeTab === 'Requests' ? activeTabButtonStyle : tabButtonStyle}
                    onClick={() => setActiveTab('Requests')}
                >
                    Requests
                </button>
            </div>

            <div>
                {renderComponent()}
            </div>
        </div>
    );
};

export default AdminPage;
