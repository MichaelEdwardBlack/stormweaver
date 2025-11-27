"use client";
import { cn } from "@/lib/utils/styles";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { GiAnvilImpact, GiCharacter, GiHorizonRoad, GiScrollQuill } from "react-icons/gi";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
const sections = [
  { name: "Origin", path: "origin", icon: <GiCharacter /> },
  { name: "Path & Talents", path: "path", icon: <GiHorizonRoad /> },
  { name: "Equipment", path: "equipment", icon: <GiAnvilImpact /> },
  { name: "Story", path: "story", icon: <GiScrollQuill /> },
];
export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden py-4 md:px-4 border-r bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-700/40",
        collapsed ? "w-10 items-center" : "w-64"
      )}
    >
      <nav className="flex flex-col space-y-2">
        {sections.map((section) => {
          const isActive = pathname?.includes(section.path);
          return (
            <Link
              key={section.path}
              href={`/characters/${params.id}/edit/${section.path}`}
              className={`px-3 py-2 rounded-md transition ${
                isActive
                  ? "text-primary-500 font-semibold"
                  : "dark:text-neutral-300 text-neutral-700 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white"
              }`}
            >
              {collapsed ? section.icon : section.name}
            </Link>
          );
        })}
      </nav>
      <button
        className={cn(
          "cursor-pointer mb-0 mt-auto",
          "dark:text-neutral-300 text-neutral-700 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white",
          collapsed ? "place-self-center" : "place-self-end"
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
      </button>
    </aside>
  );
};
