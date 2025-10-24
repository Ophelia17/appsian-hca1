import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'spinner-border-sm';
      case 'lg':
        return 'spinner-border-lg';
      default:
        return '';
    }
  };

  return (
    <div className={`spinner-border ${getSizeClass()} ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
