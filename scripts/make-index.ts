import { createQdrant } from './qdrant'

const init = async () => {
  const qdrant = createQdrant('localhost', 6333)
  await qdrant.createCollection({
    collection: 'test',
    vectors: { size: 1536, distance: 'Dot' },
  })
}

//const main = () => {}

void init()
