import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

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
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
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
