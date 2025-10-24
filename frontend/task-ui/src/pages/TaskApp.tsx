import React, { useState, useEffect } from 'react';
import type { ToastMessage } from '../types';
import { useTasks } from '../state/useTasks';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

const TaskApp: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    currentFilter,
    loading,
    error,
    setFilter,
    loadTasks,
    createTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const newToast: ToastMessage = {
      ...toast,
      id: Date.now().toString(),
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleCreateTask = async (taskData: { description: string }) => {
    try {
      await createTask(taskData);
      addToast({
        type: 'success',
        message: 'Task created successfully!',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to create task. Please try again.',
      });
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await toggleTask(id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        addToast({
          type: 'success',
          message: `Task marked as ${!task.isCompleted ? 'completed' : 'active'}!`,
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to update task. Please try again.',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      addToast({
        type: 'success',
        message: 'Task deleted successfully!',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to delete task. Please try again.',
      });
    }
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.isCompleted).length,
    completed: tasks.filter(t => t.isCompleted).length,
  };

  return (
    <div className="container-fluid px-3">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h2 className="card-title mb-0 text-center">Task Manager</h2>
            </div>
            <div className="card-body p-4">
              <TaskForm onSubmit={handleCreateTask} loading={loading} />
              
              {tasks.length > 0 && (
                <div className="mt-4">
                  <FilterBar
                    currentFilter={currentFilter}
                    onFilterChange={setFilter}
                    taskCounts={taskCounts}
                  />
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {loading && tasks.length === 0 ? (
                <div className="text-center py-5">
                  <Spinner size="lg" />
                  <p className="mt-3 text-muted">Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="mt-4">
                  <EmptyState filter={currentFilter} />
                </div>
              ) : (
                <div className="mt-4">
                  <TaskList
                    tasks={filteredTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskApp;
