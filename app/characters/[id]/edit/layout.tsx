import { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { getFullCharacter } from "@/lib/actions/character";
import { CharacterProvider } from "@/services/CharacterProvider";

interface Props {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CharacterEditLayout({ children, params }: Props) {
  const { id } = await params;
  const character = await getFullCharacter(id);
  const hasStartingPath = character.paths.findIndex((path) => path.isStartingPath) !== -1;
  const characterIntellect = character.attributes.find((attribute) => attribute.attribute === "intellect")?.value ?? 0;
  const sections = [
    {
      name: "Origin",
      path: "origin",
      children: [
        { name: "Ancestry", path: "ancestry", showComplete: !!character.ancestry },
        {
          name: "Culture",
          path: "culture",
          showComplete: character.expertises.filter((e) => e.isOrigin).length >= 2,
        },
        {
          name: "Name",
          path: "name",
          showWarning: character.name.length < 2,
          showComplete: character.name.length >= 2,
        },
      ],
    },
    {
      name: "Path & Talents",
      path: "path",
      children: [
        {
          name: "Starting Path",
          path: "starting",
          showComplete: hasStartingPath,
        },
        {
          name: "Attributes",
          path: "attributes",
          showComplete:
            character.attributes.reduce((totalPointsSpent, attribute) => totalPointsSpent + attribute.value, 0) >= 12,
          hide: !hasStartingPath,
        },
        {
          name: "Skills",
          path: "skills",
          showComplete: character.skills.reduce((totalPointsSpent, skill) => totalPointsSpent + skill.rank, 0) >= 5,
          hide: !hasStartingPath,
        },
        {
          name: "Expertise - from Intelligence",
          path: "expertise",
          showComplete: character.expertises.filter((e) => !e.isOrigin).length >= characterIntellect,
          hide: !hasStartingPath || characterIntellect === 0,
        },
        {
          name: "Bonus Ancestry Talent",
          path: "bonus",
          showComplete: character.talents.filter((talent) => talent.isAncestryTalent).length >= 1,
          hide: !hasStartingPath,
        },
      ],
    },
    {
      name: "Equipment",
      path: "equipment",
      children: [
        { name: "Starting Kit", path: "kit", showComplete: !!character.startingKit },
        { name: "Weapons", path: "weapons" },
        { name: "Armor", path: "armor" },
      ],
    },
    {
      name: "Story",
      path: "story",
      children: [
        { name: "Background", path: "background" },
        { name: "Goals", path: "goals" },
      ],
    },
    {
      name: "Advancement",
      path: "advancement",
      children: [
        { name: "Level", path: "level" },
        { name: "Attributes", path: "attributes", hide: character.level < 2 },
        { name: "Skills", path: "skills", hide: character.level < 2 },
        { name: "Expertise - from Intelligence", path: "expertise", hide: character.level < 2 },
        { name: "Bonus Ancestry Talent", path: "bonus", hide: character.level < 2 },
      ],
    },
  ];
  return (
    <div className="relative flex flex-row overflow-hidden" style={{ height: "calc(100vh - 61px)" }}>
      <div className="hidden md:flex">
        <Sidebar sections={sections} />
      </div>
      <div className="md:hidden">
        <MobileSidebar sections={sections} />
      </div>
      <main className="flex-1 w-full p-6 bg-neutral-50 dark:bg-neutral-900 overflow-auto scrollbar-thin">
        <CharacterProvider character={character}>{children}</CharacterProvider>
      </main>
    </div>
  );
}
