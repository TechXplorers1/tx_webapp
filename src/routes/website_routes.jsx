import { Routes, Route } from 'react-router-dom';

import LandingPage from '../components/LandingPage';
import AboutUs from '../components/AboutUs';
import ContactPage from '../components/Contact';








const WebsiteRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />

    </Routes>
  );
};
export default WebsiteRoutes;