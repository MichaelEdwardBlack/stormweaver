export type AttributeId = "strength" | "speed" | "intellect" | "willpower" | "awareness" | "presence";

export type Attribute = {
  id: AttributeId;
  name: string;
  description: string;
};

export const attributes: Attribute[] = [
  {
    id: "strength",
    name: "Strength",
    description: "Physical power, endurance, and hardiness",
  },
  {
    id: "speed",
    name: "Speed",
    description: "Agility, reflexes, and manual dexterity",
  },
  {
    id: "intellect",
    name: "Intellect",
    description: "Mental acuity, knowledge, and problem-solving",
  },
  {
    id: "willpower",
    name: "Willpower",
    description: "Mental fortitude, discipline, and force of personality",
  },
  {
    id: "awareness",
    name: "Awareness",
    description: "Perception, intuition, and situational understanding",
  },
  {
    id: "presence",
    name: "Presence",
    description: "Social influence, leadership, and charisma",
  },
];
