import json
from hyperdb import HyperDB
import umap
import hdbscan
import time
from ..services.embedding import create_embedding


def create_document_embedding(documents):
    return create_embedding(
        [item["content"] for item in documents], show_progress_bar=True
    )


def create_db(documents: list):
    return HyperDB(documents, embedding_function=create_document_embedding)


def clustering(db: HyperDB):
    # UMAPで2次元に削減
    umap_model = umap.UMAP(n_components=2)
    vectors_2d = umap_model.fit_transform(db.vectors)

    # HDBSCANでクラスタリング
    clusterer = hdbscan.HDBSCAN()
    cluster_labels = clusterer.fit_predict(vectors_2d)

    # DBにクラスタ情報を保存
    for idx, label in enumerate(cluster_labels):
        db.documents[idx]["cluster"] = int(label)


def build_db(db_filename: str):
    with open("../data/sangokushi_structured/sangokushi.json", "r") as f:
        data = json.load(f)

    print("embedding...")
    db = create_db([item for item in data])

    print("clustering...")
    clustering(db)

    db.save(db_filename)
    print("db saved to", db_filename)
