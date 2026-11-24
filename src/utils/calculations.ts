import { ACHIEVEMENTS_CATALOG } from '../data/sampleUserData';
import { SKILLS_CATALOG } from '../data/skillsData';
import { Skill, UserLearningData } from '../types';

export interface SkillProgressStats {
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  percentage: number;
  isCompleted: boolean;
}

export function getSkillProgress(
  skill: Skill,
  completedLessonIds: string[]
): SkillProgressStats {
  const completedSet = new Set(completedLessonIds);
  let totalLessons = 0;
  let completedLessons = 0;
  let completedModules = 0;

  for (const mod of skill.modules) {
    const modLessons = mod.lessons.length;
    totalLessons += modLessons;
    const modDone = mod.lessons.filter((l) => completedSet.has(l.id)).length;
    completedLessons += modDone;
    if (modLessons > 0 && modDone === modLessons) {
      completedModules += 1;
    }
  }

  const percentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    completedLessons,
    totalLessons,
    completedModules,
    totalModules: skill.modules.length,
    percentage,
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
  };
}

export function getCompletedSkillsCount(
  enrolledSkillIds: string[],
  completedLessonIds: string[]
): number {
  return enrolledSkillIds.filter((id) => {
    const skill = SKILLS_CATALOG.find((s) => s.id === id);
    if (!skill) return false;
    return getSkillProgress(skill, completedLessonIds).isCompleted;
  }).length;
}

export function getOverallLearningProgress(
  enrolledSkillIds: string[],
  completedLessonIds: string[]
): number {
  if (enrolledSkillIds.length === 0) return 0;
  const percentages = enrolledSkillIds.map((id) => {
    const skill = SKILLS_CATALOG.find((s) => s.id === id);
    if (!skill) return 0;
    return getSkillProgress(skill, completedLessonIds).percentage;
  });
  const sum = percentages.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / enrolledSkillIds.length);
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXpInLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
  nextLevelXp: number;
}

const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, title: 'Curious Explorer' },
  { level: 2, minXp: 250, title: 'Skill Builder' },
  { level: 3, minXp: 600, title: 'Focused Practitioner' },
  { level: 4, minXp: 1100, title: 'Technical Specialist' },
  { level: 5, minXp: 1750, title: 'Systems Architect' },
  { level: 6, minXp: 2500, title: 'Master Scholar' },
];

export function getLevelInfo(xp: number): LevelInfo {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] ?? {
        level: current.level + 1,
        minXp: current.minXp + 1000,
        title: 'Master Scholar',
      };
    }
  }

  const span = next.minXp - current.minXp;
  const inLevel = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((inLevel / span) * 100));

  return {
    level: current.level,
    title: current.title,
    currentXpInLevel: inLevel,
    xpNeededForNext: Math.max(0, next.minXp - xp),
    progressPercent,
    nextLevelXp: next.minXp,
  };
}

export function evaluateAchievements(data: UserLearningData): {
  newlyUnlockedIds: string[];
  bonusXp: number;
} {
  const alreadyUnlocked = new Set(data.unlockedAchievements.map((a) => a.id));
  const completedSkillsCount = getCompletedSkillsCount(
    data.enrolledSkillIds,
    data.completedLessonIds
  );
  const completedTasksCount = data.tasks.filter((t) => t.completed).length;
  const completedGoalsCount = data.goals.filter((g) => g.completed).length;
  const enrolledCategories = new Set(
    data.enrolledSkillIds
      .map((id) => SKILLS_CATALOG.find((s) => s.id === id)?.category)
      .filter(Boolean)
  );

  const checks: Record<string, boolean> = {
    'first-step': data.completedLessonIds.length >= 1,
    'consistent-learner': data.streak >= 7,
    'skill-explorer': data.enrolledSkillIds.length >= 5,
    'goal-achiever': completedGoalsCount >= 1,
    'knowledge-master': completedSkillsCount >= 1,
    'task-finisher': completedTasksCount >= 5,
    'deep-focus': data.totalLearningMinutes >= 1200,
    polymath: enrolledCategories.size >= 3,
  };

  const newlyUnlockedIds: string[] = [];
  let bonusXp = 0;

  for (const def of ACHIEVEMENTS_CATALOG) {
    if (!alreadyUnlocked.has(def.id) && checks[def.id]) {
      newlyUnlockedIds.push(def.id);
      bonusXp += def.xpBonus;
    }
  }

  return { newlyUnlockedIds, bonusXp };
}

export function formatMinutesToHours(minutes: number): string {
  const hrs = minutes / 60;
  return `${hrs.toFixed(1)}h`;
}
