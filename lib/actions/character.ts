"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ancestry, Attribute, ExpertiseType, Path, Skill } from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { CharacterGetPayload } from "../generated/prisma/models";
import { StartingKits } from "../data/startingKits";

export async function createCharacter() {
  const session = await auth();
  if (!session) throw redirect("/auth/login");

  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      name: "",
      level: 1,
    },
  });

  return character;
}

export async function initCharacterAttributes(characterId: string) {
  const session = await auth();
  if (!session) throw redirect("/auth/login");

  await prisma.characterAttribute.createMany({
    data: [
      {
        characterId: characterId,
        attribute: Attribute.strength,
        value: 0,
      },
      {
        characterId: characterId,
        attribute: Attribute.speed,
        value: 0,
      },
      {
        characterId: characterId,
        attribute: Attribute.intellect,
        value: 0,
      },
      {
        characterId: characterId,
        attribute: Attribute.willpower,
        value: 0,
      },
      {
        characterId: characterId,
        attribute: Attribute.awareness,
        value: 0,
      },
      {
        characterId: characterId,
        attribute: Attribute.presence,
        value: 0,
      },
    ],
  });
}

export async function initCharacterSkills(characterId: string) {
  await prisma.characterSkill.createMany({
    data: [
      {
        characterId: characterId,
        skill: Skill.athletics,
        rank: 0,
        attribute: Attribute.strength,
      },
      {
        characterId: characterId,
        skill: Skill.heavyWeaponry,
        rank: 0,
        attribute: Attribute.strength,
      },
      {
        characterId: characterId,
        skill: Skill.agility,
        rank: 0,
        attribute: Attribute.speed,
      },
      {
        characterId: characterId,
        skill: Skill.lightWeaponry,
        rank: 0,
        attribute: Attribute.speed,
      },
      {
        characterId: characterId,
        skill: Skill.stealth,
        rank: 0,
        attribute: Attribute.speed,
      },
      {
        characterId: characterId,
        skill: Skill.thievery,
        rank: 0,
        attribute: Attribute.speed,
      },
      {
        characterId: characterId,
        skill: Skill.crafting,
        rank: 0,
        attribute: Attribute.intellect,
      },
      {
        characterId: characterId,
        skill: Skill.deduction,
        rank: 0,
        attribute: Attribute.intellect,
      },
      {
        characterId: characterId,
        skill: Skill.lore,
        rank: 0,
        attribute: Attribute.intellect,
      },
      {
        characterId: characterId,
        skill: Skill.medicine,
        rank: 0,
        attribute: Attribute.intellect,
      },
      {
        characterId: characterId,
        skill: Skill.discipline,
        rank: 0,
        attribute: Attribute.willpower,
      },
      {
        characterId: characterId,
        skill: Skill.intimidation,
        rank: 0,
        attribute: Attribute.willpower,
      },
      {
        characterId: characterId,
        skill: Skill.insight,
        rank: 0,
        attribute: Attribute.awareness,
      },
      {
        characterId: characterId,
        skill: Skill.perception,
        rank: 0,
        attribute: Attribute.awareness,
      },
      {
        characterId: characterId,
        skill: Skill.survival,
        rank: 0,
        attribute: Attribute.awareness,
      },
      {
        characterId: characterId,
        skill: Skill.leadership,
        rank: 0,
        attribute: Attribute.presence,
      },
      {
        characterId: characterId,
        skill: Skill.persuasion,
        rank: 0,
        attribute: Attribute.presence,
      },
    ],
  });
}

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
    await prisma.characterExpertise.deleteMany({
      where: { characterId, type: ExpertiseType.cultural, isOrigin: true, name: culture },
    });
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
  }
  revalidatePath(`/characters/${characterId}/edit/origin/culture`);
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
    talents: {
      include: {
        talent: true;
      };
    };
    itemInstances: {
      include: {
        item: {
          include: {
            modifierSource: {
              include: {
                modifiers: true;
              };
            };
            weapon: true;
            armor: true;
          };
        };
      };
    };
    stackableItems: {
      include: {
        item: {
          include: {
            modifierSource: {
              include: {
                modifiers: true;
              };
            };
            weapon: true;
            armor: true;
          };
        };
      };
    };
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
      talents: {
        include: {
          talent: true,
        },
      },
      itemInstances: {
        include: {
          item: {
            include: {
              modifierSource: {
                include: {
                  modifiers: true,
                },
              },
              weapon: true,
              armor: true,
            },
          },
        },
      },
      stackableItems: {
        include: {
          item: {
            include: {
              modifierSource: {
                include: {
                  modifiers: true,
                },
              },
              weapon: true,
              armor: true,
            },
          },
        },
      },
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

export async function removeCharacterPath(characterId: string, path: Path, isStartingPath = false) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterPath.deleteMany({
    where: {
      characterId,
      path,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
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

export async function refundCharacterTalent(characterId: string, talentId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterTalent.delete({
    where: {
      characterId_talentId: {
        characterId,
        talentId,
      },
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

export async function addExpertise(characterId: string, expertise: { name: string; type: ExpertiseType }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterExpertise.create({
    data: {
      name: expertise.name,
      type: expertise.type,
      isOrigin: false,
      characterId,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function removeExpertise(characterId: string, name: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.characterExpertise.deleteMany({
    where: {
      name,
      characterId,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function updateCharacterKit(characterId: string, startingKit: string | null) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await clearStartingEquipment(characterId);
  await updateCharacterMarks(characterId, 0);

  await prisma.character.update({
    where: { id: characterId },
    data: {
      startingKit: startingKit,
    },
  });
  const fullKit = StartingKits.find((kit) => kit.name === startingKit);
  if (fullKit) {
    fullKit.armor.forEach((a) => addCharacterItem(characterId, `starting_${a.toLowerCase()}`));
  }

  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function updateCharacterMarks(characterId: string, marks: number) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  await prisma.character.update({
    where: { id: characterId },
    data: {
      marks,
    },
  });

  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function clearPurchasedEquipment(characterId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.itemInstance.deleteMany({
    where: {
      characterId,
      AND: {
        item: {
          acquisition: "purchase",
        },
      },
    },
  });
  await prisma.stackableItem.deleteMany({
    where: {
      characterId,
      AND: {
        item: {
          acquisition: "purchase",
        },
      },
    },
  });

  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function clearStartingEquipment(characterId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.itemInstance.deleteMany({
    where: {
      characterId,
      AND: {
        item: {
          acquisition: "startingKit",
        },
      },
    },
  });
  await prisma.stackableItem.deleteMany({
    where: {
      characterId,
      AND: {
        item: {
          acquisition: "startingKit",
        },
      },
    },
  });

  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function clearEquipment(characterId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.itemInstance.deleteMany({
    where: {
      characterId,
    },
  });
  await prisma.stackableItem.deleteMany({
    where: {
      characterId,
    },
  });

  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function addCharacterItem(characterId: string, itemId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.itemInstance.create({
    data: {
      characterId,
      itemId,
    },
  });
  await prisma.stackableItem.upsert({
    where: {
      characterId_itemId: {
        characterId,
        itemId,
      },
    },
    update: {
      quantity: { increment: 1 },
    },
    create: {
      characterId,
      itemId,
      quantity: 1,
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}

export async function removeCharacterItem(characterId: string, itemId: string) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.$transaction(async (tx) => {
    const instance = await tx.itemInstance.findFirst({
      where: {
        characterId,
        itemId,
      },
      // TODO: if this app gets popular we may want a more deterministic way to delete based on time created
    });

    if (!instance) return;

    await tx.itemInstance.delete({
      where: { id: instance.id },
    });
  });

  await prisma.stackableItem.update({
    where: {
      characterId_itemId: {
        characterId,
        itemId,
      },
    },
    data: {
      quantity: { decrement: 1 },
    },
  });
  revalidatePath(`/characters/${characterId}/edit`, "layout");
}
