import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import CustomNavbar from './Navbar';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer'; 
import { database } from '../firebase'; 
import { ref, get, query, limitToLast } from "firebase/database";

// --- IndexedDB Helper (Optimized Storage) ---
const IDB_CONFIG = { name: 'AppCacheDB', version: 1, store: 'firebase_cache' };

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.version);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_CONFIG.store)) {
        db.createObjectStore(IDB_CONFIG.store);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbGet = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readonly');
    const request = transaction.objectStore(IDB_CONFIG.store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbSet = async (key, val) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readwrite');
    const request = transaction.objectStore(IDB_CONFIG.store).put(val, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
// -----------------------------------------------------------

const Projects = () => {
  const { isDarkMode } = useTheme(); 
  const [filter, setFilter] = useState('All');
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- OPTIMIZED LOAD LOGIC ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      
      // 1. Check IndexedDB Cache First (Better than sessionStorage for large JSON)
      const cached = await dbGet('projectsCache');
      
      if (cached) {
        const { data, timestamp } = cached;
        // Cache valid for 60 minutes
        const isFresh = (new Date().getTime() - timestamp) < (60 * 60 * 1000); 
        
        if (isFresh && Array.isArray(data) && data.length > 0) {
          setProjectsData(data);
          setLoading(false);
          console.log("Loaded projects from IndexedDB cache");
          return; 
        }
      }

      // 2. If no cache, hit Firebase
      try {
        const projectsRef = query(ref(database, "projects"), limitToLast(50));
        const snapshot = await get(projectsRef);

        if (!snapshot.exists()) {
          setProjectsData([]);
          await dbSet('projectsCache', { data: [], timestamp: new Date().getTime() });
          return;
        }

        const data = snapshot.val() || {};
        const projectList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const sortedProjects = projectList.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });

        setProjectsData(sortedProjects);
        // Save to cache for next time
        await dbSet('projectsCache', { 
            data: sortedProjects, 
            timestamp: new Date().getTime() 
        });
        console.log("Loaded projects from Firebase and cached them");

      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  // Extract unique categories
  const categories = ['All', ...new Set(projectsData.map((item) => item.category))];

  // Filter logic
  const filteredProjects =
    filter === 'All'
      ? projectsData
      : projectsData.filter((project) => project.category === filter);

  // --- Styles ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

    :root {
      --light-bg: #f8f9fa;
      --light-surface: #ffffff;
      --light-text-primary: #212529;
      --light-text-secondary: #6c757d;
      --light-border: #e9ecef;
      --shadow-light: 0 10px 30px rgba(0, 0, 0, 0.07);
      --shadow-hover-light: 0 15px 40px rgba(0, 0, 0, 0.1);

      --dark-bg: #121212;
      --dark-surface: #1e1e1e;
      --dark-text-primary: #e0e0e0;
      --dark-text-secondary: #a0a0a0;
      --dark-border: #333333;
      --shadow-dark: 0 10px 30px rgba(0, 0, 0, 0.2);
      --shadow-hover-dark: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    /* Main Container Background */
    .projects-container {
      background-color: var(--light-bg);
      font-family: 'Inter', sans-serif;
      transition: background-color 0.3s ease, color 0.3s ease;
      min-height: 100vh;
      padding-top: 80px;
    }
    .projects-container.dark-mode {
      background-color: var(--dark-bg);
      color: var(--dark-text-primary);
    }

    /* Hero Section */
    .hero-section {
      background-color: var(--light-surface);
      padding: 2rem 1rem;
      text-align: center;
      border-bottom: 1px solid var(--light-border);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .dark-mode .hero-section {
      background-color: var(--dark-surface);
      border-bottom-color: var(--dark-border);
    }

    .hero-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--light-text-primary);
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }
    .dark-mode .hero-title {
      color: var(--dark-text-primary);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--light-text-secondary);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.7;
      transition: color 0.3s ease;
    }
    .dark-mode .hero-subtitle {
      color: var(--dark-text-secondary);
    }

    /* Filter Buttons */
    .btn-filter-custom {
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    }

    /* Card Styles */
    .project-card {
      background-color: var(--light-surface);
      border: 1px solid var(--light-border);
      border-radius: 1rem;
      box-shadow: var(--shadow-light);
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .dark-mode .project-card {
      background-color: var(--dark-surface);
      border-color: var(--dark-border);
      box-shadow: var(--shadow-dark);
    }
    .project-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-hover-light);
    }
    .dark-mode .project-card:hover {
      box-shadow: var(--shadow-hover-dark);
    }

    /* Card Typography */
    .project-title {
      color: var(--light-text-primary);
      transition: color 0.3s ease;
    }
    .dark-mode .project-title {
      color: var(--dark-text-primary);
    }

    .project-desc {
      color: var(--light-text-secondary);
      line-height: 1.6;
      transition: color 0.3s ease;
    }
    .dark-mode .project-desc {
      color: var(--dark-text-secondary);
    }

    .project-meta {
      color: var(--light-text-secondary);
      transition: color 0.3s ease;
    }
    .dark-mode .project-meta {
      color: var(--dark-text-secondary);
    }

    .project-divider {
      border-top: 1px solid var(--light-border);
      transition: border-color 0.3s ease;
    }
    .dark-mode .project-divider {
      border-top-color: var(--dark-border);
    }

    /* Call To Action Section */
    .cta-section {
      background-color: var(--light-surface);
      border-top: 1px solid var(--light-border);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.03);
      padding: 3rem 0;
      margin-top: 1.5rem;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .dark-mode .cta-section {
      background-color: var(--dark-surface);
      border-top-color: var(--dark-border);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
    }
    
    /* Adaptive Button Logic */
    .btn-adaptive {
      background-color: #212529; /* Default: Dark Black */
      color: #ffffff !important;
      border: none;
      transition: all 0.3s ease;
    }
    .btn-adaptive:hover {
      background-color: #000000;
      color: #ffffff !important;
    }
    
    .dark-mode .btn-adaptive {
      background-color: #ffffff; /* White Button */
      color: #000000 !important; /* Force Black Text */
    }
    .dark-mode .btn-adaptive:hover {
      background-color: #e2e6ea; /* Light Grey Hover */
      color: #000000 !important;
    }

    .object-fit-cover {
      object-fit: cover;
    }
    
    /* Loading Spinner Styling */
    .loading-spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <div className={`projects-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <CustomNavbar />

        {/* 1. HERO SECTION */}
        <section className="hero-section mb-4">
          <div className="container">
            <h3 className="hero-title">Our Work</h3>
            <p className="hero-subtitle">
              At <strong>TechXplorers</strong>, we deliver digital excellence. 
              Explore our portfolio of successful projects across Web, Mobile, and Security.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="container loading-spinner-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* 2. FILTER BUTTONS */}
            <div className="container mb-5">
              <div className="d-flex justify-content-center flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`btn px-4 rounded-pill btn-filter-custom ${
                      filter === cat 
                        ? (isDarkMode ? 'btn-light' : 'btn-dark')
                        : (isDarkMode ? 'btn-outline-light' : 'btn-outline-secondary')
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. PROJECT GRID */}
            <div className="container pb-5">
              <div className="row g-4">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="col-12 col-md-6 col-lg-4">
                      <div className="project-card">
                        
                        {/* Image Container */}
                        <div className="overflow-hidden position-relative" style={{ height: '220px' }}>
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-100 h-100 object-fit-cover"
                            style={{ transition: 'transform 0.3s' }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                          <span 
                            className={`position-absolute top-0 end-0 px-3 py-1 m-2 rounded-pill small ${isDarkMode ? 'bg-light text-dark' : 'bg-dark text-white'}`}
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            {project.category}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 d-flex flex-column flex-grow-1">
                          <h5 className="fw-bold mb-2 project-title">{project.title}</h5>
                          <p className="small mb-3 flex-grow-1 project-desc">
                            {project.description}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 project-divider">
                            
                            {/* EXTERNAL LINK BUTTON */}
                            <a 
                              href={project.link && project.link !== '#' ? project.link : null} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`btn btn-sm rounded-pill px-3 ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} ${(!project.link || project.link === '#') ? 'disabled' : ''}`} 
                              style={{ fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
                            >
                              View Project
                            </a>

                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">No projects found for this category.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 4. CALL TO ACTION */}
        <div className="cta-section">
          <div className="container text-center">
            <h2 className="hero-title mb-3">Have an Idea? Let's Build It.</h2>
            <p className="hero-subtitle opacity-75 mb-4">
              Join 1,900+ global clients who trust TechXplorers for their digital transformation.
            </p>
            <Link to="/contactus" className="btn btn-lg rounded-pill px-5 fw-bold shadow btn-adaptive" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start Your Project
            </Link>
          </div>
        </div>
        
      </div>
       <Footer />
    </>
  );
};

export default Projects;