export const uploadAudioForTranscription = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData
    });
  
    const data = await response.json();
    return data.transcript;
  };
  export const generateSummary = async (transcript) => {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ transcript })
    });
    
    <button onClick={async () => {
      const result = await generateSummary(transcript);
      setSummary(result);
    }}>
      Generate Summary
    </button>
  
    const data = await response.json();
    return data.summary;

   
  };
 
  export const generateFlashcards = async (summary) => {
    const response = await fetch("/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ summary })
    });
  
    const data = await response.json();
    return data.flashcards;
  };
  
  export const generateQuiz = async (summary) => {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary })
    });
  
    const data = await response.json();
    return data.quiz;
  };