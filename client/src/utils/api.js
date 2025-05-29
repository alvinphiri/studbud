import axios from 'axios';


export const uploadAudioForTranscription = async (file) => {
  const formData = new FormData();
  formData.append("audioFile", file);


  try {
    const response = await fetch("/upload", { // Ensure '/api/transcribe' is your correct backend endpoint
      method: "POST",
      body: formData,
    });
   
    if (!response.ok) {
      // Try to get a more specific error message from the response body if available
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.transcription !== 'undefined') {
      return data.transcription;
    } else {
      throw new Error("Transcription not found in API response");
    }
  } catch (error) {
    console.error("Error uploading audio for transcription:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};


export const generateSummary = async (transcriptionText) => {
  try {
    // 1. Determine the correct backend endpoint.
    //    Your server.js mounts summaryRoutes at '/api/summary'.
    //    Your routes/summary.js handles POST requests at its root ("/").
    //    So, the full path should be '/api/summary'.
    const endpoint = '/api/summary';

    // 2. Determine the expected request body structure.
    //    Your backend route (routes/summary.js) expects: { text: "some transcription..." }
    const payload = { transcript: transcriptionText };

    // 3. Make the POST request using axios.
    //    axios.post(url, data, [config])
    //    Axios automatically handles JSON.stringify for the data and
    //    sets 'Content-Type': 'application/json' by default for object payloads.
    const response = await axios.post(endpoint, payload);

    // 4. Return the data from the response.
    //    Axios puts the server's response data in the `data` property.
    return response.data;

  } catch (error) {
    // 5. Handle potential errors.
    console.error("Error generating summary:", error);

    // It's good practice to throw the error or return a structured error
    // so the calling code can also handle it.
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      // Re-throw a more specific error or the original error.response
      throw new Error(error.response.data?.error || `Request failed with status ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
      throw new Error("No response received from server while generating summary.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
      throw new Error(error.message || "Error setting up request for summary generation.");
    }
  }
};

// Example of how you might call this function in a component:
// async function handleGenerateSummary(transcript) {
//   try {
//     const summaryData = await generateSummary(transcript);
//     // Do something with summaryData
//   } catch (err) {
//     // Display error to the user
//   }
// }

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
