import { Router } from "express";
import { GROQ_API_KEY } from "../config/env.js";
const searchDocumentRouter = Router();

searchDocumentRouter.post("/search-summary", async (req, res) => {
  const { query, top_k } = req.body;

  try {
    // 1. Fetch search results from your Python service
    const response = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: top_k || 3 }),
    });

    const data = await response.json();
    if (!data.documents || !Array.isArray(data.documents)) {
      return res.status(500).json({ error: "Failed to fetch search summary" });
    }

    // 2. Prepare the prompt for Groq
    const docsText = Array.isArray(data.documents) ? data.documents.join('\n\n') : data.documents;
    const prompt = `According to the following documents, answer the query in a clear, concise, and well-formatted manner. Start your answer with "According to the documents," and use bullet points or numbering where appropriate.

                    Documents:
                    ${docsText}

                    Query: "${query}"

                    Summary:`;

    // 3. Call Groq API for summarization
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // or another Groq-supported model
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes documents.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 512,
        }),
      }
    );

    const groqData = await groqResponse.json();
    const summary =
      groqData.choices?.[0]?.message?.content || "No summary generated.";

    res.status(200).json({
      success: true,
      summary,
      message: "Search summary fetched and summarized successfully",
    });
  } catch (error) {
    console.error("Error fetching search summary:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch or summarize search results" });
  }
});

export default searchDocumentRouter;
