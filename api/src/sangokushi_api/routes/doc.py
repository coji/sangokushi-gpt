from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ..services.database import db

router = APIRouter()


class Doc(BaseModel):
    id: str
    volumeTitle: str
    chapterTitle: str
    sectionNumber: str
    startLineNumber: int
    content: str
    cluster: int


class DocListItem(BaseModel):
    id: str
    volumeTitle: str
    chapterTitle: str
    sectionNumber: str
    cluster: int


@router.get("/doc", response_model=list[DocListItem])
def documents():
    """ドキュメントの一覧"""
    return [
        {
            "id": item["id"],
            "volumeTitle": item["volumeTitle"],
            "chapterTitle": item["chapterTitle"],
            "sectionNumber": item["sectionNumber"],
            "cluster": item["cluster"],
        }
        for item in db.documents
    ]


@router.get("/doc/{id}", response_model=Doc)
def document(id: str):
    """ドキュメントを1つ返す"""
    doc = next((item for item in db.documents if item["id"] == id), None)
    if doc is None:
        return JSONResponse(content={"notFound": id}, status_code=404)
    return doc
