const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { summary } = req.body;

  try {
    const prompt = `
Based on the following summary, create a short quiz with 5 multiple choice questions. 
Each question should have 4 options (A–D), only one correct answer. 
Return in JSON format with "question", "options", and "answer".

Summary:
${summary}

Format:
[
  {
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }
]
`;

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a quiz generator for students." },
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
    const quiz = JSON.parse(raw);
    res.json({ quiz });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

module.exports = router;
