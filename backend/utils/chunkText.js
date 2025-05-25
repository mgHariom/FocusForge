export function chunkText(text, maxTokens = 300) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        const wordsInChunk = currentChunk.split(' ').length;
        const wordsInSentence = sentence.split(' ').length;

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