// import React, { useState } from 'react';
// import { Container, Row, Col, Carousel } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import CustomNavbar from './Navbar';
// import '../styles/LandingPage.css';
// import { useTheme } from '../context/ThemeContext';
// import { useAuth } from '../components/AuthContext'; // Import useAuth

// // Import images
// import Image1 from '../assets/MobileDev.png';
// import Image2 from '../assets/WebDev.png';
// import Image3 from '../assets/DigiMark.png';
// import Image4 from '../assets/JobApply.png';
// import Image5 from '../assets/ItTalentSupply.png';
// import Image6 from '../assets/CyberSecurity.png';

// // Service images
// import WebAnalyticsImg from '../assets/WebAnalytics&Reporting.png';
// import ProjectPlanningImg from '../assets/project_planning.png';
// import techSupportImg from '../assets/tech_support.png';

// // Scroll animation hook
// import { useInView } from 'react-intersection-observer';

// const LandingPage = () => {
//   const { isLoggedIn } = useAuth(); // Get authentication status
//   const navigate = useNavigate();

//   const offices = [
//     { name: 'USA', position: [40.7128, -74.006] },
//     { name: 'Canada', position: [43.6532, -79.3832] },
//     { name: 'UK', position: [51.505, -0.09] },
//     { name: 'Nigeria', position: [6.5244, 3.3792] },
//     { name: 'Australia', position: [-33.8688, 151.2093] },
//     { name: 'India', position: [14.666386222572966, 77.59006709376247] },
//   ];

//   const carouselItems = [
//     { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile App Development", path: "/services/mobile-app-development", service: "Mobile Development" },
//     { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development", path: "/services/web-app-development", service: "Web Development" },
//     { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing", path: "/services/digital-marketing", service: "Digital Marketing" },
//     { id: 4, image: Image4, alt: "Job Support Profile", text: "Job Support", path: "/services/job-support", isJobSupport: true },
//     { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply", path: "/services/it-talent-supply", service: "IT Talent Supply" },
//     { id: 6, image: Image6, alt: "TechXplorers Service 6", text: "Cyber Security", path: "/services/cyber-security", service: "Cyber Security" }
//   ];

//   const [carouselRef, carouselInView] = useInView({ triggerOnce: false, threshold: 0.1 });
//   const [servicesRef, servicesInView] = useInView({ triggerOnce: false, threshold: 0.1 });
//   const [worldRef, worldInView] = useInView({ triggerOnce: true, threshold: 0.1 });
//   const { isDarkMode } = useTheme();

//   /**
//    * Handles the click on the "Book a Service" button.
//    * If the user is logged in, it navigates to the appropriate service form.
//    * If not logged in, it redirects to the login page.
//    * @param {object} item - The carousel item object.
//    */
//   const handleBookServiceClick = (item) => {
//     if (isLoggedIn) {
//       // User is logged in, proceed to the form
//       if (item.isJobSupport) {
//         navigate("/services/job-contact-form");
//       } else {
//         navigate('/services/servicesForm', { state: { service: item.service } });
//       }
//     } else {
//       // User is not logged in, redirect to the login page
//       // You can also pass the intended destination to redirect back after login
//       navigate('/login', { state: { from: window.location.pathname } });
//     }
//   };

//   return (
//     <div className={`landing-page mt-4 ${isDarkMode ? 'dark-mode' : ''}`}>
//       <CustomNavbar />
//       {/* Hero Carousel */}
//       <div ref={carouselRef} className={`animated-section ${carouselInView ? 'zoom-in-content' : ''}`}>
//         <Container fluid className="carousel-container my-5 px-0">
//           <Carousel indicators={true} interval={3000} className="carousel-shadow">
//             {carouselItems.map((item) => (
//               <Carousel.Item key={item.id} className="carousel-item-custom position-relative">
//                 <div className="carousel-overlay-content position-absolute top-50 start-50 translate-middle text-center text-white">
//                   <h3>{item.text}</h3>
                  
//                     <div className="header-button-container">
                    
//                     <Link to={item.path} className="header-action-btn"> {/* Secondary button style */}
//                       Learn More
//                     </Link>
//                     <div
//                       onClick={() => handleBookServiceClick(item)}
//                       className="header-action-btn btn-book" // Primary button style
//                     >
//                       Book a Service
//                     </div>
//                   </div>
//                 </div>
//                 <img
//                   className="d-block w-100 carousel-img"
//                   src={item.image}
//                   alt={item.alt}
//                 />
//                 <div className="carousel-mask" />
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </Container>
//       </div>

//       {/* Services Section */}
//       {/* Services Section */}
//             <section
//               ref={servicesRef}
//               className={`services-section ${servicesInView ? 'slide-up-section' : ''} text-center py-5`}
//               id="services"
//             >
//               <Container>
//                 <div className="text-center mb-5">
//                   <span className="badge bg-primary text-white mb-3">Our Services</span>
//                   <h2>Comprehensive Tech Solutions</h2>
//                   <p className="lead text-muted">From analytics to support, we provide end-to-end technology services that help your business thrive in the digital landscape.</p>
//                 </div>
//                 <Row className="g-4">
//                   {/* Service Card 1 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image1} className="card-img-top" alt="Mobile Application Development" />
//                       <div className="card-body">
//                         <h5 className="card-title">Mobile Application Development</h5>
//                         <p className="card-text text-muted">Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> iOS & Android Apps</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Cross-Platform Solutions</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> UI/UX Design</li>
//                         </ul>
//                         <Link to="/services/mobile-app-development" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                   {/* Service Card 2 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image2} className="card-img-top" alt="Web Application Development" />
//                       <div className="card-body">
//                         <h5 className="card-title">Web Application Development</h5>
//                         <p className="card-text text-muted">Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Full-Stack Development</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Modern Frameworks</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Cloud Integration</li>
//                         </ul>
//                         <Link to="/services/web-app-development" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                   {/* Service Card 3 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image3} className="card-img-top" alt="Digital Marketing" />
//                       <div className="card-body">
//                         <h5 className="card-title">Digital Marketing</h5>
//                         <p className="card-text text-muted">Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> SEO Optimization</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Social Media Marketing</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Analytics & Reporting</li>
//                         </ul>
//                         <Link to="/services/digital-marketing" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                   {/* Service Card 4 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image5} className="card-img-top" alt="IT Talent Supply" />
//                       <div className="card-body">
//                         <h5 className="card-title">IT Talent Supply</h5>
//                         <p className="card-text text-muted">Connect with top-tier IT professionals and build exceptional teams to drive your technology initiatives forward.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Skilled Professionals</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Flexible Staffing</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Team Augmentation</li>
//                         </ul>
//                         <Link to="/services/it-talent-supply" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                   {/* Service Card 5 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image4} className="card-img-top" alt="Job Support & IT Consulting" />
//                       <div className="card-body">
//                         <h5 className="card-title">Job Support & IT Consulting</h5>
//                         <p className="card-text text-muted">Expert consulting and job support services to help you navigate complex IT challenges and career growth.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Technical Guidance</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Career Support</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Strategic Consulting</li>
//                         </ul>
//                         <Link to="/services/job-support" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                   {/* Service Card 6 */}
//                   <Col md={4}>
//                     <div className="card h-100 shadow-sm border-0 animated-card">
//                       <img src={Image6} className="card-img-top" alt="Cyber Security" />
//                       <div className="card-body">
//                         <h5 className="card-title">Cyber Security</h5>
//                         <p className="card-text text-muted">Comprehensive security solutions to protect your digital assets and ensure data integrity across all platforms.</p>
//                         <ul className="list-unstyled text-start text-muted small mt-3">
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Threat Assessment</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Security Audits</li>
//                           <li><i className="bi bi-check-circle-fill text-success me-2"></i> Compliance Management</li>
//                         </ul>
//                         <Link to="/services/cyber-security" className="btn btn-outline-primary btn-sm mt-3">Learn More →</Link>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </Container>
//             </section>
      

//       {/* World Services Section */}
//       <section
//         ref={worldRef}
//         className={`world-services ${worldInView ? 'slide-up-section' : ''}`}
//         id="world"
//       >
//         <Container fluid className="px-0">
//           <h2 className="text-center mb-4">Delivering Services Across the Globe</h2>
//           <div className="map-wrapper">
//             <div className="map-container-custom">
//               <MapContainer
//                 center={[20.0, 0.0]}
//                 zoom={2}
//                 scrollWheelZoom={false}
//                 className="leaflet-map"
//               >
//                 <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>  contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 {offices.map((office, index) => (
//                   <Marker key={index} position={office.position}>
//                     <Popup>{office.name}</Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>

//               <div className={`map-overlay ${isDarkMode ? 'light' : 'light'}`}></div>

//               <div className="operate-overlay">
//                 <h3 className="operate-title">We operate in:</h3>
//                 <div className="country-grid">
//                   <div className="country-item">United States</div>
//                   <div className="country-item">Canada</div>
//                   <div className="country-item">United Kingdom</div>
//                   <div className="country-item">Nigeria</div>
//                   <div className="country-item">Australia</div>
//                   <div className="country-item">India</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </section>
//      {/* Footer */}
//         <footer className={`py-5 ${isDarkMode ? 'bg-dark text-white' : 'bg-dark text-white'}`}>
//           <Container>
//             <Row className="g-4">
//               <Col md={4}>
//                 <h5 className="text-white">TechXplorers</h5>
//                 <p className="text-secondary small">Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.</p>
//                 <div className="d-flex social-icons mt-3">
//                   <a href="#" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
//                   <a href="#" className="text-secondary me-3"><i className="bi bi-linkedin"></i></a>
//                   <a href="#" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
//                   <a href="#" className="text-secondary"><i className="bi bi-envelope"></i></a>
//                 </div>
//               </Col>
//               <Col md={2}>
//                 <h5 className="text-white">Services</h5>
//                 <ul className="list-unstyled text-secondary small">
//                   <li><a href="#" className="text-decoration-none text-secondary">Web Analytics</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Project Planning</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Tech Support</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Job Services</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Consulting</a></li>
//                 </ul>
//               </Col>
//               <Col md={2}>
//                 <h5 className="text-white">Company</h5>
//                 <ul className="list-unstyled text-secondary small">
//                   <li><a href="#" className="text-decoration-none text-secondary">About Us</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Careers</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Blog</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">News</a></li>
//                   <li><a href="#" className="text-decoration-none text-secondary">Partners</a></li>
//                 </ul>
//               </Col>
//               <Col md={4}>
//                 <h5 className="text-white">Contact</h5>
//                 <p className="text-secondary small">123 Tech Street, Innovation District<br />San Francisco, CA 94105</p>
//                 <p className="text-secondary small">Email: contact@techxplorers.com<br />Phone: +1 (555) 123-4567</p>
//               </Col>
//             </Row>
//             <hr className="my-4" />
//             <div className="d-flex justify-content-between align-items-center flex-wrap">
//               <p className="text-secondary small mb-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
//               <div className="text-secondary small">
//                 <a href="#" className="text-decoration-none text-secondary me-3">Privacy Policy</a>
//                 <a href="#" className="text-decoration-none text-secondary me-3">Terms of Service</a>
//                 <a href="#" className="text-decoration-none text-secondary">Cookie Policy</a>
//               </div>
//             </div>
//           </Container>
//         </footer>
//     </div>
//   );
// };

// export default LandingPage;










// import React, { useState } from 'react';
// import { Container, Row, Col, Carousel } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import CustomNavbar from './Navbar';
// import '../styles/LandingPage.css';
// import { useTheme } from '../context/ThemeContext';
// import { useAuth } from '../components/AuthContext';

// // It's better to manage icons in a separate file, but for this example, we'll define them here.
// const StarIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
// );

// const UsersIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
// );

// const ClockIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
// );

// const CheckCircleIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
// );

// // Import images
// import Image1 from '../assets/MobileDev.png';
// import Image2 from '../assets/WebDev.png';
// import Image3 from '../assets/DigiMark.png';
// import Image4 from '../assets/JobApply.png';
// import Image5 from '../assets/ItTalentSupply.png';
// import Image6 from '../assets/CyberSecurity.png';

// import { useInView } from 'react-intersection-observer';


// const LandingPage = () => {
//      const { isLoggedIn } = useAuth(); // Get authentication status
//      const navigate = useNavigate();
   
//      const offices = [
//        { name: 'USA', position: [40.7128, -74.006] },
//        { name: 'Canada', position: [43.6532, -79.3832] },
//        { name: 'UK', position: [51.505, -0.09] },
//        { name: 'Nigeria', position: [6.5244, 3.3792] },
//        { name: 'Australia', position: [-33.8688, 151.2093] },
//        { name: 'India', position: [14.666386222572966, 77.59006709376247] },
//      ];
   
//      const carouselItems = [
//        { id: 1, image: Image1, alt: "TechXplorers Service 1", text: "Mobile App Development", path: "/services/mobile-app-development", service: "Mobile Development" },
//        { id: 2, image: Image2, alt: "TechXplorers Service 2", text: "Web Application Development", path: "/services/web-app-development", service: "Web Development" },
//        { id: 3, image: Image3, alt: "TechXplorers Service 3", text: "Digital Marketing", path: "/services/digital-marketing", service: "Digital Marketing" },
//        { id: 4, image: Image4, alt: "Job Support Profile", text: "Job Support", path: "/services/job-support", isJobSupport: true },
//        { id: 5, image: Image5, alt: "TechXplorers Service 5", text: "IT Talent Supply", path: "/services/it-talent-supply", service: "IT Talent Supply" },
//        { id: 6, image: Image6, alt: "TechXplorers Service 6", text: "Cyber Security", path: "/services/cyber-security", service: "Cyber Security" }
//      ];

//     // Data for the services section, adapted from your original carouselItems
//     const servicesData = [
//         {
//             title: "Mobile Application Development",
//             image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Craft modern and user-friendly mobile applications that work seamlessly.",
//             features: ["iOS & Android Apps", "Cross-Platform Development", "UI/UX Design"],
//             path: "/services/mobile-app-development",
//         },
//         {
//             title: "Web Application Development",
//             image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Build robust, scalable, and secure web applications for your business needs.",
//             features: ["Front-end Development", "Back-end Development", "Database Management"],
//             path: "/services/web-app-development",
//         },
//         {
//             title: "Digital Marketing",
//             image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Enhance your online presence and reach your target audience effectively.",
//             features: ["SEO Optimization", "Social Media Marketing", "Content Strategy"],
//             path: "/services/digital-marketing",
//         },
//         {
//             title: "IT Talent Supply",
//             image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Find the right IT professionals to augment your team and drive projects forward.",
//             features: ["Temporary Staffing", "Permanent Placement", "Skill-based Hiring"],
//             path: "/services/it-talent-supply",
//         },
//         {
//             title: "Job Support & IT Consulting",
//             image: "https://images.unsplash.com/photo-1600880292203-942bb68b2438?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Get expert guidance and support to overcome technical challenges.",
//             features: ["On-demand Support", "Project Guidance", "Technical Consulting"],
//             path: "/services/job-support",
//         },
//         {
//             title: "Cyber Security",
//             image: "https://images.unsplash.com/photo-1550645612-83f5d594b671?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             description: "Protect your digital assets with our advanced cyber security solutions.",
//             features: ["Threat Analysis", "Data Protection", "Security Audits"],
//             path: "/services/cyber-security",
//         },
//     ];

//     return (
//         <>
//             <style>{`
//                 :root {
//                     --primary-color: #6D28D9;
//                     --primary-light: #EDE9FE;
//                     --secondary-color: #1F2937;
//                     --text-color: #4B5563;
//                     --light-gray: #F3F4F6;
//                     --white: #FFFFFF;
//                     --border-color: #E5E7EB;
//                 }

//                 .landing-page-new {
//                     font-family: 'Inter', sans-serif;
//                     background-color: var(--white);
//                     color: var(--text-color);
//                 }
                
//                 .container-new {
//                     max-width: 1200px;
//                     margin: 0 auto;
//                     padding: 0 1.5rem;
//                 }

//                 /* Hero Section */
//                 .hero-section {
//                     padding: 6rem 0;
//                     overflow: hidden;
//                 }

//                 .hero-grid {
//                     display: grid;
//                     grid-template-columns: 1fr 1fr;
//                     align-items: center;
//                     gap: 3rem;
//                 }
                
//                 @media (max-width: 992px) {
//                     .hero-grid {
//                         grid-template-columns: 1fr;
//                         text-align: center;
//                     }
//                     .hero-image-wrapper {
//                        order: -1;
//                        margin-bottom: 2rem;
//                     }
//                 }

//                 .pill-badge {
//                     display: inline-block;
//                     padding: 0.5rem 1rem;
//                     background-color: var(--primary-light);
//                     color: var(--primary-color);
//                     border-radius: 9999px;
//                     font-weight: 500;
//                     font-size: 0.875rem;
//                     margin-bottom: 1rem;
//                 }

//                 .hero-text h1 {
//                     font-size: 3.5rem;
//                     font-weight: 700;
//                     color: var(--secondary-color);
//                     line-height: 1.2;
//                     margin-bottom: 1.5rem;
//                 }

//                 .hero-text p {
//                     font-size: 1.125rem;
//                     line-height: 1.6;
//                     margin-bottom: 2rem;
//                 }

//                 .hero-buttons {
//                     display: flex;
//                     gap: 1rem;
//                     margin-top: 2rem;
//                     margin-bottom: 3rem;
//                 }
                
//                 @media (max-width: 992px) {
//                    .hero-buttons {
//                        justify-content: center;
//                    }
//                 }

//                 .btn-primary-new {
//                     background-color: var(--primary-color);
//                     color: var(--white);
//                     padding: 0.75rem 1.5rem;
//                     border-radius: 0.5rem;
//                     text-decoration: none;
//                     font-weight: 500;
//                     transition: background-color 0.3s;
//                 }
//                 .btn-primary-new:hover {
//                     background-color: #5B21B6;
//                 }

//                 .btn-secondary-new {
//                     background-color: var(--white);
//                     color: var(--text-color);
//                     padding: 0.75rem 1.5rem;
//                     border-radius: 0.5rem;
//                     text-decoration: none;
//                     font-weight: 500;
//                     border: 1px solid var(--border-color);
//                     transition: background-color 0.3s;
//                 }
//                 .btn-secondary-new:hover {
//                     background-color: var(--light-gray);
//                 }

//                 .hero-stats {
//                     display: flex;
//                     gap: 2rem;
//                     align-items: center;
//                 }
//                  @media (max-width: 992px) {
//                    .hero-stats {
//                        justify-content: center;
//                        flex-wrap: wrap;
//                    }
//                 }


//                 .stat-item {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.75rem;
//                 }
//                 .stat-item .icon {
//                     background-color: var(--primary-light);
//                     color: var(--primary-color);
//                     border-radius: 50%;
//                     width: 48px;
//                     height: 48px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                 }
//                 .stat-item .icon svg {
//                     width: 24px;
//                     height: 24px;
//                 }

//                 .stat-item .text strong {
//                     display: block;
//                     font-size: 1.25rem;
//                     font-weight: 600;
//                     color: var(--secondary-color);
//                 }
//                 .stat-item .text span {
//                     font-size: 0.875rem;
//                     color: var(--text-color);
//                 }
                
//                 .hero-image-wrapper {
//                     position: relative;
//                 }
//                 .hero-image {
//                     width: 100%;
//                     border-radius: 1rem;
//                     aspect-ratio: 4 / 3.5;
//                     object-fit: cover;
//                 }
                
//                 /* Services Section */
//                 .services-section-new {
//                     padding: 6rem 0;
//                     background-color: var(--light-gray);
//                 }
//                 .section-header {
//                     text-align: center;
//                     margin-bottom: 4rem;
//                 }
//                 .section-header h2 {
//                     font-size: 2.5rem;
//                     font-weight: 700;
//                     color: var(--secondary-color);
//                     margin-bottom: 1rem;
//                 }
//                 .section-header p {
//                     font-size: 1.125rem;
//                     max-width: 600px;
//                     margin: 0 auto;
//                 }
//                 .services-grid {
//                     display: grid;
//                     grid-template-columns: repeat(3, 1fr);
//                     gap: 2rem;
//                 }
                
//                  @media (max-width: 992px) {
//                     .services-grid {
//                         grid-template-columns: repeat(2, 1fr);
//                     }
//                 }
//                 @media (max-width: 768px) {
//                     .services-grid {
//                         grid-template-columns: 1fr;
//                     }
//                 }

//                 .service-card-new {
//                     background-color: var(--white);
//                     border: 1px solid var(--border-color);
//                     border-radius: 1rem;
//                     padding: 1.5rem;
//                     transition: transform 0.3s, box-shadow 0.3s;
//                     display: flex;
//                     flex-direction: column;
//                 }
//                 .service-card-new:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
//                 }

//                 .service-card-new img {
//                     width: 100%;
//                     height: 200px;
//                     object-fit: cover;
//                     border-radius: 0.75rem;
//                     margin-bottom: 1.5rem;
//                 }
//                 .service-card-new h3 {
//                     font-size: 1.25rem;
//                     font-weight: 600;
//                     color: var(--secondary-color);
//                     margin-bottom: 0.75rem;
//                 }
//                 .service-card-new p {
//                     font-size: 1rem;
//                     margin-bottom: 1rem;
//                     flex-grow: 1;
//                 }
//                 .service-card-new ul {
//                     list-style: none;
//                     padding: 0;
//                     margin-bottom: 1.5rem;
//                 }
//                 .service-card-new ul li {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     margin-bottom: 0.5rem;
//                     color: var(--text-color);
//                 }
//                 .service-card-new ul li svg {
//                     color: var(--primary-color);
//                     flex-shrink: 0;
//                 }
                
//                 .service-card-new .learn-more-link {
//                     color: var(--primary-color);
//                     text-decoration: none;
//                     font-weight: 500;
//                     transition: color 0.3s;
//                 }
//                  .service-card-new .learn-more-link:hover {
//                     color: #5B21B6;
//                 }


//             `}</style>
//             <div className="landing-page-new">
//                 {/* CustomNavbar would go here */}

//                 {/* Hero Section */}
//                 <section className="hero-section">
//                     <div className="container-new">
//                         <div className="hero-grid">
//                             <div className="hero-text">
//                                 <span className="pill-badge">Development Services</span>
//                                 <h1>Mobile Application Development</h1>
//                                 <p>Create powerful, user-friendly mobile applications for iOS and Android platforms with our proven methodology.</p>
                                
//                                 <div className="hero-buttons">
//                                     <Link to="/contact" className="btn-primary-new">Book a consultation</Link>
//                                     <Link to="/services/mobile-app-development" className="btn-secondary-new">Learn More</Link>
//                                 </div>
//                                 <div className="hero-stats">
//                                     <div className="stat-item">
//                                         <div className="icon"><StarIcon /></div>
//                                         <div className="text"><strong>4.9+</strong><span>Client Rating</span></div>
//                                     </div>
//                                     <div className="stat-item">
//                                         <div className="icon"><UsersIcon /></div>
//                                         <div className="text"><strong>200+</strong><span>Happy Clients</span></div>
//                                     </div>
//                                     <div className="stat-item">
//                                         <div className="icon"><ClockIcon /></div>
//                                         <div className="text"><strong>6-12 weeks</strong><span>Avg. Delivery</span></div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="hero-image-wrapper">
//                                 <img 
//                                     src="https://images.unsplash.com/photo-1583339793315-b775185966f3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
//                                     alt="Developer at work" 
//                                     className="hero-image"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Services Section */}
//                 <section className="services-section-new">
//                     <div className="container-new">
//                         <div className="section-header">
//                             <span className="pill-badge">Our Services</span>
//                             <h2>Comprehensive Tech Solutions</h2>
//                             <p>From idea to execution, we provide end-to-end technology services that fuel your growth and help you stay ahead of the curve.</p>
//                         </div>
//                         <div className="services-grid">
//                             {servicesData.map((service, index) => (
//                                 <div key={index} className="service-card-new">
//                                     <img src={service.image} alt={service.title} />
//                                     <h3>{service.title}</h3>
//                                     <p>{service.description}</p>
//                                     <ul>
//                                         {service.features.map((feature, fIndex) => (
//                                             <li key={fIndex}><CheckCircleIcon /> {feature}</li>
//                                         ))}
//                                     </ul>
//                                     <Link to={service.path} className="learn-more-link">Learn More →</Link>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>
                
//                 {/* Note: The "Delivering Services Across The Globe" section from the design
//                     would be added here, similar to the services section structure. */}
//             </div>
//         </>
//     );
// };

// export default LandingPage;
