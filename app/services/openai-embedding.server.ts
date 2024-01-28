import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_API_ORGANIZATION_ID,
})

export const OpenAIEmbedding = async (text: string, dimensions = 10) => {
  const res = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-small',
    dimensions,
  })
  return res.data[0].embedding
}
