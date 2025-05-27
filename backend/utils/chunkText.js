export function chunkText(text, maxTokens = 300) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const wordsInChunk = currentChunk.split(" ").length;
    const wordsInSentence = sentence.split(" ").length;

    if (wordsInChunk + wordsInSentence <= maxTokens) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

export default async function storeDocumentChunks(shunks, docId) {
  try {
    const response = await fetch("http://localhost:8000/store-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chunks: shunks, doc_id: docId }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error("Failed to store document chunks");
    }

    return data;
  } catch (error) {
    console.error("Error storing document chunks:", error);
  }
}


