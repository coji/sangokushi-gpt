from fastapi import APIRouter
from fastapi.responses import JSONResponse
from ..services.database import db

router = APIRouter()


@router.get("/doc")
def root():
    """ドキュメントの一覧"""
    return {
        "documents": [
            {
                "id": item["id"],
                "volumeTitle": item["volumeTitle"],
                "chapterTitle": item["chapterTitle"],
                "sectionNumber": item["sectionNumber"],
                "cluster": item["cluster"],
            }
            for item in db.documents
        ]
    }


@router.get("/doc/{id}")
def document(id: str):
    """ドキュメントを1つ返す"""
    doc = next((item for item in db.documents if item["id"] == id), None)
    if doc is None:
        return JSONResponse(content={"notFound": id}, status_code=404)
    return {"document": doc}
