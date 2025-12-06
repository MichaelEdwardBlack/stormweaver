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

  console.log("updating ancestry", ancestry);
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
