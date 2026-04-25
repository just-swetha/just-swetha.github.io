// netlify/functions/check-bin.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // 1. Get the secret key from Netlify's environment variables
  const apiKey = process.env.ROBOFLOW_API_KEY; 
  
  // 2. Get the data sent from your HTML file
  const { image, model, version } = JSON.parse(event.body);

  // 3. Construct the Roboflow URL (This happens on the server, hidden from the user)
  const url = `https://classify.roboflow.com/${model}/${version}?api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      // Inside check-bin.js
        body: image.includes(',') ? image.split(',')[1] : image,, // This is the base64 image from your webcam
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to Roboflow" })
    };
  }
};