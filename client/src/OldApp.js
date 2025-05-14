import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const transcribeAudio = async () => {
    if (!audioFile) return alert("Upload a file first");
    setLoading(true);
    const formData = new FormData();
    formData.append('audioFile', audioFile);

    try {
      const res = await axios.post('/api/transcribe', formData);
      setTranscript(res.data.transcript);
    } catch (err) {
      console.error(err);
      alert("Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  const summarizeTranscript = async () => {
    if (!transcript) return alert("No transcript to summarize");
    setLoading(true);
    try {
      const res = await axios.post('/api/summarize', { transcript });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Summarization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>🎧 Study Buddy - Audio Summarizer</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={transcribeAudio} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe'}
      </button>

      {transcript && (
        <>
          <h3>📝 Transcript:</h3>
          <textarea value={transcript} readOnly rows={10} style={{ width: '100%' }} />
          <button onClick={summarizeTranscript} disabled={loading}>
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </>
      )}

      {summary && (
        <>
          <h3>📌 Summary:</h3>
          <div style={{ background: '#f2f2f2', padding: '1rem', borderRadius: '5px' }}>
            {summary}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
