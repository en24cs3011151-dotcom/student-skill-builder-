import { ArrowRight, BookOpen, CheckCircle2, Compass, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProgressBar } from '../components/ProgressBar';
import { SkillIcon } from '../components/SkillIcon';
import { useApp } from '../context/AppContext';
import { SKILLS_CATALOG } from '../data/skillsData';
import { Skill } from '../types';
import { getSkillProgress } from '../utils/calculations';

export function MyLearning() {
  const { learningData, unenrollSkill } = useApp();
  const [skillToRemove, setSkillToRemove] = useState<Skill | null>(null);

  const enrolledSkills = learningData.enrolledSkillIds
    .map((id) => SKILLS_CATALOG.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s));

  const inProgressSkills = enrolledSkills.filter(
    (skill) => !getSkillProgress(skill, learningData.completedLessonIds).isCompleted
  );

  const completedSkills = enrolledSkills.filter(
    (skill) => getSkillProgress(skill, learningData.completedLessonIds).isCompleted
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
            My Learning
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your enrolled skill roadmaps, monitor module completion, and resume study sessions.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
        >
          <Compass className="h-4 w-4" />
          Discover More Skills
        </Link>
      </div>

      {enrolledSkills.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            Your learning list is empty
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Enroll in a skill roadmap from the catalog to start tracking modules, lessons, and XP.
          </p>
          <Link
            to="/explore"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Explore Skills
          </Link>
        </div>
      ) : (
        <>
          {/* In-Progress Skills */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                Active Learning Paths ({inProgressSkills.length})
              </h3>
            </div>

            {inProgressSkills.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                All currently enrolled skills are completed. Explore new skills to start another path.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {inProgressSkills.map((skill) => {
                  const stats = getSkillProgress(
                    skill,
                    learningData.completedLessonIds
                  );
                  const pendingModules =
                    stats.totalModules - stats.completedModules;

                  return (
                    <div
                      key={skill.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                              <SkillIcon icon={skill.icon} className="h-5 w-5" />
                            </div>
                            <div>
                              <Link
                                to={`/skills/${skill.id}`}
                                className="font-display text-base font-semibold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                              >
                                {skill.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {skill.category} · {skill.difficulty}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSkillToRemove(skill)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            aria-label={`Remove ${skill.name} from My Learning`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-5">
                          <ProgressBar
                            value={stats.percentage}
                            label={`${stats.completedLessons} of ${stats.totalLessons} lessons completed`}
                            showValue
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                          <span className="tabular-nums">
                            Completed modules:{' '}
                            <strong className="font-mono text-slate-900 dark:text-slate-100">
                              {stats.completedModules}
                            </strong>
                          </span>
                          <span className="tabular-nums">
                            Pending modules:{' '}
                            <strong className="font-mono text-slate-900 dark:text-slate-100">
                              {pendingModules}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <Link
                          to={`/skills/${skill.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <span>
                            {stats.completedLessons > 0
                              ? 'Continue Learning'
                              : 'Start Learning'}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Completed Learning Paths */}
          <section className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Completed Learning Paths ({completedSkills.length})
            </h3>

            {completedSkills.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Finish every lesson in an active skill roadmap to earn your Knowledge Master milestone.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {completedSkills.map((skill) => {
                  const stats = getSkillProgress(
                    skill,
                    learningData.completedLessonIds
                  );
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/skills/${skill.id}`}
                            className="block truncate font-display text-base font-semibold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                          >
                            {skill.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {stats.totalModules} modules · {stats.totalLessons}{' '}
                            lessons · 100% completed
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Link
                          to={`/skills/${skill.id}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Review
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSkillToRemove(skill)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      <ConfirmDialog
        open={Boolean(skillToRemove)}
        title={`Remove "${skillToRemove?.name}"?`}
        description="This removes the skill from your My Learning list. You can re-enroll anytime from Explore Skills."
        confirmLabel="Remove Skill"
        onConfirm={() => {
          if (skillToRemove) {
            unenrollSkill(skillToRemove.id);
            setSkillToRemove(null);
          }
        }}
        onCancel={() => setSkillToRemove(null)}
      />
    </div>
  );
}
