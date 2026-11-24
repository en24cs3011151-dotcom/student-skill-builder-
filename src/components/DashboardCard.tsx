import React from 'react';

interface DashboardCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: React.ReactNode;
  accent?: 'blue' | 'indigo' | 'emerald' | 'amber';
}

export function DashboardCard({
  label,
  value,
  helper,
  icon,
  accent = 'blue',
}: DashboardCardProps) {
  const iconTone =
    accent === 'indigo'
      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
      : accent === 'emerald'
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
      : accent === 'amber'
      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
      : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-50">
            {value}
          </p>
          {helper && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {helper}
            </p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconTone}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
