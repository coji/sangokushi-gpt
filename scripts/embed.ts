import { Configuration, OpenAIApi } from 'openai'

export const createEmbedding = () => {
  const embedText = async (text: string) => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const api = new OpenAIApi(configuration)

    const ret = await api.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return {
      embedding: ret.data.data[0].embedding,
      usage: ret.data.usage,
    }
  }
  return { embedText }
}
