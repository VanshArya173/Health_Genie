export async function getCohereResponse(userMessage, chatHistory, isFinal = false) {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "command-r",
        temperature: 0.3,
        message: userMessage,
        chat_history: chatHistory.map(msg => ({
          role: msg.sender === 'bot' ? 'CHATBOT' : 'USER',
          message: msg.text
        })),
        preamble: `
You are a medical diagnosis assistant chatbot.

Instructions:
- Ask short (under 10-word) questions to collect symptoms.
- After 7–8 user responses, give your best diagnosis.
- Use simple, clear language (e.g., "You might have the flu.")
- Always end diagnosis with: 
  "If this seems incorrect, please consult a real doctor."
- Never use long medical terms or vague answers.
- If unsure, just say: "Please consult a real doctor through our seek a doctor page."

${
  isFinal
    ? 'This is the final turn. Give your best guess diagnosis now.'
    : 'Keep asking short questions to gather more details.'
}
        `
      })
    });

    const data = await response.json();
    console.log("🟡 Cohere response:", JSON.stringify(data, null, 2));

    return data.text ? data.text.trim() : 'Sorry, I could not understand that.';
  } catch (error) {
    console.error('❌ Cohere API Error:', error);
    return 'Sorry, something went wrong.';
  }
}
