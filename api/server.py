from fastapi import FastAPI
from src.sangokushi_api.routes import embedding, doc, cluster, search


app = FastAPI()
app.include_router(embedding.router)
app.include_router(doc.router)
app.include_router(cluster.router)
app.include_router(search.router)
