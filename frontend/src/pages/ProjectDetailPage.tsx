import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import type { Project } from '../types/project';
import type { Task } from '../types/task';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskItem } from '../components/TaskItem';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    let cancelled = false;

    Promise.all([projectService.getById(projectId), taskService.getAllByProject(projectId)])
      .then(([projectData, taskData]) => {
        if (cancelled) return;
        setProject(projectData);
        setTasks(taskData);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this project.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskUpdated = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    const confirmed = window.confirm(
    `Delete "${project.name}" and all its tasks? This can't be undone.`
  );
  if (!confirmed) return;

  try {
    await projectService.delete(project.id);
    navigate('/dashboard');
  } catch {
    alert("Couldn't delete the project. Please try again.");
  }
  };

  const startEditing = () => {
    if (!project) return;
    setEditName(project.name);
    setEditDescription(project.description ?? '');
    setIsEditing(true);
  };

  const handleSaveProject = async () => {
    if (!project || !editName.trim()) return;
    try {
      const updated = await projectService.update(project.id, {
        name: editName.trim(),
        description: editDescription,
      });
      setProject(updated);
      setIsEditing(false);
    } catch {
      alert("Couldn't rename the project. Please try again.");
    }
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
          &larr; Back to projects
        </Link>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : error ? (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>
        ) : project ? (
          <>
            <div className="flex items-start justify-between gap-4">
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xl font-semibold"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Description (optional)"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveProject} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-sm text-gray-600 hover:underline">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-semibold">{project.name}</h1>
                  {project.description && <p className="text-gray-600 mt-1">{project.description}</p>}
                </div>
              )}

              {!isEditing && (
                <div className="flex gap-3">
                  <button onClick={startEditing} className="text-sm text-blue-600 hover:underline">
                    Rename
                  </button>
                  <button onClick={handleDeleteProject} className="text-sm text-red-600 hover:underline">
                    Delete project
                  </button>
                </div>
              )}
            </div>
            
            <CreateTaskForm projectId={projectId} onCreated={handleTaskCreated} />
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet. Add one above.</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdated={handleTaskUpdated}
                    onDeleted={handleTaskDeleted}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
