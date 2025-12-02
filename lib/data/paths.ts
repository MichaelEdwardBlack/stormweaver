import type { AttributeId } from "./attributes";
import type { SkillId } from "./skills";
import { HeroicPathTrees, type TalentTreeId, type TalentNode, SingerTree, RadiantPathTrees } from "./tree";

// A subclass of a path, with its own talent tree
export type Subclass = {
  id: string;
  name: string;
  description: string;
  attribute?: AttributeId;
};

// A major path (like Warrior, Scholar, etc)
export type Path = {
  id: TalentTreeId;
  name: string;
  description: string;
  keyTalent: TalentNode; // required first talent of the path
  subclasses: Subclass[]; // usually 3 options after taking key talent
  recommendedAttributes: AttributeId[];
  recommendedPaths?: string[];
  startingPathSkill?: SkillId;
  recommendedSkills?: SkillId[];
};

const Abrasion: Subclass = {
  id: "abrasion",
  name: "Abrasion",
  description:
    "The surge of Abrasion alters the frictional force on an object's surface, usually by nearly eliminating it.",
  attribute: "speed",
};
const Adhesion: Subclass = {
  id: "adhesion",
  name: "Adhesion",
  description:
    "The surge of Adhesion binds things together. These can be physical objects, or for more advanced Surgebinders like Bondsmiths, spiritual Connections. Adhesion infusions are most commonly used to create a Full Lashing, in which the Surgebinder adheres two physical objects together by manipulating air pressure and resistance.",
  attribute: "presence",
};
const Cohesion: Subclass = {
  id: "cohesion",
  name: "Cohesion",
  description:
    "The surge of Cohesion allows you to alter objects down to their very axi—the particles that make up all matter. Often known as Stoneshaping, Cohesion allows even its most inexperienced wielders to mold stone as if it were soft clay.",
  attribute: "willpower",
};
const Division: Subclass = {
  id: "division",
  name: "Division",
  description:
    "The surge of Division allows you to destroy and decay, causing your target to atrophy, crumble into dust, or fall apart in other ways.",
  attribute: "intellect",
};
const Gravitation: Subclass = {
  id: "gravitation",
  name: "Gravitation",
  attribute: "awareness",
  description:
    "The surge of Gravitation can change the direction and magnitude of an object's gravitational attraction. Gravitation infusions temporarily draw an object to another point instead of the planet's center of gravity. This is known as a Basic Lashing.",
};
const Illumination: Subclass = {
  id: "illumination",
  name: "Illumination",
  attribute: "presence",
  description:
    "The surge of Illumination can create convincing illusions, both visual and auditory. This ability is commonly known as Lightweaving, though Lightweavers and Truthwatchers can both use this surge.",
};
const Progression: Subclass = {
  id: "progression",
  name: "Progression",
  attribute: "awareness",
  description:
    " The surge of Progression controls the growth and healing of living things. Its two primary effects are Growth (which can rapidly sprout and mature plants) and Regrowth (which can heal a character's body and soul).",
};
const Tension: Subclass = {
  id: "tension",
  name: "Tension",
  attribute: "strength",
  description:
    " The surge of Tension alters the rigidity of objects. This allows you to reinforce flexible materials such as cloth, making them firm and strong like steel.",
};
const Transformation: Subclass = {
  id: "transformation",
  name: "Transformation",
  attribute: "willpower",
  description:
    "The surge of Transformation transforms one material into another. Often called Soulcasting, this surge shifts your perception of the object you want to transform, allowing you to see and communicate with its Cognitive aspect.",
};
const Transportation: Subclass = {
  id: "transportation",
  name: "Transportation",
  attribute: "intellect",
  description:
    "The surge of Transportation allows you to transition yourself and others between the different realms. However, mastering it takes great skill, and at first, you'll only be able to peer into the Cognitive Realm (also known as Shadesmar).",
};

export const PathInfo: Record<string, Path> = {
  agent: {
    id: "agent",
    name: "Agent",
    description: "Focused on stealth, infiltration and subtle manipulation.",
    keyTalent: HeroicPathTrees.agent.nodes[0],
    startingPathSkill: "insight",
    subclasses: [
      {
        id: "investigator",
        name: "Investigator",
        description:
          "Hunches tend to be unreliable—but Investigators cultivate trustworthy instincts, learning to listen, collaborate, and pursue answers to questions others don't think to ask.",
      },
      {
        id: "spy",
        name: "Spy",
        description:
          "To get what they need, Spies plant themselves in sticky situations, ready to deflect or ease suspicion when it inevitably sweeps their way",
      },
      {
        id: "thief",
        name: "Thief",
        description:
          "Although a quick mind is an invaluable asset, Thieves train their bodies to keep pace. Whether out of necessity or ambition, they risk it all to swindle the insurmountable odds standing between them and their prize.",
      },
    ],
    recommendedAttributes: ["awareness", "intellect", "speed"],
    recommendedSkills: ["agility", "deception", "deduction", "insight", "lightWeaponry", "thievery"],
  },

  envoy: {
    id: "envoy",
    name: "Envoy",
    description: "Charismatic and persuasive, excels at social maneuvers.",
    keyTalent: HeroicPathTrees.envoy.nodes[0],
    startingPathSkill: "discipline",
    subclasses: [
      {
        id: "diplomat",
        name: "Diplomat",
        description:
          "Stationed abroad, Diplomats are adept at navigating court politics. They use what they learn about their host countries to seek more favorable treatment for their own.",
      },
      {
        id: "faithful",
        name: "Faithful",
        description:
          "For Faithful, worship of the divine permeates their entire lives. They devote themselves to the traditions of their faith, demonstrating their convictions to others through word or deed.",
      },
      {
        id: "mentor",
        name: "Mentor",
        description:
          "More interested in the individual than the whole, Mentors devote themselves to their wards. They patiently nurture others toward greatness, seeing beyond doubts and deficits to stoke each person's potential.",
      },
    ],
    recommendedAttributes: ["presence", "willpower"],
    recommendedSkills: ["discipline", "deception", "leadership", "lore", "persuasion"],
  },

  hunter: {
    id: "hunter",
    name: "Hunter",
    description: "Skilled trackers and ranged combatants.",
    keyTalent: HeroicPathTrees.hunter.nodes[0],
    startingPathSkill: "perception",
    subclasses: [
      {
        id: "archer",
        name: "Archer",
        description:
          "Targeting weak points in enemy army's assault, Archers shape the battlefield before the front-line confrontation. They steadily unleash a torrent of arrows to scatter and terrorize foes.",
      },
      {
        id: "assassin",
        name: "Assassin",
        description:
          "Whether commissioned to kill or driven by their own interests, Assassins exploit weakness to quickly incapacitate their quarry.",
      },
      {
        id: "tracker",
        name: "Tracker",
        description:
          "In untamed wilds, none are more capable than Trackers. With trusty animal companions at their sides, they scrounge provisions, deftly cross unfriendly terrain, and set perilous traps.",
      },
    ],
    recommendedAttributes: ["awareness", "strength", "speed"],
    recommendedSkills: ["agility", "perception", "stealth", "survival", "lightWeaponry", "heavyWeaponry"],
  },

  leader: {
    id: "leader",
    name: "Leader",
    description: "Tactical commanders and morale anchors.",
    startingPathSkill: "leadership",
    keyTalent: HeroicPathTrees.leader.nodes[0],
    subclasses: [
      {
        id: "champion",
        name: "Champion",
        description:
          "Inspiring others through unfaltering grit, Champions ferociously charge their foes. Their momentum is magnetic, rallying nearby allies to press on.",
      },
      {
        id: "officer",
        name: "Officer",
        description:
          "Officers cooly maintain order in utter chaos. They allocate resources and issue commands, orchestration the march to victory.",
      },
      {
        id: "politico",
        name: "Politico",
        description:
          "With a penchant for theatrics, Politicos chase favor and prestige while subtly undermining their enemies",
      },
    ],
    recommendedAttributes: ["presence", "strength", "willpower"],
    recommendedSkills: ["athletics", "deception", "heavyWeaponry", "intimidation", "leadership", "persuasion"],
  },

  scholar: {
    id: "scholar",
    name: "Scholar",
    description: "Masters of knowledge, crafting, and arcane theory.",
    keyTalent: HeroicPathTrees.scholar.nodes[0],
    startingPathSkill: "lore",
    subclasses: [
      {
        id: "artifabrian",
        name: "Artifabrian",
        description:
          "Combining science, engineering, and artistry, Artifabrians use polestones and metal casings to construct fabrials that perform precise functions.",
      },
      {
        id: "strategist",
        name: "Strategist",
        description:
          "Always three steps ahead, Strategists know timing is everything and make it work to their benefit.",
      },
      {
        id: "surgeon",
        name: "Surgeon",
        description: "Qualified Surgeons apply their knowledge and empathy to heal the unwell and save lives.",
      },
    ],
    recommendedAttributes: ["intellect", "presence", "speed", "strength"],
    recommendedSkills: ["crafting", "deduction", "lore", "medicine"],
  },

  warrior: {
    id: "warrior",
    name: "Warrior",
    description: "Frontline combatants and specialists in arms.",
    keyTalent: HeroicPathTrees.warrior.nodes[0],
    startingPathSkill: "athletics",
    subclasses: [
      {
        id: "duelist",
        name: "Duelist",
        description:
          "In the inner circles of the elite, skilled Duelists contend for glory and political sway, wielding their weapons with brutal grace.",
      },
      {
        id: "shardbearer",
        name: "Shardbearer",
        description:
          "Warriors fortunate enough to own (or borrow) Shardblades and Shardplate serve as Shardbearers. They wield these arms and armor of ancient provenance to dominate the battlefield with mythic might.",
      },
      {
        id: "soldier",
        name: "Soldier",
        description:
          "The most common of fighting forces, Soldiers form the bulk of Roshar's massive armies. They master the tactics needed to fight effectively in units and stay alive in a deadly world.",
      },
    ],
    recommendedAttributes: ["speed", "strength", "awareness", "willpower"],
    recommendedSkills: ["athletics", "lightWeaponry", "heavyWeaponry", "intimidation", "leadership", "persuasion"],
  },

  dustbringer: {
    id: "dustbringer",
    name: "Dustbringer",
    description: "Radiant Path with Abrasion and Division surges.",
    keyTalent: RadiantPathTrees.dustbringer.nodes[0],
    subclasses: [
      {
        id: "ashspren_bond",
        name: "Ashspren Bond",
        description:
          "To become a Dustbringer, you must bond with an ashspren—but most ashspren never forgave humanity for the hundreds of spren that were killed during the Recreance.",
      },
      Abrasion,
      Division,
    ],
    recommendedAttributes: [],
  },

  edgedancer: {
    id: "edgedancer",
    name: "Edgedancer",
    description: "Radiant Path with Abrasion and Progression surges.",
    keyTalent: RadiantPathTrees.edgedancer.nodes[0],
    subclasses: [
      {
        id: "cultivationspren_bond",
        name: "Cultivationspren Bond",
        description: "To become an Edgedancer, you must form a bond with a cultivationspren.",
      },
      Abrasion,
      Progression,
    ],
    recommendedAttributes: [],
  },

  elsecaller: {
    id: "elsecaller",
    name: "Elsecaller",
    description: "Radiant Path with Transformation and Transportation surges.",
    keyTalent: RadiantPathTrees.elsecaller.nodes[0],
    subclasses: [
      {
        id: "inkspren_bond",
        name: "Inkspren Bond",
        description: "To become an Elsecaller, you must first bond with an inkspren.",
      },
      Transformation,
      Transportation,
    ],
    recommendedAttributes: [],
  },

  lightweaver: {
    id: "lightweaver",
    name: "Lightweaver",
    description: "Radiant Path with Illumination and Transformation surges.",
    keyTalent: RadiantPathTrees.lightweaver.nodes[0],
    subclasses: [
      {
        id: "cryptic_bond",
        name: "Cryptic Bond",
        description:
          'To become a Lightweaver, you must bond with a Cryptic. These are sometimes called "liespren," though the Cryptics themselves consider this term somewhat pejorative and reductive.',
      },
      Illumination,
      Transformation,
    ],
    recommendedAttributes: [],
  },

  skybreaker: {
    id: "skybreaker",
    name: "Skybreaker",
    description: "Radiant Path with Division and Gravitation surges.",
    keyTalent: RadiantPathTrees.skybreaker.nodes[0],
    subclasses: [
      {
        id: "highspren_bond",
        name: "Highspren Bond",
        description:
          "To become a Skybreaker, you must bond with a highspren, whether one of Nale's or an independent spren.",
      },
      Division,
      Gravitation,
    ],
    recommendedAttributes: [],
  },

  stoneward: {
    id: "stoneward",
    name: "Stoneward",
    description: "Radiant Path with Cohesion and Tension surges.",
    keyTalent: RadiantPathTrees.stoneward.nodes[0],
    subclasses: [
      {
        id: "peakspren_bond",
        name: "Peakspren Bond",
        description: "To become a Stoneward, you must bond with a peakspren, the personification of mountains.",
      },
      Cohesion,
      Tension,
    ],
    recommendedAttributes: [],
  },

  truthwatcher: {
    id: "truthwatcher",
    name: "Truthwatcher",
    description: "Radiant Path with Illumination and Progression surges.",
    keyTalent: RadiantPathTrees.truthwatcher.nodes[0],
    subclasses: [
      {
        id: "mistspren_bond",
        name: "Mistspren Bond",
        description:
          "To become a Truthwatcher, you must bond with a mistspren—but is your spren simply a mistspren, or are they Enlightened?",
      },
      Illumination,
      Progression,
    ],
    recommendedAttributes: [],
  },

  willshaper: {
    id: "willshaper",
    name: "Willshaper",
    description: "Radiant Path with Cohesion and Transportation surges.",
    keyTalent: RadiantPathTrees.willshaper.nodes[0],
    subclasses: [
      {
        id: "lightspren_bond",
        name: "Lightspren Bond",
        description: "To become a Willshaper, you must bond with a lightspren (also known as a Reacher).",
      },
      Cohesion,
      Transportation,
    ],
    recommendedAttributes: [],
  },

  windrunner: {
    id: "windrunner",
    name: "Windrunner",
    description: "Radiant Path with Adhesion and Gravitation surges.",
    keyTalent: RadiantPathTrees.windrunner.nodes[0],
    subclasses: [
      {
        id: "honorspren_bond",
        name: "Honorspren Bond",
        description: " To become a Windrunner, you must bond with an honorspren.",
      },
      Adhesion,
      Gravitation,
    ],
    recommendedAttributes: [],
  },

  singer: {
    id: "singer",
    name: "Singer",
    description:
      "Singers can change forms by bonding spren during highstorms, altering the singer's appearance and abilities.",
    keyTalent: SingerTree.nodes[0],
    subclasses: [],
    recommendedAttributes: [],
  },
};
