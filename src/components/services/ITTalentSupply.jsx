import React from 'react';
import img1 from '../../assets/ItTalentSupply.png';
import '../../styles/Services/ITTalentSupply.css'; // Reuse the same CSS

const ITTalentSupply = () => {
  return (
    <div className="ittalent-supply-container">
      {/* Header Section */}
      <header className="header-section">
        <img src={img1} alt="IT Talent Supply" className="header-image" />
      </header>

      {/* Content Section */}
      <section className="content-section">
        <h2 className="section-title">IT Talent Supply</h2>
        <p className="section-description">
          At TechXplorers Private Limited, we specialize in IT talent supply solutions, helping businesses find the right tech professionals to drive innovation and success. Whether you need contract-based, full-time, or project-based IT talent, we provide skilled professionals tailored to your business needs.
        </p>

        <h3 className="subheading">IT Talent Supply – TechXplorers Private Limited</h3>
        <p>
          We connect companies with highly skilled IT professionals across various technologies and domains, ensuring you have the right talent to meet your project and business demands.
        </p>

        <h3 className="subheading">Key IT Talent Solutions</h3>
        <ul className="services-list">
          <li><strong>Permanent Staffing</strong> – Hire top IT professionals for long-term roles across various industries.</li>
          <li><strong>Contract Staffing</strong> – Flexible hiring options for short-term and project-based requirements.</li>
          <li><strong>Remote IT Talent</strong> – Access a global pool of remote IT experts to work on your projects.</li>
          <li><strong>Executive Search</strong> – Find highly skilled and experienced IT leaders for critical roles.</li>
          <li><strong>Project-Based IT Staffing</strong> – Deploy the right talent for specific IT projects, ensuring success.</li>
          <li><strong>On-Demand IT Experts</strong> – Quickly hire professionals to address urgent skill gaps.</li>
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

export default ITTalentSupply;