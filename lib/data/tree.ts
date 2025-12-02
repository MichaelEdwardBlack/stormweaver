import type { AttributeId } from "./attributes";
import type { SkillId } from "./skills";

export type HeroicPathId = "agent" | "envoy" | "hunter" | "leader" | "scholar" | "warrior";
export type SingerPathId = "singer";
export type RadiantPathId =
  | "dustbringer"
  | "edgedancer"
  | "elsecaller"
  | "lightweaver"
  | "skybreaker"
  | "stoneward"
  | "truthwatcher"
  | "willshaper"
  | "windrunner";
export type TalentTreeId = HeroicPathId | RadiantPathId | SingerPathId;
export type TalentId = string;

// Prerequisites for unlocking a talent
export type TalentRequirement = {
  talents?: TalentId[]; // require these specific talents
  attribute?: { id: AttributeId; min: number }; // e.g., { id: 'strength', min: 1 }
  skill?: { id: SkillId; min: number }; // e.g., { id: 'athletics', min: 2 }
  other?: string[]; // e.g., ['shardblade', 'shardplate'],
  level?: number;
};

export type ActionType =
  | "1 Action"
  | "2 Actions"
  | "3 Actions"
  | "Free Action"
  | "Reaction"
  | "Special Activation"
  | "Always Active";

export interface TalentNode {
  id: string;
  name: string;
  description?: string;
  actionCost?: ActionType;
  requirements?: TalentRequirement;
  isSubclass?: boolean;
  x: number; // grid position
  y: number;
  txDiagonalOffset?: number;
  detourDirection?: string;
}

export type TalentEdge = {
  from: string; // parent id
  to: string; // child id
  invisible?: boolean; // hide the drawn line
};

export type TalentTree = {
  nodes: TalentNode[];
  edges: TalentEdge[];
  subclasses: string[];
};

export const AgentTree: TalentTree = {
  nodes: [
    {
      id: "opportunist",
      name: "Opportunist",
      description: "Once per round, you can reroll your plot die",
      actionCost: "Special Activation",
      x: 0,
      y: 0,
    },
    {
      id: "investigator",
      name: "Investigator",
      description:
        "Hunches tend to be unreliable—but Investigators cultivate trustworthy instincts, learning to listen, collaborate, and pursue answers to questions others don’t think to ask.",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "watchful_eye",
      name: "Watchful Eye",
      description: "Use Opportunist on the plot die of a willing ally within 20 feet",
      actionCost: "Reaction",
      requirements: {
        talents: ["opportunist"],
        skill: { id: "deduction", min: 1 },
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "quick_analysis",
      name: "Quick Analysis",
      description:
        "Spend 2 focus to gain 2 Actions for cognitive tests with Use a Skill, Gain Advantage, or an Agent talent.",
      actionCost: "Free Action",
      requirements: { talents: ["watchful_eye"] },
      x: -2.5,
      y: 2.5,
    },
    {
      id: "gather_evidence",
      name: "Gather Evidence",
      description:
        "Gain Legal Codes expertise. When you succeed on a cognitive test against a target, you become Focused.",
      actionCost: "Always Active",
      requirements: {
        talents: ["quick_analysis"],
        skill: { id: "insight", min: 2 },
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "get_em_talking",
      name: "Get 'em Talking",
      description:
        "Spend 1 focus to test Deduction vs. Spiritual to learn the target's motivation. During this scene, you can raise the stakes on tests to leverage this motivation.",
      actionCost: "2 Actions",
      requirements: { talents: ["opportunist"], skill: { id: "insight", min: 2 } },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "baleful",
      name: "Baleful",
      description: "To resist your influence, a character must spend additional focus equal to your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["get_em_talking"] },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "hardy",
      name: "Hardy",
      description: "Gain +1 max health per level (including previous levels).",
      actionCost: "Always Active",
      requirements: { talents: ["baleful"] },
      x: -1.5,
      y: 3.5,
    },
    {
      id: "sleuths_instincts",
      name: "Sleuth's Instincts",
      description:
        "Gain an advantage on cognitive tests against characters whose motivation you know. You know when those characters lie to you.",
      actionCost: "Always Active",
      requirements: { talents: ["hardy"], skill: { id: "deduction", min: 3 } },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "close_the_case",
      name: "Close the Case",
      description: "Spend 2 focus to automatically succeed on a Deduction test to identify a target's motivation.",
      actionCost: "3 Actions",
      requirements: { talents: ["hardy"], skill: { id: "deduction", min: 3 } },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "spy",
      name: "Spy",
      description:
        "To get what they need, Spies plant themselves in sticky situations, ready to deflect or ease suspicion when it inevitably sweeps their way",
      isSubclass: true,
      x: 0,
      y: 0.75,
    },
    {
      id: "sure_outcome",
      name: "Sure Outcome",
      description:
        "When you use Opportunist, spend 2 focus to change Opportunity to Complication 4, or change any Complication to Opportunity",
      actionCost: "Special Activation",
      requirements: { talents: ["opportunist"], skill: { id: "insight", min: 2 } },
      x: -0.5,
      y: 1.5,
    },
    {
      id: "collected",
      name: "Collected",
      description: "Increase your Cognitive and Spiritual defences by 2",
      actionCost: "Always Active",
      requirements: { talents: ["sure_outcome"] },
      x: -0.5,
      y: 2.5,
    },
    {
      id: "plausible_excuse",
      name: "Plausible Excuse",
      description: "Gain Sleight of Hand expertise. When discovered skulking, spend 2 focus to feign innocence",
      actionCost: "Reaction",
      requirements: {
        talents: ["opportunist"],
        skill: { id: "deception", min: 1 },
      },
      x: 0.5,
      y: 1.5,
    },
    {
      id: "cover_story",
      name: "Cover Story",
      description: "Gain a false identity and a relevant cultural expertise.",
      actionCost: "Always Active",
      requirements: { talents: ["plausible_excuse"] },
      x: 0.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "mighty",
      name: "Mighty",
      description:
        "When you hit with a weapon or unarmed attack, for each Action spent, deal extra damage equal to 1+ your tier",
      actionCost: "Always Active",
      requirements: { talents: ["cover_story"] },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "high_society_contacts",
      name: "High Society Contacts",
      description:
        "Gain High Society expertise. Spend 2 focus to add Opportunity to a test to interact in high society.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["cover_story"],
        other: ["Patron in high society"],
      },
      x: 0.5,
      y: 4.5,
    },
    {
      id: "subtle_takedown",
      name: "Subtle Takedown",
      description:
        "Make an unarmed attack with Insight vs. an unsuspecting target's Cognitive, raising the stakes. On a hit, they can't communicate.",
      actionCost: "2 Actions",
      requirements: { talents: ["cover_story"], skill: { id: "insight", min: 3 } },
      x: -0.5,
      y: 3.5,
    },
    {
      id: "mercurial_facade",
      name: "Mercurial Facade",
      description:
        "Disguise yourself using Deception without needing physical supplies. The first character to see through your disguise is Surprised.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["subtle_takedown"],
        skill: { id: "deception", min: 3 },
      },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "thief",
      name: "Thief",
      description:
        "Although a quick mind is an invaluable asset, Thieves train their bodies to keep pace. Whether out of necessity or ambition, they risk it all to swindle the insurmountable odds standing between them and their prize.",
      isSubclass: true,
      x: 2,
      y: 0.75,
    },
    {
      id: "risky_behavior",
      name: "Risky Behavior",
      description: "Spend 1 focus to raise the stakes on your test",
      actionCost: "Special Activation",
      requirements: { talents: ["opportunist"], skill: { id: "insight", min: 2 } },
      x: 1.5,
      y: 1.5,
    },
    {
      id: "double_down",
      name: "Double Down",
      description: "You can reroll again with Opportunist, but on Complication, you lose 2 focus.",
      actionCost: "Special Activation",
      requirements: { talents: ["risky_behavior"] },
      x: 1.5,
      y: 2.5,
      detourDirection: "left",
    },
    {
      id: "underworld_contacts",
      name: "Underworld Contacts",
      description:
        "Gain Criminal Groups expertise. Spend 2 focus to add Opportunity to a social test against criminals.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["double_down"],
        other: ["Patron or follower in criminal underworld"],
      },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "fast_talker",
      name: "Fast Talker",
      description:
        "Spend 2 focus to gain 2 Actions for spiritual tests with Use a Skill, Gain Advantage, or an Agent talent.",
      actionCost: "Free Action",
      requirements: { talents: ["double_down"], skill: { id: "insight", min: 3 } },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "cheap_shot",
      name: "Cheap Shot",
      description:
        "Spend 1 focus to make an unarmed attack with Thievery vs. Cognitive, raising the stakes. On a hit, the target is Stunned",
      actionCost: "1 Action",
      requirements: { talents: ["opportunist"] },
      x: 2.5,
      y: 1.5,
    },
    {
      id: "surefooted",
      name: "Surefooted",
      description:
        "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["cheap_shot"] },
      x: 2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "shadow_step",
      name: "Shadow Step",
      description:
        "After you Disengage, spend 2 focus to test Thievery vs. each enemy's Cognitive to hide from them. You gain an advantage if in cover or obscured.",
      actionCost: "Free Action",
      requirements: { talents: ["surefooted"], skill: { id: "thievery", min: 3 } },
      x: 2.5,
      y: 3.5,
    },
    {
      id: "trickers_hand",
      name: "Trickster's Hand",
      description:
        "Spend 2 focus to gain 2 Actions for physical tests with Use a Skill, Gain Advantage, or an Agent talent",
      actionCost: "Free Action",
      requirements: { talents: ["surefooted"], skill: { id: "thievery", min: 3 } },
      x: 2.5,
      y: 4.5,
    },
  ],
  edges: [
    { from: "opportunist", to: "investigator" },
    { from: "investigator", to: "watchful_eye" },
    { from: "opportunist", to: "watchful_eye", invisible: true },
    { from: "watchful_eye", to: "quick_analysis" },
    { from: "quick_analysis", to: "gather_evidence" },
    { from: "investigator", to: "get_em_talking" },
    { from: "opportunist", to: "get_em_talking", invisible: true },
    { from: "get_em_talking", to: "baleful" },
    { from: "baleful", to: "hardy" },
    { from: "hardy", to: "sleuths_instincts" },
    { from: "hardy", to: "close_the_case" },
    { from: "opportunist", to: "spy" },
    { from: "spy", to: "sure_outcome" },
    { from: "opportunist", to: "sure_outcome", invisible: true },
    { from: "sure_outcome", to: "collected" },
    { from: "spy", to: "plausible_excuse" },
    { from: "opportunist", to: "plausible_excuse", invisible: true },
    { from: "plausible_excuse", to: "cover_story" },
    { from: "cover_story", to: "mighty" },
    { from: "cover_story", to: "high_society_contacts" },
    { from: "cover_story", to: "subtle_takedown" },
    { from: "subtle_takedown", to: "mercurial_facade" },
    { from: "opportunist", to: "thief" },
    { from: "thief", to: "risky_behavior" },
    { from: "opportunist", to: "risky_behavior", invisible: true },
    { from: "risky_behavior", to: "double_down" },
    { from: "double_down", to: "underworld_contacts" },
    { from: "double_down", to: "fast_talker" },
    { from: "thief", to: "cheap_shot" },
    { from: "opportunist", to: "cheap_shot", invisible: true },
    { from: "cheap_shot", to: "surefooted" },
    { from: "surefooted", to: "shadow_step" },
    { from: "surefooted", to: "trickers_hand" },
  ],
  subclasses: ["ivestigator", "spy", "thief"],
};

export const EnvoyTree: TalentTree = {
  nodes: [
    {
      id: "rousing_presence",
      name: "Rousing Precence",
      description: "An ally becomes _Determined until end of scene",
      actionCost: "1 Action",
      x: 0,
      y: 0,
    },
    {
      id: "diplomat",
      name: "Diplomat",
      description:
        "Stationed abroad, Diplomats are adept at navigating court politics. They use what they learn about their host countries to seek more favorable treatment for their own.",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "steadfast_challenge",
      name: "Steadfast Challenge",
      description:
        "Spend 1 focus to test Discipline vs. an enemy's Spiritual. On success, they are Disoriented and gain a disadvantage on tests against you.",
      actionCost: "1 Action",
      requirements: {
        talents: ["rousing_presence"],
        skill: { id: "discipline", min: 1 },
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "withering_retort",
      name: "Withering Retort",
      description:
        "Use your Steadfast Challenge before an attack and increase your deflect against the attack by your ranks in Discipline.",
      actionCost: "Reaction",
      requirements: {
        talents: ["steadfast_challenge"],
        skill: { id: "discipline", min: 2 },
      },
      x: -2.5,
      y: 2.5,
    },
    {
      id: "calm_appeal",
      name: "Calm Appeal",
      description:
        "When your Steadfast Challenge makes a target Disoriented, spend 1 focus to pacify them. Resisting your Steadfast Challenge costs additional focus equal to your ranks in Discipline.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["withering_retort"],
        skill: { id: "discipline", min: 2 },
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "peaceful_solution",
      name: "Peaceful Solution",
      description: "If all non-minion enemies are pacified, you ease tensions and end combat.",
      actionCost: "Free Action",
      requirements: {
        talents: ["calm_appeal"],
        skill: { id: "discipline", min: 3 },
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "well_dressed",
      name: "Well Dressed",
      description:
        "Gain Fashion expertise. While wearing Presentable armor or fashionable clothing, gain an advantage on your first Deception, Leadership, or Persuasion test.",
      actionCost: "Special Activation",
      requirements: { talents: ["steadfast_challenge"] },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "high_society_contacts",
      name: "High Society Contacts",
      description:
        "Gain High Society expertise. Spend 2 focus to add Opportunity to a test to interact in high society.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["well_dressed"],
        other: ["Patron in high society"],
      },
      x: -1.5,
      y: 3.5,
    },
    {
      id: "practiced_oratory",
      name: "Practiced Oratory",
      description:
        "When you use Rousing Presence or Steadfast Challenge, spend focus up to your ranks in Persuasion to add that many targets.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["high_society_contacts"],
        skill: { id: "persuasion", min: 3 },
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "collected",
      name: "Collected",
      description: "Increase your Cognitive and Spiritual defenses by 2.",
      actionCost: "Always Active",
      requirements: { talents: ["rousing_presence"] },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "faithful",
      name: "Faithful",
      description:
        "For Faithful, worship of the divine permeates their entire lives. They devote themselves to the traditions of their faith, demonstrating their convictions to others through word or deed.",
      isSubclass: true,
      x: 0,
      y: 0.75,
    },
    {
      id: "customary_garb",
      name: "Customary Garb",
      description:
        "While wearing Presentable armor or appropriate clothing, increase your Physical and Spiritual defenses by 2.",
      actionCost: "Always Active",
      requirements: { talents: ["rousing_presence"] },
      x: -0.5,
      y: 1.5,
    },
    {
      id: "devoted_presense",
      name: "Devoted Presence",
      description:
        "When you use Rousing Presence, spend 1 focus to remove Prone, Slowed, Stunned, and Surprised from your target.",
      actionCost: "Special Activation",
      requirements: { talents: ["customary_garb"], skill: { id: "lore", min: 1 } },
      x: -0.5,
      y: 2.5,
    },
    {
      id: "stalwart_presence",
      name: "Stalwart Presence",
      description: "When you use Rousing Presence, spend 1 focus to increase one of the target's defenses by 2.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["devoted_presense"],
        skill: { id: "discipline", min: 2 },
      },
      x: -0.5,
      y: 3.5,
    },
    {
      id: "sage_counsel",
      name: "Sage Counsel",
      description: "When you Aid a character, spend 1 focus to grant them Rousing Presence.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["stalwart_presence"],
        skill: { id: "lore", min: 3 },
      },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "inspired_zeal",
      name: "Inspired Zeal",
      description:
        "When an ally uses Determined, choose other allies to recover 1 focus, up to your ranks in Discipline.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["stalwart_presence"],
        skill: { id: "discipline", min: 3 },
      },
      x: 0.5,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "galvanize",
      name: "Galvanize",
      description: "An ally rolls their recovery die and recovers that much focus.",
      actionCost: "2 Actions",
      requirements: { talents: ["rousing_presence"] },
      x: 0.5,
      y: 1.5,
      detourDirection: "right",
    },
    {
      id: "composed",
      name: "Composed",
      description: "Increase your max and current focus by your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["galvanize"] },
      x: 0.5,
      y: 2.5,
    },
    {
      id: "applied_motivation",
      name: "Applied Motivation",
      description:
        "When you cause a character to recover focus, they recover additional focus equal to half your ranks in Lore.",
      actionCost: "Always Active",
      requirements: {
        talents: ["galvanize"],
        skill: { id: "discipline", min: 2 },
      },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "mentor",
      name: "Mentor",
      description:
        "More interested in the individual than the whole, Mentors devote themselves to their wards. They patiently nurture others toward greatness, seeing beyond doubts and deficits to stoke each person's potential.",
      isSubclass: true,
      x: 2,
      y: 0.75,
    },
    {
      id: "sound_advice",
      name: "Sound Advice",
      description: "Spend 1 focus to use Rousing Presence on an ally who failed a skill test.",
      actionCost: "Reaction",
      requirements: { talents: ["rousing_presence"] },
      x: 1.5,
      y: 1.5,
    },
    {
      id: "lessons_in_patience",
      name: "Lessons in Patience",
      description: "Gain Motivational Speech expertise. When you use Rousing Presence, your target recovers 1 focus.",
      actionCost: "Always Active",
      requirements: {
        talents: ["sound_advice"],
        skill: { id: "discipline", min: 2 },
      },
      x: 1.5,
      y: 2.5,
    },
    {
      id: "instill_confidence",
      name: "Instill Confidence",
      description: "Rousing Presence can make an ally Focused instead of _Determined.",
      actionCost: "Special Activation",
      requirements: { talents: ["lessons_in_patience"], other: ["A Companion"] },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "foresight",
      name: "Foresight",
      description: "Gain an additional Reaction each turn.",
      actionCost: "Always Active",
      requirements: {
        talents: ["instill_confidence"],
        skill: { id: "discipline", min: 3 },
      },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "practical_demonstration",
      name: "Practical Demonstration",
      description: "When you Gain Advantage or hit with an attack, use your Rousing Presence as a Free Action",
      actionCost: "Free Action",
      requirements: {
        talents: ["rousing_presence"],
        skill: { id: "leadership", min: 1 },
      },
      x: 2.5,
      y: 1.5,
    },
    {
      id: "mighty",
      name: "Mighty",
      description:
        "When you hit with a weapon or unarmed attack, for each Action spent, deal extra damage equal to 1 + your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["practical_demonstration"] },
      x: 2.5,
      y: 2.5,
    },
    {
      id: "guiding_oration",
      name: "Guiding Oration",
      description:
        "After you Gain Advantage, an ally within 10 feet of your target gains an advantage on their next test against your target.",
      actionCost: "Always Active",
      requirements: { talents: ["mighty"], skill: { id: "leadership", min: 2 } },
      x: 2.5,
      y: 3.5,
    },
    {
      id: "rallying_scout",
      name: "Rallying Scout",
      description:
        "Rousing Presence can revice an Unconscious ally, and if they have 0 health, they recover health equal to their recovery die + your ranks in Leadership.",
      actionCost: "Always Active",
      requirements: {
        talents: ["guiding_oration"],
        skill: { id: "leadership", min: 3 },
      },
      x: 2.5,
      y: 4.5,
    },
  ],
  edges: [
    { from: "rousing_presence", to: "diplomat" },
    { from: "diplomat", to: "steadfast_challenge" },
    { from: "rousing_presence", to: "steadfast_challenge", invisible: true },
    { from: "steadfast_challenge", to: "withering_retort" },
    { from: "withering_retort", to: "calm_appeal" },
    { from: "calm_appeal", to: "peaceful_solution" },
    { from: "steadfast_challenge", to: "well_dressed" },
    { from: "well_dressed", to: "high_society_contacts" },
    { from: "high_society_contacts", to: "practiced_oratory" },
    { from: "diplomat", to: "collected" },
    { from: "rousing_presence", to: "collected", invisible: true },
    { from: "rousing_presence", to: "faithful" },
    { from: "faithful", to: "customary_garb" },
    { from: "rousing_presence", to: "customary_garb", invisible: true },
    { from: "customary_garb", to: "devoted_presense" },
    { from: "devoted_presense", to: "stalwart_presence" },
    { from: "stalwart_presence", to: "sage_counsel" },
    { from: "stalwart_presence", to: "inspired_zeal" },
    { from: "faithful", to: "galvanize" },
    { from: "rousing_presence", to: "galvanize", invisible: true },
    { from: "galvanize", to: "composed" },
    { from: "galvanize", to: "applied_motivation" },
    { from: "applied_motivation", to: "inspired_zeal" },
    { from: "rousing_presence", to: "mentor" },
    { from: "mentor", to: "sound_advice" },
    { from: "rousing_presence", to: "sound_advice", invisible: true },
    { from: "sound_advice", to: "lessons_in_patience" },
    { from: "lessons_in_patience", to: "instill_confidence" },
    { from: "instill_confidence", to: "foresight" },
    { from: "mentor", to: "practical_demonstration" },
    { from: "rousing_presence", to: "practical_demonstration", invisible: true },
    { from: "practical_demonstration", to: "mighty" },
    { from: "mighty", to: "guiding_oration" },
    { from: "guiding_oration", to: "rallying_scout" },
  ],
  subclasses: ["diplomat", "faithful", "mentor"],
};

export const HunterTree: TalentTree = {
  nodes: [
    {
      id: "seek_quarry",
      name: "Seek Quarry",
      description:
        "Choose a character to be your quarry, gaining an advantage on tests to find, attack, and study them.",
      actionCost: "Special Activation",
      x: 0,
      y: 0,
    },
    {
      id: "archer",
      name: "Archer",
      isSubclass: true,
      description:
        "Targeting weak points in enemy army's assault, Archers shape the battlefield before the front-line confrontation. They steadily unleash a torrent of arrows to scatter and terrorize foes.",
      x: -2,
      y: 0.75,
    },
    {
      id: "tagging_shot",
      name: "Tagging Shot",
      description: "Move 5 feet and make a ranged attack. On a hit or a graze, the target becomes your quarry.",
      actionCost: "3 Actions",
      requirements: {
        talents: ["seek_quarry"],
        skill: { id: "perception", min: 2 },
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "sharp_eye",
      name: "Sharp Eye",
      description:
        "Observe a target then test Perception vs Cognitive to learn their lowest attribute, lowest defense, or if their health, focus, or Investiture are below half.",
      actionCost: "Special Activation",
      requirements: { talents: ["tagging_shot"] },
      x: -2.5,
      y: 2.5,
    },
    {
      id: "exploit_weakness",
      name: "Exploit Weakness",
      description: "Gain Advantage on your quarry without spending an Action.",
      actionCost: "Free Action",
      requirements: {
        talents: ["sharp_eye"],
        skill: { id: "perception", min: 3 },
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "combat_training",
      name: "Combat Training",
      description:
        "Gain expertise in a weapon, an armor, and Military Life. Once per round, graze without spending focus.",
      actionCost: "Special Activation",
      requirements: { talents: ["seek_quarry"] },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "steady_aim",
      name: "Steady Aim",
      description: "Increase your weapon range by half and deal extra damage equal to your ranks in Perception.",
      actionCost: "1 Action",
      requirements: {
        talents: ["combat_training"],
        skill: { id: "agility", min: 1 },
      },
      x: -1.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "backstep",
      name: "Backstep",
      description:
        "After making a ranged attack, spend 2 focus to Disengage without spending an Action, and Brace if you enter cover or obscured area.",
      actionCost: "Free Action",
      requirements: { talents: ["steady_aim"], skill: { id: "agility", min: 2 } },
      x: -1.5,
      y: 3.5,
    },
    {
      id: "hardy",
      name: "Hardy",
      description: "Gain +1 max health per level (including previous levels).",
      actionCost: "Always Active",
      requirements: { talents: ["steady_aim"] },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "unrelenting_salvo",
      name: "Unrelenting Salvo",
      description: "You can Strike your quarry more than once per turn with the same ranged weapon",
      actionCost: "Always Active",
      requirements: { talents: ["hardy"], skill: { id: "agility", min: 3 } },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "assassin",
      name: "Assassin",
      isSubclass: true,
      description:
        "Whether commissioned to kill or driven by their own interests, Assassins exploit weakness to quickly incapacitate their quarry.",
      x: 0,
      y: 0.75,
    },
    {
      id: "startling_blow",
      name: "Startling Blow",
      description:
        "Make an unarmed or improvised weapon attack vs. Cognitive. On a hit or graze, the target is Surprised.",
      actionCost: "1 Action",
      requirements: { talents: ["seek_quarry"], skill: { id: "stealth", min: 1 } },
      x: -0.5,
      y: 1.5,
    },
    {
      id: "fatal_thrust",
      name: "Fatal Thrust",
      description:
        "Attack an unsuspecting target with a light melee weapon vs Cognitive. Add 4d4 damage, and gain two advantages if the weapon is Discreet. Max damage rolls add a penalty to the injury roll.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["startling_blow"],
        skill: { id: "perception", min: 3 },
      },
      x: -0.5,
      y: 2.5,
    },
    {
      id: "killing_edge",
      name: "Killing Edge",
      description: "Gain Knives and Slings expertises. These weapons gain the Deadly and Quickdraw expert traits.",
      actionCost: "Always Active",
      requirements: {
        talents: ["seek_quarry"],
        skill: { id: "perception", min: 2 },
      },
      x: 0.5,
      y: 1.5,
    },
    {
      id: "shadowing",
      name: "Shadowing",
      description:
        "Your quarry gains a disadvantage to sense you, and you gain an advantage to avoid their notice. When you succeed vs. Spiritual while in cover or obscured, spend 3 focus to designate that target as your quarry.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["killing_edge"],
        skill: { id: "stealth", min: 2 },
      },
      x: 0.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "cold_eyes",
      name: "Cold Eyes",
      description: "After you defeat your quarry, recover 1 focus and choose a new quarry.",
      actionCost: "Always Active",
      requirements: { talents: ["shadowing"] },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "mighty",
      name: "Mighty",
      description:
        "When you hit with a weapon or unarmed attack, for each Action spent, deal extra damage equal to 1 + your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["cold_eyes"] },
      x: -0.5,
      y: 3.5,
    },
    {
      id: "swift_strikes",
      name: "Swift Strikes",
      description: "Spend 1 focus to make a second Strike with the same weapon.",
      actionCost: "1 Action",
      requirements: { talents: ["cold_eyes"] },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "sidestep",
      name: "Sidestep",
      description: "Gain and additional Reaction to Dodge when you're not wearing armor with deflect of 2 or higher.",
      actionCost: "Special Activation",
      requirements: { talents: ["shadowing"], skill: { id: "stealth", min: 3 } },
      x: 0.5,
      y: 4.5,
    },
    {
      id: "tracker",
      name: "Tracker",
      isSubclass: true,
      description:
        "In untamed wilds, none are more capable than Trackers. With trusty animal companions at their sides, they scrounge provisions, deftly cross unfriendly terrain, and set perilous traps.",
      x: 2,
      y: 0.7,
    },
    {
      id: "deadly_trap",
      name: "Deadly Trap",
      description: "Conceal a 5-foot Entangling Trap or Impaling Trap",
      actionCost: "2 Actions",
      requirements: {
        talents: ["seek_quarry"],
        skill: { id: "survival", min: 1 },
      },
      x: 1.5,
      y: 1.5,
    },
    {
      id: "experienced_trapper",
      name: "Experienced Trapper",
      description:
        "You easily forage for characters up to your ranks in Survival. You can fashion natural tools using Survival. Your Deadly Traps increase to 2d6 damage and 2 rounds duration.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["deadly_trap"],
        skill: { id: "perception", min: 2 },
      },
      x: 1.5,
      y: 2.5,
      detourDirection: "left",
    },
    {
      id: "surefooted",
      name: "Surefooted",
      description:
        "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["experienced_trapper"] },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "hunters_edge",
      name: "Hunter's Edge",
      description:
        "Your animal companion gains an advantage against your quarry. Your Deadly Traps increase to 2d8 damage and 3 rounds duration.",
      actionCost: "Always Active",
      requirements: {
        talents: ["experienced_trapper"],
        skill: { id: "survival", min: 3 },
      },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "animal_bond",
      name: "Animal Bond",
      description:
        "While your companion is whithin 10 feet, your defenses increase by 1. Use a Free Action to give your companion 1 Action or 2 Actions on your turn. They use Track as 2 Actions: One target within your companion's reach becomes your quarry.",
      actionCost: "Special Activation",
      requirements: { talents: ["seek_quarry"], other: ["Animal companion"] },
      x: 2.5,
      y: 1.5,
    },
    {
      id: "protective_bond",
      name: "Protective Bond",
      description:
        "Your animal companion protects an ally within 30 feet of you, and that ally gains your Animal Bond bonus instead of you.",
      actionCost: "1 Action",
      requirements: { talents: ["animal_bond"] },
      x: 2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "feral_connection",
      name: "Feral Connection",
      description:
        "Gain expertise in Animal Care. Your animal companion's health increases by 5x your tier, their defenses increase by 2, and their tests gain a bonus equal to your ranks in Survival.",
      actionCost: "Always Active",
      requirements: {
        talents: ["protective_bond"],
        skill: { id: "survival", min: 2 },
      },
      x: 2.5,
      y: 3.5,
    },
    {
      id: "pack_hunting",
      name: "Pack Hunting",
      description:
        "Spend 1 focus to add your ranks in Survival to your ally's attack or damage roll against your quarry.",
      actionCost: "Reaction",
      requirements: {
        talents: ["protective_bond"],
        skill: { id: "perception", min: 3 },
      },
      x: 2.5,
      y: 4.5,
    },
  ],
  edges: [
    { from: "seek_quarry", to: "archer" },
    { from: "archer", to: "tagging_shot" },
    { from: "seek_quarry", to: "tagging_shot", invisible: true },
    { from: "tagging_shot", to: "sharp_eye" },
    { from: "sharp_eye", to: "exploit_weakness" },
    { from: "archer", to: "combat_training" },
    { from: "seek_quarry", to: "combat_training", invisible: true },
    { from: "combat_training", to: "steady_aim" },
    { from: "steady_aim", to: "backstep" },
    { from: "steady_aim", to: "hardy" },
    { from: "hardy", to: "unrelenting_salvo" },
    { from: "seek_quarry", to: "assassin" },
    { from: "assassin", to: "startling_blow" },
    { from: "seek_quarry", to: "startling_blow", invisible: true },
    { from: "startling_blow", to: "fatal_thrust" },
    { from: "assassin", to: "killing_edge" },
    { from: "seek_quarry", to: "killing_edge", invisible: true },
    { from: "killing_edge", to: "shadowing" },
    { from: "shadowing", to: "cold_eyes" },
    { from: "cold_eyes", to: "mighty" },
    { from: "cold_eyes", to: "swift_strikes" },
    { from: "shadowing", to: "sidestep" },
    { from: "seek_quarry", to: "tracker" },
    { from: "tracker", to: "deadly_trap" },
    { from: "seek_quarry", to: "deadly_trap", invisible: true },
    { from: "deadly_trap", to: "experienced_trapper" },
    { from: "experienced_trapper", to: "surefooted" },
    { from: "experienced_trapper", to: "hunters_edge" },
    { from: "tracker", to: "animal_bond" },
    { from: "seek_quarry", to: "animal_bond", invisible: true },
    { from: "animal_bond", to: "protective_bond" },
    { from: "protective_bond", to: "feral_connection" },
    { from: "protective_bond", to: "pack_hunting" },
  ],
  subclasses: ["archer", "assassin", "trapper"],
};

export const LeaderTree: TalentTree = {
  nodes: [
    {
      id: "decisive_command",
      name: "Decisive Command",
      description:
        "Spend 1 focus to give an ally within 20 feet a d4 command die. They can add it to one die roll on their next test.",
      actionCost: "1 Action",
      x: 0,
      y: 0,
    },
    {
      id: "champion",
      name: "Champion",
      description:
        "Inspiring others through unfaltering grit, Champions ferociously charge their foes. Their momentum is magnetic, rallying nearby allies to press on.",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "combat_coordination",
      name: "Combat Coordination",
      description:
        "After you Strike, use Decisive Command without spending an Action. If your Strike didn't hit, you also don't spend focus.",
      actionCost: "Free Action",
      requirements: {
        talents: ["decisive_command"],
        skill: { id: "leadership", min: 2 },
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "imposing_posture",
      name: "Imposing Posture",
      description: "After an enemy resists your influence while in your weapon's reach, they are Disoriented.",
      actionCost: "Always Active",
      requirements: {
        talents: ["combat_coordination"],
        skill: { id: "athletics", min: 2 },
      },
      x: -2.5,
      y: 2.5,
    },
    {
      id: "mighty",
      name: "Mighty",
      description:
        "When you hit with a weapon or unarmed attack, for each Action spent, deal extra damage equal to 1+ your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["imposing_posture"] },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "valiant_intervention",
      name: "Valiant Intervention",
      description:
        "Spend 1 focus to move 10 feet, then test Athletics vs. Spiritual to give a target a disadvantage on tests against your allies.",
      actionCost: "1 Action",
      requirements: {
        talents: ["decisive_command"],
        skill: { id: "athletics", min: 1 },
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "hardy",
      name: "Hardy",
      description: "Gain +1 max health per level (including previous levels).",
      actionCost: "Always Active",
      requirements: { talents: ["valiant_intervention"] },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "resolute_stand",
      name: "Resolute Stand",
      description:
        "Valiant Intervention prevents Reactive Strikes. Spend focus up to your ranks in Leadership to add that many targets for Valiant Intervention.",
      actionCost: "Special Activation",
      requirements: { talents: ["hardy"], skill: { id: "athletics", min: 1 } },
      x: -1.5,
      y: 3.5,
    },
    {
      id: "resilient_hero",
      name: "Resilient Hero",
      description: "Before your health drops to 0, it instead becomes equal to your Athletics modifier.",
      actionCost: "Reaction",
      requirements: {
        talents: ["resolute_stand"],
        skill: { id: "athletics", min: 3 },
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "demonstrative_command",
      name: "Demonstrative Command",
      description:
        "Increase the size of your command die. Spend 1 focus to add your command die to your Athletic, Agility, or Leadership d20 roll.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["resolute_stand"],
        skill: { id: "leadership", min: 2 },
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "officer",
      name: "Officer",
      description:
        "Officers cooly maintain order in utter chaos. They allocate resources and issue commands, orchestration the march to victory.",
      isSubclass: true,
      x: 0,
      y: 0.75,
    },
    {
      id: "composed",
      name: "Composed",
      description: "Increase your max and current focus by your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["decisive_command"] },
      x: -0.5,
      y: 1.5,
    },
    {
      id: "well_supplied",
      name: "Well Supplied",
      description:
        "Gain Military Logistics expertise. Spend 2 focus to add Opportunity to your test to requisition resources",
      actionCost: "Special Activation",
      requirements: { talents: ["composed"], skill: { id: "persuasion", min: 2 } },
      x: -0.5,
      y: 2.5,
    },
    {
      id: "through_the_fray",
      name: "Through the Fray",
      description: "An ally within 20 feet can Disengage or Gain Advantage as a Reaction.",
      actionCost: "1 Action",
      requirements: {
        talents: ["decisive_command"],
        skill: { id: "persuasion", min: 1 },
      },
      x: 0.5,
      y: 1.5,
    },
    {
      id: "customary_garb",
      name: "Customary Garb",
      description:
        "While wearing Presentable armor or appropriate clothing, increase your Physical and Spiritual defenses by 2.",
      actionCost: "Always Active",
      requirements: { talents: ["through_the_fray"] },
      x: 0.5,
      y: 2.5,
    },
    {
      id: "confident_command",
      name: "Confident Command",
      description:
        "Increase the size of your command die. Spend 1 focus to add your command die to your Intimidation, Leadership, or Persuasion d20 roll.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["cusomary_garb"],
        skill: { id: "leadership", min: 2 },
      },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "relentless_march",
      name: "Relentless March",
      description:
        "Decisive Command increases your target's movement by 10 feet, and they ignore Exhausted, Slowed, and Surprised.",
      actionCost: "Always Active",
      requirements: {
        talents: ["confident_command"],
        skill: { id: "persuasion", min: 3 },
      },
      x: -0.5,
      y: 3.5,
    },
    {
      id: "authority",
      name: "Authority",
      description: "Double the range of Leader talents that affect allies, and double the number of allies affected.",
      actionCost: "Always Active",
      requirements: {
        talents: ["confident_command"],
        other: ["Title granting you command of 5+ people"],
      },
      x: 0.5,
      y: 4.5,
    },
    {
      id: "synchronized_assault",
      name: "Synchronized Assault",
      description:
        "Spend 2 focus to test Leadership vs. enemy's Cognitive. On success, allies up to your ranks in Leadership gain 1 Action for an additional Strike against the target. On failure, only one ally gains an Action.",
      actionCost: "3 Actions",
      requirements: {
        talents: ["authority"],
        skill: { id: "leadership", min: 3 },
      },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "politico",
      name: "Politico",
      description:
        "With a penchant for theatrics, Politicos chase favor and prestige while subtly undermining their enemies",
      isSubclass: true,
      x: 2,
      y: 0.75,
    },
    {
      id: "cutthroat_tactics",
      name: "Cutthroat Tactics",
      description:
        "Your ally can raise the stakes instead of rolling your command die; if they roll Complication, you recover 1 focus.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["decisive_command"],
        skill: { id: "deception", min: 1 },
      },
      x: 1.5,
      y: 1.5,
    },
    {
      id: "rumormonger",
      name: "Rumormonger",
      description:
        "Gain Scandal expertise. Spend 2 focus to add Opportunity when you make a test to spread misinformation or gather rumors.",
      actionCost: "Special Activation",
      requirements: { talents: ["cutthroat_tactics"], other: ["A patron"] },
      x: 1.5,
      y: 2.5,
      detourDirection: "left",
    },
    {
      id: "shrewd_command",
      name: "Shrewd Command",
      description:
        "Increase the size of your command die. Spend 1 focus to add your command die to your Deception, Insight, or Leadership d20 roll.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["rumormonger"],
        skill: { id: "leadership", min: 2 },
      },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "grand_deception",
      name: "Grand Deception",
      description: "Spend 3 focus to test Deception (DC 15) to reveal a ruse that changes a detail.",
      actionCost: "3 Actions",
      requirements: {
        talents: ["shrewd_command"],
        skill: { id: "deception", min: 3 },
      },
      x: 2.5,
      y: 4.5,
    },
    {
      id: "baleful",
      name: "Baleful",
      description: "To resist your influence, a character must spend additional focus equal to your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["rumormonger"] },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "set_at_odds",
      name: "Set at Odds",
      description:
        "Spend focus equal to the number of targets you want to seed division among. Test Leadership vs. their highest Spiritual to make them hostile to each other.",
      actionCost: "2 Actions",
      requirements: { talents: ["baleful"], skill: { id: "leadership", min: 3 } },
      x: 2.5,
      y: 3.5,
    },
    {
      id: "well_dressed",
      name: "Well Dressed",
      description:
        "Gain Fashion expertise. While wearing Presentable armor or fashionable clothing, gain an advantage on your first Deception, Leadership, or Persuasion test.",
      actionCost: "Special Activation",
      requirements: { talents: ["rumormonger"] },
      x: 2.5,
      y: 2.5,
    },
    {
      id: "tactical_ploy",
      name: "Tactical Ploy",
      description:
        "Test Deception vs. Cognitive to make your target lose one Reaction and gain a disadvantage on their next cognitive or spiritual test.",
      actionCost: "1 Action",
      requirements: { talents: ["decisive_command"] },
      x: 2.5,
      y: 1.5,
    },
  ],
  edges: [
    { from: "decisive_command", to: "champion" },
    { from: "champion", to: "combat_coordination" },
    { from: "decisive_command", to: "combat_coordination", invisible: true },
    { from: "combat_coordination", to: "imposing_posture" },
    { from: "imposing_posture", to: "mighty" },
    { from: "champion", to: "valiant_intervention" },
    { from: "decisive_command", to: "valiant_intervention", invisible: true },
    { from: "valiant_intervention", to: "hardy" },
    { from: "hardy", to: "resolute_stand" },
    { from: "resolute_stand", to: "resilient_hero" },
    { from: "resolute_stand", to: "demonstrative_command" },
    { from: "decisive_command", to: "officer" },
    { from: "officer", to: "composed" },
    { from: "decisive_command", to: "composed", invisible: true },
    { from: "composed", to: "well_supplied" },
    { from: "decisive_command", to: "well_supplied", invisible: true },
    { from: "officer", to: "through_the_fray" },
    { from: "through_the_fray", to: "customary_garb" },
    { from: "customary_garb", to: "confident_command" },
    { from: "confident_command", to: "relentless_march" },
    { from: "confident_command", to: "authority" },
    { from: "authority", to: "synchronized_assault" },
    { from: "decisive_command", to: "politico" },
    { from: "politico", to: "cutthroat_tactics" },
    { from: "decisive_command", to: "cutthroat_tactics", invisible: true },
    { from: "cutthroat_tactics", to: "rumormonger" },
    { from: "rumormonger", to: "shrewd_command" },
    { from: "shrewd_command", to: "grand_deception" },
    { from: "rumormonger", to: "baleful" },
    { from: "baleful", to: "set_at_odds" },
    { from: "rumormonger", to: "well_dressed" },
    { from: "politico", to: "tactical_ploy" },
    { from: "decisive_command", to: "tactical_ploy", invisible: true },
  ],
  subclasses: ["champion", "officer", "politico"],
};

export const ScholarTree: TalentTree = {
  nodes: [
    {
      id: "erudition",
      name: "Erudition",
      description:
        "Temporarily gain a cultural or utility expertise and a rank in two non-surge cognitive skills. Reassign these after a long rest with library access.",
      actionCost: "Special Activation",
      x: 0,
      y: 0,
    },
    {
      id: "artifabrian",
      name: "Artifabrian",
      description:
        "Combining science, engineering, and artistry, Artifabrians use polestones and metal casings to construct fabrials that perform precise functions.",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "efficient_engineer",
      name: "Efficient Engineer",
      description:
        "Gain expertise in Armor Crafting, Equipment Crafting, or Weapon Crafting, and gain a fabrial. When crafting, your Opportunity Range expands by 2 and your material cost is halved.",
      actionCost: "Always Active",
      requirements: { talents: ["erudition"], skill: { id: "crafting", min: 1 } },
      x: -2.5,
      y: 1.5,
      detourDirection: "left",
    },
    {
      id: "deep_study",
      name: "Deep Study",
      description:
        "Erudition grants you an additional cultural or utility expertise and two additional non-surge cognitive skills.",
      actionCost: "Always Active",
      requirements: { talents: ["efficient_engineer"] },
      x: -2.5,
      y: 2.5,
    },
    {
      id: "fine_handiwork",
      name: "Fine Handiwork",
      description: "When crafting, advanced features cost one upgrade instead of two.",
      actionCost: "Special Activation",
      requirements: { talents: ["efficient_engineer"] },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "experimental_tinkering",
      name: "Experimental Tinkering",
      description:
        "When crafting, your Opportunity Range expands by 1 and your crafting time is halved. During a long rest, you can reconfigure your Prized Acquisition fabrial to a different fabrial.",
      actionCost: "Special Activation",
      requirements: { talents: ["fine_handiwork"] },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "overwhelm_with_details",
      name: "Overwhelm with Details",
      description: "Spend 2 focus to use your Lore modifier on another cognitive or spiritual test.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["experimental_tinkering"],
        skill: { id: "lore", min: 3 },
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "prized_acquisition",
      name: "Prized Acquisition",
      description:
        "Gain Fabrial Crafting expertise. Gain a special gem you can immediately use to craft a fabrial of your tier. You can reuse this gem for new fabrials.",
      actionCost: "Special Activation",
      requirements: { talents: ["erudition"] },
      x: -1.5,
      y: 1.5,
      detourDirection: "right",
    },
    {
      id: "inventive_design",
      name: "Inventive Design",
      description:
        "Your Prized Acquisition fabrial can have an effect 1 tier higher than the tier you'r currently crafting.",
      actionCost: "Always Active",
      requirements: {
        talents: ["prized_acquisition"],
        skill: { id: "crafting", min: 2 },
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "overcharge",
      name: "Overcharge",
      description:
        "Once per turn, you can raise the stakes on a fabrial attack, then spend Opportunity to Strike with the fabrial as a Free Action.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["prized_acquisition"],
        skill: { id: "crafting", min: 3 },
      },
      x: -1.5,
      y: 3.5,
    },
    {
      id: "strategist",
      name: "Strategist",
      description: "Always three steps ahead, Strategists know timing is everything and make it work to their benefit.",
      isSubclass: true,
      x: 0,
      y: 0.75,
    },
    {
      id: "strategize",
      name: "Strategize",
      description:
        "After you Gain Advantage using an Erudition skill, grant that advantage to an ally instead. You can spend 2 focus to also prevent the target from using reactions agains that ally.",
      actionCost: "Special Activation",
      requirements: { talents: ["erudition"], skill: { id: "deduction", min: 1 } },
      x: -0.5,
      y: 1.5,
    },
    {
      id: "composed",
      name: "Composed",
      description: "Increase your max and current focus by your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["strategize"] },
      x: -0.5,
      y: 2.5,
      detourDirection: "left",
    },
    {
      id: "deep_contemplation",
      name: "Deep Contemplation",
      description: "Reassign up to 2 skills and expertises from Erudition.",
      actionCost: "2 Actions",
      requirements: { talents: ["composed"], skill: { id: "lore", min: 2 } },
      x: -0.5,
      y: 3.5,
    },
    {
      id: "keen_insight",
      name: "Keen Insight",
      description:
        "After you Gain Advantage, the target must resist your influence or gain a disadvantage on their next test.",
      actionCost: "Always Active",
      requirements: { talents: ["deep_contemplation"] },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "contingency",
      name: "Contingency",
      description: "Spend 2 focus to remove Complication from the test of an ally within 20 feet.",
      actionCost: "Reaction",
      requirements: { talents: ["composed"], skill: { id: "lore", min: 3 } },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "turning_point",
      name: "Turning Point",
      description:
        "Spend 2 focus to test Deduction vs. Cognitive of the enemy leader, gaining an advantage if you took a slow turn. On success, you and your allies gain an Action on your next turns.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["contingency"],
        skill: { id: "crafting", min: 1 },
      },
      x: 0.5,
      y: 4.5,
    },
    {
      id: "mind_and_body",
      name: "Mind and Body",
      description:
        "Gain a weapon expertise. Gain an additional skill from Erudition. You can now choose physical skills with Erudition.",
      actionCost: "Always Active",
      requirements: { talents: ["erudition"] },
      x: 0.5,
      y: 1.5,
    },
    {
      id: "know_your_moment",
      name: "Know Your Moment",
      description: "Your defenses increase by 2 from the start of each round until you take your turn.",
      actionCost: "Always Active",
      requirements: {
        talents: ["mind_and_body"],
        skill: { id: "deduction", min: 2 },
      },
      x: 0.5,
      y: 2.5,
    },
    {
      id: "surgeon",
      name: "Surgeon",
      description: "Qualified Surgeons apply their knowledge and empathy to heal the unwell and save lives.",
      isSubclass: true,
      x: 2,
      y: 0.75,
    },
    {
      id: "field_medicine",
      name: "Field Medicine",
      description:
        "Spend 1 focus and test Medicine (DC 15) to heal a consious character. On success, add your ranks in Medicine to their recovery die.",
      actionCost: "1 Action",
      requirements: { talents: ["erudition"], skill: { id: "medicine", min: 1 } },
      x: 1.5,
      y: 1.5,
      detourDirection: "left",
    },
    {
      id: "anatomical_insight",
      name: "Anatomical Insight",
      description:
        "When you hit with an unarmed attack, spend 1 focus or Opportunity to make the target Exhausted [- half your ranks in Medicine].",
      actionCost: "Special Activation",
      requirements: { talents: ["field_medicine"] },
      x: 1.5,
      y: 2.5,
    },
    {
      id: "swift_healer",
      name: "Swift Healer",
      description:
        "Use Field Medicine as a Free Action. Your healing abilities restore additional health equal to your ranks in Medicine.",
      actionCost: "Free Action",
      requirements: {
        talents: ["field_medicine"],
        skill: { id: "medicine", min: 2 },
      },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "ongoing_care",
      name: "Ongoing Care",
      description:
        "Gain Mental Health Care expertise. During a rest, test Medicine (DC 10) to treat an ally, removing one condition caused by their injury.",
      actionCost: "Special Activation",
      requirements: { talents: ["swift_healer"], skill: { id: "lore", min: 3 } },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "resuscitation",
      name: "Resuscitation",
      description:
        "Spend 3 focus when using Field Medicine to revive an Unconscious character or one who died recently.",
      actionCost: "Special Activation",
      requirements: { talents: ["ongoing_care"], skill: { id: "medicine", min: 3 } },
      x: 2.5,
      y: 4.5,
    },
    {
      id: "emotional_intelligence",
      name: "Emotional Intelligence",
      description:
        "Gain Diagnosis expertise. Gain an additional skill from Erudition. You can now choose spiritual skills with Erudition.",
      actionCost: "Always Active",
      requirements: { talents: ["erudition"] },
      x: 2.5,
      y: 1.5,
    },
    {
      id: "collected",
      name: "Collected",
      description: "Increase your Cognitive and Spiritual defenses by 2.",
      actionCost: "Always Active",
      requirements: { talents: ["emotional_intelligence"] },
      x: 2.5,
      y: 2.5,
    },
    {
      id: "applied_medicine",
      name: "Applied Medicine",
      description: "Your healing abilities restore additional health equal to your ranks in Lore.",
      actionCost: "Always Active",
      requirements: { talents: ["collected"], skill: { id: "lore", min: 2 } },
      x: 2.5,
      y: 3.5,
    },
  ],
  edges: [
    { from: "erudition", to: "artifabrian" },
    { from: "artifabrian", to: "efficient_engineer" },
    { from: "erudition", to: "efficient_engineer", invisible: true },
    { from: "efficient_engineer", to: "deep_study" },
    { from: "efficient_engineer", to: "fine_handiwork" },
    { from: "fine_handiwork", to: "experimental_tinkering" },
    { from: "experimental_tinkering", to: "overwhelm_with_details" },
    { from: "artifabrian", to: "prized_acquisition" },
    { from: "erudition", to: "prized_acquisition", invisible: true },
    { from: "prized_acquisition", to: "inventive_design" },
    { from: "prized_acquisition", to: "overcharge" },
    { from: "erudition", to: "strategist" },
    { from: "strategist", to: "strategize" },
    { from: "erudition", to: "strategize", invisible: true },
    { from: "strategize", to: "composed" },
    { from: "composed", to: "deep_contemplation" },
    { from: "deep_contemplation", to: "keen_insight" },
    { from: "composed", to: "contingency" },
    { from: "contingency", to: "turning_point" },
    { from: "strategist", to: "mind_and_body" },
    { from: "erudition", to: "mind_and_body", invisible: true },
    { from: "mind_and_body", to: "know_your_moment" },
    { from: "erudition", to: "surgeon" },
    { from: "surgeon", to: "field_medicine" },
    { from: "erudition", to: "field_medicine", invisible: true },
    { from: "field_medicine", to: "anatomical_insight" },
    { from: "field_medicine", to: "swift_healer" },
    { from: "swift_healer", to: "ongoing_care" },
    { from: "ongoing_care", to: "resuscitation" },
    { from: "surgeon", to: "emotional_intelligence" },
    { from: "erudition", to: "emotional_intelligence", invisible: true },
    { from: "emotional_intelligence", to: "collected" },
    { from: "collected", to: "applied_medicine" },
  ],
  subclasses: ["artifabrian", "strategist", "surgeon"],
};

export const WarriorTree: TalentTree = {
  nodes: [
    {
      id: "vigilant_stance",
      name: "Vigilant Stance",
      description:
        "Enter Vigilant Stance: Reduce the focus cost of Dodge and Reactive Strike by 1, and you can enter other stances as a Free Action.",
      actionCost: "1 Action",
      x: 0,
      y: 0,
    },
    {
      id: "duelist",
      name: "Duelist",
      description:
        "In the inner circles of the elite, skilled Duelists contend for glory and political sway, wielding their weapons with brutal grace.",
      isSubclass: true,
      x: -2,
      y: 0.6,
    },
    {
      id: "practiced_kata",
      name: "Practiced Kata",
      description:
        " You can now use stances in conversations and endeavors, and unless Surprised, you can start each scene in Vigilant Stance. Spend 1 focus to enter a stance mid-conversation or mid-endeavor.",
      actionCost: "Special Activation",
      requirements: { talents: ["vigilant_stance"] },
      x: -2.5,
      y: 1.3,
    },
    {
      id: "ironstance",
      name: "Ironstance",
      description:
        "Enter Ironstance: You gain an advantage on Insight, and when you're grazed or missed, you can make a Reactive Strike against your attacker.",
      actionCost: "1 Action",
      requirements: {
        talents: ["practiced_kata"],
        skill: { id: "athletics", min: 2 },
      },
      x: -2.5,
      y: 2.3,
    },
    {
      id: "surefooted",
      name: "Surefooted",
      description:
        "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["ironstance"] },
      x: -2.5,
      y: 3.3,
    },
    {
      id: "flamestance",
      name: "Flamestance",
      description:
        "Enter Flamestance: You gain an advantage on Intimidation, and when only one enemy is in reach and no allies are, gain an Action to attack or Gain Advantage.",
      actionCost: "1 Action",
      requirements: {
        talents: ["vigilant_stance"],
        skill: { id: "intimidation", min: 1 },
      },
      x: -1.5,
      y: 1.3,
      detourDirection: "right",
    },
    {
      id: "signature_weapon",
      name: "Signature Weapon",
      description:
        "Gain a weapon expertise. Choose one of your weapon expertises, expanding its Opportunity Range by 1.",
      actionCost: "Always Active",
      requirements: { talents: ["flamestance"] },
      x: -1.5,
      y: 2.2,
    },
    {
      id: "feinting_strike",
      name: "Feinting Strike",
      description:
        "Spend 2 focus to move half your movement then make a melee weapon attack vs. Cognitive. On a hit, your target loses Reaction and loses focus equal to your ranks in Intimidation. On a graze, they lose half as much focus.",
      actionCost: "1 Action",
      requirements: {
        talents: ["flamestance"],
        skill: { id: "intimidation", min: 2 },
      },
      x: -1.5,
      y: 3.2,
    },
    {
      id: "vinestance",
      name: "Vinestance",
      description:
        "Enter Vinestance: Your Physical and Cognitive defenses increase by 1. After you're hit or grazed in melee, spend a Reaction to test Athletics vs. Cognitive to make attacker lose 1d4 focus and be pushed.",
      actionCost: "1 Action",
      requirements: {
        talents: ["feinting_strike"],
        skill: { id: "athletics", min: 3 },
      },
      x: -2.5,
      y: 4.3,
    },
    {
      id: "wits_end",
      name: "Wit's End",
      description:
        "Spend 1 focus to move half your movement then make a melee weapon attack vs Cognitive of a target who has 0 focus. This attack ignores deflect, deals an extra 4d6 damage and can't graze.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["feinting_strike"],
        skill: { id: "intimidation", min: 3 },
      },
      x: -1.5,
      y: 4.3,
    },
    {
      id: "shardbearer",
      name: "Shardbearer",
      description:
        "Warriors fortunate enough to own (or borrow) Shardblades and Shardplate serve as Shardbearers. They wield these arms and armor of ancient provenance to dominate the battlefield with mythic might.",
      isSubclass: true,
      x: 0,
      y: 0.6,
    },
    {
      id: "shard_training",
      name: "Shard Training",
      description:
        "Gain Shardplate expertise, and gain either Grandbow, Shardblade, or Warhammer expertise. Your Shardplate has 2 additional charges. Your Shardblade Strikes graze additional targets up to your ranks in the skill used.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["vigilant_stance"],
        other: ["Access to a Shardblade and Shardplate"],
      },
      x: -0.5,
      y: 1.4,
    },
    {
      id: "windstance",
      name: "Windstance",
      description:
        "Enter Windstance: Gain an advantage on Agility. While you can reach multiple enemies, use Free Action to Gain 1 Action to Disengage or attack.",
      actionCost: "1 Action",
      requirements: {
        talents: ["shard_training"],
        skill: { id: "perception", min: 1 },
      },
      x: -0.5,
      y: 2.5,
    },
    {
      id: "shattering_blow",
      name: "Shattering Blow",
      description:
        "When you hit with a melee attack, spend 2 focus to deplete 1 charge from their armor, and each target you damage is pushed 5 feet.",
      actionCost: "Special Activation",
      requirements: {
        talents: ["windstance"],
        skill: { id: "perception", min: 2 },
      },
      x: -0.5,
      y: 3.4,
    },
    {
      id: "precise_parry",
      name: "Precise Parry",
      description:
        "Before being hit in melee, spend 1 focus to attempt to turn it into a graze. If unarmed, test Athletics vs. triggering attack, gaining a disadvantage unless attacked by a Shardblade. If armed, test Light/Heavy Weaponry vs. triggering attack.",
      actionCost: "Reaction",
      requirements: {
        talents: ["shattering_blow"],
        skill: { id: "perception", min: 3 },
      },
      x: -0.5,
      y: 4.5,
    },
    {
      id: "bloodstance",
      name: "Bloodstance",
      description:
        "Enter Bloodstance: Your Opportunity Range for attacks and physical tests expands by 2, but your Physical, Cognitive, and Spiritual defenses decrease by 2.",
      actionCost: "1 Action",
      requirements: {
        talents: ["shard_training"],
        skill: { id: "athletics", min: 2 },
      },
      x: 0.5,
      y: 3.5,
    },
    {
      id: "meteoric_leap",
      name: "Meteoric Leap",
      description:
        "Spend 2 focus to leap a quarter of your movement and make unarmed attack vs. Physical of multiple targets, doubling damage and knocking weaker targets Prone. Gain an advantage in Shardplate.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["bloodstance"],
        skill: { id: "athletics", min: 3 },
      },
      x: 0.5,
      y: 4.6,
    },
    {
      id: "stonestance",
      name: "Stonestance",
      description:
        "Enter Stonestance: Your deflect increases by 1, and enemies within your reach must spend an additional Action to attack your allies who aren't in Stonestance.",
      actionCost: "1 Action",
      requirements: { talents: ["vigilant_stance"] },
      x: 0.5,
      y: 1.5,
    },
    {
      id: "mighty",
      name: "Mighty",
      description:
        "When you hit with a weapon or unarmed attack, for each Action spent, deal extra damage equal to 1 + your tier.",
      actionCost: "Always Active",
      requirements: { talents: ["stonestance"] },
      x: 0.5,
      y: 2.5,
    },
    {
      id: "soldier",
      name: "Soldier",
      description:
        "The most common of fighting forces, Soldiers form the bulk of Roshar's massive armies. They master the tactics needed to fight effectively in units and stay alive in a deadly world.",
      isSubclass: true,
      x: 2,
      y: 0.8,
    },
    {
      id: "cautious_advance",
      name: "Cautious Advance",
      description:
        "Move up to half your movement, ignoring difficult terrain, then gain 2 Actions to Brace or Gain Advantage.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["vigilant_stance"],
        skill: { id: "discipline", min: 1 },
      },
      x: 1.5,
      y: 1.5,
    },
    {
      id: "defensive_position",
      name: "Defensive Position",
      description:
        "The Brace action adds two disadvantages to attacks against you, instead of one, and allies can Brace behind your shield.",
      actionCost: "Always Active",
      requirements: {
        talents: ["cautious_advance"],
        skill: { id: "athletics", min: 2 },
      },
      x: 1.5,
      y: 2.5,
      detourDirection: "left",
    },
    {
      id: "formation_drills",
      name: "Formation Drills",
      description: "Allies within 10 feet who Brace gain the benefits of your Defensive Position.",
      actionCost: "Always Active",
      requirements: {
        talents: ["defensive_position"],
        skill: { id: "discipline", min: 2 },
      },
      x: 1.5,
      y: 3.5,
    },
    {
      id: "wary",
      name: "Wary",
      description:
        "You can't be Surprised while you have focus. When you lose focus involuntarily, reduce the amount lost by your ranks in Discipline.",
      actionCost: "Always Active",
      requirements: {
        talents: ["defensive_position"],
        skill: { id: "discipline", min: 3 },
      },
      x: 1.5,
      y: 4.5,
    },
    {
      id: "combat_training",
      name: "Combat Training",
      description:
        "Gain expertise in a weapon, armor, and Military Life. Once per round, graze without spending focus.",
      actionCost: "Special Activation",
      requirements: { talents: ["vigilant_stance"] },
      x: 2.5,
      y: 1.5,
      detourDirection: "right",
    },
    {
      id: "devastating_blow",
      name: "Devastating Blow",
      description: "Make a melee weapon attack vs. Physical, rolling an extra 2d8 damage.",
      actionCost: "2 Actions",
      requirements: {
        talents: ["combat_training"],
        skill: { id: "athletics", min: 3 },
      },
      x: 2.5,
      y: 2.5,
    },
    {
      id: "hardy",
      name: "Hardy",
      description: "Gain +1 max health per level (including previous levels).",
      actionCost: "Always Active",
      requirements: { talents: ["combat_training"] },
      x: 2.5,
      y: 3.5,
    },
    {
      id: "swift_strikes",
      name: "Swift Strikes",
      description: "Spend 1 focus to make a second Strike with the same weapon.",
      actionCost: "1 Action",
      requirements: { talents: ["hardy"] },
      x: 2.5,
      y: 4.5,
    },
  ],
  edges: [
    { from: "vigilant_stance", to: "duelist" },
    { from: "duelist", to: "practiced_kata" },
    { from: "vigilant_stance", to: "practiced_kata", invisible: true },
    { from: "practiced_kata", to: "ironstance" },
    { from: "ironstance", to: "surefooted" },
    { from: "duelist", to: "flamestance" },
    { from: "duelist", to: "flamestance" },
    { from: "flamestance", to: "signature_weapon" },
    { from: "flamestance", to: "feinting_strike" },
    { from: "feinting_strike", to: "vinestance" },
    { from: "feinting_strike", to: "wits_end" },
    { from: "vigilant_stance", to: "shardbearer" },
    { from: "shardbearer", to: "shard_training" },
    { from: "vigilant_stance", to: "shard_training", invisible: true },
    { from: "shard_training", to: "windstance" },
    { from: "windstance", to: "shattering_blow" },
    { from: "shattering_blow", to: "precise_parry" },
    { from: "shard_training", to: "bloodstance" },
    { from: "bloodstance", to: "meteoric_leap" },
    { from: "shardbearer", to: "stonestance" },
    { from: "shardbearer", to: "stonestance" },
    { from: "stonestance", to: "mighty" },
    { from: "mighty", to: "bloodstance" },
    { from: "bloodstance", to: "meteoric_leap" },
    { from: "vigilant_stance", to: "soldier" },
    { from: "soldier", to: "cautious_advance" },
    { from: "vigilant_stance", to: "cautious_advance", invisible: true },
    { from: "cautious_advance", to: "defensive_position" },
    { from: "defensive_position", to: "formation_drills" },
    { from: "defensive_position", to: "wary" },
    { from: "soldier", to: "combat_training" },
    { from: "vigilant_stance", to: "combat_training", invisible: true },
    { from: "combat_training", to: "devastating_blow" },
    { from: "combat_training", to: "hardy" },
    { from: "hardy", to: "swift_strikes" },
  ],
  subclasses: ["duelist", "shardbearer", "soldier"],
};

export const HeroicPathTrees: {
  [key in HeroicPathId]: TalentTree;
} = {
  agent: AgentTree,
  envoy: EnvoyTree,
  hunter: HunterTree,
  leader: LeaderTree,
  scholar: ScholarTree,
  warrior: WarriorTree,
};

export const SingerTree: TalentTree = {
  nodes: [
    {
      id: "change_form",
      name: "Change Form",
      actionCost: "3 Actions",
      description: "During a highstorm, you can change into dullform, mateform, or another one of your singer forms.",
      requirements: {
        other: ["Singer ancestry"],
      },
      x: 0,
      y: 0,
    },
    {
      id: "singer_forms",
      name: "Singer Forms",
      description: "",
      x: 0,
      y: 0.75,
      isSubclass: true,
    },
    {
      id: "forms_of_finesse",
      name: "Forms of Finesse",
      actionCost: "Always Active",
      description:
        "Gain artform and nimbleform.\nArtform: Awareness +1, expertises in Painting and Music, advantage on Crafting tests and tests to entertain.\nNimbleform: Speed +1, focus +2.",
      x: -1,
      y: 1.5,
      requirements: {
        talents: ["change_form"],
      },
    },
    {
      id: "forms_of_wisdom",
      name: "Forms of Wisdom",
      actionCost: "Always Active",
      description:
        "Gain meditation and scholarform.\nMeditationform: Presence +1. You can Aid without spending focus.\nScholarform: Intellect +1. Temporarily gain a cultural or utility expertise and a rank in a non-surge cognitive skill.",
      x: 0,
      y: 1.5,
      requirements: {
        talents: ["change_form"],
      },
    },
    {
      id: "forms_of_resolve",
      name: "Forms of Resolve",
      actionCost: "Always Active",
      description:
        'Gain warform and workform.\nWarform: Strength +1, deflect +1. You can jump horizontally up to your movement rate and vertically up to half your movement rate.\nWorkform: Willpower +1, ignore Exhausted. You can disguise yourself as a "parshman."',
      x: 1,
      y: 1.5,
      requirements: {
        talents: ["change_form"],
      },
    },
    {
      id: "ambitious_mind",
      name: "Ambitious Mind",
      actionCost: "Always Active",
      description:
        "Increase Cognitive defense by 2. You can bond a Voidspren, but once per day on Complication, you must test Discipline (DC 15) or be Stunned.",
      x: 0,
      y: 2.5,
      requirements: {
        talents: ["forms_of_finesse", "forms_of_wisdom", "forms_of_resolve"],
      },
    },
    {
      id: "forms_of_destruction",
      name: "Forms of Destruction",
      actionCost: "Always Active",
      description:
        "Gain direform and stormform.\n Direform: Strength +2, deflect +2. You can use Reactive Strikes to Grapple instead of attacking.\n Stormform: Strength +1, Speed +1, deflect +1. You can use Unleash Lighning as 2 Actions: Spend 1 focus or 1 Investiture to make a ranged Discipline attack (60 feet) vs. Physical. Roll 2d8 energy damage, and on hit, the target is Disoriented.",
      x: -1,
      y: 3.5,
      requirements: {
        talents: ["ambitious_mind"],
      },
    },
    {
      id: "forms_of_expansion",
      name: "Forms of Expansion",
      actionCost: "Always Active",
      description:
        "Gain envoyform and relayform.\n Envoyform: Intellect +1, Presence +1. You know all languages and gain an advantage on Insight tests about the intentions of others.\n Relayform: Speed +2, ignore Slowed. Spend 1 focus to gain an advantage when you test Agility, Stealth, or Thievery.",
      x: 0,
      y: 3.7,
      requirements: {
        talents: ["ambitious_mind"],
      },
    },
    {
      id: "forms_of_mystery",
      name: "Forms of Mystery",
      actionCost: "Always Active",
      description:
        "Gain decayform and nightform.\n Decayform: Willpower +2. You can spend 1 focus or 1 Investiture to prevent a character within reach from recovering health or focus.\n Nightform: Awareness +1, Intellect +1, focus +2. You receive unpredictable glipses of the future. Preroll two d20s each session, which you can use to replace enemy and ally d20 rolls.",
      x: 1,
      y: 3.5,
      requirements: {
        talents: ["ambitious_mind"],
      },
    },
  ],
  edges: [
    { from: "change_form", to: "singer_forms" },
    { from: "singer_forms", to: "forms_of_finesse" },
    { from: "singer_forms", to: "forms_of_wisdom" },
    { from: "singer_forms", to: "forms_of_resolve" },
    { from: "change_form", to: "forms_of_finesse", invisible: true },
    { from: "change_form", to: "forms_of_wisdom", invisible: true },
    { from: "change_form", to: "forms_of_resolve", invisible: true },
    { from: "forms_of_finesse", to: "ambitious_mind" },
    { from: "forms_of_wisdom", to: "ambitious_mind" },
    { from: "forms_of_resolve", to: "ambitious_mind" },
    { from: "ambitious_mind", to: "forms_of_destruction" },
    { from: "ambitious_mind", to: "forms_of_expansion" },
    { from: "ambitious_mind", to: "forms_of_mystery" },
  ],
  subclasses: ["singer_forms"],
};

const getAbrasionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "abrasion",
      name: "Abrasion",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "frictionless_motion",
      name: "Fricionless Motion",
      actionCost: "Always Active",
      description: "While infused with Abrasion, increase your movement by 10 and ignore Slowed.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "graceful_skating",
      name: "Graceful Skating",
      actionCost: "Always Active",
      description: "When you Skate and use its Move free action, you aren't restricted to moving in a straight line.",
      requirements: {
        talents: ["frictionless_motion"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "slippery_target",
      name: "Slippery Target",
      actionCost: "Special Activation",
      description:
        "While infused with Abrasion, attacks can't graze you and Reactive Strikes against you gain a disadvantage.",
      requirements: {
        talents: ["graceful_skating"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "slick_combatant",
      name: "Slick Combatant",
      actionCost: "Special Activation",
      description:
        "While infused with Abrasion, you can interrupt a Move with other actions. Deal extra damage on mid-movement attack.",
      requirements: {
        talents: ["slippery_target"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "smooth_operator",
      name: "Smooth Operator",
      actionCost: "Always Active",
      description: "While you have Investiture, you are infused with Abrasion and it costs you 1 fewer focus to Skate.",
      requirements: {
        talents: ["slippery_target", "distant_surgebinding"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "reverse_abrasion",
      name: "Reverse Abrasion",
      actionCost: "Special Activation",
      description:
        "You can increase the friction of an object or area, canceling difficult terrain and giving an advantage to interact with it.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
      detourDirection: "right",
    },
    {
      id: "stormlight_reclamation",
      name: "Stormlight Reclamation",
      actionCost: "Free Action",
      description:
        "At the start of your turn, you can end any number of infusions to regain their remaining investiture.",
      requirements: {
        talents: ["reverse_abrasion"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "distant_surgebinding",
      name: "Distant Surgebinding",
      actionCost: "Always Active",
      description: "Use your surges and their talents as though your reach is 20 feet.",
      requirements: {
        talents: ["reverse_abrasion"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getAbrasionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "abrasion" },
    { from: firstIdealId, to: "frictionless_motion", invisible: true },
    { from: "abrasion", to: "frictionless_motion" },
    { from: "frictionless_motion", to: "graceful_skating" },
    { from: "graceful_skating", to: "slippery_target" },
    { from: "slippery_target", to: "slick_combatant" },
    { from: "slippery_target", to: "smooth_operator" },
    { from: firstIdealId, to: "reverse_abrasion", invisible: true },
    { from: "abrasion", to: "reverse_abrasion" },
    { from: "reverse_abrasion", to: "stormlight_reclamation" },
    { from: "reverse_abrasion", to: "distant_surgebinding" },
    { from: "distant_surgebinding", to: "smooth_operator" },
  ];
};

const getAdhesionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "adhesion",
      name: "Adhesion",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "stormlight_reclamation",
      name: "Stormlight Reclamation",
      actionCost: "Free Action",
      description: "End Adhesion infusions within reach and recover their remaining investiture.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "distant_surgebinding",
      name: "Distant Surgebinding",
      actionCost: "Always Active",
      description: "Use your surges and their talents as though your reach is 20 feet.",
      requirements: {
        talents: ["stormlight_reclamation"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "extended_adhesion",
      name: "Extended Adhesion",
      actionCost: "Always Active",
      description: "Your Full Lashings only expend 1 Investiture per number of rounds equal to your ranks in Adhesion.",
      requirements: {
        talents: ["distant_surgebinding"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "living_adhesion",
      name: "Living Adhesion",
      actionCost: "Always Active",
      description:
        "You can use Adhesion on characters. When Lashed to something larger, they are Restrained, their physical tests gain a disadvantage, and attacks against them gain an advantage.",
      requirements: {
        talents: ["extended_adhesion"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "superior_bond",
      name: "Superior Bond",
      actionCost: "Always Active",
      description:
        "Automatically succeed on an opposed test to maintain Full Lashings against characters with Strength no higher than your ranks in Adhesion.",
      requirements: {
        talents: ["extended_adhesion", "adhesive_trap"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "binding_strike",
      name: "Binding Strike",
      actionCost: "Special Activation",
      description:
        "After you hit with a melee attack, you can spend an Opportunity or 2 focus to use Adhesion, infusing Investiture as usual but without spending an action.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "binding_shot",
      name: "Binding Shot",
      actionCost: "Special Activation",
      description: "You can use Binding Strike when you hit with a ranged attack.",
      requirements: {
        talents: ["binding_strike"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "adhesive_trap",
      name: "Adhesive Trap",
      actionCost: "Special Activation",
      description:
        "You can infuse Adhesion into surfaces. Characters who touch the infused surface become Fully Lashed to it.",
      requirements: {
        talents: ["binding_shot"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getAdhesionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "adhesion" },
    { from: firstIdealId, to: "stormlight_reclamation", invisible: true },
    { from: "adhesion", to: "stormlight_reclamation" },
    { from: "stormlight_reclamation", to: "distant_surgebinding" },
    { from: "distant_surgebinding", to: "extended_adhesion" },
    { from: "extended_adhesion", to: "living_adhesion" },
    { from: "extended_adhesion", to: "superior_bond" },
    { from: firstIdealId, to: "binding_strike", invisible: true },
    { from: "adhesion", to: "binding_strike" },
    { from: "binding_strike", to: "binding_shot" },
    { from: "binding_shot", to: "adhesive_trap" },
    { from: "adhesive_trap", to: "superior_bond" },
  ];
};

const getCohesionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "cohesion",
      name: "Cohesion",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "stone_spear",
      name: "Stone Spear",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture to make a ranged Cohesion attack vs. Physical of a target within 60 feet, rolling 2d4 impact damage.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "sinkhole",
      name: "Sinkhole",
      actionCost: "1 Action",
      description:
        "Spend 1 Investiture and test Cohesion vs. Cognitive of chosen targets on stone ground. On success, the target sinks into the ground and is Immobilized.",
      requirements: {
        talents: ["stone_spear"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "through_the_stone",
      name: "Through the Stone",
      actionCost: "Always Active",
      description: "Use your surges and their talents as though your reach is 20 feet.",
      requirements: {
        talents: ["sinkhole"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "unbound_cohesion",
      name: "Unbound Cohesion",
      actionCost: "Always Active",
      description: "Use Cohesion on any solid material that isn't alive, Invested, or infused with Stormlight",
      requirements: {
        talents: ["through_the_stone"],
        skill: { id: "cohesion", min: 4 },
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "tunneling",
      name: "Tunneling",
      actionCost: "1 Action",
      description:
        "Spend 1 Investiture to move through stone as if through difficult terrain, leaving a 5-foot tunnel behind you.",
      requirements: {
        talents: ["sinkhole"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "true_stoneshaping",
      name: "True Stoneshaping",
      actionCost: "Always Active",
      description: "Intricately and extensively shape stone without using additional actions or time.",
      requirements: {
        talents: ["tunneling"],
        skill: { id: "cohesion", min: 2 },
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "flowing_earth",
      name: "Flowing Earth",
      actionCost: "Special Activation",
      description:
        "After using Cohesion, shape the stone beneath your feet, pushing yourself in any direction up to 5 feet x your ranks in Cohesion.",
      requirements: {
        talents: ["true_stoneshaping"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "memories_of_stone",
      name: "Memories of Stone",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture to communicate with stone you're touching. If this requires interpretation, test Cohesion (DC determined by the GM)",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
  ];
};

const getCohesionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "cohesion" },
    { from: firstIdealId, to: "stone_spear", invisible: true },
    { from: "cohesion", to: "stone_spear" },
    { from: "stone_spear", to: "sinkhole" },
    { from: "sinkhole", to: "tunneling" },
    { from: "sinkhole", to: "through_the_stone" },
    { from: "through_the_stone", to: "unbound_cohesion" },
    { from: "tunneling", to: "true_stoneshaping" },
    { from: "true_stoneshaping", to: "flowing_earth" },
    { from: firstIdealId, to: "memories_of_stone", invisible: true },
    { from: "cohesion", to: "memories_of_stone" },
  ];
};

const getDivisionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "division",
      name: "Division",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "bodily_decay",
      name: "Bodily Decay",
      actionCost: "Special Activation",
      description:
        "When you hit with a Division attack, you can spend Opportunity to cause one target of that attack to suffer an injury",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "igniting_division",
      name: "Igniting Division",
      actionCost: "Special Activation",
      description:
        "When you use Division, spend 1 or more Investiture to light the target's space on fire, dealing ongoing damage equal to your Division modifier.",
      requirements: {
        talents: ["bodily_decay"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "gout_of_flame",
      name: "Gout of Flame",
      actionCost: "2 Actions",
      description:
        "Spend 3 Investiture to make a Division attack vs. Physical against each target in an area one size larger than normal.",
      requirements: {
        talents: ["igniting_division"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "devastating_division",
      name: "Devastating Division",
      actionCost: "Always Active",
      description: "When you roll damage for Division, roll an additional damage die.",
      requirements: {
        talents: ["gout_of_flame"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "unleashed_entropy",
      name: "Unleashed Entropy",
      actionCost: "Special Activation",
      description:
        "It costs you one fewer Action to use the Division skill. Your Division Under Pressure DC is reduced by 5.",
      requirements: {
        talents: ["gout_of_flame", "inescapable_spark"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "eroding_escape",
      name: "Eroding Escape",
      actionCost: "1 Action",
      description:
        "Spend 1 or more Investiture to end that many effects inflicting the Restrained or Immobilized condition.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "spark_sending",
      name: "Spark Sending",
      actionCost: "Always Active",
      description: "When there's a solid surface between you and target, use Division as though your reach is 20 feet.",
      requirements: {
        talents: ["eroding_escape", "bodily_decay"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
      txDiagonalOffset: -20,
    },
    {
      id: "inescapable_spark",
      name: "Inescapable Spark",
      actionCost: "Always Active",
      description:
        "Your Spark Sending now extends to your spren bond range. You don't need line of effect when you can sense your target, and they can't Brace against your Division.",
      requirements: {
        talents: ["spark_sending"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getDivisionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "division" },
    { from: firstIdealId, to: "bodily_decay", invisible: true },
    { from: "division", to: "bodily_decay" },
    { from: "bodily_decay", to: "spark_sending" },
    { from: "bodily_decay", to: "igniting_division" },
    { from: "igniting_division", to: "gout_of_flame" },
    { from: "gout_of_flame", to: "unleashed_entropy" },
    { from: "gout_of_flame", to: "devastating_division" },
    { from: firstIdealId, to: "eroding_escape", invisible: true },
    { from: "division", to: "eroding_escape" },
    { from: "eroding_escape", to: "spark_sending" },
    { from: "spark_sending", to: "inescapable_spark" },
    { from: "inescapable_spark", to: "unleashed_entropy" },
  ];
};

const getGravitationNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "gravitation",
      name: "Gravitation",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "flying_ace",
      name: "Flying Ace",
      actionCost: "1 Action",
      description:
        "Fly up to your gravitation rate, which permanently increases to 40 feet. You can spend 1 focus to make a melee weapon attack during this flight.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "stable_flight",
      name: "Stable Flight",
      actionCost: "Always Active",
      description:
        "While maintaining a basic Lashing on yourself, your ranged attacks don't gain a disadvantage due to flying or unstable footing.",
      requirements: {
        talents: ["flying_ace"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "group_flight",
      name: "Group Flight",
      actionCost: "Always Active",
      description:
        "When you use a Basic Lashing out of combat, infuse additional characters up to your ranks in Gravitation without spending additional Investiture.",
      requirements: {
        talents: ["stable_flight"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "aerial_squadron",
      name: "Aerial Squadron",
      actionCost: "Always Active",
      description: "You can use your Group Flight in combat.",
      requirements: {
        talents: ["group_flight"],
        skill: { id: "gravitation", min: 3 },
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "master_of_the_skies",
      name: "Master of the Skies",
      actionCost: "Always Active",
      description: "While you have Investiture, you're always infused with Gravitation",
      requirements: {
        talents: ["group_flight", "lashing_shot"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "gravitational_slam",
      name: "Gravitational Slam",
      actionCost: "Always Active",
      description:
        "Use a Basic Lashing to collide a target with a solid surface, dealing 1d4 impact damage per 10 feet moved. The target can Avoid Danger to halve damage.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
      detourDirection: "right",
    },
    {
      id: "multiple_lashings",
      name: "Multiple Lashings",
      actionCost: "Special Activation",
      description:
        "When you move an unwilling character with Gravitation, you can infuse Investiture up to your ranks in Gravitation to prolong the effect.",
      requirements: {
        talents: ["gravitational_slam"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "lashing_shot",
      name: "Lashing Shot",
      actionCost: "2 Actions",
      description:
        "Propel an object at a target, spending Investiture equal to distance divided by gravitation rate. Make a ranged Gravitation attack vs. Physical, rolling 2d4 impact damage.",
      requirements: {
        talents: ["gravitational_slam"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getGravitationEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "gravitation" },
    { from: firstIdealId, to: "flying_ace", invisible: true },
    { from: "gravitation", to: "flying_ace" },
    { from: "flying_ace", to: "stable_flight" },
    { from: "stable_flight", to: "group_flight" },
    { from: "group_flight", to: "aerial_squadron" },
    { from: "group_flight", to: "master_of_the_skies" },
    { from: firstIdealId, to: "gravitational_slam", invisible: true },
    { from: "gravitation", to: "gravitational_slam" },
    { from: "gravitational_slam", to: "multiple_lashings" },
    { from: "multiple_lashings", to: "lashing_shot" },
    { from: "lashing_shot", to: "master_of_the_skies" },
  ];
};

const getIlluminationNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "illumination",
      name: "Illumination",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "distracting_illusion",
      name: "Distracting Illusion",
      actionCost: "1 Action",
      description:
        "Spend 1 Investiture to Light-weave an illusion of yourself or an ally. Until an attack misses the target, attacks against them gain a disadvantage and can't graze.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "disorienting_flash",
      name: "Disorienting Flash",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture to project light in an area, testing Illumination vs. Cognitive of each character to make them Disoriented.",
      requirements: {
        talents: ["distracting_illusion"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "spiritual_illumination",
      name: "Spiritual Illumination",
      actionCost: "1 Action",
      description: "Spend 2 Investiture to cause an ally to become _Determined and Focused.",
      requirements: {
        talents: ["disorienting_flash"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "painful_truth",
      name: "Painful Truth",
      actionCost: "1 Action",
      description:
        "Spend 2 Investiture and test Illumination vs. Spiritual of a target. On success, they are Slowed and must Move away on their next turn or spend focus to avoid doing so.",
      requirements: {
        talents: ["spiritual_illumination"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "endless_illusions",
      name: "Endless Illusions",
      actionCost: "Always Active",
      description:
        "You can maintain illusions indefinitely. While you have Investiture, Illumination infusions in your spren bond range don't expend Investiture.",
      requirements: {
        talents: ["spiritual_illumination", "multiplicative_lightweaving"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "lingering_lightweavings",
      name: "Lingering Lightweavings",
      actionCost: "Special Activation",
      description:
        "You can infuse an illusion in a sphere. The illusion moves with the sphere, expending 1 Investiture per rounds equal to your ranks in Illumination.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "stormlight_reclamation",
      name: "Stormlight Reclamation",
      actionCost: "Free Action",
      description: "End Illumination infusions whithin spren bond range and recover their remaining Investiture.",
      requirements: {
        talents: ["distracting_illusion"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "multiplicative_lightweaving",
      name: "Multiplicative Lightweaving",
      actionCost: "Always Active",
      description:
        "You can Lightweave additional illusions, up to your ranks in Illumination, wiht no additional Investiture.",
      requirements: {
        talents: ["stormlight_reclamation"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getIlluminationEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "illumination" },
    { from: firstIdealId, to: "distracting_illusion", invisible: true },
    { from: "illumination", to: "distracting_illusion" },
    { from: "distracting_illusion", to: "stormlight_reclamation" },
    { from: "distracting_illusion", to: "disorienting_flash" },
    { from: "disorienting_flash", to: "spiritual_illumination" },
    { from: "spiritual_illumination", to: "endless_illusions" },
    { from: "spiritual_illumination", to: "painful_truth" },
    { from: firstIdealId, to: "lingering_lightweavings", invisible: true },
    { from: "illumination", to: "lingering_lightweavings" },
    { from: "stormlight_reclamation", to: "multiplicative_lightweaving" },
    { from: "multiplicative_lightweaving", to: "endless_illusions" },
  ];
};

const getProgressionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "progression",
      name: "Progression",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "injury_regrowth",
      name: "Injury Regrowth",
      actionCost: "2 Actions",
      description:
        "Spend 2 Investiture to cause a target to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "swift_regeneration",
      name: "Swift Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, recover health equal to 1d6 + your Progression modifier. While you have Investiture, you and your Regrowth targets can add your Progression modifier to injury rolls.",
      requirements: {
        talents: ["injury_regrowth"],
        skill: { id: "progression", min: 2 },
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "extended_regrowth",
      name: "Extended Regrowth",
      actionCost: "Always Active",
      description: "Your Regrowth infusions only expend 1 Investiture per rounds equal to your ranks in Progression.",
      requirements: {
        talents: ["swift_regeneration"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "from_the_brink",
      name: "From the Brink",
      actionCost: "3 Actions",
      description: "Spend 3 Investiture to restore life to a willing character who died within the last minute.",
      requirements: {
        talents: ["extended_regrowth"],
        skill: { id: "progression", min: 3 },
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "font_of_life",
      name: "Font of Life",
      actionCost: "Always Active",
      description: "It costs you one Action fewer to use Progression and its talents.",
      requirements: {
        talents: ["extended_regrowth", "reliable_progression"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "explosive_growth",
      name: "Explosive Growth",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture to explosively grow plants in an area. Make a Progression attack vs. Physical of each character of your choice, rolling 2d4 impact or keen damage.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "overgrowth",
      name: "Overgrowth",
      actionCost: "Always Active",
      description:
        "When you infuse Growth into a plant, test Progression (DC 15) to cause it to grow much larger and stronger than its species' normal limits.",
      requirements: {
        talents: ["explosive_growth"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "reliable_progression",
      name: "Reliable Progression",
      actionCost: "Special Activation",
      description: "When you roll a Progression die, make the result equal your ranks in Progression.",
      requirements: {
        talents: ["overgrowth"],
        skill: { id: "progression", min: 2 },
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getProgressionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "progression" },
    { from: firstIdealId, to: "injury_regrowth", invisible: true },
    { from: "progression", to: "injury_regrowth" },
    { from: "injury_regrowth", to: "swift_regeneration" },
    { from: "swift_regeneration", to: "extended_regrowth" },
    { from: "extended_regrowth", to: "font_of_life" },
    { from: "extended_regrowth", to: "from_the_brink" },
    { from: firstIdealId, to: "explosive_growth", invisible: true },
    { from: "progression", to: "explosive_growth" },
    { from: "explosive_growth", to: "overgrowth" },
    { from: "overgrowth", to: "reliable_progression" },
    { from: "reliable_progression", to: "font_of_life" },
  ];
};

const getTensionNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "tension",
      name: "Tension",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "tension_parry",
      name: "Tension Parry",
      actionCost: "Reaction",
      description:
        "Before you or an ally is hit or grazed by an attack, spend Investiture to infuse the target's clothing, increasing their Physical defense by 2 and potentially cause the attack to miss.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "rigged_weaponry",
      name: "Rigged Weaponry",
      actionCost: "Special Activation",
      description:
        "Spend 1 Investiture to increase the reach of your melee weapon by 10 feet. When you hit with a melee attack, spend Opportunity or 2 focus to infuse Tension into an object the target is holding.",
      requirements: {
        talents: ["tension_parry"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "cloth_mastery",
      name: "Cloth Master",
      actionCost: "Always Active",
      description: "Use Tension to instantly create intricate and complex objects.",
      requirements: {
        talents: ["rigged_weaponry"],
        skill: { id: "tension", min: 2 },
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "fine_control",
      name: "Fine Control",
      actionCost: "2 Actions",
      description:
        "Spend Investiture to infuse an object you can control with an Action while touching it. It can move up to 25 feet along surfaces perform tasks, and make attacks using your Tension.",
      requirements: {
        talents: ["cloth_mastery"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "clothsmith",
      name: "Clothsmith",
      actionCost: "Always Active",
      description:
        "Your Hardened Defense effect increases the target's Physical defense by 4 instead of 2. When you temporarily create a weapon with Tension, it gains an extra d4 damage die.",
      requirements: {
        talents: ["cloth_mastery", "surface_tension"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
      txDiagonalOffset: -20,
    },
    {
      id: "stormlight_reclamation",
      name: "Stormlight Reclamation",
      actionCost: "Free Action",
      description: "End Tension infusions within reach and recover their remaining Investiture.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "extended_tension",
      name: "Extended Tension",
      actionCost: "Always Active",
      description:
        "Your Tension infusions only expend 1 Investiture per rounds equal to your ranks in Tension. While you have Investiture, you cna freely maintain Tension infusions on objects you're holding.",
      requirements: {
        talents: ["stormlight_reclamation"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "surface_tension",
      name: "Surface Tension",
      actionCost: "Always Active",
      description: "Use Tension to increase a liquid's surface tension and walk on it like solid ground.",
      requirements: {
        talents: ["extended_tension"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
  ];
};

const getTensionEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "tension" },
    { from: firstIdealId, to: "tension_parry", invisible: true },
    { from: "tension", to: "tension_parry" },
    { from: "tension_parry", to: "rigged_weaponry" },
    { from: "rigged_weaponry", to: "cloth_mastery" },
    { from: "cloth_mastery", to: "clothsmith" },
    { from: "cloth_mastery", to: "fine_control" },
    { from: firstIdealId, to: "stormlight_reclamation", invisible: true },
    { from: "tension", to: "stormlight_reclamation" },
    { from: "stormlight_reclamation", to: "extended_tension" },
    { from: "extended_tension", to: "surface_tension" },
    { from: "surface_tension", to: "clothsmith" },
  ];
};

const getTransformationNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "transformation",
      name: "Transformation",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "soulcast_defense",
      name: "Soulcast Defense",
      actionCost: "Reaction",
      description:
        "Before you or an ally is hit by a projectile, spend 1 Investiture to test Transformation (DC equals triggering attack). On failiure, the projectile grazes. On success, the projectile misses and becomes and Essence.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "soulcast_parry",
      name: "Soulcast Parry",
      actionCost: "Always Active",
      description: "You can use Soulcast Defense on melee weapon attacks.",
      requirements: {
        talents: ["soulcast_defense"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "distant_surgebinding",
      name: "Distant Surgebinding",
      actionCost: "Always Active",
      description: "Use your surges and their talents as though your reach is 20 feet.",
      requirements: {
        talents: ["soulcast_parry"],
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "persistent_transformation",
      name: "Persistent Transformation",
      actionCost: "Always Active",
      description:
        "While transforming non-living objects, your max DC is 15. Also, you can reattempt Soul-casting, but on success, must spend 1 additional Investiture per recent Soulcasting failure.",
      requirements: {
        talents: ["distant_surgebinding"],
        skill: { id: "transformation", min: 2 },
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "living_soulcasting",
      name: "Living Soulcasting",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture and make a melee Transformation attack vs. Spiritual of a living organism, rolling 3d4 spirit damage. The target dies if reduced to 0 health.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "bloodcasting",
      name: "Bloodcasting",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture and test Transformation (DC 15) to cleanse all poison from the target and reduce one injury's recovery time by 5 days.",
      requirements: {
        talents: ["living_soulcasting"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "flamecasting",
      name: "Flamecasting",
      actionCost: "Always Active",
      description:
        'You gain "Flame" as a sixth category following "Clear Air" (DC 30 to transform stone to flame). When Soulcasting flames, attack each character within 5 feet using Transformation vs. Physical, rolling 2d4 energy damage.',
      requirements: {
        talents: ["soulcast_parry"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "expansive_transmuter",
      name: "Expansive Transmuter",
      actionCost: "Always Active",
      description: "Soulcasting non-living material costs 2 fewer Investiture.",
      requirements: {
        talents: ["flamecasting"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
    },
  ];
};

const getTransformationEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "transformation" },
    { from: firstIdealId, to: "soulcast_defense", invisible: true },
    { from: "transformation", to: "soulcast_defense" },
    { from: "soulcast_defense", to: "soulcast_parry" },
    { from: "soulcast_parry", to: "flamecasting" },
    { from: "soulcast_parry", to: "distant_surgebinding" },
    { from: "distant_surgebinding", to: "persistent_transformation" },
    { from: firstIdealId, to: "living_soulcasting", invisible: true },
    { from: "transformation", to: "living_soulcasting" },
    { from: "living_soulcasting", to: "bloodcasting" },
    { from: "flamecasting", to: "expansive_transmuter" },
  ];
};

const getTransportationNodes = (offsetX: number, firstIdealId: TalentId): TalentNode[] => {
  return [
    {
      id: "transportation",
      name: "Transportation",
      isSubclass: true,
      x: 0 + offsetX,
      y: 0.75,
    },
    {
      id: "cognitive_farsight",
      name: "Cognitive Farsight",
      actionCost: "Always Active",
      description:
        "You can spot things in the Cognitive Realm up to a distance equal to 3 x your spren bond range. While you have Investiture, you can identify north and the direction to the nearest settlement.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: -0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "cognitive_vision",
      name: "Cognitive Vision",
      actionCost: "Always Active",
      description:
        "When you use Transportation to look into the Cognitive Realm, you can learn an enemy's intent by testing Transportation vs. Cognitive, and you can learn about your immediate environment.",
      requirements: {
        talents: ["cognitive_farsight"],
      },
      x: -0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "shared_transportation",
      name: "Shared Transportation",
      actionCost: "Special Activation",
      description:
        "When you transport yourself, spend 1 Investiture or more to bring that many additional characters with you.",
      requirements: {
        talents: ["elsecalling"],
        skill: { id: "transportation", min: 4 },
      },
      x: -0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "elsegate",
      name: "Elsegate",
      actionCost: "Special Activation",
      description:
        "Transport yourself and up to ten companions to an Oathgate or permanent perpendicularity you'be visted before.",
      requirements: {
        talents: ["shared_transportation"],
        other: ["Speak the Fourth Ideal"],
      },
      x: -0.5 + offsetX,
      y: 4.5,
    },
    {
      id: "realmic_evasion",
      name: "Realmic Evasion",
      actionCost: "Reaction",
      description:
        "Before you're hit by an attack, spend 1 Investiture and test Transportation (DC equals triggering attack). On failure, the attack grazes. On success, the attack misses.",
      requirements: {
        talents: [firstIdealId],
        other: ["Speak the First Ideal"],
      },
      x: 0.5 + offsetX,
      y: 1.5,
    },
    {
      id: "realmic_step",
      name: "Realmic Step",
      actionCost: "1 Action",
      description:
        "Test Transportation (DC 15) and spend 2 Investiture to transport yourself to a space within spren bond range.",
      requirements: {
        talents: ["realmic_evasion"],
      },
      x: 0.5 + offsetX,
      y: 2.5,
    },
    {
      id: "elsecalling",
      name: "Elsecalling",
      actionCost: "2 Actions",
      description:
        "Spend 1 Investiture to transport yourself from the Physical to the Cognitive Realm, or test Transportation (DC 20) and spend 2 Investiture to transport from the Cognitive to the Physical Realm.",
      requirements: {
        talents: ["realmic_step"],
        other: ["Speak the Third Ideal"],
      },
      x: 0.5 + offsetX,
      y: 3.5,
    },
    {
      id: "realmwalker",
      name: "Realmwalker",
      actionCost: "Always Active",
      description: "When you test Transportation for a talent, you automatically succeeed.",
      requirements: {
        talents: ["elsecalling"],
      },
      x: 0.5 + offsetX,
      y: 4.5,
    },
  ];
};

const getTransportationEdges = (firstIdealId: TalentId): TalentEdge[] => {
  return [
    { from: firstIdealId, to: "transportation" },
    { from: firstIdealId, to: "cognitive_farsight", invisible: true },
    { from: "transportation", to: "cognitive_farsight" },
    { from: "cognitive_farsight", to: "cognitive_vision" },
    { from: firstIdealId, to: "realmic_evasion", invisible: true },
    { from: "transportation", to: "realmic_evasion" },
    { from: "realmic_evasion", to: "realmic_step" },
    { from: "realmic_step", to: "elsecalling" },
    { from: "elsecalling", to: "shared_transportation" },
    { from: "shared_transportation", to: "elsegate" },
    { from: "elsecalling", to: "realmwalker" },
  ];
};

export const DustbringerTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_dustbringer",
      name: "First Ideal (Dustbringer Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Abrasion and Division skills.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "ashspren_bond",
      name: "Ashspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_dustbringer",
      name: "Second Ideal (Dustbringer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_dustbringer"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_dustbringer",
      name: "Third Ideal (Dustbringer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_dustbringer"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_dustbringer",
      name: "Fourth Ideal (Dustbringer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_dustbringer"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_dustbringer"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_dustbringer",
      name: "Take Squire (Dustbringer)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. You can have a number of squires up to your current level",
      requirements: {
        talents: ["third_ideal_dustbringer"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "searing_dust_storm",
      name: "Searing Dust Storm",
      actionCost: "Special Activation",
      description:
        "Spend Investiture to kick up an obscuring cloud of dust as you Move. Enemies in this cloud take extra damage equal to your ranks in Discipline.",
      requirements: {
        talents: ["first_ideal_dustbringer"],
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["searing_dust_storm"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getAbrasionNodes(0, "first_ideal_dustbringer"),
    ...getDivisionNodes(2, "first_ideal_dustbringer"),
  ],
  edges: [
    { from: "first_ideal_dustbringer", to: "ashspren_bond" },
    { from: "ashspren_bond", to: "second_ideal_dustbringer" },
    { from: "second_ideal_dustbringer", to: "third_ideal_dustbringer" },
    { from: "third_ideal_dustbringer", to: "fourth_ideal_dustbringer" },
    { from: "third_ideal_dustbringer", to: "deepened_bond" },
    { from: "third_ideal_dustbringer", to: "take_squire_dustbringer" },
    { from: "first_ideal_dustbringer", to: "second_ideal_dustbringer", invisible: true },
    { from: "ashspren_bond", to: "searing_dust_storm" },
    { from: "first_ideal_dustbringer", to: "searing_dust_storm", invisible: true },
    { from: "searing_dust_storm", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getAbrasionEdges("first_ideal_dustbringer"),
    ...getDivisionEdges("first_ideal_dustbringer"),
  ],
  subclasses: ["ashspren_bond", "abrasion", "division"],
};

export const EdgedancerTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_edgedancer",
      name: "First Ideal (Edgedancer Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Abrasion and Division skills.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "cultivationspren_bond",
      name: "Cultivationspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_edgedancer",
      name: "Second Ideal (Edgedancer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_edgedancer"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_edgedancer",
      name: "Third Ideal (Edgedancer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_edgedancer"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_edgedancer",
      name: "Fourth Ideal (Edgedancer)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_edgedancer"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_edgedancer"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_edgedancer",
      name: "Take Squire (Edgedancer)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. Your max number of squires equals your ideal.",
      requirements: {
        talents: ["third_ideal_edgedancer"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "edgedancers_grace",
      name: "Edgedancer's Grace",
      actionCost: "Special Activation",
      description:
        "While you have Investiture, gain an additional Reaction to Avoid Danger or Dodge without spending focus.",
      requirements: {
        talents: ["first_ideal_edgedancer"],
        skill: { id: "abrasion", min: 2 },
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["edgedancers_grace"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getAbrasionNodes(0, "first_ideal_edgedancer"),
    ...getProgressionNodes(2, "first_ideal_edgedancer"),
  ],
  edges: [
    { from: "first_ideal_edgedancer", to: "cultivationspren_bond" },
    { from: "cultivationspren_bond", to: "second_ideal_edgedancer" },
    { from: "second_ideal_edgedancer", to: "third_ideal_edgedancer" },
    { from: "third_ideal_edgedancer", to: "fourth_ideal_edgedancer" },
    { from: "third_ideal_edgedancer", to: "deepened_bond" },
    { from: "third_ideal_edgedancer", to: "take_squire_edgedancer" },
    { from: "first_ideal_edgedancer", to: "second_ideal_edgedancer", invisible: true },
    { from: "cultivationspren_bond", to: "edgedancers_grace" },
    { from: "first_ideal_edgedancer", to: "edgedancers_grace", invisible: true },
    { from: "edgedancers_grace", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getAbrasionEdges("first_ideal_edgedancer"),
    ...getProgressionEdges("first_ideal_edgedancer"),
  ],
  subclasses: ["cultivationspren_bond", "abrasion", "progression"],
};

export const ElsecallerTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_elsecaller",
      name: "First Ideal (Elsecaller Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Abrasion and Division skills.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "inkspren_bond",
      name: "Inkspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_elsecaller",
      name: "Second Ideal (Elsecaller)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_elsecaller"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_elsecaller",
      name: "Third Ideal (Elsecaller)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_elsecaller"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_elsecaller",
      name: "Fourth Ideal (Elsecaller)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_elsecaller"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_elsecaller"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_elsecaller",
      name: "Take Squire (Elsecaller)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. Your max number of squires equals your ideal.",
      requirements: {
        talents: ["third_ideal_elsecaller"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "elsecallers_perspicacity",
      name: "Elscaller's Perspicacity",
      actionCost: "Special Activation",
      description:
        "While you have Investiture, gain an advantage on reactions, Deduction tests, and tests to peer between realms.",
      requirements: {
        talents: ["first_ideal_elsecaller"],
        skill: { id: "abrasion", min: 2 },
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["elsecallers_perspicacity"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getTransformationNodes(0, "first_ideal_elsecaller"),
    ...getTransportationNodes(2, "first_ideal_elsecaller"),
  ],
  edges: [
    { from: "first_ideal_elsecaller", to: "inkspren_bond" },
    { from: "inkspren_bond", to: "second_ideal_elsecaller" },
    { from: "second_ideal_elsecaller", to: "third_ideal_elsecaller" },
    { from: "third_ideal_elsecaller", to: "fourth_ideal_elsecaller" },
    { from: "third_ideal_elsecaller", to: "deepened_bond" },
    { from: "third_ideal_elsecaller", to: "take_squire_elsecaller" },
    { from: "first_ideal_elsecaller", to: "second_ideal_elsecaller", invisible: true },
    { from: "inkspren_bond", to: "elsecallers_perspicacity" },
    { from: "first_ideal_elsecaller", to: "elsecallers_perspicacity", invisible: true },
    { from: "elsecallers_perspicacity", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getTransformationEdges("first_ideal_elsecaller"),
    ...getTransportationEdges("first_ideal_elsecaller"),
  ],
  subclasses: ["inkspren_bond", "transformation", "transportation"],
};

export const LightweaverTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_lightweaver",
      name: "First Ideal (Lightweaver Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Illumination and Transformation.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "cryptic_bond",
      name: "Cryptic Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_lightweaver",
      name: "Second Ideal (Lightweaver)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_lightweaver"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_lightweaver",
      name: "Third Ideal (Lightweaver)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_lightweaver"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_lightweaver",
      name: "Fourth Ideal (Lightweaver)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_lightweaver"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
      detourDirection: "right",
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_lightweaver"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_lightweaver",
      name: "Take Squire (Lightweaver)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_lightweaver"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["first_ideal_lightweaver"],
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "physical_illusion",
      name: "Physical Illusion",
      actionCost: "2 Actions",
      description:
        "Spend Investiture to create a physical illusion with health and defenses. You control it with an Action, and it can test and attack using your Illumination",
      requirements: {
        talents: ["wound_regeneration"],
        other: ["Speak the Fourth Ideal"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getIlluminationNodes(0, "first_ideal_lightweaver"),
    ...getTransformationNodes(2, "first_ideal_lightweaver"),
  ],
  edges: [
    { from: "first_ideal_lightweaver", to: "cryptic_bond" },
    { from: "first_ideal_lightweaver", to: "second_ideal_lightweaver", invisible: true },
    { from: "cryptic_bond", to: "second_ideal_lightweaver" },
    { from: "second_ideal_lightweaver", to: "third_ideal_lightweaver" },
    { from: "third_ideal_lightweaver", to: "fourth_ideal_lightweaver" },
    { from: "third_ideal_lightweaver", to: "deepened_bond" },
    { from: "third_ideal_lightweaver", to: "take_squire_lightweaver" },
    { from: "cryptic_bond", to: "invested" },
    { from: "first_ideal_lightweaver", to: "invested", invisible: true },
    { from: "invested", to: "wound_regeneration" },
    { from: "wound_regeneration", to: "physical_illusion" },
    ...getIlluminationEdges("first_ideal_lightweaver"),
    ...getTransformationEdges("first_ideal_lightweaver"),
  ],
  subclasses: ["cryptic_bond", "illumination", "transformation"],
};

export const SkybreakerTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_skybreaker",
      name: "First Ideal (Skybreaker Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Division and Gravitation.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "highspren_bond",
      name: "Highspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_skybreaker",
      name: "Second Ideal (Skybreaker)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_skybreaker"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_skybreaker",
      name: "Third Ideal (Skybreaker)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_skybreaker"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_skybreaker",
      name: "Fourth Ideal (Skybreaker)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_skybreaker"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
      detourDirection: "right",
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_skybreaker"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_skybreaker",
      name: "Take Squire (Skybreaker)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_skybreaker"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "soaring_destruction",
      name: "Soaring Destruction",
      actionCost: "Free Action",
      description: "After you Move with a Basic Lashing, spend 1 focus to gain 1 Action for Division or its talents",
      requirements: {
        talents: ["first_ideal_skybreaker"],
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["soaring_destruction"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getDivisionNodes(0, "first_ideal_skybreaker"),
    ...getGravitationNodes(2, "first_ideal_skybreaker"),
  ],
  edges: [
    { from: "first_ideal_skybreaker", to: "highspren_bond" },
    { from: "highspren_bond", to: "second_ideal_skybreaker" },
    { from: "second_ideal_skybreaker", to: "third_ideal_skybreaker" },
    { from: "third_ideal_skybreaker", to: "fourth_ideal_skybreaker" },
    { from: "third_ideal_skybreaker", to: "deepened_bond" },
    { from: "third_ideal_skybreaker", to: "take_squire_skybreaker" },
    { from: "first_ideal_skybreaker", to: "second_ideal_skybreaker", invisible: true },
    { from: "highspren_bond", to: "soaring_destruction" },
    { from: "first_ideal_skybreaker", to: "soaring_destruction", invisible: true },
    { from: "soaring_destruction", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getDivisionEdges("first_ideal_skybreaker"),
    ...getGravitationEdges("first_ideal_skybreaker"),
  ],
  subclasses: ["honorspren_bond", "adhesion", "gravitation"],
};

export const StonewardTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_stoneward",
      name: "First Ideal (Stoneward Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Cohesion and Tension.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "peakspren_bond",
      name: "Peakspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_stoneward",
      name: "Second Ideal (Stoneward)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_stoneward"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_stoneward",
      name: "Third Ideal (Stoneward)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_stoneward"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_stoneward",
      name: "Fourth Ideal (Stoneward)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_stoneward"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
      detourDirection: "right",
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_stoneward"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_stoneward",
      name: "Take Squire (Stoneward)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_stoneward"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "cohesive_teamwork",
      name: "Cohesive Teamwork",
      actionCost: "Always Active",
      description:
        "When you Gain Advantage while having Investiture, the next test an ally makes against that target gains an advantage, and you can't be forcibly moved or knocked Prone.",
      requirements: {
        talents: ["first_ideal_stoneward"],
        skill: { id: "cohesion", min: 2 },
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["cohesive_teamwork"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getCohesionNodes(0, "first_ideal_stoneward"),
    ...getTensionNodes(2, "first_ideal_stoneward"),
  ],
  edges: [
    { from: "first_ideal_stoneward", to: "peakspren_bond" },
    { from: "peakspren_bond", to: "second_ideal_stoneward" },
    { from: "second_ideal_stoneward", to: "third_ideal_stoneward" },
    { from: "third_ideal_stoneward", to: "fourth_ideal_stoneward" },
    { from: "third_ideal_stoneward", to: "deepened_bond" },
    { from: "third_ideal_stoneward", to: "take_squire_stoneward" },
    { from: "first_ideal_stoneward", to: "second_ideal_stoneward", invisible: true },
    { from: "peakspren_bond", to: "cohesive_teamwork" },
    { from: "first_ideal_stoneward", to: "cohesive_teamwork", invisible: true },
    { from: "cohesive_teamwork", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getCohesionEdges("first_ideal_stoneward"),
    ...getTensionEdges("first_ideal_stoneward"),
  ],
  subclasses: ["peakspren_bond", "cohesion", "tension"],
};

export const TruthwatcherTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_truthwatcher",
      name: "First Ideal (Truthwatcher Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Adhesion and Gravitation.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "mistspren_bond",
      name: "Mistspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_truthwatcher",
      name: "Second Ideal (Truthwatcher)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_truthwatcher"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_truthwatcher",
      name: "Third Ideal (Truthwatcher)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_truthwatcher"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_truthwatcher",
      name: "Fourth Ideal (Truthwatcher)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_truthwatcher"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
      detourDirection: "right",
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_truthwatcher"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_truthwatcher",
      name: "Take Squire (Truthwatcher)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_truthwatcher"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "spiritual_healing",
      name: "Spiritual Healing",
      actionCost: "Special Activation",
      description:
        "Instead of healing yourself or an ally, spend 2 Investiture to restore half as much focus as the target would've recovered health.",
      requirements: {
        talents: ["first_ideal_truthwatcher"],
        skill: { id: "progression", min: 2 },
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["spiritual_healing"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getIlluminationNodes(0, "first_ideal_truthwatcher"),
    ...getProgressionNodes(2, "first_ideal_truthwatcher"),
  ],
  edges: [
    { from: "first_ideal_truthwatcher", to: "mistspren_bond" },
    { from: "mistspren_bond", to: "second_ideal_truthwatcher" },
    { from: "second_ideal_truthwatcher", to: "third_ideal_truthwatcher" },
    { from: "third_ideal_truthwatcher", to: "fourth_ideal_truthwatcher" },
    { from: "third_ideal_truthwatcher", to: "deepened_bond" },
    { from: "third_ideal_truthwatcher", to: "take_squire_truthwatcher" },
    { from: "first_ideal_truthwatcher", to: "second_ideal_truthwatcher", invisible: true },
    { from: "mistspren_bond", to: "spiritual_healing" },
    { from: "first_ideal_truthwatcher", to: "spiritual_healing", invisible: true },
    { from: "spiritual_healing", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getIlluminationEdges("first_ideal_truthwatcher"),
    ...getProgressionEdges("first_ideal_truthwatcher"),
  ],
  subclasses: ["mistspren_bond", "illumination", "progression"],
};

export const WillshaperTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_willshaper",
      name: "First Ideal (Willshaper Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Adhesion and Gravitation.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "lightspren_bond",
      name: "Lightspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_willshaper",
      name: "Second Ideal (Willshaper)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_willshaper"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_willshaper",
      name: "Third Ideal (Willshaper)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_willshaper"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_willshaper",
      name: "Fourth Ideal (Willshaper)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_willshaper"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_willshaper"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_willshaper",
      name: "Take Squire (Willshaper)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_willshaper"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "spiritual_cohesion",
      name: "Spiritual Cohesion",
      actionCost: "2 Actions",
      description:
        "Choose allies up to your current ideal to become _Determined. Opportunity from that condition increases that ally's Cognitive and Spiritual defenses by 2.",
      requirements: {
        talents: ["first_ideal_willshaper"],
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["spiritual_cohesion"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getCohesionNodes(0, "first_ideal_willshaper"),
    ...getTransportationNodes(2, "first_ideal_willshaper"),
  ],
  edges: [
    { from: "first_ideal_willshaper", to: "lightspren_bond" },
    { from: "lightspren_bond", to: "second_ideal_willshaper" },
    { from: "second_ideal_willshaper", to: "third_ideal_willshaper" },
    { from: "third_ideal_willshaper", to: "fourth_ideal_willshaper" },
    { from: "third_ideal_willshaper", to: "deepened_bond" },
    { from: "third_ideal_willshaper", to: "take_squire_willshaper" },
    { from: "first_ideal_willshaper", to: "second_ideal_willshaper", invisible: true },
    { from: "lightspren_bond", to: "spiritual_cohesion" },
    { from: "first_ideal_willshaper", to: "spiritual_cohesion", invisible: true },
    { from: "spiritual_cohesion", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getCohesionEdges("first_ideal_willshaper"),
    ...getTransportationEdges("first_ideal_willshaper"),
  ],
  subclasses: ["lightspren_bond", "cohesion", "transportation"],
};

export const WindrunnerTree: TalentTree = {
  nodes: [
    {
      id: "first_ideal_windrunner",
      name: "First Ideal (Windrunner Key)",
      actionCost: "Special Activation",
      description:
        'Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal "Speak the First Ideal," you become Empowered and gain Adhesion and Gravitation.',
      requirements: {
        level: 2,
      },
      x: 0,
      y: 0,
    },
    {
      id: "honorspren_bond",
      name: "Honorspren Bond",
      isSubclass: true,
      x: -2,
      y: 0.75,
    },
    {
      id: "second_ideal_windrunner",
      name: "Second Ideal (Windrunner)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Second Ideal," you become Empowered and can use Enhance as a Free Action without spending Investiture.',
      requirements: {
        talents: ["first_ideal_windrunner"],
        level: 4,
        other: ["Speak the First Ideal"],
      },
      x: -2.5,
      y: 1.5,
    },
    {
      id: "third_ideal_windrunner",
      name: "Third Ideal (Windrunner)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Third Ideal," you become Empowered and can manifest your spren as a Radiant Shardblade.',
      requirements: {
        talents: ["second_ideal_windrunner"],
        level: 8,
        other: ["Speak the Second Ideal"],
      },
      x: -2.5,
      y: 2.5,
      detourDirection: "right",
    },
    {
      id: "fourth_ideal_windrunner",
      name: "Fourth Ideal (Windrunner)",
      actionCost: "Special Activation",
      description:
        'When you complete the goal "Speak the Fourth Ideal," you become Empowered and can manifest Radiant Shardplate.',
      requirements: {
        talents: ["third_ideal_windrunner"],
        level: 13,
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 3.5,
      detourDirection: "right",
    },
    {
      id: "deepened_bond",
      name: "Deepened Bond",
      actionCost: "Always Active",
      description: "Your spren bond range increases to 100 feet, and giving your spren a task costs 1 fewer focus.",
      requirements: {
        talents: ["third_ideal_windrunner"],
        other: ["Speak the Third Ideal"],
      },
      x: -2.5,
      y: 4.5,
    },
    {
      id: "take_squire_windrunner",
      name: "Take Squire (Windrunner)",
      actionCost: "Special Activation",
      description:
        "Choose non-Radian characters as your squires, granting them one or both surges. They can also Breathe Stormlight, Enhance, and Regenerate. You max number of squires equals twice your level.",
      requirements: {
        talents: ["third_ideal_windrunner"],
        other: ["Speak the Third Ideal"],
      },
      x: -1.5,
      y: 4.5,
    },
    {
      id: "reverse_lashing",
      name: "Reverse Lashing",
      actionCost: "Special Activation",
      description:
        "Infuse a target with a Reverse Lashing using Adhesion, then choose one type of object to attract; the infused target attracts those objects in a distance equal to your gravitation rate.",
      requirements: {
        talents: ["first_ideal_windrunner"],
        other: ["Speak the First Ideal"],
      },
      x: -1.5,
      y: 1.5,
    },
    {
      id: "invested",
      name: "Invested",
      actionCost: "Always Active",
      description: "Your max investiture increases by your tier.",
      requirements: {
        talents: ["reverse_lashing"],
      },
      x: -1.5,
      y: 2.5,
    },
    {
      id: "wound_regeneration",
      name: "Wound Regeneration",
      actionCost: "Special Activation",
      description:
        "When you Regenerate, spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
      requirements: {
        talents: ["invested"],
      },
      x: -1.5,
      y: 3.5,
    },
    ...getAdhesionNodes(0, "first_ideal_windrunner"),
    ...getGravitationNodes(2, "first_ideal_windrunner"),
  ],
  edges: [
    { from: "first_ideal_windrunner", to: "honorspren_bond" },
    { from: "honorspren_bond", to: "second_ideal_windrunner" },
    { from: "second_ideal_windrunner", to: "third_ideal_windrunner" },
    { from: "third_ideal_windrunner", to: "fourth_ideal_windrunner" },
    { from: "third_ideal_windrunner", to: "deepened_bond" },
    { from: "third_ideal_windrunner", to: "take_squire_windrunner" },
    { from: "first_ideal_windrunner", to: "second_ideal_windrunner", invisible: true },
    { from: "honorspren_bond", to: "reverse_lashing" },
    { from: "first_ideal_windrunner", to: "reverse_lashing", invisible: true },
    { from: "reverse_lashing", to: "invested" },
    { from: "invested", to: "wound_regeneration" },
    ...getAdhesionEdges("first_ideal_windrunner"),
    ...getGravitationEdges("first_ideal_windrunner"),
  ],
  subclasses: ["honorspren_bond", "adhesion", "gravitation"],
};

export const RadiantPathTrees: {
  [key in RadiantPathId]: TalentTree;
} = {
  dustbringer: DustbringerTree,
  edgedancer: EdgedancerTree,
  elsecaller: ElsecallerTree,
  lightweaver: LightweaverTree,
  skybreaker: SkybreakerTree,
  stoneward: StonewardTree,
  truthwatcher: TruthwatcherTree,
  willshaper: WillshaperTree,
  windrunner: WindrunnerTree,
};

export const TalentTrees: {
  [key in TalentTreeId]: TalentTree;
} = Object.assign({}, HeroicPathTrees, { singer: SingerTree }, RadiantPathTrees);

export const getTalentFromId = (talent: TalentId) => {
  const allTalents = Object.values(TalentTrees).reduce((nodes: TalentNode[], tree) => [...nodes, ...tree.nodes], []);
  return allTalents.find((t) => t.id === talent);
};
