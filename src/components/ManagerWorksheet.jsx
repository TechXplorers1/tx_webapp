import React, { useState, useEffect } from 'react';

const ManagerWorkSheet = () => {
  // State to manage the current theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    // Initialize theme from local storage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Applications'); // Default to 'Overview'

  // Effect to apply the theme class to the body and save to local storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="manager-dashboard-container">
      {/* Font Awesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
          /* Light Theme Colors (Default) */
          --bg-color: #f8f9fa;
          --text-color: #333;
          --header-border-color: #e0e0e0;
          --card-bg: #ffffff;
          --card-shadow: rgba(0, 0, 0, 0.08);
          --card-hover-shadow: rgba(0, 0, 0, 0.12);
          --button-hover-bg: #e9ecef;
          --icon-color: #6c757d;
          --tab-button-color: #6c757d;
          --tab-button-hover-bg: #f1f3f5;
          --tab-button-active-bg: #e9ecef;
          --tab-button-active-color: #212529;
          --member-border-color: #f1f3f5;
          --employee-count-bg: #e9ecef;
          --employee-count-color: #6c757d;
          --activity-subtitle-color: #868e96;
          --main-title-color: #212529;
          --subtitle-color: #6c757d;
          --user-profile-shadow: rgba(0, 0, 0, 0.08);
          --user-profile-bg: #ffffff;
          --user-name-color: #343a40;
          --user-role-color: #868e96;
          --user-avatar-bg: #343a40;
          --user-avatar-color: #ffffff;
          --manager-badge-bg: #f3e8ff;
          --manager-badge-color: #6f42c1;
          --notification-badge-bg: #dc3545;
          --notification-badge-border: #ffffff;
          --card-title-color: #6c757d;
          --card-value-color: #212529;
          --card-description-color: #868e96;
          --card-icon-blue-bg: #e7f5ff;
          --card-icon-blue-color: #007bff;
          --card-icon-green-bg: #e6ffed;
          --card-icon-green-color: #28a745;
          --card-icon-orange-bg: #fff4e6;
          --card-icon-orange-color: #fd7e14;
          --card-icon-purple-bg: #f3e8ff;
          --card-icon-purple-color: #6f42c1;
          --success-rate-green: #28a745;
          --section-header-color: #212529;
          --section-header-icon-color: #6c757d;
          --red-icon-color: #dc3545;
          --action-button-border: #ced4da;
          --action-button-color: #495057;
          --action-button-bg: #ffffff;
          --action-button-hover-bg: #f1f3f5;
          --action-button-hover-border: #adb5bd;
          --attention-item-color: #495057;
          --attention-badge-bg: #f8d7da;
          --attention-badge-color: #721c24;
          --attention-badge-gray-bg: #e9ecef;
          --attention-badge-gray-color: #495057;
          --performance-value-color: #343a40;
          --member-avatar-bg-default: #e7f5ff;
          --member-avatar-color-default: #007bff;
          --member-avatar-bg-employee: #e0e7ff;
          --member-avatar-color-employee: #4338ca;
          --status-badge-excellent-bg: #d4edda;
          --status-badge-excellent-color: #155724;
          --status-badge-good-bg: #cce5ff;
          --status-badge-good-color: #004085;

          /* Application Status Badges */
          --status-interview-bg: #f3e8ff;
          --status-interview-color: #6f42c1;
          --status-applied-bg: #e0e7ff;
          --status-applied-color: #4338ca;
          --status-pending-bg: #fff4e6;
          --status-pending-color: #fd7e14;
          --status-verified-bg: #e6ffed;
          --status-verified-color: #28a745;
        }

        [data-theme='dark'] {
          --bg-color: #2c2c2c; /* Darker background */
          --text-color: #e0e0e0;
          --header-border-color: #444444;
          --card-bg: #3a3a3a;
          --card-shadow: rgba(0, 0, 0, 0.3);
          --card-hover-shadow: rgba(0, 0, 0, 0.5);
          --button-hover-bg: #4a4a4a;
          --icon-color: #bbbbbb;
          --tab-button-color: #bbbbbb;
          --tab-button-hover-bg: #4a4a4a;
          --tab-button-active-bg: #5a5a5a;
          --tab-button-active-color: #ffffff;
          --member-border-color: #4a4a4a;
          --employee-count-bg: #4a4a4a;
          --employee-count-color: #e0e0e0;
          --activity-subtitle-color: #aaaaaa;
          --main-title-color: #ffffff;
          --subtitle-color: #bbbbbb;
          --user-profile-shadow: rgba(0, 0, 0, 0.3);
          --user-profile-bg: #3a3a3a;
          --user-name-color: #ffffff;
          --user-role-color: #bbbbbb;
          --user-avatar-bg: #5a5a5a;
          --user-avatar-color: #ffffff;
          --manager-badge-bg: #4a3c61; /* Darker purple */
          --manager-badge-color: #d1b3ff; /* Lighter purple text */
          --notification-badge-bg: #ef5350; /* Slightly brighter red */
          --notification-badge-border: #2c2c2c; /* Dark border */
          --card-title-color: #bbbbbb;
          --card-value-color: #ffffff;
          --card-description-color: #aaaaaa;
          --card-icon-blue-bg: #334d66;
          --card-icon-blue-color: #66b3ff;
          --card-icon-green-bg: #335544;
          --card-icon-green-color: #66cc99;
          --card-icon-orange-bg: #664d33;
          --card-icon-orange-color: #ffcc66;
          --card-icon-purple-bg: #553366;
          --card-icon-purple-color: #cc99ff;
          --success-rate-green: #66cc99;
          --section-header-color: #ffffff;
          --section-header-icon-color: #bbbbbb;
          --red-icon-color: #ef5350;
          --action-button-border: #555555;
          --action-button-color: #e0e0e0;
          --action-button-bg: #3a3a3a;
          --action-button-hover-bg: #4a4a4a;
          --action-button-hover-border: #666666;
          --attention-item-color: #e0e0e0;
          --attention-badge-bg: #5a3a3a;
          --attention-badge-color: #ffaaaa;
          --attention-badge-gray-bg: #4a4a4a;
          --attention-badge-gray-color: #e0e0e0;
          --performance-value-color: #ffffff;
          --member-avatar-bg-default: #334d66;
          --member-avatar-color-default: #66b3ff;
          --member-avatar-bg-employee: #4338ca; /* Keeping original for contrast */
          --member-avatar-color-employee: #e0e7ff; /* Keeping original for contrast */
          --status-badge-excellent-bg: #335544;
          --status-badge-excellent-color: #66cc99;
          --status-badge-good-bg: #334d66;
          --status-badge-good-color: #66b3ff;

          /* Application Status Badges (Dark Theme) */
          --status-interview-bg: #553366;
          --status-interview-color: #cc99ff;
          --status-applied-bg: #334d66;
          --status-applied-color: #66b3ff;
          --status-pending-bg: #664d33;
          --status-pending-color: #ffcc66;
          --status-verified-bg: #335544;
          --status-verified-color: #66cc99;
        }

        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .manager-dashboard-container {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 20px;
          font-family: 'Inter', sans-serif;
          color: var(--text-color);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--header-border-color);
          margin-bottom: 20px;
          transition: border-color 0.3s ease;
        }

        .header-logo {
          font-size: 24px;
          font-weight: 700;
          color: var(--main-title-color);
          margin: 0;
        }

        .header-logo .x-highlight {
            color: var(--card-icon-blue-color);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-button {
          padding: 6px;
          border-radius: 50%;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
          position: relative;
        }

        .header-button:hover {
          background-color: var(--button-hover-bg);
          transform: translateY(-1px);
        }

        .header-button i {
          font-size: 20px;
          color: var(--icon-color);
          transition: color 0.3s ease;
        }

        .notification-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background-color: var(--notification-badge-bg);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
            border: 1px solid var(--notification-badge-border);
            transform: translate(25%, -25%);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          background-color: var(--user-avatar-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--user-avatar-color);
          font-weight: 600;
          font-size: 12px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Target the div directly within .user-profile for text grouping */
        .user-profile > div:first-of-type {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: flex-end;
        }

        .user-profile > div:first-of-type span:first-child {
          font-weight: 500;
          color: var(--user-name-color);
          transition: color 0.3s ease;
        }

        .manager-badge {
            background-color: var(--manager-badge-bg);
            color: var(--manager-badge-color);
            font-size: 10px;
            font-weight: 600;
            padding: 1px 6px;
            border-radius: 10px;
            margin-top: 1px;
            border: none !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .user-profile .dropdown-arrow {
          font-size: 12px;
          color: var(--icon-color);
          margin-left: 4px;
          transition: color 0.3s ease;
        }

        .main-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .main-content-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .main-content-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .dashboard-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          box-shadow: 0 4px 8px var(--card-shadow);
          padding: 15px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100px;
          position: relative;
          overflow: hidden;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease-in-out;
        }

        .dashboard-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px var(--card-hover-shadow);
        }

        .card-title {
          color: var(--card-title-color);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }

        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--card-value-color);
          margin-top: 0;
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }

        .card-description {
          color: var(--card-description-color);
          font-size: 13px;
          transition: color 0.3s ease;
        }

        .card-icon-wrapper {
          position: absolute;
          bottom: 15px;
          right: 15px;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
        }

        .card-icon-wrapper i {
          font-size: 24px;
          line-height: 1;
        }

        .card-icon-wrapper.blue {
          background-color: var(--card-icon-blue-bg);
        }
        .card-icon-wrapper.blue i {
          color: var(--card-icon-blue-color);
        }

        .card-icon-wrapper.green {
          background-color: var(--card-icon-green-bg);
        }
        .card-icon-wrapper.green i {
          color: var(--card-icon-green-color);
        }

        .card-icon-wrapper.orange {
          background-color: var(--card-icon-orange-bg);
        }
        .card-icon-wrapper.orange i {
          color: var(--card-icon-orange-color);
        }

        .card-icon-wrapper.purple {
          background-color: var(--card-icon-purple-bg);
        }
        .card-icon-wrapper.purple i {
          color: var(--card-icon-purple-color);
        }

        .success-rate-description span {
          color: var(--success-rate-green);
          font-weight: 500;
        }

        .bottom-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (min-width: 1024px) {
          .bottom-sections-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .section-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          box-shadow: 0 4px 8px var(--card-shadow);
          padding: 20px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease-in-out;
        }

        .section-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px var(--card-hover-shadow);
        }

        .section-header {
          font-size: 17px;
          font-weight: 600;
          color: var(--section-header-color);
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          transition: color 0.3s ease;
        }

        .section-header i {
          font-size: 18px;
          color: var(--section-header-icon-color);
          margin-right: 8px;
          transition: color 0.3s ease;
        }

        .section-header i.red-icon {
          color: var(--red-icon-color);
        }

        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 15px;
          border: 1px solid var(--action-button-border);
          border-radius: 8px;
          color: var(--action-button-color);
          background-color: var(--action-button-bg);
          cursor: pointer;
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.2s ease-in-out;
          font-size: 14px;
        }

        .action-button:hover {
          background-color: var(--action-button-hover-bg);
          border-color: var(--action-button-hover-border);
        }

        .action-button i {
          font-size: 18px;
          margin-right: 8px;
        }

        .attention-list, .performance-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .attention-item, .performance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--attention-item-color);
          font-size: 14px;
          padding: 5px 0;
          transition: color 0.3s ease;
        }

        .attention-badge {
          background-color: var(--attention-badge-bg);
          color: var(--attention-badge-color);
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 12px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .attention-badge.gray {
          background-color: var(--attention-badge-gray-bg);
          color: var(--attention-badge-gray-color);
        }

        .performance-value {
          font-weight: 600;
          color: var(--performance-value-color);
          transition: color 0.3s ease;
        }

        /* Styles for tabs and content below dashboard cards */
        .tab-navigation {
            display: flex;
            width: 100%;
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 10px;
            margin-bottom: 20px;
            gap: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .tab-button {
            flex-grow: 1;
            padding: 10px 20px;
            border: none;
            background-color: transparent;
            font-size: 16px;
            font-weight: 500;
            color: var(--tab-button-color);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            text-align: center;
        }

        .tab-button:hover {
            background-color: var(--tab-button-hover-bg);
            color: var(--tab-button-active-color);
        }

        .tab-button.active {
            background-color: var(--tab-button-active-bg);
            color: var(--tab-button-active-color);
            font-weight: 600;
        }

        .content-sections-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @media (min-width: 992px) {
            .content-sections-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .content-card {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 20px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .content-card-header {
            font-size: 17px;
            font-weight: 600;
            color: var(--section-header-color);
            margin-bottom: 15px;
            transition: color 0.3s ease;
        }

        .team-member-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .team-member-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid var(--member-border-color);
            transition: border-color 0.3s ease;
        }

        .team-member-item:last-child {
            border-bottom: none;
        }

        .member-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .member-avatar {
            width: 38px;
            height: 38px;
            background-color: var(--member-avatar-bg-default);
            color: var(--member-avatar-color-default);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .member-avatar.employee-avatar { /* Specific style for employee avatars */
            background-color: var(--member-avatar-bg-employee);
            color: var(--member-avatar-color-employee);
        }

        .member-name {
            font-weight: 500;
            color: var(--user-name-color);
            transition: color 0.3s ease;
        }

        .member-role {
            font-size: 13px;
            color: var(--user-role-color);
            transition: color 0.3s ease;
        }

        .employee-count {
            font-size: 13px;
            color: var(--employee-count-color);
            background-color: var(--employee-count-bg);
            padding: 4px 8px;
            border-radius: 15px;
            font-weight: 500;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .status-badge {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 15px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .status-badge.excellent {
            background-color: var(--status-badge-excellent-bg);
            color: var(--status-badge-excellent-color);
        }

        .status-badge.good {
            background-color: var(--status-badge-good-bg);
            color: var(--status-badge-good-color);
        }

        .recent-activity-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .activity-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .activity-icon {
            font-size: 18px;
            color: var(--icon-color);
            padding-top: 2px;
            transition: color 0.3s ease;
        }

        .activity-details {
            flex-grow: 1;
        }

        .activity-title {
            font-weight: 500;
            color: var(--user-name-color);
            margin-bottom: 2px;
            transition: color 0.3s ease;
        }

        .activity-subtitle {
            font-size: 13px;
            color: var(--activity-subtitle-color);
            transition: color 0.3s ease;
        }

        /* Styles for Employee Applications Management */
        .applications-management-section {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 4px 8px var(--card-shadow);
            padding: 20px;
            margin-top: 20px; /* Space from tabs */
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .applications-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
            gap: 10px; /* Gap for wrapped items */
        }

        .applications-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--section-header-color);
            transition: color 0.3s ease;
        }

        .pending-review-badge {
            background-color: var(--status-pending-bg);
            color: var(--status-pending-color);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 15px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .applications-filters {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .search-input-wrapper {
            position: relative;
            flex-grow: 1;
            min-width: 200px; /* Ensure search input has minimum width */
        }

        .search-input-wrapper input {
            width: 100%;
            padding: 10px 10px 10px 40px; /* Left padding for icon */
            border: 1px solid var(--header-border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-size: 14px;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }

        .search-input-wrapper i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--icon-color);
            font-size: 16px;
            transition: color 0.3s ease;
        }

        .filter-dropdown {
            position: relative;
            flex-grow: 1;
            min-width: 150px;
        }

        .filter-dropdown select {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--header-border-color);
            border-radius: 8px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-size: 14px;
            appearance: none; /* Remove default arrow */
            -webkit-appearance: none;
            -moz-appearance: none;
            cursor: pointer;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }

        .filter-dropdown i {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--icon-color);
            font-size: 14px;
            pointer-events: none; /* Make icon unclickable */
            transition: color 0.3s ease;
        }

        .applications-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left;
        }

        .applications-table th,
        .applications-table td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--header-border-color);
            transition: border-color 0.3s ease;
        }

        .applications-table th {
            color: var(--subtitle-color);
            font-weight: 600;
            white-space: nowrap; /* Prevent wrapping of headers */
        }

        .applications-table td {
            color: var(--text-color);
            vertical-align: middle;
        }

        .applications-table tr:last-child td {
            border-bottom: none;
        }

        .applications-table .employee-cell {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .applications-table .employee-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            background-color: var(--member-avatar-bg-default);
            color: var(--member-avatar-color-default);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .applications-table .status-badge {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block; /* Ensure it respects padding/margin */
            white-space: nowrap; /* Prevent text wrapping */
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .status-badge.interview {
            background-color: var(--status-interview-bg);
            color: var(--status-interview-color);
        }

        .status-badge.applied {
            background-color: var(--status-applied-bg);
            color: var(--status-applied-color);
        }

        .status-badge.pending {
            background-color: var(--status-pending-bg);
            color: var(--status-pending-color);
        }

        .verification-icons {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .verification-icons i {
            font-size: 16px;
            cursor: pointer;
            transition: color 0.2s ease-in-out;
        }

        .verification-icons .fa-circle-check {
            color: var(--status-verified-color); /* Green for verified */
        }

        .verification-icons .fa-camera {
            color: var(--icon-color); /* Default gray */
        }

        .action-icons {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .action-icons i {
            font-size: 18px;
            cursor: pointer;
            transition: color 0.2s ease-in-out;
        }

        .action-icons .fa-eye {
            color: var(--icon-color);
        }

        .action-icons .fa-xmark-circle {
            color: #dc3545; /* Red for reject */
        }

        .action-icons .fa-check-circle {
            color: #28a745; /* Green for approve */
        }
        `}
      </style>

      {/* Header Section */}
      <header className="header-section">
        <div className="header-logo">
          Tech<span className="x-highlight">X</span>plorers
        </div>
        <div className="header-actions">
          <button className="header-button">
            <i className="fas fa-search"></i>
          </button>
          <button className="header-button">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          {/* Theme Toggle Button */}
          <button className="header-button" onClick={toggleTheme}>
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
          </button>
          <div className="user-profile">
            <div>
              <span>Manager User</span>
              <span className="manager-badge">Manager</span>
            </div>
            <div className="user-avatar">LU</div>
            <i className="fas fa-chevron-down dropdown-arrow"></i>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {/* <button
          className={`tab-button ${activeTab === 'Overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('Overview')}
        >
          Overview
        </button> */}
        <button
          className={`tab-button ${activeTab === 'Applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('Applications')}
        >
          Applications
        </button>
        <button
          className={`tab-button ${activeTab === 'Assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('Assignments')}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === 'Approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('Approvals')}
        >
          Approvals
        </button>
        <button
          className={`tab-button ${activeTab === 'Notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('Notes')}
        >
          Notes
        </button>
      </div>

      {/* Conditional Rendering of Content based on activeTab */}
      {activeTab === 'Overview' && (
        <>
          {/* Main Content Grid (existing dashboard cards) */}
          <div className="main-content-grid">
            {/* Team Members Card */}
            <div className="dashboard-card">
              <div>
                <h3 className="card-title">Team Members</h3>
                <p className="card-value">12</p>
                <p className="card-description">Under management</p>
              </div>
              <div className="card-icon-wrapper blue">
                <i className="fas fa-users"></i>
              </div>
            </div>

            {/* Active Applications Card */}
            <div className="dashboard-card">
              <div>
                <h3 className="card-title">Active Applications</h3>
                <p className="card-value">45</p>
                <p className="card-description">In progress</p>
              </div>
              <div className="card-icon-wrapper green">
                <i className="fas fa-briefcase"></i>
              </div>
            </div>

            {/* Pending Approvals Card */}
            <div className="dashboard-card">
              <div>
                <h3 className="card-title">Pending Approvals</h3>
                <p className="card-value">8</p>
                <p className="card-description">Requires action</p>
              </div>
              <div className="card-icon-wrapper orange">
                <i className="fas fa-clock"></i>
              </div>
            </div>

            {/* Success Rate Card */}
            <div className="dashboard-card">
              <div>
                <h3 className="card-title">Success Rate</h3>
                <p className="card-value">79%</p>
                <p className="card-description success-rate-description">Team average: <span>&gt;75%</span></p>
              </div>
              <div className="card-icon-wrapper purple">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
          </div>

          {/* Bottom Sections Grid (Quick Actions, Attention Required, Team Performance) */}
          <div className="bottom-sections-grid">
            {/* Quick Actions Section */}
            <div className="section-card">
              <h2 className="section-header">
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h2>
              <div className="quick-actions-list">
                <button className="action-button">
                  <i className="fas fa-user-plus"></i>
                  Assign Client to Employee
                </button>
                <button className="action-button">
                  <i className="fas fa-user-tie"></i>
                  Assign Employee to Team Lead
                </button>
                <button className="action-button">
                  <i className="fas fa-file-alt"></i>
                  Generate Report
                </button>
              </div>
            </div>

            {/* Attention Required Section */}
            <div className="section-card">
              <h2 className="section-header">
                <i className="fas fa-exclamation-triangle red-icon"></i>
                Attention Required
              </h2>
              <div className="attention-list">
                <div className="attention-item">
                  <span>Pending File Approvals</span>
                  <span className="attention-badge">3</span>
                </div>
                <div className="attention-item">
                  <span>Application Reviews</span>
                  <span className="attention-badge gray">2</span>
                </div>
                <div className="attention-item">
                  <span>Unassigned Clients</span>
                  <span className="attention-badge gray">3</span>
                </div>
              </div>
            </div>

            {/* Team Performance Section */}
            <div className="section-card">
              <h2 className="section-header">
                <i className="fas fa-chart-bar"></i>
                Team Performance
              </h2>
              <div className="performance-list">
                <div className="performance-item">
                  <span>This Month Applications</span>
                  <span className="performance-value">156</span>
                </div>
                <div className="performance-item">
                  <span>Team Leads Active</span>
                  <span className="performance-value">2</span>
                </div>
                <div className="performance-item">
                  <span>Clients Managed</span>
                  <span className="performance-value">25</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-sections-grid">
            {/* Team Structure Card */}
            <div className="content-card">
              <h2 className="content-card-header">Team Structure</h2>
              <div className="team-member-list">
                {/* Team Lead 1 */}
                <div className="team-member-item">
                  <div className="member-info">
                    <div className="member-avatar">MJ</div>
                    <div>
                      <div className="member-name">Michael Johnson</div>
                      <div className="member-role">Team Lead</div>
                    </div>
                  </div>
                  <span className="employee-count">2 employees</span>
                </div>
                {/* Employees under Team Lead 1 */}
                <div className="team-member-item" style={{marginLeft: '48px', borderBottom: 'none'}}>
                    <div className="member-info">
                        <div className="member-avatar employee-avatar">S</div>
                        <div className="member-name">Sarah Johnson</div>
                    </div>
                    <span className="status-badge excellent">excellent</span>
                </div>
                <div className="team-member-item" style={{marginLeft: '48px'}}>
                    <div className="member-info">
                        <div className="member-avatar employee-avatar">M</div>
                        <div className="member-name">Michael Chen</div>
                    </div>
                    <span className="status-badge good">good</span>
                </div>

                {/* Team Lead 2 */}
                <div className="team-member-item">
                  <div className="member-info">
                    <div className="member-avatar">LC</div>
                    <div>
                      <div className="member-name">Lisa Chen</div>
                      <div className="member-role">Senior Team Lead</div>
                    </div>
                  </div>
                  <span className="employee-count">0 employees</span>
                </div>
              </div>
            </div>

            {/* Recent Activities Card */}
            <div className="content-card">
              <h2 className="content-card-header">Recent Activities</h2>
              <div className="recent-activity-list">
                <div className="activity-item">
                  <i className="fas fa-user-tie activity-icon"></i>
                  <div className="activity-details">
                    <div className="activity-title">Client assigned to Sarah Johnson</div>
                    <div className="activity-subtitle">Robert Garcia - Product Manager</div>
                  </div>
                </div>
                <div className="activity-item">
                  <i className="fas fa-file-alt activity-icon"></i>
                  <div className="activity-details">
                    <div className="activity-title">File approved for John Anderson</div>
                    <div className="activity-subtitle">Resume update by Sarah Johnson</div>
                  </div>
                </div>
                <div className="activity-item">
                  <i className="fas fa-paper-plane activity-icon"></i>
                  <div className="activity-details">
                    <div className="activity-title">Application approved and sent</div>
                    <div className="activity-subtitle">TechFlow Inc - Senior Frontend Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Applications' && (
        <div className="applications-management-section">
          <div className="applications-header">
            <h2 className="applications-title">Employee Applications Management</h2>
            <span className="pending-review-badge">2 pending review</span>
          </div>

          <div className="applications-filters">
            <div className="search-input-wrapper">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search applications..." />
            </div>
            <div className="filter-dropdown">
              <select>
                <option>All Applications</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="filter-dropdown">
              <select>
                <option>Filter by employee</option>
                <option>Sarah Johnson</option>
                <option>Michael Chen</option>
                <option>Emily Rodriguez</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <div className="table-responsive"> {/* Added for potential horizontal scrolling on small screens */}
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Client</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  {/* <th>Status</th>
                  <th>Verification</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="employee-cell">
                    <div className="employee-avatar">SJ</div>
                    Sarah Johnson
                  </td>
                  <td>John Anderson</td>
                  <td>Senior Frontend Developer</td>
                  <td>TechFlow Inc</td>
                  {/* <td><span className="status-badge interview">interview</span></td>
                  <td>
                    <div className="verification-icons">
                      <i className="fas fa-circle-check"></i>
                      <span>manager verified</span>
                      <i className="fas fa-camera"></i>
                    </div>
                  </td> */}
                  <td>
                    <div className="action-icons">
                      <i className="fas fa-eye"></i>
                      <i className="fas fa-check-circle"></i>
                      <i className="fas fa-xmark-circle"></i>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="employee-cell">
                    <div className="employee-avatar">MC</div>
                    Michael Chen
                  </td>
                  <td>Sarah Mitchell</td>
                  <td>UX Designer</td>
                  <td>DesignCorp</td>
                  {/* <td><span className="status-badge applied">applied</span></td>
                  <td>
                    <div className="verification-icons">
                      <i className="fas fa-circle-check"></i>
                      <span>pending</span>
                      <i className="fas fa-camera"></i>
                    </div>
                  </td> */}
                  <td>
                    <div className="action-icons">
                      <i className="fas fa-eye"></i>
                      <i className="fas fa-check-circle"></i>
                      <i className="fas fa-xmark-circle"></i>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="employee-cell">
                    <div className="employee-avatar">ER</div>
                    Emily Rodriguez
                  </td>
                  <td>Michael Chen</td>
                  <td>Data Analyst</td>
                  <td>DataTech Solutions</td>
                  {/* <td><span className="status-badge applied">applied</span></td>
                  <td>
                    <div className="verification-icons">
                      <i className="fas fa-circle-check"></i>
                      <span>pending</span>
                      <i className="fas fa-camera"></i>
                    </div>
                  </td> */}
                  <td>
                    <div className="action-icons">
                      <i className="fas fa-eye"></i>
                      <i className="fas fa-check-circle"></i>
                      <i className="fas fa-xmark-circle"></i>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerWorkSheet;
