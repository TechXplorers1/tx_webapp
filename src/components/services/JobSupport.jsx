import React from 'react';
import img1 from '../../assets/JobApply.png';
import '../../styles/Services/MobileAppDev.css'; // Reusing MobileAppDev styles
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';

const JobSupport = () => {
  const navigate = useNavigate();

  const cardsData = [
    {
      title: 'Our IT Consulting Services',
      description: (
        <p>
 We provide strategic IT consulting services to help businesses improve operational efficiency, boost cybersecurity, and embrace modern technologies. Our goal is to guide organizations through digital transformation by aligning IT solutions with business objectives, optimizing infrastructure, and ensuring seamless technology adoption to stay competitive in a rapidly evolving digital landscape.
        </p>
      ),
    },
    {
      title: 'Key IT Consulting Services',
      description: (
        <ul className="flip-card-list">
          <li><strong>Digital Transformation</strong> – Helping businesses modernize with cloud computing, AI, and automation.</li>
          <li><strong>IT Strategy & Roadmap</strong> – Crafting tailored IT strategies to align with business goals.</li>
          <li><strong>Cloud Computing Consulting</strong> – Expertise in AWS, Azure, and Google Cloud for seamless cloud adoption.</li>
          <li><strong>Cybersecurity Solutions</strong> – Implementing robust security frameworks to protect sensitive data.</li>
          <li><strong>DevOps & Agile Consulting</strong> – Driving collaboration and automation for faster software delivery.</li>
          <li><strong>Enterprise IT Solutions</strong> – Providing ERP, CRM, and data analytics solutions for businesses.</li>
        </ul>
      ),
    },
    {
      title: 'Real-Time Job Support for IT Professionals',
      description: (
        <p>
Our comprehensive job support services are designed to assist IT professionals in resolving real-time project challenges efficiently. Whether you're stuck with coding issues, deployment errors, or need architectural guidance, our expert team is available to provide step-by-step support. We aim to ensure not just the successful delivery of your project, but also continuous learning and career advancement through practical, hands-on help tailored to your needs.        </p>
      ),
    },
    {
      title: 'How We Help IT Professionals',
      description: (
        <ul className="flip-card-list">
          <li><strong>Live Project Assistance</strong> – Get expert guidance while working on real-time industry projects.</li>
          <li><strong>One-on-One Support</strong> – Personalized mentoring to resolve technical issues quickly.</li>
          <li><strong>Technology-Specific Support</strong> – Specializing in Java, Python, AWS, DevOps, Data Science, Cybersecurity, and more.</li>
          <li><strong>Code Review & Debugging</strong> – Ensuring high-quality code through expert reviews.</li>
          <li><strong>Interview Preparation</strong> – Mock interviews, resume optimization, and skill-building sessions.</li>
          <li><strong>Freelancer & Remote Work Support</strong> – Assisting independent professionals in managing client projects.</li>
        </ul>
      ),
    },
    {
      title: 'Our IT Consulting & Job Support Process',
      description: (
        <ul className="flip-card-list">
          <li><strong>Requirement Analysis</strong> – Understanding your challenges and project requirements.</li>
          <li><strong>Expert Allocation</strong> – Assigning domain-specific IT consultants and mentors.</li>
          <li><strong>Problem-Solving Sessions</strong> – Providing real-time troubleshooting and guidance.</li>
          <li><strong>Performance Enhancement</strong> – Optimizing workflows, automation, and cloud integration.</li>
          <li><strong>Continuous Support & Monitoring</strong> – Ongoing assistance to ensure long-term success.</li>
        </ul>
      ),
    }
  ];

  return (
    <div className="jobsupport-container">
      <CustomNavbar />
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="IT Consulting & Job Support" className="header-image" />
          <div className="overlay-text">Job Support</div>
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
      

   

        {/* Embedded YouTube video */}
        <div className="contact-container">
          <h2 className="headline">To know more - Watch the video</h2>
          <div className="video-container" style={{ marginTop: '60px', marginLeft: '10px' }}>
            <iframe
              width="40%"
              height="215"
              src="https://www.youtube.com/embed/UE5wDavgZzA" 
              title="Job Support Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <a href="https://wa.me/919052990765"  target="_blank" rel="noopener noreferrer" className="contact-button btn-lg btn-primary">
            Contact Us
          </a>&nbsp; &nbsp; &nbsp;OR &nbsp; &nbsp; &nbsp;
          <button
            className="contact-button btn-lg btn-primary"
            onClick={() => navigate('/services/job-contact-form')}
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default JobSupport;