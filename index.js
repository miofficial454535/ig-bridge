const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ type: "*/*" }));

const VERIFY_TOKEN = "insta_dm_bot_001";
const N8N_WEBHOOK_URL = "http://127.0.0.1:5678/webhook/igdm";

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/", async (req, res) => {
  try {
    await axios.post(N8N_WEBHOOK_URL, req.body, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Forward error:", error.message);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`✅ Bridge running on port ${PORT}`)
);