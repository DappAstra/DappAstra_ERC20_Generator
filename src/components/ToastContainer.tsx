import React, { useState, useEffect } from 'react';
import Toast, { ToastType } from './Toast';
import { initializeToast } from '../utils/toastManager';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let toastId = 0;

  useEffect(() => {
    initializeToast((type, message) => {
      const id = toastId++;
      setToasts(prev => [...prev, { id, type, message }]);
    });
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}