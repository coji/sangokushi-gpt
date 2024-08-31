export function removeHeaderAndFooter(text: string): string {
  let t = text
  // 冒頭の注釈を除去
  const headerPattern =
    /-------------------------------------------------------\s+【テキスト中に現れる記号について】([\s\S]*?)-------------------------------------------------------/
  t = t.replace(headerPattern, '')

  // 末尾の注釈を除去
  const footerPattern = /底本：(.|\n)*?青空文庫作成ファイル：([\s\S]*?)$/
  t = t.replace(footerPattern, '')

  return t
}
