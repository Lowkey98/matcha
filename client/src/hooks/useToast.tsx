import { ToastContext } from '../context/ToastContext';
import type { ToastContextType } from '../context/ToastContext';

import { useContext } from 'react';

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
