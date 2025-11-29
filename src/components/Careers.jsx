import React, { useState } from 'react';
import { Container, Card, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';
import Footer from './Footer'; 
import { database, auth, storage } from '../firebase';
import { ref as dbRef, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Data for Job Postings ---
const jobs = [
  {
    title: 'Data Analyst',
    image: 'https://media.istockphoto.com/id/1867035079/photo/analytics-and-data-management-systems-business-analytics-and-data-management-systems-to-make.jpg?s=612x612&w=0&k=20&c=tFcJnBIWlkPhIumrPtkSJwFRNDMtdVfJ1CYbfUlx5fE=',
    description: 'Analyze large datasets to extract meaningful insights, create visualizations, and support data-driven decision-making across the company.',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    title: 'Scrum Master',
    image: 'https://t4.ftcdn.net/jpg/02/63/69/73/360_F_263697323_3B70wt0gY7DGoH8zWyWloJ5sZLkjcykV.jpg',
    description: 'Facilitate agile development processes, guide the team on Scrum principles, and remove impediments to ensure smooth project delivery.',
    location: 'Hyderabad, India',
    type: 'Full-time'
  },
  {
    title: 'Cyber Security',
    image: 'https://t4.ftcdn.net/jpg/02/45/63/69/360_F_245636933_kY23ohGptK5t6n8wGSXIgLgVXWeHJRct.jpg',
    description: 'Protect our digital assets by implementing and monitoring security measures, responding to incidents, and ensuring compliance.',
    location: 'Remote',
    type: 'Contract'
  },
  {
    title: 'Software Engineer',
    image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg',
    description: 'Design, develop, and maintain high-quality software solutions. Collaborate with a team of talented engineers to build scalable applications.',
    location: 'San Francisco, CA',
    type: 'Full-time'
  },
  {
    title: 'UI/UX Designer',
    image: 'https://media.istockphoto.com/id/1189377184/vector/mobile-apps-creation-of-a-mobile-application-web-page-created-from-separate-blocks-user.jpg?s=612x612&w=0&k=20&c=PqdUndWPh0bvCQ8sXctahDE0kdkERfRizThl1IByWjc=',
    description: 'Create intuitive and visually appealing user interfaces. Conduct user research and translate concepts into user flows and prototypes.',
    location: 'New York, NY',
    type: 'Part-time'
  },
];

function Careers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // State to hold form data including the resume file
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    currentSalary: '',
    expectedSalary: '',
    experience: '',
    resume: null, // Stores the File object
  });

  // Handler for form input changes
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      // If the input is a file, store the first file
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      // For other inputs, update the value
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler for form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Ensure a job is selected and a resume file is provided
    if (!selectedJob) {
      alert("No job selected for application.");
      return;
    }
    if (!formData.resume) {
      alert("Please select a resume file to upload.");
      return;
    }

    try {
      const currentUser = auth.currentUser; // Get current authenticated user
      const file = formData.resume; // The resume file from state

      // 1. Upload file to Firebase Storage with a unique name
      // Appending timestamp to file name ensures uniqueness
      const resumeFileName = file.name;
      const fileRef = storageRef(storage, `resumes/${new Date().getTime()}_${resumeFileName}`);
      
      const uploadTask = await uploadBytes(fileRef, file); // Upload the file
      
      // 2. Get the public download URL for the uploaded file
      const resumeURL = await getDownloadURL(uploadTask.ref);

      // 3. Create the submission object with all form data and the resume URL/filename
      const newSubmission = {
        id: Date.now(), // Unique ID for the submission
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        role: selectedJob.title, // Job title from the selected job
        experience: Number(formData.experience),
        currentSalary: formData.currentSalary,
        expectedSalary: formData.expectedSalary,
        resume: resumeFileName, // Original name of the resume file
        resumeURL: resumeURL, // Public download URL of the resume
        status: 'Pending', // Initial status of the application
        receivedDate: new Date().toISOString().split('T')[0], // Current date
        userId: currentUser ? currentUser.uid : "guest" // User ID or "guest"
      };

      // 4. Save the submission data to the Realtime Database
      const careerSubmissionsRef = dbRef(database, 'submissions/career_submissions');
      await push(careerSubmissionsRef, newSubmission); // Push new submission to database

      // Close the application modal and show success modal
      setShowModal(false);
      setShowSuccessModal(true);
      
      // Reset form data after successful submission
      setFormData({
        firstName: '', lastName: '', email: '', mobile: '',
        currentSalary: '', expectedSalary: '', experience: '', resume: null,
      });

    } catch (error) {
      console.error("Failed to submit career application to Firebase", error);
      alert("There was an error submitting your application. Please try again.");
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for "Apply Now" button click
  const handleApplyClick = (job) => {
    setSelectedJob(job); // Set the selected job
    setShowModal(true); // Open the application modal
  };

  // Handler for closing the main application modal
  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    setSelectedJob(null); // Clear selected job
    // Optionally reset form data when modal closes
    setFormData({
      firstName: '', lastName: '', email: '', mobile: '',
      currentSalary: '', expectedSalary: '', experience: '', resume: null,
    });
  };

  // --- Inline CSS Styles for a Modern Look ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

    :root {
      --light-bg: #f8f9fa;
      --light-surface: #ffffff;
      --light-text-primary: #212529;
      --light-text-secondary: #6c757d;
      --light-border: #e9ecef;
      --shadow-light: 0 10px 30px rgba(0, 0, 0, 0.08);
      --shadow-hover-light: 0 15px 40px rgba(0, 0, 0, 0.12);

      --dark-bg: #121212;
      --dark-surface: #1e1e1e;
      --dark-text-primary: #e0e0e0;
      --dark-text-secondary: #a0a0a0;
      --dark-border: #333333;
      --shadow-dark: 0 10px 30px rgba(0, 0, 0, 0.2);
      --shadow-hover-dark: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    body {
      background-color: var(--light-bg);
      font-family: 'Inter', sans-serif;
      transition: background-color 0.3s ease;
    }
    
    .dark-mode body {
      background-color: var(--dark-bg);
    }

    .careers-page-container {
      padding-top: 80px; /* Space for navbar */
      padding-bottom: 4rem;
    }

    .hero-section {
      text-align: center;
      padding: 3rem 1rem;
      background-color: var(--light-surface);
      border-bottom: 1px solid var(--light-border);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .dark-mode .hero-section {
      background-color: var(--dark-surface);
      border-bottom: 1px solid var(--dark-border);
    }

    .hero-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--light-text-primary);
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }

    .dark-mode .hero-title {
      color: var(--dark-text-primary);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--light-text-secondary);
      max-width: 700px;
      margin: 0 auto 2rem auto;
      transition: color 0.3s ease;
    }

    .dark-mode .hero-subtitle {
      color: var(--dark-text-secondary);
    }

    .search-bar-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1.5rem 1rem 3.5rem;
      border-radius: 50px;
      border: 1px solid var(--light-border);
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      background-color: var(--light-surface);
      color: var(--light-text-primary);
    }

    .dark-mode .search-input {
      background-color: var(--dark-surface);
      color: var(--dark-text-primary);
      border-color: var(--dark-border);
    }

    .search-input:focus {
      outline: none;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
      border-color: #80bdff;
    }

    .search-icon {
      position: absolute;
      left: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--light-text-secondary);
      font-size: 1.2rem;
      transition: color 0.3s ease;
    }
     .dark-mode .search-icon {
      color: var(--dark-text-secondary);
    }

    .jobs-section {
      padding: 1rem 1rem;
    }

    .section-title {
      text-align: center;
      font-size: 25px;
      font-weight: 600;
      margin-bottom: 2rem;
      color: var(--light-text-primary);
      transition: color 0.3s ease;
    }
    .dark-mode .section-title {
      color: var(--dark-text-primary);
    }

    .job-card {
      background-color: var(--light-surface);
      border: 1px solid var(--light-border);
      border-radius: 15px;
      box-shadow: var(--shadow-light);
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%; /* Ensures cards in the same row have the same height */
    }
    .dark-mode .job-card {
      background-color: var(--dark-surface);
      border-color: var(--dark-border);
      box-shadow: var(--shadow-dark);
    }

    .job-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-hover-light);
    }
    .dark-mode .job-card:hover {
      box-shadow: var(--shadow-hover-dark);
    }

    .job-card-img {
      height: 200px;
      object-fit: cover;
    }
    
    .job-card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .job-card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--light-text-primary);
      transition: color 0.3s ease;
    }
    .dark-mode .job-card-title {
      color: var(--dark-text-primary);
    }

    .job-card-details {
      display: flex;
      gap: 1rem;
      color: var(--light-text-secondary);
      margin: 0.5rem 0 1rem 0;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
    .dark-mode .job-card-details {
      color: var(--dark-text-secondary);
    }

    .job-card-description {
      color: #495057;
      flex-grow: 1;
      margin-bottom: 1.5rem;
      transition: color 0.3s ease;
    }
    .dark-mode .job-card-description {
      color: var(--dark-text-secondary);
    }

    .apply-button {
      background: linear-gradient(45deg, #007bff, #0056b3);
      border: none;
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .apply-button:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
    }

    .no-results-section {
      text-align: center;
      padding: 4rem 1rem;
    }
    .dark-mode .no-results-section h3, .dark-mode .no-results-section p {
      color: var(--dark-text-secondary);
    }

    .upload-resume-btn {
      border-radius: 50px;
      font-weight: 600;
      padding: 0.75rem 2rem;
    }
    
    .careers-footer {
      text-align: center;
      padding: 2rem 1rem;
      background-color: var(--light-surface);
      border-top: 1px solid var(--light-border);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .dark-mode .careers-footer {
      background-color: var(--dark-surface);
      border-top: 1px solid var(--dark-border);
    }
    .dark-mode .careers-footer p {
      color: var(--dark-text-secondary);
    }
    
    /* --- SCROLLABLE MARQUEE STYLES --- */
    .job-marquee-wrapper {
        width: 100%;
        overflow: hidden;
        padding: 2rem 0;
        position: relative;
    }
    .job-marquee-wrapper:before, .job-marquee-wrapper:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        z-index: 2;
    }
    .job-marquee-wrapper:before {
        left: 0;
        background: linear-gradient(to right, var(--light-bg) 0%, rgba(248, 249, 250, 0) 100%);
    }
    .job-marquee-wrapper:after {
        right: 0;
        background: linear-gradient(to left, var(--light-bg) 0%, rgba(248, 249, 250, 0) 100%);
    }
    .dark-mode .job-marquee-wrapper:before {
        background: linear-gradient(to right, var(--dark-bg) 0%, rgba(18, 18, 18, 0) 100%);
    }
    .dark-mode .job-marquee-wrapper:after {
        background: linear-gradient(to left, var(--dark-bg) 0%, rgba(18, 18, 18, 0) 100%);
    }

    .job-marquee-track {
        display: flex;
        width: max-content;
        animation: marquee-scroll 40s linear infinite;
    }

    .job-marquee-wrapper:hover .job-marquee-track {
        animation-play-state: paused;
    }
    
    .job-item {
        flex-shrink: 0;
        width: 350px; /* Width of each card container */
        padding: 0 1rem; /* Space between cards */
    }

    @keyframes marquee-scroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
    }

    /* --- MODERN MODAL STYLES --- */
    .modal-modern .modal-content {
      background-color: var(--light-surface);
      border: none;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      transition: background-color 0.3s ease;
    }
    .dark-mode .modal-modern .modal-content {
      background-color: var(--dark-surface);
    }

    .modal-modern .modal-header {
      border-bottom: 1px solid var(--light-border);
      transition: border-color 0.3s ease;
    }
    .dark-mode .modal-modern .modal-header {
      border-bottom-color: var(--dark-border);
    }

    .modal-modern .modal-title {
      color: var(--light-text-primary);
      font-weight: 600;
      transition: color 0.3s ease;
    }
    .dark-mode .modal-modern .modal-title {
      color: var(--dark-text-primary);
    }
    
    .modal-modern .btn-close {
      filter: var(--light-bg)
    }
    .dark-mode .modal-modern .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
    }

    .form-group-modern {
      margin-bottom: 1.5rem;
    }

    .form-label-modern {
      font-weight: 500;
      color: var(--light-text-secondary);
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }
    .dark-mode .form-label-modern {
      color: var(--dark-text-secondary);
    }

    .form-control-modern {
      background-color: #f8f9fa;
      border: 1px solid var(--light-border);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: var(--light-text-primary);
      transition: all 0.3s ease;
    }
    .dark-mode .form-control-modern {
      background-color: #2a2a2a;
      border-color: var(--dark-border);
      color: var(--dark-text-primary);
    }
    .form-control-modern:focus {
      background-color: var(--light-surface);
      border-color: #80bdff;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    }
    .dark-mode .form-control-modern:focus {
      background-color: var(--dark-surface);
    }
  `;
  
  return (
    <>
      <style>{styles}</style>
      <div className="careers-page-container">
        <CustomNavbar />
        
        <section className="hero-section">
          <Container>
            <h3 className="hero-title">Find Your Next Opportunity</h3>
            <p className="hero-subtitle">
              Join our team of innovators and explorers. We're building the future, and we need your talent. Discover a career that challenges and inspires you.
            </p>
            <div className="search-bar-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search for your dream role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Container>
        </section>

        <section className="jobs-section">
          <Container>
            <h3 className="section-title">Open Positions</h3>
            {filteredJobs.length > 0 ? (
              <div className="job-marquee-wrapper">
                <div className="job-marquee-track">
                  {[...filteredJobs, ...filteredJobs].map((job, index) => (
                    <div className="job-item" key={index}>
                      <Card className="job-card">
                        <Card.Img variant="top" src={job.image} className="job-card-img" />
                        <Card.Body className="job-card-body">
                          <div>
                            <Card.Title className="job-card-title">{job.title}</Card.Title>
                            <div className="job-card-details">
                              <span><i className="bi bi-geo-alt-fill me-1"></i>{job.location}</span>
                              <span><i className="bi bi-briefcase-fill me-1"></i>{job.type}</span>
                            </div>
                            <Card.Text className="job-card-description">
                              {job.description}
                            </Card.Text>
                          </div>
                          <Button variant="primary" className="apply-button mt-auto" onClick={() => handleApplyClick(job)}>
                            Apply Now
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-results-section">
                <h3 className="text-muted">No matching roles found.</h3>
                <p className="my-3">You can upload your resume, and our team will get in touch with you for future opportunities.</p>
                <Button
                  variant="outline-primary"
                  className="upload-resume-btn"
                  onClick={() => setShowModal(true)} // Changed to open main modal directly
                >
                  Upload Your Resume
                </Button>
              </div>
            )}
          </Container>
        </section>
      </div>

      {/* --- Main Job Application Modal --- */}
      <Modal show={showModal} onHide={handleModalClose} centered size="lg" dialogClassName="modal-modern">
        <Modal.Header closeButton>
          <Modal.Title>{selectedJob ? `Job Application: ${selectedJob.title}` : 'Upload Your Resume'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">First Name <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Enter your first name" required />
              </Form.Group>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Last Name <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Enter your last name" required />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Email <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="you@example.com" required />
              </Form.Group>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Mobile Number <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="tel" name="mobile" value={formData.mobile} onChange={handleFormChange} placeholder="(123) 456-7890" required />
              </Form.Group>
            </Row>
             <Row>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Current Salary (Annual)</Form.Label>
                <Form.Control className="form-control-modern" type="number" name="currentSalary" value={formData.currentSalary} onChange={handleFormChange} placeholder="e.g., 50000" />
              </Form.Group>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Expected Salary (Annual)</Form.Label>
                <Form.Control className="form-control-modern" type="number" name="expectedSalary" value={formData.expectedSalary} onChange={handleFormChange} placeholder="e.g., 60000" />
              </Form.Group>
            </Row>
            <Row>
               <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Years of Experience <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="number" name="experience" value={formData.experience} onChange={handleFormChange} placeholder="e.g., 5" required />
              </Form.Group>
              <Form.Group as={Col} md="6" className="form-group-modern">
                <Form.Label className="form-label-modern">Resume/CV <span className="text-danger">*</span></Form.Label>
                <Form.Control className="form-control-modern" type="file" name="resume" onChange={handleFormChange} accept=".pdf,.doc,.docx" required />
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleModalClose} className="me-2 rounded-pill px-4">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="rounded-pill px-4">
                Submit Application
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered dialogClassName="modal-modern">
        <Modal.Body className="text-center p-4">
          <i className="bi bi-check-circle-fill text-success" style={{fontSize: '4rem', marginBottom: '1rem'}}></i>
          <h5 className="mt-3">Thank You!</h5>
          <p className="text-muted">Your application has been submitted successfully.</p>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)} className="mt-3 rounded-pill px-4">
            Close
          </Button>
        </Modal.Body>
      </Modal>
       <Footer />
    </>
  );
}

export default Careers;
