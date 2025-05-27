import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from sentence_transformers import SentenceTransformer

# Create client
client = chromadb.Client(settings=chromadb.config.Settings(
    persist_directory="chroma_db"
))

# Use the default embedding function (or define custom one)
embedding_fn = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
collection = client.get_or_create_collection(name="data_V2", embedding_function=embedding_fn)
collections = client.list_collections()
print("Collections:", collections)

def store_chunks(doc_id: str, chunks: list):

    # try:
    #     client.delete_collection("data")
    # except Exception:
    #     pass  # Ignore if it doesn't exist

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


    results = collection.get(where={"doc_id":doc_id})
    
    print("stored document succesfully")
    return True

# Load your embedding model and DB
model = SentenceTransformer("all-MiniLM-L6-v2")
# embedding_fn = SentenceTransformerEmbeddingFunction("all-MiniLM-L6-v2")
# chroma_client = chromadb.Client()
# collection = chroma_client.get_collection("data_v2", )

def search_chunks( query: str, top_k: int = 3):

    for collection in collections:
        print(f"Collection name: {collection.name}")
        print(f"Collection count: {collection.count()}")

    data = collection.get(where={'doc_id': "unique-id"})


    try:
        # Embed the query
        query_embedding = model.encode(query).tolist()
        
        # Search in the vector DB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        print("collection count:", collection.count())

        return {
            "success": True,
            "documents": results["documents"],
            "metadatas": results["metadatas"],
            "ids": results["ids"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))