export type ArmorType = {
  name: string;
  deflectValue: number;
  traits: string[];
  expertTraits: string[];
  weight: number;
  price: number | "Reward only" | "Talent only";
};

export const Armor: ArmorType[] = [
  {
    name: "Uniform",
    deflectValue: 0,
    traits: ["Presentable"],
    expertTraits: [],
    weight: 5,
    price: 40,
  },
  {
    name: "Leather",
    deflectValue: 1,
    traits: [],
    expertTraits: ["Presentable"],
    weight: 10,
    price: 60,
  },
  {
    name: "Chain",
    deflectValue: 2,
    traits: ["Cumbersome [3]"],
    expertTraits: ["Unique: loses Cumbersome trait"],
    weight: 25,
    price: 80,
  },
  {
    name: "Breastplate",
    deflectValue: 2,
    traits: ["Cumbersome [3]"],
    expertTraits: ["Presentable"],
    weight: 30,
    price: 120,
  },
  {
    name: "Half Plate",
    deflectValue: 3,
    traits: ["Cumbersome [4]"],
    expertTraits: ["Unique: Cumbersome[3] instead of Cumbersome[4]"],
    weight: 40,
    price: 400,
  },
  {
    name: "Full Plate",
    deflectValue: 5,
    traits: ["Cumbersome [5]"],
    expertTraits: [],
    weight: 55,
    price: 1600,
  },
  {
    name: "Shardplate",
    deflectValue: 5,
    traits: ["Dangerous", "Unique"],
    expertTraits: ["Unique: loses Dangerous trait"],
    weight: 1400,
    price: "Reward only",
  },
  {
    name: "Shardplate (Radiant)",
    deflectValue: 5,
    traits: ["Unique"],
    expertTraits: [],
    weight: 0,
    price: "Talent only",
  },
];
