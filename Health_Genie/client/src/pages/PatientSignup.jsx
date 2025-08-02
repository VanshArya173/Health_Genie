import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./patientsignup.css";

function PatientSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address!");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      alert("Please enter a valid 10-digit phone number!");
      return false;
    }
    return true;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const existing = localStorage.getItem(`patient_${formData.email}`);
      if (existing) {
        alert("An account with this email already exists!");
        setIsLoading(false);
        return;
      }

      const newPatient = {
        ...formData,
        registrationDate: new Date().toISOString(),
      };
      delete newPatient.confirmPassword;

      localStorage.setItem(`patient_${formData.email}`, JSON.stringify(newPatient));
      alert("Account created successfully! Please login.");
      navigate("/patient-login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container signup-form">
        <h2>Patient Registration</h2>
        <form className="login-form signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <a className="toggle-link" href="/login/patient">
          Already have an account? Login here
        </a>
      </div>
    </div>
  );
}

export default PatientSignup;
