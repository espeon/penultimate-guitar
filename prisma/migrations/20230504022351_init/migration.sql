-- CreateTable
CREATE TABLE "Tab" (
    "id" STRING NOT NULL,
    "songId" INT4 NOT NULL,
    "tab" STRING NOT NULL,
    "taburl" STRING NOT NULL,
    "contributors" STRING[],
    "capo" INT4 NOT NULL,
    "tuning" STRING NOT NULL,
    "rating" FLOAT8 NOT NULL,
    "version" INT4 NOT NULL,
    "type" STRING NOT NULL,

    CONSTRAINT "Tab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" INT4 NOT NULL,
    "name" STRING NOT NULL,
    "artist" STRING NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tab_taburl_key" ON "Tab"("taburl");

-- AddForeignKey
ALTER TABLE "Tab" ADD CONSTRAINT "Tab_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
