import { createQdrant } from '~/services/qdrant.server'
import { fetchEmbedding } from '~/services/simcse-embedding.server'
import type { Section } from '~/types/model'

const qdrantQuery = async (embedding: number[], top = 100) => {
  const qdrant = createQdrant(process.env.QDRANT_HOST ?? 'localhost')
  return await qdrant.search({
    collection: 'sangokushi',
    params: {
      vector: embedding,
      limit: top,
      with_vector: false,
    },
  })
}

export type SangokushiPayload = Omit<Section, 'id' | 'vector'>
export const vectorSearchQdrant = async (input: string, top = 1) => {
  const { embedding } = await fetchEmbedding(input)

  const searchResult = await qdrantQuery(embedding, top)
  return {
    result: searchResult.result.map((result) => ({
      id: result.id,
      score: result.score,
      section: result.payload as SangokushiPayload,
    })),
  }
}
