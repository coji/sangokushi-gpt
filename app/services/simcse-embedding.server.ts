export const fetchEmbedding = async (sentence: string) => {
  const res = await fetch(`${process.env.EMBEDDING_API_HOST}/embedding?sentence=${encodeURIComponent(sentence)}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const result = (await res.json()) as { sentence: string; embedding: number[] }
  return result
}
