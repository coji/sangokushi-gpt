import createClient from 'openapi-fetch'
import type { components, paths } from './api-client'

export type Doc = components['schemas']['Doc']

const { GET, POST } = createClient<paths>({
  baseUrl: process.env.API_BASE_URL ?? 'http://localhost:8000',
})

export const search = async (query: string, top_k = 10) => {
  const { data } = await GET('/search', {
    params: { query: { q: query, top_k } },
  })
  return data?.result ?? []
}

export const fetchEmbedding = async (text: string) => {
  const { data } = await POST('/embedding', { body: { sentence: text } })
  return data?.embedding
}

export const fetchDoc = async (id: number) => {
  const { data } = await GET('/doc/{id}', { params: { path: { id } } })
  return data
}

export const fetchMostSimilarDoc = async (query: string) => {
  const { data } = await GET('/search', {
    params: { query: { q: query, top_k: 1 } },
  })
  return data?.result[0].document
}
