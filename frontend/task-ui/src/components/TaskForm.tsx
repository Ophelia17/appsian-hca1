import React, { useState } from 'react';
import { CreateTaskRequest } from '../types';

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => Promise<void>;
  loading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, loading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      await onSubmit({ description: description.trim() });
      setDescription('');
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !description.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </div>
      {description.length > 250 && (
        <small className="text-muted">
          {description.length}/300 characters
        </small>
      )}
    </form>
  );
};

export default TaskForm;
