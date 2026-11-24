import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProgressBar } from '../components/ProgressBar';
import { SkillIcon } from '../components/SkillIcon';
import { useApp } from '../context/AppContext';
import { SKILLS_CATALOG } from '../data/skillsData';
import { getSkillProgress } from '../utils/calculations';

export function SkillDetails() {
  const { skillId } = useParams<{ skillId: string }>();
  const {
    learningData,
    enrollSkill,
    unenrollSkill,
    toggleLessonComplete,
    recordSkillAccess,
  } = useApp();

  const skill = SKILLS_CATALOG.find((s) => s.id === skillId);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [confirmUnenroll, setConfirmUnenroll] = useState(false);

  useEffect(() => {
    if (skill) {
      recordSkillAccess(skill.id);
      const initial: Record<string, boolean> = {};
      skill.modules.forEach((m) => {
        initial[m.id] = true;
      });
      setExpandedModules(initial);
    }
  }, [skill?.id]);

  if (!skill) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
          Skill not found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The requested skill roadmap could not be located in the catalog.
        </p>
        <Link
          to="/explore"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Skills
        </Link>
      </div>
    );
  }

  const isEnrolled = learningData.enrolledSkillIds.includes(skill.id);
  const completedSet = new Set(learningData.completedLessonIds);
  const progress = getSkillProgress(skill, learningData.completedLessonIds);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Skills
        </Link>
      </div>

      {/* Header Overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <SkillIcon icon={skill.icon} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{skill.category}</span>
                <span aria-hidden="true">·</span>
                <span>{skill.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {skill.estimatedHours} hours estimated
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {progress.totalModules} modules · {progress.totalLessons} lessons
                </span>
              </div>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                {skill.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {skill.overview}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {isEnrolled ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {progress.isCompleted ? 'Path Completed' : 'Enrolled'}
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmUnenroll(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => enrollSkill(skill.id)}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Enroll in Learning Path
              </button>
            )}
          </div>
        </div>

        {/* Overall Path Progress */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Roadmap Completion ({progress.completedLessons} of{' '}
              {progress.totalLessons} lessons · {progress.completedModules} of{' '}
              {progress.totalModules} modules)
            </span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {progress.percentage}%
            </span>
          </div>
          <ProgressBar
            value={progress.percentage}
            tone={progress.isCompleted ? 'emerald' : 'blue'}
          />
        </div>
      </section>

      {/* Learning Outcomes & Prerequisites */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            What You Will Learn
          </h3>
          <ul className="mt-3.5 space-y-2.5">
            {skill.learningOutcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Prerequisites & Study Specs
          </h3>
          <ul className="mt-3.5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {skill.prerequisites.map((req) => (
              <li key={req} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Difficulty
              </span>
              <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                {skill.difficulty}
              </p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Estimated Effort
              </span>
              <p className="mt-0.5 font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {skill.estimatedHours} hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Learning Roadmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Structured Learning Roadmap
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete lessons in order to earn XP and unlock achievements.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {skill.modules.map((mod) => {
            const modDoneCount = mod.lessons.filter((l) =>
              completedSet.has(l.id)
            ).length;
            const modPct = Math.round(
              (modDoneCount / mod.lessons.length) * 100
            );
            const isExpanded = expandedModules[mod.id] ?? true;

            return (
              <div
                key={mod.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                        {mod.title}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {mod.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className="font-mono text-xs text-slate-600 tabular-nums dark:text-slate-400">
                      {modDoneCount}/{mod.lessons.length} ({modPct}%)
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                    {mod.lessons.map((lesson) => {
                      const done = completedSet.has(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex min-w-0 items-start gap-3.5">
                            <button
                              type="button"
                              onClick={() =>
                                toggleLessonComplete(skill.id, lesson.id)
                              }
                              aria-label={
                                done
                                  ? `Mark "${lesson.title}" as incomplete`
                                  : `Mark "${lesson.title}" as completed`
                              }
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                done
                                  ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                                  : 'border-slate-300 bg-white hover:border-blue-600 dark:border-slate-600 dark:bg-slate-800'
                              }`}
                            >
                              {done && <Check className="h-3.5 w-3.5" />}
                            </button>

                            <div className="min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  done
                                    ? 'text-slate-500 line-through dark:text-slate-400'
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {lesson.summary}
                              </p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {lesson.type}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                                  <Clock className="h-3 w-3" />
                                  {lesson.durationMinutes} min
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono font-medium text-indigo-600 tabular-nums dark:text-indigo-400">
                                  +{lesson.xpReward} XP
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleLessonComplete(skill.id, lesson.id)
                            }
                            className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                              done
                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                            }`}
                          >
                            {done ? 'Completed' : 'Mark Completed'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ConfirmDialog
        open={confirmUnenroll}
        title={`Remove ${skill.name} from My Learning?`}
        description="This removes the skill from your active learning list. Your completed lesson history and XP remain safely stored."
        confirmLabel="Remove Skill"
        onConfirm={() => {
          unenrollSkill(skill.id);
          setConfirmUnenroll(false);
        }}
        onCancel={() => setConfirmUnenroll(false)}
      />
    </div>
  );
}
