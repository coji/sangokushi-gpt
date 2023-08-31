from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ..services.prisma import prisma

router = APIRouter()


class Doc(BaseModel):
    id: int
    volume_title: str
    chapter_title: str
    section_number: str
    content: str


class DocListItem(BaseModel):
    id: int
    volume_title: str
    chapter_title: str
    section_number: str


@router.get("/doc", response_model=list[DocListItem])
async def documents():
    """ドキュメントの一覧"""
    items = await prisma.section.find_many()
    return [
        {
            "id": item.id,
            "volume_title": item.volume_title,
            "chapter_title": item.chapter_title,
            "section_number": item.section_number,
        }
        for item in items
    ]


@router.get("/doc/{id}", response_model=Doc)
async def document(id: int):
    """ドキュメントを1つ返す"""
    item = await prisma.section.find_first(where={"id": id})
    if item is None:
        return JSONResponse(content={"notFound": id}, status_code=404)
    return item
