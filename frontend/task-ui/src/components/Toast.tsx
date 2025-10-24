import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className={`toast show ${getToastClass()}`} role="alert">
      <div className="toast-body d-flex justify-content-between align-items-center">
        <span>{toast.message}</span>
        <button
          type="button"
          className="btn-close btn-close-white ms-2"
          onClick={() => onRemove(toast.id)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Toast;
