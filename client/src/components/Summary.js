import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Summary = () => {
  const { summary } = useContext(AppContext);

  return (
    <section>
      <h2>Summary</h2>
      <p>{summary ? summary : "No summary yet. Upload and transcribe to see one."}</p>
    </section>
  );
};

export default Summary;
