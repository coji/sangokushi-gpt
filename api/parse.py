import asyncio
import glob

from src.sangokushi_api.parser.parse_text import ParsedSection, parse_text
from src.sangokushi_api.parser.remover import (
    remove_header_and_footer,
    remove_ruby_and_symbols,
)
from src.sangokushi_api.services.prisma import prisma


# データベースにデータを挿入（仮）
async def insert_into_database(sections: list[ParsedSection]):
    await prisma.connect()
    await prisma.section.delete_many()

    for i, section in enumerate(sections):
        await prisma.section.create(
            data={
                "id": i + 1,
                "volume_title": section.volume_title,
                "chapter_number": section.chapter_number,
                "chapter_title": section.chapter_title,
                "section_number": section.section_number,
                "content": section.content,
            },
        )
    await prisma.disconnect()


# ファイルからデータをフィルタリング（仮）
def parse_data(file_data):
    filtered_text = remove_ruby_and_symbols(
        remove_header_and_footer(file_data)
    )
    return parse_text(filtered_text)


async def main():
    # ファイル一覧を取得
    files = sorted(glob.glob("data/sangokushi/*.txt"))

    sections = []
    for file_path in files:
        # ファイルを読み込む
        with open(file_path, "r", encoding="shift_jis") as f:
            file_data = f.read()

        # データをフィルタリングしてセクションのリストに追加
        structured_data = parse_data(file_data)
        sections.extend(structured_data)

    # フィルタリングされたデータをデータベースに挿入
    await insert_into_database(sections)


if __name__ == "__main__":
    asyncio.run(main())
