import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { database } from '../../firebase'; // Import your Firebase config
import { ref, push, set } from "firebase/database";

const ServicesForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
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
        
        const newClient = {
            id: new Date().getTime(),
            name: `${formData.firstName} ${formData.lastName}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobile,
            email: formData.email,
            service: readOnlyService,
            subServices: formData.selectedServices,
            userType: formData.userType,
            registeredDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            displayStatuses: ['registered'],
            paymentStatus: 'Pending',
            country: 'N/A', // Default value
            jobsApplyFor: '', // Not applicable for this form
        };

          try {
            // Get a reference to the 'clients' node in your database
            const clientsRef = ref(database, 'clients');
            // push() creates a new unique key for the client data
            const newClientRef = push(clientsRef);
            // set() saves the new client data to that location
            await set(newClientRef, newClient);

            console.log('Form data saved to Firebase successfully:', newClient);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/"); // Navigate to home page after 3 seconds
            }, 3000);

        } catch (error) {
            console.error("Failed to save to Firebase", error);
            // Optionally, show an error message to the user
            alert("Submission failed. Please try again.");
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

    return (
        <div style={formContainerStyle}>
            <button onClick={handleBackClick} style={backButtonStyle}>
                <span style={backArrowStyle}>&larr;</span> Back
            </button>
            <h2 style={titleStyle}>Application Form</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                    <label htmlFor="firstName" style={labelStyle}>First Name <span style={requiredStyle}>*</span></label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="lastName" style={labelStyle}>Last Name <span style={requiredStyle}>*</span></label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="mobile" style={labelStyle}>Mobile<span style={requiredStyle}>*</span></label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>Email ID <span style={requiredStyle}>*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="service" style={labelStyle}>Service <span style={requiredStyle}>*</span></label>
                    <input type="text" id="service" name="service" value={readOnlyService} readOnly style={{ ...inputStyle, backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}/>
                </div>
                <div style={sectionStyle}>
                    <h3 style={subsectionTitleStyle}>What service do you want?</h3>
                    {readOnlyService && (
                        <div style={checkboxGroupStyle}>
                            {serviceMapping[readOnlyService]?.map((service) => (
                                <label key={service} style={customCheckboxContainerStyle}>
                                    <input type="checkbox" id={service} name="selectedServices" value={service} checked={formData.selectedServices?.includes(service)} onChange={(e) => handleServiceChange(e, service)} style={hiddenCheckboxStyle} />
                                    <span style={{ ...customCheckboxStyle, backgroundColor: formData.selectedServices?.includes(service) ? "#007bff" : "#fff", borderColor: formData.selectedServices?.includes(service) ? "#007bff" : "#ccc", }}>
                                        {formData.selectedServices?.includes(service) && <span style={checkmarkStyle}>✔</span>}
                                    </span>
                                    <span style={checkboxLabelStyle}>{service}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div style={sectionStyle}>
                    <h3 style={subsectionTitleStyle}>Who are you?</h3>
                    <div style={buttonGroupStyle}>
                        {roles.map((role) => (
                            <button key={role} type="button" onClick={() => handleUserTypeChange(role)} style={{ ...buttonStyle, backgroundColor: formData.userType === role ? "#007bff" : "#fff", color: formData.userType === role ? "#fff" : "#007bff", }}>
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <button type="submit" style={submitButtonStyle}>Submit</button>
                </div>
            </form>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton />
                <Modal.Body style={successModalStyle}>
                    <div style={successAnimationContainerStyle}>
                        <span style={tickStyle}>✅</span>
                    </div>
                    <h4 style={successTitleStyle}>Form Successfully Submitted!</h4>
                    <p style={successMessageStyle}>Your form has been submitted successfully.</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

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
