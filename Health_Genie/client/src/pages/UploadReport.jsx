import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const UploadReport = () => {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [loading, setLoading] = useState(false);

  const parseReport = (text) => {
    const lines = text.split('\n');
    const data = {};

    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        data[key.toLowerCase()] = value;
      }
    });

    console.log('✅ Parsed Data:', data);
    setParsedData(data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    Tesseract.recognize(
      file,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log('📃 Extracted Text:', text);
      setRawText(text);
      parseReport(text);
      setLoading(false);
    }).catch(err => {
      console.error('❌ OCR Error:', err);
      setLoading(false);
    });
  };

  return (
    <div className="upload-container">
      <style>{`
        .upload-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 30px;
          background: linear-gradient(145deg, #f4f4f4, #ffffff);
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          border-radius: 16px;
          font-family: 'Segoe UI', sans-serif;
          transition: all 0.3s ease-in-out;
        }

        .upload-container h2 {
          text-align: center;
          font-size: 28px;
          color: #1a1a1a;
          margin-bottom: 25px;
        }

        .upload-container input[type="file"] {
          display: block;
          margin: 0 auto 20px auto;
          padding: 12px;
          border: 2px dashed #ccc;
          border-radius: 10px;
          background-color: #fafafa;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .upload-container input[type="file"]:hover {
          border-color: #2b6777;
        }

        .upload-container p {
          text-align: center;
          color: #444;
          font-size: 16px;
        }

        .upload-container h3 {
          color: #2b6777;
          border-bottom: 2px solid #ccc;
          padding-bottom: 6px;
          margin-top: 30px;
          font-size: 20px;
        }

        .upload-container pre {
          background: #f0f0f0;
          padding: 16px;
          border-radius: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.6;
          border-left: 4px solid #2b6777;
        }
      `}</style>

      <h2>📤 Upload Medical Report</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {loading && <p>⏳ Processing image using OCR...</p>}

      {rawText && (
        <>
          <h3>📄 Extracted Text</h3>
          <pre>{rawText}</pre>

          <h3>🧠 Parsed Report Data</h3>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default UploadReport;
