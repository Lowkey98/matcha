import { type ReactNode, useEffect, useState } from 'react';
import { ToastContext } from '../context/ToastContext';
import { useToast } from '../hooks/useToast';

import type { Toast, ToastWithId } from '../context/ToastContext';
import { CheckIcon, CloseIcon, ExclamationIcon } from './Icons';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  function addToast(newToast: Toast) {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...newToast, id: crypto.randomUUID() },
    ]);
  }

  function removeToast(id: string) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col gap-2 md:bottom-5">
      {toasts.map((toast) => (
        <ToastBox key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

export function ToastBox({
  toast,
  removeToast,
}: {
  toast: ToastWithId;
  removeToast: (id: string) => void;
}) {
  useEffect(() => {
    const toastTimeoutMs = toast.delay || 5000;
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toastTimeoutMs);

    return () => clearTimeout(timer);
  }, []);

  const textColor: string =
    toast.status === 'success' ? 'text-green-500' : 'text-red-500';

  function handleClickToastClose() {
    removeToast(toast.id);
  }

  return (
    <div
      className={`rounded-md border border-l-4 border-gray-200 ${toast.status === 'success' ? 'border-l-green-500' : 'border-l-red-500'} bg-white p-[.8rem] shadow-md transition`}
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full p-1">
          {toast.status === 'error' ? (
            <ExclamationIcon className="h-6 w-6 fill-red-500" />
          ) : (
            <CheckIcon className="h-8 w-8 fill-green-500" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 text-sm leading-none font-semibold capitalize">
            <span className={textColor}>{toast.status}</span>
            {toast.errorCode && (
              <span className="text-sm font-medium text-neutral-600">
                Code: <strong className="underline">{toast.errorCode}</strong>
              </span>
            )}
          </div>
          <p className="mt-4 max-w-full text-sm leading-1.5 text-neutral-500">
            {toast.message}
          </p>
        </div>
        <button
          onClick={handleClickToastClose}
          className="ms-3 ml-7 cursor-pointer rounded-full bg-red-50 p-1.5 transition-colors hover:bg-red-100"
          type="button"
        >
          <CloseIcon className="h-2.5 w-2.5 fill-red-400" />
        </button>
      </div>
    </div>
  );
}
