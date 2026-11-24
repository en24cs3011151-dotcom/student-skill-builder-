import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ACHIEVEMENTS_CATALOG, createStarterUserLearningData } from '../data/sampleUserData';
import { SKILLS_CATALOG } from '../data/skillsData';
import {
  LearningGoal,
  TaskItem,
  ToastMessage,
  UserLearningData,
  UserPreferences,
} from '../types';
import { evaluateAchievements } from '../utils/calculations';
import {
  getStoredTheme,
  getUserLearningData,
  resetDemoLearningData,
  saveStoredTheme,
  saveUserLearningData,
} from '../utils/storage';
import { useAuth } from './AuthContext';

interface AppContextValue {
  learningData: UserLearningData;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  notify: (toast: Omit<ToastMessage, 'id'>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  enrollSkill: (skillId: string) => void;
  unenrollSkill: (skillId: string) => void;
  recordSkillAccess: (skillId: string) => void;
  toggleLessonComplete: (skillId: string, lessonId: string) => void;
  addTask: (
    task: Omit<TaskItem, 'id' | 'completed' | 'xpAwarded' | 'createdAt'>
  ) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addGoal: (
    goal: Omit<LearningGoal, 'id' | 'completed' | 'xpAwarded' | 'createdAt'>
  ) => void;
  updateGoal: (goalId: string, updates: Partial<LearningGoal>) => void;
  deleteGoal: (goalId: string) => void;
  toggleGoalComplete: (goalId: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetSampleData: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [learningData, setLearningData] = useState<UserLearningData>(() =>
    user ? getUserLearningData(user.id) : createStarterUserLearningData()
  );
  const [theme, setThemeState] = useState<'light' | 'dark'>(() =>
    getStoredTheme()
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  // Sync learning data whenever logged-in user changes
  useEffect(() => {
    if (user) {
      const loaded = getUserLearningData(user.id);
      setLearningData(loaded);
      setThemeState(loaded.preferences.theme);
    }
  }, [user]);

  // Apply .dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  const commitData = useCallback(
    (updater: (prev: UserLearningData) => UserLearningData) => {
      setLearningData((prev) => {
        const nextDraft = updater(prev);
        const { newlyUnlockedIds, bonusXp } = evaluateAchievements(nextDraft);

        let finalData = nextDraft;
        if (newlyUnlockedIds.length > 0) {
          const nowIso = new Date().toISOString();
          finalData = {
            ...nextDraft,
            xp: nextDraft.xp + bonusXp,
            unlockedAchievements: [
              ...nextDraft.unlockedAchievements,
              ...newlyUnlockedIds.map((id) => ({ id, unlockedAt: nowIso })),
            ],
          };

          newlyUnlockedIds.forEach((achId) => {
            const def = ACHIEVEMENTS_CATALOG.find((a) => a.id === achId);
            if (def && nextDraft.preferences.notifications.achievementUnlocks) {
              notify({
                title: `Achievement Unlocked: ${def.title}`,
                description: `+${def.xpBonus} XP earned · ${def.description}`,
                variant: 'success',
              });
            }
          });
        }

        if (user) {
          saveUserLearningData(user.id, finalData);
        }
        return finalData;
      });
    },
    [user, notify]
  );

  const setTheme = useCallback(
    (nextTheme: 'light' | 'dark') => {
      setThemeState(nextTheme);
      commitData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, theme: nextTheme },
      }));
    },
    [commitData]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const enrollSkill = useCallback(
    (skillId: string) => {
      const skill = SKILLS_CATALOG.find((s) => s.id === skillId);
      commitData((prev) => {
        if (prev.enrolledSkillIds.includes(skillId)) return prev;
        return {
          ...prev,
          enrolledSkillIds: [skillId, ...prev.enrolledSkillIds],
          recentlyAccessedSkillIds: [
            skillId,
            ...prev.recentlyAccessedSkillIds.filter((id) => id !== skillId),
          ].slice(0, 6),
        };
      });
      if (skill) {
        notify({
          title: `Enrolled in ${skill.name}`,
          description: 'Added to My Learning. Start Module 1 whenever ready.',
          variant: 'success',
        });
      }
    },
    [commitData, notify]
  );

  const unenrollSkill = useCallback(
    (skillId: string) => {
      const skill = SKILLS_CATALOG.find((s) => s.id === skillId);
      commitData((prev) => ({
        ...prev,
        enrolledSkillIds: prev.enrolledSkillIds.filter((id) => id !== skillId),
        recentlyAccessedSkillIds: prev.recentlyAccessedSkillIds.filter(
          (id) => id !== skillId
        ),
      }));
      if (skill) {
        notify({
          title: `Removed ${skill.name}`,
          description: 'Removed from your active learning list.',
          variant: 'info',
        });
      }
    },
    [commitData, notify]
  );

  const recordSkillAccess = useCallback(
    (skillId: string) => {
      commitData((prev) => ({
        ...prev,
        recentlyAccessedSkillIds: [
          skillId,
          ...prev.recentlyAccessedSkillIds.filter((id) => id !== skillId),
        ].slice(0, 6),
      }));
    },
    [commitData]
  );

  const toggleLessonComplete = useCallback(
    (skillId: string, lessonId: string) => {
      const skill = SKILLS_CATALOG.find((s) => s.id === skillId);
      const lesson = skill?.modules
        .flatMap((m) => m.lessons)
        .find((l) => l.id === lessonId);

      if (!skill || !lesson) return;

      let wasCompleted = false;
      commitData((prev) => {
        const exists = prev.completedLessonIds.includes(lessonId);
        wasCompleted = exists;
        const todayStr = new Date().toISOString().split('T')[0];

        const updatedEnrolled = prev.enrolledSkillIds.includes(skillId)
          ? prev.enrolledSkillIds
          : [skillId, ...prev.enrolledSkillIds];

        if (exists) {
          return {
            ...prev,
            enrolledSkillIds: updatedEnrolled,
            completedLessonIds: prev.completedLessonIds.filter(
              (id) => id !== lessonId
            ),
            xp: Math.max(0, prev.xp - lesson.xpReward),
            totalLearningMinutes: Math.max(
              0,
              prev.totalLearningMinutes - lesson.durationMinutes
            ),
          };
        }

        // Update today's weekly activity entry
        const updatedWeekly = prev.weeklyActivity.map((entry, idx) => {
          if (idx === prev.weeklyActivity.length - 1 || entry.date === todayStr) {
            return {
              ...entry,
              minutes: entry.minutes + lesson.durationMinutes,
              lessonsCompleted: entry.lessonsCompleted + 1,
            };
          }
          return entry;
        });

        const updatedHistory = prev.progressHistory.map((h, idx) =>
          idx === prev.progressHistory.length - 1
            ? {
                ...h,
                xp: prev.xp + lesson.xpReward,
                hours: Number(
                  ((prev.totalLearningMinutes + lesson.durationMinutes) / 60).toFixed(1)
                ),
              }
            : h
        );

        const isNewDay = prev.lastActiveDate !== todayStr;
        return {
          ...prev,
          enrolledSkillIds: updatedEnrolled,
          completedLessonIds: [...prev.completedLessonIds, lessonId],
          xp: prev.xp + lesson.xpReward,
          streak: isNewDay ? prev.streak + 1 : Math.max(1, prev.streak),
          lastActiveDate: todayStr,
          totalLearningMinutes:
            prev.totalLearningMinutes + lesson.durationMinutes,
          weeklyActivity: updatedWeekly,
          progressHistory: updatedHistory,
          recentlyAccessedSkillIds: [
            skillId,
            ...prev.recentlyAccessedSkillIds.filter((id) => id !== skillId),
          ].slice(0, 6),
        };
      });

      notify({
        title: wasCompleted
          ? `Unmarked "${lesson.title}"`
          : `Lesson Completed (+${lesson.xpReward} XP)`,
        description: wasCompleted
          ? 'Lesson progress updated.'
          : `${lesson.durationMinutes} min added to your study log.`,
        variant: wasCompleted ? 'info' : 'success',
      });
    },
    [commitData, notify]
  );

  const addTask = useCallback(
    (task: Omit<TaskItem, 'id' | 'completed' | 'xpAwarded' | 'createdAt'>) => {
      const newTask: TaskItem = {
        ...task,
        id: `task-${Date.now()}`,
        completed: false,
        xpAwarded: false,
        createdAt: new Date().toISOString(),
      };
      commitData((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
      notify({
        title: 'Task created',
        description: newTask.title,
        variant: 'success',
      });
    },
    [commitData, notify]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<TaskItem>) => {
      commitData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      }));
      notify({ title: 'Task updated', variant: 'info' });
    },
    [commitData, notify]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      commitData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      }));
      notify({ title: 'Task deleted', variant: 'info' });
    },
    [commitData, notify]
  );

  const toggleTaskComplete = useCallback(
    (taskId: string) => {
      let awarded = false;
      commitData((prev) => ({
        ...prev,
        xp: prev.tasks.reduce((xpAcc, t) => {
          if (t.id === taskId && !t.completed && !t.xpAwarded) {
            awarded = true;
            return xpAcc + 25;
          }
          return xpAcc;
        }, prev.xp),
        tasks: prev.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            xpAwarded: t.xpAwarded || nextCompleted,
          };
        }),
      }));
      if (awarded) {
        notify({
          title: 'Task completed (+25 XP)',
          description: 'Great momentum — keep checking off your study plan.',
          variant: 'success',
        });
      }
    },
    [commitData, notify]
  );

  const addGoal = useCallback(
    (
      goal: Omit<LearningGoal, 'id' | 'completed' | 'xpAwarded' | 'createdAt'>
    ) => {
      const clampedProgress = Math.max(0, Math.min(100, goal.progress));
      const isDone = clampedProgress >= 100;
      const newGoal: LearningGoal = {
        ...goal,
        id: `goal-${Date.now()}`,
        progress: clampedProgress,
        completed: isDone,
        xpAwarded: isDone,
        createdAt: new Date().toISOString(),
      };
      commitData((prev) => ({
        ...prev,
        xp: isDone ? prev.xp + 100 : prev.xp,
        goals: [newGoal, ...prev.goals],
      }));
      notify({
        title: isDone ? 'Goal completed (+100 XP)' : 'Learning goal added',
        description: newGoal.title,
        variant: 'success',
      });
    },
    [commitData, notify]
  );

  const updateGoal = useCallback(
    (goalId: string, updates: Partial<LearningGoal>) => {
      let awardedNow = false;
      commitData((prev) => {
        let nextXp = prev.xp;
        const updatedGoals = prev.goals.map((g) => {
          if (g.id !== goalId) return g;
          const merged = { ...g, ...updates };
          const progress = Math.max(0, Math.min(100, merged.progress));
          const completed =
            updates.completed !== undefined
              ? updates.completed
              : progress >= 100;
          const finalProgress = completed ? 100 : progress;
          if (completed && !g.xpAwarded) {
            nextXp += 100;
            awardedNow = true;
          }
          return {
            ...merged,
            progress: finalProgress,
            completed,
            xpAwarded: g.xpAwarded || completed,
          };
        });
        return { ...prev, xp: nextXp, goals: updatedGoals };
      });
      if (awardedNow) {
        notify({
          title: 'Goal achieved (+100 XP)',
          description: 'Bonus XP awarded for reaching 100%.',
          variant: 'success',
        });
      }
    },
    [commitData, notify]
  );

  const deleteGoal = useCallback(
    (goalId: string) => {
      commitData((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== goalId),
      }));
      notify({ title: 'Goal removed', variant: 'info' });
    },
    [commitData, notify]
  );

  const toggleGoalComplete = useCallback(
    (goalId: string) => {
      const target = learningData.goals.find((g) => g.id === goalId);
      if (!target) return;
      updateGoal(goalId, {
        completed: !target.completed,
        progress: !target.completed ? 100 : Math.min(target.progress, 75),
      });
    },
    [learningData.goals, updateGoal]
  );

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      if (updates.theme) {
        setThemeState(updates.theme);
      }
      commitData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...updates,
          notifications: {
            ...prev.preferences.notifications,
            ...(updates.notifications ?? {}),
          },
        },
      }));
      notify({ title: 'Preferences saved', variant: 'success' });
    },
    [commitData, notify]
  );

  const resetSampleData = useCallback(() => {
    if (!user) return;
    const fresh = resetDemoLearningData(user.id);
    setLearningData(fresh);
    setThemeState(fresh.preferences.theme);
    notify({
      title: 'Workspace reset',
      description: 'Restored initial sample data in Local Storage.',
      variant: 'info',
    });
  }, [user, notify]);

  return (
    <AppContext.Provider
      value={{
        learningData,
        theme,
        toasts,
        dismissToast,
        notify,
        toggleTheme,
        setTheme,
        enrollSkill,
        unenrollSkill,
        recordSkillAccess,
        toggleLessonComplete,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalComplete,
        updatePreferences,
        resetSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
