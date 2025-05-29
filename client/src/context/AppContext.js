//AppContext.js
import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const[message, setMessage] = useState("");
  
  return (
    <AppContext.Provider value={{
      audioFile, setAudioFile,
      transcript, setTranscript,
      summary, setSummary,
      flashcards, setFlashcards,
      quiz, setQuiz,
      message, setMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};
