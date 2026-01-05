-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "isRanged" BOOLEAN NOT NULL DEFAULT false,
    "shortRange" INTEGER,
    "longRange" INTEGER,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_itemId_key" ON "Weapon"("itemId");

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
