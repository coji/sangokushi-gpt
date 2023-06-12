import { prisma } from '~/services/database.server'

export const similarSections = async (vector: number[], limit: number) => {
  const ret = await prisma.$queryRaw`
SELECT
  id,
  volume_title,
  chapter_number,
  chapter_title,
  section_number,
  start_line_number,
  content,
  inner_product(vector, ${vector}::vector) AS distance
FROM
  section
ORDER BY
  vector <#> ${vector}::vector
LIMIT
  ${limit}
`
  return ret as {
    id: string
    volume_title: string
    chapter_number: number
    chapter_title: string
    section_number: string
    start_line_number: number
    content: string
    distance: number
  }[]
}
