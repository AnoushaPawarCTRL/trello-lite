import { useState } from 'react';
import type { FormEvent } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';

export function CreateTaskForm({
  projectId,
  onCreated,
}: {
  projectId: number;
  onCreated: (task: Task) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const task = await taskService.create({ title, description, projectId, deadline });
      onCreated(task);
      setTitle('');
      setDescription('');
      setDeadline('');
    } catch (err: any) {
      const data = err.response?.data;
      const message =
        typeof data === 'string' ? data : data?.message || 'Could not add the task. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow space-y-3">
      <h2 className="text-base font-semibold">Add a task</h2>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>
      )}

      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-1">
          Deadline (optional)
        </label>
        <input
          id="task-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
