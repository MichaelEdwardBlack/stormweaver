"use client";
import { PathInfo } from "@/lib/data/paths";
import { RecommendedBanner } from "@/components/ui/RecommendedBanner";
import { useCharacter } from "@/services/CharacterProvider";
import { Attribute, Skill } from "@/lib/generated/prisma/enums";
import { startTransition, useOptimistic } from "react";
import { updateSkill } from "@/lib/actions/character";
import { allBaseSkills } from "@/lib/data/skills";
import { Card } from "@/components/ui/cards/Card";
import { useToast } from "@/services/ToastProvider";

type SelectSkillsProps = {
  maxRankPerSkill: number;
  maxTotalRanks: number;
};

type SkillData = {
  skill: Skill;
  attribute: Attribute;
  rank: number;
  description: string;
};

export const SelectSkills = ({ maxRankPerSkill, maxTotalRanks }: SelectSkillsProps) => {
  const { toast } = useToast();
  const character = useCharacter().character;
  const paths = character.paths.map((path) => path.path);
  const dbSkills = character.skills;
  const skillInfo = allBaseSkills;
  const skills: SkillData[] = skillInfo.map((skill) => {
    const dbSkill = dbSkills.find((s) => s.skill === skill.skill);
    return {
      skill: skill.skill,
      attribute: skill.attribute,
      rank: dbSkill ? dbSkill.rank : 0,
      description: skill.description,
    };
  });
  const [optimisticSkills, setOptimisticSkills] = useOptimistic(
    skills,
    (previous, next: { skill: Skill; value: number }) => {
      const newSkills: SkillData[] = [];
      for (let i = 0; i < previous.length; i++) {
        if (next.skill === previous[i].skill) {
          newSkills.push({ ...previous[i], rank: next.value });
        } else {
          newSkills.push(previous[i]);
        }
      }
      return newSkills;
    }
  );
  const attributeModifiers: Record<Attribute, number> = {
    strength: 0,
    speed: 0,
    intellect: 0,
    willpower: 0,
    awareness: 0,
    presence: 0,
  };
  character.attributes.forEach((attr) => {
    attributeModifiers[attr.attribute] = attr.value;
  });
  const totalRanks = optimisticSkills.map((skill) => skill.rank).reduce((prev, curr) => prev + curr, 0);
  const physicalSkills = optimisticSkills.filter(
    (skill) => skill.attribute === "strength" || skill.attribute === "speed"
  );
  const cognitiveSkills = optimisticSkills.filter(
    (skill) => skill.attribute === "intellect" || skill.attribute === "willpower"
  );
  const spiritualSkills = optimisticSkills.filter(
    (skill) => skill.attribute === "awareness" || skill.attribute === "presence"
  );
  const startingPathRankId = PathInfo[paths[0]]?.startingPathSkill ?? "";
  const recommendedSkills = paths.flatMap((path) => PathInfo[path].recommendedSkills ?? []);
  const canIncrease = (skill: SkillData) => {
    const currentRank = skill.rank;
    // Check if we've hit the per-skill limit
    if (currentRank >= maxRankPerSkill) return false;
    // Check if we've hit the total ranks limit
    if (totalRanks >= maxTotalRanks) return false;
    return true;
  };

  const renderSkillGroup = (title: string, skills: SkillData[]) => (
    <div className="flex flex-col gap-2">
      <div className="mt-4 font-bold text-lg">{title}</div>
      {skills.map((skill, index) => (
        <Card key={index} className="relative items-center grid grid-cols-12">
          {recommendedSkills.includes(skill.skill) && <RecommendedBanner />}
          <div className="flex flex-col col-span-4 md:col-span-2 lg:col-span-2">
            <div className="font-semibold capitalize">{skill.skill}</div>
            <div className="text-gray-400 text-sm capitalize">{skill.attribute}</div>
          </div>
          <div className="col-span-6 md:col-span-8 lg:col-span-7 text-gray-400 text-sm italic">{skill.description}</div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 text-center">
            {attributeModifiers[skill.attribute] >= 0 ? "+" : ""}
            {attributeModifiers[skill.attribute]}
          </div>
          <div className="flex lg:flex-row flex-col-reverse items-center gap-1 col-span-1 md:col-span-1 lg:col-span-2">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="group relative">
                <button
                  onClick={() => {
                    const currentRank = skill.rank;
                    if (rank === currentRank) {
                      // If clicking the current rank, decrease it by one
                      if (rank === 1 && skill.skill === startingPathRankId) {
                        toast({
                          title: "Cannot Remove Starting Path Skill",
                          message: "This skill is granted by your starting heroic path and cannot be removed.",
                          variant: "error",
                          duration: 5000,
                        });
                      } else {
                        startTransition(() => setOptimisticSkills({ skill: skill.skill, value: rank - 1 }));
                        updateSkill(character.id, skill, rank - 1);
                      }
                    } else if (rank < currentRank) {
                      // Decreasing is always allowed - set directly to target rank
                      startTransition(() => setOptimisticSkills({ skill: skill.skill, value: rank }));
                      updateSkill(character.id, skill, rank);
                    } else if (canIncrease(skill)) {
                      // Only increase if allowed by constraints - set directly to target rank
                      if (rank - currentRank + totalRanks > maxTotalRanks) {
                        const amountCanIncrease = maxTotalRanks - totalRanks;
                        const newRank = currentRank + amountCanIncrease;
                        startTransition(() => setOptimisticSkills({ skill: skill.skill, value: newRank }));
                        updateSkill(character.id, skill, newRank);
                      } else {
                        startTransition(() => setOptimisticSkills({ skill: skill.skill, value: rank }));
                        updateSkill(character.id, skill, rank);
                      }
                    }
                  }}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                    skill.rank >= rank
                      ? skill.skill === startingPathRankId && rank === 1
                        ? "bg-accent-500 border-accent-600"
                        : "bg-primary-500 border-primary-600"
                      : canIncrease(skill) && maxRankPerSkill >= rank
                      ? "bg-gray-50 border-gray-300 hover:border-primary-400 hover:scale-110 hover:bg-primary-100 cursor-pointer"
                      : "bg-gray-300 border-gray-400 opacity-50"
                  } peer`}
                  aria-label={`Set ${skill.skill} to rank ${rank}`}
                  title={skill.skill === startingPathRankId && rank === 1 ? "From Starting Path" : ""}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-lg">Choose Your Skills</h1>
      <div>
        Skills represent your character's trained abilities. Each skill is linked to an attribute - your total modifier
        for a skill is its rank plus the associated attribute's value.
      </div>
      {/* grid headers */}
      <div className="items-center grid grid-cols-12 px-2 lg:px-4 rounded font-semibold text-lg">
        <div className="col-span-3 md:col-span-2 lg:col-span-2">Skill</div>
        <div className="col-span-5 md:col-span-8 lg:col-span-7">Description</div>
        <div className="col-span-2 md:col-span-1 lg:col-span-1">Mod</div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">Rank</div>
      </div>

      {renderSkillGroup("Physical Skills", physicalSkills)}
      {renderSkillGroup("Cognitive Skills", cognitiveSkills)}
      {renderSkillGroup("Spiritual Skills", spiritualSkills)}
    </div>
  );
};
