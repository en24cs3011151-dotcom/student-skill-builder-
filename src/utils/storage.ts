import { UserLearningData, UserProfile } from '../types';
import {
  createInitialDemoLearningData,
  createStarterUserLearningData,
  DEMO_USER,
} from '../data/sampleUserData';

const KEYS = {
  USERS: 'ssb_users_v1',
  SESSION_USER_ID: 'ssb_session_user_id_v1',
  LOGGED_OUT: 'ssb_logged_out_v1',
  THEME: 'ssb_theme_v1',
  LEARNING_DATA_PREFIX: 'ssb_learning_v1_',
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getStoredUsers(): UserProfile[] {
  const rawUsers = safeParse<UserProfile[]>(localStorage.getItem(KEYS.USERS), []);
  const migratedUsers = rawUsers.map((u) =>
    u.id === 'demo-student-ananya' ? DEMO_USER : u
  );

  if (!migratedUsers.some((u) => u.id === DEMO_USER.id)) {
    const merged = [DEMO_USER, ...migratedUsers];
    localStorage.setItem(KEYS.USERS, JSON.stringify(merged));
    return merged;
  }

  if (rawUsers.some((u) => u.id === 'demo-student-ananya')) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(migratedUsers));
  }
  return migratedUsers;
}

export function saveStoredUsers(users: UserProfile[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getInitialSessionUserId(): string | null {
  const loggedOut = localStorage.getItem(KEYS.LOGGED_OUT) === 'true';
  if (loggedOut) return null;

  const storedSession = localStorage.getItem(KEYS.SESSION_USER_ID);
  if (storedSession) {
    const users = getStoredUsers();
    if (storedSession === 'demo-student-ananya') {
      const oldKey = `${KEYS.LEARNING_DATA_PREFIX}demo-student-ananya`;
      const newKey = `${KEYS.LEARNING_DATA_PREFIX}${DEMO_USER.id}`;
      const oldData = localStorage.getItem(oldKey);
      if (oldData && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldData);
      }
      localStorage.setItem(KEYS.SESSION_USER_ID, DEMO_USER.id);
      return DEMO_USER.id;
    }
    if (users.some((u) => u.id === storedSession)) {
      return storedSession;
    }
  }

  // First launch: automatically activate demo account so dashboard is populated immediately
  getStoredUsers();
  localStorage.setItem(KEYS.SESSION_USER_ID, DEMO_USER.id);
  return DEMO_USER.id;
}

export function setSessionUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(KEYS.SESSION_USER_ID, userId);
    localStorage.removeItem(KEYS.LOGGED_OUT);
  } else {
    localStorage.removeItem(KEYS.SESSION_USER_ID);
    localStorage.setItem(KEYS.LOGGED_OUT, 'true');
  }
}

export function getUserLearningData(userId: string): UserLearningData {
  const key = `${KEYS.LEARNING_DATA_PREFIX}${userId}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed = safeParse<UserLearningData | null>(raw, null);
    if (parsed) return parsed;
  }
  const initial =
    userId === DEMO_USER.id
      ? createInitialDemoLearningData()
      : createStarterUserLearningData();
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveUserLearningData(
  userId: string,
  data: UserLearningData
): void {
  const key = `${KEYS.LEARNING_DATA_PREFIX}${userId}`;
  localStorage.setItem(key, JSON.stringify(data));
}

export function resetDemoLearningData(userId: string): UserLearningData {
  const fresh =
    userId === DEMO_USER.id
      ? createInitialDemoLearningData()
      : createStarterUserLearningData();
  saveUserLearningData(userId, fresh);
  return fresh;
}

export function getStoredTheme(): 'light' | 'dark' {
  const val = localStorage.getItem(KEYS.THEME);
  return val === 'dark' ? 'dark' : 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(KEYS.THEME, theme);
}
