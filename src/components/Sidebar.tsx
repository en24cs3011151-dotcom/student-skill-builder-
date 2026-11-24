import {
  Award,
  BarChart2,
  BookOpen,
  CheckSquare,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getLevelInfo } from '../utils/calculations';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/explore', label: 'Explore Skills', icon: Compass, end: false },
  { to: '/my-learning', label: 'My Learning', icon: BookOpen, end: false },
  { to: '/tasks-goals', label: 'Tasks & Goals', icon: CheckSquare, end: false },
  { to: '/achievements', label: 'Achievements', icon: Award, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChart2, end: false },
  { to: '/profile', label: 'Profile', icon: User, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function Sidebar({
  mobileOpen,
  onClose,
  onRequestLogout,
}: SidebarProps) {
  const { user } = useAuth();
  const { learningData } = useApp();
  const levelInfo = getLevelInfo(learningData.xp);

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 whitespace-nowrap"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">
              Student Skill Builder
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        {user && (
          <div className="mb-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Level {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="font-mono text-blue-600 tabular-nums dark:text-blue-400">
                {learningData.xp} XP
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onRequestLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 lg:block dark:border-slate-800">
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative z-50 h-full w-72 max-w-[82vw] border-r border-slate-200 shadow-xl dark:border-slate-800">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
