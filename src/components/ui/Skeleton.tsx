import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

/* Base shimmer bar — adapts to light (#E2E8F0) & dark (#1E293B) */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
}) => {
  return (
    <div
      style={{ width, height }}
      className={`animate-pulse bg-slate-200 dark:bg-slate-700/70 rounded-[12px] ${className}`}
    />
  );
};

/* Card skeleton — mirrors the project / metric card layout */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <Skeleton className="w-11 h-11 rounded-[14px]" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-[8px]" />
      <Skeleton className="w-full h-4 rounded-[6px]" />
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Skeleton className="w-24 h-4 rounded-[6px]" />
        <div className="flex -space-x-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/* Table skeleton — mirrors the tasks / projects list table */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-24 h-6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 w-1/3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <Skeleton className="w-full h-4" />
          </div>
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};

/* Kanban column skeleton — matches the kanban board column layout */
export const KanbanColumnSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-[22px] bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 min-h-[600px] space-y-3 transition-colors">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-[16px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <Skeleton className="w-full h-4 rounded-[6px]" />
          <Skeleton className="w-4/5 h-4 rounded-[6px]" />
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
