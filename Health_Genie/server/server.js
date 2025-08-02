// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Replace with your actual Sarvam API key
const SARVAM_API_KEY = 'sk_ap43am7f_E3aY6hG1BvXs22gfsPSXOCG6';

async function summarizeAndTranslate(text, lang) {
  const response = await axios.post(
    'https://api.sarvam.ai/v1/chat/completions',
    {
      model: 'sarvam-medium',
      messages: [
        {
          role: 'system',
          content: 'You are a medical assistant who summarizes health reports in ~50 words and translates them if needed.',
        },
        {
          role: 'user',
          content: `Summarize this report in ~50 words and translate it to ${lang}:\n\n${text}`,
        },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${SARVAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const lang = req.body.lang || 'en';
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.join(__dirname, req.file.path);
    const reportText = fs.readFileSync(filePath, 'utf-8');

    const summary = await summarizeAndTranslate(reportText, lang);
    res.json({ summary });
  } catch (err) {
    console.error('🔥 Backend error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
