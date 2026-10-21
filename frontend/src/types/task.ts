export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

// Matches TaskResponse on the backend (used by every /api/tasks response
// after the TaskController fix, and by the tasks array nested in ProjectResponse).
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  assignedUsername: string | null;
  // "yyyy-MM-dd" from the backend's LocalDate, or null if no deadline
  deadline: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: number;
  deadline?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  // empty string clears the deadline
  deadline?: string;
}
