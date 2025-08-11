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
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, get, child } from "firebase/database";

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


  // --- 🔐 Firebase Login Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
        // Sign in using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data (roles) from Realtime Database
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));

        if (snapshot.exists()) {
            const userDataFromDb = snapshot.val();
            const userData = {
                uid: user.uid,
                email: user.email,
                roles: userDataFromDb.roles || ['client'], // Default to client role
                avatar: `https://placehold.co/40x40/007bff/white?text=${user.email.charAt(0).toUpperCase()}`
            };

            sessionStorage.setItem('loggedInEmployee', JSON.stringify(userData));
            login(userData);

            // Role-based navigation
            if (userData.roles.includes('admin')) {
                navigate('/adminpage');
            } else if (userData.roles.includes('manager')) {
                navigate('/managerworksheet');
            } else {
                navigate('/clientdashboard'); // Default for clients
            }
        } else {
            // This case is unlikely if signup is always creating a user record
            setLoginError("User data not found. Please contact support.");
            auth.signOut();
        }

    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setLoginError("Invalid email or password.");
        } else {
            setLoginError("An error occurred during login. Please try again.");
            console.error("Firebase login error:", error);
        }
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '1rem'
    }}>
      <JsNavbar />
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        border: '2px solid white',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h3 className="text-center text-primary fw-bold mb-4">Login to Your Account</h3>
        <button
          type="button"
          className="btn btn-outline-secondary w-100 p-2 mb-3 d-flex align-items-center justify-content-center gap-2"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>
        <div className="text-center mb-3">OR</div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text><MdEmail /></InputGroup.Text>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text><RiLockPasswordFill /></InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <InputGroup.Text
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </InputGroup.Text>
            </InputGroup>
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

          <Button type="submit" className="w-100 btn btn-primary text-white fw-bold">Log In</Button>

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
  );
}
