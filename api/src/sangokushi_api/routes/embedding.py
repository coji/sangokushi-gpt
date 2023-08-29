from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class EmbeddingParams(BaseModel):
    sentence: str


@router.post("/embedding")
def create_embedding(params: EmbeddingParams):
    """文章を受け取り、ベクトル化した結果を返すAPI"""
    return {"embedding": create_embedding(params.sentence).tolist()}
