import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';

import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ContactPage from './components/Contact';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import Careers from './components/Careers';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import WebAppDev from './components/services/WebAppDev';
import MobileAppDev from './components/services/MobileAppDev';
import ITTalentSupply from './components/services/ItTalentSupply';
import DigitalMarketing from './components/services/DigitalMarketing';
import JobSupport from './components/services/JobSupport';
import CyberSecurity from './components/services/CyberSecurity';
import JobSupportContactForm from './components/services/JobSupportContactForm';
import EmployeeData from './components/Dashboard/EmployeeData';
import Reports from './components/Reports';
import WorkGroups from './components/workgroups';
import AssetsWorksheet from './components/AssetWorksheet';
import EmployeeRegistrationForm from './components/employeeRegistrationForm';
import EmployeeOnboardingWorkSheet from './components/employeeOnboardingSheet';
import ServicesForm from './components/services/ServicesForm';
import Projects from './components/Projects';

// import AdminWorksheet from './components/AdminWorksheet';
import ManagerWorksheet from './components/ManagerWorksheet';

import AdminPage from './components/AdminWorkSheet/AdminPage';



const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
    }

  // Check if the user's roles are allowed for this route
  const isAuthorized = user && user.roles && user.roles.some(role => allowedRoles.includes(role));

  if (!isAuthorized) {
    // If logged in but not authorized, redirect to a default/home page
    // Or you can create a dedicated "Unauthorized" page
    return <Navigate to="/login" replace />;
  }

  return children;
};



const App = () => {
  return (
    <div>
      <AuthProvider>
      <ThemeProvider>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/projects" element={<Projects />} />
        
           {/* Services-Path */}
        <Route path="/services/mobile-app-development" element={<MobileAppDev />} />
        <Route path="/services/web-app-development" element={<WebAppDev />} />
        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/services/it-talent-supply" element={<ITTalentSupply />} />
        <Route path="/services/job-support" element={<JobSupport />} />
        <Route path="/services/cyber-security" element={<CyberSecurity />} />
        <Route path="/services/job-contact-form" element={<ProtectedRoute allowedRoles={['client']}><JobSupportContactForm /></ProtectedRoute>} />
        <Route path="/services/servicesForm" element={<ProtectedRoute allowedRoles={['client']}><ServicesForm /></ProtectedRoute>} />
           {/* DashBoards */}
     {/* --- Protected Routes with Role-Based Access --- */}
            <Route path="/clientdashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
            <Route path="/assetworksheet" element={<ProtectedRoute allowedRoles={['asset']}><AssetsWorksheet /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Reports /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeData /></ProtectedRoute>} />
            <Route path="/workgroups" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><WorkGroups /></ProtectedRoute>} />
            <Route path="/adminpage" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
            {/* <Route path="/adminworksheet" element={<ProtectedRoute allowedRoles={['admin']}><AdminWorksheet /></ProtectedRoute>} /> */}
            <Route path="/managerworksheet" element={<ProtectedRoute allowedRoles={['manager']}><ManagerWorksheet /></ProtectedRoute>} />
            <Route path="/employee-registration-form" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeRegistrationForm /></ProtectedRoute>} />
            <Route path="/employee-onboarding-sheet" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeOnboardingWorkSheet /></ProtectedRoute>} />



    </Routes>
    </ThemeProvider>
    </AuthProvider>
    </div>
  );
};
export default App;