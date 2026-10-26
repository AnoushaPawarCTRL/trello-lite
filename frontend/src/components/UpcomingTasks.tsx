import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';
import { formatDeadline, isOverdue } from '../utils/dates';

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    taskService
      .getUpcoming()
      .then(setTasks)
      .catch(() => setError('Could not load upcoming tasks.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;

  return (
    <section className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-base font-semibold mb-3">Due soon</h3>

      {error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing due this week. You're all caught up 🎉</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const overdue = task.deadline !== null && isOverdue(task.deadline);
            return (
              <li key={task.id}>
                <Link
                  to={`/projects/${task.projectId}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 -mx-2"
                >
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.projectName}</p>
                  </div>
                  {task.deadline && (
                    <span
                      className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-amber-600'}`}
                    >
                      {overdue ? 'Overdue · ' : 'Due '}
                      {formatDeadline(task.deadline)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}