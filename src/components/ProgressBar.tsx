interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  tone?: 'blue' | 'violet' | 'emerald';
  size?: 'sm' | 'md';
}

export function ProgressBar({
  value,
  label,
  showValue = false,
  tone = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const fillClass =
    tone === 'emerald'
      ? 'bg-emerald-600 dark:bg-emerald-500'
      : tone === 'violet'
      ? 'bg-indigo-600 dark:bg-indigo-500'
      : 'bg-blue-600 dark:bg-blue-500';

  const trackHeight = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label ? (
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showValue && (
            <span className="font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${trackHeight}`}
      >
        <div
          className={`${trackHeight} rounded-full transition-all duration-300 ease-out ${fillClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
