import {
  AchievementDefinition,
  UserLearningData,
  UserProfile,
} from '../types';

export const DEMO_USER: UserProfile = {
  id: 'demo-student-viraj',
  name: 'Viraj Jaiswal',
  email: 'viraj.jaiswal@medicaps.edu',
  passwordHash: 'demo1234',
  avatarUrl: '',
  joinedDate: '2026-08-18',
  bio: 'B.Tech Computer Science student at Medi-Caps University, Indore focusing on full-stack engineering, database systems, and practical UI design.',
  major: 'B.Tech Computer Science',
  university: 'Medi-Caps University, Indore',
  isDemo: true,
};

export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your very first lesson on any learning path.',
    xpBonus: 50,
    icon: 'footprints',
    milestoneLabel: '1 lesson completed',
  },
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Maintain an active 7-day learning streak.',
    xpBonus: 100,
    icon: 'flame',
    milestoneLabel: '7-day streak',
  },
  {
    id: 'skill-explorer',
    title: 'Skill Explorer',
    description: 'Enroll in at least 5 distinct skills to broaden your toolkit.',
    xpBonus: 75,
    icon: 'compass',
    milestoneLabel: '5 skills enrolled',
  },
  {
    id: 'goal-achiever',
    title: 'Goal Achiever',
    description: 'Complete your first personal learning goal on schedule.',
    xpBonus: 100,
    icon: 'target',
    milestoneLabel: '1 goal completed',
  },
  {
    id: 'knowledge-master',
    title: 'Knowledge Master',
    description: 'Finish every module and lesson in a complete learning path.',
    xpBonus: 200,
    icon: 'award',
    milestoneLabel: '1 full path completed',
  },
  {
    id: 'task-finisher',
    title: 'Task Finisher',
    description: 'Check off 5 study tasks in your Tasks & Goals workspace.',
    xpBonus: 75,
    icon: 'check-square',
    milestoneLabel: '5 tasks completed',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Accumulate 20 or more total hours of structured study.',
    xpBonus: 120,
    icon: 'clock',
    milestoneLabel: '20+ study hours',
  },
  {
    id: 'polymath',
    title: 'Cross-Disciplinary Learner',
    description: 'Enroll in skills spanning 3 or more distinct categories.',
    xpBonus: 90,
    icon: 'layers',
    milestoneLabel: '3+ categories explored',
  },
];

function getRecentDates(): { day: string; date: string }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { day: string; date: string }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({
      day: days[d.getDay()],
      date: d.toISOString().split('T')[0],
    });
  }
  return result;
}

export function createInitialDemoLearningData(): UserLearningData {
  const recentDates = getRecentDates();
  const minutePresets = [45, 60, 35, 80, 50, 75, 40];
  const lessonPresets = [1, 2, 1, 2, 1, 2, 1];

  return {
    xp: 865,
    streak: 7,
    lastActiveDate: recentDates[6].date,
    totalLearningMinutes: 1340, // ~22.3 hours
    enrolledSkillIds: [
      'web-development',
      'python',
      'sql',
      'html',
    ],
    recentlyAccessedSkillIds: [
      'web-development',
      'python',
      'sql',
      'html',
    ],
    completedLessonIds: [
      // Completed full HTML5 learning path (4/4) -> Knowledge Master unlocked
      'html-m1-l1',
      'html-m1-l2',
      'html-m2-l1',
      'html-m2-l2',
      // Web Development progress (6/15)
      'web-m1-l1',
      'web-m1-l2',
      'web-m1-l3',
      'web-m2-l1',
      'web-m2-l2',
      'web-m2-l3',
      // Python progress (3/8)
      'py-m1-l1',
      'py-m1-l2',
      'py-m2-l1',
      // SQL progress (2/4)
      'sql-m1-l1',
      'sql-m1-l2',
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Complete JavaScript Array Pipeline Lab',
        description: 'Finish all map/filter/reduce exercises in Module 3 of Web Development.',
        category: 'Web Development',
        priority: 'High',
        deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'task-2',
        title: 'Write 10 SQL JOIN Practice Queries',
        description: 'Practice INNER JOIN and GROUP BY aggregations on the university schema.',
        category: 'Database Management',
        priority: 'High',
        deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'task-3',
        title: 'Review Python Exception Handling Notes',
        description: 'Summarize try/except/finally patterns before Friday lab assessment.',
        category: 'Programming',
        priority: 'Medium',
        deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'task-4',
        title: 'Draft B.Tech Capstone Architecture Diagram',
        description: 'Outline component structure and Local Storage data flow.',
        category: 'Problem Solving',
        priority: 'Low',
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'task-5',
        title: 'Build Semantic HTML Portfolio Layout',
        description: 'Validate ARIA landmarks and keyboard tab order.',
        category: 'Web Development',
        priority: 'Medium',
        deadline: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        completed: true,
        xpAwarded: true,
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'task-6',
        title: 'Configure VS Code Prettier & TypeScript Linter',
        description: 'Set up formatting rules for React and TypeScript files.',
        category: 'Programming',
        priority: 'Low',
        deadline: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        completed: true,
        xpAwarded: true,
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
    ],
    goals: [
      {
        id: 'goal-1',
        title: 'Finish Full-Stack Web Development Roadmap',
        description: 'Complete all 6 modules including the React capstone project before semester finals.',
        category: 'Web Development',
        targetDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
        progress: 40,
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: 'goal-2',
        title: 'Master Relational SQL Joins & Indexing',
        description: 'Finish all SQL modules and design the University Library schema.',
        category: 'Database Management',
        targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        progress: 50,
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'goal-3',
        title: 'Build Python OOP & File Automation Fluency',
        description: 'Complete Python modules 1 through 4 with the CLI budget tracker.',
        category: 'Programming',
        targetDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        progress: 38,
        completed: false,
        xpAwarded: false,
        createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
      },
      {
        id: 'goal-4',
        title: 'Complete HTML5 & Accessibility Foundations',
        description: 'Earn full completion on semantic markup and accessible web forms.',
        category: 'Web Development',
        targetDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        progress: 100,
        completed: true,
        xpAwarded: true,
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
    ],
    unlockedAchievements: [
      { id: 'first-step', unlockedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
      { id: 'consistent-learner', unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: 'goal-achiever', unlockedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 'knowledge-master', unlockedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: 'deep-focus', unlockedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    ],
    weeklyActivity: recentDates.map((d, idx) => ({
      day: d.day,
      date: d.date,
      minutes: minutePresets[idx],
      lessonsCompleted: lessonPresets[idx],
    })),
    progressHistory: [
      { week: 'Week 1', xp: 140, hours: 3.5, completionRate: 18 },
      { week: 'Week 2', xp: 310, hours: 7.2, completionRate: 31 },
      { week: 'Week 3', xp: 520, hours: 12.8, completionRate: 44 },
      { week: 'Week 4', xp: 710, hours: 17.5, completionRate: 56 },
      { week: 'Week 5', xp: 865, hours: 22.3, completionRate: 64 },
    ],
    preferences: {
      theme: 'light',
      dailyGoalMinutes: 45,
      notifications: {
        dailyStudyReminders: true,
        goalDeadlineAlerts: true,
        achievementUnlocks: true,
        weeklyProgressDigest: false,
      },
    },
  };
}

export function createStarterUserLearningData(): UserLearningData {
  const recentDates = getRecentDates();
  return {
    xp: 0,
    streak: 1,
    lastActiveDate: recentDates[6].date,
    totalLearningMinutes: 0,
    enrolledSkillIds: ['web-development'],
    recentlyAccessedSkillIds: ['web-development'],
    completedLessonIds: [],
    tasks: [
      {
        id: `task-${Date.now()}`,
        title: 'Explore your first learning module',
        description: 'Open Web Development Module 1 and complete your first lesson to earn XP.',
        category: 'Web Development',
        priority: 'Medium',
        deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        completed: false,
        xpAwarded: false,
        createdAt: new Date().toISOString(),
      },
    ],
    goals: [
      {
        id: `goal-${Date.now()}`,
        title: 'Complete First Skill Module',
        description: 'Finish Module 1 of your first enrolled skill.',
        category: 'Web Development',
        targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        progress: 0,
        completed: false,
        xpAwarded: false,
        createdAt: new Date().toISOString(),
      },
    ],
    unlockedAchievements: [],
    weeklyActivity: recentDates.map((d) => ({
      day: d.day,
      date: d.date,
      minutes: 0,
      lessonsCompleted: 0,
    })),
    progressHistory: [
      { week: 'Week 1', xp: 0, hours: 0, completionRate: 0 },
    ],
    preferences: {
      theme: 'light',
      dailyGoalMinutes: 45,
      notifications: {
        dailyStudyReminders: true,
        goalDeadlineAlerts: true,
        achievementUnlocks: true,
        weeklyProgressDigest: true,
      },
    },
  };
}
