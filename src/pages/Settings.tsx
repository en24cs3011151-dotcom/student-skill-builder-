import { LogOut, Moon, RotateCcw, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user, logout } = useAuth();
  const {
    learningData,
    theme,
    setTheme,
    updatePreferences,
    resetSampleData,
  } = useApp();
  const navigate = useNavigate();

  const [resetOpen, setResetOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const notifications = learningData.preferences.notifications;

  const handleToggleNotification = (
    key: keyof typeof notifications
  ) => {
    updatePreferences({
      notifications: {
        ...notifications,
        [key]: !notifications[key],
      },
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
          Settings
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Customize your workspace theme, study reminders, and local account preferences.
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Appearance
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose between light and dark dashboard surfaces.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30'
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-800 shadow-xs">
              <Sun className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Light Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clean white cards and slate canvas
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30'
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-100">
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Low-glare slate surfaces for night study
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Study Goal & Notifications */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Study Target & Notifications
        </h3>

        <div className="mt-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-slate-800">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Daily Study Target
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recommended daily minutes for maintaining your streak
            </p>
          </div>
          <select
            value={learningData.preferences.dailyGoalMinutes}
            onChange={(e) =>
              updatePreferences({ dailyGoalMinutes: Number(e.target.value) })
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value={20}>20 minutes / day</option>
            <option value={30}>30 minutes / day</option>
            <option value={45}>45 minutes / day</option>
            <option value={60}>60 minutes / day</option>
            <option value={90}>90 minutes / day</option>
          </select>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {[
            {
              key: 'dailyStudyReminders' as const,
              title: 'Daily Study Reminders',
              desc: 'Prompt to complete at least one lesson each day.',
            },
            {
              key: 'goalDeadlineAlerts' as const,
              title: 'Goal Deadline Alerts',
              desc: 'Highlight upcoming task and goal target dates.',
            },
            {
              key: 'achievementUnlocks' as const,
              title: 'Achievement Toast Alerts',
              desc: 'Show celebratory notifications when unlocking new badges.',
            },
            {
              key: 'weeklyProgressDigest' as const,
              title: 'Weekly Progress Summary',
              desc: 'Track weekly learning hour comparisons on your dashboard.',
            },
          ].map((item) => {
            const checked = notifications[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  onClick={() => handleToggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    checked
                      ? 'bg-blue-600'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account & Data Management */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Account & Local Data
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Signed in as <span className="font-medium text-slate-900 dark:text-slate-100">{user?.email}</span> using browser Local Storage persistence.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Sample Data
          </button>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="Reset workspace to initial sample data?"
        description="This will restore the default sample skills, tasks, goals, and XP for this account in Local Storage."
        confirmLabel="Reset Data"
        onConfirm={() => {
          resetSampleData();
          setResetOpen(false);
        }}
        onCancel={() => setResetOpen(false)}
      />

      <ConfirmDialog
        open={logoutOpen}
        title="Sign out of your account?"
        description="Your progress remains saved locally in this browser."
        confirmLabel="Sign Out"
        destructive={false}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
          navigate('/login');
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
}
