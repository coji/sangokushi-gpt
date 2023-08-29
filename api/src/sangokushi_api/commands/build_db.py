import json
from hyperdb import HyperDB
from sentence_transformers import SentenceTransformer
from .clustering import clustering

model = SentenceTransformer("pkshatech/simcse-ja-bert-base-clcmlp", device="cpu")


def create_embedding(document):
    embeddings = []
    for i, docs in enumerate(document):
        print("embedding", i)
        embeddings.append(model.encode(docs["content"]))
    return embeddings


def load_documents_from_json():
    documents = []
    with open("../data/sangokushi_structured/sangokushi.json", "r") as f:
        data = json.load(f)
    for paragraph in data:
        documents.append(paragraph)
    return documents


def create_db():
    documents = load_documents_from_json()
    db = HyperDB(documents, embedding_function=create_embedding)
    return db


def build_db(db_filename: str):
    db_filename = "sangokushi.db"
    db = create_db()
    clustering(db)
    db.save(db_filename)
    print("db saved to", db_filename)
