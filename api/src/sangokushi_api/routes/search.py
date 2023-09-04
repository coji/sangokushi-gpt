from fastapi import APIRouter
from pydantic import BaseModel

from ..services.database import db
from ..services.influence import influence_similarity
from .doc import Doc

router = APIRouter()


class ScoredDoc(BaseModel):
    document: Doc
    score: float


class SearchResponse(BaseModel):
    result: list[ScoredDoc]


@router.get("/search", response_model=SearchResponse)
def search(q: str, top_k: int = 10):
    """文章を受け取り、類似度の高い文章を返す"""
    result = db.query(q, top_k)
    print(result)
    return {
        "result": [
            {
                "document": {**item},
                "score": float(score),
            }
            for item, score in result
        ]
    }


@router.get("/search_influence")
def search_influence(q: str):
    """魏呉蜀のどれに近いか判定する"""
    result = influence_similarity(q)
    return {"q": q, "similarities": result}
