import { Routes, Route } from 'react-router-dom';

import LandingPage from '../components/LandingPage';
import AboutUs from '../components/AboutUs';
import ContactPage from '../components/Contact';
import LoginPage from '../components/login';
import SignupPage from '../components/signup';
import Careers from '../components/Careers';








const WebsiteRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};
export default WebsiteRoutes;