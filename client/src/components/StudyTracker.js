import React, { useEffect, useState } from "react";
import { getUserLogs } from "../utils/tracker";

const StudyTracker = ({ userId = "test-user" }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getUserLogs(userId);
      setLogs(data);
    };
    fetchLogs();
  }, [userId]);

  return (
    <section>
      <h2>📈 Study Progress</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong>{log.activity}</strong> – {log.metadata?.topic || ""} <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StudyTracker;
