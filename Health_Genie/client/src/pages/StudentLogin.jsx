import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLogin.css';

const StudentLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem('studentUser'));

    if (savedUser && savedUser.username === username && savedUser.password === password) {
      navigate('/student/centre');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Student Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link" onClick={() => navigate('/signup/student')}>
          Don’t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
