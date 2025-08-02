import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentSignup.css'; // Make sure this is imported

const StudentSignup = () => {
  const [username, setUsername] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      username,
      college,
      password,
    };

    localStorage.setItem('studentUser', JSON.stringify(studentData));
    navigate('/login/patient'); // ✅ Redirect to patient login
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2 className="signup-title">Student Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-redirect" onClick={() => navigate('/login/patient')}>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
