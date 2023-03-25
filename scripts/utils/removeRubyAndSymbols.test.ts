import { expect, test } from 'vitest'
import { removeRubyAndSymbols } from './removeRubyAndSymbols'

test('removeRubyAndSymbols', () => {
  // 例のテキストを使ってテスト
  const exampleText =
    '治乱興亡《ちらんこうぼう》の｜悲歌慷慨《こうがい》を［＃地から２字上げ］著者と綴る。'

  expect(removeRubyAndSymbols(exampleText)).toStrictEqual(
    '治乱興亡の悲歌慷慨を著者と綴る。',
  )
})
