import {
  Calendar,
  Check,
  Pencil,
  Plus,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProgressBar } from '../components/ProgressBar';
import { TaskCard } from '../components/TaskCard';
import { useApp } from '../context/AppContext';
import { SKILL_CATEGORIES } from '../data/skillsData';
import { LearningGoal, TaskItem, TaskPriority } from '../types';

const TASK_CATEGORIES = [...SKILL_CATEGORIES, 'Academic & General'];

export function TasksGoals() {
  const {
    learningData,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalComplete,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  // Task filters & modal state
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState<string>('Web Development');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskDeadline, setTaskDeadline] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [taskError, setTaskError] = useState('');

  // Goal modal state
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<LearningGoal | null>(null);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState<string>('Web Development');
  const [goalTargetDate, setGoalTargetDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [goalProgress, setGoalProgress] = useState(0);
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new-task') {
      openNewTaskModal();
      setSearchParams({}, { replace: true });
    } else if (action === 'new-goal') {
      openNewGoalModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const filteredTasks = useMemo(() => {
    return learningData.tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !task.completed) ||
        (statusFilter === 'completed' && task.completed);
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [learningData.tasks, statusFilter, priorityFilter]);

  function openNewTaskModal() {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskCategory('Web Development');
    setTaskPriority('Medium');
    setTaskDeadline(
      new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
    );
    setTaskError('');
    setTaskModalOpen(true);
  }

  function openEditTaskModal(task: TaskItem) {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setTaskError('');
    setTaskModalOpen(true);
  }

  function handleSaveTask(e: React.FormEvent) {
    e.preventDefault();
    if (taskTitle.trim().length < 2) {
      setTaskError('Please enter a task title.');
      return;
    }
    if (!taskDeadline) {
      setTaskError('Please select a deadline.');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline,
      });
    } else {
      addTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline,
      });
    }
    setTaskModalOpen(false);
  }

  function openNewGoalModal() {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalDesc('');
    setGoalCategory('Web Development');
    setGoalTargetDate(
      new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    );
    setGoalProgress(0);
    setGoalError('');
    setGoalModalOpen(true);
  }

  function openEditGoalModal(goal: LearningGoal) {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDesc(goal.description);
    setGoalCategory(goal.category);
    setGoalTargetDate(goal.targetDate);
    setGoalProgress(goal.progress);
    setGoalError('');
    setGoalModalOpen(true);
  }

  function handleSaveGoal(e: React.FormEvent) {
    e.preventDefault();
    if (goalTitle.trim().length < 2) {
      setGoalError('Please enter a learning goal title.');
      return;
    }
    if (!goalTargetDate) {
      setGoalError('Please choose a target completion date.');
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: goalTitle.trim(),
        description: goalDesc.trim(),
        category: goalCategory,
        targetDate: goalTargetDate,
        progress: goalProgress,
      });
    } else {
      addGoal({
        title: goalTitle.trim(),
        description: goalDesc.trim(),
        category: goalCategory,
        targetDate: goalTargetDate,
        progress: goalProgress,
      });
    }
    setGoalModalOpen(false);
  }

  const completedTasksCount = learningData.tasks.filter((t) => t.completed).length;
  const completedGoalsCount = learningData.goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-10">
      {/* Tasks Section */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              Study Tasks
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Organize assignments, practice labs, and deadlines ({completedTasksCount} of{' '}
              {learningData.tasks.length} completed).
            </p>
          </div>
          <button
            type="button"
            onClick={openNewTaskModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {/* Task Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['all', 'pending', 'completed'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="priority-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Priority:
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as TaskPriority | 'All')
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No tasks match your current filters.
            </p>
            <button
              type="button"
              onClick={openNewTaskModal}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Create a Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTaskComplete}
                onEdit={openEditTaskModal}
                onDelete={(t) => setTaskToDelete(t)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Learning Goals Section */}
      <section className="space-y-4 border-t border-slate-200 pt-8 dark:border-slate-800">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              Learning Goals
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Set semester milestones, update progress, and earn +100 XP when completed ({completedGoalsCount} of{' '}
              {learningData.goals.length} achieved).
            </p>
          </div>
          <button
            type="button"
            onClick={openNewGoalModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <Target className="h-4 w-4" />
            Add Learning Goal
          </button>
        </div>

        {learningData.goals.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No learning goals created yet.
            </p>
            <button
              type="button"
              onClick={openNewGoalModal}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Set Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {learningData.goals.map((goal) => (
              <div
                key={goal.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {goal.category}
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                        {goal.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditGoalModal(goal)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label={`Edit goal ${goal.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoalToDelete(goal)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        aria-label={`Delete goal ${goal.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {goal.description}
                    </p>
                  )}

                  <div className="mt-4">
                    <ProgressBar
                      value={goal.progress}
                      label="Goal Progress"
                      showValue
                      tone={goal.completed ? 'emerald' : 'violet'}
                    />
                    <div className="mt-2.5 flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={goal.progress}
                        aria-label={`Update progress for ${goal.title}`}
                        onChange={(e) =>
                          updateGoal(goal.id, {
                            progress: Number(e.target.value),
                            completed: Number(e.target.value) >= 100,
                          })
                        }
                        className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    Target: {goal.targetDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleGoalComplete(goal.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      goal.completed
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {goal.completed ? 'Achieved' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Task Add/Edit Modal */}
      {taskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingTask ? 'Edit Task' : 'Create Study Task'}
              </h3>
              <button
                type="button"
                onClick={() => setTaskModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close task form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {taskError && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {taskError}
              </div>
            )}

            <form onSubmit={handleSaveTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Complete React Hooks Lab"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Optional details or resources"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TASK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) =>
                      setTaskPriority(e.target.value as TaskPriority)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Add/Edit Modal */}
      {goalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingGoal ? 'Edit Learning Goal' : 'Create Learning Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setGoalModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close goal form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {goalError && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {goalError}
              </div>
            )}

            <form onSubmit={handleSaveGoal} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Build Full-Stack React Portfolio"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  placeholder="Target outcome or milestone criteria"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {TASK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>Initial / Current Progress</span>
                  <span className="font-mono tabular-nums">{goalProgress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={goalProgress}
                  onChange={(e) => setGoalProgress(Number(e.target.value))}
                  className="mt-2 h-1.5 w-full cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        description={`"${taskToDelete?.title}" will be permanently removed from your task list.`}
        confirmLabel="Delete Task"
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />

      <ConfirmDialog
        open={Boolean(goalToDelete)}
        title="Delete this learning goal?"
        description={`"${goalToDelete?.title}" will be permanently removed from your goals list.`}
        confirmLabel="Delete Goal"
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
}
