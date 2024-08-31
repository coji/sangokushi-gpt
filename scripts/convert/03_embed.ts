import fs from 'node:fs'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { textEmbedding } from '~/services/gemini.server'
import type { Section } from '~/types/model'

export const embedSections = async () => {
  console.log('Embedding sections...')
  const inputDir = 'data/sangokushi_structured'
  const outputDir = 'data/sangokushi_embedded'
  const files = ['sangokushi.json']

  // 出力ディレクトリが存在しない場合、作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  const embeddedSections: Section[] = []

  for (const file of files) {
    console.log('Embedding file: ', file)
    const sections = JSON.parse(
      fs.readFileSync(path.join(inputDir, file), 'utf-8'),
    ) as Omit<Section, 'vector'>[]

    for (const section of sections) {
      console.log('Embedding section: ', section.id)

      const vector = await textEmbedding(section.content)

      const embeddedSection = {
        vector,
        ...section,
      }

      console.log({
        id: embeddedSection.id,
        volumeTitle: embeddedSection.volumeTitle,
        chapterNumber: embeddedSection.chapterNumber,
        chapterTitle: embeddedSection.chapterTitle,
        sectionNumber: embeddedSection.sectionNumber,
      })
      embeddedSections.push(embeddedSection)

      await setTimeout(500)
    }

    const outputFilePath = path.join(outputDir, file)
    fs.writeFileSync(outputFilePath, JSON.stringify(embeddedSections, null, 2))
  }
}
