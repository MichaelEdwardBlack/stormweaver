import { PathInfo } from "@/lib/data/paths";
import { RecommendedBanner } from "@/components/ui/RecommendedBanner";
import { useCharacter } from "@/services/CharacterProvider";

type SelectSkillsProps = {
  maxRankPerSkill: number;
  maxTotalRanks: number;
};

export const SelectSkills = ({ maxRankPerSkill, maxTotalRanks }: SelectSkillsProps) => {
  const character = useCharacter().character;
  const paths = character.paths.map((path) => path.path);
  const skills = character.skills;
  const physicalSkills = skills.filter((skill) => skill.)
  // const { getRank, getModifier, increaseRank, decreaseRank, getTotalRanks, getSkillsByCategory } = useSkills();
  const { physicalSkills, cognitiveSkills, spiritualSkills } = getSkillsByCategory();
  const startingPathRankId = PathInfo[paths[0]]?.startingPathSkill ?? "";
  const recommendedSkills = paths.flatMap((path) => PathInfo[path].recommendedSkills ?? []);
  const canIncrease = (skillId: string) => {
    const currentRank = getRank(skillId);
    // Check if we've hit the per-skill limit
    if (currentRank >= maxRankPerSkill) return false;
    // Check if we've hit the total ranks limit
    if (getTotalRanks() >= maxTotalRanks + 1) return false; // +1 to account for starting path skill
    return true;
  };

  const renderSkillGroup = (title: string, skills: Skill[]) => (
    <div className="flex flex-col gap-2">
      <div className="mt-4 font-bold text-lg">{title}</div>
      {skills.map((skill) => (
        <div key={skill.name} className="relative items-center grid grid-cols-12 p-4 border rounded-lg">
          {recommendedSkills.includes(skill.id) && <RecommendedBanner />}
          <div className="flex flex-col col-span-4 md:col-span-2 lg:col-span-2">
            <div className="font-semibold">{skill.name}</div>
            <div className="text-gray-400 text-sm capitalize">{skill.attribute}</div>
          </div>
          <div className="col-span-6 md:col-span-8 lg:col-span-7 text-gray-400 text-sm italic">{skill.description}</div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 text-center">
            {getModifier(skill.id) >= 0 ? "+" : ""}
            {getModifier(skill.id)}
          </div>
          <div className="flex lg:flex-row flex-col-reverse items-center gap-1 col-span-1 md:col-span-1 lg:col-span-2">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="group relative">
                <button
                  onClick={() => {
                    const currentRank = getRank(skill.id);
                    if (rank === currentRank) {
                      // If clicking the current rank, decrease it by one
                      if (rank === 1 && skill.id === startingPathRankId) {
                        // but do not decrease starting path skill without removing the path
                      } else {
                        decreaseRank(skill.id);
                      }
                    } else if (rank < currentRank) {
                      // Decreasing is always allowed
                      while (getRank(skill.id) > rank) decreaseRank(skill.id);
                    } else if (canIncrease(skill.id)) {
                      // Only increase if allowed by constraints
                      while (getRank(skill.id) < rank && canIncrease(skill.id)) {
                        increaseRank(skill.id);
                      }
                    }
                  }}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                    getRank(skill.id) >= rank
                      ? skill.id === startingPathRankId && rank === 1
                        ? "bg-yellow-500 border-yellow-600"
                        : "bg-blue-500 border-blue-600"
                      : canIncrease(skill.id) && maxRankPerSkill >= rank
                      ? "bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-100 cursor-pointer"
                      : "bg-gray-300 border-gray-400 opacity-50"
                  } peer`}
                  aria-label={`Set ${skill.name} to rank ${rank}`}
                  title={skill.id === startingPathRankId && rank === 1 ? "From Starting Path" : ""}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold text-lg">Choose Your Skills</div>
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
