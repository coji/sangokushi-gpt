export function removeRubyAndSymbols(text: string): string {
  // ルビを除去
  const rubyPattern = /《[^》]*》/g
  text = text.replace(rubyPattern, '')

  // ルビの付く文字列の始まりを示す記号（｜）を除去
  const verticalBarPattern = /｜/g
  text = text.replace(verticalBarPattern, '')

  // 入力者注を除去
  const inputNotePattern = /［＃[^］]*］/g
  text = text.replace(inputNotePattern, '')

  return text
}
