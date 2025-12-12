"use client";
import { RadiantPathId, RadiantPathTrees, TalentTreeId } from "@/lib/data/tree";
import { ToggleSlider } from "./ToggleSlider";
import { useEffect, useState } from "react";
import { PathInfo } from "@/lib/data/paths";
import { TalentTree } from "./TalentTree";
import { useCharacter } from "@/services/CharacterProvider";
import { calculateAvailablePoints, calculateMaxAncestryTalents } from "@/lib/utils/derivedStats";
import { HeroCard } from "./HeroCard";
import { AddHeroPathSelector } from "./AddHeroPathSelector";
import { Button } from "@/components/ui/buttons/Button";
import { addCharacterPath, unlockCharacterTalent } from "@/lib/actions/character";

type HeroicPathProps = {
  pathId: TalentTreeId;
  readonly?: boolean;
  showMulticlassOptions?: boolean;
  showRadiantOptions?: boolean;
  showAncestryOptions?: boolean;
};

export const HeroicPath = ({
  pathId,
  readonly = false,
  showMulticlassOptions = false,
  showRadiantOptions = false,
  showAncestryOptions = false,
}: HeroicPathProps) => {
  const [currentPathId, setCurrentPathId] = useState<TalentTreeId>(pathId);
  const character = useCharacter().character;
  const level = character.level;
  const ancestry = character.ancestry;
  const selectedPaths = character.paths.map((p) => p.path);
  // const { addPath, paths: selectedPaths, removePath } = usePaths();
  // const { unlockTalent, unlockAncestryTalent, hasPointsAvailable, hasUnlockedChildren, refundTalent } = useTalents();
  // const { increaseRank, decreaseRank, addRadiantSkill } = useSkills();
  const [isStacked, setIsStacked] = useState(true);
  const maxSingerTalents = calculateMaxAncestryTalents(level, ancestry === "Singer");

  const pathInfo = PathInfo[currentPathId];
  if (!pathInfo) {
    return <div>Path not found</div>;
  }
  const hasAvailablePoints = calculateAvailablePoints(level, ancestry === "Singer", character.talents.length) > 0;

  useEffect(() => {
    setCurrentPathId(pathId);
  }, [pathId]);
  return (
    <div>
      {showMulticlassOptions && (
        <div className="sticky left-0 flex flex-wrap gap-2">
          {selectedPaths.map((path, i) => {
            if (!showAncestryOptions && path === "singer") return;
            return (
              <div key={i} className="w-32">
                <HeroCard path={path} onClick={() => setCurrentPathId(path)} isSelected={path === currentPathId} />
              </div>
            );
          })}
          <AddHeroPathSelector
            onSelect={(pathId: TalentTreeId) => setCurrentPathId(pathId)}
            selectedPath={currentPathId}
            showRadiantOptions={showRadiantOptions}
            showAncestryOptions={showAncestryOptions}
          />
        </div>
      )}
      {/* Header */}
      <div className="sticky left-0 z-20 flex justify-between p-1 border-b-2 top-14 backdrop-blur-lg border-amber-500">
        <div className="text-2xl font-bold">{pathInfo.name}</div>
        {!selectedPaths.includes(currentPathId) && (
          <Button
            variant="solid"
            color={hasAvailablePoints ? "accent" : "neutral"}
            className={!hasAvailablePoints ? "cursor-not-allowed" : "cursor-pointer"}
            onClick={() => {
              if (hasAvailablePoints) {
                if (Object.keys(RadiantPathTrees).includes(currentPathId)) {
                  const subclasses = RadiantPathTrees[currentPathId as RadiantPathId].subclasses;
                  // addRadiantSkill(subclasses[1]);
                  // addRadiantSkill(subclasses[2]);
                }
                const isStartingPath = selectedPaths.length === 0;
                addCharacterPath(character.id, currentPathId, isStartingPath);
                unlockCharacterTalent(character.id, pathInfo.keyTalent.id, showAncestryOptions);
                if (isStartingPath) {
                  if (pathInfo.startingPathSkill) {
                    // increaseRank(pathInfo.startingPathSkill);
                  }
                  if (ancestry === "Singer") {
                    addCharacterPath(character.id, "singer");
                    unlockCharacterTalent(character.id, PathInfo.singer.keyTalent.id, true);
                  }
                }
              }
            }}
            disabled={!hasAvailablePoints}
            title={!hasAvailablePoints ? "Must level up to multiclass" : ""}
          >
            Select Path
          </Button>
        )}
        {/* {selectedPaths.includes(currentPathId) && (
            <MotionButton
              className={`${
                hasChildrenUnlocked
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-yellow-600 cursor-pointer"
              } px-4 py-2 rounded font-semibold text-white`}
              onClick={() => {
                if (!hasChildrenUnlocked) {
                  if (selectedPaths.length === 1 && pathInfo.startingPathSkill) {
                    decreaseRank(pathInfo.startingPathSkill);
                  }
                  removePath(currentPathId);
                  refundTalent(pathInfo.keyTalent.id);
                }
              }}
              disabled={hasChildrenUnlocked}
              title={hasChildrenUnlocked ? "Refund all other non key talents before removing path" : ""}
            >
              Remove Path
            </MotionButton>
          )} */}
      </div>
      <div className="sticky left-0 flex flex-col mt-2">
        <div>{pathInfo.description}</div>
        {pathInfo?.startingPathSkill && (
          <div className="my-4 text-lg font-semibold capitalize">Starting Path Skill: {pathInfo.startingPathSkill}</div>
        )}
        {/* {currentPathId !== "singer" ? (
            <div>
              <div className="mb-4 text-xl font-semibold">{pathInfo.name} Specialties</div>
              <ul>
                {pathInfo.subclasses.map((specialty) => (
                  <li key={specialty.id}>
                    <strong>{specialty.name}</strong>. {specialty.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-lg font-semibold text-yellow-600">
              You can select up to your max ancestry talents in the singer tree: {maxSingerTalents} (not including the
              key talent)
            </div>
          )} */}
        {currentPathId !== "singer" && (
          <div className="ml-auto mr-0">
            <ToggleSlider
              value={isStacked}
              onToggle={(stacked) => setIsStacked(stacked)}
              onLabel="Tall"
              offLabel="Broad"
              onColor="var(--color-primary-500)"
              offColor="var(--color-accent-500)"
            />
          </div>
        )}
      </div>

      <TalentTree
        pathId={currentPathId}
        readonly={readonly}
        isStacked={currentPathId === "singer" ? false : isStacked}
        asAncestry={showAncestryOptions}
      />
    </div>
  );
};
