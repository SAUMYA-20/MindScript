const express = require("express");
const { getAISummary } = require("../services/aiServices");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { content } = req.body;
    const result = await getAISummary(content);

    // console.log("📤 Sending to frontend:", result);
    res.json(result); 
  } catch (err) {
    // console.error("❌ Error in analyze route:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
