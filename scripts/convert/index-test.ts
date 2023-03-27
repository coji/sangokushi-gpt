import { createQdrant } from 'scripts/services/qdrant'
const qdrant = createQdrant('localhost', 6333)

const main = async () => {
  await qdrant.deleteCollection('test')

  await qdrant.createCollection({
    collection: 'test',
    vectors: { size: 4, distance: 'Cosine' },
  })

  console.log('addPoints')
  await qdrant.addPoints({
    collection: 'test',
    points: [
      { id: 1, vector: [0.05, 0.61, 0.76, 0.74], payload: { city: 'Berlin' } },
      {
        id: 2,
        vector: [0.19, 0.81, 0.75, 0.11],
        payload: { city: ['Berlin', 'London'] },
      },
      {
        id: 3,
        vector: [0.36, 0.55, 0.47, 0.94],
        payload: { city: ['Berlin', 'Moscow'] },
      },
      {
        id: 4,
        vector: [0.18, 0.01, 0.85, 0.8],
        payload: { city: ['London', 'Moscow'] },
      },
      { id: 5, vector: [0.24, 0.18, 0.22, 0.44], payload: { count: [0] } },
      { id: 6, vector: [0.35, 0.08, 0.11, 0.44] },
    ],
  })
  console.log('done')
}

void main()
