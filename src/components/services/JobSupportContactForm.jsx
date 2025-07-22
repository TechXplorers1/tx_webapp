import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import emailjs from 'emailjs-com';
// import '../../styles/services/JobSupportContactForm.css'; // Assuming this is no longer used for inline styles
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
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

    // Job Preferences
    jobsToApply: '',
    technologySkills: '',
    currentSalary: '',
    expectedSalary: '',
    visaStatus: '',
    otherVisaStatus: '',

    // Education
    schoolName: '',
    schoolAddress: '',
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
    jobPortalAccountNameandCredentials: '' ,

    // Resume Upload
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false); // State for preview modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to validate all mandatory fields
  const validateForm = () => {
    const mandatoryFields = [
      'firstName', 'lastName', 'dob', 'gender', 'address', 'zipCode',
      'countryCode', 'mobile', 'email', 'securityClearance', 'willingToRelocate',
      'workPreference', 'jobsToApply', 'technologySkills', 'currentSalary',
      'expectedSalary', 'visaStatus', 'schoolName', 'schoolAddress',
      'courseOfStudy', 'graduationFromDate', 'graduationToDate',
      'currentCompany', 'currentDesignation', 'preferredInterviewTime',
      'earliestJoiningDate', 'relievingDate', 'referenceName', 'referencePhone',
      'referenceAddress', 'referenceEmail', 'referenceRole',
      'jobPortalAccountNameandCredentials' , 'resume'
    ];

    for (const field of mandatoryFields) {
      if (!formData[field]) {
        setSubmitStatus({ success: false, message: `Please fill in the '${field}' field.` });
        return false;
      }
    }

    // Conditional mandatory field for 'otherVisaStatus'
    if (formData.visaStatus === 'other' && !formData.otherVisaStatus) {
      setSubmitStatus({ success: false, message: "Please specify your 'Other Visa Status'." });
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
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      setShowPreviewModal(true);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const handleSubmit = async (e) => {
    // This function can be called directly from the form or from the preview modal
    // If called from the form, it will perform validation.
    // If called from the modal, validation is assumed to have passed in handlePreview.
    if (e) e.preventDefault(); // Only prevent default if event object is passed (i.e., direct form submit)

    if (!validateForm()) {
      // If validation fails here, it means handleSubmit was called directly without preview, or preview was skipped.
      // The error message is already set by validateForm.
      return;
    }

    setIsSubmitting(true);
    // try {
    //   const response = await emailjs.send(
    //     'service_6zo0q3i',
    //     'template_plu2dxj',
    //     formData,
    //     'I1UJMnujMWkyQsjA0'
    //   );
    //   console.log('EmailJS Response:', response);

    // Reset form
    setFormData({
      firstName: '', middleName: '', lastName: '', dob: '', gender: '', ethnicity: '',
      address: '', zipCode: '', countryCode: '+1', mobile: '', email: '',
      securityClearance: '', clearanceLevel: '', willingToRelocate: '', workPreference: '', restrictedCompanies: '',
      jobsToApply: '', technologySkills: '', currentSalary: '', expectedSalary: '', visaStatus: '', otherVisaStatus: '',
      schoolName: '', schoolAddress: '', courseOfStudy: '', graduationFromDate: '', graduationToDate: '',
      currentCompany: '', currentDesignation: '', preferredInterviewTime: '', earliestJoiningDate: '', relievingDate: '',
      referenceName: '', referencePhone: '', referenceAddress: '', referenceEmail: '', referenceRole: '',
      jobPortalAccountNameandCredentials: '' , resume: ''
    });
    setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
    setShowPreviewModal(false); // Close modal on successful submission
    // } catch (error) {
    //   setSubmitStatus({ success: false, message: 'Submission failed. Please try again.' });
    // } finally {
    setIsSubmitting(false); // Ensure submission state is reset
    // }
  };

  // Comprehensive list of country codes and names
  const countryCodes = [
    { shortCode: 'US', dialCode: '+1', name: 'United States' },
    { shortCode: 'CA', dialCode: '+1', name: 'Canada' },
    { shortCode: 'GB', dialCode: '+44', name: 'United Kingdom' },
    { shortCode: 'IN', dialCode: '+91', name: 'India' },
    { shortCode: 'AU', dialCode: '+61', name: 'Australia' },
    { shortCode: 'DE', dialCode: '+49', name: 'Germany' },
    { shortCode: 'FR', dialCode: '+33', name: 'France' },
    { shortCode: 'JP', dialCode: '+81', name: 'Japan' },
    { shortCode: 'CN', dialCode: '+86', name: 'China' },
    { shortCode: 'BR', dialCode: '+55', name: 'Brazil' },
    { shortCode: 'ZA', dialCode: '+27', name: 'South Africa' },
    { shortCode: 'MX', dialCode: '+52', name: 'Mexico' },
    { shortCode: 'ES', dialCode: '+34', name: 'Spain' },
    { shortCode: 'IT', dialCode: '+39', name: 'Italy' },
    { shortCode: 'NL', dialCode: '+31', name: 'Netherlands' },
    { shortCode: 'SE', dialCode: '+46', name: 'Sweden' },
    { shortCode: 'NO', dialCode: '+47', name: 'Norway' },
    { shortCode: 'DK', dialCode: '+45', name: 'Denmark' },
    { shortCode: 'FI', dialCode: '+358', name: 'Finland' },
    { shortCode: 'CH', dialCode: '+41', name: 'Switzerland' },
    { shortCode: 'AT', dialCode: '+43', name: 'Austria' },
    { shortCode: 'BE', dialCode: '+32', name: 'Belgium' },
    { shortCode: 'IE', dialCode: '+353', name: 'Ireland' },
    { shortCode: 'NZ', dialCode: '+64', name: 'New Zealand' },
    { shortCode: 'SG', dialCode: '+65', name: 'Singapore' },
    { shortCode: 'HK', dialCode: '+852', name: 'Hong Kong' },
    { shortCode: 'KR', dialCode: '+82', name: 'South Korea' },
    { shortCode: 'AE', dialCode: '+971', name: 'United Arab Emirates' },
    { shortCode: 'SA', dialCode: '+966', name: 'Saudi Arabia' },
    { shortCode: 'RU', dialCode: '+7', name: 'Russia' },
    { shortCode: 'AR', dialCode: '+54', name: 'Argentina' },
    { shortCode: 'CL', dialCode: '+56', name: 'Chile' },
    { shortCode: 'CO', dialCode: '+57', name: 'Colombia' },
    { shortCode: 'PE', dialCode: '+51', name: 'Peru' },
    { shortCode: 'EG', dialCode: '+20', name: 'Egypt' },
    { shortCode: 'NG', dialCode: '+234', name: 'Nigeria' },
    { shortCode: 'KE', dialCode: '+254', name: 'Kenya' },
    { shortCode: 'PK', dialCode: '+92', name: 'Pakistan' },
    { shortCode: 'BD', dialCode: '+880', name: 'Bangladesh' },
    { shortCode: 'ID', dialCode: '+62', name: 'Indonesia' },
    { shortCode: 'MY', dialCode: '+60', name: 'Malaysia' },
    { shortCode: 'PH', dialCode: '+63', name: 'Philippines' },
    { shortCode: 'TH', dialCode: '+66', name: 'Thailand' },
    { shortCode: 'VN', dialCode: '+84', name: 'Vietnam' },
    { shortCode: 'TR', dialCode: '+90', name: 'Turkey' },
    { shortCode: 'GR', dialCode: '+30', name: 'Greece' },
    { shortCode: 'PL', dialCode: '+48', name: 'Poland' },
    { shortCode: 'CZ', dialCode: '+420', name: 'Czech Republic' },
    { shortCode: 'HU', dialCode: '+36', name: 'Hungary' },
    { shortCode: 'RO', dialCode: '+40', name: 'Romania' },
    { shortCode: 'PT', dialCode: '+351', name: 'Portugal' },
    { shortCode: 'IL', dialCode: '+972', name: 'Israel' },
    { shortCode: 'UA', dialCode: '+380', name: 'Ukraine' },
    { shortCode: 'BE', dialCode: '+32', name: 'Belgium' },
    { shortCode: 'AT', dialCode: '+43', name: 'Austria' },
    { shortCode: 'DK', dialCode: '+45', name: 'Denmark' },
    { shortCode: 'FI', dialCode: '+358', name: 'Finland' },
    { shortCode: 'NO', dialCode: '+47', name: 'Norway' },
    { shortCode: 'SE', dialCode: '+46', name: 'Sweden' },
    { shortCode: 'IR', dialCode: '+98', name: 'Iran' },
    { shortCode: 'IQ', dialCode: '+964', name: 'Iraq' },
    { shortCode: 'AF', dialCode: '+93', name: 'Afghanistan' },
    { shortCode: 'PK', dialCode: '+92', name: 'Pakistan' },
    { shortCode: 'LK', dialCode: '+94', name: 'Sri Lanka' },
    { shortCode: 'MM', dialCode: '+95', name: 'Myanmar' },
    { shortCode: 'NP', dialCode: '+977', name: 'Nepal' },
    { shortCode: 'BT', dialCode: '+975', name: 'Bhutan' },
    { shortCode: 'MV', dialCode: '+960', name: 'Maldives' },
    { shortCode: 'LA', dialCode: '+856', name: 'Laos' },
    { shortCode: 'KH', dialCode: '+855', name: 'Cambodia' },
    { shortCode: 'TL', dialCode: '+670', name: 'Timor-Leste' },
    { shortCode: 'BN', dialCode: '+673', name: 'Brunei' },
    { shortCode: 'PG', dialCode: '+675', name: 'Papua New Guinea' },
    { shortCode: 'FJ', dialCode: '+679', name: 'Fiji' },
    { shortCode: 'SB', dialCode: '+677', name: 'Solomon Islands' },
    { shortCode: 'VU', dialCode: '+678', name: 'Vanuatu' },
    { shortCode: 'NC', dialCode: '+687', name: 'New Caledonia' },
    { shortCode: 'PF', dialCode: '+689', name: 'French Polynesia' },
    { shortCode: 'WS', dialCode: '+685', name: 'Samoa' },
    { shortCode: 'TO', dialCode: '+676', name: 'Tonga' },
    { shortCode: 'KI', dialCode: '+686', name: 'Kiribati' },
    { shortCode: 'NR', dialCode: '+674', name: 'Nauru' },
    { shortCode: 'MH', dialCode: '+692', name: 'Marshall Islands' },
    { shortCode: 'FM', dialCode: '+691', name: 'Micronesia' },
    { shortCode: 'PW', dialCode: '+680', name: 'Palau' },
    { shortCode: 'TV', dialCode: '+688', name: 'Tuvalu' },
    { shortCode: 'CK', dialCode: '+682', name: 'Cook Islands' },
    { shortCode: 'NU', dialCode: '+683', name: 'Niue' },
    { shortCode: 'TK', dialCode: '+690', name: 'Tokelau' },
    { shortCode: 'WF', dialCode: '+681', name: 'Wallis and Futuna' },
    { shortCode: 'AS', dialCode: '+1-684', name: 'American Samoa' },
    { shortCode: 'GU', dialCode: '+1-671', name: 'Guam' },
    { shortCode: 'MP', dialCode: '+1-670', name: 'Northern Mariana Islands' },
    { shortCode: 'PR', dialCode: '+1-787', name: 'Puerto Rico' },
    { shortCode: 'VI', dialCode: '+1-340', name: 'U.S. Virgin Islands' },
    { shortCode: 'UM', dialCode: '+1', name: 'U.S. Minor Outlying Islands' },
    { shortCode: 'AX', dialCode: '+358-18', name: 'Åland Islands' },
    { shortCode: 'FO', dialCode: '+298', name: 'Faroe Islands' },
    { shortCode: 'GL', dialCode: '+299', name: 'Greenland' },
    { shortCode: 'GI', dialCode: '+350', name: 'Gibraltar' },
    { shortCode: 'GG', dialCode: '+44-1481', name: 'Guernsey' },
    { shortCode: 'IM', dialCode: '+44-1624', name: 'Isle of Man' },
    { shortCode: 'JE', dialCode: '+44-1534', name: 'Jersey' },
    { shortCode: 'LI', dialCode: '+423', name: 'Liechtenstein' },
    { shortCode: 'SM', dialCode: '+378', name: 'San Marino' },
    { shortCode: 'VA', dialCode: '+379', name: 'Vatican City' },
    { shortCode: 'MC', dialCode: '+377', name: 'Monaco' },
    { shortCode: 'AD', dialCode: '+376', name: 'Andorra' },
    { shortCode: 'MT', dialCode: '+356', name: 'Malta' },
    { shortCode: 'CY', dialCode: '+357', name: 'Cyprus' },
    { shortCode: 'IS', dialCode: '+354', name: 'Iceland' },
    { shortCode: 'LU', dialCode: '+352', name: 'Luxembourg' },
  ];

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white background
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '50px',
    marginBottom: '50px',
    position: 'relative', // Added for positioning the back button
  };

  const formHeaderStyle = {
    color: '#007bff',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  };

  const subHeaderStyle = {
    color: '#007bff',
    marginBottom: '1rem',
  };

  const inputControlStyle = {
    borderRadius: '5px',
    border: '1px solid #29629b',
    padding: '0.4rem 0.6rem',
    fontSize: '0.95rem',
  };

  const inputControlFocusStyle = {
    borderColor: '#007bff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  };

  const buttonStyle = {
    backgroundColor: '#28a745', // Green for Submit
    borderColor: '#28a745',
    color: 'white',
    fontSize: '1.2rem',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    flexGrow: 1, // Allows buttons to grow
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
    transform: 'translateY(-2px)',
  };

  const previewButtonStyle = {
    backgroundColor: '#007bff', // Blue for Preview
    borderColor: '#007bff',
    color: 'white',
    fontSize: '1.2rem',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    flexGrow: 1, // Allows buttons to grow
    marginRight: '10px', // Space between buttons
  };

  const previewButtonHoverStyle = {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  };

  const backButtonStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: '#6c757d', // Grey color for back button
    borderColor: '#6c757d',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background-color 0.3s ease',
  };

  const backButtonHoverStyle = {
    backgroundColor: '#5a6268',
  };

  const previewModalContentStyle = {
    maxHeight: '70vh', // Limit height for scrollability
    overflowY: 'auto', // Enable vertical scrolling
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  };

  // Styles for displaying values in the preview modal
  const previewValueDisplay = {
    padding: '0.4rem 0.6rem',
    fontSize: '0.95rem',
    backgroundColor: '#e9ecef', // Light grey background for values
    borderRadius: '5px',
    border: '1px solid #ced4da',
    minHeight: '38px', // Match input height
    display: 'flex',
    alignItems: 'center',
    wordBreak: 'break-word',
  };

  const previewTextAreaDisplay = {
    ...previewValueDisplay,
    minHeight: '80px',
    alignItems: 'flex-start',
    paddingTop: '0.6rem',
    paddingBottom: '0.6rem',
  };


  return (
    <div style={{ background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container style={containerStyle}>
        <Button
          style={backButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = backButtonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backButtonStyle.backgroundColor)}
          onClick={() => navigate(-1)} // Navigates back one step in history
        >
          &larr; Back
        </Button>
        {submitStatus.message && (
          <Alert variant={submitStatus.success ? 'success' : 'danger'} className="mt-3">
            {submitStatus.message}
          </Alert>
        )}
        <h2 style={formHeaderStyle}>Job Support Contact Form</h2>
        <Form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h4 className="border-bottom pb-2 mb-3" style={subHeaderStyle}>Personal Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formFirstName">
              <Form.Label className="form-label">First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formMiddleName">
              <Form.Label className="form-label">Middle Name</Form.Label>
              <Form.Control
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formLastName">
              <Form.Label className="form-label">Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formDob">
              <Form.Label className="form-label">Date of Birth <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGender">
              <Form.Label className="form-label">Gender <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formEthnicity">
              <Form.Label className="form-label">Ethnicity</Form.Label>
              <Form.Control
                type="text"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* Contact Information */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Contact Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formAddress">
              <Form.Label className="form-label">Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formZipCode">
              <Form.Label className="form-label">Zip Code <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCountryCode">
              <Form.Label className="form-label">Country Code <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.dialCode}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formMobile">
              <Form.Label className="form-label">Mobile <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formEmail">
              <Form.Label className="form-label">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* Employment Information */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Employment Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formSecurityClearance">
              <Form.Label className="form-label">Security Clearance <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="securityClearance"
                value={formData.securityClearance}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
            </Form.Group>
            {formData.securityClearance === 'yes' && (
              <Form.Group as={Col} controlId="formClearanceLevel">
                <Form.Label className="form-label">Clearance Level <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="clearanceLevel"
                  value={formData.clearanceLevel}
                  onChange={handleChange}
                  required
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="formWillingToRelocate">
              <Form.Label className="form-label">Willing to Relocate <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="willingToRelocate"
                value={formData.willingToRelocate}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formWorkPreference">
              <Form.Label className="form-label">Work Preference <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="workPreference"
                value={formData.workPreference}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                <option value="">Select Preference</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formRestrictedCompanies">
              <Form.Label className="form-label">Restricted Companies</Form.Label>
              <Form.Control
                type="text"
                name="restrictedCompanies"
                value={formData.restrictedCompanies}
                onChange={handleChange}
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* Job Preferences */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Preferences</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formJobsToApply">
              <Form.Label className="form-label">Jobs to Apply For <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="jobsToApply"
                value={formData.jobsToApply}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formTechnologySkills">
              <Form.Label className="form-label">Technology Skills <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="technologySkills"
                value={formData.technologySkills}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentSalary">
              <Form.Label className="form-label">Current Salary <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formExpectedSalary">
              <Form.Label className="form-label">Expected Salary <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formVisaStatus">
              <Form.Label className="form-label">Visa Status <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="visaStatus"
                value={formData.visaStatus}
                onChange={handleChange}
                required
                style={inputControlStyle}
                className="custom-select-cyan"
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              >
                <option value="">Select Status</option>
                <option value="us_citizen">US Citizen</option>
                <option value="green_card">Green Card</option>
                <option value="h1b">H1B</option>
                <option value="opt">OPT</option>
                <option value="cpt">CPT</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            {formData.visaStatus === 'other' && (
              <Form.Group as={Col} controlId="formOtherVisaStatus">
                <Form.Label className="form-label">Please specify <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="otherVisaStatus"
                  value={formData.otherVisaStatus}
                  onChange={handleChange}
                  required
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            )}
          </Row>

          {/* Education */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formSchoolName">
              <Form.Label className="form-label">School Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formSchoolAddress">
              <Form.Label className="form-label">School Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="schoolAddress"
                value={formData.schoolAddress}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formCourseOfStudy">
              <Form.Label className="form-label">Course of Study <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="courseOfStudy"
                value={formData.courseOfStudy}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGraduationFromDate">
              <Form.Label className="form-label">Graduation From Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="graduationFromDate"
                value={formData.graduationFromDate}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGraduationToDate">
              <Form.Label className="form-label">Graduation To Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="graduationToDate"
                value={formData.graduationToDate}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* Current Employment */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Current Employment</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentCompany">
              <Form.Label className="form-label">Current Company <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formCurrentDesignation">
              <Form.Label className="form-label">Current Designation <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="currentDesignation"
                value={formData.currentDesignation}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formPreferredInterviewTime">
              <Form.Label className="form-label">Preferred Interview Time <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="preferredInterviewTime"
                value={formData.preferredInterviewTime}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formEarliestJoiningDate">
              <Form.Label className="form-label">Earliest Joining Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="earliestJoiningDate"
                value={formData.earliestJoiningDate}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formRelievingDate">
              <Form.Label className="form-label">Relieving Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="relievingDate"
                value={formData.relievingDate}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* References */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>References</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceName">
              <Form.Label className="form-label">Reference Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="referenceName"
                value={formData.referenceName}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferencePhone">
              <Form.Label className="form-label">Reference Phone <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="referencePhone"
                value={formData.referencePhone}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferenceAddress">
              <Form.Label className="form-label">Reference Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="referenceAddress"
                value={formData.referenceAddress}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceEmail">
              <Form.Label className="form-label">Reference Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="referenceEmail"
                value={formData.referenceEmail}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferenceRole">
              <Form.Label className="form-label">Reference Role <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="referenceRole"
                value={formData.referenceRole}
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            </Form.Group>
          </Row>

          {/* Job Portal Information */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Portal Information</h4>
          <Form.Group controlId="formJobPortalCredentials" className="mb-3">
            <Form.Label className="form-label">Job Portal Account Name & Credentials <span className="text-danger">*</span></Form.Label>
            <Form.Control
              name="jobPortalAccountNameandCredentials"
              value={formData.jobPortalAccountNameandCredentials}
              onChange={handleChange}
              as="textarea"
              rows={2}
              required // Made mandatory
              style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

             {/* NEW: Upload Resume Section */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Upload Resume</h4>
          <Form.Group controlId="formResume" className="mb-3">
            <Form.Label className="form-label">Upload Your Resume <span className="text-danger">*</span></Form.Label>
            <Form.Control
                type="file"
                name="resume"
                onChange={handleChange}
                required
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                accept=".pdf,.doc,.docx"
            />
            <Form.Text className="text-muted">
                Please upload your resume in PDF, DOC, or DOCX format.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4 p-3"> {/* Use flexbox for buttons */}
            <Button
              type="button" // Change to type="button" to prevent default form submission
              size="lg"
              style={isSubmitting ? { ...previewButtonStyle, opacity: 0.7, cursor: 'not-allowed' } : previewButtonStyle}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = previewButtonHoverStyle.backgroundColor;
                  e.currentTarget.style.transform = previewButtonHoverStyle.transform;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = previewButtonStyle.backgroundColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              onClick={handlePreview} // Call handlePreview
              disabled={isSubmitting}
            >
              Preview
            </Button>
            <Button
              type="submit" // Keep as type="submit" for direct submission if preview is skipped
              size="lg"
              style={isSubmitting ? { ...buttonStyle, opacity: 0.7, cursor: 'not-allowed' } : buttonStyle}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
                  e.currentTarget.style.transform = buttonHoverStyle.transform;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Container>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={handleClosePreviewModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={previewModalContentStyle}>
          {/* Replicating the form structure for preview */}
          <h4 className="border-bottom pb-2 mb-3" style={subHeaderStyle}>Personal Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewFirstName">
              <Form.Label className="form-label">First Name:</Form.Label>
              <div style={previewValueDisplay}>{formData.firstName || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewMiddleName">
              <Form.Label className="form-label">Middle Name:</Form.Label>
              <div style={previewValueDisplay}>{formData.middleName || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewLastName">
              <Form.Label className="form-label">Last Name:</Form.Label>
              <div style={previewValueDisplay}>{formData.lastName || 'N/A'}</div>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewDob">
              <Form.Label className="form-label">Date of Birth:</Form.Label>
              <div style={previewValueDisplay}>{formData.dob || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewGender">
              <Form.Label className="form-label">Gender:</Form.Label>
              <div style={previewValueDisplay}>{formData.gender || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewEthnicity">
              <Form.Label className="form-label">Ethnicity:</Form.Label>
              <div style={previewValueDisplay}>{formData.ethnicity || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Contact Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewAddress">
              <Form.Label className="form-label">Address:</Form.Label>
              <div style={previewValueDisplay}>{formData.address || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewZipCode">
              <Form.Label className="form-label">Zip Code:</Form.Label>
              <div style={previewValueDisplay}>{formData.zipCode || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewCountryCode">
              <Form.Label className="form-label">Country Code:</Form.Label>
              <div style={previewValueDisplay}>
                {countryCodes.find(c => c.dialCode === formData.countryCode)?.name || 'N/A'} ({formData.countryCode || 'N/A'})
              </div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewMobile">
              <Form.Label className="form-label">Mobile:</Form.Label>
              <div style={previewValueDisplay}>{formData.mobile || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewEmail">
              <Form.Label className="form-label">Email:</Form.Label>
              <div style={previewValueDisplay}>{formData.email || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Employment Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewSecurityClearance">
              <Form.Label className="form-label">Security Clearance:</Form.Label>
              <div style={previewValueDisplay}>{formData.securityClearance || 'N/A'}</div>
            </Form.Group>
            {formData.securityClearance === 'yes' && (
              <Form.Group as={Col} controlId="previewClearanceLevel">
                <Form.Label className="form-label">Clearance Level:</Form.Label>
                <div style={previewValueDisplay}>{formData.clearanceLevel || 'N/A'}</div>
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="previewWillingToRelocate">
              <Form.Label className="form-label">Willing to Relocate:</Form.Label>
              <div style={previewValueDisplay}>{formData.willingToRelocate || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewWorkPreference">
              <Form.Label className="form-label">Work Preference:</Form.Label>
              <div style={previewValueDisplay}>{formData.workPreference || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewRestrictedCompanies">
              <Form.Label className="form-label">Restricted Companies:</Form.Label>
              <div style={previewValueDisplay}>{formData.restrictedCompanies || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Preferences</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewJobsToApply">
              <Form.Label className="form-label">Jobs to Apply For:</Form.Label>
              <div style={previewValueDisplay}>{formData.jobsToApply || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewTechnologySkills">
              <Form.Label className="form-label">Technology Skills:</Form.Label>
              <div style={previewValueDisplay}>{formData.technologySkills || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewCurrentSalary">
              <Form.Label className="form-label">Current Salary:</Form.Label>
              <div style={previewValueDisplay}>{formData.currentSalary || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewExpectedSalary">
              <Form.Label className="form-label">Expected Salary:</Form.Label>
              <div style={previewValueDisplay}>{formData.expectedSalary || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewVisaStatus">
              <Form.Label className="form-label">Visa Status:</Form.Label>
              <div style={previewValueDisplay}>{formData.visaStatus || 'N/A'}</div>
            </Form.Group>
            {formData.visaStatus === 'other' && (
              <Form.Group as={Col} controlId="previewOtherVisaStatus">
                <Form.Label className="form-label">Please specify:</Form.Label>
                <div style={previewValueDisplay}>{formData.otherVisaStatus || 'N/A'}</div>
              </Form.Group>
            )}
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewSchoolName">
              <Form.Label className="form-label">School Name:</Form.Label>
              <div style={previewValueDisplay}>{formData.schoolName || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewSchoolAddress">
              <Form.Label className="form-label">School Address:</Form.Label>
              <div style={previewValueDisplay}>{formData.schoolAddress || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewCourseOfStudy">
              <Form.Label className="form-label">Course of Study:</Form.Label>
              <div style={previewValueDisplay}>{formData.courseOfStudy || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewGraduationFromDate">
              <Form.Label className="form-label">Graduation From Date:</Form.Label>
              <div style={previewValueDisplay}>{formData.graduationFromDate || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewGraduationToDate">
              <Form.Label className="form-label">Graduation To Date:</Form.Label>
              <div style={previewValueDisplay}>{formData.graduationToDate || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Current Employment</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewCurrentCompany">
              <Form.Label className="form-label">Current Company:</Form.Label>
              <div style={previewValueDisplay}>{formData.currentCompany || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewCurrentDesignation">
              <Form.Label className="form-label">Current Designation:</Form.Label>
              <div style={previewValueDisplay}>{formData.currentDesignation || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewPreferredInterviewTime">
              <Form.Label className="form-label">Preferred Interview Time:</Form.Label>
              <div style={previewValueDisplay}>{formData.preferredInterviewTime || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewEarliestJoiningDate">
              <Form.Label className="form-label">Earliest Joining Date:</Form.Label>
              <div style={previewValueDisplay}>{formData.earliestJoiningDate || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewRelievingDate">
              <Form.Label className="form-label">Relieving Date:</Form.Label>
              <div style={previewValueDisplay}>{formData.relievingDate || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>References</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewReferenceName">
              <Form.Label className="form-label">Reference Name:</Form.Label>
              <div style={previewValueDisplay}>{formData.referenceName || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewReferencePhone">
              <Form.Label className="form-label">Reference Phone:</Form.Label>
              <div style={previewValueDisplay}>{formData.referencePhone || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewReferenceAddress">
              <Form.Label className="form-label">Reference Address:</Form.Label>
              <div style={previewValueDisplay}>{formData.referenceAddress || 'N/A'}</div>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="previewReferenceEmail">
              <Form.Label className="form-label">Reference Email:</Form.Label>
              <div style={previewValueDisplay}>{formData.referenceEmail || 'N/A'}</div>
            </Form.Group>
            <Form.Group as={Col} controlId="previewReferenceRole">
              <Form.Label className="form-label">Reference Role:</Form.Label>
              <div style={previewValueDisplay}>{formData.referenceRole || 'N/A'}</div>
            </Form.Group>
          </Row>

          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Portal Information</h4>
          <Form.Group controlId="previewJobPortalCredentials" className="mb-3">
            <Form.Label className="form-label">Job Portal Account Name & Credentials:</Form.Label>
            <div style={previewTextAreaDisplay}>{formData.jobPortalAccountNameandCredentials || 'N/A'}</div>
          </Form.Group>

            {/* NEW: Resume Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Uploaded Resume</h4>
          <Form.Group controlId="previewResume" className="mb-3">
            <Form.Label className="form-label">Resume File Name:</Form.Label>
            <div style={previewValueDisplay}>{formData.resume ? formData.resume.name : 'N/A'}</div>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreviewModal}>
            Edit
          </Button>
          <Button variant="primary" onClick={handleClosePreviewModal}> {/* Changed to Close button */}
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactForm;
