const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { summary } = req.body;

  try {
    const prompt = `
Based on the following summary, generate a list of 5 study flashcards in JSON format. 
Each flashcard should include a "question" and an "answer".

Summary:
${summary}

Format:
[
  { "question": "...", "answer": "..." },
  ...
]
`;

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a flashcard generator for students." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const raw = response.data.choices[0].message.content;

    // Try to parse the JSON-like response safely
    const cards = JSON.parse(raw);
    res.json({ flashcards: cards });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Flashcard generation failed" });
  }
});

module.exports = router;
