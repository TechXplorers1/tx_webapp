import { Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
import JobSupportForm from './components/services/JobSupportContactForm';
import UserDashboard from './components/Dashboard/UserDashboard';





const App = () => {
  return (
    <div>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
           {/* Services-Path */}
        <Route path="/services/mobile-app-development" element={<MobileAppDev />} />
        <Route path="/services/web-app-development" element={<WebAppDev />} />
        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/services/it-talent-supply" element={<ITTalentSupply />} />
        <Route path="/services/job-support" element={<JobSupport />} />
        <Route path="/services/job-contact-form" element={<JobSupportForm />} />



    </Routes>
    </div>
  );
};
export default App;