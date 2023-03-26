type ParsedSection = {
  volumeTitle: string
  chapterNumber: number
  chapterTitle: string
  sectionNumber: string
  startLineNumber: number
  content: string
}

enum ParserState {
  VolumeTitle,
  ChapterTitle,
  SectionNumber,
  Content,
}

export function parseText(text: string): ParsedSection[] {
  const lines = text.split('\n')
  const result: ParsedSection[] = []

  let volumeTitle = ''
  let chapterNumber = 0
  let chapterTitle = ''
  let sectionNumber = ''
  let startLineNumber = 0
  let state = ParserState.VolumeTitle

  const isKanjiNum = (str: string): boolean => {
    return /[一二三四五六七八九]/.test(str)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    switch (state) {
      case ParserState.VolumeTitle:
        if (line !== '三国志' && line !== '吉川英治' && line !== '') {
          volumeTitle = line
        }
        if (line === '' && volumeTitle !== '') {
          state = ParserState.ChapterTitle
        }
        break

      case ParserState.ChapterTitle:
        if (line !== '') {
          chapterNumber++
          chapterTitle = line
          state = ParserState.SectionNumber
        }
        break

      case ParserState.SectionNumber:
        if (line !== '' && isKanjiNum(line)) {
          sectionNumber = line.match(/[一二三四五六七八九]/)![0]
          startLineNumber = i + 1
          state = ParserState.Content
        }
        /*else if (line === '') {
          state = ParserState.ChapterTitle
        }*/
        break

      case ParserState.Content:
        if (line === '' && (lines[i + 1] === '' || isKanjiNum(lines[i + 1]))) {
          const contentLines = []

          for (let j = startLineNumber; j < i; j++) {
            contentLines.push(lines[j])
          }

          result.push({
            volumeTitle,
            chapterNumber,
            chapterTitle,
            sectionNumber,
            startLineNumber,
            content: contentLines.join('\n'),
          })

          if (
            line === '' &&
            (lines[i + 1] === '' || isKanjiNum(lines[i + 1]))
          ) {
            state = isKanjiNum(lines[i + 1])
              ? ParserState.ChapterTitle
              : ParserState.SectionNumber
          }
        }
        break
    }
  }

  return result
}
