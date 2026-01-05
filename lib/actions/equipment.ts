"use server";

import { prisma } from "@/lib/prisma";
import { ItemAcquisition } from "../generated/prisma/enums";
import { StartingKits } from "../data/startingKits";
import { HeavyWeapons, LightAndHeavyWeapons, LightWeapons } from "../data/weapons";
import { ItemTemplateGetPayload, StackableItemGetPayload } from "../generated/prisma/models";

export type Item = ItemTemplateGetPayload<{
  include: {
    modifierSource: {
      include: {
        modifiers: true;
      };
    };
    weapon: true;
    armor: true;
  };
}>;

export const getStartingWeapons = async (startingKit: string | null): Promise<Item[]> => {
  const kit = StartingKits.find((kit) => kit.name === startingKit);
  const ids: string[] = [];
  if (kit?.weapons.type === "heavy") {
    ids.push(...HeavyWeapons.map((w) => `starting_${w.name.toLowerCase()}`));
  } else if (kit?.weapons.type === "light") {
    ids.push(...LightWeapons.map((w) => `starting_${w.name.toLowerCase()}`));
  } else if (kit?.weapons.type === "non-special") {
    ids.push(...LightAndHeavyWeapons.map((w) => `starting_${w.name.toLowerCase()}`));
  }
  if (kit?.weapons.names) {
    ids.push(...kit?.weapons.names?.map((name) => `starting_${name.toLowerCase()}`));
  }

  const weapons = await prisma.itemTemplate.findMany({
    where: { acquisition: ItemAcquisition.startingKit, type: "weapon" },
    include: {
      modifierSource: {
        include: {
          modifiers: true,
        },
      },
      weapon: true,
      armor: true,
    },
  });

  const toReturn = weapons.filter((w) => ids.includes(w.id));
  return toReturn;
};

export const getWeapons = async (): Promise<Item[]> => {
  const weapons = await prisma.itemTemplate.findMany({
    where: { acquisition: ItemAcquisition.purchase, type: "weapon" },
    include: {
      modifierSource: {
        include: {
          modifiers: true,
        },
      },
      weapon: true,
      armor: true,
    },
  });

  return weapons;
};

export const getArmor = async (): Promise<Item[]> => {
  const weapons = await prisma.itemTemplate.findMany({
    where: { acquisition: ItemAcquisition.purchase, type: "armor" },
    include: {
      modifierSource: {
        include: {
          modifiers: true,
        },
      },
      weapon: true,
      armor: true,
    },
  });

  return weapons;
};
