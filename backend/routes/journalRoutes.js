// routes/journalRoutes.js
const express = require("express");
const { getAISummary } = require("../services/aiServices");
const JournalEntry = require("../models/JournalEntry"); // ✅ import model

const router = express.Router();

// ✅ AI Analysis Route
router.post("/analyze", async (req, res) => {
  try {
    const { content } = req.body;
    const result = await getAISummary(content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "AI analysis failed" });
  }
});

// ✅ Save new journal entry
router.post("/", async (req, res) => {
  try {
    const { content, mood, aiSummary, themes, shared, userId } = req.body;

    const entry = new JournalEntry({
      content,
      mood,
      aiSummary,
      themes,
      shared,
      userId,
      date: new Date()
    });

    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all journal entries
router.get("/", async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
