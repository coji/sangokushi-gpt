import json
from hyperdb import HyperDB
import umap
from sklearn.cluster import HDBSCAN
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
    clusterer = HDBSCAN(min_cluster_size=5)
    clusterer.fit(vectors_2d)
    cluster_labels = clusterer.labels_

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
