from collections import Counter

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..services.database import db

router = APIRouter()


@router.get("/cluster")
def cluster_index():
    """クラスターの一覧"""
    return dict(Counter([item["cluster"] for item in db.documents]))


@router.get("/cluster/{cluster}")
def get_cluster(
    cluster: str,
):
    """クラスタに属するドキュメントを返す"""
    docs = [item for item in db.documents if item["cluster"] == int(cluster)]
    if len(docs) == 0:
        return JSONResponse(content={"notFound": cluster}, status_code=404)
    return {"documents": docs}
