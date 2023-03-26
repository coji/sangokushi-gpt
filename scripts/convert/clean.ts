import fs from 'fs'
import iconv from 'iconv-lite'
import path from 'path'
import { removeHeaderAndFooter } from '../utils/removeHeaderAndFooter'
import { removeRubyAndSymbols } from '../utils/removeRubyAndSymbols'

const inputDir = 'data/sangokushi'
const outputDir = 'data/sangokushi_cleaned'
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

// 各ファイルに処理を適用
for (const file of files) {
  const inputFilePath = path.join(inputDir, file)
  const outputFilePath = path.join(outputDir, file)

  fs.readFile(inputFilePath, (err, data) => {
    if (err) {
      console.error(`Error reading file ${inputFilePath}:`, err)
      return
    }

    const decodedText = iconv.decode(data, 'Shift_JIS')
    const bodyText = removeHeaderAndFooter(decodedText)
    const cleanedText = removeRubyAndSymbols(bodyText)
    const encodedText = iconv.encode(
      cleanedText.replace(/\r\n/g, '\n'),
      'UTF-8',
    )

    fs.writeFile(outputFilePath, encodedText, (err) => {
      if (err) {
        console.error(`Error writing file ${outputFilePath}:`, err)
      } else {
        console.log(`Successfully cleaned and saved: ${outputFilePath}`)
      }
    })
  })
}
