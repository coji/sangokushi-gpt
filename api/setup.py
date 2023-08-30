from sentence_transformers import SentenceTransformer

model = SentenceTransformer("pkshatech/GLuCoSE-base-ja", device="cpu")
model.save("./model/pkshatech_GLuCoSE-base-ja")
