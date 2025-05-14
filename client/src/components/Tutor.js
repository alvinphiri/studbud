import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Tutor = () => {
  const { summary } = useContext(AppContext);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/tutor/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuestion: question, summary }),
    });

    const data = await res.json();
    setResponse(data.answer);
    setLoading(false);
  };

  return (
    <section>
      <h2>👩‍🏫 Tutor Mode</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask me anything about the content..."
        rows="4"
      />
      <button onClick={askTutor}>Ask Tutor</button>

      {loading && <p>Thinking...</p>}
      {response && (
        <div style={{ marginTop: "1em", background: "#f5f5f5", padding: "1em" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </section>
  );
};

export default Tutor;
