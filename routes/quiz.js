const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { summary } = req.body;

  try {
    const prompt = `
Based on the following summary, create a short quiz with 5 multiple choice questions.
Each question should have 4 options (A–D), only one correct answer.
Return ONLY a JSON array with "question", "options", and "answer". No markdown, no explanation.

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

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a quiz generator for students." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    console.log("GPT Raw Output:", raw);

    const cleaned = raw.replace(/```(json)?/g, '').trim();

    let quiz;
    try {
      quiz = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[.*?\]/s);
      if (match) {
        quiz = JSON.parse(match[0]);
      } else {
        return res.status(500).json({ message: "Quiz format is invalid" });
      }
    }

    return res.json({ quiz });

  } catch (error) {
    console.error("Quiz generation failed:", error.response?.data || error.message);
    return res.status(500).json({ error: "Quiz generation failed" });
  }
});

module.exports = router;
