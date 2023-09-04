import pandas as pd
from sentence_transformers import (
    InputExample,
    SentencesDataset,
    SentenceTransformer,
    losses,
    models,
)
from torch.utils.data import DataLoader

bert = models.Transformer("pkshatech/GLuCoSE-base-ja")
pooling = models.Pooling(bert.get_word_embedding_dimension())
model = SentenceTransformer(modules=[bert, pooling])

datasets_df = pd.read_csv("data/training.csv")

train_dataset = SentencesDataset(
    [
        InputExample(texts=[row["anchor"], row["positive"], row["negative"]])
        for index, row in datasets_df.iterrows()
    ],
    model,
)
train_dataloader = DataLoader(train_dataset, shuffle=True, batch_size=8)
train_loss = losses.TripletLoss(model=model)

model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=5,
    evaluation_steps=1,
    warmup_steps=1,
    output_path="./model/finetuned",
)
