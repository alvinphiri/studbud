const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');
const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Multer setup to save uploaded files to 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Routes for your other features (adjust paths & requires as needed)
app.use("/api/tracker", require("./routes/tracker.js"));
app.use("/api/tutor", require("./routes/tutor.js"));

// Transcription endpoint — single route, multer handles file upload
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const filePath = path.join(__dirname, req.file.path);
    console.log('Processing file:', filePath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    // Delete temp file after transcription
    fs.unlinkSync(filePath);

    res.json({ transcript: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Summarization endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'No transcript provided' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Summarize the following transcript in clear, student-friendly language:',
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (err) {
    console.error('Summarization error:', err);
    res.status(500).json({ error: 'Failed to summarize transcript' });
  }
});

// Add more endpoints/routes here as you build out features

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
