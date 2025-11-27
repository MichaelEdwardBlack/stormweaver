"use client";

import { cn } from "@/lib/utils/styles";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { GiAnvilImpact, GiCharacter, GiHorizonRoad, GiScrollQuill } from "react-icons/gi";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const sections = [
  {
    name: "Origin",
    path: "origin",
    icon: <GiCharacter />,
    children: [
      { name: "Ancestry", path: "ancestry" },
      { name: "Culture", path: "culture" },
      { name: "Name", path: "name" },
    ],
  },
  {
    name: "Path & Talents",
    path: "path",
    icon: <GiHorizonRoad />,
    children: [
      { name: "Class Path", path: "class" },
      { name: "Talents", path: "talents" },
    ],
  },
  {
    name: "Equipment",
    path: "equipment",
    icon: <GiAnvilImpact />,
    children: [
      { name: "Weapons", path: "weapons" },
      { name: "Armor", path: "armor" },
      { name: "Gear", path: "gear" },
    ],
  },
  {
    name: "Story",
    path: "story",
    icon: <GiScrollQuill />,
    children: [
      { name: "Background", path: "background" },
      { name: "Goals", path: "goals" },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();

  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ origin: true });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden py-4 md:px-4 border-r bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-700/40",
        collapsed ? "w-12 items-center" : "w-64"
      )}
    >
      <nav className="flex flex-col w-full space-y-2">
        {sections.map((sec) => {
          const isActiveParent = pathname?.includes(sec.path);
          const isOpen = openSections[sec.path];

          return (
            <div key={sec.path} className={cn("w-full", collapsed ? "justify-center" : "")}>
              {/* Parent section button */}
              <button
                onClick={() => toggleSection(sec.path)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-md transition cursor-pointer",
                  isActiveParent
                    ? "text-primary-500 font-semibold"
                    : "dark:text-neutral-300 text-neutral-700 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white"
                )}
              >
                <span className="text-lg">{sec.icon}</span>

                {!collapsed && <span className="flex-1 ml-2 text-left">{sec.name}</span>}

                {!collapsed && <span className="ml-auto">{isOpen ? <LuChevronDown /> : <LuChevronRight />}</span>}
              </button>

              {/* Child links */}
              {!collapsed && isOpen && (
                <div className="flex flex-col pl-3 mt-1 ml-8 space-y-1 border-l border-neutral-400/30">
                  {sec.children.map((child) => {
                    const childPath = `/characters/${params.id}/edit/${sec.path}/${child.path}`;
                    const isActiveChild = pathname === childPath;

                    return (
                      <Link
                        key={child.path}
                        href={childPath}
                        className={cn(
                          "px-2 py-1 rounded-md text-sm transition",
                          isActiveChild
                            ? "text-primary-500 font-semibold"
                            : "dark:text-neutral-400 text-neutral-600 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white"
                        )}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse sidebar button */}
      <button
        className={cn(
          "cursor-pointer mb-0 mt-auto p-2 rounded-md transition",
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
