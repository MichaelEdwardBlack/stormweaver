import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { PathInfo } from "@/lib/data/paths";
import { TalentTreeId, TalentTrees } from "@/lib/data/tree";
import { categorizeTalentNode, getSmartPath } from "@/lib/utils/tree";
import { TalentNodeCard } from "./TalentNodeCard";

type TalentTreeProps = {
  pathId: TalentTreeId;
  readonly?: boolean;
  isStacked?: boolean;
  asAncestry?: boolean;
};

const getBaseHeight = (pathId: TalentTreeId, isStacked: boolean) => {
  return pathId === "singer" ? 1000 : isStacked ? 2900 : 1100;
};

export const TalentTree = ({ pathId, readonly, isStacked = true, asAncestry = false }: TalentTreeProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>([false, false, false]);
  const [height, setHeight] = useState(getBaseHeight(pathId, isStacked));
  const keyTalenId = PathInfo[pathId].keyTalent.id;
  const tree = {
    nodes: TalentTrees[pathId].nodes.map((node) => {
      let categorizedNode = categorizeTalentNode(node, {
        isKeyTalent: node.id === keyTalenId,
        collapsedSubclasses: {
          subclass1: isCollapsed[0],
          subclass2: isCollapsed[1],
          subclass3: isCollapsed[2],
        },
        isStacked,
      });
      if (isStacked) {
        categorizedNode.x += 0.5;
      } else {
        categorizedNode.x += 2.5;
      }
      return categorizedNode;
    }),
    edges: TalentTrees[pathId].edges,
    subclasses: TalentTrees[pathId].subclasses,
  };

  useEffect(() => {
    const baseHeight = getBaseHeight(pathId, isStacked);
    const collapsedCount = isCollapsed.filter(Boolean).length;
    const newHeight = baseHeight - collapsedCount * 750;
    if (isStacked) {
      setHeight(newHeight);
    } else if (collapsedCount === 3) {
      setHeight(400);
    } else {
      setHeight(baseHeight);
    }
  }, [isCollapsed, pathId, isStacked]);

  return (
    <div className="max-w-full scrollbar-thin">
      <div className={`z-0 relative w-full overflow-y-hidden overflow-x-scroll`} style={{ height: height }}>
        {tree.nodes.map((node) => {
          const isSubclass = node.isSubclass;
          const subIndex = node.subclassIndex;
          const collapsed = subIndex !== undefined && isCollapsed[subIndex];
          const isKeyTalent = node.isKeyTalent;

          return (
            <motion.div
              key={node.id}
              className={`absolute flex items-center justify-center ${
                isSubclass ? "w-96" : isKeyTalent ? "w-80" : "w-64"
              } h-48`}
              style={{
                left: `${node.x * 300 - (isSubclass ? 64 : isKeyTalent ? 32 : 0)}px`,
                top: `${node.y * 200}px`,
              }}
              layout
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {isSubclass ? (
                <motion.div
                  className="z-10 flex items-center justify-center w-full gap-2 p-4 text-xl font-bold text-center border-2 rounded-lg cursor-pointer backdrop-blur-lg"
                  onClick={() =>
                    setIsCollapsed((prev) => prev.map((value, index) => (index === subIndex ? !value : value)))
                  }
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span layout>{node.name}</motion.span>
                  <motion.div animate={{ rotate: collapsed ? -90 : 0 }} transition={{ duration: 0.25 }}>
                    <FaChevronDown size={20} />
                  </motion.div>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {!collapsed && (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TalentNodeCard talent={node} readonly={readonly} asAncestryTalent={asAncestry} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
        <svg className="w-full overflow-visible pointer-events-none -z-10">
          {tree.edges.map((edge, i) => {
            if (edge.invisible) return;
            const from = tree.nodes.find((n) => n.id === edge.from)!;
            const to = tree.nodes.find((n) => n.id === edge.to)!;
            if (from.subclassIndex !== undefined && isCollapsed[from.subclassIndex]) return;

            return (
              <motion.path
                key={`${pathId}-${i}-${isCollapsed.join("-")}-${isStacked}`} // 👈 forces remount when collapse state changes
                d={getSmartPath(from, to, tree.nodes)}
                fill="none"
                stroke="white"
                strokeWidth="2"
                layout
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.05, // adjust delay for nice timing
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
