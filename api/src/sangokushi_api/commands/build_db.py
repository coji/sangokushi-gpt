import asyncio
import re

import umap
from hyperdb import HyperDB
from sklearn.cluster import HDBSCAN

from ..services.embedding import create_embedding
from ..services.prisma import prisma


def chunk_sentences(text, chunk_size=10, overlap=2):
    sentences = re.split("。|\n", text)
    sentences = [s for s in sentences if s]  # 空の文字列を削除
    chunks = []

    for i in range(0, len(sentences), chunk_size - overlap):
        chunk = sentences[i : i + chunk_size]
        chunks.append("。".join(chunk))

    return chunks


def create_document_embedding(documents):
    return create_embedding(
        [item["content"] for item in documents], show_progress_bar=True
    )


def create_db(sections: list):
    chunked_sections = []
    for section in sections:
        chunks = chunk_sentences(section.content)
        for chunk in chunks:
            chunked_sections.append(
                {
                    "id": section.id,
                    "volume_title": section.volume_title,
                    "chapter_title": section.chapter_title,
                    "section_number": section.section_number,
                    "content": chunk,
                }
            )

    return HyperDB(
        chunked_sections, embedding_function=create_document_embedding
    )


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


async def build_db(db_filename: str):
    await prisma.connect()
    data = await prisma.section.find_many()
    await prisma.disconnect()

    print("embedding...")
    db = create_db(data)

    print("clustering...")
    clustering(db)

    db.save(db_filename)
    print("db saved to", db_filename)


if __name__ == "__main__":
    asyncio.run(build_db("sangokushi.db"))
