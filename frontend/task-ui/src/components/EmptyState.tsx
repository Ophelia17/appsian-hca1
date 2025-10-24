import React from 'react';

interface EmptyStateProps {
  filter: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const getMessage = () => {
    switch (filter) {
      case 'active':
        return {
          icon: '⏳',
          title: 'No active tasks',
          message: 'All your tasks are completed! Great job!',
        };
      case 'completed':
        return {
          icon: '✅',
          title: 'No completed tasks',
          message: 'Complete some tasks to see them here.',
        };
      default:
        return {
          icon: '📝',
          title: 'No tasks yet',
          message: 'Add your first task above to get started!',
        };
    }
  };

  const { icon, title, message } = getMessage();

  return (
    <div className="text-center py-5">
      <div className="text-muted">
        <div className="fs-1 mb-3">{icon}</div>
        <h4 className="mb-2">{title}</h4>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;
