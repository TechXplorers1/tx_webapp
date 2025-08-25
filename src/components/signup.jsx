import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import JsNavbar from './JsNavbar';
import { Card, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';


// Import Firebase auth and database services
import { auth, database } from "../../src/firebase";
import { 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must include one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must include one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Must include one number';
    if (!/[@_\$\-]/.test(value)) return 'Must include one special character (@, _, $, -)';
    return null;
  };

  // --- 🔀 Unified Login/Signup Processor (for Google) ---
  const processGoogleUser = async (user) => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${user.uid}`));
    let userDataFromDb;

    if (snapshot.exists()) {
        // User exists, get their data
        userDataFromDb = snapshot.val();
    } else {
        // New user signing up via Google
        // Create a new record for them in the database
        userDataFromDb = {
            email: user.email,
            roles: ['client'], // Assign a default role
        };
        await set(ref(database, 'users/' + user.uid), userDataFromDb);
    }
    
    const finalUserData = {
        uid: user.uid,
        email: user.email,
        roles: userDataFromDb.roles || ['client'],
        avatar: user.photoURL || `https://placehold.co/40x40/007bff/white?text=${user.email.charAt(0).toUpperCase()}`
    };

    sessionStorage.setItem('loggedInEmployee', JSON.stringify(finalUserData));
    login(finalUserData); // Log the user in via context

    // Role-based navigation
    if (finalUserData.roles.includes('admin')) {
        navigate('/adminpage');
    } else if (finalUserData.roles.includes('manager')) {
        navigate('/managerworksheet');
    } else if (finalUserData.roles.includes('employee')) {
        navigate('/employees');
    }else {
        navigate('/clientdashboard'); // Default for clients
    }
  };

  // --- 🔐 Firebase Email/Password Signup Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    let hasError = false;

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (!hasError) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

         const userRecord = {
          email: user.email,
          roles: ['client'],
        };

         await set(ref(database, 'users/' + user.uid), userRecord);

          const clientRecord = {
          email: user.email,
          firstName: user.email.split('@')[0], // Use part of email as a temporary name
          lastName: '',
          displayStatuses: ['registered'],
          // Add other default fields as needed
        };

        await set(ref(database, 'clients/' + user.uid), clientRecord);

        
        setShowSuccessModal(true);

        setTimeout(() => {
          handleCloseSuccessModal();
        }, 3000);

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            setEmailError("An account with this email already exists.");
        } else {
            setPasswordError("Failed to create an account. Please try again.");
            console.error("Firebase signup error:", error);
        }
      }
    }
  };

  // --- 🇬 Google Signup/Login Handler ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await processGoogleUser(result.user);
    } catch (error) {
        setPasswordError("Failed to sign in with Google. Please try again.");
        console.error("Firebase Google login error:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const formControlStyle = {
    borderRadius: '12px',
    padding: '12px 16px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxShadow: 'none',
  };

  const inputGroupTextStyle = {
    borderRadius: '12px 0 0 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ccc',
    fontSize: '1.2rem',
    padding: '0.75rem 1rem',
  };

  const inputRightTextStyle = {
    ...inputGroupTextStyle,
    borderRadius: '0 12px 12px 0',
    borderLeft: 'none',
    cursor: 'pointer',
  };

   const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .signup-page-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      padding: 1rem;
      background-color: #f8f9fa;
    }
    .signup-card {
      width: 100%;
      max-width: 480px;
      background-color: #ffffff;
      padding: 2.5rem;
      border: 1px solid #e9ecef;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      margin: 2rem 0;
    }
    .signup-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #0d6efd;
    }
    .google-btn {
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    .or-divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #adb5bd;
      margin: 1.5rem 0;
    }
    .or-divider::before, .or-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #dee2e6;
    }
    .or-divider:not(:empty)::before {
      margin-right: .5em;
    }
    .or-divider:not(:empty)::after {
      margin-left: .5em;
    }
    .form-label-modern {
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #495057;
    }
    .input-group-modern {
      display: flex;
      align-items: center;
      border: 1px solid #ced4da;
      border-radius: 8px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background-color: #f8f9fa;
    }
    .input-group-modern:focus-within {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      background-color: #ffffff;
    }
    .input-group-icon {
      padding: 0.75rem 1rem;
      color: #6c757d;
      font-size: 1.2rem;
    }
    .form-control-modern {
      border: none;
      box-shadow: none;
      background: transparent;
      flex-grow: 1;
      padding: 0.75rem 1rem;
      padding-left: 0;
    }
    .form-control-modern:focus {
      box-shadow: none;
      background: transparent;
    }
    .password-toggle-icon {
      cursor: pointer;
      padding-right: 1rem;
      color: #6c757d;
    }
    .signup-btn-modern {
      padding: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .signup-btn-modern:hover {
      transform: translateY(-2px);
    }
    .password-hint {
      font-size: 0.8rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }
  `;

  return (
      <>
      <style>{styles}</style>
      <div className="signup-page-wrapper">
        <JsNavbar />
        <div className="signup-card">
          <h3 className="text-center signup-title">Create an Account</h3>
          <Button
            variant="outline-secondary"
            className="w-100 mb-3 d-flex align-items-center justify-content-center gap-2 google-btn"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={22} /> Continue with Google
          </Button>
          <div className="or-divider">OR</div>

             <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-modern">Email</Form.Label>
              <div className={`input-group-modern ${emailError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><MdEmail /></span>
                <Form.Control
                  className="form-control-modern"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!emailError}
                />
              </div>
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label className="form-label-modern">Password</Form.Label>
              <div className={`input-group-modern ${passwordError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><RiLockPasswordFill /></span>
                <Form.Control
                  className="form-control-modern"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!passwordError}
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
              </div>
              <div className="password-hint">
                At least 8 chars, incl. uppercase, lowercase, number, and special character (@, _, $, -)
              </div>
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
            </Form.Group>

               <Form.Group className="mb-4">
              <Form.Label className="form-label-modern">Confirm Password</Form.Label>
              <div className={`input-group-modern ${confirmPasswordError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><RiLockPasswordFill /></span>
                <Form.Control
                  className="form-control-modern"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!confirmPasswordError}
                />
              </div>
              <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
            </Form.Group>

              <Button type="submit" className="w-100 btn btn-primary text-white fw-bold signup-btn-modern">
              Sign Up
            </Button>

               <div className="text-center mt-3">
              <span>Already have an account?</span>
              <span
                style={{ color: '#007bff', fontWeight: 600, marginLeft: '0.5rem', cursor: 'pointer' }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </Form>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Body className="text-center p-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    alt="Success"
                    style={{ width: '80px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/28a745/white?text=OK'; }}
                  />
                  <h5 className="mt-3 text-success">Account successfully created!</h5>
                </Modal.Body>
      </Modal>
    </>
  );
}
