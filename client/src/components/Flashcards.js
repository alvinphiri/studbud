// Flashcards.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { generateFlashcards } from '../utils/api';

const Flashcards = () => {
  const { summary } = useContext(AppContext);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawText, setRawText] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setRawText(null);
    try {
      
      // check if result has valid flashcards
      const result = await generateFlashcards(summary);
      console.log(result)
      if (Array.isArray(result)) {
          setFlashcards(result);
        } else if (Array.isArray(result.flashcards)) {
          setFlashcards(result.flashcards);
        } else if (typeof result === 'string') {
          setRawText(result);
          setFlashcards([]);
        } else {
          setError('Unexpected flashcard format');
        }
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Flashcards</h2>
      <button onClick={handleGenerate} disabled={loading || !summary}>
        {loading ? 'Generating...' : 'Generate Flashcards'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {rawText && (
        <div>
          <p>Could not parse structured flashcards. Here’s the raw text:</p>
          <pre>{rawText}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {flashcards.length > 0 ? (
          flashcards.map((card, index) => (
            <div key={index} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
              <strong>Q:</strong> {card.question}
              <br />
              <strong>A:</strong> {card.answer}
            </div>
          ))
        ) : !loading && !error && !rawText ? (
          <p>No flashcards yet. Click the button above to generate.</p>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
