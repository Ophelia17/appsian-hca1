import { Task, TaskFilter } from '../types';

export interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  currentFilter: TaskFilter;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  tasks: [],
  filteredTasks: [],
  currentFilter: 'all',
  loading: false,
  error: null,
};

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.isCompleted);
    case 'completed':
      return tasks.filter(task => task.isCompleted);
    case 'all':
    default:
      return tasks;
  }
};
