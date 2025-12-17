"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ancestry, Attribute, ExpertiseType, Path, Skill } from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { CharacterGetPayload } from "../generated/prisma/models";

export async function deleteCharacter(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.character.delete({
    where: { id, userId: session.user.id },
  });

  redirect("/characters");
}

export async function updateAncestry(characterId: string, ancestry: Ancestry) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const character = await prisma.character.update({
    where: { id: characterId, userId: session.user.id },
    data: {
      ancestry,
    },
  });
  if (!character?.ancestry) throw new Error("Update failed");
  revalidatePath(`/characters/${characterId}/edit/origin/ancestry`);
}

export async function toggleOriginCulture(characterId: string, culture: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const culturalExperises = await prisma.characterExpertise.findMany({
    where: { characterId, type: ExpertiseType.cultural, isOrigin: true },
  });

  const selectedCultureNames = culturalExperises.map((culture) => culture.name);
  if (selectedCultureNames.includes(culture)) {
    const response = await prisma.characterExpertise.deleteMany({
      where: { characterId, type: ExpertiseType.cultural, isOrigin: true, name: culture },
    });
    revalidatePath(`/characters/${characterId}/edit/origin/culture`);
    return {
      type: "DELETE",
      success: true,
      count: response.count,
    };
  } else {
    if (culturalExperises.length >= 2) {
      throw new Error("You've already selected the maximum amount of origin cultures");
    }
    await prisma.characterExpertise.create({
      data: {
        characterId,
        type: ExpertiseType.cultural,
        isOrigin: true,
        name: culture,
      },
    });
    revalidatePath(`/characters/${characterId}/edit/origin/culture`);
  }
}

export async function updateName(characterId: string, name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.character.update({
    where: { id: characterId, userId: session.user.id },
    data: {
      name,
    },
  });
  revalidatePath(`/characters/${characterId}/edit/origin/name`);
}

export type FullCharacter = CharacterGetPayload<{
  include: {
    expertises: true;
    attributes: true;
    skills: true;
    talents: true;
    paths: true;
    story: true;
  };
}>;
export async function getFullCharacter(characterId: string): Promise<FullCharacter> {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const character = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    include: {
      expertises: true,
      attributes: true,
      skills: true,
      talents: true,
      paths: true,
      story: true,
    },
  });
  if (!character) throw new Error("Character not found!");
  return character;
}

export async function addCharacterPath(characterId: string, path: Path, isStartingPath = false) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const isHeroic =
    path === "agent" ||
    path === "envoy" ||
    path === "hunter" ||
    path === "leader" ||
    path === "scholar" ||
    path === "warrior";
  const isRadiant =
    path === "dustbringer" ||
    path === "edgedancer" ||
    path === "elsecaller" ||
    path === "lightweaver" ||
    path === "skybreaker" ||
    path === "stoneward" ||
    path === "truthwatcher" ||
    path === "willshaper" ||
    path === "windrunner";

  const result = await prisma.characterPath.create({
    data: {
      path,
      characterId,
      level: 1,
      isHeroic,
      isRadiant,
      isSinger: path === "singer",
      isStartingPath,
    },
  });

  revalidatePath(`/characters/${characterId}/edit`, "layout");
  return result;
}

export async function unlockCharacterTalent(characterId: string, talentId: string, isAncestryTalent = false) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterTalent.create({
    data: {
      isAncestryTalent,
      talentId,
      characterId,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function changeStartingPath(characterId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterAttribute.updateMany({
    where: { characterId },
    data: {
      value: 0,
    },
  });
  console.log("updated attributes");
  await prisma.characterExpertise.deleteMany({
    where: { characterId, isOrigin: false },
  });
  console.log("updated expertises");
  await prisma.characterSkill.updateMany({
    where: { characterId },
    data: { rank: 0 },
  });
  console.log("updated skills");
  await prisma.characterTalent.deleteMany({
    where: { characterId },
  });
  console.log("updated talents");
  await prisma.characterPath.deleteMany({
    where: { characterId },
  });
  console.log("updated path");
  revalidatePath(`/characters/${characterId}/edit/path/starting`);
  return {
    success: true,
    status: 200,
  };
}

export async function updateAttribute(characterId: string, attribute: Attribute, value: number) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterAttribute.upsert({
    where: { characterId_attribute: { characterId, attribute } },
    update: {
      value: value,
    },
    create: {
      characterId,
      attribute,
      value,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function updateSkill(characterId: string, skill: { skill: Skill; attribute: Attribute }, value: number) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterSkill.upsert({
    where: { characterId_skill: { characterId, skill: skill.skill } },
    update: {
      rank: value,
    },
    create: {
      characterId,
      skill: skill.skill,
      attribute: skill.attribute,
      rank: value,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}
