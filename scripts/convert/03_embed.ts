import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fetchEmbedding } from '~/services/simcse-embedding.server'
import type { Section } from '~/types/model'
dotenv.config()

const main = async () => {
  const inputDir = 'data/sangokushi_structured'
  const outputDir = 'data/sangokushi_embedded'
  const files = ['sangokushi.json']

  // 出力ディレクトリが存在しない場合、作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  const embeddedSections: Section[] = []

  for (const file of files) {
    const sections = JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf-8')) as Omit<
      Section,
      'vector' | 'usage'
    >[]

    for (const section of sections) {
      let count = 0
      let done = false
      do {
        try {
          count++

          console.log('Embedding section: ', section.id)
          const { embedding } = await fetchEmbedding(section.content)
          const embeddedSection = {
            vector: embedding,
            ...section,
          }
          console.log({
            id: embeddedSection.id,
            file: embeddedSection.file,
            volumeTitle: embeddedSection.volumeTitle,
            chapterNumber: embeddedSection.chapterNumber,
            chapterTitle: embeddedSection.chapterTitle,
            sectionNumber: embeddedSection.sectionNumber,
          })
          embeddedSections.push(embeddedSection)
          done = true
        } catch (e) {
          console.log(e)
        }
      } while (!done && count < 5) // 5回までリトライ
    }

    const outputFilePath = path.join(outputDir, file)
    fs.writeFileSync(outputFilePath, JSON.stringify(embeddedSections, null, 2))
  }
}

void main()
