import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { uploadAudioForTranscription } from "../utils/api";

const FileUpload = () => {
  const { setAudioFile, setTranscript } = useContext(AppContext);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setAudioFile(file);

    const transcript = await uploadAudioForTranscription(file);
    setTranscript(transcript);
  };

  return (
    <section>
      <h2>Upload Audio</h2>
      <input type="file" accept="audio/*" onChange={handleUpload} />
    </section>
  );
};

export default FileUpload;
