"use client";
import { Section, Sidebar } from "./Sidebar";
import { useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";

export const MobileSidebar = ({ sections }: { sections: Section[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed z-50 p-2 text-white rounded-md shadow-lg md:hidden bottom-4 left-4 bg-neutral-800"
        onClick={() => setOpen(true)}
      >
        <LuPanelLeftOpen />
      </button>

      {/* Sidebar Drawer */}
      {open && <Sidebar sections={sections} mobile onClose={() => setOpen(false)} />}
    </>
  );
};
