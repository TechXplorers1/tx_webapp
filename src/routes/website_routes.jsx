import { Routes, Route } from 'react-router-dom';

import LandingPage from '../components/LandingPage';
import AboutUs from '../components/AboutUs';
import ContactPage from '../components/Contact';
import LoginPage from '../components/login';
import SignupPage from '../components/signup';








const WebsiteRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

    </Routes>
  );
};
export default WebsiteRoutes;