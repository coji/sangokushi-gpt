import { db, sql } from '~/services/db'
import { textEmbedding } from '~/services/gemini.server'

export const searchSections = async (q: string) => {
  const vector = await textEmbedding(q)
  const t = vector.join(',')
  const sections = await db
    .selectFrom('sections')
    .select([
      'id',
      'volumeTitle',
      'chapterTitle',
      'content',
      'chapterNumber',
      'chapterTitle',
      'sectionNumber',
      (eb) =>
        sql<number>`vector_distance_cos(vector, vector('[${sql.raw(t)}]'))`.as(
          'score',
        ),
    ])
    .orderBy('score', 'desc')
    .limit(10)
    .execute()

  return sections
}
