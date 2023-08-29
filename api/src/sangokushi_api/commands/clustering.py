from hyperdb import HyperDB
import umap
import hdbscan


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
