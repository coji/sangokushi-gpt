import { createQdrant } from 'scripts/services/qdrant'
const qdrant = createQdrant('localhost', 6333)

const initialize = async () => {
  await qdrant.createCollection({
    collection: 'sangokushi',
    vectors: { size: 1536, distance: 'Cosine' },
  })
}

void initialize()
