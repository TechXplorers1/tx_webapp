import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { database } from '../../firebase'; // Import your Firebase config
import { ref, push, set, update } from "firebase/database";
import { useAuth } from '../../components/AuthContext';

const ServicesForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        selectedServices: [],
        userType: '',
    });

    const [readOnlyService, setReadOnlyService] = useState('');

    useEffect(() => {
        if (location.state?.service) {
            setReadOnlyService(location.state.service);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceChange = (e, service) => {
        const isChecked = e.target.checked;
        setFormData((prevData) => {
            let updatedServices = [...prevData.selectedServices];
            if (isChecked) {
                updatedServices.push(service);
            } else {
                updatedServices = updatedServices.filter((item) => item !== service);
            }
            return { ...prevData, selectedServices: updatedServices };
        });
    };

    const handleUserTypeChange = (userType) => {
        setFormData((prevData) => ({
            ...prevData,
            userType: userType,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         setIsLoading(true);
        
        const newServiceRegistration = {
            service: readOnlyService,
            subServices: formData.selectedServices,
            userType: formData.userType,
            firstName: formData.firstName, // Keep name for context
            lastName: formData.lastName,   // Keep name for context
            registeredDate: new Date().toISOString().split('T')[0],
            assignmentStatus: 'registered',
            assignedManager: '',
            paymentStatus: 'Pending',
            country: 'N/A', // Default value
        };
          const clientProfileUpdate = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobile,
            email: formData.email,
        };

        try {
            if (!user || !user.firebaseKey) {
                throw new Error("You must be logged in to submit this form.");
            }

            // 1. Create a new, unique entry under the client's "serviceRegistrations"
            const newRegistrationRef = push(ref(database, `clients/${user.firebaseKey}/serviceRegistrations`));
            await set(newRegistrationRef, newServiceRegistration);

            // 2. Update the main client profile with the latest contact info
            const clientProfileRef = ref(database, `clients/${user.firebaseKey}`);
            await update(clientProfileRef, clientProfileUpdate);

            console.log('New service registration saved to Firebase successfully.');
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/");
            }, 3000);

        } catch (error) {
            console.error("Failed to save to Firebase", error);
            alert("Submission failed. Please try again.");
        }finally {
            // MODIFICATION: Set loading to false when submission is complete (or fails)
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const roles = ['Individual', 'Business Owner', 'Startup Founder', 'Agency', 'Student'];

    const serviceMapping = {
        "Mobile Development": [
            "Android App Development",
            "iOS App Development",
            "Cross-Platform Development",
            "Progressive Web Apps (PWA)",
        ],
        "Web Development": [
            "Frontend Development",
            "Backend Development",
            "Database Design & Management",
            "Web Hosting & Deployment",
        ],
        "Digital Marketing": [
            "Email Marketing",
            "Content Marketing",
            "Search Engine Optimization (SEO)",
            "Social Media Marketing (SMM)",
        ],
        "IT Talent Supply": [
            "IT Internship Staffing",
            "Contract Staffing",
            "Permanent Staffing",
            "Remote / Offshore Staffing",
            "Technical Screening & Interviews",
        ],
         "Cyber Security": [
            "Vulnerability Assessment & Penetration Testing (VAPT)",
            "Managed Detection and Response (MDR)",
            "Endpoint Security",
            "Security Information and Event Management (SIEM)",
            "Identity and Access Management (IAM)",
        ],
    };

// In ServicesForm.jsx, REPLACE the entire `return (...)` block.

return (
    <>
        <style>{modernStyles}</style>
        <div className="service-form-wrapper">
            <div className="form-container-modern">
                <button onClick={handleBackClick} className="back-button-modern">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Back
                </button>
                <h2 className="form-header-modern">Application Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modern">
                        <label htmlFor="firstName" className="form-label-modern">First Name <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-control-modern" />
                    </div>
                    <div className="form-group-modern">
                        <label htmlFor="lastName" className="form-label-modern">Last Name <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-control-modern" />
                    </div>
                    <div className="form-group-modern">
                        <label htmlFor="mobile" className="form-label-modern">Mobile<span style={{color: 'red'}}>*</span></label>
                        <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required className="form-control-modern" />
                    </div>
                    <div className="form-group-modern">
                        <label htmlFor="email" className="form-label-modern">Email ID <span style={{color: 'red'}}>*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-control-modern" />
                    </div>
                    <div className="form-group-modern">
                        <label htmlFor="service" className="form-label-modern">Service <span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="service" name="service" value={readOnlyService} readOnly className="form-control-modern form-control-readonly" />
                    </div>

                    <div>
                        <h3 className="section-header-modern">What service do you want?</h3>
                        {readOnlyService && (
                            <div className="custom-checkbox-group">
                                {serviceMapping[readOnlyService]?.map((service) => (
                                    <label key={service} className="custom-checkbox-label">
                                        <input type="checkbox" id={service} name="selectedServices" value={service} checked={formData.selectedServices?.includes(service)} onChange={(e) => handleServiceChange(e, service)} className="custom-checkbox-input" />
                                        <span className="custom-checkbox-display"></span>
                                        {service}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="section-header-modern">Who are you?</h3>
                        <div className="user-type-group">
                            {roles.map((role) => (
                                <button key={role} type="button" onClick={() => handleUserTypeChange(role)} className={`user-type-button ${formData.userType === role ? "selected" : ""}`}>
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="submit-button-modern" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span style={{ marginLeft: '8px' }}>Submitting...</span>
                                </>
                            ) : 'Submit'}
                        </button>
                    </div>
                </form>
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Header closeButton />
                    <Modal.Body style={successModalStyle}>
                        <div style={successAnimationContainerStyle}>
                            <span style={tickStyle}>✅</span>
                        </div>
                        <h4 className="success-modal-title">Form Successfully Submitted!</h4>
                        <p className="success-modal-message">Your form has been submitted successfully.</p>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    </>
);
};

// In ServicesForm.jsx, add this constant before the `return` statement.

// In ServicesForm.jsx, REPLACE your existing `modernStyles` constant with this one.

const modernStyles = `
  /* --- LIGHT MODE STYLES (BASE) --- */
  .service-form-wrapper {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease;
  }
  .form-container-modern {
    background-color: #ffffff;
    padding: 2.5rem 3rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    width: 100%;
    max-width: 700px;
    animation: fadeIn 0.5s ease-out;
    border: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  @media (max-width: 768px) {
    .form-container-modern {
      padding: 2rem 1.5rem;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .back-button-modern {
    position: absolute;
    top: 25px;
    left: 25px;
    background: transparent;
    border: none;
    color: #6c757d;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  .back-button-modern:hover {
    color: #0d6efd;
  }
  .form-header-modern {
    color: #212529;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2.25rem;
    font-weight: 700;
    transition: color 0.3s ease;
  }
  .form-group-modern {
    margin-bottom: 1.25rem;
  }
  .form-label-modern {
    display: block;
    font-weight: 500;
    color: #495057;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
  }
  .form-control-modern {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background-color: #fff;
    color: #212529;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s, color 0.3s;
  }
  .form-control-modern:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    outline: none;
  }
  .form-control-readonly {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
  .section-header-modern {
    font-size: 1.25rem;
    font-weight: 600;
    color: #343a40;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;
    transition: color 0.3s ease, border-color 0.3s ease;
  }
  .custom-checkbox-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  @media (max-width: 576px) {
    .custom-checkbox-group {
      grid-template-columns: 1fr;
    }
  }
  .custom-checkbox-label {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s, color 0.2s;
    color: #212529;
  }
  .custom-checkbox-label:hover {
    background-color: #f8f9fa;
  }
  .custom-checkbox-input {
    display: none;
  }
  .custom-checkbox-display {
    width: 20px;
    height: 20px;
    border: 2px solid #adb5bd;
    border-radius: 4px;
    margin-right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .custom-checkbox-input:checked + .custom-checkbox-display {
    background-color: #0d6efd;
    border-color: #0d6efd;
  }
  .custom-checkbox-input:checked + .custom-checkbox-display::before {
    content: '✔';
    color: white;
    font-size: 12px;
  }
  .user-type-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .user-type-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid #ced4da;
    border-radius: 50px;
    cursor: pointer;
    background-color: #fff;
    color: #495057;
    transition: all 0.2s ease;
  }
  .user-type-button:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }
  .user-type-button.selected {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
  }
  .submit-button-modern {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(45deg, #0d6efd, #0b5ed7);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 1.5rem;
  }
  .submit-button-modern:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
  }
  .submit-button-modern:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
  .success-modal-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }
  .success-modal-message {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
  }

  /* --- DARK MODE STYLES (CORRECTED) --- */
  .dark-mode .service-form-wrapper {
    background-color: #1a202c !important;
  }
  .dark-mode .form-container-modern {
    background-color: #2d3748 !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid #4a5568 !important;
  }
  .dark-mode .back-button-modern {
    color: #a0aec0 !important;
  }
  .dark-mode .back-button-modern:hover {
    color: #90cdf4 !important;
  }
  .dark-mode .form-header-modern,
  .dark-mode .section-header-modern,
  .dark-mode .custom-checkbox-label {
    color: #e2e8f0 !important;
  }
  .dark-mode .form-label-modern {
    color: #cbd5e1 !important;
  }
  .dark-mode .form-control-modern {
    background-color: #1f2937 !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }
  .dark-mode .form-control-modern::placeholder {
    color: #a0aec0 !important;
  }
  .dark-mode .form-control-modern:focus {
    border-color: #4299e1 !important;
    box-shadow: 0 0 0 0.25rem rgba(66, 153, 225, 0.25) !important;
  }
  .dark-mode .form-control-readonly {
    background-color: #374151 !important;
    color: #a0aec0 !important;
  }
  .dark-mode .section-header-modern {
    border-bottom-color: #4a5568 !important;
  }
  .dark-mode .custom-checkbox-label {
    border-color: #4a5568 !important;
  }
  .dark-mode .custom-checkbox-label:hover {
    background-color: #374151 !important;
  }
  .dark-mode .custom-checkbox-display {
    border-color: #a0aec0 !important;
  }
  .dark-mode .custom-checkbox-input:checked + .custom-checkbox-display {
    background-color: #3182ce !important;
    border-color: #3182ce !important;
  }
  .dark-mode .user-type-button {
    background-color: transparent !important;
    border-color: #4a5568 !important;
    color: #cbd5e1 !important;
  }
  .dark-mode .user-type-button:hover {
    background-color: #374151 !important;
  }
  .dark-mode .user-type-button.selected {
    background-color: #3182ce !important;
    border-color: #3182ce !important;
    color: #e2e8f0 !important;
  }
  .dark-mode .modal-content {
    background-color: #2d3748 !important;
    color: #e2e8f0 !important;
  }
  .dark-mode .modal-header {
    border-bottom-color: #4a5568 !important;
  }
  .dark-mode .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%) !important;
  }
  .dark-mode .success-modal-title {
    color: #e2e8f0 !important;
  }
  .dark-mode .success-modal-message {
    color: #cbd5e1 !important;
  }
`;

// Styles
const formContainerStyle = { maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', position: 'relative' };
const backButtonStyle = { position: 'absolute', top: '20px', left: '20px', padding: '8px 15px', fontSize: '16px', color: '#007bff', backgroundColor: '#fff', border: '1px solid #007bff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'background-color 0.3s ease, color 0.3s ease' };
const backArrowStyle = { fontSize: '20px', lineHeight: '1' };
const titleStyle = { textAlign: 'center', fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '16px', fontWeight: '500', color: '#555' };
const requiredStyle = { color: 'red', marginLeft: '4px' };
const inputStyle = { padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px', outline: 'none', transition: 'border-color 0.3s ease' };
const submitButtonStyle = { padding: '12px', fontSize: '18px', fontWeight: '600', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' };
const sectionStyle = { marginTop: "20px" };
const subsectionTitleStyle = { fontSize: "18px", fontWeight: "600", color: "#333" };
const buttonGroupStyle = { display: "flex", flexWrap: "wrap", gap: "10px" };
const buttonStyle = { padding: "10px 15px", fontSize: "14px", border: "1px solid #007bff", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.3s ease, color 0.3s ease" };
const checkboxGroupStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const customCheckboxContainerStyle = { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" };
const hiddenCheckboxStyle = { display: "none" };
const customCheckboxStyle = { width: "20px", height: "20px", borderRadius: "4px", border: "2px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.3s ease, border-color 0.3s ease" };
const checkmarkStyle = { color: "#fff", fontSize: "14px", fontWeight: "bold" };
const checkboxLabelStyle = { fontSize: "16px", color: "#555" };
const successModalStyle = { textAlign: "center", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" };
const successAnimationContainerStyle = { width: "80px", height: "80px", margin: "0 auto 20px", backgroundColor: "#2ecc71", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "scaleIn 0.5s ease-in-out" };
const tickStyle = { fontSize: "40px", color: "#fff", animation: "fadeIn 0.5s ease-in-out" };
const successTitleStyle = { fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px" };
const successMessageStyle = { fontSize: "16px", color: "#555", marginBottom: "20px" };

const keyframes = `
  @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default ServicesForm;
