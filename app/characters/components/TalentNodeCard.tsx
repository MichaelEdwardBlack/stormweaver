import { ActionType, TalentNode } from "@/lib/data/tree";
import { ActionCostIcon } from "./ActionCostIcon";
import { GlossaryText } from "./GlossaryText";

type TalentNodeCardProps = {
  talent: TalentNode;
  readonly?: boolean;
  asAncestryTalent?: boolean;
  onSelect?: (talent: TalentNode) => void;
};
export const TalentNodeCard = ({ talent, readonly, asAncestryTalent = false, onSelect }: TalentNodeCardProps) => {
  // const {
  //   isTalentUnlocked,
  //   getBlockingRequirements,
  //   unlockTalent,
  //   unlockAncestryTalent,
  //   isKeyTalent,
  //   refundTalent,
  //   hasPointsAvailable,
  // } = useTalents();
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

  // const isUnlocked = isTalentUnlocked(talent.id);
  // const isRefundable = !isKeyTalent(talent.id);
  // const blockingRequirements = getBlockingRequirements(talent, asAncestryTalent);
  // const isBlocked = blockingRequirements.length > 0;
  // const pointsAvailable = hasPointsAvailable();
  const isUnlocked = false;
  const isRefundable = true;
  const blockingRequirements: string[] = [];
  const isBlocked = false;
  const pointsAvailable = false;
  const disabled = !pointsAvailable && ((isUnlocked && !isRefundable) || !isUnlocked);

  // const toggle = () => {
  // if (readonly || !isRefundable || isBlocked) return;
  // if (isUnlocked) {
  //   refundTalent(talent.id);
  // } else {
  //   unlockTalent(talent.id);
  //   if (asAncestryTalent) {
  //     console.log("unlocking ancestry talent", talent.id);
  //     unlockAncestryTalent(talent.id);
  //   }
  // }
  // };

  const getTooltip = () => {
    if (readonly) return "";
    if (disabled && !isUnlocked) {
      return "Must level up to unlock more talents";
    }
    if (isBlocked) {
      return `Blocked by: ${blockingRequirements.join(", ")}`;
    }
  };
  return (
    <div
      onClick={() => onSelect?.(talent)}
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
