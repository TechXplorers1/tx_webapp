import React from 'react';
import img1 from '../../assets/MobileDev.png'; // Replace with your mobile development image
import '../../styles/Services/MobileAppDev.css';
const MobileAppDev = () => {
  return (
    <div className="mobile-app-dev-container">
      {/* Header Section */}
      <header className="header-section">
        <img src={img1} alt="Mobile Application Development" className="header-image" />
      </header>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Mobile Application Development Services: Android & iOS</h2>
        <p className="section-description">
          Zethon Tech Pvt Ltd offers expert Android and iOS app development services, ensuring seamless, user-centric experiences across both platforms. Whether you need custom Android apps or innovative iOS solutions, our skilled developers are here to bring your ideas to life with unmatched quality and performance.
        </p>

        {/* Android App Development */}
        <h3 className="subheading">Android App Development</h3>
        <p className="subheading-description">
          Android, developed by Google, powers a wide variety of smartphones. Zethon Tech Pvt Ltd provides expert Android app development services, creating high-quality, custom apps tailored to your business needs.
        </p>

        {/* Android App Development Services */}
        <h3 className="subheading">Android App Development Services:</h3>
        <ul className="services-list">
          <li>Bluetooth Low Energy (BLE) Powered Devices</li>
          <li>Music and Video Apps</li>
          <li>Health and Fitness Apps</li>
          <li>Security Apps</li>
          <li>Location-based Apps</li>
          <li>GPS Tracking & Dispatch Apps</li>
          <li>Social Media Apps</li>
          <li>Custom Android App Development</li>
        </ul>

        {/* iOS App Development */}
        <h3 className="subheading">iOS App Development</h3>
        <p className="subheading-description">
          Apple's iOS platform is known for its seamless hardware-software integration, setting high benchmarks for mobile operating systems. Zethon Tech Pvt Ltd specializes in custom iPhone app development for iOS 15/iOS 16, delivering end-to-end solutions.
        </p>

        {/* iOS App Development Services */}
        <h3 className="subheading">iOS App Development Services:</h3>
        <ul className="services-list">
          <li>Bluetooth Low Energy (BLE) Powered Devices</li>
          <li>Music and Video Apps</li>
          <li>Health and Fitness Apps</li>
          <li>Security Apps</li>
          <li>Location-based Apps</li>
          <li>GPS Tracking & Dispatch Apps</li>
          <li>Social Media Apps</li>
          <li>Custom iOS App Development</li>
        </ul>

        {/* Contact Section */}
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <a href="https://wa.me/919052990765"  target="_blank" rel="noopener noreferrer" className="contact-button btn btn-primary">
            Contact Us
          </a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
		  <a className="contact-button btn btn-primary">Apply Now</a>
        </div>
      </section>
    </div>
  );
};

export default MobileAppDev;