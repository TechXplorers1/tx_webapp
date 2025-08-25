import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import JsNavbar from './JsNavbar';
import { Button, Modal, Form, InputGroup, Alert } from 'react-bootstrap';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from '../components/AuthContext';

// Import Firebase services
import { auth, database } from "../../src/firebase";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { ref, get, child, set } from "firebase/database";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Password Reset State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [modalAlert, setModalAlert] = useState({ type: "", message: "" });

  // --- 🔀 Unified Login Processor ---
  const processLogin = async (user) => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${user.uid}`));
    let userDataFromDb;

    if (snapshot.exists()) {
        // User exists, get their data
        userDataFromDb = snapshot.val();
    } else {
        userDataFromDb = { email: user.email, roles: ['client'] };
        await set(ref(database, 'users/' + user.uid), userDataFromDb);
        // Also create the placeholder client record for new Google users
        await set(ref(database, 'clients/' + user.uid), { email: user.email, firstName: user.email.split('@')[0], lastName: '' });
    }
    
    const finalUserData = {
       firebaseKey: user.uid, // --- ADD THIS LINE ---
        uid: user.uid,
        email: user.email,
        roles: userDataFromDb.roles || ['client'],
        avatar: user.photoURL || `https://placehold.co/40x40/007bff/white?text=${user.email.charAt(0).toUpperCase()}`
    };

    sessionStorage.setItem('loggedInEmployee', JSON.stringify(finalUserData));
    login(finalUserData);

    // Role-based navigation
    if (finalUserData.roles.includes('admin')) {
        navigate('/adminpage');
    } else if (finalUserData.roles.includes('manager')) {
        navigate('/managerworksheet');
    } else if (finalUserData.roles.includes('employee')) {
        navigate('/employees');
    } else {
        navigate('/'); // Default for clients
    }
  };


  // --- 🔐 Firebase Email/Password Login Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await processLogin(userCredential.user);
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setLoginError("Invalid email or password.");
        } else {
            setLoginError("An error occurred during login. Please try again.");
            console.error("Firebase email login error:", error);
        }
    }
  };

  // --- 🇬 Google Login Handler ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await processLogin(result.user);
    } catch (error) {
        setLoginError("Failed to sign in with Google. Please try again.");
        console.error("Firebase Google login error:", error);
    }
  };

  // --- 🔁 Firebase Password Reset Handler ---
  const handlePasswordReset = async () => {
    if (!forgotEmail.includes("@")) {
      setModalAlert({ type: "danger", message: "Please enter a valid email address." });
      return;
    }
    try {
        await sendPasswordResetEmail(auth, forgotEmail);
        setModalAlert({ type: "success", message: `A password reset link has been sent to ${forgotEmail}.` });
    } catch (error) {
        setModalAlert({ type: "danger", message: "Could not send password reset email. Please check the address and try again." });
        console.error("Password reset error:", error);
    }
  }

  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail("");
    setModalAlert({ type: "", message: "" });
  }

  const styles = `
    .login-page-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      padding: 1rem;
      background-color: #f8f9fa;
    }
    .login-card {
      width: 100%;
      max-width: 480px;
      background-color: #ffffff;
      padding: 2.5rem;
      border: 1px solid #e9ecef;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }
    .login-title {
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
    }
    .input-group-modern:focus-within {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    .input-group-icon {
      padding: 0.75rem 1rem;
      color: #6c757d;
      font-size: 1.2rem;
    }
    .form-control-modern {
      border: none;
      box-shadow: none;
      flex-grow: 1;
      padding: 0.75rem 1rem;
      padding-left: 0;
    }
    .form-control-modern:focus {
      box-shadow: none;
    }
    .password-toggle-icon {
      cursor: pointer;
      padding-right: 1rem;
      color: #6c757d;
    }
    .login-btn-modern {
      padding: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .login-btn-modern:hover {
      transform: translateY(-2px);
    }
  `;

  return (
 <>
      <style>{styles}</style>
      <div className="login-page-wrapper">
        <JsNavbar />
        <div className="login-card">
          <h3 className="text-center login-title">Login to Your Account</h3>
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
              <div className="input-group-modern">
                <span className="input-group-icon"><MdEmail /></span>
                <Form.Control
                  className="form-control-modern"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </Form.Group>

         <Form.Group className="mb-3">
              <Form.Label className="form-label-modern">Password</Form.Label>
              <div className="input-group-modern">
                <span className="input-group-icon"><RiLockPasswordFill /></span>
                <Form.Control
                  className="form-control-modern"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
              </div>
            </Form.Group>

          <div className="text-end mb-3">
              <span
                style={{ color: '#007bff', fontWeight: 600, cursor: 'pointer' }}
                onClick={openForgotModal}
              >
                Forgot Password?
              </span>
            </div>

          {loginError && <Alert variant="danger" className="py-2">{loginError}</Alert>}

          <Button type="submit" className="w-100 btn btn-primary text-white fw-bold login-btn-modern">Log In</Button>

          <div className="text-center mt-3">
            <span>Don't have an account?</span>
            <span
              style={{ color: '#007bff', fontWeight: 600, marginLeft: '0.5rem', cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </div>
        </Form>
      </div>

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
        <Modal.Body>
          {modalAlert.message && <Alert variant={modalAlert.type}>{modalAlert.message}</Alert>}
            <Form.Group>
              <Form.Label>Enter your registered email</Form.Label>
              <Form.Control
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handlePasswordReset}>Send Reset Link</Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}
