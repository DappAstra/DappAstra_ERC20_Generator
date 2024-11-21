type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

type ToastCallback = (type: ToastType, message: string, options?: ToastOptions) => void;

let toastCallback: ToastCallback | null = null;

export const initializeToast = (callback: ToastCallback) => {
  toastCallback = callback;
};

export const toast = (type: ToastType, message: string, options?: ToastOptions) => {
  if (toastCallback) {
    toastCallback(type, message, options);
  } else {
    console.warn('Toast manager not initialized');
  }
};