import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, loading }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <i className="bi bi-inbox fs-1"></i>
          <p className="mt-3">No tasks found</p>
          <small>Add a task above to get started!</small>
        </div>
      </div>
    );
  }

  return (
    <div className="list-group">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default TaskList;
