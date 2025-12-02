export interface GlossaryEntry {
  title: string;
  description: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  abrasion: {
    title: "Abrasion (surge, talent tree, uses Speed)",
    description: "The surge that alters friction on surfaces.",
  },
  action: {
    title: "Action",
    description: "A task you undertake on your turn by using the specified number of actions.",
  },
  adhesion: {
    title: "Adhesion (surge, talent tree, uses Presence)",
    description:
      "The surge that binds and connects. Commonly used to create Full Lashings that adhere two objects together.",
  },
  advantage: {
    title: "Advantage",
    description:
      "When you have advantage, you roll two d20s and use the higher result. Advantage does not stack. Multiple sources still only grant one advantage roll.",
  },
  afflicted: {
    title: "Afflicted (condition)",
    description: "You take damage over time",
  },
  aid: {
    title: "Aid (reaction)",
    description: "Spend 1 focus to help an ally, granting them an advantage.",
  },
  "always active": {
    title: "Always Active",
    description: " A talent that's always active doesn't require an action or other means to activate it.",
  },
  brace: {
    title: "Brace (action)",
    description: "Take cover against incoming attacks, giving them disadvantage.",
  },
  "breathe stormlight": {
    title: "Breathe Stormlight (2 Actions)",
    description: "Draw Stormlight from nearby spheres and regain Investiture up to your maximum.",
  },
  cohesion: {
    title: "Cohesion (surge, talent tree, uses Willpower)",
    description:
      "The surge that alters the smallest particles of matter and can mold stone. Commonly known as Stoneshaping.",
  },
  complication: {
    title: "Complication",
    description:
      "A negative narrative effect that applies to the current skill test. Usually gained via the plot die a natural 1. However, rolling a 1 or 2 on the plot die will still give you a Complication Bonus.",
  },
  "complication bonus": {
    title: "Complication Bonus",
    description: "A +2 or +4 bonus to the current skill roll, gained when a Complication is rolled.",
  },
  "complication range": {
    title: "Complication Range",
    description:
      "You gain a Complication if your d20 rolls within your Complication range; by default, this begins and ends at 1.",
  },
  cover: {
    title: "Cover",
    description: "A nearby obstacle you can use the Brace action to shelter behind.",
  },
  cumbersome: {
    title: "Cumbersome [x]",
    description:
      "If your Strenght is lower than the specified value, you are slowed and the respective disadvantage if on armor or weapon. Armor Trait: Gain disadvantage on tests that use Speed. Weapon Trait: Gain disadvantage on attacks.",
  },
  dangerous: {
    title: "Dangerous (weapon/armor trait)",
    description:
      "Weapon Trait: While attacking with this weapon, a Complication can cause you to graze a nearby ally. Armor Trait: While wearing this armor, a Complication can cause you to hurt a nearby ally.",
  },
  deadly: {
    title: "Deadly (weapon trait)",
    description:
      "While attacking with this weapon, you can spend an Opportunity to cause the target to suffer an injury.",
  },
  defensive: {
    title: "Defensive",
    description: "While wielding this weapon, you can use the Brace action without cover nearby.",
  },
  deflect: {
    title: "Deflect",
    description: "Reduce all impact, keen, and energy damage by this value.",
  },
  _determined: {
    title: "Determined (condition)",
    description: "You can add an Opportunity to a failed test.",
  },
  "difficult terrain": {
    title: "Difficult Terrain",
    description: "Teraign that's difficult to move through makes you Slowed.",
  },
  disadvantage: {
    title: "Disadvantage",
    description:
      "Negative circumstances can add a disadvantage to a test, allowing the character's opponent to choose a die from the upcoming test and force the character to roll two of it, then use the undesirable result.",
  },
  discreet: {
    title: "Discreet (weapon trait)",
    description: "This subtle weapon is easy to disguise and hide",
  },
  disengage: {
    title: "Disengage (1 Action)",
    description: "Move 5 feet without triggering Reactive Strikes.",
  },
  disoriented: {
    title: "Disoriented (condition)",
    description: "Your senses are disrupted, making it hard to perceive and react.",
  },
  division: {
    title: "Division (surge, talent tree, uses Intellect)",
    description: "The surge that decays and destroys",
  },
  dodge: {
    title: "Dodge (reaction)",
    description: "Spend 1 focus to evade an attack, giving it disadvantage.",
  },
  empowered: {
    title: "Empowered (condition)",
    description:
      "You gain a burst of power after swearing an ideal, making tests easier and rapidly refilling your Investiture.", // TODO: Explain more
  },
  enhanced: {
    title: "Enhanced (condition)",
    description: "One of your attributes gains a temporary bonus.", // TODO: Explain more
  },
  "entangling trap": {
    title: "Entangling Trap",
    description:
      "Test Survival vs. Cognitive, roll 2d4 impact damage. Target is Immobilized and the area becomes difficult terrain.",
  },
  exhausted: {
    title: "Exhausted (condition)",
    description: "You suffer a penalty on all skill tests.",
  },
  fabrial: {
    title: "Fabrial",
    description:
      "A marvelous device powered by Stormlight, which is infused into a gemstone containing a trapped spren.",
  },
  "fast turn": {
    title: "Fast Turn",
    description:
      "Characters who take a fast turn only gain two actions, but they act before characters who take a slow turn.",
  },
  "flying rate": {
    title: "Flying Rate",
    description: "Some characters can move using a flying rate instead of their usual movement rate.",
  },
  focus: {
    title: "Focus (resource)",
    description:
      "Determined by Willpower, focus is a resource pool that represents mental resolve. Focus can be spent to fuel abilities and resist manipulation.",
  },
  focused: {
    title: "Focused (condition)",
    description: "Your abilities require less focus than usual.", // TODO: explain how much
  },
  fragile: {
    title: "Fragile (weapon trait)",
    description: "While attacking with this weapon, a Complication can cause the weapon to break.",
  },
  "free action": {
    title: "Free Action",
    description: "A task you undertake on your turn without using an Action resource.",
  },
  grapple: {
    title: "Grapple (2 Actions)",
    description: "Make an Athletics test against Physical defense to grab your opponent, making them Restrained.",
  },
  gravitation: {
    title: "Gravitation (surge, talent tree, uses Awareness)",
    description:
      "The surge that manipulates gravitational attraction. Commonly used to create Basic Lashings, which temporarily attract an object to a different gravitational point.",
  },
  graze: {
    title: "Graze",
    description: "When your attack misses, spend 1 focus to instead deal damage equal to just your damage die",
  },
  "impaling trap": {
    title: "Impaling Trap",
    description:
      "Test Survival vs. Physical, roll 2d4 keen damage. Target is Afflicted [vital damage equal to 3 + your ranks in Survival].",
  },
  indirect: {
    title: "Indirect (weapon trait)",
    description: "This ranged weapon can be fired over cover and other obscuring terrain.",
  },
  injury: {
    title: "Injury",
    description:
      "A serious wound that hampers you in some way, gained from dropping to 0 hit points or other hazardous circumstances.",
  },
  "injury roll": {
    title: "Injury Roll",
    description: "When you're injured, you make an injury roll to determine how serious the injury is.",
  },
  illumination: {
    title: "Illumination (surge, talent tree, uses Presence)",
    description: "The surge that creates illusions. Wielding this surge is commonly known as Lightweaving.",
  },
  investiture: {
    title: "Investiture (resource)",
    description:
      "Determined by Awareness or Presence, Investiture is a resource pool that represents ability to hold and channel Investiture. Investiture can be spent to fuel Radiant abilities.",
  },
  "line of effect": {
    title:
      "Abilities that require line of effect can only be used if an imaginary straight line could connect you and your target.",
    description: "",
  },
  loaded: {
    title: "Loaded (weapon trait)",
    description:
      "This weapon expends ammunition and must be reloaded after the number of shots specified by this trait.",
  },
  momentum: {
    title: "Momentum",
    description:
      "When you attack using this weapon, if you already moved at least 10 feet in a straight line toward your target on this turn, you gain an advantage on the attack.",
  },
  offhand: {
    title: "Offhand",
    description:
      "While wielding this weapon in your offhand, it only costs you 1 focus (instead of 2) to Strike with it.",
  },
  opportunity: {
    title: "Opportunity",
    description:
      "A beneficial narrative effect that applies to the current skill test. Usually gained via the plot die or a natural 20.",
  },
  "opportunity attack": {
    title: "Opportunity Attack",
    description:
      "You can use your reaction to make a melee attack against a creature that moves out of your reach. This does not trigger if the creature uses the Disengage action.",
  },
  "opportunity range": {
    title: "Opportunity Range",
    description:
      "You gain an Opportunity if your d20 rolls within your Opportunity range; by default, this begins and ends at 20.",
  },
  presentable: {
    title: "Presentable (armor trait)",
    description: "This armor is acceptable to wear in non-military context.",
  },
  progression: {
    title: "Progression (surge, talent tree, uses Awareness)",
    description:
      "The surge that controls the growth and healing of living things. Commonly used for Growth (to sprout and mature plants) and Regrowth (to heal body and soul).",
  },
  prone: {
    title: "Prone (condition)",
    description: "You're lying on the ground and can't move quickly, making you vulnerable to melee attacks.",
  },
  quickdraw: {
    title: "Quickdraw (weapon trait)",
    description: "You can draw this weapon as a free action",
  },
  "raise the stakes": {
    title: "Raise the Stakes",
    description: "Signify the narrative importance of a skill test by rolling a plot die with it.",
  },
  reach: {
    title: "Reach",
    description:
      "A special range that requires targets to be in your line of effect and within 5 feet of you. Some weapons and effects can increase your reach.",
  },
  "reactive strike": {
    title: "Reactive Strike (reaction)",
    description:
      "Spend 1 focus to make a melee attack against a retreating enemy. A retreating enemy is an enemy that leaves your reach.",
  },
  reaction: {
    title: "Reaction",
    description:
      " A response to a trigger that happens any time during a round. To react, you must spend your reaction.",
  },
  "recovery die": {
    title: "Recovery Die",
    description: "Determined by Willpower, this represents how efficiently you recover health and focus.",
  },
  regenerate: {
    title: "Regenerate (Stormlight Free Action)",
    description: "Spend Investiture to recover health", // TODO: More info on this
  },
  "resist your influence": {
    title: "Resist Influence",
    description: "When influenced by another character, spend 2 focus to remain unaffected by the attempt.",
  },
  "resists your influence": {
    title: "Resist Influence",
    description: "When influenced by another character, spend 2 focus to remain unaffected by the attempt.",
  },
  restrained: {
    title: "Restrained (condition)",
    description:
      "While Restrained, your movement rate becomes 0. You gain a disadvantage on all tests other than those to escape your bonds. If the effect that applies this condition doesn't state an escape DC, it's up to the GM whether and how the condition can be removed early.",
  },
  shove: {
    title: "Shove (2 Actions)",
    description:
      "Make an Athletics test against Physical defense to attampt to forcibly move another character 5 feet.",
  },
  slowed: {
    title: "Slowed (condition)",
    description: "You move at half speed",
  },
  "slow turn": {
    title: "Slow Turn",
    description:
      "Characters who take a slow turn gain three actions, but they act after characters who take a fast turn.",
  },
  "special activation": {
    title: "Special Activation",
    description:
      "A talent with a special activation presents specific rules for activating it in the talent's description.",
  },
  strike: {
    title: "Strike (action)",
    description: "Make an attack against the Physical defense of a target in range.",
  },
  surprised: {
    title: "Surprised (condition)",
    description: "You're caught off guard and can't act immediately",
  },
  tension: {
    title: "Tension (surge, talent tree, uses Strength)",
    description: "The surge that alters the rigidity of objects.",
  },
  thrown: {
    title: "Thrown [X/Y]",
    description:
      "You can throw this weapon at a target, making a ranged attack when you do. The two numbers in brackets express the weapon's short and long range; as with ranged weapons, you gain a disadvantage when attacking a target outside short range. Once the weapon is thrown it is lost until you recover it from your target.",
  },
  tier: {
    title: "Tier",
    description:
      "As you advance from level 1 to 21+ you pass through 5 tiers, each with a different narrative focus and play experience",
  },
  transformation: {
    title: "Transformation (surge, talent tree, uses Willpower)",
    description:
      "The surege that transforms materials into other materials in a process commonly known as Soulcasting.",
  },
  transporation: {
    title: "Transportation (surge, talent tree, uses Intellect)",
    description:
      "The surge that enables looking into and transporting characters between the Physical and Cognitive Realms.",
  },
  "two-handed": {
    title: "Two-Handed",
    description: "You must wield this weapon in two hands, not just one. When you attack with it, it uses both hands.",
  },
  "1 action": {
    title: "Action",
    description: "A task you undertake on your turn by using the specified number of actions.",
  },
  "2 actions": {
    title: "2 Actions",
    description: "A task you undertake on your turn by using the specified number of actions.",
  },
  "3 actions": {
    title: "3 Actions",
    description: "A task you undertake on your turn by using the specified number of actions.",
  },
};
