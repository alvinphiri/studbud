const express = require("express");
const router = express.Router();

let trackerDB = []; // We'll use DB later. For now, in-memory.

router.post("/log", (req, res) => {
  const { userId, activity, metadata } = req.body;

  const entry = {
    id: trackerDB.length + 1,
    userId,
    activity,
    metadata,
    timestamp: new Date(),
  };

  trackerDB.push(entry);
  res.json({ message: "Logged", entry });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const logs = trackerDB.filter((e) => e.userId === userId);
  res.json({ logs });
});

module.exports = router;
