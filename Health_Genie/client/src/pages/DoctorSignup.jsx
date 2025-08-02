import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorSignup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Store doctor data in localStorage
    localStorage.setItem("doctor", JSON.stringify(formData));
    alert("Signup successful! Please login.");
    navigate("/login/doctor");
  };

  return (
    <div className="login-container">
      <h2>Doctor Signup</h2>
      <form className="login-form" onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default DoctorSignup;
