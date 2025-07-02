import { Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ContactPage from './components/Contact';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import Careers from './components/Careers';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import ClientWorkSheet from './components/ClientWorksheet';
import WebAppDev from './components/services/WebAppDev';
import MobileAppDev from './components/services/MobileAppDev';
import ITTalentSupply from './components/services/ItTalentSupply';
import DigitalMarketing from './components/services/DigitalMarketing';
import JobSupport from './components/services/JobSupport';
import JobSupportForm from './components/services/JobSupportContactForm';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerData from './components/Dashboard/ManagerData';
import TeamLeadData from './components/Dashboard/TeamLeadData';
import EmployeeData from './components/Dashboard/EmployeeData';
import Reports from './components/Reports';
import WorkGroups from './components/workgroups';
// import ClientWorkSheet from './components/ClientWorksheet';

import IntegratedEmployeeForm from './components/employeeRegistrationForm';
// import EmployeeOnboardingWorksheet from './employeeOnboardingWorkSheet';
import ServiceFormComponent from './components/services/ServicesForm';

import AdminWorksheet from './components/AdminWorksheet';









const App = () => {
  return (
    <div>
      <ThemeProvider>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/clientworksheet" element={<ClientWorkSheet/>} />
        <Route path="/userdashboard" element={<UserDashboard />} />
           {/* Services-Path */}
        <Route path="/services/mobile-app-development" element={<MobileAppDev />} />
        <Route path="/services/web-app-development" element={<WebAppDev />} />
        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/services/it-talent-supply" element={<ITTalentSupply />} />
        <Route path="/services/job-support" element={<JobSupport />} />
        <Route path="/services/job-contact-form" element={<JobSupportForm />} />
        <Route path="/services/servicesForm" element={<ServiceFormComponent />} />
           {/* DashBoards */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/managers" element={<ManagerData />} />
        <Route path="/teamleads" element={<TeamLeadData />} />
        <Route path="/employees" element={<EmployeeData />} />
        <Route path="/workgroups" element={<WorkGroups />} />
        <Route path="/adminworksheet" element={<AdminWorksheet/>} />
        {/* <Route path="/clientworksheet" element={<ClientWorkSheet/>} /> */}
        <Route path="/employee-registration-form" element={<IntegratedEmployeeForm />} />


    </Routes>
    </ThemeProvider>
    </div>
  );
};
export default App;