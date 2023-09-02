from hyperdb import HyperDB

from .embedding import create_embedding

db = HyperDB([], embedding_function=create_embedding)
db.load("sangokushi.db")
