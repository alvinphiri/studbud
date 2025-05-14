const express = require("express");
const router = express.Router();
const { openai } = require("../node_modules/openai");

router.post("/ask", async (req, res) => {
  const { userQuestion, summary } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a friendly and knowledgeable tutor. Explain things simply and clearly.`,
        },
        {
          role: "user",
          content: `Here's the content we're discussing:\n${summary}\n\nNow, answer this question: ${userQuestion}`,
        },
      ],
      model: "gpt-4",
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Tutor API error:", err.message);
    res.status(500).json({ error: "Failed to generate tutor response." });
  }
});

module.exports = router;
