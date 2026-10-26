import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/projectService';
import type { Project } from '../types/project';
import { CreateProjectForm } from '../components/CreateProjectForm';
import { ProjectCard } from '../components/ProjectCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { UpcomingTasks } from '../components/UpcomingTasks';
import { Modal } from '../components/Modal';

export function DashboardPage() {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const isNewUser = location.state?.isNewUser;
  const greeting = isNewUser
    ? `Welcome, ${user?.username}`
    : `Welcome back, ${user?.username}`;

  useEffect(() => {
    let cancelled = false;

    projectService
      .getAll()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your projects. Please refresh the page.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });


    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreated = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Trello Lite</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">Signed in as {user.username}</span>}
          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">{greeting}</h2>

        <UpcomingTasks />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your projects</h3>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span className="text-lg leading-none">+</span>
              Create new project
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>
          )}

          {isLoading ? (
            <p className="text-gray-500">Loading your projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">You don't have any projects yet. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {showCreate && (
          <Modal title="New project" onClose={() => setShowCreate(false)}>
            <CreateProjectForm onCreated={handleCreated} />
          </Modal>
        )}
      </main>
    </div>
  );
}
