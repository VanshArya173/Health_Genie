import React from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, PencilRuler } from "lucide-react";
import "./StudentCentre.css";

const StudentCentre = () => {
  const navigate = useNavigate();

  const tools = [
    {
      name: "MediSketch",
      description: "Generate medical diagrams and summaries from text.",
      icon: <PencilRuler className="icon" />,
      path: "/student/medisketch",
    },
    {
      name: "AI Patient Simulator",
      description: "Diagnose AI-generated patient cases.",
      icon: <Stethoscope className="icon" />,
      path: "/student/ai-patient",
    }
  ];

  return (
    <div className="student-centre-container">
      <h1>Welcome, Student!</h1>
      <div className="card-grid">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(tool.path)}
          >
            {tool.icon}
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCentre;
