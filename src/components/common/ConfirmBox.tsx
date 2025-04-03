import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import { createPortal } from 'react-dom';
import { Modal } from '../ui/modal';

interface ConfirmationProps {
  okLabel?: string;
  cancelLabel?: string;
  title?: string;
  confirmation: string;
  show?: boolean;
  proceed?: (value: boolean) => void;
  enableEscape?: boolean;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  okLabel = 'OK',
  cancelLabel = 'Cancel',
  title = 'Confirmation',
  confirmation,
  show = true,
  proceed = () => {},
  enableEscape = true
}) => {
  if (!show) return null;

  return createPortal(
    <Modal isOpen={show} onClose={() => proceed(true)} showCloseButton={false}>
      <div className="fixed inset-0 flex items-center justify-center ">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{confirmation}</p>

          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => proceed(false)}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              {cancelLabel}
            </button>
            <button
              onClick={() => proceed(true)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
              {okLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export const confirm = (
  confirmation: string,
  proceedLabel = 'OK',
  cancelLabel = 'Cancel',
  options: Partial<Omit<ConfirmationProps, 'confirmation'>> = {}
) => {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    okLabel: proceedLabel,
    cancelLabel,
    ...options
  });
};
