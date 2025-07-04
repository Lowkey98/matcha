import { createContext } from 'react';

export type Toast =
  | {
      status: 'error';
      message: string;
      errorCode?: number;
      delay?: number;
    }
  | {
      status: 'success';
      message: string;
      errorCode?: number;
      delay?: number;
    };

export type ToastWithId = Toast & { id: string };

export type ToastContextType = {
  toasts: ToastWithId[];
  addToast: (newToast: Toast) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);
