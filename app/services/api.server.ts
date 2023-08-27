import type { Section } from '../types/model'

export const search = async (query: string, top_k = 10) => {
  const ret = await fetch(`${process.env.API_BASE_URL}/search?q=${encodeURIComponent(query)}&top_k=${top_k}`)
  return (await ret.json())['result'] as { document: Section; score: number }[]
}

export const fetchEmbedding = async (text: string) => {
  const ret = await fetch(`${process.env.API_BASE_URL}/embedding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence: text }),
  })
  return (await ret.json()) as { embedding: number[] }
}
