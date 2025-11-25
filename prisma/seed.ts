import {
  ModifierOperator,
  ModifierTargetType,
  SourceType,
  ActionCost,
  ItemType,
  ItemAcquisition,
  Attribute,
  Skill,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // -------------------------------------------------------
  // 1. Create a User
  // -------------------------------------------------------
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash: "hashed_password",
      name: "Demo User",
      settings: {
        create: {
          diceColor: "yellow",
          diceTextColor: "black",
          treeView: "broad",
        },
      },
    },
  });

  console.log("User created:", user.email);

  // -------------------------------------------------------
  // 2. Create a Character
  // -------------------------------------------------------
  const character = await prisma.character.create({
    data: {
      name: "Kalak Sonin",
      userId: user.id,
      level: 1,
      visibility: "owner",
    },
  });

  console.log("Character created:", character.name);

  // -------------------------------------------------------
  // 3. Create Attributes
  // -------------------------------------------------------
  const attributes = Object.values(Attribute).map((attr) => ({
    characterId: character.id,
    attribute: attr,
    value: 1,
  }));

  await prisma.characterAttribute.createMany({ data: attributes });

  // -------------------------------------------------------
  // 4. Create Skills
  // -------------------------------------------------------
  const skills = Object.values(Skill).map((skill) => ({
    characterId: character.id,
    skill: skill,
    rank: 0,
  }));

  await prisma.characterSkill.createMany({ data: skills });

  console.log("Attributes & Skills created");

  // -------------------------------------------------------
  // 5. TALENTS — Definitions with modifiers
  // -------------------------------------------------------

  // ⭐ Example talent: "Keen Mind" → +2 Intellect
  const opportunist = await prisma.talent.create({
    data: {
      id: "opportunist",
      name: "Opportunist",
      description: "Once per round, you can reroll your plot die",
      actionCost: ActionCost.SPECIAL_ACTION,
    },
  });

  const watchfulEye = await prisma.talent.upsert({
    where: { id: "watchful_eye" },
    update: {},
    create: {
      id: "watchful_eye",
      name: "Watchful Eye",
      description: "Use Opportunist on the plot die of a willing ally within 20 feet.",
      actionCost: ActionCost.REACTION,
      requiredSkills: {
        create: [
          {
            skillId: "deduction",
            minRank: 1,
          },
        ],
      },
      requiredTalents: {
        create: [
          {
            requiredId: "opportunist",
          },
        ],
      },
    },
  });

  // const composed = await prisma.talent.upsert({
  //   where: { id: "composed" },
  //   update: {},
  //   create: {
  //     id: "composed",
  //     name: "Composed",
  //     description: "Increase your max and current focus by your tier.",
  //     actionCost: ActionCost.ALWAYS_ACTIVE,
  //     modifierSource: {
  //       create: {
  //         type: SourceType.TALENT,
  //         modifiers: {
  //           create: {
  //             targetType: ModifierTargetType.FOCUS,
  //             operator: ModifierOperator.TIER_SCALING,
  //             value: 1,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  console.log("Talents created");

  // -------------------------------------------------------
  // 6. Assign talents to character
  // -------------------------------------------------------
  await prisma.characterTalent.createMany({
    data: [
      {
        characterId: character.id,
        talentId: opportunist.id,
        applyModifiers: true,
        isAncestryTalent: false,
      },
      {
        characterId: character.id,
        talentId: watchfulEye.id,
        applyModifiers: true,
        isAncestryTalent: false,
      },
    ],
  });

  console.log("Character talents added");

  // -------------------------------------------------------
  // 7. ITEM TEMPLATES — Definitions with modifiers
  // -------------------------------------------------------

  // ⭐ Example Item: Longsword (1d8 slashing)
  const longsword = await prisma.itemTemplate.create({
    data: {
      name: "Longsword",
      type: ItemType.weapon,
      price: 60,
      weight: 3,
      acquisition: ItemAcquisition.purchase,
      modifierSource: {
        create: {
          type: SourceType.ITEM,
          modifiers: {
            create: [
              {
                targetType: ModifierTargetType.DAMAGE_DICE,
                diceValue: "1d8",
                operator: ModifierOperator.OVERRIDE,
              },
              {
                targetType: ModifierTargetType.DAMAGE_TYPE,
                damageType: "keen",
                operator: ModifierOperator.OVERRIDE,
              },
            ],
          },
        },
      },
    },
  });

  // ⭐ Example Item: Shield (+2 armor deflect)
  const chain = await prisma.itemTemplate.upsert({
    where: { id: "chain" },
    update: {},
    create: {
      id: "chain",
      name: "Chain",
      type: ItemType.armor,
      price: 80,
      weight: 25,
      acquisition: ItemAcquisition.purchase,
      modifierSource: {
        create: {
          type: SourceType.ITEM,
          modifiers: {
            create: {
              targetType: ModifierTargetType.ARMOR_DEFLECT,
              operator: ModifierOperator.ADD,
              value: 2,
            },
          },
        },
      },
    },
  });

  console.log("Item templates created");

  // -------------------------------------------------------
  // 8. Give starting items to character
  // -------------------------------------------------------
  await prisma.characterItem.createMany({
    data: [
      { characterId: character.id, itemId: longsword.id, equipped: true },
      { characterId: character.id, itemId: chain.id, equipped: true },
    ],
  });

  console.log("Character starting items added");

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
