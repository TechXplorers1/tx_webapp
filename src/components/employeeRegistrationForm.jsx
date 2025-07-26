import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Country, State, City } from 'country-state-city';
import successImage from '../assets/successImage.png'; // Adjust path as needed

const EmployeeRegistrationForm = ({ onFormSubmit }) => {
  // Styles for various elements to achieve a modern look (all existing styles are preserved)
  const formContainerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '35px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    background: '#ffffff',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#333',
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
  };

  const subHeaderStyle = {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '16px',
    marginBottom: '40px',
  };

  const formSectionStyle = {
    marginBottom: '30px',
  };

  const labelValueContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const sectionTitleStyle = {
    color: '#34495e',
    fontSize: '22px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginBottom: '25px',
    marginTop: '35px',
    fontWeight: '600',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    fontSize: '15px',
    fontWeight: '500',
    color: '#555',
  };

  const valueStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '15px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#3498db',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20512%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M192%20256L64%20128v256l128-128z%22%2F%3E%3C%2Fsvg%3E')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '12px',
    paddingRight: '35px',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '90px',
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '13px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    width: 'auto',
    marginTop: '30px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const buttonHoverStyle = {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)',
  };

  const modalHeaderStyle = {
    borderBottom: 'none',
    paddingBottom: '15px',
    textAlign: 'center',
  };

  const modalTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
  };

  const modalBodyStyle = {
    padding: '20px 30px',
    lineHeight: '1.8',
    color: '#444',
  };

  const modalFooterStyle = {
    borderTop: 'none',
    paddingTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  };

  const successMessageStyle = {
    textAlign: 'center',
    marginTop: '60px',
    padding: '30px',
    background: '#e9f7ef',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.1)',
  };

  const successImageStyle = {
    width: '120px',
    height: '120px',
    marginBottom: '25px',
  };

  const successTitleStyle = {
    color: '#27ae60',
    fontWeight: '700',
    fontSize: '32px',
    marginBottom: '15px',
  };

  const successTextStyle = {
    color: '#555',
    fontSize: '18px',
  };


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    personalNumber: '',
    alternativeNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipcode: '',
    dateOfJoin: '',
    personalMail: '',
  });

  const [allCountries, setAllCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [personalNumberCountryCode, setPersonalNumberCountryCode] = useState('');
  const [alternativeNumberCountryCode, setAlternativeNumberCountryCode] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const india = Country.getAllCountries().find(country => country.name === 'India');
    if (india) {
      setFormData(prev => ({ ...prev, country: india.isoCode }));
      setPersonalNumberCountryCode(india.phonecode);
      setAlternativeNumberCountryCode(india.phonecode);
      setStates(State.getStatesOfCountry(india.isoCode));
    }
    setAllCountries(Country.getAllCountries());
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    const countryIsoCode = e.target.value;
    const selectedCountry = allCountries.find(c => c.isoCode === countryIsoCode);
    setFormData((prev) => ({ ...prev, country: countryIsoCode, state: '', city: '' }));
    if (selectedCountry) {
        setPersonalNumberCountryCode(selectedCountry.phonecode);
        setAlternativeNumberCountryCode(selectedCountry.phonecode);
    }
    const statesList = State.getStatesOfCountry(countryIsoCode);
    setStates(statesList);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormData((prev) => ({ ...prev, state: stateCode, city: '' }));
    const citiesList = City.getCitiesOfState(formData.country, stateCode);
    setCities(citiesList);
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }));
  };

  const handleReview = (e) => {
    e.preventDefault();
    setShowReviewModal(true);
  };

  // Handle final submission after review
  const handleFinalSubmit = () => {
    setShowReviewModal(false);
    setShowSuccessMessage(true);

    const newEmployee = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      maritalStatus: formData.maritalStatus,
      personalNumber: formData.personalNumber,
      alternativeNumber: formData.alternativeNumber,
      personalMail: formData.personalMail,
      address: formData.address,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      zipcode: formData.zipcode,
      dateOfJoin: formData.dateOfJoin,
      status: "Awaiting",
      designations: "No designations assigned",
      passwordStatus: "Password Created",
      submittedOn: new Date().toLocaleString(),
    };

    // NEW: Save to local storage
    try {
      const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      const updatedEmployees = [...existingEmployees, newEmployee];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    } catch (error) {
      console.error("Failed to save to local storage", error);
    }
    
    // This function can still be called if a parent component needs to react
    if (onFormSubmit) {
       onFormSubmit(newEmployee);
    }

    setTimeout(() => {
      setShowSuccessMessage(false);
      // Reset form data
      const india = Country.getAllCountries().find(country => country.name === 'India');
      setFormData({
        firstName: "", lastName: "", gender: "", dateOfBirth: "", maritalStatus: "",
        personalNumber: "", alternativeNumber: "", country: india ? india.isoCode : "",
        state: "", city: "", address: "", zipcode: "", dateOfJoin: "", personalMail: "",
      });
      if (india) {
        setPersonalNumberCountryCode(india.phonecode);
        setAlternativeNumberCountryCode(india.phonecode);
        setStates(State.getStatesOfCountry(india.isoCode));
        setCities([]);
      }
    }, 5000);
  };

  const getDisplayName = (type, code) => {
    if (!code) return '-';
    try {
      if (type === 'country') return Country.getCountryByCode(code)?.name;
      if (type === 'state') return State.getStateByCodeAndCountry(code, formData.country)?.name;
    } catch (error) {
        return code;
    }
    return code;
  };


  return (
    <div style={formContainerStyle}>
      {showSuccessMessage && (
        <div style={successMessageStyle}>
          <img
            src={successImage}
            alt="Success"
            style={successImageStyle}
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x120/e9f7ef/27ae60?text=Success'; }}
          />
          <p style={successTextStyle}>Your submission has been sent successfully.</p>
        </div>
      )}

      {!showSuccessMessage && (
        <>
          <h2 style={headerStyle}>Employee Registration</h2>
          <p style={subHeaderStyle}>Fill in your details to register as an employee</p>
          <form onSubmit={handleReview}>
            {/* --- All form fields remain unchanged --- */}
            <h3 style={sectionTitleStyle}>Personal Information</h3>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="firstName" style={labelStyle}>First Name <span style={{color: 'red'}}>*</span></label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="lastName" style={labelStyle}>Last Name <span style={{color: 'red'}}>*</span></label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="gender" style={labelStyle}>Gender <span style={{color: 'red'}}>*</span></label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required style={selectStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="dateOfBirth" style={labelStyle}>Date of Birth <span style={{color: 'red'}}>*</span></label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="maritalStatus" style={labelStyle}>Marital Status <span style={{color: 'red'}}>*</span></label>
                <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required style={selectStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle)}>
                  <option value="">Select marital status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
               <div style={{ flex: 1 }} />
            </div>

            <h3 style={sectionTitleStyle}>Contact Information</h3>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="personalNumber" style={labelStyle}>Personal Number <span style={{color: 'red'}}>*</span></label>
                    <div style={{ display: 'flex' }}>
                        <select value={personalNumberCountryCode} onChange={(e) => setPersonalNumberCountryCode(e.target.value)} style={{ ...selectStyle, width: '100px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle, { width: '130px', borderTopRightRadius: 0, borderBottomRightRadius: 0 })} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle, { width: '130px', borderTopRightRadius: 0, borderBottomRightRadius: 0 })}>
                            {allCountries.map(country => (<option key={country.isoCode} value={country.phonecode}>{country.flag} +{country.phonecode}</option>))}
                        </select>
                        <input type="tel" id="personalNumber" name="personalNumber" value={formData.personalNumber} onChange={handleChange} placeholder="e.g., 9876543210" pattern="[0-9]{10}" title="Please enter a 10-digit number" required style={{...inputStyle, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 })} onBlur={(e) => Object.assign(e.target.style, inputStyle, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 })} />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="alternativeNumber" style={labelStyle}>Alternative Number</label>
                    <div style={{ display: 'flex' }}>
                           <select value={alternativeNumberCountryCode} onChange={(e) => setAlternativeNumberCountryCode(e.target.value)} style={{ ...selectStyle, width: '100px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle, { width: '130px', borderTopRightRadius: 0, borderBottomRightRadius: 0 })} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle, { width: '130px', borderTopRightRadius: 0, borderBottomRightRadius: 0 })}>
                            {allCountries.map(country => (<option key={country.isoCode} value={country.phonecode}>{country.flag} +{country.phonecode}</option>))}
                        </select>
                        <input type="tel" id="alternativeNumber" name="alternativeNumber" value={formData.alternativeNumber} onChange={handleChange} placeholder="Optional" pattern="[0-9]{10}" title="Please enter a 10-digit number" style={{...inputStyle, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 })} onBlur={(e) => Object.assign(e.target.style, inputStyle, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 })} />
                    </div>
                </div>
            </div>
            <div style={{ ...formGroupStyle, marginBottom: '25px' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="personalMail" style={labelStyle}>Personal Mail <span style={{color: 'red'}}>*</span></label>
                <input type="email" id="personalMail" name="personalMail" value={formData.personalMail} onChange={handleChange} placeholder="Enter your personal email" required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
            </div>

            <h3 style={sectionTitleStyle}>Address Information</h3>
            <div style={formGroupStyle}>
                <label htmlFor="address" style={labelStyle}>Full Address <span style={{color: 'red'}}>*</span></label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete address" required style={textareaStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, textareaStyle)} onBlur={(e) => Object.assign(e.target.style, textareaStyle)}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="country" style={labelStyle}>Country <span style={{color: 'red'}}>*</span></label>
                <select onChange={handleCountryChange} value={formData.country} style={selectStyle} required onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle)}>
                  <option value="">Select Country</option>
                  {allCountries.map((country) => (<option key={country.isoCode} value={country.isoCode}>{country.name}</option>))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="state" style={labelStyle}>State <span style={{color: 'red'}}>*</span></label>
                <select onChange={handleStateChange} value={formData.state} style={selectStyle} required onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle)}>
                  <option value="">Select State</option>
                  {states.map((state) => (<option key={state.isoCode} value={state.isoCode}>{state.name}</option>))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="city" style={labelStyle}>City <span style={{color: 'red'}}>*</span></label>
                <select onChange={handleCityChange} value={formData.city} style={selectStyle} required onFocus={(e) => Object.assign(e.target.style, inputFocusStyle, selectStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle, selectStyle)}>
                  <option value="">Select City</option>
                  {cities.map((city) => (<option key={city.name} value={city.name}>{city.name}</option>))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="zipcode" style={labelStyle}>Zipcode <span style={{color: 'red'}}>*</span></label>
                <input type="text" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Enter zipcode" required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
            </div>

            <h3 style={sectionTitleStyle}>Employment Information</h3>
            <div style={{ display: 'flex', gap: '20px', ...formGroupStyle }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="dateOfJoin" style={labelStyle}>Date of Join <span style={{color: 'red'}}>*</span></label>
                <input type="date" id="dateOfJoin" name="dateOfJoin" value={formData.dateOfJoin} onChange={handleChange} required style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
              </div>
              <div style={{ flex: 1 }} />
            </div>

            <button type="submit" style={buttonStyle} onMouseEnter={(e) => Object.assign(e.target.style, buttonStyle, buttonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}>
              Review Application
            </button>
          </form>

         <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg" centered>
            <Modal.Header closeButton style={modalHeaderStyle}>
                <Modal.Title style={modalTitleStyle}>Review Your Application</Modal.Title>
            </Modal.Header>
            <Modal.Body style={modalBodyStyle}>
                {/* --- Review modal content remains unchanged --- */}
                <div style={formSectionStyle}>
                    <h3 style={sectionTitleStyle}>Personal Information</h3>
                    <div style={formGroupStyle}>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>First Name</span><span style={valueStyle}>{formData.firstName || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Last Name</span><span style={valueStyle}>{formData.lastName || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Gender</span><span style={valueStyle}>{formData.gender || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Date of Birth</span><span style={valueStyle}>{formData.dateOfBirth || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Marital Status</span><span style={valueStyle}>{formData.maritalStatus || '-'}</span></div>
                    </div>
                </div>
                <div style={formSectionStyle}>
                    <h3 style={sectionTitleStyle}>Contact Information</h3>
                    <div style={formGroupStyle}>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Personal Number</span><span style={valueStyle}>{formData.personalNumber ? `+${personalNumberCountryCode} ${formData.personalNumber}`: '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Alternative Number</span><span style={valueStyle}>{formData.alternativeNumber ? `+${alternativeNumberCountryCode} ${formData.alternativeNumber}`: '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Personal Mail</span><span style={valueStyle}>{formData.personalMail || '-'}</span></div>
                    </div>
                </div>
                <div style={formSectionStyle}>
                    <h3 style={sectionTitleStyle}>Address Information</h3>
                    <div style={formGroupStyle}>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Address</span><span style={valueStyle}>{formData.address || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Country</span><span style={valueStyle}>{getDisplayName('country', formData.country) || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>State</span><span style={valueStyle}>{getDisplayName('state', formData.state, formData.country) || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>City</span><span style={valueStyle}>{formData.city || '-'}</span></div>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Zipcode</span><span style={valueStyle}>{formData.zipcode || '-'}</span></div>
                    </div>
                </div>
                <div style={formSectionStyle}>
                    <h3 style={sectionTitleStyle}>Employment Information</h3>
                    <div style={formGroupStyle}>
                        <div style={labelValueContainerStyle}><span style={labelStyle}>Date of Join</span><span style={valueStyle}>{formData.dateOfJoin || '-'}</span></div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={modalFooterStyle}>
                <button style={{ backgroundColor: '#6c757d', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '10px' }} onClick={() => setShowReviewModal(false)}>Edit</button>
                <button style={{ backgroundColor: '#2ecc71', color: '#fff', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} onClick={handleFinalSubmit}>Submit Application</button>
            </Modal.Footer>
        </Modal>
        </>
      )}
    </div>
  );
};

export default EmployeeRegistrationForm;
