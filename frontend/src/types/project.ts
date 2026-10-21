import type { Task } from './task';

// Matches ProjectResponse on the backend.
export interface Project {
  id: number;
  name: string;
  description: string;
  ownerUsername: string;
  tasks: Task[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

// The backend does not implement PUT/DELETE for projects yet
// (ProjectController only has POST /, GET /, GET /{id}), so these
// are here for when that lands but aren't wired up to any UI yet.
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}
