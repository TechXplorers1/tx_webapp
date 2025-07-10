import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactForm = () => {
  // useEffect(() => {
  //   emailjs.init('I1UJMnujMWkyQsjA0');
  // }, []);

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
    jobPortalAccountNameandCredentials: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic form validation (all fields mandatory)
    const allFieldsFilled = Object.entries(formData).every(([key, value]) => {
      // Exclude middleName, ethnicity, clearanceLevel, restrictedCompanies,
      // preferredInterviewTime, earliestJoiningDate, relievingDate,
      // referenceName, referencePhone, referenceAddress, referenceEmail,
      // referenceRole, jobPortalAccountName, jobPortalCredentials
      // from mandatory check if they are empty strings
      // if (['middleName', 'ethnicity', 'clearanceLevel', 'restrictedCompanies',
      //      'preferredInterviewTime', 'earliestJoiningDate', 'relievingDate',
      //      'referenceName', 'referencePhone', 'referenceAddress', 'referenceEmail',
      //      'referenceRole', 'jobPortalAccountName', 'jobPortalCredentials'].includes(key)) {
      //   return true; // Allow these to be empty
      // }
      // The user requested all fields to be mandatory, so removing exclusions.
      // The only conditional mandatory field is 'otherVisaStatus'.
      if (key === 'otherVisaStatus' && formData.visaStatus !== 'other') {
        return true; // Only required if visaStatus is 'other'
      }
      return value !== '';
    });

    if (!allFieldsFilled) {
      setSubmitStatus({ success: false, message: 'Please fill in all mandatory fields.' });
      setIsSubmitting(false);
      return;
    }


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
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      gender: '',
      ethnicity: '',
      address: '',
      zipCode: '',
      countryCode: '+1', // Reset country code
      mobile: '',
      email: '',
      securityClearance: '',
      clearanceLevel: '',
      willingToRelocate: '',
      workPreference: '',
      restrictedCompanies: '',
      jobsToApply: '',
      technologySkills: '',
      currentSalary: '',
      expectedSalary: '',
      visaStatus: '',
      otherVisaStatus: '',
      schoolName: '',
      schoolAddress: '',
      courseOfStudy: '',
      graduationFromDate: '',
      graduationToDate: '',
      currentCompany: '',
      currentDesignation: '',
      preferredInterviewTime: '',
      earliestJoiningDate: '',
      relievingDate: '',
      referenceName: '',
      referencePhone: '',
      referenceAddress: '',
      referenceEmail: '',
      referenceRole: '',
      jobPortalAccountNameandCredentials: ''
    });

    setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
    // } catch (error) {
    //   setSubmitStatus({ success: false, message: 'Submission failed. Please try again.' });
    // } finally {
    //   setIsSubmitting(false);
    // }
     setIsSubmitting(false); // Ensure submission state is reset
  };

  // Comprehensive list of country codes and names
  // In a real application, this data would ideally be fetched from an API or imported from a library.
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
    { shortCode: 'AL', dialCode: '+355', name: 'Albania' },
    { shortCode: 'BA', dialCode: '+387', name: 'Bosnia and Herzegovina' },
    { shortCode: 'HR', dialCode: '+385', name: 'Croatia' },
    { shortCode: 'ME', dialCode: '+382', name: 'Montenegro' },
    { shortCode: 'MK', dialCode: '+389', name: 'North Macedonia' },
    { shortCode: 'RS', dialCode: '+381', name: 'Serbia' },
    { shortCode: 'SI', dialCode: '+386', name: 'Slovenia' },
    { shortCode: 'XK', dialCode: '+383', name: 'Kosovo' },
    { shortCode: 'MD', dialCode: '+373', name: 'Moldova' },
    { shortCode: 'BY', dialCode: '+375', name: 'Belarus' },
    { shortCode: 'GE', dialCode: '+995', name: 'Georgia' },
    { shortCode: 'AM', dialCode: '+374', name: 'Armenia' },
    { shortCode: 'AZ', dialCode: '+994', name: 'Azerbaijan' },
    { shortCode: 'KZ', dialCode: '+7', name: 'Kazakhstan' },
    { shortCode: 'KG', dialCode: '+996', name: 'Kyrgyzstan' },
    { shortCode: 'TJ', dialCode: '+992', name: 'Tajikistan' },
    { shortCode: 'TM', dialCode: '+993', name: 'Turkmenistan' },
    { shortCode: 'UZ', dialCode: '+998', name: 'Uzbekistan' },
    { shortCode: 'MN', dialCode: '+976', name: 'Mongolia' },
    { shortCode: 'TW', dialCode: '+886', name: 'Taiwan' },
    { shortCode: 'MO', dialCode: '+853', name: 'Macau' },
    { shortCode: 'LA', dialCode: '+856', name: 'Laos' },
    { shortCode: 'KH', dialCode: '+855', name: 'Cambodia' },
    { shortCode: 'MM', dialCode: '+95', name: 'Myanmar' },
    { shortCode: 'NP', dialCode: '+977', name: 'Nepal' },
    { shortCode: 'BT', dialCode: '+975', name: 'Bhutan' },
    { shortCode: 'LK', dialCode: '+94', name: 'Sri Lanka' },
    { shortCode: 'AF', dialCode: '+93', name: 'Afghanistan' },
    { shortCode: 'IR', dialCode: '+98', name: 'Iran' },
    { shortCode: 'IQ', dialCode: '+964', name: 'Iraq' },
    { shortCode: 'SY', dialCode: '+963', name: 'Syria' },
    { shortCode: 'LB', dialCode: '+961', name: 'Lebanon' },
    { shortCode: 'JO', dialCode: '+962', name: 'Jordan' },
    { shortCode: 'PS', dialCode: '+970', name: 'Palestine' },
    { shortCode: 'YE', dialCode: '+967', name: 'Yemen' },
    { shortCode: 'OM', dialCode: '+968', name: 'Oman' },
    { shortCode: 'KW', dialCode: '+965', name: 'Kuwait' },
    { shortCode: 'QA', dialCode: '+974', name: 'Qatar' },
    { shortCode: 'BH', dialCode: '+973', name: 'Bahrain' },
    { shortCode: 'CY', dialCode: '+357', name: 'Cyprus' },
    { shortCode: 'TR', dialCode: '+90', name: 'Turkey' },
    { shortCode: 'GR', dialCode: '+30', name: 'Greece' },
    { shortCode: 'AL', dialCode: '+355', name: 'Albania' },
    { shortCode: 'BA', dialCode: '+387', name: 'Bosnia and Herzegovina' },
    { shortCode: 'HR', dialCode: '+385', name: 'Croatia' },
    { shortCode: 'ME', dialCode: '+382', name: 'Montenegro' },
    { shortCode: 'MK', dialCode: '+389', name: 'North Macedonia' },
    { shortCode: 'RS', dialCode: '+381', name: 'Serbia' },
    { shortCode: 'SI', dialCode: '+386', name: 'Slovenia' },
    { shortCode: 'XK', dialCode: '+383', name: 'Kosovo' },
    { shortCode: 'MD', dialCode: '+373', name: 'Moldova' },
    { shortCode: 'BY', dialCode: '+375', name: 'Belarus' },
    { shortCode: 'UA', dialCode: '+380', name: 'Ukraine' },
    { shortCode: 'PL', dialCode: '+48', name: 'Poland' },
    { shortCode: 'CZ', dialCode: '+420', name: 'Czech Republic' },
    { shortCode: 'SK', dialCode: '+421', name: 'Slovakia' },
    { shortCode: 'HU', dialCode: '+36', name: 'Hungary' },
    { shortCode: 'RO', dialCode: '+40', name: 'Romania' },
    { shortCode: 'BG', dialCode: '+359', name: 'Bulgaria' },
    { shortCode: 'EE', dialCode: '+372', name: 'Estonia' },
    { shortCode: 'LV', dialCode: '+371', name: 'Latvia' },
    { shortCode: 'LT', dialCode: '+370', name: 'Lithuania' },
    { shortCode: 'AZ', dialCode: '+994', name: 'Azerbaijan' },
    { shortCode: 'GE', dialCode: '+995', name: 'Georgia' },
    { shortCode: 'AM', dialCode: '+374', name: 'Armenia' },
    { shortCode: 'KZ', dialCode: '+7', name: 'Kazakhstan' },
    { shortCode: 'KG', dialCode: '+996', name: 'Kyrgyzstan' },
    { shortCode: 'TJ', dialCode: '+992', name: 'Tajikistan' },
    { shortCode: 'TM', dialCode: '+993', name: 'Turkmenistan' },
    { shortCode: 'UZ', dialCode: '+998', name: 'Uzbekistan' },
    { shortCode: 'BD', dialCode: '+880', name: 'Bangladesh' },
    { shortCode: 'ID', dialCode: '+62', name: 'Indonesia' },
    { shortCode: 'MY', dialCode: '+60', name: 'Malaysia' },
    { shortCode: 'PH', dialCode: '+63', name: 'Philippines' },
    { shortCode: 'TH', dialCode: '+66', name: 'Thailand' },
    { shortCode: 'VN', dialCode: '+84', name: 'Vietnam' },
    { shortCode: 'SG', dialCode: '+65', name: 'Singapore' },
    { shortCode: 'HK', dialCode: '+852', name: 'Hong Kong' },
    { shortCode: 'MO', dialCode: '+853', name: 'Macau' },
    { shortCode: 'TW', dialCode: '+886', name: 'Taiwan' },
    { shortCode: 'KR', dialCode: '+82', name: 'South Korea' },
    { shortCode: 'JP', dialCode: '+81', name: 'Japan' },
    { shortCode: 'AU', dialCode: '+61', name: 'Australia' },
    { shortCode: 'NZ', dialCode: '+64', name: 'New Zealand' },
    { shortCode: 'FJ', dialCode: '+679', name: 'Fiji' },
    { shortCode: 'PG', dialCode: '+675', name: 'Papua New Guinea' },
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white
    minHeight: '100vh',
    borderRadius: '15px', // More modern border-radius
    padding: '30px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)', // Softer, more pronounced shadow
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headingStyle = {
    color: '#2c3e50', // Darker, softer blue
    marginBottom: '25px',
    fontFamily: "Orbitron, sans-serif", // Keep Orbitron if it's a design choice
    fontSize: '2.2rem',
    fontWeight: '700'
  };

  const subheadingStyle = {
    color: '#34495e', // Even darker for emphasis
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0', // Subtle, modern border
    fontSize: '1.5rem'
  };

  const labelStyle = {
    fontWeight: '600', // Slightly bolder labels
    color: '#34495e',
    marginBottom: '5px'
  };

  const inputControlStyle = {
    borderRadius: '8px', // More rounded inputs
    border: '1px solid #ced4da', // Light grey border
    padding: '10px 15px',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out', // Smooth transition for focus
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' // Subtle inner shadow
  };

  const inputControlFocusStyle = {
    borderColor: '#007bff', // Bootstrap primary blue
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
  };

  const selectControlStyle = {
    ...inputControlStyle, // Inherit base input styles
    appearance: 'none', // Remove default select arrow
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '16px 12px'
  };

  const buttonStyle = {
    backgroundColor: '#007bff', // Solid primary blue
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 25px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Add transform for subtle click effect
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)'
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3', // Darker blue on hover
    transform: 'translateY(-1px)' // Lift button slightly
  };

  const alertStyle = {
    borderRadius: '8px',
    marginBottom: '20px',
    padding: '15px 20px',
    fontSize: '1rem'
  };


  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '20px' }}> {/* Lighter background for the whole page */}

      <Container style={containerStyle} className="my-5"> {/* Increased margin for better spacing */}

        <h1 style={headingStyle} className="text-center p-3">BOOK A SERVICE WITH TECHXPLORERS</h1>
        <p className="text-center mb-4" style={{ color: '#555', fontSize: '1.1rem' }}>
          <b>Fill out your contact details below and our experts will be in touch</b>
        </p>

        {submitStatus.message && (
          <Alert variant={submitStatus.success ? 'success' : 'danger'} style={alertStyle}>
            {submitStatus.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
          {/* Personal Information */}
          <h4 style={subheadingStyle}>Personal Information</h4>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label style={labelStyle}>First Name<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formMiddleName">
                <Form.Label style={labelStyle}>Middle Name<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label style={labelStyle}>Last Name<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formDob">
                <Form.Label style={labelStyle}>Date of Birth<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formGender">
                <Form.Label style={labelStyle}>Gender<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required // Made mandatory
                  style={selectControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formEthnicity">
                <Form.Label style={labelStyle}>Ethnicity<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Contact Information */}
          <h4 style={subheadingStyle}>Contact Information</h4>
          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label style={labelStyle}>Full Address<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
              as="textarea"
              rows={2}
              required // Made mandatory
              style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formZipCode">
                <Form.Label style={labelStyle}>Zip Code<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formMobile">
                <Form.Label style={labelStyle}>Mobile Number<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #ced4da', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
                  <Form.Select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    required // Made mandatory
                    style={{
                      ...selectControlStyle,
                      width: '85px', // Fixed width for country code dropdown
                      flexShrink: 0,
                      marginRight: '0px', // Remove margin between select and input
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0',
                      borderRight: '1px solid #ced4da', // Add a subtle right border
                      backgroundColor: '#f8f9fa', // Slightly different background for the dropdown
                      padding: '10px 10px', // Adjust padding
                      fontSize: '0.9rem', // Adjusted font size for better fit
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '12px 8px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = inputControlFocusStyle.borderColor;
                      e.target.parentNode.style.borderColor = inputControlFocusStyle.borderColor; // Apply focus style to parent div
                      e.target.parentNode.style.boxShadow = inputControlFocusStyle.boxShadow;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = inputControlStyle.border;
                      e.target.parentNode.style.borderColor = inputControlStyle.border; // Remove focus style from parent div
                      e.target.parentNode.style.boxShadow = inputControlStyle.boxShadow;
                    }}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.dialCode} value={country.dialCode}>
                        {country.shortCode} {country.dialCode}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    type="tel"
                    required // Made mandatory
                    placeholder="e.g., 9876543210"
                    style={{
                      ...inputControlStyle,
                      flexGrow: 1,
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0',
                      borderLeft: 'none', // Remove left border to merge with select
                      boxShadow: 'none', // Remove individual shadow as parent div handles it
                      padding: '10px 15px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = inputControlFocusStyle.borderColor;
                      e.target.parentNode.style.borderColor = inputControlFocusStyle.borderColor; // Apply focus style to parent div
                      e.target.parentNode.style.boxShadow = inputControlFocusStyle.boxShadow;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = inputControlStyle.border;
                      e.target.parentNode.style.borderColor = inputControlStyle.border; // Remove focus style from parent div
                      e.target.parentNode.style.boxShadow = inputControlStyle.boxShadow;
                    }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={labelStyle}>Email<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Employment Information */}
          <h4 style={subheadingStyle}>Employment Information</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSecurityClearance">
                <Form.Label style={labelStyle}>Security Clearance<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Select
                  name="securityClearance"
                  value={formData.securityClearance}
                  onChange={handleChange}
                  required // Made mandatory
                  style={selectControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not-applicable">Not Applicable</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formClearanceLevel">
                <Form.Label style={labelStyle}>Clearance Level<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="clearanceLevel"
                  value={formData.clearanceLevel}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRelocation">
                <Form.Label style={labelStyle}>Willing to Relocate?<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Select
                  name="willingToRelocate"
                  value={formData.willingToRelocate}
                  onChange={handleChange}
                  required // Made mandatory
                  style={selectControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formWorkPreference">
                <Form.Label style={labelStyle}>Work Preference<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Select
                  name="workPreference"
                  value={formData.workPreference}
                  onChange={handleChange}
                  required // Made mandatory
                  style={selectControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                >
                  <option value="">Select</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote-hybrid">Remote + Hybrid</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formRestrictedCompanies">
            <Form.Label style={labelStyle}>Companies you don't want to apply to<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="restrictedCompanies"
              value={formData.restrictedCompanies}
              onChange={handleChange}
              as="textarea"
              rows={2}
              required // Made mandatory
              style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          {/* Job Preferences */}
          <h4 style={subheadingStyle}>Job Preferences</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formJobsToApply">
                <Form.Label style={labelStyle}>Jobs to apply for<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="jobsToApply"
                  value={formData.jobsToApply}
                  onChange={handleChange}
                  as="textarea"
                  rows={2}
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTechnology">
                <Form.Label style={labelStyle}>Technology/Skills<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="technologySkills"
                  value={formData.technologySkills}
                  onChange={handleChange}
                  as="textarea"
                  rows={2}
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCurrentSalary">
                <Form.Label style={labelStyle}>Current Salary<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formExpectedSalary">
                <Form.Label style={labelStyle}>Expected Salary<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formVisaStatus">
            <Form.Label style={labelStyle}>Visa Status<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Select
              name="visaStatus"
              value={formData.visaStatus}
              onChange={handleChange}
              required // Made mandatory
              style={selectControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            >
              <option value="">Select visa status</option>
              <option value="citizen">Citizen</option>
              <option value="green-card">Green Card</option>
              <option value="h1b">H1B</option>
              <option value="opt">OPT</option>
              <option value="other">Other</option>
            </Form.Select>
            {formData.visaStatus === 'other' && (
              <Form.Control
                name="otherVisaStatus"
                type="text"
                value={formData.otherVisaStatus}
                onChange={handleChange}
                className="mt-2"
                required // Made mandatory
                style={inputControlStyle}
                onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
              />
            )}
          </Form.Group>

          {/* Education */}
          <h4 style={subheadingStyle}>Education</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSchoolName">
                <Form.Label style={labelStyle}>School Name<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSchoolAddress">
                <Form.Label style={labelStyle}>School Address<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCourseOfStudy">
                <Form.Label style={labelStyle}>Course of Study<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="courseOfStudy"
                  value={formData.courseOfStudy}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formGraduationFromDate">
                <Form.Label style={labelStyle}>Graduation From Date<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="graduationFromDate"
                  value={formData.graduationFromDate}
                  onChange={handleChange}
                  type="date"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formGraduationToDate">
                <Form.Label style={labelStyle}>Graduation To Date<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="graduationToDate"
                  value={formData.graduationToDate}
                  onChange={handleChange}
                  type="date"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Current Employment */}
          <h4 style={subheadingStyle}>Current Employment</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCurrentCompany">
                <Form.Label style={labelStyle}>Current Company<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCurrentDesignation">
                <Form.Label style={labelStyle}>Current Designation<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="currentDesignation"
                  value={formData.currentDesignation}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formInterviewTime">
                <Form.Label style={labelStyle}>Preferred Interview Time<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="preferredInterviewTime"
                  value={formData.preferredInterviewTime}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formJoiningDate">
                <Form.Label style={labelStyle}>Earliest Joining Date<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="earliestJoiningDate"
                  value={formData.earliestJoiningDate}
                  onChange={handleChange}
                  type="date"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formRelievingDate">
            <Form.Label style={labelStyle}>Relieving Date from Current Company<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="relievingDate"
              value={formData.relievingDate}
              onChange={handleChange}
              type="date"
              required // Made mandatory
              style={inputControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          {/* References */}
          <h4 style={subheadingStyle}>References</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formReferenceName">
                <Form.Label style={labelStyle}>Reference Name<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="referenceName"
                  value={formData.referenceName}
                  onChange={handleChange}
                  type="text"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formReferencePhone">
                <Form.Label style={labelStyle}>Reference Phone<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
                <Form.Control
                  name="referencePhone"
                  value={formData.referencePhone}
                  onChange={handleChange}
                  type="tel"
                  required // Made mandatory
                  style={inputControlStyle}
                  onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formReferenceAddress">
            <Form.Label style={labelStyle}>Reference Address<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="referenceAddress"
              value={formData.referenceAddress}
              onChange={handleChange}
              type="text"
              required // Made mandatory
              style={inputControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formReferenceEmail">
            <Form.Label style={labelStyle}>Reference Email<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="referenceEmail"
              value={formData.referenceEmail}
              onChange={handleChange}
              type="email"
              required // Made mandatory
              style={inputControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formReferenceRole">
            <Form.Label style={labelStyle}>Reference Role<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="referenceRole"
              value={formData.referenceRole}
              onChange={handleChange}
              type="text"
              required // Made mandatory
              style={inputControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          {/* Job Portal Information */}
          <h4 style={subheadingStyle}>Job Portal Information</h4>
          <Form.Group className="mb-3" controlId="formJobPortalAccount">
            <Form.Label style={labelStyle}>Job Portal Account Name & Credentials</Form.Label>
            <Form.Control
              name="jobPortalAccountName"
              value={formData.jobPortalAccountNameandCredentials}
              onChange={handleChange}
               as="textarea"
              rows={2}
              required // Made mandatory
              style={inputControlStyle}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="formJobPortalCredentials">
            <Form.Label style={labelStyle}>Login Credentials (For USA)<span style={{color: 'red',marginLeft: '4px'}}>*</span></Form.Label>
            <Form.Control
              name="jobPortalCredentials"
              value={formData.jobPortalCredentials}
              onChange={handleChange}
              as="textarea"
              rows={2}
              required // Made mandatory
              style={{ ...inputControlStyle, minHeight: '80px', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = inputControlFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = inputControlStyle.border}
            />
          </Form.Group> */}

          <div className="d-grid mt-4 p-3">
            <Button
              type="submit"
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
    </div>
  );
};

export default ContactForm;
