// src/utils/simulatorAPI.js

const COHERE_API_KEY = "hGAzAJX5gvkdS7h24gHtQdWSfIu9I4cZD4HO9fw4"; // 🔁 Replace with yours

export async function getPatientCaseFromAI(prompt) {
  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "command-r",
      message: `
Generate a patient case with symptoms and background, but do NOT include the diagnosis initially. 
Wait for the user to guess, then reveal the correct diagnosis after 1 or 2 attempts. 
Example format:
---
Case:
"A 35-year-old male complains of..."
Ask:
"What is your diagnosis?"
---
Then, wait for user response.`,
    }),
  });

  const data = await response.json();

  if (data?.text) {
    return data.text;
  } else {
    throw new Error("Failed to fetch from Cohere");
  }
}

export async function revealDiagnosis(patientCase, userGuess) {
  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "command-r",
      message: `
Given this patient case: "${patientCase}"
User guessed: "${userGuess}"

Respond with whether it's correct. If incorrect, reveal the correct diagnosis now.`,
    }),
  });

  const data = await response.json();

  if (data?.text) {
    return data.text;
  } else {
    throw new Error("Failed to fetch diagnosis");
  }
}
