export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Data Science'
  | 'Artificial Intelligence'
  | 'Database Management'
  | 'Communication Skills'
  | 'Problem Solving'
  | 'Design and Creativity';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LessonType = 'Reading' | 'Practice' | 'Project';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  xpReward: number;
  type: LessonType;
  summary: string;
}

export interface SkillModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type SkillIconKey =
  | 'code'
  | 'globe'
  | 'database'
  | 'brain'
  | 'bar-chart'
  | 'palette'
  | 'message'
  | 'cpu'
  | 'layers'
  | 'terminal'
  | 'sparkles'
  | 'layout'
  | 'git-branch';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  shortDescription: string;
  overview: string;
  icon: SkillIconKey;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: SkillModule[];
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  deadline: string;
  completed: boolean;
  xpAwarded: boolean;
  createdAt: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  completed: boolean;
  xpAwarded: boolean;
  createdAt: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
  icon: 'footprints' | 'flame' | 'compass' | 'target' | 'award' | 'check-square' | 'clock' | 'layers';
  milestoneLabel: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface WeeklyActivityEntry {
  day: string;
  date: string;
  minutes: number;
  lessonsCompleted: number;
}

export interface ProgressHistoryEntry {
  week: string;
  xp: number;
  hours: number;
  completionRate: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  joinedDate: string;
  bio: string;
  major: string;
  university: string;
  isDemo?: boolean;
}

export interface NotificationPreferences {
  dailyStudyReminders: boolean;
  goalDeadlineAlerts: boolean;
  achievementUnlocks: boolean;
  weeklyProgressDigest: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  dailyGoalMinutes: number;
  notifications: NotificationPreferences;
}

export interface UserLearningData {
  xp: number;
  streak: number;
  lastActiveDate: string;
  totalLearningMinutes: number;
  enrolledSkillIds: string[];
  recentlyAccessedSkillIds: string[];
  completedLessonIds: string[];
  tasks: TaskItem[];
  goals: LearningGoal[];
  unlockedAchievements: UnlockedAchievement[];
  weeklyActivity: WeeklyActivityEntry[];
  progressHistory: ProgressHistoryEntry[];
  preferences: UserPreferences;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
}
