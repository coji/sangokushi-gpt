from sentence_transformers import SentenceTransformer

model = SentenceTransformer("./model/pkshatech_GLuCoSE-base-ja")
# model = SentenceTransformer("./model/finetuned")


def create_embedding(
    sentence: str | list[str], show_progress_bar: bool = False
):
    return model.encode(sentence, show_progress_bar=show_progress_bar)
