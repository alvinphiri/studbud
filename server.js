const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');
const formidable = require('formidable').IncomingForm;
const axios = require('axios');
const FormData = require('form-data'); // ← important for OpenAI upload
const app = express();
const PORT =  process.env.PORT || 5000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});




app.use(cors());
app.use(express.json());
 // study tracker route 
 app.use("/api/tracker", require("./routes/tracker.js"));
// study tutor route
app.use("/api/tutor", require("./routes/tutor.js"));

app.post('/api/transcribe', (req, res) => {
  const form = new formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Error parsing file:', err);
      return res.status(500).json({ error: 'File parse error' });
    }

    console.log('📦 File details:', files);

    const filePath = files.audioFile?.[0]?.filepath;
    if (!filePath) {
      console.error('❌ File path missing');
      return res.status(400).json({ error: 'No audio file received' });
    }

    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', fileStream, {
      filename: files.audioFile?.[0]?.originalFilename || 'audio.m4a',
      contentType: 'audio/mpeg',
    });
    formData.append('model', 'whisper-1');

    try {
      console.log('📤 Uploading to OpenAI Whisper API...');
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      res.json({ transcript: response.data.text });
    } catch (error) {
      console.error('[❌ OpenAI Whisper API Error]', error.response?.data || error.message);
      res.status(500).json({ error: 'Transcription failed', details: error.message });
    }
  });
});


// File upload config
const upload = multer({ dest: 'uploads/' });

// Transcription endpoint
app.post('/api/transcribe', upload.single('audioFile'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    // Cleanup the uploaded file
    fs.unlinkSync(filePath);

    res.json({ transcript: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

console.log('📤 Uploading to OpenAI Whisper API...');

// Summarization endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript } = req.body;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
