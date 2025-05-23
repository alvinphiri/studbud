import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { uploadAudioForTranscription } from "../utils/api";

const FileUpload = () => {
  const { setAudioFile, setTranscript } = useContext(AppContext);
  const [transcription, setTranscription] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudioFile(file);
    setCopySuccess("");

    try {
      const transcript = await uploadAudioForTranscription(file);
      setTranscript(transcript);
      setTranscription(transcript);
    } catch (error) {
      setTranscription("Error transcribing file.");
      console.error(error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Clear after 2s
    } catch (err) {
      setCopySuccess("Failed to copy.");
    }
  };

  return (
    <section>
      <h2>Upload Audio</h2>
      <input type="file" accept="audio/*" onChange={handleUpload} />

      {transcription && (
        <div style={{ marginTop: "10px" }}>
          <h4>Transcription:</h4>
          <textarea
            readOnly
            value={transcription}
            style={{ width: "100%", height: "150px", marginBottom: "10px" }}
          />
          <button onClick={handleCopy}>Copy to Clipboard</button>
          {copySuccess && <span style={{ marginLeft: "10px" }}>{copySuccess}</span>}
        </div>
      )}
    </section>
  );
};

export default FileUpload;
