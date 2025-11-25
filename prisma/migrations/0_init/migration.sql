-- CreateEnum
CREATE TYPE "TreeView" AS ENUM ('broad', 'tall');

-- CreateEnum
CREATE TYPE "Ancestry" AS ENUM ('Human', 'Singer');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('owner', 'shared', 'public');

-- CreateEnum
CREATE TYPE "Attribute" AS ENUM ('strength', 'speed', 'intellect', 'willpower', 'awareness', 'presence');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('athletics', 'heavyWeaponry', 'agility', 'lightWeaponry', 'stealth', 'thievery', 'crafting', 'deduction', 'lore', 'medicine', 'discipline', 'intimidation', 'insight', 'perception', 'survival', 'deception', 'leadership', 'persuasion', 'abrasion', 'adhesion', 'cohesion', 'division', 'gravitation', 'illumination', 'progression', 'tension', 'transformation', 'transportation');

-- CreateEnum
CREATE TYPE "ActionCost" AS ENUM ('ONE_ACTION', 'TWO_ACTIONS', 'THREE_ACTIONS', 'FREE_ACTION', 'ALWAYS_ACTIVE', 'SPECIAL_ACTION', 'REACTION');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('weapon', 'armor', 'consumable', 'tool', 'misc');

-- CreateEnum
CREATE TYPE "ItemAcquisition" AS ENUM ('purchase', 'talent', 'reward', 'startingKit');

-- CreateEnum
CREATE TYPE "Path" AS ENUM ('agent', 'envoy', 'hunter', 'leader', 'scholar', 'warrior', 'singer', 'dustbringer', 'edgedancer', 'elsecaller', 'lightweaver', 'skybreaker', 'stoneward', 'truthwatcher', 'willshaper', 'windrunner');

-- CreateEnum
CREATE TYPE "ExpertiseType" AS ENUM ('armor', 'cultural', 'utility', 'specialty', 'weapon');

-- CreateEnum
CREATE TYPE "ModifierTargetType" AS ENUM ('ATTRIBUTE', 'SKILL', 'EXPERTISE', 'ARMOR_DEFLECT', 'DAMAGE_DICE', 'DAMAGE_TYPE', 'FOCUS', 'INVESTITURE', 'PHYSICAL_DEFENSE', 'COGNITIVE_DEFENSE', 'SPIRITUAL_DEFENSE', 'HEALTH');

-- CreateEnum
CREATE TYPE "ModifierOperator" AS ENUM ('ADD', 'MULTIPLY', 'OVERRIDE', 'DIE_STEP', 'TIER_SCALING', 'LEVEL_SCALING');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('ITEM', 'TALENT');

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "diceTextColor" TEXT NOT NULL DEFAULT 'black',
    "diceColor" TEXT NOT NULL DEFAULT 'yellow',
    "treeView" "TreeView" NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "visibility" "Visibility" NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ancestry" "Ancestry",
    "userId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAttribute" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "attribute" "Attribute" NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" TEXT NOT NULL,
    "skill" "Skill" NOT NULL,
    "characterId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Talent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionCost" "ActionCost" NOT NULL,

    CONSTRAINT "Talent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentRequirement" (
    "id" SERIAL NOT NULL,
    "talentId" TEXT NOT NULL,
    "requiredId" TEXT NOT NULL,

    CONSTRAINT "TalentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequirement" (
    "id" SERIAL NOT NULL,
    "talentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "minRank" INTEGER NOT NULL,

    CONSTRAINT "SkillRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherRequirement" (
    "id" SERIAL NOT NULL,
    "talentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "OtherRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterTalent" (
    "id" TEXT NOT NULL,
    "isAncestryTalent" BOOLEAN NOT NULL DEFAULT false,
    "applyModifiers" BOOLEAN NOT NULL DEFAULT true,
    "talentId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterTalent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "acquisition" "ItemAcquisition" NOT NULL DEFAULT 'purchase',
    "weight" DOUBLE PRECISION NOT NULL,
    "acquireNote" TEXT,

    CONSTRAINT "ItemTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterItem" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "CharacterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterPath" (
    "id" TEXT NOT NULL,
    "path" "Path" NOT NULL,
    "characterId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "isHeroic" BOOLEAN NOT NULL,
    "isRadiant" BOOLEAN NOT NULL,
    "isSinger" BOOLEAN NOT NULL,
    "isStartingPath" BOOLEAN NOT NULL,

    CONSTRAINT "CharacterPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterExpertise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ExpertiseType" NOT NULL,
    "isOrigin" BOOLEAN NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterExpertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStory" (
    "id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "obstacle" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "relationships" TEXT NOT NULL,
    "loyalties" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "appearance" TEXT NOT NULL,
    "possibleRadiantOrder" TEXT NOT NULL,
    "other" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterGoal" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "storyId" TEXT NOT NULL,

    CONSTRAINT "CharacterGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modifier" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" "ModifierTargetType" NOT NULL,
    "targetKey" TEXT,
    "operator" "ModifierOperator" NOT NULL,
    "value" INTEGER,
    "diceValue" TEXT,
    "damageType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModifierSource" (
    "id" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "itemId" TEXT,
    "talentId" TEXT,

    CONSTRAINT "ModifierSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterAttribute_characterId_attribute_key" ON "CharacterAttribute"("characterId", "attribute");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSkill_characterId_skill_key" ON "CharacterSkill"("characterId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterTalent_characterId_talentId_key" ON "CharacterTalent"("characterId", "talentId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterStory_characterId_key" ON "CharacterStory"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "ModifierSource_itemId_key" ON "ModifierSource"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ModifierSource_talentId_key" ON "ModifierSource"("talentId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAttribute" ADD CONSTRAINT "CharacterAttribute_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentRequirement" ADD CONSTRAINT "TalentRequirement_requiredId_fkey" FOREIGN KEY ("requiredId") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentRequirement" ADD CONSTRAINT "TalentRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherRequirement" ADD CONSTRAINT "OtherRequirement_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterTalent" ADD CONSTRAINT "CharacterTalent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterTalent" ADD CONSTRAINT "CharacterTalent_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterItem" ADD CONSTRAINT "CharacterItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterItem" ADD CONSTRAINT "CharacterItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterPath" ADD CONSTRAINT "CharacterPath_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterExpertise" ADD CONSTRAINT "CharacterExpertise_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStory" ADD CONSTRAINT "CharacterStory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterGoal" ADD CONSTRAINT "CharacterGoal_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "CharacterStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modifier" ADD CONSTRAINT "Modifier_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ModifierSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierSource" ADD CONSTRAINT "ModifierSource_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModifierSource" ADD CONSTRAINT "ModifierSource_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

