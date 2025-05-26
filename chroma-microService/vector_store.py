import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# Create client
client = chromadb.Client();

# Use the default embedding function (or define custom one)
embedding_fn = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def store_chunks(doc_id: str, chunks: list):

    try:
        client.delete_collection("data")
    except Exception:
        pass  # Ignore if it doesn't exist

    collection = client.get_or_create_collection(name="data", embedding_function=embedding_fn)

    documents = []
    ids = []

    for i, chunk in enumerate(chunks):
        documents.append(chunk)
        ids.append(f"{doc_id}_{i}")

    collection.add(
        documents=documents,
        ids=ids,
        metadatas=[{"doc_id": doc_id}] * len(documents),
    )

    results = collection.get(include=[ "embeddings"])


    collection_name = collection.name
    print(f"Stored {len(documents)} chunks in collection '{collection_name}' with doc_id '{doc_id}'.")
    print(results["embeddings"])
    print(f"Collection count: {collection.count()}")

    return True