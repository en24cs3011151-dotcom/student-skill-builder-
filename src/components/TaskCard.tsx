import { Calendar, Check, Pencil, Trash2 } from 'lucide-react';
import { TaskItem } from '../types';

interface TaskCardProps {
  task: TaskItem;
  onToggle: (taskId: string) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priorityTone =
    task.priority === 'High'
      ? 'text-red-600 dark:text-red-400'
      : task.priority === 'Medium'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-500 dark:text-slate-400';

  const isOverdue =
    !task.completed &&
    task.deadline &&
    new Date(task.deadline) < new Date(new Date().toISOString().split('T')[0]);

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex min-w-0 items-start gap-3.5">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={
            task.completed ? `Mark "${task.title}" pending` : `Mark "${task.title}" completed`
          }
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            task.completed
              ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
              : 'border-slate-300 bg-white hover:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-400'
          }`}
        >
          {task.completed && <Check className="h-3.5 w-3.5" />}
        </button>

        <div className="min-w-0">
          <h4
            className={`text-sm font-medium ${
              task.completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{task.category}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-medium ${priorityTone}`}>
              {task.priority} priority
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                isOverdue ? 'text-red-600 dark:text-red-400' : ''
              }`}
            >
              <Calendar className="h-3 w-3" />
              {task.deadline}
              {isOverdue ? ' (Overdue)' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={`Edit ${task.title}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
