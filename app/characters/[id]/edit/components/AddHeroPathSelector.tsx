import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Path } from "@/lib/generated/prisma/enums";
import { useCharacter } from "@/services/CharacterProvider";
import { HeroicPathTrees, RadiantPathTrees } from "@/lib/data/tree";
import { HeroCard } from "@/app/characters/components/HeroCard";
import { Card } from "@/components/ui/cards/Card";
import { HoverCard } from "@/components/ui/cards/HoverCard";

type AddHeroPathSelectorProps = {
  onSelect: (pathId: Path) => void;
  selectedPath: Path;
  showRadiantOptions?: boolean;
  showAncestryOptions?: boolean;
};

export const AddHeroPathSelector = ({
  onSelect,
  selectedPath,
  showRadiantOptions = false,
  showAncestryOptions = false,
}: AddHeroPathSelectorProps) => {
  const character = useCharacter().character;
  const level = character.level;
  const ancestry = character.ancestry;
  const paths = character.paths.map((path) => path.path);
  const [openHeroic, setOpenHeroic] = useState<boolean>(false);
  const [openRadiant, setOpenRadiant] = useState<boolean>(false);
  const heroicPaths = Object.keys(HeroicPathTrees) as Path[];
  const radiantPaths = Object.keys(RadiantPathTrees) as Path[];
  if (ancestry === "Singer" && showAncestryOptions) {
    heroicPaths.push("singer");
  }
  let usedPaths = paths;
  if (ancestry !== "Singer" || !showAncestryOptions) {
    usedPaths = paths.filter((p) => p !== "singer");
  }
  const unusedHeroicPaths = heroicPaths.filter((path: Path) => !usedPaths.includes(path));
  const unusedRadiantPaths = radiantPaths.filter((path: Path) => !usedPaths.includes(path));
  return (
    <>
      <HoverCard
        className="flex flex-col gap-2 justify-center items-center rounded-lg w-32 uppercase text-center cursor-pointer"
        onClick={() => setOpenHeroic(!openHeroic)}
      >
        {!openHeroic && <FaPlusCircle />}
        {openHeroic && <FaMinusCircle />}
        Heroic
      </HoverCard>
      {/* HEROIC CARDS */}
      <AnimatePresence>
        {openHeroic &&
          (() => {
            const list = unusedHeroicPaths;
            const len = list.length;
            return (
              <>
                {list.map((path, i) => (
                  <motion.button
                    key={path}
                    className="w-32"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.36, ease: "easeInOut", delay: i * 0.08 } }}
                    exit={{
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.28, ease: "easeInOut", delay: (len - i - 1) * 0.06 },
                    }}
                  >
                    <HeroCard path={path} onClick={() => onSelect(path)} isSelected={selectedPath === path} />
                  </motion.button>
                ))}
              </>
            );
          })()}
      </AnimatePresence>

      {level > 1 && showRadiantOptions && (
        <button
          className="flex flex-col justify-center items-center bg-neutral-800 hover:bg-neutral-600 p-4 rounded-lg w-32 font-semibold text-lg text-center cursor-pointer"
          onClick={() => setOpenRadiant(!openRadiant)}
        >
          Add A Radiant Path
          {!openRadiant && <FaPlusCircle />}
          {openRadiant && <FaMinusCircle />}
        </button>
      )}
      <AnimatePresence>
        {openRadiant &&
          (() => {
            const list = unusedRadiantPaths;
            const len = list.length;
            return (
              <>
                {list.map((path, i) => (
                  <motion.button
                    key={path}
                    className="w-32"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.36, ease: "easeInOut", delay: i * 0.08 } }}
                    exit={{
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.28, ease: "easeInOut", delay: (len - i - 1) * 0.06 },
                    }}
                  >
                    <HeroCard path={path} onClick={() => onSelect(path)} isSelected={selectedPath === path} />
                  </motion.button>
                ))}
              </>
            );
          })()}
      </AnimatePresence>
    </>
  );
};
