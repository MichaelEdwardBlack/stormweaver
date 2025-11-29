"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ancestry, ExpertiseType } from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import {
  GiAnvilImpact,
  GiCharacter,
  GiChestArmor,
  GiHorizonRoad,
  GiLightBackpack,
  GiProgression,
  GiScrollQuill,
  GiSmart,
} from "react-icons/gi";
import { LuBadgePlus, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { PiIdentificationCard, PiTreeStructure } from "react-icons/pi";
import { LuChevronDown } from "react-icons/lu";
import { IoIosStats } from "react-icons/io";
import { GiSkills } from "react-icons/gi";
import { LuBadge, LuLayers, LuUsers, LuSword } from "react-icons/lu";
import { FaLevelUpAlt } from "react-icons/fa";

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
  return character.ancestry;
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
    const response = await prisma.characterExpertise.create({
      data: {
        characterId,
        type: ExpertiseType.cultural,
        isOrigin: true,
        name: culture,
      },
    });
    revalidatePath(`/characters/${characterId}/edit/origin/culture`);
    return {
      type: "CREATE",
      success: true,
      expertise: response,
    };
  }
}

export async function updateName(characterId: string, name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const response = await prisma.character.update({
    where: { id: characterId, userId: session.user.id },
    data: {
      name,
    },
  });
  revalidatePath(`/characters/${characterId}/edit/origin/name`);
  return response;
}

export async function getSidebarSections(characterId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  const character = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    include: {
      expertises: true,
      attributes: true,
      skills: true,
      talents: true,
      paths: true,
    },
  });
  if (!character) throw new Error("Character not found!");
  const sections = [
    {
      name: "Origin",
      path: "origin",
      icon: GiCharacter,
      children: [
        { name: "Ancestry", path: "ancestry", icon: LuUsers, showComplete: !!character.ancestry },
        {
          name: "Culture",
          path: "culture",
          icon: LuLayers,
          showComplete: character.expertises.filter((e) => e.isOrigin).length >= 2,
        },
        {
          name: "Name",
          path: "name",
          icon: PiIdentificationCard,
          showWarning: character.name.length < 2,
          showComplete: character.name.length >= 2,
        },
      ],
    },
    {
      name: "Path & Talents",
      path: "path",
      icon: GiHorizonRoad,
      children: [
        {
          name: "Starting Path",
          path: "starting",
          icon: PiTreeStructure,
          showComplete: character.paths.findIndex((path) => path.isStartingPath) !== -1,
        },
        {
          name: "Attributes",
          path: "attributes",
          icon: IoIosStats,
          showComplete:
            character.attributes.reduce((totalPointsSpent, attribute) => totalPointsSpent + attribute.value, 0) >= 12,
        },
        {
          name: "Skills",
          path: "skills",
          icon: GiSkills,
          showComplete: character.skills.reduce((totalPointsSpent, skill) => totalPointsSpent + skill.rank, 0) >= 5,
        },
        {
          name: "Expertise - from Intelligence",
          path: "expertise",
          icon: GiSmart,
          showComplete:
            character.expertises.filter((e) => !e.isOrigin).length >=
            (character.attributes.find((attribute) => attribute.attribute === "intellect")?.value ?? 0),
        },
        {
          name: "Bonus Ancestry Talent",
          path: "bonus",
          icon: LuBadgePlus,
          showComplete: character.talents.filter((talent) => talent.isAncestryTalent).length >= 1,
        },
      ],
    },
    {
      name: "Equipment",
      path: "equipment",
      icon: GiAnvilImpact,
      children: [
        { name: "Starting Kit", path: "kit", icon: GiLightBackpack },
        { name: "Weapons", path: "weapons", icon: LuSword },
        { name: "Armor", path: "armor", icon: GiChestArmor },
      ],
    },
    {
      name: "Story",
      path: "story",
      icon: GiScrollQuill,
      children: [
        { name: "Background", path: "background", icon: LuLayers },
        { name: "Goals", path: "goals", icon: LuBadge },
      ],
    },
    {
      name: "Advancement",
      path: "advancement",
      icon: GiProgression,
      children: [
        { name: "Level", path: "level", icon: FaLevelUpAlt },
        { name: "Attributes", path: "attributes", icon: IoIosStats },
        { name: "Skills", path: "skills", icon: GiSkills },
        { name: "Expertise - from Intelligence", path: "expertise", icon: GiSmart },
        { name: "Bonus Ancestry Talent", path: "bonus", icon: LuBadgePlus },
      ],
    },
  ];
}
