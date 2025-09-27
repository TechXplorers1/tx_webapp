import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomNavbar from './Navbar';
import '../styles/LandingPage.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthContext'; // Import useAuth
import { database } from '../firebase';
import { ref, onValue } from "firebase/database";


const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const CountriesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const ContinentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);



// Import images
import Image1 from '../assets/MobileDev.png';
import Image2 from '../assets/WebDev.png';
import Image3 from '../assets/DigiMark.png';
import Image4 from '../assets/JobApply.png';
import Image5 from '../assets/ItTalentSupply.png';
import Image6 from '../assets/CyberSecurity.png';

// Service images
import WebAnalyticsImg from '../assets/WebAnalytics&Reporting.png';
import ProjectPlanningImg from '../assets/project_planning.png';
import techSupportImg from '../assets/tech_support.png';

// Scroll animation hook
import { useInView } from 'react-intersection-observer';


const LandingPage = () => {
  const { user, isLoggedIn } = useAuth(); // Get authentication status
  const navigate = useNavigate();
  const [serviceRegistrations, setServiceRegistrations] = useState(null);
  const { isDarkMode } = useTheme(); // Use the theme context

useEffect(() => {
    // Only run this if the user is logged in and we have their Firebase key
    if (isLoggedIn && user?.firebaseKey) {
      // Create a reference to this client's serviceRegistrations in the database
      const clientRegRef = ref(database, `clients/${user.firebaseKey}/serviceRegistrations`);
      
      // Listen for data at that reference
      const unsubscribe = onValue(clientRegRef, (snapshot) => {
        const registrations = snapshot.val();
        setServiceRegistrations(registrations);
        
        // This new log will show you the service data being fetched
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } else {
      // If user logs out, clear the data
      setServiceRegistrations(null);
    }
  }, [isLoggedIn, user]);

  const offices = [
    { name: 'USA', position: [40.7128, -74.006] },
    { name: 'Canada', position: [43.6532, -79.3832] },
    { name: 'Nigeria', position: [6.5244, 3.3792] },
    { name: 'Australia', position: [-33.8688, 151.2093] },
    { name: 'India', position: [14.6663, 77.5900] },
    { name: 'UK', position: [51.5074, -0.1278] },
  ];

  const servicesData = [
    {
      title: "Mobile Application Development",
      description: "Build responsive, scalable mobile applications with modern frameworks and best practices for optimal performance.",
      image: Image1,
      features: ["iOS & Android Apps", "Cross-Platform Development", "UI/UX Design"],
      path: "/services/mobile-app-development",
    },
    {
      title: "Web Application Development",
      description: "Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.",
      image: Image2,
      features: ["Front-end Development", "Back-end Development", "Database Management"],
      path: "/services/web-app-development",
    },
    {
      title: "Digital Marketing",
      description: "Build responsive, scalable digital marketing strategies with modern frameworks and best practices for optimal performance.",
      image: Image3,
      features: ["SEO Optimization", "Social Media Marketing", "Content Strategy"],
      path: "/services/digital-marketing",
    },
    {
      title: "IT Talent Supply",
      description: "Find the right IT professionals to augment your team and drive projects forward with our comprehensive talent supply services.",
      image: Image4,
      features: ["Temporary Staffing", "Permanent Placement", "Skill-based Hiring"],
      path: "/services/it-talent-supply",
    },
    {
      title: "Job Support & IT Consulting",
      description: "Get expert guidance and on-demand support to overcome technical challenges and ensure project success.",
      image: Image5,
      features: ["On-demand Support", "Project Guidance", "Technical Consulting"],
      path: "/services/job-support",
    },
    {
      title: "Cyber Security",
      description: "Protect your digital assets with our advanced cyber security solutions and proactive threat analysis.",
      image: Image6,
      features: ["Threat Analysis", "Data Protection", "Security Audits"],
      path: "/services/cyber-security",
    },
  ];

  const carouselItems = [
    {
      id: 1,
      image: Image1,
      alt: "TechXplorers Service 1",
      text: "Mobile App Development",
      path: "/services/mobile-app-development",
      service: "Mobile Development",
      description: "Build responsive, scalable mobile applications with modern frameworks and best practices for optimal performance.",
      features: ["iOS & Android Apps", "Cross-Platform Development", "UI/UX Design"]
    },
    {
      id: 2,
      image: Image2,
      alt: "TechXplorers Service 2",
      text: "Web Application Development",
      path: "/services/web-app-development",
      service: "Web Development",
      description: "Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.",
      features: ["Front-end Development", "Back-end Development", "Database Management"]
    },
    {
      id: 3,
      image: Image3,
      alt: "TechXplorers Service 3",
      text: "Digital Marketing",
      path: "/services/digital-marketing",
      service: "Digital Marketing",
      description: "Build responsive, scalable digital marketing strategies with modern frameworks and best practices for optimal performance.",
      features: ["SEO Optimization", "Social Media Marketing", "Content Strategy"]
    },
    {
      id: 4,
      image: Image4,
      alt: "Job Support Profile",
      text: "Job Support",
      path: "/services/job-support",
      isJobSupport: true,
      service: "Job Supporting",
      description: "Get expert guidance and on-demand support to overcome technical challenges and ensure project success.",
      features: ["On-demand Support", "Project Guidance", "Technical Consulting"]
    },
    {
      id: 5,
      image: Image5,
      alt: "TechXplorers Service 5",
      text: "IT Talent Supply",
      path: "/services/it-talent-supply",
      service: "IT Talent Supply",
      description: "Find the right IT professionals to augment your team and drive projects forward with our comprehensive talent supply services.",
      features: ["Temporary Staffing", "Permanent Placement", "Skill-based Hiring"]
    },
    {
      id: 6,
      image: Image6,
      alt: "TechXplorers Service 6",
      text: "Cyber Security",
      path: "/services/cyber-security",
      service: "Cyber Security",
      description: "Protect your digital assets with our advanced cyber security solutions and proactive threat analysis.",
      features: ["Threat Analysis", "Data Protection", "Security Audits"]
    }
  ];

  const [carouselRef, carouselInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [worldRef, worldInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const handleBookServiceClick = (item) => {
    if (isLoggedIn) {
      // User is logged in, proceed to the form
      if (item.isJobSupport) {
        navigate("/services/job-contact-form");
      } else {
        navigate('/services/servicesForm', { state: { service: item.service } });
      }
    } else {
      // User is not logged in, redirect to the login page
      // You can also pass the intended destination to redirect back after login
      navigate('/login', { state: { from: window.location.pathname } });
    }
  };

  // In LandingPage.jsx, replace the existing useMemo hook
  const activeServices = useMemo(() => {
    // Now we check our new state variable
    if (!serviceRegistrations) {
      return [];
    }
    const services = Object.values(serviceRegistrations).map(reg =>
      (reg.service || '').trim().toLowerCase()
    );
    return services;
  }, [serviceRegistrations]);

  return (
    <>
      <style>{`
                :root {
                    /* Light Mode */
                    --primary-color: #6D28D9;
                    --primary-light: #EDE9FE;
                    --secondary-color: #1F2937;
                    --text-color: #4B5563;
                    --light-gray: #F9FAFB;
                    --white: #FFFFFF;
                    --border-color: #E5E7EB;
                }

                .dark-mode-active {
                    /* Dark Mode Overrides */
                    --primary-light: #4c1d95; /* Darker primary light */
                    --secondary-color: #F9FAFB; /* White text */
                    --text-color: #D1D5DB; /* Light gray text */
                    --light-gray: #1F2937; /* Dark background for sections */
                    --white: #111827; /* Very dark background */
                    --border-color: #374151; /* Darker border */
                }

                .landing-page-modern {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--white);
                    color: var(--text-color);
                    overflow-x: hidden;
                    transition: background-color 0.3s, color 0.3s; /* Smooth transition */
                }

                /* New Hero Carousel Section */
                .hero-carousel-section {
                    background: radial-gradient(circle at top left, rgba(237, 233, 254, 0.4), transparent 40%),
                                radial-gradient(circle at bottom right, rgba(237, 233, 254, 0.4), transparent 50%);
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    margin-top:70px;
                }
                
                .dark-mode-active .hero-carousel-section {
                     /* Dark Mode Hero Background */
                    background: radial-gradient(circle at top left, rgba(76, 29, 149, 0.4), transparent 40%),
                                radial-gradient(circle at bottom right, rgba(76, 29, 149, 0.4), transparent 50%);
                }


                .hero-carousel-section .carousel,
                .hero-carousel-section .carousel-inner,
                .hero-carousel-section .carousel-item {
                    height: 100%;
                }

                .carousel-slide-content {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                }
                
                .hero-carousel-text h1 {
                    font-size: 3.2rem;
                    font-weight: 800;
                    color: var(--secondary-color);
                    line-height: 1.2;
                    margin-bottom: 1.5rem;
                }
                .hero-carousel-text h1 span {
                    color: var(--primary-color);
                }

                .hero-carousel-text p {
                    font-size: 1.125rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    max-width: 500px;
                    color: var(--text-color); /* Ensure paragraph text uses text color */
                }
                
                .feature-pills {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }

                .feature-pills span {
                    background-color: var(--white);
                    border: 1px solid var(--border-color);
                    padding: 0.3rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-color); /* Ensure text in pills is readable */
                }
                
                .hero-carousel-buttons {
                margin-left:190px;
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .hero-carousel-image-wrapper {
                   position: relative;
                }
                
                .hero-carousel-image {
                    width: 80%;
                    height:70%;
                    border-radius: 1.5rem;
                    aspect-ratio: 1/1;
                    object-fit: cover;
                }

                .hero-carousel-section .carousel-indicators {
            /* Move the indicators below the carousel frame */
            bottom: -1.5rem; 
        }

        .hero-carousel-section .carousel-indicators [data-bs-target] {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #D1C4E9; /* Lighter purple for inactive dots */
            border: none;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .hero-carousel-section .carousel-indicators .active {
            background-color: var(--primary-color); /* Use your primary purple for the active dot */
            opacity: 1;
        }

                .code-snippet-overlay {
                    position: absolute;
                    top: 2rem;
                    left: -2rem;
                    background-color: rgba(29, 39, 55, 0.8);
                    color: #A5B4FC;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.8rem;
                    backdrop-filter: blur(4px);
                    max-width: 250px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                 .carousel-indicators [data-bs-target] {
                    background-color: var(--primary-color);
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }


                /* Services Section */
                .services-section-modern {
                    padding: 6rem 0;
                    background-color: var(--light-gray);
                }
                
                .dark-mode-active .services-section-modern {
                    background-color: var(--light-gray); /* Already defined as dark background in dark mode */
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .section-header h2 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--secondary-color);
                    margin-bottom: 1rem;
                }

                .section-header p {
                    font-size: 1.125rem;
                    max-width: 600px;
                    margin: 0 auto;
                    color: var(--text-color); /* Ensure paragraph text uses text color */
                }

                .service-card-modern {
                    background-color: var(--white);
                    border: 1px solid var(--border-color);
                    border-radius: 1rem;
                    transition: transform 0.3s, box-shadow 0.3s;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .service-card-modern:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                }

                .dark-mode-active .service-card-modern:hover {
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2);
                }
                
                .service-card-img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                }

                .service-card-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .service-card-body h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--secondary-color);
                    margin-bottom: 1rem;
                }

                .service-features {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }
                .service-features li {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-color);
                }
                .service-features li svg {
                    color: var(--primary-color);
                    flex-shrink: 0;
                }

                .learn-more-link {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.3s;
                    margin-top: auto;
                }
                .learn-more-link:hover {
                    color: #5B21B6;
                }

                  /* Global Stats Section */
                .global-stats-section {
                    padding: 6rem 0;
                    background-color: var(--light-gray);
                    background-image: radial-gradient(circle at 10% 20%, rgba(237, 233, 254, 0.5), transparent 40%),
                                      radial-gradient(circle at 80% 90%, rgba(237, 233, 254, 0.5), transparent 50%);
                }
                
                .dark-mode-active .global-stats-section {
                    background-image: radial-gradient(circle at 10% 20%, rgba(76, 29, 149, 0.5), transparent 40%),
                                      radial-gradient(circle at 80% 90%, rgba(76, 29, 149, 0.5), transparent 50%);
                }

                .stat-card {
                    text-align: center;
                    background-color: var(--white);
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    transition: transform 0.3s, box-shadow 0.3s;
                    height: 100%;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                }

                .dark-mode-active .stat-card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2);
                }

                .stat-icon-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background-color: var(--primary-light);
                    color: var(--primary-color);
                    margin-bottom: 1.5rem;
                }

                .stat-icon-wrapper svg {
                    width: 32px;
                    height: 32px;
                }

                .stat-card h3 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: var(--secondary-color);
                    margin-bottom: 0.5rem;
                }

                .stat-card p {
                    font-size: 1rem;
                    color: var(--text-color);
                    margin-bottom: 0;
                }

                /* World Services Section */
                .world-services-modern {
                    padding: 6rem 0;
                }

                .map-container-modern {
                    position: relative;
                    height: 500px;
                    border-radius: 1rem;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .map-img-modern {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .operate-overlay {
                    position: absolute;
                    top: 120px;
                    left: 20px;
                    width: 200px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 8px;
                    z-index: 10;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                }

                .dark-mode-active .operate-overlay {
                    background: rgba(30, 41, 59, 0.95); /* Dark background with transparency */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                }
                
                .operate-overlay h3 {
                     color: var(--secondary-color); /* Ensure title is visible */
                }

                .country-item {
                    padding: 8px 12px;
                    background-color: #f1f1f1;
                    border-radius: 5px;
                    text-align: center;
                    font-weight: 500;
                }
                
                .dark-mode-active .country-item {
                    background-color: #4a5568; /* Darker background for items */
                    color: #e2e8f0; /* Light text for items */
                }
                
                .pill-badge {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: var(--primary-light);
                    color: var(--primary-color);
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                }

                .btn-modern {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s;
                    border: 1px solid transparent;
                }

                .btn-primary-modern {
                    background-color: var(--primary-color);
                    color: var(--white);
                }
                .btn-primary-modern:hover {
                    background-color: #5B21B6;
                    color: var(--white);
                }
                
                .btn-secondary-modern {
                    background-color: var(--white);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                }
                .btn-secondary-modern:hover {
                    background-color: var(--light-gray);
                }

                .hero-stats {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .stat-item .icon {
                    color: #f59e0b; /* yellow for star */
                }

                .stat-item .text strong {
                    display: block;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--secondary-color);
                }
                .stat-item .text span {
                    font-size: 0.875rem;
                    color: var(--text-color);
                }

                /* Footer */
                .footer-modern {
                    text-align: center;
                    padding: 2rem 0;
                    background-color: var(--secondary-color);
                    color: var(--light-gray);
                }
                .footer-modern a {
                    color: var(--white);
                    text-decoration: none;
                    margin: 0 1rem;
                    transition: color 0.3s;
                }
                .footer-modern a:hover {
                    color: var(--primary-light);
                }

                /* --- General Dark Mode Overrides (for existing small styles) --- */
                .dark-mode-active body { background-color: var(--white); color: var(--text-color); }
                .dark-mode-active .section-title, .dark-mode-active .section-header h2 { color: var(--secondary-color); }
                .dark-mode-active .section-subtitle { color: var(--text-color); }

                /* Map Overlay adjustment for Dark Mode */
                .map-overlay.light {
                    background-color: rgba(0, 0, 0, 0.4); 
                }
                .dark-mode-active .map-overlay.light {
                    /* Change overlay to a lighter color for better contrast with dark map tiles (if using dark tiles) 
                       Keeping it dark for now as the tile layer is OSM default (light) */
                     background-color: rgba(0, 0, 0, 0.6);
                }

                /* Fallback for the old map overlay class if still in use */
                .map-overlay.dark {
                     background-color: rgba(255, 255, 255, 0.3); /* Light overlay for dark mode */
                }
                
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* Animation for the Active Carousel Slide Content */
                .carousel-item.active .hero-carousel-text > * {
                    /* Apply slide-up animation to all direct children of hero-carousel-text */
                    animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; /* Ease-in-out curve */
                }

                /* Stagger the animation timing for text elements */
                .carousel-item.active .pill-badge {
                    animation-delay: 0.1s;
                }
                .carousel-item.active h1 {
                    animation-delay: 0.2s;
                }
                .carousel-item.active p {
                    animation-delay: 0.3s;
                }
                .carousel-item.active .feature-pills {
                    animation-delay: 0.4s;
                }
                .carousel-item.active .hero-carousel-buttons {
                    animation-delay: 0.5s;
                }
                .carousel-item.active .hero-stats {
                    animation-delay: 0.6s;
                }

                /* Animation for the Image Wrapper */
                .carousel-item.active .hero-carousel-image-wrapper {
                    animation: zoomIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
                }

                /* Responsive Styles */
                @media (max-width: 991px) {
                    .carousel-slide-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    .hero-carousel-text {
                        margin-bottom: 3rem;
                    }
                    .hero-carousel-buttons, .feature-pills, .hero-stats {
                        justify-content: center;
                    }
                    .hero-carousel-image-wrapper {
                        order: -1;
                    }
                    .code-snippet-overlay {
                        left: 50%;
                        transform: translateX(-50%);
                        top: -1rem;
                    }
                }
            `}</style>
      <div className={`landing-page-modern ${isDarkMode ? 'dark-mode-active' : ''}`}>
         <CustomNavbar />
        {/* Hero Section */}
        <section className="hero-carousel-section">
          <Container>
            <Carousel indicators={true} interval={3000}>
              {carouselItems.map((item) => (
                <Carousel.Item key={item.id}>
                  <div className="carousel-slide-content">
                    <Row className="align-items-center w-100">
                      <Col lg={6} className="hero-carousel-text">
                        <div className="pill-badge">TechXplorers Services</div>
                        <h1>{item.text.split(' ').slice(0, -1).join(' ')} <span>{item.text.split(' ').slice(-1).join(' ')}</span></h1>
                        <p>{item.description}</p>
                        <div className="feature-pills">
                          {item.features.map((feature, fIndex) => (
                            <span key={fIndex}>{feature}</span>
                          ))}
                        </div>
                    <div className="hero-carousel-buttons">
                          {(() => {
                            // Standardize the service name from the carousel item for a reliable comparison
                            const serviceToCheck = item.isJobSupport 
                              ? 'job supporting' 
                              : (item.service || '').trim().toLowerCase();

                            // DEBUG: Check what service name is being compared on each slide

                            const isServiceActive = activeServices.includes(serviceToCheck);

                            if (isServiceActive) {
                              // If the service is active, show "Your Dashboard"
                              return (
                                <Link to="/clientdashboard" className="btn-modern btn-primary-modern">
                                  Your Dashboard
                                </Link>
                              );
                            } else {
                              // Otherwise, show "Book a Service"
                              return (
                                <div onClick={() => handleBookServiceClick(item)} className="btn-modern btn-primary-modern" style={{ cursor: 'pointer' }}>
                                  Book a Service
                                </div>
                              );
                            }
                          })()}
                          <Link to={item.path} className="btn-modern btn-secondary-modern">Learn More</Link>
                        </div>
                        <div className="hero-stats">
                          <div className="stat-item"><div className="icon"><StarIcon /></div><div className="text"><strong>4.8+</strong><span>Client Rating</span></div></div>
                          <div className="stat-item"><div className="icon"><UsersIcon /></div><div className="text"><strong>450+</strong><span>Projects Done</span></div></div>
                          <div className="stat-item"><div className="icon"><ClockIcon /></div><div className="text"><strong>4-10 weeks</strong><span>Avg Timeline</span></div></div>
                        </div>
                      </Col>
                      <Col lg={6} className="hero-carousel-image-wrapper d-none d-lg-block">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="hero-carousel-image"
                        />
                        {/* <div className="active-now-floater">
                                            <span className="active-dot"></span> Active Now
                                            <div className="floater-subtext">{servicesData.clientCount} satisfied clients</div>
                                        </div> */}
                        {/* <div className="code-snippet-overlay">
                          <code>
                            &lt;service name="{item.text}"&gt; <br />
                            &nbsp;&nbsp;&lt;status&gt;active&lt;/status&gt; <br />
                            &nbsp;&nbsp;&lt;clients&gt;450+ satisfied&lt;/clients&gt; <br />
                            &lt;/service&gt;
                          </code>
                        </div> */}
                      </Col>
                    </Row>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </section>

        {/* Services Section */}
        <section className="services-section-modern">
          <Container>
            <div className="section-header">
              <span className="pill-badge">Our Services</span>
              <h2>Comprehensive Tech Solutions</h2>
              <p>From idea to execution, we provide end-to-end technology services that fuel your growth and help you stay ahead of the curve.</p>
            </div>
            <Row className="gy-4">
              {servicesData.map((service, index) => (
                <Col lg={4} md={6} key={index}>
                  <div className="service-card-modern">
                    <img src={service.image} alt={service.title} className="service-card-img" />
                    <div className="service-card-body">
                      <h3>{service.title}</h3>
                      <ul className="service-features">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex}><CheckCircleIcon /> {feature}</li>
                        ))}
                      </ul>
                      <Link to={service.path} className="learn-more-link">Learn More →</Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="global-stats-section">
                    <Container>
                        <div className="section-header">
                            <span className="pill-badge">Global Reach</span>
                            <h2>Delivering Services Across The Globe</h2>
                            <p>With a worldwide presence and 24/7 support, we provide consistent, high-quality services to clients across all continents.</p>
                        </div>
                        <Row className="justify-content-center gy-4">
                            <Col md={3} sm={6}>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper">
                                        <UsersIcon />
                                    </div>
                                    <h3>1,900+</h3>
                                    <p>Global Clients</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper">
                                        <CountriesIcon />
                                    </div>
                                    <h3>50+</h3>
                                    <p>Countries</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper">
                                        <ClockIcon />
                                    </div>
                                    <h3>24/7</h3>
                                    <p>Support</p>
                                </div>
                            </Col>
                            <Col md={3} sm={6}>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper">
                                        <ContinentsIcon />
                                    </div>
                                    <h3>6</h3>
                                    <p>Continents</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

        {/* World Services Section */}
        <section
          ref={worldRef}
          className={`world-services ${worldInView ? 'slide-up-section' : ''}`}
          id="world"
        >
          <Container fluid className="px-0">
            <div className="map-wrapper">
              <div className="map-container-custom">
                <MapContainer
                  center={[20.0, 0.0]}
                  zoom={2}
                  scrollWheelZoom={false}
                  className="leaflet-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>  contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {offices.map((office, index) => (
                    <Marker key={index} position={office.position}>
                      <Popup>{office.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>

                <div className={`map-overlay ${isDarkMode ? 'light' : 'light'}`}></div>

                <div className="operate-overlay">
                  <h3 className="operate-title">We operate in:</h3>
                  <div className="country-grid">
                    <div className="country-item">United States</div>
                    <div className="country-item">Canada</div>
                    <div className="country-item">United Kingdom</div>
                    <div className="country-item">Nigeria</div>
                    <div className="country-item">Australia</div>
                    <div className="country-item">India</div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* Footer */}
        <footer className={`py-5 ${isDarkMode ? 'bg-dark text-white' : 'bg-dark text-white'}`}>
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <h5 className="text-white">TechXplorers</h5>
                <p className="text-secondary small">Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.</p>
                <div className="d-flex social-icons mt-3">
                  <a href="#" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-secondary"><i className="bi bi-envelope"></i></a>
                </div>
              </Col>
              <Col md={2}>
                <h5 className="text-white">Services</h5>
                <ul className="list-unstyled text-secondary small">
                  <li><a href="#" className="text-decoration-none text-secondary">Web Analytics</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Project Planning</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Tech Support</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Job Services</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Consulting</a></li>
                </ul>
              </Col>
              <Col md={2}>
                <h5 className="text-white">Company</h5>
                <ul className="list-unstyled text-secondary small">
                  <li><a href="#" className="text-decoration-none text-secondary">About Us</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Careers</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Blog</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">News</a></li>
                  <li><a href="#" className="text-decoration-none text-secondary">Partners</a></li>
                </ul>
              </Col>
              <Col md={4}>
                <h5 className="text-white">Contact</h5>
                <p className="text-secondary small">123 Tech Street, Innovation District<br />San Francisco, CA 94105</p>
                <p className="text-secondary small">Email: contact@techxplorers.com<br />Phone: +1 (555) 123-4567</p>
              </Col>
            </Row>
            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="text-secondary small mb-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
              <div className="text-secondary small">
                <a href="#" className="text-decoration-none text-secondary me-3">Privacy Policy</a>
                <a href="#" className="text-decoration-none text-secondary me-3">Terms of Service</a>
                <a href="#" className="text-decoration-none text-secondary">Cookie Policy</a>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;