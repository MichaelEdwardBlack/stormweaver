import { Card } from "@/components/ui/cards/Card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 animate-pulse" />
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 w-full">
            <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded flex-1 animate-pulse" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse" />
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <div className="ml-12 h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/5 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/8 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded flex-1 animate-pulse" />
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 w-full">
            <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded flex-1 animate-pulse" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse" />
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <div className="ml-12 h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded flex-1 animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
