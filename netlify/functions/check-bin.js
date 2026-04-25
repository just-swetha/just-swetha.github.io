// netlify/functions/check-bin.js
exports.handler = async (event) => {
  // 1. Get the secret key from Netlify's environment variables
  const apiKey = process.env.ROBOFLOW_API_KEY; 
  
  // 2. Parse the data from your HTML file
  const { image, model, version } = JSON.parse(event.body);

  // 3. Clean the image string (remove "data:image/jpeg;base64," if present)
  const cleanImage = image.includes(',') ? image.split(',')[1] : image;

  // 4. Construct the Roboflow URL
  const url = `https://classify.roboflow.com/${model}/${version}?api_key=${apiKey}`;

  try {
    // We can use fetch() directly now without requiring anything!
    const response = await fetch(url, {
      method: 'POST',
      body: cleanImage, 
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to Roboflow" })
    };
  }
};