import { Calendar, Check, Mail, Pencil, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SKILLS_CATALOG } from '../data/skillsData';
import {
  getCompletedSkillsCount,
  getLevelInfo,
  getSkillProgress,
} from '../utils/calculations';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { learningData, notify } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [major, setMajor] = useState(user?.major ?? '');
  const [university, setUniversity] = useState(user?.university ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [error, setError] = useState('');

  if (!user) return null;

  const levelInfo = getLevelInfo(learningData.xp);
  const completedCount = getCompletedSkillsCount(
    learningData.enrolledSkillIds,
    learningData.completedLessonIds
  );

  const enrolledSkills = learningData.enrolledSkillIds
    .map((id) => SKILLS_CATALOG.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const completedPaths = enrolledSkills.filter(
    (s) => getSkillProgress(s, learningData.completedLessonIds).isCompleted
  );

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const startEditing = () => {
    setName(user.name);
    setEmail(user.email);
    setMajor(user.major);
    setUniversity(user.university);
    setBio(user.bio);
    setError('');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      major: major.trim(),
      university: university.trim(),
      bio: bio.trim(),
    });
    setIsEditing(false);
    notify({
      title: 'Profile updated',
      description: 'Your student profile details were saved.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              aria-label={`${user.name} initials`}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-display text-2xl font-bold tracking-tight text-white shadow-xs"
            >
              {initials || 'VJ'}
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                {user.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.major}
                <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
                {user.university}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {user.joinedDate}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 font-mono font-medium text-indigo-600 tabular-nums dark:text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  {learningData.xp.toLocaleString()} XP (Level {levelInfo.level})
                </span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
            {user.bio}
          </p>
        ) : (
          <form
            onSubmit={handleSave}
            className="mt-6 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800"
          >
            {error && (
              <div className="rounded-lg bg-red-50 px-3.5 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Major / Program
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  University / College
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Enrolled & Completed Learning Paths */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Skills Being Learned ({enrolledSkills.length})
          </h3>
          {enrolledSkills.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No active enrollments yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {enrolledSkills.map((skill) => {
                const stats = getSkillProgress(
                  skill,
                  learningData.completedLessonIds
                );
                return (
                  <div key={skill.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <Link
                        to={`/skills/${skill.id}`}
                        className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                      >
                        {skill.name}
                      </Link>
                      <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        {stats.percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      value={stats.percentage}
                      size="sm"
                      tone={stats.isCompleted ? 'emerald' : 'blue'}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Completed Learning Paths ({completedCount})
          </h3>
          {completedPaths.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Complete all lessons in an enrolled skill to earn your first completion record.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {completedPaths.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <Link
                      to={`/skills/${skill.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                    >
                      {skill.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {skill.category} · {skill.estimatedHours}h roadmap
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    100% Complete
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
