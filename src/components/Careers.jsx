import React, { useState } from 'react';
import { Navbar, Nav, Container, Card, Button, Form, Modal } from 'react-bootstrap';
import '../styles/Careers.css'; // Ensure your CSS file is correctly linked and updated
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';

// No videoUrls needed anymore as we're scrolling job cards

const jobs = [
  {
    title: 'Data Analyst',
    image: 'https://media.istockphoto.com/id/1867035079/photo/analytics-and-data-management-systems-business-analytics-and-data-management-systems-to-make.jpg?s=612x612&w=0&k=20&c=tFcJnBIWlkPhIumrPtkSJwFRNDMtdVfJ1CYbfUlx5fE=',
    description:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  {
    title: 'Scrum Master',
    image: 'https://t4.ftcdn.net/jpg/02/63/69/73/360_F_263697323_3B70wt0gY7DGoH8zWyWloJ5sZLkjcykV.jpg',
    description:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  {
    title: 'Cyber Security',
    image: 'https://t4.ftcdn.net/jpg/02/45/63/69/360_F_245636933_kY23ohGptK5t6n8wGSXIgLgVXWeHJRct.jpg',
    description:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  // Add more job listings here if you want more content to scroll
  {
    title: 'Software Engineer',
    image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg',
    description:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  {
    title: 'UI/UX Designer',
    image: 'https://media.istockphoto.com/id/1189377184/vector/mobile-apps-creation-of-a-mobile-application-web-page-created-from-separate-blocks-user.jpg?s=612x612&w=0&k=20&c=PqdUndWPh0bvCQ8sXctahDE0kdkERfRizThl1IByWjc=',
    description:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
];

function Careers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

   const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    currentSalary: '',
    expectedSalary: '',
    experience: '',
    resume: null,
  });

    const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      // For file input, store the file object
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


   // Handler for form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    // 1. Create the new submission object in the desired format
    const newSubmission = {
      id: Date.now(), // Use a timestamp for a unique ID
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      role: selectedJob.title,
      experience: Number(formData.experience),
      currentSalary: formData.currentSalary,
      expectedSalary: formData.expectedSalary,
      resume: formData.resume ? formData.resume.name : 'N/A', // Save only the file name
      status: 'Pending',
    };

    // 2. Get existing submissions from local storage, or initialize an empty array
    const existingSubmissions = JSON.parse(localStorage.getItem('career_submissions')) || [];

    // 3. Prepend the new submission to the beginning of the array
    const updatedSubmissions = [newSubmission, ...existingSubmissions];

    // 4. Save the updated array back to local storage
    localStorage.setItem('career_submissions', JSON.stringify(updatedSubmissions));

    // 5. Close the form modal and show the success message
    handleModalClose();
    setShowSuccessModal(true);
    
    // 6. Reset the form for the next application
    setFormData({
      firstName: '', lastName: '', email: '', mobile: '',
      currentSalary: '', expectedSalary: '', experience: '', resume: null,
    });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="careers-container">
      <CustomNavbar />
      <Container className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center shadow-sm" style={{ borderRadius: '50px', backgroundColor: '#f5f5f5', padding: '8px 16px' }}>
          <i className="bi bi-search text-muted me-2" />
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ boxShadow: 'none', borderRadius: '50px' }}
            placeholder="Search by role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-link text-decoration-none text-secondary"
              onClick={() => setSearchTerm('')}
              style={{ fontSize: '20px', lineHeight: '1', marginLeft: '-30px' }}
            >
              &times;
            </button>
          )}
        </div>

        <h2 className="careers-title">FEATURED JOBS</h2>
        <p className="careers-subtext text-center">
          At TechXplorers, we're not just hiring — we're investing in explorers who want to build, learn, and grow. Whether you're a fresher, intern, or pro — there's a place for you here.
        </p>
      </Container>

      {/* --- Scrolling Job Cards Section --- */}
      <Container className="my-5 no-padding"> {/* Using no-padding for full width scroll */}
        <h2 className="mb-4 text-center">EXPLORE OPEN ROLES :</h2> {/* New heading for this section */}
        <div className="job-marquee-wrapper">
          <div className="job-marquee-track">
            {/* Duplicate the job cards for continuous scroll effect */}
            {[...filteredJobs, ...filteredJobs].map((job, index) => (
              <div className="job-item" key={index}> {/* Renamed from job-card */}
                <Card className="shadow-sm job-card-scrollable"> {/* Apply card styles */}
                  <img src={job.image} alt={job.title} className="card-img-top" />
                  <Card.Body>
                    <Card.Title>Role : {job.title}</Card.Title>
                    <Card.Text>{job.description}</Card.Text>
                    <div className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        className="rounded-20 px-4 py-2"
                        onClick={() => handleApplyClick(job)}
                      >
                        Apply
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
        {filteredJobs.length === 0 && ( // Display this if no search results in the scroll
          <div className="text-center mt-5">
            <h2 className="text-muted">Sorry, no matching roles found.</h2>
            <br />
            <h4>You can upload your resume below, Our team will get in touch with you.</h4>
            <br />
            <Button
              variant="outline-primary"
              className="px-4 py-2"
              onClick={() => setShowResumeModal(true)}
            >
              Upload Resume / CV
            </Button>
          </div>
        )}
      </Container>
      {/* --- End Scrolling Job Cards Section --- */}

      {/* Apply Form Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered dialogClassName="modal-70w">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* The onSubmit handler is now linked to our new function */}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">First Name <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="First Name" required style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Last Name <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Last Name" required style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Email <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter your email" required style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Mobile Number<span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleFormChange} inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder="Enter your mobile number" required style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Current Salary<span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" name="currentSalary" value={formData.currentSalary} onChange={handleFormChange} inputMode="numeric" pattern="[0-9]*" placeholder="Enter your Current Salary" required style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Expected Salary<span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleFormChange} inputMode="numeric" pattern="[0-9]*" placeholder="Enter your Expected Salary" required style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">How Many Years Of Experience in {selectedJob?.title} <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="number" name="experience" value={formData.experience} onChange={handleFormChange} placeholder="Enter years of experience" required style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Label className="form-label-custom">Resume/CV (Upload File)<span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control type="file" name="resume" onChange={handleFormChange} accept=".pdf,.doc,.docx" required style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit">Submit Application</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Resume Upload Modal */}
      <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            setShowResumeModal(false);
            setShowSuccessModal(true);
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="text" placeholder="Enter your name" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="email" placeholder="Enter your email" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="text" inputMode="numeric" maxLength={10} placeholder="Enter your mobile number" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Resume<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="file" accept=".pdf,.doc,.docx" required />
            </Form.Group>
            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" variant="primary">Submit</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thank You!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Your application has been submitted successfully.</p>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Close</Button>
        </Modal.Body>
      </Modal>

      <footer className="py-0">
        <Container>
          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-2 mb-md-0">© {new Date().getFullYear()} TechXplorers Pvt. Ltd. All rights reserved.</p>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <div>
              <a href="#" style={{ color: 'black' }} className="me-2 text-decoration-none">Privacy & Legal</a>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <a href="/contactus" style={{ color: 'black' }} className="text-decoration-none">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Careers;