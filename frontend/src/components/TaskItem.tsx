import { useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task, TaskStatus } from '../types/task';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TO_DO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

function formatDeadline(deadline: string): string {
  // deadline is a plain "yyyy-MM-dd" string — parse it as local, not UTC,
  // so it doesn't shift a day depending on the browser's timezone.
  const [year, month, day] = deadline.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isOverdue(deadline: string): boolean {
  const [year, month, day] = deadline.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function TaskItem({
  task,
  onUpdated,
  onDeleted,
}: {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: number) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDeadline, setEditDeadline] = useState(task.deadline ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setError(null);
    setIsUpdating(true);
    try {
      const updated = await taskService.updateStatus(task.id, newStatus);
      onUpdated(updated);
    } catch {
      setError('Could not update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;

    setError(null);
    setIsDeleting(true);
    try {
      await taskService.delete(task.id);
      onDeleted(task.id);
    } catch {
      setError('Could not delete task.');
      setIsDeleting(false);
    }
  };

  const handleEditStart = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDeadline(task.deadline ?? '');
    setError(null);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const updated = await taskService.update(task.id, {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline,
      });
      onUpdated(updated);
      setIsEditing(false);
    } catch {
      setError('Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        {error && <p className="text-xs text-red-600">{error}</p>}

        <div>
          <label htmlFor={`edit-title-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id={`edit-title-${task.id}`}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor={`edit-description-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id={`edit-description-${task.id}`}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor={`edit-deadline-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <input
            id={`edit-deadline-${task.id}`}
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleEditSave}
            disabled={isSaving}
            className="py-1.5 px-3 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleEditCancel}
            disabled={isSaving}
            className="py-1.5 px-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{task.title}</p>
        {task.description && <p className="text-sm text-gray-600 mt-0.5">{task.description}</p>}
        {task.assignedUsername && (
          <p className="text-xs text-gray-400 mt-1">Assigned to {task.assignedUsername}</p>
        )}
        {task.deadline && (
          <p
            className={`text-xs mt-1 ${
              task.status !== 'DONE' && isOverdue(task.deadline) ? 'text-red-600 font-medium' : 'text-gray-400'
            }`}
          >
            {task.status !== 'DONE' && isOverdue(task.deadline) ? 'Overdue: ' : 'Due '}
            {formatDeadline(task.deadline)}
          </p>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          disabled={isUpdating || isDeleting}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
        >
          {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleEditStart}
          disabled={isDeleting}
          aria-label={`Edit ${task.title}`}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 px-1"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${task.title}`}
          className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 px-1"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
