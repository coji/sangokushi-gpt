import { DefaultService, OpenAPI } from './api-client'

OpenAPI.BASE = process.env.API_BASE_URL || 'http://localhost:8000'

export const search = async (query: string, top_k = 10) => {
  const { result } = await DefaultService.searchSearchGet(query, top_k)
  return result
}

export const fetchEmbedding = async (text: string) => {
  const { embedding } = await DefaultService.embeddingEmbeddingPost({ sentence: text })
  return embedding
}

export const fetchDoc = async (id: number) => {
  return await DefaultService.documentDocIdGet(id)
}

export const fetchMostSimilarDoc = async (query: string) => {
  const result = await search(query, 1)
  return fetchDoc(result[0].document.id)
}
