import re


def remove_header_and_footer(text: str) -> str:
    # 冒頭の注釈を除去
    header_pattern = re.compile(
        r"-------------------------------------------------------\s+"
        r"【テキスト中に現れる記号について】([\s\S]*?)"
        r"-------------------------------------------------------"
    )
    text = re.sub(header_pattern, "", text)

    # 末尾の注釈を除去
    footer_pattern = re.compile(r"底本：「三国志(.|\n)*?青空文庫作成ファイル：([\s\S]*?)$")
    text = re.sub(footer_pattern, "", text)

    return text


def remove_ruby_and_symbols(text: str) -> str:
    # ルビを除去
    ruby_pattern = re.compile(r"《[^》]*》")
    text = re.sub(ruby_pattern, "", text)

    # ルビの付く文字列の始まりを示す記号（｜）を除去
    vertical_bar_pattern = re.compile(r"｜")
    text = re.sub(vertical_bar_pattern, "", text)

    # 入力者注を除去
    input_note_pattern = re.compile(r"［＃[^］]*］")
    text = re.sub(input_note_pattern, "", text)

    return text
