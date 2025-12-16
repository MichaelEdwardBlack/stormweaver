type CalculateHealthProps = {
  level: number;
  strength: number;
  hasHardyTalent: boolean;
};
export const calculateHealth = ({ level, strength, hasHardyTalent }: CalculateHealthProps) => {
  const baseHealth = 5;
  const healthFromStrength = Math.floor((level + 4) / 5) * strength; // every 5 levels add strength (1, 6, 11 etc.)
  let healthFromLevel = 0;
  for (let i = 0; i < level; i++) {
    const healthForThisLevel = 5 - Math.floor(i / 5);
    healthFromLevel += healthForThisLevel;
  }
  return baseHealth + healthFromStrength + healthFromLevel + (hasHardyTalent ? level : 0);
};

export const calculateLiftingCapacity = (strength: number) => {
  return [100, 200, 200, 500, 500, 1000, 1000, 5000, 5000, 10000].at(strength);
};

export const calculateMovementSpeed = (speed: number) => {
  return [20, 25, 25, 30, 30, 40, 40, 60, 60, 80].at(speed);
};

export const calculateRecoveryDie = (willpower: number) => {
  return ["1d4", "1d6", "1d6", "1d8", "1d8", "1d10", "1d10", "1d12", "1d12", "1d20"].at(willpower);
};

export const calculateSensesRange = (awareness: number) => {
  return [5, 10, 10, 20, 20, 50, 50, 100, 100, Number.POSITIVE_INFINITY].at(awareness);
};

export const calculateMaxTotalSkillRanks = (level: number) => {
  // this does not include the free skill from starting path (that should be handled with the path selection)
  const startingRanks = 2;
  const overLevel20Ranks = Math.max(level - 20, 0); // +1 rank for every level after 20;
  const underLevel20Ranks = Math.min(level, 20) * 2;
  return startingRanks + overLevel20Ranks + underLevel20Ranks;
};

export const calculateMaxRankPerSkill = (level: number) => {
  return Math.min(Math.floor((level - 1) / 5) + 2, 5);
};

export const calculateMaxTalents = (level: number, isSinger: boolean) => {
  return level + calculateMaxAncestryTalents(level, isSinger);
};

export const calculateMaxAttributePoints = (level: number) => {
  const basePoints = 12;
  return basePoints + Math.min(Math.floor(level / 3), 6);
};

export const calculateMaxModifierPerAttribute = (level: number) => {
  return level <= 1 ? 3 : level <= 5 ? 4 : 5;
};

export const calculateMaxAncestryTalents = (level: number, isSinger: boolean) => {
  return Math.floor(level / 5) + (isSinger ? 2 : 1);
};

export const calculateAvailablePoints = (level: number, isSinger: boolean, unlockedTalents: number) => {
  const total = calculateMaxTalents(level, isSinger);
  return total - unlockedTalents;
};
