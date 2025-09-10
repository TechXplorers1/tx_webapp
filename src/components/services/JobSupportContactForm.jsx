import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Modal, ProgressBar, Spinner } from 'react-bootstrap';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { database } from '../../firebase';
import { ref, push, set, update } from "firebase/database";
import { useAuth } from '../../components/AuthContext';



const JobSupportContactForm = () => {
  const navigate = useNavigate();
  const countryDropdownRef = useRef(null);
  const resumeInputRef = useRef(null);
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
    county: '', // NEW: New 'County' field
    zipCode: '',
    countryCode: '+1',
    mobile: '',
    email: '',
    // Employment Information
    securityClearance: '',
    clearanceLevel: '',
    willingToRelocate: '',
    workPreference: '',
    restrictedCompanies: '',
    yearsOfExperience: '',
    // Job Preferences
    jobsToApply: '', // Changed to be a textarea
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
    noticePeriod: '',
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
    coverLetter: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  
  // NEW: State for validation errors
  const [validationErrors, setValidationErrors] = useState({});
    
  // FIX: Separate state for file objects to preserve them across steps
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setResumeFile(files[0] || null); // FIX: Update new state for resume
    } else if (name === "coverLetter") {
      setCoverLetterFile(files[0] || null); // FIX: Update new state for cover letter
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

      const handleViewDashboard = () => {
        navigate('/clientdashboard');
    };

  // NEW: Refactored validateForm to handle all steps and show field-specific errors
  const validateForm = (step) => {
    const errors = {};
    let isValid = true;

    // Validation for Step 1
     if (step === 1) {
        const mandatoryFields = ['firstName', 'lastName'];
        mandatoryFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = 'This field is required.';
                isValid = false;
            }
        });

           if (formData.dob) {
            const selectedDate = new Date(formData.dob);
            const today = new Date();
            // Normalize dates to remove time component for accurate comparison
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate >= today) {
                errors.dob = 'Please select a valid DOB.';
                isValid = false;
            }
        }

      // Simple mobile number validation
      const mobileNumber = formData.mobile.replace(/[^0-9]/g, '');
      const countryCode = formData.countryCode.replace('+', '');
      const countryData = countryCodes.find(c => c.dialCode === formData.countryCode);
      const expectedLength = countryData ? countryData.dialCode.length + mobileNumber.length : 10;
      
      if (formData.mobile && (mobileNumber.length < 7 || mobileNumber.length > 15)) {
            errors.mobile = 'Please enter a valid mobile number.';
            isValid = false;
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address.';
            isValid = false;
        }
    }

    // Validation for Step 2
  if (step === 2) {
        const mandatoryFields = [];
        mandatoryFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = 'This field is required.';
                isValid = false;
            }
        });
        if (formData.securityClearance === 'yes' && !formData.clearanceLevel) {
            errors.clearanceLevel = "Please specify your clearance level.";
            isValid = false;
        }
        if (formData.visaStatus === 'other' && !formData.otherVisaStatus) {
            errors.otherVisaStatus = "Please specify your visa status.";
            isValid = false;
        }
    }

    // NEW: Validation for Step 3
    if (step === 3) {
        const mandatoryFields = [];
        mandatoryFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = 'This field is required.';
                isValid = false;
            }
        });
        if (formData.graduationFromDate && formData.graduationToDate) {
            const fromDate = new Date(formData.graduationFromDate);
            const toDate = new Date(formData.graduationToDate);
            if (toDate <= fromDate) {
                errors.graduationToDate = "To date must be greater than From date.";
                isValid = false;
            }
        }
    }

    // Validation for Step 5
    if (step === 5) {
      // FIX: Check the dedicated file state, not formData
      if (!resumeFile) {
        errors.resume = "Please upload your resume.";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };


  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm(totalSteps)) { // Validate final step before preview
      setShowPreviewModal(true);
    } else {
      setSubmitStatus({ success: false, message: 'Please fix the errors in the form before submitting.' });
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const handleConfirmAndSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm(totalSteps)) {
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

       let resumeUrl = '';
        let resumeFileName = '';
        let coverLetterUrl = '';
        let coverLetterFileName = '';
      
      const newRegistrationRef = push(ref(database, `clients/${user.firebaseKey}/serviceRegistrations`));
      const registrationKey = newRegistrationRef.key;

      // FIX: Use the resumeFile state for upload
      if (resumeFile) {
        resumeFileName = resumeFile.name;
        const fileRef = storageRef(getStorage(), `resumes/${user.firebaseKey}/${registrationKey}/${resumeFileName}`);
        
        const uploadResult = await uploadBytes(fileRef, resumeFile);
        resumeUrl = await getDownloadURL(uploadResult.ref);
      }

       if (coverLetterFile) {
            coverLetterFileName = coverLetterFile.name;
            const fileRef = storageRef(getStorage(), `coverletters/${user.firebaseKey}/${registrationKey}/${coverLetterFileName}`);
            const uploadResult = await uploadBytes(fileRef, coverLetterFile);
            coverLetterUrl = await getDownloadURL(uploadResult.ref);
        }

    const newServiceRegistration = {
         service: 'Job Supporting',
            registeredDate: new Date().toISOString().split('T')[0],
            paymentStatus: 'Pending',
            assignmentStatus: 'registered',
            assignedManager: '',

            // Personal Information
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            ethnicity: formData.ethnicity,
            
            // Contact Information
            address: formData.address,
            county: formData.county,
            zipCode: formData.zipCode,
            country: countryName,
            mobile: `${formData.countryCode} ${formData.mobile}`,
            email: formData.email,

            // Employment Information
            securityClearance: formData.securityClearance,
            clearanceLevel: formData.clearanceLevel,
            willingToRelocate: formData.willingToRelocate,
            workPreference: formData.workPreference,
            restrictedCompanies: formData.restrictedCompanies,
            yearsOfExperience: formData.yearsOfExperience,

            // Job Preferences
            jobsToApply: formData.jobsToApply,
            currentSalary: formData.currentSalary,
            expectedSalary: formData.expectedSalary,
            visaStatus: formData.visaStatus === 'other' ? formData.otherVisaStatus : formData.visaStatus,
            otherVisaStatus: formData.visaStatus === 'other' ? formData.otherVisaStatus : '',

            // Education
            universityName: formData.universityName,
            universityAddress: formData.universityAddress,
            courseOfStudy: formData.courseOfStudy,
            graduationFromDate: formData.graduationFromDate,
            graduationToDate: formData.graduationToDate,
            noticePeriod: formData.noticePeriod,

            // Current Employment
            currentCompany: formData.currentCompany,
            currentDesignation: formData.currentDesignation,
            preferredInterviewTime: formData.preferredInterviewTime,
            earliestJoiningDate: formData.earliestJoiningDate,
            relievingDate: formData.relievingDate,
            
            // References
            referenceName: formData.referenceName,
            referencePhone: formData.referencePhone,
            referenceAddress: formData.referenceAddress,
            referenceEmail: formData.referenceEmail,
            referenceRole: formData.referenceRole,

            // Job Portal Information
            jobPortalAccountNameandCredentials: formData.jobPortalAccountNameandCredentials,
            
            // Documents
            resumeUrl: resumeUrl,
            resumeFileName: resumeFileName,
            coverLetterUrl: coverLetterUrl,
            coverLetterFileName: coverLetterFileName,
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
 setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
      setShowSuccessModal(true);
      setFormData(initialFormData);
       setResumeFile(null); // Reset file states
        setCoverLetterFile(null);
      // setTimeout(() => {
      //     setShowSuccessModal(false);
      //     navigate("/");
      // }, 3000);
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
    if (validateForm(currentStep)) {
      setCurrentStep(prev => (prev < totalSteps ? prev + 1 : prev));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
    setValidationErrors({}); // Clear errors when going back
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

// In JobSupportContactForm.jsx, REPLACE your existing `modernStyles` variable with this one.

  // In JobSupportContactForm.jsx, REPLACE your existing `modernStyles` variable with this one.

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

    .form-label { /* Applied to all Form.Label components */
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control, .form-select { /* Applied to all Form.Control and Form.Select */
      border-radius: 8px;
      border: 1px solid #ced4da;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
    }
    .form-control:focus, .form-select:focus {
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
    .country-dropdown-container {
      position: relative;
    }
    .country-dropdown-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ced4da;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .country-dropdown-item {
      padding: 8px 12px;
      cursor: pointer;
    }
    .country-dropdown-item:hover {
      background-color: #f0f0f0;
    }
    .country-dropdown-search {
      padding: 0.5rem;
      border-bottom: 1px solid #e9ecef;
    }
    .country-dropdown-search input {
      width: 100%;
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 6px;
    }
    
    /* --- DARK MODE STYLES --- */
    .dark-mode .job-support-form-wrapper {
        background: #1a202c !important;
    }
    .dark-mode .form-container-modern {
        background-color: #2d3748 !important;
        color: #e2e8f0 !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    }
    .dark-mode .back-button-modern,
    .dark-mode .form-header-modern,
    .dark-mode .step-header-modern,
    .dark-mode .form-label {
        color: #e2e8f0 !important;
    }
    .dark-mode .form-control,
    .dark-mode .form-select {
        background-color: #1f2937 !important;
        color: #e2e8f0 !important;
        border-color: #4a5568 !important;
    }
    .dark-mode .form-control::placeholder {
        color: #a0aec0 !important;
    }
    .dark-mode .form-control:focus,
    .dark-mode .form-select:focus {
        border-color: #4299e1 !important;
        box-shadow: 0 0 0 0.25rem rgba(66, 153, 225, 0.25) !important;
    }
    .dark-mode .form-select {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23a0aec0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
    }
    .dark-mode .progress-bar-modern .progress {
        background-color: #4a5568 !important;
    }
    .dark-mode .navigation-buttons,
    .dark-mode .step-header-modern {
        border-color: #4a5568 !important;
    }
    .dark-mode .nav-button.prev {
        background-color: transparent !important;
        border-color: #a0aec0 !important;
        color: #a0aec0 !important;
    }
    .dark-mode .nav-button.prev:hover {
        background-color: #a0aec0 !important;
        color: #1a202c !important;
    }
    .dark-mode .country-dropdown-list {
        background: #1f2937 !important;
        border-color: #4a5568 !important;
    }
    .dark-mode .country-dropdown-item {
        color: #e2e8f0 !important;
    }
    .dark-mode .country-dropdown-item:hover {
        background-color: #374151 !important;
    }
    .dark-mode .country-dropdown-search input {
        background-color: #2d3748 !important;
        color: #e2e8f0 !important;
        border-color: #4a5568 !important;
    }
    .dark-mode .modal-content {
        background-color: #2d3748 !important;
        color: #e2e8f0 !important;
    }
    .dark-mode .modal-header, .dark-mode .modal-footer {
        border-color: #4a5568 !important;
    }
    .dark-mode .modal-title, .dark-mode .modal-body h4 {
        color: #e2e8f0 !important;
    }
    .dark-mode .btn-close {
        filter: invert(1) grayscale(100%) brightness(200%);
    }
    .dark-mode div[style*="background-color: rgb(248, 249, 250)"] {
        background-color: #1f2937 !important;
    }
    .dark-mode div[style*="background-color: rgb(233, 236, 239)"] {
        background-color: #374151 !important;
        color: #e2e8f0 !important;
        border-color: #4a5568 !important;
    }
    .dark-mode .text-danger {
        color: #f56565 !important;
    }
    .dark-mode .text-muted {
        color: #a0aec0 !important;
    }
  `;

  const checkmarkStyles = `
  .checkmark {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: block;
    stroke-width: 3;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 0 auto 20px;
    box-shadow: inset 0px 0px 0px #2ecc71;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  }

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 3;
    stroke-miterlimit: 10;
    stroke: #2ecc71;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% { stroke-dashoffset: 0; }
  }
  @keyframes scale {
    0%, 100% { transform: none; }
    50% { transform: scale3d(1.1, 1.1, 1); }
  }
  @keyframes fill {
    100% { box-shadow: inset 0px 0px 0px 80px #2ecc71; }
  }
`;


const keyframes = `
  @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

  return (
    <>
      <style>{modernStyles + checkmarkStyles}</style>
      <div className="job-support-form-wrapper">
        <Container className="form-container-modern">
          <Button className="back-button-modern" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            Back
          </Button>
          <h2 className="form-header-modern">Job Support Contact Form</h2>
          <div className="mb-4 progress-bar-modern">
            <ProgressBar now={(currentStep / totalSteps) * 100} label={`Step ${currentStep} of ${totalSteps}`} />
          </div>
          <Form id="contact-form" onSubmit={handlePreview}>
            <input type="hidden" name="service" value={formData.service} />
            {/* Step 1: Personal & Contact Information */}
            {currentStep === 1 && (
              <section className="step-section">
                <h4 className="step-header-modern">Step 1: Personal & Contact Information</h4>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formFirstName">
                    <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} isInvalid={!!validationErrors.firstName} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formMiddleName">
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control type="text" name="middleName" value={formData.middleName} onChange={handleChange} isInvalid={!!validationErrors.middleName} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formLastName">
                    <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} isInvalid={!!validationErrors.lastName} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formDob">
                    <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} isInvalid={!!validationErrors.dob} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.dob}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGender">
                    <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={handleChange} isInvalid={!!validationErrors.gender} required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{validationErrors.gender}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEmail">
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!validationErrors.email} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
                  </Form.Group>
                  
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formCountryCode" ref={countryDropdownRef}>
                    <Form.Label>Country Code <span className="text-danger">*</span></Form.Label>
                    <div className="country-dropdown-container">
                      <Form.Control type="text" value={isCountryDropdownOpen ? countrySearchTerm : `${countryCodes.find(c => c.dialCode === formData.countryCode)?.name || ''} (${formData.countryCode})`} onFocus={() => setIsCountryDropdownOpen(true)} onChange={(e) => setCountrySearchTerm(e.target.value)} placeholder="Search country..." isInvalid={!!validationErrors.countryCode} />
                      {isCountryDropdownOpen && (<div className="country-dropdown-list"> {filteredCountries.map((country, index) => (<div key={index} className="country-dropdown-item" onClick={() => { setFormData(prev => ({ ...prev, countryCode: country.dialCode })); setCountrySearchTerm(''); setIsCountryDropdownOpen(false); }}> {country.name} ({country.dialCode}) </div>))} </div>)}
                      <Form.Control.Feedback type="invalid">{validationErrors.countryCode}</Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formMobile">
                    <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} isInvalid={!!validationErrors.mobile} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.mobile}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEthnicity">
                    <Form.Label>Ethnicity<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="ethnicity" value={formData.ethnicity} onChange={handleChange} isInvalid={!!validationErrors.ethnicity} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.ethnicity}</Form.Control.Feedback>
                  </Form.Group>
                  
                </Row>
                <Row className="mb-3">
                
                  {/* NEW: New County field */}
                  <Form.Group as={Col} md={4} controlId="formCounty">
                    <Form.Label>County <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="county" value={formData.county} onChange={handleChange} isInvalid={!!validationErrors.county} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.county}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formAddress">
                    <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} isInvalid={!!validationErrors.address} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formZipCode">
                    <Form.Label>Zip Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} isInvalid={!!validationErrors.zipCode} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.zipCode}</Form.Control.Feedback>
                  </Form.Group>
                  
                </Row>
              </section>
            )}

            {/* Step 2: Employment & Job Preferences */}
            {currentStep === 2 && (
              <section className="step-section">
                <h4 className="step-header-modern">Step 2: Employment & Job Preferences</h4>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formSecurityClearance">
                    <Form.Label>Security Clearance <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="securityClearance" value={formData.securityClearance} onChange={handleChange} isInvalid={!!validationErrors.securityClearance} required>
                      <option value="">Select Option</option><option value="yes">Yes</option><option value="no">No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{validationErrors.securityClearance}</Form.Control.Feedback>
                  </Form.Group>
                  {formData.securityClearance === 'yes' && (<Form.Group as={Col} controlId="formClearanceLevel"><Form.Label>Clearance Level <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="clearanceLevel" value={formData.clearanceLevel} onChange={handleChange} isInvalid={!!validationErrors.clearanceLevel} /><Form.Control.Feedback type="invalid">{validationErrors.clearanceLevel}</Form.Control.Feedback></Form.Group>)}
                  <Form.Group as={Col} controlId="formWillingToRelocate">
                    <Form.Label>Willing to Relocate <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange} isInvalid={!!validationErrors.willingToRelocate} required>
                      <option value="">Select Option</option><option value="yes">Yes</option><option value="no">No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{validationErrors.willingToRelocate}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
 <Form.Group as={Col} md={6} controlId="formWorkPreference">
                    <Form.Label>Work Preference <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="workPreference"
                      value={formData.workPreference}
                      onChange={handleChange}
                      list="work-preference-options"
                      placeholder="Select or type..."
                      isInvalid={!!validationErrors.workPreference}
                      required
                    />
                    <datalist id="work-preference-options">
                      <option value="Remote" />
                      <option value="On-site" />
                      <option value="Hybrid" />
                      <option value="Remote-Hybrid" />
                      <option value="Hybrid-Onsite" />
                       <option value="Remote-Hybrid-Onsite" />
                    </datalist>
                    <Form.Control.Feedback type="invalid">{validationErrors.workPreference}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="formYearsOfExperience">
                    <Form.Label>Years of Experience <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="yearsOfExperience" placeholder="e.g., 5" value={formData.yearsOfExperience} onChange={handleChange} isInvalid={!!validationErrors.yearsOfExperience} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.yearsOfExperience}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formJobsToApply">
                    <Form.Label>Jobs to Apply <span className="text-danger">*</span></Form.Label>
                    {/* NEW: Changed to textarea */}
                    <Form.Control as="textarea" rows={3} name="jobsToApply" placeholder="e.g., Software Engineer, Project Manager" value={formData.jobsToApply} onChange={handleChange} isInvalid={!!validationErrors.jobsToApply} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.jobsToApply}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formRestrictedCompanies">
                    <Form.Label>Restricted Companies </Form.Label>
                    <Form.Control type="text" name="restrictedCompanies" value={formData.restrictedCompanies} onChange={handleChange} isInvalid={!!validationErrors.restrictedCompanies} />
                    <Form.Control.Feedback type="invalid">{validationErrors.restrictedCompanies}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formCurrentSalary">
                    <Form.Label>Current Salary <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="currentSalary" value={formData.currentSalary} onChange={handleChange} isInvalid={!!validationErrors.currentSalary} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.currentSalary}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formExpectedSalary">
                    <Form.Label>Expected Salary <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} isInvalid={!!validationErrors.expectedSalary} required />
                    <Form.Control.Feedback type="invalid">{validationErrors.expectedSalary}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formVisaStatus">
                    <Form.Label>Visa Status <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="visaStatus" value={formData.visaStatus} onChange={handleChange} isInvalid={!!validationErrors.visaStatus} required>
                      <option value="">Select Status</option><option value="us_citizen">US Citizen</option><option value="green_card">Green Card</option><option value="h1b">H1B</option><option value="opt">OPT</option><option value="cpt">CPT</option><option value="other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{validationErrors.visaStatus}</Form.Control.Feedback>
                  </Form.Group>
                  {formData.visaStatus === 'other' && (<Form.Group as={Col} controlId="formOtherVisaStatus"><Form.Label>Please specify <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="otherVisaStatus" value={formData.otherVisaStatus} onChange={handleChange} isInvalid={!!validationErrors.otherVisaStatus} required /><Form.Control.Feedback type="invalid">{validationErrors.otherVisaStatus}</Form.Control.Feedback></Form.Group>)}
                </Row>
              </section>
            )}

            {/* Step 3: Education & Current Employment (Optional) */}
            {currentStep === 3 && (
              <section className="step-section">
                <h4 className="step-header-modern">Step 3: Education & Current Employment (Optional)</h4>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formUniversityName"><Form.Label>University Name<span className="text-danger">*</span></Form.Label><Form.Control type="text" name="universityName" value={formData.universityName} onChange={handleChange} isInvalid={!!validationErrors.universityName} />
                                      <Form.Control.Feedback type="invalid">{validationErrors.universityName}</Form.Control.Feedback>
</Form.Group>
                  <Form.Group as={Col} controlId="formUniversityAddress"><Form.Label>University Address<span className="text-danger">*</span></Form.Label><Form.Control type="text" name="universityAddress" value={formData.universityAddress} onChange={handleChange} isInvalid={!!validationErrors.universityAddress} />
                                      <Form.Control.Feedback type="invalid">{validationErrors.universityAddress}</Form.Control.Feedback>
</Form.Group>
                  <Form.Group as={Col} controlId="formCourseOfStudy"><Form.Label>Course of Study<span className="text-danger">*</span></Form.Label><Form.Control type="text" name="courseOfStudy" value={formData.courseOfStudy} onChange={handleChange} isInvalid={!!validationErrors.courseOfStudy} />
                                      <Form.Control.Feedback type="invalid">{validationErrors.courseOfStudy}</Form.Control.Feedback>
</Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGraduationFromDate">
                    <Form.Label>Graduation From Date<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="graduationFromDate" value={formData.graduationFromDate} onChange={handleChange} isInvalid={!!validationErrors.graduationFromDate} />
                    <Form.Control.Feedback type="invalid">{validationErrors.graduationFromDate}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGraduationToDate">
                    <Form.Label>Graduation To Date<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="graduationToDate" value={formData.graduationToDate} onChange={handleChange} isInvalid={!!validationErrors.graduationToDate} />
                    <Form.Control.Feedback type="invalid">{validationErrors.graduationToDate}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formNoticePeriod">
                    <Form.Label>Notice Period<span className="text-danger">*</span></Form.Label>
                    <Form.Select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} isInvalid={!!validationErrors.noticePeriod} required>
                      <option value="">Select Notice Period</option><option value="immediately">Immediately</option><option value="1_week">1 Week</option><option value="2_week">2 Weeks</option><option value="3_week">3 Weeks</option><option value="1_month">1 Month</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{validationErrors.noticePeriod}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formCurrentCompany"><Form.Label>Current Company</Form.Label><Form.Control type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} isInvalid={!!validationErrors.currentCompany} /></Form.Group>
                  <Form.Group as={Col} controlId="formCurrentDesignation"><Form.Label>Current Designation</Form.Label><Form.Control type="text" name="currentDesignation" value={formData.currentDesignation} onChange={handleChange} isInvalid={!!validationErrors.currentDesignation} /></Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formPreferredInterviewTime"><Form.Label>Preferred Interview Time</Form.Label><Form.Control type="text" name="preferredInterviewTime" value={formData.preferredInterviewTime} onChange={handleChange} isInvalid={!!validationErrors.preferredInterviewTime} /></Form.Group>
                  <Form.Group as={Col} controlId="formEarliestJoiningDate"><Form.Label>Earliest Joining Date</Form.Label><Form.Control type="date" name="earliestJoiningDate" value={formData.earliestJoiningDate} onChange={handleChange} isInvalid={!!validationErrors.earliestJoiningDate} /></Form.Group>
                  <Form.Group as={Col} controlId="formRelievingDate"><Form.Label>Relieving Date</Form.Label><Form.Control type="date" name="relievingDate" value={formData.relievingDate} onChange={handleChange} isInvalid={!!validationErrors.relievingDate} /></Form.Group>
                </Row>
              </section>
            )}

            {/* Step 4: References (Optional) */}
            {currentStep === 4 && (
              <section className="step-section">
                <h4 className="step-header-modern">Step 4: References (Optional)</h4>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formReferenceName"><Form.Label>Reference Name</Form.Label><Form.Control type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} isInvalid={!!validationErrors.referenceName} /></Form.Group>
                  <Form.Group as={Col} controlId="formReferencePhone"><Form.Label>Reference Phone</Form.Label><Form.Control type="text" name="referencePhone" value={formData.referencePhone} onChange={handleChange} isInvalid={!!validationErrors.referencePhone} /></Form.Group>
                  <Form.Group as={Col} controlId="formReferenceAddress"><Form.Label>Reference Address</Form.Label><Form.Control type="text" name="referenceAddress" value={formData.referenceAddress} onChange={handleChange} isInvalid={!!validationErrors.referenceAddress} /></Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formReferenceEmail"><Form.Label>Reference Email</Form.Label><Form.Control type="email" name="referenceEmail" value={formData.referenceEmail} onChange={handleChange} isInvalid={!!validationErrors.referenceEmail} /></Form.Group>
                  <Form.Group as={Col} controlId="formReferenceRole"><Form.Label>Reference Role</Form.Label><Form.Control type="text" name="referenceRole" value={formData.referenceRole} onChange={handleChange} isInvalid={!!validationErrors.referenceRole} /></Form.Group>
                </Row>
              </section>
            )}

            {/* Step 5: Job Portal (Optional) & Resume */}
            {currentStep === 5 && (
              <section className="step-section">
                <h4 className="step-header-modern">Step 5: Job Portal (Optional) & Resume</h4>
                <Form.Group controlId="formJobPortalCredentials" className="mb-3">
                  <Form.Label>Job Portal Account Name & Credentials (Ex:- LinkedIn, Glassdoor etc... )</Form.Label>
                  <Form.Control name="jobPortalAccountNameandCredentials" value={formData.jobPortalAccountNameandCredentials} onChange={handleChange} as="textarea" rows={3} isInvalid={!!validationErrors.jobPortalAccountNameandCredentials} />
                </Form.Group>
                <Row className="mb-3">
                <Form.Group as={Col} controlId="formResume" className="mb-3 mt-4">
                  <Form.Label>Upload Your Resume <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    required
                    accept=".pdf,.doc,.docx"
                    isInvalid={!!validationErrors.resume}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.resume}</Form.Control.Feedback>
                  {/* FIX: Display file name from state, not form value */}
                  {resumeFile && (
                    <Form.Text className="text-success d-block mt-1">
                      Selected file: **{resumeFile.name}**
                    </Form.Text>
                  )}
                  <Form.Text className="text-muted d-block mt-1">Please upload your resume in PDF, DOC, or DOCX format.</Form.Text>
                </Form.Group>
                <Form.Group as={Col} controlId="formcoverLetter" className="mb-3 mt-4">
                  <Form.Label>Cover Letter</Form.Label>
                  <Form.Control type="file" name="coverLetter" onChange={handleChange} accept=".pdf,.doc,.docx" isInvalid={!!validationErrors.coverLetter} />
                  {coverLetterFile && (
                    <Form.Text className="text-success d-block mt-1">
                      Selected file: **{coverLetterFile.name}**
                    </Form.Text>
                  )}
                  <Form.Text className="text-muted d-block mt-1">Please upload your Cover Letter in PDF, DOC, or DOCX format.</Form.Text>
                </Form.Group>
                </Row>
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
                <Button type="submit" className="nav-button preview" disabled={isSubmitting}>Preview & Submit</Button>
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
            <Row className="mb-3"><Col><Form.Label>Address:</Form.Label><div style={previewValueDisplay}>{formData.address || 'N/A'}</div></Col><Col md={4}><Form.Label>County:</Form.Label><div style={previewValueDisplay}>{formData.county || 'N/A'}</div></Col><Col md={4}><Form.Label>Zip Code:</Form.Label><div style={previewValueDisplay}>{formData.zipCode || 'N/A'}</div></Col></Row>
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
            <Row className="mb-3"><Col><Form.Label>Jobs to Apply For:</Form.Label><div style={previewValueDisplay}>{formData.jobsToApply || 'N/A'}</div></Col></Row>
            <Row className="mb-3"><Col><Form.Label>Current Salary:</Form.Label><div style={previewValueDisplay}>{formData.currentSalary || 'N/A'}</div></Col><Col><Form.Label>Expected Salary:</Form.Label><div style={previewValueDisplay}>{formData.expectedSalary || 'N/A'}</div></Col><Col><Form.Label>Visa Status:</Form.Label><div style={previewValueDisplay}>{formData.visaStatus || 'N/A'}</div></Col>{formData.visaStatus === 'other' && (<Col><Form.Label>Please specify:</Form.Label><div style={previewValueDisplay}>{formData.otherVisaStatus || 'N/A'}</div></Col>)}</Row>
            
            {/* Education Preview */}
            <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
            <Row className="mb-3"><Col><Form.Label>University Name:</Form.Label><div style={previewValueDisplay}>{formData.universityName || 'N/A'}</div></Col><Col><Form.Label>University Address:</Form.Label><div style={previewValueDisplay}>{formData.universityAddress || 'N/A'}</div></Col><Col><Form.Label>Course of Study:</Form.Label><div style={previewValueDisplay}>{formData.courseOfStudy || 'N/A'}</div></Col></Row>
            <Row className="mb-3"><Col><Form.Label>Graduation From Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationFromDate || 'N/A'}</div></Col><Col><Form.Label>Graduation To Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationToDate || 'N/A'}</div></Col><Col><Form.Label>Notice Period:</Form.Label><div style={previewValueDisplay}>{formData.noticePeriod || 'N/A'}</div></Col></Row>
            
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
            
            {/* FIX: Display resume and cover letter file names */}
            <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Uploaded Documents</h4>
            <Row className="mb-3">
              <Col>
                <Form.Label>Resume File Name:</Form.Label>
                <div style={previewValueDisplay}>{resumeFile ? resumeFile.name : 'N/A'}</div>
              </Col>
              <Col>
                <Form.Label>Cover Letter File Name:</Form.Label>
                <div style={previewValueDisplay}>{coverLetterFile ? coverLetterFile.name : 'N/A'}</div>
              </Col>
            </Row>

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
            </Button>
          </Modal.Footer>
        </Modal>

       <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Header closeButton />
                    <Modal.Body style={successModalStyle}>
                        <div style={successAnimationContainerStyle}>
  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="checkmark__check" fill="none" d="M14 27l7 7 16-16"/>
  </svg>
</div>
                        <h4 style={successTitleStyle}>Form Successfully Submitted!</h4>
                        <p style={successMessageStyle}>To View Your DashBoard, please click the below button</p>
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: 'center', borderTop: 'none' }}>
                        {/* New 'View Your Dashboard' button */}
                        <Button variant="primary" onClick={handleViewDashboard} style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }}>
                            View Your Dashboard
                        </Button>
                    </Modal.Footer>
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


export default JobSupportContactForm;