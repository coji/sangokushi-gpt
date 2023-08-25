
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("pkshatech/simcse-ja-bert-base-clcmlp", device="cpu")
model.save("model/pkshatech_simcse-ja-bert-base-clcmlp")
