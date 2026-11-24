import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  ListTodo,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WeeklyActivityChart } from '../components/Charts';
import { DashboardCard } from '../components/DashboardCard';
import { ProgressBar } from '../components/ProgressBar';
import { SkillCard } from '../components/SkillCard';
import { SkillIcon } from '../components/SkillIcon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SKILLS_CATALOG } from '../data/skillsData';
import {
  getCompletedSkillsCount,
  getLevelInfo,
  getOverallLearningProgress,
  getSkillProgress,
} from '../utils/calculations';

export function Dashboard() {
  const { user } = useAuth();
  const { learningData, enrollSkill } = useApp();
  const navigate = useNavigate();

  const levelInfo = getLevelInfo(learningData.xp);
  const completedCourses = getCompletedSkillsCount(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );
  const overallProgress = getOverallLearningProgress(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );
  const pendingTasksCount = learningData.tasks.filter(
    (t) => !t.completed
  ).length;

  const recentSkills = learningData.recentlyAccessedSkillIds
    .map((id) => SKILLS_CATALOG.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 4);

  const recommendedSkills = SKILLS_CATALOG.filter(
    (s) => !learningData.enrolledSkillIds.includes(s.id)
  ).slice(0, 3);

  const weeklyMinutesTotal = learningData.weeklyActivity.reduce(
    (sum, item) => sum + item.minutes,
    0
  );

  const firstName = user?.name.split(' ')[0] || 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <section className="flex flex-col justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Level {levelInfo.level} · {levelInfo.title}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            You have completed{' '}
            <span className="font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {learningData.completedLessonIds.length}
            </span>{' '}
            lessons across{' '}
            <span className="font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {learningData.enrolledSkillIds.length}
            </span>{' '}
            enrolled skills. Keep your daily streak active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Compass className="h-4 w-4" />
            Explore Skills
          </Link>
          <button
            type="button"
            onClick={() => navigate('/tasks-goals?action=new-goal')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Target className="h-4 w-4" />
            Add a New Goal
          </button>
          <Link
            to="/my-learning"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <BookOpen className="h-4 w-4" />
            View My Learning
          </Link>
          <button
            type="button"
            onClick={() => navigate('/tasks-goals?action=new-task')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            Create a Task
          </button>
        </div>
      </section>

      {/* Primary KPI Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          label="Current Learning Streak"
          value={`${learningData.streak} days`}
          helper="Active consecutive study days"
          icon={<Flame className="h-5 w-5" />}
          accent="amber"
        />
        <DashboardCard
          label="Total XP Points"
          value={learningData.xp.toLocaleString()}
          helper={`${levelInfo.xpNeededForNext} XP to Level ${levelInfo.level + 1}`}
          icon={<Sparkles className="h-5 w-5" />}
          accent="indigo"
        />
        <DashboardCard
          label="Skills Being Learned"
          value={learningData.enrolledSkillIds.length}
          helper={`${completedCourses} completed · ${Math.max(0, learningData.enrolledSkillIds.length - completedCourses)} in progress`}
          icon={<BookOpen className="h-5 w-5" />}
          accent="blue"
        />
        <DashboardCard
          label="Overall Learning Progress"
          value={`${overallProgress}%`}
          helper="Average across enrolled roadmaps"
          icon={<TrendingUp className="h-5 w-5" />}
          accent="blue"
        />
        <DashboardCard
          label="Completed Courses"
          value={completedCourses}
          helper="Full learning paths finished"
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="emerald"
        />
        <DashboardCard
          label="Pending Tasks"
          value={pendingTasksCount}
          helper={`${learningData.tasks.length - pendingTasksCount} tasks completed`}
          icon={<ListTodo className="h-5 w-5" />}
          accent="indigo"
        />
      </section>

      {/* Weekly Activity + Recently Accessed Skills */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Weekly Learning Activity
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Minutes logged over the past 7 days
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                {(weeklyMinutesTotal / 60).toFixed(1)}h
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This week
              </p>
            </div>
          </div>
          <WeeklyActivityChart data={learningData.weeklyActivity} height={240} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Recently Accessed Skills
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Resume right where you left off
              </p>
            </div>
            <Link
              to="/my-learning"
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View all
            </Link>
          </div>

          {recentSkills.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You haven&apos;t started any skills yet.
              </p>
              <Link
                to="/explore"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Explore the catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentSkills.map((skill) => {
                const stats = getSkillProgress(
                  skill,
                  learningData.completedLessonIds
                );
                return (
                  <Link
                    key={skill.id}
                    to={`/skills/${skill.id}`}
                    className="group flex items-center gap-3.5 py-3.5 first:pt-1 last:pb-1"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400">
                      <SkillIcon icon={skill.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {skill.name}
                        </p>
                        <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          {stats.percentage}%
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <ProgressBar
                          value={stats.percentage}
                          size="sm"
                          tone={stats.isCompleted ? 'emerald' : 'blue'}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Skills */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recommended Next Skills
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Curated additions to complement your current learning paths
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline whitespace-nowrap dark:text-blue-400"
          >
            Browse full catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recommendedSkills.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You are enrolled in every available skill in the catalog!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isEnrolled={false}
                onEnroll={enrollSkill}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
