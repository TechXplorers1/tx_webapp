import React, { useState } from "react";
import '../styles/login.css'; // for custom styles
import { useNavigate } from 'react-router-dom';
import JsNavbar from './JsNavbar';
import { Button } from 'react-bootstrap';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md"; // Keeping this as it's in your provided code, but remember you asked to remove it previously.
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState(""); // Added state for general login errors

    const validatePassword = (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[@_\$\-]/.test(value)) return 'Password must contain at least one special character (@, _, $, -)';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setLoginError(""); // Clear previous login errors
        let hasError = false;

        // Basic email format validation
        if (!email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }

        // Password complexity validation
        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            hasError = true;
        }

        if (hasError) return; // Stop if there are input validation errors

        // --- THE ONLY REQUIRED CHANGES START HERE ---
        // Mock Authentication and Role-Based Redirection
        // In a real application, you would send email/password to your backend API.
        // The backend would authenticate and return the user's role.

        // Using the password "Password@123" as you requested
        if (password === 'Password@123') {
            if (email === 'admin@gmail.com') { // Check for admin email
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.setItem('userRole', 'admin');
                console.log("Admin Logged in:", email);
                navigate('/adminworksheet'); // Redirect to Admin Dashboard
            } else if (email === 'client@gmail.com') { // Example for a regular client
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'client');
                console.log("Client Logged in:", email);
                navigate('/clientdashboard'); // Redirect to Client Dashboard
            } else if (email === 'manager@gmail.com') { // Example for a generic user (also maps to client role in ProtectedRoute)
                 localStorage.setItem('isLoggedIn', 'false');
                 localStorage.setItem('userRole', 'client'); // Assign 'client' role for generic users to match ProtectedRoute
                 console.log("Generic User Logged in:", email);
                 navigate('/managerworksheet'); // Redirect to User Dashboard
            }else if (email.includes('.tx')) {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.setItem('userRole', 'employee');
                console.log("Employee Logged in:", email);
                navigate('/employees');
            }
            else {
                // If email is valid format and password matches, but not a predefined role email
                setLoginError("Invalid email or password.");
            }
        } else {
            setLoginError("Invalid email or password."); // Password mismatch
        }
        // --- THE ONLY REQUIRED CHANGES END HERE ---
    };

    return (
        <div className="login-page mt-5">
            <JsNavbar />

            <div className="d-flex justify-content-center align-items-center vh-90">
                <form onSubmit={handleSubmit} className="rounded signup-box">
                    <div className="shadow-lg p-5 rounded">
                        <h3 className="text-center fw-bold mb-3">Welcome back!</h3>
                        <button type="button" className="btn btn-light w-100 border mb-3 d-flex align-items-center justify-content-center gap-2">
                            <FcGoogle size={20} />
                            Continue With Google
                        </button>
                        <div className="text-center text-muted mb-2">──────── OR ────────</div>

                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><MdEmail /></span> {/* MdEmail icon is still here as it was in your provided code */}
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    placeholder="Enter Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {emailError && <div className="text-danger mt-1">{emailError}</div>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text"><RiLockPasswordFill /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="input-group-text"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                </span>
                            </div>
                            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                        </div>

                        {loginError && <p className="text-danger mb-3">{loginError}</p>} {/* Display general login error */}

                        <button type="submit" className="btn btn-info w-100 text-white fw-bold">Log In</button>

                        <div className="text-center mt-3">
                            <span className="me-1">Don't Have An Account?</span>
                            <a onClick={() => navigate('/signup')} className="text-primary text-decoration-none" style={{ cursor: "pointer" }}>
                                Sign Up
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}