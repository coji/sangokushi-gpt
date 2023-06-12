import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import type { Section } from 'types/model'

const prisma = new PrismaClient()

const main = async () => {
  const inputDir = 'data/sangokushi_embedded'
  const embeddedSections = JSON.parse(
    await fs.readFile(path.join(inputDir, 'sangokushi.json'), 'utf-8'),
  ) as Section[]

  for (const section of embeddedSections) {
    // vector 以外をまず作り
    await prisma.section.upsert({
      where: { id: section.id },
      create: {
        id: section.id,
        chapter_number: section.chapterNumber,
        chapter_title: section.chapterTitle,
        section_number: section.sectionNumber,
        start_line_number: section.startLineNumber,
        content: section.content,
        volume_title: section.volumeTitle,
      },
      update: {
        id: section.id,
        chapter_number: section.chapterNumber,
        chapter_title: section.chapterTitle,
        section_number: section.sectionNumber,
        start_line_number: section.startLineNumber,
        content: section.content,
        volume_title: section.volumeTitle,
      },
    })

    // vector を更新
    await prisma.$executeRaw`UPDATE section SET vector = ${section.vector}::vector WHERE id = ${section.id}`
  }
}

void main()
