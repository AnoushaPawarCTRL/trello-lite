import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

export function ProjectCard({ project }: { project: Project }) {
  const taskCount = project.tasks.length;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <h3 className="text-base font-semibold">{project.name}</h3>
      {project.description && (
        <p className="mt-1 text-sm text-gray-600">{project.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
        <span>Owner: {project.ownerUsername}</span>
      </div>
    </Link>
  );
}
