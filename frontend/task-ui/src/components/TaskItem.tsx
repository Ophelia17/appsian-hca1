import React, { useState } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, loading }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    try {
      await onToggle(task.id);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        await onDelete(task.id);
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`list-group-item d-flex justify-content-between align-items-center ${task.isCompleted ? 'text-muted' : ''}`}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={task.isCompleted}
          onChange={handleToggle}
          disabled={loading}
        />
        <label className={`form-check-label ${task.isCompleted ? 'text-decoration-line-through' : ''}`}>
          {task.description}
        </label>
      </div>
      <div>
        <span className={`badge ${task.isCompleted ? 'bg-success' : 'bg-warning'} me-2`}>
          {task.isCompleted ? 'Completed' : 'Active'}
        </span>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleDelete}
          disabled={loading || isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
