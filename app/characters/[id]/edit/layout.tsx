import { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";

interface Props {
  children: ReactNode;
}

export default function CharacterEditLayout({ children }: Props) {
  return (
    <div className="relative flex flex-row">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      <main className="flex-1 w-full p-6 bg-neutral-50 dark:bg-neutral-900">{children}</main>
    </div>
  );
}
