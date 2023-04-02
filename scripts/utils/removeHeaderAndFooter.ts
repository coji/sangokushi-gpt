export function removeHeaderAndFooter(text: string): string {
  // 冒頭の注釈を除去
  const headerPattern =
    /-------------------------------------------------------\s+【テキスト中に現れる記号について】([\s\S]*?)-------------------------------------------------------/
  text = text.replace(headerPattern, '')

  // 末尾の注釈を除去
  const footerPattern = /底本：(.|\n)*?青空文庫作成ファイル：([\s\S]*?)$/
  text = text.replace(footerPattern, '')

  return text
}
