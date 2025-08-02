import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

    if (
      storedDoctor &&
      storedDoctor.email === formData.email &&
      storedDoctor.password === formData.password
    ) {
      alert("Login successful!");
      navigate("/doctor/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  const goToSignup = () => {
    navigate("/signup/doctor");
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <button onClick={goToSignup} style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}>
          Sign up here
        </button>
      </p>
    </div>
  );
}

export default DoctorLogin;