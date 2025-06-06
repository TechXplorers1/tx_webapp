import React from 'react';
import img1 from '../../assets/ItTalentSupply.png';
import '../../styles/Services/MobileAppDev.css'; // Reusing MobileAppDev styles
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';

const ITTalentSupply = () => {
      const navigate = useNavigate();
  
  const cardsData = [
    {
      title: 'IT Talent Supply – TechXplorers Private Limited',
      description: (
        <p>
          We connect companies with highly skilled IT professionals across various technologies and domains, ensuring you have the right talent to meet your project and business demands.
        </p>
      ),
    },
    {
      title: 'Key IT Talent Solutions',
      description: (
        <ul className="flip-card-list">
          <li><strong>Permanent Staffing</strong> – Hire top IT professionals for long-term roles across various industries.</li>
          <li><strong>Contract Staffing</strong> – Flexible hiring options for short-term and project-based requirements.</li>
          <li><strong>Remote IT Talent</strong> – Access a global pool of remote IT experts to work on your projects.</li>
          <li><strong>Executive Search</strong> – Find highly skilled and experienced IT leaders for critical roles.</li>
          <li><strong>Project-Based IT Staffing</strong> – Deploy the right talent for specific IT projects, ensuring success.</li>
          <li><strong>On-Demand IT Experts</strong> – Quickly hire professionals to address urgent skill gaps.</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers?',
      description: (
        <ul className="flip-card-list">
          <li>Proven Track Record – Years of experience in sourcing and supplying elite IT professionals.</li>
          <li>Global Reach – Access to a worldwide network of developers, engineers, and architects.</li>
          <li>Tailored Matching – We assess your needs to ensure we provide the perfect fit for your team.</li>
          <li>Scalable Hiring – From single freelancers to full teams, we support your growth at any scale.</li>
          <li>Compliance & Support – Full legal compliance and continuous support during engagement.</li>
        </ul>
      ),
    },

    {
      title: 'Our Talent Supply Process',
      description: (
        <ul className="flip-card-list">
          <li>Requirement Gathering – Understand your project scope and hiring goals.</li>
          <li>Candidate Sourcing – Leverage our global talent pool to find the best fit.</li>
          <li>Screening & Shortlisting – Technical assessments and interviews to ensure quality.</li>
          <li>Matching & Onboarding – Seamless integration into your team or project.</li>
          <li>Ongoing Management – Performance tracking, feedback, and support throughout the engagement.</li>
        </ul>
      ),
    }
  ];

  return (
    <div className="ittalent-supply-container">
      <CustomNavbar />
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="IT Talent Supply" className="header-image" />
          <div className="overlay-text">IT Talent Supply</div>
        </div>
      </header>

      {/* Flip Cards Section */}
      <section className="cards-section">
        <h2 className="section-title">Explore Our Services</h2>
        <div className="cards-wrapper">
          {cardsData.map((card, index) => (
            <div key={index} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{card.title}</h3>
                </div>
                <div className="flip-card-back">
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>
     



      {/* Contact Section */}
     
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button className="contact-button btn-lg btn-primary">Apply Now</button>
        </div>
      </section>
    </div>
  );
};

export default ITTalentSupply;