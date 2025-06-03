// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
// import emailjs from 'emailjs-com';
// // import '../../styles/JobSupportForm.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import CustomNavbar from '../../../components/Navbar';
// const ContactForm = () => {
//   useEffect(() => {
//     emailjs.init('I1UJMnujMWkyQsjA0');
//   }, []);

//   const [formData, setFormData] = useState({
//     // Personal Information
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     dob: '',
//     gender: '',
//     ethnicity: '',
    
//     // Contact Information
//     address: '',
//     zipCode: '',
//     mobile: '',
//     email: '',
    
//     // Employment Information
//     securityClearance: '',
//     clearanceLevel: '',
//     willingToRelocate: '',
//     workPreference: '',
//     restrictedCompanies: '',
    
//     // Job Preferences
//     jobsToApply: '',
//     technologySkills: '',
//     currentSalary: '',
//     expectedSalary: '',
//     visaStatus: '',
//     otherVisaStatus: '',
    
//     // Education
//     schoolName: '',
//     schoolAddress: '',
//     schoolPhone: '',
//     courseOfStudy: '',
//     graduationDate: '',
    
//     // Current Employment
//     currentCompany: '',
//     currentDesignation: '',
//     preferredInterviewTime: '',
//     earliestJoiningDate: '',
//     relievingDate: '',
    
//     // References
//     referenceName: '',
//     referencePhone: '',
//     referenceAddress: '',
//     referenceEmail: '',
//     referenceRole: '',
    
//     // Job Portal Information
//     jobPortalAccountName: '',
//     jobPortalCredentials: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await emailjs.send(
//         'service_6zo0q3i',
//         'template_plu2dxj',
//         formData,
//         'I1UJMnujMWkyQsjA0'
//       );
//       console.log('EmailJS Response:', response); // Add this line

//       // Reset form
//       setFormData({
//         firstName: '',
//         middleName: '',
//         lastName: '',
//         dob: '',
//         gender: '',
//         ethnicity: '',
//         address: '',
//         zipCode: '',
//         mobile: '',
//         email: '',
//         securityClearance: '',
//         clearanceLevel: '',
//         willingToRelocate: '',
//         workPreference: '',
//         restrictedCompanies: '',
//         jobsToApply: '',
//         technologySkills: '',
//         currentSalary: '',
//         expectedSalary: '',
//         visaStatus: '',
//         otherVisaStatus: '',
//         schoolName: '',
//         schoolAddress: '',
//         schoolPhone: '',
//         courseOfStudy: '',
//         graduationDate: '',
//         currentCompany: '',
//         currentDesignation: '',
//         preferredInterviewTime: '',
//         earliestJoiningDate: '',
//         relievingDate: '',
//         referenceName: '',
//         referencePhone: '',
//         referenceAddress: '',
//         referenceEmail: '',
//         referenceRole: '',
//         jobPortalAccountName: '',
//         jobPortalCredentials: ''
//       });
      
//       setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
//     } catch (error) {
//       setSubmitStatus({ success: false, message: 'Submission failed. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//     useEffect(() => {
//       if (!window.location.hash.includes('#')) {
//         window.location.href = window.location.href + '#';
//         window.location.reload();
//       }
//       }, []);

//   return (
//     <div style={{ backgroundColor: 'transparent', padding: '10px' }}>
//        <CustomNavbar/>
//       <Container className="my-1 contact-form">
//       <CustomNavbar />

//         <h1 className="text-center mb-4" style={{ fontFamily: "Orbitron" }}>TALK WITH TECHXPLORERS</h1>
//         <p className="text-center mb-4">
//           <b>Fill out your contact details below and our experts will be in touch</b>
//         </p>

//         {submitStatus.message && (
//           <Alert variant={submitStatus.success ? 'success' : 'danger'}>
//             {submitStatus.message}
//           </Alert>
//         )}

//         <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '800px' }}>
//           {/* Personal Information */}
//           <h4 className="mb-3 border-bottom pb-2">Personal Information</h4>
//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formFirstName">
//                 <Form.Label>First Name</Form.Label>
//                 <Form.Control
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formMiddleName">
//                 <Form.Label>Middle Name</Form.Label>
//                 <Form.Control
//                   name="middleName"
//                   value={formData.middleName}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formLastName">
//                 <Form.Label>Last Name</Form.Label>
//                 <Form.Control
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formDob">
//                 <Form.Label>Date of Birth</Form.Label>
//                 <Form.Control
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   type="date"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formGender">
//                 <Form.Label>Gender</Form.Label>
//                 <Form.Select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   required
//                   className="custom-select-cyan"
//                 >
//                   <option value="">Select gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formEthnicity">
//                 <Form.Label>Ethnicity</Form.Label>
//                 <Form.Control
//                   name="ethnicity"
//                   value={formData.ethnicity}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Contact Information */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Contact Information</h4>
//           <Form.Group className="mb-3" controlId="formAddress">
//             <Form.Label>Full Address</Form.Label>
//             <Form.Control
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               as="textarea"
//               rows={2}
//               required
//             />
//           </Form.Group>

//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formZipCode">
//                 <Form.Label>Zip Code</Form.Label>
//                 <Form.Control
//                   name="zipCode"
//                   value={formData.zipCode}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formMobile">
//                 <Form.Label>Mobile Number</Form.Label>
//                 <Form.Control
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   type="tel"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formEmail">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   type="email"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Employment Information */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Employment Information</h4>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formSecurityClearance">
//                 <Form.Label>Security Clearance</Form.Label>
//                 <Form.Select
//                   name="securityClearance"
//                   value={formData.securityClearance}
//                   onChange={handleChange}
//                   className="custom-select-cyan"
//                 >
//                   <option value="">Select</option>
//                   <option value="yes">Yes</option>
//                   <option value="no">No</option>
//                   <option value="not-applicable">Not Applicable</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formClearanceLevel">
//                 <Form.Label>Clearance Level</Form.Label>
//                 <Form.Control
//                   name="clearanceLevel"
//                   value={formData.clearanceLevel}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formRelocation">
//                 <Form.Label>Willing to Relocate?</Form.Label>
//                 <Form.Select
//                   name="willingToRelocate"
//                   value={formData.willingToRelocate}
//                   onChange={handleChange}
//                   required
//                   className="custom-select-cyan"
//                 >
//                   <option value="">Select</option>
//                   <option value="yes">Yes</option>
//                   <option value="no">No</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formWorkPreference">
//                 <Form.Label>Work Preference</Form.Label>
//                 <Form.Select
//                   name="workPreference"
//                   value={formData.workPreference}
//                   onChange={handleChange}
//                   required
//                   className="custom-select-cyan"
//                 >
//                   <option value="">Select</option>
//                   <option value="remote">Remote</option>
//                   <option value="onsite">Onsite</option>
//                   <option value="hybrid">Hybrid</option>
//                   <option value="remote-hybrid">Remote + Hybrid</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3" controlId="formRestrictedCompanies">
//             <Form.Label>Companies you don't want to apply to</Form.Label>
//             <Form.Control
//               name="restrictedCompanies"
//               value={formData.restrictedCompanies}
//               onChange={handleChange}
//               as="textarea"
//               rows={2}
//             />
//           </Form.Group>

//           {/* Job Preferences */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Job Preferences</h4>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formJobsToApply">
//                 <Form.Label>Jobs to apply for</Form.Label>
//                 <Form.Control
//                   name="jobsToApply"
//                   value={formData.jobsToApply}
//                   onChange={handleChange}
//                   as="textarea"
//                   rows={2}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formTechnology">
//                 <Form.Label>Technology/Skills</Form.Label>
//                 <Form.Control
//                   name="technologySkills"
//                   value={formData.technologySkills}
//                   onChange={handleChange}
//                   as="textarea"
//                   rows={2}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formCurrentSalary">
//                 <Form.Label>Current Salary</Form.Label>
//                 <Form.Control
//                   name="currentSalary"
//                   value={formData.currentSalary}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formExpectedSalary">
//                 <Form.Label>Expected Salary</Form.Label>
//                 <Form.Control
//                   name="expectedSalary"
//                   value={formData.expectedSalary}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3" controlId="formVisaStatus">
//             <Form.Label>Visa Status</Form.Label>
//             <Form.Select
//               name="visaStatus"
//               value={formData.visaStatus}
//               onChange={handleChange}
//               required
//               className="custom-select-cyan"
//             >
//               <option value="">Select visa status</option>
//               <option value="citizen">Citizen</option>
//               <option value="green-card">Green Card</option>
//               <option value="h1b">H1B</option>
//               <option value="opt">OPT</option>
//               <option value="other">Other</option>
//             </Form.Select>
//             {formData.visaStatus === 'other' && (
//               <Form.Control
//                 name="otherVisaStatus"
//                 type="text"
//                 value={formData.otherVisaStatus}
//                 onChange={handleChange}
//                 className="mt-2"
//                 required
//               />
//             )}
//           </Form.Group>

//           {/* Education */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Education</h4>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formSchoolName">
//                 <Form.Label>School Name</Form.Label>
//                 <Form.Control
//                   name="schoolName"
//                   value={formData.schoolName}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formSchoolAddress">
//                 <Form.Label>School Address</Form.Label>
//                 <Form.Control
//                   name="schoolAddress"
//                   value={formData.schoolAddress}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formSchoolPhone">
//                 <Form.Label>School Phone</Form.Label>
//                 <Form.Control
//                   name="schoolPhone"
//                   value={formData.schoolPhone}
//                   onChange={handleChange}
//                   type="tel"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formCourseOfStudy">
//                 <Form.Label>Course of Study</Form.Label>
//                 <Form.Control
//                   name="courseOfStudy"
//                   value={formData.courseOfStudy}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group className="mb-3" controlId="formGraduationDate">
//                 <Form.Label>Graduation Date</Form.Label>
//                 <Form.Control
//                   name="graduationDate"
//                   value={formData.graduationDate}
//                   onChange={handleChange}
//                   type="date"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Current Employment */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Current Employment</h4>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formCurrentCompany">
//                 <Form.Label>Current Company</Form.Label>
//                 <Form.Control
//                   name="currentCompany"
//                   value={formData.currentCompany}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formCurrentDesignation">
//                 <Form.Label>Current Designation</Form.Label>
//                 <Form.Control
//                   name="currentDesignation"
//                   value={formData.currentDesignation}
//                   onChange={handleChange}
//                   type="text"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formInterviewTime">
//                 <Form.Label>Preferred Interview Time</Form.Label>
//                 <Form.Control
//                   name="preferredInterviewTime"
//                   value={formData.preferredInterviewTime}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formJoiningDate">
//                 <Form.Label>Earliest Joining Date</Form.Label>
//                 <Form.Control
//                   name="earliestJoiningDate"
//                   value={formData.earliestJoiningDate}
//                   onChange={handleChange}
//                   type="date"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3" controlId="formRelievingDate">
//             <Form.Label>Relieving Date from Current Company</Form.Label>
//             <Form.Control
//               name="relievingDate"
//               value={formData.relievingDate}
//               onChange={handleChange}
//               type="date"
//             />
//           </Form.Group>

//           {/* References */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">References</h4>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formReferenceName">
//                 <Form.Label>Reference Name</Form.Label>
//                 <Form.Control
//                   name="referenceName"
//                   value={formData.referenceName}
//                   onChange={handleChange}
//                   type="text"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3" controlId="formReferencePhone">
//                 <Form.Label>Reference Phone</Form.Label>
//                 <Form.Control
//                   name="referencePhone"
//                   value={formData.referencePhone}
//                   onChange={handleChange}
//                   type="tel"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3" controlId="formReferenceAddress">
//             <Form.Label>Reference Address</Form.Label>
//             <Form.Control
//               name="referenceAddress"
//               value={formData.referenceAddress}
//               onChange={handleChange}
//               type="text"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formReferenceEmail">
//             <Form.Label>Reference Email</Form.Label>
//             <Form.Control
//               name="referenceEmail"
//               value={formData.referenceEmail}
//               onChange={handleChange}
//               type="email"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formReferenceRole">
//             <Form.Label>Reference Role</Form.Label>
//             <Form.Control
//               name="referenceRole"
//               value={formData.referenceRole}
//               onChange={handleChange}
//               type="text"
//             />
//           </Form.Group>

//           {/* Job Portal Information */}
//           <h4 className="mb-3 mt-4 border-bottom pb-2">Job Portal Information</h4>
//           <Form.Group className="mb-3" controlId="formJobPortalAccount">
//             <Form.Label>Job Portal Account Name</Form.Label>
//             <Form.Control
//               name="jobPortalAccountName"
//               value={formData.jobPortalAccountName}
//               onChange={handleChange}
//               type="text"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formJobPortalCredentials">
//             <Form.Label>Login Credentials (For USA)</Form.Label>
//             <Form.Control
//               name="jobPortalCredentials"
//               value={formData.jobPortalCredentials}
//               onChange={handleChange}
//               as="textarea"
//               rows={2}
//             />
//           </Form.Group>

//           <div className="d-grid mt-4">
//             <Button
//               type="submit"
//               size="lg"
//               style={{ backgroundColor: '#00ffff', borderColor: '#00ffff', color: '#000' }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Sending...' : 'Submit'}
//             </Button>
//           </div>
//         </Form>
//       </Container>
//     </div>
//   );
// };

// export default ContactForm;