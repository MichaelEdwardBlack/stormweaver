import { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";

interface Props {
  children: ReactNode;
}

export default function CharacterEditLayout({ children }: Props) {
  return (
    <div className="flex flex-1 h-full">
      <Sidebar />
      <main className="flex-1 w-full p-6 bg-neutral-50 dark:bg-neutral-900">{children}</main>
    </div>
  );
}
