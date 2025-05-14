export const logActivity = async (userId, activity, metadata = {}) => {
    const res = await fetch("/api/tracker/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, activity, metadata }),
    });
  
    return await res.json();
  };
  
  export const getUserLogs = async (userId) => {
    const res = await fetch(`/api/tracker/${userId}`);
    const data = await res.json();
    return data.logs;
  };
  