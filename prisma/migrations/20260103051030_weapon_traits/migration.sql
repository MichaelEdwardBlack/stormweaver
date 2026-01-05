-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "expertTraits" TEXT[],
ADD COLUMN     "reach" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "traits" TEXT[];
