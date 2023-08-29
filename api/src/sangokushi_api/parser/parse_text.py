from pydantic import BaseModel
from typing import List
from enum import Enum
import re


class ParsedSection(BaseModel):
    volume_title: str
    chapter_number: int
    chapter_title: str
    section_number: str
    content: str


class ParserState(Enum):
    VolumeTitle = "VolumeTitle"
    ChapterTitle = "ChapterTitle"
    SectionNumber = "SectionNumber"
    Content = "Content"


def is_kanji_num(str: str) -> bool:
    return bool(re.search(r"[一二三四五六七八九]", str))


def handle_volume_title(
    line: str, volume_title: str, state: ParserState
) -> (str, ParserState):
    if line not in ["三国志", "吉川英治", ""]:
        volume_title = line
    if line == "" and volume_title != "":
        state = ParserState.ChapterTitle
    return volume_title, state


def handle_chapter_title(
    line: str, chapter_number: int, state: ParserState
) -> (int, ParserState):
    if line != "":
        chapter_number += 1
        state = ParserState.SectionNumber
    return chapter_number, state


def handle_section_number(
    line: str, state: ParserState, section_number: str
) -> (str, ParserState):
    if line != "" and is_kanji_num(line):
        section_number = re.search(r"[一二三四五六七八九]", line).group(0)
        state = ParserState.Content
    return section_number, state


def handle_content(
    lines: List[str],
    i: int,
    start_line_number: int,
    state: ParserState,
    parsed_sections: List[ParsedSection],
    volume_title: str,
    chapter_number: int,
    chapter_title: str,
    section_number: str,
) -> ParserState:
    if (
        i < len(lines) - 1
        and lines[i].strip() == ""
        and (lines[i + 1] != "" and lines[i + 1][0] != "　")
        and lines[i + 2] == ""
    ) or i + 1 == len(lines):
        content_lines = lines[start_line_number:i]
        if "\n".join(content_lines).strip() != "":
            parsed_sections.append(
                ParsedSection(
                    volume_title=volume_title,
                    chapter_number=chapter_number,
                    chapter_title=chapter_title,
                    section_number=section_number,
                    content="\n".join(content_lines).strip(),
                )
            )
        if (
            i < len(lines) - 1
            and lines[i].strip() == ""
            and not is_kanji_num(lines[i + 1])
            and lines[i + 2] == ""
        ):
            state = ParserState.ChapterTitle
        if (
            i < len(lines) - 1
            and lines[i].strip() == ""
            and is_kanji_num(lines[i + 1])
            and lines[i + 2] == ""
        ):
            state = ParserState.SectionNumber
    return state


def parse_text(text: str) -> List[ParsedSection]:
    lines = text.split("\n")
    parsed_sections = []
    volume_title = ""
    chapter_number = 0
    chapter_title = ""
    section_number = ""
    state = ParserState.VolumeTitle
    start_line_number = 0

    for i in range(len(lines)):
        line = lines[i].strip()

        if state == ParserState.VolumeTitle:
            volume_title, state = handle_volume_title(line, volume_title, state)
        elif state == ParserState.ChapterTitle:
            chapter_number, state = handle_chapter_title(line, chapter_number, state)
            chapter_title = line
        elif state == ParserState.SectionNumber:
            section_number, state = handle_section_number(line, state, section_number)
            start_line_number = i + 1
        elif state == ParserState.Content:
            state = handle_content(
                lines,
                i,
                start_line_number,
                state,
                parsed_sections,
                volume_title,
                chapter_number,
                chapter_title,
                section_number,
            )

    return parsed_sections
