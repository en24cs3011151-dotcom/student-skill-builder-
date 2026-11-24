import { Menu, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SKILLS_CATALOG } from '../data/skillsData';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const ROUTE_TITLES: Record<string, { section: string; title: string }> = {
  '/': { section: 'Overview', title: 'Dashboard' },
  '/explore': { section: 'Catalog', title: 'Explore Skills' },
  '/my-learning': { section: 'Workspace', title: 'My Learning' },
  '/tasks-goals': { section: 'Planner', title: 'Tasks & Goals' },
  '/achievements': { section: 'Milestones', title: 'Achievements' },
  '/analytics': { section: 'Insights', title: 'Analytics & Progress' },
  '/profile': { section: 'Account', title: 'Student Profile' },
  '/settings': { section: 'Preferences', title: 'Settings' },
};

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useApp();

  let headerMeta = ROUTE_TITLES[pathname];
  if (!headerMeta && pathname.startsWith('/skills/')) {
    const skillId = pathname.replace('/skills/', '');
    const found = SKILLS_CATALOG.find((s) => s.id === skillId);
    headerMeta = {
      section: 'Skill Roadmap',
      title: found ? found.name : 'Skill Details',
    };
  }
  if (!headerMeta) {
    headerMeta = { section: 'Workspace', title: 'Student Skill Builder' };
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'VJ';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="hidden text-slate-400 sm:inline dark:text-slate-500">
            {headerMeta.section}
          </span>
          <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
            /
          </span>
          <h1 className="truncate font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            {headerMeta.title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
          title={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pr-3 pl-1.5 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-700 sm:inline dark:text-slate-200">
              {user.name}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
