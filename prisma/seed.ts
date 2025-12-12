import {
  ModifierOperator,
  ModifierTargetType,
  SourceType,
  ActionCost,
  ItemType,
  ItemAcquisition,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ActionType, TalentNode, TalentTrees } from "./../lib/data/tree";
import { LightAndHeavyWeapons, SpecialtyWeapons } from "@/lib/data/weapons";
import { Armor } from "@/lib/data/armor";

const ActionMapper: Record<ActionType, ActionCost> = {
  "1 Action": ActionCost.ONE_ACTION,
  "2 Actions": ActionCost.TWO_ACTIONS,
  "3 Actions": ActionCost.THREE_ACTIONS,
  "Free Action": ActionCost.FREE_ACTION,
  Reaction: ActionCost.REACTION,
  "Special Activation": ActionCost.SPECIAL_ACTION,
  "Always Active": ActionCost.ALWAYS_ACTIVE,
};
const allTalents = Object.values(TalentTrees).reduce((nodes: TalentNode[], tree) => [...nodes, ...tree.nodes], []);
const allWeapons = LightAndHeavyWeapons.concat(SpecialtyWeapons);

async function main() {
  console.log("🌱 Seeding database...");
  allTalents.forEach(async (node) => {
    if (!node.isSubclass && !!node.actionCost) {
      const { id, name, description } = node;
      const actionCost: ActionCost = ActionMapper[node.actionCost];
      await prisma.talent.upsert({
        where: { id },
        update: {},
        create: {
          id,
          name,
          description: description ?? "",
          actionCost,
          requiredTalents: node.requirements?.talents ?? [],
          requiredOther: node.requirements?.other ?? [],
          requiredLevel: node.requirements?.level,
          requiredSkillId: node.requirements?.skill?.id,
          requiredSkillRank: node.requirements?.skill?.min,
        },
      });
    }
  });
  console.log("Talents created");

  // -------------------------------------------------------
  // ITEM TEMPLATES — Definitions with modifiers
  // -------------------------------------------------------

  allWeapons.forEach(async (weapon) => {
    const id = weapon.name.toLowerCase().replaceAll(" ", "_");
    const { name, weight, price } = weapon;
    const acquisition =
      price === Number.POSITIVE_INFINITY
        ? name === "Shardblade (Radiant)"
          ? ItemAcquisition.talent
          : ItemAcquisition.reward
        : ItemAcquisition.purchase;

    await prisma.itemTemplate.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
        type: ItemType.weapon,
        // description: "",
        price: acquisition === ItemAcquisition.purchase ? price : null,
        acquisition,
        weight,
        modifierSource: {
          create: {
            type: SourceType.ITEM,
            modifiers: {
              create: [
                {
                  targetType: ModifierTargetType.DAMAGE_DICE,
                  operator: ModifierOperator.OVERRIDE,
                  diceValue: weapon.damage.value,
                },
                {
                  targetType: ModifierTargetType.DAMAGE_TYPE,
                  operator: ModifierOperator.OVERRIDE,
                  damageType: weapon.damage.type,
                },
              ],
            },
          },
        },
      },
    });
  });
  console.log("Weapon templates created");

  Armor.forEach(async (armor) => {
    const id = armor.name.toLowerCase().replaceAll(" ", "_");
    const { name, weight, price } = armor;
    const acquisition =
      price === "Reward only"
        ? ItemAcquisition.reward
        : price === "Talent only"
        ? ItemAcquisition.talent
        : ItemAcquisition.purchase;

    await prisma.itemTemplate.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
        type: ItemType.armor,
        // description: "",
        price: typeof price === "string" ? null : price,
        acquisition,
        weight,
        modifierSource: {
          create: {
            type: SourceType.ITEM,
            modifiers: {
              create: {
                targetType: ModifierTargetType.ARMOR_DEFLECT,
                operator: ModifierOperator.ADD,
                value: armor.deflectValue,
              },
            },
          },
        },
      },
    });
  });
  console.log("Armor templates created");

  console.log("🌱 Seed complete!");
}

main()
  .then(async () => {
    // await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
