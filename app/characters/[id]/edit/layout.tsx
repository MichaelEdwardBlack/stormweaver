import { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { getSidebarSections } from "@/lib/actions/character";

interface Props {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CharacterEditLayout({ children, params }: Props) {
  const { id } = await params;
  const sections = await getSidebarSections(id);
  return (
    <div className="relative flex flex-row">
      <div className="hidden md:flex">
        <Sidebar sections={sections} />
      </div>
      <div className="md:hidden">
        <MobileSidebar sections={sections} />
      </div>
      <main className="flex-1 w-full p-6 bg-neutral-50 dark:bg-neutral-900">{children}</main>
    </div>
  );
}
