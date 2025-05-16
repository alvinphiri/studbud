import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { generateQuiz } from "../utils/api";

const Quiz = () => {
  const { summary, quiz = [], setQuiz } = useContext(AppContext); // default quiz to []
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!summary || summary.trim() === "") {
      alert("Summary is empty. Generate a summary first.");
      return;
    }

    setLoading(true);
    try {
      const questions = await generateQuiz(summary);
      if (!questions || questions.length === 0) {
        alert("No quiz questions generated.");
        return;
      }
      setQuiz(questions);
      setSelectedAnswers({});
      setScore(null);
      setSubmitted(false);
    } catch (err) {
      console.error("Quiz generation failed:", err);
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  return (
    <section>
      <h2>Quiz</h2>
      <button onClick={handleGenerate}>Generate Quiz</button>

      {loading && <p>Generating...</p>}

      {quiz.length > 0 && !submitted && (
        <div>
          <form>
            {quiz.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "1em" }}>
                <p><strong>{idx + 1}. {q.question}</strong></p>
                {q.options && q.options.map((opt, i) => (
                  <label key={i} style={{ display: "block" }}>
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={selectedAnswers[idx] === opt}
                      onChange={() => handleOptionSelect(idx, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
          </form>
          <button onClick={handleSubmit}>Submit Answers</button>
        </div>
      )}

      {submitted && (
        <div>
          <h3>Your Score: {score} / {quiz.length}</h3>
          <ul>
            {quiz.map((q, idx) => (
              <li key={idx}>
                <strong>Q{idx + 1}:</strong> {q.question} <br />
                <span>
                  <strong>Your Answer:</strong> {selectedAnswers[idx] || "None"} <br />
                  <strong>Correct Answer:</strong> {q.answer}
                </span>
                <p style={{ color: selectedAnswers[idx] === q.answer ? "green" : "red" }}>
                  {selectedAnswers[idx] === q.answer ? "✔ Correct" : "✖ Incorrect"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Quiz;
