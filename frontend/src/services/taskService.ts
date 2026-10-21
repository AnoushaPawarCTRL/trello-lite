import { api } from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types/task';

export const taskService = {
  getAllByProject: async (projectId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/project/${projectId}`);
    return response.data;
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    // The backend takes a Map<String, String>, so projectId has to go
    // over the wire as a string, not a JSON number.
    const response = await api.post<Task>('/tasks', {
      title: data.title,
      description: data.description,
      projectId: String(data.projectId),
      // Only send a deadline if one was picked; omitting it means "no deadline".
      ...(data.deadline ? { deadline: data.deadline } : {}),
    });
    return response.data;
  },

  updateStatus: async (taskId: number, status: TaskStatus): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  update: async (taskId: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
