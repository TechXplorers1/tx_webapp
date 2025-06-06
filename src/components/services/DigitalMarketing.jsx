import React from 'react';
import img1 from '../../assets/DigiMark.png';
import '../../styles/Services/DigitalMarketing.css'; // Reusing MobileAppDev styles
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';


const DigitalMarketing = () => {
    const navigate = useNavigate();
  
  const cardsData = [
    {
      title: 'Our Digital Marketing Services',
      description: (
        <ul className="flip-card-list">
          <li>Search Engine Optimization (SEO) – Improve your website's ranking on search engines to drive organic traffic.</li>
          {/* <li>Pay-Per-Click Advertising (PPC) – Maximize ROI with targeted ad campaigns on Google, Bing, and social media platforms.</li> */}
          <li>Social Media Marketing (SMM) – Build brand awareness and customer engagement through strategic social media campaigns.</li>
          <li>Content Marketing – Develop high-quality content to attract, inform, and convert potential customers.</li>
          {/* <li>Email Marketing – Drive customer retention and engagement with personalized email campaigns.</li> */}
          {/* <li>Conversion Rate Optimization (CRO) – Optimize your website to improve user experience and boost conversions.</li> */}
          <li>Influencer & Affiliate Marketing – Leverage industry influencers and partners to expand your reach and credibility.</li>
          <li>Online Reputation Management (ORM) – Monitor and manage your brand's online presence to maintain a positive reputation.</li>
        </ul>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <ul className="flip-card-list">
          <li>E-Commerce & Retail</li>
          <li>Healthcare & Pharmaceuticals</li>
          <li>Finance & Banking</li>
          <li>Real Estate & Construction</li>
          <li>Education & Training</li>
          <li>Technology & SaaS</li>
          <li>Hospitality & Travel</li>
          <li>Automotive & Manufacturing</li>
        </ul>
      ),
    },
    {
      title: 'Our Digital Marketing Process',
      description: (
        <ul className="flip-card-list">
          <li>Market Research & Analysis – Understanding your industry, competitors, and target audience.</li>
          <li>Strategy Development – Crafting a customized digital marketing plan based on business goals.</li>
          <li>Implementation & Execution – Launching marketing campaigns using industry best practices.</li>
          <li>Monitoring & Optimization – Analyzing performance and making data-backed improvements.</li>
          <li>Reporting & Insights – Providing detailed reports and insights for continuous growth.</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers for Digital Marketing?',
      description: (
        <ul className="flip-card-list">
          <li>Expertise & Experience – A team of seasoned digital marketers with proven success in multiple industries.</li>
          <li>Custom Strategies – Tailored marketing solutions to align with your business goals and target audience.</li>
          <li>Data-Driven Approach – Leveraging analytics and insights to maximize campaign effectiveness.</li>
          <li>Multi-Channel Marketing – Integrated strategies across search, social media, content, and more.</li>
          <li>Transparent Reporting – Regular performance reports to track progress and optimize results.</li>
        </ul>
      ),
    },
    {
      title: 'Industries We Serve',
      description: (
        <p>We provide customized digital marketing strategies for businesses across multiple industries:</p>
      ),
    }
  ];

  return (
    <div className="digital-marketing-container">
      <CustomNavbar />
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Digital Marketing" className="header-image" />
          <div className="overlay-text">Digital Marketing</div>
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
          <button onClick={() => navigate('/contactus')} className="btn-lg btn-primary contact-button">
            Contact Us
          </button>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <button className="btn-lg btn-primary contact-button">Apply Now</button>
        </div>
      </section>
    </div>
  );
};

export default DigitalMarketing;