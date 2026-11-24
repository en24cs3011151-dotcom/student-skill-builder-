import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skill } from '../types';
import { ProgressBar } from './ProgressBar';
import { SkillIcon } from './SkillIcon';

interface SkillCardProps {
  skill: Skill;
  isEnrolled: boolean;
  progressPercentage?: number;
  isCompleted?: boolean;
  onEnroll: (skillId: string) => void;
}

export function SkillCard({
  skill,
  isEnrolled,
  progressPercentage = 0,
  isCompleted = false,
  onEnroll,
}: SkillCardProps) {
  const totalLessons = skill.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <SkillIcon icon={skill.icon} className="h-5 w-5" />
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          ) : isEnrolled ? (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Enrolled
            </span>
          ) : null}
        </div>

        <Link
          to={`/skills/${skill.id}`}
          className="mt-4 block font-display text-base font-semibold text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
        >
          {skill.name}
        </Link>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>{skill.category}</span>
          <span aria-hidden="true">·</span>
          <span>{skill.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{skill.estimatedHours}h</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{totalLessons} lessons</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {skill.shortDescription}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        {isEnrolled && (
          <div className="mb-3.5">
            <ProgressBar
              value={progressPercentage}
              label="Path Progress"
              showValue
              tone={isCompleted ? 'emerald' : 'blue'}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {isEnrolled ? (
            <Link
              to={`/skills/${skill.id}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
            >
              <span>{isCompleted ? 'Review Path' : 'Continue Learning'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEnroll(skill.id)}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 whitespace-nowrap dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Start Learning
              </button>
              <Link
                to={`/skills/${skill.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Roadmap
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
