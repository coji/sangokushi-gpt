export const fetchEmbedding = async (text: string) => {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
      input: 'Your text string goes here',
      model: 'text-embedding-ada-002',
    }),
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const result = (await res.json()) as {
    data: [{ embedding: number[] }]
    usage: { prompt_tokens: number; total_tokens: number }
  }

  return {
    embedding: result.data[0].embedding,
    usage: result.usage.total_tokens,
  }
}
