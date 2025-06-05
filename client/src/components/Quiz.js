// Quiz.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { generateQuiz } from '../utils/api';

const Quiz = () => {
  const { summary } = useContext(AppContext);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz([]);
    setSelectedAnswers({});
    setSubmitted(false);

    try {
      const result = await generateQuiz(summary);
      if (Array.isArray(result)) {
        setQuiz(result);
      } else {
        setError('Invalid quiz format');
      }
    } catch (err) {
      setError(err.message || 'Quiz generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, option) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };
  
  const getScore = () => {
    return quiz.reduce((score, q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  return (
    <div>
      <h2>Quiz</h2>
      <button onClick={handleGenerateQuiz} disabled={loading || !summary}>
        {loading ? 'Generating Quiz...' : 'Generate Quiz'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {quiz.length > 0 && (
        <div>
          {quiz.map((q, idx) => (
            <div key={idx} style={{ margin: '15px 0', padding: '10px', border: '1px solid #ccc' }}>
              <p><strong>{idx + 1}. {q.question}</strong></p>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx}>
                  <label>
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt}
                      disabled={submitted}
                      checked={selectedAnswers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                    />
                    {opt}
                  </label>
                </div>
              ))}
              {submitted && (
                <p style={{ color: selectedAnswers[idx] === q.answer ? 'green' : 'red' }}>
                  Correct Answer: {q.answer}
                </p>
              )}
            </div>
          ))}
          {!submitted ? (
            <button onClick={handleSubmit}>Submit Quiz</button>
          ) : (
            <p><strong>Score: {getScore()} / {quiz.length}</strong></p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
