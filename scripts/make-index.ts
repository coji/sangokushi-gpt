import crypto from 'crypto'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { createEmbedding } from './embed'
import { createQdrant } from './qdrant'
dotenv.config()

function hashChunk(chunk: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(chunk)
  const hashBuffer = hash.digest()
  const uuid = uuidV4({ random: hashBuffer })
  return uuid
}
function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  let chunk = ''
  const sentences = text.split(/[。.\n]/) // 句点と改行文字を区切り文字として使用
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim()
    if (sentence === '') continue
    if (chunk.length + sentence.length > chunkSize) {
      chunks.push(chunk.trim())
      chunk = ''
    }
    chunk += sentence + '。' // 句点を復元
  }
  if (chunk !== '') chunks.push(chunk.trim())
  return chunks
}

const listTxtFiles = async (dirPath: string): Promise<string[]> => {
  const fileNames: string[] = []
  const files = await fs.readdir(dirPath)
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i])
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) continue
    if (path.extname(filePath).toLowerCase() !== '.txt') continue
    fileNames.push(filePath)
  }
  return fileNames
}

const chunkTxtFiles = async (
  dirPath: string,
  chunkSize: number,
): Promise<Record<string, string[]>> => {
  const chunksByFile: Record<string, string[]> = {}
  const txtFiles = await listTxtFiles(dirPath)
  for (let i = 0; i < txtFiles.length; i++) {
    const filePath = txtFiles[i]
    const text = await fs.readFile(filePath, { encoding: 'utf-8' })
    const chunks = chunkText(text, chunkSize)
    chunksByFile[filePath] = chunks
  }
  return chunksByFile
}
const init = async () => {
  const qdrant = createQdrant('localhost', 6333)
  await qdrant.createCollection({
    collection: 'test',
    vectors: { size: 1536, distance: 'Dot' },
  })
}

const testEmbed = async () => {
  const qdrant = createQdrant('localhost', 6333)
  const embeddingService = createEmbedding()

  const text = 'Hello world'
  const { embedding, usage } = await embeddingService.embedText(text)
  await qdrant.addPoints({
    collection: 'test',
    points: [
      {
        id: 1,
        vector: embedding,
        payload: { text },
      },
    ],
  })
}

const processText = async () => {
  const dirPath = 'data/sangokushi_cleaned'
  const chunkSize = 100
  const chunksByFile = await chunkTxtFiles(dirPath, chunkSize)
  console.log(Object.keys(chunksByFile))

  const qdrant = createQdrant('localhost', 6333)
  const embeddingService = createEmbedding()

  for (const [filePath, chunks] of Object.entries(chunksByFile)) {
    for (const chunk of chunks) {
      const id = hashChunk(chunk)

      const { embedding, usage } = await embeddingService.embedText(chunk)
      console.log({ filePath, id, usage })
      await qdrant.addPoints({
        collection: 'test',
        points: [
          {
            id,
            vector: embedding,
            payload: { text: chunk, filePath },
          },
        ],
      })
    }
  }
}

void processText()
