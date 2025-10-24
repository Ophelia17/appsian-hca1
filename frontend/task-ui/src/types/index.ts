export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface CreateTaskRequest {
  description: string;
}

export interface UpdateTaskRequest {
  description?: string;
  isCompleted?: boolean;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
