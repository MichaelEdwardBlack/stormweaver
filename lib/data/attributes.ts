import { Attribute } from "../generated/prisma/enums";

export type AttributeInfo = {
  attribute: Attribute;
  name: string;
  description: string;
};

export const attributes: AttributeInfo[] = [
  {
    attribute: "strength",
    name: "Strength",
    description: "Physical power, endurance, and hardiness",
  },
  {
    attribute: "speed",
    name: "Speed",
    description: "Agility, reflexes, and manual dexterity",
  },
  {
    attribute: "intellect",
    name: "Intellect",
    description: "Mental acuity, knowledge, and problem-solving",
  },
  {
    attribute: "willpower",
    name: "Willpower",
    description: "Mental fortitude, discipline, and force of personality",
  },
  {
    attribute: "awareness",
    name: "Awareness",
    description: "Perception, intuition, and situational understanding",
  },
  {
    attribute: "presence",
    name: "Presence",
    description: "Social influence, leadership, and charisma",
  },
];
