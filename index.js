const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ type: "*/*" }));

// ✅ Change this only if you change token in Meta
const VERIFY_TOKEN = "insta_dm_bot_001";

// ✅ IMPORTANT: Replace this with your REAL n8n public webhook URL
const N8N_WEBHOOK_URL = "https://YOUR-N8N-URL/webhook/igdm";

// ✅ Meta verification (GET)
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ Incoming Instagram messages (POST)
app.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming event received");

    await axios.post(N8N_WEBHOOK_URL, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Forward error:", error.message);
    res.sendStatus(500);
  }
});

// ✅ Render requires dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Bridge running on port ${PORT}`);
});