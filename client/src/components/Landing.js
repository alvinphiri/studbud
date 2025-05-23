import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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
    formData.append('audioFile', file); // ✅ match multer key

    try {
      setUploading(true);
      setMessage('');

      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Upload successful!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
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
    </div>
  );
}

export default Upload;
