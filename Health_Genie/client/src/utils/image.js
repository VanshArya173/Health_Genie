import axios from 'axios';

export async function getImage(promptText) {
  try {
    const formData = new FormData();
    formData.append("prompt", promptText);
    formData.append("aspect_ratio", "1:1");
    formData.append("output_format", "png");

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      formData,
      {
        headers: {
          Authorization: 'Bearer sk-GM9V4HpRfOUf1AVggQDZ7TOB8AdGBikNYvAFIXb3HgkEPICY',
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'  // ✅ Required
        }
      }
    );

    const base64Image = response.data.image;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('🛑 Stability API error:', error.response?.data || error.message);
    throw error;
  }
}
