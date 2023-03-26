import { encoding_for_model } from '@dqbd/tiktoken'
import fs from 'fs'
import path from 'path'
import { hashChunk } from 'scripts/utils/hashChunk'
import type { Section } from 'types/model'
import { parseText } from '../utils/parseText'

const inputDir = 'data/sangokushi_cleaned'
const outputDir = 'data/sangokushi_structured'
const files = [
  '01jo.txt',
  '02toenno_maki.txt',
  '03gunseino_maki.txt',
  '04somono_maki.txt',
  '05shindono_maki.txt',
  '06komeino_maki.txt',
  '07sekihekino_maki.txt',
  '08boshokuno_maki.txt',
  '09tonanno_maki.txt',
  '10suishino_maki.txt',
  '11gojogenno_maki.txt',
  '12hengaiyoroku.txt',
]

// token カウントのためのエンコーダー
const encoder = encoding_for_model('gpt-3.5-turbo')

// 出力ディレクトリが存在しない場合、作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const chapters: Omit<Section, 'vector' | 'usage'>[] = []
// 各ファイルに処理を適用
for (const file of files) {
  const inputFilePath = path.join(inputDir, file)

  const data = fs.readFileSync(inputFilePath, 'utf-8')
  const fileChapters = parseText(data)

  for (const chapter of fileChapters) {
    chapters.push({
      id: hashChunk(chapter.content),
      file: path.parse(file).name,
      tokens: encoder.encode(chapter.content).length,
      ...chapter,
    })
  }
}

const outputFilePath = path.join(outputDir, 'sangokushi.json')
fs.writeFileSync(outputFilePath, JSON.stringify(chapters, null, 2))

encoder.free()
