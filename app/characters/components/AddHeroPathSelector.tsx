import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { HeroCard } from "./HeroCard";
import { AnimatePresence, motion } from "framer-motion";
import { HeroicPathTrees, RadiantPathTrees, TalentTreeId } from "@/lib/data/tree";
import { useCharacter } from "@/services/CharacterProvider";
import { HoverCard } from "@/components/ui/cards/HoverCard";

type AddHeroPathSelectorProps = {
  onSelect: (pathId: TalentTreeId) => void;
  selectedPath: TalentTreeId;
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
  const { level, ancestry } = character;
  const paths = character.paths.map((p) => p.path);
  const [openHeroic, setOpenHeroic] = useState<boolean>(false);
  const [openRadiant, setOpenRadiant] = useState<boolean>(false);
  const heroicPaths = Object.keys(HeroicPathTrees) as TalentTreeId[];
  const radiantPaths = Object.keys(RadiantPathTrees) as TalentTreeId[];
  if (ancestry === "Singer" && showAncestryOptions) {
    heroicPaths.push("singer");
  }
  let usedPaths = paths;
  if (ancestry !== "Singer" || !showAncestryOptions) {
    usedPaths = paths.filter((p) => p !== "singer");
  }
  const unusedHeroicPaths = heroicPaths.filter((path: TalentTreeId) => !usedPaths.includes(path));
  const unusedRadiantPaths = radiantPaths.filter((path: TalentTreeId) => !usedPaths.includes(path));
  return (
    <>
      <HoverCard className="p-0">
        <button
          className="flex flex-col justify-center items-center p-4 rounded-lg w-32 font-semibold text-lg text-center cursor-pointer"
          onClick={() => setOpenHeroic(!openHeroic)}
        >
          Add A Heroic Path
          {!openHeroic && <FaPlusCircle />}
          {openHeroic && <FaMinusCircle />}
        </button>
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
        <HoverCard className="p-0">
          <button
            className="flex flex-col justify-center items-center p-4 rounded-lg w-32 font-semibold text-lg text-center cursor-pointer"
            onClick={() => setOpenRadiant(!openRadiant)}
          >
            Add A Radiant Path
            {!openRadiant && <FaPlusCircle />}
            {openRadiant && <FaMinusCircle />}
          </button>
        </HoverCard>
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
