from fastapi import HTTPException
import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# Load your embedding model and DB
model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("data")

def search_chunks( query: str, top_k: int = 3):
    try:
        # Embed the query
        query_embedding = model.encode(query).tolist()
        print("query_embedding:", query_embedding)
        
        # Search in the vector DB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        print("collection count:", collection.count())

        return {
            "documents": results["documents"],
            "metadatas": results["metadatas"],
            "ids": results["ids"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
