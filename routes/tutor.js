// routes/tutor.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { transcript, question } = req.body;

  if (!transcript || !question) {
    return res.status(400).json({ error: "Transcript and question are required." });
  }

  try {
    const prompt = `
You're an AI tutor helping a student. Use the following transcript for context.
Respond to the student's follow-up question clearly and helpfully.

Transcript:
${transcript}

Student's Question:
${question}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful and patient AI tutor for students." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (err) {
    console.error("Tutor question error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process tutor question." });
  }
});

module.exports = router;
