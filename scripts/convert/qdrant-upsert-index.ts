import fs from 'fs/promises'
import path from 'path'
import { createQdrant } from 'scripts/services/qdrant'
import type { Section } from 'types/model'
const qdrant = createQdrant('localhost', 6333)

const initialize = async () => {
  await qdrant.deleteCollection('sangokushi')
  await qdrant.createCollection({
    collection: 'sangokushi',
    vectors: { size: 1536, distance: 'Cosine' },
  })
}

const main = async () => {
  const inputDir = 'data/sangokushi_embedded'
  const embeddedSections = JSON.parse(
    await fs.readFile(path.join(inputDir, 'sangokushi.json'), 'utf-8'),
  ) as Section[]

  await initialize()

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

void main()
