from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "./model/pkshatech_simcse-ja-bert-base-clcmlp", device="cpu"
)


def create_embedding(sentence: str):
    return model.encode(sentence)
