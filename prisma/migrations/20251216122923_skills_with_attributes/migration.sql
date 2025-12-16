/*
  Warnings:

  - Added the required column `attribute` to the `CharacterSkill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterSkill" ADD COLUMN     "attribute" "Attribute" NOT NULL;
