import React from 'react';
import img1 from '../../assets/WebDev.png';
import '../../styles/Services/WebAppDev.css'; // Import the same CSS file

const WebAppDev = () => {
  return (
    <div className="web-app-dev-container">
      {/* Header Section */}
      <header className="header-section">
        <img src={img1} alt="Web Application Development" className="header-image" />
      </header>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">Web Application Development</h2>
        <p className="section-description">
          At TechXplorers Private Limited, we design and develop scalable, secure, and high-performance web applications that empower businesses across industries. Whether you need a robust enterprise solution, SaaS product, e-commerce platform, or a custom web portal, our team delivers cutting-edge web applications that drive engagement, efficiency, and revenue growth.
        </p>

        <h3 className="subheading">Our Web Application Development Services</h3>
        <p>
          We offer end-to-end web application development solutions, ensuring your web platform is responsive, secure, and aligned with your business objectives.
        </p>

        <h3 className="subheading">Custom Web App Development</h3>
        <ul className="services-list">
          <li>We create web applications that align with your business needs, industry standards, and customer expectations.</li>
          <li>Modern Tech Stack – We utilize React.js, Angular, Vue.js, Node.js, Python, Laravel, and PHP for scalable and efficient development.</li>
          <li>Full-Stack Development – From front-end design to back-end architecture, we deliver complete web solutions.</li>
          <li>Fast & Responsive – Optimized performance for quick loading times.</li>
        </ul>

        <h3 className="subheading">Web Application Development Process</h3>
        <p>We follow an agile and result-driven development process, ensuring quality, scalability, and performance.</p>
        <ul className="services-list">
          <li>Requirement Analysis & Planning – Understanding your business goals and project requirements.</li>
          <li>UI/UX Design & Prototyping – Crafting intuitive and engaging interfaces for a seamless user experience.</li>
          <li>Development & Testing – Coding, integration, and rigorous testing to ensure flawless functionality.</li>
          <li>Deployment & Launch – Ensuring a smooth launch with cloud hosting, domain setup, and database configurations.</li>
          <li>Ongoing Maintenance & Upgrades – Continuous monitoring, bug fixes, security updates, and feature enhancements.</li>
        </ul>

        {/* Contact Section */}
        <div className="contact-container">
          <h2 className="headline">Want to know more or work with us?</h2>
          <a href="https://wa.me/919052990765"  target="_blank" rel="noopener noreferrer" className=" btn btn-primary contact-button">
            Contact Us
          </a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;------or------ &nbsp; &nbsp; &nbsp;
		  <a className="contact-button btn btn-primary">Apply Now</a>
        </div>
      </section>
    </div>
  );
};

export default WebAppDev;