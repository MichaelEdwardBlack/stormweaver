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
    const rangeParts = weapon.range.match(/(\d+)\s*\/?\s*(\d+)?/);
    let isRanged = false;
    let reach = 5;
    let shortRange, longRange;
    if (weapon.range.includes("Ranged") && rangeParts) {
      isRanged = true;
      shortRange = Number.parseInt(rangeParts[1]);
      longRange = Number.parseInt(rangeParts[2]);
    } else {
      reach += Number.parseInt(rangeParts?.at(1) ?? "0");
    }

    if (acquisition === "purchase") {
      // also add one for starting kits
      await prisma.itemTemplate.upsert({
        where: { id: `starting_${id}` },
        update: {
          weapon: {
            upsert: {
              where: {
                itemId: `starting_${id}`,
              },
              update: {
                traits: weapon.traits,
                expertTraits: weapon.expertTraits,
              },
              create: {
                isRanged,
                shortRange,
                longRange,
                reach,
              },
            },
          },
        },
        create: {
          id: `starting_${id}`,
          name,
          type: ItemType.weapon,
          // description: "",
          price: null,
          acquisition: "startingKit",
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
    }
    await prisma.itemTemplate.upsert({
      where: { id },
      update: {
        weapon: {
          upsert: {
            where: {
              itemId: id,
            },
            update: {
              traits: weapon.traits,
              expertTraits: weapon.expertTraits,
            },
            create: {
              isRanged,
              shortRange,
              longRange,
              reach,
            },
          },
        },
      },
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

    if (acquisition === "purchase") {
      // also add one for starting kits
      await prisma.itemTemplate.upsert({
        where: { id: `starting_${id}` },
        update: {
          armor: {
            upsert: {
              where: {
                itemId: `starting_${id}`,
              },
              update: {
                traits: armor.traits,
                expertTraits: armor.expertTraits,
              },
              create: {
                traits: armor.traits,
                expertTraits: armor.expertTraits,
              },
            },
          },
        },
        create: {
          id: `starting_${id}`,
          name,
          type: ItemType.armor,
          // description: "",
          price: null,
          acquisition: "startingKit",
          weight,
          modifierSource: {
            create: {
              type: SourceType.ITEM,
              modifiers: {
                create: [
                  {
                    targetType: ModifierTargetType.ARMOR_DEFLECT,
                    operator: ModifierOperator.ADD,
                    value: armor.deflectValue,
                  },
                ],
              },
            },
          },
        },
      });
    }

    await prisma.itemTemplate.upsert({
      where: { id },
      update: {
        armor: {
          upsert: {
            where: {
              itemId: id,
            },
            update: {
              traits: armor.traits,
              expertTraits: armor.expertTraits,
            },
            create: {
              traits: armor.traits,
              expertTraits: armor.expertTraits,
            },
          },
        },
      },
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
