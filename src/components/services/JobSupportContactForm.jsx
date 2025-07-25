import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobSupportContactForm = () => {
  const navigate = useNavigate();
  const countryDropdownRef = useRef(null);

  // Define the initial state for the form data
  const initialFormData = {

    // ** NEW: Hidden service field **
    // This field will be included in the form submission data
    service: 'Job Supporting & Consulting',

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
      'earliestJoiningDate', 'relievingDate', 'resume'
    ];

    for (const field of mandatoryFields) {
      if (!formData[field]) {
        // Create a more user-friendly field name from the camelCase key
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        setSubmitStatus({ success: false, message: `Please fill in the '${fieldName}' field.` });
        return false;
      }
    }

    // Conditional mandatory field for 'otherVisaStatus'
    if (formData.visaStatus === 'other' && !formData.otherVisaStatus) {
      setSubmitStatus({ success: false, message: "Please specify your 'Other Visa Status'." });
      return false;
    }

    // Conditional mandatory field for 'clearanceLevel'
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
    if (validateForm()) {
      setShowPreviewModal(true);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const handleConfirmAndSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      setShowPreviewModal(false); // Close modal to show error alert
      return;
    }

    setIsSubmitting(true);
    // Find country name from country code for storage
    const countryData = countryCodes.find(c => c.dialCode === formData.countryCode);
    const countryName = countryData ? countryData.name : 'N/A';
    const newClient = {
      id: new Date().getTime(),
      name: `${formData.firstName} ${formData.lastName}`,
      mobile: `${formData.countryCode} ${formData.mobile}`,
      email: formData.email,
      jobsApplyFor: formData.jobsToApply,
      registeredDate: new Date().toISOString().split('T')[0],
      country: countryName,
      visaStatus: formData.visaStatus === 'other' ? formData.otherVisaStatus : formData.visaStatus,
      paymentStatus: 'Pending',
      displayStatuses: ['registered'],
      service: formData.service,
      subServices: [],
      userType: 'Individual', // Assuming job support applicants are individuals
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
      technologySkills: formData.technologySkills.split(',').map(s => s.trim()),
      currentSalary: formData.currentSalary,
      expectedSalary: formData.expectedSalary,
      schoolName: formData.universityName,
      schoolAddress: formData.universityAddress,
      courseOfStudy: formData.courseOfStudy,
      graduationFromDate: formData.graduationFromDate,
      graduationToDate: formData.graduationToDate,
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
      // Resume file is not stored in localStorage, just its name for preview
    };

    try {
      const existingClients = JSON.parse(localStorage.getItem('registeredClients')) || [];
      existingClients.push(newClient);
      localStorage.setItem('registeredClients', JSON.stringify(existingClients));

      console.log("Form data saved to localStorage:", newClient);

      setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
      setFormData(initialFormData);
      // document.getElementById("contact-form").reset(); // Reset might not work well with React state
      setShowPreviewModal(false);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Submission failed. Please try again.' });
      console.error("Failed to save to localStorage", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.dialCode.includes(countrySearchTerm)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '50px',
    marginBottom: '50px',
    position: 'relative',
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

  const buttonStyle = {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    color: 'white',
    fontSize: '1.2rem',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    flexGrow: 1,
  };

  const previewButtonStyle = {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: 'white',
    fontSize: '1.2rem',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    flexGrow: 1,
    marginRight: '10px',
  };

  const backButtonStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 10,
  };

  const previewModalContentStyle = {
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  };

  const previewValueDisplay = {
    padding: '0.4rem 0.6rem',
    fontSize: '0.95rem',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    minHeight: '38px',
    display: 'flex',
    alignItems: 'center',
    wordBreak: 'break-word',
  };

  const previewTextAreaDisplay = {
    ...previewValueDisplay,
    minHeight: '80px',
    alignItems: 'flex-start',
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container style={containerStyle}>
        <Button
          style={backButtonStyle}
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </Button>
        {submitStatus.message && (
          <Alert variant={submitStatus.success ? 'success' : 'danger'} className="mt-3">
            {submitStatus.message}
          </Alert>
        )}
        <h2 style={formHeaderStyle}>Job Support Contact Form</h2>
        <Form id="contact-form" onSubmit={handlePreview}>
          {/* ** NEW: Hidden input field for the service ** */}
          {/* This ensures the 'service' value is part of the form post data */}
          <input type="hidden" name="service" value={formData.service} />

          {/* Personal Information */}
          <h4 className="border-bottom pb-2 mb-3" style={subHeaderStyle}>Personal Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formFirstName">
              <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="firstName" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formMiddleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control type="text" name="middleName" onChange={handleChange} style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formLastName">
              <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="lastName" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formDob">
              <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" name="dob" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGender">
              <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
              <Form.Select name="gender" onChange={handleChange} required style={inputControlStyle}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formEthnicity">
              <Form.Label>Ethnicity</Form.Label>
              <Form.Control type="text" name="ethnicity" onChange={handleChange} style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* Contact Information */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Contact Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formAddress">
              <Form.Label>Address <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="address" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="formZipCode">
              <Form.Label>Zip Code <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="zipCode" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCountryCode" ref={countryDropdownRef}>

              <Form.Label>Country Code <span className="text-danger">*</span></Form.Label>

              <div style={{ position: 'relative' }}>

                <Form.Control

                  type="text"

                  value={isCountryDropdownOpen ? countrySearchTerm : `${countryCodes.find(c => c.dialCode === formData.countryCode)?.name || ''} (${formData.countryCode})`}

                  onFocus={() => setIsCountryDropdownOpen(true)}

                  onChange={(e) => setCountrySearchTerm(e.target.value)}

                  placeholder="Search country..."

                  style={inputControlStyle}

                />

                {isCountryDropdownOpen && (

                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>

                    {filteredCountries.map((country, index) => (

                      <div key={index} style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => {

                        setFormData(prev => ({ ...prev, countryCode: country.dialCode }));

                        setCountrySearchTerm('');

                        setIsCountryDropdownOpen(false);

                      }}>

                        {country.name} ({country.dialCode})

                      </div>

                    ))}

                  </div>

                )}

              </div>
            </Form.Group>
            <Form.Group as={Col} controlId="formMobile">
              <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="mobile" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* Employment Information */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Employment Information</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formSecurityClearance">
              <Form.Label>Security Clearance <span className="text-danger">*</span></Form.Label>
              <Form.Select name="securityClearance" value={formData.securityClearance} onChange={handleChange} required style={inputControlStyle}>
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
            </Form.Group>
            {formData.securityClearance === 'yes' && (
              <Form.Group as={Col} controlId="formClearanceLevel">
                <Form.Label>Clearance Level <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="clearanceLevel" value={formData.clearanceLevel} onChange={handleChange} required style={inputControlStyle} />
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="formWillingToRelocate">
              <Form.Label>Willing to Relocate <span className="text-danger">*</span></Form.Label>
              <Form.Select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange} required style={inputControlStyle}>
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formWorkPreference">
              <Form.Label>Work Preference <span className="text-danger">*</span></Form.Label>
              <Form.Select name="workPreference" value={formData.workPreference} onChange={handleChange} required style={inputControlStyle}>
                <option value="">Select Preference</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formRestrictedCompanies">
              <Form.Label>Restricted Companies</Form.Label>
              <Form.Control type="text" name="restrictedCompanies" value={formData.restrictedCompanies} onChange={handleChange} style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* Job Preferences */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Preferences</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formJobsToApply">
              <Form.Label>Jobs to Apply For <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="jobsToApply" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formTechnologySkills">
              <Form.Label>Technology Skills <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="technologySkills" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentSalary">
              <Form.Label>Current Salary <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="currentSalary" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formExpectedSalary">
              <Form.Label>Expected Salary <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="expectedSalary" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formVisaStatus">
              <Form.Label>Visa Status <span className="text-danger">*</span></Form.Label>
              <Form.Select name="visaStatus" onChange={handleChange} required style={inputControlStyle}>
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
                <Form.Label>Please specify <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="otherVisaStatus" onChange={handleChange} required style={inputControlStyle} />
              </Form.Group>
            )}
          </Row>

          {/* Education */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formUniversityName">
              <Form.Label>University Name <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="universityName" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formUniversityAddress">
              <Form.Label>University Address <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="universityAddress" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formCourseOfStudy">
              <Form.Label>Course of Study <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="courseOfStudy" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGraduationFromDate">
              <Form.Label>Graduation From Date <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" name="graduationFromDate" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGraduationToDate">
              <Form.Label>Graduation To Date <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" name="graduationToDate" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* Current Employment */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Current Employment</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formCurrentCompany">
              <Form.Label>Current Company <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="currentCompany" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formCurrentDesignation">
              <Form.Label>Current Designation <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="currentDesignation" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formPreferredInterviewTime">
              <Form.Label>Preferred Interview Time <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" name="preferredInterviewTime" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formEarliestJoiningDate">
              <Form.Label>Earliest Joining Date <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" name="earliestJoiningDate" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formRelievingDate">
              <Form.Label>Relieving Date <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" name="relievingDate" onChange={handleChange} required style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* References (Optional) */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>References</h4>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceName">
              <Form.Label>Reference Name (Optional)</Form.Label>
              <Form.Control type="text" name="referenceName" onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferencePhone">
              <Form.Label>Reference Phone (Optional)</Form.Label>
              <Form.Control type="text" name="referencePhone" onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferenceAddress">
              <Form.Label>Reference Address (Optional)</Form.Label>
              <Form.Control type="text" name="referenceAddress" onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formReferenceEmail">
              <Form.Label>Reference Email (Optional)</Form.Label>
              <Form.Control type="email" name="referenceEmail" onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
            <Form.Group as={Col} controlId="formReferenceRole">
              <Form.Label>Reference Role (Optional)</Form.Label>
              <Form.Control type="text" name="referenceRole" onChange={handleChange}  style={inputControlStyle} />
            </Form.Group>
          </Row>

          {/* Job Portal Information (Optional) */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Portal Information</h4>
          <Form.Group controlId="formJobPortalCredentials" className="mb-3">
            <Form.Label>Job Portal Account Name & Credentials (Optional)</Form.Label>
            <Form.Control name="jobPortalAccountNameandCredentials" onChange={handleChange} as="textarea" rows={2}  style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }} />
          </Form.Group>

          {/* Upload Resume Section */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Upload Resume</h4>
          <Form.Group controlId="formResume" className="mb-3">
            <Form.Label>Upload Your Resume <span className="text-danger">*</span></Form.Label>
            <Form.Control type="file" name="resume" onChange={handleChange} required style={inputControlStyle} accept=".pdf,.doc,.docx" />
            <Form.Text className="text-muted">
              Please upload your resume in PDF, DOC, or DOCX format.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4 p-3">
            <Button type="button" size="lg" style={previewButtonStyle} onClick={handlePreview} disabled={isSubmitting}>
              Preview
            </Button>
            <Button type="submit" size="lg" style={buttonStyle} disabled={isSubmitting}>
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
          {/* Personal Information Preview */}
          <h4 className="border-bottom pb-2 mb-3" style={subHeaderStyle}>Personal Information</h4>
          <Row className="mb-3">
            <Col><Form.Label>First Name:</Form.Label><div style={previewValueDisplay}>{formData.firstName || 'N/A'}</div></Col>
            <Col><Form.Label>Middle Name:</Form.Label><div style={previewValueDisplay}>{formData.middleName || 'N/A'}</div></Col>
            <Col><Form.Label>Last Name:</Form.Label><div style={previewValueDisplay}>{formData.lastName || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Date of Birth:</Form.Label><div style={previewValueDisplay}>{formData.dob || 'N/A'}</div></Col>
            <Col><Form.Label>Gender:</Form.Label><div style={previewValueDisplay}>{formData.gender || 'N/A'}</div></Col>
            <Col><Form.Label>Ethnicity:</Form.Label><div style={previewValueDisplay}>{formData.ethnicity || 'N/A'}</div></Col>
          </Row>

          {/* Contact Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Contact Information</h4>
          <Row className="mb-3">
            <Col><Form.Label>Address:</Form.Label><div style={previewValueDisplay}>{formData.address || 'N/A'}</div></Col>
            <Col md={4}><Form.Label>Zip Code:</Form.Label><div style={previewValueDisplay}>{formData.zipCode || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Country Code:</Form.Label><div style={previewValueDisplay}>{countryCodes.find(c => c.dialCode === formData.countryCode)?.name || 'N/A'} ({formData.countryCode || 'N/A'})</div></Col>
            <Col><Form.Label>Mobile:</Form.Label><div style={previewValueDisplay}>{formData.mobile || 'N/A'}</div></Col>
            <Col><Form.Label>Email:</Form.Label><div style={previewValueDisplay}>{formData.email || 'N/A'}</div></Col>
          </Row>

          {/* Employment Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Employment Information</h4>
          <Row className="mb-3">
            <Col><Form.Label>Security Clearance:</Form.Label><div style={previewValueDisplay}>{formData.securityClearance || 'N/A'}</div></Col>
            {formData.securityClearance === 'yes' && (
              <Col><Form.Label>Clearance Level:</Form.Label><div style={previewValueDisplay}>{formData.clearanceLevel || 'N/A'}</div></Col>
            )}
            <Col><Form.Label>Willing to Relocate:</Form.Label><div style={previewValueDisplay}>{formData.willingToRelocate || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Work Preference:</Form.Label><div style={previewValueDisplay}>{formData.workPreference || 'N/A'}</div></Col>
            <Col><Form.Label>Restricted Companies:</Form.Label><div style={previewValueDisplay}>{formData.restrictedCompanies || 'N/A'}</div></Col>
          </Row>

          {/* Job Preferences Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Preferences</h4>
          <Row className="mb-3">
            <Col><Form.Label>Jobs to Apply For:</Form.Label><div style={previewValueDisplay}>{formData.jobsToApply || 'N/A'}</div></Col>
            <Col><Form.Label>Technology Skills:</Form.Label><div style={previewValueDisplay}>{formData.technologySkills || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Current Salary:</Form.Label><div style={previewValueDisplay}>{formData.currentSalary || 'N/A'}</div></Col>
            <Col><Form.Label>Expected Salary:</Form.Label><div style={previewValueDisplay}>{formData.expectedSalary || 'N/A'}</div></Col>
            <Col><Form.Label>Visa Status:</Form.Label><div style={previewValueDisplay}>{formData.visaStatus || 'N/A'}</div></Col>
            {formData.visaStatus === 'other' && (
              <Col><Form.Label>Please specify:</Form.Label><div style={previewValueDisplay}>{formData.otherVisaStatus || 'N/A'}</div></Col>
            )}
          </Row>

          {/* Education Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Education</h4>
          <Row className="mb-3">
            <Col><Form.Label>University Name:</Form.Label><div style={previewValueDisplay}>{formData.universityName || 'N/A'}</div></Col>
            <Col><Form.Label>University Address:</Form.Label><div style={previewValueDisplay}>{formData.universityAddress || 'N/A'}</div></Col>
            <Col><Form.Label>Course of Study:</Form.Label><div style={previewValueDisplay}>{formData.courseOfStudy || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Graduation From Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationFromDate || 'N/A'}</div></Col>
            <Col><Form.Label>Graduation To Date:</Form.Label><div style={previewValueDisplay}>{formData.graduationToDate || 'N/A'}</div></Col>
          </Row>

          {/* Current Employment Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Current Employment</h4>
          <Row className="mb-3">
            <Col><Form.Label>Current Company:</Form.Label><div style={previewValueDisplay}>{formData.currentCompany || 'N/A'}</div></Col>
            <Col><Form.Label>Current Designation:</Form.Label><div style={previewValueDisplay}>{formData.currentDesignation || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Preferred Interview Time:</Form.Label><div style={previewValueDisplay}>{formData.preferredInterviewTime || 'N/A'}</div></Col>
            <Col><Form.Label>Earliest Joining Date:</Form.Label><div style={previewValueDisplay}>{formData.earliestJoiningDate || 'N/A'}</div></Col>
            <Col><Form.Label>Relieving Date:</Form.Label><div style={previewValueDisplay}>{formData.relievingDate || 'N/A'}</div></Col>
          </Row>

          {/* References Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>References</h4>
          <Row className="mb-3">
            <Col><Form.Label>Reference Name:</Form.Label><div style={previewValueDisplay}>{formData.referenceName || 'N/A'}</div></Col>
            <Col><Form.Label>Reference Phone:</Form.Label><div style={previewValueDisplay}>{formData.referencePhone || 'N/A'}</div></Col>
            <Col><Form.Label>Reference Address:</Form.Label><div style={previewValueDisplay}>{formData.referenceAddress || 'N/A'}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Label>Reference Email:</Form.Label><div style={previewValueDisplay}>{formData.referenceEmail || 'N/A'}</div></Col>
            <Col><Form.Label>Reference Role:</Form.Label><div style={previewValueDisplay}>{formData.referenceRole || 'N/A'}</div></Col>
          </Row>

          {/* Job Portal Information Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Job Portal Information</h4>
          <Form.Group controlId="previewJobPortalCredentials" className="mb-3">
            <Form.Label>Job Portal Account Name & Credentials:</Form.Label>
            <div style={previewTextAreaDisplay}>{formData.jobPortalAccountNameandCredentials || 'N/A'}</div>
          </Form.Group>

          {/* Resume Preview */}
          <h4 className="border-bottom pb-2 mb-3 mt-4" style={subHeaderStyle}>Uploaded Resume</h4>
          <Form.Group controlId="previewResume" className="mb-3">
            <Form.Label>Resume File Name:</Form.Label>
            <div style={previewValueDisplay}>{formData.resume ? formData.resume.name : 'N/A'}</div>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreviewModal}>
            Edit
          </Button>
          <Button variant="primary" onClick={handleConfirmAndSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobSupportContactForm;