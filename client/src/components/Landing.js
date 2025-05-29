//landing.js
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext'; // import context
import { generateSummary } from '../utils/api';

function Upload() {
  const context = useContext(AppContext);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Remove local useState for transcript and message
  const [copySuccess, setCopySuccess] = useState('');

  const { transcript, setTranscript, summary, setSummary, message, setMessage} = useContext(AppContext);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', file); // ✅ must match multer field name

    try {
      setUploading(true);
      setMessage('');
      setTranscript('');
      setSummary('');
      setCopySuccess('');

      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Full response:', res.data);
      const transcript = res.data.transcript || res.data.transcription || res.data.data?.transcript || '';
      setTranscript(transcript);
      
      setMessage('Upload successful!');
       // 🔥 generate summary automatically
       const summaryData = await generateSummary(transcript);
       setSummary(summaryData.summary || '');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
      console.log('Context:', context);
      // sanity check
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Copy failed.');
    }
  };

  return (
    <div>
      <h2>Upload Your Content</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {file && <p>Selected: {file.name}</p>}
      {message && <p>{message}</p>}

      {transcript && (
        <div style={{ marginTop: '20px' }}>
          <h4>Transcription:</h4>
          <textarea
            readOnly
            value={transcript}
            style={{ width: '100%', height: '150px' }}
          />
          <button onClick={handleCopy}>Copy to Clipboard</button>
          {copySuccess && <span style={{ marginLeft: '10px' }}>{copySuccess}</span>}
        </div>
      )}
    </div>
  );
}

export default Upload;
