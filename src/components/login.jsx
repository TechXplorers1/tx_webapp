import React, { useState } from "react";
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
      if (email === 'admin@gmail.com') navigate('/admindashboard');
      else if (email === 'client@gmail.com') navigate('/clientdashboard');
      else if (email === 'manager@gmail.com') navigate('/managers');
      else if (email.includes('.tx')) navigate('/employees');
      else setLoginError("Invalid email or password.");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const sendOtp = () => {
    if (!forgotEmail.includes("@")) return alert("Enter a valid email");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    alert(`OTP sent to ${forgotEmail}: ${otp}`);
    setOtpSent(true);
  };

  const resetPassword = () => {
    if (enteredOtp !== generatedOtp) return alert("Invalid OTP");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    const error = validatePassword(newPassword);
    if (error) return alert(error);

    setShowForgotModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
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
              onClick={() => setShowForgotModal(true)}
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
            <>
              <Form.Group className="mb-2">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!otpSent ? (
            <Button variant="primary" onClick={sendOtp}>Send OTP</Button>
          ) : (
            <Button variant="success" onClick={resetPassword}>Reset Password</Button>
          )}
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
