import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Modal, ProgressBar,Spinner } from 'react-bootstrap';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { database } from '../../firebase'; // Import your Firebase config
import { ref, push, set, update } from "firebase/database";
import { useAuth } from '../../components/AuthContext';

const JobSupportContactForm = () => {
  const navigate = useNavigate();
  const countryDropdownRef = useRef(null);
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Define the initial state for the form data
  const initialFormData = {
    service: 'Job Supporting',
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    ethnicity: '',
    // Contact Information
    address: '',
    zipCode: '',
    countryCode: '+1', // Default to USA
    mobile: '',
    email: '',
    // Employment Information
    securityClearance: '',
    clearanceLevel: '',
    willingToRelocate: '',
    workPreference: '',
    restrictedCompanies: '',
    yearsOfExperience: '', // Updated field
    // Job Preferences
    jobsToApply: '',
    technologySkills: '',
    currentSalary: '',
    expectedSalary: '',
    visaStatus: '',
    otherVisaStatus: '',
    // Education
    universityName: '',
    universityAddress: '',
    courseOfStudy: '',
    graduationFromDate: '',
    graduationToDate: '',
    // Current Employment
    currentCompany: '',
    currentDesignation: '',
    preferredInterviewTime: '',
    earliestJoiningDate: '',
    relievingDate: '',
    // References
    referenceName: '',
    referencePhone: '',
    referenceAddress: '',
    referenceEmail: '',
    referenceRole: '',
    // Job Portal Information
    jobPortalAccountNameandCredentials: '',
    // Resume Upload
    resume: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);

   const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State for the custom country code dropdown
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Function to validate all mandatory fields
  const validateForm = () => {
    const mandatoryFields = [
      'firstName', 'lastName', 'dob', 'gender', 'address', 'zipCode',
      'countryCode', 'mobile', 'email', 'securityClearance', 'willingToRelocate',
      'workPreference', 'jobsToApply', 'technologySkills', 'currentSalary',
      'expectedSalary', 'visaStatus', 'universityName', 'universityAddress',
      'courseOfStudy', 'graduationFromDate', 'graduationToDate',
      'currentCompany', 'currentDesignation', 'preferredInterviewTime',
      'earliestJoiningDate', 'relievingDate', 'resume', 'yearsOfExperience'
    ];

    for (const field of mandatoryFields) {
      if (formData[field] === '' || formData[field] === null) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        setSubmitStatus({ success: false, message: `Please fill in the '${fieldName}' field.` });
        return false;
      }
    }

    if (formData.visaStatus === 'other' && !formData.otherVisaStatus) {
      setSubmitStatus({ success: false, message: "Please specify your 'Other Visa Status'." });
      return false;
    }

    if (formData.securityClearance === 'yes' && !formData.clearanceLevel) {
      setSubmitStatus({ success: false, message: "Please specify your 'Clearance Level'." });
      return false;
    }

    if (!formData.resume) {
      setSubmitStatus({ success: false, message: 'Please upload your resume.' });
      return false;
    }

    setSubmitStatus({ success: false, message: '' }); // Clear previous error messages
    return true;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    
      setShowPreviewModal(true);
    
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const handleConfirmAndSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      setShowPreviewModal(false);
      return;
    }
    setIsSubmitting(true);
    const countryData = countryCodes.find(c => c.dialCode === formData.countryCode);
    const countryName = countryData ? countryData.name : 'N/A';

    try {
      if (!user || !user.firebaseKey) {
        throw new Error("You must be logged in to submit this form.");
      }

      // --- Start of New File Upload Logic ---
      let resumeUrl = '';
      let resumeFileName = '';
      
      // First, get a unique key for the new registration. This key will be used for both the database entry and the file path.
      const newRegistrationRef = push(ref(database, `clients/${user.firebaseKey}/serviceRegistrations`));
      const registrationKey = newRegistrationRef.key;

      if (formData.resume) {
        resumeFileName = formData.resume.name;
        // Create a unique storage path: resumes/{userId}/{registrationId}/{fileName}
        const fileRef = storageRef(getStorage(), `resumes/${user.firebaseKey}/${registrationKey}/${resumeFileName}`);
        
        // Upload the file
        const uploadResult = await uploadBytes(fileRef, formData.resume);
        
        // Get the public download URL
        resumeUrl = await getDownloadURL(uploadResult.ref);
      }

    const newServiceRegistration = {
      name: `${formData.firstName} ${formData.lastName}`,
      mobile: `${formData.countryCode} ${formData.mobile}`,
      email: formData.email,
      jobsApplyFor: formData.jobsToApply,
      registeredDate: new Date().toISOString().split('T')[0],
      country: countryName,
      visaStatus: formData.visaStatus === 'other' ? formData.otherVisaStatus : formData.visaStatus,
      paymentStatus: 'Pending',
      assignmentStatus: 'registered',
      service: formData.service,
      assignedManager: '',
      subServices: [],
      userType: 'Individual',
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      ethnicity: formData.ethnicity,
      address: formData.address,
      zipCode: formData.zipCode,
      securityClearance: formData.securityClearance,
      clearanceLevel: formData.clearanceLevel,
      willingToRelocate: formData.willingToRelocate,
      workPreference: formData.workPreference,
      restrictedCompanies: formData.restrictedCompanies,
      yearsOfExperience: formData.yearsOfExperience, // Use the direct string value
      technologySkills: formData.technologySkills.split(',').map(s => s.trim()),
      currentSalary: formData.currentSalary,
      expectedSalary: formData.expectedSalary,
      schoolName: formData.universityName,
      schoolAddress: formData.universityAddress,
      courseOfStudy: formData.courseOfStudy,
      graduationDate: formData.graduationToDate,
      currentCompany: formData.currentCompany,
      currentDesignation: formData.currentDesignation,
      preferredInterviewTime: formData.preferredInterviewTime,
      earliestJoiningDate: formData.earliestJoiningDate,
      relievingDate: formData.relievingDate,
      referenceName: formData.referenceName,
      referencePhone: formData.referencePhone,
      referenceAddress: formData.referenceAddress,
      referenceEmail: formData.referenceEmail,
      referenceRole: formData.referenceRole,
      jobPortalAccountName: formData.jobPortalAccountNameandCredentials,
    };
    const clientProfileUpdate = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: `${formData.countryCode} ${formData.mobile}`,
            email: formData.email,
        };
            
            
            await set(newRegistrationRef, newServiceRegistration);
            
            // 2. Update the main client profile with the latest contact info
            const clientProfileRef = ref(database, `clients/${user.firebaseKey}`);
            await update(clientProfileRef, clientProfileUpdate);
            
            console.log("Job Support registration saved successfully.");
             setShowSuccessModal(true);
      // Set a timeout to close the modal and navigate to the homepage
      setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/");
      }, 3000);
        } catch (error) {
            setSubmitStatus({ success: false, message: 'Submission failed. Please try again.' });
            console.error("Failed to save to Firebase", error);
        } finally {
            setIsSubmitting(false);
            setShowPreviewModal(false);
        }
  };

  const countryCodes = [ { shortCode: 'US', dialCode: '+1', name: 'United States' }, { shortCode: 'CA', dialCode: '+1', name: 'Canada' }, { shortCode: 'GB', dialCode: '+44', name: 'United Kingdom' }, { shortCode: 'IN', dialCode: '+91', name: 'India' }, { shortCode: 'AU', dialCode: '+61', name: 'Australia' }, { shortCode: 'DE', dialCode: '+49', name: 'Germany' }, { shortCode: 'FR', dialCode: '+33', name: 'France' }, { shortCode: 'JP', dialCode: '+81', name: 'Japan' }, { shortCode: 'CN', dialCode: '+86', name: 'China' }, { shortCode: 'BR', dialCode: '+55', name: 'Brazil' }, { shortCode: 'ZA', dialCode: '+27', name: 'South Africa' }, { shortCode: 'MX', dialCode: '+52', name: 'Mexico' }, { shortCode: 'ES', dialCode: '+34', name: 'Spain' }, { shortCode: 'IT', dialCode: '+39', name: 'Italy' }, { shortCode: 'NL', dialCode: '+31', name: 'Netherlands' }, { shortCode: 'SE', dialCode: '+46', name: 'Sweden' }, { shortCode: 'NO', dialCode: '+47', name: 'Norway' }, { shortCode: 'DK', dialCode: '+45', name: 'Denmark' }, { shortCode: 'FI', dialCode: '+358', name: 'Finland' }, { shortCode: 'CH', dialCode: '+41', name: 'Switzerland' }, { shortCode: 'AT', dialCode: '+43', name: 'Austria' }, { shortCode: 'BE', dialCode: '+32', name: 'Belgium' }, { shortCode: 'IE', dialCode: '+353', name: 'Ireland' }, { shortCode: 'NZ', dialCode: '+64', name: 'New Zealand' }, { shortCode: 'SG', dialCode: '+65', name: 'Singapore' }, { shortCode: 'HK', dialCode: '+852', name: 'Hong Kong' }, { shortCode: 'KR', dialCode: '+82', name: 'South Korea' }, { shortCode: 'AE', dialCode: '+971', name: 'United Arab Emirates' }, { shortCode: 'SA', dialCode: '+966', name: 'Saudi Arabia' }, { shortCode: 'RU', dialCode: '+7', name: 'Russia' }, ];
  const filteredCountries = countryCodes.filter(country => country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) || country.dialCode.includes(countrySearchTerm));
  useEffect(() => { const handleClickOutside = (event) => { if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) { setIsCountryDropdownOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);

  const nextStep = () => {
    setCurrentStep(prev => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  };

  const containerStyle = { backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginTop: '50px', marginBottom: '50px', position: 'relative' };
  const formHeaderStyle = { color: '#007bff', marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' };
  const subHeaderStyle = { color: '#007bff', marginBottom: '1rem' };
  const inputControlStyle = { borderRadius: '5px', border: '1px solid #29629b', padding: '0.4rem 0.6rem', fontSize: '0.95rem' };
  const previewButtonStyle = { backgroundColor: '#007bff', borderColor: '#007bff', color: 'white', fontSize: '1.2rem', padding: '10px 20px', borderRadius: '8px', transition: 'background-color 0.3s ease, transform 0.3s ease', flexGrow: 1, marginRight: '10px' };
  const backButtonStyle = { position: 'absolute', top: '20px', left: '20px', backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', zIndex: 10 };
  const previewModalContentStyle = { maxHeight: '70vh', overflowY: 'auto', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' };
  const previewValueDisplay = { padding: '0.4rem 0.6rem', fontSize: '0.95rem', backgroundColor: '#e9ecef', borderRadius: '5px', border: '1px solid #ced4da', minHeight: '38px', display: 'flex', alignItems: 'center', wordBreak: 'break-word' };
  const previewTextAreaDisplay = { ...previewValueDisplay, minHeight: '80px', alignItems: 'flex-start' };

   const modernStyles = `
    .job-support-form-wrapper {
      background: #f8f9fa; /* Light grey background for the whole page */
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      font-family: 'Inter', sans-serif;
    }

    .form-container-modern {
      background-color: #ffffff;
      padding: 2rem 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      margin-top: 50px;
      margin-bottom: 50px;
      position: relative;
      width: 100%;
      max-width: 900px; /* Wider for better layout */
    }

    .back-button-modern {
      position: absolute;
      top: 20px;
      left: 20px;
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
      color: #f7f7f7ff;
    }

    .form-header-modern {
      color: #212529;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
    }
    
    .progress-bar-modern .progress-bar {
      background-color: #0d6efd;
      font-weight: 600;
      transition: width 0.4s ease-in-out;
    }

    .step-section {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .step-header-modern {
      color: #0d6efd;
      margin-bottom: 1.5rem;
      font-weight: 600;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0.75rem;
    }

    .form-label-modern {
      font-weight: 500;
      color: #495057;
    }

    .form-control-modern, .form-select-modern {
      border-radius: 8px;
      border: 1px solid #ced4da;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .form-control-modern:focus, .form-select-modern:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      outline: none;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .nav-button {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 50px; /* Pill shape */
      border: 1px solid;
      transition: all 0.3s ease;
    }
    .nav-button.prev {
      background-color: transparent;
      border-color: #6c757d;
      color: #6c757d;
    }
    .nav-button.prev:hover {
      background-color: #6c757d;
      color: white;
    }
    .nav-button.next {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
      margin-left: auto; /* Push to the right */
    }
    .nav-button.next:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
      transform: translateY(-2px);
    }
    .nav-button.preview {
      background: linear-gradient(45deg, #198754, #157347);
      border-color: #198754;
      color: white;
      margin-left: auto; /* Push to the right */
    }
    .nav-button.preview:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(25, 135, 84, 0.3);
    }

    /* Custom Dropdown for Country Code */
    .country-dropdown-search {
      padding: 0.5rem;
      border-bottom: 1px solid #e9ecef;
    }
  `;

  return (
   <>
      <style>{modernStyles}</style>
      <div className="job-support-form-wrapper">
        <Container className="form-container-modern">
          <Button className="back-button-modern" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </Button>
        <h2 style={formHeaderStyle}>Job Support Contact Form</h2>
         <div className="mb-4">
          <ProgressBar now={(currentStep / totalSteps) * 100} label={`Step ${currentStep} of ${totalSteps}`} />
        </div>
        <Form id="contact-form" onSubmit={handlePreview}>
          <input type="hidden" name="service" value={formData.service} />

           {/* Step 1: Personal & Contact Information */}
          {currentStep === 1 && (
            <section className="step-section">
          <h4 className="step-header-modern">Step 1: Personal & Contact Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formFirstName"><Form.Label>First Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="firstName" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formMiddleName"><Form.Label>Middle Name</Form.Label><Form.Control type="text" name="middleName" onChange={handleChange} style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formLastName"><Form.Label>Last Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="lastName" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formDob"><Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label><Form.Control type="date" name="dob" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formGender"><Form.Label>Gender <span className="text-danger">*</span></Form.Label><Form.Select name="gender" onChange={handleChange} required style={inputControlStyle}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option></Form.Select></Form.Group>
            <Form.Group as={Col} controlId="formEthnicity"><Form.Label>Ethnicity</Form.Label><Form.Control type="text" name="ethnicity" onChange={handleChange} style={inputControlStyle} /></Form.Group>
          </Row>

          {/* Contact Information */}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formAddress"><Form.Label>Address <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="address" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} md={4} controlId="formZipCode"><Form.Label>Zip Code <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="zipCode" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCountryCode" ref={countryDropdownRef}>
                <Form.Label>Country Code <span className="text-danger">*</span></Form.Label>
                <div style={{ position: 'relative' }}>
                    <Form.Control type="text" value={isCountryDropdownOpen ? countrySearchTerm : `${countryCodes.find(c => c.dialCode === formData.countryCode)?.name || ''} (${formData.countryCode})`} onFocus={() => setIsCountryDropdownOpen(true)} onChange={(e) => setCountrySearchTerm(e.target.value)} placeholder="Search country..." style={inputControlStyle} />
                    {isCountryDropdownOpen && ( <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}> {filteredCountries.map((country, index) => ( <div key={index} style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => { setFormData(prev => ({...prev, countryCode: country.dialCode})); setCountrySearchTerm(''); setIsCountryDropdownOpen(false); }}> {country.name} ({country.dialCode}) </div> ))} </div> )}
                </div>
            </Form.Group>
            <Form.Group as={Col} controlId="formMobile"><Form.Label>Mobile <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="mobile" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formEmail"><Form.Label>Email <span className="text-danger">*</span></Form.Label><Form.Control type="email" name="email" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
          </Row>
          </section>
          )}

           {/* Step 2: Employment & Job Preferences */}
          {currentStep === 2 && (
            <section className="step-section">
                <h4 className="step-header-modern">Step 2: Employment & Job Preferences</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formSecurityClearance"><Form.Label>Security Clearance <span className="text-danger">*</span></Form.Label><Form.Select name="securityClearance" value={formData.securityClearance} onChange={handleChange}  style={inputControlStyle}><option value="">Select Option</option><option value="yes">Yes</option><option value="no">No</option></Form.Select></Form.Group>
            {formData.securityClearance === 'yes' && (<Form.Group as={Col} controlId="formClearanceLevel"><Form.Label>Clearance Level <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="clearanceLevel" value={formData.clearanceLevel} onChange={handleChange}  style={inputControlStyle} /></Form.Group>)}
            <Form.Group as={Col} controlId="formWillingToRelocate"><Form.Label>Willing to Relocate <span className="text-danger">*</span></Form.Label><Form.Select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange}  style={inputControlStyle}><option value="">Select Option</option><option value="yes">Yes</option><option value="no">No</option></Form.Select></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md={6} controlId="formWorkPreference"><Form.Label>Work Preference <span className="text-danger">*</span></Form.Label><Form.Select name="workPreference" value={formData.workPreference} onChange={handleChange}  style={inputControlStyle}><option value="">Select Preference</option><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></Form.Select></Form.Group>
            <Form.Group as={Col} md={6} controlId="formYearsOfExperience">
                <Form.Label>Years of Experience <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="yearsOfExperience" placeholder="Experience in years" value={formData.yearsOfExperience} onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
          </Row>
           <Row className="mb-3">
            <Form.Group as={Col} controlId="formRestrictedCompanies"><Form.Label>Restricted Companies</Form.Label><Form.Control type="text" name="restrictedCompanies" value={formData.restrictedCompanies} onChange={handleChange} style={inputControlStyle} /></Form.Group>
          </Row>

          {/* Job Preferences */}
          <Row className="mb-3">
             <Form.Group as={Col} controlId="formJobsToApply"><Form.Label>Jobs to Apply For <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="jobsToApply" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formTechnologySkills"><Form.Label>Technology Skills <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="technologySkills" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentSalary"><Form.Label>Current Salary <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="currentSalary" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formExpectedSalary"><Form.Label>Expected Salary <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="expectedSalary" onChange={handleChange} required style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formVisaStatus"><Form.Label>Visa Status <span className="text-danger">*</span></Form.Label><Form.Select name="visaStatus" onChange={handleChange} required style={inputControlStyle}><option value="">Select Status</option><option value="us_citizen">US Citizen</option><option value="green_card">Green Card</option><option value="h1b">H1B</option><option value="opt">OPT</option><option value="cpt">CPT</option><option value="other">Other</option></Form.Select></Form.Group>
            {formData.visaStatus === 'other' && (<Form.Group as={Col} controlId="formOtherVisaStatus"><Form.Label>Please specify <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="otherVisaStatus" onChange={handleChange} required style={inputControlStyle} /></Form.Group>)}
          </Row>
          </section>
          )}

          {/* Step 3: Education & Current Employment */}
          {currentStep === 3 && (
             <section className="step-section">
                <h4 className="step-header-modern">Step 3: Education & Current Employment</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formUniversityName"><Form.Label>University Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="universityName" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formUniversityAddress"><Form.Label>University Address <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="universityAddress" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formCourseOfStudy"><Form.Label>Course of Study <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="courseOfStudy" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGraduationFromDate"><Form.Label>Graduation From Date <span className="text-danger">*</span></Form.Label><Form.Control type="date" name="graduationFromDate" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formGraduationToDate"><Form.Label>Graduation To Date <span className="text-danger">*</span></Form.Label><Form.Control type="date" name="graduationToDate" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
          </Row>

          {/* Current Employment */}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentCompany"><Form.Label>Current Company <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="currentCompany" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formCurrentDesignation"><Form.Label>Current Designation <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="currentDesignation" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formPreferredInterviewTime"><Form.Label>Preferred Interview Time <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="preferredInterviewTime" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formEarliestJoiningDate"><Form.Label>Earliest Joining Date <span className="text-danger">*</span></Form.Label><Form.Control type="date" name="earliestJoiningDate" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formRelievingDate"><Form.Label>Relieving Date <span className="text-danger">*</span></Form.Label><Form.Control type="date" name="relievingDate" onChange={handleChange}  style={inputControlStyle} /></Form.Group>
          </Row>
           </section>
          )}

           {/* Step 4: References */}
          {currentStep === 4 && (
            <section className="step-section">
                <h4 className="step-header-modern">Step 4: References (Optional)</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceName"><Form.Label>Reference Name (Optional)</Form.Label><Form.Control type="text" name="referenceName" onChange={handleChange} style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formReferencePhone"><Form.Label>Reference Phone (Optional)</Form.Label><Form.Control type="text" name="referencePhone" onChange={handleChange} style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formReferenceAddress"><Form.Label>Reference Address (Optional)</Form.Label><Form.Control type="text" name="referenceAddress" onChange={handleChange} style={inputControlStyle} /></Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceEmail"><Form.Label>Reference Email (Optional)</Form.Label><Form.Control type="email" name="referenceEmail" onChange={handleChange} style={inputControlStyle} /></Form.Group>
            <Form.Group as={Col} controlId="formReferenceRole"><Form.Label>Reference Role (Optional)</Form.Label><Form.Control type="text" name="referenceRole" onChange={handleChange} style={inputControlStyle} /></Form.Group>
          </Row>
          </section>
          )}

          {/* Step 5: Job Portal & Resume */}
          {currentStep === 5 && (
             <section className="step-section">
                <h4 className="step-header-modern">Step 5: Job Portal & Resume</h4>
          <Form.Group controlId="formJobPortalCredentials" className="mb-3"><Form.Label>Job Portal Account Name & Credentials (Optional)</Form.Label><Form.Control name="jobPortalAccountNameandCredentials" onChange={handleChange} as="textarea" rows={2} style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }} /></Form.Group>

          {/* Upload Resume Section */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Upload Resume</h4>
          <Form.Group controlId="formResume" className="mb-3"><Form.Label>Upload Your Resume <span className="text-danger">*</span></Form.Label><Form.Control type="file" name="resume" onChange={handleChange} required style={inputControlStyle} accept=".pdf,.doc,.docx" /><Form.Text className="text-muted">Please upload your resume in PDF, DOC, or DOCX format.</Form.Text></Form.Group>
          </section>
          )}

           {/* MODIFICATION: Navigation Buttons */}
          <div className="navigation-buttons">
            {currentStep > 1 && (
              <Button className="nav-button prev" onClick={prevStep}>Previous</Button>
            )}
            {currentStep < totalSteps && (
              <Button className="nav-button next" onClick={nextStep}>Next</Button>
            )}
            {currentStep === totalSteps && (
              <Button type="submit" className="nav-button" disabled={isSubmitting}>Preview & Submit</Button>
            )}
          </div>
        </Form>
      </Container>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={handleClosePreviewModal} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Preview Your Details</Modal.Title></Modal.Header>
        <Modal.Body style={previewModalContentStyle}>
          {/* Personal Information Preview */}
          <h4 className="border-bottom pb-2 mb-3" style={subHeaderStyle}>Personal Information</h4>
          <Row className="mb-3"><Col><Form.Label>First Name:</Form.Label><div style={previewValueDisplay}>{formData.firstName || 'N/A'}</div></Col><Col><Form.Label>Middle Name:</Form.Label><div style={previewValueDisplay}>{formData.middleName || 'N/A'}</div></Col><Col><Form.Label>Last Name:</Form.Label><div style={previewValueDisplay}>{formData.lastName || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Date of Birth:</Form.Label><div style={previewValueDisplay}>{formData.dob || 'N/A'}</div></Col><Col><Form.Label>Gender:</Form.Label><div style={previewValueDisplay}>{formData.gender || 'N/A'}</div></Col><Col><Form.Label>Ethnicity:</Form.Label><div style={previewValueDisplay}>{formData.ethnicity || 'N/A'}</div></Col></Row>
          
          {/* Contact Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Contact Information</h4>
          <Row className="mb-3"><Col><Form.Label>Address:</Form.Label><div style={previewValueDisplay}>{formData.address || 'N/A'}</div></Col><Col md={4}><Form.Label>Zip Code:</Form.Label><div style={previewValueDisplay}>{formData.zipCode || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Country:</Form.Label><div style={previewValueDisplay}>{countryCodes.find(c => c.dialCode === formData.countryCode)?.name || 'N/A'} ({formData.countryCode || 'N/A'})</div></Col><Col><Form.Label>Mobile:</Form.Label><div style={previewValueDisplay}>{formData.mobile || 'N/A'}</div></Col><Col><Form.Label>Email:</Form.Label><div style={previewValueDisplay}>{formData.email || 'N/A'}</div></Col></Row>
          
          {/* Employment Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Employment Information</h4>
          <Row className="mb-3"><Col><Form.Label>Security Clearance:</Form.Label><div style={previewValueDisplay}>{formData.securityClearance || 'N/A'}</div></Col>{formData.securityClearance === 'yes' && (<Col><Form.Label>Clearance Level:</Form.Label><div style={previewValueDisplay}>{formData.clearanceLevel || 'N/A'}</div></Col>)}<Col><Form.Label>Willing to Relocate:</Form.Label><div style={previewValueDisplay}>{formData.willingToRelocate || 'N/A'}</div></Col></Row>
          <Row className="mb-3">
              <Col><Form.Label>Work Preference:</Form.Label><div style={previewValueDisplay}>{formData.workPreference || 'N/A'}</div></Col>
              <Col><Form.Label>Years of Experience:</Form.Label><div style={previewValueDisplay}>{formData.yearsOfExperience || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Restricted Companies:</Form.Label><div style={previewValueDisplay}>{formData.restrictedCompanies || 'N/A'}</div></Col>
          </Row>

          {/* Job Preferences Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Preferences</h4>
          <Row className="mb-3"><Col><Form.Label>Jobs to Apply For:</Form.Label><div style={previewValueDisplay}>{formData.jobsToApply || 'N/A'}</div></Col><Col><Form.Label>Technology Skills:</Form.Label><div style={previewValueDisplay}>{formData.technologySkills || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Current Salary:</Form.Label><div style={previewValueDisplay}>{formData.currentSalary || 'N/A'}</div></Col><Col><Form.Label>Expected Salary:</Form.Label><div style={previewValueDisplay}>{formData.expectedSalary || 'N/A'}</div></Col><Col><Form.Label>Visa Status:</Form.Label><div style={previewValueDisplay}>{formData.visaStatus || 'N/A'}</div></Col>{formData.visaStatus === 'other' && (<Col><Form.Label>Please specify:</Form.Label><div style={previewValueDisplay}>{formData.otherVisaStatus || 'N/A'}</div></Col>)}</Row>
          
          {/* Education Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
          <Row className="mb-3"><Col><Form.Label>University Name:</Form.Label><div style={previewValueDisplay}>{formData.universityName || 'N/A'}</div></Col><Col><Form.Label>University Address:</Form.Label><div style={previewValueDisplay}>{formData.universityAddress || 'N/A'}</div></Col><Col><Form.Label>Course of Study:</Form.Label><div style={previewValueDisplay}>{formData.courseOfStudy || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Graduation From Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationFromDate || 'N/A'}</div></Col><Col><Form.Label>Graduation To Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationToDate || 'N/A'}</div></Col></Row>
          
          {/* Current Employment Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Current Employment</h4>
          <Row className="mb-3"><Col><Form.Label>Current Company:</Form.Label><div style={previewValueDisplay}>{formData.currentCompany || 'N/A'}</div></Col><Col><Form.Label>Current Designation:</Form.Label><div style={previewValueDisplay}>{formData.currentDesignation || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Preferred Interview Time:</Form.Label><div style={previewValueDisplay}>{formData.preferredInterviewTime || 'N/A'}</div></Col><Col><Form.Label>Earliest Joining Date:</Form.Label><div style={previewValueDisplay}>{formData.earliestJoiningDate || 'N/A'}</div></Col><Col><Form.Label>Relieving Date:</Form.Label><div style={previewValueDisplay}>{formData.relievingDate || 'N/A'}</div></Col></Row>
          
          {/* References Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>References</h4>
          <Row className="mb-3"><Col><Form.Label>Reference Name:</Form.Label><div style={previewValueDisplay}>{formData.referenceName || 'N/A'}</div></Col><Col><Form.Label>Reference Phone:</Form.Label><div style={previewValueDisplay}>{formData.referencePhone || 'N/A'}</div></Col><Col><Form.Label>Reference Address:</Form.Label><div style={previewValueDisplay}>{formData.referenceAddress || 'N/A'}</div></Col></Row>
          <Row className="mb-3"><Col><Form.Label>Reference Email:</Form.Label><div style={previewValueDisplay}>{formData.referenceEmail || 'N/A'}</div></Col><Col><Form.Label>Reference Role:</Form.Label><div style={previewValueDisplay}>{formData.referenceRole || 'N/A'}</div></Col></Row>
          
          {/* Job Portal Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Portal Information</h4>
          <Form.Group controlId="previewJobPortalCredentials" className="mb-3"><Form.Label>Job Portal Account Name & Credentials:</Form.Label><div style={previewTextAreaDisplay}>{formData.jobPortalAccountNameandCredentials || 'N/A'}</div></Form.Group>
          
          {/* Resume Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Uploaded Resume</h4>
          <Form.Group controlId="previewResume" className="mb-3"><Form.Label>Resume File Name:</Form.Label><div style={previewValueDisplay}>{formData.resume ? formData.resume.name : 'N/A'}</div></Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreviewModal}>Edit</Button>
         <Button variant="primary" onClick={handleConfirmAndSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span style={{ marginLeft: '8px' }}>Submitting...</span>
              </>
            ) : (
              'Confirm & Submit'
            )}
          </Button>        </Modal.Footer>
      </Modal>

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
    </>
  );
};

const successModalStyle = { textAlign: "center", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" };
const successAnimationContainerStyle = { width: "80px", height: "80px", margin: "0 auto 20px", backgroundColor: "#2ecc71", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "scaleIn 0.5s ease-in-out" };
const tickStyle = { fontSize: "40px", color: "#fff", animation: "fadeIn 0.5s ease-in-out" };
const successTitleStyle = { fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "10px" };
const successMessageStyle = { fontSize: "16px", color: "#555", marginBottom: "20px" };

// You may need to add these keyframes to your existing modernStyles string or a new <style> tag if they aren't already global.
const keyframes = `
  @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default JobSupportContactForm;
