# from hyperdb.galaxy_brain_math_shit import hyper_SVM_ranking_algorithm_sort
from src.sangokushi_api.services.embedding import create_embedding


def build_influences():
    influences = ["魏", "呉", "蜀"]
    embeddings = create_embedding(influences)
    return {"labels": influences, "embeddings": embeddings}


def main():
    influences = build_influences()
    print(influences["labels"])


if __name__ == "__main__":
    main()
