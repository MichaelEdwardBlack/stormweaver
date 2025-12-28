"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionButton } from "../buttons/MotionButton";
import { cn } from "@/lib/utils/styles";
import { Card } from "./Card";
import { FaChevronDown } from "react-icons/fa6";

type ExpandableCardProps = {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  children?: React.ReactNode; // expanded content
  className?: string;
  // optional action button inside the header (won't toggle the card)
  action?: () => void;
  actionLabel?: React.ReactNode;
  actionClassName?: string;
  getIsExpanded?: (isExpanded: boolean) => void;
};

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  id,
  title,
  description,
  defaultOpen = false,
  children,
  className,
  action,
  actionLabel,
  actionClassName,
  getIsExpanded,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    getIsExpanded?.(!open);
    setOpen((v) => !v);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    // allow Enter or Space to toggle the card when it has focus
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <Card
      className={cn("cursor-pointer", className)}
      id={id}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="inline-block"
        >
          <FaChevronDown className="dark:text-neutral-400 text-neutral-600" />
        </motion.div>
        <div className="flex items-center justify-between w-full space-x-4">
          <div>
            <div className="text-lg font-semibold">{title}</div>
            {description && <div className="mt-1 text-sm opacity-75">{description}</div>}
          </div>

          <div className="shrink-0">
            {action ? (
              <MotionButton
                onClick={(e: React.MouseEvent) => {
                  // prevent the click from toggling the card
                  e.stopPropagation();
                  action();
                }}
                className={cn("px-3 py-2 rounded dark:bg-neutral-700 bg-neutral-200", actionClassName)}
              >
                {actionLabel ?? "Action"}
              </MotionButton>
            ) : actionLabel ? (
              actionLabel
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
