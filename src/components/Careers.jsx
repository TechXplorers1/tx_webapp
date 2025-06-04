import React, { useState } from 'react';
import { Navbar, Nav, Container, Carousel, Card, Button, Form, Modal } from 'react-bootstrap';
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
        <input
          className="search-bar form-control mb-4"
          placeholder="Search by role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />

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
          <p className="text-center text-muted">Sorry, no matching roles found.</p>
        )}
      </div>

      {/* Apply Form Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              First Name <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control type="text" placeholder="Enter your first name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Last Name <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control type="text" placeholder="Enter your last name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email<span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="email" placeholder="Enter your email" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number<span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Enter your mobile number" required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>How Many Years Of Experience in {selectedJob?.title} <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="number" placeholder="Enter years of experience" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Current Salary<span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your Current Salary" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Expected Salary<span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="text" inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your Expected Salary" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Resume (Upload File)<span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control type="file" accept=".pdf,.doc,.docx" required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Application
          </Button>
    </Form>
  </Modal.Body>
</Modal>


      <footer className="bg-white py-5">
        <Container>
          <Form className="d-flex justify-content-center align-items-center mb-5">
            <Form.Control
              type="text"
              placeholder="Ask"
              className="me-2 rounded-0 py-2"
              style={{ width: '25%' }}
            />
            <button variant="primary" className="btn btn-primary rounded-0 px-4 py-2">
              Submit
            </button>
          </Form>

          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-0 text-dark">Techxplorers ©️2025</p>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <div>
              <a href="#" className="text-dark me-2 text-decoration-none">
                Privacy & Legal
              </a>
              <a href="#" className="text-dark text-decoration-none">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Careers;