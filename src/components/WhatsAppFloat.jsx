import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const WhatsAppFloat = () => {
  const [isHovered, setIsHovered] = useState(false);

  // CONFIGURATION
  const phoneNumber = "919052990765"; 
  const message = "Hello! I would like to know more about your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Chat on WhatsApp"
    >
      <div className="float-content">
        <i className="bi bi-whatsapp icon-style"></i>
        <span className={`text-content ${isHovered ? 'show' : ''}`}>
          Chat with us
        </span>
      </div>

      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          bottom: 20px;
          right: 20px;
          height: 50px;
          background-color: #25D366;
          color: white;
          border-radius: 50px;
          box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
          z-index: 1000;
          text-decoration: none;
          overflow: hidden;
          transition: width 0.4s ease-in-out;
          
          /* Start as a circle */
          width: 50px; 
        }

        .whatsapp-float:hover {
          width: 160px; /* Expand on hover */
          background-color: #20b857;
        }

        .float-content {
          display: flex;
          align-items: center;
          height: 100%;
          /* CRITICAL FIX: Removed justify-content: center */
        }

        .icon-style {
          font-size: 24px;
          /* This forces the icon to always occupy the circle area */
          min-width: 50px; 
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .text-content {
          white-space: nowrap;
          opacity: 0;
          font-weight: 600;
          font-size: 15px;
          font-family: sans-serif;
          transition: opacity 0.3s ease-in-out;
          transition-delay: 0.1s;
          padding-right: 15px; /* Add padding for text spacing */
        }

        .text-content.show {
          opacity: 1;
        }
      `}</style>
    </a>
  );
};

export default WhatsAppFloat;