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

  return (
    <div style={{ minHeight: "100vh", marginBottom: "3rem" }}>
      <JsNavbar />

      <div className="d-flex justify-content-center align-items-center py-5">
        <Card
          className="p-4 shadow-lg border my-5 w-100"
          style={{
            maxWidth: "570px",
            borderRadius: "20px"
          }}
        >
          <Card.Body>
            <h3 className="text-center fw-bold mb-4 text-primary">Create Account</h3>

            <Button 
              variant="outline-secondary" 
              className="w-100 mb-3 p-2 d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} /> Continue with Google
            </Button>

            <div className="text-center mb-3">OR</div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", marginBottom: "6px" }}>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text style={inputGroupTextStyle}><MdEmail /></InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                    style={{ ...formControlStyle, borderLeft: "none", borderRadius: "0 12px 12px 0" }}
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", marginBottom: "6px" }}>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text style={inputGroupTextStyle}><RiLockPasswordFill /></InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                    style={{ ...formControlStyle, borderLeft: "none", borderRadius: "0" }}
                  />
                  <InputGroup.Text
                    style={inputRightTextStyle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </InputGroup.Text>
                </InputGroup>
                <div style={{ fontSize: "0.85rem", marginTop: "4px", color: "#6c757d" }}>
                  At least 8 chars, incl. 1 uppercase, 1 lowercase, 1 number, 1 special (@, _, $, -)
                </div>
                <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", marginBottom: "6px" }}>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text style={inputGroupTextStyle}><RiLockPasswordFill /></InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!confirmPasswordError}
                    style={{ ...formControlStyle, borderLeft: "none", borderRadius: "0" }}
                  />
                  <InputGroup.Text
                    style={inputRightTextStyle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-bold mt-3"
                style={{
                  borderRadius: "12px",
                  fontSize: "1rem",
                  padding: "12px 0",
                  transition: "background-color 0.3s ease"
                }}
              >
                Sign Up
              </Button>

              <div className="text-center mt-3">
                Already Registered?{" "}
                <span
                  className="text-primary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </div>
            </Form>
          </Card.Body>
        </Card>
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
    </div>
  );
}
