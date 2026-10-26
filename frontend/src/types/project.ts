import type { Task } from './task';

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

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}


