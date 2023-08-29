from fastapi import FastAPI
from src.sangokushi_api.routes import embedding, doc, cluster, search
from src.sangokushi_api.services.prisma import prisma

app = FastAPI()
app.include_router(embedding.router)
app.include_router(doc.router)
app.include_router(cluster.router)
app.include_router(search.router)


@app.on_event("startup")
async def startup():
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()
