import React from 'react';
import img1 from '../../assets/MobileDev.png';
import '../../styles/Services/MobileAppDev.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';



const MobileAppDev = () => {
  const navigate = useNavigate();

  const cardsData = [
    {
      title: 'Android App Development',
      description: (
        <p>
          Android, developed by Google, powers a wide variety of smartphones. TechXplorers Pvt Ltd provides expert Android app development services, creating high-quality, custom apps tailored to your business needs.
        </p>
      ),
    },
    {
      title: 'Android App Development Services',
      description: (
        <ul className="flip-card-list">
          <li>Bluetooth Low Energy (BLE) Powered Devices</li>
          <li>Music and Video Apps</li>
          <li>Health and Fitness Apps</li>
          <li>Security Apps</li>
          <li>Location-based Apps</li>
          <li>GPS Tracking & Dispatch Apps</li>
          <li>Social Media Apps</li>
          <li>Custom Android App Development</li>
        </ul>
      ),
    },
    {
      title: 'iOS App Development',
      description: (
        <p>
          Apple's iOS platform is known for its seamless hardware-software integration, setting high benchmarks for mobile operating systems. TechXplorers Pvt Ltd specializes in custom iPhone app development for iOS 15/iOS 16, delivering end-to-end solutions.
        </p>
      ),
    },
    {
      title: 'iOS App Development Services',
      description: (
        <ul className="flip-card-list">
          <li>Bluetooth Low Energy (BLE) Powered Devices</li>
          <li>Music and Video Apps</li>
          <li>Health and Fitness Apps</li>
          <li>Security Apps</li>
          <li>Location-based Apps</li>
          <li>GPS Tracking & Dispatch Apps</li>
          <li>Social Media Apps</li>
          <li>Custom iOS App Development</li>
        </ul>
      ),
    },
    {
      title: 'Why Choose TechXplorers Pvt Ltd',
      description: (
        <ul className="flip-card-list">
          <li>Expert Developers: Talented professionals skilled in both Android and iOS app development.</li>
          <li>User-Centric Design: Focus on seamless user experience and beautiful, functional designs.</li>
          <li>Quality Assurance: Rigorous testing to ensure flawless app performance.</li>
          <li>Confidentiality: Full protection of your business idea with NDAs.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="mobile-app-dev-container">
      <CustomNavbar />
      {/* Header Section */}
      <header className="header-section">
        <div className="image-with-text-overlay">
          <img src={img1} alt="Mobile Application Development" className="header-image" />
          <div className="overlay-text">Mobile App Development</div>
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
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <button onClick={() => navigate('/contactus')} className="contact-button btn-lg btn-primary">
            Contact Us
          </button>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
          <a className="contact-button btn-lg btn-primary">Apply Now</a>
        </div>
      </section>
    </div>
  );
};

export default MobileAppDev;