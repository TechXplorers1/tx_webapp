import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard/ManagerData.css';
import { Table, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import {
  FaUserCircle,
  FaBars,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from 'react-icons/fa';

const ManagerData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientsDropdownOpen, setClientsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedManager, setExpandedManager] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [managerToDeactivate, setManagerToDeactivate] = useState(null);

  const [originalTeamLeads, setOriginalTeamLeads] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [originalInterns, setOriginalInterns] = useState([]);

  const [filteredTeamLeads, setFilteredTeamLeads] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  const [teamLeadSearch, setTeamLeadSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [internSearch, setInternSearch] = useState('');

  const [currentManagerIndex, setCurrentManagerIndex] = useState(null);
  const [newManager, setNewManager] = useState({
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    password: '',
    role: 'Manager',
    active: true
  });

  const [managers, setManagers] = useState([
    {
      firstname: "Sreenivasulu",
      lastname:"Sake",
      mobile: "+91 9874561230",
      email: "seenu@gmail.com",
      password: "07072023@Tx123",
      role: "Manager",
      active: true,
      assignedPeople: [
        {name:'Murali',mobile:'+91 987456123', email: 'murali@gmail.com', role: 'Team Lead' },
        {name:'Madhu',mobile:'+91 987456123', email: 'madhuemployee@gmail.com', role: 'Employee' }
      ]
    },
    {
      firstname: "Vamsi",
      lastname:"V",
      mobile: "+91 7894561230",
      email: "vamsi@gmail.com",
      password: "07072023@TxSm",
      role: "Manager",
      active: true,
      assignedPeople: [
        { name:'Kavitha',mobile:'+91 987456123', email: 'kavitha@gmail.com', role: 'Team Lead' },
        { name:'santhosh',mobile:'+91 987456123',email: 'santhoshemployee@gmail.com', role: 'Employee' }
      ]
    },
  ]);

  useEffect(() => {
    const initialTeamLeads = [
      { name: 'Murali',mobile:'+91 9874561230', email: 'murali@gmail.com', role: 'Team Lead' },
      { name: 'Vamsi',mobile:'+91 9874561230', email: 'vamsi@gmail.com', role: 'Team Lead' },
      { name: 'Kavitha',mobile:'+91 9874561230', email: 'kavitha@gmail.com', role: 'Team Lead' },
      { name: 'Bharath',mobile:'+91 9874561230', email: 'bharath@gmail.com', role: 'Team Lead' },
      { name: 'SaiKrishna',mobile:'+91 9874561230', email: 'saikrishna@gmail.com', role: 'Team Lead' },
      { name: 'Vyshnavi',mobile:'+91 9874561230', email: 'vyshnavi@gmail.com', role: 'Team Lead' }
    ];
    const initialEmployees = [
      { name: 'Madhu',mobile:'+91 9874561230', email: 'madhuemployee@gmail.com', role: 'Employee' },
      { name: 'krishna',mobile:'+91 9874561230', email: 'krishnaemployee@gmail.com', role: 'Employee' },
      { name: 'arun',mobile:'+91 9874561230', email: 'arunemployee@gmail.com', role: 'Employee' },
      { name: 'dharani',mobile:'+91 9874561230', email: 'dharaniemployee@gmail.com', role: 'Employee' },
      { name: 'rajitha',mobile:'+91 9874561230', email: 'rajithaemployee@gmail.com', role: 'Employee' },
      { name: 'siva',mobile:'+91 9874561230', email: 'sivaemployee@gmail.com', role: 'Employee' },
      { name: 'ashok',mobile:'+91 9874561230', email: 'ashokemployee@gmail.com', role: 'Employee' },
      { name: 'deepak',mobile:'+91 9874561230', email: 'deepakemployee@gmail.com', role: 'Employee' },
      { name: 'santhosh',mobile:'+91 9874561230', email: 'santhoshemployee@gmail.com', role: 'Employee' }
    ];
    const initialInterns = [
      { name: 'Sandeep',mobile:'+91 9874561230', email: 'sandeepmployee@gmail.com', role: 'Intern' },
      { name: 'Humer',mobile:'+91 9874561230', email: 'humeremployee@gmail.com', role: 'Intern' },
      { name: 'Chaveen',mobile:'+91 9874561230', email: 'chaveenemployee@gmail.com', role: 'Intern' },
    ];

    setOriginalTeamLeads(initialTeamLeads);
    setOriginalEmployees(initialEmployees);
    setOriginalInterns(initialInterns);
  }, []);

  const getAllAssignedPeople = () => {
    return managers.flatMap(manager => manager.assignedPeople || []);
  };

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedManagerIndex, setSelectedManagerIndex] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleClientsDropdown = () => setClientsDropdownOpen(!clientsDropdownOpen);

  const handleLogout = () => {
    navigate('/');
  };

  const goToDashboard = () => navigate('/AdminDashboard');
  const goToManagers = () => navigate('/managers');
  const goToClients = () => navigate('/clients');
  const goToEmployees = () => navigate('/employees');
  const goToTeamLeads = () => navigate('/teamleads');



  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentManagerIndex(null);
    setNewManager({ name: '', mobile: '', email: '', password: '', role: 'Manager', active: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManager = () => {
     const { firstname, lastname, mobile, email, password } = newManager;
    if (!firstname || !lastname || !mobile || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    if (isEditing) {
      const updatedManagers = [...managers];
      updatedManagers[currentManagerIndex] = newManager;
      setManagers(updatedManagers);
    } else {
      setManagers([...managers, { ...newManager, assignedPeople: [] }]);
    }

    handleCloseModal();
  };

  const openAssignModal = (index) => {
    setSelectedManagerIndex(index);
    const previouslyAssigned = managers[index].assignedPeople || [];
    setSelectedPeople(previouslyAssigned);
    
    const allAssigned = getAllAssignedPeople();
    
    // Filter people - show only unassigned or those already assigned to this manager
    setFilteredTeamLeads(originalTeamLeads.filter(tl => 
      !allAssigned.some(a => a.email === tl.email) || 
      previouslyAssigned.some(pa => pa.email === tl.email)
    ));
    
    setFilteredEmployees(originalEmployees.filter(emp => 
      !allAssigned.some(a => a.email === emp.email) || 
      previouslyAssigned.some(pa => pa.email === emp.email))
    );
    
    setFilteredInterns(originalInterns.filter(int => 
      !allAssigned.some(a => a.email === int.email) || 
      previouslyAssigned.some(pa => pa.email === int.email)
    ));
    
    setAssignModalOpen(true);
  };

  const handleAssignDone = () => {
    const updatedManagers = [...managers];
    updatedManagers[selectedManagerIndex].assignedPeople = selectedPeople;
    setManagers(updatedManagers);
    setAssignModalOpen(false);
  };

  const togglePersonSelection = (person) => {
    setSelectedPeople((prev) =>
      prev.some(p => p.email === person.email)
        ? prev.filter(p => p.email !== person.email)
        : [...prev, person]
    );
  };

  const toggleManagerExpand = (index) => {
    setExpandedManager(expandedManager === index ? null : index);
  };
 
const [isActivating, setIsActivating] = useState(false);

  const toggleActivation = (index) => {
    const manager = managers[index];
    setManagerToDeactivate(index);
    
    if (manager.active) {
      // Show deactivation confirmation
      setIsActivating(false);
      setConfirmationOpen(true);
    } else {
      // Show activation confirmation
      setIsActivating(true);
      setConfirmationOpen(true);
    }
  };

 const confirmToggle = () => {
    if (managerToDeactivate !== null) {
      const updatedManagers = [...managers];
      updatedManagers[managerToDeactivate].active = !updatedManagers[managerToDeactivate].active;
      setManagers(updatedManagers);
      setConfirmationOpen(false);
      setManagerToDeactivate(null);
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="manager-header">
        <h2 className="logo-heading">Managers Data</h2>
      </div>

      <div className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars size={24} />
      </div>

      <div className={`manager-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close-btn" onClick={toggleSidebar}>
            <FaArrowLeft size={20} />
          </div>
          <FaUserCircle size={50} className="user-icon" />
        </div>

        <ul className="sidebar-menu">
          <li onClick={goToDashboard}>Dashboard</li>
          <li onClick={goToClients}>
            <span>Clients</span>
            {/* {clientsDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />} */}
          </li>
      
          <li onClick={goToManagers}>Managers</li>
          <li onClick={goToTeamLeads}>Team Leads</li>
          <li onClick={goToEmployees}>Employees</li>
        </ul>

        <div className="sidebar-footer">
          <p>Help & Support</p>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <InputGroup className="w-50">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="info">Search</Button>
          </InputGroup>
          <Button variant="success" onClick={handleShowModal}>+ Add Manager</Button>
        </div>

        <Table striped bordered hover responsive className="text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>MOBILE</th>
              <th>EMAIL</th>
              <th>PASSWORD</th>
              <th>ROLE</th>
              <th>PEOPLE</th>
              <th>EDIT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {managers
              .filter((manager) =>
                [manager.firstname,manager.lastname, manager.email, manager.mobile].some((field) =>
                  field.toLowerCase().includes(searchTerm.toLowerCase())
                )
              ).map((manager, index) => (
                <React.Fragment key={index}>
                  <tr className="table-warning">
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        {manager.firstname}
                        <Button
                          variant="link"
                          onClick={() => toggleManagerExpand(index)}
                          className="p-0"
                        >
                          {expandedManager === index ? <FaChevronUp /> : <FaChevronDown />}
                        </Button>
                      </div>
                    </td>
                    <td>{manager.lastname}</td>
                    <td>{manager.mobile}</td>
                    <td>{manager.email}</td>
                    <td>{manager.password}</td>
                    <td>{manager.role}</td>
                    <td>
                      <Button size="sm" variant="success" onClick={() => openAssignModal(index)}>
                        Add Employees ({manager.assignedPeople?.length || 0})
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="text-decoration-none"
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentManagerIndex(index);
                          setNewManager(manager);
                          setShowModal(true);
                        }}
                      >
                        ✏️
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="me-2">{manager.active ? 'Active' : 'Inactive'}</span>
                        <Form.Check
                          type="switch"
                          id={`active-switch-${index}`}
                          checked={manager.active}
                          onChange={() => toggleActivation(index)}
                        />
                      </div>
                    </td>
                  </tr>
                  {expandedManager === index && (
                    <tr>
                      <td colSpan="8">
                        <div className="p-3">
                          <h5>Assigned Team Leads & Employees</h5>
                          <Table striped bordered size="sm">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Role</th>
                              </tr>
                            </thead>
                            <tbody>
                              {manager.assignedPeople?.length > 0 ? (
                                manager.assignedPeople.map((person, idx) => (
                                  <tr key={`assigned-${idx}`}>
                                    <td>{idx + 1}</td>
                                    <td>{person.name}</td>
                                    <td>{person.mobile}</td>
                                    <td>{person.email}</td>
                                    <td>{person.role}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-muted">No people assigned yet</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Add/Edit Manager */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Manager' : 'Add Manager'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstname" value={newManager.firstname} onChange={handleInputChange} />
            </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control type="text" name="lastname" value={newManager.lastname} onChange={handleInputChange} />
                        </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={newManager.mobile} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newManager.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={newManager.password} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={newManager.role}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddManager}>
            {isEditing ? 'Update Manager' : 'Add Manager'}
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Update the Confirmation Modal */}
      <Modal show={confirmationOpen} onHide={() => setConfirmationOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isActivating ? 'Confirm Activation' : 'Confirm Deactivation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isActivating 
            ? 'Are you sure you want to mark this Manager as active?'
            : 'Are you sure you want to mark this Manager as inactive?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant={isActivating ? 'success' : 'danger'} 
            onClick={confirmToggle}
          >
            {isActivating ? 'Yes, Activate' : 'Yes, Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Assign People */}
      <Modal show={assignModalOpen} onHide={() => setAssignModalOpen(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Assign People</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Team Leads</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Team Leads by name or email"
              value={teamLeadSearch}
              onChange={(e) => setTeamLeadSearch(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeamLeads
                .filter(p =>
                  p.name.toLowerCase().includes(teamLeadSearch.toLowerCase()) ||
                  p.email.toLowerCase().includes(teamLeadSearch.toLowerCase())
                )
                .map((person, idx) => (
                  <tr key={`tl-${idx}`}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPeople.some(p => p.email === person.email)}
                        onChange={() => togglePersonSelection(person)}
                      />
                    </td>
                    <td>{person.name}</td>
                    <td>{person.mobile}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <h5 className="mt-4">Employees</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Employees by name or email"
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees
                .filter(p =>
                  p.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                  p.email.toLowerCase().includes(employeeSearch.toLowerCase())
                )
                .map((person, index) => (
                  <tr key={`emp-${index}`}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPeople.some(p => p.email === person.email)}
                        onChange={() => togglePersonSelection(person)}
                      />
                    </td>
                    <td>{person.name}</td>
                    <td>{person.mobile}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <h5 className="mt-4">Interns</h5>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search Interns by name or email"
              value={internSearch}
              onChange={(e) => setInternSearch(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns
                .filter(p =>
                  p.name.toLowerCase().includes(internSearch.toLowerCase()) ||
                  p.email.toLowerCase().includes(internSearch.toLowerCase())
                )
                .map((person, index) => (
                  <tr key={`int-${index}`}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPeople.some(p => p.email === person.email)}
                        onChange={() => togglePersonSelection(person)}
                      />
                    </td>
                    <td>{person.name}</td>
                    <td>{person.mobile}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAssignDone}>Done</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerData;