import { google } from '@ai-sdk/google'
import { embed } from 'ai'

export const textEmbedding = async (text: string) => {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004', {
      outputDimensionality: 64,
    }),
    value: text,
  })

  return embedding
}
