import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import JsNavbar from './JsNavbar';
import { Button, Modal, Form } from 'react-bootstrap';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState(""); // New state for OTP error
  const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP resend
  const [isResendingOtp, setIsResendingOtp] = useState(false); // State to control resend button

  const [otpVerified, setOtpVerified] = useState(false); // New state to track OTP verification
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false); // New state for new password modal
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(""); // New state for new password error
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // New state for confirm password error

  const [showSuccess, setShowSuccess] = useState(false);

  // Effect for OTP timer
  useEffect(() => {
    let timerInterval;
    if (otpSent && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsResendingOtp(false); // Allow resend when timer runs out
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpTimer]);

  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain uppercase';
    if (!/[a-z]/.test(value)) return 'Must contain lowercase';
    if (!/[0-9]/.test(value)) return 'Must contain number';
    if (!/[@_\$\-]/.test(value)) return 'Must contain @, _, $, or -';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email");
      hasError = true;
    }

    const passError = validatePassword(password);
    if (passError) {
      setPasswordError(passError);
      hasError = true;
    }

    if (hasError) return;

    if (password === 'Password@123') {
      if (email === 'admin@gmail.com') navigate('/adminworksheet');
      else if (email === 'client@gmail.com') navigate('/clientdashboard');
      else if (email === 'manager@gmail.com') navigate('/managerworksheet');
      else if (email.includes('.tx')) navigate('/employees');
      else setLoginError("Invalid email or password.");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const sendOtp = () => {
    if (!forgotEmail.includes("@")) {
      // Using a custom alert/message box instead of browser's alert()
      alert("Please enter a valid email address."); // Placeholder for a custom message box
      return;
    }
    // Simulate OTP generation
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    // Using a custom alert/message box instead of browser's alert()
    alert(`OTP sent to ${forgotEmail}: ${otp}`); // Placeholder for a custom message box
    setOtpSent(true);
    setOtpTimer(60); // Reset timer
    setIsResendingOtp(true); // Disable resend button immediately
    setOtpError(""); // Clear any previous OTP errors
  };

  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      setOtpError("");
      setShowForgotModal(false); // Close the OTP modal
      setShowNewPasswordModal(true); // Open the new password modal
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

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

    // Simulate password update
    console.log("New password set:", newPassword);

    setShowNewPasswordModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
    // Reset all forgot password states
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
          {/* Email */}
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
              />
            </div>
            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
          </Form.Group>

          {/* Password */}
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
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
            <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
          </Form.Group>

          <div className="text-end mb-3">
            <span
              style={{ color: '#007bff', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                setShowForgotModal(true);
                setOtpSent(false); // Reset OTP sent state when opening modal
                setOtpVerified(false); // Reset OTP verified state
                setForgotEmail(""); // Clear previous email
                setEnteredOtp(""); // Clear previous OTP
                setOtpError(""); // Clear OTP error
                setNewPassword(""); // Clear new password fields
                setConfirmPassword("");
                setNewPasswordError("");
                setConfirmPasswordError("");
                setOtpTimer(60); // Reset timer
                setIsResendingOtp(false); // Reset resend state
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

      {/* Forgot Password (Send OTP / Enter OTP) Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
        <Modal.Body>
          {!otpSent ? (
            <Form.Group>
              <Form.Label>Enter your registered email</Form.Label>
              <Form.Control
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email address"
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

      {/* Create New Password Modal */}
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
            />
            <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={createNewPassword}>Set New Password</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Confirmation */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            style={{ width: '80px' }}
          />
          <h5 className="mt-3 text-success">Password successfully created!</h5>
        </Modal.Body>
      </Modal>
    </div>
  );
}

