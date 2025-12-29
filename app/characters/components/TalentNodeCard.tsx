import { ActionType, TalentNode } from "@/lib/data/tree";
import { ActionCostIcon } from "./ActionCostIcon";
import { GlossaryText } from "../../../components/GlossaryText";
import { useCharacter } from "@/services/CharacterProvider";
import { calculateAvailablePoints, getBlockingRequirements } from "@/lib/utils/derivedStats";

type TalentNodeCardProps = {
  talent: TalentNode;
  isUnlocked?: boolean;
  readonly?: boolean;
  onSelect?: (talent: TalentNode) => void;
};
export const TalentNodeCard = ({ talent, isUnlocked = false, readonly, onSelect }: TalentNodeCardProps) => {
  const character = useCharacter().character;
  const requirements = [];
  if (talent.requirements?.attribute) {
    requirements.push(
      `Attribute: ${talent.requirements.attribute.id} ${
        talent.requirements.attribute.min ? `(${talent.requirements.attribute.min})` : ""
      }`
    );
  }
  if (talent.requirements?.skill) {
    requirements.push(
      `Skill Rank: ${talent.requirements.skill.id} ${
        talent.requirements.skill.min ? `${talent.requirements.skill.min}+` : ""
      }`
    );
  }
  if (talent.requirements?.level) {
    requirements.push(`Level: ${talent.requirements.level}+`);
  }
  if (talent.requirements?.other) {
    requirements.push(`${talent.requirements.other.join(", ")}`);
  }

  const isRefundable = !talent.isKeyTalent;
  const blockingRequirements = isUnlocked ? [] : getBlockingRequirements(talent, character);
  const isBlocked = blockingRequirements.length > 0;
  const pointsAvailable = calculateAvailablePoints(
    character.level,
    character.ancestry === "Singer",
    character.talents.length
  );
  const disabled = !pointsAvailable && ((isUnlocked && !isRefundable) || !isUnlocked);

  const getTooltip = () => {
    if (readonly) return "";
    if (disabled && !isUnlocked) {
      return "Must level up to unlock more talents";
    }
    if (isBlocked) {
      return `Blocked by: ${blockingRequirements.join(", ")}`;
    }
  };

  const onClick = () => {
    if (readonly) return;
    if (isBlocked) return;
    if (disabled) return;
    if (isUnlocked && !isRefundable) return;
    onSelect?.(talent);
  };
  return (
    <div
      onClick={onClick}
      title={getTooltip()}
      className={`
            border p-4 rounded-lg w-full z-10
            transition-all duration-300 ease-in-out
            ${isUnlocked ? "border-yellow-500 bg-yellow-50/5" : "border-gray-300"}
            ${
              !readonly &&
              !isBlocked &&
              isRefundable &&
              !disabled &&
              `
              hover:z-10
              hover:shadow-lg hover:scale-105
              hover:border-yellow-400
              hover:bg-linear-to-br from-yellow-50/10 to-amber-50/10
              cursor-pointer
            `
            }
            ${
              !readonly &&
              (isBlocked || (disabled && !isUnlocked)) &&
              `
              cursor-not-allowed 
              opacity-90
              grayscale
              bg-gray-600/20
              border-gray-600/50
              `
            }
            backdrop-blur-lg
            relative
            overflow-hidden
          `}
    >
      <div className="flex items-center gap-2">
        <ActionCostIcon actionCost={talent.actionCost as ActionType} />
        <div
          className={`
              font-semibold
              ${isUnlocked ? "text-yellow-500" : ""}
              ${!readonly && !isBlocked && !disabled && "group-hover:text-yellow-600"}
            `}
        >
          {talent.name}
        </div>
      </div>
      {requirements.length > 0 && (
        <div className="text-xs italic text-gray-400">Prerequisites: {requirements.join(", ")}</div>
      )}
      <div className="mt-2 text-sm">
        <GlossaryText text={talent.description ?? ""} />
      </div>
    </div>
  );
};
