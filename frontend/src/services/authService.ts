import { api } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  guest: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/guest');
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
};
