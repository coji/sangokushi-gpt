import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import invariant from 'tiny-invariant'
import type { Section } from 'types/model'
dotenv.config()

const main = async () => {
  const inputDir = 'data/sangokushi_embedded'
  const embeddedSections = JSON.parse(
    await fs.readFile(path.join(inputDir, 'sangokushi.json'), 'utf-8'),
  ) as Section[]

  invariant(process.env.PINECONE_API_KEY, 'PINECONE_API_KEY is required')
  const pinecone = new PineconeClient()
  await pinecone.init({
    environment: 'us-east1-gcp',
    apiKey: process.env.PINECONE_API_KEY,
  })

  const index = pinecone.Index('sangokushi')

  for (const section of embeddedSections) {
    const upsertResponse = await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: section.id,
            values: section.vector,
            metadata: {
              file: section.file,
              startLineNumber: section.startLineNumber,
              volumeTitle: section.volumeTitle,
              chapterTitle: section.chapterTitle,
              chapterNumber: section.chapterNumber,
              sectionNumber: section.sectionNumber,
              content: section.content,
              tokens: section.tokens,
            },
          },
        ],
        namespace: 'vector',
      },
    })
    console.log({ upsertResponse })
  }
}

void main()
