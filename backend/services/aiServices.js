const getAISummary = async (content) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173", // ✅ your frontend URL (optional)
          "X-Title": "Mindscript AI Journal", // ✅ project name (optional)
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
Analyze the following journal entry.

1. Summarize it in 2–3 sentences.  
2. Suggest 3 reflection prompts.  
3. Classify the overall mood as one of: "positive", "negative", or "neutral".

Return ONLY valid JSON:
{
  "summary": "...",
  "prompts": ["...", "...", "..."],
  "mood": "positive" | "negative" | "neutral"
}

Journal entry:
${content}
`,
                },
              ],
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    // console.log("OpenRouter raw response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("No content returned from OpenRouter");

    // Remove ```json ... ``` wrappers if present
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
    //   console.error("Failed to parse JSON from model:", cleaned);
      throw err;
    }
    

    return {
      summary: parsed.summary || "No summary generated.",
      prompts: parsed.prompts || [],
      mood: parsed.mood?.toLowerCase() || "neutral", // normalize
    };
    
  } catch (error) {
    // console.error("Error in getAISummary:", error);
    return {
      summary: "Could not generate summary.",
      prompts: [],
      mood: "neutral", // fallback
    };
  }
};

module.exports = { getAISummary };
