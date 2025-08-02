
import axios from 'axios';

export async function getCohereResponse(topic) {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: `Explain the medical topic: "${topic}" in simple, student-friendly terms.`,
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: 'Bearer wxmwLjTRYRWarSjkhkBuAzWKkMLwnXu8xpVspJZY',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.generations[0].text.trim();
  } catch (error) {
    console.error('🛑 Cohere API error:', error.response?.data || error.message);
    return "Sorry, couldn't generate explanation.";
  }
}
