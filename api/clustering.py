from hyperdb import HyperDB
import umap
import hdbscan
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import time


# DB 読み込み
start = time.time()
db = HyperDB([], embedding_function=lambda: 0)
db.load("sangokushi.db")
end = time.time()
print("DB load: ", end - start)

# UMAPで2次元に削減
start = time.time()
umap_model = umap.UMAP(n_components=2)
vectors_2d = umap_model.fit_transform(db.vectors)
end = time.time()
print("UMAP: ", end - start)

# KMeans++ でクラスタリング
# clusterer = KMeans(n_clusters=30 init="k-means++")
# cluster_labels = clusterer.fit(vectors_2d).predict(vectors_2d)

# HDBSCANでクラスタリング
start = time.time()
clusterer = hdbscan.HDBSCAN()
# cluster_labels = clusterer.fit_predict(vectors_2d)
cluster_labels = clusterer.fit_predict(db.vectors)
end = time.time()
print("HDBSCAN: ", end - start)
# 結果を表示
plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], c=cluster_labels, cmap="Spectral")
plt.colorbar()
plt.show()

# DBにクラスタ情報を保存
for idx, label in enumerate(cluster_labels):
    db.documents[idx]["cluster"] = int(label)

# DB 保存
db.save("sangokushi.db")
