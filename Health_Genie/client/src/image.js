export async function getImage(prompt) {
  const response = await fetch('http://localhost:5001/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data.image_url;
}
