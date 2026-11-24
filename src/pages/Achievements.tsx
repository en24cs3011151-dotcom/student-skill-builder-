import { Award, Flame, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import { AchievementCard } from '../components/AchievementCard';
import { DashboardCard } from '../components/DashboardCard';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_CATALOG } from '../data/sampleUserData';
import { getCompletedSkillsCount, getLevelInfo } from '../utils/calculations';

export function Achievements() {
  const { learningData } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const levelInfo = getLevelInfo(learningData.xp);
  const completedSkills = getCompletedSkillsCount(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );

  const unlockedMap = new Map(
    learningData.unlockedAchievements.map((a) => [a.id, a.unlockedAt])
  );

  const filteredAchievements = ACHIEVEMENTS_CATALOG.filter((ach) => {
    const isUnlocked = unlockedMap.has(ach.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
          Achievements & Milestones
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Earn XP by completing lessons, tasks, and goals, and unlock milestone badges automatically.
        </p>
      </div>

      {/* Level Banner */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Current Rank
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Level {levelInfo.level} · {levelInfo.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {levelInfo.xpNeededForNext} XP needed to reach Level{' '}
              {levelInfo.level + 1}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-50">
              {learningData.xp.toLocaleString()} XP
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Next milestone: {levelInfo.nextLevelXp.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="mt-5">
          <ProgressBar
            value={levelInfo.progressPercent}
            label="Level Progress"
            showValue
            tone="violet"
          />
        </div>
      </section>

      {/* Summary Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Total XP"
          value={learningData.xp.toLocaleString()}
          helper="Earned from lessons & milestones"
          icon={<Sparkles className="h-5 w-5" />}
          accent="indigo"
        />
        <DashboardCard
          label="Learning Streak"
          value={`${learningData.streak} days`}
          helper="Consecutive active days"
          icon={<Flame className="h-5 w-5" />}
          accent="amber"
        />
        <DashboardCard
          label="Badges Unlocked"
          value={`${learningData.unlockedAchievements.length} / ${ACHIEVEMENTS_CATALOG.length}`}
          helper="Milestones achieved"
          icon={<Trophy className="h-5 w-5" />}
          accent="blue"
        />
        <DashboardCard
          label="Completed Skills"
          value={completedSkills}
          helper="Full roadmaps finished"
          icon={<Award className="h-5 w-5" />}
          accent="emerald"
        />
      </section>

      {/* Badges Grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            Badge Collection
          </h3>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['all', 'unlocked', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlockedAt={unlockedMap.get(achievement.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
