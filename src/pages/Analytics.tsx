import { Award, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ProgressTrendChart,
  WeeklyActivityChart,
} from '../components/Charts';
import { DashboardCard } from '../components/DashboardCard';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { SKILLS_CATALOG } from '../data/skillsData';
import {
  formatMinutesToHours,
  getCompletedSkillsCount,
  getOverallLearningProgress,
  getSkillProgress,
} from '../utils/calculations';

export function Analytics() {
  const { learningData } = useApp();

  const totalHoursLabel = formatMinutesToHours(
    learningData.totalLearningMinutes
  );
  const completedSkillsCount = getCompletedSkillsCount(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );
  const overallCourseCompletion = getOverallLearningProgress(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );

  const totalTasks = learningData.tasks.length;
  const completedTasks = learningData.tasks.filter((t) => t.completed).length;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const enrolledSkills = learningData.enrolledSkillIds
    .map((id) => SKILLS_CATALOG.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
          Analytics & Progress
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track study hours, roadmap completion, task consistency, and XP growth over time.
        </p>
      </div>

      {/* Top Analytics KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          label="Total Learning Hours"
          value={totalHoursLabel}
          helper={`${learningData.totalLearningMinutes.toLocaleString()} minutes logged`}
          icon={<Clock className="h-5 w-5" />}
          accent="blue"
        />
        <DashboardCard
          label="Skills Completed"
          value={completedSkillsCount}
          helper={`Out of ${learningData.enrolledSkillIds.length} enrolled`}
          icon={<Award className="h-5 w-5" />}
          accent="emerald"
        />
        <DashboardCard
          label="Course Completion"
          value={`${overallCourseCompletion}%`}
          helper="Across enrolled learning paths"
          icon={<TrendingUp className="h-5 w-5" />}
          accent="indigo"
        />
        <DashboardCard
          label="Task Completion Rate"
          value={`${taskCompletionRate}%`}
          helper={`${completedTasks} of ${totalTasks} tasks finished`}
          icon={<CheckSquare className="h-5 w-5" />}
          accent="amber"
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Weekly Learning Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily study minutes across the last 7 days
            </p>
          </div>
          <WeeklyActivityChart data={learningData.weeklyActivity} height={260} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              XP Growth Over Time
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cumulative experience points across study weeks
            </p>
          </div>
          <ProgressTrendChart data={learningData.progressHistory} height={260} />
        </div>
      </section>

      {/* Skill Breakdown Table */}
      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Enrolled Skill Progress Breakdown
          </h3>
        </div>

        {enrolledSkills.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No skills enrolled yet. Enroll in a skill from Explore Skills to view progress metrics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-6 py-3">Skill</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Lessons</th>
                  <th className="px-6 py-3 text-right">Modules</th>
                  <th className="px-6 py-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {enrolledSkills.map((skill) => {
                  const stats = getSkillProgress(
                    skill,
                    learningData.completedLessonIds
                  );
                  return (
                    <tr
                      key={skill.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                        <Link
                          to={`/skills/${skill.id}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {skill.name}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                        {skill.category}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-slate-700 tabular-nums dark:text-slate-300">
                        {stats.completedLessons}/{stats.totalLessons}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-slate-700 tabular-nums dark:text-slate-300">
                        {stats.completedModules}/{stats.totalModules}
                      </td>
                      <td className="w-48 px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProgressBar
                            value={stats.percentage}
                            size="sm"
                            tone={stats.isCompleted ? 'emerald' : 'blue'}
                          />
                          <span className="w-10 text-right font-mono text-xs font-medium text-slate-900 tabular-nums dark:text-slate-100">
                            {stats.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
