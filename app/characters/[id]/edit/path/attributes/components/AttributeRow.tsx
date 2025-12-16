import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { RecommendedBanner } from "@/components/ui/RecommendedBanner";
import { AttributeInfo } from "@/lib/data/attributes";
import { calculateMaxModifierPerAttribute } from "@/lib/utils/derivedStats";
import { useCharacter } from "@/services/CharacterProvider";
import { AttributeStatInfo } from "./AttributeStatInfo";
import { Button } from "@/components/ui/buttons/Button";
import { Attribute } from "@/lib/generated/prisma/enums";

export const AttributeRow = ({
  attribute,
  isRecommended = false,
  onUpdateAttribute,
  disableIncrement,
}: {
  attribute: AttributeInfo & { value: number };
  isRecommended: boolean;
  onUpdateAttribute: (attribute: Attribute, value: number) => void;
  disableIncrement: boolean;
}) => {
  const character = useCharacter().character;
  const level = character.level;
  const max = calculateMaxModifierPerAttribute(level);
  const min = 0;
  return (
    <ExpandableCard
      className="relative items-center my-2"
      title={attribute.name}
      description={attribute.description}
      actionLabel={
        <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={() => onUpdateAttribute(attribute.attribute, attribute.value - 1)}
            color={attribute.value <= min ? "neutral" : "primary"}
            disabled={attribute.value <= min}
          >
            -
          </Button>
          <div className="w-5 md:w-6 font-semibold text-center">{attribute.value}</div>
          <Button
            onClick={() => onUpdateAttribute(attribute.attribute, attribute.value + 1)}
            color={attribute.value >= max ? "neutral" : "primary"}
            disabled={attribute.value >= max || disableIncrement}
          >
            +
          </Button>
          {isRecommended && <RecommendedBanner />}
        </div>
      }
    >
      <AttributeStatInfo attribute={attribute.attribute} />
    </ExpandableCard>
  );
};
