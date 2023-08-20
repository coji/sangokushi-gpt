import fs from 'fs/promises'
import path from 'path'
import { createQdrant } from 'scripts/services/qdrant'
import type { Section } from '~/types/model'
const qdrant = createQdrant(process.env.QDRANT_HOST ?? '127.0.0.1', 6333)

const initialize = async (index: string) => {
  await qdrant.deleteCollection(index)
  await qdrant.createCollection({
    collection: index,
    vectors: { size: 768, distance: 'Cosine' },
  })
}

const main = async (index: string) => {
  const inputDir = 'data/sangokushi_embedded'
  const embeddedSections = JSON.parse(await fs.readFile(path.join(inputDir, 'sangokushi.json'), 'utf-8')) as Section[]

  await initialize(index)

  console.log('addPoints')
  await qdrant.addPoints({
    collection: 'sangokushi',
    points: embeddedSections
      .filter((section) => section.tokens >= 1000)
      .map((section) => {
        const { id, vector, ...rest } = section
        return {
          id,
          vector,
          payload: {
            ...rest,
          },
        }
      }),
  })
  console.log('done')
}

void main('sangokushi')
