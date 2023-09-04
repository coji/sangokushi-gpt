from hyperdb.galaxy_brain_math_shit import hyper_SVM_ranking_algorithm_sort
from src.sangokushi_api.services.embedding import create_embedding


def build_influences():
    influences = ["魏", "呉", "蜀"]
    embeddings = create_embedding(influences)
    return {"labels": influences, "embeddings": embeddings}


def influence_similarity(q: str):
    """魏呉蜀のどれに近いか判定する"""
    influences = build_influences()
    embedding = create_embedding(q)
    ranked_results, similarities = hyper_SVM_ranking_algorithm_sort(
        influences["embeddings"], embedding, 3
    )
    return zip(
        [influences["labels"][index] for index in ranked_results],
        similarities.tolist(),
    )


def main():
    influences = build_influences()
    print(influences["labels"])


if __name__ == "__main__":
    main()
