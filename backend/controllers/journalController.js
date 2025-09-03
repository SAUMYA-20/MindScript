const { getAISummary } = require("../services/aiServices");

const analyzeJournal = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const aiResult = await getAISummary(content);

    res.json({
      summary: aiResult.summary,
      prompts: aiResult.prompts,
    });
  } catch (error) {
    // console.error("Gemini API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { analyzeJournal };
