import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilter, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { TasksState, initialTasksState, filterTasks } from './tasks';
import { taskApi } from '../api/client';

export const useTasks = () => {
  const [state, setState] = useState<TasksState>(initialTasksState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        setState(prev => ({
          ...prev,
          tasks,
          filteredTasks: filterTasks(tasks, prev.currentFilter),
        }));
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  // Update filtered tasks when tasks or filter changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      filteredTasks: filterTasks(prev.tasks, prev.currentFilter),
    }));
  }, [state.tasks, state.currentFilter]);

  const setFilter = useCallback((filter: TaskFilter) => {
    setState(prev => ({
      ...prev,
      currentFilter: filter,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await taskApi.getTasks();
      setState(prev => ({
        ...prev,
        tasks,
        filteredTasks: filterTasks(tasks, prev.currentFilter),
      }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskApi.updateTask(id, taskData);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => task.id === id ? updatedTask : task),
      }));
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await taskApi.deleteTask(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const toggleTask = useCallback(async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { isCompleted: !task.isCompleted });
    }
  }, [state.tasks, updateTask]);

  return {
    ...state,
    setFilter,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};
