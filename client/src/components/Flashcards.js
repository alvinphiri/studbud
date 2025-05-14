import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { generateFlashcards } from "../utils/api";

const Flashcards = () => {
  const { summary, flashcards, setFlashcards } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const cards = await generateFlashcards(summary);
    setFlashcards(cards);
    setLoading(false);
  };

  return (
    <section>
      <h2>Flashcards</h2>
      <button onClick={handleGenerate}>Generate Flashcards</button>
      {loading && <p>Generating...</p>}
      <ul>
        {flashcards.map((card, idx) => (
          <li key={idx}>
            <strong>Q:</strong> {card.question}<br />
            <strong>A:</strong> {card.answer}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Flashcards;
