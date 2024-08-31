export function removeRubyAndSymbols(text: string): string {
  let t = text
  // ルビを除去
  const rubyPattern = /《[^》]*》/g
  t = t.replace(rubyPattern, '')

  // ルビの付く文字列の始まりを示す記号（｜）を除去
  const verticalBarPattern = /｜/g
  t = t.replace(verticalBarPattern, '')

  // 入力者注を除去
  const inputNotePattern = /［＃[^］]*］/g
  t = t.replace(inputNotePattern, '')

  return t
}
