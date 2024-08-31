-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file" TEXT NOT NULL,
    "volume_title" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "chapter_title" TEXT NOT NULL,
    "section_number" TEXT NOT NULL,
    "start_line_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vector" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
