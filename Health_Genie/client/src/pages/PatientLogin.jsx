import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './loginpagepatient.css';

function PatientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedData = localStorage.getItem(`patient_${email.trim().toLowerCase()}`);
    if (!storedData) {
      alert('Account not found. Please sign up first.');
      return;
    }

    try {
      const user = JSON.parse(storedData);
      if (user.password === password) {
        alert('Login successful');
        navigate('/chat');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error reading stored data:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <h2>Patient Login</h2>
        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className="signup-link-wrapper">
          <Link className="toggle-link" to="/signup/patient">
            Don’t have an account? Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;
