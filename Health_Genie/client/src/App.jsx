import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Doctor Routes
import DoctorLogin from "./pages/Doctor";
import DoctorSignup from "./pages/DoctorSignup";
import DoctorDashboard from "./pages/DoctorDashboard";

// Patient Routes
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import Chatbot from "./pages/ConsultantAI";
import UploadReport from "./pages/UploadReport";
import ReportSummary from "./pages/ReportSummary";

// Student Routes
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import StudentCentre from "./pages/StudentCentre";
import AIPatientSimulator from "./pages/AIPatientSimulator";
import MediSketch from "./pages/medisketch";

// Home
import Home from "./home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Doctor */}
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* Patient */}
        <Route path="/login/patient" element={<PatientLogin />} />
        <Route path="/signup/patient" element={<PatientSignup />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/upload-report" element={<UploadReport />} />
        <Route path="/report-summary" element={<ReportSummary />} />

        {/* Student */}
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/student/centre" element={<StudentCentre />} />
        <Route path="/student/ai-patient" element={<AIPatientSimulator />} />
        <Route path="/student/medisketch" element={<MediSketch />} />
      </Routes>
    </Router>
  );
}

export default App;
