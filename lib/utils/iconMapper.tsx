import {
  GiAllSeeingEye,
  GiAnvilImpact,
  GiBookmarklet,
  GiCharacter,
  GiChestArmor,
  GiCrackedBallDunk,
  GiCurlyWing,
  GiEyeTarget,
  GiFallingLeaf,
  GiHammerDrop,
  GiHeavyArrow,
  GiHorizonRoad,
  GiLightBackpack,
  GiPoliceBadge,
  GiPortal,
  GiPrism,
  GiProgression,
  GiQueenCrown,
  GiScrollQuill,
  GiSmart,
  GiStoneWall,
  GiSwordsEmblem,
  GiTribalMask,
  GiWingedSword,
} from "react-icons/gi";
import { LuBadgePlus } from "react-icons/lu";
import { PiIdentificationCard, PiTreeStructure } from "react-icons/pi";
import { IoIosStats } from "react-icons/io";
import { GiSkills } from "react-icons/gi";
import { LuBadge, LuLayers, LuUsers, LuSword } from "react-icons/lu";
import { FaLevelUpAlt } from "react-icons/fa";
import { JSX } from "react";
import { FaHandshake } from "react-icons/fa6";

export const SidebarIcons: Record<string, JSX.Element> = {
  origin: <GiCharacter />,
  ancestry: <LuUsers />,
  culture: <LuLayers />,
  name: <PiIdentificationCard />,
  path: <GiHorizonRoad />,
  starting: <PiTreeStructure />,
  attributes: <IoIosStats />,
  skills: <GiSkills />,
  expertise: <GiSmart />,
  bonus: <LuBadgePlus />,
  equipment: <GiAnvilImpact />,
  kit: <GiLightBackpack />,
  weapons: <LuSword />,
  armor: <GiChestArmor />,
  story: <GiScrollQuill />,
  background: <LuLayers />,
  goals: <LuBadge />,
  advancement: <GiProgression />,
  level: <FaLevelUpAlt />,
};

export const HeroIcons: Record<string, JSX.Element> = {
  agent: <GiPoliceBadge />,
  envoy: <FaHandshake />,
  hunter: <GiHeavyArrow />,
  leader: <GiQueenCrown />,
  scholar: <GiBookmarklet />,
  warrior: <GiSwordsEmblem />,
  singer: <GiTribalMask />,
  dustbringer: <GiCrackedBallDunk />,
  edgedancer: <GiFallingLeaf />,
  elsecaller: <GiPortal />,
  lightweaver: <GiPrism />,
  skybreaker: <GiWingedSword />,
  stoneward: <GiStoneWall />,
  truthwatcher: <GiAllSeeingEye />,
  willshaper: <GiHammerDrop />,
  windrunner: <GiCurlyWing />,
};
