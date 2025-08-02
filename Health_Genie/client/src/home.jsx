import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to HealthGenie</h1>
      <div className="button-group">
        <button className="role-button" onClick={() => navigate('/login/doctor')}>
          <div className="emoji">🧑‍⚕️</div>
          <div className="label">Doctor</div>
        </button>

        <button className="role-button" onClick={() => navigate('/login/patient')}>
          <div className="emoji">🧑‍🦱</div>
          <div className="label">Patient</div>
        </button>

        <button className="role-button" onClick={() => navigate('/login/student')}>
          <div className="emoji">🎓</div>
          <div className="label">Student</div>
        </button>
      </div>
    </div>
  );
}

export default Home;
