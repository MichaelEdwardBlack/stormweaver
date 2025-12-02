"use client";

import { HeroGrid } from "@/app/characters/components/HeroGrid";
import { HeroicPath } from "@/app/characters/components/HeroicPath";
import { TalentTreeId } from "@/lib/data/tree";
import { useState } from "react";

export const StartingPathPicker = () => {
  const [path, setPath] = useState<TalentTreeId | null>(null);
  return (
    <div className="relative">
      <div>Select a Heroic Path</div>
      <HeroGrid onSelect={(path) => setPath(path)} selectedPath={path} />
      {path && <HeroicPath pathId={path} />}
    </div>
  );
};
