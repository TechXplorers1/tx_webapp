import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


// --- Helper Components & Data ---

// Icon components (as simple functional components for clarity)
const SvgIcon = ({ d, className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d={d} />
  </svg>
);

const JobIcon = () => <SvgIcon d="M10 2h4v2h-4V2zM7 5v2h10V5H7zm12 4H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 9H7v-2h10v2zm0-3H7v-2h10v2z" />;
const MobileIcon = () => <SvgIcon d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />;
const WebIcon = () => <SvgIcon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z" />;
const MarketingIcon = () => <SvgIcon d="M4 9h4v11H4zm6-5h4v16h-4zm6 8h4v8h-4z" />;
const TalentIcon = () => <SvgIcon d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z" />;
const SecurityIcon = () => <SvgIcon d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />;
const ChevronLeftIcon = () => <SvgIcon d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />;
const ChevronRightIcon = () => <SvgIcon d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />;
const BellIcon = () => <SvgIcon d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />;
const ArrowRightIcon = () => <SvgIcon d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />;
const CheckIcon = () => <SvgIcon d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />;
const LightningIcon = () => <SvgIcon d="M10 23c-.28 0-.53-.11-.71-.29-.26-.26-.35-.61-.24-.95l2.09-5.96L3.25 10c-.59-1.02-.34-2.31.54-3.07.88-.77 2.14-.85 3.1-.2l8.06 4.71-2.27 6.47c-.23.65.04 1.34.61 1.7.57.36 1.31.33 1.85-.08L21 12.5c.61-.46.77-1.32.41-2.01s-1.06-1.1-1.72-.89l-5.69 1.77L16.75 3c.59-1.02.34-2.31-.54-3.07-.88-.77-2.14-.85-3.1-.2L5 7.5c-.61.46-.77 1.32-.41 2.01s1.06 1.1 1.72.89l5.69-1.77z"/>;
const BackArrowIcon = () => <SvgIcon d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />;
const BriefcaseIcon = () => <SvgIcon d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z" />;
const UsersIcon = () => <SvgIcon d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4-4c1.66 0 3-1.34 3-3S13.66 1 12 1 9 2.34 9 4s1.34 3 3 3zm4 11c-2.49 0-4.5-2.01-4.5-4.5S13.51 9 16 9c2.49 0 4.5 2.01 4.5 4.5S18.49 18 16 18zm-4 0c-2.49 0-4.5-2.01-4.5-4.5S7.51 9 10 9c.43 0 .84.06 1.25.13C10.63 10.36 10.02 11.64 10 13c0 2.49 2.01 4.5 4.5 4.5.36 0 .71-.05 1.05-.14C15.42 17.61 15.01 18 14.5 18z" />;
const ChartIcon = () => <SvgIcon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm-2-8V5h2v4h-2z" />;
const CrosshairIcon = () => <SvgIcon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM15 12h-3v-3h-2v3H9v2h3v3h2v-3h3v-2z" />;

const services = [
  {
    status: 'Active',
    featured: true,
    icon: <JobIcon />,
    title: 'Job Application Dashboard',
    description: 'Track and manage job applications efficiently with comprehensive analytics and progress monitoring.',
    image: "https://media.istockphoto.com/id/475352876/photo/man-applying-for-a-job-on-the-internet.jpg?s=612x612&w=0&k=20&c=SQeciz8vqdGWu_KJoGC7yK8xmpBl69UewPtZSyWSrOI=",
    buttonText: 'Launch Dashboard',
    buttonType: 'primary',
    stats: {
        applied: 5,
        total: 152,
        interviews: 12,
        responseRate: '72%'
    },
    page: 'dashboard'
  },
  {
    icon: <MobileIcon />,
    title: 'Mobile App Development',
    description: 'Build stunning iOS and Android applications with modern development tools and frameworks.',
    image: "https://www.mindinventory.com/blog/wp-content/uploads/2018/12/benefits-of-mobile-app-for-business.webp",
    buttonText: 'Book Now',
    buttonType: 'secondary',
    stats: {
        deployed: 25,
        users: '1M+',
        rating: '4.8',
        uptime: '99.9%'
    },
    statLabels: { applied: 'Apps Deployed', total: 'Active Users', interviews: 'Avg. Rating', responseRate: 'Uptime' }
  },
  {
    icon: <WebIcon />,
    title: 'Web App Development',
    description: 'Create responsive web applications with cutting-edge technologies and best practices.',
    image: "https://t3.ftcdn.net/jpg/08/71/60/32/360_F_871603234_fTMmjlUOpt4F9mDudj8wjyzkt0khEtSZ.jpg",
    buttonText: 'Book Now',
    buttonType: 'primary',
    stats: {
        projects: 120,
        clients: 85,
        commits: '25k',
        support: '24/7'
    },
    statLabels: { applied: 'Projects Done', total: 'Happy Clients', interviews: 'Git Commits', responseRate: 'Support' }
  },
  {
    icon: <MarketingIcon />,
    title: 'Digital Marketing',
    description: 'Enhance your online presence with advanced marketing campaigns and analytics insights.',
    image: "https://online.hbs.edu/Style%20Library/api/resize.aspx?imgpath=/PublishingImages/blog/posts/digital-marketing-skills.jpg&w=1200&h=630",
    buttonText: 'Book Now',
    buttonType: 'tertiary',
    stats: {
        reach: '10M+',
        ctr: '5.2%',
        leads: '5k+',
        roi: '320%'
    },
    statLabels: { applied: 'Monthly Reach', total: 'Click-Rate', interviews: 'Leads Gen.', responseRate: 'Avg. ROI' }
  },
  {
    icon: <TalentIcon />,
    title: 'IT Talent Supply',
    description: 'Source and manage top IT professionals with comprehensive talent acquisition tools.',
    image: "https://media.istockphoto.com/id/1334591613/photo/businessman-hold-circle-of-network-structure-hr-human-resources-business-leadership-concept.jpg?s=612x612&w=0&k=20&c=F4OFJteempRNkJl2tKsq6vWuP0DwFY3x9KpRCZ6C3Vc=",
    buttonText: 'Book Now',
    buttonType: 'quaternary',
     stats: {
        candidates: '5k+',
        placed: 800,
        time: '2 Weeks',
        satisfaction: '98%'
    },
    statLabels: { applied: 'Candidates', total: 'Placed Yearly', interviews: 'Avg. Hire Time', responseRate: 'Client Satisfaction' }
  },
  {
    icon: <SecurityIcon />,
    title: 'Cybersecurity Analytics',
    description: 'Protect your business with advanced threat monitoring and comprehensive security analysis.',
    image: "https://img.freepik.com/free-photo/representation-user-experience-interface-design_23-2150169861.jpg?semt=ais_hybrid&w=740&q=80",
    buttonText: 'Book Now',
    buttonType: 'quinary',
    stats: {
        threats: 150,
        incidents: 12,
        response: '15min',
        compliance: '100%'
    },
    statLabels: { applied: 'Threats Blocked', total: 'Incidents Reported', interviews: 'Avg. Response', responseRate: 'Compliance' }
  }
];

const pricingTiers = [
    { title: 'Mobile Dev', available: 'Available', details: 'iOS, Android', price: 'Contact for pricing', type: 'info' },
    { title: 'Web Dev', available: 'Available', details: 'Full Stack', price: 'Contact for pricing', type: 'primary' },
    { title: 'Marketing', available: 'Available', details: 'SEO, Campaigns', price: 'Contact for pricing', type: 'warning' },
    { title: 'Security', available: 'Available', details: 'Business Level', price: 'Contact for pricing', type: 'dark' },
];

const allServices = services; // Rename for clarity

// --- New Subscriptions Page Component ---
const SubscriptionsPage = ({ onBackClick }) => (
  <div className="subscriptions-container">
    <div className="subscriptions-header">
      <button onClick={onBackClick} className="back-btn">
        <BackArrowIcon />
        Back
      </button>
      <div>
        <h1 className="page-title">My Subscriptions</h1>
        <p className="page-subtitle">Manage your service subscriptions and billing</p>
      </div>
    </div>
    <div className="subscription-list">
      <div className="subscription-card">
        <div className="subscription-card-header">
          <div className="subscription-icon-wrapper">
            <JobIcon />
          </div>
          <h3>Job Application Dashboard</h3>
          <span className="tag tag-active">Active</span>
        </div>
        <div className="subscription-details">
          <p className="plan-name">Pro Plan</p>
          <p className="renewal-info">Renews in 8 days</p>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '73%' }}></div>
          </div>
          <p className="payment-info">Last payment: November 2, 2024</p>
          <p className="payment-amount">$ Amount: $59.00</p>
        </div>
        <button className="manage-btn">Manage Subscription</button>
      </div>
    </div>
  </div>
);

// --- New Dashboard Page Component ---
const DashboardPage = ({ onBackClick }) => {
    const weeklyData = [
        { day: 'Mon', apps: 2 },
        { day: 'Tue', apps: 4 },
        { day: 'Wed', apps: 1 },
        { day: 'Thu', apps: 3 },
        { day: 'Fri', apps: 5 },
        { day: 'Sat', apps: 1 },
        { day: 'Sun', apps: 2 },
    ];

    const maxApps = Math.max(...weeklyData.map(d => d.apps));

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <button onClick={onBackClick} className="back-btn">
                    <BackArrowIcon />
                    Back
                </button>
                <div className="dashboard-title-container">
                    <h1 className="dashboard-title">Job Application Dashboard</h1>
                    <p className="dashboard-subtitle">Track and manage your job applications efficiently</p>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                <div className="stat-card stat-blue">
                    <div className="stat-content">
                        <p>Total Applications</p>
                        <h3>152</h3>
                    </div>
                    <BriefcaseIcon />
                </div>
                <div className="stat-card stat-green">
                    <div className="stat-content">
                        <p>Interviews</p>
                        <h3>12</h3>
                    </div>
                    <UsersIcon />
                </div>
                <div className="stat-card stat-purple">
                    <div className="stat-content">
                        <p>Response Rate</p>
                        <h3>72%</h3>
                    </div>
                    <ChartIcon />
                </div>
                <div className="stat-card stat-orange">
                    <div className="stat-content">
                        <p>This Week</p>
                        <h3>5</h3>
                    </div>
                    <CrosshairIcon />
                </div>
            </div>

            <div className="dashboard-content-card">
                <div className="tabs">
                    <button className="tab active">Analytics</button>
                    <button className="tab">Applications</button>
                    <button className="tab">Documents</button>
                </div>
                <div className="chart-container">
                    <h3>Weekly Application Activity</h3>
                    <div className="weekly-chart">
                        {weeklyData.map((d, index) => (
                            <div key={index} className="chart-row">
                                <div className="day">{d.day}</div>
                                <div className="bar-wrapper">
                                    <div 
                                        className="bar" 
                                        style={{ width: `${(d.apps / maxApps) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="app-count">{d.apps} apps</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate(); 

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === allServices.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? allServices.length - 1 : prev - 1));
  };
  
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleServiceButtonClick = (page) => {
    setCurrentPage(page);
  };

  const currentService = allServices[currentSlide];

  return (
    <>
      <GlobalStyles />
      <div className="tech-page-container">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 main-header">
          <div className="logo">Tech<span style={{ color: '#4A69FF' }}>X</span>plorers</div>
          <nav className="main-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('subscriptions'); }}>My Subscriptions</a>
            <div className="separator"></div>
            <div className="user-menu">
              <button className="icon-btn"><BellIcon /></button>
              <img src="https://placehold.co/32x32/E8117F/white?text=A" alt="User Avatar" className="avatar" />
              <div className="user-info">
                <span>Alex Johnson</span>
                <small>alex.johnson@email.com</small>
              </div>
              <button className="icon-btn-chevron">
                <SvgIcon d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </button>
            </div>
          </nav>
        </header>

        {/* Conditional Content Rendering */}
        {currentPage === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <span className="tag tag-featured">Featured</span>
                <div className="hero-icon-wrapper type-primary">
                  {currentService.icon}
                </div>
                <h1>{currentService.title}</h1>
                <p>{currentService.description}</p>
              </div>
              <div className="hero-slider">
                <div className="slider-cards-wrapper">
                  {allServices.map((service, index) => {
                    const isCurrent = index === currentSlide;
                    const isNext = index === (currentSlide + 1) % allServices.length;
                    const isPrev = index === (currentSlide - 1 + allServices.length) % allServices.length;
                    
                    let cardClass = 'slider-card';
                    let zIndex = allServices.length - index;
                    let opacity = '0.5';
    
                    if (isCurrent) {
                      cardClass += ' current-card';
                      zIndex = allServices.length + 1;
                      opacity = '1';
                    } else if (isNext) {
                      cardClass += ' next-card';
                      zIndex = allServices.length - currentSlide;
                    } else if (isPrev) {
                      cardClass += ' prev-card';
                      zIndex = allServices.length - currentSlide;
                    } else if (index < currentSlide) {
                        cardClass += ' prev-card-hidden';
                    } else {
                        cardClass += ' next-card-hidden';
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className={cardClass}
                        style={{ zIndex, opacity }}
                      >
                        <img src={service.image} alt={service.title} />
                        {isCurrent && (
                            <div className="slider-card-content-overlay">
                                <div className="slider-card-tags">
                                    <span className="tag tag-offer">Live Data</span>
                                    <span className="slider-nav-text">{allServices.length} Services</span>
                                </div>
                                <h3>{service.title}</h3>
                            </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={prevSlide} className="slider-btn prev"><ChevronLeftIcon /></button>
                <button onClick={nextSlide} className="slider-btn next"><ChevronRightIcon /></button>
                
                <div className="slider-nav">
                    <div className="slider-dots">
                        {allServices.map((_, index) => (
                            <button 
                                key={index}
                                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
              </div>
            </section>
    
            {/* All Services Section */}
            <section className="services-section">
              <span className="tag tag-premium">Premium Services</span>
              <h2>All Services</h2>
              <p className="section-subtitle">Explore our comprehensive suite of technology services designed to accelerate your business growth and transform your digital presence</p>
              <div className="services-grid">
                {allServices.map((service, index) => (
                  <div className="service-card" key={index}>
                    <div className={`service-icon-wrapper type-${service.buttonType}`}>
                      {service.icon}
                    </div>
                    <div className="card-tags">
                        {service.status && <span className="tag tag-active">{service.status}</span>}
                        {service.featured && <span className="tag tag-featured">Featured</span>}
                    </div>
                    <h3>{service.title}</h3>
                    <p className="card-description">{service.description}</p>
                    
                    {service.stats && (
                        <div className="service-stats-grid">
                            <div><span className="stat-value" style={{'--stat-color': '#6c5ce7'}}>{Object.values(service.stats)[0]}</span> {service.statLabels ? service.statLabels.applied : 'Applied Today'}</div>
                            <div><span className="stat-value" style={{'--stat-color': '#00cec9'}}>{Object.values(service.stats)[1]}</span> {service.statLabels ? service.statLabels.total : 'Total Applications'}</div>
                            <div><span className="stat-value" style={{'--stat-color': '#0984e3'}}>{Object.values(service.stats)[2]}</span> {service.statLabels ? service.statLabels.interviews : 'Interviews Scheduled'}</div>
                            <div><span className="stat-value" style={{'--stat-color': '#d6336c'}}>{Object.values(service.stats)[3]}</span> {service.statLabels ? service.statLabels.responseRate : 'Response Rate'}</div>
                        </div>
                    )}
                    
                    <div className="card-footer">
                        <button 
                            className={`btn btn-${service.buttonType}`}
                            onClick={() => service.page && handleServiceButtonClick(service.page)}
                        >
                          {service.buttonText} <ArrowRightIcon />
                        </button>
                        <a href="#" className="learn-more">Learn More</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
    
            {/* CTA Section */}
            <section className="cta-section">
              <div className="cta-content">
                <span className="tag tag-light">Limited Time Offer</span>
                <h2>Get <span className="highlight">Custom Pricing</span> For Your Business</h2>
                <p>Join thousands of professionals who trust TechXplorers. Connect with our team to discuss tailored solutions and competitive pricing for your specific needs.</p>
                <div className="cta-buttons">
                  <button className="btn btn-cta"><LightningIcon />Get Quote</button>
                  <div className="cta-consultation">
                      <span>Free consultation available</span>
                      <a href="#">Contact Us</a>
                  </div>
                </div>
                <ul className="cta-features">
                  <li>Free consultation included</li>
                  <li>24/7 expert support</li>
                  <li>Scalable architecture</li>
                  <li>Custom pricing available</li>
                </ul>
              </div>
              <div className="pricing-grid">
                {pricingTiers.map((tier, index) => (
                    <div key={index} className={`pricing-card pricing-${tier.type}`}>
                        <div className="pricing-card-header">
                            <h4>{tier.title}</h4>
                            <div className="check-icon-wrapper"><CheckIcon /></div>
                        </div>
                        <p className="pricing-available">{tier.available}</p>
                        <p className="pricing-details">{tier.details}</p>
                        <p className="pricing-price">{tier.price}</p>
                    </div>
                ))}
              </div>
            </section>
          </>
        ) : currentPage === 'subscriptions' ? (
          <SubscriptionsPage onBackClick={() => setCurrentPage('home')} />
        ) : currentPage === 'dashboard' ? (
          <DashboardPage onBackClick={() => setCurrentPage('home')} />
        ) : null}
      </div>
    </>
  );
}

// --- Global Styles Component ---
// This is a common pattern for adding global CSS in a component-based
// architecture when not using external CSS files.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --font-family: 'Inter', sans-serif;
      --bg-color: #F8F9FA;
      --card-bg: #FFFFFF;
      --text-dark: #212529;
      --text-light: #6C757D;
      --border-color: #DEE2E6;
      --primary-color: #4A69FF;
      --secondary-color: #D63384;
      --tertiary-color: #FD7E14;
      --quaternary-color: #198754;
      --quinary-color: #343A40;
      --warning-color: #FFC107;
      --cta-bg: #212541;
      --cta-text: #E9ECEF;
      --radius-sm: 8px;
      --radius-md: 12px;
      --shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background: linear-gradient(to right, #6C63FF, #9B51E0);
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      color: var(--text-dark);
      line-height: 1.6;
    }
    
    .tech-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      /* Add padding-top to prevent content from being hidden under the fixed header */
      padding-top: 6rem;
    }

    h1, h2, h3, h4 {
      font-weight: 700;
      line-height: 1.2;
    }
    
    p {
      color: var(--text-light);
    }
    
    a {
      text-decoration: none;
      color: var(--primary-color);
    }

    .tag {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 12px;
    }

    .tag-light {
        background-color: #e9edff;
        color: var(--primary-color);
    }

    .tag-premium {
        background-color: #f3e5f5;
        color: #8e24aa;
    }
    
    .card-tags {
        display: flex;
        gap: .5rem;
        margin-bottom: .5rem;
    }
    
    .tag-active {
        background-color: transparent;
        color: var(--text-dark);
        font-size: 12px;
        border: 1px solid var(--border-color);
    }
    
    .tag-active::before {
        content: '✓';
        color: #20c997;
        margin-right: 4px;
        font-weight: bold;
    }
    
    .tag-featured {
        background-color: rgba(255, 255, 255, 0.1);
        color: #8e24aa;
        color: #6C63FF;
    }

    .tag-offer {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
    }
    
    /* Header */
    .main-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      gap: 2rem;
      background-color: #212541;
      color: #E9ECEF;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: var(--radius-md);
    }

    .logo {
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
    }

    .main-nav {
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
      gap: 1.5rem;
    }

    .main-nav a {
      color: white;
      font-weight: 500;
    }
    
    .separator {
      height: 24px;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.2);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.8);
    }
    .icon-btn-chevron {
      background: none;
      border: none;
      cursor: pointer;
      color: white;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
    }
    
    .user-info span {
      font-weight: 600;
      font-size: 14px;
      color: white;
    }
    
    .user-info small {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Hero Section */
    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 2rem;
      background-color: var(--card-bg);
      padding: 4rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      margin-bottom: 4rem;
      position: relative;
    }
    
    .hero-content {
      padding: 0 2rem;
    }
    .hero-icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e9edff;
        color: var(--primary-color);
        margin-bottom: 1rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.1rem;
      max-width: 450px;
    }

    .hero-slider {
      position: relative;
      width: 100%;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .slider-cards-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform-style: preserve-3d;
        perspective: 1000px;
    }
    
    .slider-card {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 80%;
        transform: translate(-50%, -50%);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out, z-index 0.5s linear;
        border: 1px solid white;
    }
    
    .slider-card.current-card {
        transform: translate(-50%, -50%) scale(1);
        z-index: 10;
        opacity: 1;
    }
    
    .slider-card.prev-card {
        transform: translate(-55%, -50%) rotateZ(-5deg) scale(0.95);
        z-index: 9;
        opacity: 0.8;
    }
  .slider-card.next-card {
        transform: translate(-45%, -50%) rotateZ(5deg) scale(0.95);
        z-index: 9;
        opacity: 0.8;
    }
    .slider-card.prev-card-hidden {
        transform: translate(-65%, -50%) rotateZ(-10deg) scale(0.9);
        opacity: 0;
    }
    .slider-card.next-card-hidden {
        transform: translate(-35%, -50%) rotateZ(10deg) scale(0.9);
        opacity: 0;
    }
    
    .slider-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .slider-card-content-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 2rem;
        background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0));
        color: white;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: opacity 0.3s ease;
        opacity: 1;
    }

    .slider-card-content-overlay h3 {
        color: white;
    }

    .slider-card-tags {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
    }

    .slider-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.2);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      color: white;
      transition: background-color 0.3s;
      z-index: 11;
    }
    
    .slider-btn:hover {
        background-color: rgba(0, 0, 0, 0.4);
    }
    
    .slider-btn.prev { left: 10px; }
    .slider-btn.next { right: 10px; }

    .slider-nav {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .slider-dots {
      display: flex;
      gap: 8px;
    }
    
    .slider-dot {
      width: 10px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s;
    }
    
    .slider-dot.active {
      background-color: var(--primary-color);
      transform: scale(1.2);
    }
    
    .slider-nav-text {
        font-size: 14px;
        font-weight: 500;
        color: #f8f9fa;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: var(--radius-sm);
    }
    
    /* Services Section */
    .services-section {
        background-color: white;
        padding: 4rem 2rem;
        border-radius: var(--radius-md);
        margin-bottom: 4rem;
        text-align: center;
    }
    
    .services-section h2 {
      font-size: 2.25rem;
      margin-bottom: 1rem;
    }
    
    .section-subtitle {
        max-width: 600px;
        margin: 0 auto 2rem;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    
    .service-card {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 2rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        min-height: 600px;
    }
    
    .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(74, 105, 255, 0.1);
        border-color: rgba(74, 105, 255, 0.5);
    }
    
    .service-card h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }

    .card-description {
        flex-grow: 1;
        margin-bottom: 1.5rem;
    }
    
    .service-icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        color: white;
        transition: all 0.3s ease;
    }
    
    .service-card:hover .service-icon-wrapper {
        width: 56px;
        height: 56px;
        transform: rotate(-5deg);
    }

    .service-icon-wrapper.type-primary { background-color: var(--primary-color); }
    .service-icon-wrapper.type-secondary { background-color: var(--secondary-color); }
    .service-icon-wrapper.type-tertiary { background-color: var(--tertiary-color); }
    .service-icon-wrapper.type-quaternary { background-color: var(--quaternary-color); }
    .service-icon-wrapper.type-quinary { background-color: var(--quinary-color); }

    .service-stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.4s ease-out, opacity 0.4s ease-out, margin-top 0.4s ease-out;
        font-size: 14px;
        color: var(--text-light);
    }
    
    .service-card:hover .service-stats-grid {
        max-height: 150px;
        opacity: 1;
        margin-top: 1rem;
    }

    .service-stats-grid div {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .stat-value::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--stat-color);
    }
    
    .card-footer {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: auto;
        padding-top: 1.5rem;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .service-card:hover .btn {
      background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    }

    .btn:hover { opacity: 0.85; }

    .btn-primary { background-color: var(--primary-color); color: white; }
    .btn-secondary { background-color: var(--secondary-color); color: white; }
    .btn-tertiary { background-color: var(--tertiary-color); color: white; }
    .btn-quaternary { background-color: var(--quaternary-color); color: white; }
    .btn-quinary { background-color: var(--quinary-color); color: white; }
    .btn-cta { background-color: var(--warning-color); color: var(--text-dark); }
    
    .learn-more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 500;
      padding: 12px 24px;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      transition: all 0.3s ease;
      width: 100%;
    }
    
    .service-card:hover .learn-more {
        border-color: var(--border-color);
        background-color: var(--card-bg);
        color: var(--text-dark);
    }
    .learn-more:hover {
        background-color: #f1f3f5;
        border-color: #ced4da;
    }

    /* CTA Section */
    .cta-section {
        background: linear-gradient(135deg, #1f2c4f 0%, #3a508f 100%);
        color: var(--cta-text);
        padding: 4rem;
        border-radius: var(--radius-md);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
        margin-bottom: 4rem;
    }
    
    .cta-content h2 {
      font-size: 2.25rem;
      margin-bottom: 1rem;
    }
    .cta-content p {
      color: #adb5bd;
      max-width: 450px;
      margin-bottom: 2rem;
    }

    .highlight {
      color: #FFC107;
    }
    
    .cta-buttons {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .btn-cta {
      background-color: var(--warning-color);
      color: var(--text-dark);
    }

    .cta-consultation {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 14px;
    }
    
    .cta-consultation span {
      color: white;
    }

    .cta-consultation a {
        color: var(--warning-color);
        font-weight: 600;
        text-decoration: underline;
    }
    
    .cta-features {
        list-style: none;
        display: flex;
        gap: 1.5rem;
        font-size: 12px;
        color: #adb5bd;
    }
    
    .cta-features li::before {
        content: '✓';
        color: var(--quaternary-color);
        margin-right: 8px;
    }
    
    .pricing-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .pricing-card {
        padding: 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .pricing-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .pricing-card-header h4 {
      font-weight: 600;
    }
    
    .check-icon-wrapper {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .pricing-available, .pricing-details, .pricing-price {
        font-size: 14px;
    }
    
    .pricing-info { background: linear-gradient(135deg, #7952B3 0%, #5e3b96 100%); color: white; }
    .pricing-primary { background: linear-gradient(135deg, #4A69FF 0%, #2575fc 100%); color: white; }
    .pricing-warning { background: linear-gradient(135deg, #FD7E14 0%, #eb6f0e 100%); color: white; }
    .pricing-dark { background: linear-gradient(135deg, #495057 0%, #343a40 100%); color: white; }
    
    .pricing-available { color: #f8f9fa; }
    .pricing-details { color: #dee2e6; }
    .pricing-price { font-weight: 600; font-size: 16px; margin-top: 1rem; }


    /* Responsive Design */
    @media (max-width: 1200px) {
        .services-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 992px) {
        .hero-section, .cta-section {
            grid-template-columns: 1fr;
        }
        .hero-content {
            text-align: center;
        }
        .hero-content p {
            margin: 0 auto;
        }
    }

    @media (max-width: 768px) {
        .tech-page-container {
            padding: 0 1rem;
        }
        .services-grid, .pricing-grid {
            grid-template-columns: 1fr;
        }
        .cta-section {
            padding: 2rem;
        }
        .cta-buttons {
            flex-direction: column;
            align-items: flex-start;
        }
        .main-header {
            flex-direction: column;
            align-items: center;
        }
        .main-nav {
            justify-content: center;
        }
    }

    /* Subscriptions Page Styles */
    .subscriptions-container {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .subscriptions-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .back-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .page-title {
      font-size: 2rem;
      color: white;
    }
    
    .page-subtitle {
      font-size: 1rem;
      color: #e9ecef;
    }
    
    .subscription-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .subscription-card {
      background-color: var(--card-bg);
      border-radius: var(--radius-md);
      padding: 2rem;
      box-shadow: var(--shadow);
    }
    
    .subscription-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .subscription-card-header h3 {
      font-size: 1.25rem;
      flex-grow: 1;
    }
    
    .subscription-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e9edff;
      color: var(--primary-color);
    }
    
    .subscription-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .plan-name {
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .renewal-info {
      color: var(--text-light);
    }
    
    .progress-bar {
      height: 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar-fill {
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 4px;
      transition: width 0.3s ease-in-out;
    }
    
    .payment-info, .payment-amount {
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .manage-btn {
      width: 100%;
      background-color: var(--primary-color);
      color: white;
      padding: 12px;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .manage-btn:hover {
      background-color: #3b5bdb;
    }

    /* Dashboard Page Styles */
    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .dashboard-header {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .dashboard-title-container {
        flex-grow: 1;
    }

    .dashboard-title {
        font-size: 2.5rem;
        color: white;
    }

    .dashboard-subtitle {
        color: #e9ecef;
        font-size: 1.1rem;
    }

    .dashboard-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background-color: white;
        border-radius: var(--radius-md);
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .stat-card p {
        color: white;
        font-size: 0.9rem;
    }

    .stat-card h3 {
        color: white;
        font-size: 2rem;
    }

    .stat-card svg {
        opacity: 0.5;
        width: 3rem;
        height: 3rem;
    }

    .stat-blue { background: linear-gradient(135deg, #4A69FF 0%, #2575fc 100%); }
    .stat-green { background: linear-gradient(135deg, #20c997 0%, #17a689 100%); }
    .stat-purple { background: linear-gradient(135deg, #6c5ce7 0%, #5247d8 100%); }
    .stat-orange { background: linear-gradient(135deg, #FD7E14 0%, #eb6f0e 100%); }
    
    .dashboard-content-card {
        background-color: white;
        border-radius: var(--radius-md);
        padding: 2rem;
        box-shadow: var(--shadow);
    }

    .tabs {
        display: flex;
        gap: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 1rem;
    }

    .tab {
        background: none;
        border: none;
        padding: 1rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-light);
        position: relative;
        top: 1px;
    }

    .tab.active {
        color: var(--text-dark);
        border-bottom: 2px solid var(--primary-color);
    }
    
    .chart-container h3 {
        margin-bottom: 1.5rem;
    }

    .weekly-chart {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .chart-row {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .day {
        width: 60px;
        font-weight: 500;
        color: var(--text-dark);
    }
    
    .bar-wrapper {
        flex-grow: 1;
        height: 8px;
        background-color: #e9ecef;
        border-radius: 4px;
    }
    
    .bar {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 4px;
    }
    
    .app-count {
        width: 80px;
        text-align: right;
        font-size: 0.9rem;
        color: var(--text-light);
    }
  `}</style>
);
