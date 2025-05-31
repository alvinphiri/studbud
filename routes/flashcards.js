// routes/flashcards.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ error: 'Missing summary.' });

    const prompt = `
    Based on the following summary, create flashcards for student revision.
    Format: JSON array of { "question": "...", "answer": "..." } objects.
    Focus on key points, definitions, and important takeaways.

    Summary:
    ${summary}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an educational assistant that generates flashcards.' },
        { role: 'user', content: prompt },
      ],
    });

    const flashcardsText = completion.choices[0].message.content;

    // Try to parse JSON from model response
    let flashcards;
    try {
      flashcards = JSON.parse(flashcardsText);
    } catch (err) {
      console.warn('Flashcard parse fail. Sending raw text.');
      return res.json({ flashcards: [], raw: flashcardsText });
    }

    res.json({ flashcards });

  } catch (err) {
    console.error('Flashcard generation error:', err);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

module.exports = router;
