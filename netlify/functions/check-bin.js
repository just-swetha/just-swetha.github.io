// netlify/functions/check-bin.js
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const WORKSPACE   = "swethas-workspace-pg00r";
const WORKFLOW_ID = "bin-presence-checker-verified-1777140256575";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: CORS,
      body: JSON.stringify({ error: "ROBOFLOW_API_KEY env var not set" }) };
  }

  let image;
  try {
    ({ image } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: CORS,
      body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const url = `https://detect.roboflow.com/infer/workflows/${WORKSPACE}/${WORKFLOW_ID}`;

  try {
    const response = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: { image: { type: "base64", value: image } },
      }),
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
