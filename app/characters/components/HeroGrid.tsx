"use client";
import { TalentTreeId } from "@/lib/data/tree";
import { HeroCard } from "./HeroCard";

type HeroGridProps = {
  onSelect: (path: TalentTreeId) => void;
  selectedPath: TalentTreeId | null;
};

export const HeroGrid = ({ onSelect, selectedPath }: HeroGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <HeroCard path="agent" onClick={() => onSelect("agent")} isSelected={selectedPath === "agent"} />
      <HeroCard path="envoy" onClick={() => onSelect("envoy")} isSelected={selectedPath === "envoy"} />
      <HeroCard path="hunter" onClick={() => onSelect("hunter")} isSelected={selectedPath === "hunter"} />
      <HeroCard path="leader" onClick={() => onSelect("leader")} isSelected={selectedPath === "leader"} />
      <HeroCard path="scholar" onClick={() => onSelect("scholar")} isSelected={selectedPath === "scholar"} />
      <HeroCard path="warrior" onClick={() => onSelect("warrior")} isSelected={selectedPath === "warrior"} />
    </div>
  );
};
