import React, { useState, useEffect, useRef } from 'react';
import { getCohereResponse } from '../cohere';
import '../index.css';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";

const fetchAvailableDoctors = async (specialization) => {
  try {
    const q = query(
      collection(db, "Doctors"),
      where("availability", "==", true),
      where("specialization", "==", specialization.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    const doctors = [];
    querySnapshot.forEach((doc) => {
      doctors.push({ id: doc.id, ...doc.data() });
    });

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    throw error;
  }
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m your Symptom Checker AI. I will help diagnose your condition.' },
    { sender: 'bot', text: 'What symptom are you experiencing first?' }
  ]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleSeekDoctor = async () => {
    const symptomToDoctorMap = {
      skin: "Dermatologist",
    };

    const lastPatientMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastPatientMessage || !lastPatientMessage.text) {
      alert("Please enter a symptom first.");
      return;
    }

    const symptomText = lastPatientMessage.text.toLowerCase();
    let matchedDoctor = null;

    for (const keyword in symptomToDoctorMap) {
      if (symptomText.includes(keyword)) {
        matchedDoctor = symptomToDoctorMap[keyword];
        break;
      }
    }

    if (!matchedDoctor) {
      alert("Couldn't match your symptom to a doctor.");
      return;
    }

    try {
      const availableDoctors = await fetchAvailableDoctors(matchedDoctor);

      if (availableDoctors.length === 0) {
        alert(`No available ${matchedDoctor}s found right now.`);
        return;
      }

      const doctorNames = availableDoctors.map((doc, idx) => `${idx + 1}. ${doc.Name}`).join('\n');
      const selected = prompt(`Available ${matchedDoctor}s:\n${doctorNames}\n\nEnter doctor number to consult:`);

      const selectedIndex = parseInt(selected) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= availableDoctors.length) {
        alert("Invalid selection.");
        return;
      }

      const selectedDoctor = availableDoctors[selectedIndex];
      const user = JSON.parse(localStorage.getItem("patient"));
      const patientName = user?.username || "Unknown";
      const symptoms = lastPatientMessage.text;

      await addDoc(collection(db, "Appointments"), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.Name,
        patientName,
        symptoms,
        status: "pending",
        timestamp: serverTimestamp()
      });

      alert(`Appointment sent to Dr. ${selectedDoctor.Name}!`);
    } catch (error) {
      console.error("Error in Seek Doctor flow:", error.message);
      alert("Something went wrong.");
    }
  };

  const handleMicClick = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const handleSend = async (text) => {
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInput('');

    const userMessageCount = newMessages.filter(msg => msg.sender === 'user').length;
    const isFinalMessage = userMessageCount >= 8;

    try {
      const reply = await getCohereResponse(text, newMessages, isFinalMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: reply?.trim() || 'Sorry, I couldn’t understand that.' }]);
    } catch (error) {
      console.error('Cohere Error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) handleSend(input.trim());
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Consultant AI</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleSeekDoctor} className="nav-button green">
            Seek Doctor
          </button>
          <button onClick={() => navigate('/report-summary')} className="nav-button blue">
            Generate Summary
          </button>
        </div>
      </nav>

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your symptom..."
        />
        <button type="submit">Send</button>
        <button type="button" onClick={handleMicClick}>🎤</button>
      </form>
    </div>
  );
};

export default Chatbot;
