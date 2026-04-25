// netlify/functions/check-bin.js
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: CORS,
      body: JSON.stringify({ error: "ROBOFLOW_API_KEY env var not set" }) };
  }

  let image, model, version;
  try {
    ({ image, model, version } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: CORS,
      body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  // Strip data-URI prefix if caller accidentally included it
  const cleanImage = image.includes(',') ? image.split(',')[1] : image;
  const url = `https://classify.roboflow.com/${model}/${version}?api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method:  "POST",
      body:    cleanImage,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      const text = await response.text();
      return { statusCode: response.status, headers: CORS,
        body: JSON.stringify({ error: `Roboflow error ${response.status}`, detail: text }) };
    }

    const data = await response.json();
    return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };

  } catch (error) {
    return { statusCode: 500, headers: CORS,
      body: JSON.stringify({ error: "Failed to reach Roboflow", detail: error.message }) };
  }
};