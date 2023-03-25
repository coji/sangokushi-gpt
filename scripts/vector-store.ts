import fs from 'fs/promises'
import { createEmbedding } from './embed'

export const createVectorStore = () => {
  const embeddingService = createEmbedding()
  const cache: Record<string, number[]> = {}

  const save = async (filename: string) => {
    await fs.writeFile(filename, JSON.stringify(cache))
  }

  const load = async (filename: string) => {
    const data = await fs.readFile(filename, 'utf-8')
    Object.assign(cache, JSON.parse(data))
  }

  const addRecord = async (body: string) => {
    if (!(body in cache)) {
      const { embedding, usage } = await embeddingService.embedText(body)
      console.log({ usage })
      cache[body] = embedding
    }
    return cache[body]
  }

  return { save, load, addRecord }
}
