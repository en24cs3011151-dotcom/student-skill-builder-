import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SkillCard } from '../components/SkillCard';
import { useApp } from '../context/AppContext';
import { SKILL_CATEGORIES, SKILLS_CATALOG } from '../data/skillsData';
import { DifficultyLevel, SkillCategory } from '../types';
import { getSkillProgress } from '../utils/calculations';

type SortOption = 'recommended' | 'duration-asc' | 'duration-desc' | 'name-asc';

export function ExploreSkills() {
  const { learningData, enrollSkill } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = SKILLS_CATALOG.filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'All' || skill.difficulty === selectedDifficulty;
      const matchesQuery =
        query.length === 0 ||
        skill.name.toLowerCase().includes(query) ||
        skill.shortDescription.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query);

      return matchesCategory && matchesDifficulty && matchesQuery;
    });

    if (sortBy === 'duration-asc') {
      return [...list].sort((a, b) => a.estimatedHours - b.estimatedHours);
    }
    if (sortBy === 'duration-desc') {
      return [...list].sort((a, b) => b.estimatedHours - a.estimatedHours);
    }
    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('recommended');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
            Explore Skills
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Discover structured technical and communication roadmaps across 8 engineering domains.
          </p>
        </div>
        <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
          Showing {filteredSkills.length} of {SKILLS_CATALOG.length} skills
        </p>
      </div>

      {/* Search & Controls */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python, React, SQL, Machine Learning..."
              aria-label="Search skills"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-9 pl-10 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value as DifficultyLevel | 'All')
              }
              aria-label="Filter by difficulty"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <div className="relative flex items-center">
              <SlidersHorizontal className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort skills"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="duration-asc">Duration: Shortest first</option>
                <option value="duration-desc">Duration: Longest first</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {SKILL_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredSkills.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            No matching skills found
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Try clearing your search query or selecting a broader category.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map((skill) => {
            const isEnrolled = learningData.enrolledSkillIds.includes(skill.id);
            const stats = getSkillProgress(
              skill,
              learningData.completedLessonIds
            );
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                isEnrolled={isEnrolled}
                progressPercentage={stats.percentage}
                isCompleted={stats.isCompleted}
                onEnroll={enrollSkill}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
