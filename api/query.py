from hyperdb import HyperDB
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("pkshatech/simcse-ja-bert-base-clcmlp", device="cpu")


def create_embedding(document):
    return model.encode(document)


db = HyperDB([], embedding_function=create_embedding)
db.load("sangokushi.db")

ret = db.query("桃園の誓い", top_k=10)
print(ret[0])
