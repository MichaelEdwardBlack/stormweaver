"use client";

import { HoverCard } from "@/components/ui/cards/HoverCard";
import { HeroicPathId, RadiantPathId, SingerPathId } from "@/lib/data/tree";
import { HeroIcons } from "@/lib/utils/iconMapper";
import { cn } from "@/lib/utils/styles";

type CardProps = {
  path: HeroicPathId | SingerPathId | RadiantPathId;
  onClick?: () => void;
  isSelected?: boolean;
};
export const HeroCard = ({ path, onClick, isSelected = false }: CardProps) => {
  return (
    <div onClick={onClick}>
      <HoverCard
        className={cn(
          "flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
          isSelected ? "text-accent-400" : "hover:text-accent-500"
        )}
      >
        <div>{HeroIcons[path]}</div>
        <div className="uppercase">{path}</div>
      </HoverCard>
    </div>
  );
};
