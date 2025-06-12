import { useEffect, useState } from 'react';
import { CloseIcon, ExclamationIcon } from './Icons';

export function ToastError({
  message,
  setErrorShowToast,
  animationTimeout,
  setAnimationTimeout,
}: {
  message: string;
  setErrorShowToast: React.Dispatch<React.SetStateAction<string | null>>;
  animationTimeout: NodeJS.Timeout | null;
  setAnimationTimeout: React.Dispatch<
    React.SetStateAction<NodeJS.Timeout | null>
  >;
}) {
  function handleClickCloseToast() {
    if (animationTimeout) clearTimeout(animationTimeout);
    setErrorShowToast(null);
  }
  return (
    <div className="fixed top-5 left-0 w-full px-5 lg:absolute lg:top-22 lg:right-5 lg:left-auto lg:w-auto lg:px-0">
      <div className="border-l-redLight flex w-full items-center justify-between gap-12 rounded-md border border-l-4 border-gray-100 bg-white px-3 py-2">
        <div className="flex items-center gap-4">
          <ExclamationIcon className="fill-redLight h-6 w-6" />
          <div className="flex flex-col gap-1">
            <span className="text-redLight font-medium">Error</span>
            <span className="text-secondary font-light">{message}</span>
          </div>
        </div>
        <button
          type="button"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-100"
          onClick={handleClickCloseToast}
        >
          <CloseIcon className="fill-secondary h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}
