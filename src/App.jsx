import { Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ContactPage from './components/Contact';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import Careers from './components/Careers';
import ClientDashboard from './components/Dashboard/ClientDashboard';
// import AdminDashboard from './components/Dashboard/AdminDashboard';





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
        {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}




    </Routes>
    </div>
  );
};
export default App;