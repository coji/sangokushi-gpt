from fastapi import APIRouter
from pydantic import BaseModel
from ..services.embedding import create_embedding

router = APIRouter()


class EmbeddingParams(BaseModel):
    sentence: str


class EmbeddingResponse(BaseModel):
    embedding: list[float]


@router.post("/embedding", response_model=EmbeddingResponse)
def embedding(params: EmbeddingParams):
    """文章を受け取り、ベクトル化した結果を返すAPI"""
    return {"embedding": create_embedding(params.sentence).tolist()}
