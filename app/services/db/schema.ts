import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Section = {
    id: string;
    file: string;
    volumeTitle: string;
    chapterNumber: number;
    chapterTitle: string;
    sectionNumber: string;
    startLineNumber: number;
    content: string;
    vector: string;
    createdAt: Generated<string>;
    updatedAt: string;
};
export type DB = {
    sections: Section;
};
