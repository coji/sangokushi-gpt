from fastapi import APIRouter
from hyperdb.galaxy_brain_math_shit import hyper_SVM_ranking_algorithm_sort
from pydantic import BaseModel

from ..services.database import db
from ..services.embedding import create_embedding
from ..services.influence import build_influences
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
    influences = build_influences()
    embedding = create_embedding(q)
    ranked_results, similarities = hyper_SVM_ranking_algorithm_sort(
        influences["embeddings"], embedding, 3
    )
    result = zip(
        [influences["labels"][index] for index in ranked_results],
        similarities.tolist(),
    )
    return {"q": q, "similarities": result}
