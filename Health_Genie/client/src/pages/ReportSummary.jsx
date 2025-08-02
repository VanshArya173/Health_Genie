import React, { useState } from "react";
import axios from "axios";
import { SarvamAIClient } from "sarvamai";

const API_KEY = "sk_a0wmkrs1_uTSs0DYeSSv9KuaVlXROFHad";
const languageMap = {
  English: "en-IN",
  Hindi: "hi-IN",
  Bengali: "bn-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Punjabi: "pa-IN",
  Odia: "or-IN",
};


export default function ReportSummary() {
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const text = reader.result;

      try {
        // Step 1: Summarize in English
        const summaryRes = await axios.post(
          "https://api.sarvam.ai/v1/chat/completions",
          {
            model: "sarvam-m",
            messages: [
              {
                role: "user",
                content: `Summarize this medical report in 50 words:\n\n${text}`,
              },
            ],
            temperature: 0.3,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key": API_KEY,
            },
          }
        );

        const englishSummary =
          summaryRes.data.choices?.[0]?.message?.content?.trim();
        console.log("📝 English summary:", englishSummary);

        if (language === "English") {
          setSummary(englishSummary);
        } else {
          // Step 2: Translate
          const translateRes = await axios.post(
            "https://api.sarvam.ai/v1/chat/completions",
            {
              model: "sarvam-m",
              messages: [
                {
                  role: "user",
                  content: `Translate this medical summary to ${language}:\n\n${englishSummary}`,
                },
              ],
              temperature: 0.3,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY,
              },
            }
          );

          const translated =
            translateRes.data.choices?.[0]?.message?.content?.trim();
          console.log("🌐 Translated summary:", translated);
          setSummary(translated || englishSummary);
        }
      } catch (err) {
        console.error("❌ ERROR:", err);
        alert("Something went wrong while summarizing or translating.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };
const handleSpeakSummary = async () => {
  if (!summary || !language) return;

  const client = new SarvamAIClient({
    apiSubscriptionKey: API_KEY,
  });

  const languageCode = languageMap[language]; // 🟢 get BCP-47 code

  if (!languageCode) {
    alert("❌ Unsupported language selected for TTS.");
    return;
  }

  try {
    console.log("🗣️ Converting to speech with:", languageCode);
    const response = await client.textToSpeech.convert({
      model: "bulbul:v2", // ✅ use bulbul:v2
      text: summary,
      target_language_code: languageCode,
    });

    const audioBase64 = response?.audios?.[0];
    if (!audioBase64) {
      console.error("❌ Failed to get base64 audio data.");
      return;
    }

    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
      { type: "audio/wav" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (err) {
    console.error("❌ TTS Error:", err);
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>📄 Upload Medical Report (.txt)</h2>
      <input type="file" accept=".txt" onChange={handleUpload} />

      <div style={{ marginTop: 10 }}>
        <label>🌍 Choose Output Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>

      {loading && <p>⏳ Processing...</p>}

      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>📝 Summary:</h3>
          <p>{summary}</p>
          <button onClick={handleSpeakSummary} style={{ marginTop: 10 }}>
            🎤 Speak Summary
          </button>
        </div>
      )}
    </div>
  );
}
