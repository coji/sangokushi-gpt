from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from hyperdb import HyperDB
import json

model = SentenceTransformer(
    "./model/pkshatech_simcse-ja-bert-base-clcmlp", device="cpu"
)


def create_embedding(document):
    return model.encode(document)


db = HyperDB([], embedding_function=create_embedding)
db.load("sangokushi.db")

app = FastAPI()


class EmbeddingParams(BaseModel):
    sentence: str


@app.post("/embedding")
def create_embedding(params: EmbeddingParams):
    """文章を受け取り、ベクトル化した結果を返すAPI"""
    return {"embedding": model.encode(params.sentence).tolist()}


@app.get("/doc")
def root():
    """ドキュメントの一覧"""
    return {
        "documents": [
            {
                "id": item["id"],
                "volumeTitle": item["volumeTitle"],
                "chapterTitle": item["chapterTitle"],
                "sectionNumber": item["sectionNumber"],
            }
            for item in db.documents
        ]
    }


@app.get("/doc/{id}")
def document(id: str):
    """ドキュメントを1つ返す"""
    doc = next((item for item in db.documents if item["id"] == id), None)
    if doc is None:
        return JSONResponse(content={"notFound": id}, status_code=404)
    return {"document": doc}


@app.get("/search")
def search(q: str, top_k: int = 10):
    """文章を受け取り、類似度の高い文章を返す"""
    result = db.query(q, top_k)
    return {
        "result": [{"document": item[0], "score": float(item[1])} for item in result]
    }
