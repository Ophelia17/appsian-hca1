import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

const API_BASE_URL = 'http://localhost:5187/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  async getTasks(status?: string): Promise<Task[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },

  async updateTask(id: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async clearTasks(): Promise<void> {
    await apiClient.post('/tasks/clear');
  },
};

export default apiClient;
