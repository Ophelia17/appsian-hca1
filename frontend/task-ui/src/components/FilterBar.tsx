import React from 'react';
import { TaskFilter } from '../types';

interface FilterBarProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters: { key: TaskFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="btn-group mb-3" role="group" aria-label="Task filters">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          type="button"
          className={`btn ${currentFilter === key ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onFilterChange(key)}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
