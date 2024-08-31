import fs from 'node:fs/promises'
import path from 'node:path'
import { db, sql } from '~/services/db'
import type { Section } from '~/types/model'

type EmbeddedSection = Section & { vector: number[] }

export const upsertSections = async () => {
  const embeddedSections = JSON.parse(
    await fs.readFile(
      path.join('data/sangokushi_embedded', 'sangokushi.json'),
      'utf-8',
    ),
  ) as EmbeddedSection[]

  for (const section of embeddedSections) {
    const { vector, ...rest } = section
    const values = {
      ...rest,
      vector: sql.raw<string>(`vector('[${vector.join(',')}]')`),
      updatedAt: new Date().toISOString(),
    }
    const upserted = await db
      .insertInto('sections')
      .values(values)
      .onConflict((oc) => oc.column('id').doUpdateSet(values))
      .returning('id')
      .executeTakeFirst()

    console.log('upserted', upserted?.id)
  }
  console.log('done')
}
