// At the top
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Tutor = () => {
  const { transcript, summary, flashcards } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [selectedHelpArea, setSelectedHelpArea] = useState(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transcript) {
      setInitialPrompt("Hey! I noticed you've uploaded an audio file. Do you need help with anything from it?");
    } else {
      setInitialPrompt("Upload an audio file first to get started with Tutor Mode.");
    }
  }, [transcript]);

  const handleOptionSelect = (area) => {
    setSelectedHelpArea(area);
    switch (area) {
      case 'summary':
        setMessage(summary);
        break;
      case 'flashcards':
        setMessage("Let’s go over the flashcards.");
        break;
      case 'transcript':
        setMessage(transcript);
        break;
      case 'quiz':
        setMessage("Let's review your quiz performance.");
        break;
      default:
        setMessage("Sure, let's begin!");
    }
  };

  const handleQuestionSubmit = async () => {
      if (!userQuestion.trim()) return;
      setLoading(true);
      setTutorResponse('');
    
      // Pick relevant context
      let contextText = '';
      switch (selectedHelpArea) {
        case 'summary':
          contextText = summary;
          break;
        case 'quiz':
          contextText = 'User quiz results and mistakes go here...'; // TODO: Replace with real data if available
          break;
          case 'flashcards':
            if (!flashcards || flashcards.length === 0) {
              contextText = "No flashcards available.";
            } else {
              contextText = flashcards.map(f => `${f.question} - ${f.answer}`).join('\n');
            }
            break;
        case 'transcript':
        default:
          contextText = transcript;
          break;
      }
    
      try {
        const res = await fetch("/api/tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            transcript: contextText,
            question: userQuestion
          })
        });
    
        const data = await res.json();
        setTutorResponse(data.answer || "Sorry, I couldn’t understand your question.");
      } catch (err) {
        setTutorResponse("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <div>
      <h2>Tutor Mode</h2>
      <p>{initialPrompt}</p>

      {transcript && (
        <div>
          <p>Select the topic you want help with:</p>
          <button
            className={selectedHelpArea === 'summary' ? 'active' : ''}
            onClick={() => handleOptionSelect('summary')}
          >
            Summary
          </button>
          <button
            className={selectedHelpArea === 'quiz' ? 'active' : ''}
            onClick={() => handleOptionSelect('quiz')}
          >
            Quiz
          </button>
          <button
            className={selectedHelpArea === 'flashcards' ? 'active' : ''}
            onClick={() => handleOptionSelect('flashcards')}
          >
            Flashcards
          </button>
          <button
            className={selectedHelpArea === 'transcript' ? 'active' : ''}
            onClick={() => handleOptionSelect('transcript')}
          >
            Transcript
          </button>
        </div>
          )}


      {message && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          <strong>Initial Explanation:</strong>
          <p>{message}</p>
        </div>
      )}

      {selectedHelpArea && (
        <div style={{ marginTop: '30px' }}>
          <h4>Got a follow-up question?</h4>
          <input
            type="text"
            placeholder="Type your question..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
          <button onClick={handleQuestionSubmit} disabled={loading}>
            {loading ? "Thinking..." : "Ask Tutor"}
          </button>

          {tutorResponse && (
            <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
              <strong>Tutor:</strong>
              <p>{tutorResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tutor;
