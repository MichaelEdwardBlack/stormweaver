import type { AttributeId } from "./attributes";

export type SkillId =
  | "athletics"
  | "heavyWeaponry"
  | "agility"
  | "lightWeaponry"
  | "stealth"
  | "thievery"
  | "crafting"
  | "deduction"
  | "lore"
  | "medicine"
  | "discipline"
  | "intimidation"
  | "insight"
  | "perception"
  | "survival"
  | "deception"
  | "leadership"
  | "persuasion"
  | "abrasion"
  | "adhesion"
  | "cohesion"
  | "division"
  | "gravitation"
  | "illumination"
  | "progression"
  | "tension"
  | "transformation"
  | "transportation";

export type Skill = {
  id: SkillId;
  name: string;
  description: string;
  attribute: AttributeId;
};
export const physicalSkills: Skill[] = [
  {
    id: "athletics",
    name: "Athletics",
    description:
      "Athletics reflects your physical prowess: brawn, endurance, and resistance to harm and physical adversity.",
    attribute: "strength",
  },
  {
    id: "heavyWeaponry",
    name: "Heavy Weaponry",
    description: "Heavy Weaponry represents your experience wielding the most devastating weapons of warfare.",
    attribute: "strength",
  },
  {
    id: "agility",
    name: "Agility",
    description:
      "Agility reflects your capacity to maneuver within your environment, steer a mount, execute acrobatic feats, and pilot vehicles with precision.",
    attribute: "speed",
  },
  {
    id: "lightWeaponry",
    name: "Light Weaponry",
    description:
      "Light Weaponry represents your facility with smaller armaments that are wielded with finesse rather than raw strength.",
    attribute: "speed",
  },
  {
    id: "stealth",
    name: "Stealth",
    description: "Stealth represents your attribute to avoid or escape attention.",
    attribute: "speed",
  },
  {
    id: "thievery",
    name: "Thievery",
    description:
      "Thievery covers all manner of tasks that require precise manual dexterity or are useful in skullduggery.",
    attribute: "speed",
  },
];

export const cognitiveSkills: Skill[] = [
  {
    id: "crafting",
    name: "Crafting",
    description:
      "Crafting uses your ingenuity and knowledge to design and build physical objects with what you have on hand.",
    attribute: "intellect",
  },
  {
    id: "deduction",
    name: "Deduction",
    description: "To understand the world, one must observe, question, and test.",
    attribute: "intellect",
  },
  {
    id: "lore",
    name: "Lore",
    description:
      "Lore establishes your familiarity with history, current events, folklore, religions, places, and science.",
    attribute: "intellect",
  },
  {
    id: "medicine",
    name: "Medicine",
    description:
      "Medicine measures your attribute to heal yourself and others through your knowledge of anatomy, surgery, and the mind.",
    attribute: "intellect",
  },
  {
    id: "discipline",
    name: "Discipline",
    description:
      "Discipline determines your attribute to control your outward reactions and responses to unsettling circumstances.",
    attribute: "willpower",
  },
  {
    id: "intimidation",
    name: "Intimidation",
    description:
      "Intimidation reflects your attribute to induce fear in another character and thereby ensure their compliance.",
    attribute: "willpower",
  },
];

export const spiritualSkills: Skill[] = [
  {
    id: "insight",
    name: "Insight",
    description:
      "Insight measures your attribute to discern the true feelings of others, see through deceptions, and use your intuition to determine if a situation is off.",
    attribute: "awareness",
  },
  {
    id: "perception",
    name: "Perception",
    description: "Perception signifies your attribute to notice details about your surroundings.",
    attribute: "awareness",
  },
  {
    id: "survival",
    name: "Survival",
    description:
      "Survival indicates your competence in obtaining vital resources and shelter, avoiding environmental threats, and understanding animal anatomy and behavior.",
    attribute: "awareness",
  },
  {
    id: "deception",
    name: "Deception",
    description:
      "Deception measures how well you can mislead others with blatant dishonesty, clever insinuations, exaggerations, and strategic omissions.",
    attribute: "presence",
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Leadership represents your attribute to inspire people, draw attention, and command allies.",
    attribute: "presence",
  },
  {
    id: "persuasion",
    name: "Persuasion",
    description: "Persuasion reflects your charisma, social fluency, and assumed trustworthiness.",
    attribute: "presence",
  },
];

export const surgeSkills: Skill[] = [
  {
    id: "abrasion",
    name: "Abrasion",
    description:
      "The surge of Abrasion alters the frictional force on an object's surface, usually by nearly eliminating it.",
    attribute: "speed",
  },
  {
    id: "adhesion",
    name: "Adhesion",
    description: "The surge of Adhesion binds things together.",
    attribute: "presence",
  },
  {
    id: "cohesion",
    name: "Cohesion",
    description:
      "The surge of Cohesion allows you to alter objects down to their very axi—the particles that make up all matter.",
    attribute: "willpower",
  },
  {
    id: "division",
    name: "Division",
    description:
      "The surge of Division allows you to destroy and decay, causing your target to atrophy, crumble into dust, or fall apart in other ways.",
    attribute: "intellect",
  },
  {
    id: "gravitation",
    name: "Gravitation",
    description:
      "The surge of Gravitation can change the direction and magnitude of an object’s gravitational attraction.",
    attribute: "awareness",
  },
  {
    id: "illumination",
    name: "Illumination",
    description: "The surge of Illumination can create convincing illusions, both visual and auditory.",
    attribute: "presence",
  },
  {
    id: "progression",
    name: "Progression",
    description: "The surge of Progression controls the growth and healing of living things.",
    attribute: "awareness",
  },
  {
    id: "tension",
    name: "Tension",
    description: "The surge of Tension alters the rigidity of objects.",
    attribute: "strength",
  },
  {
    id: "transformation",
    name: "Transformation",
    description: " The surge of Transformation transforms one material into another.",
    attribute: "willpower",
  },
  {
    id: "transportation",
    name: "Transportation",
    description:
      "The surge of Transportation allows you to transition yourself and others between the different realms.",
    attribute: "intellect",
  },
];

export const allSkills: Skill[] = [...physicalSkills, ...cognitiveSkills, ...spiritualSkills];
