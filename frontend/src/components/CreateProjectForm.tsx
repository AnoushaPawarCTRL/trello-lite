import { useState } from 'react';
import type { FormEvent } from 'react';
import { projectService } from '../services/projectService';
import type { Project } from '../types/project';

export function CreateProjectForm({ onCreated }: { onCreated: (project: Project) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const project = await projectService.create({ name, description });
      onCreated(project);
      setName('');
      setDescription('');
    } catch (err: any) {
      const data = err.response?.data;
      const message =
        typeof data === 'string' ? data : data?.message || 'Could not create the project. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>
      )}

      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}
