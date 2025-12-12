/*
  Warnings:

  - You are about to drop the `OtherRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TalentRequirement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OtherRequirement" DROP CONSTRAINT "OtherRequirement_talentId_fkey";

-- DropForeignKey
ALTER TABLE "SkillRequirement" DROP CONSTRAINT "SkillRequirement_talentId_fkey";

-- DropForeignKey
ALTER TABLE "TalentRequirement" DROP CONSTRAINT "TalentRequirement_requiredId_fkey";

-- DropForeignKey
ALTER TABLE "TalentRequirement" DROP CONSTRAINT "TalentRequirement_talentId_fkey";

-- AlterTable
ALTER TABLE "Talent" ADD COLUMN     "requiredLevel" INTEGER,
ADD COLUMN     "requiredOther" TEXT[],
ADD COLUMN     "requiredSkillId" TEXT,
ADD COLUMN     "requiredSkillRank" INTEGER,
ADD COLUMN     "requiredTalents" TEXT[];

-- DropTable
DROP TABLE "OtherRequirement";

-- DropTable
DROP TABLE "SkillRequirement";

-- DropTable
DROP TABLE "TalentRequirement";
