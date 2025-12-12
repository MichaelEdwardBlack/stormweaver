export type WeaponType = {
  name: string;
  skill: string;
  damage: {
    value: string;
    type: "keen" | "impact" | "spirit";
  };
  range: string;
  traits: string[];
  expertTraits: string[];
  weight: number;
  price: number;
};

export const LightWeapons: WeaponType[] = [
  {
    name: "Javelin",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Melee",
    traits: ["Thrown [30/120]"],
    expertTraits: ["Indirect"],
    weight: 2,
    price: 20,
  },
  {
    name: "Knife",
    skill: "lightWeaponry",
    damage: {
      value: "1d4",
      type: "keen",
    },
    range: "Melee",
    traits: ["Discreet"],
    expertTraits: ["Offhand", "Thrown (20/60)"],
    weight: 1,
    price: 8,
  },
  {
    name: "Mace",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "impact",
    },
    range: "Melee",
    traits: [],
    expertTraits: ["Momentum"],
    weight: 3,
    price: 20,
  },
  {
    name: "Rapier",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Melee",
    traits: ["Quickdraw"],
    expertTraits: ["Defensive"],
    weight: 2,
    price: 100,
  },
  {
    name: "Shortspear",
    skill: "lightWeaponry",
    damage: {
      value: "1d8",
      type: "keen",
    },
    range: "Melee",
    traits: ["Two-Handed"],
    expertTraits: ["Unique: loses Two-Handed trait"],
    weight: 3,
    price: 10,
  },
  {
    name: "Sidesword",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Melee",
    traits: ["Quickdraw"],
    expertTraits: ["Offhand"],
    weight: 2,
    price: 40,
  },
  {
    name: "Staff",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "impact",
    },
    range: "Melee",
    traits: ["Discreet", "Two-Handed"],
    expertTraits: ["Defensive"],
    weight: 4,
    price: 1,
  },
  {
    name: "Shortbow",
    skill: "lightWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Ranged [80/320]",
    traits: ["Two-Handed"],
    expertTraits: ["Quickdraw"],
    weight: 2,
    price: 80,
  },
  {
    name: "Sling",
    skill: "lightWeaponry",
    damage: {
      value: "1d4",
      type: "impact",
    },
    range: "Ranged [30/120]",
    traits: ["Discreet"],
    expertTraits: ["Indirect"],
    weight: 1,
    price: 2,
  },
];

export const HeavyWeapons: WeaponType[] = [
  {
    name: "Axe",
    skill: "heavyWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Melee",
    traits: ["Thrown [20/60]"],
    expertTraits: ["Offhand"],
    weight: 2,
    price: 20,
  },
  {
    name: "Greatsword",
    skill: "heavyWeaponry",
    damage: {
      value: "1d10",
      type: "keen",
    },
    range: "Melee",
    traits: ["Two-Handed"],
    expertTraits: ["Deadly"],
    weight: 7,
    price: 200,
  },
  {
    name: "Hammer",
    skill: "heavyWeaponry",
    damage: {
      value: "1d10",
      type: "impact",
    },
    range: "Melee",
    traits: ["Two-Handed"],
    expertTraits: ["Momentum"],
    weight: 8,
    price: 40,
  },
  {
    name: "Longspear",
    skill: "heavyWeaponry",
    damage: {
      value: "1d8",
      type: "keen",
    },
    range: "Melee [+5]",
    traits: ["Two-Handed"],
    expertTraits: ["Defensive"],
    weight: 9,
    price: 15,
  },
  {
    name: "Longsword",
    skill: "heavyWeaponry",
    damage: {
      value: "1d8",
      type: "keen",
    },
    range: "Melee",
    traits: ["Two-Handed", "Quickdraw"],
    expertTraits: ["Unique: loses Two-Handed trait"],
    weight: 3,
    price: 60,
  },
  {
    name: "Poleaxe",
    skill: "heavyWeaponry",
    damage: {
      value: "1d10",
      type: "keen",
    },
    range: "Melee",
    traits: ["Two-Handed"],
    expertTraits: ["Unique: Melee [+5]"],
    weight: 5,
    price: 40,
  },
  {
    name: "Shield",
    skill: "heavyWeaponry",
    damage: {
      value: "1d4",
      type: "impact",
    },
    range: "Melee",
    traits: ["Defensive"],
    expertTraits: ["Offhand"],
    weight: 2,
    price: 10,
  },
  {
    name: "Crossbow",
    skill: "heavyWeaponry",
    damage: {
      value: "1d8",
      type: "keen",
    },
    range: "Ranged [100/400]",
    traits: ["Two-Handed", "Loaded [1]"],
    expertTraits: ["Deadly"],
    weight: 7,
    price: 200,
  },
  {
    name: "Longbow",
    skill: "heavyWeaponry",
    damage: {
      value: "1d6",
      type: "keen",
    },
    range: "Ranged [150/600]",
    traits: ["Two-Handed"],
    expertTraits: ["Indirect"],
    weight: 3,
    price: 100,
  },
];

export const LightAndHeavyWeapons = LightWeapons.concat(HeavyWeapons);

export const SpecialtyWeapons: WeaponType[] = [
  {
    name: "Improvised Weapon",
    skill: "Same as similar weapon",
    damage: {
      value: "",
      type: "keen",
    },
    range: "Melee",
    traits: ["Fragile"],
    expertTraits: ["Unique"],
    weight: 0,
    price: 0,
  },
  {
    name: "Unarmed Attack",
    skill: "athletics",
    damage: {
      value: "unique",
      type: "impact",
    },
    range: "Melee",
    traits: ["Unique"],
    expertTraits: ["Momentum", "Offhand"],
    weight: 0,
    price: 0,
  },
  {
    name: "Half-Shard",
    skill: "heavyWeaponry",
    damage: {
      value: "2d4",
      type: "impact",
    },
    range: "Melee",
    traits: ["Unique", "Defensive", "Two-Handed"],
    expertTraits: ["Momentum", "Offhand"],
    weight: 10,
    price: 2000,
  },
  {
    name: "Shardblade",
    skill: "heavyWeaponry",
    damage: {
      value: "2d8",
      type: "spirit",
    },
    range: "Melee",
    traits: ["Unique", "Dangerous", "Deadly"],
    expertTraits: ["Unique: loses Dangerous trait"],
    weight: 4,
    price: Number.POSITIVE_INFINITY,
  },
  {
    name: "Shardblade (Radiant)",
    skill: "*",
    damage: {
      value: "2d*",
      type: "spirit",
    },
    range: "Melee",
    traits: ["Unique", "Deadly"],
    expertTraits: [],
    weight: 0,
    price: Number.POSITIVE_INFINITY,
  },
  {
    name: "Warhammer",
    skill: "heavyWeaponry",
    damage: {
      value: "2d10",
      type: "impact",
    },
    range: "Melee",
    traits: ["Cumbersome [5]", "Two-Handed"],
    expertTraits: ["Unique"],
    weight: 150,
    price: 400,
  },
  {
    name: "Grandbow",
    skill: "heavyWeaponry",
    damage: {
      value: "2d6",
      type: "keen",
    },
    range: "Ranged [200/800]",
    traits: ["Cumbersome [5]", "Two-Handed"],
    expertTraits: ["Pierce"],
    weight: 20,
    price: 1000,
  },
];
