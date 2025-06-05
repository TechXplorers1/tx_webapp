import React, { useState } from 'react';
import { Navbar, Nav, Container, Card, Button, Form, Modal } from 'react-bootstrap';
import '../styles/Careers.css';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';

const jobs = [
  {
    title: 'Data Analyst',
    image: 'https://media.istockphoto.com/id/1867035079/photo/analytics-and-data-management-systems-business-analytics-and-data-management-systems-to-make.jpg?s=612x612&w=0&k=20&c=tFcJnBIWlkPhIumrPtkSJwFRNDMtdVfJ1CYbfUlx5fE=',
    description:
      'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  {
    title: 'Scrum Master',
    image: 'https://t4.ftcdn.net/jpg/02/63/69/73/360_F_263697323_3B70wt0gY7DGoH8zWyWloJ5sZLkjcykV.jpg',
    description:
      'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
  {
    title: 'Cyber Security',
    image: 'https://t4.ftcdn.net/jpg/02/45/63/69/360_F_245636933_kY23ohGptK5t6n8wGSXIgLgVXWeHJRct.jpg',
    description:
      'Orem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation',
  },
];

function Careers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

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
        <div className="input-group mb-4" style={{ width: '300px' }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="careers-title">FEATURED JOBS</h2>
        <p className="careers-subtext text-center">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur.
        </p>
      </Container>

      <div className="job-cards">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div className="job-card" key={index}>
              <img src={job.image} alt="job" />
              <div className="job-info">
                <strong>Role :</strong> {job.title}
                <p>{job.description}</p>
                <div className="d-flex justify-content-center align-items-center mb-10">
                  <button
                    className="btn btn-primary rounded-20 px-4 py-2"
                    onClick={() => handleApplyClick(job)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h2 className="text-center text-muted">Sorry, no matching roles found.</h2>
            <br />
            <h4>You can upload your resume below, Our team will be get in touch with you</h4>
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
      </div>

      {/* Apply Form Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered dialogClassName="modal-70w">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            setShowSuccessModal(true);
            handleModalClose();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Name <span style={{ color: 'red' }}>*</span></Form.Label>
              <div className="d-flex gap-2">
                <Form.Control type="text" placeholder="First Name" required style={{ flex: 1 }} />
                <Form.Control type="text" placeholder="Last Name" required style={{ flex: 1 }} />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="email" placeholder="Enter your email" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="text" inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder="Enter your mobile number" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>How Many Years Of Experience in {selectedJob?.title} <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="number" placeholder="Enter years of experience" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Salary<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Enter your Current Salary" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expected Salary<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Enter your Expected Salary" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resume (Upload File)<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control type="file" accept=".pdf,.doc,.docx" required />
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

      <footer className="bg-white py-5">
        <Container>
          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-0 text-dark">Techxplorers ©️2025</p>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <div>
              <a href="#" className="text-dark me-2 text-decoration-none">Privacy & Legal</a>
              <a href="#" className="text-dark text-decoration-none">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Careers;
