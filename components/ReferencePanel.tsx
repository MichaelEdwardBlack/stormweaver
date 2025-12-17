"use client";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useGlossary } from "../store/glossary";
import { useEffect, useRef } from "react";
import { GlossaryText } from "./GlossaryText";

export const ReferencePanel = () => {
  const { selected, close } = useGlossary();
  const i = selected.length - 1;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if the panel is open and click is outside of it
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (selected.length > 0) close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selected.length, close]);

  return (
    <div
      ref={panelRef}
      className={`glossary-panel relative transition-all duration-500 ${
        selected.length === 0 ? "translate-x-full" : ""
      }`}
    >
      <div className="panel-content">
        <div className="py-4 font-bold text-2xl">{selected[i]?.title ?? ""}</div>
        <div>
          <GlossaryText text={selected[i]?.description ?? ""} />
        </div>
      </div>
      <button className="top-2 right-5 absolute cursor-pointer" onClick={close}>
        <IoIosCloseCircleOutline size={24} />
      </button>
    </div>
  );
};
