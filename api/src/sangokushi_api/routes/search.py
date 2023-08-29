from fastapi import APIRouter
from pydantic import BaseModel
from ..services.database import db
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
                "document": {
                    "id": item[0]["id"],
                    "volume_title": item[0]["volumeTitle"],
                    "chapter_title": item[0]["chapterTitle"],
                    "section_number": item[0]["sectionNumber"],
                    "content": item[0]["content"],
                },
                "score": float(item[1]),
            }
            for item in result
        ]
    }
