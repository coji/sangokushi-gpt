import fs from 'fs'
import path from 'path'
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

// 出力ディレクトリが存在しない場合、作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const chapters = []
// 各ファイルに処理を適用
for (const file of files) {
  const inputFilePath = path.join(inputDir, file)

  const data = fs.readFileSync(inputFilePath, 'utf-8')
  const fileChapters = parseText(data)
  for (const chapter of fileChapters) {
    chapters.push({
      file: path.parse(file).name,
      ...chapter,
    })
  }
}

const outputFilePath = path.join(outputDir, 'sangokushi.json')
fs.writeFileSync(outputFilePath, JSON.stringify(chapters, null, 2))