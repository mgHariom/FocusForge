from fastapi import FastAPI, Request
from vector_store import store_chunks
from pydantic import BaseModel
from typing import List
from vector_store import search_chunks

app = FastAPI();


class ChunkRequest(BaseModel):
    chunks: List[str]
    doc_id: str

@app.post("/store-data")
async def store_chunks_endpoint(request: ChunkRequest):
    result = store_chunks(request.doc_id, request.chunks)
    return {"success": result}

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/search")
def search_chunks_endpoint(request: QueryRequest):
    results = search_chunks(request.query, request.top_k)
    return results