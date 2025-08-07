// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import JsNavbar from './JsNavbar';
import { Button, Modal, Form } from 'react-bootstrap';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from '../components/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [employees, setEmployees] = useState([]);

  // Password Reset State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [modalAlert, setModalAlert] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch employees data on mount
  useEffect(() => {
    fetch('/employees.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setEmployees(data))
      .catch(error => console.error("Failed to fetch employees:", error));
  }, []);

  // OTP Timer
  useEffect(() => {
    let timerInterval;
    if (otpSent && otpTimer > 0) {
      timerInterval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    } else if (otpTimer === 0) {
      setIsResendingOtp(false);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpTimer]);

  // Password Validation
  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain uppercase';
    if (!/[a-z]/.test(value)) return 'Must contain lowercase';
    if (!/[0-9]/.test(value)) return 'Must contain number';
    if (!/[@_\$\-]/.test(value)) return 'Must contain @, _, $, or -';
    return null;
  };

  // --- 🔐 Unified Login Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    // Email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    // 1. Check if it's a predefined employee
    const employee = employees.find(
      emp => emp.workEmail === email && emp.temporaryPassword === password
    );

    if (employee) {
      const userData = {
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.workEmail,
        roles: employee.roles,
        avatar: `https://placehold.co/40x40/007bff/white?text=${employee.firstName.charAt(0).toUpperCase()}`
      };

      sessionStorage.setItem('loggedInEmployee', JSON.stringify(userData));
      login(userData);

      // Role-based navigation
      if (employee.roles.includes('admin')) {
        navigate('/adminpage');
      } else if (employee.roles.includes('manager')) {
        navigate('/managerworksheet');
      } else if (employee.roles.includes('employee')) {
        navigate('/employees');
      } else {
        setLoginError("Access denied. No valid role assigned.");
      }
      return;
    }

    // 2. Check if it's a self-registered user
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (registeredUser) {
      const baseUsername = email.split('@')[0];
      const userData = {
        name: baseUsername,
        email: registeredUser.email,
        roles: ['client'],
        avatar: `https://placehold.co/40x40/007bff/white?text=${baseUsername.charAt(0).toUpperCase()}`
      };

     sessionStorage.setItem('loggedInEmployee', JSON.stringify(userData));
      login(userData);
      navigate('/clientdashboard'); // Navigate clients to their dashboard
      return;
    }

    // 3. Check hardcoded fallback credentials
    const baseUsername = email.split('@')[0];
    if (password === 'Password@123') {
      let redirectPath = null;
      let userRoles = [];

      if (email === 'admin@gmail.com') {
        redirectPath = '/adminpage';
        userRoles = ['admin'];
      } else if (email === 'client@gmail.com') {
        redirectPath = '/clientdashboard'; // Updated path for client
        userRoles = ['client'];
      } else if (email === 'manager@gmail.com') {
        redirectPath = '/managerworksheet';
        userRoles = ['manager'];
      } else if (email === 'assets@gmail.com') {
        redirectPath = '/assetworksheet';
        userRoles = ['asset_manager'];
      } else if (email=== 'employee@gmail.com') {
        redirectPath = '/employees';
        userRoles = ['employee'];
      }

      if (redirectPath) {
        const userData = {
          name: baseUsername,
          email,
           roles: userRoles,
          avatar: `https://placehold.co/40x40/007bff/white?text=${baseUsername.charAt(0).toUpperCase()}`
        };
         sessionStorage.setItem('loggedInEmployee', JSON.stringify(userData));
        login(userData);
        navigate(redirectPath);
        return;
      }
    }

    // 4. If no match, show error
    setLoginError("Invalid email or password.");
  };

  // --- 🔁 Send OTP ---
  const sendOtp = () => {
    if (!forgotEmail.includes("@")) {
      setModalAlert("Please enter a valid email address.");
      return;
    }
    setModalAlert("");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    console.log(`Generated OTP for ${forgotEmail}: ${otp}`);
    setModalAlert(`An OTP has been sent to ${forgotEmail}. (For demo, OTP is ${otp})`);
    setOtpSent(true);
    setOtpTimer(60);
    setIsResendingOtp(true);
    setOtpError("");
  };

  // --- ✅ Verify OTP ---
  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      setOtpError("");
      setShowForgotModal(false);
      setShowNewPasswordModal(true);
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  // --- 🆕 Create New Password ---
  const createNewPassword = () => {
    setNewPasswordError("");
    setConfirmPasswordError("");
    let hasError = false;

    const passError = validatePassword(newPassword);
    if (passError) {
      setNewPasswordError(passError);
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }
    if (hasError) return;

    // Update in localStorage if user exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = registeredUsers.findIndex(u => u.email === forgotEmail);
    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    console.log("New password set successfully!");
    setShowNewPasswordModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);

    // Reset all reset-related states
    setForgotEmail("");
    setOtpSent(false);
    setEnteredOtp("");
    setGeneratedOtp("");
    setOtpVerified(false);
    setNewPassword("");
    setConfirmPassword("");
  };

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
            <div className="input-group">
              <span className="input-group-text"><MdEmail /></span>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <span className="input-group-text"><RiLockPasswordFill /></span>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
            {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
          </Form.Group>

          <div className="text-end mb-3">
            <span
              style={{ color: '#007bff', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                setShowForgotModal(true);
                setOtpSent(false);
                setOtpVerified(false);
                setForgotEmail("");
                setEnteredOtp("");
                setOtpError("");
                setNewPassword("");
                setConfirmPassword("");
                setNewPasswordError("");
                setConfirmPasswordError("");
                setOtpTimer(60);
                setIsResendingOtp(false);
                setModalAlert("");
              }}
            >
              Forgot Password?
            </span>
          </div>

          {loginError && <div className="alert alert-danger py-2">{loginError}</div>}

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
          {modalAlert && <p className="text-info small">{modalAlert}</p>}
          {!otpSent ? (
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
          ) : (
            <Form.Group>
              <Form.Label>Enter OTP sent to {forgotEmail}</Form.Label>
              <Form.Control
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                isInvalid={!!otpError}
              />
              <Form.Control.Feedback type="invalid">{otpError}</Form.Control.Feedback>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!otpSent ? (
            <Button variant="primary" onClick={sendOtp}>Send OTP</Button>
          ) : (
            <>
              <Button variant="primary" onClick={verifyOtp} disabled={enteredOtp.length !== 4}>Verify OTP</Button>
              <Button
                variant="secondary"
                onClick={sendOtp}
                disabled={isResendingOtp && otpTimer > 0}
              >
                {isResendingOtp && otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : 'Resend OTP'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* New Password Modal */}
      <Modal show={showNewPasswordModal} onHide={() => setShowNewPasswordModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Create New Password</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              isInvalid={!!newPasswordError}
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">{newPasswordError}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              isInvalid={!!confirmPasswordError}
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={createNewPassword}>Set New Password</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            style={{ width: '80px' }}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/28a745/white?text=OK'; }}
          />
          <h5 className="mt-3 text-success">Password successfully created!</h5>
        </Modal.Body>
      </Modal>
    </div>
  );
}