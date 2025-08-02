import React, { useState } from 'react';
import { getCohereResponse } from '../utils/cohere';
import { getImage } from '../utils/image';
import { FaUpload, FaMicrophone } from 'react-icons/fa';
import './medisketch.css';


const MediSketch = () => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);

    try {
      const text = await getCohereResponse(topic);
      const image = await getImage(topic);

      setDescription(text);
      setImageUrl(image);
    } catch (err) {
      console.error("Error generating content:", err);
    }

    setLoading(false);
  };

  const handleMicInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTopic(spokenText);
    };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const firstLine = text.split('\n')[0];
    setTopic(firstLine);
  };

  return (
    <div className="student-centre-container">
      <h1 style={{ fontSize: '32px' }}>🧠 MediSketch</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <label htmlFor="fileUpload" style={{ backgroundColor: '#7c3aed', padding: '10px', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
          <FaUpload />
        </label>
        <input type="file" id="fileUpload" onChange={handleFileUpload} style={{ display: 'none' }} />

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a medical topic..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
        />

        <button onClick={handleMicInput} style={{ backgroundColor: '#7c3aed', padding: '10px', borderRadius: '8px', color: 'white' }}>
          <FaMicrophone />
        </button>

        <button onClick={handleGenerate} style={{ backgroundColor: '#7c3aed', padding: '10px 15px', borderRadius: '8px', color: 'white' }}>
          Generate Sketch
        </button>
      </div>

      {loading && <div className="loader"></div>}

      {description && <p><strong>Description:</strong> {description}</p>}
      {imageUrl && <img src={imageUrl} alt="Medical Sketch" style={{ marginTop: '20px', maxWidth: '400px' }} />}
    </div>
  );
};

export default MediSketch;

