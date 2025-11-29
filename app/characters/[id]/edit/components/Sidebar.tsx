"use client";

import { cn } from "@/lib/utils/styles";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  GiAnvilImpact,
  GiCharacter,
  GiChestArmor,
  GiHorizonRoad,
  GiLightBackpack,
  GiProgression,
  GiScrollQuill,
  GiSmart,
} from "react-icons/gi";
import { LuBadgePlus, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { PiIdentificationCard, PiTreeStructure } from "react-icons/pi";
import { LuChevronDown } from "react-icons/lu";
import { IoIosStats } from "react-icons/io";
import { GiSkills } from "react-icons/gi";

// ICONS for subsections (change to whatever you want)
import { LuBadge, LuLayers, LuUsers, LuSword } from "react-icons/lu";
import { FaLevelUpAlt } from "react-icons/fa";

const sections = [
  {
    name: "Origin",
    path: "origin",
    icon: <GiCharacter />,
    children: [
      { name: "Ancestry", path: "ancestry", icon: <LuUsers /> },
      { name: "Culture", path: "culture", icon: <LuLayers /> },
      { name: "Name", path: "name", icon: <PiIdentificationCard /> },
    ],
  },
  {
    name: "Path & Talents",
    path: "path",
    icon: <GiHorizonRoad />,
    children: [
      { name: "Starting Path", path: "starting", icon: <PiTreeStructure /> },
      { name: "Attributes", path: "attributes", icon: <IoIosStats /> },
      { name: "Skills", path: "skills", icon: <GiSkills /> },
      { name: "Expertise - from Intelligence", path: "expertise", icon: <GiSmart /> },
      { name: "Bonus Ancestry Talent", path: "bonus", icon: <LuBadgePlus /> },
    ],
  },
  {
    name: "Equipment",
    path: "equipment",
    icon: <GiAnvilImpact />,
    children: [
      { name: "Starting Kit", path: "kit", icon: <GiLightBackpack /> },
      { name: "Weapons", path: "weapons", icon: <LuSword /> },
      { name: "Armor", path: "armor", icon: <GiChestArmor /> },
    ],
  },
  {
    name: "Story",
    path: "story",
    icon: <GiScrollQuill />,
    children: [
      { name: "Background", path: "background", icon: <LuLayers /> },
      { name: "Goals", path: "goals", icon: <LuBadge /> },
    ],
  },
  {
    name: "Advancement",
    path: "advancement",
    icon: <GiProgression />,
    children: [
      { name: "Level", path: "level", icon: <FaLevelUpAlt /> },
      { name: "Attributes", path: "attributes", icon: <IoIosStats /> },
      { name: "Skills", path: "skills", icon: <GiSkills /> },
      { name: "Expertise - from Intelligence", path: "expertise", icon: <GiSmart /> },
      { name: "Bonus Ancestry Talent", path: "bonus", icon: <LuBadgePlus /> },
    ],
  },
];

export const Sidebar = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => {
  const pathname = usePathname();
  const params = useParams();

  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // auto-expand parent group if pathname matches a child route
  useEffect(() => {
    sections.forEach((section) => {
      const activeChild = section.children.some((child) => pathname?.includes(child.path));

      if (activeChild) {
        setOpenSections((prev) => ({ ...prev, [section.path]: true }));
      }
    });
  }, [pathname]);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? "4rem" : "16rem" }}
        transition={{ width: { duration: 0.3, ease: "easeInOut" } }}
        style={{ height: "calc(100vh - 61px)" }}
        className={cn(
          "flex flex-col justify-between sticky top-14 md:top-16 overflow-x-hidden overflow-y-auto scrollbar-thin py-4 border-r",
          "bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md border-neutral-700/40",
          collapsed ? "items-center px-2" : "px-4",
          mobile && "fixed top-14 md:top-16 left-0 z-50 w-64 shadow-xl animate-in"
        )}
      >
        <nav className="flex flex-col w-full space-y-2">
          {sections.map((sec) => {
            const isActiveParent = pathname?.includes(sec.path);
            const isOpen = openSections[sec.path];

            return (
              <div key={sec.path} className="w-full">
                {/* PARENT BUTTON */}
                <button
                  onClick={() => toggleSection(sec.path)}
                  className={cn(
                    "flex items-center w-full py-2 rounded-md transition group select-none cursor-pointer",
                    collapsed ? "justify-center" : "px-3",
                    isActiveParent
                      ? "text-primary-500 font-semibold"
                      : "dark:text-neutral-300 text-neutral-700 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white"
                  )}
                >
                  {/* Parent Icon */}
                  <span className="text-xl">{sec.icon}</span>

                  {/* Label only shown if not collapsed */}
                  {!collapsed && (
                    <>
                      <span className="flex-1 ml-3 text-left">{sec.name}</span>

                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <LuChevronDown />
                      </motion.span>
                    </>
                  )}
                </button>

                {/* CHILDREN SECTION */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={collapsed ? "w-full" : "pl-8 mt-1 w-full"}
                    >
                      {/* BUBBLE GROUP CONTAINER WHEN COLLAPSED */}
                      <div
                        className={cn(
                          "flex flex-col",
                          collapsed
                            ? "mx-auto mt-2 space-y-2 p-2 rounded-xl bg-neutral-300/40 dark:bg-neutral-800/40"
                            : "space-y-1 border-l border-neutral-400/30 pl-3"
                        )}
                      >
                        {sec.children.map((child) => {
                          const childPath = `/characters/${params.id}/edit/${sec.path}/${child.path}`;
                          const isActiveChild = pathname === childPath;

                          return (
                            <Link
                              key={child.path}
                              href={childPath}
                              className={cn(
                                "flex items-center transition rounded-md",
                                collapsed ? "justify-center p-2 text-xl" : "px-2 py-1 text-sm",
                                isActiveChild
                                  ? "text-primary-500 font-semibold"
                                  : "dark:text-neutral-400 text-neutral-600 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white"
                              )}
                              onClick={() => mobile && onClose?.()}
                            >
                              <span className="text-lg">{child.icon}</span>

                              {!collapsed && <span className="ml-2">{child.name}</span>}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
        {/* SIDEBAR COLLAPSE BUTTON */}
        <button
          className={cn(
            "cursor-pointer p-2 rounded-md transition",
            "dark:text-neutral-300 text-neutral-700 hover:bg-neutral-300/40 hover:text-black dark:hover:bg-neutral-700/40 dark:hover:text-white",
            collapsed ? "place-self-center" : "place-self-end",
            mobile ? "hidden" : "visible"
          )}
          onClick={() => (mobile ? onClose?.() : setCollapsed(!collapsed))}
        >
          {collapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
        </button>
      </motion.aside>
      {/* MOBILE BACKDROP */}
      {mobile && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />}
    </>
  );
};
