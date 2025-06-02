//server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const ffmpeg = require("fluent-ffmpeg");
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Re-encode to safe mp3 for OpenAI
const reencodeToMp3 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .outputOptions(["-ar 44100", "-ac 2"])
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
};

// 🔥 Main transcription route
app.post("/upload", upload.single("audioFile"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `cleaned-${Date.now()}.mp3`);

    await reencodeToMp3(inputPath, outputPath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: "whisper-1",
    });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
});

// ✂️ DELETE THIS DUPLICATE UNLESS YOU NEED RAW INPUTS
/*
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  ...
});
*/

// 🧠 Summarization endpoint
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
//route for flashcards
app.use("/api/flashcards", require("./routes/flashcards.js"));

// Add quiz route
app.use("/api/quiz", require("./routes/quiz.js"));

// Routes for other features
const summaryRoutes = require("./routes/summary.js");

app.use("/api/summary", summaryRoutes);

app.use("/api/tracker", require("./routes/tracker.js"));
app.use("/api/tutor", require("./routes/tutor.js"));

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
