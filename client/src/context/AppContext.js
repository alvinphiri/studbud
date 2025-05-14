import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  
  return (
    <AppContext.Provider value={{
      audioFile, setAudioFile,
      transcript, setTranscript,
      summary, setSummary,
      flashcards, setFlashcards,
      quiz, setQuiz
    }}>
      {children}
    </AppContext.Provider>
  );
};
