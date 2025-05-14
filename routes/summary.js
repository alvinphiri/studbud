const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { transcript } = req.body;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI that summarizes lecture transcripts." },
        { role: "user", content: `Summarize this transcript:\n\n${transcript}` }
      ],
      temperature: 0.5,
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const summary = response.data.choices[0].message.content;
    res.json({ summary });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Summary generation failed" });
  }
});

module.exports = router;
