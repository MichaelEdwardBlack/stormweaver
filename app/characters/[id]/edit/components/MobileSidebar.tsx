"use client";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { LuPanelLeftOpen } from "react-icons/lu";

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 p-2 rounded-md bg-neutral-800 text-white shadow-lg"
        onClick={() => setOpen(true)}
      >
        <LuPanelLeftOpen />
      </button>

      {/* Sidebar Drawer */}
      {open && <Sidebar mobile onClose={() => setOpen(false)} />}
    </>
  );
};
