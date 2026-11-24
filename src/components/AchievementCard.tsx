import { Lock, CheckCircle2 } from 'lucide-react';
import { AchievementDefinition } from '../types';
import { AchievementIcon } from './SkillIcon';

interface AchievementCardProps {
  achievement: AchievementDefinition;
  unlockedAt?: string;
}

export function AchievementCard({
  achievement,
  unlockedAt,
}: AchievementCardProps) {
  const isUnlocked = Boolean(unlockedAt);

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
        isUnlocked
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          : 'border-slate-200/80 bg-slate-50/70 opacity-80 dark:border-slate-800/70 dark:bg-slate-900/50'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isUnlocked
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            <AchievementIcon icon={achievement.icon} className="h-5 w-5" />
          </div>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Locked
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          {achievement.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {achievement.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>{achievement.milestoneLabel}</span>
        <span className="font-mono font-medium text-indigo-600 tabular-nums dark:text-indigo-400">
          +{achievement.xpBonus} XP
        </span>
      </div>
    </div>
  );
}
