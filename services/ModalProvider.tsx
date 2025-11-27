"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/styles";
import { FaX } from "react-icons/fa6";

interface ModalOptions {
  title?: string;
  content: ReactNode;
  size?: "sm" | "md" | "lg";
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const openModal = (options: ModalOptions) => setModal(options);
  const closeModal = () => setModal(null);

  useEffect(() => {
    if (!modal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modal, closeModal]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Size rules
  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className={cn(
                "w-full p-6 rounded-2xl shadow-2xl border relative",
                "bg-white text-neutral-900 border-neutral-200",
                "dark:bg-neutral-900 dark:text-white dark:border-neutral-700",
                sizeMap[modal.size ?? "md"]
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center justify-between pb-3">
                {modal.title && <h2 className="text-xl font-semibold">{modal.title}</h2>}
              </div>
              <button
                onClick={closeModal}
                className="absolute text-gray-600 transition-colors cursor-pointer dark:text-gray-400 hover:text-black top-7 right-7 dark:hover:text-white"
              >
                <FaX size={16} />
              </button>
              <div>{modal.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
