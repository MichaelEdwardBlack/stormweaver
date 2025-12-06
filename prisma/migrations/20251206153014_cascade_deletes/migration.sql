-- DropForeignKey
ALTER TABLE "CharacterAttribute" DROP CONSTRAINT "CharacterAttribute_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterExpertise" DROP CONSTRAINT "CharacterExpertise_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterGoal" DROP CONSTRAINT "CharacterGoal_storyId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterItem" DROP CONSTRAINT "CharacterItem_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterPath" DROP CONSTRAINT "CharacterPath_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterSkill" DROP CONSTRAINT "CharacterSkill_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterStory" DROP CONSTRAINT "CharacterStory_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterTalent" DROP CONSTRAINT "CharacterTalent_characterId_fkey";

-- DropForeignKey
ALTER TABLE "OtherRequirement" DROP CONSTRAINT "OtherRequirement_talentId_fkey";

-- DropForeignKey
ALTER TABLE "SkillRequirement" DROP CONSTRAINT "SkillRequirement_talentId_fkey";

-- DropForeignKey
ALTER TABLE "TalentRequirement" DROP CONSTRAINT "TalentRequirement_talentId_fkey";

-- AddForeignKey
ALTER TABLE "CharacterAttribute" ADD CONSTRAINT "CharacterAttribute_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentRequirement" ADD CONSTRAINT "TalentRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherRequirement" ADD CONSTRAINT "OtherRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterTalent" ADD CONSTRAINT "CharacterTalent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterItem" ADD CONSTRAINT "CharacterItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterPath" ADD CONSTRAINT "CharacterPath_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterExpertise" ADD CONSTRAINT "CharacterExpertise_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStory" ADD CONSTRAINT "CharacterStory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterGoal" ADD CONSTRAINT "CharacterGoal_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "CharacterStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
