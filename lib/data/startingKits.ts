export type StartingKitType = {
  name: string;
  weapons: {
    amount: number;
    names?: string[];
    type?: "non-special" | "light" | "heavy";
  };
  armor: string[]; // names of the armor
  equipment: string;
  spheres: string;
  expertise?: string;
  connection?: string;
};
export const StartingKits: StartingKitType[] = [
  {
    name: "Academic",
    weapons: {
      amount: 1,
      names: ["Knife", "Sling", "Staff"],
    },
    armor: ["Uniform"],
    equipment:
      "Backpack with common clothing, an ink pen, a bottle of ink, 10 sheets of paper, 3 empty vials, a block of wax, a reference book on a topic of your choice (approved by the GM), 1 dose of weak poison",
    spheres: "3d12",
    expertise:
      "You gain the Literature expertise. If you already have this expertise, you instead gain one cultural or utility expertise of your choice. This expertise doesn't count against your expertises chosen at character creation.",
  },
  {
    name: "Artisan",
    weapons: {
      amount: 1,
      names: ["Hammer"],
      type: "light",
    },
    armor: ["Leather"],
    equipment:
      "Chest with common clothing, surgical supplies, 5 doses of weak antiseptic, an ink pen, a bottle of ink, 5 sheets of parchment, 5 candles, a flint and steel, 3 empty glass bottles, a tuning fork, a musical instrument of your choice, and a scale",
    spheres: "4d8",
  },
  {
    name: "Military",
    weapons: {
      amount: 2,
      type: "non-special",
    },
    armor: ["Uniform", "Chain"],
    equipment:
      "Backpack with common clothing, a waterskin, a flint and steel, a whetstone, a blanket, and 10 days of food rations",
    spheres: "2d6",
  },
  {
    name: "Courtier",
    weapons: {
      amount: 1,
      names: ["Sidesword", "Greatsword", "Longsword", "Longbow"],
    },
    armor: [],
    equipment: "Alcohol (bottle of violet wine), fine clothing",
    spheres: "4d20",
    connection:
      "You're supported by a patron of your noble house (see the “Patrons” section of chapter 8). This affords you accommodations and a certain standard of living.",
  },
  {
    name: "Prisoner",
    weapons: {
      amount: 0,
    },
    armor: [],
    equipment: "Manacles, ragged clothing",
    spheres: "0",
    connection:
      "You've attracted a Radiant spren, and through your trials, you've begun to connect with them. Speak with your GM and choose a spren type appropriate for your character, then record their information on the back of your character sheet in “Connections.” If you later choose the key talent from this spren's corresponding Radiant path, immediately check two boxes for that talent's “Speak the First Ideal” goal.",
  },
  {
    name: "Underworld",
    weapons: {
      amount: 2,
      type: "light",
    },
    armor: ["Leather"],
    equipment:
      "Backpack with common clothing, alcohol (bottle of Horneater white), a crowbar, a lockpick, 50 feet of rope, a flint and steel, an oil lantern, a flask of oil, and 5 days of street food",
    spheres: "1d20",
  },
];
