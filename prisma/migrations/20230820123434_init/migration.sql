-- CreateTable
CREATE TABLE "section" (
    "id" TEXT NOT NULL,
    "volume_title" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "chapter_title" TEXT NOT NULL,
    "section_number" TEXT NOT NULL,
    "start_line_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);
