import { OpenAI } from 'openai'

export const createEmbedding = () => {
  const embedText = async (text: string) => {
    const api = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_API_ORGANIZATION_ID,
      fetch,
    })

    const ret =await  api.embeddings.create(
      {
        model: 'text-embedding-ada-002',
        input: text
      },
    )

    return {
      embedding: ret.data[0].embedding,
      usage: ret.usage,
    }
  }
  return { embedText }
}
