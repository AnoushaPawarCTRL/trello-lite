export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';


export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  projectName: string;
  assignedUsername: string | null;
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
  deadline?: string;
}
