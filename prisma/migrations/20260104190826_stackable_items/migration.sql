/*
  Warnings:

  - You are about to drop the `CharacterItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EquipSlot" AS ENUM ('MAIN_HAND', 'OFF_HAND', 'TWO_HAND', 'ARMOR');

-- DropForeignKey
ALTER TABLE "CharacterItem" DROP CONSTRAINT "CharacterItem_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterItem" DROP CONSTRAINT "CharacterItem_itemId_fkey";

-- DropTable
DROP TABLE "CharacterItem";

-- CreateTable
CREATE TABLE "Armor" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "traits" TEXT[],
    "expertTraits" TEXT[],

    CONSTRAINT "Armor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemInstance" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "slot" "EquipSlot",

    CONSTRAINT "ItemInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StackableItem" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "StackableItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Armor_itemId_key" ON "Armor"("itemId");

-- CreateIndex
CREATE INDEX "ItemInstance_characterId_idx" ON "ItemInstance"("characterId");

-- CreateIndex
CREATE INDEX "ItemInstance_itemId_idx" ON "ItemInstance"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StackableItem_characterId_itemId_key" ON "StackableItem"("characterId", "itemId");

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemInstance" ADD CONSTRAINT "ItemInstance_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemInstance" ADD CONSTRAINT "ItemInstance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackableItem" ADD CONSTRAINT "StackableItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackableItem" ADD CONSTRAINT "StackableItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
