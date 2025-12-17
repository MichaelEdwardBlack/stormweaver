"use client";

import { ModalProvider } from "@/services/ModalProvider";
import { ToastProvider } from "@/services/ToastProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ModalProvider>{children}</ModalProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
