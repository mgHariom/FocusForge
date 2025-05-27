# from fastapi import HTTPException
# import chromadb
# from sentence_transformers import SentenceTransformer
# from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# # Load your embedding model and DB
# model = SentenceTransformer("all-MiniLM-L6-v2")
# embedding_fn = SentenceTransformerEmbeddingFunction("all-MiniLM-L6-v2")
# chroma_client = chromadb.Client()
# collection = chroma_client.get_collection("data_v2", )

# test = collection.get(where = {'doc_id': 'unique-id'})

# collections = chroma_client.list_collections()

# def search_chunks( query: str, top_k: int = 3):

#     print(test)

#     for collection in collections:
#         print(f"Collection name: {collection.name}")
#         print(f"Collection count: {collection.count()}")

#     print(f"Collection count: {collection.count()}")

#     # try:
#     #     # Embed the query
#     #     query_embedding = model.encode(query).tolist()
        
#     #     # Search in the vector DB
#     #     results = collection.query(
#     #         query_embeddings=[query_embedding],
#     #         n_results=top_k
#     #     )

#     #     print("collection count:", collection.count())

#     #     return {
#     #         "documents": results["documents"],
#     #         "metadatas": results["metadatas"],
#     #         "ids": results["ids"]
#     #     }
    
#     # except Exception as e:
#     #     raise HTTPException(status_code=500, detail=str(e))
