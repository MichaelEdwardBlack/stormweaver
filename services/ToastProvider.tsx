import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaX } from "react-icons/fa6";

export type ToastVariant = "primary" | "accent" | "success" | "info" | "error" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string | React.ReactNode;
  variant: ToastVariant;
  duration?: number; // ms, undefined = persistent
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const variantStyles: Record<ToastVariant, string> = {
  primary: "border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 text-primary-900 dark:text-primary-100",
  accent: "border-accent-500 bg-accent-500/10 dark:bg-accent-500/20 text-accent-900 dark:text-accent-100",
  success: "border-green-500 bg-green-500/10 dark:bg-green-500/20 text-green-900 dark:text-green-100",
  info: "border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-100",
  error: "border-red-500 bg-red-500/10 dark:bg-red-500/20 text-red-900 dark:text-red-100",
  warning: "border-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-900",
};

const progressStyles: Record<ToastVariant, string> = {
  primary: "bg-primary-500",
  accent: "bg-accent-500",
  success: "bg-green-500",
  info: "bg-blue-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((data: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { ...data, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div className="fixed right-4 top-4 z-50 flex w-full max-w-xs md:max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { id, title, message, variant, duration } = toast;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!duration) return;
    timeoutRef.current = setTimeout(() => onDismiss(id), duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [duration, id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur ${variantStyles[variant]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="rounded-md p-1 opacity-60 transition hover:opacity-100 cursor-pointer"
        >
          <FaX size={14} />
        </button>
      </div>

      {duration && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-1 ${progressStyles[variant]}`}
        />
      )}
    </motion.div>
  );
}
