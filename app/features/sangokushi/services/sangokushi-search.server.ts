import type { Section } from '~/../types/model'
import { fetchEmbedding } from '~/services/openai-embedding.server'
import { createQdrant } from '~/services/qdrant.server'

const qdrantQuery = async (embedding: number[]) => {
  const qdrant = createQdrant('localhost')
  return await qdrant.search({
    collection: 'sangokushi',
    params: {
      vector: embedding,
      limit: 100,
      with_vector: false,
    },
  })
}

export type SangokushiPayload = Omit<Section, 'id' | 'vector'>
export const sangokushiSearch = async (input: string) => {
  const { embedding, usage } = await fetchEmbedding(input)

  const searchResult = await qdrantQuery(embedding)
  return {
    result: searchResult.result.map((result) => ({
      id: result.id,
      score: result.score,
      section: result.payload as SangokushiPayload,
    })),
    usage,
  }
}
