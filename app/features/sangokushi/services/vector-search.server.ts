import type { Section } from '~/../types/model'
import { similarSections } from '~/models/section.server'
import { fetchEmbedding } from '~/services/openai-embedding.server'
import { createQdrant } from '~/services/qdrant.server'

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
  const { embedding, usage } = await fetchEmbedding(input)

  const searchResult = await qdrantQuery(embedding, top)
  return {
    result: searchResult.result.map((result) => ({
      id: result.id,
      score: result.score,
      section: result.payload as SangokushiPayload,
    })),
    usage,
  }
}

export const vectorSearchPg = async (input: string, top = 1) => {
  const { embedding, usage } = await fetchEmbedding(input)
  const sections = await similarSections(embedding, top)
  return {
    result: sections.map((section) => ({
      id: section.id,
      score: section.distance,
      section,
    })),
    usage,
  }
}
