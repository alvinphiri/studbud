export const uploadAudioForTranscription = async (file) => {
  const formData = new FormData();
  formData.append("audioFile", file);

  try {
    const response = await fetch("/api/transcribe", { // Ensure '/api/transcribe' is your correct backend endpoint
      method: "POST",
      body: formData,
    });
   
    
    if (!response.ok) {
      // Try to get a more specific error message from the response body if available
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.transcript !== 'undefined') {
      return data.transcript;
    } else {
      throw new Error("Transcript not found in API response");
    }
  } catch (error) {
    console.error("Error uploading audio for transcription:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};

export const generateSummary = async (transcript) => {
  try {
    const response = await fetch("/api/summary", { // Ensure '/api/summary' is your correct backend endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.summary !== 'undefined') {
      return data.summary;
    } else {
      throw new Error("Summary not found in API response");
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};

export const generateFlashcards = async (summary) => {
  try {
    const response = await fetch("/api/flashcards", { // Ensure '/api/flashcards' is your correct backend endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.flashcards !== 'undefined') {
      return data.flashcards;
    } else {
      throw new Error("Flashcards not found in API response");
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const generateQuiz = async (summary) => {
  try {
    const response = await fetch("/api/quiz", { // Ensure '/api/quiz' is your correct backend endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.quiz !== 'undefined') {
      return data.quiz;
    } else {
      throw new Error("Quiz not found in API response");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
