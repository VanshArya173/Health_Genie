import React, { useState } from "react";
import { getPatientCaseFromAI, revealDiagnosis } from "../utils/simulatorAPI";
import "../components/AIPatientSimulator.css"

const AIPatientSimulator = () => {
  const [patientCase, setPatientCase] = useState("");
  const [guess, setGuess] = useState("");
  const [response, setResponse] = useState("");
  const [stage, setStage] = useState("initial"); // 'initial' | 'guess' | 'revealed'

  const handleGenerate = async () => {
    setResponse("");
    setGuess("");
    setStage("guess");
    try {
      const result = await getPatientCaseFromAI("Generate a new case.");
      setPatientCase(result);
    } catch (err) {
      setPatientCase("Error generating case.");
    }
  };

  const handleSubmitGuess = async () => {
    if (!guess.trim()) return;
    try {
      const result = await revealDiagnosis(patientCase, guess);
      setResponse(result);
      setStage("revealed");
    } catch (err) {
      setResponse("Error checking diagnosis.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧠 AI Patient Simulator</h1>
      <button onClick={handleGenerate}>Generate Patient Case</button>

      {patientCase && (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          <strong>Case:</strong>
          <p>{patientCase}</p>
        </div>
      )}

      {stage === "guess" && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Enter your diagnosis"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            style={{ padding: "0.5rem", width: "300px" }}
          />
          <button onClick={handleSubmitGuess} style={{ marginLeft: "1rem" }}>
            Submit
          </button>
        </div>
      )}

      {response && (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          <strong>AI Feedback:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIPatientSimulator;
