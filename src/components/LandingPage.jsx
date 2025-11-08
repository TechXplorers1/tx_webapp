import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// Import useMap from react-leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import CustomNavbar from './Navbar';
import '../styles/LandingPage.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../components/AuthContext'; // Import useAuth
import { database } from '../firebase';
import {
  ref,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  get,
  query,
  orderByChild,
  equalTo,
  off,
} from "firebase/database";
import { useInView } from 'react-intersection-observer'; // Ensure this is imported
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// === Leaflet Icon Fix (Kept from previous correction) ===
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow,
});
// ========================================================

// --- Icon Components (omitted for brevity) ---
// ... (Icon Components remain the same) ...
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

// --- NEW COMPONENT FOR MAP REFRESH ---
// This component must be a child of MapContainer to use useMap()
const MapRefresher = ({ worldInView }) => {
    const map = useMap();

    useEffect(() => {
        // If the section comes into view, the map container is visible.
        if (worldInView) {
            // Invalidate size forces Leaflet to re-check the container's dimensions
            // and redraw all elements (tiles, markers) correctly.
            map.invalidateSize();
        }
    }, [worldInView, map]);

    return null; // This component doesn't render anything itself
};
// -------------------------------------


const LandingPage = () => {
  const { user, isLoggedIn } = useAuth(); // Get authentication status
  const navigate = useNavigate();
  const [serviceRegistrations, setServiceRegistrations] = useState(null);
  const { isDarkMode } = useTheme(); // Use the theme context

  // --- Animation Hooks ---
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [globalStatsRef, globalStatsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [worldRef, worldInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [footerRef, footerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  // Note: carouselRef removed as carousel animation is handled by CSS on active slide

  useEffect(() => {
    if (!isLoggedIn || !user?.firebaseKey) {
      setServiceRegistrations(null);
      return;
    }

    const clientRegRef = ref(database, `clients/${user.firebaseKey}/serviceRegistrations`);

    // Optional: use child listeners if you expect frequent small updates
    const handleAdd = onChildAdded(clientRegRef, (snapshot) => {
      setServiceRegistrations(prev => ({
        ...(prev || {}),
        [snapshot.key]: snapshot.val(),
      }));
    });

    const handleChange = onChildChanged(clientRegRef, (snapshot) => {
      setServiceRegistrations(prev => ({
        ...(prev || {}),
        [snapshot.key]: snapshot.val(),
      }));
    });

    const handleRemove = onChildRemoved(clientRegRef, (snapshot) => {
      setServiceRegistrations(prev => {
        const updated = { ...(prev || {}) };
        delete updated[snapshot.key];
        return updated;
      });
    });

    // Cleanup
    return () => {
      off(clientRegRef); // remove all three listeners
    };
  }, [isLoggedIn, user?.firebaseKey]);

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
      image: "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1ODA5MTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Front-end Development", "Back-end Development", "Database Management"],
      path: "/services/web-app-development",
    },
    {
      title: "Digital Marketing",
      description: "Build responsive, scalable digital marketing strategies with modern frameworks and best practices for optimal performance.",
      image: "https://images.unsplash.com/photo-1599658880436-c61792e70672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc1ODA2NzMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["SEO Optimization", "Social Media Marketing", "Content Strategy"],
      path: "/services/digital-marketing",
    },
    {
      title: "IT Talent Supply",
      description: "Find the right IT professionals to augment your team and drive projects forward with our comprehensive talent supply services.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJVCUyMHRlYW0lMjBuZXR3b3JrfGVufDF8fHx8MTc1ODA5MTk2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Temporary Staffing", "Permanent Placement", "Skill-based Hiring"],
      path: "/services/it-talent-supply",
    },
    {
      title: "Job Support & IT Consulting",
      description: "Get expert guidance and on-demand support to overcome technical challenges and ensure project success.",
      image: "https://images.unsplash.com/photo-1653212883731-4d5bc66e0181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmclMjBzdXBwb3J0fGVufDF8fHx8MTc1ODA5MTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["On-demand Support", "Project Guidance", "Technical Consulting"],
      path: "/services/job-support",
    },
    {
      title: "Cyber Security",
      description: "Protect your digital assets with our advanced cyber security solutions and proactive threat analysis.",
      image: "https://images.unsplash.com/photo-1606606767399-01e271823a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgwNzAzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Threat Analysis", "Data Protection", "Security Audits"],
      path: "/services/cyber-security",
    },
  ];

  const carouselItems = [
    {
      id: 1,
      image: Image1,
      alt: "Mobile Application Development",
      text: "Mobile Application Development",
      path: "/services/mobile-app-development",
      service: "Mobile Development",
      description: "Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.",
      features: ["iOS & Android Apps", "Cross-Platform Solutions", "UI/UX Design"],
      stats: { rating: "4.9", projects: "300+", timeline: "6-12 weeks" }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc1ODA5MTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Web Application Development",
      text: "Web Application Development",
      path: "/services/web-app-development",
      service: "Web Development",
      description: "Build responsive, scalable web applications with modern frameworks and best practices for optimal performance.",
      features: ["Full-Stack Development", "Modern Frameworks", "Cloud Integration"],
      stats: { rating: "4.8", projects: "450+", timeline: "4-10 weeks" }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1599658880436-c61792e70672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc1ODA2NzMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Digital Marketing",
      text: "Digital Marketing",
      path: "/services/digital-marketing",
      service: "Digital Marketing",
      description: "Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement.",
      features: ["SEO Optimization", "Social Media Marketing", "Analytics & Reporting"],
      stats: { rating: "4.7", projects: "600+", timeline: "2-6 weeks" }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJVCUyMHRlYW0lMjBuZXR3b3JrfGVufDF8fHx8MTc1ODA5MTk2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "IT Talent Supply",
      text: "IT Talent Supply",
      path: "/services/it-talent-supply",
      service: "IT Talent Supply",
      description: "Connect with top-tier IT professionals and build exceptional teams to drive your technology initiatives forward.",
      features: ["Skilled Professionals", "Flexible Staffing", "Team Augmentation"],
      stats: { rating: "4.9", projects: "200+", timeline: "1-3 weeks" }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1653212883731-4d5bc66e0181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmclMjBzdXBwb3J0fGVufDF8fHx8MTc1ODA5MTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Job Support & IT Consulting",
      text: "Job Support & IT Consulting",
      path: "/services/job-support",
      isJobSupport: true,
      service: "Job Supporting",
      description: "Expert consulting and job support services to help you navigate complex IT challenges and career growth.",
      features: ["Technical Guidance", "Career Support", "Strategic Consulting"],
      stats: { rating: "4.8", projects: "800+", timeline: "Ongoing" }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1606606767399-01e271823a2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgwNzAzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Cyber Security",
      text: "Cyber Security",
      path: "/services/cyber-security",
      service: "Cyber Security",
      description: "Comprehensive security solutions to protect your digital assets and ensure data integrity across all platforms.",
      features: ["Threat Assessment", "Security Audits", "Compliance Management"],
      stats: { rating: "4.9", projects: "150+", timeline: "3-8 weeks" }
    },
  ];


  
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
                /* ... (Internal CSS Styles including the animation keyframes) ... */
                /* Omitted for brevity, assuming the animation styles are present */
                
                :root {
                    /* Light Mode */
                    --primary-color: #6D28D9; /* Purple */
                    --primary-light: #EDE9FE; /* Light Purple */
                    --secondary-color: #1F2937; /* Dark Gray/Black */
                    --text-color: #4B5563;
                    --light-gray: #F9FAFB;
                    --white: #FFFFFF;
                    --border-color: #E5E7EB;
                    /* --- NEW: Grid Background Color --- */
                    --grid-line-color: rgba(109, 40, 217, 0.1); /* 10% opacity of primary color */
                }

                .dark-mode-active {
                    /* Dark Mode Overrides */
                    --primary-light: #4c1d95; /* Darker primary light */
                    --secondary-color: #F9FAFB; /* White text */
                    --text-color: #D1D5DB; /* Light gray text */
                    --light-gray: #1F2937; /* Dark background for sections */
                    --white: #111827; /* Very dark background */
                    --border-color: #374151; /* Darker border */
                     /* --- NEW: Dark Mode Grid Background Color --- */
                    --grid-line-color: rgba(249, 250, 251, 0.05); /* 5% opacity of light gray */
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
                    position: relative;
  overflow: hidden;
  padding: 60px 0;
  background-color: #f1f1f1ff;

  /* Subtle grid pattern */
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 23px 23px; /* smaller = denser grid */
                }

                .hero-carousel-section::before,
.hero-carousel-section::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
}

.hero-carousel-section::before {
  top: -60px;
  left: -60px;
  background: radial-gradient(circle, rgba(120, 90, 255, 0.25), transparent 70%);
}

.hero-carousel-section::after {
  bottom: -80px;
  right: -80px;
  background: radial-gradient(circle, rgba(0, 180, 255, 0.25), transparent 70%);
}

.hero-content-wrapper {
  position: relative;
  z-index: 1;
}
                
                .dark-mode-active .hero-carousel-section {
                     /* Dark Mode Hero Background */
                    background: 
                        /* 1. Radial Gradients (The spots) */
                        radial-gradient(circle at top left, rgba(76, 29, 149, 0.4), transparent 40%),
                        radial-gradient(circle at bottom right, rgba(28, 11, 19, 0.4), transparent 50%),
                        
                        /* 2. Grid Pattern (Dark Mode) */
                        repeating-conic-gradient(
                            from 0deg, 
                            var(--grid-line-color) 0deg 0.001deg,
                            transparent 0.001deg 90deg
                        ),
                        /* Base color in dark mode */
                        var(--white); 
                    background-size: 50px 50px; 
                    background-position: 0 0, 0 0, 0 0, 0 0; 
                    background-blend-mode: color-dodge, normal, normal, normal;
                }
                /* --- END NEW BACKGROUND --- */


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
                      .description {
                   margin-left:70px;
                }
                
                .feature-pills {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                    margin-left:70px;
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
                margin-left:150px;
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

                  .services-section-modern .service-card-modern .flip-in-item {
    animation: flipIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    /* Set the initial state for the animation */
    opacity: 0;
    transform: rotateY(-90deg) scale(0.8);
    transform-origin: left center;
  }
      .services-section-modern .service-card-modern .flip-in-item.active {
    opacity: 1;
    transform: rotateY(0deg) scale(1);
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
                    .icon-container {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #e0f2fe; /* Light blue background */
  color: #0ea5e9; /* Blue text */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
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
                       transform: translateY(-2px);
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1), 5px -5px 5px 5px rgba(0, 0, 0, 0.23);
  transition: transform 0.2s ease;
                }
  .service-card-modern:hover .service-card-body h3 {
  color: #3b82f6; /* Sky Blue */
}

.service-card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Take up remaining space */
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

                .leaflet-map {
  filter: grayscale(20%) contrast(110%);
  transition: transform 0.4s ease;
}
.leaflet-map:hover {
  transform: scale(1.01);
}

                .learn-more-link {
                    color: #3b82f6; /* Blue color */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s, background-color 0.3s;
  margin-top: auto;
  padding: 5px 16px;
  border: 2px solid #3b82f6; /* Blue border */
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  width: 100%;
                }
                .learn-more-link:hover {
                   background-color: #3b82f6;
  color: #ffffff;
                }

                  /* Global Stats Section */
                .global-stats-section {
                    padding: 6rem 0;
                    background-color: var(--light-gray);
                    background-image: radial-gradient(circle at 10% 20%, rgba(190, 182, 224, 0.5), transparent 40%),
                                      radial-gradient(circle at 80% 90%, rgba(184, 169, 250, 0.5), transparent 50%);
                }
                
                .dark-mode-active .global-stats-section {
                    background-image: radial-gradient(circle at 10% 20%, rgba(76, 29, 149, 0.5), transparent 40%),
                                      radial-gradient(circle at 80% 90%, rgba(76, 29, 149, 0.5), transparent 50%);
                }

                .stat-card {
                    text-align: center;
                    // background-color: var(--light-gray);
                    
                    padding: 2rem;
                    border-radius: 1rem;
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
                    background-color: var(--white);
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

                .country-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 10px;
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
                    border-radius: 1.5rem;
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
                    margin-left:80px;
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

                /* Global Section Animations (used by useInView hooks) */
                /* The section itself fades in quickly */
                .fade-up-section {
                    animation: fadeUp 0.8s ease-out forwards;
                }
                @keyframes fadeUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .slide-up-section {
                    animation: slideUp 1s ease-out forwards;
                }
                @keyframes slideUp {
                    from { transform: translateY(60px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                /* End Global Section Animations */

                /* --- NEW: Staggered Animation for Child Elements --- */
                .fade-in-item {
                    opacity: 0; /* Start invisible */
                    /* Note: The animation itself is applied by the parent section and inline style */
                }

                /* Apply staggered animation to children of Services Section */
                .services-section-modern.fade-up-section .fade-in-item {
                    animation: fadeUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smoother curve */
                    opacity: 0; /* Ensures animation runs every time */
                }

                /* Apply staggered animation to children of Global Stats Section */
                .global-stats-section.fade-up-section .fade-in-item {
                    animation: fadeUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    opacity: 0;
                }
                /* --- END NEW CSS --- */


                /* Responsive Styles */
                @media (max-width: 991px) {
                    .carousel-slide-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    .hero-carousel-text {
                        margin-bottom: 3rem;
                    }
                    .hero-carousel-buttons, .feature-pills, .hero-stats, .description, .hero-stats {
                        justify-content: center;
                        margin-right:60px;
                    }
                     .hero-carousel-buttons {
                       margin-left:60px;
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
                      @keyframes flipIn {
    from {
      opacity: 0;
      transform: rotateY(-90deg) scale(0.8);
      transform-origin: left center;
    }
    to {
      opacity: 1;
      transform: rotateY(0deg) scale(1);
      transform-origin: left center;
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
                        <p className="description">{item.description}</p>
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
                                <Link to="/clientdashboard" className="btn-modern btn-primary-modern" style={{
      marginTop: '15px',
      padding: '10px 15px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      alignSelf: 'flex-start',
    }}>
                                  Your Dashboard
                                </Link>
                              );
                            } else {
                              // Otherwise, show "Book a Service"
                              return (
                                <div onClick={() => handleBookServiceClick(item)} className="btn-modern btn-primary-modern" style={{
      marginTop: '15px',
      padding: '10px 15px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s, color 0.2s',
      alignSelf: 'flex-start',
      // New styles for "Book a Service" button
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', // Blue to Purple gradient
      color: '#ffffff', // White text
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}  >
                                  Book a Service
                                </div>
                              );
                            }
                          })()}
                          <Link to={item.path} className="btn-modern btn-secondary-modern" style={{
    marginTop: '15px',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
    alignSelf: 'flex-start',
    // New styles for "Learn More" button
    background: 'white',
    color: '#6b7280', // Gray text
    border: '1px solid #d1d5db', // Light gray border
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }}>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 12L12 6v12z"></path>
  </svg>
    Learn More</Link>
                        </div>
                        <div className="hero-stats">
                          <div className="stat-item"><div className="icon"><StarIcon /></div><div className="text"><strong>{item.stats.rating}</strong><span>Client Rating</span></div></div>
                          <div className="stat-item"><div className="icon"><UsersIcon /></div><div className="text"><strong>{item.stats.projects}</strong><span>Projects Done</span></div></div>
                          <div className="stat-item"><div className="icon"><ClockIcon /></div><div className="text"><strong>{item.stats.timeline}</strong><span>Avg Timeline</span></div></div>
                        </div>
                      </Col>
                      <Col lg={6} className="hero-carousel-image-wrapper d-none d-lg-block">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="hero-carousel-image"
                        />
                      </Col>
                    </Row>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </section>

        {/* Services Section - ANIMATED with STAGGERED CARDS */}
        <section 
  ref={servicesRef} 
  className={`services-section-modern ${servicesInView ? 'fade-up-section' : ''}`}
  // Initial opacity 0 prevents content from flashing before the animation starts
  style={{ opacity: servicesInView ? 1 : 0 }} 
>
  <Container>
    <div className="section-header">
      <span className="pill-badge">Our Services</span>
      <h2 style={{fontSize:'30px'}}>Comprehensive Tech Solutions</h2>
      <p>From idea to execution, we provide end-to-end technology services that fuel your growth and help you stay ahead of the curve.</p>
    </div>
    <Row className="gy-4">
      {servicesData.map((service, index) => (
        <Col lg={4} md={6} key={index}>
          <div 
            className={`service-card-modern fade-in-item`} // Apply new class
            style={{ 
                // Stagger the cards based on their index
                animationDelay: servicesInView ? `${0.1 + index * 0.1}s` : '0s', 
            }}
          >
            {/* Image */}
            <img src={service.image} alt={service.title} className="service-card-img" />
            {/* Icon Container (Top Left Corner) */}
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            {/* Card Body */}
            <div className="service-card-body">
              <h3>{service.title}</h3>
              <ul className="service-features">
                <p>{service.description}</p>
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

        {/* Global Stats Section - ANIMATED with STAGGERED CARDS */}
        <section 
          ref={globalStatsRef} 
          className={`global-stats-section ${globalStatsInView ? 'fade-up-section' : ''}`}
          // Initial opacity 0 prevents content from flashing before the animation starts
          style={{ opacity: globalStatsInView ? 1 : 0 }}
        >
                    <Container>
                        <div className="section-header">
                            <span className="pill-badge">Global Reach</span>
                            <h2 style={{fontSize:'30px'}}>Delivering Services Across The Globe</h2>
                            <p>With a worldwide presence and 24/7 support, we provide consistent, high-quality services to clients across all continents.</p>
                        </div>
                        <Row className="justify-content-center gy-4">
                            {[
                                { value: '1,900+', text: 'Global Clients', icon: UsersIcon },
                                { value: '50+', text: 'Countries', icon: CountriesIcon },
                                { value: '24/7', text: 'Support', icon: ClockIcon },
                                { value: '6', text: 'Continents', icon: ContinentsIcon },
                            ].map((stat, index) => (
                                <Col md={3} sm={6} key={index} 
                                    className={`fade-in-item`} // Apply new class
                                    style={{
                                        // Stagger the stat cards based on their index
                                        animationDelay: globalStatsInView ? `${0.2 + index * 0.15}s` : '0s',
                                    }}
                                >
                                    <div className="stat-card">
                                        <div className="stat-icon-wrapper">
                                            <stat.icon />
                                        </div>
                                        <h3>{stat.value}</h3>
                                        <p>{stat.text}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

        {/* World Services Section - ANIMATED (using existing ref) */}
        <section
          ref={worldRef}
          className={`world-services-modern ${worldInView ? 'slide-up-section' : ''}`}
          id="world"
          style={{ opacity: worldInView ? 1 : 0 }}
        >
          <Container fluid className="px-0">
            <div className="map-container-modern">
              <MapContainer
                center={[20.0, 0.0]}
                zoom={2}
                scrollWheelZoom={false}
                className="leaflet-map"
              >
                {/* * MapRefresher is essential for correctly rendering the map when the section
                  * animates into view (since the container's size might change during animation).
                  */}
                <MapRefresher worldInView={worldInView} />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  // Using dark tiles as per your current setup
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {offices.map((office, index) => (
                  <Marker key={index} position={office.position}>
                    <Popup>{office.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>

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
          </Container>
        </section>

        {/* Footer - ANIMATED */}
        <footer 
            ref={footerRef}
            className={`py-5 ${isDarkMode ? 'bg-dark text-white' : 'bg-dark text-white'} ${footerInView ? 'fade-up-section' : ''}`}
            style={{ opacity: footerInView ? 1 : 0, transitionDuration: '1s' }}
        >
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <h5 className="text-white">TechXplorers</h5>
                <p className="text-secondary small">Empowering businesses through innovative technology solutions. We deliver excellence in web analytics, project planning, and technical support to help you achieve your digital transformation goals.</p>
                <div className="d-flex social-icons mt-3">
                  <a href="#" className="text-secondary me-3"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-secondary me-3"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-secondary"><i className="bi bi-youtube"></i></a>
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
                <p className="text-secondary small">2034 Masaka close Wuse zone 7 FCT Abuja</p>
                <p className="text-secondary small">Email: contact@techxplorers.com<br />Phone: +2348188560032 <br/><br/></p>
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